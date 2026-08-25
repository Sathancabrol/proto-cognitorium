import React, { useMemo, useState } from 'react';
import { AlertTriangle, ExternalLink, Layers, Shield } from 'lucide-react';
import {
  EVIDENCE_HIERARCHY,
  KEY_JOURNALS,
  LAYER_LABEL,
  PSYREF_NOTES,
  PSYREF_SOURCES,
  SourceLayer
} from '../data/psyRefSources';

const LAYER_STYLE: Record<SourceLayer, string> = {
  normative: 'bg-slate-900 text-amber-200 border-slate-700',
  synthesis: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  primary: 'bg-blue-50 text-blue-800 border-blue-200',
  professional: 'bg-violet-50 text-violet-800 border-violet-200',
  platform: 'bg-slate-50 text-slate-700 border-slate-200',
  public: 'bg-emerald-50 text-emerald-800 border-emerald-200'
};

export const PsyRefView: React.FC = () => {
  const [layer, setLayer] = useState<SourceLayer | 'all'>('all');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return PSYREF_SOURCES.filter((s) => {
      if (layer !== 'all' && s.layer !== layer) return false;
      if (!query) return true;
      return `${s.name} ${s.role} ${s.tags.join(' ')}`.toLowerCase().includes(query);
    });
  }, [layer, q]);

  return (
    <div className="space-y-5 pb-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-slate-900 text-amber-200 text-xs font-bold rounded-full">
            PsyRef {PSYREF_NOTES.version}
          </span>
          <span className="text-[11px] text-slate-400">snapshot {PSYREF_NOTES.dated}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">
          Référentiel des sources
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl mt-2 leading-relaxed">{PSYREF_NOTES.principle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {EVIDENCE_HIERARCHY.map((h) => (
          <button
            key={h.id}
            type="button"
            onClick={() => setLayer((cur) => (cur === h.id ? 'all' : h.id))}
            className={`text-left p-4 rounded-2xl border transition-all ${
              layer === h.id ? 'border-slate-900 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-400'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-slate-400">N{h.rank}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${LAYER_STYLE[h.id]}`}>
                {LAYER_LABEL[h.id]}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">{h.title}</h3>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{h.use}</p>
            <p className="text-[11px] text-slate-400 mt-1 italic">{h.not}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filtrer une source…"
          className="flex-1 text-sm rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <button
          type="button"
          onClick={() => {
            setLayer('all');
            setQ('');
          }}
          className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200"
        >
          Tout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {list.map((s) => (
          <article key={s.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${LAYER_STYLE[s.layer]}`}>
                {LAYER_LABEL[s.layer]}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">{s.scope}</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">{s.name}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{s.role}</p>
            <p className="text-[11px] text-slate-500 flex gap-1.5 leading-relaxed">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
              {s.caveat}
            </p>
            {s.url && (
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600"
              >
                Source <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-slate-900 text-slate-100 rounded-3xl p-5 space-y-3">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-300" /> CIM-11 vs DSM-5-TR
          </h2>
          <ul className="space-y-2">
            {PSYREF_NOTES.icdVsDsm.map((n) => (
              <li key={n} className="text-[12px] text-slate-300 leading-relaxed">
                {n}
              </li>
            ))}
          </ul>
          <h3 className="text-xs font-bold text-amber-200 pt-2">API CIM-11</h3>
          <ul className="space-y-1.5">
            {PSYREF_NOTES.icdApi.map((n) => (
              <li key={n} className="text-[11px] text-slate-400 leading-relaxed">
                {n}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-600" /> UX, limites, versioning
          </h2>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sciences cognitives → UX</h3>
            <ul className="mt-1 space-y-1">
              {PSYREF_NOTES.ux.map((n) => (
                <li key={n} className="text-[12px] text-slate-600 leading-relaxed">
                  {n}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Limites</h3>
            <ul className="mt-1 space-y-1">
              {PSYREF_NOTES.limits.map((n) => (
                <li key={n} className="text-[12px] text-slate-600 leading-relaxed">
                  {n}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Versionner PsyRef</h3>
            <ul className="mt-1 space-y-1">
              {PSYREF_NOTES.versioning.map((n) => (
                <li key={n} className="text-[12px] text-slate-600 leading-relaxed">
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Revues à privilégier (points de départ)</h2>
        <p className="text-[11px] text-slate-500">
          La revue n’est pas une garantie de vérité. Pour une décision : revues systématiques, méta-analyses, réplications.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {KEY_JOURNALS.map((g) => (
            <div key={g.field}>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">{g.field}</h3>
              <ul className="text-xs text-slate-700 space-y-0.5">
                {g.titles.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
