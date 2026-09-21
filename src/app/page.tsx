'use client';

import React, { useState, useEffect } from 'react';
import {
  CalculationMode,
  CalculationResults,
  CurrencyCode,
  MeetingFrequency,
  QuickMeetingInputs,
  RoleItem,
} from '@/lib/types';
import {
  calculateAdvancedMeeting,
  calculateQuickMeeting,
} from '@/lib/calculations';
import { PRESET_MEETINGS } from '@/lib/demoData';

// Layout Components
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/layout/Hero';
import { Footer } from '@/components/layout/Footer';

// Calculator & Dashboard Components
import { CalculatorContainer } from '@/components/calculator/CalculatorContainer';
import { ResultCards } from '@/components/dashboard/ResultCards';
import { MeetingCostChart } from '@/components/dashboard/MeetingCostChart';
import { EfficiencySection } from '@/components/dashboard/EfficiencySection';
import { FunComparisons } from '@/components/dashboard/FunComparisons';
import { OptimizationSimulator } from '@/components/dashboard/OptimizationSimulator';
import { RecommendationCard } from '@/components/dashboard/RecommendationCard';
import { ShareCardModal } from '@/components/dashboard/ShareCardModal';
import { LiveMeetingTimer } from '@/components/timer/LiveMeetingTimer';

