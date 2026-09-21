'use client';

import React, { useState } from 'react';
import { CurrencyCode, MeetingFrequency, QuickMeetingInputs, SalaryType } from '@/lib/types';
import { CURRENCIES } from '@/lib/formatters';
import { Users, Clock, Calendar, DollarSign, Settings2, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface QuickCalculatorProps {
  inputs: QuickMeetingInputs;
  onChange: (inputs: QuickMeetingInputs) => void;
  currency: CurrencyCode;
}

export const QuickCalculator: React.FC<QuickCalculatorProps> = ({
  inputs,
  onChange,
  currency,
}) => {
  const [showScheduleSettings, setShowScheduleSettings] = useState(false);
  const curr = CURRENCIES[currency] || CURRENCIES.INR;

  const handleNumericChange = (
    field: keyof QuickMeetingInputs,
    value: string,
    min = 0,
    max = Infinity
  ) => {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      onChange({ ...inputs, [field]: 0 });
    } else {
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange({ ...inputs, [field]: clamped });
    }
  };

  const setPresetDuration = (hours: number, minutes: number) => {
    onChange({
      ...inputs,
      durationHours: hours,
      durationMinutes: minutes,
    });
  };

  const isInvalidDuration = inputs.durationHours === 0 && inputs.durationMinutes === 0;
  const isInvalidAttendees = inputs.attendees <= 0;
  const isInvalidSalary = inputs.salaryAmount <= 0;
  const isInvalidMeetings = inputs.meetingCount <= 0;

  return (
    <div className="space-y-6">
      {/* 1. Meeting Duration */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <label className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            Meeting Duration
          </label>
          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-zinc-400 mr-1 hidden sm:inline">Presets:</span>
            {[
              { h: 0, m: 15, label: '15m' },
              { h: 0, m: 30, label: '30m' },
              { h: 0, m: 45, label: '45m' },
              { h: 1, m: 0, label: '1h' },
              { h: 1, m: 30, label: '1.5h' },
              { h: 2, m: 0, label: '2h' },
            ].map((p) => {
              const isActive = inputs.durationHours === p.h && inputs.durationMinutes === p.m;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setPresetDuration(p.h, p.m)}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="relative">
              <input
                id="quick-duration-hours"
                aria-label="Meeting Duration Hours"
                type="number"
                min="0"
                max="24"
                value={inputs.durationHours === 0 ? '' : inputs.durationHours}
                onChange={(e) => handleNumericChange('durationHours', e.target.value, 0, 24)}
                placeholder="0"
                className="w-full text-base font-semibold px-3 py-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400">
                Hours
              </span>
            </div>
          </div>
          <div>
            <div className="relative">
              <input
                id="quick-duration-minutes"
                aria-label="Meeting Duration Minutes"
                type="number"
                min="0"
                max="59"
                step="5"
                value={inputs.durationMinutes === 0 ? '' : inputs.durationMinutes}
                onChange={(e) => handleNumericChange('durationMinutes', e.target.value, 0, 59)}
                placeholder="0"
                className="w-full text-base font-semibold px-3 py-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 pr-14"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400">
                Minutes
              </span>
            </div>
          </div>
        </div>

        {isInvalidDuration ? (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Meeting duration must be greater than zero.
          </p>
        ) : (
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Total session duration:{' '}
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {(inputs.durationHours + inputs.durationMinutes / 60).toFixed(2)} hours
            </span>{' '}
            ({inputs.durationHours > 0 ? `${inputs.durationHours}h ` : ''}
            {inputs.durationMinutes}m)
          </p>
        )}
      </div>

      {/* 2. Number of Attendees */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <label htmlFor="quick-attendees-count" className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            Number of Attendees
          </span>
          <span className="text-xs font-normal text-zinc-500">
            Everyone in the room / call
          </span>
        </label>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              id="quick-attendees-count"
              type="number"
              min="1"
              max="500"
              value={inputs.attendees || ''}
              onChange={(e) => handleNumericChange('attendees', e.target.value, 1, 500)}
              placeholder="e.g. 8"
              className="w-full text-base font-semibold px-3 py-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 pr-14"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400">
              People
            </span>
          </div>

          {/* Quick stepper buttons */}
          <div className="flex items-center gap-1">
            {[2, 5, 8, 12, 20].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onChange({ ...inputs, attendees: num })}
                className={`text-xs px-2.5 py-2 rounded-lg font-medium transition-all ${
                  inputs.attendees === num
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {isInvalidAttendees && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Enter at least 1 attendee.
          </p>
        )}
      </div>

      {/* 3. Average Employee Compensation */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <label className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            Average Employee Compensation
          </label>

          {/* Salary Type Segmented Control */}
          <div className="inline-flex p-1 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 text-xs font-medium">
            {(['hourly', 'monthly', 'annual'] as SalaryType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ ...inputs, salaryType: type })}
                className={`px-3 py-1 rounded-md capitalize transition-all ${
                  inputs.salaryType === type
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-zinc-500 dark:text-zinc-400">
            {curr.symbol}
          </span>
          <input
            id="quick-salary-amount"
            aria-label="Average Employee Compensation"
            type="number"
            min="1"
            value={inputs.salaryAmount || ''}
            onChange={(e) => handleNumericChange('salaryAmount', e.target.value, 0)}
            placeholder={
              inputs.salaryType === 'monthly'
                ? currency === 'INR' ? '120000' : '8000'
                : inputs.salaryType === 'annual'
                ? currency === 'INR' ? '1500000' : '95000'
                : currency === 'INR' ? '800' : '50'
            }
            className="w-full text-base font-semibold pl-8 pr-28 py-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400 capitalize">
            / {inputs.salaryType === 'hourly' ? 'hour' : inputs.salaryType === 'monthly' ? 'month' : 'year'}
          </span>
        </div>

        <div className="mt-2 flex items-start gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
          <span>
            {inputs.salaryType === 'monthly'
              ? `Use the average total monthly compensation for people attending this meeting. Converted assuming ${inputs.workingDaysPerMonth} working days × ${inputs.workingHoursPerDay} hrs/day.`
              : inputs.salaryType === 'annual'
              ? `Use the average annual cost to company (CTC/salary). Divided across 12 months.`
              : `Direct hourly rate per participant.`}
          </span>
        </div>

        {isInvalidSalary && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Enter a valid salary greater than zero.
          </p>
        )}
      </div>

      {/* 4. Cadence & Frequency */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-500" />
          Meeting Cadence & Frequency
        </label>

        {/* Frequency selector buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {(['onetime', 'daily', 'weekly', 'monthly'] as MeetingFrequency[]).map((freq) => (
            <button
              key={freq}
              type="button"
              onClick={() => onChange({ ...inputs, frequency: freq })}
              className={`py-2 px-3 rounded-lg text-xs font-medium capitalize border transition-all text-center ${
                inputs.frequency === freq
                  ? 'bg-orange-600 text-white border-orange-600 shadow-sm font-semibold'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
              }`}
            >
              {freq === 'onetime' ? 'One-time' : freq}
            </button>
          ))}
        </div>

        {inputs.frequency !== 'onetime' && (
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                id="quick-frequency-count"
                aria-label="Number of meetings per frequency"
                type="number"
                min="1"
                max="50"
                value={inputs.meetingCount || ''}
                onChange={(e) => handleNumericChange('meetingCount', e.target.value, 1, 50)}
                placeholder="1"
                className="w-full text-base font-semibold px-3 py-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 pr-28"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400 capitalize">
                meetings / {inputs.frequency === 'daily' ? 'day' : inputs.frequency === 'weekly' ? 'week' : 'month'}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onChange({ ...inputs, meetingCount: n })}
                  className={`text-xs px-2.5 py-2 rounded-lg font-medium transition-all ${
                    inputs.meetingCount === n
                      ? 'bg-purple-600 text-white'
                      : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300'
                  }`}
                >
                  {n}x
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span>
            {inputs.frequency === 'weekly'
              ? 'Monthly estimates use an industry-standard average of 4.33 weeks per month (52 weeks / 12).'
              : inputs.frequency === 'daily'
              ? `Daily estimates use ${inputs.workingDaysPerMonth} working days per month.`
              : inputs.frequency === 'monthly'
              ? 'Annual estimates project across 12 monthly sessions.'
              : 'One-time meeting calculations display single session cost.'}
          </span>
        </div>

        {isInvalidMeetings && inputs.frequency !== 'onetime' && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Meeting count must be at least 1.
          </p>
        )}
      </div>

      {/* 5. Working Schedule Settings Accordion (Progressive Disclosure) */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowScheduleSettings(!showScheduleSettings)}
          className="w-full flex items-center justify-between p-3.5 bg-zinc-100/70 dark:bg-zinc-900/40 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-zinc-500" />
            Working Hours & Calendar Assumptions (Optional)
          </span>
          <span className="flex items-center gap-1 text-zinc-400">
            {inputs.workingHoursPerDay} hrs/day • {inputs.workingDaysPerMonth} days/mo
            {showScheduleSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </button>

        {showScheduleSettings && (
          <div className="p-4 bg-white dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-200 dark:border-zinc-800">
            <div>
              <label htmlFor="quick-working-hours" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Working Hours per Day
              </label>
              <input
                id="quick-working-hours"
                type="number"
                min="1"
                max="24"
                value={inputs.workingHoursPerDay || ''}
                onChange={(e) => handleNumericChange('workingHoursPerDay', e.target.value, 1, 24)}
                className="w-full text-sm font-semibold px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
              />
              <p className="text-[11px] text-zinc-400 mt-1">Default is 8 hours (Standard business day).</p>
            </div>

            <div>
              <label htmlFor="quick-working-days" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Working Days per Month
              </label>
              <input
                id="quick-working-days"
                type="number"
                min="1"
                max="31"
                value={inputs.workingDaysPerMonth || ''}
                onChange={(e) => handleNumericChange('workingDaysPerMonth', e.target.value, 1, 31)}
                className="w-full text-sm font-semibold px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
              />
              <p className="text-[11px] text-zinc-400 mt-1">Default is 22 days (excluding weekends).</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
