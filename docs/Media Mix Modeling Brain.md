---
type: brain
role: econometric_attribution_and_budget_optimization
domain: media_mix_modeling
version: 2.0.0
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
  - data-ingestion
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
    subgraph Data_Convergence [Universal Multi-Platform Ingestion]
        direction TB
        Meta["Meta Ads CSV<br/>(Amount Spent, Reporting Starts)"]
        Google["Google Ads CSV<br/>(Cost, Day, Impr.)"]
        TikTok["TikTok Ads CSV<br/>(Total Cost, Stat Date)"]
        Amazon["Amazon Ads CSV<br/>(Spend, Date)"]
        Shopify["Shopify / Stripe CSV<br/>(Total Net Sales, Orders)"]
    end

    subgraph Preprocessing_Pipeline [Harmonization & Fingerprinting]
        SigDetect["Header Fingerprint Matcher<br/>(Zero-Config Column Detection)"]
        Clean["Sanitization<br/>(Strip Currency $, €, ₹, Commas)"]
        Temporal["Monday-to-Sunday Aggregation<br/>(Filter Daily Random Noise)"]
        MatrixJoin["Timeline Harmonization<br/>(Align on Overlapping Weeks)"]
    end

    subgraph Econometric_Engine [Media Mix Modeling Engine (Python + SciPy)]
        Base["Baseline Isolation<br/>Trend + Seasonality + Pricing"]
        Adstock["Geometric Memory Adstock<br/>(Lag Decay Factor α)"]
        Hill["Hill Saturation Function<br/>(Half-Sat K, Slope S)"]
        NNLS["Non-Negative Least Squares<br/>(Enforce β_media ≥ 0)"]
        SLSQP["SLSQP Budget Optimizer<br/>(Marginal ROAS Equalization)"]
    end

    subgraph Decision_Brains [Peer Strategic Brains]
        Track["[[Tracking Brain]]<br/>Attribution Reconciliation"]
        Budget["[[Budget Brain]]<br/>Spend What-Ifs & Scenarios"]
        Audience["[[Audience Brain]]<br/>Saturation & Frequency Capping"]
    end

    subgraph SSOT [Single Source of Truth]
        Heart["[[00_THE_HEART]]<br/>Executive Blended ROAS & Pipeline"]
    end

    Meta & Google & TikTok & Amazon & Shopify --> SigDetect --> Clean --> Temporal --> MatrixJoin
    MatrixJoin --> Base & Adstock
    Adstock --> Hill --> NNLS --> SLSQP
    Base --> NNLS
    SLSQP --> Budget
    NNLS --> Track
    Budget & Track --> Heart
