'use client';

import { useState } from 'react';
import { History, Zap, TrendingUp, Clock, Filter, X } from 'lucide-react';
import { useAuthStore, useAppStore } from '@/lib/store';
import { SessionCard } from '@/components/booking/SessionCard';
import { SessionSkeleton } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/lib/utils';
import { SessionStatus } from '@/lib/types';

const STATUS_FILTERS: { value: SessionStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Sessions' },
  { value: 'active', label: '⚡ Active' },
  { value: 'completed', label: '✅ Completed' },
  { value: 'pending', label: '⏳ Pending' },
  { value: 'cancelled', label: '❌ Cancelled' },
];

export default function SessionsPage() {
  const { user } = useAuthStore();
  const { sessions } = useAppStore();
  const [statusFilter, setStatusFilter] = useState<SessionStatus | 'all'>('all');
  const [showInvoice, setShowInvoice] = useState<string | null>(null);

  const userSessions = sessions
    .filter(s => s.userId === user?.id)
    .filter(s => statusFilter === 'all' || s.status === statusFilter)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  const allUserSessions = sessions.filter(s => s.userId === user?.id);
  const totalSpend = allUserSessions.reduce((sum, s) => sum + s.totalCost, 0);
  const totalKwh = allUserSessions.reduce((sum, s) => sum + s.kwhCharged, 0);
  const completedCount = allUserSessions.filter(s => s.status === 'completed').length;

  const invoiceSession = sessions.find(s => s.id === showInvoice);

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-white">My Sessions</h1>
        <p className="text-white/40 text-sm mt-1">Track your charging history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Sessions', value: allUserSessions.length, icon: History, color: 'text-electric-400', bg: 'bg-electric-500/10' },
          { label: 'kWh Charged', value: `${totalKwh.toFixed(1)}`, icon: Zap, color: 'text-volt-400', bg: 'bg-volt-500/10' },
          { label: 'Total Spent', value: formatCurrency(totalSpend), icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-gray-900/50 border border-white/10 rounded-2xl p-4">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className={`font-bold text-xl font-mono ${color}`}>{value}</div>
            <div className="text-xs text-white/30 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              statusFilter === value
                ? 'bg-electric-600/20 border-electric-500/40 text-electric-300'
                : 'bg-white/5 border-white/10 text-white/50 hover:text-white/70'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sessions list */}
      {userSessions.length === 0 ? (
        <div className="text-center py-20">
          <History className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No sessions found</p>
          {statusFilter !== 'all' && (
            <button onClick={() => setStatusFilter('all')} className="text-electric-400 text-sm mt-2 hover:underline">
              Show all sessions
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {userSessions.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              onViewInvoice={(s) => setShowInvoice(s.id)}
            />
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && invoiceSession && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/15 rounded-3xl w-full max-w-sm shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-white">Invoice</h3>
                  <p className="text-xs text-white/40 font-mono">{invoiceSession.invoiceId}</p>
                </div>
                <button onClick={() => setShowInvoice(null)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="text-center py-4 border border-dashed border-white/15 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-electric-500/15 flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-5 h-5 text-electric-400" />
                  </div>
                  <p className="font-semibold text-white text-xs">{invoiceSession.stationName}</p>
                </div>

                {[
                  { label: 'Date', value: new Date(invoiceSession.startTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { label: 'Energy Delivered', value: `${invoiceSession.kwhCharged} kWh` },
                  { label: 'Rate', value: `${formatCurrency(invoiceSession.pricePerKwh)}/kWh` },
                  { label: 'Duration', value: invoiceSession.endTime ? `${Math.round((new Date(invoiceSession.endTime!).getTime() - new Date(invoiceSession.startTime).getTime()) / 60000)} min` : '—' },
                  { label: 'Connector', value: invoiceSession.connectorType },
                  { label: 'Vehicle', value: invoiceSession.vehicleInfo },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-xs">
                    <span className="text-white/40">{label}</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}

                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="font-bold text-white">Total Charged</span>
                  <span className="font-bold text-xl text-electric-400 font-mono">{formatCurrency(invoiceSession.totalCost)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/30">Payment Status</span>
                  <span className={invoiceSession.paymentStatus === 'paid' ? 'text-green-400' : 'text-orange-400'}>
                    {invoiceSession.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
