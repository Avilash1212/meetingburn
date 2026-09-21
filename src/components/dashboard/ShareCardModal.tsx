'use client';

import React, { useState } from 'react';
import { CalculationResults } from '@/lib/types';
import { formatCurrencyCompact, formatCurrencyFull, formatEmployeeHours, formatWorkdays } from '@/lib/formatters';
import { generateCostComparisons } from '@/lib/benchmarks';
import {
  X,
  Copy,
  Check,
  Share2,
  Clock,
  Users,
  Flame,
  Sparkles,
  Download,
} from 'lucide-react';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingTitle: string;
  results: CalculationResults;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  meetingTitle,
  results,
}) => {
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const title = meetingTitle.trim() || 'Team Meeting';
  const comparisons = generateCostComparisons(results.monthlyCost, results.currency, 'monthly');
  const topComparison = comparisons[0]; // iPhone comparison

  const plainTextSummary = `🔥 MeetingBurn Analysis: ${title}
---------------------------------------------
• Cost per Session: ${formatCurrencyFull(results.costPerMeeting, results.currency)}
• Weekly Spend: ${formatCurrencyFull(results.weeklyCost, results.currency)}
• Monthly Spend: ${formatCurrencyFull(results.monthlyCost, results.currency)} (~${formatCurrencyCompact(results.annualCost, results.currency)}/yr)
• Total Attendees: ${results.totalAttendees} people
• Maker Time Spent: ${formatEmployeeHours(results.monthlyEmployeeHours)} / month (${formatWorkdays(results.workdaysLostPerMonth)} lost)
${topComparison ? `• Tangible equivalent: ${topComparison.description}` : ''}
---------------------------------------------
Calculated via MeetingBurn (https://meetingburn.app)`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(plainTextSummary);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-sm text-zinc-900 dark:text-white">
              Share MeetingBurn Card
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Card Preview */}
        <div className="p-5 sm:p-6 space-y-5">
          <div
            id="shareable-social-card"
            className="rounded-2xl p-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white border border-zinc-800 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Brand Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-orange-600 text-white font-black text-xs shadow-sm">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-sm tracking-tight text-white">
                  MeetingBurn
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-950 text-orange-400 border border-orange-800/50">
                Meeting Audit
              </span>
            </div>

            {/* Meeting Name & Key Stats */}
            <div className="py-5">
              <span className="text-xs text-zinc-400 font-medium block mb-1">
                Meeting Investment Card
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-4">
                {title}
              </h4>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-zinc-900/90 p-3 rounded-xl border border-zinc-800">
                  <span className="text-[11px] text-zinc-400 block mb-0.5">
                    Per Session Cost
                  </span>
                  <span className="text-lg font-bold text-white">
                    {formatCurrencyFull(results.costPerMeeting, results.currency)}
                  </span>
                </div>

                <div className="bg-zinc-900/90 p-3 rounded-xl border border-zinc-800">
                  <span className="text-[11px] text-zinc-400 block mb-0.5">
                    Monthly Burn
                  </span>
                  <span className="text-lg font-bold text-orange-400">
                    {formatCurrencyFull(results.monthlyCost, results.currency)}
                  </span>
                </div>
              </div>

              {/* Workdays impact pill */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-300 flex items-center justify-between">
                <span>
                  Team Time Lost:{' '}
                  <strong className="text-white">
                    {formatWorkdays(results.workdaysLostPerMonth)}
                  </strong>
                  /month
                </span>
                <span className="text-zinc-500 font-mono">
                  {results.totalAttendees} attendees
                </span>
              </div>
            </div>

            {/* Playful comparison quote */}
            {topComparison && (
              <div className="pt-3 border-t border-zinc-800/80 text-xs text-orange-300/90 italic flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{topComparison.description}</span>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleCopyText}
              className="w-full flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-md transition-all"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied Summary!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Slack / Text Summary
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
