'use client';

import React from 'react';
import { CalculationResults, Recommendation } from '@/lib/types';
import { generateRecommendations } from '@/lib/recommendations';
import {
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';

interface RecommendationCardProps {
  results: CalculationResults;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ results }) => {
  const recommendations: Recommendation[] = generateRecommendations(results);

  if (recommendations.length === 0) return null;

  const getIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'action':
        return <TrendingUp className="w-4 h-4 text-orange-500 shrink-0" />;
      case 'tip':
        return <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />;
      default:
        return <Lightbulb className="w-4 h-4 text-blue-500 shrink-0" />;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-5 sm:p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-orange-600 dark:text-orange-400">
            Smart Recommendations
          </span>
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
            Practical Meeting Hygiene & Efficiency Tips
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60 flex flex-col justify-between gap-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-900 dark:text-white">
                  {getIcon(rec.type)}
                  <span>{rec.title}</span>
                </div>
                {rec.metric && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-zinc-200/80 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 shrink-0">
                    {rec.metric}
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {rec.description}
              </p>
            </div>

            {rec.impact && (
              <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-700/50 flex items-center gap-1.5 text-[11px] font-medium text-orange-600 dark:text-orange-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{rec.impact}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
