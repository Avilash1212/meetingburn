'use client';

import React, { useState, useEffect } from 'react';
import { CurrencyCode } from '@/lib/types';
import { formatCurrencyCompact } from '@/lib/formatters';
import { ArrowDownRight, ArrowRight, Calculator, Flame, Sparkles, TrendingUp, Users, Clock } from 'lucide-react';

interface HeroProps {
  currency: CurrencyCode;
  onCalculateClick: () => void;
  onDemoClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  currency,
  onCalculateClick,
  onDemoClick,
}) => {
  // Live demo ticker simulation in hero card
  const [heroIndex, setHeroIndex] = useState(0);

  const heroScenarios = [
    { meetings: 12, employees: 8, hours: 24, costInr: 36500, label: 'Weekly Product Syncs' },
    { meetings: 5, employees: 14, hours: 35, costInr: 68000, label: 'Cross-functional Review' },
    { meetings: 20, employees: 6, hours: 30, costInr: 52000, label: 'Daily Standups & 1-on-1s' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroScenarios.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroScenarios.length]);

  const current = heroScenarios[heroIndex];
  // Approximate currency scaling for hero
  const currencyMultiplier = currency === 'INR' ? 1 : currency === 'USD' ? 1 / 84 : currency === 'EUR' ? 1 / 92 : 1 / 80;
  const scaledCost = current.costInr * currencyMultiplier;

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-orange-50/40 via-white to-white dark:from-zinc-900/40 dark:via-zinc-950 dark:to-zinc-950">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-orange-400/10 via-amber-400/15 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          {/* Subtle Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/80 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800/80 text-orange-800 dark:text-orange-300 text-xs font-semibold mb-6 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            <span>Modern Meeting Cost & Time Waste Intelligence</span>
            <span className="hidden sm:inline text-orange-400">•</span>
            <span className="hidden sm:inline font-normal text-orange-700 dark:text-orange-400">Zero sign-up required</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15] mb-6">
            How expensive are <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-red-500 bg-clip-text text-transparent">
              your meetings?
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            Turn meeting hours into real business costs — and discover what your recurring calendar commitments are really costing your team in salary capital and maker time.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onCalculateClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all transform active:scale-98"
            >
              <Calculator className="w-5 h-5" />
              Calculate Meeting Cost
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={onDemoClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 font-semibold text-base shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              Try Demo
            </button>
          </div>
        </div>

        {/* Live-Looking Visual Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl p-1 bg-gradient-to-b from-zinc-200 via-zinc-200/50 to-zinc-200/20 dark:from-zinc-700/60 dark:via-zinc-800/40 dark:to-zinc-900/30 shadow-xl shadow-zinc-900/5">
            <div className="rounded-[14px] bg-white dark:bg-zinc-900/90 backdrop-blur-xl p-5 sm:p-7 border border-zinc-100 dark:border-zinc-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400">
                    Live Team Burn Telemetry
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium">
                    {current.label}
                  </span>
                </div>
                <div className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                  <span>Simulated company cadences</span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              </div>

              {/* 4 Metrics in Hero Card */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-5">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    Meetings / Week
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white transition-all">
                    {current.meetings} <span className="text-sm font-normal text-zinc-400">syncs</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    Employees
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white transition-all">
                    {current.employees} <span className="text-sm font-normal text-zinc-400">attendees</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-500" />
                    Employee-Hours
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white transition-all">
                    {current.hours} <span className="text-sm font-normal text-zinc-400">hrs/wk</span>
                  </div>
                </div>

                <div className="flex flex-col bg-orange-50/50 dark:bg-orange-950/20 p-2.5 rounded-xl border border-orange-100 dark:border-orange-900/40">
                  <span className="text-xs font-semibold text-orange-800 dark:text-orange-300 mb-1 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                    Weekly Cost
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-orange-600 dark:text-orange-400 transition-all">
                    {formatCurrencyCompact(scaledCost, currency)}
                    <span className="text-xs font-medium text-orange-500/80 ml-1">/wk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
