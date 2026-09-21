'use client';

import React from 'react';
import { CurrencyCode } from '@/lib/types';
import { CURRENCIES } from '@/lib/formatters';
import { Flame, Clock, Moon, Sun, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentCurrency: CurrencyCode;
  onCurrencyChange: (c: CurrencyCode) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLoadPreset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCurrency,
  onCurrencyChange,
  isDarkMode,
  onToggleDarkMode,
  onLoadPreset,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5 text-white/90" />
              <Flame className="w-4 h-4 text-amber-200 absolute -bottom-0.5 -right-0.5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white flex items-center gap-1.5">
                MeetingBurn
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60">
                  SaaS MVP
                </span>
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">
                Know what every meeting really costs
              </span>
            </div>
          </a>
        </div>

        {/* Navigation jump links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <a
            href="#calculator"
            className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            Calculator
          </a>
          <a
            href="#live-timer"
            className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
            Live Burn Timer
          </a>
          <a
            href="#efficiency"
            className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            Waste & Value
          </a>
          <a
            href="#comparisons"
            className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            Comparisons
          </a>
          <a
            href="#simulator"
            className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            Optimizer
          </a>
        </nav>

        {/* Right actions: Currency Selector, Preset Button, Theme toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Load Demo CTA */}
          <button
            onClick={onLoadPreset}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:hover:bg-orange-900/50 dark:text-orange-300 border border-orange-200 dark:border-orange-800/80 transition-colors"
            title="Load realistic demo meeting"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Load Example
          </button>

          {/* Currency selector */}
          <div className="relative">
            <select
              aria-label="Select Currency"
              value={currentCurrency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              className="text-xs sm:text-sm font-medium px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                <option key={code} value={code}>
                  {code} ({CURRENCIES[code].symbol.trim()})
                </option>
              ))}
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
