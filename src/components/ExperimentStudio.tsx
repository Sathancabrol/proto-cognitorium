import React, { useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, FlaskConical } from 'lucide-react';
import { EXPERIMENTS, ExperimentDef } from '../data/psychologyAtlas';

const PosterShell: React.FC<{
  exp: ExperimentDef;
  children: React.ReactNode;
}> = ({ exp, children }) => (
  <article className="rounded-3xl overflow-hidden border border-slate-800 bg-[#0f172a] text-slate-100 shadow-xl">
    <header className="px-5 sm:px-8 pt-6 pb-4 border-b border-white/10">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">
          Atlas expérimental
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10">{exp.concept}</span>
      </div>
      <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{exp.posterTitle}</h2>
      <p className="text-sm text-slate-300 mt-2 italic">« {exp.question} »</p>
    </header>
    <div className="px-5 sm:px-8 py-5 space-y-5">{children}</div>
    <footer className="px-5 sm:px-8 py-4 bg-black/30 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 mb-1">Cognitorium</div>
        <p className="text-[11px] text-slate-300 leading-relaxed">{exp.cognitorium}</p>
      </div>
      <div className="flex gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Ce que l’expérience ne prouve pas. </strong>
          {exp.critique}
        </p>
      </div>
    </footer>
  </article>
);

const SherifPoster: React.FC = () => {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [own, setOwn] = useState(12);
  const group = [5.2, 4.8, 5.5];
  const after = [5.1, 5.0, 5.3];
  const othersAlone = [2, 11, 18];

  const dots = phase === 0 ? [own, ...othersAlone.slice(1)] : phase === 1 ? [own * 0.45 + 5, ...group] : after;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['A · Seul', 'B · Groupe', 'C · Seul après'].map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setPhase(i as 0 | 1 | 2)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold ${
              phase === i ? 'bg-amber-400 text-slate-900' : 'bg-white/10 text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-black/40 p-4 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Déplacement perçu du point lumineux</span>
          <span>0 — 20 cm</span>
        </div>
        <div className="relative h-16 rounded-xl bg-slate-950 border border-white/10">
          <div className="absolute inset-y-0 left-1/4 w-px bg-white/10" />
          {[0, 5, 10, 15, 20].map((n) => (
            <span key={n} className="absolute bottom-1 text-[9px] text-slate-500" style={{ left: `${(n / 20) * 100}%` }}>
              {n}
            </span>
          ))}
          {dots.map((v, i) => (
            <span
              key={i}
              className={`absolute top-4 w-3 h-3 rounded-full transition-all duration-700 ${
                i === 0 ? 'bg-amber-400 shadow-[0_0_12px_#fbbf24]' : 'bg-cyan-400/80'
              }`}
              style={{ left: `calc(${(Math.min(20, Math.max(0, v)) / 20) * 100}% - 6px)` }}
            />
          ))}
        </div>
        {phase === 0 && (
          <label className="block text-[11px] text-slate-400">
            Ton estimation : {own} cm
            <input type="range" min={0} max={20} value={own} onChange={(e) => setOwn(Number(e.target.value))} className="w-full mt-1" />
          </label>
        )}
        <p className="text-xs text-slate-300">
          {phase === 0 && 'Forte dispersion : le stimulus est ambigu (illusion autocinétique).'}
          {phase === 1 && 'Les jugements se resserrent vers une estimation partagée ≈ 5 cm.'}
          {phase === 2 && 'La norme collective persiste une fois seul : internalisation, pas seulement conformité publique.'}
        </p>
      </div>

      <p className="text-[11px] text-slate-400">
        Ambiguïté → incertitude → observation d’autrui → convergence → norme.
      </p>
    </div>
  );
};

