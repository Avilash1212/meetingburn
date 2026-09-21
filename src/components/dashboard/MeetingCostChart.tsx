'use client';

import React, { useState } from 'react';
import { CalculationResults } from '@/lib/types';
import { formatCurrencyCompact, formatCurrencyFull } from '@/lib/formatters';
import { BarChart3, PieChart, Info } from 'lucide-react';

interface MeetingCostChartProps {
  results: CalculationResults;
}

export const MeetingCostChart: React.FC<MeetingCostChartProps> = ({ results }) => {
  const [activeChart, setActiveChart] = useState<'timeline' | 'waste'>('timeline');
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // Timeline bars data
  const timelineData = [
    {
      id: 'session',
      label: 'Per Session',
      amount: results.costPerMeeting,
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 'weekly',
      label: 'Weekly Total',
      amount: results.weeklyCost,
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 'monthly',
      label: 'Monthly Total',
      amount: results.monthlyCost,
      color: 'from-red-500 to-rose-600',
    },
    {
      id: 'annual',
      label: 'Annual Commitment',
      amount: results.annualCost,
      color: 'from-purple-600 to-indigo-600',
    },
  ];

  const maxTimelineAmount = Math.max(...timelineData.map((d) => d.amount), 1);

  // Waste breakdown data
  const usefulMonthlyAmount = Math.max(
    0,
    results.monthlyCost - results.potentialWasteMonthly
  );
  const wasteMonthlyAmount = results.potentialWasteMonthly;

  return (
    <div className="bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      {/* Chart Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-orange-600 dark:text-orange-400">
            Executive Visualizations
          </span>
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
            {activeChart === 'timeline'
              ? 'Meeting Cost Over Time'
              : 'Productive Value vs Potential Waste'}
          </h3>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveChart('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeChart === 'timeline'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-orange-500" />
            Cadence Projection
          </button>
          <button
            type="button"
            onClick={() => setActiveChart('waste')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeChart === 'waste'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <PieChart className="w-3.5 h-3.5 text-emerald-500" />
            Efficiency Breakdown
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="pt-6">
        {activeChart === 'timeline' ? (
          /* 1. Timeline Cadence Bars */
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 h-52 items-end pt-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
              {timelineData.map((bar) => {
                const heightPercentage = Math.max(
                  8,
                  Math.min(100, (bar.amount / maxTimelineAmount) * 100)
                );
                const isHovered = hoveredBar === bar.id;

                return (
                  <div
                    key={bar.id}
                    className="flex flex-col items-center justify-end h-full group relative cursor-pointer"
                    onMouseEnter={() => setHoveredBar(bar.id)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Tooltip on hover */}
                    <div
                      className={`absolute -top-10 transition-all duration-200 pointer-events-none z-10 ${
                        isHovered ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-1'
                      }`}
                    >
                      <div className="px-2.5 py-1 rounded-md bg-zinc-900 text-white text-[11px] font-bold shadow-lg whitespace-nowrap">
                        {formatCurrencyFull(bar.amount, results.currency)}
                      </div>
                    </div>

                    {/* Bar Value label above */}
                    <span className="text-[11px] sm:text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 group-hover:text-orange-500 transition-colors">
                      {formatCurrencyCompact(bar.amount, results.currency)}
                    </span>

                    {/* Visual Bar */}
                    <div className="w-full max-w-[70px] bg-zinc-100 dark:bg-zinc-800/80 rounded-t-xl overflow-hidden p-0.5 flex flex-col justify-end">
                      <div
                        style={{ height: `${heightPercentage}%` }}
                        className={`w-full rounded-t-lg bg-gradient-to-t ${bar.color} transition-all duration-500 group-hover:brightness-110 shadow-sm`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-Axis labels */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              {timelineData.map((bar) => (
                <div key={bar.id} className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  {bar.label}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* 2. Value vs Potential Waste Breakdown */
          <div className="space-y-6">
            <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                  Monthly Meeting Spend Composition
                </span>
                <span className="text-xs font-semibold text-zinc-500">
                  Total: {formatCurrencyFull(results.monthlyCost, results.currency)}/mo
                </span>
              </div>

              {/* Stacked Progress Bar */}
              <div className="h-6 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800 flex overflow-hidden p-0.5 gap-0.5">
                <div
                  style={{ width: `${results.usefulnessPercentage}%` }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-l-lg transition-all duration-500 flex items-center justify-center text-[11px] font-bold text-white shadow-xs"
                  title={`Useful Value: ${results.usefulnessPercentage}%`}
                >
                  {results.usefulnessPercentage >= 20 ? `${results.usefulnessPercentage}% Value` : ''}
                </div>
                <div
                  style={{ width: `${results.wastePercentage}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-r-lg transition-all duration-500 flex items-center justify-center text-[11px] font-bold text-white shadow-xs"
                  title={`Potential Inefficiency: ${results.wastePercentage}%`}
                >
                  {results.wastePercentage >= 20 ? `${results.wastePercentage}% Waste` : ''}
                </div>
              </div>

              {/* Legend & Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-zinc-800 border border-emerald-100 dark:border-emerald-950/60">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block">
                      Estimated Productive Value ({results.usefulnessPercentage}%)
                    </span>
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrencyFull(usefulMonthlyAmount, results.currency)}
                      <span className="text-xs font-normal text-zinc-400">/mo</span>
                    </span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Decision making, alignment, unblocking, and cross-team trust.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-zinc-800 border border-red-100 dark:border-red-950/60">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block">
                      Potential Meeting Waste ({results.wastePercentage}%)
                    </span>
                    <span className="text-base font-bold text-red-600 dark:text-red-400">
                      {formatCurrencyFull(wasteMonthlyAmount, results.currency)}
                      <span className="text-xs font-normal text-zinc-400">/mo</span>
                    </span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Conversational drift, redundant attendees, unprepared participants.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>
            Cadences calculate full 52-week year ({results.isRecurring ? `~${Math.round(results.meetingsPerYear)} meetings/yr` : 'single occurrence'}).
          </span>
        </div>
      </div>
    </div>
  );
};
