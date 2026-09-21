import {
  CalculationResults,
  CurrencyCode,
  MeetingFrequency,
  OptimizationInputs,
  OptimizationResults,
  QuickMeetingInputs,
  RoleCalculationDetail,
  RoleItem,
  SalaryType,
} from './types';

/**
 * Calculates the derived hourly rate from hourly, monthly, or annual compensation.
 */
export function calculateHourlyRate(
  salaryAmount: number,
  salaryType: SalaryType,
  workingHoursPerDay = 8,
  workingDaysPerMonth = 22
): number {
  if (!salaryAmount || salaryAmount <= 0) return 0;
  const safeHoursPerDay = Math.max(1, Math.min(24, workingHoursPerDay || 8));
  const safeDaysPerMonth = Math.max(1, Math.min(31, workingDaysPerMonth || 22));
  const workingHoursPerMonth = safeDaysPerMonth * safeHoursPerDay;

  switch (salaryType) {
    case 'hourly':
      return salaryAmount;
    case 'monthly':
      return salaryAmount / workingHoursPerMonth;
    case 'annual':
      return salaryAmount / (12 * workingHoursPerMonth);
    default:
      return 0;
  }
}

/**
 * Converts hours and minutes into exact decimal hours.
 * e.g., 1 hour 30 minutes = 1.5 hours, 45 minutes = 0.75 hours.
 */
export function durationToDecimal(hours = 0, minutes = 0): number {
  const safeHours = Math.max(0, Number(hours) || 0);
  const safeMinutes = Math.max(0, Math.min(59, Number(minutes) || 0));
  return safeHours + safeMinutes / 60;
}

/**
 * Converts minutes directly into decimal hours.
 */
export function minutesToDecimal(minutes = 0): number {
  return Math.max(0, Number(minutes) || 0) / 60;
}

/**
 * Calculates meeting cadence frequencies across week, month, and year.
 * Weekly uses 52/12 ≈ 4.3333 weeks per month.
 */
export function getMeetingCadenceFrequencies(
  frequency: MeetingFrequency,
  meetingCount = 1,
  workingDaysPerMonth = 22
): {
  isRecurring: boolean;
  meetingsPerWeek: number;
  meetingsPerMonth: number;
  meetingsPerYear: number;
  frequencyLabel: string;
} {
  const safeCount = Math.max(1, Number(meetingCount) || 1);
  const safeDaysPerMonth = Math.max(1, Math.min(31, workingDaysPerMonth || 22));
  const WEEKS_PER_MONTH = 52 / 12; // ~4.333333

  switch (frequency) {
    case 'onetime':
      return {
        isRecurring: false,
        meetingsPerWeek: 0,
        meetingsPerMonth: 0,
        meetingsPerYear: 0,
        frequencyLabel: 'One-time Meeting',
      };
    case 'daily': {
      // 5 working days per week
      const perWeek = safeCount * 5;
      const perMonth = safeCount * safeDaysPerMonth;
      const perYear = perMonth * 12;
      return {
        isRecurring: true,
        meetingsPerWeek: perWeek,
        meetingsPerMonth: perMonth,
        meetingsPerYear: perYear,
        frequencyLabel: `${safeCount} time${safeCount > 1 ? 's' : ''}/day`,
      };
    }
    case 'weekly': {
      const perWeek = safeCount;
      const perMonth = safeCount * WEEKS_PER_MONTH;
      const perYear = safeCount * 52;
      return {
        isRecurring: true,
        meetingsPerWeek: perWeek,
        meetingsPerMonth: perMonth,
        meetingsPerYear: perYear,
        frequencyLabel: `${safeCount} time${safeCount > 1 ? 's' : ''}/week`,
      };
    }
    case 'monthly': {
      const perMonth = safeCount;
      const perWeek = safeCount / WEEKS_PER_MONTH;
      const perYear = safeCount * 12;
      return {
        isRecurring: true,
        meetingsPerWeek: perWeek,
        meetingsPerMonth: perMonth,
        meetingsPerYear: perYear,
        frequencyLabel: `${safeCount} time${safeCount > 1 ? 's' : ''}/month`,
      };
    }
  }
}

/**
 * Calculates results for Quick Mode.
 */
