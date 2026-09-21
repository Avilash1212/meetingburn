import { CurrencyCode } from './types';

export const CURRENCIES: Record<
  CurrencyCode,
  { symbol: string; name: string; locale: string; rateToInr: number }
> = {
  INR: { symbol: '₹', name: 'Indian Rupee', locale: 'en-IN', rateToInr: 1 },
  USD: { symbol: '$', name: 'US Dollar', locale: 'en-US', rateToInr: 84 },
  EUR: { symbol: '€', name: 'Euro', locale: 'de-DE', rateToInr: 92 },
  GBP: { symbol: '£', name: 'British Pound', locale: 'en-GB', rateToInr: 110 },
  AED: { symbol: 'AED ', name: 'UAE Dirham', locale: 'en-AE', rateToInr: 22.8 },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG', rateToInr: 65 },
};

/**
 * Format currency with full precision and proper locale formatting.
 * For INR, produces ₹1,40,000 (lakhs grouping).
 * For USD, produces $140,000.
 */
export function formatCurrencyFull(amount: number, currency: CurrencyCode = 'INR'): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${CURRENCIES[currency]?.symbol || '₹'}0`;
  }
  const config = CURRENCIES[currency] || CURRENCIES.INR;
  const rounded = Math.round(amount);

  try {
    const formattedNum = new Intl.NumberFormat(config.locale, {
      maximumFractionDigits: 0,
    }).format(rounded);

    return `${config.symbol}${formattedNum}`;
  } catch {
    return `${config.symbol}${rounded.toLocaleString()}`;
  }
}

/**
 * Compact currency format for high-level KPI cards (e.g. ₹1.4L, ₹1.2Cr, $140K, $2.4M).
 */
export function formatCurrencyCompact(amount: number, currency: CurrencyCode = 'INR'): string {
  if (isNaN(amount) || amount === null || amount === undefined || amount === 0) {
    return `${CURRENCIES[currency]?.symbol || '₹'}0`;
  }
  const config = CURRENCIES[currency] || CURRENCIES.INR;
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (currency === 'INR') {
    // Indian numbering: Cr (1,00,00,000), L (1,00,000), K (1,000)
    if (abs >= 10000000) {
      const val = (abs / 10000000).toFixed(valNeedsDecimal(abs / 10000000) ? 2 : 1);
      return `${sign}${config.symbol}${val}Cr`;
    }
    if (abs >= 100000) {
      const val = (abs / 100000).toFixed(valNeedsDecimal(abs / 100000) ? 2 : 1);
      return `${sign}${config.symbol}${val}L`;
    }
    if (abs >= 1000) {
      const val = (abs / 1000).toFixed(1);
      return `${sign}${config.symbol}${val}k`;
    }
    return `${sign}${config.symbol}${Math.round(abs)}`;
  } else {
    // International numbering: B (1,000,000,000), M (1,000,000), K (1,000)
    if (abs >= 1000000000) {
      return `${sign}${config.symbol}${(abs / 1000000000).toFixed(1)}B`;
    }
    if (abs >= 1000000) {
      return `${sign}${config.symbol}${(abs / 1000000).toFixed(1)}M`;
    }
    if (abs >= 1000) {
      return `${sign}${config.symbol}${(abs / 1000).toFixed(1)}K`;
    }
    return `${sign}${config.symbol}${Math.round(abs)}`;
  }
}

function valNeedsDecimal(num: number): boolean {
  return num < 10 && num % 1 !== 0;
}

/**
 * Formats hours into human-readable representation, e.g. "126 hrs" or "1.5 hrs".
 */
export function formatEmployeeHours(hours: number): string {
  if (isNaN(hours) || !hours) return '0 hrs';
  const rounded = hours >= 10 ? Math.round(hours) : Math.round(hours * 10) / 10;
  return `${rounded.toLocaleString()} hrs`;
}

/**
 * Formats workdays lost, e.g., "15.8 days" or "16 workdays".
 */
export function formatWorkdays(days: number): string {
  if (isNaN(days) || !days) return '0 days';
  const rounded = days >= 10 ? Math.round(days) : Math.round(days * 10) / 10;
  return `${rounded} workdays`;
}

/**
 * Formats duration in hours and minutes into "1 hr 30 mins", "45 mins", etc.
 */
export function formatDuration(hours: number, minutes: number): string {
  const h = Number(hours) || 0;
  const m = Number(minutes) || 0;
  if (h === 0 && m === 0) return '0 mins';
  if (h === 0) return `${m} min${m > 1 ? 's' : ''}`;
  if (m === 0) return `${h} hr${h > 1 ? 's' : ''}`;
  return `${h} hr${h > 1 ? 's' : ''} ${m} min${m > 1 ? 's' : ''}`;
}

/**
 * Formats elapsed timer milliseconds into "HH:MM:SS" or "MM:SS".
 */
export function formatTimerTime(totalMs: number): string {
  const totalSeconds = Math.floor(Math.max(0, totalMs) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}
