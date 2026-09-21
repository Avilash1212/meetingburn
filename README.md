# 🔥 MeetingBurn

> **Know what every meeting really costs.**  
> Turn meeting hours into real business costs — and discover what your recurring calendar commitments are really costing your team in salary capital and maker time.

---

## 🚀 Features

- **Dual-Mode Meeting Cost Calculator**:
  - **Quick Mode**: Rapid calculation using average salary (hourly, monthly, or annual CTC) and presets (15m, 30m, 45m, 1h, 1.5h, 2h).
  - **Advanced Mode**: Detailed role-based breakdown (PMs, Engineers, Designers, Executives) with individual headcount and compensation.
- **Executive Results Dashboard**:
  - Real-time animated KPIs: Cost per Meeting, Weekly Cost, Monthly Cost, Annual Cost, Employee-Hours/Month, and Workdays Lost.
  - Number format toggle: Compact (`₹1.4L` / `$140K`) vs Exact (`₹1,40,000`).
- **Cadence & Waste Visualizations**:
  - Cadence timeline projection bar chart.
  - Stacked breakdown of productive value created vs potential conversational waste.
- **Meeting Efficiency & Potential Waste Section**:
  - 0%–100% usefulness slider distinguishing between essential alignment and spectator/agenda waste.
- **"This Meeting Is Costing..." Live Burn Timer**:
  - Real-time conference room clock with live cost ticking every second.
  - Tab-focus resilient using timestamp deltas (`Date.now()`).
  - Playful milestone callouts during ongoing meetings.
- **What-If Optimization Simulator**:
  - Interactive sliders to simulate trimming 15 minutes or reducing headcount with projected annual savings and employee workdays reclaimed.
- **Relatable Tangible Comparisons**:
  - Translates spend into sensible benchmarks (iPhones, laptops, team lunches, artisan coffee, business flights, ergonomic workstations).
- **Shareable Result Card & 1-Click Slack Export**:
  - Sleek social card modal with 1-click formatted plain-text copy for Slack, Teams, or email.
- **Multi-Currency Support**:
  - INR (₹), USD ($), EUR (€), GBP (£), AED, and SGD.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Library**: [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: Canvas Confetti

---

## 🏃 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/meetingburn.git

# Navigate into the project
cd meetingburn

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm run start
```

---

## 📄 License
MIT License.
