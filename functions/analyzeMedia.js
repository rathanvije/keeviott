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
\outl0\strokewidth0 \strokec2 import\cf0 \strokec4  \{ createClientFromRequest \} \cf2 \strokec2 from\cf0 \strokec4  \cf5 \strokec5 'npm:@base44/sdk@0.5.0'\cf0 \strokec4 ;\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf6 \cb3 \strokec6 // This function is kept for historical purposes but is now superseded by the masterWorker.\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6 // All analysis jobs should be routed through `processVideo.js` to the worker.\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf7 \cb3 \strokec7 Deno\cf0 \strokec4 .serve(\cf2 \strokec2 async\cf0 \strokec4  (req) => \{\cb1 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3     \cf2 \strokec2 try\cf0 \strokec4  \{\cb1 \
\cb3         \cf2 \strokec2 const\cf0 \strokec4  \{ file_url, media_type \} = \cf2 \strokec2 await\cf0 \strokec4  req.json();\cb1 \
\
\cb3         \cf6 \strokec6 // This is a dummy response.\cf0 \cb1 \strokec4 \
\cb3         \cf2 \strokec2 const\cf0 \strokec4  analysis = \{\cb1 \
\cb3             quality_score: \cf8 \strokec8 75\cf0 \strokec4 ,\cb1 \
\cb3             tags: [\cf5 \strokec5 "dummy"\cf0 \strokec4 , media_type],\cb1 \
\cb3             description: \cf5 \strokec5 `This is a dummy analysis for a \cf0 \strokec4 $\{media_type\}\cf5 \strokec5 .`\cf0 \strokec4 ,\cb1 \
\cb3             duration: media_type === \cf5 \strokec5 'video'\cf0 \strokec4  ? \cf8 \strokec8 10\cf0 \strokec4  : \cf2 \strokec2 null\cf0 \strokec4 ,\cb1 \
\cb3         \};\cb1 \
\
\cb3         \cf2 \strokec2 return\cf0 \strokec4  \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Response\cf0 \strokec4 (\cf7 \strokec7 JSON\cf0 \strokec4 .stringify(analysis), \{\cb1 \
\cb3             status: \cf8 \strokec8 200\cf0 \strokec4 ,\cb1 \
\cb3             headers: \{ \cf5 \strokec5 "Content-Type"\cf0 \strokec4 : \cf5 \strokec5 "application/json"\cf0 \strokec4  \},\cb1 \
\cb3         \});\cb1 \
\
\cb3     \} \cf2 \strokec2 catch\cf0 \strokec4  (error) \{\cb1 \
\cb3         \cf2 \strokec2 return\cf0 \strokec4  \cf2 \strokec2 new\cf0 \strokec4  \cf7 \strokec7 Response\cf0 \strokec4 (\cf7 \strokec7 JSON\cf0 \strokec4 .stringify(\{ error: error.message \}), \{\cb1 \
\cb3             status: \cf8 \strokec8 500\cf0 \strokec4 ,\cb1 \
\cb3             headers: \{ \cf5 \strokec5 "Content-Type"\cf0 \strokec4 : \cf5 \strokec5 "application/json"\cf0 \strokec4  \},\cb1 \
\cb3         \});\cb1 \
\cb3     \}\cb1 \
\cb3 \});\cb1 \
}