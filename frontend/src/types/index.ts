export interface ChannelMetric {
  channel: string;
  spend: number;
  percentage: number;
  predicted_revenue: number;
  average_roas: number;
  marginal_roas: number;
  alpha: number;
  half_saturation_k: number;
  slope_s: number;
}

export interface SimulationResult {
  total_budget: number;
  baseline_revenue: number;
  current_media_revenue: number;
  current_total_revenue: number;
  optimal_media_revenue: number;
  optimal_total_revenue: number;
  dollar_lift: number;
  percentage_lift: number;
  current_channels: Record<string, ChannelMetric>;
  optimal_channels: Record<string, ChannelMetric>;
  source: 'backend-fastapi' | 'client-engine';
}

export interface CurvePoint {
  spend: number;
  revenue: number;
  marginal_return: number;
}

export interface ChannelCurveData {
  channel: string;
  label: string;
  color: string;
  alpha: number;
  K: number;
  S: number;
  beta: number;
  current_spend: number;
  optimal_spend: number;
  points: CurvePoint[];
}

export interface TimeSeriesPoint {
  week_index: number;
  date: string;
  actual_sales: number;
  predicted_sales: number;
  baseline: number;
  tv_contribution: number;
  social_contribution: number;
  search_contribution: number;
}

export interface DecompositionResult {
  series: TimeSeriesPoint[];
  mape: number;
  overall_roas: Record<string, number>;
  fitted_parameters: Record<string, {
    alpha: number;
    K: number;
    S: number;
    beta: number;
  }>;
}
