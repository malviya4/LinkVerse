
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  Upload, 
  Trash2, 
  BarChart3,
  FileJson,
  FileText,
  Database,
  AlertTriangle
} from "lucide-react";
import { Link as LinkEntity } from "@/entities/Link";
import { Collection } from "@/entities/Collection";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DataExport({ stats, onDataDeleted }) {
  const [exportingJson, setExportingJson] = useState(false);
  const [exportingCsv, setExportingCsv] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const exportData = async (format = 'json') => {
    if (format === 'json') {
      setExportingJson(true);
    } else {
      setExportingCsv(true);
    }

    try {
      const [links, collections] = await Promise.all([
        LinkEntity.list(),
        Collection.list()
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        stats: stats,
        links: links,
        collections: collections
      };

      let content, filename, mimeType;

      if (format === 'json') {
        content = JSON.stringify(exportData, null, 2);
        filename = `linkverse-export-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      } else if (format === 'csv') {
        // Convert links to CSV
        const csvHeaders = ['Title', 'URL', 'Description', 'Category', 'Tags', 'Collection', 'Created Date'];
        const csvRows = links.map(link => [
          link.title || '',
          link.url || '',
          link.description || '',
          link.category || '',
          (link.tags || []).join('; '),
          link.collection || '',
          link.created_date || ''
        ]);
        
        content = [csvHeaders, ...csvRows]
          .map(row => row.map(field => `"${field}"`).join(','))
          .join('\n');
        filename = `linkverse-links-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      }

      // Create and trigger download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }

    if (format === 'json') {
      setExportingJson(false);
    } else {
      setExportingCsv(false);
    }
  };

  const deleteAllData = async () => {
    setIsDeleting(true);
    try {
      // Get all links and collections
      const [links, collections] = await Promise.all([
        LinkEntity.list(),
        Collection.list()
      ]);

      // Delete all links
      const linkDeletions = links.map(link => LinkEntity.delete(link.id));
      
      // Delete all collections
      const collectionDeletions = collections.map(collection => Collection.delete(collection.id));

      // Wait for all deletions to complete
      await Promise.all([...linkDeletions, ...collectionDeletions]);

      alert('All data has been successfully deleted.');
      
      // Notify parent component to refresh data
      if (onDataDeleted) {
        onDataDeleted();
      }

    } catch (error) {
      console.error('Data deletion failed:', error);
      alert('Failed to delete all data. Some items may not have been deleted.');
    }
    setIsDeleting(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Data Overview */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            Your Data Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <Database className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">{stats.totalLinks}</p>
              <p className="text-sm text-slate-600">Total Links</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <Database className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">{stats.totalCollections}</p>
              <p className="text-sm text-slate-600">Collections</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <Database className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">{stats.categoriesUsed.length}</p>
              <p className="text-sm text-slate-600">Categories Used</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-500" />
            Export Your Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-600">
            Download your Linkverse data in different formats for backup or migration purposes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-200 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <FileJson className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">JSON Export</h3>
              </div>
              <p className="text-sm text-slate-600">
                Complete data export including all metadata, perfect for backups.
              </p>
              <Button
                onClick={() => exportData('json')}
                disabled={exportingJson}
                variant="outline"
                className="w-full"
              >
                {exportingJson ? 'Exporting...' : 'Export as JSON'}
              </Button>
            </div>

            <div className="p-4 border border-slate-200 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                <h3 className="font-semibold">CSV Export</h3>
              </div>
              <p className="text-sm text-slate-600">
                Spreadsheet-friendly format, great for analysis and sharing.
              </p>
              <Button
                onClick={() => exportData('csv')}
                disabled={exportingCsv}
                variant="outline"
                className="w-full"
              >
                {exportingCsv ? 'Exporting...' : 'Export as CSV'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-slate-500" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-slate-900">Storage Used</h3>
              <p className="text-sm text-slate-600">
                Approximately {Math.round((stats.totalLinks * 0.5 + stats.totalCollections * 0.1) * 100) / 100} KB
              </p>
            </div>
            <Badge variant="outline">Light Usage</Badge>
          </div>
          
          <Separator />
          
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">Danger Zone</h3>
                <p className="text-sm text-red-700 mb-3">
                  This action will permanently delete all your links and collections. This cannot be undone.
                </p>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-100"
                      disabled={isDeleting || (stats.totalLinks === 0 && stats.totalCollections === 0)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {isDeleting ? 'Deleting...' : 'Delete All Data'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        Delete All Data
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-2">
                        <p>Are you absolutely sure you want to delete all your data?</p>
                        <p className="font-medium">This will permanently delete:</p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>{stats.totalLinks} links</li>
                          <li>{stats.totalCollections} collections</li>
                          <li>All your tags and categories</li>
                          <li>All your personal notes</li>
                        </ul>
                        <p className="text-red-600 font-medium">This action cannot be undone.</p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={deleteAllData}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Yes, Delete Everything'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
