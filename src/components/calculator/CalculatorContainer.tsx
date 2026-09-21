'use client';

import React from 'react';
import {
  CalculationMode,
  CurrencyCode,
  MeetingFrequency,
  QuickMeetingInputs,
  RoleItem,
} from '@/lib/types';
import { PRESET_MEETINGS } from '@/lib/demoData';
import { QuickCalculator } from './QuickCalculator';
import { AdvancedCalculator } from './AdvancedCalculator';
import { Sparkles, RotateCcw, Zap, Layers, FileText } from 'lucide-react';

interface CalculatorContainerProps {
  meetingTitle: string;
  onMeetingTitleChange: (title: string) => void;
  mode: CalculationMode;
  onModeChange: (m: CalculationMode) => void;
  currency: CurrencyCode;
  // Quick mode inputs
  quickInputs: QuickMeetingInputs;
  onQuickInputsChange: (inputs: QuickMeetingInputs) => void;
  // Advanced mode inputs
  advDurationHours: number;
  advDurationMinutes: number;
  onAdvDurationChange: (h: number, m: number) => void;
  advRoles: RoleItem[];
  onAdvRolesChange: (roles: RoleItem[]) => void;
  advFrequency: MeetingFrequency;
  advMeetingCount: number;
  onAdvFrequencyChange: (freq: MeetingFrequency, count: number) => void;
  advWorkingHoursPerDay: number;
  advWorkingDaysPerMonth: number;
  onAdvScheduleChange: (h: number, d: number) => void;
  onLoadPreset: (presetId: string) => void;
  onReset: () => void;
}

export const CalculatorContainer: React.FC<CalculatorContainerProps> = ({
  meetingTitle,
  onMeetingTitleChange,
  mode,
  onModeChange,
  currency,
  quickInputs,
  onQuickInputsChange,
  advDurationHours,
  advDurationMinutes,
  onAdvDurationChange,
  advRoles,
  onAdvRolesChange,
  advFrequency,
  advMeetingCount,
  onAdvFrequencyChange,
  advWorkingHoursPerDay,
  advWorkingDaysPerMonth,
  onAdvScheduleChange,
  onLoadPreset,
  onReset,
}) => {
  return (
    <div id="calculator" className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden scroll-mt-20">
      {/* Top Header & Presets Bar */}
      <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-orange-600 dark:text-orange-400">
              Interactive Cost Modeler
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-0.5">
              Meeting Parameters
            </h2>
          </div>

          {/* Load Example Presets bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Templates:
            </span>
            {PRESET_MEETINGS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onLoadPreset(p.id)}
                className="text-xs px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium transition-colors border border-zinc-200/80 dark:border-zinc-700/80"
              >
                {p.name}
              </button>
            ))}
            <button
              type="button"
              onClick={onReset}
              title="Reset parameters"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Meeting Title Input */}
        <div className="mt-4 pt-4 border-t border-zinc-200/70 dark:border-zinc-800/70 flex flex-col sm:flex-row sm:items-center gap-3">
          <label htmlFor="meeting-title-input" className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 shrink-0">
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            Meeting Title:
          </label>
          <input
            id="meeting-title-input"
            type="text"
            value={meetingTitle}
            onChange={(e) => onMeetingTitleChange(e.target.value)}
            placeholder="e.g. Weekly Product Sync"
            className="flex-1 text-sm font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-850 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Mode Switch Tabs */}
      <div className="px-5 sm:px-6 pt-5 pb-2">
        <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 max-w-md">
          <button
            type="button"
            onClick={() => onModeChange('quick')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              mode === 'quick'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            Quick Calculation
          </button>
          <button
            type="button"
            onClick={() => onModeChange('advanced')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              mode === 'advanced'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Layers className="w-4 h-4 text-orange-500" />
            Advanced (By Role)
          </button>
        </div>
      </div>

      {/* Calculator Body */}
      <div className="p-5 sm:p-6">
        {mode === 'quick' ? (
          <QuickCalculator
            inputs={quickInputs}
            onChange={onQuickInputsChange}
            currency={currency}
          />
        ) : (
          <AdvancedCalculator
            durationHours={advDurationHours}
            durationMinutes={advDurationMinutes}
            onDurationChange={onAdvDurationChange}
            roles={advRoles}
            onRolesChange={onAdvRolesChange}
            frequency={advFrequency}
            meetingCount={advMeetingCount}
            onFrequencyChange={onAdvFrequencyChange}
            currency={currency}
            workingHoursPerDay={advWorkingHoursPerDay}
            workingDaysPerMonth={advWorkingDaysPerMonth}
            onScheduleChange={onAdvScheduleChange}
          />
        )}
      </div>
    </div>
  );
};
