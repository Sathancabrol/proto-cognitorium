import React, { useMemo, useState } from 'react';
import { PsyBranch, PsyNode } from '../../data/psychologyAtlas';

const TONES: Record<string, string> = {
  blue: '#2563eb',
  rose: '#e11d48',
  emerald: '#059669',
  amber: '#d97706',
  violet: '#7c3aed',
  teal: '#0d9488',
  indigo: '#4f46e5',
  slate: '#334155'
};

interface GNode {
  id: string;
  label: string;
  x: number;
  y: number;
  r: number;
  color: string;
  kind: 'root' | 'branch' | 'group' | 'leaf';
}

interface GEdge {
  from: string;
  to: string;
}

function layout(branches: PsyBranch[], openId: string | null): { nodes: GNode[]; edges: GEdge[] } {
  const W = 920;
  const H = 560;
  const cx = W / 2;
  const cy = H / 2;
  const nodes: GNode[] = [{ id: 'psy', label: 'Psychologie', x: cx, y: cy, r: 36, color: '#0f172a', kind: 'root' }];
  const edges: GEdge[] = [];
  const n = branches.length;
  const R = 170;

  branches.forEach((b, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const x = cx + Math.cos(a) * R;
    const y = cy + Math.sin(a) * R;
    nodes.push({ id: b.id, label: b.title, x, y, r: 26, color: TONES[b.color] || '#64748b', kind: 'branch' });
    edges.push({ from: 'psy', to: b.id });

    if (openId === b.id) {
      const kids: { id: string; label: string; kind: GNode['kind'] }[] = [];
      b.trees.forEach((t) => {
        kids.push({ id: `${b.id}::${t.title}`, label: t.title, kind: 'group' });
        t.children.forEach((c) => kids.push({ id: c.id, label: c.label, kind: 'leaf' }));
      });
      const m = kids.length;
      const r2 = 118;
      kids.forEach((k, j) => {
        const aa = a - 0.85 + (1.7 * j) / Math.max(m - 1, 1);
        nodes.push({
          id: k.id,
          label: k.label.length > 28 ? `${k.label.slice(0, 26)}…` : k.label,
          x: x + Math.cos(aa) * r2,
          y: y + Math.sin(aa) * r2,
          r: k.kind === 'group' ? 16 : 12,
          color: k.kind === 'group' ? '#94a3b8' : TONES[b.color] || '#64748b',
          kind: k.kind
        });
        edges.push({ from: b.id, to: k.id });
      });
    }
  });

  return { nodes, edges };
}

export const DisciplineGraph: React.FC<{
  branches: PsyBranch[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}> = ({ branches, selectedId, onSelect }) => {
  const [openId, setOpenId] = useState<string | null>(branches[0]?.id ?? null);
  const { nodes, edges } = useMemo(() => layout(branches, openId), [branches, openId]);
  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0b1220] overflow-hidden">
      <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/5">
        Graphe d’ontologie disciplinaire — distinct du graphe de compétences
      </div>
      <svg viewBox="0 0 920 560" className="w-full h-[560px]">
        {edges.map((e) => {
          const a = byId[e.from];
          const b = byId[e.to];
          if (!a || !b) return null;
          return (
            <line
              key={`${e.from}-${e.to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgba(148,163,184,0.35)"
              strokeWidth={1.2}
            />
          );
        })}
        {nodes.map((n) => {
          const active = n.id === selectedId || n.id === openId;
          return (
            <g
              key={n.id}
              onClick={() => {
                if (n.kind === 'branch') {
                  setOpenId(n.id === openId ? null : n.id);
                  onSelect(n.id);
                } else if (n.kind !== 'root') {
                  onSelect(n.id);
                }
              }}
              className="cursor-pointer"
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill={n.kind === 'root' ? '#111827' : n.color}
                stroke={active ? '#fbbf24' : 'rgba(255,255,255,0.25)'}
                strokeWidth={active ? 3 : 1}
              />
              <text
                x={n.x}
                y={n.y + n.r + 12}
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize={n.kind === 'root' ? 11 : 9}
                fontWeight={n.kind === 'branch' || n.kind === 'root' ? 700 : 500}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
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
