import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PSYCHOLOGY_BRANCHES, PsyNode } from '../../data/psychologyAtlas';
import nebula from '../../assets/images/nebula-constellation.jpg';

const COLORS: Record<string, string> = {
  blue: '#7dd3fc',
  rose: '#fda4af',
  emerald: '#6ee7b7',
  amber: '#fde68a',
  violet: '#c4b5fd',
  teal: '#5eead4',
  indigo: '#a5b4fc',
  slate: '#e2e8f0'
};

export interface StarNode {
  id: string;
  label: string;
  desc: string;
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
    desc: 'Carte des disciplines — pas un diagnostic.',
    x: 0,
    y: 0,
    parentId: null,
    childIds: PSYCHOLOGY_BRANCHES.map((b) => b.id),
    color: '#fff7ed',
    depth: 0
  });

  const placeKids = (
    parent: StarNode,
    kids: { id: string; label: string; desc?: string; children?: PsyNode[]; color: string }[],
    baseAngle: number,
    sector: number
  ) => {
    const n = kids.length;
    kids.forEach((k, i) => {
      const a = n === 1 ? baseAngle : baseAngle - sector / 2 + (sector * i) / Math.max(n - 1, 1);
      const dist = 280 + parent.depth * 40;
      const node: StarNode = {
        id: k.id,
        label: k.label,
        desc: k.desc || parent.desc,
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
            desc: c.label,
            children: c.children,
            color: k.color
          })),
          a,
          sector / Math.max(n, 1.55)
        );
      }
    });
  };

  placeKids(
    out[0],
    PSYCHOLOGY_BRANCHES.map((b) => ({
      id: b.id,
      label: b.title,
      desc: b.object,
      color: COLORS[b.color] || '#e2e8f0',
      children: b.trees.map((t) => ({
        id: `${b.id}::${t.title}`,
        label: t.title,
        desc: b.object,
        children: t.children
      }))
    })),
    -Math.PI / 2,
    Math.PI * 2 * 0.88
  );

  return out;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

const StarBurst: React.FC<{ size: number; color: string; active: boolean }> = ({ size, color, active }) => {
  const s = active ? size * 2.4 : size;
  return (
    <span className="relative block" style={{ width: s, height: s }}>
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: s * 4.5,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${color}, #fff, ${color}, transparent)`,
          opacity: active ? 0.95 : 0.45,
          filter: `blur(${active ? 1.2 : 0.6}px)`
        }}
      />
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 2,
          height: s * 4.5,
          background: `linear-gradient(180deg, transparent, ${color}, #fff, ${color}, transparent)`,
          opacity: active ? 0.9 : 0.4,
          filter: `blur(${active ? 1.2 : 0.6}px)`
        }}
      />
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: s,
          height: s,
          background: `radial-gradient(circle, #fff 0%, ${color} 38%, transparent 70%)`,
          boxShadow: active
            ? `0 0 ${s}px ${s / 2}px ${color}, 0 0 ${s * 3}px ${s}px rgba(125,211,252,0.55)`
            : `0 0 ${s / 2}px ${s / 4}px ${color}`
        }}
      />
    </span>
  );
};

