'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap, MapPin, CheckCircle, ChevronRight, ArrowLeft, Clock, CreditCard, Calendar } from 'lucide-react';
import { useAuthStore, useAppStore } from '@/lib/store';
import { ChargerSelector } from '@/components/booking/ChargerSelector';
import { CostCalculator } from '@/components/booking/CostCalculator';
import { StationCard } from '@/components/map/StationCard';
import { Charger, Station } from '@/lib/types';
import { formatCurrency, formatDateTime, isPeakHour, getPricingTier } from '@/lib/utils';

const STEPS = ['Select Station', 'Choose Charger', 'Review & Confirm'];

export default function BookingPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useAuthStore();
  const { stations, createBooking } = useAppStore();

  const [step, setStep] = useState(0);
  const [selectedStationId, setSelectedStationId] = useState(params.get('station') || '');
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null);
  const [scheduledNow, setScheduledNow] = useState(true);
  const [scheduledTime, setScheduledTime] = useState('');
  const [calcData, setCalcData] = useState({ kwh: 20, cost: 0, time: 0 });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [newSessionId, setNewSessionId] = useState('');

  const selectedStation = stations.find(s => s.id === selectedStationId);
  const pricingTier = getPricingTier();

  useEffect(() => {
    if (params.get('station')) {
      setStep(1);
    }
  }, [params]);

  const handleBook = () => {
    if (!selectedStation || !selectedCharger || !user) return;
    const session = createBooking(user.id, {
      stationId: selectedStation.id,
      chargerId: selectedCharger.id,
      scheduledTime: scheduledNow ? undefined : scheduledTime,
      estimatedKwh: calcData.kwh,
      vehicleInfo: user.vehicle
        ? `${user.vehicle.make} ${user.vehicle.model} - ${user.vehicle.licensePlate}`
        : 'Unknown Vehicle',
    });
    setNewSessionId(session.id);
    setBookingSuccess(true);
  };

  if (bookingSuccess) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 rounded-full bg-green-500/15 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="font-display font-bold text-2xl text-white mb-2">Booking Confirmed!</h2>
          <p className="text-white/40 mb-2">Your charging session has been booked at</p>
          <p className="text-electric-300 font-medium mb-6">{selectedStation?.name}</p>
          <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-4 mb-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/40">Charger</span>
              <span className="text-white">{selectedCharger?.type} · {selectedCharger?.connector}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Estimated Cost</span>
              <span className="text-green-400 font-semibold">{formatCurrency(calcData.cost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Est. Duration</span>
              <span className="text-white">{Math.floor(calcData.time / 60)}h {calcData.time % 60}m</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.push('/dashboard/sessions')} className="btn-primary flex-1">
              View Sessions
            </button>
            <button onClick={() => router.push('/dashboard')} className="btn-secondary flex-1">
              Back to Map
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => step === 0 ? router.back() : setStep(s => s - 1)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white/60" />
        </button>
        <div>
          <h1 className="font-display font-bold text-xl text-white">Book a Charger</h1>
          <p className="text-white/40 text-sm">Step {step + 1} of {STEPS.length}</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1 rounded-full transition-all ${i <= step ? 'bg-electric-500' : 'bg-white/10'}`} />
            <div className={`text-xs mt-1 transition-colors ${i === step ? 'text-electric-400' : 'text-white/25'}`}>{s}</div>
          </div>
        ))}
      </div>

      {/* Pricing tier badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold mb-5 ${
        pricingTier.label === 'Peak Rate'
          ? 'bg-red-500/10 border-red-500/30 text-red-400'
          : pricingTier.label === 'Night Rate'
          ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
          : 'bg-green-500/10 border-green-500/30 text-green-400'
      }`}>
        <Clock className="w-3.5 h-3.5" />
        {pricingTier.label} · {pricingTier.label === 'Peak Rate' ? '₹22-₹29/kWh' : pricingTier.label === 'Night Rate' ? '₹13-₹15/kWh' : '₹15-₹25/kWh'}
      </div>

      {/* Step 0: Select Station */}
      {step === 0 && (
        <div className="space-y-4 animate-slide-up">
          <p className="text-white/50 text-sm mb-4">Choose a station to begin charging</p>
          <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {stations.slice(0, 8).map(s => (
              <div
                key={s.id}
                onClick={() => { setSelectedStationId(s.id); setStep(1); }}
                className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                  selectedStationId === s.id
                    ? 'border-electric-500/50 bg-electric-500/5'
                    : 'border-white/10 hover:border-electric-500/20 bg-gray-900/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-electric-400" />
                    <div>
                      <div className="font-semibold text-sm text-white">{s.name}</div>
                      <div className="text-xs text-white/40">{s.area}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Choose Charger */}
      {step === 1 && selectedStation && (
        <div className="space-y-5 animate-slide-up">
          <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-electric-400 flex-shrink-0" />
            <div>
              <div className="font-semibold text-white text-sm">{selectedStation.name}</div>
              <div className="text-xs text-white/40">{selectedStation.address}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Select a Charger</h3>
            <ChargerSelector
              chargers={selectedStation.chargers}
              selectedId={selectedCharger?.id}
              onSelect={(c) => {
                setSelectedCharger(c);
              }}
            />
          </div>

          {selectedCharger && (
            <CostCalculator
              charger={selectedCharger}
              batteryCapacity={user?.vehicle?.batteryCapacity || 40}
              currentBattery={(user?.vehicle?.batteryCapacity || 40) * 0.25}
              onCalculate={(kwh, cost, time) => setCalcData({ kwh, cost, time })}
            />
          )}

          <button
            onClick={() => setStep(2)}
            disabled={!selectedCharger}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            Continue to Review <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Review & Confirm */}
      {step === 2 && selectedStation && selectedCharger && (
        <div className="space-y-5 animate-slide-up">
          <div className="bg-gray-900/50 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-semibold text-white text-sm mb-3">Booking Summary</h3>
              <div className="space-y-2">
                {[
                  { label: 'Station', value: selectedStation.name },
                  { label: 'Charger', value: `${selectedCharger.type} · ${selectedCharger.power}kW` },
                  { label: 'Connector', value: selectedCharger.connector },
                  { label: 'Energy', value: `${calcData.kwh} kWh` },
                  { label: 'Duration', value: `~${Math.floor(calcData.time / 60)}h ${calcData.time % 60}m` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-white/40">{label}</span>
                    <span className="text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-electric-500/5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">Estimated Total</span>
                <span className="text-xl font-bold text-electric-400 font-mono">{formatCurrency(calcData.cost)}</span>
              </div>
              <div className="text-xs text-white/30 mt-1">@ {formatCurrency(selectedCharger.pricePerKwh)}/kWh · Pay per actual usage</div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white text-sm">Start Time</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setScheduledNow(true)}
                className={`p-3 rounded-xl border text-sm font-medium transition-all text-center ${scheduledNow ? 'bg-electric-600/20 border-electric-500/50 text-electric-300' : 'bg-white/5 border-white/10 text-white/50'}`}
              >
                🚀 Start Now
              </button>
              <button
                onClick={() => setScheduledNow(false)}
                className={`p-3 rounded-xl border text-sm font-medium transition-all text-center ${!scheduledNow ? 'bg-electric-600/20 border-electric-500/50 text-electric-300' : 'bg-white/5 border-white/10 text-white/50'}`}
              >
                📅 Schedule
              </button>
            </div>
            {!scheduledNow && (
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={e => setScheduledTime(e.target.value)}
                className="input-field"
                min={new Date().toISOString().slice(0, 16)}
              />
            )}
          </div>

          {/* Vehicle */}
          {user?.vehicle && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm">
              <div className="text-white/40 mb-1">Charging Vehicle</div>
              <div className="font-medium text-white">{user.vehicle.make} {user.vehicle.model}</div>
              <div className="text-white/40 text-xs">{user.vehicle.licensePlate}</div>
            </div>
          )}

          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl p-3">
            <CreditCard className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="text-xs text-green-300">Payment processed after charging · No upfront charge</span>
          </div>

          <button
            onClick={handleBook}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-volt-600 hover:from-green-500 hover:to-volt-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-green-500/20 active:scale-95"
          >
            <Zap className="w-5 h-5" />
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}
