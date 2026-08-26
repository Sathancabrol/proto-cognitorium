import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Lock, Palette, RotateCcw, Search, Settings, SlidersHorizontal, Unlock, ZoomIn, ZoomOut } from 'lucide-react';
import { PsyBranch, PsyNode } from '../../data/psychologyAtlas';
import { NodeRelated } from '../savoirs/NodeRelated';
import { RelatedBundle, relatedForAtlasNode } from '../../data/savoirsLinks';

const TONES: Record<string, string> = {
  blue: '#60a5fa',
  rose: '#fb7185',
  emerald: '#34d399',
  amber: '#fbbf24',
  violet: '#a78bfa',
  teal: '#2dd4bf',
  indigo: '#818cf8',
  slate: '#94a3b8'
};

const DEPTH_COLORS = ['#e2e8f0', '#60a5fa', '#fbbf24', '#34d399', '#fb7185', '#a78bfa'];

const DEPTH_LABELS = [
  'Niveau 0 — Racine',
  'Niveau 1 — Branches',
  'Niveau 2 — Entrées',
  'Niveau 3 — Nœuds',
  'Niveau 4 — Spécialisations',
  'Niveau 5+ — Feuilles'
];

const KIND_LABEL: Record<string, string> = {
  root: 'Racine',
  branch: 'Branche',
  group: 'Entrée',
  node: 'Nœud',
  leaf: 'Feuille'
};

type Kind = 'root' | 'branch' | 'group' | 'node' | 'leaf';
type SettingsTab = 'filters' | 'groups' | 'display' | 'forces';
type ColorMode = 'branch' | 'depth';

export interface DiscNode {
  id: string;
  label: string;
  kind: Kind;
  depth: number;
  branchId: string | null;
  branchTitle: string;
  branchColor: string;
  parentId: string | null;
  childCount: number;
}

interface DiscEdge {
  from: string;
  to: string;
}

interface Spatial {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}



function flattenTree(
  branches: PsyBranch[],
  rootId: string,
  rootLabel: string
): { nodes: DiscNode[]; edges: DiscEdge[] } {
  const nodes: DiscNode[] = [];
  const edges: DiscEdge[] = [];

  nodes.push({
    id: rootId,
    label: rootLabel,
    kind: 'root',
    depth: 0,
    branchId: null,
    branchTitle: rootLabel,
    branchColor: '#e2e8f0',
    parentId: null,
    childCount: branches.length
  });

  for (const b of branches) {
    const color = TONES[b.color] || '#94a3b8';
    nodes.push({
      id: b.id,
      label: b.title,
      kind: 'branch',
      depth: 1,
      branchId: b.id,
      branchTitle: b.title,
      branchColor: color,
      parentId: rootId,
      childCount: b.trees.length
    });
    edges.push({ from: rootId, to: b.id });

    for (const t of b.trees) {
      const gid = `${b.id}::${t.title}`;
      nodes.push({
        id: gid,
        label: t.title,
        kind: 'group',
        depth: 2,
        branchId: b.id,
        branchTitle: b.title,
        branchColor: color,
        parentId: b.id,
        childCount: t.children.length
      });
      edges.push({ from: b.id, to: gid });

      const walk = (n: PsyNode, parentId: string, depth: number) => {
        const kids = n.children || [];
        nodes.push({
          id: n.id,
          label: n.label,
          kind: kids.length ? 'node' : 'leaf',
          depth,
          branchId: b.id,
          branchTitle: b.title,
          branchColor: color,
          parentId,
          childCount: kids.length
        });
        edges.push({ from: parentId, to: n.id });
        kids.forEach((ch) => walk(ch, n.id, depth + 1));
      };
      t.children.forEach((c) => walk(c, gid, 3));
    }
  }

  return { nodes, edges };
}

