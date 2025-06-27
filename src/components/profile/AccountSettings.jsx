
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Palette, 
  Grid3X3,
  Zap,
  Bell,
  Save
} from "lucide-react";

export default function AccountSettings({ preferences, onPreferencesChange, onSave, isSaving }) {
  const updatePreference = (key, value) => {
    onPreferencesChange({
      ...preferences,
      [key]: value
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Settings className="w-5 h-5 text-blue-500" />
          Account Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-4 sm:p-6">
        
        {/* Theme Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-slate-600" />
            <h3 className="font-semibold text-slate-900">Appearance</h3>
          </div>
          
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={preferences.theme} onValueChange={(value) => updatePreference('theme', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Default View</Label>
            <Select value={preferences.defaultView} onValueChange={(value) => updatePreference('defaultView', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid View</SelectItem>
                <SelectItem value="list">List View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Functionality Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-slate-600" />
            <h3 className="font-semibold text-slate-900">Functionality</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="space-y-1 flex-1">
              <Label>Auto-analyze Links</Label>
              <p className="text-sm text-slate-600">
                Automatically extract metadata when adding links
              </p>
            </div>
            <div className="self-end sm:self-center">
              <Switch
                checked={preferences.autoAnalyze}
                onCheckedChange={(checked) => updatePreference('autoAnalyze', checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Notification Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-600" />
            <h3 className="font-semibold text-slate-900">Notifications</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="space-y-1 flex-1">
              <Label>Email Notifications</Label>
              <p className="text-sm text-slate-600">
                Receive updates and tips via email
              </p>
            </div>
            <div className="self-end sm:self-center">
              <Switch
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) => updatePreference('emailNotifications', checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        <Button 
          onClick={onSave}
          disabled={isSaving}
          className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
