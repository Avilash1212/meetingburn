export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SGD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
  rateToInr: number; // approximate exchange rate benchmark
}

export type CalculationMode = 'quick' | 'advanced';

export type SalaryType = 'hourly' | 'monthly' | 'annual';

export type MeetingFrequency = 'onetime' | 'daily' | 'weekly' | 'monthly';

export interface WorkScheduleSettings {
  workingHoursPerDay: number; // default 8
  workingDaysPerMonth: number; // default 22
}

export interface QuickMeetingInputs {
  durationHours: number; // hours
  durationMinutes: number; // minutes
  attendees: number;
  frequency: MeetingFrequency;
  meetingCount: number; // meetings per selected frequency
  salaryType: SalaryType;
  salaryAmount: number;
  currency: CurrencyCode;
  workingHoursPerDay: number;
  workingDaysPerMonth: number;
  usefulnessPercentage: number; // 0 - 100, default 70
}

export interface RoleItem {
  id: string;
  roleName: string;
  count: number;
  salaryType: SalaryType;
  salaryAmount: number;
}

export interface AdvancedMeetingInputs {
  durationHours: number;
  durationMinutes: number;
  roles: RoleItem[];
  frequency: MeetingFrequency;
  meetingCount: number;
  currency: CurrencyCode;
  workingHoursPerDay: number;
  workingDaysPerMonth: number;
  usefulnessPercentage: number;
}

export interface RoleCalculationDetail {
  id: string;
  roleName: string;
  count: number;
  hourlyRate: number;
  costPerMeeting: number;
  costMonthly: number;
}

export interface CalculationResults {
  durationHoursDecimal: number;
  totalAttendees: number;
  averageHourlyRate: number;
  costPerMeeting: number;
  costPerAttendee: number;
  weeklyCost: number;
  monthlyCost: number;
  annualCost: number;
  isRecurring: boolean;
  
  // Hours & Workdays
  employeeHoursPerMeeting: number;
  weeklyEmployeeHours: number;
  monthlyEmployeeHours: number;
  annualEmployeeHours: number;
  workdaysLostPerMonth: number;
  workdaysLostPerYear: number;
  
  // Cadence figures
  meetingsPerWeek: number;
  meetingsPerMonth: number;
  meetingsPerYear: number;

  // Efficiency & Waste
  usefulnessPercentage: number;
  potentialWastePerMeeting: number;
  potentialWasteMonthly: number;
  potentialWasteAnnual: number;
  wastePercentage: number;

  // Currency
  currency: CurrencyCode;

  // Advanced role breakdown if available
  roleBreakdown?: RoleCalculationDetail[];
}

export interface OptimizationInputs {
  durationMinutes: number;
  attendees: number;
  frequency: MeetingFrequency;
  meetingCount: number;
}

export interface OptimizationResults {
  currentAnnualCost: number;
  optimizedAnnualCost: number;
  annualSavings: number;
  percentageSavings: number;
  currentMonthlyHours: number;
  optimizedMonthlyHours: number;
  hoursSavedMonthly: number;
  hoursSavedAnnual: number;
  workdaysSavedMonthly: number;
}

export interface BenchmarkItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  approxPrices: Record<CurrencyCode, number>;
  descriptionTemplate: (countStr: string) => string;
}

export interface CostComparisonResult {
  id: string;
  name: string;
  icon: string;
  description: string;
  rawCount: number;
  unitPrice: number;
  period: 'monthly' | 'annual';
}

export interface Recommendation {
  id: string;
  type: 'insight' | 'warning' | 'tip' | 'action';
  title: string;
  description: string;
  metric?: string;
  impact?: string;
}

export interface LiveTimerState {
  isRunning: boolean;
  isPaused: boolean;
  startTimestamp: number | null;
  accumulatedMs: number;
  attendees: number;
  hourlyCostPerAttendee: number;
  currency: CurrencyCode;
}
