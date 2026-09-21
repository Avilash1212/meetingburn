import { CalculationResults, Recommendation } from './types';
import { formatCurrencyCompact, formatCurrencyFull, formatWorkdays } from './formatters';

export function generateRecommendations(results: CalculationResults): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // 1. Duration check
  if (results.durationHoursDecimal > 1.5) {
    recommendations.push({
      id: 'long-duration',
      type: 'warning',
      title: 'Consider Shorter or Split Sessions',
      description: `At ${(results.durationHoursDecimal * 60).toFixed(0)} minutes, attention and engagement naturally diminish after the first hour. Breaking this into two focused 30-minute syncs or handling status updates asynchronously could improve retention.`,
      metric: `${results.durationHoursDecimal} hrs / session`,
      impact: 'High focus gain',
    });
  } else if (results.durationHoursDecimal <= 0.5) {
    recommendations.push({
      id: 'lean-duration',
      type: 'tip',
      title: 'Great Lean Time Budget',
      description: 'Keeping meetings under 30 minutes prevents conversational drift and forces a tight, decisive agenda. Keep this standard as the team scales.',
      metric: `${Math.round(results.durationHoursDecimal * 60)} mins`,
      impact: 'Optimal productivity',
    });
  }

  // 2. Headcount check
  if (results.totalAttendees > 10) {
    recommendations.push({
      id: 'large-audience',
      type: 'warning',
      title: 'Large Attendee Group (Two-Pizza Rule)',
      description: `With ${results.totalAttendees} attendees, coordinating discussion becomes exponentially harder. Consider making attendance optional for passive observers and sharing meeting summaries or recordings instead.`,
      metric: `${results.totalAttendees} attendees`,
      impact: `Save up to ${formatCurrencyCompact(results.costPerAttendee * 3, results.currency)} per meeting by reducing 3 observers`,
    });
  } else if (results.totalAttendees <= 4) {
    recommendations.push({
      id: 'tight-team',
      type: 'insight',
      title: 'High-Signal Group Size',
      description: 'Small groups of 2-4 participants typically achieve the highest collaboration and decision velocity per dollar spent.',
      metric: `${results.totalAttendees} participants`,
    });
  }

  // 3. Employee workdays impact
  if (results.workdaysLostPerMonth >= 5 && results.isRecurring) {
    recommendations.push({
      id: 'workdays-impact',
      type: 'action',
      title: 'Substantial Workday Footprint',
      description: `Your team spends approximately ${formatWorkdays(results.workdaysLostPerMonth)} every month exclusively on this meeting. Trimming just 15 minutes would liberate approximately ${(results.workdaysLostPerMonth * 0.25).toFixed(1)} full working days of maker time each month.`,
      metric: formatWorkdays(results.workdaysLostPerMonth),
      impact: 'Reclaims deep work time',
    });
  }

  // 4. Annual Recurring Cost
  if (results.annualCost > 0 && results.isRecurring) {
    recommendations.push({
      id: 'annual-investment',
      type: 'insight',
      title: 'Significant Annual Investment',
      description: `Over a full year, this recurring meeting commits ${formatCurrencyFull(results.annualCost, results.currency)} of company capital. Treating recurring meetings like recurring software subscriptions ensures they justify their renewal every quarter.`,
      metric: formatCurrencyCompact(results.annualCost, results.currency) + '/yr',
      impact: 'Budget governance',
    });
  }

  // 5. Efficiency & Value Optimization
  if (results.usefulnessPercentage < 70) {
    recommendations.push({
      id: 'low-effectiveness',
      type: 'action',
      title: 'Actionable Efficiency Opportunity',
      description: `Based on your estimate that ${results.wastePercentage}% of meeting time lacks high value, introducing a mandatory "No Agenda, No Meeting" policy and sharing written updates 2 hours prior can quickly recover ~${formatCurrencyCompact(results.potentialWasteMonthly, results.currency)}/month.`,
      metric: `${results.wastePercentage}% potential waste`,
      impact: 'Quick-win governance',
    });
  }

  return recommendations;
}
