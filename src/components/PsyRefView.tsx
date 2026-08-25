import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ExternalLink, Layers, Shield } from 'lucide-react';
import { CoverFlowCarousel, CarouselItem } from './ui/CoverFlowCarousel';
import { ViewModeBar, SavoirsViewMode } from './savoirs/ViewModeBar';
import { DisciplineGraph } from './atlas/DisciplineGraph';
import { PsyBranch } from '../data/psychologyAtlas';
import { LibraryWork } from '../data/psyRefLibrary';
import coverPsyref from '../assets/images/cover-psyref.jpg';
import coverAtlas from '../assets/images/cover-atlas.jpg';
import coverIcd from '../assets/images/cover-icd.jpg';
import coverSrl from '../assets/images/cover-srl.jpg';
import coverLab from '../assets/images/cover-lab.jpg';
import coverMetacog from '../assets/images/cover-metacog.jpg';
import {
  EVIDENCE_HIERARCHY,
  KEY_JOURNALS,
  LAYER_LABEL,
  PSYREF_NOTES,
  PSYREF_SOURCES,
  SourceLayer
} from '../data/psyRefSources';
import {
  DOWNLOAD_ORDER,
  EVIDENCE_MARKS,
  LEGAL_RULE,
  LIBRARY_FOLDERS,
  PSYREF_LIBRARY
} from '../data/psyRefLibrary';

const LAYER_STYLE: Record<SourceLayer, string> = {
  normative: 'bg-slate-900 text-amber-200 border-slate-700',
  synthesis: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  primary: 'bg-blue-50 text-blue-800 border-blue-200',
  professional: 'bg-violet-50 text-violet-800 border-violet-200',
  platform: 'bg-slate-50 text-slate-700 border-slate-200',
  public: 'bg-emerald-50 text-emerald-800 border-emerald-200'
};

const FOLDER_ART = [coverPsyref, coverAtlas, coverIcd, coverSrl, coverLab, coverMetacog, coverPsyref, coverAtlas, coverLab, coverIcd];

