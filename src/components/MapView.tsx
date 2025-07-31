import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, Search, Filter, Heart, Share2 } from 'lucide-react';

// Google Maps API key input component
const GoogleMapsTokenInput = ({ onTokenSubmit }: { onTokenSubmit: (token: string) => void }) => {
  const [token, setToken] = useState('');

  return (
    <Card className="absolute top-4 left-4 z-10 w-80">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">Enter Google Maps API Key</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Get your API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Cloud Console</a>
        </p>
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="AIza..."
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


interface Property {
  id: number;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  reviewCount: number;
  price: string;
  type: string;
  image?: string;
}

interface PropertyPopupProps {
  property: Property;
  onClose: () => void;
}

const PropertyPopup = ({ property, onClose }: PropertyPopupProps) => (
  <Card className="absolute bottom-6 left-6 right-6 z-30 max-w-md mx-auto shadow-xl">
    <CardContent className="p-0">
      {property.image && (
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
      )}
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
  center?: { lat: number; lng: number };
  properties?: Property[];
}

export function MapView({ className, center = { lat: 40.7128, lng: -74.006 }, properties = [] }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const apiKey = 'AIzaSyBQG_W44a-Mxc8yIP9me5tms3tMj50Oez4';
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapContainer.current || !apiKey) return;

    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
      libraries: ["places"]
    });

    loader.load().then(() => {
      if (!mapContainer.current) return;

      // Initialize Google Map
      map.current = new (window as any).google.maps.Map(mapContainer.current, {
        center: center,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add property markers
      properties.forEach((property) => {
        const marker = new (window as any).google.maps.Marker({
          position: property.coordinates,
          map: map.current,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="40" viewBox="0 0 80 40">
                <rect x="5" y="5" width="70" height="30" rx="15" fill="white" stroke="#e5e7eb" stroke-width="2"/>
                <text x="40" y="25" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#374151">${property.price}</text>
              </svg>
            `)}`,
            scaledSize: new (window as any).google.maps.Size(80, 40),
            anchor: new (window as any).google.maps.Point(40, 20)
          }
        });

        markersRef.current.push(marker);

        // Add click listener to marker
        marker.addListener('click', () => {
          setSelectedProperty(property);
          
          // Update all markers to show selection state
          markersRef.current.forEach((m, index) => {
            const isSelected = properties[index].id === property.id;
            const color = isSelected ? '#3b82f6' : 'white';
            const strokeColor = isSelected ? '#3b82f6' : '#e5e7eb';
            const textColor = isSelected ? 'white' : '#374151';
            
            m.setIcon({
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="40" viewBox="0 0 80 40">
                  <rect x="5" y="5" width="70" height="30" rx="15" fill="${color}" stroke="${strokeColor}" stroke-width="2"/>
                  <text x="40" y="25" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="${textColor}">${properties[index].price}</text>
                </svg>
              `)}`,
              scaledSize: new (window as any).google.maps.Size(80, 40),
              anchor: new (window as any).google.maps.Point(40, 20)
            });
          });
        });
      });

      // Add click listener to map to close popup
      map.current.addListener('click', () => {
        setSelectedProperty(null);
        // Reset all markers to unselected state
        markersRef.current.forEach((m, index) => {
          m.setIcon({
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="40" viewBox="0 0 80 40">
                <rect x="5" y="5" width="70" height="30" rx="15" fill="white" stroke="#e5e7eb" stroke-width="2"/>
                <text x="40" y="25" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#374151">${properties[index].price}</text>
              </svg>
            `)}`,
            scaledSize: new (window as any).google.maps.Size(80, 40),
            anchor: new (window as any).google.maps.Point(40, 20)
          });
        });
      });

    }).catch((error) => {
      console.error('Error loading Google Maps:', error);
    });

    // Cleanup
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [apiKey, center, properties]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Property count overlay */}
      {properties.length > 0 && (
        <Card className="absolute top-4 right-4 z-10">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{properties.length} properties</span>
            </div>
          </CardContent>
        </Card>
      )}

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