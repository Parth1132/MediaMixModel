import React from 'react';
import { Target, Compass, BarChart, CheckCircle2 } from 'lucide-react';

export const BusinessUseCases: React.FC = () => {
  const useCases = [
    {
      icon: <Target size={22} color="#3B82F6" />,
      title: 'Cross-Channel Capital Re-balancing',
      metric: '+15% to 25%',
      metricLabel: 'Net Revenue Lift',
      desc: 'Shifting monthly spend from saturated channels to high-marginal-return opportunities unlocks substantial top-line revenue at flat overall organizational expenditure.'
    },
    {
      icon: <Compass size={22} color="#06B6D4" />,
      title: 'Offline & Upper-Funnel Quantification',
      metric: '100% Causal',
      metricLabel: 'Holistic Measurement',
      desc: 'Measure the true incrementality of non-clickable mediums (Linear TV, Streaming, Podcasts, Billboards, Sponsorships) that click attribution completely ignores.'
    },
    {
      icon: <BarChart size={22} color="#10B981" />,
      title: 'Diminishing Return & Breakeven Audits',
      metric: '$1.00 Floor',
      metricLabel: 'Marginal ROAS Guardrail',
      desc: 'Prevent unprofitable scaling by establishing hard channel budget caps before the marginal return dips below the marginal unit economics threshold.'
    },
    {
      icon: <CheckCircle2 size={22} color="#8B5CF6" />,
      title: 'Experimental Triangulation',
      metric: 'Calibrated',
      metricLabel: 'Geo-Lift & Match-Market',
      desc: 'Calibrate observational regression coefficients using randomized geo-lift experiment results as Bayesian priors for continuous model confidence.'
    }
  ];

  return (
    <section style={{ padding: '70px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div style={{
            color: '#3B82F6',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}>
            Strategic Playbooks
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#F8FAFC' }}>
            Enterprise Strategic Use Cases
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '640px', margin: '12px auto 0', fontSize: '0.98rem' }}>
            Empowering CMOs, CFOs, and growth engineering leaders with defensible, privacy-safe econometrics.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {useCases.map((u, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#0E131F',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px'
                }}>
                  {u.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '10px' }}>
                  {u.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.55, marginBottom: '20px' }}>
                  {u.desc}
                </p>
              </div>

              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: '14px',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{u.metricLabel}</span>
                <span className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC' }}>
                  {u.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
