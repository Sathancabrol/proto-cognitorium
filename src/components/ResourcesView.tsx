import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BookOpen, ExternalLink, Search, Wrench } from 'lucide-react';
import { CoverFlowCarousel, CarouselItem } from './ui/CoverFlowCarousel';
import { ViewModeBar, SavoirsViewMode } from './savoirs/ViewModeBar';
import { DisciplineGraph } from './atlas/DisciplineGraph';
import { PsyBranch } from '../data/psychologyAtlas';
import { AppActiveTab } from '../types';
import {
  ALL_SAVOIRS_RESOURCES,
  KIND_LABEL,
  RESOURCE_COLLECTIONS,
  ResourceLayer,
  SavoirsResource,
  collectionsForLayer,
  layerOfCollection,
  resourcesOf
} from '../data/savoirsResources';
import { LEGAL_RULE } from '../data/psyRefLibrary';
import { SEARCH_EXAMPLES, searchResources } from '../utils/resourceSearch';
import { hostOf, homepageOf, localLogo, localShot, shotUrl } from '../utils/toolVisuals';
import { LogoImg, ShotImg } from './ui/ToolVisual';
import coverPsyref from '../assets/images/cover-psyref.jpg';
import coverAtlas from '../assets/images/cover-atlas.jpg';
import coverSrl from '../assets/images/cover-srl.jpg';
import coverLab from '../assets/images/cover-lab.jpg';
import coverMetacog from '../assets/images/cover-metacog.jpg';
import coverIcd from '../assets/images/cover-icd.jpg';
import coverOutilsLab from '../assets/images/cover-outils-lab.jpg';
import coverOutilsEval from '../assets/images/cover-outils-eval.jpg';
import coverOutilsData from '../assets/images/cover-outils-data.jpg';

const ART = [coverPsyref, coverAtlas, coverSrl, coverLab, coverMetacog, coverIcd];

/** Images de base du projet — scène « en cours d’usage » derrière le navigateur. */
const FAMILY_ART: Record<string, string> = {
  outils: coverLab,
  'outils-eval': coverIcd,
  'outils-data': coverMetacog
};

