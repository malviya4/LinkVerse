import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SearchX, Loader2 } from "lucide-react";
import LinkCard from "../dashboard/LinkCard";

export default function SearchResults({ links, searchQuery, isLoading, onUpdate }) {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your links...</p>
        </CardContent>
      </Card>
    );
  }

  if (links.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60">
        <CardContent className="p-12 text-center">
          <SearchX className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {searchQuery ? "No links found" : "No links match your filters"}
          </h3>
          <p className="text-slate-600 max-w-md mx-auto">
            {searchQuery 
              ? "Try adjusting your search terms or filters to find what you're looking for."
              : "Try different filter combinations or add some links first."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-slate-600">
          Found <span className="font-semibold text-slate-900">{links.length}</span> links
          {searchQuery && (
            <span> for "<span className="font-medium">{searchQuery}</span>"</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {links.map((link) => (
          <LinkCard 
            key={link.id} 
            link={link} 
            viewMode="grid"
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
}