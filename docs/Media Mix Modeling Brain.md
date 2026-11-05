---
type: brain
role: econometric_attribution_and_budget_optimization
domain: media_mix_modeling
version: 1.0.0
status: active
author: Parth Mishra
created: 2026-11-04
updated: 2026-11-05
repo: https://github.com/Parth1132/MediaMixModel
aliases:
  - MMM
  - Media Mix Model
  - Media Mix Modeling Brain
  - Econometric Intelligence Engine
tags:
  - brain
  - mmm
  - econometrics
  - attribution
  - adstock
  - hill-saturation
  - budget-optimization
  - causal-inference
  - roas
upstream_sources:
  - "[[CRM Data]]"
  - "[[GA4 Data]]"
  - "[[AppsFlyer Data]]"
  - "[[Branch Data]]"
connected_channels:
  - "[[Meta Ads Channel]]"
  - "[[Google Ads Channel]]"
  - "[[Apple Search Ads Channel]]"
  - "[[Reddit Ads Channel]]"
peer_brains:
  - "[[Budget Brain]]"
  - "[[Tracking Brain]]"
  - "[[Audience Brain]]"
destination:
  - "[[00_THE_HEART]]"
---

# Media Mix Modeling (MMM) Brain

The **Media Mix Modeling (MMM) Brain** is the independent econometric intelligence layer of the growth architecture. It operates outside walled gardens, user-level cookies, and mobile ad IDs to isolate true causal marketing incrementality, quantify adstock memory carryover, estimate non-linear diminishing returns, and solve cross-channel capital allocation via non-linear constrained optimization.

---

## 1. System Role & Topology

```mermaid
flowchart TD
    subgraph Data_Sources [Aggregated Upstream Ingestion]
        CRM["[[CRM Data]]<br/>Real Net Revenue & Orders"]
        GA4["[[GA4 Data]]<br/>Session & Web Traffic"]
        AF["[[AppsFlyer Data]]<br/>MMP App Conversions"]
        BR["[[Branch Data]]<br/>Deep Link Touchpoints"]
    end

    subgraph Econometric_Engine [Media Mix Modeling Engine (Python + SciPy)]
        Base["Baseline Isolation<br/>Trend + Seasonality + Pricing"]
        Adstock["Geometric Memory Adstock<br/>(Lag Decay Factor α)"]
        Hill["Hill Saturation Function<br/>(Half-Sat K, Slope S)"]
        NNLS["Non-Negative Least Squares<br/>(Enforce β_media ≥ 0)"]
        SLSQP["SLSQP Budget Optimizer<br/>(Marginal ROAS Equalization)"]
    end

    subgraph Channels [Acquisition Channels]
        Meta["[[Meta Ads Channel]]"]
        Google["[[Google Ads Channel]]"]
        Apple["[[Apple Search Ads Channel]]"]
        Reddit["[[Reddit Ads Channel]]"]
    end

    subgraph Decision_Brains [Peer Strategic Brains]
        Track["[[Tracking Brain]]<br/>Attribution Reconciliation"]
        Budget["[[Budget Brain]]<br/>Spend What-Ifs & Scenarios"]
        Audience["[[Audience Brain]]<br/>Saturation & Frequency Capping"]
    end

    subgraph SSOT [Single Source of Truth]
        Heart["[[00_THE_HEART]]<br/>Executive Blended ROAS & Pipeline"]
    end

    CRM & GA4 & AF & BR --> Base
    Channels --> Adstock --> Hill --> NNLS --> SLSQP
    Base --> NNLS
    SLSQP --> Budget
    NNLS --> Track
    Budget & Track --> Heart
```

---

## 2. Mathematical & Econometric Formulations

### 2.1 Geometric Memory Carryover (Adstock)
Marketing impressions do not dissipate immediately. Consumer exposure accumulates psychological memory that decays over subsequent time periods $t$:

$$A_t = \sum_{l=0}^{L_{\max}-1} w_l X_{t-l}, \quad \text{where } w_l = \frac{\alpha^l}{\sum_{k=0}^{L_{\max}-1} \alpha^k}$$

- $\alpha \in [0, 1)$: Memory retention coefficient (e.g., Linear/CTV $\alpha = 0.65$, Search $\alpha = 0.12$).
- $L_{\max}$: Maximum carryover window in weeks (default: 8 weeks for brand channels, 2 weeks for capture channels).

### 2.2 Hill Saturation & Diminishing Marginal Returns
Channel yield conforms to sigmoidal or concave diminishing returns as audience frequency saturates:

$$S(x) = \frac{x^S}{x^S + K^S}$$

- $K > 0$: **Half-saturation constant** — the spend level generating exactly 50% of maximum potential media lift.
- $S > 0$: **Hill slope / shape parameter** ($S > 1$ represents S-shaped sigmoidal pickup; $S \le 1$ represents immediate concave decay).

### 2.3 Exact Marginal Return Derivative ($mROAS$)
To identify the exact dollar return for the next incremental dollar spent on channel $i$:

$$\text{Revenue}_i(x) = \beta_i \cdot \frac{x^{S_i}}{x^{S_i} + K_i^{S_i}}$$

$$\frac{d\text{Revenue}_i}{dx} = \beta_i \cdot \frac{S_i \cdot K_i^{S_i} \cdot x^{S_i - 1}}{\left(x^{S_i} + K_i^{S_i}\right)^2}$$

### 2.4 Non-Negative Least Squares (NNLS) Regularization
Standard OLS regression frequently assigns uninterpretable negative coefficients to correlated advertising media. We constrain estimation to non-negative parameter space:

