import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { PSYCHOLOGY_BRANCHES, PsyNode } from '../../data/psychologyAtlas';

const COLORS: Record<string, string> = {
  blue: '#3b82f6',
  rose: '#fb7185',
  emerald: '#34d399',
  amber: '#fbbf24',
  violet: '#a78bfa',
  teal: '#2dd4bf',
  indigo: '#818cf8',
  slate: '#94a3b8'
};

export interface StarNode {
  id: string;
  label: string;
  x: number;
  y: number;
  parentId: string | null;
  childIds: string[];
  color: string;
  depth: number;
}

function buildStars(): StarNode[] {
  const out: StarNode[] = [];
  const add = (n: StarNode) => out.push(n);

  add({
    id: 'root',
    label: 'Psychologie',
    x: 0,
    y: 0,
    parentId: null,
    childIds: PSYCHOLOGY_BRANCHES.map((b) => b.id),
    color: '#f8fafc',
    depth: 0
  });

  const placeKids = (
    parent: StarNode,
    kids: { id: string; label: string; children?: PsyNode[]; color: string }[],
    baseAngle: number,
    sector: number
  ) => {
    const n = kids.length;
    kids.forEach((k, i) => {
      const a = n === 1 ? baseAngle : baseAngle - sector / 2 + (sector * i) / Math.max(n - 1, 1);
      const dist = 320 + parent.depth * 36;
      const node: StarNode = {
        id: k.id,
        label: k.label,
        x: parent.x + Math.cos(a) * dist,
        y: parent.y + Math.sin(a) * dist,
        parentId: parent.id,
        childIds: (k.children || []).map((c) => c.id),
        color: k.color,
        depth: parent.depth + 1
      };
      add(node);
      if (k.children?.length) {
        placeKids(
          node,
          k.children.map((c) => ({
            id: c.id,
            label: c.label,
            children: c.children,
            color: k.color
          })),
          a,
          sector / Math.max(n, 1.6)
        );
      }
    });
  };

  placeKids(
    out[0],
    PSYCHOLOGY_BRANCHES.map((b) => ({
      id: b.id,
      label: b.title,
      color: COLORS[b.color] || '#94a3b8',
      children: b.trees.map((t) => ({
        id: `${b.id}::${t.title}`,
        label: t.title,
        children: t.children
      }))
    })),
    -Math.PI / 2,
    Math.PI * 2 * 0.92
  );

  return out;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

export const ConstellationAtlas: React.FC<{
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}> = ({ selectedId, onSelect }) => {
  const stars = useMemo(() => buildStars(), []);
  const byId = useMemo(() => Object.fromEntries(stars.map((s) => [s.id, s])), [stars]);
  const [focusId, setFocusId] = useState('root');
  const [cam, setCam] = useState({ x: 0, y: 0, s: 0.72 });
  const camRef = useRef(cam);
  camRef.current = cam;
  const anim = useRef<number | null>(null);
  const drag = useRef<{ x: number; y: number; cx: number; cy: number } | null>(null);

  const flyTo = useCallback((id: string, scale?: number) => {
    const n = byId[id];
    if (!n) return;
    const from = { ...camRef.current };
    const to = { x: n.x, y: n.y, s: scale ?? Math.min(1.15, 0.7 + n.depth * 0.12) };
    const t0 = performance.now();
    const dur = 720;
    if (anim.current) cancelAnimationFrame(anim.current);
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = easeOutCubic(t);
      setCam({
        x: from.x + (to.x - from.x) * e,
        y: from.y + (to.y - from.y) * e,
        s: from.s + (to.s - from.s) * e
      });
      if (t < 1) anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
  }, [byId]);

  useEffect(() => () => {
    if (anim.current) cancelAnimationFrame(anim.current);
  }, []);

  const focus = byId[focusId] || byId.root;
  const parent = focus.parentId ? byId[focus.parentId] : null;

  const neighborhood = useMemo(() => {
    const ids = new Set<string>(['root', focusId]);
    if (focus.parentId) ids.add(focus.parentId);
    focus.childIds.forEach((id) => ids.add(id));
    stars.filter((s) => s.parentId === focus.parentId).forEach((s) => ids.add(s.id));
    let p = focus.parentId;
    while (p) {
      ids.add(p);
      p = byId[p]?.parentId ?? null;
    }
    return ids;
  }, [focus, focusId, stars, byId]);

  const go = (id: string) => {
    setFocusId(id);
    onSelect(id === 'root' ? null : id);
    flyTo(id);
  };

  const back = () => {
    if (!parent) return;
    go(parent.id);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#07060a]" style={{ height: 620 }}>
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.35) 50%, transparent 51%), radial-gradient(1px 1px at 70% 20%, rgba(255,255,255,.25) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 40% 80%, rgba(251,191,36,.35) 50%, transparent 51%), radial-gradient(1px 1px at 85% 60%, rgba(255,255,255,.2) 50%, transparent 51%), radial-gradient(circle at 50% 50%, #1a1430 0%, #07060a 70%)'
        }}
      />

      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={back}
          disabled={!parent}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-black/55 text-amber-200 border border-amber-200/30 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Domaine précédent
        </button>
        <span className="text-[11px] font-semibold text-slate-300 bg-black/40 px-2 py-1 rounded-lg border border-white/10">
          {focus.label}
        </span>
      </div>

      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => {
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
          drag.current = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y };
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const dx = (e.clientX - drag.current.x) / cam.s;
          const dy = (e.clientY - drag.current.y) / cam.s;
          setCam((c) => ({ ...c, x: drag.current!.cx - dx, y: drag.current!.cy - dy }));
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onWheel={(e) => {
          e.preventDefault();
          setCam((c) => ({ ...c, s: Math.min(1.6, Math.max(0.35, c.s * (e.deltaY > 0 ? 0.92 : 1.08))) }));
        }}
      >
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `translate(-50%, -50%) scale(${cam.s}) translate(${-cam.x}px, ${-cam.y}px)`,
            transformOrigin: 'center',
            transition: drag.current ? 'none' : undefined
          }}
        >
          <svg
            className="overflow-visible pointer-events-none"
            style={{ position: 'absolute', left: -2000, top: -2000, width: 4000, height: 4000 }}
          >
            {stars.map((n) => {
              if (!n.parentId) return null;
              const p = byId[n.parentId];
              if (!p) return null;
              const lit = neighborhood.has(n.id) && neighborhood.has(p.id);
              return (
                <line
                  key={`${p.id}-${n.id}`}
                  x1={p.x + 2000}
                  y1={p.y + 2000}
                  x2={n.x + 2000}
                  y2={n.y + 2000}
                  stroke={lit ? 'rgba(251,191,36,0.55)' : 'rgba(148,163,184,0.12)'}
                  strokeWidth={lit ? 2 : 1}
                />
              );
            })}
          </svg>

          {stars.map((n) => {
            const active = n.id === focusId || n.id === selectedId;
            const near = neighborhood.has(n.id);
            const short = n.label.length > 34 ? `${n.label.slice(0, 32)}…` : n.label;
            return (
              <button
                key={n.id}
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  go(n.id);
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-left"
                style={{
                  left: n.x,
                  top: n.y,
                  width: n.depth === 0 ? 200 : 168,
                  opacity: near ? 1 : 0.28,
                  zIndex: active ? 5 : 1,
                  filter: active ? 'drop-shadow(0 0 18px rgba(251,191,36,0.55))' : undefined
                }}
              >
                <div
                  className="rounded-2xl border px-3 py-2.5 backdrop-blur-[2px]"
                  style={{
                    background: active ? 'rgba(15,10,6,0.92)' : 'rgba(12,10,16,0.78)',
                    borderColor: active ? '#fbbf24' : `${n.color}99`,
                    transform: 'translateZ(0)',
                    boxShadow: active ? `0 0 0 1px ${n.color}` : 'none'
                  }}
                >
                  <div className="h-0.5 w-8 mb-1.5 rounded-full" style={{ background: n.color }} />
                  <div className="text-[11px] font-extrabold uppercase tracking-wide text-white leading-snug">{short}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
