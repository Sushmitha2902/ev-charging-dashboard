'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Zap, TrendingUp, Activity, DollarSign } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

const weeklyData = [
  { day: 'Mon', sessions: 42, revenue: 8820 },
  { day: 'Tue', sessions: 38, revenue: 7980 },
  { day: 'Wed', sessions: 55, revenue: 11550 },
  { day: 'Thu', sessions: 61, revenue: 12810 },
  { day: 'Fri', sessions: 78, revenue: 16380 },
  { day: 'Sat', sessions: 94, revenue: 19740 },
  { day: 'Sun', sessions: 67, revenue: 14070 },
];

const hourlyData = [
  { hour: '6am', sessions: 12 }, { hour: '8am', sessions: 28 },
  { hour: '10am', sessions: 22 }, { hour: '12pm', sessions: 18 },
  { hour: '2pm', sessions: 20 }, { hour: '4pm', sessions: 35 },
  { hour: '6pm', sessions: 48 }, { hour: '8pm', sessions: 42 },
  { hour: '10pm', sessions: 15 }, { hour: '12am', sessions: 8 },
];

const COLORS = ['#22c55e', '#f97316', '#6b7280', '#0ea5e9'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-white/20 rounded-xl p-3 shadow-xl">
        <p className="text-white/60 text-xs mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name === 'revenue' ? formatCurrency(p.value) : `${p.value} sessions`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminAnalyticsPage() {
  const { stations, sessions } = useAppStore();

  const totalChargers = stations.flatMap(s => s.chargers).length;
  const availableChargers = stations.flatMap(s => s.chargers).filter(c => c.status === 'available').length;
  const busyChargers = stations.flatMap(s => s.chargers).filter(c => c.status === 'busy').length;
  const offlineChargers = stations.flatMap(s => s.chargers).filter(c => c.status === 'offline').length;

  const todaySessions = sessions.filter(s => {
    const sessionDate = new Date(s.startTime).toDateString();
    const today = new Date().toDateString();
    return sessionDate === today;
  });

  const todayRevenue = todaySessions.reduce((sum, s) => sum + s.totalCost, 0);
  const totalRevenue = sessions.reduce((sum, s) => sum + s.totalCost, 0);
  const totalKwh = sessions.reduce((sum, s) => sum + s.kwhCharged, 0);

  const chargerDistribution = [
    { name: 'Available', value: availableChargers },
    { name: 'Busy', value: busyChargers },
    { name: 'Offline', value: offlineChargers },
  ];

  const areaData = Object.entries(
    stations.reduce((acc, s) => {
      acc[s.area] = (acc[s.area] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([area, count]) => ({ area, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const topStations = stations
    .map(s => ({
      ...s,
      sessionCount: sessions.filter(sess => sess.stationId === s.id).length,
      revenue: sessions.filter(sess => sess.stationId === s.id).reduce((sum, sess) => sum + sess.totalCost, 0),
    }))
    .sort((a, b) => b.sessionCount - a.sessionCount)
    .slice(0, 5);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Analytics Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Network overview — Bangalore Region</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Activity, label: "Today's Sessions", value: todaySessions.length, sub: `${sessions.length} total`, color: 'text-electric-400', bg: 'bg-electric-500/10', trend: '+12%' },
          { icon: DollarSign, label: "Today's Revenue", value: formatCurrency(todayRevenue), sub: `${formatCurrency(totalRevenue)} total`, color: 'text-green-400', bg: 'bg-green-500/10', trend: '+8%' },
          { icon: Zap, label: 'Active Chargers', value: `${busyChargers}/${totalChargers}`, sub: `${availableChargers} available`, color: 'text-orange-400', bg: 'bg-orange-500/10', trend: `${Math.round((busyChargers / totalChargers) * 100)}%` },
          { icon: TrendingUp, label: 'kWh Delivered', value: `${totalKwh.toFixed(0)}`, sub: 'All time total', color: 'text-volt-400', bg: 'bg-volt-500/10', trend: '+23%' },
        ].map(({ icon: Icon, label, value, sub, color, bg, trend }) => (
          <div key={label} className="bg-gray-900/50 border border-white/10 rounded-2xl p-4">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-white/40 leading-tight">{label}</span>
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <div className={`font-display font-bold text-xl ${color}`}>{value}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-white/30">{sub}</span>
              <span className="text-xs text-green-400 font-mono">{trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* Weekly sessions */}
        <div className="md:col-span-2 bg-gray-900/50 border border-white/10 rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-1">Weekly Sessions & Revenue</h3>
          <p className="text-xs text-white/40 mb-4">Last 7 days performance</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sessions" name="sessions" fill="#0ea5e9" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
              <Bar dataKey="revenue" name="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} fillOpacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <div className="w-2.5 h-2.5 rounded-sm bg-electric-500" /> Sessions
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <div className="w-2.5 h-2.5 rounded-sm bg-green-500" /> Revenue (₹)
            </div>
          </div>
        </div>

        {/* Charger distribution */}
        <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-1">Charger Status</h3>
          <p className="text-xs text-white/40 mb-3">Live availability</p>
          <div className="flex justify-center mb-3">
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={chargerDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chargerDistribution.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {chargerDistribution.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-xs text-white/60">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white font-mono">{item.value}</span>
                  <span className="text-xs text-white/30">({Math.round((item.value / totalChargers) * 100)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Peak hours */}
        <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-1">Peak Usage Hours</h3>
          <p className="text-xs text-white/40 mb-4">Sessions by hour of day</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ fill: '#f97316', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 flex items-center gap-2 text-xs text-orange-400/70">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            Peak: 6PM–8PM (Evening commute)
          </div>
        </div>

        {/* Top stations */}
        <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-1">Top Stations</h3>
          <p className="text-xs text-white/40 mb-4">By number of sessions</p>
          <div className="space-y-3">
            {topStations.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-white/40">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">{s.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div
                      className="h-1.5 rounded-full bg-electric-500"
                      style={{ width: `${Math.max(10, (s.sessionCount / topStations[0].sessionCount) * 100)}%`, maxWidth: '120px' }}
                    />
                    <span className="text-xs text-white/30 font-mono">{s.sessionCount} sessions</span>
                  </div>
                </div>
                <div className="text-xs text-green-400 font-mono">{formatCurrency(s.revenue)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Area distribution */}
      <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-5">
        <h3 className="font-semibold text-white mb-1">Stations by Area</h3>
        <p className="text-xs text-white/40 mb-4">Coverage across Bangalore</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {areaData.map(({ area, count }) => (
            <div key={area} className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
              <span className="text-sm text-white/70">{area}</span>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="w-1.5 h-4 bg-electric-500/60 rounded-full" />
                  ))}
                </div>
                <span className="text-sm font-bold text-electric-400 font-mono">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
