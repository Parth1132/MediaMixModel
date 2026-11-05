import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import type { ChannelCurveData } from '../types';
import { fetchCurves } from '../services/api';

export const SaturationCurves: React.FC = () => {
  const [curves, setCurves] = useState<Record<string, ChannelCurveData>>({});
  const [activeChannel, setActiveChannel] = useState<string>('all');

  useEffect(() => {
    fetchCurves().then((data) => {
      setCurves(data);
    });
  }, []);

  const svgWidth = 800;
  const svgHeight = 360;
  const padding = { top: 30, right: 40, bottom: 50, left: 70 };
  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  const maxSpend = 80000;
  const maxRevenue = 48000;

  const scaleX = (spend: number) => padding.left + (spend / maxSpend) * chartW;
  const scaleY = (rev: number) => padding.top + chartH - (rev / maxRevenue) * chartH;

  const renderPath = (channelKey: string, color: string) => {
    const ch = curves[channelKey];
    if (!ch || !ch.points || ch.points.length === 0) return null;

    const d = ch.points.reduce((acc, pt, idx) => {
      const x = scaleX(pt.spend);
      const y = scaleY(pt.revenue);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');

    return (
      <path
        key={channelKey}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={activeChannel === 'all' || activeChannel === channelKey ? 3.5 : 1}
        strokeOpacity={activeChannel === 'all' || activeChannel === channelKey ? 1 : 0.2}
        style={{ transition: 'stroke-opacity 0.2s, stroke-width 0.2s' }}
      />
    );
  };

  return (
    <section id="curves" style={{ padding: '70px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#06B6D4',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}>
            <TrendingUp size={15} />
            Hill Saturation & Diminishing Returns
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#F8FAFC' }}>
            Non-Linear Channel Response Curves
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '680px', margin: '12px auto 0', fontSize: '0.98rem' }}>
            Every channel follows a sigmoidal or concave return curve. Spending past the half-saturation threshold (K)
            leads to flat-lining incremental revenue and marginal efficiency collapse.
          </p>
        </div>

        {/* Channel Selector Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '28px' }}>
          {['all', 'tv', 'social', 'search'].map((ch) => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeChannel === ch ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${activeChannel === ch ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                color: activeChannel === ch ? '#60A5FA' : '#94A3B8',
                transition: 'all 0.15s'
              }}
            >
              {ch === 'all' ? 'All Channels' : ch === 'tv' ? 'Linear & CTV' : ch === 'social' ? 'Social Ads' : 'Paid Search'}
            </button>
          ))}
        </div>

        {/* Interactive Chart Container */}
        <div style={{
          backgroundColor: '#0E131F',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
              {/* Grid Lines */}
              {[0, 10000, 20000, 30000, 40000].map((val) => {
                const y = scaleY(val);
                return (
                  <g key={val}>
                    <line x1={padding.left} y1={y} x2={svgWidth - padding.right} y2={y} stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="4 4" />
                    <text x={padding.left - 12} y={y + 4} fill="#64748B" fontSize="11" textAnchor="end" fontFamily="JetBrains Mono">
                      ${val / 1000}k
                    </text>
                  </g>
                );
              })}

              {[0, 20000, 40000, 60000, 80000].map((val) => {
                const x = scaleX(val);
                return (
                  <g key={val}>
                    <line x1={x} y1={padding.top} x2={x} y2={svgHeight - padding.bottom} stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="4 4" />
                    <text x={x} y={svgHeight - padding.bottom + 20} fill="#64748B" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono">
                      ${val / 1000}k spend
                    </text>
                  </g>
                );
              })}

              {/* Render Curves */}
              {renderPath('tv', '#3B82F6')}
              {renderPath('social', '#06B6D4')}
              {renderPath('search', '#10B981')}

              {/* Half-Saturation Points (K) Markers */}
              {curves.tv && (
                <g>
                  <line
                    x1={scaleX(curves.tv.K)}
                    y1={padding.top}
                    x2={scaleX(curves.tv.K)}
                    y2={svgHeight - padding.bottom}
                    stroke="#3B82F6"
                    strokeWidth="1.2"
                    strokeDasharray="2 4"
                    strokeOpacity="0.6"
                  />
                  <circle cx={scaleX(curves.tv.K)} cy={scaleY(curves.tv.beta * 0.5)} r="5" fill="#3B82F6" />
                </g>
              )}
              {curves.social && (
                <g>
                  <line
                    x1={scaleX(curves.social.K)}
                    y1={padding.top}
                    x2={scaleX(curves.social.K)}
                    y2={svgHeight - padding.bottom}
                    stroke="#06B6D4"
                    strokeWidth="1.2"
                    strokeDasharray="2 4"
                    strokeOpacity="0.6"
                  />
                  <circle cx={scaleX(curves.social.K)} cy={scaleY(curves.social.beta * 0.5)} r="5" fill="#06B6D4" />
                </g>
              )}
              {curves.search && (
                <g>
                  <line
                    x1={scaleX(curves.search.K)}
                    y1={padding.top}
                    x2={scaleX(curves.search.K)}
                    y2={svgHeight - padding.bottom}
                    stroke="#10B981"
                    strokeWidth="1.2"
                    strokeDasharray="2 4"
                    strokeOpacity="0.6"
                  />
                  <circle cx={scaleX(curves.search.K)} cy={scaleY(curves.search.beta * 0.5)} r="5" fill="#10B981" />
                </g>
              )}
            </svg>
          </div>

          {/* Curve Econometric Parameters Table */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '20px'
          }}>
            <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.06)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3B82F6', fontWeight: 700, fontSize: '0.88rem', marginBottom: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                Linear & Connected TV
              </div>
              <div className="mono" style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div>Half-Sat (K): $18,000</div>
                <div>Hill Slope (S): 1.30</div>
                <div>Max Lift (β): $45,000</div>
                <div>Carryover (α): 0.65</div>
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(6, 182, 212, 0.06)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#06B6D4', fontWeight: 700, fontSize: '0.88rem', marginBottom: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06B6D4' }} />
                Social Ads (Meta/TikTok)
              </div>
              <div className="mono" style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div>Half-Sat (K): $9,000</div>
                <div>Hill Slope (S): 1.00</div>
                <div>Max Lift (β): $28,000</div>
                <div>Carryover (α): 0.35</div>
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 700, fontSize: '0.88rem', marginBottom: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                Paid Search (Google/Bing)
              </div>
              <div className="mono" style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div>Half-Sat (K): $6,000</div>
                <div>Hill Slope (S): 0.90</div>
                <div>Max Lift (β): $22,000</div>
                <div>Carryover (α): 0.12</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
