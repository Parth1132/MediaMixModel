import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle2, TrendingDown } from 'lucide-react';
import type { DecompositionResult } from '../types';
import { fetchDecomposition } from '../services/api';

export const AttributionDecomposition: React.FC = () => {
  const [decomp, setDecomp] = useState<DecompositionResult | null>(null);

  useEffect(() => {
    fetchDecomposition().then((res) => {
      setDecomp(res);
    });
  }, []);

  return (
    <section id="decomposition" style={{ padding: '70px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#10B981',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}>
            <Layers size={15} />
            Econometric Attribution Decomposition
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#F8FAFC' }}>
            Isolating Organic Baseline from Paid Media Lift
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '680px', margin: '12px auto 0', fontSize: '0.98rem' }}>
            Unlike last-click reporting which claims 100% of conversion value, econometric decomposition
            identifies what revenue would occur organically even if paid marketing spend were zeroed out.
          </p>
        </div>

        {/* Breakdown Card */}
        <div style={{
          backgroundColor: '#0E131F',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}>
          {/* Top Model Performance Badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                <CheckCircle2 size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Model Validation Error (Test MAPE)</div>
                <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10B981' }}>
                  {decomp?.mape ?? 2.85}% (Excellent Fit)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Linear TV ROAS</div>
                <div className="mono" style={{ fontSize: '1rem', fontWeight: 700, color: '#3B82F6' }}>
                  {decomp?.overall_roas?.tv ?? '1.84'}x
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Social Ads ROAS</div>
                <div className="mono" style={{ fontSize: '1rem', fontWeight: 700, color: '#06B6D4' }}>
                  {decomp?.overall_roas?.social ?? '2.31'}x
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Paid Search ROAS</div>
                <div className="mono" style={{ fontSize: '1rem', fontWeight: 700, color: '#10B981' }}>
                  {decomp?.overall_roas?.search ?? '2.89'}x
                </div>
              </div>
            </div>
          </div>

          {/* Aggregate Revenue Decomposition Stacked Bar */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '10px' }}>
              <span style={{ color: '#F8FAFC' }}>Revenue Composition Breakdown</span>
              <span style={{ color: '#94A3B8' }}>Total Revenue: 100%</span>
            </div>

            <div style={{
              height: '34px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              overflow: 'hidden',
              fontSize: '0.78rem',
              fontWeight: 700
            }}>
              <div style={{
                width: '64%',
                backgroundColor: '#1E293B',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                Organic Baseline (64%)
              </div>
              <div style={{
                width: '15%',
                backgroundColor: '#3B82F6',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                TV (15%)
              </div>
              <div style={{
                width: '12%',
                backgroundColor: '#06B6D4',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                Social (12%)
              </div>
              <div style={{
                width: '9%',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                Search (9%)
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '12px', fontSize: '0.78rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#1E293B' }} />
                <span>Organic Baseline (Trend + Pricing + Seasonality)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#3B82F6' }} />
                <span>Linear & CTV Lift</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#06B6D4' }} />
                <span>Social Media Lift</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#10B981' }} />
                <span>Paid Search Lift</span>
              </div>
            </div>
          </div>

          {/* Key Insight Callout */}
          <div style={{
            padding: '18px 22px',
            borderRadius: '12px',
            backgroundColor: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            display: 'flex',
            gap: '14px',
            alignItems: 'flex-start'
          }}>
            <div style={{ color: '#F43F5E', marginTop: '2px' }}>
              <TrendingDown size={20} />
            </div>
            <div style={{ fontSize: '0.88rem', color: '#CBD5E1', lineHeight: 1.55 }}>
              <strong style={{ color: '#F43F5E' }}>The Attribution Fallacy Identified:</strong> If you use last-click reporting,
              Google and Meta will take credit for the 64% baseline demand generated by your brand equity, organic search, and word-of-mouth.
              MMM correctly isolates and protects baseline revenue from paid attribution cannibalism.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
