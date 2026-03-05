import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Station, ChargerStatus } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function getStationAvailability(station: Station): ChargerStatus {
  const available = station.chargers.filter(c => c.status === 'available').length;
  const busy = station.chargers.filter(c => c.status === 'busy').length;
  if (available > 0) return 'available';
  if (busy > 0) return 'busy';
  return 'offline';
}

export function getAvailableCount(station: Station): number {
  return station.chargers.filter(c => c.status === 'available').length;
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(dateStr: string): string {
  return `${formatDate(dateStr)} ${formatTime(dateStr)}`;
}

export function calculateChargingCost(kWh: number, pricePerKwh: number): number {
  return Math.round(kWh * pricePerKwh * 100) / 100;
}

export function estimateChargingTime(kWh: number, chargerPower: number): number {
  return Math.ceil((kWh / chargerPower) * 60); // minutes
}

export function isPeakHour(): boolean {
  const hour = new Date().getHours();
  return (hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 21);
}

export function getPricingTier(): { label: string; multiplier: number; color: string } {
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 6) return { label: 'Night Rate', multiplier: 0.85, color: 'text-blue-400' };
  if ((hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 21)) return { label: 'Peak Rate', multiplier: 1.2, color: 'text-red-400' };
  return { label: 'Standard Rate', multiplier: 1.0, color: 'text-green-400' };
}

export function getStatusColor(status: ChargerStatus): string {
  switch (status) {
    case 'available': return 'text-green-400';
    case 'busy': return 'text-orange-400';
    case 'offline': return 'text-gray-400';
  }
}

export function getStatusBg(status: ChargerStatus): string {
  switch (status) {
    case 'available': return 'bg-green-500/20 border-green-500/40';
    case 'busy': return 'bg-orange-500/20 border-orange-500/40';
    case 'offline': return 'bg-gray-500/20 border-gray-500/40';
  }
}

export function generateInvoiceId(): string {
  return `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
}

export function getChargerTypeIcon(type: string): string {
  if (type.includes('DC Ultra Fast')) return '⚡⚡';
  if (type.includes('DC Fast')) return '⚡';
  return '🔌';
}
