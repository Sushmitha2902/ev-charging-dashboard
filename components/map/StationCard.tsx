'use client';

import { Station } from '@/lib/types';
import {
  getStationAvailability, getAvailableCount, formatCurrency,
  getStatusBg, getChargerTypeIcon
} from '@/lib/utils';
import { Star, MapPin, Clock, Wifi, Coffee, Zap, Navigation, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StationCardProps {
  station: Station;
  isSelected?: boolean;
  onSelect?: (station: Station) => void;
  onBook?: (station: Station) => void;
  compact?: boolean;
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-3.5 h-3.5" />,
  cafe: <Coffee className="w-3.5 h-3.5" />,
  parking: <span className="text-xs font-bold">P</span>,
  restroom: <span className="text-xs">🚻</span>,
  lounge: <span className="text-xs">🛋</span>,
  shopping: <span className="text-xs">🛍</span>,
  gym: <span className="text-xs">💪</span>,
  metro: <span className="text-xs">🚇</span>,
  market: <span className="text-xs">🛒</span>,
};

export function StationCard({ station, isSelected, onSelect, onBook, compact = false }: StationCardProps) {
  const availability = getStationAvailability(station);
  const availableCount = getAvailableCount(station);
  const minPrice = Math.min(...station.chargers.map(c => c.pricePerKwh));
  const maxPrice = Math.max(...station.chargers.map(c => c.pricePerKwh));

  const chargerTypes = station.chargers.map(c => c.type).filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div
      onClick={() => onSelect?.(station)}
      className={cn(
        'relative rounded-2xl border transition-all duration-300 cursor-pointer group',
        'bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur',
        isSelected
          ? 'border-electric-500/60 shadow-lg shadow-electric-500/10'
          : 'border-white/10 hover:border-electric-500/30 hover:shadow-md hover:shadow-electric-500/5'
      )}
    >
      {/* Premium badge */}
      {station.isPremium && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-gradient-to-r from-yellow-500/30 to-amber-500/30 border border-yellow-500/40 text-yellow-300 text-xs font-bold px-2 py-0.5 rounded-md">
            ⭐ Premium
          </span>
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
            availability === 'available' ? 'bg-green-500/15' : availability === 'busy' ? 'bg-orange-500/15' : 'bg-gray-500/15'
          )}>
            <Zap className={cn(
              'w-5 h-5',
              availability === 'available' ? 'text-green-400' : availability === 'busy' ? 'text-orange-400' : 'text-gray-500'
            )} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-white text-sm leading-tight line-clamp-1 group-hover:text-electric-300 transition-colors">
              {station.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-white/40 flex-shrink-0" />
              <span className="text-xs text-white/40 truncate">{station.area}</span>
              {station.distance !== undefined && (
                <span className="text-xs text-electric-400 ml-auto flex-shrink-0 font-mono">
                  {station.distance} km
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-center justify-between mb-3">
          <div className={cn('flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold border', getStatusBg(availability))}>
            <span className={`availability-dot ${availability}`} />
            <span className={availability === 'available' ? 'text-green-400' : availability === 'busy' ? 'text-orange-400' : 'text-gray-400'}>
              {availableCount}/{station.chargers.length} Available
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-white/70 font-medium">{station.rating}</span>
            <span className="text-xs text-white/30">({station.totalReviews})</span>
          </div>
        </div>

        {!compact && (
          <>
            {/* Charger types */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {chargerTypes.map(type => (
                <span
                  key={type}
                  className="bg-electric-500/10 border border-electric-500/20 text-electric-300 text-xs px-2 py-0.5 rounded-md"
                >
                  {getChargerTypeIcon(type)} {type}
                </span>
              ))}
            </div>

            {/* Price & Hours */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs text-white/40">From </span>
                <span className="text-sm font-semibold text-white">{formatCurrency(minPrice)}</span>
                <span className="text-xs text-white/40"> /kWh</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-white/40">
                <Clock className="w-3 h-3" />
                {station.openHours}
              </div>
            </div>

            {/* Amenities */}
            <div className="flex items-center gap-2 mb-3">
              {station.amenities.slice(0, 4).map(amenity => (
                <div
                  key={amenity}
                  title={amenity}
                  className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-white/40"
                >
                  {amenityIcons[amenity] || <span className="text-xs">·</span>}
                </div>
              ))}
              {station.amenities.length > 4 && (
                <span className="text-xs text-white/30">+{station.amenities.length - 4}</span>
              )}
            </div>
          </>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const url = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
              window.open(url, '_blank');
            }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-2 text-xs font-medium text-white/60 hover:text-white transition-all"
          >
            <Navigation className="w-3.5 h-3.5" />
            Directions
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBook?.(station);
            }}
            disabled={availability === 'offline'}
            className="flex-1 flex items-center justify-center gap-1.5 bg-electric-600/80 hover:bg-electric-600 border border-electric-500/30 rounded-xl py-2 text-xs font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Zap className="w-3.5 h-3.5" />
            Book Now
          </button>
        </div>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute left-0 top-4 bottom-4 w-1 bg-electric-500 rounded-r-full" />
      )}
    </div>
  );
}
