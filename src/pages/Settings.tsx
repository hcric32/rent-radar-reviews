import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, Eye, Globe, Moon, Sun, Smartphone } from "lucide-react";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    emailReviews: true,
    emailWatchlist: false,
    pushReviews: true,
    pushWatchlist: true,
    weeklyDigest: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    reviewsVisible: true,
    showLocation: false
  });

  const [theme, setTheme] = useState("system");

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and privacy settings
          </p>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Email Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-reviews">New reviews on watched properties</Label>
                    <p className="text-sm text-muted-foreground">Get notified when properties in your watchlist receive new reviews</p>
                  </div>
                  <Switch
                    id="email-reviews"
                    checked={notifications.emailReviews}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, emailReviews: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-watchlist">Watchlist updates</Label>
                    <p className="text-sm text-muted-foreground">Property availability and price changes</p>
                  </div>
                  <Switch
                    id="email-watchlist"
                    checked={notifications.emailWatchlist}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, emailWatchlist: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-digest">Weekly digest</Label>
                    <p className="text-sm text-muted-foreground">Summary of new properties and reviews in your area</p>
                  </div>
                  <Switch
                    id="weekly-digest"
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, weeklyDigest: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Push Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-reviews">Review interactions</Label>
                    <p className="text-sm text-muted-foreground">When someone finds your review helpful</p>
                  </div>
                  <Switch
                    id="push-reviews"
                    checked={notifications.pushReviews}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, pushReviews: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-watchlist">Watchlist alerts</Label>
                    <p className="text-sm text-muted-foreground">Immediate alerts for watched properties</p>
                  </div>
                  <Switch
                    id="push-watchlist"
                    checked={notifications.pushWatchlist}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, pushWatchlist: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Visibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="profile-visible">Public profile</Label>
                <p className="text-sm text-muted-foreground">Allow other users to view your profile</p>
              </div>
              <Switch
                id="profile-visible"
                checked={privacy.profileVisible}
                onCheckedChange={(checked) =>
                  setPrivacy(prev => ({ ...prev, profileVisible: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reviews-visible">Public reviews</Label>
                <p className="text-sm text-muted-foreground">Show your reviews to other users</p>
              </div>
              <Switch
                id="reviews-visible"
                checked={privacy.reviewsVisible}
                onCheckedChange={(checked) =>
                  setPrivacy(prev => ({ ...prev, reviewsVisible: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-location">Show location</Label>
                <p className="text-sm text-muted-foreground">Display your general location on your profile</p>
              </div>
              <Switch
                id="show-location"
                checked={privacy.showLocation}
                onCheckedChange={(checked) =>
                  setPrivacy(prev => ({ ...prev, showLocation: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme-select">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Data & Storage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Data & Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Download your data</Label>
                <p className="text-sm text-muted-foreground">Export all your reviews and account data</p>
              </div>
              <Button variant="outline">Download</Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-destructive">Delete account</Label>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Changes */}
        <div className="flex justify-end">
          <Button size="lg">Save All Changes</Button>
        </div>
      </div>
    </div>
  );
}