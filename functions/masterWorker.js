import { createClient } from 'npm:@base44/sdk@0.5.0';

console.log("Keevio worker script starting up...");

// --- Utility Functions ---

// Base44 client with service role for backend operations
const base44 = createClient(Deno.env.get("BASE44_SERVICE_KEY"));

async function updateEventStatus(eventId, status, reelUrl = null) {
    try {
        const payload = { reel_status: status };
        if (reelUrl) {
            payload.highlight_reel_url = reelUrl;
        }
        await base44.entities.Event.update(eventId, payload);
        console.log(`Updated event ${eventId} status to ${status}`);
    } catch (error) {
        console.error(`Failed to update event ${eventId} status:`, error.message);
    }
}

async function downloadFile(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to download file: ${response.statusText}`);
        const tempPath = `/tmp/${crypto.randomUUID()}`;
        const fileData = await response.arrayBuffer();
        await Deno.writeFile(tempPath, new Uint8Array(fileData));
        return tempPath;
    } catch (error) {
        console.error(`Error downloading file from ${url}:`, error.message);
        throw error;
    }
}

// --- Job Handlers ---

async function handleHealthCheck(req) {
    // Security check
    if (req.headers.get('X-Worker-Auth') !== Deno.env.get("RAILWAY_WORKER_SECRET")) {
        return new Response("Unauthorized", { status: 401 });
    }
    try {
        const command = new Deno.Command("ffmpeg", { args: ["-version"] });
        const { code, stderr } = await command.output();
        const errorOutput = new TextDecoder().decode(stderr);
        if (code !== 0) {
           return new Response(JSON.stringify({ status: 'unhealthy', ffmpeg: 'not_found', error: errorOutput }), { status: 500 });
        }
        return new Response(JSON.stringify({ status: 'healthy', ffmpeg: 'available' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ status: 'unhealthy', error: error.message }), { status: 500 });
    }
}

async function handleAnalyzeJob(req) {
    const { file_url, media_id } = await req.json();
    console.log(`[Analyze Job] Received for media_id: ${media_id}`);

    const tempPath = await downloadFile(file_url);
    
    const ffprobeCmd = new Deno.Command("ffprobe", {
        args: [ "-v", "error", "-show_format", "-show_streams", "-print_format", "json", tempPath ],
    });
    const { stdout: ffprobeOut, stderr: ffprobeErr } = await ffprobeCmd.output();
    const ffprobeErrStr = new TextDecoder().decode(ffprobeErr);
    if (ffprobeErrStr) console.error(`FFprobe stderr for ${media_id}:`, ffprobeErrStr);
    
    const metadata = JSON.parse(new TextDecoder().decode(ffprobeOut));
    
    const videoStream = metadata.streams?.find(s => s.codec_type === 'video');
    const duration = parseFloat(metadata.format?.duration || videoStream?.duration || 0);
    const thumbnailPath = `/tmp/${media_id}-thumb.jpg`;

    const thumbCmd = new Deno.Command("ffmpeg", {
        args: ["-i", tempPath, "-ss", (duration / 2).toFixed(2), "-vframes", "1", "-f", "image2", thumbnailPath],
    });
    await thumbCmd.output();

    const thumbFile = await Deno.readFile(thumbnailPath);
    const { file_url: thumbnail_url } = await base44.files.upload(thumbFile, `${media_id}-thumb.jpg`, 'image/jpeg');

    await base44.entities.Media.update(media_id, {
        duration: duration,
        thumbnail_url: thumbnail_url,
        ai_score: Math.floor(Math.random() * 31) + 70, // Placeholder score
        ai_tags: ["wedding", "guest", "celebration"], // Placeholder tags
        ai_description: "A moment captured from the special day."
    });

    await Deno.remove(tempPath).catch(e => console.error(`Failed to remove temp file ${tempPath}:`, e.message));
    await Deno.remove(thumbnailPath).catch(e => console.error(`Failed to remove thumbnail ${thumbnailPath}:`, e.message));

    return new Response(JSON.stringify({ success: true, message: `Analyzed media ${media_id}` }), { status: 200 });
}

async function handleRenderJob(req) {
    const { event_id, media_urls } = await req.json();
    console.log(`[Render Job] Received for event_id: ${event_id}`);
    
    (async () => {
        try {
            const filePaths = await Promise.all(media_urls.map(downloadFile));
            const fileListPath = `/tmp/filelist-${event_id}.txt`;
            const fileListContent = filePaths.map(p => `file '${p.replace(/'/g, "'\\''")}'`).join('\n');
            await Deno.writeTextFile(fileListPath, fileListContent);

            const outputPath = `/tmp/${event_id}-reel.mp4`;
            
            const ffmpeg = new Deno.Command("ffmpeg", {
                args: [ "-y", "-f", "concat", "-safe", "0", "-i", fileListPath, "-c", "copy", outputPath ],
            });
            const { code, stderr } = await ffmpeg.output();
            if (code !== 0) throw new Error(`FFmpeg error: ${new TextDecoder().decode(stderr)}`);

            const reelFile = await Deno.readFile(outputPath);
            const { file_url: reel_url } = await base44.files.upload(reelFile, `${event_id}-reel.mp4`, 'video/mp4');

            await updateEventStatus(event_id, 'completed', reel_url);
            
            await Promise.all(filePaths.map(p => Deno.remove(p)));
            await Deno.remove(fileListPath);
            await Deno.remove(outputPath);
        } catch (error) {
            console.error(`[Render Job Failed] for event ${event_id}:`, error);
            await updateEventStatus(event_id, 'failed');
        }
    })();

    return new Response(JSON.stringify({ success: true, message: `Render job for ${event_id} started.` }), { status: 202 });
}


// --- Main Server Logic ---

Deno.serve({ port: parseInt(Deno.env.get("PORT") || "8000") }, async (req) => {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    console.log(`[${new Date().toISOString()}] Received: ${method} ${path}`);
    
    // Health check does its own auth verification inside the handler
    if (path === '/health' && method === 'GET') {
        return await handleHealthCheck(req);
    }
    
    // Security check for all other routes
    if (req.headers.get('X-Worker-Auth') !== Deno.env.get("RAILWAY_WORKER_SECRET")) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        if (path === '/jobs/analyze' && method === 'POST') {
            return await handleAnalyzeJob(req);
        }
        if (path === '/jobs/render' && method === 'POST') {
            return await handleRenderJob(req);
        }

        return new Response(JSON.stringify({ error: "Not Found" }), { status: 404 });

    } catch (error) {
        console.error(`Error processing ${method} ${path}:`, error);
        return new Response(JSON.stringify({ message: "Internal server error", details: error.message }), { status: 500 });
    }
});
