'use client';

import React from 'react';
import { Clock, Flame, ShieldAlert, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-sm">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-zinc-900 dark:text-white">
                MeetingBurn
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed">
              Empowering executive leaders, engineering managers, and finance teams with clarity on the true capital and time investment behind every recurring meeting.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 pt-1">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>
                Meeting cost does not imply complete waste. Meetings build alignment; awareness enables optimization.
              </span>
            </div>
          </div>

          {/* Methodology */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-zinc-900 dark:text-white">
              Methodology
            </h4>
            <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-2">
              <li>• Standardized 4.33 weeks/month (52 weeks / 12)</li>
              <li>• Configurable 8 working hrs/day & 22 days/mo</li>
              <li>• Indian Lakh/Crore and International K/M formats</li>
              <li>• Decimal minute precision (e.g. 15m = 0.25h)</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-zinc-900 dark:text-white">
              Tools
            </h4>
            <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-2">
              <li>
                <a href="#calculator" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  Quick & Advanced Calculator
                </a>
              </li>
              <li>
                <a href="#live-timer" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  Live Meeting Burn Timer
                </a>
              </li>
              <li>
                <a href="#efficiency" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  Efficiency & Waste Analysis
                </a>
              </li>
              <li>
                <a href="#simulator" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  Meeting Optimization Simulator
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 gap-4">
          <p>© {new Date().getFullYear()} MeetingBurn. Designed for modern high-performance organizations.</p>
          <p className="flex items-center gap-1">
            Built for B2B product, engineering, and finance leaders.
          </p>
        </div>
      </div>
    </footer>
  );
};
