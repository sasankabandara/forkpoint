# 🔀 Forkpoint

**Describe any scenario. Explore it as a branching timeline of alternate paths.**

Forkpoint is a web app where you describe a decision, event, or turning point — and an AI generates a bidirectional interactive timeline that you can fork into parallel branches on demand.

> *The kind of tool someone opens at 11pm when they can't stop thinking about a decision they made.*

---

## ✨ Features

- **Bidirectional timelines** — causes trace backwards, consequences branch forward
- **Fork anything** — click any node, ask "what if instead…", and a new branch appears below
- **Four node types** — Cause (blue), Pivot (amber), Consequence (green), Branch (dashed, color-coded)
- **Detail panel** — click any node for the full narrative, ripple effects, and probability badges
- **Sensitive content guardrail** — automatic detection with a soft, non-blocking helpline link
- **Demo mode** — try the full experience without API keys

---

## 🖼️ Screenshots

| Timeline Canvas | Detail Panel | Branched Timeline |
|:-:|:-:|:-:|
| Causes → Pivot → Consequences | Slide-in narrative + ripple effects | Fork nodes appear below |

---

## 🏗️ Architecture

```
backend/                    frontend/src/
├── main.py         (FastAPI app)     ├── api.ts              (HTTP calls)
├── config.py       (env vars)        ├── types.ts            (TypeScript types)
├── models.py       (Pydantic v2)     ├── demoData.ts         (static demo)
├── database.py     (Supabase)        ├── stores/timeline.ts  (Pinia state)
├── prompts.py      (Claude prompts)  ├── composables/        (business logic)
├── services.py     (AI + logic)      ├── components/         (7 Vue components)
└── routers.py      (endpoints)       └── pages/              (Landing + Timeline)
```

**Backend**: FastAPI → Services → Claude API + Supabase  
**Frontend**: Vue 3 + Vue Flow → Pinia store → Axios → Backend  
**All state lives in the frontend.** The backend is stateless — it generates content and persists to Supabase.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **Python** 3.11+
- **Anthropic API key** ([get one](https://console.anthropic.com/))
- **Supabase project** ([create one](https://supabase.com/dashboard)) — *optional, app works without it*

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/forkpoint.git
cd forkpoint
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
python main.py
```

The API starts at `http://localhost:8000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app opens at `http://localhost:5173`.

### 4. Try Demo Mode (No API Keys)

Just start the frontend and click **"✦ Try with a demo scenario"** on the landing page.

---

## 🗄️ Supabase Setup

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  input TEXT NOT NULL,
  tree JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID REFERENCES scenarios(id),
  parent_node_id TEXT NOT NULL,
  whatif TEXT NOT NULL,
  branch_color TEXT NOT NULL,
  branch_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase anon/service key |
| `PORT` | Server port (default: `8000`) |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend URL (default: `http://localhost:8000`) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.11+, FastAPI, Anthropic SDK, Supabase, Pydantic v2, SlowAPI |
| **Frontend** | Vue 3, TypeScript, Tailwind CSS v4, Vue Flow, Pinia, Vue Router, Axios |
| **AI** | Claude (Sonnet) |
| **Database** | Supabase (PostgreSQL + JSONB) |

---

## 📡 API Endpoints

| Method | Endpoint | Rate Limit | Description |
|--------|----------|-----------|-------------|
| `POST` | `/api/generate` | 10/hr/IP | Generate full bidirectional timeline |
| `POST` | `/api/fork` | 30/hr/IP | Fork a new branch from any node |
| `GET` | `/api/scenarios/:id` | — | Load a saved scenario |
| `GET` | `/api/scenarios` | — | List saved scenarios |
| `GET` | `/health` | — | Health check |

---

## 🎨 Design Philosophy

- **Vibe**: Calm, considered, slightly philosophical — like a thoughtful journal
- **Aesthetic**: Closer to Notion/Linear than a consumer social app
- **Typography**: Playfair Display (serif headlines) + Inter (body)
- **Theme**: Dark mode, generous whitespace, blue accent
- **Animations**: Subtle — fade-in nodes, dash-draw edges, slide-in panels

---

## 📋 Not in v1

No auth, no public gallery, no export, no mobile layout, no real-time, no payments.

The only loop that matters: **describe → see timeline → click → fork → explore deeper.**

---

## 📄 License

MIT
