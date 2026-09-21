'use client';

import React, { useState } from 'react';
import {
  CurrencyCode,
  MeetingFrequency,
  RoleItem,
  SalaryType,
} from '@/lib/types';
import { calculateHourlyRate, durationToDecimal } from '@/lib/calculations';
import { CURRENCIES, formatCurrencyFull } from '@/lib/formatters';
import {
  Plus,
  Trash2,
  Copy,
  Clock,
  Calendar,
  Users,
  AlertCircle,
  Briefcase,
  Settings2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AdvancedCalculatorProps {
  durationHours: number;
  durationMinutes: number;
  onDurationChange: (hours: number, minutes: number) => void;
  roles: RoleItem[];
  onRolesChange: (roles: RoleItem[]) => void;
  frequency: MeetingFrequency;
  meetingCount: number;
  onFrequencyChange: (freq: MeetingFrequency, count: number) => void;
  currency: CurrencyCode;
  workingHoursPerDay: number;
  workingDaysPerMonth: number;
  onScheduleChange: (hours: number, days: number) => void;
}

export const AdvancedCalculator: React.FC<AdvancedCalculatorProps> = ({
  durationHours,
  durationMinutes,
  onDurationChange,
  roles,
  onRolesChange,
  frequency,
  meetingCount,
  onFrequencyChange,
  currency,
  workingHoursPerDay,
  workingDaysPerMonth,
  onScheduleChange,
}) => {
  const [showScheduleSettings, setShowScheduleSettings] = useState(false);
  const curr = CURRENCIES[currency] || CURRENCIES.INR;
  const durationDecimal = durationToDecimal(durationHours, durationMinutes);

  const handleAddRole = (suggestedRole = 'Team Member') => {
    const defaultSalary =
      currency === 'INR' ? 120000 : 8000;

    const newRole: RoleItem = {
      id: 'role_' + Date.now() + Math.random().toString(36).substr(2, 4),
      roleName: suggestedRole,
      count: 2,
      salaryType: 'monthly',
      salaryAmount: defaultSalary,
    };
    onRolesChange([...roles, newRole]);
  };

  const handleRemoveRole = (id: string) => {
    if (roles.length <= 1) return;
    onRolesChange(roles.filter((r) => r.id !== id));
  };

  const handleDuplicateRole = (role: RoleItem) => {
    const duplicated: RoleItem = {
      ...role,
      id: 'role_' + Date.now() + Math.random().toString(36).substr(2, 4),
      roleName: `${role.roleName} (Copy)`,
    };
    onRolesChange([...roles, duplicated]);
  };

  const handleUpdateRole = (id: string, updates: Partial<RoleItem>) => {
    onRolesChange(
      roles.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  // Quick suggestions for rapid role adding
  const quickSuggestions = [
    'Software Engineer',
    'Product Manager',
    'Product Designer',
    'Engineering Manager',
    'Data Scientist',
    'QA Engineer',
  ];

  return (
    <div className="space-y-6">
      {/* 1. Meeting Duration & Frequency (Compact Bar) */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-zinc-900 dark:text-white mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              Meeting Duration
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  id="adv-duration-hours"
                  aria-label="Meeting Duration Hours"
                  type="number"
                  min="0"
                  max="24"
                  value={durationHours === 0 ? '' : durationHours}
                  onChange={(e) =>
                    onDurationChange(
                      Math.max(0, parseInt(e.target.value) || 0),
                      durationMinutes
                    )
                  }
                  placeholder="0"
                  className="w-full text-sm font-semibold px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
                  Hrs
                </span>
              </div>
              <div className="relative">
                <input
                  id="adv-duration-minutes"
                  aria-label="Meeting Duration Minutes"
                  type="number"
                  min="0"
                  max="59"
                  step="5"
                  value={durationMinutes === 0 ? '' : durationMinutes}
                  onChange={(e) =>
                    onDurationChange(
                      durationHours,
                      Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
                    )
                  }
                  placeholder="0"
                  className="w-full text-sm font-semibold px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
                  Mins
                </span>
              </div>
            </div>
          </div>

          {/* Cadence */}
          <div>
            <label className="block text-xs font-semibold text-zinc-900 dark:text-white mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-500" />
              Meeting Cadence
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                aria-label="Meeting Frequency"
                value={frequency}
                onChange={(e) =>
                  onFrequencyChange(e.target.value as MeetingFrequency, meetingCount)
                }
                className="w-full text-sm font-semibold px-2.5 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white capitalize"
              >
                <option value="onetime">One-time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>

              {frequency !== 'onetime' ? (
                <div className="relative">
                  <input
                    aria-label="Number of meetings"
                    type="number"
                    min="1"
                    max="50"
                    value={meetingCount || ''}
                    onChange={(e) =>
                      onFrequencyChange(
                        frequency,
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    className="w-full text-sm font-semibold px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 capitalize">
                    / {frequency === 'weekly' ? 'wk' : frequency === 'daily' ? 'day' : 'mo'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center text-xs text-zinc-400 italic bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  Single Event
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Attendees by Role Table */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              Role & Salary Breakdown
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Configure different attendee roles with custom compensations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleAddRole()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Role
          </button>
        </div>

        {/* Quick Add Suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          <span className="text-xs text-zinc-400 mr-1">Quick add:</span>
          {quickSuggestions.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => handleAddRole(sug)}
              className="text-xs px-2.5 py-1 rounded-md bg-zinc-200/70 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
            >
              + {sug}
            </button>
          ))}
        </div>

        {/* Roles List */}
        <div className="space-y-3">
          {roles.map((role, idx) => {
            const hourly = calculateHourlyRate(
              role.salaryAmount,
              role.salaryType,
              workingHoursPerDay,
              workingDaysPerMonth
            );
            const groupHourlyBurn = (role.count || 0) * hourly;
            const groupCostPerMeeting = groupHourlyBurn * durationDecimal;

            return (
              <div
                key={role.id}
                className="bg-white dark:bg-zinc-800/80 p-3.5 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/80 shadow-2xs space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Role Name */}
                  <div className="sm:col-span-4">
                    <label htmlFor={`role-title-${role.id}`} className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                      Role Title
                    </label>
                    <div className="relative">
                      <input
                        id={`role-title-${role.id}`}
                        type="text"
                        value={role.roleName}
                        onChange={(e) =>
                          handleUpdateRole(role.id, { roleName: e.target.value })
                        }
                        placeholder="e.g. Software Engineer"
                        className="w-full text-sm font-semibold px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Headcount */}
                  <div className="sm:col-span-2">
                    <label htmlFor={`role-count-${role.id}`} className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                      Headcount
                    </label>
                    <div className="relative">
                      <input
                        id={`role-count-${role.id}`}
                        type="number"
                        min="1"
                        max="100"
                        value={role.count || ''}
                        onChange={(e) =>
                          handleUpdateRole(role.id, {
                            count: Math.max(1, parseInt(e.target.value) || 0),
                          })
                        }
                        className="w-full text-sm font-semibold px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Salary Type & Amount */}
                  <div className="sm:col-span-4">
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor={`role-salary-${role.id}`} className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                        Compensation
                      </label>
                      <div className="flex gap-1 text-[10px]">
                        {(['hourly', 'monthly', 'annual'] as SalaryType[]).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() =>
                              handleUpdateRole(role.id, { salaryType: st })
                            }
                            className={`px-1.5 py-0.5 rounded capitalize ${
                              role.salaryType === st
                                ? 'bg-orange-600 text-white font-bold'
                                : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400">
                        {curr.symbol}
                      </span>
                      <input
                        id={`role-salary-${role.id}`}
                        type="number"
                        min="0"
                        value={role.salaryAmount || ''}
                        onChange={(e) =>
                          handleUpdateRole(role.id, {
                            salaryAmount: Math.max(0, parseFloat(e.target.value) || 0),
                          })
                        }
                        className="w-full text-sm font-semibold pl-6 pr-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Row Actions */}
                  <div className="sm:col-span-2 flex items-center justify-end gap-1.5 pt-2 sm:pt-4">
                    <button
                      type="button"
                      onClick={() => handleDuplicateRole(role)}
                      title="Duplicate role"
                      className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={roles.length <= 1}
                      onClick={() => handleRemoveRole(role.id)}
                      title={roles.length <= 1 ? 'Minimum 1 role required' : 'Delete role'}
                      className={`p-2 rounded-lg transition-colors ${
                        roles.length <= 1
                          ? 'text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
                          : 'text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtotal calculation pill per role */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-700/60 flex flex-wrap items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>
                    Hourly burn: <strong className="text-zinc-700 dark:text-zinc-200">{formatCurrencyFull(groupHourlyBurn, currency)}/hr</strong> ({role.count} @ {formatCurrencyFull(hourly, currency)}/hr)
                  </span>
                  <span>
                    Cost per session: <strong className="text-orange-600 dark:text-orange-400 font-bold">{formatCurrencyFull(groupCostPerMeeting, currency)}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Working Schedule Settings */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowScheduleSettings(!showScheduleSettings)}
          className="w-full flex items-center justify-between p-3.5 bg-zinc-100/70 dark:bg-zinc-900/40 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-zinc-500" />
            Working Schedule Parameters
          </span>
          <span className="flex items-center gap-1 text-zinc-400">
            {workingHoursPerDay} hrs/day • {workingDaysPerMonth} days/mo
            {showScheduleSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </button>

        {showScheduleSettings && (
          <div className="p-4 bg-white dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-200 dark:border-zinc-800">
            <div>
              <label htmlFor="adv-working-hours" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Working Hours per Day
              </label>
              <input
                id="adv-working-hours"
                type="number"
                min="1"
                max="24"
                value={workingHoursPerDay || ''}
                onChange={(e) =>
                  onScheduleChange(
                    Math.max(1, Math.min(24, parseInt(e.target.value) || 8)),
                    workingDaysPerMonth
                  )
                }
                className="w-full text-sm font-semibold px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="adv-working-days" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Working Days per Month
              </label>
              <input
                id="adv-working-days"
                type="number"
                min="1"
                max="31"
                value={workingDaysPerMonth || ''}
                onChange={(e) =>
                  onScheduleChange(
                    workingHoursPerDay,
                    Math.max(1, Math.min(31, parseInt(e.target.value) || 22))
                  )
                }
                className="w-full text-sm font-semibold px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
