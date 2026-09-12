import { RISK_COLORS } from '../constants/colors';

/**
 * Merges conditional class names into a single space-separated string.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formats a numeric value into USD currency format.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a 0-1 probability fraction into a percentage string.
 */
export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

/**
 * Returns Tailwind badge classes for a given risk level.
 */
export function getRiskBadgeClass(level: 'Low' | 'Medium' | 'High' | 'Critical'): string {
  const colors = RISK_COLORS[level] || RISK_COLORS.Low;
  return `${colors.bg} ${colors.text} ${colors.border}`;
}
