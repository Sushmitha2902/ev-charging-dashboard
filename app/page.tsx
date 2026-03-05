import Link from 'next/link';
import { Zap, MapPin, Shield, Clock, ChevronRight, Battery, Navigation, Star } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VoltMap - Find EV Charging Stations in Bangalore',
  description: 'Discover, book, and manage EV charging sessions across Bangalore with real-time availability.',
};

const stats = [
  { value: '25+', label: 'Stations' },
  { value: '98%', label: 'Uptime' },
  { value: '60kW', label: 'Max Power' },
  { value: '24/7', label: 'Support' },
];

const features = [
  {
    icon: MapPin,
    title: 'Real-Time Maps',
    description: 'Find stations near you with live availability — green means go.',
    color: 'from-electric-600 to-electric-400',
  },
  {
    icon: Zap,
    title: 'Instant Booking',
    description: 'Reserve your charger in advance. No more waiting in line.',
    color: 'from-volt-600 to-volt-400',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Pay per kWh with transparent pricing. Night rates as low as ₹13/kWh.',
    color: 'from-purple-600 to-purple-400',
  },
  {
    icon: Clock,
    title: 'Smart Scheduling',
    description: 'Schedule off-peak charging to save up to 30% on electricity costs.',
    color: 'from-orange-600 to-orange-400',
  },
];

const teaserStations = [
  { name: 'ITPL Supercharger', area: 'Whitefield', available: 2, total: 4, price: 24, status: 'available' as const },
  { name: 'Koramangala EV Hub', area: 'Koramangala', available: 2, total: 3, price: 22, status: 'available' as const },
  { name: 'Indiranagar 100ft', area: 'Indiranagar', available: 1, total: 3, price: 21, status: 'busy' as const },
  { name: 'MG Road Metro', area: 'MG Road', available: 2, total: 3, price: 23, status: 'available' as const },
  { name: 'Manyata Tech Park', area: 'Nagavara', available: 3, total: 4, price: 22, status: 'available' as const },
  { name: 'Electronic City Ph1', area: 'EC Phase 1', available: 4, total: 4, price: 15, status: 'available' as const },
];

