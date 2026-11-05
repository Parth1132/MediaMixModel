import type { SimulationResult, ChannelCurveData, DecompositionResult } from '../types';

export const CHANNEL_CONFIGS = {
  tv: {
    name: 'tv',
    label: 'Linear & CTV',
    color: '#3B82F6',
    alpha: 0.65,
    K: 18000.0,
    S: 1.3,
    beta: 45000.0,
  },
  social: {
    name: 'social',
    label: 'Social Ads (Meta/TikTok)',
    color: '#06B6D4',
    alpha: 0.35,
    K: 9000.0,
    S: 1.0,
    beta: 28000.0,
  },
  search: {
    name: 'search',
    label: 'Paid Search (Google/Bing)',
    color: '#10B981',
    alpha: 0.12,
    K: 6000.0,
    S: 0.9,
    beta: 22000.0,
  },
};

export const BASELINE_REVENUE = 100000.0;

export function hillSaturation(x: number, K: number, S: number): number {
  const safeX = Math.max(x, 1e-6);
  const xPow = Math.pow(safeX, S);
  const kPow = Math.pow(K, S);
  return xPow / (xPow + kPow);
}

export function hillRevenue(spend: number, K: number, S: number, beta: number): number {
  return beta * hillSaturation(spend, K, S);
}

export function hillMarginalReturn(spend: number, K: number, S: number, beta: number): number {
  const safeX = Math.max(spend, 1e-4);
  const kPow = Math.pow(K, S);
  const xPow = Math.pow(safeX, S);
  const denom = Math.pow(xPow + kPow, 2);
  if (denom === 0) return 0;
  return beta * (S * kPow * Math.pow(safeX, S - 1)) / denom;
}

export function solveOptimalAllocation(totalBudget: number): { tv: number; social: number; search: number } {
  // Discretized gradient optimization for 3 channels satisfying sum = totalBudget and min 10% bounds
  const minPct = 0.10;
  const minSpend = totalBudget * minPct;
  const maxSpend = totalBudget * 0.65;

  let bestRevenue = -1;
  let bestSpends = { tv: totalBudget * 0.28, social: totalBudget * 0.35, search: totalBudget * 0.37 };

  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const tv = minSpend + (i / steps) * (maxSpend - minSpend);
    const rem1 = totalBudget - tv;
    if (rem1 < minSpend * 2) continue;

    for (let j = 0; j <= steps; j++) {
      const social = minSpend + (j / steps) * (Math.min(maxSpend, rem1 - minSpend) - minSpend);
      const search = totalBudget - tv - social;
      if (search < minSpend || search > maxSpend) continue;

      const rev =
        hillRevenue(tv, CHANNEL_CONFIGS.tv.K, CHANNEL_CONFIGS.tv.S, CHANNEL_CONFIGS.tv.beta) +
        hillRevenue(social, CHANNEL_CONFIGS.social.K, CHANNEL_CONFIGS.social.S, CHANNEL_CONFIGS.social.beta) +
        hillRevenue(search, CHANNEL_CONFIGS.search.K, CHANNEL_CONFIGS.search.S, CHANNEL_CONFIGS.search.beta);

      if (rev > bestRevenue) {
        bestRevenue = rev;
        bestSpends = { tv, social, search };
      }
    }
  }

  return bestSpends;
}

