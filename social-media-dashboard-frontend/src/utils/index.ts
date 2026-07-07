import type { Platform } from '@/types';
import { PLATFORM_CONFIG } from '@/constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// ============================================================
// Utility Functions
// ============================================================

/** Format large numbers (1200 → 1.2K) */
export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

/** Format percentage */
export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

/** Relative time (e.g. "2 hours ago") */
export function timeAgo(date: string): string {
  return dayjs(date).fromNow();
}

/** Format date consistently */
export function formatDate(date: string, format = 'MMM D, YYYY'): string {
  return dayjs(date).format(format);
}

/** Get platform display info */
export function getPlatformInfo(platform: Platform) {
  return PLATFORM_CONFIG[platform];
}

/** Truncate text */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/** Generate initials from name */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/** Delay helper */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Classname merge helper */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
