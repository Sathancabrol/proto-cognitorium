import React, { useEffect, useMemo, useState } from 'react';
import { PSYCHOLOGY_BRANCHES, PsyBranch, PsyNode } from '../../data/psychologyAtlas';
import { CarouselItem, CoverFlowCarousel } from '../ui/CoverFlowCarousel';
import coverMetacog from '../../assets/images/cover-metacog.jpg';
import coverAtlas from '../../assets/images/cover-atlas.jpg';
import coverLab from '../../assets/images/cover-lab.jpg';
import coverPsyref from '../../assets/images/cover-psyref.jpg';
import coverIcd from '../../assets/images/cover-icd.jpg';
import coverSrl from '../../assets/images/cover-srl.jpg';

const BRANCH_ART: Record<string, string> = {
  cognitive: coverMetacog,
  clinical: coverIcd,
  dev: coverSrl,
  social: coverLab,
  personality: coverAtlas,
  bio: coverMetacog,
  education: coverSrl,
  io: coverPsyref
};

const BRANCH_TONE: Record<string, string> = {
  blue: 'linear-gradient(160deg,#1d4ed8,#0f172a)',
  rose: 'linear-gradient(160deg,#be123c,#0f172a)',
  emerald: 'linear-gradient(160deg,#047857,#0f172a)',
  amber: 'linear-gradient(160deg,#b45309,#0f172a)',
  violet: 'linear-gradient(160deg,#6d28d9,#0f172a)',
  teal: 'linear-gradient(160deg,#0f766e,#0f172a)',
  indigo: 'linear-gradient(160deg,#4338ca,#0f172a)',
  slate: 'linear-gradient(160deg,#334155,#0c0a09)'
};

export type TreeStep =
  | { kind: 'branch'; id: string; title: string }
  | { kind: 'group'; id: string; title: string }
  | { kind: 'node'; id: string; title: string };

type CardKind = TreeStep['kind'];

interface LevelCard {
  item: CarouselItem;
  kind: CardKind;
  title: string;
  hasChildren: boolean;
  groupTitle?: string;
}

function splitTitle(label: string): { titleLine1: string; titleLine2?: string } {
  const dash = label.indexOf(' — ');
  if (dash > 0 && dash < 42) {
    return { titleLine1: label.slice(0, dash), titleLine2: label.slice(dash + 3) };
  }
  if (label.length <= 42) return { titleLine1: label };
  const cut = label.lastIndexOf(' ', 36);
  return {
    titleLine1: label.slice(0, cut > 12 ? cut : 36),
    titleLine2: label.slice(cut > 12 ? cut + 1 : 36)
  };
}

function findNodeIn(nodes: PsyNode[], id: string): PsyNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const hit = findNodeIn(n.children, id);
      if (hit) return hit;
    }
  }
  return null;
}

function resolveLevel(path: TreeStep[]): { branch?: PsyBranch; nodes?: PsyNode[]; treeTitle?: string } {
  if (!path.length) return {};
  const branch = PSYCHOLOGY_BRANCHES.find((b) => b.id === path[0].id);
  if (!branch) return {};
  if (path.length === 1) return { branch };
  const group = path[1];
  const tree = branch.trees.find((t) => t.title === group.title);
  if (!tree) return { branch };
  if (path.length === 2) return { branch, nodes: tree.children, treeTitle: tree.title };
  let current: PsyNode | null = null;
  let pool = tree.children;
  for (let i = 2; i < path.length; i++) {
    current = findNodeIn(pool, path[i].id);
    if (!current) return { branch, treeTitle: tree.title };
    pool = current.children || [];
  }
  return { branch, nodes: current?.children || [], treeTitle: tree.title };
}

function nodeCards(nodes: PsyNode[], tone: string): LevelCard[] {
  return nodes.map((n) => {
    const kids = n.children?.length ?? 0;
    const titles = splitTitle(n.label);
    return {
      kind: 'node',
      title: n.label,
      hasChildren: kids > 0,
      item: {
        id: n.id,
        tag: kids > 0 ? `#Nœud · ${kids}` : '#Feuille',
        ...titles,
        desc: kids > 0 ? `${kids} sous-niveaux — entre pour continuer, ou reviens en arrière.` : n.label,
        tone,
        ctaText: kids > 0 ? 'Descendre' : 'Voir la fiche'
      }
    };
  });
}

