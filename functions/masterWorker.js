{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 Menlo-Regular;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue255;\red255\green255\blue254;\red0\green0\blue0;
\red144\green1\blue18;\red15\green112\blue1;\red14\green110\blue109;\red19\green118\blue70;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c100000;\cssrgb\c100000\c100000\c99608;\cssrgb\c0\c0\c0;
\cssrgb\c63922\c8235\c8235;\cssrgb\c0\c50196\c0;\cssrgb\c0\c50196\c50196;\cssrgb\c3529\c52549\c34510;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs28 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 import\cf0 \strokec4  \{ createClient, createClientFromRequest \} \cf2 \strokec2 from\cf0 \strokec4  \cf5 \strokec5 'npm:@base44/sdk@0.5.0'\cf0 \strokec4 ;\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4 console.log(\cf5 \strokec5 "Keevio worker script starting up..."\cf0 \strokec4 );\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf6 \cb3 \strokec6 // --- Utility Functions ---\cf0 \cb1 \strokec4 \
\
\cf6 \cb3 \strokec6 // Base44 client with service role for backend operations\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 const\cf0 \strokec4  base44 = createClient(\cf7 \strokec7 Deno\cf0 \strokec4 .env.\cf2 \strokec2 get\cf0 \strokec4 (\cf5 \strokec5 "BASE44_SERVICE_KEY"\cf0 \strokec4 ));\cb1 \strokec4 \
\
\cf2 \cb3 \strokec2 async\cf0 \strokec4  \cf2 \strokec2 function\cf0 \strokec4  updateEventStatus(eventId, status, reelUrl = \cf2 \strokec2 null\cf0 \strokec4 ) \{\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4     \cf2 \strokec2 try\cf0 \strokec4  \{\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 await\cf0 \strokec4  base44.entities.\cf7 \strokec7 Event\cf0 \strokec4 .update(eventId, \{\cb1 \strokec4 \
\cb3 \strokec4             reel_status: status,\cb1 \strokec4 \
\cb3 \strokec4             ...(reelUrl && \{ highlight_reel_url: reelUrl \}),\cb1 \strokec4 \
\cb3 \strokec4         \});\cb1 \strokec4 \
\cb3 \strokec4         console.log(\cf5 \strokec5 `Updated event \cf0 \strokec4 $\{eventId\}\cf5 \strokec5  status to \cf0 \strokec4 $\{status\}\cf5 \strokec5 `\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4     \} \cf2 \strokec2 catch\cf0 \strokec4  (error) \{\cb1 \strokec4 \
\cb3 \strokec4         console.error(\cf5 \strokec5 `Failed to update event \cf0 \strokec4 $\{eventId\}\cf5 \strokec5  status:`\cf0 \strokec4 , error);\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\cb3 \strokec4 \}\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 async\cf0 \strokec4  \cf2 \strokec2 function\cf0 \strokec4  downloadFile(url) \{\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  response = \cf2 \strokec2 await\cf0 \strokec4  fetch(url);\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 if\cf0 \strokec4  (!response.ok) \cf2 \strokec2 throw\cf0 \strokec4  \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Error\cf0 \strokec4 (\cf5 \strokec5 `Failed to download file: \cf0 \strokec4 $\{response.statusText\}\cf5 \strokec5 `\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  tempPath = \cf5 \strokec5 `/tmp/\cf0 \strokec4 $\{crypto.randomUUID()\}\cf5 \strokec5 `\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 await\cf0 \strokec4  \cf7 \strokec7 Deno\cf0 \strokec4 .writeFile(tempPath, response.body);\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 return\cf0 \strokec4  tempPath;\cb1 \strokec4 \
\cb3 \strokec4 \}\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf6 \cb3 \strokec6 // --- Job Handlers ---\cf0 \cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 async\cf0 \strokec4  \cf2 \strokec2 function\cf0 \strokec4  handleHealthCheck() \{\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4     \cf2 \strokec2 try\cf0 \strokec4  \{\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 const\cf0 \strokec4  command = \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Deno\cf0 \strokec4 .\cf7 \strokec7 Command\cf0 \strokec4 (\cf5 \strokec5 "ffmpeg"\cf0 \strokec4 , \{ args: [\cf5 \strokec5 "-version"\cf0 \strokec4 ] \});\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 const\cf0 \strokec4  \{ code \} = \cf2 \strokec2 await\cf0 \strokec4  command.output();\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 return\cf0 \strokec4  \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Response\cf0 \strokec4 (\cf7 \strokec7 JSON\cf0 \strokec4 .stringify(\{ status: \cf5 \strokec5 'healthy'\cf0 \strokec4 , ffmpeg: code === \cf8 \strokec8 0\cf0 \strokec4  ? \cf5 \strokec5 'available'\cf0 \strokec4  : \cf5 \strokec5 'not_available'\cf0 \strokec4  \}), \{ status: \cf8 \strokec8 200\cf0 \strokec4  \});\cb1 \strokec4 \
\cb3 \strokec4     \} \cf2 \strokec2 catch\cf0 \strokec4  (error) \{\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 return\cf0 \strokec4  \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Response\cf0 \strokec4 (\cf7 \strokec7 JSON\cf0 \strokec4 .stringify(\{ status: \cf5 \strokec5 'unhealthy'\cf0 \strokec4 , error: error.message \}), \{ status: \cf8 \strokec8 500\cf0 \strokec4  \});\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\cb3 \strokec4 \}\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 async\cf0 \strokec4  \cf2 \strokec2 function\cf0 \strokec4  handleAnalyzeJob(req) \{\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  \{ file_url, media_id \} = \cf2 \strokec2 await\cf0 \strokec4  req.json();\cb1 \strokec4 \
\cb3 \strokec4     console.log(\cf5 \strokec5 `[Analyze Job] Received for media_id: \cf0 \strokec4 $\{media_id\}\cf5 \strokec5 `\cf0 \strokec4 );\cb1 \strokec4 \
\
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  tempPath = \cf2 \strokec2 await\cf0 \strokec4  downloadFile(file_url);\cb1 \strokec4 \
\cb3 \strokec4     \cb1 \strokec4 \
\cb3 \strokec4     \cf6 \strokec6 // Use ffprobe to get media metadata\cf0 \cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  ffprobe = \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Deno\cf0 \strokec4 .\cf7 \strokec7 Command\cf0 \strokec4 (\cf5 \strokec5 "ffprobe"\cf0 \strokec4 , \{\cb1 \strokec4 \
\cb3 \strokec4         args: [\cb1 \strokec4 \
\cb3 \strokec4             \cf5 \strokec5 "-v"\cf0 \strokec4 , \cf5 \strokec5 "error"\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4             \cf5 \strokec5 "-show_format"\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4             \cf5 \strokec5 "-show_streams"\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4             \cf5 \strokec5 "-print_format"\cf0 \strokec4 , \cf5 \strokec5 "json"\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4             tempPath,\cb1 \strokec4 \
\cb3 \strokec4         ],\cb1 \strokec4 \
\cb3 \strokec4     \});\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  \{ stdout \} = \cf2 \strokec2 await\cf0 \strokec4  ffprobe.output();\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  metadata = \cf7 \strokec7 JSON\cf0 \strokec4 .parse(\cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 TextDecoder\cf0 \strokec4 ().decode(stdout));\cb1 \strokec4 \
\cb3 \strokec4     \cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  videoStream = metadata.streams?.find(s => s.codec_type === \cf5 \strokec5 'video'\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  duration = parseFloat(metadata.format?.duration || videoStream?.duration || \cf8 \strokec8 0\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  thumbnailPath = \cf5 \strokec5 `/tmp/\cf0 \strokec4 $\{media_id\}\cf5 \strokec5 -thumb.jpg`\cf0 \strokec4 ;\cb1 \strokec4 \
\
\cb3 \strokec4     \cf6 \strokec6 // Generate a thumbnail from the middle of the video\cf0 \cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  thumbCmd = \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Deno\cf0 \strokec4 .\cf7 \strokec7 Command\cf0 \strokec4 (\cf5 \strokec5 "ffmpeg"\cf0 \strokec4 , \{\cb1 \strokec4 \
\cb3 \strokec4         args: [\cf5 \strokec5 "-i"\cf0 \strokec4 , tempPath, \cf5 \strokec5 "-ss"\cf0 \strokec4 , (duration / \cf8 \strokec8 2\cf0 \strokec4 ).toFixed(\cf8 \strokec8 2\cf0 \strokec4 ), \cf5 \strokec5 "-vframes"\cf0 \strokec4 , \cf5 \strokec5 "1"\cf0 \strokec4 , \cf5 \strokec5 "-f"\cf0 \strokec4 , \cf5 \strokec5 "image2"\cf0 \strokec4 , thumbnailPath],\cb1 \strokec4 \
\cb3 \strokec4     \});\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 await\cf0 \strokec4  thumbCmd.output();\cb1 \strokec4 \
\
\cb3 \strokec4     \cf6 \strokec6 // Upload thumbnail to Base44 Files\cf0 \cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  thumbFile = \cf2 \strokec2 await\cf0 \strokec4  \cf7 \strokec7 Deno\cf0 \strokec4 .readFile(thumbnailPath);\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  \{ file_url: thumbnail_url \} = \cf2 \strokec2 await\cf0 \strokec4  base44.files.upload(thumbFile, \cf5 \strokec5 `\cf0 \strokec4 $\{media_id\}\cf5 \strokec5 -thumb.jpg`\cf0 \strokec4 , \cf5 \strokec5 'image/jpeg'\cf0 \strokec4 );\cb1 \strokec4 \
\
\cb3 \strokec4     \cf6 \strokec6 // Update the media record\cf0 \cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 await\cf0 \strokec4  base44.entities.\cf7 \strokec7 Media\cf0 \strokec4 .update(media_id, \{\cb1 \strokec4 \
\cb3 \strokec4         duration: duration,\cb1 \strokec4 \
\cb3 \strokec4         thumbnail_url: thumbnail_url,\cb1 \strokec4 \
\cb3 \strokec4         ai_score: \cf7 \strokec7 Math\cf0 \strokec4 .floor(\cf7 \strokec7 Math\cf0 \strokec4 .random() * \cf8 \strokec8 31\cf0 \strokec4 ) + \cf8 \strokec8 70\cf0 \strokec4 , \cf6 \strokec6 // Placeholder score\cf0 \cb1 \strokec4 \
\cb3 \strokec4         ai_tags: [\cf5 \strokec5 "wedding"\cf0 \strokec4 , \cf5 \strokec5 "guest"\cf0 \strokec4 , \cf5 \strokec5 "celebration"\cf0 \strokec4 ], \cf6 \strokec6 // Placeholder tags\cf0 \cb1 \strokec4 \
\cb3 \strokec4         ai_description: \cf5 \strokec5 "A moment captured from the special day."\cf0 \cb1 \strokec4 \
\cb3 \strokec4     \});\cb1 \strokec4 \
\
\cb3 \strokec4     \cf6 \strokec6 // Cleanup temp files\cf0 \cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 await\cf0 \strokec4  \cf7 \strokec7 Deno\cf0 \strokec4 .remove(tempPath);\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 await\cf0 \strokec4  \cf7 \strokec7 Deno\cf0 \strokec4 .remove(thumbnailPath);\cb1 \strokec4 \
\
\cb3 \strokec4     \cf2 \strokec2 return\cf0 \strokec4  \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Response\cf0 \strokec4 (\cf7 \strokec7 JSON\cf0 \strokec4 .stringify(\{ success: \cf2 \strokec2 true\cf0 \strokec4 , message: \cf5 \strokec5 `Analyzed media \cf0 \strokec4 $\{media_id\}\cf5 \strokec5 `\cf0 \strokec4  \}), \{ status: \cf8 \strokec8 200\cf0 \strokec4  \});\cb1 \strokec4 \
\cb3 \strokec4 \}\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 async\cf0 \strokec4  \cf2 \strokec2 function\cf0 \strokec4  handleRenderJob(req) \{\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  \{ event_id, media_urls \} = \cf2 \strokec2 await\cf0 \strokec4  req.json();\cb1 \strokec4 \
\cb3 \strokec4     console.log(\cf5 \strokec5 `[Render Job] Received for event_id: \cf0 \strokec4 $\{event_id\}\cf5 \strokec5 `\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4     \cb1 \strokec4 \
\cb3 \strokec4     \cf6 \strokec6 // Run this in the background, don't await it here\cf0 \cb1 \strokec4 \
\cb3 \strokec4     (\cf2 \strokec2 async\cf0 \strokec4  () => \{\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 try\cf0 \strokec4  \{\cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 const\cf0 \strokec4  filePaths = \cf2 \strokec2 await\cf0 \strokec4  \cf7 \strokec7 Promise\cf0 \strokec4 .all(media_urls.map(downloadFile));\cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 const\cf0 \strokec4  fileListPath = \cf5 \strokec5 "/tmp/filelist.txt"\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 const\cf0 \strokec4  fileListContent = filePaths.map(p => \cf5 \strokec5 `file '\cf0 \strokec4 $\{p\}\cf5 \strokec5 '`\cf0 \strokec4 ).join(\cf5 \strokec5 '\\n'\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 await\cf0 \strokec4  \cf7 \strokec7 Deno\cf0 \strokec4 .writeTextFile(fileListPath, fileListContent);\cb1 \strokec4 \
\
\cb3 \strokec4             \cf2 \strokec2 const\cf0 \strokec4  outputPath = \cf5 \strokec5 `/tmp/\cf0 \strokec4 $\{event_id\}\cf5 \strokec5 -reel.mp4`\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4             \cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 const\cf0 \strokec4  ffmpeg = \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Deno\cf0 \strokec4 .\cf7 \strokec7 Command\cf0 \strokec4 (\cf5 \strokec5 "ffmpeg"\cf0 \strokec4 , \{\cb1 \strokec4 \
\cb3 \strokec4                 args: [\cb1 \strokec4 \
\cb3 \strokec4                     \cf5 \strokec5 "-f"\cf0 \strokec4 , \cf5 \strokec5 "concat"\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4                     \cf5 \strokec5 "-safe"\cf0 \strokec4 , \cf5 \strokec5 "0"\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4                     \cf5 \strokec5 "-i"\cf0 \strokec4 , fileListPath,\cb1 \strokec4 \
\cb3 \strokec4                     \cf5 \strokec5 "-c"\cf0 \strokec4 , \cf5 \strokec5 "copy"\cf0 \strokec4 , \cf6 \strokec6 // Fast concatenation without re-encoding\cf0 \cb1 \strokec4 \
\cb3 \strokec4                     outputPath,\cb1 \strokec4 \
\cb3 \strokec4                 ],\cb1 \strokec4 \
\cb3 \strokec4             \});\cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 const\cf0 \strokec4  \{ code, stderr \} = \cf2 \strokec2 await\cf0 \strokec4  ffmpeg.output();\cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 if\cf0 \strokec4  (code !== \cf8 \strokec8 0\cf0 \strokec4 ) \cf2 \strokec2 throw\cf0 \strokec4  \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Error\cf0 \strokec4 (\cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 TextDecoder\cf0 \strokec4 ().decode(stderr));\cb1 \strokec4 \
\
\cb3 \strokec4             \cf2 \strokec2 const\cf0 \strokec4  reelFile = \cf2 \strokec2 await\cf0 \strokec4  \cf7 \strokec7 Deno\cf0 \strokec4 .readFile(outputPath);\cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 const\cf0 \strokec4  \{ file_url: reel_url \} = \cf2 \strokec2 await\cf0 \strokec4  base44.files.upload(reelFile, \cf5 \strokec5 `\cf0 \strokec4 $\{event_id\}\cf5 \strokec5 -reel.mp4`\cf0 \strokec4 , \cf5 \strokec5 'video/mp4'\cf0 \strokec4 );\cb1 \strokec4 \
\
\cb3 \strokec4             \cf2 \strokec2 await\cf0 \strokec4  updateEventStatus(event_id, \cf5 \strokec5 'completed'\cf0 \strokec4 , reel_url);\cb1 \strokec4 \
\cb3 \strokec4             \cb1 \strokec4 \
\cb3 \strokec4             \cf6 \strokec6 // Cleanup\cf0 \cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 await\cf0 \strokec4  \cf7 \strokec7 Promise\cf0 \strokec4 .all(filePaths.map(p => \cf7 \strokec7 Deno\cf0 \strokec4 .remove(p)));\cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 await\cf0 \strokec4  \cf7 \strokec7 Deno\cf0 \strokec4 .remove(fileListPath);\cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 await\cf0 \strokec4  \cf7 \strokec7 Deno\cf0 \strokec4 .remove(outputPath);\cb1 \strokec4 \
\cb3 \strokec4         \} \cf2 \strokec2 catch\cf0 \strokec4  (error) \{\cb1 \strokec4 \
\cb3 \strokec4             console.error(\cf5 \strokec5 `[Render Job Failed] for event \cf0 \strokec4 $\{event_id\}\cf5 \strokec5 :`\cf0 \strokec4 , error);\cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 await\cf0 \strokec4  updateEventStatus(event_id, \cf5 \strokec5 'failed'\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4         \}\cb1 \strokec4 \
\cb3 \strokec4     \})();\cb1 \strokec4 \
\
\cb3 \strokec4     \cf2 \strokec2 return\cf0 \strokec4  \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Response\cf0 \strokec4 (\cf7 \strokec7 JSON\cf0 \strokec4 .stringify(\{ success: \cf2 \strokec2 true\cf0 \strokec4 , message: \cf5 \strokec5 `Render job for \cf0 \strokec4 $\{event_id\}\cf5 \strokec5  started.`\cf0 \strokec4  \}), \{ status: \cf8 \strokec8 202\cf0 \strokec4  \});\cb1 \strokec4 \
\cb3 \strokec4 \}\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf6 \cb3 \strokec6 // --- Main Server Logic ---\cf0 \cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf7 \cb3 \strokec7 Deno\cf0 \strokec4 .serve(\{ port: parseInt(\cf7 \strokec7 Deno\cf0 \strokec4 .env.\cf2 \strokec2 get\cf0 \strokec4 (\cf5 \strokec5 "PORT"\cf0 \strokec4 ) || \cf5 \strokec5 "8000"\cf0 \strokec4 ) \}, \cf2 \strokec2 async\cf0 \strokec4  (req) => \{\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  url = \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 URL\cf0 \strokec4 (req.url);\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  path = url.pathname;\cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  method = req.method;\cb1 \strokec4 \
\
\cb3 \strokec4     console.log(\cf5 \strokec5 `[\cf0 \strokec4 $\{\cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Date\cf0 \strokec4 ().toISOString()\}\cf5 \strokec5 ] Received: \cf0 \strokec4 $\{method\}\cf5 \strokec5  \cf0 \strokec4 $\{path\}\cf5 \strokec5 `\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4     \cb1 \strokec4 \
\cb3 \strokec4     \cf6 \strokec6 // Security check\cf0 \cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 if\cf0 \strokec4  (req.headers.\cf2 \strokec2 get\cf0 \strokec4 (\cf5 \strokec5 'X-Worker-Auth'\cf0 \strokec4 ) !== \cf7 \strokec7 Deno\cf0 \strokec4 .env.\cf2 \strokec2 get\cf0 \strokec4 (\cf5 \strokec5 "RAILWAY_WORKER_SECRET"\cf0 \strokec4 )) \{\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 return\cf0 \strokec4  \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Response\cf0 \strokec4 (\cf5 \strokec5 "Unauthorized"\cf0 \strokec4 , \{ status: \cf8 \strokec8 401\cf0 \strokec4  \});\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\
\cb3 \strokec4     \cf2 \strokec2 try\cf0 \strokec4  \{\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 if\cf0 \strokec4  (path === \cf5 \strokec5 '/health'\cf0 \strokec4  && method === \cf5 \strokec5 'GET'\cf0 \strokec4 ) \{\cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 return\cf0 \strokec4  \cf2 \strokec2 await\cf0 \strokec4  handleHealthCheck();\cb1 \strokec4 \
\cb3 \strokec4         \}\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 if\cf0 \strokec4  (path === \cf5 \strokec5 '/jobs/analyze'\cf0 \strokec4  && method === \cf5 \strokec5 'POST'\cf0 \strokec4 ) \{\cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 return\cf0 \strokec4  \cf2 \strokec2 await\cf0 \strokec4  handleAnalyzeJob(req);\cb1 \strokec4 \
\cb3 \strokec4         \}\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 if\cf0 \strokec4  (path === \cf5 \strokec5 '/jobs/render'\cf0 \strokec4  && method === \cf5 \strokec5 'POST'\cf0 \strokec4 ) \{\cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 return\cf0 \strokec4  \cf2 \strokec2 await\cf0 \strokec4  handleRenderJob(req);\cb1 \strokec4 \
\cb3 \strokec4         \}\cb1 \strokec4 \
\
\cb3 \strokec4         \cf2 \strokec2 return\cf0 \strokec4  \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Response\cf0 \strokec4 (\cf7 \strokec7 JSON\cf0 \strokec4 .stringify(\{ error: \cf5 \strokec5 "Not Found"\cf0 \strokec4  \}), \{ status: \cf8 \strokec8 404\cf0 \strokec4  \});\cb1 \strokec4 \
\
\cb3 \strokec4     \} \cf2 \strokec2 catch\cf0 \strokec4  (error) \{\cb1 \strokec4 \
\cb3 \strokec4         console.error(\cf5 \strokec5 `Error processing \cf0 \strokec4 $\{method\}\cf5 \strokec5  \cf0 \strokec4 $\{path\}\cf5 \strokec5 :`\cf0 \strokec4 , error);\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 return\cf0 \strokec4  \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Response\cf0 \strokec4 (\cf7 \strokec7 JSON\cf0 \strokec4 .stringify(\{ message: \cf5 \strokec5 "Internal server error"\cf0 \strokec4 , details: error.message \}), \{ status: \cf8 \strokec8 500\cf0 \strokec4  \});\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\cb3 \strokec4 \});\cb1 \strokec4 \
}