export default function HomePage() {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference or saved preference
    const saved = localStorage.getItem('meetingburn-theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('meetingburn-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('meetingburn-theme', 'light');
      }
      return next;
    });
  };

  // Currency State (default INR)
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  // Mode State
  const [mode, setMode] = useState<CalculationMode>('quick');
  const [meetingTitle, setMeetingTitle] = useState('Weekly Product Sync');

  // Quick Mode Inputs
  const [quickInputs, setQuickInputs] = useState<QuickMeetingInputs>({
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
  });

  // Advanced Mode Inputs
  const [advDurationHours, setAdvDurationHours] = useState(1);
  const [advDurationMinutes, setAdvDurationMinutes] = useState(0);
  const [advRoles, setAdvRoles] = useState<RoleItem[]>([
    { id: 'role-1', roleName: 'Product Manager', count: 2, salaryType: 'monthly', salaryAmount: 150000 },
    { id: 'role-2', roleName: 'Software Engineer', count: 5, salaryType: 'monthly', salaryAmount: 180000 },
    { id: 'role-3', roleName: 'Product Designer', count: 1, salaryType: 'monthly', salaryAmount: 120000 },
  ]);
  const [advFrequency, setAdvFrequency] = useState<MeetingFrequency>('weekly');
  const [advMeetingCount, setAdvMeetingCount] = useState(2);
  const [advWorkingHoursPerDay, setAdvWorkingHoursPerDay] = useState(8);
  const [advWorkingDaysPerMonth, setAdvWorkingDaysPerMonth] = useState(22);

  // Usefulness / Efficiency percentage
  const [usefulnessPercentage, setUsefulnessPercentage] = useState(70);

  // Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Currency Change Handler
  const handleCurrencyChange = (newCurrency: CurrencyCode) => {
    setCurrency(newCurrency);
    // Scale default salary if changing currency
    const inrToUsdApprox = 1 / 84;
    const usdToInrApprox = 84;

    if (currency === 'INR' && newCurrency !== 'INR') {
      const scaledQuick = Math.round(quickInputs.salaryAmount * inrToUsdApprox);
      setQuickInputs((prev) => ({
        ...prev,
        currency: newCurrency,
        salaryAmount: prev.salaryType === 'hourly' ? 50 : scaledQuick,
      }));
      setAdvRoles((prev) =>
        prev.map((r) => ({
          ...r,
          salaryAmount: Math.round(r.salaryAmount * inrToUsdApprox),
        }))
      );
    } else if (currency !== 'INR' && newCurrency === 'INR') {
      const scaledQuick = Math.round(quickInputs.salaryAmount * usdToInrApprox);
      setQuickInputs((prev) => ({
        ...prev,
        currency: newCurrency,
        salaryAmount: prev.salaryType === 'hourly' ? 800 : scaledQuick,
      }));
      setAdvRoles((prev) =>
        prev.map((r) => ({
          ...r,
          salaryAmount: Math.round(r.salaryAmount * usdToInrApprox),
        }))
      );
    } else {
      setQuickInputs((prev) => ({ ...prev, currency: newCurrency }));
    }
  };

  // Load Preset Handler
  const handleLoadPreset = (presetId?: string) => {
    const preset =
      PRESET_MEETINGS.find((p) => p.id === presetId) || PRESET_MEETINGS[0];

    setMeetingTitle(preset.name);
    setCurrency(preset.quickInputs.currency);

    setQuickInputs({
      ...preset.quickInputs,
      usefulnessPercentage: preset.quickInputs.usefulnessPercentage,
    });
    setUsefulnessPercentage(preset.quickInputs.usefulnessPercentage);

    if (preset.advancedRoles && preset.advancedRoles.length > 0) {
      setAdvRoles(preset.advancedRoles);
      setAdvDurationHours(preset.quickInputs.durationHours);
      setAdvDurationMinutes(preset.quickInputs.durationMinutes);
      setAdvFrequency(preset.quickInputs.frequency);
      setAdvMeetingCount(preset.quickInputs.meetingCount);
    }

    // Smooth scroll to calculator
    const el = document.getElementById('calculator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Reset Handler
  const handleReset = () => {
    setMeetingTitle('Team Meeting');
    setQuickInputs({
      durationHours: 1,
      durationMinutes: 0,
      attendees: 5,
      frequency: 'weekly',
      meetingCount: 1,
      salaryType: 'monthly',
      salaryAmount: currency === 'INR' ? 100000 : 7000,
      currency,
      workingHoursPerDay: 8,
      workingDaysPerMonth: 22,
      usefulnessPercentage: 70,
    });
    setUsefulnessPercentage(70);
  };

  // Calculation Execution
  const results: CalculationResults =
    mode === 'quick'
      ? calculateQuickMeeting({
          ...quickInputs,
          currency,
          usefulnessPercentage,
        })
      : calculateAdvancedMeeting(
          advDurationHours,
          advDurationMinutes,
          advRoles,
          advFrequency,
          advMeetingCount,
          currency,
          advWorkingHoursPerDay,
          advWorkingDaysPerMonth,
          usefulnessPercentage
        );

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Navbar */}
      <Navbar
        currentCurrency={currency}
        onCurrencyChange={handleCurrencyChange}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onLoadPreset={() => handleLoadPreset('weekly-product-sync')}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero
          currency={currency}
          onCalculateClick={() => {
            const el = document.getElementById('calculator');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onDemoClick={() => handleLoadPreset('weekly-product-sync')}
        />

        {/* 3. Main Calculator & Results Hub */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
          {/* Top Split: Calculator & High-level KPI cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Calculator Input Form */}
            <div className="lg:col-span-6 xl:col-span-5">
              <CalculatorContainer
                meetingTitle={meetingTitle}
                onMeetingTitleChange={setMeetingTitle}
                mode={mode}
                onModeChange={setMode}
                currency={currency}
                quickInputs={quickInputs}
                onQuickInputsChange={setQuickInputs}
                advDurationHours={advDurationHours}
                advDurationMinutes={advDurationMinutes}
                onAdvDurationChange={(h, m) => {
                  setAdvDurationHours(h);
                  setAdvDurationMinutes(m);
                }}
                advRoles={advRoles}
                onAdvRolesChange={setAdvRoles}
                advFrequency={advFrequency}
                advMeetingCount={advMeetingCount}
                onAdvFrequencyChange={(f, c) => {
                  setAdvFrequency(f);
                  setAdvMeetingCount(c);
                }}
                advWorkingHoursPerDay={advWorkingHoursPerDay}
                advWorkingDaysPerMonth={advWorkingDaysPerMonth}
                onAdvScheduleChange={(h, d) => {
                  setAdvWorkingHoursPerDay(h);
                  setAdvWorkingDaysPerMonth(d);
                }}
                onLoadPreset={handleLoadPreset}
                onReset={handleReset}
              />
            </div>

            {/* Right: Real-Time Results Dashboard */}
            <div className="lg:col-span-6 xl:col-span-7 space-y-6">
              <ResultCards
                results={results}
                onOpenShareModal={() => setIsShareModalOpen(true)}
              />

              <MeetingCostChart results={results} />
            </div>
          </div>

          {/* 4. Meeting Efficiency & Potential Waste Section */}
          <EfficiencySection
            results={results}
            usefulnessPercentage={usefulnessPercentage}
            onUsefulnessChange={setUsefulnessPercentage}
          />

          {/* 5. Live Meeting Cost Burn Timer */}
          <LiveMeetingTimer
            initialAttendees={results.totalAttendees}
            initialHourlyRate={Math.round(results.averageHourlyRate)}
            currency={currency}
          />

          {/* 6. What if you optimized this meeting? (Simulator) */}
          <OptimizationSimulator
            results={results}
            workingDaysPerMonth={
              mode === 'quick'
                ? quickInputs.workingDaysPerMonth
                : advWorkingDaysPerMonth
            }
            workingHoursPerDay={
              mode === 'quick'
                ? quickInputs.workingHoursPerDay
                : advWorkingHoursPerDay
            }
          />

          {/* 7. What could this money buy instead? (Fun Comparisons) */}
          <FunComparisons results={results} />

          {/* 8. Smart Recommendation Cards */}
          <RecommendationCard results={results} />
        </div>
      </main>

      {/* 9. Shareable Social Card Modal */}
      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        meetingTitle={meetingTitle}
        results={results}
      />

      {/* 10. Footer */}
      <Footer />
    </div>
  );
}
