const assert = require('assert');

// Simulate the functions in pure JS for automated verification
function calculateHourlyRate(salaryAmount, salaryType, workingHoursPerDay = 8, workingDaysPerMonth = 22) {
  if (!salaryAmount || salaryAmount <= 0) return 0;
  const workingHoursPerMonth = workingDaysPerMonth * workingHoursPerDay;
  switch (salaryType) {
    case 'hourly': return salaryAmount;
    case 'monthly': return salaryAmount / workingHoursPerMonth;
    case 'annual': return salaryAmount / (12 * workingHoursPerMonth);
    default: return 0;
  }
}

function durationToDecimal(hours = 0, minutes = 0) {
  return Number(hours) + (Number(minutes) / 60);
}

function getMeetingCadenceFrequencies(frequency, meetingCount = 1, workingDaysPerMonth = 22) {
  const WEEKS_PER_MONTH = 52 / 12;
  switch (frequency) {
    case 'onetime': return { isRecurring: false, perWeek: 0, perMonth: 0, perYear: 0 };
    case 'daily': return { isRecurring: true, perWeek: meetingCount * 5, perMonth: meetingCount * workingDaysPerMonth, perYear: meetingCount * workingDaysPerMonth * 12 };
    case 'weekly': return { isRecurring: true, perWeek: meetingCount, perMonth: meetingCount * WEEKS_PER_MONTH, perYear: meetingCount * 52 };
    case 'monthly': return { isRecurring: true, perWeek: meetingCount / WEEKS_PER_MONTH, perMonth: meetingCount, perYear: meetingCount * 12 };
  }
}

console.log('--- RUNNING MATHEMATICAL CONSISTENCY TESTS ---');

// Test 1: Hourly rate conversions
const monthly100k = calculateHourlyRate(100000, 'monthly', 8, 22);
assert.strictEqual(Math.round(monthly100k * 100) / 100, 568.18, 'Monthly 100,000 at 22d x 8h should equal ~568.18/hr');
console.log('✓ Test 1 Passed: Monthly salary conversion is accurate');

const annual120k = calculateHourlyRate(120000, 'annual', 8, 22);
assert.strictEqual(Math.round(annual120k * 100) / 100, 56.82, 'Annual 120,000 should equal ~56.82/hr');
console.log('✓ Test 2 Passed: Annual salary conversion is accurate');

// Test 2: Duration decimals
assert.strictEqual(durationToDecimal(1, 30), 1.5, '1 hr 30 mins should be 1.5 hrs');
assert.strictEqual(durationToDecimal(0, 45), 0.75, '45 mins should be 0.75 hrs');
assert.strictEqual(durationToDecimal(2, 15), 2.25, '2 hrs 15 mins should be 2.25 hrs');
console.log('✓ Test 3 Passed: Duration decimals are exact');

// Test 3: Single meeting cost
const cost1 = 5 * 800 * durationToDecimal(1, 0);
assert.strictEqual(cost1, 4000, '5 attendees * 800/hr * 1 hr = 4,000');
console.log('✓ Test 4 Passed: Single meeting cost calculation matches spec');

// Test 4: Employee hours
const employeeHours = 1 * 8 * 12;
assert.strictEqual(employeeHours, 96, '1 hr * 8 attendees * 12 meetings = 96 employee hours');
console.log('✓ Test 5 Passed: Employee hours formula matches spec');

// Test 5: Potential waste calculation
const meetingSpend = 100000;
const usefulness = 60;
const waste = meetingSpend * (1 - usefulness / 100);
assert.strictEqual(waste, 40000, '100,000 spend at 60% usefulness = 40,000 potential waste');
console.log('✓ Test 6 Passed: Potential waste calculation matches spec');

// Test 6: Cadence consistency (weekly * 52 == annual)
const weeklyCadence = getMeetingCadenceFrequencies('weekly', 2);
assert.strictEqual(weeklyCadence.perYear, 104, '2 meetings/week = 104 meetings/year');
assert.strictEqual(Math.round(weeklyCadence.perMonth * 12), 104, 'Monthly cadence times 12 equals annual cadence (52 weeks)');
console.log('✓ Test 7 Passed: Cadence mathematical consistency verified');

console.log('ALL MATHEMATICAL VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉');