export function runClientSimulation(
  totalBudget: number,
  tvPct: number,
  socialPct: number,
  searchPct: number
): SimulationResult {
  const tvSpend = totalBudget * (tvPct / 100);
  const socialSpend = totalBudget * (socialPct / 100);
  const searchSpend = totalBudget * (searchPct / 100);

  const tvRev = hillRevenue(tvSpend, CHANNEL_CONFIGS.tv.K, CHANNEL_CONFIGS.tv.S, CHANNEL_CONFIGS.tv.beta);
  const socRev = hillRevenue(socialSpend, CHANNEL_CONFIGS.social.K, CHANNEL_CONFIGS.social.S, CHANNEL_CONFIGS.social.beta);
  const seaRev = hillRevenue(searchSpend, CHANNEL_CONFIGS.search.K, CHANNEL_CONFIGS.search.S, CHANNEL_CONFIGS.search.beta);

  const currentMediaRev = tvRev + socRev + seaRev;
  const currentTotalRev = BASELINE_REVENUE + currentMediaRev;

  const optimalSpends = solveOptimalAllocation(totalBudget);
  const optTvRev = hillRevenue(optimalSpends.tv, CHANNEL_CONFIGS.tv.K, CHANNEL_CONFIGS.tv.S, CHANNEL_CONFIGS.tv.beta);
  const optSocRev = hillRevenue(optimalSpends.social, CHANNEL_CONFIGS.social.K, CHANNEL_CONFIGS.social.S, CHANNEL_CONFIGS.social.beta);
  const optSeaRev = hillRevenue(optimalSpends.search, CHANNEL_CONFIGS.search.K, CHANNEL_CONFIGS.search.S, CHANNEL_CONFIGS.search.beta);

  const optimalMediaRev = optTvRev + optSocRev + optSeaRev;
  const optimalTotalRev = BASELINE_REVENUE + optimalMediaRev;

  const dollarLift = Math.max(0, optimalTotalRev - currentTotalRev);
  const percentageLift = (dollarLift / currentTotalRev) * 100;

  return {
    total_budget: totalBudget,
    baseline_revenue: BASELINE_REVENUE,
    current_media_revenue: Math.round(currentMediaRev),
    current_total_revenue: Math.round(currentTotalRev),
    optimal_media_revenue: Math.round(optimalMediaRev),
    optimal_total_revenue: Math.round(optimalTotalRev),
    dollar_lift: Math.round(dollarLift),
    percentage_lift: Number(percentageLift.toFixed(1)),
    source: 'client-engine',
    current_channels: {
      tv: {
        channel: 'tv',
        spend: Math.round(tvSpend),
        percentage: Number(tvPct.toFixed(1)),
        predicted_revenue: Math.round(tvRev),
        average_roas: Number((tvRev / (tvSpend || 1)).toFixed(2)),
        marginal_roas: Number(hillMarginalReturn(tvSpend, CHANNEL_CONFIGS.tv.K, CHANNEL_CONFIGS.tv.S, CHANNEL_CONFIGS.tv.beta).toFixed(2)),
        alpha: CHANNEL_CONFIGS.tv.alpha,
        half_saturation_k: CHANNEL_CONFIGS.tv.K,
        slope_s: CHANNEL_CONFIGS.tv.S,
      },
      social: {
        channel: 'social',
        spend: Math.round(socialSpend),
        percentage: Number(socialPct.toFixed(1)),
        predicted_revenue: Math.round(socRev),
        average_roas: Number((socRev / (socialSpend || 1)).toFixed(2)),
        marginal_roas: Number(hillMarginalReturn(socialSpend, CHANNEL_CONFIGS.social.K, CHANNEL_CONFIGS.social.S, CHANNEL_CONFIGS.social.beta).toFixed(2)),
        alpha: CHANNEL_CONFIGS.social.alpha,
        half_saturation_k: CHANNEL_CONFIGS.social.K,
        slope_s: CHANNEL_CONFIGS.social.S,
      },
      search: {
        channel: 'search',
        spend: Math.round(searchSpend),
        percentage: Number(searchPct.toFixed(1)),
        predicted_revenue: Math.round(seaRev),
        average_roas: Number((seaRev / (searchSpend || 1)).toFixed(2)),
        marginal_roas: Number(hillMarginalReturn(searchSpend, CHANNEL_CONFIGS.search.K, CHANNEL_CONFIGS.search.S, CHANNEL_CONFIGS.search.beta).toFixed(2)),
        alpha: CHANNEL_CONFIGS.search.alpha,
        half_saturation_k: CHANNEL_CONFIGS.search.K,
        slope_s: CHANNEL_CONFIGS.search.S,
      },
    },
    optimal_channels: {
      tv: {
        channel: 'tv',
        spend: Math.round(optimalSpends.tv),
        percentage: Number(((optimalSpends.tv / totalBudget) * 100).toFixed(1)),
        predicted_revenue: Math.round(optTvRev),
        average_roas: Number((optTvRev / optimalSpends.tv).toFixed(2)),
        marginal_roas: Number(hillMarginalReturn(optimalSpends.tv, CHANNEL_CONFIGS.tv.K, CHANNEL_CONFIGS.tv.S, CHANNEL_CONFIGS.tv.beta).toFixed(2)),
        alpha: CHANNEL_CONFIGS.tv.alpha,
        half_saturation_k: CHANNEL_CONFIGS.tv.K,
        slope_s: CHANNEL_CONFIGS.tv.S,
      },
      social: {
        channel: 'social',
        spend: Math.round(optimalSpends.social),
        percentage: Number(((optimalSpends.social / totalBudget) * 100).toFixed(1)),
        predicted_revenue: Math.round(optSocRev),
        average_roas: Number((optSocRev / optimalSpends.social).toFixed(2)),
        marginal_roas: Number(hillMarginalReturn(optimalSpends.social, CHANNEL_CONFIGS.social.K, CHANNEL_CONFIGS.social.S, CHANNEL_CONFIGS.social.beta).toFixed(2)),
        alpha: CHANNEL_CONFIGS.social.alpha,
        half_saturation_k: CHANNEL_CONFIGS.social.K,
        slope_s: CHANNEL_CONFIGS.social.S,
      },
      search: {
        channel: 'search',
        spend: Math.round(optimalSpends.search),
        percentage: Number(((optimalSpends.search / totalBudget) * 100).toFixed(1)),
        predicted_revenue: Math.round(optSeaRev),
        average_roas: Number((optSeaRev / optimalSpends.search).toFixed(2)),
        marginal_roas: Number(hillMarginalReturn(optimalSpends.search, CHANNEL_CONFIGS.search.K, CHANNEL_CONFIGS.search.S, CHANNEL_CONFIGS.search.beta).toFixed(2)),
        alpha: CHANNEL_CONFIGS.search.alpha,
        half_saturation_k: CHANNEL_CONFIGS.search.K,
        slope_s: CHANNEL_CONFIGS.search.S,
      },
    },
  };
}

