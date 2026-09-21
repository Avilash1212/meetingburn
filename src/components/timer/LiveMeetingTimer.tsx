'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CurrencyCode } from '@/lib/types';
import { formatCurrencyCompact, formatCurrencyFull, formatTimerTime } from '@/lib/formatters';
import {
  Play,
  Pause,
  RotateCcw,
  Flame,
  Clock,
  DollarSign,
  Users,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface LiveMeetingTimerProps {
  initialAttendees?: number;
  initialHourlyRate?: number;
  currency: CurrencyCode;
}

export const LiveMeetingTimer: React.FC<LiveMeetingTimerProps> = ({
  initialAttendees = 8,
  initialHourlyRate = 800,
  currency,
}) => {
  const [attendees, setAttendees] = useState(initialAttendees);
  const [hourlyRate, setHourlyRate] = useState(initialHourlyRate);

  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  // Timestamp references to prevent background tab drift
  const startTimeRef = useRef<number | null>(null);
  const accumulatedMsRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);

  // Sync if props update and timer isn't running
  useEffect(() => {
    if (!isRunning && elapsedMs === 0) {
      if (initialAttendees > 0) setAttendees(initialAttendees);
      if (initialHourlyRate > 0) setHourlyRate(initialHourlyRate);
    }
  }, [initialAttendees, initialHourlyRate, isRunning, elapsedMs]);

  // Timestamp-based accurate timer loop
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();

      const tick = () => {
        if (startTimeRef.current !== null) {
          const now = Date.now();
          const currentDelta = now - startTimeRef.current;
          const totalMs = accumulatedMsRef.current + currentDelta;
          setElapsedMs(totalMs);
        }
        requestRef.current = requestAnimationFrame(tick);
      };

      requestRef.current = requestAnimationFrame(tick);
    } else {
      if (startTimeRef.current !== null) {
        const now = Date.now();
        accumulatedMsRef.current += now - startTimeRef.current;
        startTimeRef.current = null;
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning]);

  const handleStart = () => {
    if (attendees <= 0 || hourlyRate <= 0) return;
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    accumulatedMsRef.current = 0;
    startTimeRef.current = null;
    setElapsedMs(0);
  };

  // Cost calculation
  // Total hourly burn = attendees * hourlyRate
  // Burn per second = totalHourlyBurn / 3600
  // Burn per ms = totalHourlyBurn / 3,600,000
  const totalHourlyBurn = Math.max(0, attendees) * Math.max(0, hourlyRate);
  const currentMeetingCost = (elapsedMs / 3600000) * totalHourlyBurn;
  const costNext10Mins = (totalHourlyBurn / 6) ; // 10 mins = 1/6th of an hour

  // Rotating playful milestone messages
  const getPlayfulMessage = () => {
    if (elapsedMs < 15000) {
      return 'Meeting just started. Time is money — stay focused!';
    }
    if (currentMeetingCost > 50000) {
      return `This meeting just crossed ${formatCurrencyCompact(50000, currency)}. Hope big decisions are being made!`;
    }
    if (currentMeetingCost > 15000) {
      return `Current meeting spend could fund a high-end laptop. Next 10 minutes will cost ~${formatCurrencyCompact(costNext10Mins, currency)}.`;
    }
    if (currentMeetingCost > 5000) {
      return `Your meeting just crossed ${formatCurrencyCompact(5000, currency)}. Another 10 minutes will cost ~${formatCurrencyCompact(costNext10Mins, currency)}.`;
    }
    if (currentMeetingCost > 1500) {
      return `That could already buy a gourmet lunch for the team!`;
    }
    if (currentMeetingCost > 500) {
      return `That could already cover artisan coffee for everyone on the call.`;
    }
    return `Every minute burns ~${formatCurrencyFull(totalHourlyBurn / 60, currency)}.`;
  };

  return (
    <div id="live-timer" className="bg-white dark:bg-zinc-900 p-5 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            Live Real-Time Burn
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
            Live Meeting Cost Timer
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Turn this on in your live conference room or Zoom call to watch time turn into salary spend.
          </p>
        </div>

        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
          Timestamp-synchronized (no background drift)
        </div>
      </div>

      {/* Main Timer Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
        {/* Left: Input Parameters (Attendees & Hourly Rate) */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <label htmlFor="timer-attendees-count" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              Attendees in the Call
            </label>
            <input
              id="timer-attendees-count"
              type="number"
              min="1"
              max="200"
              disabled={isRunning}
              value={attendees || ''}
              onChange={(e) => setAttendees(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full text-sm font-semibold px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor="timer-hourly-rate" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              Avg Hourly Cost per Attendee
            </label>
            <input
              id="timer-hourly-rate"
              type="number"
              min="1"
              disabled={isRunning}
              value={hourlyRate || ''}
              onChange={(e) => setHourlyRate(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full text-sm font-semibold px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white disabled:opacity-60"
            />
            <span className="text-[11px] text-zinc-400 mt-1 block">
              Combined burn rate:{' '}
              <strong className="text-zinc-700 dark:text-zinc-300">
                {formatCurrencyFull(totalHourlyBurn, currency)}/hr
              </strong>
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2">
            {!isRunning ? (
              <button
                type="button"
                onClick={handleStart}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all active:scale-98"
              >
                <Play className="w-4 h-4 fill-white" />
                {elapsedMs > 0 ? 'Resume Meeting' : 'Start Meeting'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePause}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-md transition-all active:scale-98"
              >
                <Pause className="w-4 h-4 fill-white" />
                Pause Timer
              </button>
            )}

            <button
              type="button"
              onClick={handleReset}
              disabled={elapsedMs === 0}
              title="Reset timer"
              className="p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Large Live Dashboard Ticker */}
        <div className="lg:col-span-8">
          <div className="relative rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-white p-6 sm:p-8 border border-zinc-800 shadow-xl overflow-hidden">
            {/* Ambient subtle glow when timer is running */}
            {isRunning && (
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/20 rounded-full blur-2xl animate-pulse pointer-events-none" />
            )}

            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 text-xs font-semibold text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-400" />
                Elapsed Duration
              </span>
              <span className="font-mono text-base text-zinc-300">
                {formatTimerTime(elapsedMs)}
              </span>
            </div>

            {/* Huge ticking cost display */}
            <div className="py-6 sm:py-8 text-center sm:text-left">
              <span className="text-xs uppercase font-bold tracking-widest text-orange-400 block mb-1">
                Current Meeting Spend
              </span>
              <div className="text-4xl sm:text-6xl font-black tracking-tight text-white flex items-center justify-center sm:justify-start gap-1">
                <span className="text-orange-500">
                  {formatCurrencyFull(currentMeetingCost, currency)}
                </span>
              </div>
              <span className="text-xs text-zinc-400 mt-1 block">
                Accumulating at ~{formatCurrencyFull(totalHourlyBurn / 60, currency)} per minute
              </span>
            </div>

            {/* Playful Rotating Milestone Alert */}
            <div className="p-3.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-start gap-2.5">
              <Flame className="w-4 h-4 text-orange-400 shrink-0 mt-0.5 animate-bounce" />
              <p className="text-xs font-medium text-zinc-200">
                {getPlayfulMessage()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
