import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Layers,
  AlertCircle
} from 'lucide-react';
import {
  MetaIcon,
  GoogleAdsIcon,
  TikTokIcon,
  AmazonIcon,
  YouTubeIcon,
  LinkedInIcon,
  AppleIcon,
  PinterestIcon,
  ShopifyIcon,
  StripeIcon
} from './PlatformIcons';
import { parseCSV, harmonizeDatasets, type ParseResult, type HarmonizedDataset } from '../services/csvParser';
import { getPreloadedDemoDataset } from '../services/demoDataset';

interface NexusProps {
  onDatasetLoaded: (dataset: HarmonizedDataset) => void;
}

interface PlatformNode {
  id: string;
  name: string;
  category: 'ad' | 'revenue';
  color: string;
  icon: React.ReactNode;
  hint: string;
  // Dispersed coordinates (relative %)
  floatX: number;
  floatY: number;
  // Converged coordinates (orbital radius %)
  convergeAngle: number;
}

export const DataConvergenceNexus: React.FC<NexusProps> = ({ onDatasetLoaded }) => {
  const [converged, setConverged] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<ParseResult[]>([]);
  const [dataset, setDataset] = useState<HarmonizedDataset | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const platforms: PlatformNode[] = [
    { id: 'meta', name: 'Meta Ads', category: 'ad', color: '#0082FB', icon: <MetaIcon size={28} />, hint: 'Export with Amount Spent, Reporting Starts', floatX: 12, floatY: 15, convergeAngle: 0 },
    { id: 'google', name: 'Google Ads', category: 'ad', color: '#4285F4', icon: <GoogleAdsIcon size={28} />, hint: 'Export with Cost, Day / Date, Impr.', floatX: 84, floatY: 16, convergeAngle: 36 },
    { id: 'tiktok', name: 'TikTok Ads', category: 'ad', color: '#FE2C55', icon: <TikTokIcon size={28} />, hint: 'Export with Total Cost, Stat Date', floatX: 6, floatY: 52, convergeAngle: 72 },
    { id: 'amazon', name: 'Amazon Ads', category: 'ad', color: '#FF9900', icon: <AmazonIcon size={28} />, hint: 'Export with Spend, Date, Impressions', floatX: 90, floatY: 50, convergeAngle: 108 },
    { id: 'shopify', name: 'Shopify Store', category: 'revenue', color: '#96BF48', icon: <ShopifyIcon size={28} />, hint: 'Target: Net Sales / Total Sales by Day', floatX: 18, floatY: 82, convergeAngle: 144 },
    { id: 'stripe', name: 'Stripe Payments', category: 'revenue', color: '#635BFF', icon: <StripeIcon size={28} />, hint: 'Target: Daily gross revenue / balance', floatX: 82, floatY: 84, convergeAngle: 180 },
    { id: 'youtube', name: 'YouTube Ads', category: 'ad', color: '#FF0000', icon: <YouTubeIcon size={28} />, hint: 'Export with Video Cost & Views', floatX: 48, floatY: 8, convergeAngle: 216 },
    { id: 'linkedin', name: 'LinkedIn Ads', category: 'ad', color: '#0A66C2', icon: <LinkedInIcon size={28} />, hint: 'Export with Total Spent, Start Date', floatX: 30, floatY: 90, convergeAngle: 252 },
    { id: 'apple', name: 'Apple Search', category: 'ad', color: '#0071E3', icon: <AppleIcon size={28} />, hint: 'Export with Spend & Search Terms', floatX: 70, floatY: 90, convergeAngle: 288 },
    { id: 'pinterest', name: 'Pinterest Ads', category: 'ad', color: '#E60023', icon: <PinterestIcon size={28} />, hint: 'Export with Paid Spend & Pin Clicks', floatX: 50, floatY: 92, convergeAngle: 324 },
  ];

  // Trigger convergence animation smoothly after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setConverged(true);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMsg(null);

    const newParsedList: ParseResult[] = [...uploadedFiles];
    let processed = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        try {
          const parsed = parseCSV(text, file.name);
          newParsedList.push(parsed);
        } catch (err: any) {
          setErrorMsg(`Error in ${file.name}: ${err.message}`);
        }
        processed++;
        if (processed === files.length) {
          setUploadedFiles(newParsedList);
          const harmonized = harmonizeDatasets(newParsedList);
          setDataset(harmonized);
          onDatasetLoaded(harmonized);
        }
      };
      reader.readAsText(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleLoadDemo = () => {
    setErrorMsg(null);
    const demo = getPreloadedDemoDataset();
    setDataset(demo);
    onDatasetLoaded(demo);
  };

  const isPlatformConnected = (id: string): boolean => {
    if (!dataset) return false;
    if (id === 'shopify' || id === 'stripe') {
      return dataset.revenueTarget !== null;
    }
    return Object.values(dataset.channels).some((c) => c.platformId.includes(id));
  };

  return (
    <section id="connect-nexus" style={{ padding: '80px 0 60px', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#60A5FA',
            fontSize: '0.8rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '14px'
          }}>
            <Layers size={14} />
            Universal Multi-Platform Data Convergence
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            color: '#F8FAFC',
            lineHeight: 1.15
          }}>
            Connect Any Platform in <span style={{ color: '#3B82F6' }}>CSV Format</span>
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '720px', margin: '14px auto 0', fontSize: '1.02rem', lineHeight: 1.6 }}>
            Every ad platform can export a CSV. Drop exports from Meta, Google, TikTok, Amazon, or your store.
            Our engine automatically fingerprints column headers, converts currencies, and harmonizes daily rows into an MMM econometric matrix.
          </p>

          {/* Toggle Animation State */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
            <button
              onClick={() => setConverged(!converged)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94A3B8',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={13} />
              {converged ? 'Disperse Constellation' : 'Gravitate to Center'}
            </button>
          </div>
        </div>

        {/* The Animated Arena Container */}
        <div style={{
          position: 'relative',
          minHeight: '520px',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(14, 19, 31, 0.7)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          overflow: 'hidden'
        }}>
          {/* Subtle Ambient Rings */}
          <div style={{
            position: 'absolute',
            width: '440px',
            height: '440px',
            borderRadius: '50%',
            border: '1px dashed rgba(59, 130, 246, 0.15)',
            pointerEvents: 'none',
            transform: converged ? 'scale(1)' : 'scale(1.4)',
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }} />
          <div style={{
            position: 'absolute',
            width: '620px',
            height: '620px',
            borderRadius: '50%',
            border: '1px dashed rgba(6, 182, 212, 0.08)',
            pointerEvents: 'none',
            transform: converged ? 'scale(1)' : 'scale(1.3)',
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }} />

          {/* Floating / Converging Platform Icons */}
          {platforms.map((p) => {
            const isConnected = isPlatformConnected(p.id);

            // Compute positions
            // Converged: on an elliptical orbit
            const rad = (p.convergeAngle * Math.PI) / 180;
            const orbitRadiusX = 260;
            const orbitRadiusY = 190;
            const targetX = 50 + (Math.cos(rad) * orbitRadiusX) / 8;
            const targetY = 50 + (Math.sin(rad) * orbitRadiusY) / 5;

            const posX = converged ? targetX : p.floatX;
            const posY = converged ? targetY : p.floatY;

            return (
              <div
                key={p.id}
                onMouseEnter={() => setHoveredNode(p.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  position: 'absolute',
                  left: `${posX}%`,
                  top: `${posY}%`,
                  transform: 'translate(-50%, -50%)',
                  transition: 'left 1.2s cubic-bezier(0.16, 1, 0.3, 1), top 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s',
                  zIndex: hoveredNode === p.id ? 40 : 20,
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  position: 'relative',
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: isConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(18, 24, 38, 0.95)',
                  border: `2px solid ${isConnected ? '#10B981' : hoveredNode === p.id ? p.color : 'rgba(255, 255, 255, 0.12)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isConnected
                    ? '0 0 25px rgba(16, 185, 129, 0.5)'
                    : hoveredNode === p.id
                    ? `0 0 25px ${p.color}60`
                    : '0 8px 24px rgba(0, 0, 0, 0.4)',
                  transition: 'all 0.25s ease'
                }}>
                  {p.icon}

                  {/* Connected Checkmark Badge */}
                  {isConnected && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-4px',
                      right: '-4px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#07090E',
                      boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)'
                    }}>
                      <CheckCircle2 size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Tooltip on Hover */}
                {hoveredNode === p.id && (
                  <div style={{
                    position: 'absolute',
                    bottom: '68px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#07090E',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.74rem',
                    color: '#F8FAFC',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
                    pointerEvents: 'none'
                  }}>
                    <div style={{ fontWeight: 700, color: p.color }}>{p.name}</div>
                    <div style={{ color: '#94A3B8' }}>{p.hint}</div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Central Magnetic Dropzone Box */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '36px 28px',
              borderRadius: '20px',
              backgroundColor: isDragging ? 'rgba(59, 130, 246, 0.15)' : 'rgba(7, 9, 14, 0.88)',
              border: `2px dashed ${isDragging ? '#3B82F6' : dataset ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.18)'}`,
              boxShadow: isDragging ? '0 0 40px rgba(59, 130, 246, 0.4)' : '0 12px 40px rgba(0, 0, 0, 0.6)',
              textAlign: 'center',
              position: 'relative',
              zIndex: 30,
              transition: 'all 0.2s ease'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.tsv,.txt"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => handleFiles(e.target.files)}
            />

            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              backgroundColor: dataset ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
              color: dataset ? '#10B981' : '#3B82F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: dataset ? '0 0 20px rgba(16, 185, 129, 0.3)' : '0 0 20px rgba(59, 130, 246, 0.3)'
            }}>
              {dataset ? <CheckCircle2 size={28} /> : <UploadCloud size={28} />}
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '8px' }}>
              {dataset ? 'Data Ingestion & Harmonization Complete' : 'Drop Ad Platform & Store CSVs Here'}
            </h3>

            <p style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '20px' }}>
              {dataset
                ? `Successfully mapped ${dataset.summary.channelCount} marketing channels & ground-truth revenue over ${dataset.summary.weeksCount} weeks.`
                : 'Drop 1 or multiple CSVs at once. Meta, Google, TikTok, Shopify, or generic spend reports are auto-harmonized.'}
            </p>

            {/* Error Notice */}
            {errorMsg && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(244, 63, 94, 0.15)',
                color: '#F43F5E',
                fontSize: '0.78rem',
                marginBottom: '16px',
                textAlign: 'left'
              }}>
                <AlertCircle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Ingestion Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.35)',
                  transition: 'background 0.2s'
                }}
              >
                <FileSpreadsheet size={16} />
                Select CSV Files from Computer
              </button>

              <button
                onClick={handleLoadDemo}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#F8FAFC',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Sparkles size={15} color="#10B981" />
                ⚡ Load Demo Brand Dataset (1-Click)
              </button>
            </div>
          </div>
        </div>

        {/* Harmonization Verification HUD */}
        {dataset && (
          <div style={{
            marginTop: '32px',
            backgroundColor: '#0E131F',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '18px',
            padding: '24px 28px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '16px',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700, textTransform: 'uppercase' }}>
                  ✓ Harmonized Econometric Matrix Ready
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC' }}>
                  Timeline: {dataset.summary.dateRangeStr}
                </div>
              </div>

              <a
                href="#simulator"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  backgroundColor: '#10B981',
                  color: '#07090E',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                }}
              >
                Run Media Mix Model on Your Data
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Channels Ingested Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {Object.entries(dataset.channels).map(([key, ch]) => (
                <div
                  key={key}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div style={{ fontSize: '0.76rem', color: '#94A3B8', fontWeight: 600 }}>{ch.platformLabel}</div>
                  <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#60A5FA', margin: '4px 0' }}>
                    ${ch.totalValue.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    {ch.weeksCount} weekly data points
                  </div>
                </div>
              ))}

              {dataset.revenueTarget && (
                <div
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)'
                  }}
                >
                  <div style={{ fontSize: '0.76rem', color: '#10B981', fontWeight: 600 }}>Ground Truth Target (Y)</div>
                  <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10B981', margin: '4px 0' }}>
                    ${dataset.revenueTarget.totalValue.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                    {dataset.revenueTarget.platformLabel}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
