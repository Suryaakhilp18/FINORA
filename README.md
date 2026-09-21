# FINORA — Think Before You Spend ⚡
> **An AI Financial Decision Intelligence Platform built for the way young Indians earn, spend, borrow, save, and invest.**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)

---

## 💡 The Problem FINORA Solves
Most personal finance apps are **passive rear-view mirrors**: they tell you how broke you are *after* you've already swiped your credit card.

Young Indians entering the workforce (earning ₹25,000 to ₹80,000/month) face predatory dark patterns:
- **Deceptive "No-Cost" EMIs** that sneak in 18% GST on interest, upfront processing fees, and subvention cuts.
- **Micro-impulse purchases** driven by Quick Commerce (Blinkit/Zepto), Flash Sales, and Diderot effects.
- **Invisible Runway Shrinkage**: Committing to an EMI without knowing it delays your emergency fund by 14 months.

**FINORA flips this paradigm into proactive decision intelligence:**
> *"If I make this financial decision right now, what happens to my future finances?"*

---

## ✨ Key Features & AI Innovations

### 1. ⚡ 3-Pillar Clean Workspace
- **Pillar 1: Decision Studio**
  - **5-Scenario Comparative Simulator**: Cash upfront vs 3-Mo EMI vs 6-Mo EMI vs 12-Mo EMI vs Waiting 60 Days.
  - **180-Day Cashflow Runway Forecast**: Interactive month-by-month projection of bank balance trajectory before and after the purchase.
  - **Deal Intelligence & Hidden Cost Watch**: Exposes 18% GST on EMI interest, processing charges, and true effective APR.
  - **🛒 Before You Pay Scanner**: Instant verdict on impulse buys via URL, text, voice, or screenshot.
  - **🛡️ 180-Day Financial Stress Test**: Simulates worst-case life shocks (job loss, medical emergency, sudden rent hike).

- **Pillar 2: My Finances**
  - **4-Dimensional Health Index**: Liquidity, Debt Burden, Savings Rate, and Impulse Risk.
  - **Cashflow Breakdown**: Needs (50%), Wants (30%), Investments (20%) allocation tracker.
  - **Recurring Subscriptions & Silent Leaks**: Flags zombie OTT memberships and recurring micro-debits.

- **Pillar 3: Goal Planner**
  - Milestone visualizer for Emergency Fund, Bike/Car Down Payment, and Travel Goals.
  - Calculates exact delay on life milestones if an impulsive purchase is approved.

---

### 2. 🧠 Next-Gen Behavioral & Cognitive AI
- **🎙️ AI Audio Executive Debrief (Voice Debrief)**:
  - Generates a concise spoken voice debrief using the Web Speech Synthesis API so users can listen to their financial verdict hands-free.
- **🛡️ Behavioral "Regret Shield" & Impulse Risk Meter**:
  - Scores purchases from 0 to 100% on impulse probability.
  - Identifies cognitive spending biases: **Present Bias**, **Diderot Effect**, **Anchoring**, and **Loss Aversion**.
  - Features an interactive **48-Hour Cooling-Off Lock** to break impulsive dopamine loops.
- **💬 Counterfactual Decision Negotiation Studio**:
  - Live conversational parameter negotiation: *"What if I split 50% with my roommate?"*, *"What if I cut dining out by ₹3,000?"*, *"What if I wait for Diwali bonus?"*.
- **📸 Multimodal Screenshot & Bank Statement Ingestion**:
  - Drop a shopping cart screenshot or bank statement PDF to automatically extract line items and price tags.
- **🔒 Deterministic Math Guardrail Architecture**:
  - **Zero LLM Math Hallucinations**: All calculations (EMI, GST, balance trajectory, runway months) are calculated via strict, deterministic Python financial arithmetic in `calculator.py`. Gemini AI provides reasoning, tone, behavioral nudges, and qualitative explanations.

---

## 🏗️ Architecture

```
FINORA/
├── backend/                  # Python FastAPI Backend
│   ├── app/
│   │   ├── ai/               # Gemini AI Service & Cognitive Prompting
│   │   ├── api/              # REST Endpoints (Simulator, Copilot, Audit, Ingest)
│   │   ├── database/         # Data Models & In-Memory Store
│   │   └── financial_engine/ # Deterministic Python Math (EMIs, Runways, GST)
│   ├── .env.example          # Environment variables template
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # React 19 + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/       # Studio, What-If Simulator, Audio Debrief, Modals
│   │   ├── pages/            # 3 Pillars (Studio, Finances, Goals, Landing, Login)
│   │   ├── services/         # Typed API client
│   │   └── types/            # TypeScript interfaces
│   ├── tailwind.config.js    # Tailwind styling tokens (Dark & Light solid surfaces)
│   └── package.json          # Node dependencies
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18+
- **Python**: v3.10+
- **Google Gemini API Key**: [Get one here](https://aistudio.google.com/)

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env from example
cp .env.example .env
# Edit .env and paste your GEMINI_API_KEY

# Run server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Backend will be live at: `http://localhost:8000`  
Swagger docs available at: `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend will be live at: `http://localhost:5173`

---

## ⚡ 1-Click Judge Demo Mode
To immediately test FINORA with realistic data:
1. Open `http://localhost:5173/login`.
2. Click **"⚡ Quick Demo (Aarav Sharma)"**.
3. Loads a realistic 21-year-old software engineer in Bengaluru (Monthly income ₹35,000, Bank Balance ₹82,000, Rent ₹12,000).
4. Run sample simulations: *"Can I buy a Sony WH-1000XM5 headphone for ₹29,990 on a 6-month EMI?"* or *"Can I afford an iPhone 16 for ₹79,900?"*.
5. Listen to the **Audio Executive Debrief**, inspect the **Behavioral Bias Warning**, and test the **Counterfactual Negotiation Studio**!

---

## 👥 Hackathon Team
- Built with ❤️ for young Indian professionals.
- **License**: MIT