const AschPoster: React.FC = () => {
  const [step, setStep] = useState<'solo' | 'group' | 'done'>('solo');
  const [choice, setChoice] = useState<'A' | 'B' | 'C' | null>(null);
  const [mode, setMode] = useState<'public' | 'private'>('public');
  const [ally, setAlly] = useState(false);

  const lines = [
    { id: 'A' as const, w: 40 },
    { id: 'B' as const, w: 56 },
    { id: 'C' as const, w: 80 }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-[11px]">
        <button type="button" onClick={() => setMode((m) => (m === 'public' ? 'private' : 'public'))} className="px-3 py-1.5 rounded-xl bg-white/10 font-bold">
          Réponse : {mode === 'public' ? 'publique' : 'privée'}
        </button>
        <button type="button" onClick={() => setAlly((a) => !a)} className="px-3 py-1.5 rounded-xl bg-white/10 font-bold">
          Allié : {ally ? 'oui' : 'non'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-black/40 p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-3">Ligne cible</div>
          <div className="h-1.5 bg-amber-300 rounded-full" style={{ width: 80 }} />
        </div>
        <div className="rounded-2xl bg-black/40 p-4 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-slate-400">Choix</div>
          {lines.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => {
                setChoice(l.id);
                setStep(step === 'solo' ? 'group' : 'done');
              }}
              className="flex items-center gap-3 w-full"
            >
              <span className="w-5 text-xs font-bold text-slate-400">{l.id}</span>
              <span className={`h-1.5 rounded-full ${choice === l.id ? 'bg-amber-300' : 'bg-slate-500'}`} style={{ width: l.w }} />
            </button>
          ))}
        </div>
      </div>

      {step !== 'solo' && (
        <div className="rounded-2xl bg-white/5 p-4 text-xs space-y-2">
          <p className="text-slate-300">
            Majorité apparente : <strong>B · B · B · B · B · B</strong>
            {ally ? ' · un allié dit C' : ''}
          </p>
          {choice && (
            <p>
              Ta réponse {mode} : <strong className={choice === 'C' ? 'text-emerald-400' : 'text-amber-300'}>{choice}</strong>
              {choice === 'C' ? ' — autonomie perceptive.' : ' — conformité à la majorité (la bonne réponse est C).'}
            </p>
          )}
          <p className="text-slate-500 text-[11px]">
            Un allié ou une réponse privée réduit fortement la conformité. Asch n’est pas Sherif : ici l’évidence est claire.
          </p>
          <button type="button" onClick={() => { setStep('solo'); setChoice(null); }} className="text-amber-300 font-bold">
            Rejouer
          </button>
        </div>
      )}
    </div>
  );
};

