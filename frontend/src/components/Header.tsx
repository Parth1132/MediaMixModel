import React from 'react';
import { Cpu, Activity } from 'lucide-react';

interface HeaderProps {
  backendConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({ backendConnected }) => {
  return (
    <header style={{
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      backgroundColor: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
          }}>
            <Cpu size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#F8FAFC' }}>
              MediaMix<span style={{ color: '#3B82F6' }}>Model</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Independent Econometric Engine
            </div>
          </div>
        </div>

        {/* Navigation & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Engine Status Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            backgroundColor: backendConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(59, 130, 246, 0.12)',
            border: `1px solid ${backendConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
            color: backendConnected ? '#10B981' : '#60A5FA'
          }}>
            <Activity size={13} />
            <span style={{ fontWeight: 600 }}>
              {backendConnected ? 'FastAPI Python Engine' : 'Client Econometric Engine'}
            </span>
          </div>

          <a
            href="#connect-nexus"
            style={{ color: '#60A5FA', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600 }}
          >
            Connect Data (CSV)
          </a>
          <a
            href="#simulator"
            style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500 }}
          >
            Simulator
          </a>
          <a
            href="#curves"
            style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500 }}
          >
            Curves
          </a>
          <a
            href="#decomposition"
            style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500 }}
          >
            Decomposition
          </a>

          {/* GitHub Link */}
          <a
            href="https://github.com/Parth1132/MediaMixModel"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#F8FAFC',
              fontSize: '0.82rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
};
