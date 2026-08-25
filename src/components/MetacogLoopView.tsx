import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, NotebookPen, RefreshCw, Target } from 'lucide-react';

const STORAGE_KEY = 'cognitorium_metacog_journal_v1';

type PhaseId = 'plan' | 'monitor' | 'control' | 'evaluate';

interface JournalEntry {
  id: string;
  createdAt: string;
  goal: string;
  success: string;
  constraints: string;
  progressNote: string;
  blocked: boolean;
  adjustment: string;
  attainment: number;
  learned: string;
  nextAction: string;
}

const PHASES: { id: PhaseId; title: string; zimmerman: string; prompt: string }[] = [
  {
    id: 'plan',
    title: 'Planification',
    zimmerman: 'Forethought',
    prompt: 'Objectif, critères de succès, contraintes — avant d’explorer ou de demander à l’IA.'
  },
  {
    id: 'monitor',
    title: 'Monitoring',
    zimmerman: 'Performance',
    prompt: 'Est-ce que cette fiche / cette réponse sert encore ton objectif ?'
  },
  {
    id: 'control',
    title: 'Ajustement',
    zimmerman: 'Performance',
    prompt: 'Si tu bloques : reformuler, changer de filtre, consulter un parcours, mode guidé.'
  },
  {
    id: 'evaluate',
    title: 'Évaluation',
    zimmerman: 'Self-reflection',
    prompt: 'Objectif atteint ? Qu’as-tu appris sur tes préférences ? Quelle prochaine étape ?'
  }
];

function loadEntries(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as JournalEntry[]) : [];
  } catch {
    return [];
  }
}

