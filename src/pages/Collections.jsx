import React, { useState, useEffect } from "react";
import { Collection } from "@/entities/Collection";
import { Link } from "@/entities/Link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, 
  Plus, 
  MoreVertical,
  Edit,
  Trash2,
  Link2,
  Palette
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

import CreateCollectionDialog from "../components/collections/CreateCollectionDialog";
import CollectionCard from "../components/collections/CollectionCard";

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [links, setLinks] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [collectionsData, linksData] = await Promise.all([
      Collection.list("-created_date"),
      Link.list()
    ]);
    setCollections(collectionsData);
    setLinks(linksData);
    setIsLoading(false);
  };

  const getCollectionStats = (collectionName) => {
    return links.filter(link => link.collection === collectionName).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              Collections
            </h1>
            <p className="text-slate-600 text-lg">
              Organize your links into themed collections
            </p>
          </div>
          
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Collection
          </Button>
        </div>

        {/* Collections Grid */}
        {collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                linkCount={getCollectionStats(collection.name)}
                onUpdate={loadData}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderOpen className="w-12 h-12 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No collections yet
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Create your first collection to start organizing your links by topics, projects, or themes
              </p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Collection
              </Button>
            </CardContent>
          </Card>
        )}

        <CreateCollectionDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={loadData}
        />
      </div>
    </div>
  );
}