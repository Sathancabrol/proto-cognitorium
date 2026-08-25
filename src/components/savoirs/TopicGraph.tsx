import React, { useMemo } from 'react';

export interface TopicGraphNode {
  id: string;
  label: string;
  parentId: string | null;
  color?: string;
}

export const TopicGraph: React.FC<{
  nodes: TopicGraphNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  caption?: string;
}> = ({ nodes, selectedId, onSelect, caption }) => {
  const layout = useMemo(() => {
    const W = 920;
    const H = 520;
    const cx = W / 2;
    const cy = H / 2;
    const byParent = new Map<string | null, TopicGraphNode[]>();
    nodes.forEach((n) => {
      const k = n.parentId;
      const list = byParent.get(k) || [];
      list.push(n);
      byParent.set(k, list);
    });
    const pos = new Map<string, { x: number; y: number; r: number; n: TopicGraphNode }>();
    const roots = byParent.get(null) || nodes.filter((n) => !n.parentId);
    roots.forEach((root, ri) => {
      const a0 = -Math.PI / 2 + (ri * 2 * Math.PI) / Math.max(roots.length, 1);
      const rx = roots.length === 1 ? cx : cx + Math.cos(a0) * 40;
      const ry = roots.length === 1 ? cy : cy + Math.sin(a0) * 40;
      pos.set(root.id, { x: rx, y: ry, r: 22, n: root });
      const kids = byParent.get(root.id) || [];
      kids.forEach((k, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / Math.max(kids.length, 1);
        const x = rx + Math.cos(a) * 150;
        const y = ry + Math.sin(a) * 150;
        pos.set(k.id, { x, y, r: 16, n: k });
        const grand = byParent.get(k.id) || [];
        grand.forEach((g, gi) => {
          const ga = a - 0.45 + (0.9 * gi) / Math.max(grand.length - 1, 1);
          pos.set(g.id, {
            x: x + Math.cos(ga) * 88,
            y: y + Math.sin(ga) * 88,
            r: 10,
            n: g
          });
        });
      });
    });
    const edges: { from: string; to: string }[] = [];
    nodes.forEach((n) => {
      if (n.parentId && pos.has(n.parentId) && pos.has(n.id)) edges.push({ from: n.parentId, to: n.id });
    });
    return { pos, edges, W, H };
  }, [nodes]);

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0b1220] overflow-hidden">
      {caption && (
        <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/5">
          {caption}
        </div>
      )}
      <svg viewBox={`0 0 ${layout.W} ${layout.H}`} className="w-full h-[520px]">
        {layout.edges.map((e) => {
          const a = layout.pos.get(e.from);
          const b = layout.pos.get(e.to);
          if (!a || !b) return null;
          return (
            <line
              key={`${e.from}-${e.to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgba(251,191,36,0.35)"
              strokeWidth={1.2}
            />
          );
        })}
        {[...layout.pos.values()].map((p) => {
          const active = p.n.id === selectedId;
          const label = p.n.label.length > 26 ? `${p.n.label.slice(0, 24)}…` : p.n.label;
          return (
            <g key={p.n.id} onClick={() => onSelect(p.n.id)} className="cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r={p.r}
                fill={p.n.color || '#334155'}
                stroke={active ? '#fde68a' : 'rgba(255,255,255,0.25)'}
                strokeWidth={active ? 3 : 1}
              />
              <text x={p.x} y={p.y + p.r + 12} textAnchor="middle" fill="#e2e8f0" fontSize={9} fontWeight={600}>
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