export function calculateQuickMeeting(inputs: QuickMeetingInputs): CalculationResults {
  const durationHoursDecimal = durationToDecimal(inputs.durationHours, inputs.durationMinutes);
  const totalAttendees = Math.max(1, Number(inputs.attendees) || 1);
  const hourlyRate = calculateHourlyRate(
    inputs.salaryAmount,
    inputs.salaryType,
    inputs.workingHoursPerDay,
    inputs.workingDaysPerMonth
  );

  const costPerMeeting = totalAttendees * hourlyRate * durationHoursDecimal;
  const costPerAttendee = totalAttendees > 0 ? costPerMeeting / totalAttendees : 0;

  const cadence = getMeetingCadenceFrequencies(
    inputs.frequency,
    inputs.meetingCount,
    inputs.workingDaysPerMonth
  );

  const isRecurring = cadence.isRecurring;
  const weeklyCost = isRecurring ? costPerMeeting * cadence.meetingsPerWeek : costPerMeeting;
  const monthlyCost = isRecurring ? costPerMeeting * cadence.meetingsPerMonth : costPerMeeting;
  const annualCost = isRecurring ? costPerMeeting * cadence.meetingsPerYear : costPerMeeting;

  // Employee hours
  const employeeHoursPerMeeting = totalAttendees * durationHoursDecimal;
  const weeklyEmployeeHours = isRecurring
    ? employeeHoursPerMeeting * cadence.meetingsPerWeek
    : employeeHoursPerMeeting;
  const monthlyEmployeeHours = isRecurring
    ? employeeHoursPerMeeting * cadence.meetingsPerMonth
    : employeeHoursPerMeeting;
  const annualEmployeeHours = isRecurring
    ? employeeHoursPerMeeting * cadence.meetingsPerYear
    : employeeHoursPerMeeting;

  const safeHoursPerDay = Math.max(1, inputs.workingHoursPerDay || 8);
  const workdaysLostPerMonth = monthlyEmployeeHours / safeHoursPerDay;
  const workdaysLostPerYear = annualEmployeeHours / safeHoursPerDay;

  // Efficiency & Potential Waste
  const usefulness = Math.max(0, Math.min(100, inputs.usefulnessPercentage ?? 70));
  const wastePercentage = 100 - usefulness;
  const wasteFactor = wastePercentage / 100;

  const potentialWastePerMeeting = costPerMeeting * wasteFactor;
  const potentialWasteMonthly = monthlyCost * wasteFactor;
  const potentialWasteAnnual = annualCost * wasteFactor;

  return {
    durationHoursDecimal,
    totalAttendees,
    averageHourlyRate: hourlyRate,
    costPerMeeting,
    costPerAttendee,
    weeklyCost,
    monthlyCost,
    annualCost,
    isRecurring,

    employeeHoursPerMeeting,
    weeklyEmployeeHours,
    monthlyEmployeeHours,
    annualEmployeeHours,
    workdaysLostPerMonth,
    workdaysLostPerYear,

    meetingsPerWeek: cadence.meetingsPerWeek,
    meetingsPerMonth: cadence.meetingsPerMonth,
    meetingsPerYear: cadence.meetingsPerYear,

    usefulnessPercentage: usefulness,
    potentialWastePerMeeting,
    potentialWasteMonthly,
    potentialWasteAnnual,
    wastePercentage,

    currency: inputs.currency,
  };
}

/**
 * Calculates results for Advanced Mode with multiple roles.
 */
