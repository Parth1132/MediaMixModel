# MediaMixModel — Python Econometric Backend

Production-grade Media Mix Modeling (MMM) backend API powered by **FastAPI**, **NumPy**, and **SciPy**.

---

## 🔬 Econometric Core Capabilities

1. **Geometric Memory Adstock**:
   $$A_t = \sum_{l=0}^{L_{max}-1} w_l X_{t-l}, \quad w_l = \frac{\alpha^l}{\sum_{k=0}^{L_{max}-1} \alpha^k}$$
   Models brand impression retention, lingering memory, and multi-week carryover.

2. **Hill Saturation & Diminishing Returns**:
   $$S(x) = \frac{x^S}{x^S + K^S}$$
   Non-linear response curves identifying the half-saturation threshold ($K$) where marginal returns decay.

3. **Analytical Marginal ROAS**:
   $$\frac{dR}{dx} = \beta \cdot \frac{S \cdot K^S \cdot x^{S-1}}{(x^S + K^S)^2}$$
   Computes exact first derivative for real-time marginal efficiency auditing.

4. **SLSQP Constrained Optimization**:
   Sequential Least Squares Programming solver finding the global revenue-maximizing budget allocation subject to channel upper/lower bounds and total spend constraints.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 2. Start the FastAPI Server
```bash
python backend/run.py
```
Server runs at `http://localhost:8000`.  
Interactive Swagger docs: `http://localhost:8000/docs`  
ReDoc specification: `http://localhost:8000/redoc`

### 3. Run Automated Tests
```bash
python -m unittest backend/tests/test_engine_api.py
```

---

## 📡 API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & engine status |
| `GET` | `/api/channels` | Calibrated channel parameters & priors |
| `POST` | `/api/simulate` | Simulates marketing mix vs SLSQP optimal allocation |
| `POST` | `/api/optimize` | Solves constrained budget reallocation |
| `GET` | `/api/curves` | Coordinates for saturation and marginal return curves |
| `GET` | `/api/decomposition` | 52-week time-series attribution decomposition |
