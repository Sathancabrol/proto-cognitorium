import React, { useMemo, useRef, useState } from 'react';
import { AlertTriangle, ExternalLink, FlaskConical } from 'lucide-react';
import { LAB_DOMAINS, LAB_EXPERIMENTS, LabExperiment, doiUrl } from '../data/experimentCatalog';
import { LAB_DEMOS } from './lab/LabDemos';
import { CoverFlowCarousel, CarouselItem } from './ui/CoverFlowCarousel';
import { ViewModeBar, SavoirsViewMode } from './savoirs/ViewModeBar';
import { DisciplineGraph } from './atlas/DisciplineGraph';
import { PsyBranch } from '../data/psychologyAtlas';
import { NodeRelated } from './savoirs/NodeRelated';
import { relatedForPoster } from '../data/savoirsLinks';
import posterStroop from '../assets/images/poster-stroop.jpg';
import posterGorilla from '../assets/images/poster-gorilla.jpg';
import posterChange from '../assets/images/poster-change.jpg';
import posterSperling from '../assets/images/poster-sperling.jpg';
import posterSternberg from '../assets/images/poster-sternberg.jpg';
import posterSerial from '../assets/images/poster-serial.jpg';
import posterLoftus from '../assets/images/poster-loftus.jpg';
import posterRotation from '../assets/images/poster-rotation.jpg';
import posterWason from '../assets/images/poster-wason.jpg';
import posterFrame from '../assets/images/poster-frame.jpg';
import coverMetacog from '../assets/images/cover-metacog.jpg';

const POSTER_ART: Record<string, string> = {
  'COG-ATT-STROOP-001': posterStroop,
  'COG-ATT-GORILLA-002': posterGorilla,
  'COG-ATT-CHANGE-003': posterChange,
  'COG-MEM-SPERLING-004': posterSperling,
  'COG-MEM-STERNBERG-005': posterSternberg,
  'COG-MEM-SERIAL-006': posterSerial,
  'COG-MEM-LOFTUS-007': posterLoftus,
  'COG-SPA-ROTATION-008': posterRotation,
  'COG-REA-WASON-009': posterWason,
  'COG-DEC-FRAME-010': posterFrame,
  'COG-META-JOL-011': coverMetacog,
  'COG-WM-NBACK-012': posterSternberg,
  'COG-TIME-BISECT-013': posterSperling,
  'COG-TIME-REPRO-014': posterSerial,
  'COG-TIME-TOJ-015': posterChange
};

const DOMAIN_TONE: Record<string, string> = {
  'Attention et fonctions exécutives': 'linear-gradient(160deg,#1d4ed8,#0f172a)',
  'Attention sélective': 'linear-gradient(160deg,#0369a1,#0f172a)',
  'Perception et attention visuelle': 'linear-gradient(160deg,#0f766e,#0f172a)',
  'Mémoire sensorielle': 'linear-gradient(160deg,#6d28d9,#0f172a)',
  'Mémoire de travail': 'linear-gradient(160deg,#4338ca,#0f172a)',
  'Mémoire épisodique': 'linear-gradient(160deg,#7c3aed,#0f172a)',
  'Mémoire reconstructive': 'linear-gradient(160deg,#be123c,#0f172a)',
  'Cognition spatiale': 'linear-gradient(160deg,#047857,#0f172a)',
  'Raisonnement': 'linear-gradient(160deg,#b45309,#0f172a)',
  'Jugement et décision': 'linear-gradient(160deg,#c2410c,#0f172a)',
  'Métacognition': 'linear-gradient(160deg,#6d28d9,#0f172a)',
  'Mémoire de travail et attention': 'linear-gradient(160deg,#1e3a8a,#0f172a)',
  'Timing et perception du temps': 'linear-gradient(160deg,#0e7490,#0f172a)'
};

function splitTitle(label: string): { titleLine1: string; titleLine2?: string } {
  if (label.length <= 28) return { titleLine1: label };
  const cut = label.lastIndexOf(' ', 22);
  if (cut < 8) return { titleLine1: label };
  return { titleLine1: label.slice(0, cut), titleLine2: label.slice(cut + 1) };
}

type Pane = 'demo' | 'protocole' | 'resultats';

const CARTOUCHE = [
  { k: 'Type d’objet', v: 'Démonstration inspirée d’un paradigme validé — pas une réplication stricte.' },
  { k: 'Ce qui est mesuré', v: 'Un comportement dans une tâche définie, non une capacité globale ni un diagnostic.' },
  { k: 'Comparaison', v: 'Les effets se lisent entre conditions, pas à partir d’un score isolé.' },
  { k: 'Limites', v: 'Échantillon, environnement numérique, familiarité, matériel, fatigue, ordre, attention.' }
];

