import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Clock,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  ZoomIn,
  ZoomOut,
  Eye,
  EyeOff
} from 'lucide-react';
import { AnyCognitiveNode, GraphEdge } from '../types';
import { getNodeVisualDescriptor } from '../utils/nodeVisualDescriptor';
import { computeAppearYears, getNodeStrataLayer } from '../utils/graphDimensions';

interface TemporalNetworkGraphProps {
  nodes: AnyCognitiveNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  onSelectNode: (node: AnyCognitiveNode | null) => void;
  simulationYear: number;
}

interface SpatialNode {
  id: string;
  name: string;
  category: AnyCognitiveNode['category'];
  radius: number;
  appearYear: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const PALETTE: Record<string, { main: string; glow: string }> = {
  formation: { main: '#a855f7', glow: 'rgba(168, 85, 247, 0.55)' },
  experience: { main: '#3b82f6', glow: 'rgba(59, 130, 246, 0.55)' },
  research_project: { main: '#60a5fa', glow: 'rgba(96, 165, 250, 0.55)' },
  task: { main: '#6366f1', glow: 'rgba(99, 102, 241, 0.55)' },
  skill_tech: { main: '#06b6d4', glow: 'rgba(6, 182, 212, 0.55)' },
  skill_transversal: { main: '#14b8a6', glow: 'rgba(20, 184, 166, 0.55)' },
  skill_relational: { main: '#10b981', glow: 'rgba(16, 185, 129, 0.55)' },
  knowledge: { main: '#0284c7', glow: 'rgba(2, 132, 199, 0.55)' },
  capacity_cognitive: { main: '#ec4899', glow: 'rgba(236, 72, 153, 0.55)' },
  horizon_job: { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.55)' }
};

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const p = Math.max(0, Math.min(1, t));
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export const TemporalNetworkGraph: React.FC<TemporalNetworkGraphProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  simulationYear
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const spatialRef = useRef<SpatialNode[]>([]);
  const playheadRef = useRef<number>(0);
  const playingRef = useRef<boolean>(true);
  const lastFrameRef = useRef<number>(0);
  const zoomRef = useRef<number>(0.92);
  const panRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const latestEventRef = useRef<string>('');
  const uiTickRef = useRef<number>(0);

  const appearYears = useMemo(() => computeAppearYears(nodes), [nodes]);

  const yearBounds = useMemo(() => {
    const values = Array.from(appearYears.values());
    if (values.length === 0) return { min: 2013, max: 2026 };
    return {
      min: Math.floor(Math.min(...values)),
      max: Math.ceil(Math.max(...values, simulationYear))
    };
  }, [appearYears, simulationYear]);

