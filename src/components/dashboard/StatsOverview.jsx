import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link2, FolderOpen, Star, TrendingUp } from "lucide-react";

export default function StatsOverview({ links, collections }) {
  const stats = [
    {
      title: "Total Links",
      value: links.length,
      icon: Link2,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      change: "+12% this week"
    },
    {
      title: "Collections",
      value: collections.length,
      icon: FolderOpen,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
      change: "+2 new"
    },
    {
      title: "Favorites",
      value: links.filter(link => link.is_favorite).length,
      icon: Star,
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-50 to-amber-100",
      change: "+5 this month"
    },
    {
      title: "Most Active Category",
      value: getMostActiveCategory(links),
      icon: TrendingUp,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      change: "Development"
    }
  ];

  function getMostActiveCategory(links) {
    const categoryCounts = {};
    links.forEach(link => {
      categoryCounts[link.category] = (categoryCounts[link.category] || 0) + 1;
    });
    const mostActive = Object.entries(categoryCounts).sort(([,a], [,b]) => b - a)[0];
    return mostActive ? mostActive[1] : 0;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200">
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-30`} />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                  <span className="text-xs text-slate-500 font-medium">
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}