const RobbersPoster: React.FC = () => {
  const [stage, setStage] = useState(0);
  const stages = [
    { t: 'Formation', cohesion: 35, hostility: 15, note: 'Identité, emblème, « nous ».' },
    { t: 'Compétition', cohesion: 80, hostility: 78, note: 'Ressource limitée → rivalité, stéréotypes.' },
    { t: 'But commun', cohesion: 70, hostility: 48, note: 'Obstacle inaccessible séparément.' },
    { t: 'Coopération', cohesion: 62, hostility: 22, note: 'Interdépendance → contacts → baisse d’hostilité.' }
  ];
  const s = stages[stage];
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto">
        {stages.map((st, i) => (
          <button
            key={st.t}
            type="button"
            onClick={() => setStage(i)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap ${
              stage === i ? 'bg-orange-400 text-slate-900' : 'bg-white/10'
            }`}
          >
            {i + 1}. {st.t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Cohésion intra', v: s.cohesion, c: 'bg-cyan-400' },
          { label: 'Hostilité inter', v: s.hostility, c: 'bg-rose-400' }
        ].map((g) => (
          <div key={g.label} className="rounded-2xl bg-black/40 p-3">
            <div className="flex justify-between text-[11px] text-slate-400 mb-2">
              <span>{g.label}</span>
              <span>{g.v}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full ${g.c} transition-all duration-500`} style={{ width: `${g.v}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-300">{s.note}</p>
    </div>
  );
};

const STROOP = [
  { word: 'ROUGE', color: '#22c55e', name: 'vert', congruent: false },
  { word: 'BLEU', color: '#3b82f6', name: 'bleu', congruent: true },
  { word: 'VERT', color: '#ef4444', name: 'rouge', congruent: false },
  { word: 'JAUNE', color: '#eab308', name: 'jaune', congruent: true },
  { word: 'BLEU', color: '#eab308', name: 'jaune', congruent: false },
  { word: 'ROUGE', color: '#ef4444', name: 'rouge', congruent: true }
];

const StroopPoster: React.FC = () => {
  const [i, setI] = useState(0);
  const [t0, setT0] = useState(() => performance.now());
  const [log, setLog] = useState<{ congruent: boolean; ms: number; ok: boolean }[]>([]);
  const item = STROOP[i % STROOP.length];
  const options = ['rouge', 'bleu', 'vert', 'jaune'];

  const stats = useMemo(() => {
    const c = log.filter((x) => x.congruent);
    const n = log.filter((x) => !x.congruent);
    const avg = (arr: typeof log) => (arr.length ? Math.round(arr.reduce((s, x) => s + x.ms, 0) / arr.length) : 0);
    return { c: avg(c), n: avg(n), cost: avg(n) && avg(c) ? avg(n) - avg(c) : 0, nTrials: log.length };
  }, [log]);

  const pick = (name: string) => {
    const ms = Math.round(performance.now() - t0);
    setLog((prev) => [...prev, { congruent: item.congruent, ms, ok: name === item.name }]);
    setI((v) => v + 1);
    setT0(performance.now());
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">Nomme la <strong className="text-white">couleur de l’encre</strong>, ignore le mot.</p>
      <div className="rounded-2xl bg-black/50 py-10 text-center">
        <div className="text-4xl sm:text-5xl font-black tracking-widest" style={{ color: item.color }}>
          {item.word}
        </div>
        <div className="text-[10px] text-slate-500 mt-3">{item.congruent ? 'congruent' : 'incongruent'}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {options.map((o) => (
          <button key={o} type="button" onClick={() => pick(o)} className="py-2 rounded-xl bg-white/10 text-xs font-bold capitalize hover:bg-white/20">
            {o}
          </button>
        ))}
      </div>
      {stats.nTrials > 0 && (
        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
          <div className="rounded-xl bg-white/5 p-2">
            <div className="text-slate-400">Congruent</div>
            <div className="font-bold text-emerald-300">{stats.c} ms</div>
          </div>
          <div className="rounded-xl bg-white/5 p-2">
            <div className="text-slate-400">Incongruent</div>
            <div className="font-bold text-rose-300">{stats.n} ms</div>
          </div>
          <div className="rounded-xl bg-white/5 p-2">
            <div className="text-slate-400">Coût</div>
            <div className="font-bold text-amber-300">{stats.cost} ms</div>
          </div>
        </div>
      )}
    </div>
  );
};

const DRM_STUDY = ['lit', 'rêve', 'oreiller', 'sieste', 'couverture', 'ronflement', 'réveil', 'nuit', 'pyjama', 'fatigué'];
const DRM_TEST = [
  { w: 'oreiller', kind: 'vu' as const },
  { w: 'sommeil', kind: 'leurre' as const },
  { w: 'fenêtre', kind: 'nouveau' as const },
  { w: 'sieste', kind: 'vu' as const },
  { w: 'cuisine', kind: 'nouveau' as const },
  { w: 'rêve', kind: 'vu' as const }
];

const MemoryPoster: React.FC = () => {
  const [phase, setPhase] = useState<'study' | 'test' | 'result'>('study');
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const result = DRM_TEST.map((t) => ({
    ...t,
    saidYes: !!answers[t.w],
    correct: t.kind === 'vu' ? !!answers[t.w] : !answers[t.w]
  }));

  return (
    <div className="space-y-4">
      {phase === 'study' && (
        <>
          <p className="text-xs text-slate-400">Mémorise cette liste (paradigme DRM, simplifié).</p>
          <div className="flex flex-wrap gap-2">
            {DRM_STUDY.map((w) => (
              <span key={w} className="px-3 py-1.5 rounded-xl bg-white/10 text-sm font-semibold">
                {w}
              </span>
            ))}
          </div>
          <button type="button" onClick={() => setPhase('test')} className="px-4 py-2 rounded-xl bg-amber-400 text-slate-900 text-xs font-bold">
            Passer à la reconnaissance
          </button>
        </>
      )}
      {phase === 'test' && (
        <>
          <p className="text-xs text-slate-400">Ce mot était-il dans la liste ?</p>
          <div className="space-y-2">
            {DRM_TEST.map((t) => (
              <div key={t.w} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                <span className="text-sm font-semibold">{t.w}</span>
                <div className="flex gap-1">
                  <button type="button" onClick={() => setAnswers((a) => ({ ...a, [t.w]: true }))} className={`px-2 py-1 rounded-lg text-[11px] font-bold ${answers[t.w] === true ? 'bg-amber-400 text-slate-900' : 'bg-white/10'}`}>
                    Oui
                  </button>
                  <button type="button" onClick={() => setAnswers((a) => ({ ...a, [t.w]: false }))} className={`px-2 py-1 rounded-lg text-[11px] font-bold ${answers[t.w] === false ? 'bg-white text-slate-900' : 'bg-white/10'}`}>
                    Non
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setPhase('result')} className="px-4 py-2 rounded-xl bg-amber-400 text-slate-900 text-xs font-bold">
            Voir les sources
          </button>
        </>
      )}
      {phase === 'result' && (
        <div className="space-y-2">
          {result.map((r) => (
            <div key={r.w} className="rounded-xl bg-white/5 px-3 py-2 text-xs flex justify-between gap-2">
              <span>
                <strong>{r.w}</strong> ·{' '}
                {r.kind === 'vu' && <span className="text-cyan-300">observé</span>}
                {r.kind === 'leurre' && <span className="text-violet-300">inféré / leurre sémantique</span>}
                {r.kind === 'nouveau' && <span className="text-slate-400">nouveau</span>}
              </span>
              <span className={r.saidYes && r.kind === 'leurre' ? 'text-amber-300' : 'text-slate-400'}>
                tu as dit {r.saidYes ? 'oui' : 'non'}
              </span>
            </div>
          ))}
          <p className="text-[11px] text-slate-400">
            « Sommeil » n’était pas dans la liste. L’activer est typique : le thème a été inféré.
            Bleu = vu · violet = suggéré par le réseau sémantique · gris = nouveau.
          </p>
          <button type="button" onClick={() => { setPhase('study'); setAnswers({}); }} className="text-amber-300 text-xs font-bold">
            Recommencer
          </button>
        </div>
      )}
    </div>
  );
};

const CAL_Q = [
  { q: 'Le code ROME compte environ combien de fiches métiers ?', options: ['200', '800', '1 900', '8 000'], a: 2 },
  { q: 'Quelle phase Zimmerman précède la performance ?', options: ['Self-reflection', 'Forethought', 'Decay', 'Insight'], a: 1 },
  { q: 'Chez Asch, la tâche perceptive est…', options: ['Ambiguë', 'Claire', 'Impossible', 'Olfactive'], a: 1 },
  { q: 'Le monitoring prédit souvent la réussite mieux que…', options: ['La planification seule', 'Le feedback', 'L’inhibition', 'Le sommeil'], a: 0 },
  { q: 'Un souvenir reconstructif est…', options: ['Toujours faux', 'Une copie', 'Vulnérable à la suggestion', 'Procédural'], a: 2 }
];

const CalibrationPoster: React.FC = () => {
  const [i, setI] = useState(0);
  const [conf, setConf] = useState(60);
  const [log, setLog] = useState<{ ok: boolean; conf: number }[]>([]);
  const done = i >= CAL_Q.length;
  const item = CAL_Q[Math.min(i, CAL_Q.length - 1)];
  const acc = log.length ? Math.round((100 * log.filter((x) => x.ok).length) / log.length) : 0;
  const meanC = log.length ? Math.round(log.reduce((s, x) => s + x.conf, 0) / log.length) : 0;
  const profile = meanC - acc > 12 ? 'Surconfiance' : acc - meanC > 12 ? 'Sous-confiance' : 'Calibration proche';

  return (
    <div className="space-y-4">
      {!done ? (
        <>
          <p className="text-sm font-semibold">{item.q}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {item.options.map((o, idx) => (
              <button
                key={o}
                type="button"
                onClick={() => {
                  setLog((prev) => [...prev, { ok: idx === item.a, conf }]);
                  setI((v) => v + 1);
                  setConf(60);
                }}
                className="text-left text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2"
              >
                {o}
              </button>
            ))}
          </div>
          <label className="block text-[11px] text-slate-400">
            Confiance : {conf}%
            <input type="range" min={0} max={100} value={conf} onChange={(e) => setConf(Number(e.target.value))} className="w-full" />
          </label>
        </>
      ) : (
        <div className="space-y-3">
          <div className="rounded-2xl bg-white/5 p-4">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Carte de calibration</div>
            <div className="text-lg font-extrabold text-amber-300 mt-1">{profile}</div>
            <p className="text-xs text-slate-300 mt-1">
              Confiance moyenne {meanC}% · exactitude {acc}%
            </p>
          </div>
          <div className="relative h-40 rounded-2xl bg-black/40 border border-white/10">
            <div className="absolute inset-4 border border-dashed border-white/10">
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top right, transparent 49%, rgba(251,191,36,0.35) 50%, transparent 51%)' }} />
              {log.map((p, idx) => (
                <span
                  key={idx}
                  className={`absolute w-2.5 h-2.5 rounded-full ${p.ok ? 'bg-emerald-400' : 'bg-rose-400'}`}
                  style={{ left: `${p.conf}%`, bottom: `${p.ok ? 80 : 20}%` }}
                />
              ))}
            </div>
            <span className="absolute left-2 bottom-1 text-[9px] text-slate-500">confiance →</span>
            <span className="absolute left-1 top-2 text-[9px] text-slate-500 rotate-0">ok</span>
          </div>
          <button type="button" onClick={() => { setI(0); setLog([]); }} className="text-amber-300 text-xs font-bold">
            Recommencer
          </button>
        </div>
      )}
    </div>
  );
};

const RENDER: Record<string, React.FC> = {
  sherif: SherifPoster,
  asch: AschPoster,
  robbers: RobbersPoster,
  stroop: StroopPoster,
  memory: MemoryPoster,
  calibration: CalibrationPoster
};

export const ExperimentStudio: React.FC = () => {
  const [id, setId] = useState(EXPERIMENTS[0].id);
  const exp = EXPERIMENTS.find((e) => e.id === id) ?? EXPERIMENTS[0];
  const Body = RENDER[exp.id];

  return (
    <div className="space-y-5 pb-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
          Une expérience = une situation, un mécanisme, une question
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">
          Posters expérimentaux
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl mt-2 leading-relaxed">
          Collection navigable : question, dispositif, données, mécanisme, transfert, limite.
          Série de départ — percevoir → juger → être influencé → appartenir → apprendre → réguler.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        {EXPERIMENTS.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => setId(e.id)}
            className={`text-left p-3 rounded-2xl border transition-all ${
              id === e.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 hover:border-slate-400'
            }`}
          >
            <div className={`text-[10px] font-bold uppercase tracking-wider ${id === e.id ? 'text-amber-300' : 'text-slate-400'}`}>
              {e.title.split('—')[0]}
            </div>
            <div className="text-xs font-bold mt-0.5 leading-snug">{e.posterTitle}</div>
          </button>
        ))}
      </div>

      <PosterShell exp={exp}>
        {Body ? <Body /> : null}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Protocole</div>
            <ol className="space-y-1">
              {exp.protocol.map((p) => (
                <li key={p} className="text-[11px] text-slate-300 flex gap-1.5">
                  <ArrowRight className="w-3 h-3 mt-0.5 text-amber-400 shrink-0" />
                  {p}
                </li>
              ))}
            </ol>
          </div>
          <div className="sm:col-span-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Transfert contemporain</div>
            <ul className="flex flex-wrap gap-1.5">
              {exp.transfer.map((t) => (
                <li key={t} className="text-[11px] px-2 py-1 rounded-lg bg-white/10 text-slate-200">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PosterShell>

      <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
        <FlaskConical className="w-3.5 h-3.5" />
        Médiation scientifique, pas réplication de laboratoire. Les mini-tâches illustrent un mécanisme.
      </p>
    </div>
  );
};
