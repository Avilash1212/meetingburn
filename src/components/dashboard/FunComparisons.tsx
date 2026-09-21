'use client';

import React, { useState } from 'react';
import { CalculationResults } from '@/lib/types';
import { generateCostComparisons } from '@/lib/benchmarks';
import { formatCurrencyFull, formatWorkdays } from '@/lib/formatters';
import {
  Smartphone,
  Laptop,
  Utensils,
  Coffee,
  Plane,
  Armchair,
  Server,
  Sparkles,
  Info,
  Briefcase,
} from 'lucide-react';

interface FunComparisonsProps {
  results: CalculationResults;
}

export const FunComparisons: React.FC<FunComparisonsProps> = ({ results }) => {
  const [period, setPeriod] = useState<'monthly' | 'annual'>('monthly');

  const activeAmount = period === 'monthly' ? results.monthlyCost : results.annualCost;
  const comparisons = generateCostComparisons(activeAmount, results.currency, period);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-purple-500" />;
      case 'Laptop':
        return <Laptop className="w-5 h-5 text-blue-500" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-amber-500" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-orange-500" />;
      case 'Plane':
        return <Plane className="w-5 h-5 text-sky-500" />;
      case 'Armchair':
        return <Armchair className="w-5 h-5 text-emerald-500" />;
      case 'Server':
        return <Server className="w-5 h-5 text-indigo-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-orange-500" />;
    }
  };

  return (
    <div id="comparisons" className="bg-white dark:bg-zinc-900 p-5 sm:p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm scroll-mt-20">
      {/* Header with Monthly/Annual Period Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-orange-600 dark:text-orange-400">
            Relatable Perspectives
          </span>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-0.5">
            What could this money buy instead?
          </h3>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPeriod('monthly')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              period === 'monthly'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            Monthly Spend ({formatCurrencyFull(results.monthlyCost, results.currency)})
          </button>
          <button
            type="button"
            onClick={() => setPeriod('annual')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              period === 'annual'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            Annual Spend ({formatCurrencyFull(results.annualCost, results.currency)})
          </button>
        </div>
      </div>

      {/* Featured Time Workday Callout */}
      <div className="mt-6 mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-200 dark:border-orange-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-orange-600 text-white shadow-sm shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-orange-800 dark:text-orange-300">
              Maker Time Equivalent
            </span>
            <p className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-white mt-0.5">
              Your team spends the equivalent of{' '}
              <span className="text-orange-600 dark:text-orange-400 font-extrabold underline decoration-orange-300">
                {formatWorkdays(period === 'monthly' ? results.workdaysLostPerMonth : results.workdaysLostPerYear)}
              </span>{' '}
              {period === 'monthly' ? 'every month' : 'each year'} in this meeting.
            </p>
          </div>
        </div>

        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 shrink-0">
          Based on 8 hrs/workday
        </span>
      </div>

      {/* Comparisons Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparisons.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 hover:border-orange-300 dark:hover:border-zinc-600 transition-all flex items-start gap-3.5"
          >
            <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 shadow-2xs shrink-0 border border-zinc-200/60 dark:border-zinc-700">
              {getIconComponent(item.icon)}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-0.5">
                {item.name} (~{formatCurrencyFull(item.unitPrice, results.currency)})
              </span>
              <p className="text-sm font-bold text-zinc-900 dark:text-white leading-snug">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>
          Comparisons use approximate market benchmarks with sensible rounding.
        </span>
      </div>
    </div>
  );
};
