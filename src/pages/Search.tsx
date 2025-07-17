import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, Filter, Star, MapPin, List } from "lucide-react";
import { MapView } from "@/components/MapView";

const mockSearchResults = [
  {
    id: 1,
    name: "Sunny Downtown Loft",
    address: "123 Broadway, New York, NY",
    rating: 4.3,
    reviewCount: 18,
    price: "$2,800/month",
    type: "Loft",
    highlights: ["Great location", "Responsive landlord", "Clean building"]
  },
  {
    id: 2,
    name: "Cozy Brooklyn Apartment",
    address: "456 Atlantic Ave, Brooklyn, NY",
    rating: 3.9,
    reviewCount: 12,
    price: "$2,200/month",
    type: "Apartment",
    highlights: ["Quiet neighborhood", "Good value", "Pet-friendly"]
  },
  {
    id: 3,
    name: "Modern Studio",
    address: "789 Park Ave, New York, NY",
    rating: 4.6,
    reviewCount: 25,
    price: "$1,950/month",
    type: "Studio",
    highlights: ["Newly renovated", "Great amenities", "Excellent management"]
  }
];

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  return (
    <div className="h-screen flex flex-col">
      {/* Search Header */}
      <div className="p-4 border-b bg-background">
        <div className="flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by location, property name, or landlord..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("map")}
          >
            Map
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {viewMode === "map" ? (
          <MapView className="h-full" />
        ) : (
          <div className="h-full overflow-auto p-4">
            <div className="max-w-4xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {mockSearchResults.length} properties found
                </h2>
              </div>

              {mockSearchResults.map((property) => (
                <Card key={property.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{property.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          {property.address}
                        </div>
                      </div>
                      <Badge variant="secondary">{property.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{property.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({property.reviewCount} reviews)
                        </span>
                      </div>
                      <span className="font-semibold text-primary">{property.price}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {property.highlights.map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}