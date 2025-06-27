import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CategorySelector({ 
  open, 
  onOpenChange, 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter(category =>
    category.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-lg font-semibold">Select Category</DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories Grid */}
          <ScrollArea className="h-64">
            <div className="grid grid-cols-1 gap-2 pr-4">
              {filteredCategories.map((category) => (
                <Button
                  key={category.value}
                  variant="ghost"
                  onClick={() => onSelectCategory(category.value)}
                  className={`justify-start h-auto p-3 rounded-xl transition-all duration-200 ${
                    selectedCategory === category.value
                      ? "bg-blue-50 border border-blue-200 text-blue-700"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <span className="text-lg">{category.icon}</span>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">{category.label}</p>
                    </div>
                    {selectedCategory === category.value && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* Current Selection */}
          {selectedCategory && (
            <div className="pt-4 border-t">
              <p className="text-sm text-slate-600 mb-2">Current selection:</p>
              <Badge className="bg-blue-100 text-blue-800">
                {categories.find(cat => cat.value === selectedCategory)?.label}
              </Badge>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}