'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Session, Station, FilterOptions, BookingFormData } from './types';
import usersData from '@/data/users.json';
import sessionsData from '@/data/sessions.json';
import stationsData from '@/data/stations.json';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

interface AppState {
  stations: Station[];
  sessions: Session[];
  userLocation: { lat: number; lng: number } | null;
  selectedStation: Station | null;
  filters: FilterOptions;
  theme: 'dark' | 'light';
  setUserLocation: (loc: { lat: number; lng: number }) => void;
  setSelectedStation: (station: Station | null) => void;
  setFilters: (filters: FilterOptions) => void;
  toggleTheme: () => void;
  addSession: (session: Session) => void;
  updateSession: (id: string, data: Partial<Session>) => void;
  getUserSessions: (userId: string) => Session[];
  createBooking: (userId: string, data: BookingFormData) => Session;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, password) => {
        const users = usersData as User[];
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          const { password: _, ...safeUser } = user as User & { password: string };
          set({ user: safeUser, isAuthenticated: true });
          return { success: true };
        }
        return { success: false, error: 'Invalid email or password' };
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (data) =>
        set(state => ({ user: state.user ? { ...state.user, ...data } : null })),
    }),
    { name: 'ev-auth-store' }
  )
);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      stations: stationsData as Station[],
      sessions: sessionsData as Session[],
      userLocation: null,
      selectedStation: null,
      filters: { chargerType: 'all', maxPrice: 30, maxDistance: 20, status: 'all' },
      theme: 'dark',

      setUserLocation: (loc) => set({ userLocation: loc }),
      setSelectedStation: (station) => set({ selectedStation: station }),
      setFilters: (filters) => set(state => ({ filters: { ...state.filters, ...filters } })),
      toggleTheme: () =>
        set(state => {
          const newTheme = state.theme === 'dark' ? 'light' : 'dark';
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
          }
          return { theme: newTheme };
        }),

      addSession: (session) =>
        set(state => ({ sessions: [...state.sessions, session] })),

      updateSession: (id, data) =>
        set(state => ({
          sessions: state.sessions.map(s => s.id === id ? { ...s, ...data } : s),
        })),

      getUserSessions: (userId) => {
        return get().sessions.filter(s => s.userId === userId);
      },

      createBooking: (userId, data) => {
        const station = get().stations.find(s => s.id === data.stationId)!;
        const charger = station.chargers.find(c => c.id === data.chargerId)!;
        const now = new Date();
        const startTime = data.scheduledTime || now.toISOString();
        const estEnd = new Date(new Date(startTime).getTime() + (data.estimatedKwh / charger.power) * 3600000);

        const newSession: Session = {
          id: `ses${Date.now()}`,
          userId,
          stationId: data.stationId,
          chargerId: data.chargerId,
          status: 'active',
          startTime,
          endTime: null,
          estimatedEndTime: estEnd.toISOString(),
          kwhCharged: 0,
          totalCost: 0,
          pricePerKwh: charger.pricePerKwh,
          connectorType: charger.connector,
          vehicleInfo: data.vehicleInfo,
          stationName: station.name,
          stationAddress: station.address,
          paymentStatus: 'pending',
          invoiceId: null,
        };

        set(state => ({ sessions: [...state.sessions, newSession] }));
        return newSession;
      },
    }),
    {
      name: 'ev-app-store',
      partialize: (state) => ({ theme: state.theme, userLocation: state.userLocation }),
    }
  )
);
