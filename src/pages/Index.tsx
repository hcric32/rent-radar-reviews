import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, TrendingUp, Users, Building } from "lucide-react";

const featuredProperties = [
  {
    id: 1,
    name: "Manhattan Luxury Apartment",
    location: "New York, USA",
    rating: 4.8,
    reviewCount: 127,
    price: "$3,200/month",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    highlights: ["Doorman", "Gym", "Rooftop"]
  },
  {
    id: 2,
    name: "London Victorian House",
    location: "London, UK",
    rating: 4.5,
    reviewCount: 89,
    price: "£2,800/month",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
    highlights: ["Garden", "Period features", "Great transport"]
  },
  {
    id: 3,
    name: "Tokyo Modern Studio",
    location: "Tokyo, Japan",
    rating: 4.7,
    reviewCount: 156,
    price: "¥180,000/month",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    highlights: ["City view", "Modern appliances", "Quiet area"]
  }
];

const globalStats = [
  { label: "Total Properties", value: "15,234", icon: Building },
  { label: "Reviews Written", value: "48,567", icon: Star },
  { label: "Active Users", value: "12,890", icon: Users },
  { label: "Cities Covered", value: "2,450", icon: MapPin }
];

const Index = () => {
  return (
    <div className="h-screen overflow-auto">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Next Home</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Discover rental properties worldwide with honest reviews from real tenants
          </p>
          
          {/* Global Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {globalStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex items-center gap-3">
                  <stat.icon className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Properties */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Featured Properties</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <Card key={property.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img 
                    src={property.image} 
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{property.name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {property.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{property.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({property.reviewCount})
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

        {/* Popular Cities */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Popular Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["New York", "London", "Tokyo", "Paris", "Sydney", "Berlin", "Toronto", "Amsterdam"].map((city) => (
              <Card key={city} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <p className="font-medium">{city}</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.floor(Math.random() * 500 + 100)} properties
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
