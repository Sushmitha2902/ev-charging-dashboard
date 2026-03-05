# ⚡ VoltMap — EV Charging Station Dashboard

A modern, production-ready EV Charging Station Network dashboard built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Live Demo

**Vercel URL:** [Deploy to get URL]

## ✨ Features

### User Features
- 🗺️ **Interactive Map** — Google Maps with real-time station availability, clusters, radius overlay
- 🔍 **Smart Filters** — Filter by charger type, price, distance, availability
- 📅 **Booking Flow** — Multi-step charger booking with cost calculator
- 🧮 **Cost Calculator** — Dynamic kWh slider + estimated time
- 📊 **Session History** — Full timeline with invoice viewer
- 👤 **Profile Management** — Vehicle details, battery config, stats

### Admin Features
- 📈 **Analytics Dashboard** — Sessions, revenue, charger status, peak hours
- 🏢 **Station Management** — Full CRUD with expandable charger details
- ✅ **Approval Queue** — Approve/reject bookings, monitor active sessions

### UI/UX
- 🌙 **Dark/Light Theme** — Toggle with system preference detection
- 📱 **Mobile-First** — Responsive with drawer navigation on mobile
- ⚡ **Real-time Indicators** — Animated availability dots (green/orange/red)
- 💰 **Dynamic Pricing Badges** — Peak ₹22/kWh, Night ₹15/kWh
- 🦴 **Skeleton Loaders** — For map and station list
- 🔒 **Auth Persistence** — Session stored in localStorage via Zustand

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14 (App Router) | Framework |
| React 18 + TypeScript | UI |
| Tailwind CSS | Styling |
| Zustand + persist | State management |
| React Hook Form + Zod | Form validation |
| @react-google-maps/api | Maps |
| Recharts | Analytics charts |
| date-fns | Date formatting |

## 📁 Project Structure

```
ev-dashboard/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── auth/
│   │   ├── login/page.tsx        # Login
│   │   └── register/page.tsx     # Register (multi-step)
│   ├── dashboard/
│   │   ├── layout.tsx            # Auth-protected layout
│   │   ├── page.tsx              # Map + station list
│   │   ├── book/page.tsx         # 3-step booking flow
│   │   ├── sessions/page.tsx     # History + invoices
│   │   └── profile/page.tsx      # Profile management
│   └── admin/
│       ├── layout.tsx            # Admin-only layout
│       ├── page.tsx              # Analytics dashboard
│       ├── stations/page.tsx     # Station CRUD
│       └── approvals/page.tsx    # Booking queue
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx           # Nav sidebar + mobile drawer
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeToggle.tsx
│   ├── map/
│   │   ├── EVMap.tsx             # Google Maps component
│   │   ├── StationCard.tsx       # Station preview card
│   │   └── FilterChips.tsx       # Quick filter buttons
│   ├── booking/
│   │   ├── ChargerSelector.tsx   # Charger type picker
│   │   ├── CostCalculator.tsx    # kWh slider + cost preview
│   │   └── SessionCard.tsx       # Session timeline card
│   └── ui/
│       └── Skeleton.tsx          # Loading skeletons
├── lib/
│   ├── types.ts                  # TypeScript interfaces
│   ├── utils.ts                  # Helper functions
│   └── store.ts                  # Zustand stores (auth + app)
└── data/
    ├── stations.json             # 25 Bangalore stations
    ├── users.json                # Mock user accounts
    └── sessions.json             # Mock booking sessions
```

## 🏃 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/your-username/ev-charging-dashboard
cd ev-charging-dashboard
npm install
```

### 2. Configure Google Maps API Key

Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**Getting a Google Maps API Key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create/select a project
3. Enable these APIs: **Maps JavaScript API**, **Geocoding API**, **Places API**
4. Create credentials → API Key
5. Restrict to your domain for production

> **Note:** Without a valid API key, the map will show an error message. All other features (auth, booking, admin) work independently.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| User | arjun@example.com | password123 |
| User | priya@example.com | password123 |
| Admin | admin@evcharge.com | admin123 |

## 🗺️ Mock Data — Bangalore Stations

25 stations across key areas:

| Area | Stations | Price Range |
|------|----------|-------------|
| Koramangala | 3 | ₹18–₹25/kWh (Premium) |
| Whitefield | 3 | ₹16–₹28/kWh (IT Hub) |
| Electronic City | 2 | ₹12–₹15/kWh (Budget) |
| Indiranagar | 1 | ₹17–₹21/kWh |
| MG Road | 1 | ₹19–₹23/kWh |
| Manyata Tech Park | 1 | ₹16–₹22/kWh |
| + 14 more areas | ... | ... |

## 📱 Demo Scenarios

```
Peak Hours (8–10 AM, 6–9 PM):  Red availability indicators
Night Rate (10 PM – 6 AM):     Blue ₹13–₹15/kWh badges
Standard Rate (rest):           Green ₹15–₹25/kWh

Active Sessions: ses001 (Whitefield ITPL), ses002 (Koramangala)
Pending: ses008 (Phoenix Mall Whitefield)
Completed: 5 sessions with invoices
```

## 🌐 Deployment (Vercel)

```bash
npm i -g vercel
vercel

# Set environment variable:
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = your_key
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) and add the env var in Project Settings.

## 🎨 Design System

- **Primary:** Electric Blue (`#0ea5e9`) — CTAs, active states, maps
- **Secondary:** Volt Green (`#22c55e`) — Success, available status
- **Accent:** Charge Orange (`#f97316`) — Busy status, warnings
- **Background:** Deep Navy (`#0a0f1e`) — Dark theme base
- **Font Display:** Exo 2 — Headers, station names
- **Font Body:** DM Sans — Content, labels
- **Font Mono:** JetBrains Mono — Numbers, codes, prices

---

Built for the IR Infotech Frontend Intern Hiring Task 🚀
