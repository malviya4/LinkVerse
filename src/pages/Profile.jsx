import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Link as LinkEntity } from "@/entities/Link";
import { Collection } from "@/entities/Collection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User as UserIcon, 
  Settings, 
  Shield, 
  BarChart3,
  Calendar,
  Link2,
  FolderOpen,
  Star,
  Save,
  LogOut,
  Trash2,
  Download,
  Upload
} from "lucide-react";
import { format } from "date-fns";

import UserStats from "../components/profile/UserStats";
import DataExport from "../components/profile/DataExport";
import AccountSettings from "../components/profile/AccountSettings";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalCollections: 0,
    totalFavorites: 0,
    linksThisMonth: 0,
    categoriesUsed: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: "",
    bio: "",
    website: "",
    location: "",
    preferences: {
      theme: "light",
      defaultView: "grid",
      autoAnalyze: true,
      emailNotifications: true
    }
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setProfileData({
        full_name: userData.full_name || "",
        bio: userData.bio || "",
        website: userData.website || "",
        location: userData.location || "",
        preferences: {
          theme: userData.preferences?.theme || "light",
          defaultView: userData.preferences?.defaultView || "grid",
          autoAnalyze: userData.preferences?.autoAnalyze ?? true,
          emailNotifications: userData.preferences?.emailNotifications ?? true
        }
      });

      // Load user statistics in background
      const [links, collections] = await Promise.all([
        LinkEntity.list(),
        Collection.list()
      ]);

      const now = new Date();
      const thisMonth = links.filter(link => {
        const linkDate = new Date(link.created_date);
        return linkDate.getMonth() === now.getMonth() && linkDate.getFullYear() === now.getFullYear();
      }).length;

      const categoriesUsed = [...new Set(links.map(link => link.category).filter(Boolean))];

      setStats({
        totalLinks: links.length,
        totalCollections: collections.length,
        totalFavorites: links.filter(link => link.is_favorite).length,
        linksThisMonth: thisMonth,
        categoriesUsed
      });

    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleDataDeleted = () => {
    // Reload stats after data deletion
    loadUserData();
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData(profileData);
      setUser(prev => ({ ...prev, ...profileData }));
    } catch (error) {
      console.error("Error saving profile:", error);
    }
    setIsSaving(false);
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await User.logout();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Profile & Settings
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Manage your account and customize your experience
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Profile Overview Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-semibold text-slate-900">{user?.full_name || 'User'}</h2>
                <p className="text-slate-600 text-sm">{user?.email || 'Loading...'}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    {user?.role === 'admin' ? 'Administrator' : 'User'}
                  </Badge>
                  {user?.created_date && (
                    <span className="text-xs text-slate-500">
                      Joined {format(new Date(user.created_date), 'MMM yyyy')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <UserStats stats={stats} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl p-1 grid grid-cols-3 sm:inline-grid sm:w-auto">
            <TabsTrigger value="profile" className="rounded-lg px-2 sm:px-6 flex items-center gap-2 text-xs sm:text-sm">
              <UserIcon className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg px-2 sm:px-6 flex items-center gap-2 text-xs sm:text-sm">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="data" className="rounded-lg px-2 sm:px-6 flex items-center gap-2 text-xs sm:text-sm">
              <BarChart3 className="w-4 h-4" />
              Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <UserIcon className="w-5 h-5 text-blue-500" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profileData.website}
                      onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    placeholder="City, Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <Separator />

                <Button 
                  onClick={handleSaveProfile}
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
                      Save Profile
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AccountSettings 
              preferences={profileData.preferences}
              onPreferencesChange={(prefs) => setProfileData({...profileData, preferences: prefs})}
              onSave={handleSaveProfile}
              isSaving={isSaving}
            />
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <DataExport stats={stats} onDataDeleted={handleDataDeleted} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}