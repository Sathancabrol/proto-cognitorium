import React, { useEffect, useRef, useState, useMemo } from 'react';
import { AnyCognitiveNode, GraphEdge, NodeCategory } from '../types';
import { calculateSkillVitality, getVitalityStatus } from '../utils/decay';
import { ZoomIn, ZoomOut, RotateCcw, Filter, Eye, Sparkles, Search, Layers, Compass } from 'lucide-react';

interface NetworkGraphProps {
  nodes: AnyCognitiveNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  onSelectNode: (node: AnyCognitiveNode | null) => void;
  simulationYear: number;
  onAddExperienceClick: () => void;
}

type SimulatedNode = AnyCognitiveNode & {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  vitality?: number;
};

const CATEGORY_STYLES: Record<NodeCategory, { label: string; color: string; ringColor: string; bg: string; icon: string }> = {
  experience: {
    label: 'Expériences & Terrains',
    color: '#3b82f6', // Blue
    ringColor: 'rgba(59, 130, 246, 0.4)',
    bg: '#eff6ff',
    icon: '🏗️'
  },
  formation: {
    label: 'Formations & Langues',
    color: '#8b5cf6', // Violet
    ringColor: 'rgba(139, 92, 246, 0.4)',
    bg: '#f5f3ff',
    icon: '🎓'
  },
  skill_tech: {
    label: 'Compétences Techniques',
    color: '#06b6d4', // Cyan
    ringColor: 'rgba(6, 182, 212, 0.4)',
    bg: '#ecfeff',
    icon: '⚙️'
  },
  skill_transversal: {
    label: 'Compétences Transverses',
    color: '#10b981', // Emerald
    ringColor: 'rgba(16, 185, 129, 0.4)',
    bg: '#ecfdf5',
    icon: '🔄'
  },
  skill_relational: {
    label: 'Compétences Humaines',
    color: '#f59e0b', // Amber
    ringColor: 'rgba(245, 158, 11, 0.4)',
    bg: '#fffbeb',
    icon: '🤝'
  },
  capacity_cognitive: {
    label: 'Capacités Cognitives Méta',
    color: '#ec4899', // Pink
    ringColor: 'rgba(236, 72, 153, 0.4)',
    bg: '#fdf2f8',
    icon: '🧠'
  },
  knowledge: {
    label: 'Savoirs & Normes',
    color: '#64748b', // Slate
    ringColor: 'rgba(100, 116, 139, 0.4)',
    bg: '#f8fafc',
    icon: '📚'
  },
  horizon_job: {
    label: 'Horizons & Métiers Potentiels',
    color: '#f97316', // Orange
    ringColor: 'rgba(249, 115, 22, 0.4)',
    bg: '#fff7ed',
    icon: '🧭'
  }
};

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  simulationYear,
  onAddExperienceClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Nodes simulation positions
  const simNodesRef = useRef<SimulatedNode[]>([]);

  // Initialize and synchronize simulation nodes
  useEffect(() => {
    const width = containerRef.current?.clientWidth || 900;
    const height = containerRef.current?.clientHeight || 650;

    // Preserve existing node positions or initialize in structural columns/clusters
    simNodesRef.current = nodes.map((node, index) => {
      const existing = simNodesRef.current.find((n) => n.id === node.id);

      // Deterministic layout initialization based on category layer
      let defaultX = width * 0.5;
      let defaultY = height * 0.5;

      if (node.category === 'experience' || node.category === 'formation') {
        defaultX = width * 0.15;
        defaultY = height * (0.2 + (index % 4) * 0.22);
      } else if (node.category.startsWith('skill_') || node.category === 'knowledge') {
        defaultX = width * 0.45;
        defaultY = height * (0.15 + (index % 6) * 0.14);
      } else if (node.category === 'capacity_cognitive') {
        defaultX = width * 0.68;
        defaultY = height * (0.2 + (index % 4) * 0.22);
      } else if (node.category === 'horizon_job') {
        defaultX = width * 0.88;
        defaultY = height * (0.22 + (index % 3) * 0.28);
      }

      const categoryStyle = CATEGORY_STYLES[node.category] || CATEGORY_STYLES.skill_tech;

      let radius = 24;
      if (node.category === 'experience') radius = 32;
      if (node.category === 'capacity_cognitive') radius = 28;
      if (node.category === 'horizon_job') radius = 30;

      let vitality: number | undefined = undefined;
      if (node.category.startsWith('skill_')) {
        vitality = calculateSkillVitality(node as any, simulationYear, (node as any).isReactivated);
      }

      return {
        ...node,
        x: existing?.x ?? (node.x ?? defaultX),
        y: existing?.y ?? (node.y ?? defaultY),
        vx: existing?.vx ?? 0,
        vy: existing?.vy ?? 0,
        radius,
        color: categoryStyle.color,
        vitality
      };
    });
  }, [nodes, simulationYear]);

  // Compute connected nodes for highlighting lineage
  const connectedNodeIds = useMemo(() => {
    if (!selectedNodeId && !hoveredNodeId) return new Set<string>();
    const activeId = hoveredNodeId || selectedNodeId;
    if (!activeId) return new Set<string>();

    const set = new Set<string>([activeId]);
    edges.forEach((edge) => {
      if (edge.source === activeId) set.add(edge.target);
      if (edge.target === activeId) set.add(edge.source);
    });
    return set;
  }, [selectedNodeId, hoveredNodeId, edges]);

  // Physics animation loop
  useEffect(() => {
    let animationFrameId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      // Soft physics tick to maintain readable organic spacing
      const simNodes = simNodesRef.current;
      for (let i = 0; i < simNodes.length; i++) {
        const n1 = simNodes[i];
        if (n1.id === draggedNodeId) continue;

        // Node-to-node soft repulsion
        for (let j = i + 1; j < simNodes.length; j++) {
          const n2 = simNodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.hypot(dx, dy) || 1;
          const minDist = n1.radius + n2.radius + 40;

          if (dist < minDist) {
            const force = (minDist - dist) / dist * 0.04;
            n1.vx -= dx * force;
            n1.vy -= dy * force;
            n2.vx += dx * force;
            n2.vy += dy * force;
          }
        }

        // Edge spring attraction
        edges.forEach((edge) => {
          if (edge.source === n1.id || edge.target === n1.id) {
            const targetId = edge.source === n1.id ? edge.target : edge.source;
            const targetNode = simNodes.find((n) => n.id === targetId);
            if (targetNode) {
              const dx = targetNode.x - n1.x;
              const dy = targetNode.y - n1.y;
              const dist = Math.hypot(dx, dy) || 1;
              const idealDist = 140;
              const springForce = (dist - idealDist) * 0.0008 * (edge.strength || 0.8);
              n1.vx += (dx / dist) * springForce;
              n1.vy += (dy / dist) * springForce;
            }
          }
        });

        // Layer anchor affinity (maintains left-to-right cognitive flow: Expériences -> Compétences -> Capacités -> Horizons)
        let targetColumnX = width * 0.5;
        if (n1.category === 'experience' || n1.category === 'formation') targetColumnX = width * 0.16;
        else if (n1.category.startsWith('skill_') || n1.category === 'knowledge') targetColumnX = width * 0.44;
        else if (n1.category === 'capacity_cognitive') targetColumnX = width * 0.70;
        else if (n1.category === 'horizon_job') targetColumnX = width * 0.88;

        n1.vx += (targetColumnX - n1.x) * 0.002;

        // Damping
        n1.vx *= 0.85;
        n1.vy *= 0.85;

        n1.x += n1.vx;
        n1.y += n1.vy;

        // Bounds clamping
        n1.x = Math.max(n1.radius + 20, Math.min(width - n1.radius - 20, n1.x));
        n1.y = Math.max(n1.radius + 20, Math.min(height - n1.radius - 20, n1.y));
      }

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Save transform for zoom & pan
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // Draw subtle background structural layer columns
      const columnLabels = [
        { label: '1. Expériences & Projets', x: width * 0.16 },
        { label: '2. Compétences & Savoirs', x: width * 0.44 },
        { label: '3. Capacités Cognitives (Méta)', x: width * 0.70 },
        { label: '4. Horizons & Métiers Possibles', x: width * 0.88 },
      ];

      ctx.save();
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      columnLabels.forEach((col) => {
        ctx.fillText(col.label.toUpperCase(), col.x, 30);
        ctx.beginPath();
        ctx.setLineDash([4, 6]);
        ctx.strokeStyle = 'rgba(226, 232, 240, 0.7)';
        ctx.lineWidth = 1;
        ctx.moveTo(col.x, 42);
        ctx.lineTo(col.x, height - 20);
        ctx.stroke();
      });
      ctx.restore();

      // Draw Edges (Relationships)
      edges.forEach((edge) => {
        const sourceNode = simNodes.find((n) => n.id === edge.source);
        const targetNode = simNodes.find((n) => n.id === edge.target);
        if (!sourceNode || !targetNode) return;

        // Filter check
        const isSourceVisible = activeFilter === 'all' || sourceNode.category.includes(activeFilter);
        const isTargetVisible = activeFilter === 'all' || targetNode.category.includes(activeFilter);
        if (!isSourceVisible && !isTargetVisible) return;

        const isHighlighted =
          connectedNodeIds.has(sourceNode.id) && connectedNodeIds.has(targetNode.id);
        const hasActiveFocus = connectedNodeIds.size > 0;

        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);

        // Curved Bezier line for dynamic biological / neural feel
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2 - 10;
        ctx.quadraticCurveTo(midX, midY, targetNode.x, targetNode.y);

        if (isHighlighted) {
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([]);
        } else if (hasActiveFocus) {
          ctx.strokeStyle = 'rgba(203, 213, 225, 0.25)';
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
        } else {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
          ctx.lineWidth = 1.2;
          if (edge.type === 'synergy_with') {
            ctx.setLineDash([3, 4]);
          } else {
            ctx.setLineDash([]);
          }
        }
        ctx.stroke();

        // Pulsing energy particle along highlighted lines
        if (isHighlighted) {
          const t = (Math.sin(time * 2 + edge.strength * 5) + 1) / 2;
          const px = (1 - t) * (1 - t) * sourceNode.x + 2 * (1 - t) * t * midX + t * t * targetNode.x;
          const py = (1 - t) * (1 - t) * sourceNode.y + 2 * (1 - t) * t * midY + t * t * targetNode.y;

          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#60a5fa';
          ctx.shadowColor = '#3b82f6';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw Nodes
      simNodes.forEach((node) => {
        // Filter match
        const matchesFilter =
          activeFilter === 'all' ||
          (activeFilter === 'skill' && node.category.startsWith('skill_')) ||
          (activeFilter === 'capacity' && node.category === 'capacity_cognitive') ||
          (activeFilter === 'experience' && (node.category === 'experience' || node.category === 'formation')) ||
          (activeFilter === 'horizon' && node.category === 'horizon_job');

        const matchesSearch =
          !searchQuery ||
          node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.description.toLowerCase().includes(searchQuery.toLowerCase());

        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNodeId === node.id;
        const isConnected = connectedNodeIds.has(node.id);
        const hasActiveFocus = connectedNodeIds.size > 0;

        const opacity = (!matchesFilter || !matchesSearch)
          ? 0.15
          : hasActiveFocus && !isConnected
          ? 0.25
          : 1.0;

        ctx.save();
        ctx.globalAlpha = opacity;

        // Calculate decay state / vitality ring for skills
        const style = CATEGORY_STYLES[node.category] || CATEGORY_STYLES.skill_tech;
        let ringColor = style.ringColor;
        let fillColor = style.color;

        if (node.vitality !== undefined) {
          const vitalityStatus = getVitalityStatus(node.vitality);
          fillColor = vitalityStatus.colorHex;
        }

        // Selected / Hovered halo
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? 'rgba(59, 130, 246, 0.25)' : 'rgba(148, 163, 184, 0.2)';
          ctx.fill();
        }

        // Vitality decay halo ring for skills
        if (node.vitality !== undefined) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 4, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * (node.vitality / 100)));
          ctx.strokeStyle = fillColor;
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Main Node Body
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 3;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        ctx.strokeStyle = fillColor;
        ctx.lineWidth = isSelected ? 3.5 : 2;
        ctx.stroke();

        // Category Icon inside Node
        ctx.font = `${node.radius * 0.75}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(style.icon, node.x, node.y - 1);

        // Node Title Label below
        ctx.font = isSelected ? '600 12px sans-serif' : '500 11px sans-serif';
        ctx.fillStyle = isSelected ? '#1e293b' : '#334155';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Multi-line wrap for long node names
        const maxLineWidth = 130;
        const words = node.name.split(' ');
        let line = '';
        let lineY = node.y + node.radius + 6;

        for (let w = 0; w < words.length; w++) {
          const testLine = line + words[w] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxLineWidth && w > 0) {
            ctx.fillText(line.trim(), node.x, lineY);
            line = words[w] + ' ';
            lineY += 13;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line.trim(), node.x, lineY);

        // Vitality percentage tag for skills
        if (node.vitality !== undefined) {
          ctx.font = 'bold 9px sans-serif';
          ctx.fillStyle = fillColor;
          ctx.fillText(`${node.vitality}% vitalité`, node.x, lineY + 14);
        }

        // Match percentage tag for Horizon Jobs
        if (node.category === 'horizon_job' && (node as any).matchScore) {
          ctx.font = 'bold 10px sans-serif';
          ctx.fillStyle = '#ea580c';
          ctx.fillText(`Match ${(node as any).matchScore}%`, node.x, lineY + 14);
        }

        ctx.restore();
      });

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [edges, selectedNodeId, hoveredNodeId, connectedNodeIds, zoom, pan, activeFilter, searchQuery, draggedNodeId]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      canvasRef.current.width = containerRef.current.clientWidth;
      canvasRef.current.height = containerRef.current.clientHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse Interaction Helpers
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    return {
      x: (clientX - pan.x) / zoom,
      y: (clientY - pan.y) / zoom,
      rawX: clientX,
      rawY: clientY
    };
  };

  const findNodeAt = (x: number, y: number): SimulatedNode | undefined => {
    return simNodesRef.current.find((node) => {
      const dist = Math.hypot(node.x - x, node.y - y);
      return dist <= node.radius + 8;
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    const clickedNode = findNodeAt(coords.x, coords.y);

    if (clickedNode) {
      setDraggedNodeId(clickedNode.id);
      onSelectNode(clickedNode);
    } else {
      setIsDraggingCanvas(true);
      setDragStart({ x: coords.rawX - pan.x, y: coords.rawY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);

    if (draggedNodeId) {
      const node = simNodesRef.current.find((n) => n.id === draggedNodeId);
      if (node) {
        node.x = coords.x;
        node.y = coords.y;
        node.vx = 0;
        node.vy = 0;
      }
    } else if (isDraggingCanvas) {
      setPan({
        x: coords.rawX - dragStart.x,
        y: coords.rawY - dragStart.y
      });
    } else {
      const hovered = findNodeAt(coords.x, coords.y);
      setHoveredNodeId(hovered ? hovered.id : null);
    }
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
    setIsDraggingCanvas(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((prev) => Math.max(0.4, Math.min(2.5, prev * zoomFactor)));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    onSelectNode(null);
  };

  return (
    <div id="cognitorium-network-view" className="relative w-full h-[680px] bg-slate-900/5 rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-white/95 backdrop-blur-md rounded-xl shadow-sm border border-slate-200 pointer-events-auto overflow-x-auto max-w-full">
          <button
            id="filter-btn-all"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tout le réseau ({nodes.length})
          </button>
          <button
            id="filter-btn-experiences"
            onClick={() => setActiveFilter('experience')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'experience'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🏗️ Expériences ({nodes.filter((n) => n.category === 'experience' || n.category === 'formation').length})
          </button>
          <button
            id="filter-btn-skills"
            onClick={() => setActiveFilter('skill')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'skill'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ⚙️ Compétences ({nodes.filter((n) => n.category.startsWith('skill_')).length})
          </button>
          <button
            id="filter-btn-capacities"
            onClick={() => setActiveFilter('capacity')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'capacity'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🧠 Capacités Méta ({nodes.filter((n) => n.category === 'capacity_cognitive').length})
          </button>
          <button
            id="filter-btn-horizons"
            onClick={() => setActiveFilter('horizon')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'horizon'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🧭 Horizons Possibles ({nodes.filter((n) => n.category === 'horizon_job').length})
          </button>
        </div>

        {/* Right Search & Action */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="graph-search-input"
              type="text"
              placeholder="Chercher une compétence, métier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 lg:w-60 shadow-sm"
            />
          </div>

          <button
            id="btn-distill-quick"
            onClick={onAddExperienceClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Distiller un vécu</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          className="w-full h-full block"
        />
      </div>

      {/* Bottom Zoom & Reset Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-sm border border-slate-200">
        <button
          id="zoom-in-btn"
          onClick={() => setZoom((prev) => Math.min(2.5, prev * 1.15))}
          title="Zoom avant"
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          id="zoom-out-btn"
          onClick={() => setZoom((prev) => Math.max(0.4, prev * 0.85))}
          title="Zoom arrière"
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          id="reset-view-btn"
          onClick={handleResetView}
          title="Recentrer la vue"
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Left Legend */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-4 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-sm border border-slate-200 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
          <span>Expériences</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
          <span>Compétences</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block" />
          <span>Capacités Méta</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
          <span>Horizons Possibles</span>
        </div>
      </div>
    </div>
  );
};
