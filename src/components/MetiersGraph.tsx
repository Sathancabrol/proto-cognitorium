import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Clock,
  Lock,
  Network,
  Plus,
  RotateCcw,
  Search,
  Unlock,
  X,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { CognitiveProfile, HorizonJobNode } from '../types';
import {
  COMPAT_META,
  KIND_META,
  MetierCompat,
  MetierGraphNode,
  MetierKind,
  ROME_DOMAIN_META,
  buildMetiersGraph
} from '../utils/metiersGraphData';

type DimensionMode = '2d' | 'proximity';
type SourceKey = 'exercised' | 'equivalent' | 'voisin' | 'horizon' | 'suggestion';

interface SpatialNode {
  id: string;
  x2d: number;
  y2d: number;
  vx: number;
  vy: number;
  xProx: number;
  yProx: number;
  radius: number;
}

interface MetiersGraphProps {
  profile: CognitiveProfile;
  selectedNodeId: string | null;
  onSelectNode: (node: HorizonJobNode | null) => void;
  onAddHorizon?: (horizon: HorizonJobNode) => void;
}

const ALL_COMPAT: MetierCompat[] = ['tres_forte', 'forte', 'moderee', 'explorer'];
const ALL_SOURCES: SourceKey[] = ['exercised', 'equivalent', 'voisin', 'horizon', 'suggestion'];
const SOURCE_OF_KIND: Record<Exclude<MetierKind, 'domain'>, SourceKey> = {
  exercised: 'exercised',
  equivalent: 'equivalent',
  voisin: 'voisin',
  horizon: 'horizon',
  suggestion: 'suggestion'
};
const SOURCE_STYLE: Record<SourceKey, string> = {
  exercised: 'bg-orange-600 text-white font-semibold',
  equivalent: 'bg-fuchsia-700 text-white font-semibold',
  voisin: 'bg-teal-700 text-white font-semibold',
  horizon: 'bg-sky-700 text-white font-semibold',
  suggestion: 'bg-indigo-700 text-white font-semibold'
};

