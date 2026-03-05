export type ChargerStatus = 'available' | 'busy' | 'offline';
export type ChargerType = 'DC Ultra Fast' | 'DC Fast' | 'AC Level 2';
export type ConnectorType = 'CCS2' | 'CHAdeMO' | 'Type 2' | 'GB/T';
export type SessionStatus = 'active' | 'completed' | 'cancelled' | 'pending';
export type PaymentStatus = 'paid' | 'pending' | 'refunded' | 'failed';
export type UserRole = 'user' | 'admin';

export interface Charger {
  id: string;
  type: ChargerType;
  power: number; // kW
  status: ChargerStatus;
  pricePerKwh: number; // INR
  connector: ConnectorType;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  area: string;
  rating: number;
  totalReviews: number;
  chargers: Charger[];
  amenities: string[];
  openHours: string;
  isPremium: boolean;
  image: string;
  distance?: number; // km, calculated dynamically
}

export interface Vehicle {
  make: string;
  model: string;
  year: number;
  batteryCapacity: number; // kWh
  avgKwhPerKm: number;
  licensePlate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone: string;
  vehicle: Vehicle | null;
  avatar: string | null;
  createdAt: string;
  totalSessions: number;
  totalKwhCharged: number;
  totalSpend: number;
}

export interface Session {
  id: string;
  userId: string;
  stationId: string;
  chargerId: string;
  status: SessionStatus;
  startTime: string;
  endTime: string | null;
  estimatedEndTime: string;
  kwhCharged: number;
  totalCost: number;
  pricePerKwh: number;
  connectorType: ConnectorType;
  vehicleInfo: string;
  stationName: string;
  stationAddress: string;
  paymentStatus: PaymentStatus;
  invoiceId: string | null;
}

export interface BookingFormData {
  stationId: string;
  chargerId: string;
  scheduledTime?: string;
  estimatedKwh: number;
  vehicleInfo: string;
}

export interface FilterOptions {
  chargerType?: ChargerType | 'all';
  maxPrice?: number;
  maxDistance?: number;
  status?: ChargerStatus | 'all';
  amenities?: string[];
}

export interface AnalyticsData {
  todaySessions: number;
  todayRevenue: number;
  activeChargers: number;
  totalChargers: number;
  peakHour: string;
  avgSessionDuration: number;
  kwhDeliveredToday: number;
  weeklyData: { day: string; sessions: number; revenue: number }[];
}