function doiOf(w: LibraryWork): string | undefined {
  if (w.doi) return w.doi;
  const m = w.url.match(/10\.\d{4,}\/[^\s/?#]+/);
  return m?.[0];
}

const WorkFiche: React.FC<{ work: LibraryWork }> = ({ work }) => {
  const doi = doiOf(work);
  const doiUrl = doi ? (doi.startsWith('http') ? doi : `https://doi.org/${doi}`) : undefined;
  return (
    <article className="rounded-3xl overflow-hidden border border-slate-800 bg-[#0f172a] text-slate-100 shadow-xl">
      <header className="px-5 sm:px-8 pt-6 pb-4 border-b border-white/10 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">Fiche de l’œuvre</p>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{work.titre}</h2>
        <p className="text-sm text-slate-300">{work.type} · {work.domaine} · {work.langue}</p>
      </header>
      <div className="px-5 sm:px-8 py-5 space-y-4 text-sm">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Référence bibliographique</div>
          <p className="text-slate-200 leading-relaxed mt-1">
            {work.auteurs} ({work.annee}). <em>{work.titre}</em>. {work.type}. {work.licence}.
          </p>
        </div>
        {doi && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">DOI</div>
            <a href={doiUrl} target="_blank" rel="noreferrer" className="text-amber-300 font-mono text-xs break-all">
              {doi}
            </a>
          </div>
        )}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">URL</div>
          <a href={work.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-amber-300 text-xs break-all">
            {work.url} <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Résumé</div>
          <p className="text-slate-300 leading-relaxed mt-1">{work.role}</p>
          {work.note && <p className="text-[12px] text-amber-200/90 mt-2 leading-relaxed">{work.note}</p>}
        </div>
        {work.legal === 'commercial-ne-pas-telecharger' && (
          <p className="text-[11px] text-rose-300">Ouvrage commercial — ne pas télécharger ni héberger le PDF. Accès éditeur / BU uniquement.</p>
        )}
      </div>
    </article>
  );
};

const REF_BRANCHES: PsyBranch[] = LIBRARY_FOLDERS.map((f) => ({
  id: f.id,
  title: f.label,
  object: `Dossier ${f.label} de la bibliothèque de référence.`,
  color: 'slate',
  accent: 'from-slate-700 to-slate-900',
  trees: [
    {
      title: 'Documents',
      children: PSYREF_LIBRARY.filter((w) => w.folder === f.id).map((w) => ({
        id: w.id,
        label: w.titre
      }))
    }
  ]
}));

export const PsyRefView: React.FC<{ focusId?: string | null }> = ({ focusId }) => {
  const [mode, setMode] = useState<SavoirsViewMode>('coverflow');
  const [pane, setPane] = useState<'sources' | 'library'>('library');
  const [layer, setLayer] = useState<SourceLayer | 'all'>('all');
  const [folder, setFolder] = useState<string>('all');
  const [q, setQ] = useState('');
  const [coverFolder, setCoverFolder] = useState<string | null>(null);
  const [pickedWork, setPickedWork] = useState<string | null>(null);

  useEffect(() => {
    if (!focusId) return;
    const w = PSYREF_LIBRARY.find((x) => x.id === focusId);
    if (w) {
      setPane('library');
      setFolder(w.folder);
      setPickedWork(w.id);
      return;
    }
    const s = PSYREF_SOURCES.find((x) => x.id === focusId);
    if (s) {
      setPane('sources');
      setLayer(s.layer);
      setMode('titres');
    }
  }, [focusId]);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return PSYREF_SOURCES.filter((s) => {
      if (layer !== 'all' && s.layer !== layer) return false;
      if (!query) return true;
      return `${s.name} ${s.role} ${s.tags.join(' ')}`.toLowerCase().includes(query);
    });
  }, [layer, q]);

  const books = useMemo(() => {
    const query = q.trim().toLowerCase();
    return PSYREF_LIBRARY.filter((w) => {
      if (folder !== 'all' && w.folder !== folder) return false;
      if (!query) return true;
      return `${w.titre} ${w.auteurs} ${w.domaine}`.toLowerCase().includes(query);
    });
  }, [folder, q]);

  return (
    <div className="space-y-5 pb-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-slate-900 text-amber-200 text-xs font-bold rounded-full">
            Référence {PSYREF_NOTES.version}
          </span>
          <span className="text-[11px] text-slate-400">snapshot {PSYREF_NOTES.dated}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">
          Référence
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl mt-2 leading-relaxed">{PSYREF_NOTES.principle}</p>
        <div className="flex gap-1 mt-4">
          <button type="button" onClick={() => setPane('library')} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${pane === 'library' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>
            Bibliothèque OER
          </button>
          <button type="button" onClick={() => setPane('sources')} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${pane === 'sources' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>
            Institutions & index
          </button>
        </div>
        <div className="mt-3">
          <ViewModeBar mode={mode} onMode={setMode} />
        </div>
      </div>

      {mode === 'coverflow' && pane === 'library' && (
        <CoverFlowCarousel
          items={
            coverFolder
              ? PSYREF_LIBRARY.filter((w) => w.folder === coverFolder).map(
                  (w): CarouselItem => ({
                    id: w.id,
                    tag: `#${w.niveauPreuve}`,
                    titleLine1: w.titre.length > 42 ? w.titre.slice(0, 40) + '…' : w.titre,
                    desc: `${w.auteurs} (${w.annee})`,
                    img: coverPsyref,
                    tone: 'linear-gradient(160deg,#334155,#0c0a09)',
                    ctaText: 'Voir la fiche'
                  })
                )
              : LIBRARY_FOLDERS.map(
                  (f, i): CarouselItem => ({
                    id: f.id,
                    tag: '#Dossier',
                    titleLine1: f.label,
                    desc: `${PSYREF_LIBRARY.filter((w) => w.folder === f.id).length} documents`,
                    img: FOLDER_ART[i % FOLDER_ART.length],
                    ctaText: 'Ouvrir'
                  })
                )
          }
          sectionLabel={coverFolder ? LIBRARY_FOLDERS.find((f) => f.id === coverFolder)?.label : 'Choisir un dossier'}
          autoplay={false}
          onBack={coverFolder ? () => setCoverFolder(null) : undefined}
          backLabel="Tous les dossiers"
          onCtaClick={(item) => {
            if (!item.id) return;
            if (!coverFolder) {
              setCoverFolder(item.id);
              setFolder(item.id);
              return;
            }
            setPickedWork(item.id);
            setFolder(coverFolder);
          }}
        />
      )}

      {mode === 'titres' && pane === 'library' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Affiche</p>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Référence</h2>
          </div>
          {LIBRARY_FOLDERS.map((f) => (
            <div key={f.id}>
              <h3 className="text-lg font-black">{f.label}</h3>
              <ul className="mt-1 space-y-0.5">
                {PSYREF_LIBRARY.filter((w) => w.folder === f.id).map((w) => (
                  <li key={w.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setPickedWork(w.id);
                        setFolder(f.id);
                      }}
                      className={`text-left text-sm py-0.5 ${pickedWork === w.id || focusId === w.id ? 'text-amber-800 font-bold' : 'text-slate-700 hover:text-amber-800'}`}
                    >
                      {w.titre}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {mode === 'graphe' && pane === 'library' && (
        <DisciplineGraph
          branches={REF_BRANCHES}
          selectedId={pickedWork}
          onSelect={(nid) => {
            const w = PSYREF_LIBRARY.find((x) => x.id === nid);
            if (w) {
              setPickedWork(w.id);
              setFolder(w.folder);
            }
          }}
          rootId="ref-root"
          rootLabel="Référence"
          caption="Graphe de la bibliothèque — dossiers et documents uniquement"
        />
      )}

      {pickedWork && pane === 'library' && PSYREF_LIBRARY.some((w) => w.id === pickedWork) && (
        <WorkFiche work={PSYREF_LIBRARY.find((w) => w.id === pickedWork)!} />
      )}

      {pane === 'library' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950 leading-relaxed flex gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            {LEGAL_RULE} Les PDF ne sont pas dans Git. Clinique = <code>information_documentaire_non_diagnostique</code>.
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Ordre de démarrage (10)</h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {DOWNLOAD_ORDER.map((id, i) => {
                const w = PSYREF_LIBRARY.find((x) => x.id === id);
                if (!w) return null;
                return (
                  <li key={id} className="text-xs text-slate-700">
                    <span className="font-black text-slate-400 mr-2">{i + 1}.</span>
                    {w.titre}
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <button type="button" onClick={() => setFolder('all')} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap border ${folder === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200'}`}>
              Tous
            </button>
            {LIBRARY_FOLDERS.map((f) => (
              <button key={f.id} type="button" onClick={() => setFolder(f.id)} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap border ${folder === f.id ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200'}`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {books.map((w) => (
              <article
                key={w.id}
                onClick={() => setPickedWork(w.id)}
                className={`rounded-2xl border p-4 space-y-2 cursor-pointer ${
                  pickedWork === w.id
                    ? 'border-amber-500 ring-2 ring-amber-200'
                    : w.legal === 'commercial-ne-pas-telecharger'
                      ? 'border-rose-200 bg-rose-50/40'
                      : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-900 text-amber-200">
                    {w.niveauPreuve} · {EVIDENCE_MARKS[w.niveauPreuve]}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">{w.licence}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{w.titre}</h3>
                <p className="text-[11px] text-slate-500">
                  {w.auteurs} ({w.annee})
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">{w.role}</p>
                {w.note && <p className="text-[11px] text-amber-800 leading-relaxed">{w.note}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">{w.folder}</span>
                  <a href={w.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600">
                    Éditeur officiel <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {pane === 'sources' && (
      <>
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
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Versionner les références</h3>
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
      </>
      )}
    </div>
  );
};