export const MetiersGraph: React.FC<MetiersGraphProps> = ({
  profile,
  selectedNodeId,
  onSelectNode,
  onAddHorizon
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const spatialRef = useRef<SpatialNode[]>([]);

  const [dimensionMode, setDimensionMode] = useState<DimensionMode>('2d');
  const [isPhysicsLocked, setIsPhysicsLocked] = useState(false);
  const [zoom, setZoom] = useState(0.92);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [graphFocusId, setGraphFocusId] = useState<string | null>(null);

  const graph = useMemo(() => buildMetiersGraph(profile, 90), [profile]);
  const { nodes, edges } = graph;

  const presentLetters = useMemo(
    () => Array.from(new Set(nodes.filter((n) => n.kind !== 'domain').map((n) => n.domainLetter))).sort(),
    [nodes]
  );

  const [domainFilters, setDomainFilters] = useState<Set<string>>(new Set());
  const [compatFilters, setCompatFilters] = useState<Set<MetierCompat>>(new Set(ALL_COMPAT));
  const [sourceFilters, setSourceFilters] = useState<Set<SourceKey>>(new Set(ALL_SOURCES));

  useEffect(() => {
    setDomainFilters(new Set(presentLetters));
  }, [presentLetters.join('|')]);

  const nodeDegrees = useMemo(() => {
    const deg = new Map<string, number>();
    nodes.forEach((n) => deg.set(n.id, 0));
    edges.forEach((e) => {
      deg.set(e.source, (deg.get(e.source) || 0) + 1);
      deg.set(e.target, (deg.get(e.target) || 0) + 1);
    });
    return deg;
  }, [nodes, edges]);

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const focusId = graphFocusId || (selectedNodeId && nodeMap.has(selectedNodeId) ? selectedNodeId : null);

  const reactivatedSubgraph = useMemo(() => {
    if (!focusId) return null;
    const root = nodeMap.get(focusId);
    if (!root) return null;
    const ids = new Set<string>([focusId]);
    let queue = [focusId];
    for (let depth = 0; depth < 2; depth++) {
      const next: string[] = [];
      for (const id of queue) {
        edges.forEach((e) => {
          if (e.source === id && !ids.has(e.target)) {
            ids.add(e.target);
            next.push(e.target);
          } else if (e.target === id && !ids.has(e.source)) {
            ids.add(e.source);
            next.push(e.source);
          }
        });
      }
      queue = next;
    }
    const related = nodes.filter((n) => ids.has(n.id));
    return {
      root,
      nodeIds: ids,
      count: ids.size,
      jobs: related.filter((n) => n.kind !== 'domain').length,
      domains: related.filter((n) => n.kind === 'domain').length
    };
  }, [focusId, nodeMap, nodes, edges]);

  const hoveredNeighbors = useMemo(() => {
    if (!hoveredNodeId) return new Set<string>();
    const set = new Set<string>([hoveredNodeId]);
    edges.forEach((e) => {
      if (e.source === hoveredNodeId) set.add(e.target);
      if (e.target === hoveredNodeId) set.add(e.source);
    });
    return set;
  }, [hoveredNodeId, edges]);

  useEffect(() => {
    const existing = new Map(spatialRef.current.map((n) => [n.id, n]));
    const letterIndex = new Map(presentLetters.map((l, i) => [l, i]));
    const jobsByLetter = new Map<string, MetierGraphNode[]>();
    nodes.filter((n) => n.kind !== 'domain').forEach((n) => {
      const list = jobsByLetter.get(n.domainLetter) || [];
      list.push(n);
      jobsByLetter.set(n.domainLetter, list);
    });

    spatialRef.current = nodes.map((node) => {
      const prev = existing.get(node.id);
      const li = letterIndex.get(node.domainLetter) ?? 0;
      const angle = (li / Math.max(1, presentLetters.length)) * Math.PI * 2;
      const hubDist = 260;
      let x = Math.cos(angle) * hubDist;
      let y = Math.sin(angle) * hubDist;
      let radius = 18;

      if (node.kind === 'domain') {
        radius = 26;
      } else {
        const siblings = jobsByLetter.get(node.domainLetter) || [];
        const si = Math.max(0, siblings.findIndex((s) => s.id === node.id));
        const sa = angle + ((si - (siblings.length - 1) / 2) * 0.28);
        const sd = 70 + (si % 4) * 18;
        x = Math.cos(angle) * hubDist + Math.cos(sa) * sd;
        y = Math.sin(angle) * hubDist + Math.sin(sa) * sd;
        radius = (node.kind === 'exercised' ? 16 : 12) + Math.min(14, node.matchScore / 10);
      }

      const proxX = node.kind === 'domain' ? -520 : (node.matchScore / 100 - 0.5) * 1100;
      const proxY = (li - (presentLetters.length - 1) / 2) * 92 + (node.kind === 'domain' ? 0 : ((node.id.length % 5) - 2) * 14);

      return {
        id: node.id,
        x2d: prev?.x2d ?? x,
        y2d: prev?.y2d ?? y,
        vx: prev?.vx ?? 0,
        vy: prev?.vy ?? 0,
        xProx: proxX,
        yProx: proxY,
        radius
      };
    });
  }, [nodes, presentLetters]);

  const jobVisible = useCallback(
    (node: MetierGraphNode) => {
      if (node.kind === 'domain') return true;
      if (!sourceFilters.has(SOURCE_OF_KIND[node.kind])) return false;
      if (!compatFilters.has(node.compat)) return false;
      if (domainFilters.size > 0 && !domainFilters.has(node.domainLetter)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          node.name.toLowerCase().includes(q) ||
          (node.romeCode || '').toLowerCase().includes(q) ||
          node.domainLabel.toLowerCase().includes(q) ||
          (node.domaine || '').toLowerCase().includes(q)
        );
      }
      return true;
    },
    [sourceFilters, compatFilters, domainFilters, searchQuery]
  );

  const isVisible = useCallback(
    (node: MetierGraphNode) => {
      if (reactivatedSubgraph?.nodeIds.has(node.id)) return true;
      if (node.kind === 'domain') {
        return nodes.some((n) => n.kind !== 'domain' && n.domainLetter === node.domainLetter && jobVisible(n));
      }
      return jobVisible(node);
    },
    [jobVisible, nodes, reactivatedSubgraph]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      ctx.save();
      ctx.clearRect(0, 0, width, height);
      const bg = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, Math.max(width, height) * 0.85);
      bg.addColorStop(0, '#1c1d22');
      bg.addColorStop(0.65, '#131417');
      bg.addColorStop(1, '#0c0d0f');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      if (dimensionMode === '2d') {
        const gridSize = 45;
        const startX = -pan.x / zoom - 400;
        const endX = startX + width / zoom + 800;
        const startY = -pan.y / zoom - 400;
        const endY = startY + height / zoom + 800;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        for (let x = Math.floor(startX / gridSize) * gridSize; x < endX; x += gridSize) {
          for (let y = Math.floor(startY / gridSize) * gridSize; y < endY; y += gridSize) {
            ctx.beginPath();
            ctx.arc(x + width / 2, y + height / 2, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      if (dimensionMode === 'proximity') {
        const lineY = height / 2 + 250;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 560, lineY);
        ctx.lineTo(width / 2 + 560, lineY);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = 3;
        ctx.stroke();
        for (const tick of [0, 25, 50, 75, 100]) {
          const x = width / 2 + (tick / 100 - 0.5) * 1100;
          ctx.beginPath();
          ctx.moveTo(x, lineY - 8);
          ctx.lineTo(x, lineY + 8);
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.font = '11px sans-serif';
          ctx.fillStyle = '#fbbf24';
          ctx.textAlign = 'center';
          ctx.fillText(`${tick}`, x, lineY + 22);
        }
        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Proximité métier (moteur ROME)', width / 2, lineY + 40);
      }

      const pNodes = spatialRef.current;
      const pMap = new Map(pNodes.map((n) => [n.id, n]));

      if (dimensionMode === '2d') {
        if (!isPhysicsLocked) {
          const baseRepel = 780;
          for (let i = 0; i < pNodes.length; i++) {
            const n1 = pNodes[i];
            for (let j = i + 1; j < pNodes.length; j++) {
              const n2 = pNodes[j];
              const dx = n2.x2d - n1.x2d;
              const dy = n2.y2d - n1.y2d;
              const dist = Math.hypot(dx, dy) || 1;
              if (dist < 320) {
                const force = Math.min(2.8, baseRepel / (Math.max(dist, 28) * Math.max(dist, 28)));
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;
                n1.vx -= fx;
                n1.vy -= fy;
                n2.vx += fx;
                n2.vy += fy;
              }
            }
          }

          edges.forEach((edge) => {
            const n1 = pMap.get(edge.source);
            const n2 = pMap.get(edge.target);
            if (!n1 || !n2) return;
            const targetDist =
              edge.type === 'equivalent' ? 52 : edge.type === 'voisin' ? 88 : edge.type === 'in_domain' ? 78 : 130;
            const stiffness =
              edge.type === 'equivalent' ? 0.04 : edge.type === 'voisin' ? 0.02 : edge.type === 'in_domain' ? 0.026 : 0.012;
            const dx = n2.x2d - n1.x2d;
            const dy = n2.y2d - n1.y2d;
            const dist = Math.hypot(dx, dy) || 1;
            const force = Math.max(-2.5, Math.min(2.5, (dist - targetDist) * stiffness * (0.7 + edge.strength * 0.4)));
            n1.vx += (dx / dist) * force;
            n1.vy += (dy / dist) * force;
            n2.vx -= (dx / dist) * force;
            n2.vy -= (dy / dist) * force;
          });

          pNodes.forEach((n) => {
            n.vx -= n.x2d * 0.0038;
            n.vy -= n.y2d * 0.0038;
            const d = Math.hypot(n.x2d, n.y2d);
            if (d > 560) {
              n.vx -= (n.x2d / d) * (d - 560) * 0.012;
              n.vy -= (n.y2d / d) * (d - 560) * 0.012;
            }
            n.vx *= 0.78;
            n.vy *= 0.78;
            const speed = Math.hypot(n.vx, n.vy);
            if (speed > 2.5) {
              n.vx = (n.vx / speed) * 2.5;
              n.vy = (n.vy / speed) * 2.5;
            }
            if (n.id !== draggedNodeId) {
              n.x2d += n.vx;
              n.y2d += n.vy;
            } else {
              n.vx = 0;
              n.vy = 0;
            }
          });
        } else {
          pNodes.forEach((n) => {
            n.vx = 0;
            n.vy = 0;
          });
        }
      }

      const projected = pNodes.map((n) => {
        const raw = nodeMap.get(n.id);
        const x = width / 2 + (dimensionMode === '2d' ? n.x2d : n.xProx);
        const y = height / 2 + (dimensionMode === '2d' ? n.y2d : n.yProx);
        return { node: n, raw, x, y };
      });
      const projectedMap = new Map(projected.map((p) => [p.node.id, p]));
      const hoverOrFocus = hoveredNodeId || focusId;

      edges.forEach((edge) => {
        const src = projectedMap.get(edge.source);
        const tgt = projectedMap.get(edge.target);
        if (!src?.raw || !tgt?.raw) return;
        if (!isVisible(src.raw) || !isVisible(tgt.raw)) return;
        const inFocus =
          reactivatedSubgraph &&
          reactivatedSubgraph.nodeIds.has(edge.source) &&
          reactivatedSubgraph.nodeIds.has(edge.target);
        const direct = hoverOrFocus && (edge.source === hoverOrFocus || edge.target === hoverOrFocus);
        const dimmed = (reactivatedSubgraph && !inFocus) || (hoverOrFocus && !direct && !reactivatedSubgraph);
        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.strokeStyle = inFocus || direct ? 'rgba(56, 189, 248, 0.95)' : dimmed ? 'rgba(100, 116, 139, 0.05)' : src.raw.glow.replace('0.45', '0.28');
        ctx.lineWidth = inFocus || direct ? 2.4 : dimmed ? 0.8 : edge.type === 'in_domain' ? 1.4 : 1.1;
        ctx.stroke();
      });

      const sorted = [...projected].sort((a, b) => {
        const aF = reactivatedSubgraph?.nodeIds.has(a.node.id) ? 1 : 0;
        const bF = reactivatedSubgraph?.nodeIds.has(b.node.id) ? 1 : 0;
        if (aF !== bF) return aF - bF;
        if (a.node.id === hoverOrFocus) return 1;
        if (b.node.id === hoverOrFocus) return -1;
        return 0;
      });

      sorted.forEach(({ node, raw, x, y }) => {
        if (!raw || !isVisible(raw)) return;
        const isSelected = focusId === node.id;
        const isHovered = hoveredNodeId === node.id;
        const connected = hoveredNeighbors.has(node.id);
        const inSub = reactivatedSubgraph?.nodeIds.has(node.id);
        let dimmed = false;
        if (reactivatedSubgraph) dimmed = !inSub;
        else if (hoverOrFocus) dimmed = !isSelected && !isHovered && !connected;

        ctx.save();
        ctx.globalAlpha = dimmed ? 0.14 : 1;
        if ((isSelected || isHovered || connected || inSub) && !dimmed) {
          const glowR = node.radius + (isSelected ? 16 : isHovered ? 12 : 7);
          const g = ctx.createRadialGradient(x, y, node.radius * 0.4, x, y, glowR);
          g.addColorStop(0, isSelected ? 'rgba(56, 189, 248, 0.85)' : raw.glow);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(x, y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }

        if (raw.kind !== 'domain') {
          ctx.beginPath();
          ctx.arc(x, y, node.radius + 3.5, -Math.PI / 2, -Math.PI / 2 + (raw.matchScore / 100) * Math.PI * 2);
          ctx.strokeStyle = raw.color;
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(x, y, node.radius, 0, Math.PI * 2);
        const body = ctx.createRadialGradient(x, y, 0, x, y, node.radius);
        body.addColorStop(0, raw.color);
        body.addColorStop(0.85, raw.color);
        body.addColorStop(1, 'rgba(0,0,0,0.45)');
        ctx.fillStyle = body;
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#ffffff' : inSub ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.4)';
        ctx.lineWidth = isSelected ? 2.8 : inSub ? 2 : 1.2;
        ctx.stroke();

        ctx.font = `${Math.max(9, Math.round(node.radius * 0.72))}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(raw.symbol, x, y);

        const showLabel =
          !dimmed &&
          (zoom >= 0.65 || isSelected || isHovered || connected || inSub || (nodeDegrees.get(node.id) || 0) >= 4);
        if (showLabel) {
          const hi = isSelected || isHovered || inSub;
          ctx.font = hi ? '600 11px Inter, system-ui, sans-serif' : '400 10px Inter, system-ui, sans-serif';
          ctx.fillStyle = hi ? '#ffffff' : 'rgba(212, 212, 216, 0.8)';
          ctx.shadowColor = 'rgba(0,0,0,0.95)';
          ctx.shadowBlur = 4;
          let label = raw.name;
          if (label.length > 26 && !hi) label = label.slice(0, 24) + '…';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(label, x, y + node.radius + (hi ? 6 : 4));
          ctx.shadowBlur = 0;
        }
        ctx.restore();
      });

      ctx.restore();
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [
    nodes,
    edges,
    nodeMap,
    focusId,
    hoveredNodeId,
    hoveredNeighbors,
    reactivatedSubgraph,
    zoom,
    pan,
    draggedNodeId,
    dimensionMode,
    isPhysicsLocked,
    isVisible,
    nodeDegrees
  ]);

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

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, rawX: 0, rawY: 0 };
    const rect = canvas.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    return { x: (rawX - pan.x) / zoom, y: (rawY - pan.y) / zoom, rawX, rawY };
  };

  const findNodeAt = (rawX: number, rawY: number): MetierGraphNode | undefined => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    const pNodes = spatialRef.current;
    for (let i = pNodes.length - 1; i >= 0; i--) {
      const n = pNodes[i];
      const raw = nodeMap.get(n.id);
      if (!raw || !isVisible(raw)) continue;
      const screenX = width / 2 + (dimensionMode === '2d' ? n.x2d : n.xProx);
      const screenY = height / 2 + (dimensionMode === '2d' ? n.y2d : n.yProx);
      const dx = (rawX - pan.x) / zoom - screenX;
      const dy = (rawY - pan.y) / zoom - screenY;
      if (dx * dx + dy * dy <= (n.radius + 5) * (n.radius + 5)) return raw;
    }
    return undefined;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    const coords = getCanvasCoords(e);
    const clicked = findNodeAt(coords.rawX, coords.rawY);
    if (clicked) {
      setDraggedNodeId(clicked.id);
      setGraphFocusId(clicked.id);
      if (clicked.horizon) onSelectNode(clicked.horizon);
    } else {
      setIsDraggingCanvas(true);
      setDragStart({ x: coords.rawX - pan.x, y: coords.rawY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    if (draggedNodeId && dimensionMode === '2d') {
      const node = spatialRef.current.find((n) => n.id === draggedNodeId);
      if (node) {
        const canvas = canvasRef.current;
        const width = (canvas?.width || 950) / (window.devicePixelRatio || 1);
        const height = (canvas?.height || 680) / (window.devicePixelRatio || 1);
        node.x2d = coords.x - width / 2;
        node.y2d = coords.y - height / 2;
      }
    } else if (isDraggingCanvas) {
      setPan({ x: coords.rawX - dragStart.x, y: coords.rawY - dragStart.y });
    } else {
      const hovered = findNodeAt(coords.rawX, coords.rawY);
      setHoveredNodeId(hovered ? hovered.id : null);
    }
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
    setIsDraggingCanvas(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setZoom((prev) => Math.max(0.25, Math.min(3.2, prev * (e.deltaY < 0 ? 1.08 : 0.92))));
  };

  const handleResetView = () => {
    setZoom(0.92);
    setPan({ x: 0, y: 0 });
    setGraphFocusId(null);
    onSelectNode(null);
    const total = Math.max(1, spatialRef.current.length);
    spatialRef.current.forEach((n, index) => {
      n.vx = 0;
      n.vy = 0;
      const angle = (index / total) * Math.PI * 2;
      const dist = 110 + ((index * 37) % 210);
      n.x2d = Math.cos(angle) * dist;
      n.y2d = Math.sin(angle) * dist;
    });
  };

  const toggleDomain = (letter: string) => {
    setDomainFilters((prev) => {
      const next = new Set(prev);
      if (next.has(letter)) {
        if (next.size > 1) next.delete(letter);
        else return new Set(presentLetters);
      } else next.add(letter);
      return next;
    });
  };

  const toggleCompat = (key: MetierCompat) => {
    setCompatFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
        else return new Set(ALL_COMPAT);
      } else next.add(key);
      return next;
    });
  };

  const toggleSource = (key: SourceKey) => {
    setSourceFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
        else return new Set(ALL_SOURCES);
      } else next.add(key);
      return next;
    });
  };

  const toggleAll = () => {
    const allOn =
      domainFilters.size === presentLetters.length &&
      compatFilters.size === ALL_COMPAT.length &&
      sourceFilters.size === ALL_SOURCES.length;
    if (allOn) {
      setSourceFilters(new Set<SourceKey>(['exercised', 'equivalent', 'voisin']));
      setCompatFilters(new Set(ALL_COMPAT));
    } else {
      setDomainFilters(new Set(presentLetters));
      setCompatFilters(new Set(ALL_COMPAT));
      setSourceFilters(new Set(ALL_SOURCES));
    }
  };

  const hovered = hoveredNodeId ? nodeMap.get(hoveredNodeId) : undefined;
  const jobCount = nodes.filter((n) => n.kind !== 'domain').length;
  const focusedGraphNode = focusId ? nodeMap.get(focusId) : undefined;
  const canAdd =
    !!focusedGraphNode &&
    (focusedGraphNode.kind === 'suggestion' ||
      focusedGraphNode.kind === 'voisin' ||
      focusedGraphNode.kind === 'equivalent') &&
    !!focusedGraphNode.horizon &&
    !!onAddHorizon &&
    !profile.nodes.some((n) => n.category === 'horizon_job' && (n as HorizonJobNode).romeCode === focusedGraphNode.romeCode);

  return (
    <div
      id="cognitorium-metiers-graph"
      className="relative w-full h-[740px] bg-[#141416] rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col font-sans select-none"
    >
      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          <div className="flex items-center p-1 bg-[#1e1f24]/90 backdrop-blur-md border border-zinc-700/70 rounded-xl shadow-lg text-xs font-medium text-zinc-200">
            <button
              id="metiers-dimension-2d"
              onClick={() => setDimensionMode('2d')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                dimensionMode === '2d'
                  ? 'bg-orange-600/90 text-white shadow-md font-semibold ring-1 ring-orange-400/50'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
              title="Graphe métiers force-directed"
            >
              <Network className="w-3.5 h-3.5" />
              <span>Graphe métiers</span>
            </button>
            <button
              id="metiers-dimension-proximity"
              onClick={() => setDimensionMode('proximity')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                dimensionMode === 'proximity'
                  ? 'bg-amber-600/90 text-white shadow-md font-semibold ring-1 ring-amber-400/50'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
              title="Axe de proximité ROME (0–100)"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Par proximité</span>
            </button>
          </div>

          {dimensionMode === '2d' && (
            <button
              id="metiers-lock-toggle-btn"
              onClick={() => setIsPhysicsLocked((p) => !p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all backdrop-blur-md shadow-lg border ${
                isPhysicsLocked
                  ? 'bg-[#1e1f24]/90 text-zinc-400 border-zinc-700/70 hover:text-zinc-200'
                  : 'bg-emerald-600/90 text-white border-emerald-400/50 ring-1 ring-emerald-400/40'
              }`}
              title={isPhysicsLocked ? 'Positions figées — cliquer pour animer' : 'Bulles en mouvement — cliquer pour figer'}
            >
              {isPhysicsLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Figé (Lock)</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
                  <span className="font-semibold">En mouvement (Délock)</span>
                </>
              )}
            </button>
          )}

          <div className="flex items-center gap-1 p-1 bg-[#1e1f24]/90 backdrop-blur-md border border-zinc-700/70 rounded-xl shadow-lg overflow-x-auto max-w-[720px]">
            <button
              id="metiers-filter-all"
              onClick={toggleAll}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                domainFilters.size === presentLetters.length &&
                compatFilters.size === ALL_COMPAT.length &&
                sourceFilters.size === ALL_SOURCES.length
                  ? 'bg-zinc-700 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Tout ({jobCount})
            </button>
            {presentLetters.map((letter) => {
              const meta = ROME_DOMAIN_META[letter];
              const count = nodes.filter((n) => n.kind !== 'domain' && n.domainLetter === letter).length;
              const active = domainFilters.has(letter);
              return (
                <button
                  key={letter}
                  id={`metiers-filter-dom-${letter}`}
                  onClick={() => toggleDomain(letter)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
                    active ? 'text-white font-semibold ring-1 ring-white/20' : 'text-zinc-400 opacity-60 hover:text-zinc-200'
                  }`}
                  style={active ? { backgroundColor: meta?.color || '#71717a' } : undefined}
                  title={nodes.find((n) => n.domainLetter === letter)?.domainLabel || letter}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta?.color || '#a1a1aa' }} />
                  <span>
                    {letter} {meta?.short || ''}
                  </span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              id="metiers-graph-search"
              type="text"
              placeholder="Métier, code ROME, domaine…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-[#1e1f24]/90 backdrop-blur-md rounded-xl text-xs text-zinc-200 placeholder-zinc-500 border border-zinc-700/70 focus:outline-none focus:ring-2 focus:ring-orange-500 w-36 lg:w-52 shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="absolute top-[3.35rem] left-3.5 z-20 pointer-events-auto flex flex-wrap items-center gap-1 p-1 bg-[#1e1f24]/90 backdrop-blur-md border border-zinc-700/70 rounded-xl shadow-lg">
        {ALL_SOURCES.map((key) => {
          const active = sourceFilters.has(key);
          const count = nodes.filter((n) => n.kind === key).length;
          return (
            <button
              key={key}
              id={`metiers-filter-src-${key}`}
              onClick={() => toggleSource(key)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                active ? SOURCE_STYLE[key] : 'text-zinc-400 hover:text-zinc-200 opacity-60'
              }`}
            >
              {KIND_META[key].filterLabel} ({count})
            </button>
          );
        })}
        <span className="w-px h-4 bg-zinc-700 mx-0.5" />
        {ALL_COMPAT.map((key) => {
          const meta = COMPAT_META[key];
          const active = compatFilters.has(key);
          const count = nodes.filter((n) => n.kind !== 'domain' && n.compat === key).length;
          return (
            <button
              key={key}
              id={`metiers-filter-compat-${key}`}
              onClick={() => toggleCompat(key)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
                active ? `${meta.bgActive} text-white font-semibold ring-1 ring-white/20` : 'text-zinc-400 opacity-60 hover:text-zinc-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
              {meta.label}
              <span className="text-[10px] opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {reactivatedSubgraph && (
        <div className="absolute top-28 left-3.5 right-3.5 z-20 flex items-center justify-between gap-3 bg-[#1e1f24]/95 backdrop-blur-xl border border-sky-500/50 px-3.5 py-2 rounded-xl shadow-2xl text-xs text-zinc-200">
          <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
            <span className="w-3 h-3 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: reactivatedSubgraph.root.color }} />
            <span className="font-semibold text-sky-300 shrink-0">Focus métier :</span>
            <span className="font-bold text-white truncate">{reactivatedSubgraph.root.name}</span>
            <span className="hidden md:inline text-zinc-400 border-l border-zinc-700 pl-3">
              {reactivatedSubgraph.jobs} métiers · {reactivatedSubgraph.domains} domaine{reactivatedSubgraph.domains > 1 ? 's' : ''}
            </span>
            {reactivatedSubgraph.root.romeCode && (
              <span className="hidden sm:inline font-mono text-[10px] px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-300">
                ROME {reactivatedSubgraph.root.romeCode}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {canAdd && focusedGraphNode?.horizon && (
              <button
                onClick={() => onAddHorizon?.(focusedGraphNode.horizon!)}
                className="flex items-center gap-1 px-2.5 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium text-[11px]"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter à mes horizons
              </button>
            )}
            <button
              onClick={() => {
                setGraphFocusId(null);
                onSelectNode(null);
              }}
              className="flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-medium text-[11px] border border-zinc-700"
            >
              <X className="w-3.5 h-3.5" />
              Réinitialiser
            </button>
          </div>
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

      {hovered && (
        <div className="absolute bottom-4 left-4 z-20 max-w-sm bg-[#1b1c22]/95 backdrop-blur-xl border border-zinc-700/80 p-3 rounded-2xl shadow-2xl text-zinc-200 pointer-events-none">
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: hovered.color }} />
            <h4 className="text-xs font-bold text-white truncate">{hovered.name}</h4>
            <span className="ml-auto text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-md font-mono">
              {hovered.kind === 'domain' ? 'Domaine' : KIND_META[hovered.kind].label}
            </span>
          </div>
          {hovered.kind !== 'domain' && (
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {hovered.romeCode ? `ROME ${hovered.romeCode} · ` : ''}
              {hovered.domainLabel}
              {` · proximité ${hovered.matchScore}/100`}
              {hovered.livedTitle && hovered.livedTitle !== hovered.name ? ` · lié à « ${hovered.livedTitle} »` : ''}
            </p>
          )}
          {hovered.matchingSkills.length > 0 && (
            <p className="text-[11px] text-emerald-400/90 mt-1 line-clamp-2">
              Compétences : {hovered.matchingSkills.slice(0, 4).join(', ')}
              {hovered.matchingSkills.length > 4 ? '…' : ''}
            </p>
          )}
          <div className="mt-2 pt-1.5 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
            <span>Connexions : {nodeDegrees.get(hovered.id) || 0}</span>
            <span className="text-sky-400 font-medium">Clique pour le sous-graphe</span>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 z-20 flex flex-col items-center gap-1 bg-[#1e1f24]/90 backdrop-blur-md p-1 rounded-xl shadow-lg border border-zinc-700/80">
        {dimensionMode === '2d' && (
          <button
            onClick={() => setIsPhysicsLocked((p) => !p)}
            title={isPhysicsLocked ? 'Mettre en mouvement' : 'Figer'}
            className={`p-1.5 rounded-lg ${isPhysicsLocked ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-emerald-400 bg-emerald-950/60 ring-1 ring-emerald-500/40'}`}
          >
            {isPhysicsLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
        )}
        <button onClick={() => setZoom((z) => Math.min(3.2, z * 1.18))} className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white" title="Zoom avant">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button onClick={() => setZoom((z) => Math.max(0.25, z * 0.82))} className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white" title="Zoom arrière">
          <ZoomOut className="w-4 h-4" />
        </button>
        <button onClick={handleResetView} className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white" title="Recentrer">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {dimensionMode === '2d' && !hovered && !reactivatedSubgraph && (
        <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 bg-[#1e1f24]/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-zinc-700/70 text-xs text-zinc-400">
          {ALL_COMPAT.map((k) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COMPAT_META[k].color }} />
              <span>{COMPAT_META[k].label}</span>
            </div>
          ))}
        </div>
      )}

      {jobCount === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="bg-[#1e1f24]/90 border border-zinc-700 rounded-2xl px-6 py-5 text-center max-w-sm">
            <p className="text-sm font-semibold text-zinc-200">Aucun métier à cartographier</p>
            <p className="text-xs text-zinc-400 mt-1">Ajoute des expériences ou ouvre Horizons ROME pour calculer tes premiers métiers compatibles.</p>
          </div>
        </div>
      )}
    </div>
  );
};
