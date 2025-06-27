
import React, { useState, useEffect, useRef } from "react";
import { Link } from "@/entities/Link";
import { Collection } from "@/entities/Collection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { InvokeLLM } from "@/integrations/Core";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft,
  Globe,
  Loader2,
  CheckCircle,
  Image,
  FileText,
  Tag,
  Edit,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import LinkPreview from "../components/addlink/LinkPreview";
import TagInput from "../components/addlink/TagInput";
import CategorySelector from "../components/addlink/CategorySelector";

export default function AddLink() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    description: "",
    category: "",
    tags: [],
    collection: "",
    notes: "",
    is_favorite: false
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlPreview, setUrlPreview] = useState(null);
  const [collections, setCollections] = useState([]);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const debounceTimeout = useRef(null);

  React.useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    const data = await Collection.list();
    setCollections(data);
  };

  // Helper function to validate URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Auto-suggest collection based on category
  const suggestCollection = (category) => {
    if (!category || collections.length === 0) return;

    // Find collection that matches category or has similar theme
    const categoryToCollectionMap = {
      'development': ['coding', 'dev', 'development', 'tech', 'programming'],
      'design': ['design', 'ui', 'ux', 'creative', 'graphics'],
      'business': ['business', 'work', 'professional', 'corporate'],
      'education': ['learning', 'education', 'courses', 'tutorials'],
      'entertainment': ['entertainment', 'fun', 'games', 'movies'],
      'news': ['news', 'articles', 'current', 'updates'],
      'shopping': ['shopping', 'products', 'buy', 'store'],
      'research': ['research', 'study', 'academic', 'papers'],
      'documentation': ['docs', 'documentation', 'guides', 'reference'],
      'productivity': ['productivity', 'tools', 'utilities', 'apps'],
      'social_media': ['social', 'media', 'networking', 'community'],
      'video': ['videos', 'youtube', 'streaming', 'media'],
      'portfolio': ['portfolio', 'showcase', 'personal', 'work'],
      'blog': ['blog', 'articles', 'writing', 'content']
    };

    const keywords = categoryToCollectionMap[category] || [];

    const matchingCollection = collections.find(collection => {
      const collectionName = collection.name.toLowerCase();
      return keywords.some(keyword => collectionName.includes(keyword)) ||
             collectionName.includes(category);
    });

    // Only suggest if no collection is currently selected
    if (matchingCollection && !formData.collection) {
      setFormData(prev => ({
        ...prev,
        collection: matchingCollection.name
      }));
    }
  };

  const analyzeUrl = async (urlToAnalyze) => {
    if (!urlToAnalyze || !isValidUrl(urlToAnalyze)) return;

    setIsAnalyzing(true);
    setUrlPreview(null);
    try {
      const result = await InvokeLLM({
        prompt: `Analyze this URL and extract metadata: ${urlToAnalyze}

        Please provide:
        1. Page title
        2. Brief description (1-2 sentences)
        3. Best category from: social_media, video, development, news, shopping, education, productivity, design, business, entertainment, research, documentation, portfolio, blog, other
        4. Domain name
        5. Suggested tags (3-5 relevant tags)
        6. Favicon URL (if possible)

        Focus on accuracy and relevance. Be concise but informative.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            category: { type: "string" },
            domain: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            favicon: { type: "string" }
          }
        }
      });

      setUrlPreview(result);
      
      // Update form data while preserving the URL
      setFormData(prev => ({
        ...prev,
        url: urlToAnalyze, // Explicitly preserve the URL
        title: result.title || prev.title,
        description: result.description || prev.description,
        category: result.category || prev.category,
        tags: result.tags || prev.tags,
        domain: result.domain
      }));

      // Auto-suggest collection after category is determined
      if (result.category) {
        setTimeout(() => suggestCollection(result.category), 100);
      }
    } catch (error) {
      console.error("Error analyzing URL:", error);
    }
    setIsAnalyzing(false);
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setFormData(prev => ({ ...prev, url: newUrl })); // Use functional update

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (newUrl.trim() && isValidUrl(newUrl.trim())) {
      debounceTimeout.current = setTimeout(() => {
        analyzeUrl(newUrl.trim());
      }, 300); // Reduced from 500ms to 300ms for faster detection
    } else {
      setUrlPreview(null);
      // Removed the clearing of other fields here, as per the fix.
      // Now, only the URL preview is cleared if the URL becomes invalid or empty.
    }
  };

  // Watch for category changes to suggest collections
  // This useEffect ensures suggestion happens if category is manually picked or if collections load later
  React.useEffect(() => {
    if (formData.category) {
      suggestCollection(formData.category);
    }
  }, [formData.category, collections]); // Dependency on collections ensures it runs if collections are fetched/updated

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Determine domain: use preview's domain or extract from formData.url if valid
      const domainToUse = urlPreview?.domain || (isValidUrl(formData.url) ? new URL(formData.url).hostname : '');
      const faviconToUse = urlPreview?.favicon;

      await Link.create({
        ...formData,
        domain: domainToUse,
        favicon: faviconToUse,
        // Convert empty string collection to null if backend expects null for no collection
        collection: formData.collection === "" ? null : formData.collection
      });
      
      // Invalidate cache after creating new link
      if (window.invalidateDataCache) {
        window.invalidateDataCache();
      }
      
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Error saving link:", error);
    }
    setIsSubmitting(false);
  };

  const categories = [
    { value: "social_media", label: "Social Media", icon: "👥", color: "bg-pink-100 text-pink-800" },
    { value: "video", label: "Videos", icon: "🎥", color: "bg-red-100 text-red-800" },
    { value: "development", label: "Development", icon: "💻", color: "bg-blue-100 text-blue-800" },
    { value: "news", label: "News", icon: "📰", color: "bg-green-100 text-green-800" },
    { value: "shopping", label: "Shopping", icon: "🛒", color: "bg-yellow-100 text-yellow-800" },
    { value: "education", label: "Education", icon: "🎓", color: "bg-purple-100 text-purple-800" },
    { value: "productivity", label: "Productivity", icon: "⚡", color: "bg-orange-100 text-orange-800" },
    { value: "design", label: "Design", icon: "🎨", color: "bg-indigo-100 text-indigo-800" },
    { value: "business", label: "Business", icon: "💼", color: "bg-slate-100 text-slate-800" },
    { value: "entertainment", label: "Entertainment", icon: "🎬", color: "bg-rose-100 text-rose-800" },
    { value: "research", label: "Research", icon: "🔬", color: "bg-teal-100 text-teal-800" },
    { value: "documentation", label: "Documentation", icon: "📚", color: "bg-cyan-100 text-cyan-800" },
    { value: "portfolio", label: "Portfolio", icon: "🌟", color: "bg-amber-100 text-amber-800" },
    { value: "blog", label: "Blog", icon: "✍️", color: "bg-lime-100 text-lime-800" },
    { value: "other", label: "Other", icon: "📎", color: "bg-gray-100 text-gray-800" }
  ];

  const selectedCategory = categories.find(cat => cat.value === formData.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">

        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="rounded-xl border-slate-200 hover:bg-slate-50 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Add New Link</h1>
            <p className="text-slate-600 mt-1 text-sm md:text-base">Save and organize your web discoveries</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm">
              <CardHeader className="pb-4 md:pb-6 px-4 md:px-6">
                <CardTitle className="flex items-center gap-2 text-slate-900 text-lg md:text-xl">
                  <Globe className="w-5 h-5 text-blue-500" />
                  Link Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6 px-4 md:px-6">
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">

                  {/* URL Input */}
                  <div className="space-y-2">
                    <Label htmlFor="url" className="text-slate-700 font-medium">
                      URL *
                    </Label>
                    <div className="relative">
                      <Input
                        id="url"
                        type="url"
                        value={formData.url}
                        onChange={handleUrlChange}
                        placeholder="https://example.com"
                        className="bg-slate-50/50 border-slate-200 focus:border-blue-300 rounded-xl pr-10"
                        required
                      />
                      {isAnalyzing && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-slate-700 font-medium">
                      Title *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                      placeholder="Enter a descriptive title"
                      className="bg-slate-50/50 border-slate-200 focus:border-blue-300 rounded-xl"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-700 font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                      placeholder="Brief description or notes about this link"
                      rows={3}
                      className="bg-slate-50/50 border-slate-200 focus:border-blue-300 rounded-xl resize-none"
                    />
                  </div>

                  {/* Category Section */}
                  <div className="space-y-3">
                    <Label className="text-slate-700 font-medium">Category</Label>
                    {selectedCategory ? (
                      <div className="flex items-center gap-3 p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-xl sm:text-2xl">{selectedCategory.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">{selectedCategory.label}</p>
                          <p className="text-xs sm:text-sm text-slate-600">Selected category</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowCategorySelector(true)}
                          className="text-slate-400 hover:text-slate-600 shrink-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCategorySelector(true)}
                        className="w-full justify-start h-auto p-3 sm:p-4 bg-slate-50 border-slate-200 hover:bg-slate-100 rounded-xl"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center shrink-0">
                            <Tag className="w-4 h-4 text-slate-500" />
                          </div>
                          <div className="text-left min-w-0">
                            <p className="font-medium text-slate-700 text-sm sm:text-base">Select Category</p>
                            <p className="text-xs sm:text-sm text-slate-500">Choose a category for this link</p>
                          </div>
                        </div>
                      </Button>
                    )}
                  </div>

                  {/* Tags */}
                  <TagInput
                    tags={formData.tags}
                    onChange={(tags) => setFormData(prev => ({...prev, tags}))}
                  />

                  {/* Collection with Smart Suggestion */}
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Collection</Label>
                    <Select
                      value={formData.collection}
                      onValueChange={(value) => setFormData(prev => ({...prev, collection: value}))}
                    >
                      <SelectTrigger className="bg-slate-50/50 border-slate-200 focus:border-blue-300 rounded-xl">
                        <SelectValue placeholder="Select a collection (auto-suggested)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={null}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-300" />
                            No Collection
                          </div>
                        </SelectItem>
                        {collections.map((collection) => (
                          <SelectItem key={collection.id} value={collection.name}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: collection.color || '#4f8ff7' }} // Default color if not provided
                              />
                              {collection.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* Show auto-suggestion message only if a collection is selected AND it exists in the list */}
                    {formData.collection && collections.some(c => c.name === formData.collection) && (
                      <p className="text-xs text-green-600">
                        ✓ Auto-suggested based on category
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-slate-700 font-medium">
                      Personal Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                      placeholder="Add personal notes or reminders"
                      rows={2}
                      className="bg-slate-50/50 border-slate-200 focus:border-blue-300 rounded-xl resize-none"
                    />
                  </div>

                  <Separator className="bg-slate-200" />

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(createPageUrl("Dashboard"))}
                      className="rounded-xl border-slate-200 hover:bg-slate-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !formData.url || !formData.title}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl px-6"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Save Link
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Preview */}
          <div className="space-y-6">
            <LinkPreview
              urlPreview={urlPreview}
              formData={formData}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>

        <CategorySelector
          open={showCategorySelector}
          onOpenChange={setShowCategorySelector}
          categories={categories}
          selectedCategory={formData.category}
          onSelectCategory={(category) => {
            setFormData(prev => ({...prev, category}));
            setShowCategorySelector(false);
          }}
        />
      </div>
    </div>
  );
}
