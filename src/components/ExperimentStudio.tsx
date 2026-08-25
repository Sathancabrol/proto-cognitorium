import React, { useMemo, useState } from 'react';
import { AlertTriangle, ExternalLink, FlaskConical } from 'lucide-react';
import { LAB_DOMAINS, LAB_EXPERIMENTS, LabExperiment, doiUrl } from '../data/experimentCatalog';
import { LAB_DEMOS } from './lab/LabDemos';

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

export const ExperimentStudio: React.FC = () => {
  const [domain, setDomain] = useState<string>('tous');
  const [id, setId] = useState(LAB_EXPERIMENTS[0].id);
  const [pane, setPane] = useState<Pane>('demo');

  const list = useMemo(
    () => LAB_EXPERIMENTS.filter((e) => domain === 'tous' || e.domaine === domain),
    [domain]
  );
  const exp = LAB_EXPERIMENTS.find((e) => e.id === id) ?? LAB_EXPERIMENTS[0];
  const Demo = LAB_DEMOS[exp.id];

  return (
    <div className="space-y-5 pb-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
          Catalogue expérimental · 12 paradigmes
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">
          Posters scientifiques
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl mt-2 leading-relaxed">
          Domaine → concept → paradigme → étude, protocole réplicable, démo, résultats, limites.
          Le biais cognitif n’est renseigné que lorsqu’il est au cœur du paradigme (Wason, Loftus, cadrage, JOL) — pas pour Stroop, Sperling ou Sternberg.
        </p>
      </div>

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

      <article className="rounded-3xl overflow-hidden border border-slate-800 bg-[#0f172a] text-slate-100 shadow-xl">
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
