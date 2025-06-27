import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Tag } from "lucide-react";

export default function SmartCategorization({ category, categories }) {
  const selectedCategory = categories.find(cat => cat.value === category);
  
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Smart Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedCategory ? (
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
            <span className="text-2xl">{selectedCategory.icon}</span>
            <div>
              <p className="font-semibold text-slate-900">{selectedCategory.label}</p>
              <p className="text-sm text-slate-600">Auto-categorized</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <Tag className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm text-slate-600">
              Select a category to organize your link
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}