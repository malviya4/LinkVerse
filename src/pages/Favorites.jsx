import React, { useState, useEffect } from "react";
import { Link } from "@/entities/Link";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Heart, Sparkles } from "lucide-react";

import LinkCard from "../components/dashboard/LinkCard";

export default function Favorites() {
  const [favoriteLinks, setFavoriteLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setIsLoading(true);
    const allLinks = await Link.list("-created_date");
    const favorites = allLinks.filter(link => link.is_favorite);
    setFavoriteLinks(favorites);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              Favorite Links
            </h1>
            <Star className="w-6 h-6 text-amber-500 fill-current" />
          </div>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Your most important and frequently accessed links
          </p>
        </div>

        {/* Favorites Grid */}
        {favoriteLinks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteLinks.map((link) => (
              <LinkCard 
                key={link.id} 
                link={link} 
                viewMode="grid"
                onUpdate={loadFavorites}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No favorites yet
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Star your most important links to see them here. Click the star icon on any link to add it to your favorites.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}