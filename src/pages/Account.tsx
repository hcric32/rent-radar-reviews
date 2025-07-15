import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Edit3, Shield } from "lucide-react";

const userStats = {
  reviewsWritten: 12,
  averageRating: 4.2,
  helpfulVotes: 45,
  yearsActive: 2
};

export default function Account() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" />
                <AvatarFallback className="text-lg">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">John Doe</h1>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Verified Renter
                  </Badge>
                </div>
                <p className="text-muted-foreground">Member since January 2022</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span>{userStats.reviewsWritten} reviews</span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {userStats.averageRating} avg rating
                  </span>
                  <span>{userStats.helpfulVotes} helpful votes</span>
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="John" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Doe" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john.doe@email.com" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Star className="h-5 w-5 text-yellow-400" />
                <div className="flex-1">
                  <p className="font-medium">Review published</p>
                  <p className="text-sm text-muted-foreground">
                    Your review for Sunset Apartments is now live
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">2 days ago</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <MapPin className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium">Property added to watchlist</p>
                  <p className="text-sm text-muted-foreground">
                    Garden View Studio in Portland
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">1 week ago</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Shield className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium">Account verified</p>
                  <p className="text-sm text-muted-foreground">
                    Your renter status has been verified
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">2 weeks ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-primary">{userStats.reviewsWritten}</div>
              <p className="text-sm text-muted-foreground">Reviews Written</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-primary">{userStats.averageRating}</div>
              <p className="text-sm text-muted-foreground">Avg. Rating Given</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-primary">{userStats.helpfulVotes}</div>
              <p className="text-sm text-muted-foreground">Helpful Votes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-primary">{userStats.yearsActive}</div>
              <p className="text-sm text-muted-foreground">Years Active</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}