function depthBucket(depth: number): number {
  return Math.min(depth, 5);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function lineageToRoot(id: string, byId: Record<string, DiscNode>): Set<string> {
  const keep = new Set<string>();
  let cur: DiscNode | undefined = byId[id];
  while (cur) {
    keep.add(cur.id);
    cur = cur.parentId ? byId[cur.parentId] : undefined;
  }
  return keep;
}

/** Enfants (n+1) + frères du nœud — hors lignée vers la racine. */
function nearbyOf(id: string, nodes: DiscNode[], lineage: Set<string>): Set<string> {
  const nearby = new Set<string>();
  const self = nodes.find((n) => n.id === id);
  nodes.forEach((n) => {
    if (n.parentId === id && !lineage.has(n.id)) nearby.add(n.id);
  });
  if (self?.parentId) {
    nodes.forEach((n) => {
      if (n.parentId === self.parentId && n.id !== id && !lineage.has(n.id)) nearby.add(n.id);
    });
  }
  return nearby;
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block space-y-1">
      <div className="flex justify-between text-[11px] text-zinc-400">
        <span>{label}</span>
        <span className="font-mono text-zinc-500">{Number.isInteger(step) && step >= 1 ? value : value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-violet-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
      />
    </label>
  );
}

function CheckRow({
  checked,
  onChange,
  children,
  swatch
}: {
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
  swatch?: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-center gap-2 w-full text-left py-0.5 text-[12px] text-zinc-300 hover:text-white"
    >
      <span
        className={`w-3.5 h-3.5 rounded-[3px] border shrink-0 ${
          checked ? 'bg-violet-500 border-violet-400' : 'bg-transparent border-zinc-500'
        }`}
      />
      {swatch && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: swatch }} />}
      <span className="truncate">{children}</span>
    </button>
  );
}

