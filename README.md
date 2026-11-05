# MediaMixModel — Independent Econometric Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.15-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![CI Pipeline](https://github.com/Parth1132/MediaMixModel/actions/workflows/ci.yml/badge.svg)](https://github.com/Parth1132/MediaMixModel/actions)
[![Live Simulator](https://img.shields.io/badge/Live_Simulator-GitHub_Pages-10B981?logo=github-pages&logoColor=white)](https://parth1132.github.io/MediaMixModel/)

Industry-grade Media Mix Modeling (MMM) that operates outside walled gardens and data silos to measure true causal incrementality, model adstock memory decay, and optimize cross-channel budget allocation via non-linear programming.

---

## 🏛️ System Architecture

```
MediaMixModel/
├── backend/                  # Python 3.15 + FastAPI Econometric Core
│   ├── app/
│   │   ├── main.py           # REST API routes & CORS middleware
│   │   ├── engine.py         # Production Econometric Engine (Adstock, Hill, SLSQP)
│   │   └── schemas.py        # Strongly typed Pydantic models
│   ├── tests/
│   │   └── test_engine_api.py# Automated unit tests
│   ├── requirements.txt      # Python dependencies
│   └── run.py                # Server runner script
│
├── frontend/                 # Modern React 19 + TypeScript + Vite
│   ├── src/
│   │   ├── components/       # UI components (Simulator, Curves, Decomposition)
│   │   ├── services/         # Dual-mode API client & client-side math fallback
│   │   └── types/            # TypeScript definitions
│   └── dist/                 # Production web bundle
│
├── obsidian/                 # Software-grade Obsidian Vault specifications
│   └── Media Mix Modeling Brain.md
│
├── docs/                     # Static distribution for GitHub Pages deployment
│   ├── index.html            # Compiled React SPA
│   ├── assets/               # Bundled JavaScript & CSS
│   └── The_Definitive_Guide_to_Media_Mix_Modeling.pdf
│
└── mmm_engine.py             # Standalone Python econometric reference
```

---

## 🌪️ The Measurement Dilemma
Modern digital marketing attribution is fundamentally broken:
1. **The Walled Garden Attribution Trap**: Ad networks measure performance in closed silos, claiming credit for identical conversions. Summed dashboard revenues frequently exceed 200–300% of actual top-line bank revenue.
2. **Signal Deprecation & Cookie Blindness**: Global privacy shifts (GDPR, CCPA) and mobile tracking prevention (Apple ATT, Safari ITP) have broken deterministic click-tracking across devices.
3. **Blind Over-Saturation**: Spending blindly without understanding the half-saturation threshold ($K$) burns capital on flat marginal return curves ($mROAS < \$1.00$).
4. **Last-Click Short-Termism**: Rewarding only the final touchpoint starves upper-funnel and brand-building channels, causing long-term baseline customer decay.

---

## 💡 Econometric & Mathematical Foundations
Media Mix Modeling (MMM) operates independently from user-level tracking by analyzing aggregated time-series econometrics:
- **Organic Baseline Demand**: Separates natural brand momentum and seasonality from paid media lift.
- **Geometric Memory Adstock**:
  $$A_t = \sum_{l=0}^{L_{\max}-1} w_l X_{t-l}, \quad w_l = \frac{\alpha^l}{\sum_{k=0}^{L_{\max}-1} \alpha^k}$$
- **Hill Saturation & Diminishing Marginal Returns**:
  $$S(x) = \frac{x^S}{x^S + K^S}, \quad \frac{dR}{dx} = \beta \cdot \frac{S \cdot K^S \cdot x^{S-1}}{(x^S + K^S)^2}$$
- **Non-Negative Least Squares (NNLS)**: Guarantees $\beta_{\text{media}} \ge 0$.
- **SLSQP Constrained Optimization**: Maximizes multi-channel revenue under strict total budget constraints.

---

## 💫 Universal Data Convergence Nexus (v2.0)
Connect any marketing platform without API review friction:
- **Animated Convergence**: 10 floating platform icons (Meta, Google, TikTok, Amazon, YouTube, LinkedIn, Apple Search, Pinterest, Shopify, Stripe) gravitate into an orbital ring surrounding a unified dropzone.
- **Zero-Config Header Fingerprinting**: Auto-detects column names (`Amount Spent`, `Cost`, `Day`, `Total Sales`, `Orders`).
- **Currency & Punctuation Sanitization**: Automatically strips symbols (`$`, `€`, `₹`, `£`, commas).
- **Monday-to-Sunday Aggregation**: Smooths out high-frequency daily noise into clean 52-to-104 week econometric series.
- **⚡ 1-Click Demo Brand Dataset**: Immediate exploration with 2 years of multi-channel e-commerce data.

---

## 🚀 Getting Started

### 1. Python Backend (FastAPI)
```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run automated tests
python -m unittest backend/tests/test_engine_api.py

# Start the FastAPI server on port 8000
python backend/run.py
```
Interactive API documentation: `http://localhost:8000/docs`

### 2. React Frontend (Vite)
```bash
cd frontend

# Install dependencies
npm install

# Start local development server
npm run dev

# Build and sync to root & docs/ for GitHub Pages
npm run build:deploy
```

---

## 📓 Obsidian Vault Integration

The repository includes a production-grade markdown specification formatted according to the best software documentation practices:
- **Location**: `obsidian/Media Mix Modeling Brain.md`
- **Vault Location**: `C:\Users\HP\Documents\Obsidian Vault\Brains\Media Mix Modeling Brain.md`
- **Connected Vault Nodes**:
  - `[[00_THE_HEART]]` (Single Source of Truth)
  - `[[Budget Brain]]` (SLSQP spend what-ifs)
  - `[[Tracking Brain]]` (Incrementality reconciliation)
  - `[[Meta Ads Channel]]`, `[[Google Ads Channel]]`, `[[Apple Search Ads Channel]]`, `[[Reddit Ads Channel]]`

---

## 🌐 Live Interactive Experience
- **Live Deployment**: [https://parth1132.github.io/MediaMixModel/](https://parth1132.github.io/MediaMixModel/)
- **Local Bundle**: Open `index.html` or `docs/index.html` in any browser.

---

## 👤 Author
Created by **Partha Mishra**  
LinkedIn: [linkedin.com/in/parthamishra](https://www.linkedin.com/in/parthamishra)
