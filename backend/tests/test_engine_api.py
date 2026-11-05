"""
Unit tests for Media Mix Model Backend & Econometric Engine
"""

import os
import sys
import unittest
import numpy as np

# Ensure backend root is in sys.path
backend_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

from app.engine import (
    geometric_adstock,
    hill_saturation,
    hill_marginal_return,
    engine_instance
)
from app.main import app
from fastapi.testclient import TestClient

class TestMMMEngine(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_adstock_math(self):
        spend = np.array([1000.0, 0.0, 0.0, 0.0])
        adstocked = geometric_adstock(spend, alpha=0.5, l_max=4)
        self.assertEqual(len(adstocked), 4)
        # First period is largest, followed by geometric decay
        self.assertGreater(adstocked[0], adstocked[1])
        self.assertGreater(adstocked[1], adstocked[2])

    def test_hill_saturation(self):
        K = 10000.0
        S = 1.0
        # At spend = K with S=1, saturation must equal exactly 0.5 (50%)
        sat_k = hill_saturation(np.array([K]), K, S)[0]
        self.assertAlmostEqual(sat_k, 0.5, places=4)

        # As spend increases, saturation approaches 1.0
        sat_large = hill_saturation(np.array([1000000.0]), K, S)[0]
        self.assertGreater(sat_large, 0.98)

    def test_marginal_return(self):
        K = 18000.0
        S = 1.3
        beta = 45000.0
        m1 = hill_marginal_return(10000.0, K, S, beta)
        m2 = hill_marginal_return(50000.0, K, S, beta)
        # Diminishing marginal return: mROAS at higher spend is lower
        self.assertGreater(m1, m2)

    def test_api_health(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["version"], "1.0.0")

    def test_api_simulate(self):
        payload = {
            "total_budget": 80000.0,
            "tv_pct": 55.0,
            "social_pct": 30.0,
            "search_pct": 15.0
        }
        res = self.client.post("/api/simulate", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total_budget"], 80000.0)
        self.assertIn("dollar_lift", data)
        self.assertIn("percentage_lift", data)
        self.assertIn("current_channels", data)
        self.assertIn("optimal_channels", data)
        self.assertGreaterEqual(data["dollar_lift"], 0.0)

    def test_api_optimize(self):
        payload = {
            "total_budget": 90000.0,
            "min_pct": 0.15,
            "max_pct": 0.55
        }
        res = self.client.post("/api/optimize", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total_budget"], 90000.0)
        alloc = data["optimal_allocation"]
        total_allocated = sum(alloc.values())
        self.assertAlmostEqual(total_allocated, 90000.0, delta=1.0)

    def test_api_curves(self):
        res = self.client.get("/api/curves")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("channels", data)
        self.assertIn("tv", data["channels"])
        self.assertIn("social", data["channels"])
        self.assertIn("search", data["channels"])
        self.assertGreater(len(data["channels"]["tv"]["points"]), 10)

    def test_api_decomposition(self):
        res = self.client.get("/api/decomposition")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(len(data["series"]), 52)
        self.assertIn("mape", data)
        self.assertIn("overall_roas", data)

    def test_api_fit_custom(self):
        payload = {
            "channel_spends": {
                "meta": [10000.0 + i * 200 for i in range(12)],
                "google": [6000.0 + i * 150 for i in range(12)]
            },
            "target_revenue": [80000.0 + i * 1000 for i in range(12)]
        }
        res = self.client.post("/api/fit-custom", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["weeks_fitted"], 12)
        self.assertIn("fitted_parameters", data)
        self.assertIn("roas_by_channel", data)


if __name__ == "__main__":
    unittest.main()
