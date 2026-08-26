import React from 'react';
import { 
  Sparkles, 
  Compass, 
  Clock, 
  Brain, 
  Network, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Flame, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  ChevronRight, 
  ListTree, 
  Table2, 
  Layers,
  RefreshCw,
  FlaskConical
} from 'lucide-react';
import { CognitiveProfile, AppActiveTab, ComplexityMode, SkillNode, HorizonJobNode, AnyCognitiveNode } from '../types';
import { calculateSkillVitality, getVitalityStatus } from '../utils/decay';
import { getCompatibilityInfo, compatibilityLabelFromScore } from '../utils/romeMatching';

interface DashboardViewProps {
  profile: CognitiveProfile;
  simulationYear: number;
  complexityMode: ComplexityMode;
  onToggleComplexity: () => void;
  onNavigateTab: (tab: AppActiveTab) => void;
  onSelectNode: (node: AnyCognitiveNode) => void;
  onOpenValidationCenter: () => void;
  onOpenDistiller: () => void;
  onReactivateSkill: (skillId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  simulationYear,
  complexityMode,
  onToggleComplexity,
  onNavigateTab,
  onSelectNode,
  onOpenValidationCenter,
  onOpenDistiller,
  onReactivateSkill
}) => {
  // Extract key skills
  const allSkills = profile.nodes.filter((n) => n.category.startsWith('skill_')) as SkillNode[];
  const allCapacities = profile.nodes.filter((n) => n.category === 'capacity_cognitive');
  const allHorizons = profile.nodes.filter((n) => n.category === 'horizon_job') as HorizonJobNode[];
  const allExperiences = profile.nodes.filter((n) => n.category === 'experience' || n.category === 'formation');

  // Top 3 strongest skills
  const topSkills = [...allSkills].sort((a, b) => b.baseMastery - a.baseMastery).slice(0, 3);

  // 2 Top matching horizons
  const topHorizons = [...allHorizons].sort((a, b) => b.matchScore - a.matchScore).slice(0, 2);

  // Prochaine action : calculée depuis le premier horizon (jamais de chiffre magique codé en dur)
  const nextActionHorizon = topHorizons[0];
  const nextGap = nextActionHorizon?.missingSkills?.[0];
  const nextHorizonName = nextActionHorizon?.name || '';
  const nextLabel = getCompatibilityInfo(compatibilityLabelFromScore(nextActionHorizon?.matchScore ?? 0));

  // 1 Skill in decay / needing reactivation
  const skillToReactivate = allSkills.find((s) => {
    const vit = calculateSkillVitality(s, simulationYear, s.isReactivated);
    return vit < 75;
  }) || allSkills[allSkills.length - 1];

  const skillToReactivateVitality = skillToReactivate
    ? calculateSkillVitality(skillToReactivate, simulationYear, skillToReactivate.isReactivated)
    : 100;

  // Pending validation items count
  const pendingNodes = profile.nodes.filter(
    (n) => n.verificationStatus === 'pending' || n.verificationStatus === 'inferred'
  );

  return (
    <div id="dashboard-view" className="space-y-6 pb-12">
      {/* 1. TOP HERO: PROFILE IDENTITY & MODE TOGGLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                Cognitorium Actif
              </span>
              {profile.journeyType && (
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                  {profile.journeyType === 'student' && '🎓 Parcours Étudiant / Jeune Diplômé'}
                  {profile.journeyType === 'professional' && '💼 Parcours Professionnel en Poste'}
                  {profile.journeyType === 'transition' && '🔄 Parcours Reconversion & Transition'}
                </span>
              )}
              <span className="text-xs text-slate-400">• Simulation : {simulationYear}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {profile.personName}
            </h1>
            <p className="text-sm font-medium text-slate-600 max-w-3xl leading-relaxed">
              {profile.headline}
            </p>
            {profile.coreMotto && (
              <p className="text-xs italic text-blue-600/90 pt-1">
                « {profile.coreMotto} »
              </p>
            )}
          </div>

          {/* Quick Stats & Mode Switch */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
            {/* Mode Switcher: Essentiel vs Expert */}
            <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200">
              <button
                id="mode-btn-essential"
                onClick={() => complexityMode !== 'essential' && onToggleComplexity()}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  complexityMode === 'essential'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Mode Essentiel
              </button>
              <button
                id="mode-btn-expert"
                onClick={() => complexityMode !== 'expert' && onToggleComplexity()}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  complexityMode === 'expert'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Mode Expert
              </button>
            </div>

            {/* Quick Action CTA */}
            <button
              id="dash-btn-open-distiller"
              onClick={onOpenDistiller}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ Ajouter un vécu / CV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. PENDING VALIDATIONS ALERT BANNER (If any) */}
      {pendingNodes.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {pendingNodes.length} élément{pendingNodes.length > 1 ? 's' : ''} inféré{pendingNodes.length > 1 ? 's' : ''} par l'IA en attente de validation
              </h3>
              <p className="text-xs text-slate-600">
                L'IA propose, l'humain valide. Vérifiez la confiance et confirmez vos compétences avant inscription définitive.
              </p>
            </div>
          </div>
          <button
            id="dash-btn-open-validation-center"
            onClick={onOpenValidationCenter}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all whitespace-nowrap self-start sm:self-auto"
          >
            Examiner & Valider ({pendingNodes.length})
          </button>
        </div>
      )}

      {/* 3. ESSENTIAL OVERVIEW: 4 CORE SUMMARY PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PILLAR 1: TOP 3 COMPÉTENCES PHARES */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Compétences Clés
              </span>
              <Award className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Top 3 Maîtrises Phares</h3>

            <div className="space-y-2 pt-1">
              {topSkills.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onSelectNode(s)}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <strong className="text-slate-800 group-hover:text-blue-600 truncate pr-2">
                      {s.name}
                    </strong>
                    <span className="font-bold text-blue-600 shrink-0">{s.baseMastery}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${s.baseMastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('table')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <span>Voir toutes les compétences ({allSkills.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* PILLAR 2: 2 HORIZONS PROMETTEURS IMMÉDIATS */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Passerelles ROME
              </span>
              <Compass className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">2 Horizons Prometteurs</h3>

            <div className="space-y-2 pt-1">
              {topHorizons.map((h) => (
                <div
                  key={h.id}
                  onClick={() => onSelectNode(h)}
                  className="p-2.5 rounded-xl bg-orange-50/60 hover:bg-orange-50 border border-orange-100 hover:border-orange-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <strong className="text-slate-900 group-hover:text-orange-600 truncate pr-2">
                      {h.name}
                    </strong>
                    <span className="font-bold text-orange-600 shrink-0">{h.compatibilityLevel || 'À explorer'}</span>
                  </div>
                  {h.romeCode && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded font-semibold">
                      ROME {h.romeCode}
                    </span>
                  )}
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {h.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('horizons')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-orange-600 hover:text-orange-700"
          >
            <span>Explorer les passerelles ({allHorizons.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* PILLAR 3: 1 COMPÉTENCE À RÉACTIVER / VITALITÉ */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Disponibilité & Veille
              </span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">À Consolider / Réactiver</h3>

            {skillToReactivate ? (
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-900 font-bold truncate">
                    {skillToReactivate.name}
                  </strong>
                  <span className="text-xs font-bold text-amber-700">
                    {skillToReactivateVitality}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Dernière pratique en {skillToReactivate.lastPracticedYear}. Fondations intactes en mémoire résiduelle.
                </p>

                <button
                  id="dash-btn-quick-reactivate"
                  onClick={() => onReactivateSkill(skillToReactivate.id)}
                  className="w-full py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Simuler Réactivation (4x plus rapide)</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Toutes vos compétences sont au sommet de leur disponibilité.</p>
            )}
          </div>

          <button
            onClick={() => onNavigateTab('decay')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>Modèle de vitalité & demi-vie</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* PILLAR 4: PROCHAINE ACTION RECOMMANDÉE */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                Orientation Actionnable
              </span>
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="font-bold text-sm text-white">Prochaine Étape Clé</h3>

            {nextGap ? (
              <div className="space-y-2 text-xs text-indigo-100">
                <p className="text-[11px] leading-relaxed">
                  💡 <strong>Pont d'apprentissage prioritaire :</strong> « {nextGap.name} » pour vous rapprocher de <strong>{nextHorizonName}</strong> ({nextLabel.short.toLowerCase()}).
                </p>
                <div className="p-2.5 bg-white/10 rounded-xl text-[10px] space-y-1">
                  <span className="text-indigo-200 block font-semibold">Formation suggérée :</span>
                  <span>{nextGap.learningBridge || nextGap.recommendedTraining?.title || 'À identifier avec France Travail / OPCO.'}</span>
                </div>
              </div>
            ) : (
              <p className="text-[11px] leading-relaxed text-indigo-100">
                ✅ Aucun écart critique détecté sur vos horizons prioritaires. Vérifiez la vitalité de vos compétences ou explorez de nouveaux métiers dans « Mes possibilités ».
              </p>
            )}
          </div>

          <button
            onClick={() => onNavigateTab('horizons')}
            className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-indigo-300 hover:text-white"
          >
            <span>Explorer mes possibilités</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. EXPERT METRICS SECTION (If Mode Expert is active) */}
      {complexityMode === 'expert' && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                Mode Expert • Métriques Approfondies
              </span>
              <h2 className="text-lg font-bold text-white">
                Moteur Cognitif & Modèle de Transférabilité
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Graphe : {profile.nodes.length} nœuds / {profile.edges.length} arêtes</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Indice de Transférabilité</span>
              <span className="text-2xl font-extrabold text-blue-400">
                {profile.cognitiveSignature.transferabilityIndex}/100
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Hautement mobile</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Vélocité d'Apprentissage</span>
              <span className="text-2xl font-extrabold text-indigo-400">
                {profile.cognitiveSignature.learningVelocity}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Assimilation rapide</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Adaptabilité Situations</span>
              <span className="text-2xl font-extrabold text-emerald-400">
                {profile.cognitiveSignature.adaptabilityIndex}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Pragmatisme terrain</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Profil RIASEC</span>
              <span className="text-2xl font-extrabold text-pink-400">
                {profile.riasec?.code || 'SIC'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Social - Investigateur</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 text-xs text-slate-300 space-y-1.5">
            <strong className="text-white block font-semibold">Diagnostic cognitif global :</strong>
            <p className="leading-relaxed text-[11px] text-slate-300">
              {profile.cognitiveSignature.summaryText}
            </p>
            <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-700/40">
              ⚠️ Indices heuristiques d'aide à la réflexion, pas des mesures psychologiques. Le niveau 5 (conclusion psychologique) n'est jamais déduit automatiquement d'un CV.
            </p>
          </div>
        </div>
      )}

      {/* 5. EXPLORATION WORKSPACES ENTRYPOINTS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Espaces d'Exploration & Modes de Visualisation
            </h2>
            <p className="text-xs text-slate-500">
              Changez de perspective sur vos compétences selon vos besoins d'analyse.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Graphe Réseau Canvas */}
          <div
            id="entry-card-network"
            onClick={() => onNavigateTab('network')}
            className="p-5 bg-white rounded-3xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600">
                Graphe Réseau Dynamique
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Visualisation interactive en cinq niveaux : Expérience → Tâche → Compétence → Cognition → Matching.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
              <span>Explorer le graphe</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 1b: Graphe Temporel */}
          <div
            id="entry-card-temporal"
            onClick={() => onNavigateTab('temporal')}
            className="p-5 bg-white rounded-3xl border border-slate-200 hover:border-cyan-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-cyan-600">
                Graphe Temporel
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Voyez le réseau se construire dans le temps : les ronds s'activent progressivement, les liens se tissent au même rythme.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-600">
              <span>Lire la construction</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Vue Arbre & Décomposition */}
          <div
            id="entry-card-tree"
            onClick={() => onNavigateTab('tree')}
            className="p-5 bg-white rounded-3xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ListTree className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600">
                Vue Arbre & Tâches
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Décomposition hiérarchique étape par étape : Expérience ➔ Tâches concrètes ➔ Compétences ➔ Capacités.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <span>Parcourir l'arbre</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Vue Tableau Matrice */}
          <div
            id="entry-card-table"
            onClick={() => onNavigateTab('table')}
            className="p-5 bg-white rounded-3xl border border-slate-200 hover:border-cyan-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                <Table2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-cyan-600">
                Tableau & Matrice de Maîtrise
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Grille filtrable, recherche textuelle, tri par maîtrise, statut de validation et sources de preuves.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-600">
              <span>Consulter la matrice</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Passerelles & Horizons ROME */}
          <div
            id="entry-card-horizons"
            onClick={() => onNavigateTab('horizons')}
            className="p-5 bg-white rounded-3xl border border-slate-200 hover:border-orange-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-orange-600">
                Passerelles Métiers & ROME
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Comparaison détaillée avec les référentiels officiels ROME, analyse explicable du score et ponts de formation.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600">
              <span>Explorer les horizons</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Moteur de Vitalité & Temporalité */}
          <div
            id="entry-card-decay"
            onClick={() => onNavigateTab('decay')}
            className="p-5 bg-white rounded-3xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600">
                Vitalité & Demi-vie Temporelle
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Modèle heuristique de disponibilité estimée, simulation temporelle et dynamique de réactivation rapide.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600">
              <span>Simuler l'évolution</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5b: Atlas & Savoirs */}
          <div
            id="entry-card-atlas"
            onClick={() => onNavigateTab('atlas')}
            className="p-5 bg-white rounded-3xl border border-slate-200 hover:border-violet-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-violet-600">
                Atlas & posters expérimentaux
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Huit branches de la psychologie, références les plus citées, infographies interactives (Sherif, Asch, Stroop) et boucle métacognitive.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-violet-600">
              <span>Ouvrir les savoirs</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5c: Coffre de Preuves / Évaluations */}
          <div
            id="entry-card-evaluations"
            onClick={() => onNavigateTab('evaluations')}
            className="p-5 bg-white rounded-3xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-700">
                Mes évaluations
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Diplômes, certifs, documents de vérification, tests, mesures physio et BCI — coffre de preuves, jamais un diagnostic.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700">
              <span>Ouvrir le coffre</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Diagnostic & Passeport */}
          <div
            id="entry-card-signature"
            onClick={() => onNavigateTab('signature')}
            className="p-5 bg-white rounded-3xl border border-slate-200 hover:border-pink-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-pink-600">
                Passeport & Signature Cognitive
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Radar RIASEC, diagnostic d'apprentissage, synthèse de raisonnement et export de votre passeport cognitif.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-pink-600">
              <span>Ouvrir le passeport</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
