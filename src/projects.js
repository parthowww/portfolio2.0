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
    uml: {
      width: 980, height: 460,
      nodes: [
        { id: "user", kind: "actor", x: 25, y: 165, w: 155, h: 90, title: "Finance user", body: ["uploads CSV", "reviews findings"] },
        { id: "app", x: 245, y: 165, w: 190, h: 90, title: "Next.js app", body: ["workspace & dashboard", "CSV import workflow"] },
        { id: "parser", x: 510, y: 35, w: 185, h: 90, title: "Papa Parse", body: ["normalize rows", "validate transactions"] },
        { id: "engine", x: 510, y: 165, w: 195, h: 110, title: "Detection engine", body: ["duplicates & recurring", "price jumps & surges"] },
        { id: "db", x: 765, y: 165, w: 185, h: 100, title: "Supabase / Postgres", body: ["workspaces & findings", "row-level isolation"] },
        { id: "reports", x: 765, y: 330, w: 185, h: 90, title: "Reports", body: ["review evidence", "CSV / print export"] },
      ],
      edges: [
        { from: "user", to: "app", label: "upload" },
        { from: "app", to: "parser", label: "expense CSV" },
        { from: "parser", to: "engine", label: "validated rows" },
        { from: "engine", to: "db", label: "findings & evidence" },
        { from: "db", to: "reports", label: "stored records" },
        { from: "reports", to: "app", label: "review / export", points: [[765, 375], [720, 440], [340, 440], [340, 255]] },
      ],
    },
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
    uml: {
      width: 980, height: 500,
      nodes: [
        { id: "transactions", x: 25, y: 170, w: 180, h: 95, title: "Transaction generator", body: ["synthetic activity", "category / amount / time"] },
        { id: "api", x: 260, y: 170, w: 190, h: 100, title: "FastAPI controller", body: ["step / simulate / reset", "serves dashboard state"] },
        { id: "engine", x: 525, y: 100, w: 220, h: 130, title: "Hybrid decision engine", body: ["XGBoost acceptance prior", "Thompson Sampling bandit", "contextual nudge choice"] },
        { id: "agent", x: 805, y: 100, w: 150, h: 95, title: "Simulated user", body: ["accepts or declines", "returns feedback"] },
        { id: "portfolio", x: 805, y: 310, w: 150, h: 95, title: "Portfolio", body: ["accepted deposits", "simulated returns"] },
        { id: "dashboard", x: 260, y: 355, w: 190, h: 95, title: "Web dashboard", body: ["controls & live feed", "reward / regret charts"] },
      ],
      edges: [
        { from: "transactions", to: "api", label: "context" },
        { from: "api", to: "engine", label: "simulation tick" },
        { from: "engine", to: "agent", label: "selected nudge" },
        { from: "agent", to: "engine", label: "accept / decline", points: [[805, 120], [775, 75], [635, 75], [635, 100]] },
        { from: "agent", to: "portfolio", label: "if accepted" },
        { from: "api", to: "dashboard", label: "state / results", points: [[355, 270], [355, 355]] },
        { from: "dashboard", to: "api", label: "controls", points: [[260, 410], [225, 410], [225, 220], [260, 220]] },
      ],
    },
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
    uml: {
      width: 980, height: 390,
      nodes: [
        { id: "operator", kind: "actor", x: 25, y: 155, w: 155, h: 90, title: "Startup operator", body: ["reviews spend", "manages contracts"] },
        { id: "ui", x: 245, y: 155, w: 190, h: 100, title: "Vanilla JS frontend", body: ["treasury console", "runway simulator"] },
        { id: "api", x: 510, y: 115, w: 210, h: 180, title: "Express API", body: ["auth & demo login", "subscriptions & seat audit", "leaks / treasury routes"] },
        { id: "db", x: 790, y: 155, w: 165, h: 100, title: "SQLite", body: ["contracts & leaks", "cash / reserves"] },
      ],
      edges: [
        { from: "operator", to: "ui", label: "manage treasury" },
        { from: "ui", to: "api", label: "REST requests" },
        { from: "api", to: "db", label: "read / write" },
        { from: "db", to: "ui", label: "runway & savings", points: [[790, 235], [750, 345], [340, 345], [340, 255]] },
      ],
    },
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
    uml: {
      width: 980, height: 390,
      nodes: [
        { id: "operator", kind: "actor", x: 25, y: 155, w: 155, h: 90, title: "Operator", body: ["registers services", "reviews incidents"] },
        { id: "ui", x: 245, y: 155, w: 190, h: 100, title: "Telemetry dashboard", body: ["service health & p99", "inline incident actions"] },
        { id: "api", x: 510, y: 115, w: 210, h: 180, title: "Express REST API", body: ["services & health checks", "incident lifecycle", "metrics aggregates"] },
        { id: "db", x: 790, y: 155, w: 165, h: 100, title: "SQLite", body: ["service records", "incident records"] },
      ],
      edges: [
        { from: "operator", to: "ui", label: "monitor" },
        { from: "ui", to: "api", label: "REST requests" },
        { from: "api", to: "db", label: "read / write" },
        { from: "db", to: "ui", label: "status / metrics", points: [[790, 235], [750, 345], [340, 345], [340, 255]] },
      ],
    },
    stack: [
      ["Frontend", "Vanilla ES6+ JavaScript, CSS3, Lucide icons"],
      ["Backend", "Node.js, Express.js"],
      ["Database", "SQLite through Node's built-in node:sqlite"],
    ],
  },
};
