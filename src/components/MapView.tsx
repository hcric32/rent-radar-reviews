import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, Search, Filter, Heart, Share2 } from 'lucide-react';

// Temporary input for Mapbox token - in production this would come from Supabase
const MapboxTokenInput = ({ onTokenSubmit }: { onTokenSubmit: (token: string) => void }) => {
  const [token, setToken] = useState('');

  return (
    <Card className="absolute top-4 left-4 z-10 w-80">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">Enter Mapbox Token</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Get your token from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
        </p>
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="pk.eyJ1..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Button onClick={() => onTokenSubmit(token)} disabled={!token}>
            Load Map
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Mock property data with more realistic spread
const mockProperties = [
  {
    id: 1,
    name: "Downtown Apartment",
    address: "123 Main St, Manhattan",
    coordinates: [-74.006, 40.7128],
    rating: 4.2,
    reviewCount: 15,
    price: "$2,400",
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop"
  },
  {
    id: 2,
    name: "Suburban House",
    address: "456 Oak Ave, Brooklyn",
    coordinates: [-74.016, 40.7228],
    rating: 3.8,
    reviewCount: 8,
    price: "$3,200",
    type: "House",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&h=200&fit=crop"
  },
  {
    id: 3,
    name: "Cozy Studio",
    address: "789 Pine St, East Village",
    coordinates: [-73.996, 40.7028],
    rating: 4.5,
    reviewCount: 23,
    price: "$1,800",
    type: "Studio",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=200&fit=crop"
  },
  {
    id: 4,
    name: "Modern Loft",
    address: "321 Broadway, SoHo",
    coordinates: [-74.003, 40.7208],
    rating: 4.7,
    reviewCount: 31,
    price: "$4,100",
    type: "Loft",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&h=200&fit=crop"
  },
  {
    id: 5,
    name: "Charming Brownstone",
    address: "654 Park Ave, Upper East Side",
    coordinates: [-73.976, 40.7489],
    rating: 4.1,
    reviewCount: 12,
    price: "$5,500",
    type: "Townhouse", 
    image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=300&h=200&fit=crop"
  },
  {
    id: 6,
    name: "Riverside Apartment",
    address: "987 West End Ave, Upper West Side",
    coordinates: [-73.985, 40.7831],
    rating: 3.9,
    reviewCount: 19,
    price: "$2,800",
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=200&fit=crop"
  }
];

// Airbnb-style search bar component
const SearchOverlay = () => (
  <Card className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 w-96 shadow-lg">
    <CardContent className="p-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-muted rounded-full">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search neighborhoods, addresses..." 
            className="border-0 bg-transparent text-sm focus-visible:ring-0 p-0"
          />
        </div>
        <Button size="sm" variant="outline" className="rounded-full">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Custom marker component for Airbnb-style price markers
const createPriceMarker = (price: string, isSelected: boolean = false) => {
  const el = document.createElement('div');
  el.className = `
    px-2 py-1 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200 shadow-md
    ${isSelected 
      ? 'bg-foreground text-background scale-110 z-10' 
      : 'bg-background text-foreground border border-border hover:scale-105'
    }
  `;
  el.innerHTML = price;
  return el;
};

interface PropertyPopupProps {
  property: typeof mockProperties[0];
  onClose: () => void;
}

const PropertyPopup = ({ property, onClose }: PropertyPopupProps) => (
  <Card className="absolute bottom-6 left-6 right-6 z-30 max-w-md mx-auto shadow-xl">
    <CardContent className="p-0">
      <div className="relative">
        <img 
          src={property.image} 
          alt={property.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <Button size="sm" variant="secondary" className="rounded-full w-8 h-8 p-0">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="rounded-full w-8 h-8 p-0">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="rounded-full w-8 h-8 p-0" onClick={onClose}>
            ×
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{property.name}</h3>
            <p className="text-sm text-muted-foreground">{property.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{property.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">({property.reviewCount} reviews)</span>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">{property.type}</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold">{property.price}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <Button size="sm" className="rounded-full">View Reviews</Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface MapViewProps {
  className?: string;
}

export function MapView({ className }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<typeof mockProperties[0] | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-74.006, 40.7128], // NYC coordinates
        zoom: 12,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Add property markers with custom price markers
      const markers: mapboxgl.Marker[] = [];
      mockProperties.forEach((property) => {
        const markerElement = createPriceMarker(property.price, false);
        
        const marker = new mapboxgl.Marker({ element: markerElement })
          .setLngLat(property.coordinates as [number, number])
          .addTo(map.current!);

        markers.push(marker);

        // Add click listener to marker
        markerElement.addEventListener('click', (e) => {
          e.stopPropagation();
          setSelectedProperty(property);
          
          // Update marker styles
          markers.forEach((m, index) => {
            const element = m.getElement();
            const isSelected = mockProperties[index].id === property.id;
            element.className = `
              px-2 py-1 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200 shadow-md
              ${isSelected 
                ? 'bg-foreground text-background scale-110 z-10' 
                : 'bg-background text-foreground border border-border hover:scale-105'
              }
            `;
          });
        });
      });

      // Add click listener to map to close popup
      map.current.on('click', (e) => {
        // Check if click was on a marker
        const features = map.current!.queryRenderedFeatures(e.point);
        if (features.length === 0) {
          setSelectedProperty(null);
        }
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  if (!mapboxToken) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <MapboxTokenInput onTokenSubmit={setMapboxToken} />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Airbnb-style search overlay */}
      <SearchOverlay />
      
      {/* Property count overlay */}
      <Card className="absolute top-4 right-4 z-10">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{mockProperties.length} properties</span>
          </div>
        </CardContent>
      </Card>

      {/* Property popup */}
      {selectedProperty && (
        <PropertyPopup 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
        />
      )}
    </div>
  );
}