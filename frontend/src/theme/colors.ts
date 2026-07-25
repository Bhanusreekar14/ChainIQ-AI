export const COLORS = {
  // Brand Primary & Accents
  primary: '#4F46E5', // Indigo-600
  primaryLight: '#818CF8', // Indigo-400
  primaryDark: '#3730A3', // Indigo-800
  aiAccent: '#06B6D4', // Cyan-500
  aiAccentLight: '#22D3EE', // Cyan-400

  // AI Risk Status Color Language
  riskLow: '#10B981', // 🟢 Low Risk (Emerald)
  riskMedium: '#F59E0B', // 🟡 Medium Risk (Amber)
  riskHigh: '#F97316', // 🟠 High Risk (Orange)
  riskCritical: '#EF4444', // 🔴 Critical Risk (Rose)

  // Surface & Canvas Backgrounds
  background: '#0B0F19', // Deep obsidian dark canvas
  surface: 'rgba(15, 23, 42, 0.75)', // Glass dark slate
  surfaceHover: 'rgba(30, 41, 59, 0.8)',
  cardBg: '#0F172A', // Slate-900

  // Borders & Dividers
  border: 'rgba(51, 65, 85, 0.8)', // Slate-700/80
  borderSubtle: 'rgba(30, 41, 59, 0.6)',
  borderHighlight: 'rgba(99, 102, 241, 0.4)',

  // Typography Colors
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0F172A',
} as const;

export const RISK_BADGES = {
  Low: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
    label: 'Low Risk',
  },
  Medium: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
    label: 'Medium Risk',
  },
  High: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
    dot: 'bg-orange-400',
    label: 'High Risk',
  },
  Critical: {
    bg: 'bg-rose-500/20',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    dot: 'bg-rose-500',
    label: 'Critical Risk',
  },
} as const;
