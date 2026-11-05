import React from 'react';
import { AlertTriangle, EyeOff, BarChart3, Clock } from 'lucide-react';

export const MeasurementDilemma: React.FC = () => {
  const dilemmas = [
    {
      icon: <AlertTriangle size={22} color="#F43F5E" />,
      badge: 'Attribution Trap',
      title: 'The Walled Garden Overlap',
      stat: '200% - 300%',
      statLabel: 'Reported vs Actual Revenue',
      desc: 'Ad platforms measure performance in isolated silos. Meta, Google, and TikTok each claim 100% credit for the same conversion, creating phantom revenue that does not exist in bank deposits.'
    },
    {
      icon: <EyeOff size={22} color="#F59E0B" />,
      badge: 'Privacy Shift',
      title: 'Signal Deprecation & Cookie Loss',
      stat: '60%+',
      statLabel: 'Data Loss on Mobile & Web',
      desc: 'Apple App Tracking Transparency (ATT), Safari ITP, and global privacy laws have severed deterministic click-tracking. Relying on click pixels produces distorted, volatile optimization signals.'
    },
    {
      icon: <BarChart3 size={22} color="#06B6D4" />,
      badge: 'Capital Efficiency',
      title: 'Blind Over-Saturation',
      stat: '< $0.80',
      statLabel: 'True Marginal ROAS at Peak Spend',
      desc: 'Scaling successful channels without econometric modeling pushes spend past the half-saturation point (K), burning capital where each additional dollar returns less than $1.00 in gross revenue.'
    },
    {
      icon: <Clock size={22} color="#8B5CF6" />,
      badge: 'Strategic Decay',
      title: 'Last-Click Short-Termism',
      stat: '-35%',
      statLabel: 'Long-Term Brand Decay',
      desc: 'Rewarding only the final touchpoint starves upper-funnel and brand-building channels (TV, Audio, YouTube), leading to baseline decay and soaring performance CAC over subsequent quarters.'
    }
  ];

  return (
    <section style={{ padding: '60px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            color: '#F43F5E',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}>
            🌪️ The Measurement Dilemma
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#F8FAFC' }}>
            Why Modern Attribution Is Fundamentally Broken
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '640px', margin: '12px auto 0', fontSize: '1rem' }}>
            Traditional last-touch attribution and ad network dashboards mislead capital allocators by confusing correlation with causation.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {dilemmas.map((d, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'rgba(18, 24, 38, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, border-color 0.2s'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {d.icon}
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#94A3B8',
                    letterSpacing: '0.05em'
                  }}>
                    {d.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '8px' }}>
                  {d.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.55, marginBottom: '20px' }}>
                  {d.desc}
                </p>
              </div>

              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: '16px',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{d.statLabel}</span>
                <span className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC' }}>
                  {d.stat}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
