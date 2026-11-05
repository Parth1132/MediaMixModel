"""
=============================================================================
Pydantic Schemas for Media Mix Model API
=============================================================================
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field

class HealthResponse(BaseModel):
    status: str = Field(..., description="Service health status")
    version: str = Field(..., description="API version")
    engine: str = Field(..., description="Econometric engine identifier")

class ChannelMetric(BaseModel):
    channel: str
    spend: float
    percentage: float
    predicted_revenue: float
    average_roas: float
    marginal_roas: float
    alpha: float
    half_saturation_k: float
    slope_s: float

class SimulationRequest(BaseModel):
    total_budget: float = Field(default=80000.0, ge=1000.0, le=1000000.0, description="Total marketing budget in USD")
    tv_pct: float = Field(default=55.0, ge=5.0, le=90.0, description="Television spend percentage")
    social_pct: float = Field(default=30.0, ge=5.0, le=90.0, description="Social media spend percentage")
    search_pct: Optional[float] = Field(default=None, ge=0.0, le=90.0, description="Paid search spend percentage (auto-calculated if omitted)")

class SimulationResponse(BaseModel):
    total_budget: float
    baseline_revenue: float
    current_media_revenue: float
    current_total_revenue: float
    optimal_media_revenue: float
    optimal_total_revenue: float
    dollar_lift: float
    percentage_lift: float
    current_channels: Dict[str, ChannelMetric]
    optimal_channels: Dict[str, ChannelMetric]

class OptimizationRequest(BaseModel):
    total_budget: float = Field(default=80000.0, ge=1000.0, le=1000000.0, description="Total budget to optimize")
    min_pct: float = Field(default=0.10, ge=0.0, le=0.40, description="Minimum allocation percentage per channel")
    max_pct: float = Field(default=0.60, ge=0.30, le=1.0, description="Maximum allocation percentage per channel")

class OptimizationResponse(BaseModel):
    total_budget: float
    optimal_allocation: Dict[str, float]
    optimal_percentages: Dict[str, float]
    expected_media_gain: float
    marginal_roas: Dict[str, float]

class CurvePoint(BaseModel):
    spend: float
    revenue: float
    marginal_return: float

class ChannelCurve(BaseModel):
    channel: str
    label: str
    color: str
    alpha: float
    K: float
    S: float
    beta: float
    current_spend: float
    optimal_spend: float
    points: List[CurvePoint]

class CurvesResponse(BaseModel):
    channels: Dict[str, ChannelCurve]

class TimeSeriesPoint(BaseModel):
    week_index: int
    date: str
    actual_sales: float
    predicted_sales: float
    baseline: float
    tv_contribution: float
    social_contribution: float
    search_contribution: float

class DecompositionResponse(BaseModel):
    series: List[TimeSeriesPoint]
    mape: float
    overall_roas: Dict[str, float]
    fitted_parameters: Dict[str, Dict[str, float]]

class CustomFitRequest(BaseModel):
    channel_spends: Dict[str, List[float]] = Field(..., description="Map of channel name to weekly spend array")
    target_revenue: List[float] = Field(..., description="Weekly target revenue array")

class CustomFitResponse(BaseModel):
    status: str
    weeks_fitted: int
    mape: float
    r_squared: float
    baseline_level: float
    fitted_parameters: Dict[str, Dict[str, float]]
    roas_by_channel: Dict[str, float]

