import React, { useMemo, useState } from 'react';
import { BookOpen, ChevronRight, ListTree, Network, Quote, Search } from 'lucide-react';
import { KEY_CITATIONS, PSYCHOLOGY_BRANCHES, PsyNode } from '../data/psychologyAtlas';
import { AppActiveTab } from '../types';
import { DisciplineGraph, findNode } from './atlas/DisciplineGraph';
import { TreeCoverFlow } from './atlas/TreeCoverFlow';
import { ViewModeBar, SavoirsViewMode } from './savoirs/ViewModeBar';
import { NodeRelated } from './savoirs/NodeRelated';
import { relatedForAtlasNode } from '../data/savoirsLinks';

type AtlasMode = SavoirsViewMode;

const COLOR: Record<string, { chip: string; bar: string; ring: string }> = {
  blue: { chip: 'bg-blue-50 text-blue-700 border-blue-200', bar: 'bg-blue-600', ring: 'hover:border-blue-400' },
  rose: { chip: 'bg-rose-50 text-rose-700 border-rose-200', bar: 'bg-rose-600', ring: 'hover:border-rose-400' },
  emerald: { chip: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: 'bg-emerald-600', ring: 'hover:border-emerald-400' },
  amber: { chip: 'bg-amber-50 text-amber-800 border-amber-200', bar: 'bg-amber-500', ring: 'hover:border-amber-400' },
  violet: { chip: 'bg-violet-50 text-violet-700 border-violet-200', bar: 'bg-violet-600', ring: 'hover:border-violet-400' },
  teal: { chip: 'bg-teal-50 text-teal-700 border-teal-200', bar: 'bg-teal-600', ring: 'hover:border-teal-400' },
  indigo: { chip: 'bg-indigo-50 text-indigo-700 border-indigo-200', bar: 'bg-indigo-600', ring: 'hover:border-indigo-400' },
  slate: { chip: 'bg-slate-100 text-slate-700 border-slate-300', bar: 'bg-slate-800', ring: 'hover:border-slate-500' }
};

