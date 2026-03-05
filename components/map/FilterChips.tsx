'use client';

import { useState } from 'react';
import { Filter, X, ChevronDown, Zap, DollarSign, MapPin } from 'lucide-react';
import { FilterOptions, ChargerType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FilterChipsProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  stationCount: number;
}

const CHARGER_TYPES: { value: ChargerType | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'All Types', icon: '🔌' },
  { value: 'DC Ultra Fast', label: 'Ultra Fast', icon: '⚡⚡' },
  { value: 'DC Fast', label: 'DC Fast', icon: '⚡' },
  { value: 'AC Level 2', label: 'AC L2', icon: '🔋' },
];

const PRICE_FILTERS = [
  { value: 30, label: 'All Prices' },
  { value: 20, label: '< ₹20/kWh' },
  { value: 17, label: '< ₹17/kWh' },
  { value: 15, label: '< ₹15/kWh' },
];

const DISTANCE_FILTERS = [
  { value: 20, label: 'All Distances' },
  { value: 5, label: '< 5 km' },
  { value: 10, label: '< 10 km' },
  { value: 15, label: '< 15 km' },
];

export function FilterChips({ filters, onChange, stationCount }: FilterChipsProps) {
  const [showMore, setShowMore] = useState(false);

  const activeCount = [
    filters.chargerType !== 'all' ? 1 : 0,
    filters.maxPrice !== 30 ? 1 : 0,
    filters.maxDistance !== 20 ? 1 : 0,
    filters.status !== 'all' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const clearAll = () => {
    onChange({ chargerType: 'all', maxPrice: 30, maxDistance: 20, status: 'all' });
  };

  return (
    <div className="space-y-3">
      {/* Quick filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-white/40 text-xs">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </div>

        {/* Charger type chips */}
        {CHARGER_TYPES.map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => onChange({ ...filters, chargerType: value })}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
              filters.chargerType === value
                ? 'bg-electric-600/30 border-electric-500/60 text-electric-300'
                : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/80'
            )}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}

        {/* Price filter chip */}
        <button
          onClick={() => {
            const current = PRICE_FILTERS.findIndex(p => p.value === filters.maxPrice);
            const next = PRICE_FILTERS[(current + 1) % PRICE_FILTERS.length];
            onChange({ ...filters, maxPrice: next.value });
          }}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
            filters.maxPrice !== 30
              ? 'bg-green-600/20 border-green-500/40 text-green-300'
              : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/80'
          )}
        >
          <DollarSign className="w-3 h-3" />
          {PRICE_FILTERS.find(p => p.value === filters.maxPrice)?.label || 'All Prices'}
        </button>

        {/* Distance filter chip */}
        <button
          onClick={() => {
            const current = DISTANCE_FILTERS.findIndex(d => d.value === filters.maxDistance);
            const next = DISTANCE_FILTERS[(current + 1) % DISTANCE_FILTERS.length];
            onChange({ ...filters, maxDistance: next.value });
          }}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
            filters.maxDistance !== 20
              ? 'bg-purple-600/20 border-purple-500/40 text-purple-300'
              : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/80'
          )}
        >
          <MapPin className="w-3 h-3" />
          {DISTANCE_FILTERS.find(d => d.value === filters.maxDistance)?.label || 'All Distances'}
        </button>

        {/* Available only chip */}
        <button
          onClick={() => onChange({ ...filters, status: filters.status === 'available' ? 'all' : 'available' })}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
            filters.status === 'available'
              ? 'bg-green-600/20 border-green-500/40 text-green-300'
              : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/80'
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          Available Only
        </button>

        {/* Clear all */}
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 px-2 py-1.5 rounded-full text-xs text-red-400/70 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 transition-all"
          >
            <X className="w-3 h-3" />
            Clear ({activeCount})
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/40">
          Showing <span className="text-white/70 font-medium">{stationCount}</span> stations
        </span>
        {activeCount > 0 && (
          <span className="text-xs text-electric-400/60">with {activeCount} filter{activeCount !== 1 ? 's' : ''} active</span>
        )}
      </div>
    </div>
  );
}
