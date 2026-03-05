'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MapPin, Navigation, Zap, TrendingUp, Battery, Clock } from 'lucide-react';
import { useAuthStore, useAppStore } from '@/lib/store';
import { StationCard } from '@/components/map/StationCard';
import { FilterChips } from '@/components/map/FilterChips';
import { StationCardSkeleton, MapSkeleton } from '@/components/ui/Skeleton';
import { calculateDistance, getStationAvailability, getAvailableCount, formatCurrency } from '@/lib/utils';
import { Station } from '@/lib/types';

const EVMap = dynamic(() => import('@/components/map/EVMap').then(m => ({ default: m.EVMap })), {
  ssr: false,
  loading: () => <MapSkeleton height="420px" />,
});

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { stations, selectedStation, setSelectedStation, userLocation, setUserLocation, filters, setFilters, sessions } = useAppStore();
  const [isLocating, setIsLocating] = useState(false);
  const [mapView, setMapView] = useState<'map' | 'list'>('map');

  // Default to Bangalore center
  const effectiveLocation = userLocation || { lat: 12.9716, lng: 77.5946 };

  const userSessions = sessions.filter(s => s.userId === user?.id);
  const activeSessions = userSessions.filter(s => s.status === 'active');
  const totalKwh = userSessions.reduce((sum, s) => sum + s.kwhCharged, 0);

  const stationsWithDistance = useMemo(() => {
    return stations.map(s => ({
      ...s,
      distance: calculateDistance(effectiveLocation.lat, effectiveLocation.lng, s.lat, s.lng),
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [stations, effectiveLocation]);

  const filteredStations = useMemo(() => {
    return stationsWithDistance.filter(s => {
      if (filters.chargerType && filters.chargerType !== 'all') {
        if (!s.chargers.some(c => c.type === filters.chargerType)) return false;
      }
      if (filters.maxPrice && filters.maxPrice < 30) {
        if (Math.min(...s.chargers.map(c => c.pricePerKwh)) > filters.maxPrice) return false;
      }
      if (filters.maxDistance && filters.maxDistance < 20) {
        if ((s.distance || 0) > filters.maxDistance) return false;
      }
      if (filters.status && filters.status !== 'all') {
        if (getStationAvailability(s) !== filters.status) return false;
      }
      return true;
    });
  }, [stationsWithDistance, filters]);

  const handleLocateMe = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsLocating(false);
        },
        () => {
          // Default to Bangalore
          setUserLocation({ lat: 12.9716, lng: 77.5946 });
          setIsLocating(false);
        }
      );
    } else {
      setUserLocation({ lat: 12.9716, lng: 77.5946 });
      setIsLocating(false);
    }
  };

  const availableNearby = filteredStations.filter(s => getStationAvailability(s) === 'available').length;
  const cheapest = Math.min(...filteredStations.flatMap(s => s.chargers.map(c => c.pricePerKwh)));

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {availableNearby} stations available near you
          </p>
        </div>
        <button
          onClick={handleLocateMe}
          disabled={isLocating}
          className="flex items-center gap-2 bg-electric-600/20 hover:bg-electric-600/30 border border-electric-500/30 text-electric-300 text-sm font-medium px-4 py-2.5 rounded-xl transition-all disabled:opacity-60"
        >
          <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          {isLocating ? 'Locating...' : 'Locate Me'}
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Zap, label: 'Available Nearby', value: `${availableNearby}`, sub: 'stations', color: 'text-green-400', bg: 'bg-green-500/10' },
          { icon: Battery, label: 'Active Sessions', value: `${activeSessions.length}`, sub: 'charging now', color: 'text-electric-400', bg: 'bg-electric-500/10' },
          { icon: TrendingUp, label: 'Total Energy', value: `${totalKwh.toFixed(0)}`, sub: 'kWh charged', color: 'text-volt-400', bg: 'bg-volt-500/10' },
          { icon: Clock, label: 'Best Price', value: isFinite(cheapest) ? formatCurrency(cheapest) : '—', sub: 'per kWh', color: 'text-orange-400', bg: 'bg-orange-500/10' },
        ].map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="bg-gray-900/50 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/40">{label}</span>
              <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <div className={`font-display font-bold text-2xl ${color} font-mono`}>{value}</div>
            <div className="text-xs text-white/30 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Active session alert */}
      {activeSessions.length > 0 && (
        <div className="bg-electric-500/10 border border-electric-500/30 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-electric-400 animate-pulse" />
            <div>
              <span className="text-sm font-medium text-white">
                {activeSessions.length} session{activeSessions.length > 1 ? 's' : ''} actively charging
              </span>
              <div className="text-xs text-white/40">{activeSessions[0].stationName}</div>
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboard/sessions')}
            className="text-xs text-electric-400 hover:text-electric-300 border border-electric-500/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            View Sessions
          </button>
        </div>
      )}

      {/* Map / List toggle */}
      <div className="flex items-center gap-2">
        {['map', 'list'].map(view => (
          <button
            key={view}
            onClick={() => setMapView(view as 'map' | 'list')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              mapView === view
                ? 'bg-electric-600/20 border border-electric-500/40 text-electric-300'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {view === 'map' ? '🗺 Map View' : '📋 List View'}
          </button>
        ))}
      </div>

      {/* Filters */}
      <FilterChips filters={filters} onChange={setFilters} stationCount={filteredStations.length} />

      {mapView === 'map' ? (
        <div className="grid xl:grid-cols-3 gap-5">
          {/* Map */}
          <div className="xl:col-span-2">
            <EVMap
              stations={filteredStations}
              userLocation={effectiveLocation}
              onStationSelect={setSelectedStation}
              selectedStation={selectedStation}
              radius={filters.maxDistance || 10}
              height="420px"
            />
          </div>

          {/* Station List */}
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {filteredStations.length === 0 ? (
              <div className="text-center py-16">
                <MapPin className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">No stations match your filters</p>
                <button onClick={() => setFilters({ chargerType: 'all', maxPrice: 30, maxDistance: 20, status: 'all' })} className="text-electric-400 text-xs mt-2 hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              filteredStations.map(station => (
                <StationCard
                  key={station.id}
                  station={station}
                  isSelected={selectedStation?.id === station.id}
                  onSelect={setSelectedStation}
                  onBook={(s) => {
                    setSelectedStation(s);
                    router.push(`/dashboard/book?station=${s.id}`);
                  }}
                  compact
                />
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredStations.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <MapPin className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/40">No stations match your filters</p>
            </div>
          ) : (
            filteredStations.map(station => (
              <StationCard
                key={station.id}
                station={station}
                isSelected={selectedStation?.id === station.id}
                onSelect={setSelectedStation}
                onBook={(s) => router.push(`/dashboard/book?station=${s.id}`)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
