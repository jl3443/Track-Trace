# ETA Control Tower — Operations Readiness Demo

AI-powered shipment tracking control tower for multi-modal logistics (ocean, air, road). Built to demonstrate real-time ETA management, exception handling, and intelligent alerting across a supply chain portfolio.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?logo=tailwindcss)

---

## Overview

A full-featured logistics visibility platform that tracks shipments across carriers, modes, and geographies. The system aggregates signals from multiple sources (carrier portals, GPS/AIS, weather APIs, customs systems) and uses AI agents to detect anomalies, reconcile conflicting data, and recommend corrective actions.

### Key Capabilities

- **Multi-source signal reconciliation** — Compare ETA data from 15+ sources (CargoSmart, Maersk Portal, GPS/AIS, Weather API, etc.) with confidence scoring and freshness tracking
- **AI agent automation** — Proactive anomaly detection, ETA recalculation, carrier notification drafting, and escalation recommendations
- **Exception workbench** — Structured resolution workflows: acknowledge → notify → sync OTM → escalate, with one-click email composition and AI-powered phone escalation
- **Portfolio analytics** — Delay by carrier, mode split, exception distribution, carrier scorecards, lane performance trends
- **Interactive tracking map** — Leaflet-based map with shipment pin locations and route visualization
- **Email management** — Inbox with AI-powered shipment reference extraction, sent folder, tagged messages (carrier, customs, weather, compliance, advisory)
- **Natural language AI chat** — Query shipment status, delays, risks, and weather impacts in English or Chinese

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16, React 19 |
| Language | TypeScript 5.7 (strict) |
| Styling | Tailwind CSS 4.2 |
| UI Components | shadcn/ui + Radix UI |
| Charts | Recharts 2.15 |
| Maps | Leaflet + React Leaflet |
| Icons | Lucide React |
| Fonts | IBM Plex Sans / Mono |

---

## Pages & Features

### Portfolio

| Page | Description |
|------|-------------|
| **Dashboard** | KPI cards, AI corridor analysis, shipment table, exception distribution, D&D risk panel, mini map |
| **Analytics** | Delay-by-carrier charts, mode split, severity breakdown, agent action timeline |
| **Carrier Scorecards** | Performance ratings (Preferred / Monitor / Caution), KPI trends, delivery metrics |
| **Track Shipment** | Search and filter shipments, real-time tracking lookup |

### Shipment Operations

| Page | Description |
|------|-------------|
| **Exception Workbench** | Per-shipment action cards with multi-step resolution workflows and resolve tracking |
| **Weather / Traffic** | Weather disruption visualization, port congestion status, impact zones |
| **Timeline** | Full journey timeline with multi-source signal attribution |
| **Documents** | Shipping document tracking (BOL, commercial invoice, packing list, certificate of origin) |

### Communication

| Page | Description |
|------|-------------|
| **Email Inbox** | Tagged inbox with AI analysis to auto-extract shipment references from unregistered emails |
| **Email Sent** | History of sent notifications and escalations |

### Intelligence

| Feature | Description |
|---------|-------------|
| **AI Chat Panel** | Natural language queries about shipments, delays, weather, customs holds |
| **Agent Activity Log** | Real-time feed of AI agent actions (detect, recalculate, notify, flag, recommend, sync) |

---

## Shipment Drawer

Click any shipment to open a detail drawer with three tabs:

- **Overview** — ETA confidence, delay summary, AI agent analysis, recommended actions (approve ETA, notify team, escalate with AI call, override)
- **Signals** — Multi-source data comparison table with freshness, alignment status, and reconciliation
- **Shipping Document** — OTM sync status, document upload with AI extraction, receiver notification workflow

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) — select a persona (Router or Shipment Coordinator) to enter the dashboard.

---

## Project Structure

```
app/
├── page.tsx                    # Entry point (login → app shell)
├── layout.tsx                  # Root layout, fonts, metadata
└── api/send-email/route.ts     # Email API endpoint

components/shipment/            # 26 feature components
├── app-shell.tsx               # Main layout + state management
├── sidebar.tsx                 # Navigation with dynamic badges
├── top-bar.tsx                 # Search, AI toggle, back nav
├── dashboard.tsx               # Portfolio dashboard
├── kpi-cards.tsx               # Compact KPI row
├── shipment-table.tsx          # Sortable shipment list
├── shipment-drawer.tsx         # Detail drawer (Overview/Signals/OTM)
├── exception-workbench.tsx     # Exception resolution workflows
├── exception-panels.tsx        # Distribution chart + D&D risk
├── analytics-page.tsx          # Charts and metrics
├── carrier-scorecard-page.tsx  # Carrier performance ratings
├── tracking-search-page.tsx    # Shipment search
├── search-results-page.tsx     # Global search results
├── weather-traffic-page.tsx    # Weather/traffic disruptions
├── timeline-page.tsx           # Journey timeline
├── documents-page.tsx          # Document tracking
├── email-inbox-page.tsx        # Email inbox + AI analysis
├── email-sent-page.tsx         # Sent email history
├── email-composer.tsx          # Email drafting
├── agent-activity-log.tsx      # AI agent feed
├── ai-chat-panel.tsx           # Natural language chat
├── mini-map.tsx                # Leaflet map
├── login-page.tsx              # Persona selection
└── shared.tsx                  # Reusable badges + chips

components/ui/                  # ~50 shadcn/ui primitives

lib/
├── mock-data.ts                # All mock data (shipments, emails, carriers, etc.)
└── utils.ts                    # Utility functions
```

---

## Mock Data

The app runs entirely on client-side mock data — no external APIs required. The dataset includes:

- **7 shipments** across ocean, air, and road with full timelines, multi-source signals, and exception scenarios
- **20+ inbox emails** tagged by category (carrier, customs, weather, compliance, advisory, agent)
- **7 carrier scorecards** with performance metrics
- **20+ agent activity logs** with action reasoning
- **Port congestion data**, lane performance, D&D risk scores, reroute options with AIS coordinates

---

## Demo Scenarios

| Shipment | Mode | Route | Exception |
|----------|------|-------|-----------|
| SHP-10421 | Ocean (COSCO) | Shanghai → Los Angeles | Port congestion at San Pedro Bay |
| SHP-20334 | Air (DHL) | Shenzhen → Chicago | Customs hold at ORD |
| SHP-30188 | Ocean (Maersk) | Mumbai → Rotterdam | Missing AIS signal |
| SHP-40672 | Air (FedEx) | Guangzhou → Detroit | Weather diversion (critical material) |
| SHP-50219 | Ocean (MSC) | Busan → Seattle | Long dwell at transshipment |
| SHP-60441 | Road | Los Angeles → Chicago | Traffic disruption on I-40 |
| SHP-88442 | Air | Pre-shipment | Awaiting departure |

---

## Built By

**[JL Group](https://www.jianlianggroup.com)**
