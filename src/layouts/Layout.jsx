import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Link as LinkEntity } from "@/entities/Link";
import { Collection } from "@/entities/Collection";
import { User } from "@/entities/User";
import { 
  Link2, 
  Search, 
  Plus, 
  FolderOpen, 
  Settings, 
  Star,
  User as UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

import PWAInstallPrompt from "../components/PWAInstallPrompt";
import PWAHandler from "../components/PWAHandler";

// Cache for data to avoid repeated API calls
const dataCache = {
  links: null,
  collections: null,
  user: null,
  lastFetched: null,
  isValid: function() {
    return this.lastFetched && (Date.now() - this.lastFetched) < 30000; // 30 seconds cache
  }
};

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Link2,
    color: "text-blue-600"
  },
  {
    title: "Add Link",
    url: createPageUrl("AddLink"),
    icon: Plus,
    color: "text-emerald-600"
  },
  {
    title: "Search",
    url: createPageUrl("Search"),
    icon: Search,
    color: "text-purple-600"
  },
  {
    title: "Collections",
    url: createPageUrl("Collections"),
    icon: FolderOpen,
    color: "text-orange-600"
  },
  {
    title: "Favorites",
    url: createPageUrl("Favorites"),
    icon: Star,
    color: "text-yellow-600"
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [stats, setStats] = useState({
    links: 0,
    collections: 0,
    favorites: 0
  });
  const [user, setUser] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use cached data if available and valid
        if (dataCache.isValid()) {
          const favoriteCount = dataCache.links?.filter(link => link.is_favorite).length || 0;
          setStats({
            links: dataCache.links?.length || 0,
            collections: dataCache.collections?.length || 0,
            favorites: favoriteCount
          });
          setUser(dataCache.user);
          return;
        }

        // Only fetch data if cache is invalid or on initial load
        if (isInitialLoad || !dataCache.isValid()) {
          const [linksData, collectionsData, userData] = await Promise.all([
            LinkEntity.list().catch(() => dataCache.links || []),
            Collection.list().catch(() => dataCache.collections || []),
            User.me().catch(() => dataCache.user || null)
          ]);

          // Update cache
          dataCache.links = linksData;
          dataCache.collections = collectionsData;
          dataCache.user = userData;
          dataCache.lastFetched = Date.now();

          const favoriteCount = linksData.filter(link => link.is_favorite).length;
          setStats({
            links: linksData.length,
            collections: collectionsData.length,
            favorites: favoriteCount
          });
          setUser(userData);
          setIsInitialLoad(false);
        }
      } catch (error) {
        console.error("Failed to fetch layout data:", error);
        // Use cached data as fallback
        if (dataCache.links || dataCache.collections || dataCache.user) {
          const favoriteCount = dataCache.links?.filter(link => link.is_favorite).length || 0;
          setStats({
            links: dataCache.links?.length || 0,
            collections: dataCache.collections?.length || 0,
            favorites: favoriteCount
          });
          setUser(dataCache.user);
        }
      }
    };

    fetchData();
  }, []); // Remove location.pathname dependency to prevent refetching on every navigation

  // Expose cache invalidation function globally for other components to use
  window.invalidateDataCache = () => {
    dataCache.links = null;
    dataCache.collections = null;
    dataCache.user = null;
    dataCache.lastFetched = null;
  };

  return (
    <>
      <PWAHandler />
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
          <Sidebar className="hidden md:flex border-r border-slate-200/60 bg-white/80 backdrop-blur-xl">
            <SidebarHeader className="border-b border-slate-100 p-3 lg:p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Link2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Linkverse</h2>
                  <p className="text-xs text-slate-500">Organize the web</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-3 lg:p-4">
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                  Navigation
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild className="w-full">
                          <Link 
                            to={item.url}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-100 ${
                              location.pathname === item.url.replace(window.location.origin, '') 
                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                                : 'text-slate-700'
                            }`}
                          >
                            <item.icon className={`w-4 h-4 ${item.color}`} />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup className="mt-6 lg:mt-8">
                <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                  Quick Stats
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-3 py-2 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 font-medium">Total Links</span>
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md text-xs">{stats.links}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 font-medium">Collections</span>
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md text-xs">{stats.collections}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 font-medium">Favorites</span>
                      <span className="font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-xs">{stats.favorites}</span>
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-100 p-3 lg:p-4">
              <Link to={createPageUrl("Profile")} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                  {user?.full_name ? (
                    <span className="text-sm font-medium text-slate-700">{user.full_name.charAt(0)}</span>
                  ) : (
                    <UserIcon className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {user?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.role === 'admin' ? 'Administrator' : 'Premium Account'}
                  </p>
                </div>
              </Link>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col">
            <header className="md:hidden bg-white/80 backdrop-blur-xl border-b border-slate-200/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="md:hidden" />
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded flex items-center justify-center">
                      <Link2 className="w-3 h-3 text-white" />
                    </div>
                    <h1 className="text-lg font-bold text-slate-900">Linkverse</h1>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button asChild variant="ghost" size="icon" className="text-slate-600">
                    <Link to={createPageUrl("Search")}>
                      <Search className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon" className="text-slate-600">
                    <Link to={createPageUrl("AddLink")}>
                      <Plus className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon" className="text-slate-600">
                    <Link to={createPageUrl("Profile")}>
                      <UserIcon className="w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
      <PWAInstallPrompt />
    </>
  );
}