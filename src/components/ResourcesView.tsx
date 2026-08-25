import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BookOpen, ExternalLink, Search } from 'lucide-react';
import { CoverFlowCarousel, CarouselItem } from './ui/CoverFlowCarousel';
import { ViewModeBar, SavoirsViewMode } from './savoirs/ViewModeBar';
import { DisciplineGraph } from './atlas/DisciplineGraph';
import { PsyBranch } from '../data/psychologyAtlas';
import { AppActiveTab } from '../types';
import {
  KIND_LABEL,
  RESOURCE_COLLECTIONS,
  SAVOIRS_RESOURCES,
  SavoirsResource
} from '../data/savoirsResources';
import { LEGAL_RULE } from '../data/psyRefLibrary';
import { SEARCH_EXAMPLES, searchResources } from '../utils/resourceSearch';
import coverPsyref from '../assets/images/cover-psyref.jpg';
import coverAtlas from '../assets/images/cover-atlas.jpg';
import coverSrl from '../assets/images/cover-srl.jpg';
import coverLab from '../assets/images/cover-lab.jpg';
import coverMetacog from '../assets/images/cover-metacog.jpg';
import coverIcd from '../assets/images/cover-icd.jpg';

const ART = [coverPsyref, coverAtlas, coverSrl, coverLab, coverMetacog, coverIcd];

const KIND_TONE: Record<string, string> = {
  oer: 'linear-gradient(160deg,#0f766e,#134e4a)',
  classic: 'linear-gradient(160deg,#7c3aed,#1e1b4b)',
  platform: 'linear-gradient(160deg,#0369a1,#0c4a6e)',
  synthesis: 'linear-gradient(160deg,#4f46e5,#1e1b4b)',
  norm: 'linear-gradient(160deg,#0f172a,#334155)',
  tool: 'linear-gradient(160deg,#c2410c,#7c2d12)',
  test: 'linear-gradient(160deg,#0369a1,#0c4a6e)',
  concept: 'linear-gradient(160deg,#6d28d9,#312e81)'
};

interface ResourcesViewProps {
  focusId?: string | null;
  onOpenPoster?: (id: string) => void;
  onNavigate?: (tab: AppActiveTab) => void;
}

