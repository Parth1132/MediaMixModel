import type { SimulationResult, ChannelCurveData, DecompositionResult } from '../types';
import {
  runClientSimulation,
  generateClientCurves,
  generateClientDecomposition,
} from './econometricEngine';

const API_BASE = 'http://localhost:8000';

let isBackendAvailable: boolean | null = null;
let lastCheckTime = 0;

export async function checkBackendHealth(): Promise<boolean> {
  const now = Date.now();
  // Cache check for 10 seconds
  if (isBackendAvailable !== null && now - lastCheckTime < 10000) {
    return isBackendAvailable;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(`${API_BASE}/api/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      isBackendAvailable = true;
      lastCheckTime = now;
      return true;
    }
  } catch {
    // Backend not reachable
  }

  isBackendAvailable = false;
  lastCheckTime = now;
  return false;
}

export async function simulateAllocation(
  totalBudget: number,
  tvPct: number,
  socialPct: number,
  searchPct: number
): Promise<SimulationResult> {
  const online = await checkBackendHealth();

  if (online) {
    try {
      const res = await fetch(`${API_BASE}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_budget: totalBudget,
          tv_pct: tvPct,
          social_pct: socialPct,
          search_pct: searchPct,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          ...data,
          source: 'backend-fastapi',
        };
      }
    } catch {
      // Fall through to client engine
    }
  }

  return runClientSimulation(totalBudget, tvPct, socialPct, searchPct);
}

export async function fetchCurves(): Promise<Record<string, ChannelCurveData>> {
  const online = await checkBackendHealth();

  if (online) {
    try {
      const res = await fetch(`${API_BASE}/api/curves`);
      if (res.ok) {
        const data = await res.json();
        return data.channels;
      }
    } catch {
      // Fall through to client engine
    }
  }

  return generateClientCurves();
}

export async function fetchDecomposition(): Promise<DecompositionResult> {
  const online = await checkBackendHealth();

  if (online) {
    try {
      const res = await fetch(`${API_BASE}/api/decomposition`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Fall through to client engine
    }
  }

  return generateClientDecomposition();
}
