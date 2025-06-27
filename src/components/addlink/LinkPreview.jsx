import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Loader2, 
  Image,
  ExternalLink,
  CheckCircle
} from "lucide-react";

export default function LinkPreview({ urlPreview, formData, isAnalyzing }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
          <Globe className="w-5 h-5 text-blue-500" />
          Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
              <p className="text-sm text-slate-600">Analyzing URL...</p>
            </div>
          </div>
        ) : urlPreview ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>Analysis complete</span>
            </div>
            
            {urlPreview.favicon && (
              <div className="flex items-center gap-2">
                <img 
                  src={urlPreview.favicon} 
                  alt="Favicon" 
                  className="w-6 h-6 rounded"
                />
                <span className="text-sm text-slate-600">{urlPreview.domain}</span>
              </div>
            )}
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">
                {urlPreview.title || "No title found"}
              </h3>
              <p className="text-sm text-slate-600 line-clamp-3">
                {urlPreview.description || "No description available"}
              </p>
            </div>
            
            {urlPreview.category && (
              <Badge className="bg-blue-100 text-blue-800">
                {urlPreview.category.replace(/_/g, ' ')}
              </Badge>
            )}
            
            {urlPreview.tags && urlPreview.tags.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Suggested Tags</p>
                <div className="flex flex-wrap gap-1">
                  {urlPreview.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : formData.url ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <ExternalLink className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm text-slate-600">
              Click the analyze button to extract metadata
            </p>
          </div>
        ) : (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <Globe className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm text-slate-600">
              Enter a URL to see the preview
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}