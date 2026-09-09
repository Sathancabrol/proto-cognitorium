import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Brain, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  RotateCcw, 
  Save, 
  Info, 
  TrendingUp,
  TrendingDown, 
  Compass,
  History,
  Calendar
} from 'lucide-react';
import { CognitiveProfile, CognitiveBiasAssessment } from '../types';
import { COGNITIVE_BIASES_CATALOG, calculateLucidityScore } from '../data/cognitiveBiasesData';

interface CognitiveBiasesViewProps {
  profile: CognitiveProfile;
  onSaveAssessment: (assessment: CognitiveBiasAssessment) => void;
}

export const CognitiveBiasesView: React.FC<CognitiveBiasesViewProps> = ({
  profile,
  onSaveAssessment
}) => {
  // Initialiser les scores depuis le profil ou le catalogue
  const initialScores: Record<string, number> = profile.biasAssessment?.scores || 
    COGNITIVE_BIASES_CATALOG.reduce((acc, b) => ({ ...acc, [b.id]: b.score }), {});

  const [scores, setScores] = useState<Record<string, number>>(initialScores);
  const [selectedBiasId, setSelectedBiasId] = useState<string>(COGNITIVE_BIASES_CATALOG[0].id);
  const [hasSaved, setHasSaved] = useState(false);

  const { averageScore, lucidityIndex, highBiases } = calculateLucidityScore(scores);
  const currentBias = COGNITIVE_BIASES_CATALOG.find((b) => b.id === selectedBiasId) || COGNITIVE_BIASES_CATALOG[0];

  // Évaluation précédente si existante dans l'historique ou le profil
  const previousAssessment = useMemo(() => {
    if (profile.biasAssessmentHistory && profile.biasAssessmentHistory.length > 0) {
      return profile.biasAssessmentHistory[profile.biasAssessmentHistory.length - 1];
    }
    return profile.biasAssessment || null;
  }, [profile.biasAssessmentHistory, profile.biasAssessment]);

  // Delta de lucidité
  const lucidityDelta = previousAssessment 
    ? lucidityIndex - previousAssessment.lucidityIndex 
    : 0;

  const handleScoreChange = (biasId: string, val: number) => {
    setScores((prev) => ({ ...prev, [biasId]: val }));
    setHasSaved(false);
  };

  const handleSave = () => {
    const assessment: CognitiveBiasAssessment = {
      completedAt: new Date().toISOString(),
      lucidityIndex,
      averageScore,
      scores,
      highBiases
    };
    onSaveAssessment(assessment);
    setHasSaved(true);
    setTimeout(() => setHasSaved(false), 3000);
  };

  const handleResetToDefault = () => {
    const defaults = COGNITIVE_BIASES_CATALOG.reduce((acc, b) => ({ ...acc, [b.id]: b.score }), {});
    setScores(defaults);
    setHasSaved(false);
  };

  // Compétences auto-déclarées sans preuve pour croisement
  const unverifiedSkills = useMemo(() => {
    return (profile.nodes || []).filter(
      (n) => n.category.startsWith('skill_') && n.verificationStatus !== 'verified'
    );
  }, [profile.nodes]);

  // Tracé du polygone Radar SVG (10 branches)
  const size = 320;
  const center = size / 2;
  const radius = center - 45;
  const total = COGNITIVE_BIASES_CATALOG.length;

  // Points actuels
  const currentPoints = COGNITIVE_BIASES_CATALOG.map((b, i) => {
    const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
    const scoreVal = scores[b.id] || 4;
    const r = (scoreVal / 7) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  // Points de l'évaluation passée (si disponible)
  const previousPoints = useMemo(() => {
    if (!previousAssessment || !previousAssessment.scores) return null;
    return COGNITIVE_BIASES_CATALOG.map((b, i) => {
      const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
      const scoreVal = previousAssessment.scores[b.id] || 4;
      const r = (scoreVal / 7) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  }, [previousAssessment, total, radius, center]);

  const gridLevels = [1, 3, 5, 7];

  return (
    <div id="cognitive-biases-view" className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-50 border border-violet-200/60 text-violet-700 text-xs font-semibold">
            <Brain className="w-3.5 h-3.5" />
            <span>Métacognition & Lucidité Décisionnelle</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Évaluation des 10 Biais Cognitifs & Historique
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Auto-évaluation sur échelle de Likert (1 à 7). Identifiez vos vulnérabilités aux heuristiques trompeuses, comparez votre historique temporel et activez des contre-mesures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToDefault}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors text-xs font-medium flex items-center gap-1.5 shadow-xs"
            title="Réinitialiser aux valeurs médianes"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Médian</span>
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 ${
              hasSaved
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-500/25'
            }`}
          >
            {hasSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{hasSaved ? 'Enregistré dans le profil !' : 'Enregistrer ce bilan'}</span>
          </button>
        </div>
      </div>

      {/* Synthèse : Indice de lucidité & Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar SVG */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Compass className="w-4 h-4 text-violet-600" />
              <span>Radar des 10 Biais</span>
            </h2>
            <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-violet-600" />
                Actuel
              </span>
              {previousPoints && (
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  Précédent
                </span>
              )}
            </div>
          </div>

          <div className="relative my-2">
            <svg width={size} height={size} className="overflow-visible">
              {/* Cercles de niveau */}
              {gridLevels.map((lvl) => {
                const r = (lvl / 7) * radius;
                return (
                  <circle
                    key={lvl}
                    cx={center}
                    cy={center}
                    r={r}
                    fill="none"
                    stroke="#E2E8F0"
                    strokeDasharray={lvl === 5 ? '4 3' : undefined}
                    strokeWidth={lvl === 5 ? 1.5 : 1}
                  />
                );
              })}

              {/* Rayons pour chaque biais */}
              {COGNITIVE_BIASES_CATALOG.map((b, i) => {
                const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);
                const isSelected = b.id === selectedBiasId;
                const isHigh = (scores[b.id] || 4) >= 5;

                return (
                  <g key={b.id}>
                    <line
                      x1={center}
                      y1={center}
                      x2={x}
                      y2={y}
                      stroke={isSelected ? '#8B5CF6' : '#E2E8F0'}
                      strokeWidth={isSelected ? 2 : 1}
                    />
                    {/* Label du code court */}
                    <text
                      x={center + (radius + 18) * Math.cos(angle)}
                      y={center + (radius + 18) * Math.sin(angle)}
                      fontSize="9"
                      fontWeight={isSelected ? 'bold' : '600'}
                      fill={isHigh ? '#EF4444' : isSelected ? '#7C3AED' : '#64748B'}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="cursor-pointer select-none"
                      onClick={() => setSelectedBiasId(b.id)}
                    >
                      {b.shortCode}
                    </text>
                  </g>
                );
              })}

              {/* Polygone de l'évaluation précédente (si existante) */}
              {previousPoints && (
                <polygon
                  points={previousPoints}
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
              )}

              {/* Polygone des scores actuels */}
              <polygon
                points={currentPoints}
                fill="rgba(139, 92, 246, 0.25)"
                stroke="#8B5CF6"
                strokeWidth="2.5"
                className="transition-all duration-300"
              />

              {/* Points cliquables */}
              {COGNITIVE_BIASES_CATALOG.map((b, i) => {
                const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
                const scoreVal = scores[b.id] || 4;
                const r = (scoreVal / 7) * radius;
                const x = center + r * Math.cos(angle);
                const y = center + r * Math.sin(angle);
                const isHigh = scoreVal >= 5;
                const isSelected = b.id === selectedBiasId;

                return (
                  <circle
                    key={`point-${b.id}`}
                    cx={x}
                    cy={y}
                    r={isSelected ? 6 : isHigh ? 5 : 4}
                    fill={isHigh ? '#EF4444' : '#8B5CF6'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="cursor-pointer hover:scale-125 transition-transform"
                    onClick={() => setSelectedBiasId(b.id)}
                  />
                );
              })}
            </svg>
          </div>

          <div className="w-full flex items-center justify-around text-xs pt-2 border-t border-slate-100 text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>1-3 : Maîtrisé</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>4 : Médian</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>5-7 : Vulnérabilité</span>
            </div>
          </div>
        </div>

        {/* Lucidité & Alertes */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 p-4 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600">
                  Indice de Lucidité
                </span>
                {lucidityDelta !== 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                    lucidityDelta > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {lucidityDelta > 0 ? `+${lucidityDelta}%` : `${lucidityDelta}%`}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-violet-950">{lucidityIndex}%</span>
                <span className="text-xs text-violet-600 font-semibold">
                  {lucidityIndex >= 70 ? 'Très élevée' : lucidityIndex >= 50 ? 'Modérée' : 'À renforcer'}
                </span>
              </div>
              <div className="w-full bg-violet-200/60 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-violet-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${lucidityIndex}%` }}
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Vulnérabilité Moyenne
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-black text-slate-800">{averageScore}</span>
                <span className="text-xs text-slate-400">/ 7</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Seuil critique : 5.0
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Biais saillants (&gt; 5)
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className={`text-3xl font-black ${highBiases.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {highBiases.length}
                </span>
                <span className="text-xs text-slate-400">sur 10</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                {highBiases.length === 0 ? 'Aucune zone rouge' : `${highBiases.length} vigilance(s)`}
              </p>
            </div>
          </div>

          {/* Fiche détaillée du biais sélectionné */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold">
                    {currentBias.shortCode}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {currentBias.name}
                  </h3>
                  {(scores[currentBias.id] || 4) >= 5 && (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Vulnérabilité active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {currentBias.definition}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-2xl font-black text-violet-700">
                  {scores[currentBias.id] || 4}
                </span>
                <span className="text-xs text-slate-400 font-bold block">sur 7</span>
              </div>
            </div>

            {/* Curseur de notation */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                {currentBias.question}
              </label>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold text-slate-400">1 (Faible)</span>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={scores[currentBias.id] || 4}
                  onChange={(e) => handleScoreChange(currentBias.id, parseInt(e.target.value, 10))}
                  className="flex-1 accent-violet-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] font-semibold text-slate-400">7 (Fort)</span>
              </div>

              <div className="flex justify-between px-1 text-[10px] font-mono text-slate-400">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
              </div>
            </div>

            {/* Encadré remédiation */}
            <div className="p-3.5 bg-violet-50/70 border border-violet-100 rounded-2xl flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-violet-900 block">
                  Piste de remédiation & Posture recommandée :
                </span>
                <p className="text-xs text-violet-800 leading-relaxed">
                  {currentBias.remediationAdvice}
                </p>
              </div>
            </div>

            {/* Recommandation croisée si vulnérabilité Dunning-Kruger / Confirmation et compétences non vérifiées */}
            {(currentBias.id === 'dunning_kruger' || currentBias.id === 'confirmation') && 
             (scores[currentBias.id] || 4) >= 5 && 
             unverifiedSkills.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Croisement métacognitif :</strong> Vous avez {unverifiedSkills.length} compétence(s) auto-déclarée(s) sans preuve certifiée (ex: <em>{unverifiedSkills[0]?.name}</em>). Pour neutraliser ce biais, envisagez de soumettre une preuve de mission dans le <em>Centre de Validation</em>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
