import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import LinkCard from "./LinkCard";

export default function RecentActivity({ links, onUpdate }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-slate-600" />
        <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
      </div>
      
      {links.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link) => (
            <LinkCard 
              key={link.id} 
              link={link} 
              viewMode="grid"
              onUpdate={onUpdate}
            />
          ))}
        </div>
      ) : (
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60">
          <CardContent className="p-12 text-center">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No recent activity</h3>
            <p className="text-slate-600">Your recently saved links will appear here</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}