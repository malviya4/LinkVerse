
import React, { useState, useEffect } from "react";
import { Link } from "@/entities/Link";
import { Collection } from "@/entities/Collection";
import { Button } from "@/components/ui/button";
import { Link as RouterLink } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Plus, 
  Grid3X3, 
  List, 
  Star,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import StatsOverview from "../components/dashboard/StatsOverview";
import LinkCard from "../components/dashboard/LinkCard";
import RecentActivity from "../components/dashboard/RecentActivity";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [collections, setCollections] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Check if we have cached data from layout
      const cachedLinks = window.dataCache?.links;
      const cachedCollections = window.dataCache?.collections;
      
      if (cachedLinks && cachedCollections && window.dataCache?.isValid?.()) {
        setLinks(cachedLinks);
        setCollections(cachedCollections);
      } else {
        const [linksData, collectionsData] = await Promise.all([
          Link.list("-created_date", 50),
          Collection.list("-created_date", 20)
        ]);
        setLinks(linksData);
        setCollections(collectionsData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const recentLinks = links.slice(0, 5);
  const favoriteLinks = links.filter(link => link.is_favorite);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
        
        {/* Hero Section */}
        <div className="relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 md:gap-6">
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                  Your Linkverse
                </h1>
                <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500 shrink-0" />
              </div>
              <p className="text-slate-600 text-base lg:text-lg">
                {links.length > 0 
                  ? `${links.length} links organized and ready to explore`
                  : "Start building your personal web library"
                }
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <RouterLink to={createPageUrl("AddLink")} className="flex-1 sm:flex-none">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </RouterLink>
            </div>
          </div>
        </div>

        <StatsOverview links={links} collections={collections} />

        {/* Main Content */}
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl p-1 w-full sm:w-auto">
              <TabsTrigger value="all" className="rounded-lg px-4 sm:px-6 flex-1 sm:flex-none text-sm">All Links</TabsTrigger>
              <TabsTrigger value="recent" className="rounded-lg px-4 sm:px-6 flex-1 sm:flex-none text-sm">Recent</TabsTrigger>
              <TabsTrigger value="favorites" className="rounded-lg px-3 sm:px-6 flex-1 sm:flex-none text-sm">
                <Star className="w-4 h-4 mr-1 sm:mr-2 text-amber-500 fill-current" />
                <span className="hidden sm:inline">Favorites</span>
                <span className="sm:hidden">★</span>
              </TabsTrigger>
            </TabsList>
            <div className="flex bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl p-1 w-full sm:w-auto shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`rounded-lg flex-1 sm:flex-none px-3 py-2 transition-none ${
                  viewMode === "grid" 
                    ? "bg-blue-500 text-white shadow-md hover:bg-blue-500 hover:text-white" 
                    : "text-slate-600 hover:text-slate-600 hover:bg-transparent"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="ml-2 sm:hidden">Grid</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={`rounded-lg flex-1 sm:flex-none px-3 py-2 transition-none ${
                  viewMode === "list" 
                    ? "bg-blue-500 text-white shadow-md hover:bg-blue-500 hover:text-white" 
                    : "text-slate-600 hover:text-slate-600 hover:bg-transparent"
                }`}
              >
                <List className="w-4 h-4" />
                <span className="ml-2 sm:hidden">List</span>
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="space-y-6">
            {links.length > 0 ? (
              <div className={`grid gap-4 md:gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1"
              }`}>
                {links.map((link) => (
                  <LinkCard 
                    key={link.id} 
                    link={link} 
                    viewMode={viewMode}
                    onUpdate={loadData}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 md:py-16">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ExternalLink className="w-10 h-10 md:w-12 md:h-12 text-blue-500" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">
                  Your linkverse awaits
                </h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto text-sm md:text-base px-4">
                  Start saving links to build your personal web library
                </p>
                <RouterLink to={createPageUrl("AddLink")}>
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Link
                  </Button>
                </RouterLink>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <RecentActivity links={recentLinks} onUpdate={loadData} />
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            {favoriteLinks.length > 0 ? (
              <div className={`grid gap-4 md:gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1"
              }`}>
                {favoriteLinks.map((link) => (
                  <LinkCard 
                    key={link.id} 
                    link={link} 
                    viewMode={viewMode}
                    onUpdate={loadData}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 md:py-16">
                <Star className="w-12 h-12 md:w-16 md:h-16 text-amber-400 mx-auto mb-4 fill-current" />
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">No favorites yet</h3>
                <p className="text-slate-600 text-sm md:text-base">Star your most important links to see them here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
