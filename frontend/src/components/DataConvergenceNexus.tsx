import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Layers,
  AlertCircle,
  Move
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

interface PlatformPhysicsNode {
  id: string;
  name: string;
  category: 'ad' | 'revenue';
  color: string;
  icon: React.ReactNode;
  hint: string;
  angleDeg: number;
  // Physics state
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  isDragging: boolean;
  dragOffsetX: number;
  dragOffsetY: number;
  lastMouseX: number;
  lastMouseY: number;
}

export const DataConvergenceNexus: React.FC<NexusProps> = ({ onDatasetLoaded }) => {
  const [converged, setConverged] = useState<boolean>(true);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<ParseResult[]>([]);
  const [dataset, setDataset] = useState<HarmonizedDataset | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const arenaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize Physics Nodes
  const nodesRef = useRef<PlatformPhysicsNode[]>([
    { id: 'meta', name: 'Meta Ads', category: 'ad', color: '#0082FB', icon: <MetaIcon size={26} />, hint: 'Amount Spent, Reporting Starts', angleDeg: 0, x: 120, y: 100, vx: 0.5, vy: -0.3, radius: 28, mass: 1, isDragging: false, dragOffsetX: 0, dragOffsetY: 0, lastMouseX: 0, lastMouseY: 0 },
    { id: 'google', name: 'Google Ads', category: 'ad', color: '#4285F4', icon: <GoogleAdsIcon size={26} />, hint: 'Cost, Day / Date, Impr.', angleDeg: 36, x: 750, y: 90, vx: -0.4, vy: 0.6, radius: 28, mass: 1, isDragging: false, dragOffsetX: 0, dragOffsetY: 0, lastMouseX: 0, lastMouseY: 0 },
    { id: 'tiktok', name: 'TikTok Ads', category: 'ad', color: '#FE2C55', icon: <TikTokIcon size={26} />, hint: 'Total Cost, Stat Date', angleDeg: 72, x: 80, y: 320, vx: 0.8, vy: 0.2, radius: 28, mass: 1, isDragging: false, dragOffsetX: 0, dragOffsetY: 0, lastMouseX: 0, lastMouseY: 0 },
    { id: 'amazon', name: 'Amazon Ads', category: 'ad', color: '#FF9900', icon: <AmazonIcon size={26} />, hint: 'Spend, Date, Impressions', angleDeg: 108, x: 820, y: 330, vx: -0.6, vy: -0.5, radius: 28, mass: 1, isDragging: false, dragOffsetX: 0, dragOffsetY: 0, lastMouseX: 0, lastMouseY: 0 },
    { id: 'shopify', name: 'Shopify Store', category: 'revenue', color: '#96BF48', icon: <ShopifyIcon size={26} />, hint: 'Target: Net Sales / Orders', angleDeg: 144, x: 180, y: 460, vx: 0.3, vy: -0.7, radius: 28, mass: 1, isDragging: false, dragOffsetX: 0, dragOffsetY: 0, lastMouseX: 0, lastMouseY: 0 },
    { id: 'stripe', name: 'Stripe Payments', category: 'revenue', color: '#635BFF', icon: <StripeIcon size={26} />, hint: 'Target: Daily Gross Sales', angleDeg: 180, x: 720, y: 470, vx: -0.5, vy: -0.4, radius: 28, mass: 1, isDragging: false, dragOffsetX: 0, dragOffsetY: 0, lastMouseX: 0, lastMouseY: 0 },
    { id: 'youtube', name: 'YouTube Ads', category: 'ad', color: '#FF0000', icon: <YouTubeIcon size={26} />, hint: 'Video Cost, Views, Dates', angleDeg: 216, x: 450, y: 60, vx: 0.2, vy: 0.8, radius: 28, mass: 1, isDragging: false, dragOffsetX: 0, dragOffsetY: 0, lastMouseX: 0, lastMouseY: 0 },
    { id: 'linkedin', name: 'LinkedIn Ads', category: 'ad', color: '#0A66C2', icon: <LinkedInIcon size={26} />, hint: 'Total Spent, Start Date', angleDeg: 252, x: 300, y: 500, vx: 0.6, vy: -0.6, radius: 28, mass: 1, isDragging: false, dragOffsetX: 0, dragOffsetY: 0, lastMouseX: 0, lastMouseY: 0 },
    { id: 'apple', name: 'Apple Search', category: 'ad', color: '#0071E3', icon: <AppleIcon size={26} />, hint: 'Spend & Search Terms', angleDeg: 288, x: 620, y: 500, vx: -0.7, vy: 0.3, radius: 28, mass: 1, isDragging: false, dragOffsetX: 0, dragOffsetY: 0, lastMouseX: 0, lastMouseY: 0 },
    { id: 'pinterest', name: 'Pinterest Ads', category: 'ad', color: '#E60023', icon: <PinterestIcon size={26} />, hint: 'Paid Spend & Pin Clicks', angleDeg: 324, x: 460, y: 510, vx: 0.4, vy: 0.5, radius: 28, mass: 1, isDragging: false, dragOffsetX: 0, dragOffsetY: 0, lastMouseX: 0, lastMouseY: 0 },
  ]);

  // Forces re-render on physics tick
  const [, setTick] = useState<number>(0);

  // Active dragging ref for mouse tracking
  const activeDragNodeId = useRef<string | null>(null);

  // 60FPS Physics Simulation Engine Loop
  useEffect(() => {
    let lastTime = performance.now();

    const physicsLoop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap delta time to 50ms
      lastTime = now;

      const arena = arenaRef.current;
      if (arena) {
        const width = arena.clientWidth || 900;
        const height = arena.clientHeight || 560;
        const centerX = width / 2;
        const centerY = height / 2;

        const nodes = nodesRef.current;
        const n = nodes.length;

        // Central Dropzone bounding obstacle
        const dropBox = {
          left: centerX - 230,
          right: centerX + 230,
          top: centerY - 150,
          bottom: centerY + 150,
        };

        // 1. Apply Forces to each node
        for (let i = 0; i < n; i++) {
          const node = nodes[i];

          if (node.isDragging) {
            // Dragged by user cursor: velocity damped
            continue;
          }

          if (converged) {
            // CONVERGED MODE: Spring force pulling node to its designated orbit position
            const rad = (node.angleDeg * Math.PI) / 180;
            const orbitRx = Math.min(320, width * 0.35);
            const orbitRy = Math.min(220, height * 0.36);
            const targetX = centerX + Math.cos(rad) * orbitRx;
            const targetY = centerY + Math.sin(rad) * orbitRy;

            const springK = 8.5; // spring stiffness
            const fx = -springK * (node.x - targetX);
            const fy = -springK * (node.y - targetY);

            // Ambient breathing drift
            const driftX = Math.sin(now * 0.002 + i) * 6.0;
            const driftY = Math.cos(now * 0.002 + i) * 6.0;

            node.vx += (fx + driftX) * dt;
            node.vy += (fy + driftY) * dt;

            // Damping / friction
            node.vx *= 0.92;
            node.vy *= 0.92;
          } else {
            // DISPERSED / FREE FLOAT MODE: Brownian organic drift
            const driftX = Math.sin(now * 0.0015 + i * 2) * 12.0;
            const driftY = Math.cos(now * 0.0018 + i * 2) * 12.0;

            node.vx += driftX * dt;
            node.vy += driftY * dt;

            // Gentle air resistance
            node.vx *= 0.97;
            node.vy *= 0.97;
          }

          // Position update
          node.x += node.vx * dt * 50;
          node.y += node.vy * dt * 50;

          // Arena boundary elastic collision
          if (node.x - node.radius < 12) {
            node.x = 12 + node.radius;
            node.vx = -node.vx * 0.75;
          } else if (node.x + node.radius > width - 12) {
            node.x = width - 12 - node.radius;
            node.vx = -node.vx * 0.75;
          }

          if (node.y - node.radius < 12) {
            node.y = 12 + node.radius;
            node.vy = -node.vy * 0.75;
          } else if (node.y + node.radius > height - 12) {
            node.y = height - 12 - node.radius;
            node.vy = -node.vy * 0.75;
          }

          // Elastic bounce off central dropzone box (only if thrown directly inside)
          if (
            node.x + node.radius > dropBox.left &&
            node.x - node.radius < dropBox.right &&
            node.y + node.radius > dropBox.top &&
            node.y - node.radius < dropBox.bottom
          ) {
            // Determine shallowest penetration edge
            const dLeft = Math.abs(node.x - dropBox.left);
            const dRight = Math.abs(node.x - dropBox.right);
            const dTop = Math.abs(node.y - dropBox.top);
            const dBottom = Math.abs(node.y - dropBox.bottom);
            const minD = Math.min(dLeft, dRight, dTop, dBottom);

            if (minD === dLeft) {
              node.x = dropBox.left - node.radius;
              node.vx = -Math.abs(node.vx) * 0.8;
            } else if (minD === dRight) {
              node.x = dropBox.right + node.radius;
              node.vx = Math.abs(node.vx) * 0.8;
            } else if (minD === dTop) {
              node.y = dropBox.top - node.radius;
              node.vy = -Math.abs(node.vy) * 0.8;
            } else {
              node.y = dropBox.bottom + node.radius;
              node.vy = Math.abs(node.vy) * 0.8;
            }
          }
        }

        // 2. Mutual Repulsion / Elastic Collisions between Nodes
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            const nA = nodes[i];
            const nB = nodes[j];

            const dx = nB.x - nA.x;
            const dy = nB.y - nA.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = nA.radius + nB.radius + 6; // 62px separation

            if (dist < minDist && dist > 0.001) {
              const overlap = (minDist - dist) * 0.5;
              const nx = dx / dist;
              const ny = dy / dist;

              // Push apart
              if (!nA.isDragging) {
                nA.x -= nx * overlap;
                nA.y -= ny * overlap;
              }
              if (!nB.isDragging) {
                nB.x += nx * overlap;
                nB.y += ny * overlap;
              }

              // Elastic velocity exchange along normal
              const kx = nA.vx - nB.vx;
              const ky = nA.vy - nB.vy;
              const p = 2 * (nx * kx + ny * ky) / (nA.mass + nB.mass);

              if (!nA.isDragging) {
                nA.vx -= p * nB.mass * nx * 0.85;
                nA.vy -= p * nB.mass * ny * 0.85;
              }
              if (!nB.isDragging) {
                nB.vx += p * nA.mass * nx * 0.85;
                nB.vy += p * nA.mass * ny * 0.85;
              }
            }
          }
        }
      }

      setTick(now);
      animFrameRef.current = requestAnimationFrame(physicsLoop);
    };

    animFrameRef.current = requestAnimationFrame(physicsLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [converged]);

  // Mouse & Touch Drag and Toss Handlers
  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const arena = arenaRef.current;
    if (!arena) return;

    const rect = arena.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const node = nodesRef.current.find((n) => n.id === id);
    if (node) {
      node.isDragging = true;
      node.dragOffsetX = mouseX - node.x;
      node.dragOffsetY = mouseY - node.y;
      node.lastMouseX = mouseX;
      node.lastMouseY = mouseY;
      node.vx = 0;
      node.vy = 0;
      activeDragNodeId.current = id;
    }
  };

  const handleArenaMouseMove = useCallback((e: React.MouseEvent) => {
    if (!activeDragNodeId.current || !arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const node = nodesRef.current.find((n) => n.id === activeDragNodeId.current);
    if (node && node.isDragging) {
      node.x = mouseX - node.dragOffsetX;
      node.y = mouseY - node.dragOffsetY;

      // Calculate instantaneous throw velocity from mouse motion
      node.vx = (mouseX - node.lastMouseX) * 0.8;
      node.vy = (mouseY - node.lastMouseY) * 0.8;

      node.lastMouseX = mouseX;
      node.lastMouseY = mouseY;
    }
  }, []);

  const handleArenaMouseUp = useCallback(() => {
    if (activeDragNodeId.current) {
      const node = nodesRef.current.find((n) => n.id === activeDragNodeId.current);
      if (node) {
        node.isDragging = false;
        // Launch with momentum
        node.vx = Math.max(-25, Math.min(25, node.vx * 1.5));
        node.vy = Math.max(-25, Math.min(25, node.vy * 1.5));
      }
      activeDragNodeId.current = null;
    }
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
    setIsDraggingFile(false);
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
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
            Physics-Enabled Multi-Platform Convergence
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
            Every ad platform can export a CSV. Drag and throw the physics-enabled icons or drop files directly onto the hub.
            Our engine auto-fingerprints headers, normalizes currencies, and aggregates into a weekly econometric matrix.
          </p>

          {/* Interactive Physics Mode Toggle & Hint */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '18px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setConverged(!converged)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                backgroundColor: converged ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${converged ? 'rgba(59, 130, 246, 0.35)' : 'rgba(255, 255, 255, 0.1)'}`,
                color: converged ? '#60A5FA' : '#94A3B8',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <RefreshCw size={13} />
              {converged ? 'Gravity Mode: Orbital Lock' : 'Gravity Mode: Free Float Constellation'}
            </button>

            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Move size={12} />
              Grab & toss any icon with your cursor
            </span>
          </div>
        </div>

        {/* Physics-Enabled Arena Container */}
        <div
          ref={arenaRef}
          onMouseMove={handleArenaMouseMove}
          onMouseUp={handleArenaMouseUp}
          onMouseLeave={handleArenaMouseUp}
          style={{
            position: 'relative',
            minHeight: '560px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(14, 19, 31, 0.7)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflow: 'hidden',
            userSelect: 'none'
          }}
        >
          {/* Visual Orbital Guides */}
          <div style={{
            position: 'absolute',
            width: '460px',
            height: '460px',
            borderRadius: '50%',
            border: '1px dashed rgba(59, 130, 246, 0.14)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            width: '680px',
            height: '680px',
            borderRadius: '50%',
            border: '1px dashed rgba(6, 182, 212, 0.06)',
            pointerEvents: 'none'
          }} />

          {/* Physics Platform Nodes */}
          {nodesRef.current.map((p) => {
            const isConnected = isPlatformConnected(p.id);

            return (
              <div
                key={p.id}
                onMouseDown={(e) => handleNodeMouseDown(e, p.id)}
                onMouseEnter={() => setHoveredNode(p.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  position: 'absolute',
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: p.isDragging ? 50 : hoveredNode === p.id ? 40 : 25,
                  cursor: p.isDragging ? 'grabbing' : 'grab'
                }}
              >
                <div style={{
                  position: 'relative',
                  width: `${p.radius * 2}px`,
                  height: `${p.radius * 2}px`,
                  borderRadius: '16px',
                  backgroundColor: isConnected ? 'rgba(16, 185, 129, 0.18)' : 'rgba(18, 24, 38, 0.95)',
                  border: `2px solid ${isConnected ? '#10B981' : hoveredNode === p.id || p.isDragging ? p.color : 'rgba(255, 255, 255, 0.12)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isConnected
                    ? '0 0 25px rgba(16, 185, 129, 0.55)'
                    : p.isDragging || hoveredNode === p.id
                    ? `0 0 25px ${p.color}80`
                    : '0 8px 24px rgba(0, 0, 0, 0.5)',
                  transition: p.isDragging ? 'none' : 'box-shadow 0.2s, border-color 0.2s'
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
                {hoveredNode === p.id && !p.isDragging && (
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
            onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
            onDragLeave={() => setIsDraggingFile(false)}
            onDrop={handleDrop}
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '36px 28px',
              borderRadius: '20px',
              backgroundColor: isDraggingFile ? 'rgba(59, 130, 246, 0.15)' : 'rgba(7, 9, 14, 0.92)',
              border: `2px dashed ${isDraggingFile ? '#3B82F6' : dataset ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.18)'}`,
              boxShadow: isDraggingFile ? '0 0 40px rgba(59, 130, 246, 0.4)' : '0 12px 40px rgba(0, 0, 0, 0.7)',
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
