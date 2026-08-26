import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  Brain,
  ClipboardCheck,
  FileCheck,
  GraduationCap,
  HeartPulse,
  Plus,
  Shield,
  Activity
} from 'lucide-react';
import { CoverFlowCarousel, CarouselItem } from './ui/CoverFlowCarousel';
import { ViewModeBar, SavoirsViewMode } from './savoirs/ViewModeBar';
import {
  AssessmentKind,
  CognitiveProfile,
  ProfileAssessment,
  VerificationStatus
} from '../types';
import { ASSESSMENT_KIND_META, collectAssessments } from '../data/evaluationsCatalog';
import coverLab from '../assets/images/cover-lab.jpg';
import coverIcd from '../assets/images/cover-icd.jpg';
import coverMetacog from '../assets/images/cover-metacog.jpg';
import coverPsyref from '../assets/images/cover-psyref.jpg';
import coverSrl from '../assets/images/cover-srl.jpg';
import coverAtlas from '../assets/images/cover-atlas.jpg';
import coverOutilsEval from '../assets/images/cover-outils-eval.jpg';

const KIND_ART: Record<AssessmentKind, string> = {
  diplome: coverPsyref,
  certification: coverAtlas,
  verification: coverSrl,
  evaluation: coverOutilsEval,
  test_psy: coverIcd,
  physio: coverLab,
  bci: coverMetacog
};

const KIND_ICON: Record<AssessmentKind, React.ReactNode> = {
  diplome: <GraduationCap className="w-4 h-4" />,
  certification: <Award className="w-4 h-4" />,
  verification: <FileCheck className="w-4 h-4" />,
  evaluation: <ClipboardCheck className="w-4 h-4" />,
  test_psy: <Brain className="w-4 h-4" />,
  physio: <HeartPulse className="w-4 h-4" />,
  bci: <Activity className="w-4 h-4" />
};

const KINDS = Object.keys(ASSESSMENT_KIND_META) as AssessmentKind[];

const EMPTY_FORM = {
  kind: 'verification' as AssessmentKind,
  title: '',
  issuer: '',
  year: String(new Date().getFullYear()),
  summary: ''
};

interface MesEvaluationsViewProps {
  profile: CognitiveProfile;
  onAdd?: (item: ProfileAssessment) => void;
  onSelectNodeById?: (id: string) => void;
}

