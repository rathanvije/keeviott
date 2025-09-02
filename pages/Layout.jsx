
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { Heart, Camera, Users, BarChart3, Calendar } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Events",
    url: createPageUrl("Dashboard"),
    icon: Calendar,
  },
  {
    title: "Capture Portal",
    url: createPageUrl("Capture"),
    icon: Camera,
  },
  {
    title: "Gallery",
    url: createPageUrl("Gallery"),
    icon: Heart,
  },
  {
    title: "Admin",
    url: createPageUrl("Admin"),
    icon: BarChart3,
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, [location.pathname]);

  const filteredNavItems = navigationItems.filter(item => {
    if (item.title === "Admin") {
      return user?.role === 'admin';
    }
    return true;
  });

  return (
    <SidebarProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
        
        :root {
          --ivory-white: #F8F7F4;
          --onyx-black: #0D0D0D;
          --champagne-gold: #C8A951;
          --stone-gray: #6E6E6E;
          --emerald-green: #0E6655;
        }
        
        .keevio-gradient {
          background: linear-gradient(135deg, var(--ivory-white) 0%, #F0EFE8 100%);
        }
        
        .keevio-gold-gradient {
          background: linear-gradient(135deg, var(--champagne-gold) 0%, #D4B95A 100%);
        }
        
        .keevio-text-gold {
          color: var(--champagne-gold);
        }
        
        .keevio-bg-gold {
          background-color: var(--champagne-gold);
        }
        
        .font-playfair {
          font-family: 'Playfair Display', serif;
        }
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Playfair Display', serif;
        }
        
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
      
      <div className="min-h-screen flex w-full" style={{ backgroundColor: 'var(--ivory-white)' }}>
        <Sidebar className="border-r border-gray-200/60">
          <SidebarHeader className="border-b border-gray-200/60 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 keevio-gold-gradient rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-playfair font-bold text-xl" style={{ color: 'var(--onyx-black)' }}>
                  Keevio
                </h2>
                <p className="text-sm" style={{ color: 'var(--stone-gray)' }}>
                  Captured by many. Told as one.
                </p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider px-2 py-3" 
                style={{ color: 'var(--stone-gray)' }}>
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {filteredNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-amber-50 hover:text-amber-800 transition-all duration-300 rounded-xl p-3 ${location.pathname.startsWith(item.url) ? 'bg-amber-50 text-amber-800 shadow-sm' : 'text-gray-700'}`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200/60 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5" style={{ color: 'var(--stone-gray)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate" style={{ color: 'var(--onyx-black)' }}>
                  {user?.full_name || 'Guest'}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--stone-gray)' }}>
                  {user?.email || 'Create beautiful memories'}
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-playfair font-semibold" style={{ color: 'var(--onyx-black)' }}>
                {currentPageName}
              </h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto keevio-gradient">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
