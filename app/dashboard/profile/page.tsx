'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Car, Phone, Mail, Edit3, Save, X, Zap, Battery, CheckCircle } from 'lucide-react';
import { useAuthStore, useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

const profileSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  licensePlate: z.string().optional(),
  batteryCapacity: z.number().min(10).max(200).optional(),
  avgKwhPerKm: z.number().min(0.05).max(0.5).optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const { sessions } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const userSessions = sessions.filter(s => s.userId === user?.id && s.status === 'completed');
  const totalKwh = userSessions.reduce((sum, s) => sum + s.kwhCharged, 0);
  const totalSpend = userSessions.reduce((sum, s) => sum + s.totalCost, 0);
  const estimatedRange = user?.vehicle
    ? Math.round(totalKwh / user.vehicle.avgKwhPerKm)
    : 0;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      vehicleMake: user?.vehicle?.make || '',
      vehicleModel: user?.vehicle?.model || '',
      licensePlate: user?.vehicle?.licensePlate || '',
      batteryCapacity: user?.vehicle?.batteryCapacity || 40,
      avgKwhPerKm: user?.vehicle?.avgKwhPerKm || 0.18,
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    updateProfile({
      name: data.name,
      phone: data.phone,
      vehicle: user?.vehicle ? {
        ...user.vehicle,
        make: data.vehicleMake || user.vehicle.make,
        model: data.vehicleModel || user.vehicle.model,
        licensePlate: data.licensePlate || user.vehicle.licensePlate,
        batteryCapacity: data.batteryCapacity || user.vehicle.batteryCapacity,
        avgKwhPerKm: data.avgKwhPerKm || user.vehicle.avgKwhPerKm,
      } : null,
    });
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Profile</h1>
          <p className="text-white/40 text-sm">Manage your account details</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 bg-green-500/15 border border-green-500/30 rounded-xl px-3 py-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-300 font-medium">Saved!</span>
          </div>
        )}
      </div>

      {/* Avatar & name */}
      <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-electric-600 to-volt-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-electric-500/20">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-display font-bold text-xl text-white">{user?.name}</div>
            <div className="text-white/40 text-sm">{user?.email}</div>
            <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${user?.role === 'admin' ? 'bg-volt-500/20 text-volt-400 border border-volt-500/30' : 'bg-electric-500/20 text-electric-400 border border-electric-500/30'}`}>
              {user?.role === 'admin' ? '🛡 Admin' : '⚡ EV Driver'}
            </div>
          </div>
          <button
            onClick={() => editing ? (reset(), setEditing(false)) : setEditing(true)}
            className="ml-auto flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm text-white/60 hover:text-white transition-all"
          >
            {editing ? <><X className="w-4 h-4" /> Cancel</> : <><Edit3 className="w-4 h-4" /> Edit</>}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Sessions', value: userSessions.length, color: 'text-electric-400' },
          { label: 'kWh Total', value: totalKwh.toFixed(1), color: 'text-volt-400' },
          { label: 'Total Spent', value: formatCurrency(totalSpend), color: 'text-orange-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-gray-900/50 border border-white/10 rounded-xl p-3 text-center">
            <div className={`font-bold text-lg font-mono ${color}`}>{value}</div>
            <div className="text-xs text-white/30 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Personal Info */}
        <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-electric-400" />
            <h3 className="font-semibold text-white text-sm">Personal Information</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Full Name</label>
              {editing ? (
                <input {...register('name')} className="input-field text-sm" />
              ) : (
                <p className="text-white text-sm py-2">{user?.name}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Email</label>
              <p className="text-white/60 text-sm py-2">{user?.email} <span className="text-xs text-white/30">(cannot change)</span></p>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Phone</label>
              {editing ? (
                <input {...register('phone')} className="input-field text-sm" />
              ) : (
                <p className="text-white text-sm py-2">{user?.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Vehicle Info */}
        {user?.vehicle && (
          <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-4 h-4 text-electric-400" />
              <h3 className="font-semibold text-white text-sm">Vehicle Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Make', field: 'vehicleMake' as const, value: user.vehicle.make },
                { label: 'Model', field: 'vehicleModel' as const, value: user.vehicle.model },
                { label: 'License Plate', field: 'licensePlate' as const, value: user.vehicle.licensePlate },
                { label: 'Year', value: user.vehicle.year.toString() },
              ].map(({ label, field, value }) => (
                <div key={label}>
                  <label className="text-xs text-white/40 mb-1 block">{label}</label>
                  {editing && field ? (
                    <input {...register(field)} className="input-field text-sm" />
                  ) : (
                    <p className="text-white text-sm py-1">{value}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Battery settings */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Battery className="w-4 h-4 text-volt-400" />
                <span className="text-xs text-white/60 font-medium">Battery Configuration</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Battery Capacity (kWh)</label>
                  {editing ? (
                    <input {...register('batteryCapacity', { valueAsNumber: true })} type="number" step="0.1" className="input-field text-sm" />
                  ) : (
                    <p className="text-white text-sm py-1">{user.vehicle.batteryCapacity} kWh</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Avg kWh/km</label>
                  {editing ? (
                    <input {...register('avgKwhPerKm', { valueAsNumber: true })} type="number" step="0.01" className="input-field text-sm" />
                  ) : (
                    <p className="text-white text-sm py-1">{user.vehicle.avgKwhPerKm} kWh/km</p>
                  )}
                </div>
              </div>

              {/* Range estimate */}
              <div className="mt-3 bg-electric-500/10 border border-electric-500/20 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Estimated range (full charge)</span>
                  <span className="text-electric-300 font-mono font-semibold">
                    ~{Math.round(user.vehicle.batteryCapacity / user.vehicle.avgKwhPerKm)} km
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {editing && (
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        )}
      </form>
    </div>
  );
}
