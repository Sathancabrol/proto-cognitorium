import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { AnyCognitiveNode, GraphEdge, NodeCategory } from '../types';
import { calculateSkillVitality, getVitalityStatus } from '../utils/decay';
import { getNodeVisualDescriptor } from '../utils/nodeVisualDescriptor';
import { 
  DimensionMode, 
  NodeSpatialData, 
  getNodeStrataLayer, 
  extractNodeYear 
} from '../utils/graphDimensions';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  Play, 
  Pause, 
  Sparkles, 
  Clock, 
  Share2,
  X,
  Layers,
  Network,
  Lock,
  Unlock
} from 'lucide-react';

interface NetworkGraphProps {
  nodes: AnyCognitiveNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  onSelectNode: (node: AnyCognitiveNode | null) => void;
  simulationYear: number;
  onAddExperienceClick?: () => void;
}

export type FilterCategoryKey = 'experience' | 'task' | 'skill' | 'cognition' | 'matching';

interface CategoryGroupDef {
  key: FilterCategoryKey;
  label: string;
  dotColor: string;
  bgActive: string;
  categories: string[];
}

const CATEGORY_GROUPS: CategoryGroupDef[] = [
  {
    key: 'experience',
    label: 'Expériences & Formations',
    dotColor: '#3b82f6',
    bgActive: 'bg-blue-600',
    categories: ['experience', 'formation', 'research_project']
  },
  {
    key: 'task',
    label: 'Missions & Tâches',
    dotColor: '#6366f1',
    bgActive: 'bg-indigo-600',
    categories: ['task']
  },
  {
    key: 'skill',
    label: 'Compétences & Savoirs',
    dotColor: '#06b6d4',
    bgActive: 'bg-cyan-600',
    categories: ['skill_tech', 'skill_transversal', 'skill_relational', 'knowledge']
  },
  {
    key: 'cognition',
    label: 'Cognition',
    dotColor: '#ec4899',
    bgActive: 'bg-pink-600',
    categories: ['capacity_cognitive']
  },
  {
    key: 'matching',
    label: 'Horizons Métiers',
    dotColor: '#f59e0b',
    bgActive: 'bg-amber-600',
    categories: ['horizon_job']
  }
];

