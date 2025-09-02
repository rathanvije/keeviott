{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 Menlo-Regular;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue255;\red255\green255\blue254;\red0\green0\blue0;
\red14\green110\blue109;\red144\green1\blue18;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c100000;\cssrgb\c100000\c100000\c99608;\cssrgb\c0\c0\c0;
\cssrgb\c0\c50196\c50196;\cssrgb\c63922\c8235\c8235;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs28 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 import\cf0 \strokec4  \cf5 \strokec5 React\cf0 \strokec4 , \{ useState, useEffect \} \cf2 \strokec2 from\cf0 \strokec4  \cf6 \strokec6 "react"\cf0 \strokec4 ;\cb1 \
\cf2 \cb3 \strokec2 import\cf0 \strokec4  \{ \cf5 \strokec5 Link\cf0 \strokec4 , useLocation \} \cf2 \strokec2 from\cf0 \strokec4  \cf6 \strokec6 "react-router-dom"\cf0 \strokec4 ;\cb1 \
\cf2 \cb3 \strokec2 import\cf0 \strokec4  \{ createPageUrl \} \cf2 \strokec2 from\cf0 \strokec4  \cf6 \strokec6 "@/utils"\cf0 \strokec4 ;\cb1 \
\cf2 \cb3 \strokec2 import\cf0 \strokec4  \{ \cf5 \strokec5 User\cf0 \strokec4  \} \cf2 \strokec2 from\cf0 \strokec4  \cf6 \strokec6 "@/entities/User"\cf0 \strokec4 ;\cb1 \
\cf2 \cb3 \strokec2 import\cf0 \strokec4  \{ \cf5 \strokec5 Heart\cf0 \strokec4 , \cf5 \strokec5 Camera\cf0 \strokec4 , \cf5 \strokec5 Users\cf0 \strokec4 , \cf5 \strokec5 BarChart3\cf0 \strokec4 , \cf5 \strokec5 Calendar\cf0 \strokec4  \} \cf2 \strokec2 from\cf0 \strokec4  \cf6 \strokec6 "lucide-react"\cf0 \strokec4 ;\cb1 \
\cf2 \cb3 \strokec2 import\cf0 \strokec4  \{\cb1 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3   \cf5 \strokec5 Sidebar\cf0 \strokec4 ,\cb1 \
\cb3   \cf5 \strokec5 SidebarContent\cf0 \strokec4 ,\cb1 \
\cb3   \cf5 \strokec5 SidebarGroup\cf0 \strokec4 ,\cb1 \
\cb3   \cf5 \strokec5 SidebarGroupContent\cf0 \strokec4 ,\cb1 \
\cb3   \cf5 \strokec5 SidebarGroupLabel\cf0 \strokec4 ,\cb1 \
\cb3   \cf5 \strokec5 SidebarMenu\cf0 \strokec4 ,\cb1 \
\cb3   \cf5 \strokec5 SidebarMenuButton\cf0 \strokec4 ,\cb1 \
\cb3   \cf5 \strokec5 SidebarMenuItem\cf0 \strokec4 ,\cb1 \
\cb3   \cf5 \strokec5 SidebarHeader\cf0 \strokec4 ,\cb1 \
\cb3   \cf5 \strokec5 SidebarFooter\cf0 \strokec4 ,\cb1 \
\cb3   \cf5 \strokec5 SidebarProvider\cf0 \strokec4 ,\cb1 \
\cb3   \cf5 \strokec5 SidebarTrigger\cf0 \strokec4 ,\cb1 \
\cb3 \} \cf2 \strokec2 from\cf0 \strokec4  \cf6 \strokec6 "@/components/ui/sidebar"\cf0 \strokec4 ;\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 const\cf0 \strokec4  navigationItems = [\cb1 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3   \{\cb1 \
\cb3     title: \cf6 \strokec6 "Events"\cf0 \strokec4 ,\cb1 \
\cb3     url: createPageUrl(\cf6 \strokec6 "Dashboard"\cf0 \strokec4 ),\cb1 \
\cb3     icon: \cf5 \strokec5 Calendar\cf0 \strokec4 ,\cb1 \
\cb3   \},\cb1 \
\cb3   \{\cb1 \
\cb3     title: \cf6 \strokec6 "Capture Portal"\cf0 \strokec4 ,\cb1 \
\cb3     url: createPageUrl(\cf6 \strokec6 "Capture"\cf0 \strokec4 ),\cb1 \
\cb3     icon: \cf5 \strokec5 Camera\cf0 \strokec4 ,\cb1 \
\cb3   \},\cb1 \
\cb3   \{\cb1 \
\cb3     title: \cf6 \strokec6 "Gallery"\cf0 \strokec4 ,\cb1 \
\cb3     url: createPageUrl(\cf6 \strokec6 "Gallery"\cf0 \strokec4 ),\cb1 \
\cb3     icon: \cf5 \strokec5 Heart\cf0 \strokec4 ,\cb1 \
\cb3   \},\cb1 \
\cb3   \{\cb1 \
\cb3     title: \cf6 \strokec6 "Admin"\cf0 \strokec4 ,\cb1 \
\cb3     url: createPageUrl(\cf6 \strokec6 "Admin"\cf0 \strokec4 ),\cb1 \
\cb3     icon: \cf5 \strokec5 BarChart3\cf0 \strokec4 ,\cb1 \
\cb3   \}\cb1 \
\cb3 ];\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \strokec2 export\cf0 \strokec4  \cf2 \strokec2 default\cf0 \strokec4  \cf2 \strokec2 function\cf0 \strokec4  \cf5 \strokec5 Layout\cf0 \strokec4 (\{ children, currentPageName \}) \{\cb1 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3   \cf2 \strokec2 const\cf0 \strokec4  location = useLocation();\cb1 \
\cb3   \cf2 \strokec2 const\cf0 \strokec4  [user, setUser] = useState(\cf2 \strokec2 null\cf0 \strokec4 );\cb1 \
\
\cb3   useEffect(() => \{\cb1 \
\cb3     \cf2 \strokec2 const\cf0 \strokec4  fetchUser = \cf2 \strokec2 async\cf0 \strokec4  () => \{\cb1 \
\cb3       \cf2 \strokec2 try\cf0 \strokec4  \{\cb1 \
\cb3         \cf2 \strokec2 const\cf0 \strokec4  currentUser = \cf2 \strokec2 await\cf0 \strokec4  \cf5 \strokec5 User\cf0 \strokec4 .me();\cb1 \
\cb3         setUser(currentUser);\cb1 \
\cb3       \} \cf2 \strokec2 catch\cf0 \strokec4  (error) \{\cb1 \
\cb3         setUser(\cf2 \strokec2 null\cf0 \strokec4 );\cb1 \
\cb3       \}\cb1 \
\cb3     \};\cb1 \
\cb3     fetchUser();\cb1 \
\cb3   \}, [location.pathname]);\cb1 \
\
\cb3   \cf2 \strokec2 const\cf0 \strokec4  filteredNavItems = navigationItems.filter(item => \{\cb1 \
\cb3     \cf2 \strokec2 if\cf0 \strokec4  (item.title === \cf6 \strokec6 "Admin"\cf0 \strokec4 ) \{\cb1 \
\cb3       \cf2 \strokec2 return\cf0 \strokec4  user?.role === \cf6 \strokec6 'admin'\cf0 \strokec4 ;\cb1 \
\cb3     \}\cb1 \
\cb3     \cf2 \strokec2 return\cf0 \strokec4  \cf2 \strokec2 true\cf0 \strokec4 ;\cb1 \
\cb3   \});\cb1 \
\
\cb3   \cf2 \strokec2 return\cf0 \strokec4  (\cb1 \
\cb3     <\cf5 \strokec5 SidebarProvider\cf0 \strokec4 >\cb1 \
\cb3       <style>\{\cf6 \strokec6 `\cf0 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf6 \cb3 \strokec6         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         \cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         :root \{\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6           --ivory-white: #F8F7F4;\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6           --onyx-black: #0D0D0D;\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6           --champagne-gold: #C8A951;\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6           --stone-gray: #6E6E6E;\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6           --emerald-green: #0E6655;\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         \}\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         \cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         .keevio-gradient \{\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6           background: linear-gradient(135deg, var(--ivory-white) 0%, #F0EFE8 100%);\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         \}\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         \cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         .keevio-gold-gradient \{\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6           background: linear-gradient(135deg, var(--champagne-gold) 0%, #D4B95A 100%);\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         \}\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         \cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         .keevio-text-gold \{\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6           color: var(--champagne-gold);\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         \}\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         \cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         .keevio-bg-gold \{\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6           background-color: var(--champagne-gold);\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         \}\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         \cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         .font-playfair \{\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6           font-family: 'Playfair Display', serif;\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         \}\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         \cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         .font-inter \{\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6           font-family: 'Inter', sans-serif;\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         \}\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         \cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         h1, h2, h3, h4, h5, h6 \{\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6           font-family: 'Playfair Display', serif;\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         \}\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         \cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         body \{\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6           font-family: 'Inter', sans-serif;\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6         \}\cf0 \cb1 \strokec4 \
\cf6 \cb3 \strokec6       `\cf0 \strokec4 \}</style>\cb1 \
\pard\pardeftab720\partightenfactor0
\cf0 \cb3       \cb1 \
\cb3       <div className=\cf6 \strokec6 "min-h-screen flex w-full"\cf0 \strokec4  style=\{\{ backgroundColor: \cf6 \strokec6 'var(--ivory-white)'\cf0 \strokec4  \}\}>\cb1 \
\cb3         <\cf5 \strokec5 Sidebar\cf0 \strokec4  className=\cf6 \strokec6 "border-r border-gray-200/60"\cf0 \strokec4 >\cb1 \
\cb3           <\cf5 \strokec5 SidebarHeader\cf0 \strokec4  className=\cf6 \strokec6 "border-b border-gray-200/60 p-6"\cf0 \strokec4 >\cb1 \
\cb3             <div className=\cf6 \strokec6 "flex items-center gap-3"\cf0 \strokec4 >\cb1 \
\cb3               <div className=\cf6 \strokec6 "w-10 h-10 keevio-gold-gradient rounded-full flex items-center justify-center shadow-lg"\cf0 \strokec4 >\cb1 \
\cb3                 <\cf5 \strokec5 Heart\cf0 \strokec4  className=\cf6 \strokec6 "w-6 h-6 text-white"\cf0 \strokec4  />\cb1 \
\cb3               </div>\cb1 \
\cb3               <div>\cb1 \
\cb3                 <h2 className=\cf6 \strokec6 "font-playfair font-bold text-xl"\cf0 \strokec4  style=\{\{ color: \cf6 \strokec6 'var(--onyx-black)'\cf0 \strokec4  \}\}>\cb1 \
\cb3                   \cf5 \strokec5 Keevio\cf0 \cb1 \strokec4 \
\cb3                 </h2>\cb1 \
\cb3                 <p className=\cf6 \strokec6 "text-sm"\cf0 \strokec4  style=\{\{ color: \cf6 \strokec6 'var(--stone-gray)'\cf0 \strokec4  \}\}>\cb1 \
\cb3                   \cf5 \strokec5 Captured\cf0 \strokec4  by many. \cf5 \strokec5 Told\cf0 \strokec4  as one.\cb1 \
\cb3                 </p>\cb1 \
\cb3               </div>\cb1 \
\cb3             </div>\cb1 \
\cb3           </\cf5 \strokec5 SidebarHeader\cf0 \strokec4 >\cb1 \
\cb3           \cb1 \
\cb3           <\cf5 \strokec5 SidebarContent\cf0 \strokec4  className=\cf6 \strokec6 "p-4"\cf0 \strokec4 >\cb1 \
\cb3             <\cf5 \strokec5 SidebarGroup\cf0 \strokec4 >\cb1 \
\cb3               <\cf5 \strokec5 SidebarGroupLabel\cf0 \strokec4  className=\cf6 \strokec6 "text-xs font-medium uppercase tracking-wider px-2 py-3"\cf0 \strokec4  \cb1 \
\cb3                 style=\{\{ color: \cf6 \strokec6 'var(--stone-gray)'\cf0 \strokec4  \}\}>\cb1 \
\cb3                 \cf5 \strokec5 Navigation\cf0 \cb1 \strokec4 \
\cb3               </\cf5 \strokec5 SidebarGroupLabel\cf0 \strokec4 >\cb1 \
\cb3               <\cf5 \strokec5 SidebarGroupContent\cf0 \strokec4 >\cb1 \
\cb3                 <\cf5 \strokec5 SidebarMenu\cf0 \strokec4  className=\cf6 \strokec6 "space-y-2"\cf0 \strokec4 >\cb1 \
\cb3                   \{filteredNavItems.map((item) => (\cb1 \
\cb3                     <\cf5 \strokec5 SidebarMenuItem\cf0 \strokec4  key=\{item.title\}>\cb1 \
\cb3                       <\cf5 \strokec5 SidebarMenuButton\cf0 \strokec4  \cb1 \
\cb3                         asChild \cb1 \
\cb3                         className=\{\cf6 \strokec6 `hover:bg-amber-50 hover:text-amber-800 transition-all duration-300 rounded-xl p-3 \cf0 \strokec4 $\{location.pathname.startsWith(item.url) ? \cf6 \strokec6 'bg-amber-50 text-amber-800 shadow-sm'\cf0 \strokec4  : \cf6 \strokec6 'text-gray-700'\cf0 \strokec4 \}\cf6 \strokec6 `\cf0 \strokec4 \}\cb1 \
\cb3                       >\cb1 \
\cb3                         <\cf5 \strokec5 Link\cf0 \strokec4  to=\{item.url\} className=\cf6 \strokec6 "flex items-center gap-3"\cf0 \strokec4 >\cb1 \
\cb3                           <item.icon className=\cf6 \strokec6 "w-5 h-5"\cf0 \strokec4  />\cb1 \
\cb3                           <span className=\cf6 \strokec6 "font-medium"\cf0 \strokec4 >\{item.title\}</span>\cb1 \
\cb3                         </\cf5 \strokec5 Link\cf0 \strokec4 >\cb1 \
\cb3                       </\cf5 \strokec5 SidebarMenuButton\cf0 \strokec4 >\cb1 \
\cb3                     </\cf5 \strokec5 SidebarMenuItem\cf0 \strokec4 >\cb1 \
\cb3                   ))\}\cb1 \
\cb3                 </\cf5 \strokec5 SidebarMenu\cf0 \strokec4 >\cb1 \
\cb3               </\cf5 \strokec5 SidebarGroupContent\cf0 \strokec4 >\cb1 \
\cb3             </\cf5 \strokec5 SidebarGroup\cf0 \strokec4 >\cb1 \
\cb3           </\cf5 \strokec5 SidebarContent\cf0 \strokec4 >\cb1 \
\
\cb3           <\cf5 \strokec5 SidebarFooter\cf0 \strokec4  className=\cf6 \strokec6 "border-t border-gray-200/60 p-6"\cf0 \strokec4 >\cb1 \
\cb3             <div className=\cf6 \strokec6 "flex items-center gap-3"\cf0 \strokec4 >\cb1 \
\cb3               <div className=\cf6 \strokec6 "w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"\cf0 \strokec4 >\cb1 \
\cb3                 <\cf5 \strokec5 Users\cf0 \strokec4  className=\cf6 \strokec6 "w-5 h-5"\cf0 \strokec4  style=\{\{ color: \cf6 \strokec6 'var(--stone-gray)'\cf0 \strokec4  \}\} />\cb1 \
\cb3               </div>\cb1 \
\cb3               <div className=\cf6 \strokec6 "flex-1 min-w-0"\cf0 \strokec4 >\cb1 \
\cb3                 <p className=\cf6 \strokec6 "font-medium text-sm truncate"\cf0 \strokec4  style=\{\{ color: \cf6 \strokec6 'var(--onyx-black)'\cf0 \strokec4  \}\}>\cb1 \
\cb3                   \{user?.full_name || \cf6 \strokec6 'Guest'\cf0 \strokec4 \}\cb1 \
\cb3                 </p>\cb1 \
\cb3                 <p className=\cf6 \strokec6 "text-xs truncate"\cf0 \strokec4  style=\{\{ color: \cf6 \strokec6 'var(--stone-gray)'\cf0 \strokec4  \}\}>\cb1 \
\cb3                   \{user?.email || \cf6 \strokec6 'Create beautiful memories'\cf0 \strokec4 \}\cb1 \
\cb3                 </p>\cb1 \
\cb3               </div>\cb1 \
\cb3             </div>\cb1 \
\cb3           </\cf5 \strokec5 SidebarFooter\cf0 \strokec4 >\cb1 \
\cb3         </\cf5 \strokec5 Sidebar\cf0 \strokec4 >\cb1 \
\
\cb3         <main className=\cf6 \strokec6 "flex-1 flex flex-col"\cf0 \strokec4 >\cb1 \
\cb3  \cb1 \
}