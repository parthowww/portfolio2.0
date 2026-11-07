export const projects = {
  leaklens: {
    name: "LeakLens",
    brief: "Upload an expense CSV and it flags duplicate payments, price hikes and spending surges, with the transactions behind each finding.",
    chips: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
    repo: "https://github.com/parthowww/leaklens",
    shots: [
      { src: "/shots/leaklens-leaks.webp", width: 1440, height: 900, alt: "LeakLens leak detection hub listing duplicate payments and price hikes with the amount at stake for each", caption: "Leak detection hub: each finding shows the rule that fired and the money involved. Demo data." },
      { src: "/shots/leaklens-dashboard.webp", width: 1440, height: 900, alt: "LeakLens overview dashboard with total expenses, potential savings, a spending trend chart and a category breakdown", caption: "Overview dashboard with the sample agency dataset. Demo data." }
    ],
    summary:
      "A web app that helps small businesses, agencies and freelancers find hidden financial leaks. You upload expense CSVs from any bank or bookkeeping tool. LeakLens flags suspicious or unnecessary spending, shows the transactions behind each finding, and recommends what to do next.",
    customer: "Finance and operations teams at small businesses, agencies and bookkeeping firms that need to review expenses without manually checking every transaction.",
    opportunity: "Offer it as a subscription priced by monthly transaction volume or organization size. A paid accountant or multi-client plan could make it useful to firms reviewing expenses for several businesses.",
    stack: [
      ["Framework", "Next.js 16 (App Router), React 19, TypeScript"],
      ["Styling", "Tailwind CSS v4"],
      ["Charts", "Recharts"],
      ["CSV parsing", "Papa Parse"],
      ["Database and auth", "Supabase (PostgreSQL with row-level security)"],
      ["Icons", "Lucide React"],
      ["Testing", "Node.js built-in test runner"],
    ],
  },
  nudgevest: {
    name: "NudgeVest",
    brief: "Picks small deposit nudges from simulated daily transactions using a Thompson Sampling bandit and an XGBoost model.",
    chips: ["Python", "FastAPI", "XGBoost", "NumPy"],
    repo: "https://github.com/parthowww/nudgevest",
    shots: [],
    summary:
      "A behavioral micro-investing demo. It watches simulated daily transactions and picks small deposit nudges, like rounding up a coffee purchase, using a contextual multi-armed bandit (Thompson Sampling) blended with an XGBoost propensity model. The deposits compound in a simulated portfolio.",
    customer: "Fintech apps, neobanks and investing platforms that want to help newer investors build a regular saving habit.",
    opportunity: "Package the nudge and personalization engine as an embeddable feature for financial apps, with a platform fee or pricing tied to active users. The demo uses simulated activity; a real product would need partner integrations and careful user-consent and financial-compliance design.",
    stack: [
      ["Language", "Python 3.10+"],
      ["Backend", "FastAPI, Uvicorn"],
      ["Machine learning", "XGBoost, scikit-learn, NumPy, pandas"],
      ["Bandit", "Contextual Thompson Sampling, written by hand in NumPy"],
      ["Interface", "Single-page HTML5 with Tailwind and Chart.js"],
    ],
  },
  aerarium: {
    name: "Aerarium",
    brief: "Audits SaaS contracts, finds unused seats, and shows how much extra cash runway the savings buy.",
    chips: ["Node.js", "Express", "SQLite", "Vanilla JS"],
    repo: "https://github.com/parthowww/aerarium",
    shots: [
      { src: "/shots/aerarium-console.webp", width: 1440, height: 760, alt: "Aerarium treasury console showing survival runway, monthly recurring spend, cash reserves and three identified spend leaks", caption: "Treasury console signed in as the demo account. Demo data." },
      { src: "/shots/aerarium-landing.webp", width: 1440, height: 900, alt: "Aerarium landing page with the live runway extension simulator", caption: "Landing page with the interactive runway simulator." }
    ],
    summary:
      "A treasury ledger for tech startups. It audits SaaS contracts, finds dormant seat licenses, and calculates how much extra cash runway the savings would buy. It includes a runway simulator on the landing page and a one-click demo login.",
    customer: "Founders and finance or operations leads at early-stage startups who need a clear view of recurring software spend and cash runway.",
    opportunity: "Sell it as a monthly SaaS product, with plans based on company size, connected vendors or contract volume. Higher tiers could add team workflows and accounting or identity-provider integrations.",
    stack: [
      ["Frontend", "Vanilla ES6+ JavaScript, CSS3, Lucide icons"],
      ["Backend", "Node.js, Express.js REST API"],
      ["Database", "SQLite through Node's built-in node:sqlite"],
    ],
  },
  zentropy: {
    name: "Zentropy",
    repo: "https://github.com/parthowww/zentropy",
    shots: [
      { src: "/shots/zentropy-console.webp", width: 1440, height: 900, alt: "Zentropy dashboard listing monitored endpoints with HTTP status, live latency and uptime", caption: "Fleet dashboard with the demo account: status, latency and uptime per endpoint. Demo data." },
      { src: "/shots/zentropy-landing.webp", width: 1440, height: 900, alt: "Zentropy landing page with a live endpoint probe form", caption: "Landing page with the live endpoint probe." }
    ],
    summary:
      "A minimalist observability platform for microservices. It tracks p99 latency, uptime and degraded states, and handles incidents and endpoint checks inline, with no pop-up dialogs.",
    customer: "Small software teams and indie SaaS operators who need straightforward uptime and latency monitoring without adopting a large observability suite.",
    opportunity: "Use a freemium model with paid tiers based on monitored endpoints, check frequency, retention and alerting. A team plan could add shared incident workflows and longer history.",
    stack: [
      ["Frontend", "Vanilla ES6+ JavaScript, CSS3, Lucide icons"],
      ["Backend", "Node.js, Express.js"],
      ["Database", "SQLite through Node's built-in node:sqlite"],
    ],
  },
};
