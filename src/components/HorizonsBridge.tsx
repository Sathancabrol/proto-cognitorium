import React, { useState, useMemo, useCallback } from 'react';
import { HorizonJobNode, AnyCognitiveNode, CognitiveProfile, ComplexityMode } from '../types';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  AlertCircle, 
  Plus, 
  Layers, 
  Loader2, 
  Search, 
  GraduationCap, 
  ShieldCheck, 
  ExternalLink,
  Target,
  Database,
  XCircle,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { computeAllRomeMatches, computeFicheMatch, searchRomeFiches, getCompatibilityInfo, RomeMatchResult } from '../utils/romeMatching';
import { getEpistemicLevel } from '../utils/epistemics';
import { ROME_FICHES } from '../data/romeData';

const ROME_FICHES_BY_CODE = new Map(ROME_FICHES.map((f) => [f.code, f]));

interface HorizonsBridgeProps {
  nodes: AnyCognitiveNode[];
  profile: CognitiveProfile;
  complexityMode: ComplexityMode;
  onSelectNode: (node: AnyCognitiveNode) => void;
  onAddHorizon: (horizon: HorizonJobNode) => void;
}

export const HorizonsBridge: React.FC<HorizonsBridgeProps> = ({
  nodes,
  profile,
  complexityMode,
  onSelectNode,
  onAddHorizon
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');

  const horizonJobs = nodes.filter((n) => n.category === 'horizon_job') as HorizonJobNode[];
  const skills = nodes.filter((n) => n.category.startsWith('skill_'));
  const capacities = nodes.filter((n) => n.category === 'capacity_cognitive');

  // Domains list
  const domains = Array.from(new Set(horizonJobs.map((j) => j.domain).filter(Boolean)));

  const filteredJobs = horizonJobs.filter((job) => {
    if (selectedDomain !== 'all' && job.domain !== selectedDomain) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = job.name.toLowerCase().includes(q);
      const matchRome = job.romeCode?.toLowerCase().includes(q) ?? false;
      const matchDesc = job.description?.toLowerCase().includes(q) ?? false;
      return matchName || matchRome || matchDesc;
    }
    return true;
  });

  // ---------------------------------------------------------------------------
  // MOTEUR ROME RÉEL : recherche + calcul de match à la volée contre le profil
  // ---------------------------------------------------------------------------
  const topRomeMatches = useMemo<RomeMatchResult[]>(() => {
    return computeAllRomeMatches(profile, 8);
  }, [profile]);

  const searchedRomeMatches = useMemo<RomeMatchResult[]>(() => {
    if (!searchQuery.trim()) return [];
    const fiches = searchRomeFiches(searchQuery, 24);
    return fiches
      .map((fiche) => computeFicheMatch(profile, fiche))
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }, [searchQuery, profile]);

  const romeResults = searchQuery.trim() ? searchedRomeMatches : topRomeMatches;

  const handleAddFromRome = useCallback((match: RomeMatchResult) => {
    const info = getCompatibilityInfo(match.label);
    const horizon: HorizonJobNode = {
      id: `rome-${match.fiche.code}-${Date.now().toString(36)}`,
      name: match.fiche.libelle,
      category: 'horizon_job',
      domain: match.fiche.grandDomaine,
      romeCode: match.fiche.code,
      romeTitle: match.fiche.libelle,
      matchScore: match.score,
      compatibilityLevel: info.short as HorizonJobNode['compatibilityLevel'],
      rationale: `Indice de proximité ${match.score}/100 calculé par le moteur ROME (référentiel France Travail, juin 2026). ${info.description}`,
      matchingSkills: match.matchedSkills.map((m) => m.name),
      missingSkills: match.missingSkills.slice(0, 5).map((name) => ({
        name,
        importance: 'recommandée' as const,
        learningBridge: match.formations[0]?.libelle
          ? `Formation FORMACODE suggérée : ${match.formations[0].libelle}`
          : 'Formation à identifier auprès de France Travail / OPCO.'
      })),
      unlockedOpportunities: [],
      verificationStatus: 'pending',
      inferenceType: 'inference_a_valider',
      confidenceScore: Math.max(40, Math.min(95, Math.round(match.score * 0.9))),
      explainabilityFactors: {
        strengthPoints: [
          `${match.matchedSkillCount} compétence${match.matchedSkillCount > 1 ? 's' : ''} du profil mobilisée${match.matchedSkillCount > 1 ? 's' : ''} par cette fiche ROME`,
          ...(match.experiences.length > 0 ? [`${match.experiences.length} expérience${match.experiences.length > 1 ? 's' : ''} documentée${match.experiences.length > 1 ? 's' : ''} reliée${match.experiences.length > 1 ? 's' : ''}`] : []),
          ...(match.formations.length > 0 ? [`${match.formations.length} formation${match.formations.length > 1 ? 's' : ''} FORMACODE directement suggérée${match.formations.length > 1 ? 's' : ''}`] : [])
        ],
        riskPoints: [
          ...(match.unverifiedCount > 0 ? [`${match.unverifiedCount} compétence${match.unverifiedCount > 1 ? 's' : ''} non vérifiée${match.unverifiedCount > 1 ? 's' : ''} (à confirmer dans le centre de validation)`] : []),
          ...(match.missingSkills.length > 0 ? [`${match.missingSkills.length} compétence${match.missingSkills.length > 1 ? 's' : ''} du référentiel non couverte${match.missingSkills.length > 1 ? 's' : ''} par le profil`] : [])
        ],
        suggestedNextAction: match.missingSkills[0]
          ? `Commencer par la formation « ${match.formations[0]?.libelle || match.missingSkills[0]} » pour combler le premier écart.`
          : 'Aucun écart critique détecté : le métier est directement accessible.',
        missingVerifications: match.matchedSkills
          .filter((m) => !m.verified)
          .map((m) => `Confirmer « ${m.name} » dans le centre de validation`)
      }
    };
    onAddHorizon(horizon);
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
  }, [onAddHorizon]);

  const handleGenerateMoreHorizons = async () => {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/explore-horizons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillsSummary: skills.map((s) => s.name).join(', '),
          capacitiesSummary: capacities.map((c) => c.name).join(', ')
        })
      });

      const data = await res.json();
      if (data.horizons && data.horizons.length > 0) {
        data.horizons.forEach((h: HorizonJobNode) => {
          onAddHorizon(h);
        });
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Impossible d'explorer de nouveaux horizons pour le moment.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="cognitorium-horizons-view" className="space-y-6 pb-12">
      {/* Hero Explanatory Banner */}
      <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-xs font-semibold">
            <Database className="w-3.5 h-3.5" />
            <span>Moteur ROME réel • Référentiel France Travail — juin 2026 (1 911 fiches)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Qu'est-ce que vous pourriez faire avec ce que vous possédez déjà ?
          </h2>

          <p className="text-sm text-orange-100 leading-relaxed">
            Chaque fiche du référentiel officiel ROME est croisée avec vos <strong>compétences réelles</strong> : le moteur compte les compétences démontrées, les expériences reliées et les écarts, puis propose les formations FORMACODE pertinentes. <strong>Aucun score n'est affiché sans son explication.</strong>
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              id="btn-ai-discover-horizons"
              onClick={handleGenerateMoreHorizons}
              disabled={isGenerating}
              className="px-5 py-2.5 bg-white hover:bg-orange-50 text-orange-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                  <span>Calcul des passerelles cognitives (IA)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  <span>Explorer de nouvelles passerelles (IA)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200">
          {errorMessage}
        </div>
      )}

      {/* ==================== MOTEUR ROME RÉEL ==================== */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4.5 h-4.5 text-orange-600" />
                Moteur ROME — Matching explicable
              </h3>
              <p className="text-xs text-slate-500">
                Recherchez une fiche (métier, code ROME, domaine) : le moteur calcule immédiatement la proximité avec votre profil et détaille <strong>pourquoi</strong> et <strong>ce qu'il manque</strong>.
              </p>
            </div>
            {!searchQuery.trim() && (
              <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shrink-0">
                Top {romeResults.length} correspondances calculées depuis votre profil
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ex : psychologue, M1805, data, énergie, enseignement..."
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
            <div className="text-[11px] text-slate-400 bg-slate-100 rounded-xl px-3 py-2.5 hidden sm:flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Seuils : ≥75 très forte · ≥50 forte · ≥25 modérée</span>
            </div>
          </div>
        </div>

        {/* Résultats du moteur ROME */}
        <div className="divide-y divide-slate-100">
          {romeResults.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-400">
              Aucune correspondance pour cette recherche. Essayez un autre terme ou videz la recherche pour revenir au classement automatique.
            </div>
          )}
          {romeResults.map((match) => {
            const info = getCompatibilityInfo(match.label);
            const added = horizonJobs.some((j) => j.romeCode === match.fiche.code);
            return (
              <div key={match.fiche.code} className="p-5 sm:p-6 hover:bg-orange-50/20 transition-colors">
                {/* Header de la fiche */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-black px-2 py-0.5 bg-slate-900 text-white rounded-md">
                        ROME {match.fiche.code}
                      </span>
                      {match.fiche.transitionEcologique && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                          🌱 {match.fiche.transitionEcologique}
                        </span>
                      )}
                      {match.fiche.transitionNumerique === 'Oui' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                          💻 Transition numérique
                        </span>
                      )}
                      {match.fiche.emploiCadre === 'Oui' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-md">
                          Cadre
                        </span>
                      )}
                      {match.fiche.emploiReglemente === 'Oui' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded-md">
                          ⚖️ Réglementé
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {match.fiche.libelle}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {match.fiche.grandDomaine} · {match.fiche.domaine}
                    </p>
                  </div>

                  {/* Compatibilité qualitative + score (expert uniquement) */}
                  <div className="text-right shrink-0">
                    <span className={`inline-block text-xs font-black px-3 py-1 rounded-xl border ${info.badge}`}>
                      {info.short}
                    </span>
                    {complexityMode === 'expert' && (
                      <div className="mt-1.5 flex items-center gap-1.5 justify-end">
                        <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${match.score}%`, backgroundColor: info.colorHex }} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600">{match.score}/100</span>
                      </div>
                    )}
                    {!match.evaluated && (
                      <span className="block text-[10px] text-slate-400 mt-1">Données compétences non disponibles pour cette fiche</span>
                    )}
                  </div>
                </div>

                {/* Pourquoi ? / Il manque quoi ? */}
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3.5 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Pourquoi ? — déjà en ma possession
                    </span>
                    {match.matchedSkills.length === 0 ? (
                      <p className="text-[11px] text-slate-500">Aucune compétence du profil reconnue dans cette fiche.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {match.matchedSkills.slice(0, 8).map((m) => (
                          <span key={m.skillId} className="px-2 py-1 bg-white text-emerald-800 rounded-lg text-[11px] font-medium border border-emerald-200 flex items-center gap-1.5" title={`Preuves : ${m.evidenceCount} · Confiance : ${m.confidence}%`}>
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{m.name}</span>
                            {m.evidenceCount > 0 && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-700 rounded px-1 font-bold">{m.evidenceCount} preuve{m.evidenceCount > 1 ? 's' : ''}</span>
                            )}
                          </span>
                        ))}
                        {match.matchedSkills.length > 8 && (
                          <span className="text-[11px] text-emerald-700 font-semibold self-center">+{match.matchedSkills.length - 8}</span>
                        )}
                      </div>
                    )}
                    <div className="text-[11px] text-emerald-700/80 pt-1 border-t border-emerald-100 flex flex-wrap gap-x-4 gap-y-1">
                      <span><strong>{match.matchedSkillCount}</strong> compétence{match.matchedSkillCount > 1 ? 's' : ''} démontrée{match.matchedSkillCount > 1 ? 's' : ''}</span>
                      {match.experiences.length > 0 && (
                        <span><strong>{match.experiences.length}</strong> expérience{match.experiences.length > 1 ? 's' : ''} reliée{match.experiences.length > 1 ? 's' : ''} ({match.experiences.slice(0, 2).join(', ')}{match.experiences.length > 2 ? '…' : ''})</span>
                      )}
                      {match.unverifiedCount > 0 && (
                        <span className="text-amber-700"><XCircle className="w-3 h-3 inline -mt-0.5 mr-0.5" /><strong>{match.unverifiedCount}</strong> non vérifiée{match.unverifiedCount > 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-3.5 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> Il manque quoi ? — écarts & passerelle
                    </span>
                    {match.missingSkills.length === 0 ? (
                      <p className="text-[11px] text-emerald-700 font-semibold">Aucun écart détecté sur les compétences du référentiel.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {match.missingSkills.slice(0, 4).map((ms) => (
                          <div key={ms} className="text-[11px] text-amber-900 bg-white/80 border border-amber-200 rounded-lg px-2.5 py-1.5">
                            <strong>{ms}</strong>
                          </div>
                        ))}
                        {match.missingSkills.length > 4 && (
                          <span className="text-[11px] text-amber-700 font-semibold">+{match.missingSkills.length - 4} autres compétences du référentiel</span>
                        )}
                      </div>
                    )}
                    {match.formations.length > 0 && (
                      <div className="pt-1.5 border-t border-amber-100 space-y-1">
                        <span className="text-[10px] font-bold text-amber-800 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" /> Formations FORMACODE suggérées :
                        </span>
                        {match.formations.slice(0, 3).map((f) => (
                          <span key={f.code} className="block text-[11px] text-slate-700">
                            • {f.libelle} <span className="text-[9px] text-slate-400 font-mono">({f.code})</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      const n = nodes.find((n) => n.category === 'horizon_job' && (n as HorizonJobNode).romeCode === match.fiche.code);
                      if (n) onSelectNode(n);
                    }}
                    className="text-[11px] font-semibold text-slate-500 hover:text-orange-600 px-2 py-1.5 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-1"
                  >
                    {added ? <>Voir dans mes horizons <ArrowRight className="w-3 h-3" /></> : <><Info className="w-3 h-3" /> Détails du référentiel</>}
                  </button>
                  <button
                    onClick={() => handleAddFromRome(match)}
                    disabled={added}
                    className={`px-3.5 py-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                      added
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default'
                        : 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs'
                    }`}
                  >
                    {added ? <><CheckCircle2 className="w-3.5 h-3.5" /> Ajouté à mes horizons</> : <><Plus className="w-3.5 h-3.5" /> Ajouter à mes horizons</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================== HORIZONS DÉJÀ DANS LE PROFIL ==================== */}
      <div className="flex items-center gap-2">
        <Layers className="w-4 h-4 text-orange-600" />
        <h3 className="text-sm font-bold text-slate-900">Mes horizons détectés ({filteredJobs.length})</h3>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-orange-600" />
          <span className="text-xs font-bold text-slate-800">
            {filteredJobs.length} Horizon{filteredJobs.length > 1 ? 's' : ''} Métier{filteredJobs.length > 1 ? 's' : ''} Détecté{filteredJobs.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none"
          >
            <option value="all">Tous les domaines</option>
            {domains.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Horizon Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job) => {
          const epistemic = getEpistemicLevel(job);
          // Compatibilité recalculée par le moteur ROME réel (jamais de score codé en dur affiché nu)
          const romeFiche = job.romeCode ? ROME_FICHES_BY_CODE.get(job.romeCode) : undefined;
          const moteurMatch = romeFiche ? computeFicheMatch(profile, romeFiche) : null;
          const moteurEvaluated = moteurMatch !== null && moteurMatch.evaluated;
          const labelInfo = moteurEvaluated && moteurMatch
            ? getCompatibilityInfo(moteurMatch.label)
            : getCompatibilityInfo(
                job.compatibilityLevel === 'Très Élevée' ? 'tres_forte'
                  : job.compatibilityLevel === 'Élevée' ? 'tres_forte'
                  : job.compatibilityLevel === 'Modérée' ? 'moderee'
                  : job.compatibilityLevel === 'En développement' ? 'forte'
                  : (job.matchScore >= 75 ? 'tres_forte' : job.matchScore >= 50 ? 'forte' : job.matchScore >= 25 ? 'moderee' : 'explorer')
              );
          const affichageScore = moteurEvaluated && moteurMatch ? moteurMatch.score : job.matchScore;
          const verifiedCount = job.matchingSkills?.length || 0;
          const pendingCount = job.missingSkills?.length || 0;
          return (
            <div
              key={job.id}
              onClick={() => onSelectNode(job)}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-orange-300 transition-all p-6 cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                        {job.domain}
                      </span>
                      {job.romeCode && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-900 text-white rounded-full">
                          ROME {job.romeCode}
                        </span>
                      )}
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${epistemic.badge}`}>
                        Nv. {epistemic.level} · {epistemic.label}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">{job.name}</h3>
                  </div>

                  {/* Compatibilité : qualitatif d'abord, chiffre seulement en mode expert */}
                  <div className="text-right shrink-0">
                    <span className={`inline-block text-xs font-black px-2.5 py-1 rounded-xl border ${labelInfo.badge}`}>
                      {labelInfo.short}
                    </span>
                    {complexityMode === 'expert' && (
                      <span className="block text-[10px] font-bold text-slate-400 mt-1">
                        {affichageScore}/100{moteurEvaluated ? ' (moteur ROME)' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rationale & Explainability */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {job.rationale}
                  </p>

                  {job.explainabilityFactors && (
                    <div className="pt-2 border-t border-slate-200/60 text-[11px] space-y-1">
                      <span className="font-semibold text-slate-900 block">Pourquoi cette passerelle fonctionne :</span>
                      {job.explainabilityFactors.strengthPoints?.map((sp, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span>{sp}</span>
                        </div>
                      ))}
                      {job.explainabilityFactors.riskPoints?.map((rp, idx) => (
                        <div key={`risk-${idx}`} className="flex items-start gap-1.5 text-amber-700">
                          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span>{rp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bilan explicable : forces / lacunes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-1.5">
                      ✅ Déjà démontré ({verifiedCount})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.matchingSkills?.slice(0, 4).map((ms, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-white text-emerald-800 rounded-lg text-[11px] font-medium border border-emerald-200">
                          {ms}
                        </span>
                      ))}
                      {(job.matchingSkills?.length || 0) > 4 && (
                        <span className="text-[11px] text-emerald-700 font-semibold self-center">+{(job.matchingSkills?.length || 0) - 4}</span>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block mb-1.5">
                      ⚠️ À combler ({pendingCount})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.missingSkills?.slice(0, 4).map((ms, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-white text-amber-800 rounded-lg text-[11px] font-medium border border-amber-200">
                          {typeof ms === 'string' ? ms : ms.name}
                        </span>
                      ))}
                      {(job.missingSkills?.length || 0) > 4 && (
                        <span className="text-[11px] text-amber-700 font-semibold self-center">+{(job.missingSkills?.length || 0) - 4}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  Cliquez pour inspecter l'analyse complète
                </span>
                <span className="font-semibold text-orange-600 flex items-center gap-1">
                  Inspecter les détails <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredJobs.length === 0 && (
        <div className="p-10 bg-white rounded-3xl border border-dashed border-slate-200 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-600">Aucun horizon pour le moment.</p>
          <p className="text-xs text-slate-400">
            Ajoutez des expériences ou utilisez le moteur ROME ci-dessus pour calculer vos premiers métiers compatibles.
          </p>
        </div>
      )}
    </div>
  );
};