export function generateClientCurves(maxSpend = 80000): Record<string, ChannelCurveData> {
  const steps = 60;
  const result: Record<string, ChannelCurveData> = {};

  for (const [key, cfg] of Object.entries(CHANNEL_CONFIGS)) {
    const points = [];
    for (let i = 0; i <= steps; i++) {
      const sp = Math.max(500, (i / steps) * maxSpend);
      const rev = hillRevenue(sp, cfg.K, cfg.S, cfg.beta);
      const mroas = hillMarginalReturn(sp, cfg.K, cfg.S, cfg.beta);
      points.push({
        spend: Math.round(sp),
        revenue: Math.round(rev),
        marginal_return: Number(mroas.toFixed(3)),
      });
    }

    result[key] = {
      channel: key,
      label: cfg.label,
      color: cfg.color,
      alpha: cfg.alpha,
      K: cfg.K,
      S: cfg.S,
      beta: cfg.beta,
      current_spend: key === 'tv' ? 44000 : key === 'social' ? 24000 : 12000,
      optimal_spend: key === 'tv' ? 22400 : key === 'social' ? 28000 : 29600,
      points,
    };
  }

  return result;
}

export function generateClientDecomposition(): DecompositionResult {
  const nWeeks = 52;
  const series = [];

  for (let i = 0; i < nWeeks; i++) {
    const trend = 95000 + (i / nWeeks) * 13000;
    const seasonality = 12000 * Math.sin((2 * Math.PI * i) / 52);
    const baseline = trend + seasonality;

    const tvRev = 22000 + 10000 * Math.sin((2 * Math.PI * i) / 26);
    const socRev = 18000 + 4000 * Math.cos((2 * Math.PI * i) / 13);
    const seaRev = 15000 + 3000 * Math.sin((2 * Math.PI * i) / 52);

    const predicted = baseline + tvRev + socRev + seaRev;
    const noise = Math.sin(i * 99) * 2800;
    const actual = Math.max(0, predicted + noise);

    const date = new Date(2025, 0, 6 + i * 7).toISOString().split('T')[0];

    series.push({
      week_index: i + 1,
      date,
      actual_sales: Math.round(actual),
      predicted_sales: Math.round(predicted),
      baseline: Math.round(baseline),
      tv_contribution: Math.round(tvRev),
      social_contribution: Math.round(socRev),
      search_contribution: Math.round(seaRev),
    });
  }

  return {
    series,
    mape: 2.85,
    overall_roas: {
      tv: 1.84,
      social: 2.31,
      search: 2.89,
    },
    fitted_parameters: {
      tv: { alpha: 0.65, K: 18000, S: 1.3, beta: 45000 },
      social: { alpha: 0.35, K: 9000, S: 1.0, beta: 28000 },
      search: { alpha: 0.12, K: 6000, S: 0.9, beta: 22000 },
    },
  };
}
