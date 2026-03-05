'use client';

import { Charger } from '@/lib/types';
import { formatCurrency, getStatusBg, getStatusColor, getChargerTypeIcon } from '@/lib/utils';
import { Zap, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChargerSelectorProps {
  chargers: Charger[];
  selectedId?: string;
  onSelect: (charger: Charger) => void;
}

export function ChargerSelector({ chargers, selectedId, onSelect }: ChargerSelectorProps) {
  return (
    <div className="space-y-2">
      {chargers.map((charger) => {
        const isSelected = charger.id === selectedId;
        const isDisabled = charger.status === 'offline' || charger.status === 'busy';

        return (
          <button
            key={charger.id}
            onClick={() => !isDisabled && onSelect(charger)}
            disabled={isDisabled}
            className={cn(
              'w-full text-left p-4 rounded-xl border transition-all duration-200',
              isSelected
                ? 'bg-electric-600/15 border-electric-500/50 ring-1 ring-electric-500/30'
                : isDisabled
                  ? 'bg-white/3 border-white/5 opacity-50 cursor-not-allowed'
                  : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-electric-500/20'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-lg',
                  isSelected ? 'bg-electric-500/20' : 'bg-white/5'
                )}>
                  {getChargerTypeIcon(charger.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{charger.type}</span>
                    <span className={cn('text-xs', getStatusColor(charger.status))}>
                      {charger.status.charAt(0).toUpperCase() + charger.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-white/40">{charger.connector}</span>
                    <span className="text-xs text-white/40">·</span>
                    <span className="text-xs text-white/50 font-mono">{charger.power} kW</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-bold text-white">{formatCurrency(charger.pricePerKwh)}</div>
                  <div className="text-xs text-white/40">/kWh</div>
                </div>
                {isSelected && <CheckCircle className="w-5 h-5 text-electric-400" />}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
