import React from 'react';
import { ShieldCheck, TrendingUp, Layers, Sliders, ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section style={{ padding: '80px 0 60px', position: 'relative' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        {/* Top Tag */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          color: '#60A5FA',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '28px'
        }}>
          <ShieldCheck size={14} />
          Econometric Intelligence & Attribution Platform
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
          fontWeight: 900,
          lineHeight: 1.12,
          letterSpacing: '-0.03em',
          maxWidth: '980px',
          margin: '0 auto 24px',
          background: 'linear-gradient(180deg, #FFFFFF 20%, #94A3B8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Independent Econometric Intelligence Beyond Walled Gardens
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '1.18rem',
          color: '#94A3B8',
          maxWidth: '780px',
          margin: '0 auto 36px',
          lineHeight: 1.6
        }}>
          Measure true causal incrementality, model adstock memory decay, and mathematically
          optimize cross-channel marketing spend without user-level tracking or cookie dependencies.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '60px' }}>
          <a
            href="#simulator"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 28px',
              borderRadius: '12px',
              backgroundColor: '#3B82F6',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.98rem',
              textDecoration: 'none',
              boxShadow: '0 0 25px rgba(59, 130, 246, 0.45)',
              transition: 'transform 0.15s, box-shadow 0.15s'
            }}
          >
            Launch Interactive Simulator
            <ArrowRight size={17} />
          </a>
          <a
            href="#methodology"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 24px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#F8FAFC',
              fontWeight: 600,
              fontSize: '0.98rem',
              textDecoration: 'none'
            }}
          >
            Explore Econometric Math
          </a>
        </div>

        {/* 3 Metric Value Pillars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          textAlign: 'left'
        }}>
          <div style={{
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: 'rgba(18, 24, 38, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
                <TrendingUp size={20} />
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#3B82F6' }} className="mono">
                +15% - 25%
              </div>
            </div>
            <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '6px' }}>
              Budget Re-Balancing Lift
            </div>
            <div style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5 }}>
              Reallocate capital from saturated upper bounds into high marginal-ROAS channels at zero additional overall spend.
            </div>
          </div>

          <div style={{
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: 'rgba(18, 24, 38, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' }}>
                <Layers size={20} />
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#06B6D4' }} className="mono">
                100% Causal
              </div>
            </div>
            <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '6px' }}>
              Organic Baseline Isolation
            </div>
            <div style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5 }}>
              Separates brand momentum, pricing changes, and macroeconomic seasonality from paid media contribution.
            </div>
          </div>

          <div style={{
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: 'rgba(18, 24, 38, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                <Sliders size={20} />
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#10B981' }} className="mono">
                SLSQP Solver
              </div>
            </div>
            <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '6px' }}>
              Mathematical Optimization
            </div>
            <div style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5 }}>
              Sequential Least Squares Programming solving non-linear convex constraints to prevent diminishing return cliffs.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
