import { BenchmarkItem, CostComparisonResult, CurrencyCode } from './types';

/**
 * Benchmark items with realistic market prices across supported currencies.
 * Developers can easily update these benchmark figures here.
 */
export const BENCHMARK_ITEMS: BenchmarkItem[] = [
  {
    id: 'iphone',
    name: 'iPhone 16 / Pro',
    category: 'Hardware',
    icon: 'Smartphone',
    approxPrices: {
      INR: 80000,
      USD: 999,
      EUR: 950,
      GBP: 799,
      AED: 3799,
      SGD: 1299,
    },
    descriptionTemplate: (text) => `could buy ${text}`,
  },
  {
    id: 'laptop',
    name: 'High-End Developer Laptop',
    category: 'Hardware',
    icon: 'Laptop',
    approxPrices: {
      INR: 90000,
      USD: 1200,
      EUR: 1150,
      GBP: 950,
      AED: 4400,
      SGD: 1600,
    },
    descriptionTemplate: (text) => `could fund ${text}`,
  },
  {
    id: 'team_lunch',
    name: 'Team Lunches (per person)',
    category: 'Perks',
    icon: 'Utensils',
    approxPrices: {
      INR: 800,
      USD: 18,
      EUR: 16,
      GBP: 14,
      AED: 65,
      SGD: 22,
    },
    descriptionTemplate: (text) => `could sponsor ${text}`,
  },
  {
    id: 'coffee',
    name: 'Artisan Coffees',
    category: 'Perks',
    icon: 'Coffee',
    approxPrices: {
      INR: 250,
      USD: 5,
      EUR: 4.5,
      GBP: 4,
      AED: 22,
      SGD: 7,
    },
    descriptionTemplate: (text) => `is worth ${text}`,
  },
  {
    id: 'flight_ticket',
    name: 'Business-Class Flight Ticket',
    category: 'Travel',
    icon: 'Plane',
    approxPrices: {
      INR: 65000,
      USD: 1400,
      EUR: 1300,
      GBP: 1100,
      AED: 5000,
      SGD: 1900,
    },
    descriptionTemplate: (text) => `could book ${text}`,
  },
  {
    id: 'workstation',
    name: 'Ergonomic Desk & Chair Setup',
    category: 'Office',
    icon: 'Armchair',
    approxPrices: {
      INR: 45000,
      USD: 650,
      EUR: 600,
      GBP: 520,
      AED: 2400,
      SGD: 850,
    },
    descriptionTemplate: (text) => `could kit out ${text}`,
  },
  {
    id: 'cloud_credits',
    name: 'Cloud Infrastructure / Month',
    category: 'SaaS',
    icon: 'Server',
    approxPrices: {
      INR: 25000,
      USD: 300,
      EUR: 280,
      GBP: 240,
      AED: 1100,
      SGD: 400,
    },
    descriptionTemplate: (text) => `could cover ${text} of cloud hosting`,
  },
];

/**
 * Turns a numeric ratio (e.g. 0.23, 1.84, 12.1) into natural human-friendly phrasing.
 * E.g.,
 * 0.2 -> "about 20% of an iPhone"
 * 0.5 -> "about half an iPhone"
 * 0.85 -> "almost 1 iPhone"
 * 1.05 -> "approximately 1 iPhone"
 * 1.8 -> "almost 2 iPhones"
 * 2.1 -> "approximately 2 iPhones"
 * 15 -> "15 iPhones"
 */
export function formatRelatableQuantity(rawCount: number, singularName: string): string {
  if (rawCount <= 0.05) {
    return `a modest fraction (under 5%) of a ${singularName}`;
  }
  if (rawCount < 0.35) {
    const pct = Math.round(rawCount * 100);
    return `about ${pct}% of a ${singularName}`;
  }
  if (rawCount < 0.65) {
    return `about half of a ${singularName}`;
  }
  if (rawCount < 0.9) {
    const pct = Math.round(rawCount * 100);
    return `around ${pct}% of a ${singularName}`;
  }
  if (rawCount < 1.15) {
    return `approximately 1 ${singularName}`;
  }
  if (rawCount < 1.4) {
    return `about 1.3 ${pluralize(singularName)}`;
  }
  if (rawCount < 1.85) {
    return `almost 2 ${pluralize(singularName)}`;
  }
  if (rawCount < 2.2) {
    return `approximately 2 ${pluralize(singularName)}`;
  }

  // Large counts
  const rounded = Math.round(rawCount);
  return `approximately ${rounded.toLocaleString()} ${pluralize(singularName)}`;
}

function pluralize(name: string): string {
  if (name.endsWith('s') || name.endsWith('Setup')) return `${name}s`;
  if (name.includes('Ticket')) return name.replace('Ticket', 'Tickets');
  if (name.includes('Lunch')) return name.replace('Lunch', 'Lunches');
  if (name.includes('Coffee')) return name.replace('Coffee', 'Coffees');
  if (name.includes('Laptop')) return name.replace('Laptop', 'Laptops');
  if (name.includes('iPhone')) return name.replace('iPhone', 'iPhones');
  return `${name}s`;
}

/**
 * Generates cost comparisons for the given budget and currency.
 */
export function generateCostComparisons(
  amount: number,
  currency: CurrencyCode,
  period: 'monthly' | 'annual' = 'monthly'
): CostComparisonResult[] {
  if (!amount || amount <= 0) return [];

  return BENCHMARK_ITEMS.map((item) => {
    const unitPrice = item.approxPrices[currency] || item.approxPrices.INR;
    const rawCount = amount / unitPrice;
    const phrasing = formatRelatableQuantity(rawCount, item.name);
    const description = `Your ${period} meeting cost ${item.descriptionTemplate(phrasing)}.`;

    return {
      id: item.id,
      name: item.name,
      icon: item.icon,
      description,
      rawCount,
      unitPrice,
      period,
    };
  });
}