const FAMILY_INUSE: Record<string, string> = {
  outils: coverOutilsLab,
  'outils-eval': coverOutilsEval,
  'outils-data': coverOutilsData
};

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
  const isOutil = layerOfCollection(item.collection) === 'outils';
  return (
    <article id="ressources-fiche" className="rounded-3xl overflow-hidden border border-slate-800 bg-[#0f172a] text-slate-100 shadow-xl">
      {isOutil && (
        <div className="relative border-b border-white/10">
          <div className="h-44 overflow-hidden bg-slate-900 relative">
            <img
              src={FAMILY_ART[item.collection] || FAMILY_INUSE[item.collection] || coverLab}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <ShotImg
              src={localShot(item.id) || shotUrl(item.url)}
              fallback={FAMILY_INUSE[item.collection] || coverOutilsLab}
              alt={`${item.title} — page d’accueil`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', position: 'relative' }}
            />
          </div>
          <div className="absolute left-5 -bottom-6 w-14 h-14 rounded-2xl bg-white p-1.5 shadow-lg">
            <LogoImg url={item.url} title={item.title} local={localLogo(item.id)} size={44} />
          </div>
        </div>
      )}
      <header className={`px-5 sm:px-8 pt-6 pb-4 border-b border-white/10 space-y-2 ${isOutil ? 'pt-10' : ''}`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">
          {isOutil ? 'Fiche outil' : 'Fiche ressource'}
        </p>
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
          <p className="text-[11px] text-rose-300">Ouvrage / article / test commercial — ne pas télécharger ni héberger. Accès éditeur / BU uniquement.</p>
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
          {isOutil && (
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

function branchesForLayer(layer: ResourceLayer): PsyBranch[] {
  return collectionsForLayer(layer).map((c) => ({
    id: c.id,
    title: c.label,
    object: c.blurb,
    color: layer === 'outils' ? 'teal' : 'slate',
    accent: layer === 'outils' ? 'from-teal-700 to-slate-900' : 'from-slate-700 to-slate-900',
    trees: [
      {
        title: layer === 'outils' ? 'Outils' : 'Lectures',
        children: resourcesOf(c.id).map((r) => ({
          id: r.id,
          label: r.title
        }))
      }
    ]
  }));
}

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
  const [layer, setLayer] = useState<ResourceLayer>('lecture');

  const layerCols = useMemo(() => collectionsForLayer(layer), [layer]);
  const layerItems = useMemo(
    () => ALL_SAVOIRS_RESOURCES.filter((r) => layerOfCollection(r.collection) === layer),
    [layer]
  );
  const graphBranches = useMemo(() => branchesForLayer(layer), [layer]);

  useEffect(() => {
    if (!focusId) return;
    const r = ALL_SAVOIRS_RESOURCES.find((x) => x.id === focusId);
    if (r) {
      setLayer(layerOfCollection(r.collection));
      setCoverCol(r.collection);
      setPicked(r.id);
    }
  }, [focusId]);

  const pickedItem = useMemo(
    () => ALL_SAVOIRS_RESOURCES.find((r) => r.id === picked) || null,
    [picked]
  );

  const hits = useMemo(() => searchResources(submitted, 28), [submitted]);

  const openLayer = (next: ResourceLayer) => {
    setLayer(next);
    setCoverCol((cur) => (cur && layerOfCollection(cur) === next ? cur : null));
  };

  const openItem = (id: string) => {
    const r = ALL_SAVOIRS_RESOURCES.find((x) => x.id === id);
    if (!r) return;
    setPicked(r.id);
    setCoverCol(r.collection);
    setLayer(layerOfCollection(r.collection));
  };

  const runSearch = (q: string) => {
    const next = q.trim();
    setQuery(next);
    setSubmitted(next);
    if (next.length >= 2) {
      const first = searchResources(next, 1)[0];
      if (first) openItem(first.item.id);
    }
  };

  const coverItems: CarouselItem[] = coverCol
    ? resourcesOf(coverCol).map((r): CarouselItem => {
        const tool = layerOfCollection(r.collection) === 'outils';
        return {
          id: r.id,
          tag: KIND_LABEL[r.kind],
          titleLine1: r.title.length > 42 ? r.title.slice(0, 40) + '…' : r.title,
          desc: tool ? `${hostOf(r.url) || r.authors} · page d’accueil` : `${r.authors} (${r.year})`,
          img: tool
            ? localShot(r.id) || shotUrl(r.url)
            : ART[RESOURCE_COLLECTIONS.findIndex((c) => c.id === r.collection) % ART.length],
          scene: tool ? FAMILY_ART[r.collection] || FAMILY_INUSE[r.collection] : undefined,
          logo: tool ? localLogo(r.id) : undefined,
          href: r.url,
          host: homepageOf(r.url) ? hostOf(r.url) : undefined,
          layout: tool ? 'tool' : 'poster',
          tone: KIND_TONE[r.kind],
          ctaText: 'Voir la fiche'
        };
      })
    : layerCols.map(
        (c, i): CarouselItem => ({
          id: c.id,
          tag: layer === 'outils' ? '#Outils' : '#Dossier',
          titleLine1: c.label,
          desc: `${resourcesOf(c.id).length} ressources · ${c.blurb}`,
          img: FAMILY_ART[c.id] || ART[i % ART.length],
          ctaText: 'Ouvrir'
        })
      );

  return (
    <div className="space-y-5 pb-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-violet-50 text-violet-700 text-xs font-bold rounded-full border border-violet-200">
            Ressources
          </span>
          <span className="text-[11px] text-slate-400">
            {layer === 'outils' ? 'Panorama documentaire · pas de cotation' : 'OER d’abord · classiques chez l’éditeur'}
          </span>
        </div>

        <div
          className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200"
          role="tablist"
          aria-label="Niveau Ressources"
        >
          <button
            id="ressources-layer-lecture"
            type="button"
            role="tab"
            aria-selected={layer === 'lecture'}
            onClick={() => openLayer('lecture')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
              layer === 'lecture' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Lectures
          </button>
          <button
            id="ressources-layer-outils"
            type="button"
            role="tab"
            aria-selected={layer === 'outils'}
            onClick={() => openLayer('outils')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
              layer === 'outils' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Outils
          </button>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {layer === 'outils' ? 'Outils — évaluation & données' : 'Carte de lecture'}
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          {layer === 'outils' ? (
            <>
              Niveau connecté à Ressources : batteries et tâches d’évaluation cognitive, puis
              traitement de données (stats, EEG/IRM, physio, psychophysique). Chaque carte montre le
              <strong> logo du site officiel</strong> et un <strong>aperçu live de la page d’accueil</strong>
              (en cours d’utilisation). Panorama documentaire — jamais un diagnostic ni une cotation.
            </>
          ) : (
            <>
              Demande en langage naturel : « un outil pour faire une expérimentation », « test de
              personnalité », « paradigme Stroop ». Passe sur <strong>Outils</strong> pour l’évaluation
              cognitive et le traitement de données. Référence reste la hiérarchie des preuves.
            </>
          )}
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
              placeholder="Ex. évaluation cognitive, EEG, MoCA, jsPsych…"
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
            <p className="text-xs text-slate-500">Rien de correspondant. Essaie « outil », « MoCA », « EEG », « Stroop ».</p>
          )}
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {hits.map(({ item, score }) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => openItem(item.id)}
                  className={`w-full text-left rounded-2xl border px-3 py-2.5 ${
                    picked === item.id ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-violet-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700">
                      {KIND_LABEL[item.kind]}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.collection}</span>
                    {layerOfCollection(item.collection) === 'outils' && (
                      <span className="text-[10px] font-bold text-teal-700">outils</span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-slate-900 mt-0.5 inline-flex items-center gap-2">
                    {layerOfCollection(item.collection) === 'outils' && (
                      <LogoImg url={item.url} title={item.title} local={localLogo(item.id)} size={18} />
                    )}
                    {item.title}
                  </p>
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
          items={coverItems}
          sectionLabel={
            coverCol
              ? RESOURCE_COLLECTIONS.find((c) => c.id === coverCol)?.label
              : layer === 'outils'
                ? 'Choisir une famille d’outils'
                : 'Choisir un dossier'
          }
          autoplay={false}
          onBack={coverCol ? () => setCoverCol(null) : undefined}
          backLabel={layer === 'outils' ? 'Toutes les familles' : 'Tous les dossiers'}
          onCtaClick={(item) => {
            if (!item.id) return;
            if (!coverCol) {
              setCoverCol(item.id);
              return;
            }
            openItem(item.id);
          }}
        />
      )}

      {mode === 'titres' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Affiche</p>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              {layer === 'outils' ? 'Outils' : 'Ressources'}
            </h2>
            <p className="text-[12px] text-slate-500 mt-1">
              {layerItems.length} entrée{layerItems.length > 1 ? 's' : ''} dans ce niveau
            </p>
          </div>
          {layerCols.map((c) => (
            <div key={c.id}>
              <h3 className="text-lg font-black">{c.label}</h3>
              <p className="text-[11px] text-slate-500 mb-1">{c.blurb}</p>
              <ul className="space-y-0.5">
                {resourcesOf(c.id).map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => openItem(r.id)}
                      className={`text-left text-sm py-0.5 inline-flex items-center gap-2 ${
                        picked === r.id ? 'text-violet-800 font-bold' : 'text-slate-700 hover:text-violet-800'
                      }`}
                    >
                      {layer === 'outils' && <LogoImg url={r.url} title={r.title} size={16} />}
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
          branches={graphBranches}
          selectedId={picked}
          onSelect={(nid) => {
            const r = ALL_SAVOIRS_RESOURCES.find((x) => x.id === nid);
            if (r) openItem(r.id);
          }}
          rootId={layer === 'outils' ? 'res-outils' : 'res-root'}
          rootLabel={layer === 'outils' ? 'Outils' : 'Ressources'}
          caption={
            layer === 'outils'
              ? 'Graphe des familles d’outils — pas le graphe des compétences, pas l’atlas entier'
              : 'Graphe des dossiers de lecture — pas le graphe des compétences, pas l’atlas entier'
          }
        />
      )}

      {pickedItem && (
        <ResourceFiche item={pickedItem} onOpenPoster={onOpenPoster} onNavigate={onNavigate} />
      )}

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950 leading-relaxed flex gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        {LEGAL_RULE} Citations ≈ influence. Niveau 5 jamais auto-déduit.
        {layer === 'outils' && ' Tests cliniques = documentaire, jamais cotés ici.'}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {layerCols.map((c) => {
          const items = resourcesOf(c.id);
          const n = items.length;
          const oer = items.filter((r) => r.legal === 'oer').length;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setCoverCol(c.id);
                setMode('coverflow');
              }}
              className="text-left bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-violet-400 transition-colors"
            >
              {FAMILY_ART[c.id] && (
                <img src={FAMILY_ART[c.id]} alt="" className="w-full h-28 object-cover" />
              )}
              <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                {layer === 'outils' ? (
                  <Wrench className="w-3.5 h-3.5 text-teal-700" />
                ) : (
                  <BookOpen className="w-3.5 h-3.5 text-violet-600" />
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {n} · {oer} OER
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{c.label}</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{c.blurb}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
