import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Plus, Edit3, Eye } from "lucide-react";

const myReviews = [
  {
    id: 1,
    propertyName: "Sunset Apartments",
    address: "123 Sunset Blvd, Los Angeles, CA",
    rating: 4,
    reviewText: "Great location and responsive management. The apartment was clean and well-maintained during my 2-year lease.",
    datePosted: "2024-01-20",
    status: "published",
    helpful: 12,
    landlordResponse: null
  },
  {
    id: 2,
    propertyName: "Downtown Loft",
    address: "456 Main St, Seattle, WA",
    rating: 2,
    reviewText: "Multiple maintenance issues that took weeks to resolve. Noisy neighbors and poor soundproofing.",
    datePosted: "2024-01-10",
    status: "published",
    helpful: 8,
    landlordResponse: "We apologize for the maintenance delays and have since improved our response times."
  },
  {
    id: 3,
    propertyName: "Garden View Studio",
    address: "789 Oak Ave, Portland, OR",
    rating: 5,
    reviewText: "Excellent experience overall. Modern amenities, fair pricing, and great management team.",
    datePosted: "2024-01-05",
    status: "draft",
    helpful: 0,
    landlordResponse: null
  }
];

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${
        i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
      }`}
    />
  ));
};

export default function Reviews() {
  const [activeTab, setActiveTab] = useState("published");

  const filteredReviews = myReviews.filter(review => 
    activeTab === "all" ? true : review.status === activeTab
  );

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">My Reviews</h1>
            <p className="text-muted-foreground">
              Manage your property reviews and help other renters
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Write Review
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="published">Published ({myReviews.filter(r => r.status === 'published').length})</TabsTrigger>
            <TabsTrigger value="draft">Drafts ({myReviews.filter(r => r.status === 'draft').length})</TabsTrigger>
            <TabsTrigger value="all">All ({myReviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredReviews.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="flex justify-center mb-4">
                    {renderStars(0)}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Share your rental experience to help other renters
                  </p>
                  <Button>Write Your First Review</Button>
                </CardContent>
              </Card>
            ) : (
              filteredReviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{review.propertyName}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          {review.address}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={review.status === "published" ? "default" : "secondary"}>
                          {review.status}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-muted-foreground">
                        Posted on {new Date(review.datePosted).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-4">{review.reviewText}</p>
                    
                    {review.landlordResponse && (
                      <div className="bg-muted p-3 rounded-lg mb-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Response from landlord:
                        </p>
                        <p className="text-sm">{review.landlordResponse}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        {review.status === "published" && (
                          <span className="text-muted-foreground">
                            {review.helpful} people found this helpful
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          View Public
                        </Button>
                        {review.status === "draft" && (
                          <Button size="sm">Publish</Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}