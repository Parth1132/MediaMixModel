"""
=============================================================================
PRODUCTION MEDIA MIX MODEL (MMM) ENGINE
=============================================================================
Architecture:
- Adstock: Geometric Memory Decay
- Saturation: Hill Sigmoidal / Concave Function (Diminishing Returns)
- Regularization: Non-Negative Least Squares (NNLS) to prevent negative media lift
- Optimizer: SLSQP Multi-Channel Budget Allocator with spend boundaries
=============================================================================
"""

import numpy as np
import pandas as pd
from scipy.optimize import minimize, nnls
from typing import Dict, List, Tuple

def geometric_adstock(x: np.ndarray, alpha: float, l_max: int = 8) -> np.ndarray:
    """
    Computes geometric decay adstock carryover.
    alpha: memory retention factor (0.0 = immediate decay, 1.0 = infinite memory).
    """
    weights = np.array([alpha ** l for l in range(l_max)])
    weights = weights / np.sum(weights)
    adstocked = np.convolve(x, weights, mode='full')[:len(x)]
    return adstocked

def hill_saturation(x: np.ndarray, K: float, S: float) -> np.ndarray:
    """
    Computes Hill saturation (diminishing marginal returns).
    K: half-saturation constant (spend amount that yields 50% saturation).
    S: Hill slope / shape factor.
    """
    x_safe = np.maximum(x, 1e-6)
    return (x_safe ** S) / (x_safe ** S + K ** S)

def generate_realistic_mmm_data(n_weeks: int = 104, seed: int = 42) -> pd.DataFrame:
    """
    Simulates 2 years of realistic weekly multi-channel brand marketing data.
    """
    np.random.seed(seed)
    weeks = pd.date_range(start="2024-01-01", periods=n_weeks, freq="W-MON")

    # Baseline & Annual Seasonality
    trend = np.linspace(20000, 32000, n_weeks)
    seasonality = 8000 * np.sin(2 * np.pi * np.arange(n_weeks) / 52)
    baseline = trend + seasonality

    # Weekly Spends
    tv_spend = np.random.uniform(8000, 30000, n_weeks) * (1 + 0.3 * np.sin(2 * np.pi * np.arange(n_weeks) / 52))
    social_spend = np.random.uniform(4000, 18000, n_weeks)
    search_spend = np.random.uniform(3000, 12000, n_weeks)

    # Transform through true parameters
    tv_trans = hill_saturation(geometric_adstock(tv_spend, alpha=0.65, l_max=8), K=18000, S=1.3)
    social_trans = hill_saturation(geometric_adstock(social_spend, alpha=0.35, l_max=4), K=9000, S=1.0)
    search_trans = hill_saturation(geometric_adstock(search_spend, alpha=0.12, l_max=2), K=6000, S=0.9)

    tv_rev = 45000 * tv_trans
    social_rev = 28000 * social_trans
    search_rev = 22000 * search_trans

    noise = np.random.normal(0, 2500, n_weeks)
    sales = baseline + tv_rev + social_rev + search_rev + noise

    return pd.DataFrame({
        "week": weeks,
        "sales": np.maximum(sales, 0),
        "tv_spend": tv_spend,
        "social_spend": social_spend,
        "search_spend": search_spend,
        "trend_index": np.arange(n_weeks),
        "sin_season": np.sin(2 * np.pi * np.arange(n_weeks) / 52),
        "cos_season": np.cos(2 * np.pi * np.arange(n_weeks) / 52),
    })

