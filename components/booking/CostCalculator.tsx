'use client';

import { useState, useEffect } from 'react';
import { Zap, Clock, DollarSign, Battery } from 'lucide-react';
import { Charger } from '@/lib/types';
import { calculateChargingCost, estimateChargingTime, formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface CostCalculatorProps {
  charger: Charger;
  batteryCapacity?: number;
  currentBattery?: number;
  onCalculate?: (kwh: number, cost: number, time: number) => void;
}

export function CostCalculator({ charger, batteryCapacity = 40, currentBattery = 20, onCalculate }: CostCalculatorProps) {
  const [kwhToCharge, setKwhToCharge] = useState(Math.min(20, batteryCapacity - currentBattery));
  const [targetPercent, setTargetPercent] = useState(80);

  const maxChargeable = batteryCapacity - currentBattery;
  const currentPercent = Math.round((currentBattery / batteryCapacity) * 100);

  const cost = calculateChargingCost(kwhToCharge, charger.pricePerKwh);
  const timeMinutes = estimateChargingTime(kwhToCharge, charger.power);
  const endPercent = Math.min(100, Math.round(((currentBattery + kwhToCharge) / batteryCapacity) * 100));

  useEffect(() => {
    const targetKwh = Math.min(((targetPercent - currentPercent) / 100) * batteryCapacity, maxChargeable);
    if (targetKwh > 0) {
      setKwhToCharge(Math.round(targetKwh * 10) / 10);
    }
  }, [targetPercent, currentPercent, batteryCapacity, maxChargeable]);

  useEffect(() => {
    onCalculate?.(kwhToCharge, cost, timeMinutes);
  }, [kwhToCharge, cost, timeMinutes]);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-5 space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-electric-500/15 flex items-center justify-center">
          <Battery className="w-4 h-4 text-electric-400" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-white text-sm">Cost Calculator</h3>
          <p className="text-xs text-white/40">{charger.type} · {charger.power}kW · {charger.connector}</p>
        </div>
      </div>

      {/* Battery visual */}
      <div>
        <div className="flex justify-between text-xs text-white/50 mb-2">
          <span>Battery Level</span>
          <span className="text-white/70">{currentPercent}% → <span className="text-electric-400 font-semibold">{endPercent}%</span></span>
        </div>
        <div className="relative h-6 bg-white/5 border border-white/10 rounded-lg overflow-hidden">
          {/* Current level */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-gray-600/60 rounded-l-lg transition-all duration-300"
            style={{ width: `${currentPercent}%` }}
          />
          {/* Added charge */}
          <div
            className={cn(
              'absolute top-0 bottom-0 transition-all duration-300',
              endPercent >= 80 ? 'bg-gradient-to-r from-green-500/70 to-green-400/70' : 'bg-gradient-to-r from-electric-600/70 to-electric-400/70'
            )}
            style={{
              left: `${currentPercent}%`,
              width: `${Math.min(endPercent - currentPercent, 100 - currentPercent)}%`
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white/80 drop-shadow">{endPercent}%</span>
          </div>
        </div>
      </div>

      {/* Target percentage slider */}
      <div>
        <div className="flex justify-between text-xs text-white/50 mb-2">
          <label>Target Battery: <span className="text-white/80 font-medium">{targetPercent}%</span></label>
          <span className="text-white/30">Max: 100%</span>
        </div>
        <input
          type="range"
          min={currentPercent + 5}
          max={100}
          value={targetPercent}
          onChange={(e) => setTargetPercent(Number(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${((targetPercent - (currentPercent + 5)) / (100 - (currentPercent + 5))) * 100}%, rgba(255,255,255,0.1) ${((targetPercent - (currentPercent + 5)) / (100 - (currentPercent + 5))) * 100}%, rgba(255,255,255,0.1) 100%)`
          }}
        />
      </div>

      {/* kWh slider */}
      <div>
        <div className="flex justify-between text-xs text-white/50 mb-2">
          <label>Energy to add: <span className="text-white/80 font-medium">{kwhToCharge} kWh</span></label>
          <span className="text-white/30">Max: {maxChargeable.toFixed(1)} kWh</span>
        </div>
        <input
          type="range"
          min={1}
          max={maxChargeable}
          step={0.5}
          value={kwhToCharge}
          onChange={(e) => setKwhToCharge(Number(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(to right, #22c55e 0%, #22c55e ${(kwhToCharge / maxChargeable) * 100}%, rgba(255,255,255,0.1) ${(kwhToCharge / maxChargeable) * 100}%, rgba(255,255,255,0.1) 100%)`
          }}
        />
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-electric-500/10 border border-electric-500/20 rounded-xl p-3 text-center">
          <Zap className="w-4 h-4 text-electric-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white font-mono">{kwhToCharge}</div>
          <div className="text-xs text-white/40">kWh</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
          <DollarSign className="w-4 h-4 text-green-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white font-mono">{formatCurrency(cost)}</div>
          <div className="text-xs text-white/40">Total</div>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-center">
          <Clock className="w-4 h-4 text-orange-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white font-mono">{formatTime(timeMinutes)}</div>
          <div className="text-xs text-white/40">Est. Time</div>
        </div>
      </div>

      <div className="text-xs text-white/30 text-center">
        @ {formatCurrency(charger.pricePerKwh)}/kWh · {charger.power}kW charger
      </div>
    </div>
  );
}