// Obsidian Category Color Palette
const OBSIDIAN_COLORS: Record<string, { main: string; glow: string; label: string }> = {
  formation: { main: '#a855f7', glow: 'rgba(168, 85, 247, 0.45)', label: 'Formation' },
  experience: { main: '#3b82f6', glow: 'rgba(59, 130, 246, 0.45)', label: 'Expérience' },
  research_project: { main: '#60a5fa', glow: 'rgba(96, 165, 250, 0.45)', label: 'Recherche' },
  task: { main: '#6366f1', glow: 'rgba(99, 102, 241, 0.45)', label: 'Mission / Tâche' },
  skill_tech: { main: '#06b6d4', glow: 'rgba(6, 182, 212, 0.45)', label: 'Compétence Tech' },
  skill_transversal: { main: '#14b8a6', glow: 'rgba(20, 184, 166, 0.45)', label: 'Compétence Transverse' },
  skill_relational: { main: '#10b981', glow: 'rgba(16, 185, 129, 0.45)', label: 'Compétence Humaine' },
  knowledge: { main: '#0284c7', glow: 'rgba(2, 132, 199, 0.45)', label: 'Savoir Fondamental' },
  capacity_cognitive: { main: '#ec4899', glow: 'rgba(236, 72, 153, 0.45)', label: 'Capacité Cognitive' },
  horizon_job: { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.45)', label: 'Horizon Métier ROME' }
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

  // Dimension Mode: '2d' (Obsidian Graphe Réseau) ou 'timeline' (Ligne temporelle)
  const [dimensionMode, setDimensionMode] = useState<DimensionMode>('2d');
  
  // Lock / Unlock Physics & Motion state (false = en mouvement, true = figé/verrouillé)
  const [isPhysicsLocked, setIsPhysicsLocked] = useState<boolean>(false);
  
  // Multi-select Category Filters (Set of active keys)
  const [selectedFilterKeys, setSelectedFilterKeys] = useState<Set<FilterCategoryKey>>(
    new Set<FilterCategoryKey>(['experience', 'task', 'skill', 'cognition', 'matching'])
  );

  // Timeline Player state
  const [timelineYear, setTimelineYear] = useState<number>(2026);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);
  const [timelineSpeed, setTimelineSpeed] = useState<number>(1);

  // Interactive Viewport State (Zoom & Pan)
  const [zoom, setZoom] = useState<number>(0.95);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [isDraggingCanvas, setIsDraggingCanvas] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Spatial node storage with velocity for Obsidian force-directed physics
  const spatialNodesRef = useRef<NodeSpatialData[]>([]);

  // Timeline bounds
  const minTimelineYear = 2013;
  const maxTimelineYear = 2026;

  // Degrees of nodes (number of connections)
  const nodeDegrees = useMemo(() => {
    const degMap = new Map<string, number>();
    nodes.forEach(n => degMap.set(n.id, 0));
    edges.forEach(e => {
      degMap.set(e.source, (degMap.get(e.source) || 0) + 1);
      degMap.set(e.target, (degMap.get(e.target) || 0) + 1);
    });
    return degMap;
  }, [nodes, edges]);

  // Transitive Connected Subgraph computation when a node is selected/focused
  // Returns all entities linked directly or transitively (Experience -> Tasks -> Skills -> Capacities -> Horizons)
  const reactivatedSubgraph = useMemo(() => {
    if (!selectedNodeId) return null;

    const targetNode = nodes.find(n => n.id === selectedNodeId);
    if (!targetNode) return null;

    const visitedNodeIds = new Set<string>();
    visitedNodeIds.add(selectedNodeId);

    // Breadth-First-Search across edges (depth up to 3)
    let currentQueue = [selectedNodeId];
    for (let depth = 0; depth < 3; depth++) {
      const nextQueue: string[] = [];
      for (const currId of currentQueue) {
        edges.forEach((edge) => {
          if (edge.source === currId && !visitedNodeIds.has(edge.target)) {
            visitedNodeIds.add(edge.target);
            nextQueue.push(edge.target);
          } else if (edge.target === currId && !visitedNodeIds.has(edge.source)) {
            visitedNodeIds.add(edge.source);
            nextQueue.push(edge.source);
          }
        });
      }
      currentQueue = nextQueue;
      if (currentQueue.length === 0) break;
    }

    const connectedNodesList = nodes.filter(n => visitedNodeIds.has(n.id));
    
    // Group breakdown
    const skillsCount = connectedNodesList.filter(n => n.category.startsWith('skill_') || n.category === 'knowledge').length;
    const tasksCount = connectedNodesList.filter(n => n.category === 'task').length;
    const cognitionCount = connectedNodesList.filter(n => n.category === 'capacity_cognitive').length;
    const horizonsCount = connectedNodesList.filter(n => n.category === 'horizon_job').length;
    const expCount = connectedNodesList.filter(n => ['experience', 'formation', 'research_project'].includes(n.category)).length;

    return {
      rootNode: targetNode,
      nodeIds: visitedNodeIds,
      count: visitedNodeIds.size,
      breakdown: {
        skillsCount,
        tasksCount,
        cognitionCount,
        horizonsCount,
        expCount
      }
    };
  }, [selectedNodeId, nodes, edges]);

  // Immediate neighbor set for hover feedback
  const hoveredNeighbors = useMemo(() => {
    if (!hoveredNodeId) return new Set<string>();
    const set = new Set<string>();
    set.add(hoveredNodeId);
    edges.forEach((edge) => {
      if (edge.source === hoveredNodeId) set.add(edge.target);
      if (edge.target === hoveredNodeId) set.add(edge.source);
    });
    return set;
  }, [hoveredNodeId, edges]);

  // Initialize node layout data with organic circular layout for Obsidian
  useEffect(() => {
    const existingMap = new Map(spatialNodesRef.current.map((n) => [n.id, n]));

    spatialNodesRef.current = nodes.map((node, index) => {
      const existing = existingMap.get(node.id);
      const layerIndex = getNodeStrataLayer(node);
      const year = extractNodeYear(node);
      const degree = nodeDegrees.get(node.id) || 1;

      // Obsidian dynamic node radius based on connection degree and importance
      let baseRadius = 13 + Math.min(22, degree * 2.1);
      if (node.category === 'experience' || node.category === 'formation') baseRadius += 5;
      if (node.category === 'horizon_job') baseRadius += 4;

      // Initial organic nebula position (polar coordinates for natural graph clustering)
      const angle = (index / nodes.length) * Math.PI * 2 + (layerIndex * 1.25);
      const dist = 120 + ((index * 47) % 240);
      const default2dX = Math.cos(angle) * dist;
      const default2dY = Math.sin(angle) * dist;

      const yearProgress = (year - minTimelineYear) / (maxTimelineYear - minTimelineYear);
      const timelineX = (yearProgress - 0.5) * 1200;
      const timelineY = (layerIndex - 2) * 110 + ((index % 3) - 1) * 28;

      let vitality: number | undefined = undefined;
      if (node.category.startsWith('skill_')) {
        vitality = calculateSkillVitality(node as any, simulationYear, (node as any).isReactivated);
      }

      return {
        id: node.id,
        name: node.name,
        category: node.category,
        radius: baseRadius,
        vitality,
        yearAcquired: year,
        layerIndex,
        x2d: existing?.x2d ?? default2dX,
        y2d: existing?.y2d ?? default2dY,
        vx: existing?.vx ?? 0,
        vy: existing?.vy ?? 0,
        x3d: 0,
        y3d: 0,
        z3d: 0,
        xTimeline: timelineX,
        yTimeline: timelineY
      };
    });
  }, [nodes, nodeDegrees, simulationYear]);

  // Timeline Auto-play Loop
  useEffect(() => {
    let intervalId: any;
    if (isPlayingTimeline && dimensionMode === 'timeline') {
      intervalId = setInterval(() => {
        setTimelineYear((prev) => {
          if (prev >= maxTimelineYear) {
            setIsPlayingTimeline(false);
            return maxTimelineYear;
          }
          return prev + 1;
        });
      }, 1400 / timelineSpeed);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlayingTimeline, dimensionMode, timelineSpeed]);

  // Main Canvas Rendering & Real Data Obsidian Physics Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.clearRect(0, 0, width, height);

      // --- OBSIDIAN BACKGROUND (Deep Charcoal / Slate Nebula) ---
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, Math.max(width, height) * 0.85);
      bgGrad.addColorStop(0, '#1c1d22');
      bgGrad.addColorStop(0.65, '#131417');
      bgGrad.addColorStop(1, '#0c0d0f');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // --- OBSIDIAN SUBTLE GRID DOTS ---
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

      // --- TIMELINE AXIS & BARS ---
      if (dimensionMode === 'timeline') {
        const lineY = height / 2;
        const startX = (-0.5) * 1200 + width / 2;
        const endX = 0.5 * 1200 + width / 2;

        ctx.beginPath();
        ctx.moveTo(startX - 60, lineY + 230);
        ctx.lineTo(endX + 60, lineY + 230);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = 3;
        ctx.stroke();

        for (let y = minTimelineYear; y <= maxTimelineYear; y++) {
          const prog = (y - minTimelineYear) / (maxTimelineYear - minTimelineYear);
          const tickX = (prog - 0.5) * 1200 + width / 2;
          const isPassed = y <= timelineYear;

          ctx.beginPath();
          ctx.moveTo(tickX, lineY - 260);
          ctx.lineTo(tickX, lineY + 230);
          ctx.strokeStyle = isPassed 
            ? (y === timelineYear ? 'rgba(56, 189, 248, 0.55)' : 'rgba(148, 163, 184, 0.12)') 
            : 'rgba(51, 65, 85, 0.08)';
          ctx.lineWidth = y === timelineYear ? 2 : 1;
          if (y !== timelineYear) ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.font = y === timelineYear ? 'bold 13px sans-serif' : '11px sans-serif';
          ctx.fillStyle = isPassed ? (y === timelineYear ? '#38bdf8' : '#94a3b8') : '#475569';
          ctx.textAlign = 'center';
          ctx.fillText(`${y}`, tickX, lineY + 250);

          if (y === timelineYear) {
            ctx.beginPath();
            ctx.arc(tickX, lineY + 230, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#38bdf8';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      }

      const pNodes = spatialNodesRef.current;
      const rawNodeMap = new Map(nodes.map((n) => [n.id, n]));
      const pNodeMap = new Map(pNodes.map((n) => [n.id, n]));

      // --- REAL DATA CALIBRATED OBSIDIAN PHYSICS SIMULATION (2D Mode) ---
      if (dimensionMode === '2d') {
        if (!isPhysicsLocked) {
          const timeNow = performance.now() * 0.001;

          // 1. Coulomb Repulsion based on node degrees and masses (safely capped & bounded)
          const baseRepel = 750;
          const minDist = 30;
          for (let i = 0; i < pNodes.length; i++) {
            const n1 = pNodes[i];
            const deg1 = nodeDegrees.get(n1.id) || 1;

            // Gentle zero-sum organic breathing (living motion without drift)
            const phase = i * 1.1;
            n1.vx += Math.sin(timeNow + phase) * 0.04;
            n1.vy += Math.cos(timeNow * 0.85 + phase) * 0.04;

            for (let j = i + 1; j < pNodes.length; j++) {
              const n2 = pNodes[j];
              const deg2 = nodeDegrees.get(n2.id) || 1;
              const dx = n2.x2d - n1.x2d;
              const dy = n2.y2d - n1.y2d;
              const dist = Math.hypot(dx, dy) || 1;
              
              if (dist < 320) {
                const effectiveDist = Math.max(dist, minDist);
                const repelMultiplier = 1 + (deg1 + deg2) * 0.1;
                const rawForce = (baseRepel * repelMultiplier) / (effectiveDist * effectiveDist);
                const force = Math.min(2.8, rawForce);
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;
                n1.vx -= fx;
                n1.vy -= fy;
                n2.vx += fx;
                n2.vy += fy;
              }
            }
          }

          // 2. Real Semantic Edge Spring Attraction (Hooke's Law calibrated by relationship type)
          edges.forEach((edge) => {
            const n1 = pNodeMap.get(edge.source);
            const n2 = pNodeMap.get(edge.target);
            if (!n1 || !n2) return;

            // Real Semantic Relationship Distance & Elasticity Mapping based on relation type & strength
            let targetDist = 95;
            let springStiffness = 0.018;

            const edgeStrength = typeof edge.strength === 'number' ? edge.strength : 0.7;

            if (edge.type === 'composed_of') {
              targetDist = 65;
              springStiffness = 0.028 * (0.8 + edgeStrength * 0.4);
            } else if (edge.type === 'demonstrates_skill' || edge.type === 'acquired_in') {
              targetDist = 80;
              springStiffness = 0.024 * (0.8 + edgeStrength * 0.4);
            } else if (edge.type === 'requires_knowledge' || edge.type === 'decomposes_into') {
              targetDist = 75;
              springStiffness = 0.024 * (0.8 + edgeStrength * 0.4);
            } else if (edge.type === 'feeds_capacity') {
              targetDist = 110;
              springStiffness = 0.016 * (0.8 + edgeStrength * 0.4);
            } else if (edge.type === 'unlocks_horizon') {
              targetDist = 140;
              springStiffness = 0.012 * (0.8 + edgeStrength * 0.4);
            } else if (edge.type === 'synergy_with') {
              targetDist = 120;
              springStiffness = 0.014 * (0.8 + edgeStrength * 0.4);
            }

            const dx = n2.x2d - n1.x2d;
            const dy = n2.y2d - n1.y2d;
            const dist = Math.hypot(dx, dy) || 1;
            const displacement = dist - targetDist;
            const rawForce = displacement * springStiffness;
            const force = Math.max(-2.5, Math.min(2.5, rawForce));
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            n1.vx += fx;
            n1.vy += fy;
            n2.vx -= fx;
            n2.vy -= fy;
          });

          // 3. Central Gravity, Soft Boundary Wall & Velocity Integration with High Damping
          const gravity = 0.0032;
          pNodes.forEach((n) => {
            n.vx -= n.x2d * gravity;
            n.vy -= n.y2d * gravity;

            // Soft boundary wall to keep constellations centered and prevent drifting away
            const distFromCenter = Math.hypot(n.x2d, n.y2d);
            if (distFromCenter > 420) {
              const excess = distFromCenter - 420;
              n.vx -= (n.x2d / distFromCenter) * (excess * 0.012);
              n.vy -= (n.y2d / distFromCenter) * (excess * 0.012);
            }

            // High damping factor for smooth, stable settling (no wild oscillation)
            n.vx *= 0.78;
            n.vy *= 0.78;

            // Cap maximum speed per frame
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
          // When physics is locked, freeze velocities immediately
          pNodes.forEach((n) => {
            n.vx = 0;
            n.vy = 0;
          });
        }
      }

      // --- MULTI-FILTER VISIBILITY & REACTIVATED SUBGRAPH LOGIC ---
      const isCategoryActive = (node: AnyCognitiveNode) => {
        // If categories are selected, check if node matches any active category
        for (const group of CATEGORY_GROUPS) {
          if (selectedFilterKeys.has(group.key) && group.categories.includes(node.category)) {
            return true;
          }
        }
        return false;
      };

      const isVisible = (node: AnyCognitiveNode) => {
        // If a node is focused in subgraph reactivation mode:
        if (reactivatedSubgraph) {
          // The selected root node and all its connected entities are always highlighted/visible
          if (reactivatedSubgraph.nodeIds.has(node.id)) return true;
        }

        // Otherwise check category multi-filters
        if (!isCategoryActive(node)) return false;

        // Check text search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            node.name.toLowerCase().includes(q) ||
            node.category.toLowerCase().includes(q) ||
            (node.description && node.description.toLowerCase().includes(q))
          );
        }
        return true;
      };

      // Project positions
      const projectedList = pNodes.map((n) => {
        const raw = rawNodeMap.get(n.id);
        let x = 0;
        let y = 0;
        let isTimelineActive = true;

        if (dimensionMode === '2d') {
          x = width / 2 + n.x2d;
          y = height / 2 + n.y2d;
        } else if (dimensionMode === 'timeline') {
          x = width / 2 + n.xTimeline;
          y = height / 2 + n.yTimeline;
          isTimelineActive = n.yearAcquired <= timelineYear;
        }

        return {
          node: n,
          rawNode: raw,
          x,
          y,
          isTimelineActive,
          radiusScreen: n.radius
        };
      });

      const projectedMap = new Map(projectedList.map((p) => [p.node.id, p]));

      // Active focus target (hovered or selected)
      const activeFocusNodeId = hoveredNodeId || selectedNodeId;

      // --- 1. DESSIN DES LIENS OBSIDIAN (Luminous Glowing Connection Lines) ---
      edges.forEach((edge) => {
        const src = projectedMap.get(edge.source);
        const tgt = projectedMap.get(edge.target);
        if (!src || !tgt || !src.rawNode || !tgt.rawNode) return;

        if (!isVisible(src.rawNode) || !isVisible(tgt.rawNode)) return;

        if (dimensionMode === 'timeline' && (!src.isTimelineActive || !tgt.isTimelineActive)) {
          return;
        }

        // Subgraph focus link status
        const isReactivatedLink = reactivatedSubgraph && 
          reactivatedSubgraph.nodeIds.has(edge.source) && 
          reactivatedSubgraph.nodeIds.has(edge.target);

        const isDirectConnection = activeFocusNodeId && (edge.source === activeFocusNodeId || edge.target === activeFocusNodeId);
        const isDimmed = (reactivatedSubgraph && !isReactivatedLink) || (activeFocusNodeId && !isDirectConnection && !reactivatedSubgraph);

        let strokeColor = 'rgba(161, 161, 170, 0.22)';
        let lineWidth = 1.2;

        if (isReactivatedLink || isDirectConnection) {
          strokeColor = 'rgba(56, 189, 248, 0.95)';
          lineWidth = 2.4;
        } else if (isDimmed) {
          strokeColor = 'rgba(100, 116, 139, 0.05)';
          lineWidth = 0.8;
        } else {
          const colorMeta = OBSIDIAN_COLORS[src.node.category] || OBSIDIAN_COLORS.experience;
          strokeColor = colorMeta.glow.replace('0.45', '0.28');
        }

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        // Obsidian Arrow Heads on links
        if (!isDimmed && (zoom > 0.6 || isDirectConnection || isReactivatedLink)) {
          const arrowLength = 7 * Math.min(1.4, Math.max(0.7, zoom));
          const angle = Math.atan2(tgt.y - src.y, tgt.x - src.x);
          const midX = src.x + (tgt.x - src.x) * 0.58;
          const midY = src.y + (tgt.y - src.y) * 0.58;

          ctx.save();
          ctx.translate(midX, midY);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-arrowLength, -arrowLength * 0.45);
          ctx.lineTo(-arrowLength, arrowLength * 0.45);
          ctx.closePath();
          ctx.fillStyle = (isDirectConnection || isReactivatedLink) ? '#38bdf8' : 'rgba(148, 163, 184, 0.4)';
          ctx.fill();
          ctx.restore();
        }
      });

      // --- 2. DESSIN DES NŒUDS OBSIDIAN (Luminous Glowing Orbs) ---
      const sortedNodes = [...projectedList].sort((a, b) => {
        // Draw reactivated and focused nodes on top
        const aReactivated = reactivatedSubgraph && reactivatedSubgraph.nodeIds.has(a.node.id);
        const bReactivated = reactivatedSubgraph && reactivatedSubgraph.nodeIds.has(b.node.id);
        if (aReactivated && !bReactivated) return 1;
        if (!aReactivated && bReactivated) return -1;
        if (a.node.id === activeFocusNodeId) return 1;
        if (b.node.id === activeFocusNodeId) return -1;
        return 0;
      });

      sortedNodes.forEach(({ node, rawNode, x, y, isTimelineActive, radiusScreen }) => {
        if (!rawNode || !isVisible(rawNode)) return;

        if (dimensionMode === 'timeline' && !isTimelineActive) {
          ctx.save();
          ctx.globalAlpha = 0.15;
          ctx.beginPath();
          ctx.arc(x, y, radiusScreen * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = '#27272a';
          ctx.fill();
          ctx.strokeStyle = '#52525b';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);
          ctx.stroke();
          ctx.restore();
          return;
        }

        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNodeId === node.id;
        const isHoverConnected = hoveredNeighbors.has(node.id);
        const isReactivatedInSubgraph = reactivatedSubgraph && reactivatedSubgraph.nodeIds.has(node.id);

        let isDimmed = false;
        if (reactivatedSubgraph) {
          isDimmed = !isReactivatedInSubgraph;
        } else if (activeFocusNodeId) {
          isDimmed = !isSelected && !isHovered && !isHoverConnected;
        }

        const visualDesc = getNodeVisualDescriptor(rawNode, simulationYear);
        const colorMeta = OBSIDIAN_COLORS[node.category] || { main: visualDesc.color, glow: 'rgba(56, 189, 248, 0.4)', label: node.category };
        let baseColor = colorMeta.main;

        if (node.vitality !== undefined) {
          const vStat = getVitalityStatus(node.vitality);
          baseColor = vStat.colorHex;
        }

        const opacity = isDimmed ? 0.14 : 1;

        ctx.save();
        ctx.globalAlpha = opacity;

        // --- OBSIDIAN NEON HALO / GLOW ---
        if ((isSelected || isHovered || isHoverConnected || isReactivatedInSubgraph) && !isDimmed) {
          const isRoot = isSelected;
          const glowRadius = radiusScreen + (isRoot ? 16 : (isHovered ? 12 : 7));
          const glowGrad = ctx.createRadialGradient(x, y, radiusScreen * 0.4, x, y, glowRadius);
          glowGrad.addColorStop(0, isRoot ? 'rgba(56, 189, 248, 0.85)' : colorMeta.glow);
          glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.beginPath();
          ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();
        }

        // --- VITALITY RING ---
        if (node.vitality !== undefined && !isDimmed) {
          ctx.beginPath();
          ctx.arc(x, y, radiusScreen + 3.5, -Math.PI / 2, -Math.PI / 2 + (node.vitality / 100) * 2 * Math.PI);
          ctx.strokeStyle = baseColor;
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // --- NODE BODY ORB ---
        ctx.beginPath();
        ctx.arc(x, y, radiusScreen, 0, Math.PI * 2);
        const bodyGrad = ctx.createRadialGradient(x, y, 0, x, y, radiusScreen);
        bodyGrad.addColorStop(0, baseColor);
        bodyGrad.addColorStop(0.85, baseColor);
        bodyGrad.addColorStop(1, 'rgba(0,0,0,0.45)');
        ctx.fillStyle = bodyGrad;
        ctx.fill();

        ctx.strokeStyle = isSelected 
          ? '#ffffff' 
          : (isReactivatedInSubgraph ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.4)');
        ctx.lineWidth = isSelected ? 2.8 : (isReactivatedInSubgraph ? 2.0 : 1.2);
        ctx.stroke();

        // --- INNER ICON GLYPH ---
        if (radiusScreen > 15 || isHovered || isSelected || isReactivatedInSubgraph) {
          const fontSize = Math.max(9, Math.round(radiusScreen * 0.72));
          ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(visualDesc.symbol, x, y);
        }

        // --- OBSIDIAN TEXT LABELS ---
        const shouldShowLabel = !isDimmed && (
          zoom >= 0.65 || 
          isSelected || 
          isHovered || 
          isHoverConnected ||
          isReactivatedInSubgraph ||
          (nodeDegrees.get(node.id) || 0) >= 3
        );

        if (shouldShowLabel) {
          const isHighPrio = isSelected || isHovered || isReactivatedInSubgraph;
          ctx.font = isHighPrio ? '600 11px Inter, system-ui, sans-serif' : '400 10px Inter, system-ui, sans-serif';
          
          ctx.fillStyle = isHighPrio ? '#ffffff' : 'rgba(212, 212, 216, 0.8)';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
          ctx.shadowBlur = 4;

          let displayName = node.name;
          if (displayName.length > 24 && !isHighPrio) {
            displayName = displayName.substring(0, 22) + '…';
          }
          
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(displayName, x, y + radiusScreen + (isHighPrio ? 6 : 4));
          
          ctx.shadowBlur = 0;
        }

        ctx.restore();
      });

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    nodes, 
    edges, 
    selectedNodeId, 
    hoveredNodeId, 
    hoveredNeighbors,
    reactivatedSubgraph,
    zoom, 
    pan, 
    selectedFilterKeys, 
    searchQuery, 
    draggedNodeId, 
    dimensionMode, 
    simulationYear, 
    timelineYear,
    nodeDegrees,
    isPhysicsLocked
  ]);

  // Window Resize handling
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

    const x = (rawX - pan.x) / zoom;
    const y = (rawY - pan.y) / zoom;
    return { x, y, rawX, rawY };
  };

  const findNodeAt = (mouseX: number, mouseY: number): AnyCognitiveNode | undefined => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    const pNodes = spatialNodesRef.current;
    const rawNodeMap = new Map(nodes.map((n) => [n.id, n]));

    for (let i = pNodes.length - 1; i >= 0; i--) {
      const n = pNodes[i];
      const raw = rawNodeMap.get(n.id);
      if (!raw) continue;

      let screenX = 0;
      let screenY = 0;
      let hitRadius = n.radius + 5;

      if (dimensionMode === '2d') {
        screenX = width / 2 + n.x2d;
        screenY = height / 2 + n.y2d;
      } else if (dimensionMode === 'timeline') {
        if (n.yearAcquired > timelineYear) continue;
        screenX = width / 2 + n.xTimeline;
        screenY = height / 2 + n.yTimeline;
      }

      const dx = (mouseX - pan.x) / zoom - screenX;
      const dy = (mouseY - pan.y) / zoom - screenY;

      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        return raw;
      }
    }
    return undefined;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    const coords = getCanvasCoords(e);
    const clickedNode = findNodeAt(coords.rawX, coords.rawY);

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

    if (draggedNodeId && dimensionMode === '2d') {
      const node = spatialNodesRef.current.find((n) => n.id === draggedNodeId);
      if (node) {
        const canvas = canvasRef.current;
        const width = (canvas?.width || 950) / (window.devicePixelRatio || 1);
        const height = (canvas?.height || 680) / (window.devicePixelRatio || 1);
        node.x2d = coords.x - width / 2;
        node.y2d = coords.y - height / 2;
      }
    } else if (isDraggingCanvas) {
      setPan({
        x: coords.rawX - dragStart.x,
        y: coords.rawY - dragStart.y
      });
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
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((prev) => Math.max(0.25, Math.min(3.2, prev * zoomFactor)));
  };

  const handleResetView = () => {
    setZoom(0.95);
    setPan({ x: 0, y: 0 });
    onSelectNode(null);
    // Soft recenter nodes into balanced constellation
    const total = Math.max(1, spatialNodesRef.current.length);
    spatialNodesRef.current.forEach((n, index) => {
      n.vx = 0;
      n.vy = 0;
      const angle = (index / total) * Math.PI * 2 + (n.layerIndex * 1.25);
      const dist = 110 + ((index * 37) % 210);
      n.x2d = Math.cos(angle) * dist;
      n.y2d = Math.sin(angle) * dist;
    });
  };

  // Toggle multi-filter categories
  const toggleFilter = (key: FilterCategoryKey) => {
    setSelectedFilterKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        // Don't empty completely unless all are unselected
        if (next.size > 1) {
          next.delete(key);
        } else {
          // If only 1 was active, reset to all
          return new Set<FilterCategoryKey>(['experience', 'task', 'skill', 'cognition', 'matching']);
        }
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleAllFilters = () => {
    if (selectedFilterKeys.size === CATEGORY_GROUPS.length) {
      // If all are selected, keep just the primary experiences
      setSelectedFilterKeys(new Set<FilterCategoryKey>(['experience']));
    } else {
      // Select all
      setSelectedFilterKeys(new Set<FilterCategoryKey>(['experience', 'task', 'skill', 'cognition', 'matching']));
    }
  };

  const hoveredNode = useMemo(() => {
    if (!hoveredNodeId) return null;
    return nodes.find(n => n.id === hoveredNodeId) || null;
  }, [hoveredNodeId, nodes]);

  return (
    <div id="cognitorium-network-view" className="relative w-full h-[740px] bg-[#141416] rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col font-sans select-none">
      
      {/* TOP FLOATING OBSIDIAN TOOLBAR */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        
        {/* Left Section: 2D (Obsidian) vs Ligne temporelle & Multi-Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {/* Dimension Mode Capsule */}
          <div className="flex items-center p-1 bg-[#1e1f24]/90 backdrop-blur-md border border-zinc-700/70 rounded-xl shadow-lg text-xs font-medium text-zinc-200">
            {/* 2D Obsidian View */}
            <button
              id="dimension-btn-2d"
              onClick={() => setDimensionMode('2d')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                dimensionMode === '2d' 
                  ? 'bg-purple-600/90 text-white shadow-md font-semibold ring-1 ring-purple-400/50' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
              title="Graphe Obsidian 2D Force-Directed"
            >
              <Network className="w-3.5 h-3.5" />
              <span>Graphe Réseau</span>
            </button>

            {/* Ligne Temporelle */}
            <button
              id="dimension-btn-timeline"
              onClick={() => setDimensionMode('timeline')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                dimensionMode === 'timeline' 
                  ? 'bg-amber-600/90 text-white shadow-md font-semibold ring-1 ring-amber-400/50' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
              title="Ligne temporelle chronologique"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Ligne temporelle</span>
            </button>
          </div>

          {/* Lock / Delock Motion Capsule (Bulles en mouvement vs Bulles figées) */}
          {dimensionMode === '2d' && (
            <button
              id="graph-lock-toggle-btn"
              onClick={() => setIsPhysicsLocked((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all backdrop-blur-md shadow-lg border ${
                isPhysicsLocked
                  ? 'bg-[#1e1f24]/90 text-zinc-400 border-zinc-700/70 hover:text-zinc-200 hover:border-zinc-500'
                  : 'bg-emerald-600/90 text-white border-emerald-400/50 shadow-emerald-950/40 hover:bg-emerald-500 ring-1 ring-emerald-400/40'
              }`}
              title={
                isPhysicsLocked
                  ? "Positions verrouillées (figé). Cliquez pour déverrouiller et mettre les bulles en mouvement dynamique."
                  : "Bulles en mouvement dynamique et flottement actif. Cliquez pour verrouiller et figer les positions."
              }
            >
              {isPhysicsLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-zinc-400" />
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

          {/* Multi-Select Category Filters Bar */}
          <div className="flex items-center gap-1 p-1 bg-[#1e1f24]/90 backdrop-blur-md border border-zinc-700/70 rounded-xl shadow-lg overflow-x-auto max-w-[620px]">
            <button
              id="filter-btn-all"
              onClick={toggleAllFilters}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                selectedFilterKeys.size === CATEGORY_GROUPS.length
                  ? 'bg-zinc-700 text-white font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
              title="Afficher toutes les catégories"
            >
              Tout ({nodes.length})
            </button>

            {CATEGORY_GROUPS.map((group) => {
              const isActive = selectedFilterKeys.has(group.key);
              const count = nodes.filter(n => group.categories.includes(n.category)).length;

              return (
                <button
                  key={group.key}
                  id={`filter-btn-${group.key}`}
                  onClick={() => toggleFilter(group.key)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
                    isActive
                      ? `${group.bgActive} text-white font-semibold shadow-xs ring-1 ring-white/20`
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 opacity-60'
                  }`}
                  title={`Basculer le filtre ${group.label}`}
                >
                  <span 
                    className="w-2 h-2 rounded-full shrink-0" 
                    style={{ backgroundColor: group.dotColor }}
                  />
                  <span>{group.label.split(' ')[0]}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Section: Search & Quick Distill */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              id="graph-search-input"
              type="text"
              placeholder="Rechercher un nœud..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-[#1e1f24]/90 backdrop-blur-md rounded-xl text-xs text-zinc-200 placeholder-zinc-500 border border-zinc-700/70 focus:outline-none focus:ring-2 focus:ring-purple-500 w-36 lg:w-48 shadow-lg"
            />
          </div>

          {onAddExperienceClick && (
            <button
              id="btn-distill-quick"
              onClick={onAddExperienceClick}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">+ Distiller</span>
            </button>
          )}
        </div>
      </div>

      {/* REACTIVATED SUBGRAPH FOCUS BANNER (When a node like Experience is clicked) */}
      {reactivatedSubgraph && (
        <div className="absolute top-16 left-3.5 right-3.5 z-20 flex items-center justify-between gap-3 bg-[#1e1f24]/95 backdrop-blur-xl border border-sky-500/50 px-3.5 py-2 rounded-xl shadow-2xl text-xs text-zinc-200 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span 
              className="w-3 h-3 rounded-full shrink-0 animate-pulse shadow-sm"
              style={{ backgroundColor: OBSIDIAN_COLORS[reactivatedSubgraph.rootNode.category]?.main || '#38bdf8' }}
            />
            <div className="flex items-center gap-2 truncate">
              <span className="font-semibold text-sky-300">Focus réactivé :</span>
              <span className="font-bold text-white truncate">{reactivatedSubgraph.rootNode.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 ml-2 text-[11px] text-zinc-400 border-l border-zinc-700 pl-3">
              <span>{reactivatedSubgraph.count} entités reliées</span>
              <span className="text-zinc-600">•</span>
              {reactivatedSubgraph.breakdown.skillsCount > 0 && (
                <span className="text-cyan-400">{reactivatedSubgraph.breakdown.skillsCount} compétences</span>
              )}
              {reactivatedSubgraph.breakdown.tasksCount > 0 && (
                <span className="text-indigo-400">{reactivatedSubgraph.breakdown.tasksCount} missions</span>
              )}
              {reactivatedSubgraph.breakdown.cognitionCount > 0 && (
                <span className="text-pink-400">{reactivatedSubgraph.breakdown.cognitionCount} cognitions</span>
              )}
              {reactivatedSubgraph.breakdown.horizonsCount > 0 && (
                <span className="text-amber-400">{reactivatedSubgraph.breakdown.horizonsCount} horizons</span>
              )}
            </div>
          </div>

          <button
            onClick={() => onSelectNode(null)}
            className="flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg font-medium text-[11px] transition-colors shrink-0 border border-zinc-700"
            title="Désactiver le focus et réafficher l'ensemble du réseau"
          >
            <X className="w-3.5 h-3.5" />
            <span>Réinitialiser le focus</span>
          </button>
        </div>
      )}

      {/* Main Interactive Canvas */}
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

      {/* OBSIDIAN HOVER CARD TOOLTIP (Bottom-Left preview on hover) */}
      {hoveredNode && (
        <div className="absolute bottom-4 left-4 z-20 max-w-sm bg-[#1b1c22]/95 backdrop-blur-xl border border-zinc-700/80 p-3 rounded-2xl shadow-2xl text-zinc-200 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-100">
          <div className="flex items-center gap-2.5 mb-1.5">
            <span 
              className="w-3 h-3 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: OBSIDIAN_COLORS[hoveredNode.category]?.main || '#a855f7' }}
            />
            <h4 className="text-xs font-bold text-white truncate">{hoveredNode.name}</h4>
            <span className="ml-auto text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-md font-mono">
              {OBSIDIAN_COLORS[hoveredNode.category]?.label || hoveredNode.category}
            </span>
          </div>
          {hoveredNode.description && (
            <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
              {hoveredNode.description}
            </p>
          )}
          <div className="mt-2 pt-1.5 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
            <span>Connexions : {nodeDegrees.get(hoveredNode.id) || 0}</span>
            <span className="text-sky-400 font-medium">Cliquez pour réactiver le sous-graphe</span>
          </div>
        </div>
      )}

      {/* LIGNE TEMPORELLE CONTROLLER BAR */}
      {dimensionMode === 'timeline' && (
        <div className="absolute bottom-4 left-4 right-20 z-20 bg-[#1e1f24]/95 backdrop-blur-md border border-amber-500/40 p-3 rounded-2xl shadow-2xl text-white flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg">
                <Clock className="w-4 h-4" />
              </span>
              <div>
                <div className="text-xs font-bold text-amber-200 flex items-center gap-2">
                  <span>Ligne temporelle d'Acquisition</span>
                  <span className="px-2 py-0.5 bg-amber-500 text-slate-950 rounded font-black text-[11px]">
                    Année : {timelineYear}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Visualisez l'apparition chronologique des diplômes, chantiers, missions et compétences.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlayingTimeline((p) => !p)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md"
              >
                {isPlayingTimeline ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlayingTimeline ? 'Pause' : 'Lecture'}</span>
              </button>

              <button
                onClick={() => setTimelineSpeed((s) => (s === 1 ? 2 : 1))}
                className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs"
              >
                {timelineSpeed}x
              </button>

              <button
                onClick={() => setTimelineYear(minTimelineYear)}
                className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs"
                title="2013"
              >
                2013
              </button>
              <button
                onClick={() => setTimelineYear(maxTimelineYear)}
                className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs"
                title="2026"
              >
                2026
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <span className="text-[11px] font-mono text-zinc-400">2013</span>
            <input
              type="range"
              min={minTimelineYear}
              max={maxTimelineYear}
              step={1}
              value={timelineYear}
              onChange={(e) => setTimelineYear(parseInt(e.target.value, 10))}
              className="flex-1 accent-amber-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
            />
            <span className="text-[11px] font-mono text-zinc-400">2026</span>
          </div>
        </div>
      )}

      {/* Bottom Right Obsidian Navigation Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col items-center gap-1 bg-[#1e1f24]/90 backdrop-blur-md p-1 rounded-xl shadow-lg border border-zinc-700/80">
        {dimensionMode === '2d' && (
          <button
            id="quick-lock-btn"
            onClick={() => setIsPhysicsLocked((prev) => !prev)}
            title={isPhysicsLocked ? "Déverrouiller le mouvement (Mettre en mouvement)" : "Verrouiller les positions (Figer)"}
            className={`p-1.5 rounded-lg transition-colors ${
              isPhysicsLocked
                ? 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                : 'text-emerald-400 bg-emerald-950/60 ring-1 ring-emerald-500/40 hover:bg-emerald-900/60'
            }`}
          >
            {isPhysicsLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
        )}
        <button
          id="zoom-in-btn"
          onClick={() => setZoom((prev) => Math.min(3.2, prev * 1.18))}
          title="Zoom avant"
          className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          id="zoom-out-btn"
          onClick={() => setZoom((prev) => Math.max(0.25, prev * 0.82))}
          title="Zoom arrière"
          className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          id="reset-view-btn"
          onClick={handleResetView}
          title="Recentrer la vue Réseau"
          className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Obsidian Group Tags Legend */}
      {dimensionMode === '2d' && !hoveredNode && !reactivatedSubgraph && (
        <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 bg-[#1e1f24]/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-zinc-700/70 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] shadow-xs" />
            <span>Expériences</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1] shadow-xs" />
            <span>Missions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] shadow-xs" />
            <span>Compétences</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899] shadow-xs" />
            <span>Cognition</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shadow-xs" />
            <span>Horizons</span>
          </div>
        </div>
      )}
    </div>
  );
};