export const MetacogLoopView: React.FC = () => {
  const [phase, setPhase] = useState<PhaseId>('plan');
  const [goal, setGoal] = useState('');
  const [success, setSuccess] = useState('');
  const [constraints, setConstraints] = useState('');
  const [progressNote, setProgressNote] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [adjustment, setAdjustment] = useState('');
  const [attainment, setAttainment] = useState(50);
  const [learned, setLearned] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>(loadEntries);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 20)));
    } catch {
      /* ignore quota */
    }
  }, [entries]);

  const canSave = goal.trim().length > 3 && nextAction.trim().length > 2;

  const save = () => {
    if (!canSave) return;
    const entry: JournalEntry = {
      id: `mc-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      goal: goal.trim(),
      success: success.trim(),
      constraints: constraints.trim(),
      progressNote: progressNote.trim(),
      blocked,
      adjustment: adjustment.trim(),
      attainment,
      learned: learned.trim(),
      nextAction: nextAction.trim()
    };
    setEntries((prev) => [entry, ...prev].slice(0, 20));
    setPhase('evaluate');
  };

  const resetForm = () => {
    setGoal('');
    setSuccess('');
    setConstraints('');
    setProgressNote('');
    setBlocked(false);
    setAdjustment('');
    setAttainment(50);
    setLearned('');
    setNextAction('');
    setPhase('plan');
  };

  const avgAttainment = useMemo(() => {
    if (!entries.length) return null;
    return Math.round(entries.reduce((s, e) => s + e.attainment, 0) / entries.length);
  }, [entries]);

  return (
    <div className="space-y-5 pb-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <span className="px-3 py-1 bg-violet-50 text-violet-700 text-xs font-bold rounded-full border border-violet-200">
          Zimmerman 2000 · Flavell 1979
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">
          Boucle métacognitive
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl mt-2 leading-relaxed">
          Forethought → performance → self-reflection. La régulation (monitoring, contrôle) prédit
          mieux la performance que la seule connaissance des stratégies. Ici l’IA n’écrit pas à
          ta place : tu poses l’objectif <em>avant</em>, tu juges <em>après</em>.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {PHASES.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPhase(p.id)}
            className={`text-left p-3 rounded-2xl border transition-all ${
              phase === p.id ? 'bg-violet-600 text-white border-violet-600' : 'bg-white border-slate-200 hover:border-violet-300'
            }`}
          >
            <div className={`text-[10px] font-bold uppercase tracking-wider ${phase === p.id ? 'text-violet-200' : 'text-slate-400'}`}>
              {i + 1}. {p.zimmerman}
            </div>
            <div className="text-sm font-bold mt-0.5">{p.title}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4">
          {phase === 'plan' && (
            <>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-violet-600" /> Avant d’explorer
              </h2>
              <label className="block space-y-1">
                <span className="text-[11px] font-bold text-slate-500">Quel est ton objectif ?</span>
                <textarea value={goal} onChange={(e) => setGoal(e.target.value)} rows={2} className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Comparer deux filières, comprendre les prérequis d’un métier…" />
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] font-bold text-slate-500">Critères de succès</span>
                <input value={success} onChange={(e) => setSuccess(e.target.value)} className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Identifier 3 formations, 2 compétences manquantes…" />
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] font-bold text-slate-500">Contraintes</span>
                <input value={constraints} onChange={(e) => setConstraints(e.target.value)} className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Temps, lieu, prérequis, budget…" />
              </label>
            </>
          )}

          {phase === 'monitor' && (
            <>
              <h2 className="text-sm font-bold text-slate-900">Pendant l’exploration</h2>
              <p className="text-xs text-slate-500">{PHASES[1].prompt}</p>
              <textarea value={progressNote} onChange={(e) => setProgressNote(e.target.value)} rows={4} className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Cette fiche ROME répond-elle à mon objectif ? Oui/non + pourquoi." />
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <input type="checkbox" checked={blocked} onChange={(e) => setBlocked(e.target.checked)} />
                Je suis bloqué·e ou hors sujet
              </label>
            </>
          )}

          {phase === 'control' && (
            <>
              <h2 className="text-sm font-bold text-slate-900">Ajuster la stratégie</h2>
              <div className="grid grid-cols-2 gap-2">
                {['Reformuler la question', 'Changer de filtre ROME', 'Consulter un parcours type', 'Passer en mode guidé'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setAdjustment(s)}
                    className={`text-xs font-semibold rounded-xl border px-3 py-2 ${
                      adjustment === s ? 'bg-violet-50 border-violet-400 text-violet-800' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <textarea value={adjustment} onChange={(e) => setAdjustment(e.target.value)} rows={3} className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Quelle stratégie tu choisis, et pourquoi." />
            </>
          )}

          {phase === 'evaluate' && (
            <>
              <h2 className="text-sm font-bold text-slate-900">Après la session</h2>
              <label className="block space-y-2">
                <span className="text-[11px] font-bold text-slate-500">
                  À quel point as-tu atteint ton objectif ? {attainment}%
                </span>
                <input type="range" min={0} max={100} value={attainment} onChange={(e) => setAttainment(Number(e.target.value))} className="w-full" />
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] font-bold text-slate-500">Qu’as-tu appris sur tes préférences / compétences ?</span>
                <textarea value={learned} onChange={(e) => setLearned(e.target.value)} rows={3} className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] font-bold text-slate-500">Prochaine étape concrète</span>
                <input value={nextAction} onChange={(e) => setNextAction(e.target.value)} className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Contacter un CFA, faire un stage, suivre un module…" />
              </label>
            </>
          )}

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={save}
              disabled={!canSave}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 text-white disabled:opacity-40"
            >
              Enregistrer la session
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600">
              <span className="inline-flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Nouvelle boucle</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <div className="bg-violet-50 border border-violet-100 rounded-3xl p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-violet-600">Journal</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{entries.length}</div>
            <p className="text-[11px] text-slate-600">
              sessions · atteinte moyenne {avgAttainment == null ? '—' : `${avgAttainment}%`}
            </p>
            <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
              Traces locales uniquement (navigateur). Pas de conclusion psychologique automatique.
            </p>
          </div>
          <div className="space-y-2 max-h-[28rem] overflow-y-auto">
            {entries.length === 0 && (
              <p className="text-xs text-slate-500 p-3">Aucune session encore. Complète au moins l’objectif et une prochaine étape.</p>
            )}
            {entries.map((e) => (
              <article key={e.id} className="bg-white border border-slate-200 rounded-2xl p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {new Date(e.createdAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                  <span className="text-[10px] font-bold text-violet-700">{e.attainment}%</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">{e.goal}</p>
                <p className="text-[11px] text-slate-500 flex items-start gap-1">
                  <CheckCircle2 className="w-3 h-3 mt-0.5 text-emerald-500 shrink-0" />
                  {e.nextAction}
                </p>
              </article>
            ))}
          </div>
          <div className="flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
            <NotebookPen className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            Sans support métacognitif, l’IA générative tend à réduire l’auto-régulation (études 2025).
            Cette boucle est le garde-fou : planifier avant, évaluer après.
          </div>
        </div>
      </div>
    </div>
  );
};
