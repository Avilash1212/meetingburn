import { QuickMeetingInputs, RoleItem } from './types';

export interface MeetingPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  quickInputs: QuickMeetingInputs;
  advancedRoles?: RoleItem[];
}

export const PRESET_MEETINGS: MeetingPreset[] = [
  {
    id: 'weekly-product-sync',
    name: 'Weekly Product Sync',
    category: 'Product & Tech',
    description: '1 hour, 8 attendees, 2 meetings per week at ₹120,000/month',
    quickInputs: {
      durationHours: 1,
      durationMinutes: 0,
      attendees: 8,
      frequency: 'weekly',
      meetingCount: 2,
      salaryType: 'monthly',
      salaryAmount: 120000,
      currency: 'INR',
      workingHoursPerDay: 8,
      workingDaysPerMonth: 22,
      usefulnessPercentage: 70,
    },
    advancedRoles: [
      { id: 'role-1', roleName: 'Product Manager', count: 2, salaryType: 'monthly', salaryAmount: 150000 },
      { id: 'role-2', roleName: 'Software Engineer', count: 5, salaryType: 'monthly', salaryAmount: 180000 },
      { id: 'role-3', roleName: 'Product Designer', count: 1, salaryType: 'monthly', salaryAmount: 120000 },
    ],
  },
  {
    id: 'engineering-daily-standup',
    name: 'Daily Engineering Standup',
    category: 'Engineering',
    description: '15 mins, 7 engineers, daily (5/week) at $120,000/yr',
    quickInputs: {
      durationHours: 0,
      durationMinutes: 15,
      attendees: 7,
      frequency: 'daily',
      meetingCount: 1,
      salaryType: 'annual',
      salaryAmount: 120000,
      currency: 'USD',
      workingHoursPerDay: 8,
      workingDaysPerMonth: 22,
      usefulnessPercentage: 80,
    },
    advancedRoles: [
      { id: 'role-1', roleName: 'Staff Engineer', count: 1, salaryType: 'annual', salaryAmount: 160000 },
      { id: 'role-2', roleName: 'Senior Software Engineer', count: 4, salaryType: 'annual', salaryAmount: 130000 },
      { id: 'role-3', roleName: 'QA Automation Engineer', count: 2, salaryType: 'annual', salaryAmount: 95000 },
    ],
  },
  {
    id: 'executive-all-hands',
    name: 'Company All-Hands Sync',
    category: 'Leadership',
    description: '1 hr 30 mins, 40 attendees, bi-weekly at ₹1,00,000/mo',
    quickInputs: {
      durationHours: 1,
      durationMinutes: 30,
      attendees: 40,
      frequency: 'weekly',
      meetingCount: 1,
      salaryType: 'monthly',
      salaryAmount: 100000,
      currency: 'INR',
      workingHoursPerDay: 8,
      workingDaysPerMonth: 22,
      usefulnessPercentage: 60,
    },
  },
  {
    id: 'sprint-planning',
    name: 'Bi-Weekly Sprint Planning',
    category: 'Agile & Scrum',
    description: '2 hours, 10 team members, monthly at $85,000/yr',
    quickInputs: {
      durationHours: 2,
      durationMinutes: 0,
      attendees: 10,
      frequency: 'monthly',
      meetingCount: 2,
      salaryType: 'annual',
      salaryAmount: 85000,
      currency: 'USD',
      workingHoursPerDay: 8,
      workingDaysPerMonth: 22,
      usefulnessPercentage: 75,
    },
  },
];
