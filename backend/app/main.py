"""
=============================================================================
FastAPI Application — Production Media Mix Model (MMM) Backend
=============================================================================
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any

from app.schemas import (
    HealthResponse,
    SimulationRequest,
    SimulationResponse,
    OptimizationRequest,
    OptimizationResponse,
    CurvesResponse,
    DecompositionResponse,
    CustomFitRequest,
    CustomFitResponse
)
from app.engine import engine_instance

app = FastAPI(
    title="MediaMixModel Econometric API",
    description="Production-grade Media Mix Modeling (MMM) backend exposing econometric simulation, SLSQP budget optimization, Hill saturation curves, and time-series decomposition.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for React frontend (Vite dev server, production builds, local files)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["General"])
def root() -> Dict[str, Any]:
    return {
        "service": "MediaMixModel API",
        "author": "Partha Mishra",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": [
            "/api/health",
            "/api/simulate",
            "/api/optimize",
            "/api/curves",
            "/api/decomposition",
            "/api/channels"
        ]
    }

@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
def get_health() -> HealthResponse:
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        engine="Production Media Mix Model (Geometric Adstock + Hill Saturation + SLSQP)"
    )

@app.get("/api/channels", tags=["Configuration"])
def get_channels() -> Dict[str, Any]:
    """Returns the calibrated channel priors and model parameters."""
    return {
        "baseline": engine_instance.baseline,
        "channels": engine_instance.channels
    }

@app.post("/api/simulate", response_model=SimulationResponse, tags=["Econometric Engine"])
def simulate_marketing_mix(req: SimulationRequest) -> SimulationResponse:
    """
    Simulates marketing mix performance comparing current allocations
    against an optimal allocation determined via SLSQP non-linear programming.
    """
    try:
        result = engine_instance.simulate(
            total_budget=req.total_budget,
            tv_pct=req.tv_pct,
            social_pct=req.social_pct,
            search_pct=req.search_pct
        )
        return SimulationResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")

@app.post("/api/optimize", response_model=OptimizationResponse, tags=["Optimization"])
def optimize_budget(req: OptimizationRequest) -> OptimizationResponse:
    """
    Runs SLSQP optimization for a given total budget and channel bounds.
    """
    try:
        optimal_spends = engine_instance.optimize_allocation(
            total_budget=req.total_budget,
            min_pct=req.min_pct,
            max_pct=req.max_pct
        )
        total_sp = sum(optimal_spends.values())
        percentages = {k: round((sp / total_sp) * 100.0, 2) for k, sp in optimal_spends.items()}
        marginal_roas = {
            k: round(engine_instance.single_channel_marginal_roas(k, sp), 3)
            for k, sp in optimal_spends.items()
        }
        media_gain = sum(engine_instance.single_channel_revenue(k, sp) for k, sp in optimal_spends.items())

        return OptimizationResponse(
            total_budget=round(req.total_budget, 2),
            optimal_allocation={k: round(v, 2) for k, v in optimal_spends.items()},
            optimal_percentages=percentages,
            expected_media_gain=round(media_gain, 2),
            marginal_roas=marginal_roas
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")

@app.get("/api/curves", response_model=CurvesResponse, tags=["Response Curves"])
def get_channel_curves() -> CurvesResponse:
    """
    Returns coordinate points for Hill saturation curves and marginal return curves.
    """
    try:
        curves_data = engine_instance.get_curves(max_spend=80000.0, steps=80)
        return CurvesResponse(**curves_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Curve generation failed: {str(e)}")

@app.get("/api/decomposition", response_model=DecompositionResponse, tags=["Attribution Decomposition"])
def get_time_series_decomposition() -> DecompositionResponse:
    """
    Returns 52-week econometric attribution decomposition (Baseline, TV, Social, Search, Actuals).
    """
    try:
        decomp_data = engine_instance.generate_decomposition(n_weeks=52)
        return DecompositionResponse(**decomp_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Decomposition failed: {str(e)}")

@app.post("/api/fit-custom", response_model=CustomFitResponse, tags=["Custom Model Estimation"])
def fit_custom_dataset(req: CustomFitRequest) -> CustomFitResponse:
    """
    Fits Adstock carryover and Hill saturation parameters to user-ingested CSV time series.
    """
    try:
        result = engine_instance.fit_custom_data(
            channel_spends=req.channel_spends,
            target_revenue=req.target_revenue
        )
        return CustomFitResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Custom fit failed: {str(e)}")

