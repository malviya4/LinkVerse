
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "@/entities/Link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search as SearchIcon,
  Filter,
  SortAsc,
  Calendar,
  Tag,
  Globe,
  Sparkles,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Corrected syntax

import SearchFilters from "../components/search/SearchFilters";
import SearchResults from "../components/search/SearchResults";

// Global cache definition. This was part of the original syntax error.
// It's defined globally here and conditionally to ensure it's initialized once.
if (typeof window !== 'undefined' && !window.dataCache) {
  window.dataCache = {
    links: [],
    lastFetch: 0,
    cacheDuration: 5 * 60 * 1000, // 5 minutes in milliseconds

    // Method to check if cache is valid
    isValid: function() {
      return (Date.now() - this.lastFetch) < this.cacheDuration;
    },

    // Method to set cache data
    set: function(data) {
      this.links = data;
      this.lastFetch = Date.now();
    }
  };
}

export default function Search() {
  const [links, setLinks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    collection: "all",
    dateRange: "all"
  });
  const [sortBy, setSortBy] = useState("-created_date");
  const [isLoading, setIsLoading] = useState(true);
  const [filteredLinks, setFilteredLinks] = useState([]);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    setIsLoading(true);
    try {
      // Check if we have cached data first
      // Ensure window.dataCache exists before accessing its properties
      const cachedLinks = typeof window !== 'undefined' && window.dataCache?.links;
      
      if (cachedLinks && typeof window !== 'undefined' && window.dataCache?.isValid?.()) {
        setLinks(cachedLinks);
      } else {
        const data = await Link.list("-created_date"); // Assuming Link.list fetches data
        setLinks(data);
        if (typeof window !== 'undefined' && window.dataCache) {
          window.dataCache.set(data); // Cache the newly fetched data
        }
      }
    } catch (error) {
      console.error("Error loading links:", error);
      // Use cached data as fallback if fetch fails
      if (typeof window !== 'undefined' && window.dataCache?.links) {
        setLinks(window.dataCache.links);
      }
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  // Effect to filter and sort links based on search query, filters, and sort order
  useEffect(() => {
    let currentFiltered = [...links];

    // 1. Apply search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentFiltered = currentFiltered.filter(link => 
        link.title.toLowerCase().includes(lowerCaseQuery) ||
        link.url.toLowerCase().includes(lowerCaseQuery) ||
        link.description?.toLowerCase().includes(lowerCaseQuery) || // Use optional chaining
        link.tags?.some(tag => tag.toLowerCase().includes(lowerCaseQuery)) // Use optional chaining
      );
    }

    // 2. Apply filters
    if (filters.category !== "all") {
      currentFiltered = currentFiltered.filter(link => link.category === filters.category);
    }
    if (filters.collection !== "all") {
      currentFiltered = currentFiltered.filter(link => link.collection === filters.collection);
    }
    // Date range filtering logic (example)
    if (filters.dateRange !== "all") {
        const now = new Date();
        currentFiltered = currentFiltered.filter(link => {
            const linkDate = new Date(link.created_date); // Assuming created_date is a valid date string/timestamp
            switch(filters.dateRange) {
                case "today": 
                    return linkDate.toDateString() === now.toDateString();
                case "last7days": 
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(now.getDate() - 7);
                    return linkDate >= sevenDaysAgo;
                case "last30days": 
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(now.getDate() - 30);
                    return linkDate >= thirtyDaysAgo;
                // Add more date range cases as needed
                default: return true;
            }
        });
    }

    // 3. Apply sorting
    currentFiltered.sort((a, b) => {
      const isAsc = sortBy.startsWith("+");
      const key = sortBy.replace(/^[+-]/, "");

      const valA = a[key];
      const valB = b[key];

      // Handle string comparison for titles, etc.
      if (typeof valA === 'string' && typeof valB === 'string') {
        return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      // Handle numerical comparison for dates, etc.
      return isAsc ? (valA - valB) : (valB - valA);
    });

    setFilteredLinks(currentFiltered);
  }, [links, searchQuery, filters, sortBy]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  // Memoized unique categories and collections for filter options
  const categories = useMemo(() => {
    const uniqueCategories = new Set(links.map(link => link.category).filter(Boolean));
    return ["all", ...Array.from(uniqueCategories)];
  }, [links]);

  const collections = useMemo(() => {
    const uniqueCollections = new Set(links.map(link => link.collection).filter(Boolean));
    return ["all", ...Array.from(uniqueCollections)];
  }, [links]);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <SearchIcon className="mr-3" />
        Search Your Links
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search by title, URL, description, or tags..."
            className="pl-10 pr-4 py-2 rounded-lg border w-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto"
              onClick={() => setSearchQuery("")}
            >
              <X className="w-4 h-4 text-gray-500" />
            </Button>
          )}
        </div>

        {/* Filters and Sort */}
        <div className="flex gap-4 items-center">
          <SearchFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            categories={categories}
            collections={collections}
          />

          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SortAsc className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-created_date">Newest</SelectItem>
              <SelectItem value="+created_date">Oldest</SelectItem>
              <SelectItem value="+title">Title (A-Z)</SelectItem>
              <SelectItem value="-title">Title (Z-A)</SelectItem>
              {/* Add more sort options as needed, e.g., by collection, category, etc. */}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({filteredLinks.length})</TabsTrigger>
          {/* Example: Add tabs for categories or collections if needed */}
          {/* {categories.slice(1).map(cat => ( 
            <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
          ))} */}
        </TabsList>
        <TabsContent value="all">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading links...</p>
          ) : filteredLinks.length === 0 ? (
            <p className="text-center text-gray-500">No links found matching your criteria.</p>
          ) : (
            <SearchResults links={filteredLinks} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
