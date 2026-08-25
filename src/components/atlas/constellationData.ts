import { PSYCHOLOGY_BRANCHES, PsyNode } from '../../data/psychologyAtlas';

export type Archetype = 'mage' | 'thief' | 'warrior';

export type PerkState = 'locked' | 'available' | 'unlocked';

export interface PerkDef {
  id: string;
  label: string;
  desc: string;
  lx: number;
  ly: number;
  parentId: string | null;
}

export interface ConstelDef {
  id: string;
  title: string;
  object: string;
  angle: number;
  color: string;
  archetype: Archetype;
  perks: PerkDef[];
}

const ARCH: Record<string, Archetype> = {
  cognitive: 'mage',
  bio: 'mage',
  education: 'mage',
  social: 'thief',
  personality: 'thief',
  clinical: 'thief',
  dev: 'warrior',
  io: 'warrior'
};

const HEX: Record<string, string> = {
  blue: '#7dd3fc',
  rose: '#fda4af',
  emerald: '#6ee7b7',
  amber: '#fde68a',
  violet: '#c4b5fd',
  teal: '#5eead4',
  indigo: '#a5b4fc',
  slate: '#e2e8f0'
};

export const ARCH_TINT: Record<Archetype, number> = {
  mage: 0x3344aa,
  thief: 0x1a6b55,
  warrior: 0x8a3318
};

function flattenPerks(branchId: string, object: string, trees: { title: string; children: PsyNode[] }[]): PerkDef[] {
  const perks: PerkDef[] = [
    { id: branchId, label: 'Noyau', desc: object, lx: 0, ly: 0, parentId: null }
  ];

  const place = (node: PsyNode, parentId: string, x: number, y: number, angle: number, dist: number) => {
    const nx = x + Math.cos(angle) * dist;
    const ny = y + Math.sin(angle) * dist;
    perks.push({ id: node.id, label: node.label, desc: node.label, lx: nx, ly: ny, parentId });
    const kids = node.children || [];
    kids.forEach((ch, i) => {
      const a = angle - 0.35 + (0.7 * i) / Math.max(kids.length - 1, 1);
      place(ch, node.id, nx, ny, a, 13);
    });
  };

  trees.forEach((t, gi) => {
    const ga = -Math.PI / 2 + (gi * 2 * Math.PI) / Math.max(trees.length, 1);
    const gx = Math.cos(ga) * 20;
    const gy = Math.sin(ga) * 20;
    const gid = `${branchId}::${t.title}`;
    perks.push({ id: gid, label: t.title, desc: object, lx: gx, ly: gy, parentId: branchId });
    t.children.forEach((c, ci) => {
      const a = ga - 0.4 + (0.8 * ci) / Math.max(t.children.length - 1, 1);
      place(c, gid, gx, gy, a, 15);
    });
  });
  return perks;
}

export function buildConstellations(): ConstelDef[] {
  const n = PSYCHOLOGY_BRANCHES.length;
  return PSYCHOLOGY_BRANCHES.map((b, i) => ({
    id: b.id,
    title: b.title,
    object: b.object,
    angle: -Math.PI / 2 + (i * 2 * Math.PI) / n,
    color: HEX[b.color] || '#e2e8f0',
    archetype: ARCH[b.id] || 'mage',
    perks: flattenPerks(b.id, b.object, b.trees)
  }));
}
