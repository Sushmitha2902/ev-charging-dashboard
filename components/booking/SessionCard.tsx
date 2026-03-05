'use client';

import { Session } from '@/lib/types';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';
import { Zap, MapPin, Clock, Receipt, CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SessionCardProps {
  session: Session;
  onViewInvoice?: (session: Session) => void;
}

const statusConfig = {
  active: { icon: Loader, color: 'text-electric-400', bg: 'bg-electric-500/15 border-electric-500/30', label: 'Charging Active', pulse: true },
  completed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/15 border-green-500/30', label: 'Completed', pulse: false },
  cancelled: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30', label: 'Cancelled', pulse: false },
  pending: { icon: AlertCircle, color: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/30', label: 'Pending', pulse: true },
};

export function SessionCard({ session, onViewInvoice }: SessionCardProps) {
  const config = statusConfig[session.status];
  const Icon = config.icon;
  const duration = session.endTime
    ? Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000)
    : null;

  return (
    <div className={cn(
      'rounded-2xl border p-5 transition-all duration-200',
      'bg-gradient-to-br from-gray-900/80 to-gray-900/40',
      session.status === 'active' ? 'border-electric-500/40 shadow-lg shadow-electric-500/10' : 'border-white/10'
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('flex items-center gap-1.5 border rounded-full px-2.5 py-1', config.bg)}>
            <Icon className={cn('w-3.5 h-3.5', config.color, config.pulse && 'animate-spin')} />
            <span className={cn('text-xs font-semibold', config.color)}>{config.label}</span>
          </div>
          {session.invoiceId && (
            <span className="text-xs text-white/30 font-mono">{session.invoiceId}</span>
          )}
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-white font-mono">
            {session.status === 'cancelled' ? '—' : formatCurrency(session.totalCost || session.kwhCharged * session.pricePerKwh)}
          </div>
          <div className="text-xs text-white/40">
            {session.paymentStatus === 'paid' ? '✅ Paid' : session.paymentStatus === 'refunded' ? '↩ Refunded' : '⏳ Pending'}
          </div>
        </div>
      </div>

      {/* Station info */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-electric-500/10 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-electric-400" />
        </div>
        <div>
          <div className="font-semibold text-white text-sm">{session.stationName}</div>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-white/30" />
            <span className="text-xs text-white/40 line-clamp-1">{session.stationAddress}</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-xs text-white/40 mb-1">Started</div>
          <div className="text-xs font-medium text-white">{formatDate(session.startTime)}</div>
          <div className="text-xs text-white/60 font-mono">{formatTime(session.startTime)}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-xs text-white/40 mb-1">
            {session.endTime ? 'Ended' : 'Est. End'}
          </div>
          <div className="text-xs font-medium text-white">
            {session.endTime
              ? formatDate(session.endTime)
              : formatDate(session.estimatedEndTime)}
          </div>
          <div className="text-xs text-white/60 font-mono">
            {session.endTime
              ? formatTime(session.endTime)
              : formatTime(session.estimatedEndTime)}
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-xs text-white/40 mb-1">Duration</div>
          <div className="text-xs font-medium text-white">
            {duration ? `${Math.floor(duration / 60)}h ${duration % 60}m` : '—'}
          </div>
          <div className="text-xs text-white/60">{session.connectorType}</div>
        </div>
      </div>

      {/* Energy stats */}
      <div className="flex items-center justify-between py-3 border-t border-white/8">
        <div className="flex items-center gap-4 text-xs text-white/50">
          <span><span className="text-white/80 font-mono">{session.kwhCharged}</span> kWh charged</span>
          <span><span className="text-white/80 font-mono">{formatCurrency(session.pricePerKwh)}</span>/kWh</span>
          <span className="text-xs text-white/40">{session.vehicleInfo.split(' - ')[0]}</span>
        </div>
        {session.invoiceId && (
          <button
            onClick={() => onViewInvoice?.(session)}
            className="flex items-center gap-1.5 text-xs text-electric-400 hover:text-electric-300 border border-electric-500/20 hover:border-electric-500/40 px-3 py-1.5 rounded-lg transition-all"
          >
            <Receipt className="w-3.5 h-3.5" />
            Invoice
          </button>
        )}
      </div>

      {/* Active progress bar */}
      {session.status === 'active' && (
        <div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-electric-600 to-volt-500 rounded-full animate-pulse"
              style={{ width: `${Math.min((session.kwhCharged / 40) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-white/30">Charging in progress</span>
            <span className="text-xs text-electric-400 font-mono">{session.kwhCharged} kWh</span>
          </div>
        </div>
      )}
    </div>
  );
}
