'use client';

import React, { useState } from 'react';
import { CalculationResults } from '@/lib/types';
import {
  formatCurrencyCompact,
  formatCurrencyFull,
  formatEmployeeHours,
  formatWorkdays,
} from '@/lib/formatters';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import {
  DollarSign,
  Calendar,
  Clock,
  Briefcase,
  Flame,
  Users,
  Eye,
  Layers,
  Sparkles,
  Share2,
} from 'lucide-react';

interface ResultCardsProps {
  results: CalculationResults;
  onOpenShareModal: () => void;
}

export const ResultCards: React.FC<ResultCardsProps> = ({
  results,
  onOpenShareModal,
}) => {
  const [isCompact, setIsCompact] = useState(false);

  const formatCurr = (val: number) => {
    return isCompact
      ? formatCurrencyCompact(val, results.currency)
      : formatCurrencyFull(val, results.currency);
  };

  return (
    <div className="space-y-4">
      {/* Dashboard Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            Real-Time Analysis
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
            Meeting Investment Dashboard
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Compact / Full Format Toggle */}
          <button
            type="button"
            onClick={() => setIsCompact(!isCompact)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-500" />
            {isCompact ? 'Format: Compact' : 'Format: Exact'}
          </button>

          {/* Share Results Button */}
          <button
            type="button"
            onClick={onOpenShareModal}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white shadow-sm transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Result
          </button>
        </div>
      </div>

      {/* Main 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Cost per Meeting */}
        <div className="relative group bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs hover:border-orange-200 dark:hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">
              Cost Per Meeting
            </span>
            <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div
            className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight"
            title={`Exact: ${formatCurrencyFull(results.costPerMeeting, results.currency)}`}
          >
            <AnimatedNumber
              value={results.costPerMeeting}
              formatFn={formatCurr}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            For {results.totalAttendees} attendee{results.totalAttendees > 1 ? 's' : ''} ({formatCurrencyFull(results.costPerAttendee, results.currency)}/person)
          </p>
        </div>

        {/* 2. Weekly Cost */}
        <div className="relative group bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs hover:border-orange-200 dark:hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">
              Weekly Meeting Cost
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div
            className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight"
            title={`Exact: ${formatCurrencyFull(results.weeklyCost, results.currency)}`}
          >
            <AnimatedNumber
              value={results.weeklyCost}
              formatFn={formatCurr}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            {results.isRecurring
              ? `${results.meetingsPerWeek.toFixed(1)} sessions / week`
              : 'Single occurrence'}
          </p>
        </div>

        {/* 3. Monthly Cost */}
        <div className="relative group bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs hover:border-orange-200 dark:hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">
              Monthly Meeting Cost
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div
            className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight"
            title={`Exact: ${formatCurrencyFull(results.monthlyCost, results.currency)}`}
          >
            <AnimatedNumber
              value={results.monthlyCost}
              formatFn={formatCurr}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            {results.isRecurring
              ? `~${results.meetingsPerMonth.toFixed(1)} meetings / month`
              : 'Single occurrence'}
          </p>
        </div>

        {/* 4. Annual Cost */}
        <div className="relative group bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent bg-white dark:bg-zinc-900 p-5 rounded-2xl border-2 border-orange-400/40 dark:border-orange-500/30 shadow-md transition-all">
          <div className="flex items-center justify-between text-orange-800 dark:text-orange-300 mb-2">
            <span className="text-xs font-bold tracking-wide uppercase">
              Annual Meeting Cost
            </span>
            <div className="p-2 rounded-xl bg-orange-600 text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div
            className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400 tracking-tight"
            title={`Exact: ${formatCurrencyFull(results.annualCost, results.currency)}`}
          >
            <AnimatedNumber
              value={results.annualCost}
              formatFn={formatCurr}
            />
          </div>
          <p className="mt-2 text-xs font-medium text-orange-700/80 dark:text-orange-300/80">
            {results.isRecurring
              ? `${Math.round(results.meetingsPerYear)} sessions committed / year`
              : 'Annual projection if recurring'}
          </p>
        </div>
      </div>

      {/* 3 Secondary KPI Cards: Employee Hours, Workdays Lost, Cost Per Attendee */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Employee Hours per Month */}
        <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
              Employee Hours / Month
            </span>
            <div className="text-xl font-bold text-zinc-900 dark:text-white">
              <AnimatedNumber
                value={results.monthlyEmployeeHours}
                formatFn={(v) => formatEmployeeHours(v)}
              />
            </div>
            <span className="text-[11px] text-zinc-400">
              {formatEmployeeHours(results.employeeHoursPerMeeting)} per session
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Equivalent Workdays Lost */}
        <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
              Workdays Invested / Month
            </span>
            <div className="text-xl font-bold text-zinc-900 dark:text-white">
              <AnimatedNumber
                value={results.workdaysLostPerMonth}
                formatFn={(v) => formatWorkdays(v)}
              />
            </div>
            <span className="text-[11px] text-zinc-400">
              Equivalent to 1 FTE for {(results.workdaysLostPerMonth).toFixed(1)} days
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        {/* Cost per Attendee */}
        <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
              Cost Per Attendee
            </span>
            <div className="text-xl font-bold text-zinc-900 dark:text-white">
              <AnimatedNumber
                value={results.costPerAttendee}
                formatFn={formatCurr}
              />
            </div>
            <span className="text-[11px] text-zinc-400">
              Avg hourly rate: {formatCurr(results.averageHourlyRate)}/hr
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
