import React, { useMemo, useState } from 'react';
import { BookOpen, ChevronRight, Quote, Search } from 'lucide-react';
import { KEY_CITATIONS, PSYCHOLOGY_BRANCHES, PsyNode } from '../data/psychologyAtlas';

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

const TreeNodes: React.FC<{ nodes: PsyNode[]; depth?: number }> = ({ nodes, depth = 0 }) => {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  return (
    <ul className={depth === 0 ? 'space-y-1' : 'mt-1 ml-3 border-l border-slate-200 pl-3 space-y-1'}>
      {nodes.map((n) => {
        const has = !!n.children?.length;
        const isOpen = open[n.id] ?? depth < 1;
        return (
          <li key={n.id}>
            <button
              type="button"
              onClick={() => has && setOpen((s) => ({ ...s, [n.id]: !isOpen }))}
              className={`flex items-start gap-1.5 text-left w-full rounded-lg px-2 py-1.5 ${
                has ? 'hover:bg-slate-50 cursor-pointer' : 'cursor-default'
              }`}
            >
              {has ? (
                <ChevronRight className={`w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
              ) : (
                <span className="w-3.5 h-3.5 mt-0.5 shrink-0 flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                </span>
              )}
              <span className={`text-xs leading-snug ${has ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
                {n.label}
              </span>
            </button>
            {has && isOpen && <TreeNodes nodes={n.children!} depth={depth + 1} />}
          </li>
        );
      })}
    </ul>
  );
};

export const PsychologyAtlasView: React.FC = () => {
  const [branchId, setBranchId] = useState(PSYCHOLOGY_BRANCHES[0].id);
  const [query, setQuery] = useState('');
  const branch = PSYCHOLOGY_BRANCHES.find((b) => b.id === branchId) ?? PSYCHOLOGY_BRANCHES[0];
  const colors = COLOR[branch.color];

  const citations = useMemo(() => {
    const q = query.trim().toLowerCase();
    return KEY_CITATIONS.filter((c) => {
      if (!q) return true;
      return `${c.authors} ${c.title} ${c.venue} ${c.category}`.toLowerCase().includes(q);
    });
  }, [query]);

  return (
    <div className="space-y-5 pb-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200">
            Atlas académique
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Arborescence de la psychologie
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            Huit grandes branches, du général au spécialisé. Une carte pour taguer des ressources,
            concevoir des modules, et relier un vécu à un mécanisme — pas un diagnostic.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PSYCHOLOGY_BRANCHES.map((b) => {
          const active = b.id === branchId;
          const c = COLOR[b.color];
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setBranchId(b.id)}
              className={`text-left p-3 rounded-2xl border transition-all ${
                active ? 'bg-white border-slate-900 shadow-sm' : `bg-white border-slate-200 ${c.ring}`
              }`}
            >
              <span className={`inline-block w-8 h-1 rounded-full mb-2 ${c.bar}`} />
              <div className="text-xs font-bold text-slate-900 leading-snug">{b.title}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${colors.chip}`}>
              Branche
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-2">{branch.title}</h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{branch.object}</p>
          </div>
          <div className="space-y-5">
            {branch.trees.map((tree) => (
              <div key={tree.title}>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {tree.title}
                </h3>
                <TreeNodes nodes={tree.children} />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-300" />
              <h3 className="text-sm font-bold">Références les plus citées</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Compteurs approximatifs (Google Scholar / revues de citations). Ordres de grandeur
              pour prioriser une lecture, pas des mesures officielles.
            </p>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filtrer auteur, titre, catégorie…"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[42rem] overflow-y-auto pr-1">
            {citations.map((c) => (
              <article key={c.id} className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-600">
                    {c.category}
                  </span>
                  {c.citationsApprox != null && (
                    <span className="text-[10px] font-bold text-slate-500">
                      ~{c.citationsApprox.toLocaleString('fr-FR')} cit.
                    </span>
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
      </div>
    </div>
  );
};