const STATUS: Record<string, string> = {
  demo: 'Démo navigateur',
  adaptation: 'Adaptation pédagogique',
  specific: 'Construction spécifique'
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1">
    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
    <div className="text-xs text-slate-200 leading-relaxed">{children}</div>
  </div>
);

const ProtocolPane: React.FC<{ exp: LabExperiment }> = ({ exp }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Field label="Hypothèse générale">{exp.hypotheseGenerale}</Field>
    <Field label="Hypothèse expérimentale">{exp.hypotheseExperimentale}</Field>
    <Field label="Plan">
      {exp.plan.type.replace('_', '-')} · randomisation : {exp.plan.randomisation} · {exp.plan.contrebalancement}
    </Field>
    <Field label="Biais cognitif">{exp.biaisCognitif ?? 'Non applicable — mécanisme / limite de traitement, pas un biais décisionnel.'}</Field>
    <Field label="VI">
      {exp.variablesIndependantes.map((v) => (
        <div key={v.nom}>
          <strong>{v.nom}</strong> : {v.modalites.join(' · ')}
        </div>
      ))}
    </Field>
    <Field label="VD">
      {exp.variablesDependantes.map((v) => (
        <div key={v.nom}>
          <strong>{v.nom}</strong> : {v.modalites.join(' · ')}
        </div>
      ))}
    </Field>
    <Field label="Méthode">
      <p>{exp.methode.participants}</p>
      <p className="text-slate-400 mt-1">{exp.methode.materiel}</p>
      <p className="mt-1">{exp.methode.procedure}</p>
    </Field>
    <Field label="Modèle fonctionnel">
      {STATUS[exp.modele.statut]} · {exp.modele.niveauDeFidelite}
      {exp.modele.demoUrl && (
        <a href={exp.modele.demoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-amber-300 mt-1">
          PsyToolkit <ExternalLink className="w-3 h-3" />
        </a>
      )}
      <p className="text-slate-500 mt-1">{exp.modele.avertissement}</p>
    </Field>
  </div>
);

const ResultsPane: React.FC<{ exp: LabExperiment }> = ({ exp }) => {
  const href = exp.reference.url || doiUrl(exp.reference.doi);
  return (
    <div className="space-y-4">
      <Field label="Résultats attendus / classiques">{exp.resultatsAttendus}</Field>
      <Field label="Discussion">{exp.discussion}</Field>
      <Field label="Conclusion">{exp.conclusion}</Field>
      <Field label="Référence">
        {exp.reference.authors} ({exp.reference.year}). {exp.reference.title}. <em>{exp.reference.venue}</em>
        {exp.reference.doi && <span className="block text-slate-400 mt-1">DOI {exp.reference.doi}</span>}
        {href && (
          <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-amber-300 mt-1">
            Ouvrir <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </Field>
      <Field label="Transfert Cognitorium / UI">
        <ul className="flex flex-wrap gap-1.5">
          {exp.transfert.map((t) => (
            <li key={t} className="px-2 py-1 rounded-lg bg-white/10">
              {t}
            </li>
          ))}
        </ul>
      </Field>
    </div>
  );
};

const PosterCoverFlow: React.FC<{
  selectedId: string;
  onPick: (id: string) => void;
}> = ({ selectedId, onPick }) => {
  const [domain, setDomain] = useState<string | null>(null);

  const domainCards: CarouselItem[] = LAB_DOMAINS.map((d) => {
    const exps = LAB_EXPERIMENTS.filter((e) => e.domaine === d);
    const first = exps[0];
    const titles = splitTitle(d);
    return {
      id: d,
      tag: `#Domaine · ${exps.length}`,
      ...titles,
      desc: exps.map((e) => e.paradigme.split(' / ')[0]).join(' · '),
      img: first ? POSTER_ART[first.id] : undefined,
      tone: DOMAIN_TONE[d],
      ctaText: 'Voir les posters'
    };
  });

  const expCards: CarouselItem[] = LAB_EXPERIMENTS.filter((e) => e.domaine === domain).map((e) => {
    const titles = splitTitle(e.paradigme);
    return {
      id: e.id,
      tag: selectedId === e.id ? '#Ouvert' : '#Poster',
      ...titles,
      desc: e.posterTitle,
      img: POSTER_ART[e.id],
      tone: DOMAIN_TONE[e.domaine],
      ctaText: 'Voir la fiche'
    };
  });

  const crumbs = (
    <nav className="flex flex-wrap items-center gap-1">
      <button
        type="button"
        onClick={() => setDomain(null)}
        style={{
          padding: '6px 10px',
          borderRadius: 9999,
          border: domain ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(197,168,128,0.55)',
          background: domain ? 'rgba(0,0,0,0.45)' : 'rgba(197,168,128,0.18)',
          color: '#f3f0ea',
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          cursor: domain ? 'pointer' : 'default'
        }}
      >
        Posters
      </button>
      {domain && (
        <>
          <span style={{ color: 'rgba(197,168,128,0.55)', fontSize: 11 }}>/</span>
          <span
            style={{
              padding: '6px 10px',
              borderRadius: 9999,
              border: '1px solid rgba(197,168,128,0.55)',
              background: 'rgba(197,168,128,0.18)',
              color: '#f3f0ea',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              maxWidth: 220,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {domain}
          </span>
        </>
      )}
    </nav>
  );

  return (
    <CoverFlowCarousel
      items={domain ? expCards : domainCards}
      sectionLabel={domain || 'Choisir un domaine'}
      autoplay={false}
      onBack={domain ? () => setDomain(null) : undefined}
      backLabel="Tous les domaines"
      header={crumbs}
      onCtaClick={(item) => {
        if (!item.id) return;
        if (!domain) {
          setDomain(item.id);
          return;
        }
        onPick(item.id);
      }}
    />
  );
};

const PosterTitles: React.FC<{ selectedId: string; onPick: (id: string) => void }> = ({ selectedId, onPick }) => (
  <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5">
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Affiche</p>
      <h2 className="text-3xl font-black tracking-tight text-slate-900">Posters</h2>
    </div>
    {LAB_DOMAINS.map((d) => (
      <div key={d}>
        <h3 className="text-lg font-black tracking-tight">{d}</h3>
        <ul className="mt-1">
          {LAB_EXPERIMENTS.filter((e) => e.domaine === d).map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => onPick(e.id)}
                className={`text-left py-1 text-sm ${selectedId === e.id ? 'text-amber-700 font-bold' : 'text-slate-700 hover:text-amber-700'}`}
              >
                {e.paradigme}
                <span className="text-slate-400 font-normal"> — {e.posterTitle}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

export const ExperimentStudio: React.FC<{
  focusId?: string | null;
  onOpenRef?: (id: string) => void;
}> = ({ focusId, onOpenRef }) => {
  const [mode, setMode] = useState<SavoirsViewMode>('coverflow');
  const [domain, setDomain] = useState<string>('tous');
  const [id, setId] = useState(LAB_EXPERIMENTS[0].id);
  const [pane, setPane] = useState<Pane>('demo');
  const ficheRef = useRef<HTMLElement | null>(null);

  const list = useMemo(
    () => LAB_EXPERIMENTS.filter((e) => domain === 'tous' || e.domaine === domain),
    [domain]
  );
  const exp = LAB_EXPERIMENTS.find((e) => e.id === id) ?? LAB_EXPERIMENTS[0];
  const Demo = LAB_DEMOS[exp.id];

  const openFiche = (expId: string) => {
    setId(expId);
    const hit = LAB_EXPERIMENTS.find((e) => e.id === expId);
    if (hit) setDomain(hit.domaine);
    setPane('demo');
    requestAnimationFrame(() => ficheRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  React.useEffect(() => {
    if (focusId) openFiche(focusId);
  }, [focusId]);

  const posterBranches: PsyBranch[] = useMemo(
    () =>
      LAB_DOMAINS.map((d, i) => ({
    id: `dom-${i}`,
    title: d,
    object: `Paradigmes du domaine « ${d} ».`,
    color: 'amber',
    accent: 'from-amber-500 to-orange-600',
    trees: [
      {
        title: 'Paradigmes',
        children: LAB_EXPERIMENTS.filter((e) => e.domaine === d).map((e) => ({
          id: e.id,
          label: e.paradigme
        }))
      }
    ]
  })),
    []
  );

  return (
    <div className="space-y-5 pb-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
          Catalogue expérimental · 15 paradigmes
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">
          Posters scientifiques
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl mt-2 leading-relaxed">
          Mêmes affichages que l’arborescence, mais seulement le catalogue expérimental — pas le graphe disciplinaire complet.
        </p>
        <div className="mt-4">
          <ViewModeBar mode={mode} onMode={setMode} />
        </div>
      </div>

      {mode === 'coverflow' && <PosterCoverFlow selectedId={id} onPick={openFiche} />}
      {mode === 'titres' && <PosterTitles selectedId={id} onPick={openFiche} />}
      {mode === 'graphe' && (
        <DisciplineGraph
          branches={posterBranches}
          selectedId={id}
          onSelect={(nid) => {
            if (LAB_EXPERIMENTS.some((e) => e.id === nid)) openFiche(nid);
          }}
          onOpenRef={onOpenRef}
          rootId="posters-root"
          rootLabel="Posters"
          caption="Graphe des posters — domaines et paradigmes uniquement"
          relatedFor={(nid) => {
            const hit = LAB_EXPERIMENTS.find((e) => e.id === nid);
            return hit ? relatedForPoster(hit) : { posters: [], works: [], sources: [], citations: [] };
          }}
        />
      )}

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setDomain('tous')}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap border ${
            domain === 'tous' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200'
          }`}
        >
          Tous
        </button>
        {LAB_DOMAINS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDomain(d)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap border ${
              domain === d ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-[11px]">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-3 py-2 font-bold">ID</th>
              <th className="px-3 py-2 font-bold">Paradigme</th>
              <th className="px-3 py-2 font-bold">Biais</th>
              <th className="px-3 py-2 font-bold">VI</th>
              <th className="px-3 py-2 font-bold">VD</th>
              <th className="px-3 py-2 font-bold">Réf.</th>
              <th className="px-3 py-2 font-bold">Modèle</th>
            </tr>
          </thead>
          <tbody>
            {list.map((e) => (
              <tr
                key={e.id}
                onClick={() => setId(e.id)}
                className={`cursor-pointer border-t border-slate-100 ${e.id === id ? 'bg-amber-50' : 'hover:bg-slate-50'}`}
              >
                <td className="px-3 py-2 font-mono text-[10px] text-slate-500">{e.id.split('-').slice(-2).join('-')}</td>
                <td className="px-3 py-2 font-semibold text-slate-800">{e.paradigme}</td>
                <td className="px-3 py-2 text-slate-600">{e.biaisCognitif ? e.biaisCognitif.split(';')[0] : '—'}</td>
                <td className="px-3 py-2 text-slate-600">{e.variablesIndependantes.map((v) => v.nom).join(', ')}</td>
                <td className="px-3 py-2 text-slate-600">{e.variablesDependantes.map((v) => v.nom).join(', ')}</td>
                <td className="px-3 py-2 text-slate-600">
                  {e.reference.authors.split(',')[0]} {e.reference.year}
                </td>
                <td className="px-3 py-2">{STATUS[e.modele.statut]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <article
        ref={ficheRef}
        className="rounded-3xl overflow-hidden border border-slate-800 bg-[#0f172a] text-slate-100 shadow-xl"
      >
        <header className="px-5 sm:px-8 pt-6 pb-4 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">{exp.id}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10">{exp.domaine}</span>
            {exp.concepts.slice(0, 3).map((c) => (
              <span key={c} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300">
                {c}
              </span>
            ))}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{exp.posterTitle}</h2>
          <p className="text-sm text-slate-300 mt-2">{exp.paradigme}</p>
          <div className="mt-3">
            <NodeRelated related={relatedForPoster(exp)} onOpenRef={onOpenRef} tone="dark" />
          </div>
        </header>

        <div className="px-5 sm:px-8 py-3 border-b border-white/10 flex gap-1">
          {(['demo', 'protocole', 'resultats'] as Pane[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPane(p)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold capitalize ${
                pane === p ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              {p === 'demo' ? 'Démo' : p === 'protocole' ? 'Protocole' : 'Résultats'}
            </button>
          ))}
        </div>

        <div className="px-5 sm:px-8 py-5 min-h-[16rem]">
          {pane === 'demo' && Demo && <Demo />}
          {pane === 'protocole' && <ProtocolPane exp={exp} />}
          {pane === 'resultats' && <ResultsPane exp={exp} />}
        </div>

        <footer className="px-5 sm:px-8 py-4 bg-black/40 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5" />
            Cartouche de rigueur
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CARTOUCHE.map((c) => (
              <p key={c.k} className="text-[11px] text-slate-400 leading-relaxed">
                <strong className="text-slate-200">{c.k}. </strong>
                {c.v}
              </p>
            ))}
          </div>
        </footer>
      </article>

      <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
        <FlaskConical className="w-3.5 h-3.5" />
        Entités : Experiment · Reference · FunctionalModel. Une démo navigateur n’est pas une réplication du protocole original.
      </p>
    </div>
  );
};