export const MesEvaluationsView: React.FC<MesEvaluationsViewProps> = ({
  profile,
  onAdd,
  onSelectNodeById
}) => {
  const [mode, setMode] = useState<SavoirsViewMode>('coverflow');
  const [kind, setKind] = useState<AssessmentKind | 'tous'>('tous');
  const [coverKind, setCoverKind] = useState<AssessmentKind | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const all = useMemo(() => collectAssessments(profile), [profile]);
  const visible = useMemo(
    () => (kind === 'tous' ? all : all.filter((a) => a.kind === kind)),
    [all, kind]
  );
  const pickedItem = all.find((a) => a.id === picked) || null;
  const activeKind = coverKind || (kind !== 'tous' ? kind : null);

  const counts = useMemo(() => {
    const c = {} as Record<AssessmentKind, number>;
    KINDS.forEach((k) => {
      c[k] = all.filter((a) => a.kind === k).length;
    });
    return c;
  }, [all]);

  const coverItems: CarouselItem[] = activeKind
    ? all
        .filter((a) => a.kind === activeKind)
        .map((a) => ({
          id: a.id,
          tag: ASSESSMENT_KIND_META[a.kind].label,
          titleLine1: a.title.length > 40 ? a.title.slice(0, 38) + '…' : a.title,
          desc: `${a.issuer} · ${a.year}`,
          img: KIND_ART[a.kind],
          ctaText: 'Voir la fiche'
        }))
    : KINDS.map((k) => ({
        id: k,
        tag: '#Famille',
        titleLine1: ASSESSMENT_KIND_META[k].label,
        desc: `${counts[k]} élément${counts[k] > 1 ? 's' : ''} · ${ASSESSMENT_KIND_META[k].blurb}`,
        img: KIND_ART[k],
        ctaText: 'Ouvrir'
      }));

  const submitAdd = () => {
    if (!form.title.trim()) return;
    const item: ProfileAssessment = {
      id: `as-user-${Date.now().toString(36)}`,
      kind: form.kind,
      title: form.title.trim(),
      issuer: form.issuer.trim() || 'Déclaré',
      year: form.year,
      summary: form.summary.trim() || 'Ajouté dans Mes évaluations.',
      status: 'pending',
      clinical: form.kind === 'test_psy' || form.kind === 'bci'
    };
    onAdd?.(item);
    setPicked(item.id);
    setKind(item.kind);
    setForm(EMPTY_FORM);
    setAdding(false);
  };

  return (
    <div className="space-y-5 pb-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-teal-50 text-teal-800 text-xs font-bold rounded-full border border-teal-200">
            Mes évaluations
          </span>
          <span className="text-[11px] text-slate-400">{all.length} preuves dans le coffre</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Coffre de preuves</h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Tout ce qui documente ton parcours : diplômes, certifications, documents de vérification,
          évaluations, tests psychologiques, mesures physiologiques, BCI. Les tests et le BCI restent
          documentaires — jamais une cotation ni un diagnostic automatique.
        </p>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => {
              setKind('tous');
              setCoverKind(null);
            }}
            className={`text-[11px] px-2.5 py-1 rounded-full border font-bold ${
              kind === 'tous' ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600'
            }`}
          >
            Tous · {all.length}
          </button>
          {KINDS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setKind(k);
                setCoverKind(k);
              }}
              className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border ${
                kind === k ? 'bg-teal-700 text-white border-teal-700' : 'border-slate-200 text-slate-600'
              }`}
            >
              {KIND_ICON[k]}
              {ASSESSMENT_KIND_META[k].label}
              <span className="opacity-70">{counts[k]}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ViewModeBar mode={mode} onMode={setMode} />
          <button
            id="evaluations-add-btn"
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-700 text-white"
          >
            <Plus className="w-3.5 h-3.5" />
            Ajouter
          </button>
        </div>
      </div>

      {adding && (
        <div className="bg-white rounded-3xl border border-teal-200 p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Nouvelle preuve</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className="text-[11px] font-bold text-slate-500">
              Famille
              <select
                value={form.kind}
                onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value as AssessmentKind }))}
                className="mt-1 w-full text-sm font-medium border border-slate-200 rounded-xl px-3 py-2"
              >
                {KINDS.map((k) => (
                  <option key={k} value={k}>
                    {ASSESSMENT_KIND_META[k].label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[11px] font-bold text-slate-500">
              Année
              <input
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                className="mt-1 w-full text-sm border border-slate-200 rounded-xl px-3 py-2"
              />
            </label>
            <label className="text-[11px] font-bold text-slate-500 sm:col-span-2">
              Titre
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Ex. AIPR Encadrant, Master 2, session Tobii…"
                className="mt-1 w-full text-sm border border-slate-200 rounded-xl px-3 py-2"
              />
            </label>
            <label className="text-[11px] font-bold text-slate-500 sm:col-span-2">
              Émetteur
              <input
                value={form.issuer}
                onChange={(e) => setForm((f) => ({ ...f, issuer: e.target.value }))}
                placeholder="Université, organisme, labo…"
                className="mt-1 w-full text-sm border border-slate-200 rounded-xl px-3 py-2"
              />
            </label>
            <label className="text-[11px] font-bold text-slate-500 sm:col-span-2">
              Note
              <textarea
                value={form.summary}
                onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                rows={2}
                className="mt-1 w-full text-sm border border-slate-200 rounded-xl px-3 py-2"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={submitAdd} className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 text-white">
              Enregistrer
            </button>
            <button type="button" onClick={() => setAdding(false)} className="px-4 py-2 rounded-xl text-xs font-bold border">
              Annuler
            </button>
          </div>
        </div>
      )}

      {mode === 'coverflow' && (
        <CoverFlowCarousel
          items={coverItems}
          sectionLabel={activeKind ? ASSESSMENT_KIND_META[activeKind].label : 'Choisir une famille'}
          autoplay={false}
          onBack={activeKind ? () => setCoverKind(null) : undefined}
          backLabel="Toutes les familles"
          onCtaClick={(item) => {
            if (!item.id) return;
            if (!activeKind && KINDS.includes(item.id as AssessmentKind)) {
              setCoverKind(item.id as AssessmentKind);
              setKind(item.id as AssessmentKind);
              return;
            }
            setPicked(item.id);
          }}
        />
      )}

      {mode === 'titres' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5">
          <h2 className="text-3xl font-black tracking-tight">Mes évaluations</h2>
          {(activeKind ? [activeKind] : KINDS).map((k) => (
            <div key={k}>
              <h3 className="text-lg font-black flex items-center gap-2">
                {KIND_ICON[k]} {ASSESSMENT_KIND_META[k].label}
              </h3>
              <ul className="mt-1 space-y-0.5">
                {all
                  .filter((a) => a.kind === k)
                  .map((a) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => setPicked(a.id)}
                        className={`text-left text-sm py-0.5 ${
                          picked === a.id ? 'text-teal-800 font-bold' : 'text-slate-700 hover:text-teal-800'
                        }`}
                      >
                        {a.title} <span className="text-slate-400 font-normal">· {a.year}</span>
                      </button>
                    </li>
                  ))}
                {all.filter((a) => a.kind === k).length === 0 && (
                  <li className="text-[12px] text-slate-400">Rien encore — ajoute une preuve.</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}

      {mode === 'graphe' && (
        <div className="bg-slate-900 rounded-3xl p-6 text-slate-100 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-teal-300">Frise</p>
          <h2 className="text-xl font-black">Chronologie des preuves</h2>
          <ol className="space-y-2">
            {visible.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => setPicked(a.id)}
                  className="w-full text-left flex gap-3 items-start py-2 border-b border-white/10"
                >
                  <span className="text-[11px] font-mono text-teal-300 w-16 shrink-0">{a.year}</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 w-28 shrink-0">
                    {ASSESSMENT_KIND_META[a.kind].label}
                  </span>
                  <span className="text-sm font-semibold">{a.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}

      {pickedItem && (
        <article id="evaluations-fiche" className="rounded-3xl overflow-hidden border border-slate-800 bg-[#0f172a] text-slate-100">
          <header className="px-6 pt-6 pb-4 border-b border-white/10 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-300">
              {ASSESSMENT_KIND_META[pickedItem.kind].label}
            </p>
            <h2 className="text-xl font-extrabold">{pickedItem.title}</h2>
            <p className="text-sm text-slate-300">
              {pickedItem.issuer} · {pickedItem.year}
            </p>
            {pickedItem.documentLabel && (
              <p className="text-[11px] font-mono text-slate-400">{pickedItem.documentLabel}</p>
            )}
          </header>
          <div className="px-6 py-5 space-y-3 text-sm">
            <p className="text-slate-300 leading-relaxed">{pickedItem.summary}</p>
            {pickedItem.clinical && (
              <p className="text-[11px] text-sky-200 leading-relaxed">
                information_documentaire_non_diagnostique — jamais un diagnostic automatique. Niveau 5 jamais
                auto-déduit.
              </p>
            )}
            <p className="text-[11px] text-slate-400">
              Statut : {statusLabel(pickedItem.status)} · aucune cotation clinique dans Cognitorium.
            </p>
            {pickedItem.relatedNodeIds && pickedItem.relatedNodeIds.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {pickedItem.relatedNodeIds.map((nid) => {
                  const n = profile.nodes.find((x) => x.id === nid);
                  return (
                    <button
                      key={nid}
                      type="button"
                      onClick={() => onSelectNodeById?.(nid)}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-bold border border-white/20"
                    >
                      {n?.name || nid}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </article>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setPicked(a.id)}
            className={`text-left bg-white border rounded-2xl p-4 hover:border-teal-400 ${
              picked === a.id ? 'border-teal-500' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-teal-800 mb-1">
              {KIND_ICON[a.kind]}
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {ASSESSMENT_KIND_META[a.kind].label}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">{a.title}</h3>
            <p className="text-[11px] text-slate-500 mt-1">
              {a.issuer} · {a.year}
            </p>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950 leading-relaxed flex gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          <Shield className="w-3.5 h-3.5 inline mr-1" />
          Tests psy, physio et BCI = traces documentaires. Cognitorium n’administre pas, ne cote pas, et ne
          diagnostique pas.
        </span>
      </div>
    </div>
  );
};

function statusLabel(s?: VerificationStatus): string {
  if (s === 'verified') return 'vérifié';
  if (s === 'pending') return 'à confirmer';
  if (s === 'inferred') return 'inféré';
  if (s === 'rejected') return 'écarté';
  return 'déclaré';
}