export const ConstellationAtlas: React.FC<{
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}> = ({ selectedId, onSelect }) => {
  const stars = useMemo(() => buildStars(), []);
  const byId = useMemo(() => Object.fromEntries(stars.map((s) => [s.id, s])), [stars]);
  const [focusId, setFocusId] = useState('root');
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [cam, setCam] = useState({ x: 0, y: 0, s: 0.85 });
  const [look, setLook] = useState({ x: 0, y: 0 });
  const camRef = useRef(cam);
  camRef.current = cam;
  const anim = useRef<number | null>(null);
  const drag = useRef<{ x: number; y: number; cx: number; cy: number; moved: boolean } | null>(null);
  const skipClick = useRef(false);

  const flyTo = useCallback(
    (id: string) => {
      const n = byId[id];
      if (!n) return;
      const from = { ...camRef.current };
      const to = { x: n.x, y: n.y + 40, s: Math.min(1.25, 0.82 + n.depth * 0.1) };
      const t0 = performance.now();
      if (anim.current) cancelAnimationFrame(anim.current);
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / 780);
        const e = easeOutCubic(t);
        setCam({
          x: from.x + (to.x - from.x) * e,
          y: from.y + (to.y - from.y) * e,
          s: from.s + (to.s - from.s) * e
        });
        if (t < 1) anim.current = requestAnimationFrame(step);
      };
      anim.current = requestAnimationFrame(step);
    },
    [byId]
  );

  useEffect(
    () => () => {
      if (anim.current) cancelAnimationFrame(anim.current);
    },
    []
  );

  const focus = byId[focusId] || byId.root;
  const parent = focus.parentId ? byId[focus.parentId] : null;
  const shown = hoverId ? byId[hoverId] || focus : focus;

  const lit = useMemo(() => {
    const ids = new Set<string>([focusId]);
    focus.childIds.forEach((id) => ids.add(id));
    if (focus.parentId) ids.add(focus.parentId);
    stars.filter((s) => s.parentId === focusId || s.parentId === focus.parentId).forEach((s) => ids.add(s.id));
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

  return (
    <div className="relative overflow-hidden rounded-3xl border border-cyan-900/40" style={{ height: 'min(78vh, 760px)', fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <img src={nebula} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55 pointer-events-none" />

      {/* Top HUD */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-[min(92%,820px)]">
        <div
          className="flex items-center justify-between gap-4 px-6 py-2 text-white"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(8,16,28,0.72), transparent)',
            borderTop: '1px solid rgba(186,230,253,0.35)',
            borderBottom: '1px solid rgba(186,230,253,0.35)'
          }}
        >
          <span className="text-[11px] tracking-[0.28em] uppercase text-cyan-100/80">Savoirs</span>
          <span className="text-sm tracking-wide font-semibold">{shown.label}</span>
          <span className="text-[11px] tracking-[0.2em] uppercase text-cyan-100/80">Profondeur {shown.depth}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => parent && go(parent.id)}
        disabled={!parent}
        className="absolute top-20 left-4 z-30 px-3 py-1.5 text-[11px] tracking-[0.18em] uppercase text-cyan-50/90 disabled:opacity-25"
        style={{ border: '1px solid rgba(186,230,253,0.35)', background: 'rgba(8,16,28,0.45)' }}
      >
        ← Domaine précédent
      </button>

      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => {
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
          drag.current = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false };
        }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setLook({
            x: ((e.clientX - r.left) / r.width - 0.5) * 10,
            y: ((e.clientY - r.top) / r.height - 0.5) * -8
          });
          if (!drag.current) return;
          const dx = e.clientX - drag.current.x;
          const dy = e.clientY - drag.current.y;
          if (Math.abs(dx) + Math.abs(dy) > 4) drag.current.moved = true;
          setCam((c) => ({
            ...c,
            x: drag.current!.cx - dx / c.s,
            y: drag.current!.cy - dy / c.s
          }));
        }}
        onPointerUp={() => {
          skipClick.current = !!drag.current?.moved;
          drag.current = null;
        }}
        onWheel={(e) => {
          e.preventDefault();
          setCam((c) => ({ ...c, s: Math.min(1.7, Math.max(0.38, c.s * (e.deltaY > 0 ? 0.9 : 1.1))) }));
        }}
      >
        <div
          className="absolute left-1/2 top-[46%]"
          style={{
            perspective: 1400,
            transform: `translate(-50%, -50%) rotateX(${look.y}deg) rotateY(${look.x}deg)`
          }}
        >
          <div
            style={{
              transform: `scale(${cam.s}) translate(${-cam.x}px, ${-cam.y}px)`,
              transformStyle: 'preserve-3d'
            }}
          >
            <svg
              className="overflow-visible pointer-events-none"
              style={{ position: 'absolute', left: -2400, top: -2400, width: 4800, height: 4800 }}
            >
              <defs>
                <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.15" />
                  <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3.5" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {stars.map((n) => {
                if (!n.parentId) return null;
                const p = byId[n.parentId];
                if (!p) return null;
                const on = lit.has(n.id) && lit.has(p.id);
                return (
                  <line
                    key={`${p.id}-${n.id}`}
                    x1={p.x + 2400}
                    y1={p.y + 2400}
                    x2={n.x + 2400}
                    y2={n.y + 2400}
                    stroke={on ? 'url(#beam)' : 'rgba(125,211,252,0.12)'}
                    strokeWidth={on ? 6 : 2}
                    filter={on ? 'url(#glow)' : undefined}
                  />
                );
              })}
            </svg>

            {stars.map((n) => {
              const active = n.id === focusId;
              const hovered = n.id === hoverId;
              const near = lit.has(n.id);
              const size = n.depth === 0 ? 18 : 11;
              return (
                <button
                  key={n.id}
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseEnter={() => setHoverId(n.id)}
                  onMouseLeave={() => setHoverId((h) => (h === n.id ? null : h))}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (skipClick.current) return;
                    go(n.id);
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: n.x,
                    top: n.y,
                    zIndex: active ? 8 : 2,
                    opacity: near || active || hovered ? 1 : 0.35
                  }}
                >
                  <StarBurst size={size} color={n.color} active={active || hovered} />
                  {!active && (
                    <span
                      className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                      style={{ fontSize: near ? 13 : 11, fontWeight: 600, letterSpacing: '0.02em' }}
                    >
                      {n.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected overlay — like Skyrim perk title */}
      <div className="absolute inset-x-0 top-[42%] z-20 pointer-events-none text-center px-6">
        <h2
          className="text-white font-semibold tracking-wide drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)]"
          style={{ fontSize: shown.depth <= 1 ? 42 : 32, textShadow: '0 2px 14px #000' }}
        >
          {shown.label}
        </h2>
        <p className="mt-3 max-w-xl mx-auto text-[15px] text-cyan-50/90 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          {shown.desc}
        </p>
        <div className="mt-5 flex justify-center gap-10 text-[12px] tracking-[0.22em] uppercase text-cyan-100/85">
          <span>Branche {shown.depth === 0 ? 'Racine' : shown.depth}</span>
          <span>{shown.childIds.length} suites</span>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 w-[min(94%,900px)] flex gap-3 text-[11px] tracking-[0.16em] uppercase text-white">
        {[
          { k: 'Atlas', v: `${stars.length} étoiles`, c: '#38bdf8' },
          { k: 'Fiche', v: shown.label.slice(0, 28), c: '#fb7185' },
          { k: 'Liens', v: `${shown.childIds.length} rayons`, c: '#34d399' }
        ].map((b) => (
          <div key={b.k} className="flex-1 px-3 py-1.5" style={{ background: 'rgba(8,16,28,0.55)', border: '1px solid rgba(186,230,253,0.25)' }}>
            <div className="flex justify-between mb-1 opacity-80">
              <span>{b.k}</span>
              <span>{b.v}</span>
            </div>
            <div className="h-1.5 rounded-sm overflow-hidden bg-black/40">
              <div className="h-full" style={{ width: `${40 + shown.depth * 12}%`, background: b.c }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
