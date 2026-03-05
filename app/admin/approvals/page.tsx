'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Clock, User, Zap, MapPin, AlertCircle, Filter } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Session } from '@/lib/types';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function AdminApprovalsPage() {
  const { sessions, updateSession } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'active'>('all');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const pendingOrActive = sessions
    .filter(s => filter === 'all' ? (s.status === 'pending' || s.status === 'active') : s.status === filter)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  const handleApprove = (session: Session) => {
    updateSession(session.id, { status: 'active' });
    showToast(`Session ${session.id.slice(0, 8)} approved`);
  };

  const handleReject = (session: Session) => {
    updateSession(session.id, { status: 'cancelled', endTime: new Date().toISOString() });
    showToast(`Session ${session.id.slice(0, 8)} cancelled`);
  };

  const pendingCount = sessions.filter(s => s.status === 'pending').length;
  const activeCount = sessions.filter(s => s.status === 'active').length;

  const allSessions = sessions;
  const completedToday = allSessions.filter(s => {
    if (s.status !== 'completed') return false;
    return new Date(s.startTime).toDateString() === new Date().toDateString();
  }).length;

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
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Approval Queue</h1>
        <p className="text-white/40 text-sm mt-1">Manage booking requests and active sessions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Pending Approval', count: pendingCount, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', icon: Clock },
          { label: 'Active Sessions', count: activeCount, color: 'text-electric-400', bg: 'bg-electric-500/10 border-electric-500/20', icon: Zap },
          { label: 'Completed Today', count: completedToday, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: CheckCircle },
        ].map(({ label, count, color, bg, icon: Icon }) => (
          <div key={label} className={`rounded-xl border p-4 ${bg}`}>
            <div className="flex items-center justify-between mb-2">
              <Icon className={`w-5 h-5 ${color}`} />
              {count > 0 && label === 'Pending Approval' && (
                <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              )}
            </div>
            <div className={`text-2xl font-bold font-mono ${color}`}>{count}</div>
            <div className="text-xs text-white/40 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[
          { value: 'all', label: 'All Queue' },
          { value: 'pending', label: `⏳ Pending (${pendingCount})` },
          { value: 'active', label: `⚡ Active (${activeCount})` },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value as typeof filter)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all border',
              filter === value
                ? 'bg-electric-600/20 border-electric-500/40 text-electric-300'
                : 'bg-white/5 border-white/10 text-white/50 hover:text-white/70'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sessions queue */}
      {pendingOrActive.length === 0 ? (
        <div className="text-center py-20">
          <CheckCircle className="w-12 h-12 text-green-400/40 mx-auto mb-4" />
          <p className="text-white/40 font-medium">Queue is clear!</p>
          <p className="text-white/25 text-sm mt-1">No pending sessions to review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingOrActive.map(session => (
            <div
              key={session.id}
              className={cn(
                'rounded-2xl border p-5 transition-all',
                session.status === 'pending'
                  ? 'bg-orange-500/5 border-orange-500/25'
                  : 'bg-electric-500/5 border-electric-500/25'
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'flex items-center gap-1.5 rounded-full px-2.5 py-1 border text-xs font-semibold',
                    session.status === 'pending'
                      ? 'bg-orange-500/15 border-orange-500/30 text-orange-300'
                      : 'bg-electric-500/15 border-electric-500/30 text-electric-300'
                  )}>
                    {session.status === 'pending' ? <Clock className="w-3 h-3" /> : <Zap className="w-3 h-3 animate-pulse" />}
                    {session.status === 'pending' ? 'Pending Approval' : 'Active'}
                  </div>
                  <span className="text-xs text-white/30 font-mono">{session.id.slice(0, 12)}...</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">{formatDate(session.startTime)}</div>
                  <div className="text-xs text-white/40">{formatTime(session.startTime)}</div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-electric-500/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-electric-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{session.stationName}</div>
                    <div className="text-xs text-white/40 mt-0.5">{session.connectorType} charger</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white/50" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{session.vehicleInfo.split(' - ')[0]}</div>
                    <div className="text-xs text-white/40 mt-0.5">{session.vehicleInfo.split(' - ')[1]}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4 bg-white/5 rounded-xl p-3 text-xs">
                <div>
                  <span className="text-white/40">Rate: </span>
                  <span className="text-white font-mono">{formatCurrency(session.pricePerKwh)}/kWh</span>
                </div>
                <div>
                  <span className="text-white/40">Est. End: </span>
                  <span className="text-white font-mono">{formatTime(session.estimatedEndTime)}</span>
                </div>
                {session.kwhCharged > 0 && (
                  <div>
                    <span className="text-white/40">Charged: </span>
                    <span className="text-electric-300 font-mono">{session.kwhCharged} kWh</span>
                  </div>
                )}
              </div>

              {session.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReject(session)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium py-2.5 rounded-xl transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(session)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 text-green-400 text-sm font-semibold py-2.5 rounded-xl transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                </div>
              )}

              {session.status === 'active' && (
                <div className="flex gap-3">
                  <div className="flex-1 flex items-center gap-2 bg-electric-500/10 border border-electric-500/20 rounded-xl py-2.5 px-4">
                    <div className="w-2 h-2 rounded-full bg-electric-400 animate-pulse" />
                    <span className="text-xs text-electric-300">Session in progress</span>
                  </div>
                  <button
                    onClick={() => handleReject(session)}
                    className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    Stop
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* All sessions summary */}
      <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-5">
        <h3 className="font-semibold text-white mb-4 text-sm">All Sessions Overview</h3>
        <div className="space-y-2">
          {sessions.slice(0, 5).map(session => (
            <div key={session.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  session.status === 'active' ? 'bg-electric-400 animate-pulse' :
                  session.status === 'completed' ? 'bg-green-400' :
                  session.status === 'pending' ? 'bg-orange-400' : 'bg-gray-400'
                )} />
                <div>
                  <span className="text-xs text-white/70">{session.stationName}</span>
                  <div className="text-xs text-white/30">{formatDate(session.startTime)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-white/60">{formatCurrency(session.totalCost)}</div>
                <div className={cn(
                  'text-xs capitalize',
                  session.status === 'active' ? 'text-electric-400' :
                  session.status === 'completed' ? 'text-green-400' :
                  session.status === 'pending' ? 'text-orange-400' : 'text-gray-400'
                )}>
                  {session.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