const ResourceFiche: React.FC<{
  item: SavoirsResource;
  onOpenPoster?: (id: string) => void;
  onNavigate?: (tab: AppActiveTab) => void;
}> = ({ item, onOpenPoster, onNavigate }) => {
  const doiUrl = item.doi ? `https://doi.org/${item.doi}` : undefined;
  const col = RESOURCE_COLLECTIONS.find((c) => c.id === item.collection);
  return (
    <article id="ressources-fiche" className="rounded-3xl overflow-hidden border border-slate-800 bg-[#0f172a] text-slate-100 shadow-xl">
      <header className="px-5 sm:px-8 pt-6 pb-4 border-b border-white/10 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">Fiche ressource</p>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{item.title}</h2>
        <p className="text-sm text-slate-300">{item.subtitle}</p>
        <p className="text-xs text-slate-400">
          {KIND_LABEL[item.kind]} · {col?.label} · {item.authors} ({item.year})
        </p>
      </header>
      <div className="px-5 sm:px-8 py-5 space-y-4 text-sm">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Référence</div>
          <p className="text-slate-200 leading-relaxed mt-1">
            {item.authors} ({item.year}). <em>{item.title}</em>. {item.subtitle}.
          </p>
        </div>
        {item.doi && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">DOI</div>
            <a href={doiUrl} target="_blank" rel="noreferrer" className="text-amber-300 font-mono text-xs break-all">
              {item.doi}
            </a>
          </div>
        )}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">URL</div>
          <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-amber-300 text-xs break-all">
            {item.url} <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        </div>
        {typeof item.citationsApprox === 'number' && (
          <p className="text-[12px] text-slate-400">
            ~{item.citationsApprox.toLocaleString('fr-FR')} citations (ordre de grandeur — influence, pas vérité).
          </p>
        )}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Résumé</div>
          <p className="text-slate-300 leading-relaxed mt-1">{item.summary}</p>
        </div>
        {item.clinical && (
          <p className="text-[11px] text-sky-200 leading-relaxed">
            information_documentaire_non_diagnostique — jamais un diagnostic automatique.
          </p>
        )}
        {item.legal === 'commercial-ne-pas-telecharger' && (
          <p className="text-[11px] text-rose-300">Ouvrage / article commercial — ne pas télécharger ni héberger. Accès éditeur / BU uniquement.</p>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          {item.posterId && (
            <button
              type="button"
              onClick={() => onOpenPoster?.(item.posterId!)}
              className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-amber-500 text-slate-950"
            >
              Voir le poster
            </button>
          )}
          {item.atlasId && (
            <button
              type="button"
              onClick={() => onNavigate?.('atlas')}
              className="px-3 py-1.5 rounded-xl text-[11px] font-bold border border-white/20"
            >
              Arborescence
            </button>
          )}
          {(item.collection === 'srl' || item.tags?.includes('srl') || item.tags?.includes('métacognition')) && (
            <button
              type="button"
              onClick={() => onNavigate?.('metacog')}
              className="px-3 py-1.5 rounded-xl text-[11px] font-bold border border-white/20"
            >
              Boucle SRL
            </button>
          )}
          {item.collection === 'outils' && (
            <button
              type="button"
              onClick={() => onNavigate?.('posters')}
              className="px-3 py-1.5 rounded-xl text-[11px] font-bold border border-white/20"
            >
              Posters labo
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

const RESOURCE_BRANCHES: PsyBranch[] = RESOURCE_COLLECTIONS.map((c) => ({
  id: c.id,
  title: c.label,
  object: c.blurb,
  color: 'slate',
  accent: 'from-slate-700 to-slate-900',
  trees: [
    {
      title: 'Documents',
      children: SAVOIRS_RESOURCES.filter((r) => r.collection === c.id).map((r) => ({
        id: r.id,
        label: r.title
      }))
    }
  ]
}));

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  focusId,
  onOpenPoster,
  onNavigate
}) => {
  const [mode, setMode] = useState<SavoirsViewMode>('coverflow');
  const [coverCol, setCoverCol] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');

  useEffect(() => {
    if (!focusId) return;
    const r = SAVOIRS_RESOURCES.find((x) => x.id === focusId);
    if (r) {
      setCoverCol(r.collection);
      setPicked(r.id);
    }
  }, [focusId]);

  const pickedItem = useMemo(
    () => SAVOIRS_RESOURCES.find((r) => r.id === picked) || null,
    [picked]
  );

  const hits = useMemo(() => searchResources(submitted, 28), [submitted]);

  const runSearch = (q: string) => {
    const next = q.trim();
    setQuery(next);
    setSubmitted(next);
    if (next.length >= 2) {
      const first = searchResources(next, 1)[0];
      if (first) setPicked(first.item.id);
    }
  };

  return (
    <div className="space-y-5 pb-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-violet-50 text-violet-700 text-xs font-bold rounded-full border border-violet-200">
            Ressources
          </span>
          <span className="text-[11px] text-slate-400">OER d’abord · classiques chez l’éditeur</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Carte de lecture</h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Demande en langage naturel : « un outil pour faire une expérimentation », « test de
          personnalité », « paradigme Stroop ». Les outils et questionnaires s’ajoutent aux dossiers
          OER / classiques. Référence reste la hiérarchie des preuves.
        </p>
        <form
          className="flex flex-col sm:flex-row gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            runSearch(query);
          }}
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="ressources-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex. outil pour une expérimentation, test métacognition, jsPsych…"
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <button
            id="ressources-search-btn"
            type="submit"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-violet-600 text-white shrink-0"
          >
            Rechercher
          </button>
        </form>
        <div className="flex flex-wrap gap-1.5">
          {SEARCH_EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => runSearch(ex)}
              className="text-[11px] px-2.5 py-1 rounded-full border border-slate-200 text-slate-600 hover:border-violet-400 hover:text-violet-800"
            >
              {ex}
            </button>
          ))}
        </div>
        <ViewModeBar mode={mode} onMode={setMode} />
      </div>

      {submitted.length >= 2 && (
        <div className="bg-white rounded-3xl border border-violet-200 p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-slate-900">
              {hits.length} résultat{hits.length > 1 ? 's' : ''} pour « {submitted} »
            </h2>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSubmitted('');
              }}
              className="text-[11px] font-bold text-slate-500"
            >
              Effacer
            </button>
          </div>
          {hits.length === 0 && (
            <p className="text-xs text-slate-500">Rien de correspondant. Essaie « outil », « test », « Stroop », « jsPsych ».</p>
          )}
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {hits.map(({ item, score }) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setPicked(item.id);
                    setCoverCol(item.collection);
                  }}
                  className={`w-full text-left rounded-2xl border px-3 py-2.5 ${
                    picked === item.id ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-violet-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700">
                      {KIND_LABEL[item.kind]}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.collection}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{item.title}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{item.subtitle}</p>
                  <span className="sr-only">score {score}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {mode === 'coverflow' && (
        <CoverFlowCarousel
          items={
            coverCol
              ? SAVOIRS_RESOURCES.filter((r) => r.collection === coverCol).map(
                  (r): CarouselItem => ({
                    id: r.id,
                    tag: KIND_LABEL[r.kind],
                    titleLine1: r.title.length > 42 ? r.title.slice(0, 40) + '…' : r.title,
                    desc: `${r.authors} (${r.year})`,
                    img: ART[RESOURCE_COLLECTIONS.findIndex((c) => c.id === r.collection) % ART.length],
                    tone: KIND_TONE[r.kind],
                    ctaText: 'Voir la fiche'
                  })
                )
              : RESOURCE_COLLECTIONS.map(
                  (c, i): CarouselItem => ({
                    id: c.id,
                    tag: '#Dossier',
                    titleLine1: c.label,
                    desc: `${SAVOIRS_RESOURCES.filter((r) => r.collection === c.id).length} ressources · ${c.blurb}`,
                    img: ART[i % ART.length],
                    ctaText: 'Ouvrir'
                  })
                )
          }
          sectionLabel={coverCol ? RESOURCE_COLLECTIONS.find((c) => c.id === coverCol)?.label : 'Choisir un dossier'}
          autoplay={false}
          onBack={coverCol ? () => setCoverCol(null) : undefined}
          backLabel="Tous les dossiers"
          onCtaClick={(item) => {
            if (!item.id) return;
            if (!coverCol) {
              setCoverCol(item.id);
              return;
            }
            setPicked(item.id);
          }}
        />
      )}

      {mode === 'titres' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Affiche</p>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Ressources</h2>
          </div>
          {RESOURCE_COLLECTIONS.map((c) => (
            <div key={c.id}>
              <h3 className="text-lg font-black">{c.label}</h3>
              <p className="text-[11px] text-slate-500 mb-1">{c.blurb}</p>
              <ul className="space-y-0.5">
                {SAVOIRS_RESOURCES.filter((r) => r.collection === c.id).map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => setPicked(r.id)}
                      className={`text-left text-sm py-0.5 ${
                        picked === r.id ? 'text-violet-800 font-bold' : 'text-slate-700 hover:text-violet-800'
                      }`}
                    >
                      {r.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {mode === 'graphe' && (
        <DisciplineGraph
          branches={RESOURCE_BRANCHES}
          selectedId={picked}
          onSelect={(nid) => {
            const r = SAVOIRS_RESOURCES.find((x) => x.id === nid);
            if (r) setPicked(r.id);
          }}
          rootId="res-root"
          rootLabel="Ressources"
          caption="Graphe des dossiers de lecture — pas le graphe des compétences, pas l’atlas entier"
        />
      )}

      {pickedItem && (
        <ResourceFiche item={pickedItem} onOpenPoster={onOpenPoster} onNavigate={onNavigate} />
      )}

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950 leading-relaxed flex gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        {LEGAL_RULE} Citations ≈ influence. Niveau 5 jamais auto-déduit.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {RESOURCE_COLLECTIONS.map((c) => {
          const n = SAVOIRS_RESOURCES.filter((r) => r.collection === c.id).length;
          const oer = SAVOIRS_RESOURCES.filter((r) => r.collection === c.id && r.legal === 'oer').length;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setCoverCol(c.id);
                setMode('coverflow');
              }}
              className="text-left bg-white border border-slate-200 rounded-2xl p-4 hover:border-violet-400 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-violet-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {n} · {oer} OER
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{c.label}</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{c.blurb}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
