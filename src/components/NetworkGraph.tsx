import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { AnyCognitiveNode, GraphEdge, NodeCategory, GameCartographyMode, RpgStampType, QuestItem, QuestPriority, QuestType } from '../types';
import { calculateSkillVitality, getVitalityStatus } from '../utils/decay';
import { getNodeVisualDescriptor } from '../utils/nodeVisualDescriptor';
import { 
  DimensionMode, 
  NodeSpatialData, 
  CameraOrbit,
  getNodeStrataLayer, 
  getLayerZOffset,
  extractNodeYear,
  computeChronologicalGraphYears,
  project3DToScreen
} from '../utils/graphDimensions';
import { 
  RPG_STAMPS, 
  DEFAULT_INITIAL_STAMPS, 
  calculateCompassAngle, 
  getAriadneThreadEdges,
  generateInitialQuests,
  CARTOGRAPHY_MODELS,
  CartographyModelDef,
  CartographyEffectItem
} from '../utils/rpgCartography';
import { GraphLegendModal } from './GraphLegendModal';
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
  Unlock,
  Rotate3d,
  BookOpen,
  Eye,
  EyeOff,
  Compass,
  Maximize2,
  HelpCircle,
  Gamepad2,
  Map as MapIcon,
  Flag,
  Star,
  Target,
  Shield,
  Crosshair,
  Crown,
  Tag,
  Check,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  Info,
  CheckCircle2,
  CircleDashed,
  AlertCircle,
  Sparkle,
  Award,
  Filter
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

  // Dimension Mode: '3d' (Navigation Espace 3D), '2d' (Obsidian Graphe Réseau), 'timeline' (Mon parcours)
  const [dimensionMode, setDimensionMode] = useState<DimensionMode>('3d');
  
  // Lock / Unlock Physics & Motion state (false = en mouvement dynamique, true = figé/verrouillé)
  const [isPhysicsLocked, setIsPhysicsLocked] = useState<boolean>(false);
  
  // 3D Auto-Rotate Turntable
  const [is3DAutoRotate, setIs3DAutoRotate] = useState<boolean>(false);

  // Legend Modal Visibility
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(false);

  // Multi-select Category Filters (Set of active keys)
  const [selectedFilterKeys, setSelectedFilterKeys] = useState<Set<FilterCategoryKey>>(
    new Set<FilterCategoryKey>(['experience', 'task', 'skill', 'cognition', 'matching'])
  );

  // Timeline Player state
  const [timelineYear, setTimelineYear] = useState<number>(2026);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);
  const [timelineSpeed, setTimelineSpeed] = useState<number>(1);
  const [showGhosts, setShowGhosts] = useState<boolean>(true);

  // 2D Viewport State (Zoom & Pan)
  const [zoom, setZoom] = useState<number>(0.95);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState<string>('');

  // --- CARTE JEUX VIDÉO & BENCHMARK RPG HUD STATE ---
  const [gameMapMode, setGameMapMode] = useState<GameCartographyMode>('hybrid');
  const [isCartoFilterActive, setIsCartoFilterActive] = useState<boolean>(true);
  const [isCartoEffectsInspectorOpen, setIsCartoEffectsInspectorOpen] = useState<boolean>(false);
  const [customEffectToggles, setCustomEffectToggles] = useState<Record<string, boolean>>({});
  const [isRpgDrawerOpen, setIsRpgDrawerOpen] = useState<boolean>(false);
  const [isStampBoxOpen, setIsStampBoxOpen] = useState<boolean>(false);
  const [activeStampTool, setActiveStampTool] = useState<RpgStampType | null>(null);
  const [stamps, setStamps] = useState<Record<string, RpgStampType>>(() => {
    try {
      const saved = localStorage.getItem('cognitorium_rpg_stamps');
      return saved ? JSON.parse(saved) : DEFAULT_INITIAL_STAMPS;
    } catch {
      return DEFAULT_INITIAL_STAMPS;
    }
  });
  const [isFogOfWarEnabled, setIsFogOfWarEnabled] = useState<boolean>(true);
  const [ariadneTargetId, setAriadneTargetId] = useState<string | null>(null);

  // --- GESTION DES QUÊTES (PRINCIPALES & SECONDAIRES, PRIORITÉS, VALIDATION) ---
  const [quests, setQuests] = useState<QuestItem[]>(() => {
    try {
      const saved = localStorage.getItem('cognitorium_rpg_quests');
      return saved ? JSON.parse(saved) : generateInitialQuests(nodes);
    } catch {
      return generateInitialQuests(nodes);
    }
  });
  const [questFilter, setQuestFilter] = useState<'all' | 'main' | 'secondary' | 'pending' | 'completed'>('all');

  // Synchroniser ou enrichir la liste des quêtes quand les nœuds changent
  useEffect(() => {
    setQuests((prev) => {
      const existingMap = new Map(prev.map(q => [q.nodeId, q]));
      const newGenerated = generateInitialQuests(nodes);
      return newGenerated.map(g => existingMap.get(g.nodeId) || g);
    });
  }, [nodes]);

  // Persister les quêtes
  useEffect(() => {
    try {
      localStorage.setItem('cognitorium_rpg_quests', JSON.stringify(quests));
    } catch {
      // ignore
    }
  }, [quests]);

  // Persist stamps
  useEffect(() => {
    try {
      localStorage.setItem('cognitorium_rpg_stamps', JSON.stringify(stamps));
    } catch {
      // ignore
    }
  }, [stamps]);
  
  // 3D Orbital Camera State
  const cameraRef = useRef<CameraOrbit>({
    pitch: 0.38, // élévation naturelle
    yaw: 0.52,   // angle azimutal
    distance: 680,
    fov: 650,
    panX: 0,
    panY: 0
  });

  const [isDraggingCanvas, setIsDraggingCanvas] = useState<boolean>(false);
  const [dragMode, setDragMode] = useState<'orbit' | 'pan' | 'node'>('orbit');
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Spatial node storage with velocity for 3D/2D force-directed physics
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

  // Fil d'Ariane mythologique guidance paths (faisceau lumineux d'or vers le métier cible)
  const ariadneThreadEdges = useMemo(() => {
    return getAriadneThreadEdges(edges, nodes, selectedNodeId || ariadneTargetId);
  }, [edges, nodes, selectedNodeId, ariadneTargetId]);

  // Calculate chronological graph years for all nodes
  const nodeYearsMap = useMemo(() => {
    return computeChronologicalGraphYears(nodes, edges);
  }, [nodes, edges]);

  // Direct Neighbors set when a node is clicked / selected
  const selectedNeighbors = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    const set = new Set<string>();
    set.add(selectedNodeId);
    edges.forEach((edge) => {
      if (edge.source === selectedNodeId) set.add(edge.target);
      if (edge.target === selectedNodeId) set.add(edge.source);
    });
    return set;
  }, [selectedNodeId, edges]);

  const selectedNodeData = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodes.find(n => n.id === selectedNodeId) || null;
  }, [selectedNodeId, nodes]);

  const timelineStats = useMemo(() => {
    if (dimensionMode !== 'timeline') return null;
    let unlockedTotal = 0;
    const newlyUnlockedNames: string[] = [];
    nodes.forEach((n) => {
      const y = nodeYearsMap.get(n.id) ?? extractNodeYear(n);
      if (y <= timelineYear) {
        unlockedTotal++;
      }
      if (y === timelineYear) {
        newlyUnlockedNames.push(n.name);
      }
    });
    return {
      unlockedTotal,
      newlyUnlockedCount: newlyUnlockedNames.length,
      sampleNames: newlyUnlockedNames.slice(0, 3)
    };
  }, [dimensionMode, nodes, nodeYearsMap, timelineYear]);

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

  // Initialize node layout data with 3D stratified coordinates & 2D circular layout
  useEffect(() => {
    const existingMap = new Map(spatialNodesRef.current.map((n) => [n.id, n]));

    spatialNodesRef.current = nodes.map((node, index) => {
      const existing = existingMap.get(node.id);
      const layerIndex = getNodeStrataLayer(node);
      const year = nodeYearsMap.get(node.id) ?? extractNodeYear(node);
      const degree = nodeDegrees.get(node.id) || 1;

      // Obsidian dynamic node radius based on connection degree and importance
      let baseRadius = 13 + Math.min(20, degree * 2.0);
      if (node.category === 'experience' || node.category === 'formation') baseRadius += 5;
      if (node.category === 'horizon_job') baseRadius += 4;

      // 2D Initial polar coordinates
      const angle = (index / nodes.length) * Math.PI * 2 + (layerIndex * 1.25);
      const dist = 120 + ((index * 47) % 240);
      const default2dX = Math.cos(angle) * dist;
      const default2dY = Math.sin(angle) * dist;

      // 3D Initial stratified coordinates: Z depth depends on cognitive strata
      const zOffset = getLayerZOffset(layerIndex);
      const angle3d = (index / nodes.length) * Math.PI * 2 + (layerIndex * 0.9);
      const radius3d = 90 + ((index * 31) % 190);
      const default3dX = Math.cos(angle3d) * radius3d;
      const default3dY = Math.sin(angle3d) * radius3d * 0.75;
      const default3dZ = zOffset + ((index % 5) - 2) * 18;

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
        x3d: existing?.x3d ?? default3dX,
        y3d: existing?.y3d ?? default3dY,
        z3d: existing?.z3d ?? default3dZ,
        vx3d: existing?.vx3d ?? 0,
        vy3d: existing?.vy3d ?? 0,
        vz3d: existing?.vz3d ?? 0,
        xTimeline: timelineX,
        yTimeline: timelineY
      };
    });
  }, [nodes, nodeDegrees, nodeYearsMap, simulationYear]);

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

  // Main Canvas Rendering Loop (Supports 3D, 2D, and Timeline)
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
      bgGrad.addColorStop(0, '#1c1d24');
      bgGrad.addColorStop(0.65, '#121318');
      bgGrad.addColorStop(1, '#0b0c0f');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Handle 3D Auto-rotation
      if (dimensionMode === '3d' && is3DAutoRotate && !isDraggingCanvas) {
        cameraRef.current.yaw += 0.0035;
      }

      // --- 3D SPACE AXIS & STRATA GUIDES (Subtle 3D plane rings) ---
      if (dimensionMode === '3d') {
        const cam = cameraRef.current;
        
        // Draw subtle depth circles for the cognitive stratigraphy
        [-160, -80, 0, 80, 160].forEach((zLevel, idx) => {
          const centerProj = project3DToScreen(0, 0, zLevel, cam, width, height);
          if (centerProj.isVisible) {
            ctx.save();
            ctx.beginPath();
            const radiusProj = 210 * centerProj.scale;
            ctx.ellipse(centerProj.x2d, centerProj.y2d, radiusProj, radiusProj * 0.45, 0, 0, Math.PI * 2);
            ctx.strokeStyle = idx === 2 ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.035)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 6]);
            ctx.stroke();
            ctx.restore();
          }
        });
      } else {
        // --- 2D SUBTLE GRID DOTS ---
        ctx.save();
        ctx.translate(pan.x, pan.y);
        ctx.scale(zoom, zoom);

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
        ctx.restore();
      }

      const pNodes = spatialNodesRef.current;
      const rawNodeMap = new Map(nodes.map((n) => [n.id, n]));
      const pNodeMap = new Map(pNodes.map((n) => [n.id, n]));

      // --- REAL DATA CALIBRATED PHYSICS SIMULATION (3D or 2D) ---
      if (!isPhysicsLocked) {
        const timeNow = performance.now() * 0.001;

        if (dimensionMode === '3d') {
          // --- 3D PHYSICS FORCES ---
          const baseRepel3d = 550;
          for (let i = 0; i < pNodes.length; i++) {
            const n1 = pNodes[i];
            const deg1 = nodeDegrees.get(n1.id) || 1;

            // 3D Organic floating
            const phase = i * 1.1;
            n1.vx3d = (n1.vx3d || 0) + Math.sin(timeNow + phase) * 0.03;
            n1.vy3d = (n1.vy3d || 0) + Math.cos(timeNow * 0.85 + phase) * 0.03;
            n1.vz3d = (n1.vz3d || 0) + Math.sin(timeNow * 0.7 + phase) * 0.02;

            // 3D Coulomb Repulsion
            for (let j = i + 1; j < pNodes.length; j++) {
              const n2 = pNodes[j];
              const deg2 = nodeDegrees.get(n2.id) || 1;
              const dx = n2.x3d - n1.x3d;
              const dy = n2.y3d - n1.y3d;
              const dz = n2.z3d - n1.z3d;
              const dist = Math.hypot(dx, dy, dz) || 1;

              if (dist < 260) {
                const effectiveDist = Math.max(dist, 25);
                const repelMultiplier = 1 + (deg1 + deg2) * 0.08;
                const rawForce = (baseRepel3d * repelMultiplier) / (effectiveDist * effectiveDist);
                const force = Math.min(2.2, rawForce);
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;
                const fz = (dz / dist) * force;

                n1.vx3d = (n1.vx3d || 0) - fx;
                n1.vy3d = (n1.vy3d || 0) - fy;
                n1.vz3d = (n1.vz3d || 0) - fz;
                n2.vx3d = (n2.vx3d || 0) + fx;
                n2.vy3d = (n2.vy3d || 0) + fy;
                n2.vz3d = (n2.vz3d || 0) + fz;
              }
            }
          }

          // 3D Edge Springs
          edges.forEach((edge) => {
            const n1 = pNodeMap.get(edge.source);
            const n2 = pNodeMap.get(edge.target);
            if (!n1 || !n2) return;

            let targetDist = 95;
            let stiffness = 0.016;
            if (edge.type === 'composed_of') { targetDist = 65; stiffness = 0.026; }
            else if (edge.type === 'demonstrates_skill' || edge.type === 'acquired_in') { targetDist = 80; stiffness = 0.022; }
            else if (edge.type === 'feeds_capacity') { targetDist = 110; stiffness = 0.014; }
            else if (edge.type === 'unlocks_horizon') { targetDist = 135; stiffness = 0.011; }

            const dx = n2.x3d - n1.x3d;
            const dy = n2.y3d - n1.y3d;
            const dz = n2.z3d - n1.z3d;
            const dist = Math.hypot(dx, dy, dz) || 1;
            const displacement = dist - targetDist;
            const force = Math.max(-2.2, Math.min(2.2, displacement * stiffness));

            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            const fz = (dz / dist) * force;

            n1.vx3d = (n1.vx3d || 0) + fx;
            n1.vy3d = (n1.vy3d || 0) + fy;
            n1.vz3d = (n1.vz3d || 0) + fz;
            n2.vx3d = (n2.vx3d || 0) - fx;
            n2.vy3d = (n2.vy3d || 0) - fy;
            n2.vz3d = (n2.vz3d || 0) - fz;
          });

          // 3D Central Gravity & Z-layer anchor
          pNodes.forEach((n) => {
            n.vx3d = (n.vx3d || 0) - n.x3d * 0.003;
            n.vy3d = (n.vy3d || 0) - n.y3d * 0.003;

            // Anchor gently toward its stratum Z-offset
            const targetZ = getLayerZOffset(n.layerIndex);
            const zDiff = targetZ - n.z3d;
            n.vz3d = (n.vz3d || 0) + zDiff * 0.018;

            // Damping
            n.vx3d = (n.vx3d || 0) * 0.78;
            n.vy3d = (n.vy3d || 0) * 0.78;
            n.vz3d = (n.vz3d || 0) * 0.78;

            if (n.id !== draggedNodeId) {
              n.x3d += n.vx3d;
              n.y3d += n.vy3d;
              n.z3d += n.vz3d;
            }
          });

        } else {
          // --- 2D & TIMELINE PHYSICS FORCES ---
          const baseRepel = 750;
          const minDist = 30;
          for (let i = 0; i < pNodes.length; i++) {
            const n1 = pNodes[i];
            const deg1 = nodeDegrees.get(n1.id) || 1;

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

          edges.forEach((edge) => {
            const n1 = pNodeMap.get(edge.source);
            const n2 = pNodeMap.get(edge.target);
            if (!n1 || !n2) return;

            let targetDist = 95;
            let springStiffness = 0.018;
            const edgeStrength = typeof edge.strength === 'number' ? edge.strength : 0.7;

            if (edge.type === 'composed_of') {
              targetDist = 65;
              springStiffness = 0.028 * (0.8 + edgeStrength * 0.4);
            } else if (edge.type === 'demonstrates_skill' || edge.type === 'acquired_in') {
              targetDist = 80;
              springStiffness = 0.024 * (0.8 + edgeStrength * 0.4);
            } else if (edge.type === 'feeds_capacity') {
              targetDist = 110;
              springStiffness = 0.016 * (0.8 + edgeStrength * 0.4);
            } else if (edge.type === 'unlocks_horizon') {
              targetDist = 140;
              springStiffness = 0.012 * (0.8 + edgeStrength * 0.4);
            }

            const dx = n2.x2d - n1.x2d;
            const dy = n2.y2d - n1.y2d;
            const dist = Math.hypot(dx, dy) || 1;
            const displacement = dist - targetDist;
            const force = Math.max(-2.5, Math.min(2.5, displacement * springStiffness));
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            n1.vx += fx;
            n1.vy += fy;
            n2.vx += fx;
            n2.vy += fy;
          });

          const gravity = 0.0032;
          pNodes.forEach((n) => {
            n.vx -= n.x2d * gravity;
            n.vy -= n.y2d * gravity;

            const distFromCenter = Math.hypot(n.x2d, n.y2d);
            if (distFromCenter > 420) {
              const excess = distFromCenter - 420;
              n.vx -= (n.x2d / distFromCenter) * (excess * 0.012);
              n.vy -= (n.y2d / distFromCenter) * (excess * 0.012);
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
        }
      } else {
        // When physics is locked, freeze velocities
        pNodes.forEach((n) => {
          n.vx = 0;
          n.vy = 0;
          n.vx3d = 0;
          n.vy3d = 0;
          n.vz3d = 0;
        });
      }

      // --- MULTI-FILTER VISIBILITY LOGIC ---
      const isCategoryActive = (node: AnyCognitiveNode) => {
        for (const group of CATEGORY_GROUPS) {
          if (selectedFilterKeys.has(group.key) && group.categories.includes(node.category)) {
            return true;
          }
        }
        return false;
      };

      const isVisible = (node: AnyCognitiveNode) => {
        if (!isCategoryActive(node)) return false;
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

      // --- PROJECT ALL NODES TO 2D SCREEN ACCORDING TO CURRENT MODE ---
      const cam = cameraRef.current;
      const projectedList = pNodes.map((n) => {
        const raw = rawNodeMap.get(n.id);
        let screenX = 0;
        let screenY = 0;
        let scale = 1;
        let depth = 0;
        let lightAngle = 0;
        let isVisible3d = true;

        if (dimensionMode === '3d') {
          const proj = project3DToScreen(n.x3d, n.y3d, n.z3d, cam, width, height);
          screenX = proj.x2d;
          screenY = proj.y2d;
          scale = proj.scale;
          depth = proj.depth;
          lightAngle = proj.lightAngle;
          isVisible3d = proj.isVisible;
        } else {
          screenX = width / 2 + pan.x + n.x2d * zoom;
          screenY = height / 2 + pan.y + n.y2d * zoom;
          scale = zoom;
          depth = 0;
          lightAngle = -0.75;
          isVisible3d = true;
        }

        const isTimelineActive = dimensionMode !== 'timeline' || (n.yearAcquired <= timelineYear);
        const isNewlyActivated = dimensionMode === 'timeline' && n.yearAcquired === timelineYear;

        return {
          node: n,
          rawNode: raw,
          x: screenX,
          y: screenY,
          scale,
          depth,
          lightAngle,
          isVisible3d,
          isTimelineActive,
          isNewlyActivated,
          radiusScreen: n.radius * scale
        };
      });

      const projectedMap = new Map(projectedList.map((p) => [p.node.id, p]));

      // Active focus target (hovered or selected)
      const activeFocusNodeId = hoveredNodeId || selectedNodeId;
      const activeNeighborSet = hoveredNodeId ? hoveredNeighbors : (selectedNodeId ? selectedNeighbors : null);

      // --- PARAMÈTRES DU MODÈLE CARTOGRAPHIQUE & FILTRES D'EFFETS ---
      const activeCartoModel = CARTOGRAPHY_MODELS[gameMapMode] || CARTOGRAPHY_MODELS.hybrid;
      const isCartoActive = isCartoFilterActive;
      
      const effectiveLabelsMode = customEffectToggles.labels !== undefined
        ? (customEffectToggles.labels ? 'all' : 'minimal')
        : (isCartoActive ? activeCartoModel.filterBehavior.labels : 'contextual');

      const effectiveVitalityMode = customEffectToggles.vitality !== undefined
        ? (customEffectToggles.vitality ? 'all' : 'hover_only')
        : (isCartoActive ? activeCartoModel.filterBehavior.vitalityRings : 'skills');

      const effectiveAriadneMode = customEffectToggles.ariadne !== undefined
        ? (customEffectToggles.ariadne ? 'radiant_beacon' : 'balanced')
        : (isCartoActive ? activeCartoModel.filterBehavior.ariadneGlow : 'balanced');

      const effectiveStampsMode = customEffectToggles.stamps !== undefined
        ? customEffectToggles.stamps
        : (isCartoActive ? activeCartoModel.filterBehavior.stampsVisible : true);

      const effectivePoiMode = customEffectToggles.poi !== undefined
        ? (customEffectToggles.poi ? 'prominent' : 'hidden')
        : (isCartoActive ? activeCartoModel.filterBehavior.poiAlerts : 'contextual');

      // --- 1. DESSIN DES LIENS (3D / 2D GLOWING EDGES) ---
      edges.forEach((edge) => {
        const src = projectedMap.get(edge.source);
        const tgt = projectedMap.get(edge.target);
        if (!src || !tgt || !src.rawNode || !tgt.rawNode) return;
        if (!src.isVisible3d || !tgt.isVisible3d) return;
        if (!isVisible(src.rawNode) || !isVisible(tgt.rawNode)) return;

        if (dimensionMode === 'timeline' && (!src.isTimelineActive || !tgt.isTimelineActive)) {
          return;
        }

        const isDirectConnection = Boolean(activeFocusNodeId && (edge.source === activeFocusNodeId || edge.target === activeFocusNodeId));
        const isAriadneConnection = Boolean(ariadneThreadEdges.has(edge.id));
        const isDimmed = Boolean(
          (activeFocusNodeId && !isDirectConnection && !isAriadneConnection) ||
          (isCartoActive && gameMapMode === 'minimalist' && !isDirectConnection && !isAriadneConnection)
        );

        let strokeColor = 'rgba(161, 161, 170, 0.22)';
        let lineWidth = 1.2 * Math.min(1.6, Math.max(0.6, (src.scale + tgt.scale) / 2));

        if (isDirectConnection) {
          strokeColor = 'rgba(56, 189, 248, 0.95)';
          lineWidth = 2.4 * Math.max(0.8, (src.scale + tgt.scale) / 2);
        } else if (isAriadneConnection) {
          strokeColor = effectiveAriadneMode === 'radiant_beacon' ? 'rgba(251, 191, 36, 0.95)' : 'rgba(245, 158, 11, 0.85)';
          lineWidth = (effectiveAriadneMode === 'radiant_beacon' ? 2.8 : 2.2) * Math.max(0.8, (src.scale + tgt.scale) / 2);
        } else if (dimensionMode === 'timeline' && (src.isNewlyActivated || tgt.isNewlyActivated)) {
          strokeColor = 'rgba(251, 191, 36, 0.9)';
          lineWidth = 2.0;
        } else if (isDimmed) {
          strokeColor = 'rgba(100, 116, 139, 0.05)';
          lineWidth = 0.6;
        } else {
          const colorMeta = OBSIDIAN_COLORS[src.node.category] || OBSIDIAN_COLORS.experience;
          strokeColor = colorMeta.glow.replace('0.45', '0.26');
        }

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        // Fil d'Ariane mythologique : Particules dorées lumineuses circulant le long des chemins vers le métier cible
        if (isAriadneConnection && !isDimmed) {
          const time = Date.now() * 0.0015;
          const particleCount = effectiveAriadneMode === 'radiant_beacon' ? 3 : 2;
          for (let p = 0; p < particleCount; p++) {
            const tOffset = ((time + p / particleCount + (src.x % 100) * 0.01) % 1);
            const px = src.x + (tgt.x - src.x) * tOffset;
            const py = src.y + (tgt.y - src.y) * tOffset;
            const pRadius = (effectiveAriadneMode === 'radiant_beacon' ? 3.0 : 2.5) * Math.min(1.3, Math.max(0.7, (src.scale + tgt.scale) / 2));

            ctx.save();
            ctx.beginPath();
            ctx.arc(px, py, pRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#fef08a';
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = effectiveAriadneMode === 'radiant_beacon' ? 12 : 8;
            ctx.fill();
            ctx.restore();
          }
        }

        // Arrow heads on directional links
        if (!isDimmed && ((src.scale > 0.55 && tgt.scale > 0.55) || isDirectConnection)) {
          const arrowLength = 7 * Math.min(1.4, Math.max(0.7, (src.scale + tgt.scale) / 2));
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
          ctx.fillStyle = isDirectConnection 
            ? '#38bdf8' 
            : (dimensionMode === 'timeline' && (src.isNewlyActivated || tgt.isNewlyActivated) 
                ? '#fbbf24' 
                : 'rgba(148, 163, 184, 0.4)');
          ctx.fill();
          ctx.restore();
        }
      });

      // --- 2. DESSIN DES NŒUDS (3D DEPTH SORTED ORBS) ---
      // In 3D mode, sort by Z-depth (farthest rendered first, closest last for perfect depth occlusion)
      const sortedNodes = [...projectedList].sort((a, b) => {
        if (dimensionMode === '3d') {
          // Farthest (higher depth in camera space) drawn first
          return b.depth - a.depth;
        }
        if (a.node.id === activeFocusNodeId) return 1;
        if (b.node.id === activeFocusNodeId) return -1;
        if (activeNeighborSet?.has(a.node.id) && !activeNeighborSet?.has(b.node.id)) return 1;
        if (!activeNeighborSet?.has(a.node.id) && activeNeighborSet?.has(b.node.id)) return -1;
        return 0;
      });

      sortedNodes.forEach(({ node, rawNode, x, y, scale, depth, lightAngle, isVisible3d, isTimelineActive, isNewlyActivated, radiusScreen }) => {
        if (!rawNode || !isVisible(rawNode) || !isVisible3d) return;

        // In Mon Parcours mode, unacquired future nodes are displayed as faint subtle ghost placeholders
        if (dimensionMode === 'timeline' && !isTimelineActive) {
          if (!showGhosts) return;
          ctx.save();
          ctx.globalAlpha = 0.12;
          ctx.beginPath();
          ctx.arc(x, y, radiusScreen * 0.65, 0, Math.PI * 2);
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
        const isConnectedNeighbor = Boolean(activeNeighborSet && activeNeighborSet.has(node.id));

        let isDimmed = false;
        if (activeFocusNodeId) {
          isDimmed = !isSelected && !isHovered && !isConnectedNeighbor;
        } else if (isCartoActive && gameMapMode === 'minimalist') {
          const isAriadneNode = ariadneThreadEdges.size > 0 && (node.category === 'horizon_job' || node.id === ariadneTargetId || Array.from(ariadneThreadEdges).some(eId => eId.includes(node.id)));
          isDimmed = !isSelected && !isHovered && !isAriadneNode && (nodeDegrees.get(node.id) || 0) < 4;
        }

        const visualDesc = getNodeVisualDescriptor(rawNode, simulationYear);
        const colorMeta = OBSIDIAN_COLORS[node.category] || { main: visualDesc.color, glow: 'rgba(56, 189, 248, 0.4)', label: node.category };
        let baseColor = colorMeta.main;

        if (node.vitality !== undefined) {
          const vStat = getVitalityStatus(node.vitality);
          baseColor = vStat.colorHex;
        }

        const opacity = isDimmed ? 0.14 : (dimensionMode === '3d' ? Math.max(0.4, Math.min(1, 1.2 - depth * 0.001)) : 1);

        ctx.save();
        ctx.globalAlpha = opacity;

        // --- 3D NEON HALO / GLOW ---
        if ((isSelected || isHovered || isConnectedNeighbor || isNewlyActivated) && !isDimmed) {
          const isRoot = isSelected || isHovered;
          const glowRadius = radiusScreen + (isRoot ? 16 * scale : 10 * scale);
          const glowGrad = ctx.createRadialGradient(x, y, radiusScreen * 0.4, x, y, glowRadius);
          
          if (isNewlyActivated && !isRoot) {
            glowGrad.addColorStop(0, 'rgba(251, 191, 36, 0.85)');
          } else {
            glowGrad.addColorStop(0, isRoot ? 'rgba(56, 189, 248, 0.85)' : colorMeta.glow);
          }
          glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.beginPath();
          ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();
        }

        // --- VITALITY RING (Selon le filtre cartographique actif) ---
        const shouldDrawVitality = !isDimmed && node.vitality !== undefined && (
          effectiveVitalityMode === 'all' ||
          (effectiveVitalityMode === 'skills' && node.category.startsWith('skill_')) ||
          (effectiveVitalityMode === 'hover_only' && (isSelected || isHovered))
        );

        if (shouldDrawVitality && node.vitality !== undefined) {
          ctx.beginPath();
          ctx.arc(x, y, radiusScreen + 3.5 * scale, -Math.PI / 2, -Math.PI / 2 + (node.vitality / 100) * 2 * Math.PI);
          ctx.strokeStyle = baseColor;
          ctx.lineWidth = 2.5 * scale;
          ctx.stroke();
        }

        // --- 3D SPHERICAL SHADED ORB ---
        ctx.beginPath();
        ctx.arc(x, y, radiusScreen, 0, Math.PI * 2);
        
        // 3D Specular lighting gradient based on lighting angle
        const highlightX = x - Math.cos(lightAngle || -0.75) * radiusScreen * 0.35;
        const highlightY = y - Math.sin(lightAngle || -0.75) * radiusScreen * 0.35;
        const bodyGrad = ctx.createRadialGradient(highlightX, highlightY, radiusScreen * 0.1, x, y, radiusScreen);
        bodyGrad.addColorStop(0, '#ffffff');
        bodyGrad.addColorStop(0.2, baseColor);
        bodyGrad.addColorStop(0.85, baseColor);
        bodyGrad.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
        ctx.fillStyle = bodyGrad;
        ctx.fill();

        ctx.strokeStyle = isSelected 
          ? '#ffffff' 
          : (isNewlyActivated ? '#fbbf24' : (isConnectedNeighbor ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.35)'));
        ctx.lineWidth = isSelected ? 2.8 : (isNewlyActivated ? 2.4 : (isConnectedNeighbor ? 2.0 : 1.2));
        ctx.stroke();

        // --- INNER ICON GLYPH ---
        if (radiusScreen > 13 || isHovered || isSelected || isConnectedNeighbor || isNewlyActivated) {
          const fontSize = Math.max(8, Math.round(radiusScreen * 0.72));
          ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(visualDesc.symbol, x, y);
        }

        // --- OBSIDIAN TEXT LABELS (Selon le filtre cartographique actif) ---
        let shouldShowLabel = false;
        if (!isDimmed) {
          if (effectiveLabelsMode === 'all') {
            shouldShowLabel = true;
          } else if (effectiveLabelsMode === 'minimal') {
            shouldShowLabel = isSelected || isHovered || isConnectedNeighbor || isNewlyActivated || (nodeDegrees.get(node.id) || 0) >= 5 || node.category === 'horizon_job';
          } else {
            // 'contextual'
            shouldShowLabel = scale >= 0.65 || isSelected || isHovered || isConnectedNeighbor || isNewlyActivated || (nodeDegrees.get(node.id) || 0) >= 3;
          }
        }

        if (shouldShowLabel) {
          const isHighPrio = isSelected || isHovered || isConnectedNeighbor || isNewlyActivated;
          ctx.font = isHighPrio ? '600 11px Inter, system-ui, sans-serif' : '400 10px Inter, system-ui, sans-serif';
          
          ctx.fillStyle = isHighPrio ? '#ffffff' : 'rgba(212, 212, 216, 0.82)';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
          ctx.shadowBlur = 4;

          let displayName = node.name;
          if (displayName.length > 24 && !isHighPrio && effectiveLabelsMode !== 'all') {
            displayName = displayName.substring(0, 22) + '…';
          }
          
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(displayName, x, y + radiusScreen + (isHighPrio ? 6 : 4));
          
          ctx.shadowBlur = 0;
        }

        // --- RPG STAMP BADGE (Floating Pin - Selon le filtre de tampons) ---
        const nodeStamp = stamps[node.id];
        const shouldShowStamp = nodeStamp && !isDimmed && (effectiveStampsMode || isSelected || isHovered);
        if (shouldShowStamp && nodeStamp) {
          const stampDef = RPG_STAMPS.find((s) => s.type === nodeStamp);
          if (stampDef) {
            const floatOffset = Math.sin(Date.now() * 0.004 + (node.x2d || 0) * 0.1) * 3;
            const stampY = y - radiusScreen - 15 + floatOffset;
            const stampRadius = 11 * Math.min(1.25, Math.max(0.75, scale));

            ctx.save();
            // Background pin badge
            ctx.beginPath();
            ctx.arc(x, stampY, stampRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#090a0f';
            ctx.fill();
            ctx.lineWidth = 1.8;
            ctx.strokeStyle = stampDef.color;
            ctx.shadowColor = stampDef.color;
            ctx.shadowBlur = 8;
            ctx.stroke();

            // Emoji icon
            ctx.font = `${Math.max(9, Math.round(stampRadius * 1.1))}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(stampDef.emoji, x, stampY);
            ctx.restore();
          }
        }

        // --- POINTS D'INTÉRÊT & ALERTES AUDIT (POI Prominents en mode Exhaustif / POI Actif) ---
        if (effectivePoiMode === 'prominent' && !isDimmed) {
          if (node.vitality !== undefined && node.vitality < 60) {
            const poiY = y + radiusScreen + 18;
            ctx.save();
            ctx.font = '700 9px Inter, sans-serif';
            ctx.fillStyle = '#ef4444';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⚠️ Consolidation', x, poiY);
            ctx.restore();
          }
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
    selectedNeighbors,
    zoom, 
    pan, 
    selectedFilterKeys, 
    searchQuery, 
    draggedNodeId, 
    dimensionMode, 
    simulationYear, 
    timelineYear,
    nodeDegrees,
    isPhysicsLocked,
    is3DAutoRotate,
    isDraggingCanvas,
    showGhosts,
    stamps,
    ariadneThreadEdges,
    gameMapMode,
    isCartoFilterActive,
    customEffectToggles
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
    if (!canvas) return { rawX: 0, rawY: 0 };
    const rect = canvas.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    return { rawX, rawY };
  };

  // Find node at mouse screen coordinates (supports both 3D perspective and 2D)
  const findNodeAt = (rawX: number, rawY: number): AnyCognitiveNode | undefined => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    const pNodes = spatialNodesRef.current;
    const rawNodeMap = new Map(nodes.map((n) => [n.id, n]));
    const cam = cameraRef.current;

    // In 3D, check closest to camera first
    const sorted = [...pNodes].sort((a, b) => {
      if (dimensionMode === '3d') {
        return a.z3d - b.z3d; // closer Z first
      }
      return 0;
    });

    for (let i = 0; i < sorted.length; i++) {
      const n = sorted[i];
      const raw = rawNodeMap.get(n.id);
      if (!raw) continue;

      let screenX = 0;
      let screenY = 0;
      let screenRadius = n.radius;

      if (dimensionMode === '3d') {
        const proj = project3DToScreen(n.x3d, n.y3d, n.z3d, cam, width, height);
        if (!proj.isVisible) continue;
        screenX = proj.x2d;
        screenY = proj.y2d;
        screenRadius = n.radius * proj.scale;
      } else {
        screenX = width / 2 + pan.x + n.x2d * zoom;
        screenY = height / 2 + pan.y + n.y2d * zoom;
        screenRadius = n.radius * zoom;
      }

      if (dimensionMode === 'timeline' && n.yearAcquired > timelineYear && !showGhosts) {
        continue;
      }

      const dx = rawX - screenX;
      const dy = rawY - screenY;
      const hitLimit = Math.max(14, screenRadius + 5);

      if (dx * dx + dy * dy <= hitLimit * hitLimit) {
        return raw;
      }
    }
    return undefined;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    const clickedNode = findNodeAt(coords.rawX, coords.rawY);

    if (clickedNode) {
      if (activeStampTool) {
        setStamps((prev) => {
          const next = { ...prev };
          if (next[clickedNode.id] === activeStampTool) {
            delete next[clickedNode.id];
          } else {
            next[clickedNode.id] = activeStampTool;
          }
          return next;
        });
      }
      setDraggedNodeId(clickedNode.id);
      onSelectNode(clickedNode);
    } else {
      setIsDraggingCanvas(true);
      setDragStart({ x: coords.rawX, y: coords.rawY });

      // Determine drag mode: Right click or Shift+Click = Pan, Left click = 3D Orbit in 3D mode / Pan in 2D
      if (e.button === 2 || e.shiftKey) {
        setDragMode('pan');
      } else {
        setDragMode(dimensionMode === '3d' ? 'orbit' : 'pan');
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);

    if (draggedNodeId) {
      // Dragging a single node
      const node = spatialNodesRef.current.find((n) => n.id === draggedNodeId);
      if (node) {
        if (dimensionMode === '2d' || dimensionMode === 'timeline') {
          const canvas = canvasRef.current;
          const width = (canvas?.width || 950) / (window.devicePixelRatio || 1);
          const height = (canvas?.height || 680) / (window.devicePixelRatio || 1);
          node.x2d = (coords.rawX - pan.x - width / 2) / zoom;
          node.y2d = (coords.rawY - pan.y - height / 2) / zoom;
        }
      }
    } else if (isDraggingCanvas) {
      const dx = coords.rawX - dragStart.x;
      const dy = coords.rawY - dragStart.y;
      setDragStart({ x: coords.rawX, y: coords.rawY });

      if (dimensionMode === '3d') {
        if (dragMode === 'orbit') {
          // Orbit 3D rotation
          const cam = cameraRef.current;
          cam.yaw += dx * 0.007;
          cam.pitch = Math.max(-Math.PI * 0.48, Math.min(Math.PI * 0.48, cam.pitch + dy * 0.007));
        } else {
          // Pan 3D translation
          const cam = cameraRef.current;
          cam.panX += dx;
          cam.panY += dy;
        }
      } else {
        // 2D Pan translation
        setPan((prev) => ({
          x: prev.x + dx,
          y: prev.y + dy
        }));
      }
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
    if (dimensionMode === '3d') {
      const zoomDelta = e.deltaY * 0.65;
      cameraRef.current.distance = Math.max(220, Math.min(1800, cameraRef.current.distance + zoomDelta));
    } else {
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      setZoom((prev) => Math.max(0.25, Math.min(3.2, prev * zoomFactor)));
    }
  };

  // Camera presets in 3D
  const setCameraPreset = (preset: 'iso' | 'front' | 'top' | 'reset') => {
    const cam = cameraRef.current;
    cam.panX = 0;
    cam.panY = 0;

    if (preset === 'iso') {
      cam.pitch = 0.42;
      cam.yaw = 0.65;
      cam.distance = 680;
    } else if (preset === 'front') {
      cam.pitch = 0;
      cam.yaw = 0;
      cam.distance = 680;
    } else if (preset === 'top') {
      cam.pitch = Math.PI * 0.46;
      cam.yaw = 0;
      cam.distance = 740;
    } else if (preset === 'reset') {
      cam.pitch = 0.38;
      cam.yaw = 0.52;
      cam.distance = 680;
      setZoom(0.95);
      setPan({ x: 0, y: 0 });
      onSelectNode(null);
    }
  };

  const handleResetView = () => {
    setCameraPreset('reset');
    // Soft recenter nodes
    const total = Math.max(1, spatialNodesRef.current.length);
    spatialNodesRef.current.forEach((n, index) => {
      n.vx = 0;
      n.vy = 0;
      n.vx3d = 0;
      n.vy3d = 0;
      n.vz3d = 0;
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
        if (next.size > 1) {
          next.delete(key);
        } else {
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
      setSelectedFilterKeys(new Set<FilterCategoryKey>(['experience']));
    } else {
      setSelectedFilterKeys(new Set<FilterCategoryKey>(['experience', 'task', 'skill', 'cognition', 'matching']));
    }
  };

  const hoveredNode = useMemo(() => {
    if (!hoveredNodeId) return null;
    return nodes.find(n => n.id === hoveredNodeId) || null;
  }, [hoveredNodeId, nodes]);

  return (
    <div id="cognitorium-network-view" className="relative w-full h-[750px] bg-[#121317] rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col font-sans select-none">
      
      {/* TOP FLOATING OBSIDIAN TOOLBAR */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        
        {/* Left Section: 3D vs 2D vs Timeline Mode Capsule & Controls */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {/* Dimension Mode Capsule */}
          <div className="flex items-center p-1 bg-[#1c1d24]/90 backdrop-blur-md border border-zinc-700/70 rounded-xl shadow-lg text-xs font-medium text-zinc-200">
            {/* 3D Space View */}
            <button
              id="dimension-btn-3d"
              onClick={() => setDimensionMode('3d')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                dimensionMode === '3d' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-semibold ring-1 ring-purple-400/50' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
              title="Navigation Spatiale 3D à 360°"
            >
              <Rotate3d className="w-3.5 h-3.5" />
              <span>Graphe 3D</span>
            </button>

            {/* 2D Obsidian View */}
            <button
              id="dimension-btn-2d"
              onClick={() => setDimensionMode('2d')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                dimensionMode === '2d' 
                  ? 'bg-blue-600/90 text-white shadow-md font-semibold ring-1 ring-blue-400/50' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
              title="Graphe Obsidian 2D Force-Directed"
            >
              <Network className="w-3.5 h-3.5" />
              <span>Graphe 2D</span>
            </button>

            {/* Mon Parcours (Chronologique) */}
            <button
              id="dimension-btn-timeline"
              onClick={() => setDimensionMode('timeline')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                dimensionMode === 'timeline' 
                  ? 'bg-amber-600/90 text-white shadow-md font-semibold ring-1 ring-amber-400/50' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
              title="Mon parcours : Constellation animée dans le temps"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Mon parcours</span>
            </button>
          </div>

          {/* 3D Camera Presets (Only visible in 3D mode) */}
          {dimensionMode === '3d' && (
            <div className="hidden lg:flex items-center gap-1 p-1 bg-[#1c1d24]/90 backdrop-blur-md border border-zinc-700/70 rounded-xl shadow-lg text-[11px] text-zinc-300">
              <button
                onClick={() => setCameraPreset('iso')}
                className="px-2 py-1 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors"
                title="Perspective Isométrique 3D"
              >
                Isométrique
              </button>
              <button
                onClick={() => setCameraPreset('front')}
                className="px-2 py-1 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors"
                title="Vue de Face"
              >
                Face
              </button>
              <button
                onClick={() => setCameraPreset('top')}
                className="px-2 py-1 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors"
                title="Vue du Dessus (Plan)"
              >
                Haut
              </button>
              <button
                onClick={() => setIs3DAutoRotate((r) => !r)}
                className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  is3DAutoRotate ? 'bg-purple-900/60 text-purple-200 ring-1 ring-purple-400/40' : 'hover:bg-zinc-800 hover:text-white'
                }`}
                title="Rotation automatique du graphe 3D"
              >
                <Compass className={`w-3 h-3 ${is3DAutoRotate ? 'animate-spin' : ''}`} />
                <span>Auto-Spin</span>
              </button>
            </div>
          )}

          {/* Lock / Unlock Motion Capsule */}
          <button
            id="graph-lock-toggle-btn"
            onClick={() => setIsPhysicsLocked((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all backdrop-blur-md shadow-lg border ${
              isPhysicsLocked
                ? 'bg-[#1c1d24]/90 text-zinc-400 border-zinc-700/70 hover:text-zinc-200 hover:border-zinc-500'
                : 'bg-emerald-600/90 text-white border-emerald-400/50 shadow-emerald-950/40 hover:bg-emerald-500 ring-1 ring-emerald-400/40'
            }`}
            title={
              isPhysicsLocked
                ? "Positions verrouillées (figé). Cliquez pour déverrouiller et mettre les bulles en mouvement."
                : "Bulles en mouvement dynamique. Cliquez pour verrouiller et figer les positions."
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
                <span className="font-semibold">En mouvement</span>
              </>
            )}
          </button>

          {/* Multi-Select Category Filters Bar */}
          <div className="flex items-center gap-1 p-1 bg-[#1c1d24]/90 backdrop-blur-md border border-zinc-700/70 rounded-xl shadow-lg overflow-x-auto max-w-[560px]">
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

        {/* Right Section: Search & Légende & Distill */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* LÉGENDE BUTTON (EXPLICIT USER REQUIREMENT) */}
          <button
            id="btn-open-legend"
            onClick={() => setIsLegendOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1c1d24]/90 hover:bg-purple-900/60 text-purple-200 hover:text-white rounded-xl text-xs font-bold border border-purple-500/40 shadow-lg transition-all backdrop-blur-md ring-1 ring-purple-500/30"
            title="Ouvrir la légende complète et détaillée du graphe (explications 3D, nœuds, liens, interactions)"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-300" />
            <span>Légende & Guide</span>
          </button>

          {/* BOÎTE À TAMPONS BUTTON (Zelda-style pins) */}
          <button
            id="btn-open-stamps"
            onClick={() => setIsStampBoxOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all backdrop-blur-md shadow-lg border ${
              isStampBoxOpen || activeStampTool
                ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400/50 shadow-amber-900/40'
                : 'bg-[#1c1d24]/90 hover:bg-amber-950/60 text-amber-300 hover:text-white border-amber-500/40'
            }`}
            title="Boîte à Tampons : Marquer et baliser vos nœuds clés (Zelda TOTK/BOTW)"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Tampons</span>
            <span className="px-1.5 py-0.2 bg-black/30 rounded-full text-[10px] font-mono">
              {Object.keys(stamps).length}
            </span>
          </button>

          {/* RPG QUEST LEDGER BUTTON */}
          <button
            id="btn-open-rpg-ledger"
            onClick={() => setIsRpgDrawerOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all backdrop-blur-md shadow-lg border ${
              isRpgDrawerOpen
                ? 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-400/50 shadow-indigo-950/50'
                : 'bg-[#1c1d24]/90 hover:bg-indigo-950/60 text-indigo-300 hover:text-white border-indigo-500/40'
            }`}
            title="Journal de Quêtes & Points d'Intérêt (RPG)"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Journal Quêtes</span>
          </button>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              id="graph-search-input"
              type="text"
              placeholder="Rechercher un nœud..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-[#1c1d24]/90 backdrop-blur-md rounded-xl text-xs text-zinc-200 placeholder-zinc-500 border border-zinc-700/70 focus:outline-none focus:ring-2 focus:ring-purple-500 w-32 lg:w-40 shadow-lg"
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

      {/* SECONDARY RPG CARTOGRAPHY CONTROLS & EFFECTS FILTER SUB-BAR */}
      <div className="absolute top-15 left-3.5 right-3.5 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Section: Model Selector & Filter State */}
        <div className="flex items-center gap-1.5 flex-wrap pointer-events-auto">
          {/* Cartography Archetype Preset Selector */}
          <div className="flex items-center p-1 bg-[#181920]/95 backdrop-blur-md border border-zinc-800 rounded-xl shadow-lg text-[11px] text-zinc-300">
            <span className="px-2 py-1 text-zinc-400 font-semibold flex items-center gap-1.5">
              <MapIcon className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Modèle Carto :</span>
            </span>
            <button
              onClick={() => {
                setGameMapMode('hybrid');
                setCustomEffectToggles({});
              }}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-medium ${
                gameMapMode === 'hybrid'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
              title="Modèle Hybride Évolutif : Signalétique contextuelle, tampons personnalisés et exploration progressive"
            >
              <span>🌿 Hybride</span>
            </button>
            <button
              onClick={() => {
                setGameMapMode('minimalist');
                setCustomEffectToggles({});
              }}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-medium ${
                gameMapMode === 'minimalist'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
              title="Modèle Diégétique (Fil d'Ariane) : Épure visuelle, faisceau d'or radiant vers le métier cible"
            >
              <span>✨ Fil d'Ariane</span>
            </button>
            <button
              onClick={() => {
                setGameMapMode('maximalist');
                setCustomEffectToggles({});
              }}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-medium ${
                gameMapMode === 'maximalist'
                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
              title="Modèle Exhaustif Guidé : Tous les POI, points d'interrogation, jauges et métriques affichés en permanence"
            >
              <span>🗺️ Exhaustif</span>
            </button>
          </div>

          {/* Active Filter Master Toggle (Actif vs Inactif) */}
          <button
            onClick={() => setIsCartoFilterActive((v) => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all backdrop-blur-md shadow-lg border ${
              isCartoFilterActive
                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50 shadow-emerald-950/30'
                : 'bg-zinc-900/80 text-zinc-400 border-zinc-700/60'
            }`}
            title="Activer ou désactiver les filtres et effets cartographiques"
          >
            <Filter className={`w-3.5 h-3.5 ${isCartoFilterActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
            <span>{isCartoFilterActive ? 'Filtre : Actif' : 'Filtre : Désactivé'}</span>
          </button>

          {/* Effects Inspector Trigger Button */}
          <div className="relative">
            <button
              onClick={() => setIsCartoEffectsInspectorOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all backdrop-blur-md shadow-lg border ${
                isCartoEffectsInspectorOpen
                  ? 'bg-indigo-600 text-white border-indigo-400'
                  : 'bg-[#181920]/95 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
              }`}
              title="Inspecter et moduler les effets visuels actifs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Effets Carto</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isCartoEffectsInspectorOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Effects Inspector Popover */}
            {isCartoEffectsInspectorOpen && (
              <div className="absolute top-9 left-0 w-80 z-30 bg-[#16171d]/98 backdrop-blur-xl border border-indigo-500/40 rounded-2xl shadow-2xl p-3.5 text-zinc-200 animate-in fade-in zoom-in-95 duration-150 pointer-events-auto">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white">Inspecteur d'Effets Actifs</span>
                  </div>
                  <button
                    onClick={() => setCustomEffectToggles({})}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 underline font-medium"
                    title="Réinitialiser au profil du modèle"
                  >
                    Profil par défaut
                  </button>
                </div>

                {/* Model Description Header */}
                <div className="bg-zinc-900/80 rounded-xl p-2 border border-zinc-800 mb-3 text-[10px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      <span>{CARTOGRAPHY_MODELS[gameMapMode].icon}</span>
                      <span>{CARTOGRAPHY_MODELS[gameMapMode].name}</span>
                    </span>
                    <span className="text-zinc-400 font-mono text-[9px]">
                      {isCartoFilterActive ? '🟢 Filtre en vigueur' : '⚪ Neutre'}
                    </span>
                  </div>
                  <p className="text-zinc-400 line-clamp-2 leading-relaxed">
                    {CARTOGRAPHY_MODELS[gameMapMode].tagline}
                  </p>
                </div>

                {/* List of Effects & Live Toggles */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-[11px]">
                  {CARTOGRAPHY_MODELS[gameMapMode].effects.map((eff) => {
                    const isCustomOverridden = customEffectToggles[eff.id] !== undefined;
                    const isActive = isCustomOverridden 
                      ? customEffectToggles[eff.id] 
                      : (isCartoFilterActive ? eff.state !== 'inactive' : true);

                    const effectIconMap: Record<string, string> = {
                      labels: '🏷️',
                      ariadne: '⚡',
                      stamps: '🚩',
                      vitality: '🛡️',
                      fog: '🌫️',
                      poi: '❓'
                    };

                    return (
                      <div
                        key={eff.id}
                        className={`p-2 rounded-xl border transition-all ${
                          isActive
                            ? 'bg-zinc-900/90 border-zinc-700/80'
                            : 'bg-zinc-950/40 border-zinc-850 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{effectIconMap[eff.id] || '✨'}</span>
                            <span className="font-semibold text-zinc-200">{eff.label}</span>
                          </div>
                          <button
                            onClick={() => {
                              setCustomEffectToggles((prev) => ({
                                ...prev,
                                [eff.id]: !isActive
                              }));
                            }}
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase transition-all ${
                              isActive
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/50'
                                : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                            }`}
                          >
                            {isActive ? 'Actif' : 'Inactif'}
                          </button>
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-snug">
                          {eff.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Close Button */}
                <div className="mt-3 pt-2 border-t border-zinc-800 flex justify-end">
                  <button
                    onClick={() => setIsCartoEffectsInspectorOpen(false)}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Fermer l'Inspecteur
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Quick Exploration Fog & Path helpers */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsFogOfWarEnabled((f) => !f)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-all backdrop-blur-md shadow-lg border ${
              isFogOfWarEnabled
                ? 'bg-zinc-800/90 text-cyan-300 border-cyan-500/40'
                : 'bg-[#181920]/80 text-zinc-500 border-zinc-800'
            }`}
            title="Brouillard de guerre / Voile d'exploration"
          >
            {isFogOfWarEnabled ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Voile d'exploration</span>
          </button>
        </div>
      </div>

      {/* ACTIVE STAMP TOOL BANNER (Floating feedback when a stamp is equipped) */}
      {activeStampTool && (
        <div className="absolute top-26 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-amber-500 text-slate-950 px-4 py-2 rounded-2xl shadow-2xl border-2 border-amber-300 font-bold text-xs animate-bounce pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="text-base">
              {RPG_STAMPS.find((s) => s.type === activeStampTool)?.emoji}
            </span>
            <span>
              Mode Tampon Actif : Cliquez sur une bulle du graphe pour apposer "{RPG_STAMPS.find((s) => s.type === activeStampTool)?.label}"
            </span>
          </div>
          <button
            onClick={() => setActiveStampTool(null)}
            className="px-2.5 py-1 bg-slate-950 text-amber-300 hover:text-white rounded-lg text-[11px] font-black transition-colors"
          >
            Terminer
          </button>
        </div>
      )}

      {/* TOP-RIGHT RPG COMPASS & RADAR HUD */}
      <div className="absolute top-26 right-3.5 z-20 hidden md:flex flex-col items-end gap-1.5 pointer-events-none">
        <div className="bg-[#181920]/90 backdrop-blur-md p-2 rounded-2xl border border-zinc-800 shadow-xl flex items-center gap-2 text-[11px] text-zinc-300 pointer-events-auto">
          <div className="relative w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center overflow-hidden">
            {/* Compass Needle */}
            <div 
              className="w-0.5 h-6 bg-gradient-to-t from-red-500 via-zinc-400 to-amber-400 rounded-full transition-transform duration-200"
              style={{ 
                transform: `rotate(${dimensionMode === '3d' ? (cameraRef.current.yaw * (180 / Math.PI)) : 0}deg)` 
              }}
            />
            <span className="absolute top-0.5 text-[8px] font-black text-red-400">N</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-amber-400">Radar Cognitif</span>
            <span className="text-[9px] text-zinc-400 font-mono">
              {dimensionMode === '3d' ? `3D Orbit (${Math.round(cameraRef.current.distance)}m)` : `2D (${Math.round(zoom * 100)}%)`}
            </span>
          </div>
        </div>
      </div>

      {/* LEFT DRAWER: JOURNAL DE QUÊTES & FIL D'ARIANE (RPG QUEST LEDGER) */}
      {isRpgDrawerOpen && (
        <div className="absolute top-26 left-3.5 bottom-16 w-96 z-30 bg-[#16171d]/95 backdrop-blur-xl border border-indigo-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-left-3 duration-200 text-zinc-200">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-indigo-950/90 via-purple-950/80 to-slate-900/90 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Journal de Quêtes & Fil d'Ariane</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-indigo-900/60 rounded text-indigo-300 font-mono">
                    {quests.filter(q => q.completed).length}/{quests.length} Validées
                  </span>
                </h3>
                <p className="text-[10px] text-zinc-400">Quêtes Principales & Secondaires, Priorités et Validation</p>
              </div>
            </div>
            <button
              onClick={() => setIsRpgDrawerOpen(false)}
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Ariadne Thread Hero Focus Banner */}
          <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
              <div className="truncate">
                <div className="text-[11px] font-bold text-amber-300 truncate">
                  {ariadneTargetId 
                    ? `Fil d'Ariane vers : ${nodes.find(n => n.id === ariadneTargetId)?.name || 'Cible'}`
                    : "Fil d'Ariane actif (Trajectoire de carrière ROME)"}
                </div>
                <div className="text-[10px] text-zinc-400 truncate">
                  Faisceau d'or reliant vos compétences au sanctuaire cible
                </div>
              </div>
            </div>
            {ariadneTargetId && (
              <button
                onClick={() => setAriadneTargetId(null)}
                className="text-[10px] px-2 py-0.5 bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 rounded border border-amber-500/30 shrink-0 font-medium"
              >
                Auto-Cible
              </button>
            )}
          </div>

          {/* Filter Tab Bar */}
          <div className="px-3 py-2 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between gap-1 text-[11px] overflow-x-auto custom-scrollbar">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setQuestFilter('all')}
                className={`px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${
                  questFilter === 'all'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                Toutes ({quests.length})
              </button>
              <button
                onClick={() => setQuestFilter('main')}
                className={`px-2 py-1 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
                  questFilter === 'main'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Crown className="w-3 h-3 text-amber-400" />
                <span>Principales ({quests.filter(q => q.type === 'main').length})</span>
              </button>
              <button
                onClick={() => setQuestFilter('secondary')}
                className={`px-2 py-1 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
                  questFilter === 'secondary'
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Shield className="w-3 h-3 text-cyan-400" />
                <span>Secondaires ({quests.filter(q => q.type === 'secondary').length})</span>
              </button>
            </div>

            <div className="flex items-center gap-1 border-l border-zinc-800 pl-1.5">
              <button
                onClick={() => setQuestFilter('pending')}
                className={`p-1 px-1.5 rounded text-[10px] transition-colors ${
                  questFilter === 'pending'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Afficher uniquement les quêtes en cours"
              >
                En cours
              </button>
              <button
                onClick={() => setQuestFilter('completed')}
                className={`p-1 px-1.5 rounded text-[10px] transition-colors ${
                  questFilter === 'completed'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Afficher uniquement les quêtes validées"
              >
                Validées
              </button>
            </div>
          </div>

          {/* Quests List Body */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar text-xs">
            {quests
              .filter((q) => {
                if (questFilter === 'main') return q.type === 'main';
                if (questFilter === 'secondary') return q.type === 'secondary';
                if (questFilter === 'pending') return !q.completed;
                if (questFilter === 'completed') return q.completed;
                return true;
              })
              .map((quest) => {
                const node = nodes.find((n) => n.id === quest.nodeId);
                const isSelected = selectedNodeId === quest.nodeId;
                const isAriadneTarget = ariadneTargetId === quest.nodeId;
                const stampType = stamps[quest.nodeId];
                const stampDef = stampType ? RPG_STAMPS.find(s => s.type === stampType) : null;

                // Priority Badge Styles
                const priorityBadgeMap: Record<QuestPriority, { label: string; bg: string }> = {
                  critical: { label: 'Critique', bg: 'bg-red-950/80 text-red-300 border-red-500/50' },
                  high: { label: 'Haute', bg: 'bg-amber-950/80 text-amber-300 border-amber-500/50' },
                  medium: { label: 'Moyenne', bg: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/50' },
                  low: { label: 'Basse', bg: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
                };
                const priorityBadge = priorityBadgeMap[quest.priority] || priorityBadgeMap.medium;

                return (
                  <div
                    key={quest.id}
                    className={`p-2.5 rounded-xl border transition-all flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-purple-950/50 border-purple-500 ring-1 ring-purple-400/40 shadow-lg'
                        : quest.completed
                        ? 'bg-zinc-900/60 border-zinc-800/90 text-zinc-300 hover:border-zinc-700'
                        : 'bg-zinc-900/90 border-amber-500/30 text-white hover:border-amber-500/60'
                    }`}
                  >
                    {/* Top Quest Meta Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Type Badge: Main vs Secondary */}
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1 border ${
                            quest.type === 'main'
                              ? 'bg-purple-950/80 text-purple-200 border-purple-500/40'
                              : 'bg-cyan-950/80 text-cyan-200 border-cyan-500/40'
                          }`}
                        >
                          {quest.type === 'main' ? <Crown className="w-2.5 h-2.5 text-amber-400" /> : <Shield className="w-2.5 h-2.5 text-cyan-400" />}
                          <span>{quest.type === 'main' ? 'Principale' : 'Secondaire'}</span>
                        </span>

                        {/* Priority Selector Pill */}
                        <div className="relative group">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold border ${priorityBadge.bg}`}>
                            {priorityBadge.label}
                          </span>
                        </div>

                        {/* Stamp Icon if applied */}
                        {stampDef && (
                          <span 
                            className="text-[10px] px-1.5 py-0.2 bg-zinc-800 rounded border border-zinc-700 flex items-center gap-1"
                            title={`Repère : ${stampDef.label}`}
                          >
                            <span>{stampDef.emoji}</span>
                            <span className="text-[9px] text-zinc-400 hidden sm:inline">{stampDef.label}</span>
                          </span>
                        )}
                      </div>

                      {/* Validation / Completion Checkbox Toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuests(prev =>
                            prev.map(q =>
                              q.id === quest.id ? { ...q, completed: !q.completed } : q
                            )
                          );
                        }}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all border ${
                          quest.completed
                            ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-500/40'
                            : 'bg-zinc-800/80 hover:bg-amber-950/80 text-zinc-400 hover:text-amber-300 border-zinc-700 hover:border-amber-500/40'
                        }`}
                        title={quest.completed ? 'Marquer comme en cours' : 'Valider cette quête'}
                      >
                        {quest.completed ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Validée</span>
                          </>
                        ) : (
                          <>
                            <CircleDashed className="w-3 h-3 text-amber-400" />
                            <span>En cours</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Quest Title & Node Navigation */}
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          if (node) {
                            onSelectNode(node);
                          }
                        }}
                        className={`text-left font-bold text-xs hover:text-sky-300 transition-colors truncate ${
                          quest.completed ? 'text-zinc-300' : 'text-white'
                        }`}
                      >
                        {quest.title}
                      </button>

                      {/* Set as Ariadne Target Button */}
                      {quest.category === 'horizon_job' && (
                        <button
                          onClick={() => {
                            setAriadneTargetId(quest.nodeId);
                            if (node) onSelectNode(node);
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 shrink-0 border transition-all ${
                            isAriadneTarget
                              ? 'bg-amber-500 text-slate-950 font-bold border-amber-300 shadow-sm'
                              : 'bg-zinc-800 text-amber-300 hover:bg-amber-950 border-amber-500/30'
                          }`}
                          title="Faire converger le Fil d'Ariane vers ce métier cible"
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{isAriadneTarget ? 'Cible Ariane' : 'Viser'}</span>
                        </button>
                      )}
                    </div>

                    {/* Quest Lore & Priority Customizer Controls */}
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-800/80">
                      <div className="flex items-center gap-1">
                        <span className="text-zinc-500">Priorité :</span>
                        {(['critical', 'high', 'medium', 'low'] as QuestPriority[]).map((p) => (
                          <button
                            key={p}
                            onClick={() => {
                              setQuests(prev =>
                                prev.map(q => (q.id === quest.id ? { ...q, priority: p } : q))
                              );
                            }}
                            className={`px-1.5 py-0.2 rounded text-[9px] transition-colors ${
                              quest.priority === p
                                ? 'bg-zinc-700 text-white font-bold border border-zinc-600'
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            {p === 'critical' ? 'Crit.' : p === 'high' ? 'Haut' : p === 'medium' ? 'Moy.' : 'Bas'}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-zinc-500">Type :</span>
                        <button
                          onClick={() => {
                            setQuests(prev =>
                              prev.map(q =>
                                q.id === quest.id
                                  ? { ...q, type: q.type === 'main' ? 'secondary' : 'main' }
                                  : q
                              )
                            );
                          }}
                          className="px-1.5 py-0.2 rounded bg-zinc-800 hover:bg-zinc-700 text-[9px] text-zinc-300 hover:text-white border border-zinc-700"
                        >
                          {quest.type === 'main' ? 'Basculer Secondaire' : 'Basculer Principale'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* RIGHT DRAWER: BOÎTE À TAMPONS (ZELDA TOTK/BOTW CUSTOM STAMP PALETTE) */}
      {isStampBoxOpen && (
        <div className="absolute top-26 right-3.5 bottom-16 w-84 z-30 bg-[#16171d]/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-3 duration-200 text-zinc-200">
          <div className="p-3.5 bg-gradient-to-r from-amber-950/80 to-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400" />
              <div>
                <h3 className="text-xs font-bold text-white">Boîte à Tampons (Zelda UX)</h3>
                <p className="text-[10px] text-zinc-400">Marquez manuellement vos points clés sur la carte</p>
              </div>
            </div>
            <button
              onClick={() => setIsStampBoxOpen(false)}
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3.5 space-y-4 custom-scrollbar text-xs">
            {/* Guide hint */}
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-200 leading-relaxed">
              💡 <strong>Principe Zelda Hybride</strong> : Choisissez un tampon ci-dessous pour l'équiper, puis cliquez sur une bulle du graphe pour apposer ou retirer le repère.
            </div>

            {/* Stamp Palette Grid */}
            <div className="grid grid-cols-2 gap-2">
              {RPG_STAMPS.map((stamp) => {
                const isEquipped = activeStampTool === stamp.type;
                const count = Object.values(stamps).filter(t => t === stamp.type).length;

                return (
                  <button
                    key={stamp.type}
                    onClick={() => {
                      setActiveStampTool(isEquipped ? null : stamp.type);
                    }}
                    className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      isEquipped
                        ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold shadow-lg ring-2 ring-amber-300 scale-[1.02]'
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{stamp.emoji}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${isEquipped ? 'bg-black/30 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                        {count} posé(s)
                      </span>
                    </div>
                    <div className="font-bold text-[11px] leading-tight truncate">{stamp.label}</div>
                    <div className={`text-[9px] line-clamp-2 leading-tight ${isEquipped ? 'text-slate-900 font-medium' : 'text-zinc-400'}`}>
                      {stamp.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Stamped Nodes Quick Access List */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-300">
                <span>Repères placés sur la carte ({Object.keys(stamps).length})</span>
                {Object.keys(stamps).length > 0 && (
                  <button
                    onClick={() => setStamps({})}
                    className="text-[10px] text-red-400 hover:text-red-300 underline"
                  >
                    Tout effacer
                  </button>
                )}
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                {Object.entries(stamps).map(([nodeId, stampType]) => {
                  const node = nodes.find(n => n.id === nodeId);
                  const stampDef = RPG_STAMPS.find(s => s.type === stampType);
                  if (!node || !stampDef) return null;

                  return (
                    <div
                      key={nodeId}
                      className="p-1.5 px-2 bg-zinc-900/60 border border-zinc-800 rounded-lg flex items-center justify-between text-[11px]"
                    >
                      <button
                        onClick={() => {
                          onSelectNode(node);
                        }}
                        className="flex items-center gap-2 truncate text-left hover:text-amber-300"
                      >
                        <span>{stampDef.emoji}</span>
                        <span className="truncate text-zinc-300">{node.name}</span>
                      </button>
                      <button
                        onClick={() => {
                          setStamps(prev => {
                            const next = { ...prev };
                            delete next[nodeId];
                            return next;
                          });
                        }}
                        className="text-zinc-500 hover:text-red-400 p-1"
                        title="Retirer ce tampon"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Navigation Hint Pill (Only in 3D mode) */}
      {dimensionMode === '3d' && !selectedNodeData && (
        <div className="absolute top-16 left-3.5 z-10 hidden sm:flex items-center gap-2 bg-[#1c1d24]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 pointer-events-none">
          <Rotate3d className="w-3.5 h-3.5 text-purple-400" />
          <span>Glissez pour faire pivoter à 360° · Molette pour zoomer en profondeur</span>
        </div>
      )}

      {/* Main Interactive Canvas */}
      <div 
        ref={containerRef} 
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
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

      {/* OBSIDIAN / RPG HOVER CARD TOOLTIP (Bottom-Left preview on hover) */}
      {hoveredNode && (
        <div className="absolute bottom-4 left-4 z-20 max-w-sm bg-[#16171d]/95 backdrop-blur-xl border border-zinc-700/80 p-3.5 rounded-2xl shadow-2xl text-zinc-200 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-100">
          <div className="flex items-center gap-2.5 mb-1.5">
            <span 
              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: OBSIDIAN_COLORS[hoveredNode.category]?.main || '#a855f7' }}
            />
            <h4 className="text-xs font-bold text-white truncate">{hoveredNode.name}</h4>
            <span className="ml-auto text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md font-mono border border-zinc-700">
              {OBSIDIAN_COLORS[hoveredNode.category]?.label || hoveredNode.category}
            </span>
          </div>

          {/* RPG Stamp Indicator */}
          {stamps[hoveredNode.id] && (
            <div className="mb-2 px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-1.5 text-[11px] text-amber-300 font-semibold">
              <span>{RPG_STAMPS.find(s => s.type === stamps[hoveredNode.id])?.emoji}</span>
              <span>Repère : {RPG_STAMPS.find(s => s.type === stamps[hoveredNode.id])?.label}</span>
            </div>
          )}

          {hoveredNode.description && (
            <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
              {hoveredNode.description}
            </p>
          )}

          {/* RPG Vitality / HP Bar */}
          {(hoveredNode as any).vitality !== undefined && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-400 font-medium flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>Vitalité Cognitive (HP)</span>
                </span>
                <span className="font-mono font-bold text-emerald-400">{Math.round((hoveredNode as any).vitality)}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                  style={{ width: `${Math.max(5, Math.min(100, (hoveredNode as any).vitality))}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
            <span>Connexions directes : {nodeDegrees.get(hoveredNode.id) || 0}</span>
            <span className="text-sky-400 font-medium">Cliquez pour isoler</span>
          </div>
        </div>
      )}

      {/* MON PARCOURS CONTROLLER BAR (Timeline Mode) */}
      {dimensionMode === 'timeline' && (
        <div className="absolute bottom-4 left-4 right-20 z-20 bg-[#1c1d24]/95 backdrop-blur-md border border-amber-500/40 p-3 rounded-2xl shadow-2xl text-white flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="p-2 bg-amber-500/20 text-amber-300 rounded-xl shrink-0">
                <Clock className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-amber-200 flex items-center gap-2">
                  <span>Mon Parcours (Progression temporelle)</span>
                  <span className="px-2 py-0.5 bg-amber-500 text-slate-950 rounded font-black text-[11px]">
                    {timelineYear}
                  </span>
                  {timelineStats && (
                    <span className="text-[11px] font-medium text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      {timelineStats.unlockedTotal} / {nodes.length} acquis
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 truncate max-w-xl">
                  {timelineStats && timelineStats.newlyUnlockedCount > 0 ? (
                    <span className="text-amber-300">
                      ✨ Nouveautés {timelineYear} ({timelineStats.newlyUnlockedCount}) : {timelineStats.sampleNames.join(' • ')}
                      {timelineStats.newlyUnlockedCount > 3 ? '…' : ''}
                    </span>
                  ) : (
                    <span>Les items s'allument et se lient selon leur date d'implantation réelle.</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowGhosts((g) => !g)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-xl"
                title="Afficher/masquer les nœuds futurs"
              >
                {showGhosts ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{showGhosts ? 'Futur visible' : 'Futur masqué'}</span>
              </button>

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
            <span className="text-[11px] font-mono text-zinc-400">{minTimelineYear}</span>
            <input
              type="range"
              min={minTimelineYear}
              max={maxTimelineYear}
              step={1}
              value={timelineYear}
              onChange={(e) => setTimelineYear(parseInt(e.target.value, 10))}
              className="flex-1 accent-amber-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
            />
            <span className="text-[11px] font-mono text-zinc-400">{maxTimelineYear}</span>
          </div>
        </div>
      )}

      {/* Bottom Right Floating Navigation Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col items-center gap-1 bg-[#1c1d24]/90 backdrop-blur-md p-1 rounded-xl shadow-lg border border-zinc-700/80">
        <button
          onClick={() => setIsLegendOpen(true)}
          title="Légende & Guide détaillé du graphe"
          className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-purple-900/60 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
        </button>
        <button
          id="quick-lock-btn"
          onClick={() => setIsPhysicsLocked((prev) => !prev)}
          title={isPhysicsLocked ? "Déverrouiller le mouvement" : "Verrouiller les positions (Figer)"}
          className={`p-1.5 rounded-lg transition-colors ${
            isPhysicsLocked
              ? 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              : 'text-emerald-400 bg-emerald-950/60 ring-1 ring-emerald-500/40 hover:bg-emerald-900/60'
          }`}
        >
          {isPhysicsLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </button>
        <button
          id="zoom-in-btn"
          onClick={() => {
            if (dimensionMode === '3d') {
              cameraRef.current.distance = Math.max(220, cameraRef.current.distance * 0.84);
            } else {
              setZoom((prev) => Math.min(3.2, prev * 1.18));
            }
          }}
          title="Zoom avant"
          className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          id="zoom-out-btn"
          onClick={() => {
            if (dimensionMode === '3d') {
              cameraRef.current.distance = Math.min(1800, cameraRef.current.distance * 1.18);
            } else {
              setZoom((prev) => Math.max(0.25, prev * 0.82));
            }
          }}
          title="Zoom arrière"
          className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          id="reset-view-btn"
          onClick={handleResetView}
          title="Recentrer la caméra"
          className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Group Tags Legend (Quick footer indicators) */}
      {!hoveredNode && !selectedNodeId && dimensionMode !== 'timeline' && (
        <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 bg-[#1c1d24]/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-zinc-700/70 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7] shadow-xs" />
            <span>Formations</span>
          </div>
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
          <button
            onClick={() => setIsLegendOpen(true)}
            className="ml-2 text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 text-[11px] underline underline-offset-2"
          >
            <span>+ Guide complet</span>
          </button>
        </div>
      )}

      {/* DETAILED LEGEND & FAQ MODAL */}
      <GraphLegendModal
        isOpen={isLegendOpen}
        onClose={() => setIsLegendOpen(false)}
      />
    </div>
  );
};
