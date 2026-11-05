import React, { useState, useEffect } from 'react';
import { Sliders, Sparkles } from 'lucide-react';
import type { SimulationResult } from '../types';
import { simulateAllocation } from '../services/api';
import type { HarmonizedDataset } from '../services/csvParser';

interface BudgetSimulatorProps {
  harmonizedData?: HarmonizedDataset | null;
}

export const BudgetSimulator: React.FC<BudgetSimulatorProps> = ({ harmonizedData }) => {
  const [totalBudget, setTotalBudget] = useState<number>(80000);
  const [tvPct, setTvPct] = useState<number>(55);
  const [socialPct, setSocialPct] = useState<number>(30);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  // If harmonizedData arrives, auto-adjust total budget to match average monthly spend
  useEffect(() => {
    if (harmonizedData && harmonizedData.summary.weeksCount > 0) {
      const avgWeeklySpend = harmonizedData.summary.totalSpend / harmonizedData.summary.weeksCount;
      const approxMonthly = Math.round((avgWeeklySpend * 4.33) / 5000) * 5000;
      if (approxMonthly >= 20000 && approxMonthly <= 250000) {
        setTotalBudget(approxMonthly);
      }
    }
  }, [harmonizedData]);

  // Derived search percentage
  const searchPct = Math.max(0, 100 - tvPct - socialPct);

  // Auto-run simulation when inputs change
  useEffect(() => {
    let isCancelled = false;

    simulateAllocation(totalBudget, tvPct, socialPct, searchPct).then((res) => {
      if (!isCancelled) {
        setSimResult(res);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [totalBudget, tvPct, socialPct, searchPct]);

  const handleTvChange = (val: number) => {
    const newTv = Math.min(85, Math.max(5, val));
    if (newTv + socialPct > 90) {
      setSocialPct(90 - newTv);
    }
    setTvPct(newTv);
  };

  const handleSocialChange = (val: number) => {
    const newSocial = Math.min(85, Math.max(5, val));
    if (tvPct + newSocial > 90) {
      setTvPct(90 - newSocial);
    }
    setSocialPct(newSocial);
  };

  return (
    <section id="simulator" style={{ padding: '70px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#3B82F6',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}>
            <Sliders size={15} />
            Live Econometric Simulator
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#F8FAFC' }}>
            Cross-Channel Capital Rebalancing Simulator
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '680px', margin: '12px auto 0', fontSize: '0.98rem' }}>
            Adjust your monthly marketing budget and channel allocations. The SLSQP optimization solver
            mathematically calculates optimal capital deployment to maximize top-line revenue at zero incremental spend.
          </p>
        </div>

        {/* Main Grid: Controls Left, Results Right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '32px'
        }}>
          {/* Controls Panel */}
          <div style={{
            backgroundColor: '#0E131F',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Current Allocation Controls</span>
              <span style={{ fontSize: '0.78rem', color: harmonizedData ? '#10B981' : '#64748B', fontWeight: 600 }}>
                {harmonizedData ? '✓ Calibrated to Ingested Data' : simResult?.source === 'backend-fastapi' ? '⚡ FastAPI Active' : '⚡ Local Engine Active'}
              </span>
            </h3>

            {/* Total Budget Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#94A3B8' }}>Total Monthly Budget</label>
                <span className="mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F8FAFC' }}>
                  ${totalBudget.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="20000"
                max="250000"
                step="5000"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                {[40000, 80000, 120000, 180000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setTotalBudget(preset)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      backgroundColor: totalBudget === preset ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${totalBudget === preset ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                      color: totalBudget === preset ? '#60A5FA' : '#94A3B8',
                      cursor: 'pointer'
                    }}
                  >
                    ${preset / 1000}k
                  </button>
                ))}
              </div>
            </div>

            {/* TV Channel Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#F8FAFC' }}>Linear & Connected TV</span>
                </div>
                <span className="mono" style={{ fontSize: '0.92rem', color: '#60A5FA', fontWeight: 700 }}>
                  {tvPct}% (${Math.round(totalBudget * tvPct / 100).toLocaleString()})
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="1"
                value={tvPct}
                onChange={(e) => handleTvChange(Number(e.target.value))}
              />
              <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '4px' }}>
                High memory retention (α = 0.65), saturation inflection at $18,000/mo.
              </div>
            </div>

            {/* Social Ads Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#06B6D4' }} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#F8FAFC' }}>Social Ads (Meta / TikTok)</span>
                </div>
                <span className="mono" style={{ fontSize: '0.92rem', color: '#06B6D4', fontWeight: 700 }}>
                  {socialPct}% (${Math.round(totalBudget * socialPct / 100).toLocaleString()})
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="1"
                value={socialPct}
                onChange={(e) => handleSocialChange(Number(e.target.value))}
              />
              <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '4px' }}>
                Moderate memory retention (α = 0.35), saturation inflection at $9,000/mo.
              </div>
            </div>

            {/* Paid Search (Auto-balanced) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#F8FAFC' }}>Paid Search (Google / Bing)</span>
                </div>
                <span className="mono" style={{ fontSize: '0.92rem', color: '#10B981', fontWeight: 700 }}>
                  {searchPct}% (${Math.round(totalBudget * searchPct / 100).toLocaleString()})
                </span>
              </div>
              <div style={{
                height: '6px',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '999px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${searchPct}%`,
                  backgroundColor: '#10B981',
                  borderRadius: '999px'
                }} />
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '4px' }}>
                Auto-balanced to 100%. Immediate response (α = 0.12), saturation at $6,000/mo.
              </div>
            </div>
          </div>

          {/* Results & Lift Panel */}
          <div style={{
            backgroundColor: '#0E131F',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '24px'
          }}>
            {/* Top Lift Badge */}
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '14px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
                    Mathematical Opportunity
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981' }} className="mono">
                    +{simResult?.percentage_lift ?? 0}% Free Lift (+${simResult?.dollar_lift?.toLocaleString() ?? 0})
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700, backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '4px 8px', borderRadius: '6px' }}>
                $0 Extra Spend
              </div>
            </div>

            {/* Revenue Metrics Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{
                padding: '18px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div style={{ fontSize: '0.76rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>
                  CURRENT PREDICTED REVENUE
                </div>
                <div className="mono" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#F8FAFC' }}>
                  ${simResult?.current_total_revenue?.toLocaleString() ?? '—'}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '4px' }}>
                  Blended Media Rev: ${simResult?.current_media_revenue?.toLocaleString() ?? 0}
                </div>
              </div>

              <div style={{
                padding: '18px',
                borderRadius: '12px',
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.25)'
              }}>
                <div style={{ fontSize: '0.76rem', color: '#60A5FA', fontWeight: 600, marginBottom: '6px' }}>
                  OPTIMIZED REVENUE (SLSQP)
                </div>
                <div className="mono" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#60A5FA' }}>
                  ${simResult?.optimal_total_revenue?.toLocaleString() ?? '—'}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '4px' }}>
                  Blended Media Rev: ${simResult?.optimal_media_revenue?.toLocaleString() ?? 0}
                </div>
              </div>
            </div>

            {/* Visual Reallocation Comparison Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#F8FAFC' }}>
                Channel Budget Rebalancing: Current ➔ Optimal
              </div>

              {/* TV Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span style={{ color: '#3B82F6', fontWeight: 600 }}>Linear & Connected TV</span>
                  <span className="mono" style={{ color: '#94A3B8' }}>
                    ${Math.round((simResult?.current_channels?.tv?.spend ?? 0) / 1000)}k ➔ ${Math.round((simResult?.optimal_channels?.tv?.spend ?? 0) / 1000)}k
                  </span>
                </div>
                <div style={{ height: '14px', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', overflow: 'hidden' }}>
                  <div style={{
                    width: `${simResult?.current_channels?.tv?.percentage ?? tvPct}%`,
                    backgroundColor: '#3B82F6',
                    opacity: 0.85
                  }} />
                  <div style={{
                    width: `${Math.max(0, (simResult?.optimal_channels?.tv?.percentage ?? 28) - (simResult?.current_channels?.tv?.percentage ?? tvPct))}%`,
                    backgroundColor: '#60A5FA',
                    backgroundImage: 'linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%)'
                  }} />
                </div>
              </div>

              {/* Social Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span style={{ color: '#06B6D4', fontWeight: 600 }}>Social Ads (Meta / TikTok)</span>
                  <span className="mono" style={{ color: '#94A3B8' }}>
                    ${Math.round((simResult?.current_channels?.social?.spend ?? 0) / 1000)}k ➔ ${Math.round((simResult?.optimal_channels?.social?.spend ?? 0) / 1000)}k
                  </span>
                </div>
                <div style={{ height: '14px', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', overflow: 'hidden' }}>
                  <div style={{
                    width: `${simResult?.current_channels?.social?.percentage ?? socialPct}%`,
                    backgroundColor: '#06B6D4',
                    opacity: 0.85
                  }} />
                </div>
              </div>

              {/* Search Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span style={{ color: '#10B981', fontWeight: 600 }}>Paid Search (Google / Bing)</span>
                  <span className="mono" style={{ color: '#94A3B8' }}>
                    ${Math.round((simResult?.current_channels?.search?.spend ?? 0) / 1000)}k ➔ ${Math.round((simResult?.optimal_channels?.search?.spend ?? 0) / 1000)}k
                  </span>
                </div>
                <div style={{ height: '14px', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', overflow: 'hidden' }}>
                  <div style={{
                    width: `${simResult?.current_channels?.search?.percentage ?? searchPct}%`,
                    backgroundColor: '#10B981',
                    opacity: 0.85
                  }} />
                </div>
              </div>
            </div>

            {/* Marginal ROAS Status Tags */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              paddingTop: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.78rem'
            }}>
              <span style={{ color: '#64748B' }}>Marginal Return at Current Spend:</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="mono" style={{
                  color: (simResult?.current_channels?.tv?.marginal_roas ?? 0) < 1.0 ? '#F43F5E' : '#10B981',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  TV: ${simResult?.current_channels?.tv?.marginal_roas ?? 0}
                </span>
                <span className="mono" style={{
                  color: (simResult?.current_channels?.social?.marginal_roas ?? 0) < 1.0 ? '#F43F5E' : '#10B981',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  Social: ${simResult?.current_channels?.social?.marginal_roas ?? 0}
                </span>
                <span className="mono" style={{
                  color: (simResult?.current_channels?.search?.marginal_roas ?? 0) < 1.0 ? '#F43F5E' : '#10B981',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  Search: ${simResult?.current_channels?.search?.marginal_roas ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
