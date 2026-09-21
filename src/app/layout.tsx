import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MeetingBurn — Meeting Cost & Time Waste Calculator',
  description:
    'Turn meeting hours into real business costs. Calculate the true salary and time investment of every team meeting with fun benchmarks, a live burn timer, and what-if optimizer.',
  keywords: [
    'Meeting Cost Calculator',
    'Meeting Waste Calculator',
    'Meeting ROI',
    'Employee Hours',
    'B2B SaaS Meeting Analytics',
  ],
  authors: [{ name: 'MeetingBurn' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased selection:bg-orange-500 selection:text-white transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
