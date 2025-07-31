import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, Filter, Star, MapPin, List } from "lucide-react";
import { MapView } from "@/components/MapView";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface LocationSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number; lng: number} | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const searchForLocations = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      // Use multiple search strategies for better address matching
      const searches = [
        // Main search with exact query
        fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=3&q=${encodeURIComponent(query)}`),
        // Search with extratags for more detailed results
        fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&extratags=1&limit=2&q=${encodeURIComponent(query)}`)
      ];

      const responses = await Promise.all(searches);
      const results = await Promise.all(responses.map(r => r.json()));
      
      // Combine and deduplicate results
      const combined = [...results[0], ...results[1]];
      const seen = new Set();
      const unique = combined.filter(item => {
        const key = `${item.lat}-${item.lon}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      const locationSuggestions: LocationSuggestion[] = unique.slice(0, 5).map((item: any, index: number) => ({
        place_id: item.place_id?.toString() || `${index}`,
        description: item.display_name,
        structured_formatting: {
          main_text: item.name || item.display_name.split(',')[0],
          secondary_text: item.display_name.split(',').slice(1).join(',').trim()
        },
        coordinates: {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }
      }));
      
      setSuggestions(locationSuggestions);
    } catch (error) {
      console.error('Error searching for locations:', error);
      setSuggestions([]);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (value.length >= 3) {
      searchTimeoutRef.current = setTimeout(() => {
        searchForLocations(value);
        setShowSuggestions(true);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    console.log('Selected location:', suggestion);
    console.log('Coordinates:', suggestion.coordinates);
    setSearchTerm(suggestion.description);
    setShowSuggestions(false);
    
    // Use the real coordinates from the geocoding API
    if (suggestion.coordinates) {
      setSelectedLocation(suggestion.coordinates);
      console.log('Set selected location to:', suggestion.coordinates);
    }
    
    // Clear search results since we're starting fresh with a new location
    setSearchResults([]);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Search Header */}
      <div className="p-4 border-b bg-background">
        <div className="flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Search by location, property name, or landlord..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.place_id}
                    onClick={() => handleLocationSelect(suggestion)}
                    className="px-3 py-2 hover:bg-accent cursor-pointer border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{suggestion.structured_formatting.main_text}</div>
                        <div className="text-sm text-muted-foreground">
                          {suggestion.structured_formatting.secondary_text}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
          <MapView 
            className="h-full" 
            center={selectedLocation || undefined}
            exactLocation={selectedLocation || undefined}
            properties={searchResults}
          />
        ) : (
          <div className="h-full overflow-auto p-4">
            <div className="max-w-4xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {searchResults.length} properties found
                </h2>
              </div>

              {searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No properties yet</h3>
                  <p className="text-muted-foreground">
                    Search for a location to see properties in that area.
                  </p>
                </div>
              ) : (
                searchResults.map((property) => (
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
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}