class MediaMixModel:
    def __init__(self, media_channels: List[str], control_columns: List[str]):
        self.media_channels = media_channels
        self.control_columns = control_columns
        self.params: Dict[str, Dict[str, float]] = {}
        self.beta_media: np.ndarray = None
        self.beta_controls: np.ndarray = None
        self.intercept: float = 0.0
        self.is_fitted: bool = False

    def _transform(self, spend: np.ndarray, alpha: float, K: float, S: float) -> np.ndarray:
        return hill_saturation(geometric_adstock(spend, alpha), K, S)

    def fit(self, df: pd.DataFrame, target_col: str = "sales"):
        y = df[target_col].values
        n_controls = len(self.control_columns)
        spend_matrix = {col: df[col].values for col in self.media_channels}
        controls_matrix = np.column_stack([np.ones(len(df))] + [df[c].values for c in self.control_columns])

        bounds = []
        x0 = []
        for ch in self.media_channels:
            mean_sp = np.mean(spend_matrix[ch])
            bounds.extend([(0.05, 0.85), (0.2 * mean_sp, 2.5 * mean_sp), (0.6, 2.2)])
            x0.extend([0.35, mean_sp, 1.1])

        def objective(params_vec):
            transformed_media = []
            for i, ch in enumerate(self.media_channels):
                alpha = params_vec[i * 3]
                K = params_vec[i * 3 + 1]
                S = params_vec[i * 3 + 2]
                transformed_media.append(self._transform(spend_matrix[ch], alpha, K, S))

            X_full = np.column_stack([controls_matrix] + transformed_media)
            betas, _ = nnls(X_full, y)
            residuals = y - X_full @ betas
            return np.sum(residuals ** 2)

        res = minimize(objective, x0=x0, bounds=bounds, method="L-BFGS-B")

        transformed_media = []
        for i, ch in enumerate(self.media_channels):
            self.params[ch] = {
                "alpha": res.x[i * 3],
                "K": res.x[i * 3 + 1],
                "S": res.x[i * 3 + 2]
            }
            transformed_media.append(self._transform(spend_matrix[ch], **self.params[ch]))

        X_full = np.column_stack([controls_matrix] + transformed_media)
        final_betas, _ = nnls(X_full, y)

        self.intercept = final_betas[0]
        self.beta_controls = final_betas[1:1 + n_controls]
        self.beta_media = final_betas[1 + n_controls:]
        self.is_fitted = True

    def predict(self, df: pd.DataFrame) -> np.ndarray:
        controls_matrix = np.column_stack([np.ones(len(df))] + [df[c].values for c in self.control_columns])
        transformed_media = [
            self._transform(df[ch].values, **self.params[ch])
            for ch in self.media_channels
        ]
        X_full = np.column_stack([controls_matrix] + transformed_media)
        betas = np.r_[self.intercept, self.beta_controls, self.beta_media]
        return X_full @ betas

    def get_decomposition(self, df: pd.DataFrame) -> pd.DataFrame:
        decomp = pd.DataFrame(index=df.index)
        controls_matrix = np.column_stack([np.ones(len(df))] + [df[c].values for c in self.control_columns])
        decomp["baseline_and_controls"] = controls_matrix @ np.r_[self.intercept, self.beta_controls]
        for i, ch in enumerate(self.media_channels):
            decomp[ch] = self._transform(df[ch].values, **self.params[ch]) * self.beta_media[i]
        decomp["predicted_sales"] = decomp.sum(axis=1)
        return decomp

    def calculate_roas(self, df: pd.DataFrame) -> Dict[str, float]:
        decomp = self.get_decomposition(df)
        return {ch: float(decomp[ch].sum() / df[ch].sum()) for ch in self.media_channels}

    def optimize_budget(self, total_budget: float, min_pct: float = 0.15, max_pct: float = 0.55) -> Dict:
        n_channels = len(self.media_channels)
        def neg_gain(spend_vec):
            gain = sum(self.beta_media[i] * hill_saturation(spend_vec[i], self.params[ch]["K"], self.params[ch]["S"])
                       for i, ch in enumerate(self.media_channels))
            return -gain

        res = minimize(
            neg_gain,
            x0=[total_budget / n_channels] * n_channels,
            bounds=[(total_budget * min_pct, total_budget * max_pct)] * n_channels,
            constraints=[{"type": "eq", "fun": lambda x: sum(x) - total_budget}],
            method="SLSQP"
        )
        return {
            "allocation": {ch: round(float(res.x[i]), 2) for i, ch in enumerate(self.media_channels)},
            "expected_gain": round(float(-res.fun), 2)
        }

if __name__ == "__main__":
    df = generate_realistic_mmm_data()
    train_df = df.iloc[:90]
    test_df = df.iloc[90:]

    mmm = MediaMixModel(
        media_channels=["tv_spend", "social_spend", "search_spend"],
        control_columns=["trend_index", "sin_season", "cos_season"]
    )
    mmm.fit(train_df)

    test_pred = mmm.predict(test_df)
    test_actual = test_df["sales"].values
    mape = np.mean(np.abs((test_actual - test_pred) / test_actual)) * 100
    print(f"Model Fit Complete! Test MAPE: {mape:.2f}%")
    print("ROAS:", mmm.calculate_roas(train_df))
    print("Budget Optimization ($80,000):", mmm.optimize_budget(80000))
