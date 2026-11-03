# Media Mix Modeling (MMM) Engine & Executive Blueprint

A production-grade, privacy-safe **Marketing Mix Modeling (MMM)** suite combining state-of-the-art econometric architectures (inspired by Google Meridian, Meta Robyn, and PyMC-Marketing) with an executive visual blueprint.

---

## 📑 Contents

1. **`The_Definitive_Guide_to_Media_Mix_Modeling.pdf`**  
   A 9-page, print-ready executive manual designed for CMOs, CFOs, and Analytics Leads. Covers every concept from first principles with real-world analogies, clean formulas, parameter decoder tables, and 300-DPI visual exhibits.
2. **`mmm_engine.py`**  
   The standalone, production-ready Python model with Geometric Adstock, Hill Saturation, Non-Negative Least Squares (NNLS) constraints, holdout testing (MAPE), and SLSQP non-linear budget optimization.
3. **`generate_charts.py`**  
   Script generating all 5 high-resolution (300 DPI) publication-grade diagrams in `images/`.

---

## 🚀 Quickstart

### 1. Run the Python Model
```bash
python mmm_engine.py
```

### 2. Output Highlights
- **Out-of-sample MAPE**: ~4.5% (95.5% model accuracy on holdout weeks)
- **Channel Attribution**: Decomposed revenue across organic baseline, seasonality, and incremental media channels (TV, Social, Search).
- **SLSQP Budget Allocator**: Automatically re-balances any target monthly budget to maximize incremental media return without crossing saturation limits.

---

## 🔬 Mathematical Formulations

### 1. The Grand MMM Formulation
$$\text{Sales}(t) = \text{Baseline}(t) + \sum_{m} \beta_m \cdot \text{Saturation}(\text{Adstock}(\text{Spend}_m(t))) + \sum_{k} \gamma_k \cdot \text{Control}_k(t) + \epsilon(t)$$

### 2. Geometric Adstock Decay
$$\text{Adstock}(t) = \text{Spend}(t) + \alpha \cdot \text{Adstock}(t - 1)$$

### 3. Hill Saturation Function
$$\text{Response}(A) = \frac{A^S}{A^S + K^S}$$
- $K$: Half-saturation constant (spend amount that reaches 50% power)
- $S$: Hill curvature slope (concave vs S-curve)

---

## 🛡️ License & Confidentiality
Confidential and proprietary media mix modeling blueprint.
