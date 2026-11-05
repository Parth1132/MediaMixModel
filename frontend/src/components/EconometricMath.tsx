import React from 'react';
import { BookOpen, Calculator, Cpu, ShieldCheck } from 'lucide-react';

export const EconometricMath: React.FC = () => {
  return (
    <section id="methodology" style={{ padding: '70px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#8B5CF6',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}>
            <Calculator size={15} />
            Econometric Foundations
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#F8FAFC' }}>
            Production Model Formulations
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '680px', margin: '12px auto 0', fontSize: '0.98rem' }}>
            Our mathematical architecture transforms raw aggregated spend into causally validated incrementality curves.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {/* Card 1: Geometric Adstock */}
          <div style={{
            backgroundColor: '#0E131F',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
                <BookOpen size={18} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>
                1. Geometric Memory Adstock
              </h3>
            </div>
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '14px',
              fontFamily: 'JetBrains Mono',
              fontSize: '0.88rem',
              color: '#60A5FA'
            }}>
              A(t) = Σ [ w(l) * X(t - l) ]<br />
              w(l) = α^l / Σ α^k
            </div>
            <p style={{ fontSize: '0.86rem', color: '#94A3B8', lineHeight: 1.55 }}>
              Models the psychological memory retention of ads across weeks. A consumer exposed to TV today
              carries lingering propensity to buy over subsequent weeks governed by decay factor α.
            </p>
          </div>

          {/* Card 2: Hill Saturation */}
          <div style={{
            backgroundColor: '#0E131F',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' }}>
                <Calculator size={18} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>
                2. Hill Saturation Function
              </h3>
            </div>
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '14px',
              fontFamily: 'JetBrains Mono',
              fontSize: '0.88rem',
              color: '#06B6D4'
            }}>
              S(x) = x^S / ( x^S + K^S )<br />
              dR/dx = β * S*K^S*x^(S-1) / (x^S+K^S)²
            </div>
            <p style={{ fontSize: '0.86rem', color: '#94A3B8', lineHeight: 1.55 }}>
              Non-linear Hill equation captures audience exhaustion and diminishing marginal returns.
              Param K defines the half-saturation spend, and S controls curve steepness.
            </p>
          </div>

          {/* Card 3: Regularization & Non-Negativity */}
          <div style={{
            backgroundColor: '#0E131F',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                <ShieldCheck size={18} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>
                3. Non-Negative Least Squares (NNLS)
              </h3>
            </div>
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '14px',
              fontFamily: 'JetBrains Mono',
              fontSize: '0.88rem',
              color: '#10B981'
            }}>
              min || Y - X*β ||²<br />
              subject to: β_media ≥ 0
            </div>
            <p style={{ fontSize: '0.86rem', color: '#94A3B8', lineHeight: 1.55 }}>
              Standard linear regression often assigns counter-intuitive negative coefficients to marketing channels.
              NNLS guarantees mathematically non-negative media contributions.
            </p>
          </div>

          {/* Card 4: SLSQP Budget Optimizer */}
          <div style={{
            backgroundColor: '#0E131F',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6' }}>
                <Cpu size={18} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>
                4. SLSQP Constrained Optimization
              </h3>
            </div>
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '14px',
              fontFamily: 'JetBrains Mono',
              fontSize: '0.88rem',
              color: '#A78BFA'
            }}>
              max Σ β_i * S_i(x_i)<br />
              s.t. Σ x_i = B, L_i ≤ x_i ≤ U_i
            </div>
            <p style={{ fontSize: '0.86rem', color: '#94A3B8', lineHeight: 1.55 }}>
              Sequential Least Squares Programming reallocates capital across non-linear response curves,
              equalizing marginal ROAS across channels within strict organizational risk boundaries.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
