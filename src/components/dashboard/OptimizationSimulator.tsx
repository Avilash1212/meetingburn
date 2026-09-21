'use client';

import React, { useState, useEffect } from 'react';
import { CalculationResults, MeetingFrequency, OptimizationInputs } from '@/lib/types';
import { calculateOptimization } from '@/lib/calculations';
import { formatCurrencyCompact, formatCurrencyFull, formatEmployeeHours, formatWorkdays } from '@/lib/formatters';
import confetti from 'canvas-confetti';
import {
  TrendingDown,
  Clock,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Trophy,
} from 'lucide-react';

interface OptimizationSimulatorProps {
  results: CalculationResults;
  workingDaysPerMonth: number;
  workingHoursPerDay: number;
}

export const OptimizationSimulator: React.FC<OptimizationSimulatorProps> = ({
  results,
  workingDaysPerMonth,
  workingHoursPerDay,
}) => {
  // Initialize optimization inputs based on current meeting
  const initialDurationMinutes = Math.max(15, Math.round(results.durationHoursDecimal * 60));
  const initialAttendees = Math.max(1, results.totalAttendees);

  const [optInputs, setOptInputs] = useState<OptimizationInputs>({
    durationMinutes: Math.max(15, initialDurationMinutes - 15),
    attendees: Math.max(1, Math.round(initialAttendees * 0.75)),
    frequency: 'weekly',
    meetingCount: Math.max(1, Math.round(results.meetingsPerWeek) || 1),
  });

  // Keep synced if results change drastically
  useEffect(() => {
    setOptInputs((prev) => ({
      ...prev,
      durationMinutes: Math.max(15, Math.round(results.durationHoursDecimal * 60) > 15 ? Math.round(results.durationHoursDecimal * 60) - 15 : 15),
      attendees: Math.max(1, Math.round(results.totalAttendees * 0.75)),
      meetingCount: Math.max(1, Math.round(results.meetingsPerWeek) || 1),
    }));
  }, [results.durationHoursDecimal, results.totalAttendees, results.meetingsPerWeek]);

  const optimizationResults = calculateOptimization(
    results,
    optInputs,
    workingDaysPerMonth,
    workingHoursPerDay
  );

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // safe fallback
    }
  };

  const hasSubstantialSavings = optimizationResults.percentageSavings >= 25;

  return (
    <div id="simulator" className="bg-white dark:bg-zinc-900 p-5 sm:p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-orange-600 dark:text-orange-400">
            What-If Scenario Modeling
          </span>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-0.5">
            What if you optimized this meeting?
          </h3>
        </div>

        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Simulate shorter durations, leaner attendance, or relaxed cadences
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left: Controls & Sliders */}
        <div className="lg:col-span-6 space-y-6">
          {/* 1. Optimized Duration Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-500" />
                Optimized Duration
              </span>
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                {optInputs.durationMinutes} mins
                <span className="text-xs text-zinc-400 font-normal ml-1">
                  (current: {Math.round(results.durationHoursDecimal * 60)}m)
                </span>
              </span>
            </div>

            <input
              id="opt-duration-slider"
              aria-label="Optimized duration slider"
              type="range"
              min="10"
              max={Math.max(60, Math.round(results.durationHoursDecimal * 60) + 30)}
              step="5"
              value={optInputs.durationMinutes}
              onChange={(e) =>
                setOptInputs({
                  ...optInputs,
                  durationMinutes: parseInt(e.target.value) || 15,
                })
              }
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>10m (Lightning)</span>
              <span>25m (Lean)</span>
              <span>45m (Standard)</span>
              <span>60m+</span>
            </div>
          </div>

          {/* 2. Optimized Attendees Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-500" />
                Optimized Attendees
              </span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {optInputs.attendees} people
                <span className="text-xs text-zinc-400 font-normal ml-1">
                  (current: {results.totalAttendees})
                </span>
              </span>
            </div>

            <input
              id="opt-attendees-slider"
              aria-label="Optimized attendees slider"
              type="range"
              min="1"
              max={Math.max(10, results.totalAttendees + 2)}
              step="1"
              value={optInputs.attendees}
              onChange={(e) =>
                setOptInputs({
                  ...optInputs,
                  attendees: Math.max(1, parseInt(e.target.value) || 1),
                })
              }
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>1 person</span>
              <span>Half group</span>
              <span>Full group</span>
            </div>
          </div>

          {/* 3. Cadence Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-500" />
              Adjusted Cadence Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { freq: 'weekly' as MeetingFrequency, count: 1, label: '1x / week' },
                { freq: 'weekly' as MeetingFrequency, count: 2, label: '2x / week' },
                { freq: 'monthly' as MeetingFrequency, count: 2, label: 'Bi-weekly (2/mo)' },
              ].map((cad) => {
                const isActive =
                  optInputs.frequency === cad.freq && optInputs.meetingCount === cad.count;
                return (
                  <button
                    key={cad.label}
                    type="button"
                    onClick={() =>
                      setOptInputs({
                        ...optInputs,
                        frequency: cad.freq,
                        meetingCount: cad.count,
                      })
                    }
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium border transition-all text-center ${
                      isActive
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    {cad.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Real-Time Savings Summary Card */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-5 sm:p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-emerald-500" />
                Projected Annual Savings
              </span>
              {hasSubstantialSavings && (
                <button
                  type="button"
                  onClick={triggerConfetti}
                  className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {optimizationResults.percentageSavings.toFixed(0)}% Saved!
                </button>
              )}
            </div>

            {/* Savings Big Number */}
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                {formatCurrencyFull(optimizationResults.annualSavings, results.currency)}
                <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400 ml-1.5">/year</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Plus reclaims{' '}
                <strong className="text-emerald-700 dark:text-emerald-300 font-bold">
                  {formatEmployeeHours(optimizationResults.hoursSavedAnnual)}
                </strong>{' '}
                of focused work per year ({formatWorkdays(optimizationResults.workdaysSavedMonthly * 12)})
              </p>
            </div>

            {/* Side-by-side comparison boxes */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-100 dark:border-emerald-900/40">
              <div className="bg-white/80 dark:bg-zinc-800/80 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-700">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mb-0.5">
                  Current Annual Cost
                </span>
                <span className="text-sm sm:text-base font-bold text-zinc-700 dark:text-zinc-300 line-through">
                  {formatCurrencyCompact(optimizationResults.currentAnnualCost, results.currency)}
                </span>
              </div>

              <div className="bg-white/80 dark:bg-zinc-800/80 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/80">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold block mb-0.5">
                  Optimized Annual Cost
                </span>
                <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrencyCompact(optimizationResults.optimizedAnnualCost, results.currency)}
                </span>
              </div>
            </div>

            {/* Takeaway Insight */}
            <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Trimming {Math.max(0, Math.round(results.durationHoursDecimal * 60) - optInputs.durationMinutes)} mins and {Math.max(0, results.totalAttendees - optInputs.attendees)} attendees reclaims significant budget without canceling the meeting.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
