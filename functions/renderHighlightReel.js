{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 Menlo-Regular;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue255;\red255\green255\blue254;\red0\green0\blue0;
\red144\green1\blue18;\red14\green110\blue109;\red15\green112\blue1;\red19\green118\blue70;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c100000;\cssrgb\c100000\c100000\c99608;\cssrgb\c0\c0\c0;
\cssrgb\c63922\c8235\c8235;\cssrgb\c0\c50196\c50196;\cssrgb\c0\c50196\c0;\cssrgb\c3529\c52549\c34510;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs28 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 import\cf0 \strokec4  \{ createClientFromRequest \} \cf2 \strokec2 from\cf0 \strokec4  \cf5 \strokec5 'npm:@base44/sdk@0.5.0'\cf0 \strokec4 ;\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf6 \cb3 \strokec6 Deno\cf0 \strokec4 .serve(\cf2 \strokec2 async\cf0 \strokec4  (req) => \{\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  base44 = createClientFromRequest(req);\cb1 \strokec4 \
\
\cb3 \strokec4     \cf7 \strokec7 // Ensure the user is authenticated and is an admin or event owner.\cf0 \cb1 \strokec4 \
\cb3 \strokec4     \cf7 \strokec7 // Business logic for ownership should be checked here if needed.\cf0 \cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 if\cf0 \strokec4  (!(\cf2 \strokec2 await\cf0 \strokec4  base44.auth.isAuthenticated())) \{\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 return\cf0 \strokec4  \cf2 \strokec2 new\cf0 \strokec4  \cf6 \strokec6 Response\cf0 \strokec4 (\cf6 \strokec6 JSON\cf0 \strokec4 .stringify(\{ error: \cf5 \strokec5 'Unauthorized'\cf0 \strokec4  \}), \{ status: \cf8 \strokec8 401\cf0 \strokec4  \});\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\
\cb3 \strokec4     \cf2 \strokec2 try\cf0 \strokec4  \{\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 const\cf0 \strokec4  \{ event_id, media_urls \} = \cf2 \strokec2 await\cf0 \strokec4  req.json();\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 const\cf0 \strokec4  workerUrl = \cf6 \strokec6 Deno\cf0 \strokec4 .env.\cf2 \strokec2 get\cf0 \strokec4 (\cf5 \strokec5 "RAILWAY_WORKER_URL"\cf0 \strokec4 );\cb1 \strokec4 \
\
\cb3 \strokec4         \cf2 \strokec2 if\cf0 \strokec4  (!workerUrl) \{\cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 throw\cf0 \strokec4  \cf2 \strokec2 new\cf0 \strokec4  \cf6 \strokec6 Error\cf0 \strokec4 (\cf5 \strokec5 "RAILWAY_WORKER_URL is not set in environment variables."\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4         \}\cb1 \strokec4 \
\
\cb3 \strokec4         \cf7 \strokec7 // Asynchronously fire a request to the worker and return immediately.\cf0 \cb1 \strokec4 \
\cb3 \strokec4         \cf7 \strokec7 // The worker will update the event status via a webhook or direct DB call.\cf0 \cb1 \strokec4 \
\cb3 \strokec4         fetch(\cf5 \strokec5 `\cf0 \strokec4 $\{workerUrl\}\cf5 \strokec5 /jobs/render`\cf0 \strokec4 , \{\cb1 \strokec4 \
\cb3 \strokec4             method: \cf5 \strokec5 'POST'\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4             headers: \{\cb1 \strokec4 \
\cb3 \strokec4                 \cf5 \strokec5 'Content-Type'\cf0 \strokec4 : \cf5 \strokec5 'application/json'\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4                 \cf5 \strokec5 'X-Worker-Auth'\cf0 \strokec4 : \cf6 \strokec6 Deno\cf0 \strokec4 .env.\cf2 \strokec2 get\cf0 \strokec4 (\cf5 \strokec5 "RAILWAY_WORKER_SECRET"\cf0 \strokec4 ),\cb1 \strokec4 \
\cb3 \strokec4             \},\cb1 \strokec4 \
\cb3 \strokec4             body: \cf6 \strokec6 JSON\cf0 \strokec4 .stringify(\{ event_id, media_urls \}),\cb1 \strokec4 \
\cb3 \strokec4         \}).\cf2 \strokec2 catch\cf0 \strokec4 (err => \{\cb1 \strokec4 \
\cb3 \strokec4             \cf7 \strokec7 // Log the error but don't block the user response.\cf0 \cb1 \strokec4 \
\cb3 \strokec4             \cf7 \strokec7 // The frontend will show a pending state and can be updated on failure.\cf0 \cb1 \strokec4 \
\cb3 \strokec4             console.error(\cf5 \strokec5 "Failed to dispatch render job to worker:"\cf0 \strokec4 , err);\cb1 \strokec4 \
\cb3 \strokec4         \});\cb1 \strokec4 \
\
\cb3 \strokec4         \cf7 \strokec7 // Immediately confirm to the client that the job has started.\cf0 \cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 return\cf0 \strokec4  \cf2 \strokec2 new\cf0 \strokec4  \cf6 \strokec6 Response\cf0 \strokec4 (\cf6 \strokec6 JSON\cf0 \strokec4 .stringify(\{ message: \cf5 \strokec5 "Render job started successfully."\cf0 \strokec4  \}), \{\cb1 \strokec4 \
\cb3 \strokec4             status: \cf8 \strokec8 202\cf0 \strokec4 , \cf7 \strokec7 // 202 Accepted\cf0 \cb1 \strokec4 \
\cb3 \strokec4             headers: \{ \cf5 \strokec5 "Content-Type"\cf0 \strokec4 : \cf5 \strokec5 "application/json"\cf0 \strokec4  \},\cb1 \strokec4 \
\cb3 \strokec4         \});\cb1 \strokec4 \
\
\cb3 \strokec4     \} \cf2 \strokec2 catch\cf0 \strokec4  (error) \{\cb1 \strokec4 \
\cb3 \strokec4         console.error(\cf5 \strokec5 "Error starting render job:"\cf0 \strokec4 , error);\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 return\cf0 \strokec4  \cf2 \strokec2 new\cf0 \strokec4  \cf6 \strokec6 Response\cf0 \strokec4 (\cf6 \strokec6 JSON\cf0 \strokec4 .stringify(\{ error: \cf5 \strokec5 "Failed to start render job."\cf0 \strokec4 , details: error.message \}), \{\cb1 \strokec4 \
\cb3 \strokec4             status: \cf8 \strokec8 500\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4             headers: \{ \cf5 \strokec5 "Content-Type"\cf0 \strokec4 : \cf5 \strokec5 "application/json"\cf0 \strokec4  \},\cb1 \strokec4 \
\cb3 \strokec4         \});\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\cb3 \strokec4 \});\cb1 \strokec4 \
}