const statusColors = {
  available: 'bg-green-500',
  busy: 'bg-orange-400',
  offline: 'bg-gray-500',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white overflow-x-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* Radial gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-electric-900/30 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-electric-500 to-volt-500 flex items-center justify-center shadow-lg shadow-electric-500/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white">VoltMap</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-white/60 hover:text-white transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="text-sm font-semibold bg-electric-600 hover:bg-electric-500 text-white px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-electric-500/20"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-electric-500/10 border border-electric-500/20 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-electric-300 font-medium">Live · 25 Stations Active in Bangalore</span>
          </div>

          <h1 className="font-display font-black text-5xl md:text-7xl leading-[1.1] mb-6">
            <span className="text-white">Charge Smarter.</span>
            <br />
            <span className="bg-gradient-to-r from-electric-400 via-electric-300 to-volt-400 bg-clip-text text-transparent neon-text">
              Drive Further.
            </span>
          </h1>

          <p className="text-xl text-white/50 leading-relaxed mb-10 max-w-2xl mx-auto">
            India's most intelligent EV charging network. Find available stations, book instantly,
            and track your sessions — all in real time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="flex items-center gap-2 bg-gradient-to-r from-electric-600 to-electric-500 hover:from-electric-500 hover:to-electric-400 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-2xl shadow-electric-500/30 active:scale-95 text-base"
            >
              <Zap className="w-5 h-5" />
              Start Charging Free
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-white font-medium px-8 py-4 rounded-2xl transition-all text-base"
            >
              Sign in to Dashboard
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-center gap-8 md:gap-16 mb-16 flex-wrap">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display font-black text-3xl text-white">{value}</div>
              <div className="text-sm text-white/40 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Station teaser map + list */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Map placeholder */}
          <div className="relative rounded-3xl border border-electric-500/20 overflow-hidden bg-gray-900/50 h-[380px]">
            <div className="absolute inset-0 grid-bg opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Bangalore map mockup */}
              <div className="relative w-full h-full p-6">
                {/* Fake map nodes */}
                {teaserStations.map((s, i) => {
                  const positions = [
                    { top: '25%', left: '72%' },
                    { top: '55%', left: '58%' },
                    { top: '35%', left: '62%' },
                    { top: '30%', left: '50%' },
                    { top: '20%', left: '57%' },
                    { top: '78%', left: '60%' },
                  ];
                  return (
                    <div
                      key={s.name}
                      className="absolute flex flex-col items-center cursor-pointer group"
                      style={positions[i]}
                    >
                      <div className={`w-3 h-3 rounded-full ${statusColors[s.status]} shadow-lg`}>
                        {s.status === 'available' && (
                          <div className={`w-3 h-3 rounded-full ${statusColors[s.status]} animate-ping absolute opacity-75`} />
                        )}
                      </div>
                      <div className="hidden group-hover:block absolute bottom-5 bg-gray-800 border border-white/20 rounded-xl p-2 text-xs whitespace-nowrap z-10 shadow-xl">
                        <div className="font-semibold text-white">{s.name}</div>
                        <div className="text-white/50">₹{s.price}/kWh · {s.available}/{s.total} free</div>
                      </div>
                    </div>
                  );
                })}
                {/* Center label */}
                <div className="absolute inset-0 flex items-end p-4">
                  <div className="bg-electric-900/80 border border-electric-500/30 rounded-xl px-3 py-2 backdrop-blur">
                    <p className="text-xs text-electric-300 font-medium">📍 Bangalore, Karnataka</p>
                    <p className="text-xs text-white/40 mt-0.5">Interactive map in dashboard →</p>
                  </div>
                </div>
                {/* User dot */}
                <div className="absolute" style={{ top: '50%', left: '55%' }}>
                  <div className="w-4 h-4 rounded-full bg-electric-500 border-2 border-white shadow-lg shadow-electric-500/50" />
                  <div className="absolute inset-0 w-4 h-4 rounded-full bg-electric-500 animate-ping opacity-40" />
                </div>
              </div>
            </div>
            <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur border border-white/10 rounded-xl px-3 py-2">
              <p className="text-xs font-semibold text-white">Live Station Map</p>
              <p className="text-xs text-white/40">Real-time availability</p>
            </div>
          </div>

          {/* Station list teaser */}
          <div className="rounded-3xl border border-white/10 bg-gray-900/50 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-display font-semibold text-white">Nearby Stations</h3>
              <span className="text-xs text-white/40">Bangalore</span>
            </div>
            <div className="divide-y divide-white/5">
              {teaserStations.map((station) => (
                <div key={station.name} className="flex items-center justify-between p-4 hover:bg-white/3 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-2.5 h-2.5 rounded-full ${statusColors[station.status]}`} />
                      {station.status === 'available' && (
                        <div className={`w-2.5 h-2.5 rounded-full ${statusColors[station.status]} animate-ping absolute inset-0 opacity-75`} />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{station.name}</div>
                      <div className="text-xs text-white/40">{station.area} · {station.available}/{station.total} available</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white">₹{station.price}</div>
                    <div className="text-xs text-white/40">/kWh</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/10 text-center">
              <Link href="/auth/register" className="text-sm text-electric-400 hover:text-electric-300 font-medium transition-colors">
                View all 25 stations →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="font-display font-black text-3xl md:text-4xl text-white mb-4">
            Built for EV Drivers
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Everything you need to never run out of charge.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="group relative rounded-2xl border border-white/10 hover:border-electric-500/30 bg-gray-900/40 p-6 transition-all duration-300 hover:bg-gray-900/60"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} bg-opacity-20 flex items-center justify-center mb-4 shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="rounded-3xl border border-electric-500/20 bg-gradient-to-br from-electric-900/30 to-gray-900/60 p-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-electric-500 to-volt-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-electric-500/30">
            <Battery className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display font-black text-3xl md:text-4xl text-white mb-4">
            Ready to charge smarter?
          </h2>
          <p className="text-white/50 mb-8 text-lg">
            Join thousands of EV drivers in Bangalore already using VoltMap.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-electric-600 to-electric-500 hover:from-electric-500 hover:to-electric-400 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-2xl shadow-electric-500/30 active:scale-95 text-base"
          >
            <Zap className="w-5 h-5" />
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-electric-400" />
          <span className="text-sm text-white/40">VoltMap © 2026</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-white/30">All systems operational</span>
        </div>
      </footer>
    </div>
  );
}