export const DisciplineGraph: React.FC<{
  branches: PsyBranch[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onOpenPoster?: (id: string) => void;
  onOpenRef?: (id: string) => void;
  rootId?: string;
  rootLabel?: string;
  caption?: string;
  relatedFor?: (id: string) => RelatedBundle;
}> = ({
  branches,
  selectedId,
  onSelect,
  onOpenPoster,
  onOpenRef,
  rootId = 'psy',
  rootLabel = 'Psychologie',
  caption = 'Graphe d’ontologie disciplinaire — distinct du graphe de compétences',
  relatedFor = relatedForAtlasNode
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const spatialRef = useRef<Spatial[]>([]);
  const dragRef = useRef<{
    nodeId: string | null;
    pan: boolean;
    moved: boolean;
    sx: number;
    sy: number;
    px: number;
    py: number;
  }>({ nodeId: null, pan: false, moved: false, sx: 0, sy: 0, px: 0, py: 0 });

  const graph = useMemo(() => flattenTree(branches, rootId, rootLabel), [branches, rootId, rootLabel]);
  const byId = useMemo(() => Object.fromEntries(graph.nodes.map((n) => [n.id, n])), [graph.nodes]);

  const [search, setSearch] = useState('');
  const [depths, setDepths] = useState<Set<number>>(() => new Set([0, 1, 2, 3, 4, 5]));
  const [branchOn, setBranchOn] = useState<Set<string>>(() => new Set(branches.map((b) => b.id)));
  const [showOrphans, setShowOrphans] = useState(true);
  const [localMode, setLocalMode] = useState(false);
  const [localDepth, setLocalDepth] = useState(2);

  const [colorMode, setColorMode] = useState<ColorMode>('branch');
  const [arrows, setArrows] = useState(true);
  const [animate, setAnimate] = useState(true);
  const [textFade, setTextFade] = useState(0.45);
  const [nodeSize, setNodeSize] = useState(1);
  const [linkThickness, setLinkThickness] = useState(1);

  const [centerForce, setCenterForce] = useState(0.4);
  const [repelForce, setRepelForce] = useState(6.5);
  const [linkForce, setLinkForce] = useState(0.35);
  const [linkDistance, setLinkDistance] = useState(72);

  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [tab, setTab] = useState<SettingsTab>('filters');
  const [lockedId, setLockedId] = useState<string | null>(null);
  const [sheetId, setSheetId] = useState<string | null>(null);

  const viewRef = useRef({
    zoom,
    pan,
    search,
    depths,
    branchOn,
    showOrphans,
    localMode,
    localDepth,
    colorMode,
    arrows,
    animate,
    textFade,
    nodeSize,
    linkThickness,
    centerForce,
    repelForce,
    linkForce,
    linkDistance,
    selectedId,
    hoverId,
    lockedId
  });
  viewRef.current = {
    zoom,
    pan,
    search,
    depths,
    branchOn,
    showOrphans,
    localMode,
    localDepth,
    colorMode,
    arrows,
    animate,
    textFade,
    nodeSize,
    linkThickness,
    centerForce,
    repelForce,
    linkForce,
    linkDistance,
    selectedId,
    hoverId,
    lockedId
  };

  const seedLayout = useCallback(() => {
    const pos = new Map<string, Spatial>();
    const children = new Map<string, string[]>();
    graph.edges.forEach((e) => {
      const list = children.get(e.from) || [];
      list.push(e.to);
      children.set(e.from, list);
    });

    const place = (id: string, x: number, y: number, angle: number, radius: number) => {
      pos.set(id, { id, x, y, vx: 0, vy: 0 });
      const kids = children.get(id) || [];
      kids.forEach((cid, i) => {
        const n = byId[cid];
        const spread = Math.max(0.7, Math.min(2.6, kids.length * 0.22));
        const a = angle - spread / 2 + (spread * (i + 0.5)) / Math.max(kids.length, 1);
        const dist = n?.kind === 'branch' ? 160 : n?.kind === 'group' ? 90 : 58;
        place(cid, x + Math.cos(a) * (radius + dist), y + Math.sin(a) * (radius + dist), a, 8);
      });
    };
    place(rootId, 0, 0, -Math.PI / 2, 10);
    spatialRef.current = graph.nodes.map((n) => pos.get(n.id) || { id: n.id, x: 0, y: 0, vx: 0, vy: 0 });
  }, [graph, byId]);

  useEffect(() => {
    seedLayout();
  }, [seedLayout]);

  const lockFocus = useMemo(() => {
    if (!lockedId || !byId[lockedId]) return null;
    const lineage = lineageToRoot(lockedId, byId);
    const nearby = nearbyOf(lockedId, graph.nodes, lineage);
    return { lineage, nearby, visible: new Set([...lineage, ...nearby]) };
  }, [lockedId, byId, graph.nodes]);

  const visibleIds = useMemo(() => {
    if (lockFocus) return lockFocus.visible;

    const q = search.trim().toLowerCase();
    const match = (n: DiscNode) => {
      if (n.kind !== 'root' && n.branchId && !branchOn.has(n.branchId)) return false;
      if (!depths.has(depthBucket(n.depth))) return false;
      if (q && !`${n.label} ${n.branchTitle} ${n.kind}`.toLowerCase().includes(q)) return false;
      return true;
    };

    let ids = new Set(graph.nodes.filter(match).map((n) => n.id));

    if (localMode && selectedId && byId[selectedId]) {
      const keep = new Set<string>([selectedId]);
      let cur = byId[selectedId];
      while (cur?.parentId) {
        keep.add(cur.parentId);
        cur = byId[cur.parentId];
      }
      const down = (id: string, d: number) => {
        if (d > localDepth) return;
        graph.edges.forEach((e) => {
          if (e.from === id && !keep.has(e.to)) {
            keep.add(e.to);
            down(e.to, d + 1);
          }
        });
      };
      down(selectedId, 1);
      ids = new Set([...ids].filter((id) => keep.has(id)));
    }

    if (!showOrphans) {
      const deg = new Map<string, number>();
      graph.edges.forEach((e) => {
        if (ids.has(e.from) && ids.has(e.to)) {
          deg.set(e.from, (deg.get(e.from) || 0) + 1);
          deg.set(e.to, (deg.get(e.to) || 0) + 1);
        }
      });
      ids = new Set([...ids].filter((id) => (deg.get(id) || 0) > 0 || byId[id]?.kind === 'root'));
    }

    return ids;
  }, [graph, search, depths, branchOn, showOrphans, localMode, localDepth, selectedId, byId, lockFocus]);

  const visibleRef = useRef(visibleIds);
  visibleRef.current = visibleIds;
  const lockFocusRef = useRef(lockFocus);
  lockFocusRef.current = lockFocus;

  const lockOn = useCallback(
    (id: string) => {
      setLockedId(id);
      setSheetId(id);
      onSelect(id);
      const node = spatialRef.current.find((n) => n.id === id);
      if (node) {
        node.vx = 0;
        node.vy = 0;
        setPan({ x: -node.x * 1.05, y: -node.y * 1.05 });
        setZoom(1.15);
      }
    },
    [onSelect]
  );

  const unlock = useCallback(() => {
    setLockedId(null);
    setSheetId(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') unlock();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [unlock]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const r = host.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let raf = 0;
    let running = true;

    const loop = () => {
      if (!running) return;
      const v = viewRef.current;
      const vis = visibleRef.current;
      const w = host.clientWidth;
      const h = host.clientHeight;
      const pNodes = spatialRef.current;
      const pMap = new Map(pNodes.map((n) => [n.id, n]));

      if (v.animate) {
        const visList = pNodes.filter((n) => vis.has(n.id));
        const repel = v.repelForce * 280;
        for (let i = 0; i < visList.length; i++) {
          const a = visList[i];
          for (let j = i + 1; j < visList.length; j++) {
            const b = visList[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy) || 1;
            if (dist > 280) continue;
            const force = Math.min(4.2, repel / (dist * dist));
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            a.vx -= fx;
            a.vy -= fy;
            b.vx += fx;
            b.vy += fy;
          }
        }

        graph.edges.forEach((e) => {
          if (!vis.has(e.from) || !vis.has(e.to)) return;
          const a = pMap.get(e.from);
          const b = pMap.get(e.to);
          if (!a || !b) return;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 1;
          const na = byId[e.from];
          const wanted = v.linkDistance * (na?.kind === 'root' || na?.kind === 'branch' ? 1.45 : 1);
          const force = Math.max(-3, Math.min(3, (dist - wanted) * v.linkForce * 0.045));
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          a.vx += fx;
          a.vy += fy;
          b.vx -= fx;
          b.vy -= fy;
        });

        const g = v.centerForce * 0.012;
        visList.forEach((n) => {
          if (n.id === v.lockedId) {
            n.vx *= 0.4;
            n.vy *= 0.4;
            n.x += (0 - n.x) * 0.08;
            n.y += (0 - n.y) * 0.08;
            return;
          }
          n.vx -= n.x * g;
          n.vy -= n.y * g;
          n.vx *= 0.82;
          n.vy *= 0.82;
          const spd = Math.hypot(n.vx, n.vy);
          if (spd > 3.2) {
            n.vx = (n.vx / spd) * 3.2;
            n.vy = (n.vy / spd) * 3.2;
          }
          if (n.id !== dragRef.current.nodeId) {
            n.x += n.vx;
            n.y += n.vy;
          } else {
            n.vx = 0;
            n.vy = 0;
          }
        });
      }

      ctx.clearRect(0, 0, w, h);
      const bg = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, Math.max(w, h) * 0.7);
      bg.addColorStop(0, '#222222');
      bg.addColorStop(1, '#141414');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(w / 2 + v.pan.x, h / 2 + v.pan.y);
      ctx.scale(v.zoom, v.zoom);

      const focus = v.lockedId || v.hoverId || v.selectedId;
      const lock = lockFocusRef.current;
      const lineage = lock?.lineage ?? null;
      const nearby = lock?.nearby ?? null;

      graph.edges.forEach((e) => {
        if (!vis.has(e.from) || !vis.has(e.to)) return;
        const a = pMap.get(e.from);
        const b = pMap.get(e.to);
        if (!a || !b) return;
        const onPath = !lineage || (lineage.has(e.from) && lineage.has(e.to));
        const toNearby =
          !!nearby &&
          ((lineage?.has(e.from) && nearby.has(e.to)) || (lineage?.has(e.to) && nearby.has(e.from)));
        const strong = !!v.lockedId && onPath;

        ctx.save();
        ctx.lineCap = 'round';
        if (toNearby && !onPath) {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
          ctx.lineWidth = 0.9 * v.linkThickness;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.restore();
          return;
        }
        ctx.strokeStyle = strong ? 'rgba(251, 191, 36, 0.18)' : 'rgba(251, 191, 36, 0.08)';
        ctx.lineWidth = (strong ? 12 : 7) * v.linkThickness;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, 'rgba(253, 230, 138, 0.25)');
        grad.addColorStop(0.5, strong ? 'rgba(251, 191, 36, 0.95)' : 'rgba(251, 191, 36, 0.55)');
        grad.addColorStop(1, 'rgba(253, 230, 138, 0.25)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = (strong ? 2.4 : 1.4) * v.linkThickness;
        ctx.shadowColor = 'rgba(251, 191, 36, 0.55)';
        ctx.shadowBlur = strong ? 16 : 8;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.restore();

        if (v.arrows && onPath && v.zoom > 0.4) {
          const ang = Math.atan2(b.y - a.y, b.x - a.x);
          const mx = a.x + (b.x - a.x) * 0.62;
          const my = a.y + (b.y - a.y) * 0.62;
          const sz = 7;
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(mx - sz * Math.cos(ang - 0.4), my - sz * Math.sin(ang - 0.4));
          ctx.lineTo(mx - sz * Math.cos(ang + 0.4), my - sz * Math.sin(ang + 0.4));
          ctx.closePath();
          ctx.fillStyle = '#fde68a';
          ctx.fill();
        }
      });

            const radiusOf = (n: DiscNode) => {
        const base = n.kind === 'root' ? 14 : n.kind === 'branch' ? 9 : n.kind === 'group' ? 6.5 : n.kind === 'node' ? 5 : 3.6;
        return base * v.nodeSize * (1 + Math.min(n.childCount, 8) * 0.04);
      };

      const colorOf = (n: DiscNode) => (v.colorMode === 'depth' ? DEPTH_COLORS[depthBucket(n.depth)] : n.branchColor);

      [...graph.nodes]
        .filter((n) => vis.has(n.id))
        .sort((a, b) => {
          if (a.id === focus) return 1;
          if (b.id === focus) return -1;
          return a.depth - b.depth;
        })
        .forEach((n) => {
          const s = pMap.get(n.id);
          if (!s) return;
          const r = radiusOf(n);
          const col = colorOf(n);
          const rgb = hexToRgb(col);
          const onSpine = !lineage || lineage.has(n.id);
          const isNearby = !!nearby && nearby.has(n.id);
          const selected = n.id === v.selectedId || n.id === v.lockedId;
          const hovered = n.id === v.hoverId;

          ctx.globalAlpha = onSpine ? 1 : isNearby ? 0.22 : 0.1;
          if ((selected || hovered) && onSpine) {
            const glow = ctx.createRadialGradient(s.x, s.y, r * 0.3, s.x, s.y, r * 3.6);
            glow.addColorStop(0, 'rgba(253, 230, 138, 0.7)');
            glow.addColorStop(0.45, `rgba(${rgb.r},${rgb.g},${rgb.b},0.4)`);
            glow.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(s.x, s.y, r * 3.6, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(s.x, s.y, isNearby ? r * 0.72 : r, 0, Math.PI * 2);
          ctx.fillStyle = isNearby ? '#64748b' : col;
          ctx.fill();
          ctx.lineWidth = selected ? 2.4 : 1;
          ctx.strokeStyle = selected ? '#fde68a' : isNearby ? 'rgba(148,163,184,0.25)' : 'rgba(255,255,255,0.35)';
          ctx.stroke();
          ctx.globalAlpha = 1;

          const showLabel =
            hovered ||
            selected ||
            (onSpine &&
              (n.kind === 'root' ||
                (n.kind === 'branch' && v.zoom > 0.35) ||
                (v.zoom > 0.25 + v.textFade * 1.4 && n.depth <= 3) ||
                !!v.lockedId));
          if (showLabel && (onSpine || hovered)) {
            let text = n.label;
            if (text.length > 34 && !hovered) text = `${text.slice(0, 32)}…`;
            ctx.font = `${selected || hovered || n.kind === 'root' ? 600 : 400} ${
              n.kind === 'root' ? 13 : n.kind === 'branch' ? 11 : 10
            }px ui-sans-serif, system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = hovered || selected ? '#fff8e1' : 'rgba(226,232,240,0.82)';
            ctx.shadowColor = 'rgba(0,0,0,0.9)';
            ctx.shadowBlur = 6;
            ctx.fillText(text, s.x, s.y + r + 4);
            ctx.shadowBlur = 0;
          }
        });

      ctx.restore();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.08 : 0.92;
      setZoom((z) => Math.max(0.18, Math.min(3.4, z * factor)));
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [graph, byId]);

  const toWorld = (clientX: number, clientY: number) => {
    const host = hostRef.current;
    if (!host) return { x: 0, y: 0, rawX: 0, rawY: 0 };
    const r = host.getBoundingClientRect();
    const rawX = clientX - r.left;
    const rawY = clientY - r.top;
    const v = viewRef.current;
    return {
      rawX,
      rawY,
      x: (rawX - r.width / 2 - v.pan.x) / v.zoom,
      y: (rawY - r.height / 2 - v.pan.y) / v.zoom
    };
  };

  const hitTest = (wx: number, wy: number): DiscNode | null => {
    const vis = visibleRef.current;
    const v = viewRef.current;
    let best: DiscNode | null = null;
    let bestD = Infinity;
    spatialRef.current.forEach((s) => {
      if (!vis.has(s.id)) return;
      const n = byId[s.id];
      if (!n) return;
      const base = n.kind === 'root' ? 14 : n.kind === 'branch' ? 9 : n.kind === 'group' ? 6.5 : n.kind === 'node' ? 5 : 3.6;
      const rad = base * v.nodeSize + 6;
      const d = Math.hypot(wx - s.x, wy - s.y);
      if (d <= rad && d < bestD) {
        best = n;
        bestD = d;
      }
    });
    return best;
  };

  const hovered = hoverId ? byId[hoverId] : null;
  const sheetNode = sheetId ? byId[sheetId] : null;
  const sheetHit = sheetId && sheetId !== rootId ? findNode(branches, sheetId) : null;
  const sheetBranch =
    sheetId === rootId ? undefined : sheetHit?.branch ?? branches.find((b) => b.id === sheetId);
  const parentNode = sheetNode?.parentId ? byId[sheetNode.parentId] : null;
  const childNodes = sheetNode
    ? graph.nodes.filter((n) => n.parentId === sheetNode.id)
    : [];

  const toggleDepth = (d: number) => {
    setDepths((prev) => {
      const next = new Set(prev);
      if (next.has(d)) {
        if (next.size > 1) next.delete(d);
      } else next.add(d);
      return next;
    });
  };

  const toggleBranch = (id: string) => {
    setBranchOn((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else next.add(id);
      return next;
    });
  };

  const depthCounts = useMemo(() => {
    const c = [0, 0, 0, 0, 0, 0];
    graph.nodes.forEach((n) => {
      c[depthBucket(n.depth)] += 1;
    });
    return c;
  }, [graph.nodes]);

  const lineageCrumbs = sheetNode
    ? [...lineageToRoot(sheetNode.id, byId)].map((id) => byId[id]).filter(Boolean).reverse()
    : [];

  return (
    <div className="relative rounded-3xl border border-zinc-800 bg-[#141414] overflow-hidden font-sans select-none">
      <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-b border-white/5 flex items-center justify-between gap-3">
        <span>{caption}</span>
        <span className="normal-case tracking-normal font-medium text-zinc-400">
          {visibleIds.size} / {graph.nodes.length} nœuds
        </span>
      </div>

      <div className="flex items-stretch">
      <div ref={hostRef} className="relative min-w-0 flex-1 h-[min(72vh,720px)] cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
          onMouseDown={(e) => {
            if (e.button !== 0) return;
            const p = toWorld(e.clientX, e.clientY);
            const hit = hitTest(p.x, p.y);
            if (hit) {
              dragRef.current = { nodeId: hit.id, pan: false, moved: false, sx: e.clientX, sy: e.clientY, px: 0, py: 0 };
            } else {
              dragRef.current = { nodeId: null, pan: true, moved: false, sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y };
            }
          }}
          onMouseMove={(e) => {
            const p = toWorld(e.clientX, e.clientY);
            const drag = dragRef.current;
            if (Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy) > 6) drag.moved = true;
            if (drag.nodeId && drag.moved) {
              const node = spatialRef.current.find((n) => n.id === drag.nodeId);
              if (node) {
                node.x = p.x;
                node.y = p.y;
                node.vx = 0;
                node.vy = 0;
              }
            } else if (drag.pan) {
              setPan({ x: drag.px + (e.clientX - drag.sx), y: drag.py + (e.clientY - drag.sy) });
            } else {
              const hit = hitTest(p.x, p.y);
              setHoverId(hit?.id ?? null);
            }
          }}
          onMouseUp={() => {
            const drag = dragRef.current;
            if (drag.nodeId && !drag.moved) lockOn(drag.nodeId);
            else if (!drag.nodeId && !drag.moved && lockedId) unlock();
            dragRef.current = { nodeId: null, pan: false, moved: false, sx: 0, sy: 0, px: 0, py: 0 };
          }}
          onMouseLeave={() => {
            dragRef.current = { nodeId: null, pan: false, moved: false, sx: 0, sy: 0, px: 0, py: 0 };
            setHoverId(null);
          }}
        />

        <div className="absolute top-3 left-3 z-20 w-[min(100%,240px)] pointer-events-auto">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="w-full bg-[#1e1e1e]/95 border border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
        </div>

        {lockedId && byId[lockedId] && (
          <div className="absolute top-3 left-64 z-20 flex items-center gap-2 bg-[#1e1e1e]/95 border border-amber-400/40 rounded-xl px-3 py-1.5 text-[11px] text-amber-100">
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span>
              Vue verrouillée · {byId[lockedId].label} · lignée → niveau 0 · n+1 en gris
            </span>
            <button
              type="button"
              onClick={unlock}
              className="inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded-md bg-amber-400/15 hover:bg-amber-400/25 text-amber-50"
            >
              <Unlock className="w-3 h-3" />
              Libérer
            </button>
          </div>
        )}

        <div className="absolute bottom-3 right-3 z-20 flex flex-col bg-[#1e1e1e]/95 border border-zinc-700 rounded-xl overflow-hidden">
          <button type="button" className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800" onClick={() => setZoom((z) => Math.min(3.4, z * 1.18))} title="Zoom avant">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button type="button" className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800" onClick={() => setZoom((z) => Math.max(0.18, z * 0.82))} title="Zoom arrière">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800"
            title="Recentrer"
            onClick={() => {
              setZoom(0.85);
              setPan({ x: 0, y: 0 });
              seedLayout();
            }}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setPanelOpen((o) => !o)}
          className="absolute top-3 right-3 z-30 p-2 rounded-lg bg-[#1e1e1e]/95 border border-zinc-700 text-zinc-300 hover:text-white"
          title="Réglages du graphe"
        >
          <Settings className="w-4 h-4" />
        </button>

        {panelOpen && (
          <aside className="absolute top-12 right-3 bottom-3 z-30 w-[280px] bg-[#1e1e1e]/95 border border-zinc-700 rounded-xl overflow-hidden flex flex-col shadow-2xl">
            <div className="flex border-b border-zinc-800 text-[10px] font-bold uppercase tracking-wider">
              {(
                [
                  { id: 'filters' as const, label: 'Filtres' },
                  { id: 'groups' as const, label: 'Groupes' },
                  { id: 'display' as const, label: 'Affichage' },
                  { id: 'forces' as const, label: 'Forces' }
                ]
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex-1 py-2 ${tab === t.id ? 'text-white bg-zinc-800' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {tab === 'filters' && (
                <>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="fichier, nœud, branche…"
                      className="w-full bg-[#141414] border border-zinc-700 rounded-md pl-8 pr-2 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Niveaux de l’arborescence</p>
                    {DEPTH_LABELS.map((label, d) => (
                      <CheckRow key={d} checked={depths.has(d)} onChange={() => toggleDepth(d)} swatch={DEPTH_COLORS[d]}>
                        {label}
                        <span className="text-zinc-500"> ({depthCounts[d]})</span>
                      </CheckRow>
                    ))}
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Branches</p>
                    <CheckRow
                      checked={branchOn.size === branches.length}
                      onChange={() =>
                        setBranchOn(
                          branchOn.size === branches.length ? new Set([branches[0]?.id]) : new Set(branches.map((b) => b.id))
                        )
                      }
                    >
                      Toutes
                    </CheckRow>
                    {branches.map((b) => (
                      <CheckRow key={b.id} checked={branchOn.has(b.id)} onChange={() => toggleBranch(b.id)} swatch={TONES[b.color]}>
                        {b.title}
                      </CheckRow>
                    ))}
                  </div>

                  <CheckRow checked={showOrphans} onChange={() => setShowOrphans((s) => !s)}>
                    Isolés
                  </CheckRow>
                  <CheckRow checked={localMode} onChange={() => setLocalMode((s) => !s)}>
                    Graphe local (nœud sélectionné)
                  </CheckRow>
                  {localMode && (
                    <SliderRow label="Profondeur locale" value={localDepth} min={1} max={5} step={1} onChange={setLocalDepth} />
                  )}
                </>
              )}

              {tab === 'groups' && (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Colorer par</p>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setColorMode('branch')}
                      className={`flex-1 text-[11px] py-1.5 rounded-md border ${
                        colorMode === 'branch' ? 'bg-violet-600 text-white border-violet-500' : 'border-zinc-700 text-zinc-400'
                      }`}
                    >
                      Branche
                    </button>
                    <button
                      type="button"
                      onClick={() => setColorMode('depth')}
                      className={`flex-1 text-[11px] py-1.5 rounded-md border ${
                        colorMode === 'depth' ? 'bg-violet-600 text-white border-violet-500' : 'border-zinc-700 text-zinc-400'
                      }`}
                    >
                      Niveau
                    </button>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {colorMode === 'branch'
                      ? branches.map((b) => (
                          <div key={b.id} className="flex items-center gap-2 text-[12px] text-zinc-300">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: TONES[b.color] }} />
                            <Palette className="w-3 h-3 text-zinc-600" />
                            {b.title}
                          </div>
                        ))
                      : DEPTH_LABELS.map((label, i) => (
                          <div key={label} className="flex items-center gap-2 text-[12px] text-zinc-300">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: DEPTH_COLORS[i] }} />
                            {label}
                          </div>
                        ))}
                  </div>
                </>
              )}

              {tab === 'display' && (
                <div className="space-y-3">
                  <CheckRow checked={arrows} onChange={() => setArrows((s) => !s)}>
                    Flèches
                  </CheckRow>
                  <CheckRow checked={animate} onChange={() => setAnimate((s) => !s)}>
                    Animer
                  </CheckRow>
                  <SliderRow label="Seuil de fondu du texte" value={textFade} min={0} max={1} step={0.01} onChange={setTextFade} />
                  <SliderRow label="Taille des nœuds" value={nodeSize} min={0.4} max={2.4} step={0.05} onChange={setNodeSize} />
                  <SliderRow label="Épaisseur des liens" value={linkThickness} min={0.3} max={3} step={0.05} onChange={setLinkThickness} />
                </div>
              )}

              {tab === 'forces' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                    <SlidersHorizontal className="w-3 h-3" /> Physique
                  </div>
                  <SliderRow label="Force centrale" value={centerForce} min={0} max={1} step={0.01} onChange={setCenterForce} />
                  <SliderRow label="Répulsion" value={repelForce} min={0} max={20} step={0.1} onChange={setRepelForce} />
                  <SliderRow label="Force des liens" value={linkForce} min={0} max={1} step={0.01} onChange={setLinkForce} />
                  <SliderRow label="Distance des liens" value={linkDistance} min={20} max={220} step={1} onChange={setLinkDistance} />
                </div>
              )}
            </div>
          </aside>
        )}

        {hovered && (
          <div className="absolute bottom-3 left-3 z-20 max-w-sm bg-[#1e1e1e]/95 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-200 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorMode === 'depth' ? DEPTH_COLORS[depthBucket(hovered.depth)] : hovered.branchColor }} />
              <p className="text-xs font-semibold text-white leading-snug">{hovered.label}</p>
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">
              {hovered.branchTitle} · {DEPTH_LABELS[depthBucket(hovered.depth)]} · {hovered.childCount} enfant{hovered.childCount === 1 ? '' : 's'}
            </p>
          </div>
        )}
      </div>

      <aside className="w-[min(100%,340px)] shrink-0 border-l border-white/10 bg-[#161616] h-[min(72vh,720px)] overflow-y-auto">
        {sheetNode ? (
          <article className="px-5 py-4 space-y-3 text-zinc-100">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/90">Fiche du nœud</p>
              <h3 className="text-lg font-bold text-white mt-1 leading-snug">{sheetNode.label}</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-amber-400/30 text-amber-200">
                {KIND_LABEL[sheetNode.kind]}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-white/10 text-zinc-300">
                {DEPTH_LABELS[depthBucket(sheetNode.depth)]}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-white/10 text-zinc-300">
                {sheetNode.branchTitle}
              </span>
            </div>
            {lineageCrumbs.length > 0 && (
              <nav className="flex flex-wrap items-center gap-1">
                {lineageCrumbs.map((c, i) => (
                  <React.Fragment key={c.id}>
                    {i > 0 && <span className="text-zinc-600 text-[10px]">/</span>}
                    <button
                      type="button"
                      onClick={() => lockOn(c.id)}
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        c.id === sheetNode.id ? 'bg-amber-400/20 text-amber-100' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {c.label}
                    </button>
                  </React.Fragment>
                ))}
              </nav>
            )}
            <p className="text-sm text-zinc-300 leading-relaxed">
              {sheetId === rootId
                ? `Point d’entrée — ${rootLabel}.`
                : sheetBranch?.object}
              {sheetNode.kind === 'leaf'
                ? ' Niveau de spécialisation : feuille de l’arbre. Relier à un paradigme expérimental ou à une source de référence, jamais à un diagnostic automatique.'
                : null}
            </p>
            {sheetHit?.group && <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{sheetHit.group}</p>}
            {parentNode && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Niveau n−1</p>
                <button
                  type="button"
                  onClick={() => lockOn(parentNode.id)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-amber-300/40 hover:bg-amber-400/10"
                >
                  ← {parentNode.label}
                </button>
              </div>
            )}
            {childNodes.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Descendre (n+1)</p>
                <ul className="flex flex-wrap gap-1.5">
                  {childNodes.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => lockOn(c.id)}
                        className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-amber-300/40 hover:bg-amber-400/10"
                      >
                        {c.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <NodeRelated
              related={relatedFor(sheetNode.id)}
              onOpenPoster={onOpenPoster}
              onOpenRef={onOpenRef}
              tone="dark"
            />
            {lockedId && (
              <button
                type="button"
                onClick={unlock}
                className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg border border-amber-400/30 text-amber-100 hover:bg-amber-400/10"
              >
                <Unlock className="w-3.5 h-3.5" />
                Libérer la vue
              </button>
            )}
          </article>
        ) : (
          <div className="px-5 py-6 text-sm text-zinc-500 leading-relaxed">
            Tous les nœuds sont actifs. Clique un nœud : la fiche s’affiche ici, et le graphe ne garde que la lignée jusqu’à{' '}
            <span className="text-zinc-300">Psychologie</span>.
          </div>
        )}
      </aside>
      </div>
    </div>
  );
};

export function findNode(branches: PsyBranch[], id: string): { branch: PsyBranch; node?: PsyNode; group?: string } | null {
  const branch = branches.find((b) => b.id === id);
  if (branch) return { branch };
  for (const b of branches) {
    for (const t of b.trees) {
      if (`${b.id}::${t.title}` === id) return { branch: b, group: t.title };
      const walk = (nodes: PsyNode[]): PsyNode | null => {
        for (const n of nodes) {
          if (n.id === id) return n;
          if (n.children) {
            const f = walk(n.children);
            if (f) return f;
          }
        }
        return null;
      };
      const n = walk(t.children);
      if (n) return { branch: b, node: n, group: t.title };
    }
  }
  return null;
}