$$\min_{\beta} \| Y - X \beta \|_2^2 \quad \text{subject to } \beta_{\text{media}} \ge 0$$

### 2.5 SLSQP Constrained Budget Optimization
To maximize total revenue across $M$ channels subject to a fixed total marketing budget $B$ and organizational channel boundaries $[L_i, U_i]$:

$$\max_{\{x_1, \dots, x_M\}} \sum_{i=1}^M \beta_i \cdot \frac{x_i^{S_i}}{x_i^{S_i} + K_i^{S_i}}$$

$$\text{subject to} \quad \sum_{i=1}^M x_i = B, \quad L_i \le x_i \le U_i \quad \forall i \in \{1, \dots, M\}$$

Optimal equilibrium occurs when marginal returns across all uncapped channels are equalized:

$$\frac{d\text{Revenue}_1}{dx_1} = \frac{d\text{Revenue}_2}{dx_2} = \dots = \frac{d\text{Revenue}_M}{dx_M} = \lambda$$

---

## 3. Calibrated Channel Parameters

| Channel | Linked Vault Node | Retention ($\alpha$) | Half-Sat ($K$) | Slope ($S$) | Max Scale ($\beta$) | Historical ROAS | Marginal Threshold |
|---|---|---|---|---|---|---|---|
| **Linear & CTV** | `[[Meta Ads Channel]]` / Offline | 0.65 | \$18,000 / mo | 1.30 | \$45,000 | 1.84x | \$1.00 Floor |
| **Paid Social** | `[[Meta Ads Channel]]` | 0.35 | \$9,000 / mo | 1.00 | \$28,000 | 2.31x | \$1.15 Target |
| **Paid Search** | `[[Google Ads Channel]]` | 0.12 | \$6,000 / mo | 0.90 | \$22,000 | 2.89x | \$1.30 Target |
| **App Store Ads** | `[[Apple Search Ads Channel]]` | 0.18 | \$7,500 / mo | 0.95 | \$19,500 | 2.45x | \$1.20 Target |
| **Community Ads** | `[[Reddit Ads Channel]]` | 0.28 | \$5,000 / mo | 1.05 | \$14,000 | 1.95x | \$1.10 Target |

---

## 4. Software Architecture & API Interface

The production system is deployed as a dual-tier full-stack application:
- **Backend**: Python 3.15 + **FastAPI** + **NumPy** + **SciPy** (`backend/`)
- **Frontend**: **React 19** + **TypeScript** + **Vite** (`frontend/`)

### 4.1 REST API Specification

```
POST /api/simulate
Content-Type: application/json

Request:
{
  "total_budget": 80000.0,
  "tv_pct": 55.0,
  "social_pct": 30.0,
  "search_pct": 15.0
}

Response (200 OK):
{
  "total_budget": 80000.0,
  "baseline_revenue": 100000.0,
  "current_total_revenue": 164200.0,
  "optimal_total_revenue": 182650.0,
  "dollar_lift": 18450.0,
  "percentage_lift": 11.2,
  "current_channels": { ... },
  "optimal_channels": { ... }
}
```

### 4.2 Endpoints Summary

- `GET /api/health` — Engine operational status & versioning.
- `GET /api/channels` — Calibrated prior parameters ($K$, $S$, $\beta$, $\alpha$).
- `POST /api/simulate` — Real-time marketing mix simulation vs SLSQP optimum.
- `POST /api/optimize` — Multi-channel budget solver with spend constraints.
- `GET /api/curves` — Coordinate arrays for Hill response and marginal return curves.
- `GET /api/decomposition` — 52-week time-series decomposition (Baseline vs Media Lift).

---

## 5. Integration with Peer Obsidian Vault Nodes

### 5.1 Feeding `[[00_THE_HEART]]`
- Supplies **Causal Blended ROAS** calibrated against real bank cashflow from `[[CRM Data]]`.
- Strips out organic baseline demand (60–70% of total revenue) so executive dashboards do not over-credit advertising platforms.

### 5.2 Synchronizing with `[[Budget Brain]]`
- Replaces naive historical spend heuristics with mathematical SLSQP solutions.
- Flags channel over-saturation when current spend exceeds $K \times 1.8$.

### 5.3 Reconciling with `[[Tracking Brain]]`
- Quantifies the discrepancy between reported walled garden conversions (`[[Meta Ads Channel]]` + `[[Google Ads Channel]]`) and econometric reality.
- Detects double-counting when summed platform revenue exceeds 130% of total top-line revenue.

---

## 6. Operational Guardrails & Decision Rules

1. **Marginal ROAS Floor ($mROAS \ge \$1.00$)**:
   - If a channel's marginal return drops below \$1.00, immediately halt budget scale, regardless of what in-platform blended ROAS claims.
2. **Channel Reallocation Velocity Limit**:
   - Limit weekly budget shifts between channels to $\le 20\%$ to preserve ad network algorithmic bidding stability and prevent adstock shock.
3. **Model Validation Gates**:
   - Out-of-sample Test MAPE must remain $\le 5.0\%$.
   - Out-of-sample $R^2$ must exceed $0.85$.
4. **Geo-Lift Calibration (Every 90 Days)**:
   - Triangulate econometric model coefficients $\beta_i$ against randomized geo-lift experiment results to prevent omitted-variable drift.

---

## 7. Versioning & Change Log

- **v1.0.0 (2026-11-05)**: Full release of Media Mix Modeling Brain with React frontend and Python FastAPI backend. Integrated with Obsidian Vault nodes (`00_THE_HEART`, `Budget Brain`, `Tracking Brain`). Author: Partha Mishra.
