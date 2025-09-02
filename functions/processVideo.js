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
\outl0\strokewidth0 \strokec2 import\cf0 \strokec4  \{ createClientFromRequest \} \cf2 \strokec2 from\cf0 \strokec4  \cf5 \strokec5 'npm:@base44/sdk@0.5.0'\cf0 \strokec4 ;\cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf6 \cb3 \strokec6 // This function acts as a gateway to the Railway worker.\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf7 \cb3 \strokec7 Deno\cf0 \strokec4 .serve(\cf2 \strokec2 async\cf0 \strokec4  (req) => \{\cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4     \cf2 \strokec2 const\cf0 \strokec4  base44 = createClientFromRequest(req);\cb1 \strokec4 \
\
\cb3 \strokec4     \cf6 \strokec6 // Ensure the user is authenticated to prevent unauthorized worker usage.\cf0 \cb1 \strokec4 \
\cb3 \strokec4     \cf2 \strokec2 if\cf0 \strokec4  (!(\cf2 \strokec2 await\cf0 \strokec4  base44.auth.isAuthenticated())) \{\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 return\cf0 \strokec4  \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Response\cf0 \strokec4 (\cf7 \strokec7 JSON\cf0 \strokec4 .stringify(\{ error: \cf5 \strokec5 'Unauthorized'\cf0 \strokec4  \}), \{ status: \cf8 \strokec8 401\cf0 \strokec4  \});\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\
\cb3 \strokec4     \cf2 \strokec2 try\cf0 \strokec4  \{\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 const\cf0 \strokec4  \{ file_url, media_id, job_type \} = \cf2 \strokec2 await\cf0 \strokec4  req.json();\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 const\cf0 \strokec4  workerUrl = \cf7 \strokec7 Deno\cf0 \strokec4 .env.\cf2 \strokec2 get\cf0 \strokec4 (\cf5 \strokec5 "RAILWAY_WORKER_URL"\cf0 \strokec4 );\cb1 \strokec4 \
\
\cb3 \strokec4         \cf2 \strokec2 if\cf0 \strokec4  (!workerUrl) \{\cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 throw\cf0 \strokec4  \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Error\cf0 \strokec4 (\cf5 \strokec5 "RAILWAY_WORKER_URL is not set in environment variables."\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4         \}\cb1 \strokec4 \
\
\cb3 \strokec4         \cf2 \strokec2 const\cf0 \strokec4  response = \cf2 \strokec2 await\cf0 \strokec4  fetch(\cf5 \strokec5 `\cf0 \strokec4 $\{workerUrl\}\cf5 \strokec5 /jobs/\cf0 \strokec4 $\{job_type\}\cf5 \strokec5 `\cf0 \strokec4 , \{\cb1 \strokec4 \
\cb3 \strokec4             method: \cf5 \strokec5 'POST'\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4             headers: \{\cb1 \strokec4 \
\cb3 \strokec4                 \cf5 \strokec5 'Content-Type'\cf0 \strokec4 : \cf5 \strokec5 'application/json'\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4                 \cf6 \strokec6 // Add a simple auth key to verify requests are from our backend\cf0 \cb1 \strokec4 \
\cb3 \strokec4                 \cf5 \strokec5 'X-Worker-Auth'\cf0 \strokec4 : \cf7 \strokec7 Deno\cf0 \strokec4 .env.\cf2 \strokec2 get\cf0 \strokec4 (\cf5 \strokec5 "RAILWAY_WORKER_SECRET"\cf0 \strokec4 ),\cb1 \strokec4 \
\cb3 \strokec4             \},\cb1 \strokec4 \
\cb3 \strokec4             body: \cf7 \strokec7 JSON\cf0 \strokec4 .stringify(\{ file_url, media_id \}),\cb1 \strokec4 \
\cb3 \strokec4         \});\cb1 \strokec4 \
\
\cb3 \strokec4         \cf2 \strokec2 if\cf0 \strokec4  (!response.ok) \{\cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 const\cf0 \strokec4  errorBody = \cf2 \strokec2 await\cf0 \strokec4  response.text();\cb1 \strokec4 \
\cb3 \strokec4             \cf2 \strokec2 throw\cf0 \strokec4  \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Error\cf0 \strokec4 (\cf5 \strokec5 `Worker responded with status \cf0 \strokec4 $\{response.status\}\cf5 \strokec5 : \cf0 \strokec4 $\{errorBody\}\cf5 \strokec5 `\cf0 \strokec4 );\cb1 \strokec4 \
\cb3 \strokec4         \}\cb1 \strokec4 \
\
\cb3 \strokec4         \cf2 \strokec2 const\cf0 \strokec4  result = \cf2 \strokec2 await\cf0 \strokec4  response.json();\cb1 \strokec4 \
\
\cb3 \strokec4         \cf2 \strokec2 return\cf0 \strokec4  \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Response\cf0 \strokec4 (\cf7 \strokec7 JSON\cf0 \strokec4 .stringify(\{ success: \cf2 \strokec2 true\cf0 \strokec4 , result \}), \{\cb1 \strokec4 \
\cb3 \strokec4             status: \cf8 \strokec8 200\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4             headers: \{ \cf5 \strokec5 "Content-Type"\cf0 \strokec4 : \cf5 \strokec5 "application/json"\cf0 \strokec4  \},\cb1 \strokec4 \
\cb3 \strokec4         \});\cb1 \strokec4 \
\
\cb3 \strokec4     \} \cf2 \strokec2 catch\cf0 \strokec4  (error) \{\cb1 \strokec4 \
\cb3 \strokec4         console.error(\cf5 \strokec5 "Error processing video job:"\cf0 \strokec4 , error);\cb1 \strokec4 \
\cb3 \strokec4         \cf2 \strokec2 return\cf0 \strokec4  \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Response\cf0 \strokec4 (\cf7 \strokec7 JSON\cf0 \strokec4 .stringify(\{ error: \cf5 \strokec5 "Failed to process job."\cf0 \strokec4 , details: error.message \}), \{\cb1 \strokec4 \
\cb3 \strokec4             status: \cf8 \strokec8 500\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4             headers: \{ \cf5 \strokec5 "Content-Type"\cf0 \strokec4 : \cf5 \strokec5 "application/json"\cf0 \strokec4  \},\cb1 \strokec4 \
\cb3 \strokec4         \});\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\cb3 \strokec4 \});\cb1 \strokec4 \
}