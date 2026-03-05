'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus, Search, Edit3, Trash2, X, MapPin, Zap, Star,
  CheckCircle, AlertCircle, Building2, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Station } from '@/lib/types';
import { getStationAvailability, getAvailableCount, formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

const stationSchema = z.object({
  name: z.string().min(3, 'Name too short'),
  address: z.string().min(10, 'Full address required'),
  area: z.string().min(2),
  openHours: z.string().min(3),
  isPremium: z.boolean(),
});

type StationForm = z.infer<typeof stationSchema>;

export default function AdminStationsPage() {
  const { stations } = useAppStore();
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editStation, setEditStation] = useState<Station | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<StationForm>({
    resolver: zodResolver(stationSchema),
    defaultValues: { isPremium: false },
  });

  const filtered = stations.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.area.toLowerCase().includes(search.toLowerCase()) ||
    s.address.toLowerCase().includes(search.toLowerCase())
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const onSubmit = async (data: StationForm) => {
    await new Promise(r => setTimeout(r, 500));
    setShowAddModal(false);
    setEditStation(null);
    reset();
    showToast(editStation ? 'Station updated successfully' : 'Station added successfully');
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm(null);
    showToast('Station removed from network');
  };

  const statusCounts = {
    available: stations.filter(s => getStationAvailability(s) === 'available').length,
    busy: stations.filter(s => getStationAvailability(s) === 'busy').length,
    offline: stations.filter(s => getStationAvailability(s) === 'offline').length,
  };

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-300 px-4 py-3 rounded-xl shadow-xl animate-slide-up">
          <CheckCircle className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Station Management</h1>
          <p className="text-white/40 text-sm mt-1">{stations.length} stations across Bangalore</p>
        </div>
        <button
          onClick={() => { setEditStation(null); reset({ isPremium: false }); setShowAddModal(true); }}
          className="flex items-center gap-2 bg-electric-600 hover:bg-electric-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-electric-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Station
        </button>
      </div>

      {/* Status overview */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Available', count: statusCounts.available, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
          { label: 'Busy', count: statusCounts.busy, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
          { label: 'Offline', count: statusCounts.offline, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className={`rounded-xl border p-4 text-center ${bg}`}>
            <div className={`text-2xl font-bold font-mono ${color}`}>{count}</div>
            <div className="text-xs text-white/40 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search stations by name, area, or address..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Station list */}
      <div className="space-y-3">
        {filtered.map(station => {
          const availability = getStationAvailability(station);
          const isExpanded = expandedId === station.id;

          return (
            <div key={station.id} className="bg-gray-900/50 border border-white/10 rounded-2xl overflow-hidden">
              {/* Station row */}
              <div className="p-4 flex items-center gap-4">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  availability === 'available' ? 'bg-green-500/15' : availability === 'busy' ? 'bg-orange-500/15' : 'bg-gray-500/15'
                )}>
                  <Building2 className={cn(
                    'w-5 h-5',
                    availability === 'available' ? 'text-green-400' : availability === 'busy' ? 'text-orange-400' : 'text-gray-500'
                  )} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-white">{station.name}</span>
                    {station.isPremium && (
                      <span className="text-xs bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 px-1.5 py-0.5 rounded-md">⭐ Premium</span>
                    )}
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full border',
                      availability === 'available' ? 'bg-green-500/15 border-green-500/30 text-green-400' :
                      availability === 'busy' ? 'bg-orange-500/15 border-orange-500/30 text-orange-400' :
                      'bg-gray-500/15 border-gray-500/30 text-gray-400'
                    )}>
                      {getAvailableCount(station)}/{station.chargers.length} available
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-white/40">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{station.area}</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" />{station.rating}</span>
                    <span>{station.openHours}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setEditStation(station);
                      reset({
                        name: station.name,
                        address: station.address,
                        area: station.area,
                        openHours: station.openHours,
                        isPremium: station.isPremium,
                      });
                      setShowAddModal(true);
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(station.id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : station.id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded charger details */}
              {isExpanded && (
                <div className="border-t border-white/10 p-4 space-y-3 bg-black/20">
                  <div className="text-xs text-white/40 font-semibold uppercase tracking-widest">Chargers</div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {station.chargers.map(charger => (
                      <div
                        key={charger.id}
                        className={cn(
                          'flex items-center justify-between p-3 rounded-xl border text-sm',
                          charger.status === 'available' ? 'bg-green-500/5 border-green-500/20' :
                          charger.status === 'busy' ? 'bg-orange-500/5 border-orange-500/20' :
                          'bg-gray-500/5 border-gray-500/20'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'w-2 h-2 rounded-full',
                            charger.status === 'available' ? 'bg-green-400' :
                            charger.status === 'busy' ? 'bg-orange-400' : 'bg-gray-500'
                          )} />
                          <div>
                            <div className="text-xs font-medium text-white">{charger.type}</div>
                            <div className="text-xs text-white/40">{charger.connector} · {charger.power}kW</div>
                          </div>
                        </div>
                        <div className="text-xs font-mono text-white/70">{formatCurrency(charger.pricePerKwh)}/kWh</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-white/30 mt-2">{station.address}</div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">No stations found for "{search}"</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/15 rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-bold text-white">{editStation ? 'Edit Station' : 'Add New Station'}</h3>
                <button onClick={() => { setShowAddModal(false); setEditStation(null); }} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Station Name</label>
                  <input {...register('name')} className="input-field text-sm" placeholder="e.g. Koramangala EV Hub" />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Full Address</label>
                  <input {...register('address')} className="input-field text-sm" placeholder="Street, Area, Bangalore" />
                  {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Area</label>
                    <input {...register('area')} className="input-field text-sm" placeholder="e.g. Whitefield" />
                    {errors.area && <p className="text-xs text-red-400 mt-1">{errors.area.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Open Hours</label>
                    <input {...register('openHours')} className="input-field text-sm" placeholder="24/7 or 6 AM - 10 PM" />
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <input {...register('isPremium')} type="checkbox" id="isPremium" className="w-4 h-4 accent-electric-500" />
                  <label htmlFor="isPremium" className="text-sm text-white/70 cursor-pointer">Premium Station (extra amenities)</label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setShowAddModal(false); setEditStation(null); }} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                    {editStation ? 'Save Changes' : 'Add Station'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-red-500/20 rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="font-bold text-white mb-2">Remove Station?</h3>
            <p className="text-white/50 text-sm mb-5">This action cannot be undone. All associated chargers will be deactivated.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger flex-1">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
