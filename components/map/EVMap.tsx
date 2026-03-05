'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle, MarkerClusterer } from '@react-google-maps/api';
import { Station } from '@/lib/types';
import { calculateDistance, getStationAvailability, getAvailableCount, formatCurrency } from '@/lib/utils';
import { MapPin, Zap, Navigation, Star } from 'lucide-react';

interface EVMapProps {
  stations: Station[];
  userLocation: { lat: number; lng: number } | null;
  onStationSelect: (station: Station) => void;
  selectedStation: Station | null;
  radius?: number; // km
  height?: string;
}

const BANGALORE_CENTER = { lat: 12.9716, lng: 77.5946 };

const mapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#0a0f1e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0f1e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0f172a' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1e3a5f' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0c1a2e' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#0d2818' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#334155' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
];

const lightMapStyles = [
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#bae6fd' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#7dd3fc' }] },
];

function getMarkerIcon(status: 'available' | 'busy' | 'offline', isSelected: boolean): google.maps.Symbol {
  const colors = { available: '#22c55e', busy: '#f97316', offline: '#6b7280' };
  const color = colors[status];
  const size = isSelected ? 18 : 14;

  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: isSelected ? '#ffffff' : color,
    strokeWeight: isSelected ? 3 : 1.5,
    scale: size,
  };
}

export function EVMap({ stations, userLocation, onStationSelect, selectedStation, radius = 10, height = '500px' }: EVMapProps) {
  const [activeInfo, setActiveInfo] = useState<Station | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  const center = userLocation || BANGALORE_CENTER;

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const handleDirections = (station: Station) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
    window.open(url, '_blank');
  };

  if (loadError) {
    return (
      <div className="flex items-center justify-center bg-gray-900/50 rounded-2xl border border-white/10" style={{ height }}>
        <div className="text-center p-8">
          <MapPin className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-white/60 text-sm">Map failed to load.</p>
          <p className="text-white/40 text-xs mt-1">Please check your Google Maps API key.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center bg-gray-900/50 rounded-2xl border border-white/10" style={{ height }}>
        <div className="text-center">
          <div className="spinner mx-auto mb-3" />
          <p className="text-white/60 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10" style={{ height }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={userLocation ? 13 : 12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: mapStyles,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          clickableIcons: false,
          backgroundColor: '#0a0f1e',
        }}
      >
        {/* User location */}
        {userLocation && (
          <>
            <Marker
              position={userLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#0ea5e9',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3,
                scale: 10,
              }}
              title="Your Location"
              zIndex={1000}
            />
            <Circle
              center={userLocation}
              radius={radius * 1000}
              options={{
                fillColor: '#0ea5e9',
                fillOpacity: 0.04,
                strokeColor: '#0ea5e9',
                strokeOpacity: 0.4,
                strokeWeight: 1.5,
              }}
            />
          </>
        )}

        {/* Station markers */}
        <MarkerClusterer
          options={{
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
            minimumClusterSize: 4,
            gridSize: 50,
          }}
        >
          {(clusterer) => (
            <>
              {stations.map((station) => {
                const status = getStationAvailability(station);
                const isSelected = selectedStation?.id === station.id;
                return (
                  <Marker
                    key={station.id}
                    position={{ lat: station.lat, lng: station.lng }}
                    icon={getMarkerIcon(status, isSelected)}
                    clusterer={clusterer}
                    onClick={() => {
                      onStationSelect(station);
                      setActiveInfo(station);
                    }}
                    title={station.name}
                    zIndex={isSelected ? 100 : 1}
                  />
                );
              })}
            </>
          )}
        </MarkerClusterer>

        {/* Info Window */}
        {activeInfo && (
          <InfoWindow
            position={{ lat: activeInfo.lat, lng: activeInfo.lng }}
            onCloseClick={() => setActiveInfo(null)}
          >
            <div className="bg-gray-900 text-white p-1 min-w-[200px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <div className="font-semibold text-sm text-white mb-1">{activeInfo.name}</div>
              <div className="text-xs text-gray-400 mb-2">{activeInfo.area}</div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1">
                  <span className={`availability-dot ${getStationAvailability(activeInfo)}`} />
                  <span className="text-xs text-gray-300">
                    {getAvailableCount(activeInfo)}/{activeInfo.chargers.length} available
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-gray-300">{activeInfo.rating}</span>
                </div>
              </div>
              <div className="text-xs text-blue-400 mb-3">
                From {formatCurrency(Math.min(...activeInfo.chargers.map(c => c.pricePerKwh)))}/kWh
              </div>
              <button
                onClick={() => handleDirections(activeInfo)}
                className="w-full flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                <Navigation className="w-3 h-3" />
                Get Directions
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur border border-white/10 rounded-xl p-3 space-y-1.5">
        {[
          { color: 'bg-green-500', label: 'Available' },
          { color: 'bg-orange-400', label: 'Busy' },
          { color: 'bg-gray-500', label: 'Offline' },
          { color: 'bg-electric-500', label: 'You' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <span className="text-xs text-white/60">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