```

---

## 2. Universal Data Ingestion & Harmonization (v2.0)

### 2.1 Header Fingerprint Signatures
Marketing export files vary widely across advertising platforms. The v2.0 ingestion engine uses automated signature detection to extract the required date and spend vectors without requiring manual reformatting:

| Ad Platform | Target Spend Column Matchers | Date / Time Column Matchers | Additional Identifiers |
|---|---|---|---|
| **Meta Ads** | `Amount Spent (USD)`, `Amount spent`, `Spend` | `Reporting Starts`, `Date`, `Day` | `Ad Set Name`, `Campaign Name` |
| **Google Ads** | `Cost`, `Spend` | `Day`, `Date` | `Impr.`, `Customer ID`, `Campaign state` |
| **TikTok Ads** | `Total Cost`, `Cost`, `Spend` | `Stat Date`, `Date` | `Campaign Name (ID)`, `Tiktok` |
| **Amazon Ads** | `Spend`, `Cost` | `Date`, `Day` | `7 Day Total Sales`, `Amazon` |
| **LinkedIn Ads** | `Total Spent`, `Spent`, `Cost` | `Start Date (UTC)`, `Date` | `Campaign Name`, `LinkedIn` |
| **Shopify / Stripe** | `Total Sales`, `Net Sales`, `Gross Sales` | `Day`, `Date`, `Month` | `Orders`, `Refunds` |
| **Generic Ad Network** | `*spend*`, `*cost*`, `*budget*` | `*date*`, `*day*`, `*week*` | Fallback signature matcher |

### 2.2 Currency & Punctuation Sanitization
All monetary columns are normalized through regular expression filtering:
$$\text{CleanValue}(x) = \text{parseFloat}\left(\text{RegexReplace}(x, `[\$,€,₹,£,\s]`, ``)\right)$$

### 2.3 Temporal Aggregation (Daily to Monday-Weekly)
Daily marketing data suffers from high-frequency weekly noise (e.g., Saturday dips, Wednesday spikes). The ingestion pipeline aggregates daily records into Monday-indexed weekly buckets:

$$\text{MondayWeek}(D) = D - \left( \text{DayOfWeek}(D) - 1 \right) \quad \text{days}$$

$$X_{w, \text{channel}} = \sum_{d \in w} X_{d, \text{channel}}$$

---

## 3. Mathematical & Econometric Formulations

### 3.1 Geometric Memory Carryover (Adstock)
Marketing impressions do not dissipate immediately. Consumer exposure accumulates psychological memory that decays over subsequent time periods $t$:

$$A_t = \sum_{l=0}^{L_{\max}-1} w_l X_{t-l}, \quad \text{where } w_l = \frac{\alpha^l}{\sum_{k=0}^{L_{\max}-1} \alpha^k}$$

- $\alpha \in [0, 1)$: Memory retention coefficient (e.g., Linear/CTV $\alpha = 0.65$, Search $\alpha = 0.12$).
- $L_{\max}$: Maximum carryover window in weeks (default: 8 weeks for brand channels, 2 weeks for capture channels).

### 3.2 Hill Saturation & Diminishing Marginal Returns
Channel yield conforms to sigmoidal or concave diminishing returns as audience frequency saturates:

$$S(x) = \frac{x^S}{x^S + K^S}$$

- $K > 0$: **Half-saturation constant** — the spend level generating exactly 50% of maximum potential media lift.
- $S > 0$: **Hill slope / shape parameter** ($S > 1$ represents S-shaped sigmoidal pickup; $S \le 1$ represents immediate concave decay).

### 3.3 Exact Marginal Return Derivative ($mROAS$)
To identify the exact dollar return for the next incremental dollar spent on channel $i$:

$$\text{Revenue}_i(x) = \beta_i \cdot \frac{x^{S_i}}{x^{S_i} + K_i^{S_i}}$$

$$\frac{d\text{Revenue}_i}{dx} = \beta_i \cdot \frac{S_i \cdot K_i^{S_i} \cdot x^{S_i - 1}}{\left(x^{S_i} + K_i^{S_i}\right)^2}$$

### 3.4 Non-Negative Least Squares (NNLS) Regularization
Standard OLS regression frequently assigns uninterpretable negative coefficients to correlated advertising media. We constrain estimation to non-negative parameter space:

$$\min_{\beta} \| Y - X \beta \|_2^2 \quad \text{subject to } \beta_{\text{media}} \ge 0$$

### 3.5 SLSQP Constrained Budget Optimization
To maximize total revenue across $M$ channels subject to a fixed total marketing budget $B$ and organizational channel boundaries $[L_i, U_i]$:

$$\max_{\{x_1, \dots, x_M\}} \sum_{i=1}^M \beta_i \cdot \frac{x_i^{S_i}}{x_i^{S_i} + K_i^{S_i}}$$

$$\text{subject to} \quad \sum_{i=1}^M x_i = B, \quad L_i \le x_i \le U_i \quad \forall i \in \{1, \dots, M\}$$

Optimal equilibrium occurs when marginal returns across all uncapped channels are equalized:

$$\frac{d\text{Revenue}_1}{dx_1} = \frac{d\text{Revenue}_2}{dx_2} = \dots = \frac{d\text{Revenue}_M}{dx_M} = \lambda$$

---

## 4. Software Architecture & API Interface

The production system is deployed as a dual-tier full-stack application:
- **Backend**: Python 3.15 + **FastAPI** + **NumPy** + **SciPy** (`backend/`)
- **Frontend**: **React 19** + **TypeScript** + **Vite** (`frontend/`)

### 4.1 Endpoints Summary

| Method | Path | Functionality |
|---|---|---|
| `GET` | `/api/health` | Engine operational status & versioning. |
| `GET` | `/api/channels` | Calibrated prior parameters ($K$, $S$, $\beta$, $\alpha$). |
| `POST` | `/api/simulate` | Real-time marketing mix simulation vs SLSQP optimum. |
| `POST` | `/api/optimize` | Multi-channel budget solver with spend constraints. |
| `GET` | `/api/curves` | Coordinate arrays for Hill response and marginal return curves. |
| `GET` | `/api/decomposition` | 52-week time-series decomposition (Baseline vs Media Lift). |
| `POST` | `/api/fit-custom` | Calibrates Adstock & Hill parameters to user-uploaded CSV matrices. |

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

- **v2.0.0 (2026-11-05)**: Added Universal Data Convergence Nexus with animated platform gravitational orbit, multi-CSV header fingerprinting, 1-click brand dataset, and custom matrix fitting endpoint `/api/fit-custom`.
- **v1.0.0 (2026-11-05)**: Initial full-stack release with React frontend, Python FastAPI backend, and Obsidian MMM Brain specification.