  const [playhead, setPlayhead] = useState<number>(yearBounds.min);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(0.92);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showGhosts, setShowGhosts] = useState<boolean>(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [latestEvent, setLatestEvent] = useState<string>('');

  playheadRef.current = playhead;
  playingRef.current = isPlaying;
  zoomRef.current = zoom;
  panRef.current = pan;

  const nodeDegrees = useMemo(() => {
    const deg = new Map<string, number>();
    nodes.forEach((n) => deg.set(n.id, 0));
    edges.forEach((e) => {
      deg.set(e.source, (deg.get(e.source) || 0) + 1);
      deg.set(e.target, (deg.get(e.target) || 0) + 1);
    });
    return deg;
  }, [nodes, edges]);

  const settleLayout = useCallback(() => {
    const spatial = spatialRef.current;
    const byId = new Map(spatial.map((n) => [n.id, n]));

    for (let tick = 0; tick < 220; tick++) {
      for (let i = 0; i < spatial.length; i++) {
        const n1 = spatial[i];
        for (let j = i + 1; j < spatial.length; j++) {
          const n2 = spatial[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 300) {
            const force = Math.min(2.4, 680 / (dist * dist));
            n1.vx -= (dx / dist) * force;
            n1.vy -= (dy / dist) * force;
            n2.vx += (dx / dist) * force;
            n2.vy += (dy / dist) * force;
          }
        }
      }

      edges.forEach((edge) => {
        const n1 = byId.get(edge.source);
        const n2 = byId.get(edge.target);
        if (!n1 || !n2) return;
        let target = 100;
        if (edge.type === 'composed_of') target = 68;
        else if (edge.type === 'demonstrates_skill' || edge.type === 'acquired_in') target = 82;
        else if (edge.type === 'feeds_capacity') target = 112;
        else if (edge.type === 'unlocks_horizon') target = 138;
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.hypot(dx, dy) || 1;
        const force = Math.max(-2.2, Math.min(2.2, (dist - target) * 0.02));
        n1.vx += (dx / dist) * force;
        n1.vy += (dy / dist) * force;
        n2.vx -= (dx / dist) * force;
        n2.vy -= (dy / dist) * force;
      });

      spatial.forEach((n) => {
        n.vx -= n.x * 0.0034;
        n.vy -= n.y * 0.0034;
        n.vx *= 0.76;
        n.vy *= 0.76;
        n.x += n.vx;
        n.y += n.vy;
      });
    }

    spatial.forEach((n) => {
      n.vx = 0;
      n.vy = 0;
    });
  }, [edges]);

  useEffect(() => {
    spatialRef.current = nodes.map((node, index) => {
      const layer = getNodeStrataLayer(node);
      const degree = nodeDegrees.get(node.id) || 1;
      let radius = 12 + Math.min(18, degree * 1.8);
      if (node.category === 'experience' || node.category === 'formation') radius += 4;
      if (node.category === 'horizon_job') radius += 3;
      const angle = (index / Math.max(1, nodes.length)) * Math.PI * 2 + layer * 1.15;
      const dist = 110 + ((index * 43) % 230);
      return {
        id: node.id,
        name: node.name,
        category: node.category,
        radius,
        appearYear: appearYears.get(node.id) ?? yearBounds.min,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        vx: 0,
        vy: 0
      };
    });
    settleLayout();
    setPlayhead(yearBounds.min);
    playheadRef.current = yearBounds.min;
    setIsPlaying(true);
    latestEventRef.current = '';
    setLatestEvent('');
  }, [nodes, nodeDegrees, appearYears, yearBounds.min, settleLayout]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    lastFrameRef.current = performance.now();

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - lastFrameRef.current) / 1000);
      lastFrameRef.current = now;

      if (playingRef.current) {
        const next = playheadRef.current + dt * speed * 0.85;
        if (next >= yearBounds.max + 0.35) {
          playheadRef.current = yearBounds.max + 0.35;
          playingRef.current = false;
          setIsPlaying(false);
          setPlayhead(playheadRef.current);
        } else {
          playheadRef.current = next;
          uiTickRef.current += dt;
          if (uiTickRef.current > 0.08) {
            uiTickRef.current = 0;
            setPlayhead(next);
          }
        }
      }

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const currentZoom = zoomRef.current;
      const currentPan = panRef.current;
      const t = playheadRef.current;

      ctx.save();
      ctx.clearRect(0, 0, width, height);
      const bg = ctx.createRadialGradient(width / 2, height / 2, 30, width / 2, height / 2, Math.max(width, height) * 0.85);
      bg.addColorStop(0, '#1a1c24');
      bg.addColorStop(0.7, '#111218');
      bg.addColorStop(1, '#0b0c10');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      ctx.translate(currentPan.x, currentPan.y);
      ctx.scale(currentZoom, currentZoom);

      const rawMap = new Map(nodes.map((n) => [n.id, n]));
      const projected = spatialRef.current.map((n) => ({
        ...n,
        sx: width / 2 + n.x,
        sy: height / 2 + n.y,
        activation: clamp01((t - n.appearYear) / 0.38)
      }));
      const projMap = new Map(projected.map((p) => [p.id, p]));

      let newestName = '';
      let newestYear = -Infinity;
      let newestActivation = 1;
      projected.forEach((p) => {
        if (p.activation > 0 && p.appearYear <= t && p.appearYear > newestYear) {
          newestYear = p.appearYear;
          newestName = p.name;
          newestActivation = p.activation;
        }
      });
      if (newestName && newestName !== latestEventRef.current && newestActivation < 0.95) {
        latestEventRef.current = newestName;
        setLatestEvent(newestName);
      }

      edges.forEach((edge) => {
        const src = projMap.get(edge.source);
        const tgt = projMap.get(edge.target);
        if (!src || !tgt) return;
        const edgeYear = Math.max(src.appearYear, tgt.appearYear);
        const grow = clamp01((t - edgeYear) / 0.42);
        if (grow <= 0) return;

        const mx = src.sx + (tgt.sx - src.sx) * grow;
        const my = src.sy + (tgt.sy - src.sy) * grow;
        const palette = PALETTE[src.category] || PALETTE.experience;
        const fresh = grow < 1;

        ctx.beginPath();
        ctx.moveTo(src.sx, src.sy);
        ctx.lineTo(mx, my);
        ctx.strokeStyle = fresh ? 'rgba(125, 211, 252, 0.95)' : palette.glow.replace('0.55', '0.38');
        ctx.lineWidth = fresh ? 2.4 : 1.25;
        ctx.stroke();

        if (grow > 0.18) {
          const tip = Math.min(1, grow);
          const ax = src.sx + (tgt.sx - src.sx) * tip;
          const ay = src.sy + (tgt.sy - src.sy) * tip;
          const angle = Math.atan2(tgt.sy - src.sy, tgt.sx - src.sx);
          ctx.save();
          ctx.translate(ax, ay);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-7, -3.2);
          ctx.lineTo(-7, 3.2);
          ctx.closePath();
          ctx.fillStyle = fresh ? '#7dd3fc' : 'rgba(148, 163, 184, 0.45)';
          ctx.fill();
          ctx.restore();
        }
      });

      const sorted = [...projected].sort((a, b) => a.activation - b.activation);
      sorted.forEach((p) => {
        const raw = rawMap.get(p.id);
        if (!raw) return;
        const palette = PALETTE[p.category] || PALETTE.experience;
        const visual = getNodeVisualDescriptor(raw, simulationYear);
        const isSelected = selectedNodeId === p.id;
        const isHovered = hoveredNodeId === p.id;

        if (p.activation <= 0) {
          if (!showGhosts) return;
          ctx.save();
          ctx.globalAlpha = 0.16;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, p.radius * 0.62, 0, Math.PI * 2);
          ctx.fillStyle = '#27272a';
          ctx.fill();
          ctx.setLineDash([3, 3]);
          ctx.strokeStyle = '#52525b';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
          return;
        }

        const pop = easeOutBack(p.activation);
        const r = p.radius * (0.25 + 0.75 * pop);
        const pulse = p.activation < 1 ? 1 + Math.sin(now * 0.012) * 0.08 : 1;

        ctx.save();
        if (p.activation < 1 || isSelected || isHovered) {
          const glowR = r + 14 * (p.activation < 1 ? 1 : 0.7);
          const glow = ctx.createRadialGradient(p.sx, p.sy, r * 0.2, p.sx, p.sy, glowR);
          glow.addColorStop(0, palette.glow);
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, glowR * pulse, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        const body = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, r);
        body.addColorStop(0, palette.main);
        body.addColorStop(1, 'rgba(0,0,0,0.4)');
        ctx.fillStyle = body;
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255,255,255,0.45)';
        ctx.lineWidth = isSelected ? 2.6 : 1.2;
        ctx.stroke();

        if (r > 11) {
          ctx.font = `${Math.max(9, Math.round(r * 0.72))}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(visual.symbol, p.sx, p.sy);
        }

        if (p.activation > 0.55 || isSelected || isHovered) {
          ctx.font = isSelected || isHovered ? '600 11px Inter, system-ui, sans-serif' : '400 10px Inter, system-ui, sans-serif';
          ctx.fillStyle = isSelected || isHovered ? '#ffffff' : 'rgba(226, 232, 240, 0.82)';
          ctx.shadowColor = 'rgba(0,0,0,0.9)';
          ctx.shadowBlur = 4;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          const label = p.name.length > 26 && !isSelected && !isHovered ? `${p.name.slice(0, 24)}…` : p.name;
          ctx.fillText(label, p.sx, p.sy + r + 5);
          ctx.shadowBlur = 0;
        }
        ctx.restore();
      });

      ctx.restore();
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [nodes, edges, selectedNodeId, hoveredNodeId, showGhosts, speed, yearBounds.max, simulationYear]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, rawX: 0, rawY: 0 };
    const rect = canvas.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    return { x: (rawX - pan.x) / zoom, y: (rawY - pan.y) / zoom, rawX, rawY };
  };

  const findNodeAt = (rawX: number, rawY: number): AnyCognitiveNode | undefined => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    const rawMap = new Map(nodes.map((n) => [n.id, n]));
    const t = playheadRef.current;

    for (let i = spatialRef.current.length - 1; i >= 0; i--) {
      const n = spatialRef.current[i];
      if (t < n.appearYear && !showGhosts) continue;
      const sx = width / 2 + n.x;
      const sy = height / 2 + n.y;
      const dx = (rawX - pan.x) / zoom - sx;
      const dy = (rawY - pan.y) / zoom - sy;
      if (dx * dx + dy * dy <= (n.radius + 6) * (n.radius + 6)) {
        return rawMap.get(n.id);
      }
    }
    return undefined;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    const coords = getCanvasCoords(e);
    const clicked = findNodeAt(coords.rawX, coords.rawY);
    if (clicked) {
      onSelectNode(clicked);
    } else {
      setIsDraggingCanvas(true);
      setDragStart({ x: coords.rawX - pan.x, y: coords.rawY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    if (isDraggingCanvas) {
      const next = { x: coords.rawX - dragStart.x, y: coords.rawY - dragStart.y };
      setPan(next);
      panRef.current = next;
    } else {
      const hovered = findNodeAt(coords.rawX, coords.rawY);
      setHoveredNodeId(hovered ? hovered.id : null);
    }
  };

  const handleMouseUp = () => setIsDraggingCanvas(false);

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const next = Math.max(0.28, Math.min(3, zoom * (e.deltaY < 0 ? 1.08 : 0.92)));
    setZoom(next);
    zoomRef.current = next;
  };

  const activeCount = useMemo(
    () => nodes.filter((n) => (appearYears.get(n.id) ?? yearBounds.max) <= playhead).length,
    [nodes, appearYears, playhead, yearBounds.max]
  );
  const activeEdges = useMemo(() => {
    return edges.filter((edge) => {
      const sy = appearYears.get(edge.source);
      const ty = appearYears.get(edge.target);
      if (sy === undefined || ty === undefined) return false;
      return Math.max(sy, ty) <= playhead;
    }).length;
  }, [edges, appearYears, playhead]);

  const replay = () => {
    playheadRef.current = yearBounds.min;
    setPlayhead(yearBounds.min);
    setIsPlaying(true);
    setLatestEvent('');
  };

  return (
    <div
      id="cognitorium-temporal-network-view"
      className="relative w-full h-[740px] bg-[#111218] rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col font-sans select-none"
    >
      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-[#1e1f24]/90 backdrop-blur-md border border-cyan-500/30 px-3 py-2 rounded-xl shadow-lg text-zinc-200">
          <Clock className="w-4 h-4 text-cyan-300" />
          <div>
            <div className="text-xs font-bold text-cyan-100">Graphe temporel</div>
            <p className="text-[10px] text-zinc-400">Les ronds s'allument, les liens se tissent.</p>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <div className="px-3 py-1.5 bg-[#1e1f24]/90 backdrop-blur-md border border-zinc-700 rounded-xl text-[11px] text-zinc-300">
            <span className="text-cyan-300 font-bold">{activeCount}</span> nœuds ·{' '}
            <span className="text-sky-300 font-bold">{activeEdges}</span> liens
          </div>
          <button
            id="temporal-ghost-toggle"
            onClick={() => setShowGhosts((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1f24]/90 border border-zinc-700 rounded-xl text-[11px] text-zinc-300 hover:text-white"
            title="Afficher les nœuds futurs en filigrane"
          >
            {showGhosts ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showGhosts ? 'Futur visible' : 'Futur masqué'}</span>
          </button>
        </div>
      </div>

      {latestEvent && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 max-w-md px-3 py-1.5 bg-cyan-500/15 border border-cyan-400/40 text-cyan-100 text-[11px] font-semibold rounded-full backdrop-blur-md pointer-events-none">
          + {latestEvent}
        </div>
      )}

      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="w-full h-full block"
        />
      </div>

      <div className="absolute bottom-4 left-4 right-20 z-20 bg-[#1e1f24]/95 backdrop-blur-md border border-cyan-500/35 p-3 rounded-2xl shadow-2xl text-white flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-cyan-400 text-slate-950 rounded font-black text-[11px]">
              {playhead.toFixed(1)}
            </span>
            <span className="text-[11px] text-zinc-400 hidden sm:inline">
              Apparition chronologique du réseau cognitif
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              id="temporal-skip-start"
              onClick={() => {
                playheadRef.current = yearBounds.min;
                setPlayhead(yearBounds.min);
              }}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300"
              title="Revenir au début"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              id="temporal-play-btn"
              onClick={() => setIsPlaying((p) => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl text-xs"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Lecture'}</span>
            </button>
            <button
              id="temporal-skip-end"
              onClick={() => {
                playheadRef.current = yearBounds.max;
                setPlayhead(yearBounds.max);
                setIsPlaying(false);
              }}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300"
              title="Aller à la fin"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <button
              id="temporal-speed-btn"
              onClick={() => setSpeed((s) => (s === 1 ? 2 : s === 2 ? 4 : 1))}
              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold rounded-xl text-xs"
            >
              {speed}x
            </button>
            <button
              id="temporal-replay-btn"
              onClick={replay}
              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold rounded-xl text-xs"
            >
              Rejouer
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-zinc-400">{yearBounds.min}</span>
          <input
            id="temporal-year-slider"
            type="range"
            min={yearBounds.min}
            max={yearBounds.max}
            step={0.05}
            value={Math.max(yearBounds.min, Math.min(yearBounds.max, playhead))}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              playheadRef.current = v;
              setPlayhead(v);
              setIsPlaying(false);
            }}
            className="flex-1 accent-cyan-400 cursor-pointer h-2 bg-zinc-800 rounded-lg"
          />
          <span className="text-[11px] font-mono text-zinc-400">{yearBounds.max}</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-20 flex flex-col items-center gap-1 bg-[#1e1f24]/90 backdrop-blur-md p-1 rounded-xl shadow-lg border border-zinc-700/80">
        <button
          onClick={() => {
            const next = Math.min(3, zoom * 1.18);
            setZoom(next);
            zoomRef.current = next;
          }}
          className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            const next = Math.max(0.28, zoom * 0.82);
            setZoom(next);
            zoomRef.current = next;
          }}
          className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setZoom(0.92);
            zoomRef.current = 0.92;
            setPan({ x: 0, y: 0 });
            panRef.current = { x: 0, y: 0 };
            onSelectNode(null);
          }}
          className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
