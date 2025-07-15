import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star } from 'lucide-react';

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

// Mock property data
const mockProperties = [
  {
    id: 1,
    name: "Downtown Apartment",
    address: "123 Main St",
    coordinates: [-74.006, 40.7128],
    rating: 4.2,
    reviewCount: 15,
    price: "$2,400/month",
    type: "Apartment"
  },
  {
    id: 2,
    name: "Suburban House",
    address: "456 Oak Ave",
    coordinates: [-74.016, 40.7228],
    rating: 3.8,
    reviewCount: 8,
    price: "$3,200/month",
    type: "House"
  },
  {
    id: 3,
    name: "Cozy Studio",
    address: "789 Pine St",
    coordinates: [-73.996, 40.7028],
    rating: 4.5,
    reviewCount: 23,
    price: "$1,800/month",
    type: "Studio"
  }
];

interface PropertyPopupProps {
  property: typeof mockProperties[0];
  onClose: () => void;
}

const PropertyPopup = ({ property, onClose }: PropertyPopupProps) => (
  <Card className="absolute bottom-4 left-4 right-4 z-10 max-w-sm mx-auto">
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{property.name}</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{property.address}</p>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{property.rating}</span>
        </div>
        <span className="text-sm text-muted-foreground">({property.reviewCount} reviews)</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-semibold text-primary">{property.price}</span>
        <Button size="sm">View Reviews</Button>
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

      // Add property markers
      mockProperties.forEach((property) => {
        const marker = new mapboxgl.Marker({
          color: '#0ea5e9'
        })
          .setLngLat(property.coordinates as [number, number])
          .addTo(map.current!);

        // Add click listener to marker
        marker.getElement().addEventListener('click', () => {
          setSelectedProperty(property);
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