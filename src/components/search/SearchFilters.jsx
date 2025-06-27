import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Filter, 
  Calendar, 
  Tag, 
  SortAsc, 
  X,
  Hash
} from "lucide-react";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "social_media", label: "Social Media" },
  { value: "video", label: "Videos" },
  { value: "development", label: "Development" },
  { value: "news", label: "News" },
  { value: "shopping", label: "Shopping" },
  { value: "education", label: "Education" },
  { value: "productivity", label: "Productivity" },
  { value: "design", label: "Design" },
  { value: "business", label: "Business" },
  { value: "entertainment", label: "Entertainment" },
  { value: "research", label: "Research" },
  { value: "documentation", label: "Documentation" },
  { value: "portfolio", label: "Portfolio" },
  { value: "blog", label: "Blog" },
  { value: "other", label: "Other" }
];

const dateRanges = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" }
];

const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "oldest", label: "Oldest First" },
  { value: "alphabetical", label: "Alphabetical" },
  { value: "favorites", label: "Favorites First" }
];

export default function SearchFilters({ 
  filters, 
  onFiltersChange, 
  allTags, 
  sortBy, 
  onSortChange 
}) {
  const [tagInput, setTagInput] = React.useState("");

  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const addTag = (tag) => {
    if (tag && !filters.tags.includes(tag)) {
      updateFilter("tags", [...filters.tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    updateFilter("tags", filters.tags.filter(tag => tag !== tagToRemove));
  };

  const clearAllFilters = () => {
    onFiltersChange({
      category: "all",
      dateRange: "all",
      tags: []
    });
    onSortChange("recent");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
            <SelectTrigger className="w-40 bg-white border-slate-200 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <Select value={filters.dateRange} onValueChange={(value) => updateFilter("dateRange", value)}>
            <SelectTrigger className="w-32 bg-white border-slate-200 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dateRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SortAsc className="w-4 h-4 text-slate-500" />
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-40 bg-white border-slate-200 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={clearAllFilters}
          className="border-slate-200 hover:bg-slate-50 rounded-lg"
        >
          Clear All
        </Button>
      </div>

      {/* Tag Filter */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-slate-500" />
          <Input
            placeholder="Filter by tags..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag(tagInput);
              }
            }}
            className="w-48 bg-white border-slate-200 rounded-lg h-9"
          />
          <Button
            onClick={() => addTag(tagInput)}
            size="sm"
            variant="outline"
            className="border-slate-200 hover:bg-slate-50 rounded-lg"
          >
            Add
          </Button>
        </div>

        {/* Popular Tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-slate-500 font-medium mr-2">Popular tags:</span>
            {allTags.slice(0, 8).map((tag) => (
              <Button
                key={tag}
                variant="ghost"
                size="sm"
                onClick={() => addTag(tag)}
                className="h-6 px-2 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
              >
                #{tag}
              </Button>
            ))}
          </div>
        )}

        {/* Active Tag Filters */}
        {filters.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-slate-500 font-medium mr-2">Active filters:</span>
            {filters.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
              >
                #{tag}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 hover:bg-purple-300 rounded-full"
                  onClick={() => removeTag(tag)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}