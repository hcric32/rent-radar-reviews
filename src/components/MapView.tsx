import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, Search, Filter, Heart, Share2 } from 'lucide-react';

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

// Search bar component
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

// Custom marker creation for price circles
const createPriceMarker = (price: string, isSelected: boolean = false) => {
  return L.divIcon({
    html: `<div class="px-3 py-1 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200 shadow-md border-2 ${
      isSelected 
        ? 'bg-primary text-primary-foreground border-primary scale-110' 
        : 'bg-background text-foreground border-border hover:scale-105'
    }">${price}</div>`,
    className: 'custom-div-icon',
    iconSize: [60, 30],
    iconAnchor: [30, 15]
  });
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
  const map = useRef<L.Map | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<typeof mockProperties[0] | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize Leaflet map
    map.current = L.map(mapContainer.current).setView([40.7128, -74.006], 12);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Add property markers
    mockProperties.forEach((property) => {
      const marker = L.marker([property.coordinates[1], property.coordinates[0]], {
        icon: createPriceMarker(property.price, false)
      }).addTo(map.current!);

      markersRef.current.push(marker);

      // Add click listener to marker
      marker.on('click', (e) => {
        e.originalEvent.stopPropagation();
        setSelectedProperty(property);
        
        // Update all markers to show selection state
        markersRef.current.forEach((m, index) => {
          const isSelected = mockProperties[index].id === property.id;
          m.setIcon(createPriceMarker(mockProperties[index].price, isSelected));
        });
      });
    });

    // Add click listener to map to close popup
    map.current.on('click', () => {
      setSelectedProperty(null);
      // Reset all markers to unselected state
      markersRef.current.forEach((m, index) => {
        m.setIcon(createPriceMarker(mockProperties[index].price, false));
      });
    });

    // Cleanup
    return () => {
      map.current?.remove();
      markersRef.current = [];
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Search overlay */}
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