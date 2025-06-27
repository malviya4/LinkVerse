import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, 
  Link2, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Lock,
  Unlock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Collection } from "@/entities/Collection";

export default function CollectionCard({ collection, linkCount, onUpdate }) {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this collection?")) {
      await Collection.delete(collection.id);
      onUpdate();
    }
  };

  const handleTogglePrivate = async () => {
    await Collection.update(collection.id, { 
      is_private: !collection.is_private 
    });
    onUpdate();
  };

  return (
    <Card className="group bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: collection.color || '#4f8ff7' }}
          >
            <FolderOpen className="w-6 h-6 text-white" />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-slate-400 hover:text-slate-600"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit Collection
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTogglePrivate}>
                {collection.is_private ? (
                  <>
                    <Unlock className="w-4 h-4 mr-2" />
                    Make Public
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Make Private
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
            {collection.name}
            {collection.is_private && (
              <Lock className="w-3 h-3 text-slate-500" />
            )}
          </h3>
          {collection.description && (
            <p className="text-sm text-slate-600 line-clamp-2">
              {collection.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link2 className="w-4 h-4" />
            <span>{linkCount} links</span>
          </div>
          
          <Badge variant="outline" className="text-xs">
            {collection.is_private ? "Private" : "Public"}
          </Badge>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full border-slate-200 hover:bg-slate-50 rounded-lg"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Links
        </Button>
      </CardContent>
    </Card>
  );
}