export function calculateAdvancedMeeting(
  durationHours: number,
  durationMinutes: number,
  roles: RoleItem[],
  frequency: MeetingFrequency,
  meetingCount: number,
  currency: CurrencyCode,
  workingHoursPerDay = 8,
  workingDaysPerMonth = 22,
  usefulnessPercentage = 70
): CalculationResults {
  const durationHoursDecimal = durationToDecimal(durationHours, durationMinutes);

  let totalAttendees = 0;
  let totalHourlyBurn = 0;

  const cadence = getMeetingCadenceFrequencies(frequency, meetingCount, workingDaysPerMonth);

  const roleBreakdown: RoleCalculationDetail[] = (roles || []).map((role) => {
    const roleCount = Math.max(0, Number(role.count) || 0);
    const hourlyRate = calculateHourlyRate(
      role.salaryAmount,
      role.salaryType,
      workingHoursPerDay,
      workingDaysPerMonth
    );

    const roleHourlyBurn = roleCount * hourlyRate;
    const costPerMeeting = roleHourlyBurn * durationHoursDecimal;
    const costMonthly = cadence.isRecurring
      ? costPerMeeting * cadence.meetingsPerMonth
      : costPerMeeting;

    totalAttendees += roleCount;
    totalHourlyBurn += roleHourlyBurn;

    return {
      id: role.id,
      roleName: role.roleName || 'Unnamed Role',
      count: roleCount,
      hourlyRate,
      costPerMeeting,
      costMonthly,
    };
  });

  const safeTotalAttendees = Math.max(1, totalAttendees);
  const averageHourlyRate = safeTotalAttendees > 0 ? totalHourlyBurn / safeTotalAttendees : 0;
  const costPerMeeting = totalHourlyBurn * durationHoursDecimal;
  const costPerAttendee = safeTotalAttendees > 0 ? costPerMeeting / safeTotalAttendees : 0;

  const isRecurring = cadence.isRecurring;
  const weeklyCost = isRecurring ? costPerMeeting * cadence.meetingsPerWeek : costPerMeeting;
  const monthlyCost = isRecurring ? costPerMeeting * cadence.meetingsPerMonth : costPerMeeting;
  const annualCost = isRecurring ? costPerMeeting * cadence.meetingsPerYear : costPerMeeting;

  // Employee hours
  const employeeHoursPerMeeting = totalAttendees * durationHoursDecimal;
  const weeklyEmployeeHours = isRecurring
    ? employeeHoursPerMeeting * cadence.meetingsPerWeek
    : employeeHoursPerMeeting;
  const monthlyEmployeeHours = isRecurring
    ? employeeHoursPerMeeting * cadence.meetingsPerMonth
    : employeeHoursPerMeeting;
  const annualEmployeeHours = isRecurring
    ? employeeHoursPerMeeting * cadence.meetingsPerYear
    : employeeHoursPerMeeting;

  const safeHoursPerDay = Math.max(1, workingHoursPerDay || 8);
  const workdaysLostPerMonth = monthlyEmployeeHours / safeHoursPerDay;
  const workdaysLostPerYear = annualEmployeeHours / safeHoursPerDay;

  // Efficiency & Potential Waste
  const usefulness = Math.max(0, Math.min(100, usefulnessPercentage ?? 70));
  const wastePercentage = 100 - usefulness;
  const wasteFactor = wastePercentage / 100;

  const potentialWastePerMeeting = costPerMeeting * wasteFactor;
  const potentialWasteMonthly = monthlyCost * wasteFactor;
  const potentialWasteAnnual = annualCost * wasteFactor;

  return {
    durationHoursDecimal,
    totalAttendees: safeTotalAttendees,
    averageHourlyRate,
    costPerMeeting,
    costPerAttendee,
    weeklyCost,
    monthlyCost,
    annualCost,
    isRecurring,

    employeeHoursPerMeeting,
    weeklyEmployeeHours,
    monthlyEmployeeHours,
    annualEmployeeHours,
    workdaysLostPerMonth,
    workdaysLostPerYear,

    meetingsPerWeek: cadence.meetingsPerWeek,
    meetingsPerMonth: cadence.meetingsPerMonth,
    meetingsPerYear: cadence.meetingsPerYear,

    usefulnessPercentage: usefulness,
    potentialWastePerMeeting,
    potentialWasteMonthly,
    potentialWasteAnnual,
    wastePercentage,

    currency,
    roleBreakdown,
  };
}

/**
 * Calculates meeting optimization simulator scenario.
 */
export function calculateOptimization(
  current: CalculationResults,
  optimization: OptimizationInputs,
  workingDaysPerMonth = 22,
  workingHoursPerDay = 8
): OptimizationResults {
  const optDurationHours = minutesToDecimal(optimization.durationMinutes);
  const optAttendees = Math.max(1, optimization.attendees);
  const optCadence = getMeetingCadenceFrequencies(
    optimization.frequency,
    optimization.meetingCount,
    workingDaysPerMonth
  );

  // Single meeting cost with optimized duration & attendees (using same average hourly rate)
  const optCostPerMeeting = optAttendees * current.averageHourlyRate * optDurationHours;
  const optAnnualCost = optCadence.isRecurring
    ? optCostPerMeeting * optCadence.meetingsPerYear
    : optCostPerMeeting;

  // Current annual cost
  const currentAnnualCost = current.isRecurring ? current.annualCost : current.costPerMeeting;
  const annualSavings = Math.max(0, currentAnnualCost - optAnnualCost);
  const percentageSavings =
    currentAnnualCost > 0 ? (annualSavings / currentAnnualCost) * 100 : 0;

  // Hours
  const optEmployeeHoursPerMeeting = optAttendees * optDurationHours;
  const optMonthlyHours = optCadence.isRecurring
    ? optEmployeeHoursPerMeeting * optCadence.meetingsPerMonth
    : optEmployeeHoursPerMeeting;
  const optAnnualHours = optCadence.isRecurring
    ? optEmployeeHoursPerMeeting * optCadence.meetingsPerYear
    : optEmployeeHoursPerMeeting;

  const currentMonthlyHours = current.monthlyEmployeeHours;
  const currentAnnualHours = current.annualEmployeeHours;

  const hoursSavedMonthly = Math.max(0, currentMonthlyHours - optMonthlyHours);
  const hoursSavedAnnual = Math.max(0, currentAnnualHours - optAnnualHours);
  const workdaysSavedMonthly = hoursSavedMonthly / Math.max(1, workingHoursPerDay);

  return {
    currentAnnualCost,
    optimizedAnnualCost: optAnnualCost,
    annualSavings,
    percentageSavings,
    currentMonthlyHours,
    optimizedMonthlyHours: optMonthlyHours,
    hoursSavedMonthly,
    hoursSavedAnnual,
    workdaysSavedMonthly,
  };
}
