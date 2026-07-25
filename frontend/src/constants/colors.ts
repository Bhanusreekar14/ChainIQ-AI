import { COLORS, RISK_BADGES } from '../theme';

export { COLORS, RISK_BADGES };

export const RISK_COLORS = {
  Low: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    stroke: '#10B981',
    border: 'border-emerald-500/30',
  },
  Medium: {
    text: 'text-amber-400',
    bg: 'bg-amber-500/20',
    stroke: '#F59E0B',
    border: 'border-amber-500/30',
  },
  High: {
    text: 'text-orange-400',
    bg: 'bg-orange-500/20',
    stroke: '#F97316',
    border: 'border-orange-500/30',
  },
  Critical: {
    text: 'text-rose-500',
    bg: 'bg-rose-500/20',
    stroke: '#EF4444',
    border: 'border-rose-500/30',
  },
} as const;

export const ACCENT_GRADIENTS = {
  cyan: 'from-cyan-500/20 to-blue-500/5 text-cyan-400 border-cyan-500/20',
  emerald: 'from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/20',
  rose: 'from-rose-500/20 to-pink-500/5 text-rose-400 border-rose-500/20',
  amber: 'from-amber-500/20 to-orange-500/5 text-amber-400 border-amber-500/20',
  indigo: 'from-indigo-500/20 to-purple-500/5 text-indigo-400 border-indigo-500/20',
} as const;
