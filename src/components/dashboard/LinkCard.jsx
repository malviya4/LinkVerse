import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  Star, 
  MoreVertical, 
  Trash2,
  Edit,
  Copy,
  FolderOpen
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Link } from "@/entities/Link";
import { format } from "date-fns";

const categoryColors = {
  social_media: "bg-pink-100 text-pink-800 border-pink-200",
  video: "bg-red-100 text-red-800 border-red-200",
  development: "bg-blue-100 text-blue-800 border-blue-200",
  news: "bg-green-100 text-green-800 border-green-200",
  shopping: "bg-yellow-100 text-yellow-800 border-yellow-200",
  education: "bg-purple-100 text-purple-800 border-purple-200",
  productivity: "bg-orange-100 text-orange-800 border-orange-200",
  design: "bg-indigo-100 text-indigo-800 border-indigo-200",
  business: "bg-slate-100 text-slate-800 border-slate-200",
  entertainment: "bg-rose-100 text-rose-800 border-rose-200",
  research: "bg-teal-100 text-teal-800 border-teal-200",
  documentation: "bg-cyan-100 text-cyan-800 border-cyan-200",
  portfolio: "bg-amber-100 text-amber-800 border-amber-200",
  blog: "bg-lime-100 text-lime-800 border-lime-200",
  other: "bg-gray-100 text-gray-800 border-gray-200"
};

export default function LinkCard({ link, viewMode, onUpdate }) {
  const handleToggleFavorite = async () => {
    await Link.update(link.id, { is_favorite: !link.is_favorite });
    onUpdate();
  };

  const handleDelete = async () => {
    await Link.delete(link.id);
    onUpdate();
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(link.url);
  };

  const handleOpenLink = () => {
    window.open(link.url, '_blank');
  };

  if (viewMode === "list") {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {link.favicon && (
              <img 
                src={link.favicon} 
                alt="" 
                className="w-8 h-8 rounded-lg object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-slate-900 truncate">
                  {link.title}
                </h3>
                {link.is_favorite && (
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                )}
              </div>
              <p className="text-sm text-slate-600 truncate mb-2">
                {link.description || link.url}
              </p>
              <div className="flex items-center gap-2">
                <Badge className={`${categoryColors[link.category]} text-xs`}>
                  {link.category?.replace(/_/g, ' ')}
                </Badge>
                <span className="text-xs text-slate-500">
                  {format(new Date(link.created_date), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenLink}
                className="text-slate-400 hover:text-blue-600"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleToggleFavorite}>
                    <Star className="w-4 h-4 mr-2" />
                    {link.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyUrl}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy URL
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 pb-3">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {link.favicon ? (
                <img 
                  src={link.favicon} 
                  alt="" 
                  className="w-6 h-6 rounded object-cover"
                />
              ) : (
                <div className="w-6 h-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded flex items-center justify-center">
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </div>
              )}
              <span className="text-xs text-slate-500 font-medium truncate">
                {link.domain || new URL(link.url).hostname}
              </span>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-400 hover:text-amber-500"
                onClick={handleToggleFavorite}
              >
                <Star className={`w-3.5 h-3.5 ${link.is_favorite ? 'fill-current text-amber-500' : ''}`} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-600">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleCopyUrl}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy URL
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 leading-tight">
            {link.title}
          </h3>
          
          {link.description && (
            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
              {link.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <Badge className={`${categoryColors[link.category]} text-xs border`}>
              {link.category?.replace(/_/g, ' ')}
            </Badge>
            <span className="text-xs text-slate-500">
              {format(new Date(link.created_date), 'MMM d')}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100">
          <div className="flex items-center justify-between">
            {link.collection && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <FolderOpen className="w-3 h-3" />
                <span>{link.collection}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenLink}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-7 px-3 text-xs font-medium"
            >
              Open <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}