const TitleOutline: React.FC<{
  selectedId: string | null;
  onSelect: (id: string) => void;
}> = ({ selectedId, onSelect }) => {
  const [open, setOpen] = useState<Record<string, boolean>>({ cognitive: true });

  const renderNodes = (nodes: PsyNode[], depth: number) =>
    nodes.map((n) => {
      const has = !!n.children?.length;
      const isOpen = open[n.id] ?? depth < 1;
      const sizes = ['text-base', 'text-sm', 'text-xs', 'text-[11px]'];
      const weights = ['font-black', 'font-bold', 'font-semibold', 'font-medium'];
      return (
        <li key={n.id} className={depth ? 'ml-4 border-l border-slate-200 pl-3' : ''}>
          <button
            type="button"
            onClick={() => {
              onSelect(n.id);
              if (has) setOpen((s) => ({ ...s, [n.id]: !isOpen }));
            }}
            className={`flex items-baseline gap-2 w-full text-left py-1.5 ${
              selectedId === n.id ? 'text-indigo-700' : 'text-slate-800 hover:text-indigo-600'
            }`}
          >
            {has && (
              <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            )}
            <span className={`${sizes[Math.min(depth, 3)]} ${weights[Math.min(depth, 3)]} tracking-tight leading-snug`}>
              {n.label}
            </span>
          </button>
          {has && isOpen && <ul>{renderNodes(n.children!, depth + 1)}</ul>}
        </li>
      );
    });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Affiche</p>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Psychologie</h2>
      </div>
      {PSYCHOLOGY_BRANCHES.map((b) => (
        <div key={b.id}>
          <button
            type="button"
            onClick={() => {
              onSelect(b.id);
              setOpen((s) => ({ ...s, [b.id]: !s[b.id] }));
            }}
            className={`text-left ${selectedId === b.id ? 'text-indigo-700' : ''}`}
          >
            <h3 className="text-xl font-black tracking-tight">{b.title}</h3>
            <p className="text-xs text-slate-500 italic mt-0.5">{b.object}</p>
          </button>
          {(open[b.id] ?? b.id === 'cognitive') &&
            b.trees.map((t) => (
              <div key={t.title} className="mt-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">{t.title}</h4>
                <ul>{renderNodes(t.children, 1)}</ul>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

const CitationsPanel: React.FC = () => {
  const [query, setQuery] = useState('');
  const citations = useMemo(() => {
    const q = query.trim().toLowerCase();
    return KEY_CITATIONS.filter((c) => !q || `${c.authors} ${c.title} ${c.venue} ${c.category}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="space-y-3">
      <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-300" />
          <h3 className="text-sm font-bold">Références les plus citées</h3>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Ordres de grandeur pour prioriser une lecture, pas des mesures officielles.
        </p>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtrer auteur, titre…"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="space-y-2 max-h-[36rem] overflow-y-auto pr-1">
        {citations.map((c) => (
          <article key={c.id} className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-600">{c.category}</span>
              {c.citationsApprox != null && (
                <span className="text-[10px] font-bold text-slate-500">~{c.citationsApprox.toLocaleString('fr-FR')} cit.</span>
              )}
            </div>
            <h4 className="text-xs font-bold text-slate-900 leading-snug">{c.title}</h4>
            <p className="text-[11px] text-slate-600">
              {c.authors} ({c.year}). <em>{c.venue}</em>
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed flex gap-1.5">
              <Quote className="w-3 h-3 mt-0.5 shrink-0 text-slate-300" />
              {c.note}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};

export const PsychologyAtlasView: React.FC<{
  onNavigate?: (tab: AppActiveTab) => void;
  onOpenPoster?: (id: string) => void;
  onOpenRef?: (id: string) => void;
}> = ({ onOpenPoster, onOpenRef }) => {
  const [mode, setMode] = useState<AtlasMode>('coverflow');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const hit = selectedId ? findNode(PSYCHOLOGY_BRANCHES, selectedId) : null;
  const selectedBranch = hit?.branch ?? PSYCHOLOGY_BRANCHES.find((b) => b.id === selectedId);
  const colors = COLOR[selectedBranch?.color || 'slate'];
  const related = relatedForAtlasNode(selectedId);

  return (
    <div className="space-y-5 pb-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200">
          Atlas académique
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">Arborescence de la psychologie</h1>
        <p className="text-sm text-slate-600 max-w-3xl mt-2 leading-relaxed">
          Toute l’arborescence se parcourt en coverflow : une carte = un niveau. Tu descends dans une branche,
          une entrée, un nœud — et tu reviens en arrière à tout moment (bouton Retour, fil d’Ariane, ou Échap).
        </p>
        <div className="mt-4">
          <ViewModeBar mode={mode} onMode={setMode} />
        </div>
      </div>

      {mode === 'coverflow' && <TreeCoverFlow selectedId={selectedId} onSelect={setSelectedId} />}
      {mode === 'titres' && <TitleOutline selectedId={selectedId} onSelect={setSelectedId} />}
      {mode === 'graphe' && (
        <DisciplineGraph
          branches={PSYCHOLOGY_BRANCHES}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onOpenPoster={onOpenPoster}
          onOpenRef={onOpenRef}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-3">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${colors.chip}`}>
            Fiche
          </span>
          {hit || selectedBranch ? (
            <>
              <h2 className="text-lg font-bold text-slate-900">{hit?.node?.label || selectedBranch?.title}</h2>
              {hit?.group && <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{hit.group}</p>}
              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedBranch?.object}
                {hit?.node && !hit.node.children?.length
                  ? ' Niveau de spécialisation : feuille de l’arbre. Relier à un paradigme expérimental ou à une source de référence, jamais à un diagnostic automatique.'
                  : null}
              </p>
              {hit?.node?.children && (
                <ul className="flex flex-wrap gap-1.5">
                  {hit.node.children.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(c.id)}
                        className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50"
                      >
                        {c.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {selectedBranch && !hit?.node && (
                <ul className="space-y-2 pt-2">
                  {selectedBranch.trees.map((t) => (
                    <li key={t.title}>
                      <div className="text-[10px] font-bold uppercase text-slate-400">{t.title}</div>
                      <div className="text-xs text-slate-600">{t.children.map((c) => c.label).join(' · ')}</div>
                    </li>
                  ))}
                </ul>
              )}
              <NodeRelated related={related} onOpenPoster={onOpenPoster} onOpenRef={onOpenRef} />
            </>
          ) : (
            <p className="text-sm text-slate-500">Choisis une carte dans le coverflow, un titre, ou un nœud du graphe.</p>
          )}
        </div>
        <div className="lg:col-span-2">
          <CitationsPanel />
        </div>
      </div>
    </div>
  );
};