function buildLevel(path: TreeStep[]): { cards: LevelCard[]; sectionLabel: string } {
  if (!path.length) {
    return {
      sectionLabel: 'Choisir une branche',
      cards: PSYCHOLOGY_BRANCHES.map((b) => ({
        kind: 'branch' as const,
        title: b.title,
        hasChildren: true,
        item: {
          id: b.id,
          tag: '#Branche',
          titleLine1: b.title,
          desc: b.object,
          img: BRANCH_ART[b.id],
          tone: BRANCH_TONE[b.color],
          ctaText: 'Entrer'
        }
      }))
    };
  }

  const { branch, nodes, treeTitle } = resolveLevel(path);
  if (!branch) {
    return { sectionLabel: 'Arborescence', cards: [] };
  }
  const tone = BRANCH_TONE[branch.color];

  if (path.length === 1) {
    return {
      sectionLabel: branch.title,
      cards: branch.trees.map((t) => ({
        kind: 'group' as const,
        title: t.title,
        hasChildren: t.children.length > 0,
        groupTitle: t.title,
        item: {
          id: `${branch.id}::${t.title}`,
          tag: `#Entrée · ${t.children.length}`,
          titleLine1: t.title,
          desc: t.children.map((c) => c.label.split(' — ')[0]).join(' · '),
          img: BRANCH_ART[branch.id],
          tone,
          ctaText: 'Ouvrir'
        }
      }))
    };
  }

  return {
    sectionLabel: path[path.length - 1]?.title || treeTitle || branch.title,
    cards: nodeCards(nodes || [], tone)
  };
}

export const TreeCoverFlow: React.FC<{
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}> = ({ onSelect }) => {
  const [path, setPath] = useState<TreeStep[]>([]);
  const { cards, sectionLabel } = useMemo(() => buildLevel(path), [path]);

  const selectedFromPath = path.length ? path[path.length - 1].id : null;
  useEffect(() => {
    onSelect(selectedFromPath);
  }, [selectedFromPath, onSelect]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setPath((p) => (p.length ? p.slice(0, -1) : p));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const goBack = () => setPath((p) => p.slice(0, -1));
  const jumpTo = (index: number) => {
    if (index < 0) setPath([]);
    else setPath((p) => p.slice(0, index + 1));
  };

  const crumbs = [{ id: 'root', label: 'Psychologie' }, ...path.map((s) => ({ id: s.id, label: s.title }))];

  const header = (
    <nav className="flex flex-wrap items-center gap-1 min-w-0">
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        return (
          <React.Fragment key={`${c.id}-${i}`}>
            {i > 0 && <span style={{ color: 'rgba(197,168,128,0.55)', fontSize: 11 }}>/</span>}
            <button
              type="button"
              onClick={() => jumpTo(i - 1)}
              disabled={last}
              style={{
                padding: '6px 10px',
                borderRadius: 9999,
                border: last ? '1px solid rgba(197,168,128,0.55)' : '1px solid rgba(255,255,255,0.12)',
                background: last ? 'rgba(197,168,128,0.18)' : 'rgba(0,0,0,0.45)',
                color: '#f3f0ea',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: last ? 'default' : 'pointer',
                maxWidth: 180,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {c.label}
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );

  return (
    <CoverFlowCarousel
      items={cards.map((c) => c.item)}
      sectionLabel={sectionLabel}
      autoplay={false}
      onBack={path.length ? goBack : undefined}
      backLabel={path.length === 1 ? 'Toutes les branches' : 'Étape précédente'}
      header={header}
      onCtaClick={(item) => {
        const id = item.id;
        const card = cards.find((c) => c.item.id === id);
        if (!card || !id) return;
        onSelect(id);
        if (!card.hasChildren) return;
        if (card.kind === 'branch') {
          setPath([{ kind: 'branch', id, title: card.title }]);
          return;
        }
        if (card.kind === 'group') {
          setPath((p) => [...p, { kind: 'group', id, title: card.title }]);
          return;
        }
        setPath((p) => [...p, { kind: 'node', id, title: card.title }]);
      }}
    />
  );
};
