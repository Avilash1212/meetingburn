'use client';

import React from 'react';
import { CalculationResults } from '@/lib/types';
import { formatCurrencyCompact, formatCurrencyFull } from '@/lib/formatters';
import { Sliders, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface EfficiencySectionProps {
  results: CalculationResults;
  usefulnessPercentage: number;
  onUsefulnessChange: (val: number) => void;
}

export const EfficiencySection: React.FC<EfficiencySectionProps> = ({
  results,
  usefulnessPercentage,
  onUsefulnessChange,
}) => {
  const wastePercentage = 100 - usefulnessPercentage;

  return (
    <div id="efficiency" className="bg-white dark:bg-zinc-900 p-5 sm:p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-orange-600 dark:text-orange-400">
            Value & Inefficiency Assessment
          </span>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-0.5">
            Meeting Efficiency & Waste Analysis
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Nuanced estimate based on your assumptions</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
        {/* Left: Interactive Slider */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="efficiency-slider" className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-orange-500" />
                What percentage of this meeting do you think is actually useful?
              </label>
              <span className="text-lg font-black text-orange-600 dark:text-orange-400">
                {usefulnessPercentage}%
              </span>
            </div>

            <input
              id="efficiency-slider"
              aria-label="Meeting usefulness percentage slider"
              type="range"
              min="0"
              max="100"
              step="5"
              value={usefulnessPercentage}
              onChange={(e) => onUsefulnessChange(parseInt(e.target.value) || 0)}
              className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />

            <div className="flex justify-between text-[11px] text-zinc-400 mt-1.5 font-medium">
              <span>0% (Completely redundant)</span>
              <span>50% (Half productive)</span>
              <span>70% (Industry avg)</span>
              <span>100% (Flawless focus)</span>
            </div>
          </div>

          {/* Qualitative interpretation badge */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-200">
              {usefulnessPercentage >= 70 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              )}
              <span>
                {usefulnessPercentage >= 80
                  ? 'High efficiency meeting — strong signal-to-noise ratio.'
                  : usefulnessPercentage >= 60
                  ? 'Moderate efficiency — some agenda items could move to async.'
                  : 'Low efficiency — prime candidate for restructuring or cancellation.'}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Based on your estimate, approximately{' '}
              <strong className="text-zinc-800 dark:text-zinc-200">{wastePercentage}%</strong> of meeting spend may not be creating direct business value.
            </p>
          </div>
        </div>

        {/* Right: Potential Waste Highlight Cards */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="bg-gradient-to-br from-red-500/10 via-orange-500/5 to-transparent p-5 rounded-2xl border border-red-200 dark:border-red-900/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
                Potential Meeting Waste
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-semibold">
                {wastePercentage}% inefficient
              </span>
            </div>

            <div>
              <div className="text-3xl font-black text-red-600 dark:text-red-400 tracking-tight">
                {formatCurrencyFull(results.potentialWasteMonthly, results.currency)}
                <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400 ml-1">/month</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Annual potential waste: <strong className="text-zinc-700 dark:text-zinc-300">{formatCurrencyCompact(results.potentialWasteAnnual, results.currency)}</strong>
              </p>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pt-2 border-t border-red-100 dark:border-red-900/40 italic">
              "Meetings have essential organizational value. This metric identifies the recoverable budget if off-topic conversation and passive spectators are minimized."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
