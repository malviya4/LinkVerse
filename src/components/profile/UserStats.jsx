import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Link2, 
  FolderOpen, 
  Star, 
  TrendingUp,
  Calendar,
  Tag
} from "lucide-react";

export default function UserStats({ stats }) {
  const statCards = [
    {
      title: "Total Links",
      value: stats.totalLinks,
      icon: Link2,
      color: "bg-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Collections",
      value: stats.totalCollections,
      icon: FolderOpen,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Favorites",
      value: stats.totalFavorites,
      icon: Star,
      color: "bg-amber-500",
      bgColor: "bg-amber-50"
    },
    {
      title: "This Month",
      value: stats.linksThisMonth,
      icon: Calendar,
      color: "bg-purple-500",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Categories Used */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="w-5 h-5 text-blue-500" />
            Categories You Use
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.categoriesUsed.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {stats.categoriesUsed.map((category, index) => (
                <Badge key={index} variant="outline" className="capitalize">
                  {category.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-sm">No categories used yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}