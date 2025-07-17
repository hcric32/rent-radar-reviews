import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Heart, Trash2 } from "lucide-react";

const watchlistProperties = [
  {
    id: 1,
    name: "Riverside Apartment",
    address: "321 River St, Brooklyn, NY",
    rating: 4.1,
    reviewCount: 14,
    price: "$2,500/month",
    type: "Apartment",
    dateAdded: "2024-01-15",
    status: "Available"
  },
  {
    id: 2,
    name: "Garden View Studio",
    address: "654 Garden Ave, Queens, NY",
    rating: 4.4,
    reviewCount: 9,
    price: "$1,800/month",
    type: "Studio",
    dateAdded: "2024-01-10",
    status: "Recently Rented"
  }
];

export default function Watchlist() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">My Watchlist</h1>
          <p className="text-muted-foreground">
            Keep track of properties you're interested in
          </p>
        </div>

        {watchlistProperties.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No properties saved yet</h3>
              <p className="text-muted-foreground mb-4">
                Start exploring and save properties you're interested in
              </p>
              <Button>Browse Properties</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {watchlistProperties.map((property) => (
              <Card key={property.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{property.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        {property.address}
                      </div>
                    </div>
                     <div className="flex gap-2">
                       <Badge 
                         variant={property.status === "Available" ? "default" : "secondary"}
                       >
                         {property.status}
                       </Badge>
                       <Button variant="ghost" size="icon" className="text-red-500">
                         <Heart className="h-4 w-4 fill-red-500" />
                       </Button>
                       <Button variant="ghost" size="icon" className="text-destructive">
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{property.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({property.reviewCount} reviews)
                        </span>
                      </div>
                      <span className="font-semibold text-primary">{property.price}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm">
                        Contact
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-muted-foreground">
                    Added on {new Date(property.dateAdded).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}