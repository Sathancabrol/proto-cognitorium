import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Wand2, 
  X, 
  Eye, 
  Check, 
  ShieldCheck,
  ListTree,
  UserPlus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  AnyCognitiveNode, 
  GraphEdge, 
  CognitiveProfile, 
  UserJourneyType,
  ExperienceNode,
  TaskNode,
  SkillNode,
  CapacityNode,
  KnowledgeNode,
  HorizonJobNode,
  AppActiveTab
} from '../../types';
import { UserAccount } from '../../types/authTypes';
import { INITIAL_COGNITORIUM_PROFILE } from '../../data/initialData';
import { VolantNodeType } from './CognitoriumNodeVolant';
import { CognitoriumVolantSkeleton } from './CognitoriumVolantSkeleton';
import { CognitoriumGuidedSequence } from './CognitoriumGuidedSequence';
import { CognitoriumObsidianGraph, GhostNodeItem } from './CognitoriumObsidianGraph';

interface CognitoriumOrganicStudioProps {
  onCancel: () => void;
  onComplete: (newAccount: UserAccount, newProfile: CognitiveProfile, targetTab: AppActiveTab) => void;
}

export const CognitoriumOrganicStudio: React.FC<CognitoriumOrganicStudioProps> = ({
  onCancel,
  onComplete
}) => {
  // Phase 0 : Graphe vide au départ. Devient true après clic sur "Créer mon compte"
  const [isTemplateDeployed, setIsTemplateDeployed] = useState(false);

  // Volant gauche : ouvert ou fermé
  const [isVolantOpen, setIsVolantOpen] = useState(false);

  // Mode du volant : 'skeleton' (arborescence du squelette) ou 'guided' (séquence guidée rigoureuse)
  const [volantMode, setVolantMode] = useState<'skeleton' | 'guided'>('skeleton');

  // Nœud actif ciblé dans le volant
  const [activeVolantNode, setActiveVolantNode] = useState<VolantNodeType>('profile');

  // Données du Profil (Nœud Central)
  const [personName, setPersonName] = useState('');
  const [email, setEmail] = useState('');
  const [journeyType, setJourneyType] = useState<UserJourneyType>('professional');
  const [coreMotto, setCoreMotto] = useState('');

  // Données Métier Cible (Nœud ROME)
  const [selectedRomeCode, setSelectedRomeCode] = useState('');
  const [customTargetTitle, setCustomTargetTitle] = useState('');

  // Données Expérience Pivot
  const [experienceRole, setExperienceRole] = useState('');
  const [experienceContext, setExperienceContext] = useState('');
  const [experiencePeriod, setExperiencePeriod] = useState('');
  const [missions, setMissions] = useState<string[]>([]);

  // Données Compétences Clés
  const [skillsList, setSkillsList] = useState<{ name: string; category: 'skill_tech' | 'skill_relational' | 'skill_transversal'; mastery: number }[]>([]);

  // Données Savoirs & Théorie
  const [knowledgeName, setKnowledgeName] = useState('');
  const [knowledgeDomain, setKnowledgeDomain] = useState('');

  // Données Capacité Cognitive
  const [capacityName, setCapacityName] = useState('');
  const [capacityDimension, setCapacityDimension] = useState('Adaptabilité & Imprévus');

  // Statuts de complétion
  const isProfileFilled = Boolean(personName.trim());
  const isKnowledgeFilled = Boolean(knowledgeName.trim());
  const isExperienceFilled = Boolean(experienceRole.trim());
  const isSkillsFilled = skillsList.length > 0;
  const isCapacityFilled = Boolean(capacityName.trim());
  const isTargetJobFilled = Boolean(customTargetTitle.trim() || selectedRomeCode.trim());

  const completedCount = useMemo(() => {
    return [
      isProfileFilled,
      isKnowledgeFilled,
      isExperienceFilled,
      isSkillsFilled,
      isCapacityFilled,
      isTargetJobFilled
    ].filter(Boolean).length;
  }, [isProfileFilled, isKnowledgeFilled, isExperienceFilled, isSkillsFilled, isCapacityFilled, isTargetJobFilled]);

  // Clic initial sur le bouton "Créer mon compte" au centre du graphe vide
  const handleDeployTemplate = () => {
    setIsTemplateDeployed(true);
    setIsVolantOpen(true);
    setVolantMode('skeleton');
    setActiveVolantNode('profile');
  };

  // Clic sur un nœud dans le graphe ou le squelette
  const handleSelectNode = (nodeType: VolantNodeType) => {
    if (!isTemplateDeployed) {
      setIsTemplateDeployed(true);
    }
    setIsVolantOpen(true);
    setActiveVolantNode(nodeType);
    setVolantMode('guided');
  };

  // Lancement de la séquence guidée depuis le squelette
  const handleStartGuidedSequence = () => {
    setActiveVolantNode('profile');
    setVolantMode('guided');
  };

  // Retour à la vue squelette dans le volant
  const handleBackToSkeleton = () => {
    setVolantMode('skeleton');
  };

  // Pré-remplissage rapide d'un exemple concret pour un nœud spécifique
  const handleApplyPresetForNode = (type: VolantNodeType) => {
    switch (type) {
      case 'profile':
        setPersonName('Alexandre Martin');
        setEmail('alexandre.martin@cognitorium.fr');
        setJourneyType('professional');
        setCoreMotto('Coordination rigoureuse et vision globale du chantier');
        break;
      case 'target_job':
        setSelectedRomeCode('F1201');
        setCustomTargetTitle('Conducteur de travaux BTP & VRD');
        break;
      case 'experience':
        setExperienceRole('Conducteur de travaux VRD');
        setExperienceContext('SOBECA Travaux Publics');
        setExperiencePeriod('2023 - 2025');
        setMissions([
          'Pilotage des sous-traitants & cadence chantier',
          'Contrôle qualité, sécurité et récolement DOE',
          'Gestion des approvisionnements réseaux humides & secs'
        ]);
        break;
      case 'skill':
        setSkillsList([
          { name: 'Métrés & Récolement DOE', category: 'skill_tech', mastery: 90 },
          { name: 'Coordination cadence chantier', category: 'skill_relational', mastery: 85 },
          { name: 'Gestion des aléas sous-sol', category: 'skill_transversal', mastery: 80 }
        ]);
        break;
      case 'knowledge':
        setKnowledgeName('Résistance des matériaux & Normes NF VRD');
        setKnowledgeDomain('Génie Civil & VRD');
        break;
      case 'capacity':
        setCapacityName('Arbitrage et régulation sous contrainte');
        setCapacityDimension('Adaptabilité & Imprévus');
        break;
    }
  };

  // Pré-remplissage complet (test en 3 secondes)
  const handleApplyFullPreset = () => {
    setIsTemplateDeployed(true);
    setIsVolantOpen(true);
    setPersonName('Alexandre Martin');
    setEmail('alexandre.martin@cognitorium.fr');
    setJourneyType('professional');
    setCoreMotto('Coordination rigoureuse et vision globale du chantier');
    setSelectedRomeCode('F1201');
    setCustomTargetTitle('Conducteur de travaux BTP & VRD');
    setExperienceRole('Conducteur de travaux VRD');
    setExperienceContext('SOBECA Travaux Publics');
    setExperiencePeriod('2023 - 2025');
    setMissions([
      'Pilotage des sous-traitants & cadence chantier',
      'Contrôle qualité, sécurité et récolement DOE',
      'Gestion des approvisionnements réseaux'
    ]);
    setSkillsList([
      { name: 'Métrés & Récolement DOE', category: 'skill_tech', mastery: 90 },
      { name: 'Coordination cadence chantier', category: 'skill_relational', mastery: 85 },
      { name: 'Gestion des aléas sous-sol', category: 'skill_transversal', mastery: 80 }
    ]);
    setKnowledgeName('Résistance des matériaux & Normes NF VRD');
    setKnowledgeDomain('Génie Civil & VRD');
    setCapacityName('Arbitrage et régulation sous contrainte');
    setCapacityDimension('Adaptabilité & Imprévus');
  };

  // Adoption interactive d'un nœud pré-lié suggéré (en grisé sur le graphe)
  const handleAdoptGhostNode = (ghost: GhostNodeItem) => {
    setIsVolantOpen(true);

    if (ghost.type === 'experience_category') {
      setExperienceRole(ghost.payload.role || ghost.label);
      if (ghost.payload.typicalContext) setExperienceContext(ghost.payload.typicalContext);
      if (ghost.payload.suggestedMissions) {
        setMissions(prev => {
          const merged = new Set([...prev, ...ghost.payload.suggestedMissions]);
          return Array.from(merged);
        });
      }
      setActiveVolantNode('experience');
      setVolantMode('guided');
    } else if (ghost.type === 'mission') {
      const missionName = ghost.payload.missionName || ghost.label.replace(/^\+\s*/, '');
      setMissions(prev => {
        if (!prev.includes(missionName)) return [...prev, missionName];
        return prev;
      });
      setActiveVolantNode('experience');
      setVolantMode('guided');
    } else if (ghost.type === 'knowledge') {
      setKnowledgeName(ghost.payload.name || ghost.label.replace(/^\+\s*/, ''));
      if (ghost.payload.domain) setKnowledgeDomain(ghost.payload.domain);
      setActiveVolantNode('knowledge');
      setVolantMode('guided');
    } else if (ghost.type === 'skill') {
      const skillName = ghost.payload.name || ghost.label.replace(/^\+\s*/, '');
      const exists = skillsList.some(s => s.name.toLowerCase() === skillName.toLowerCase());
      if (!exists) {
        setSkillsList(prev => [
          ...prev,
          {
            name: skillName,
            category: ghost.payload.category || 'skill_tech',
            mastery: ghost.payload.defaultMastery || 88
          }
        ]);
      }
      setActiveVolantNode('skill');
      setVolantMode('guided');
    } else if (ghost.type === 'capacity') {
      setCapacityName(ghost.payload.name || ghost.label.replace(/^\+\s*/, ''));
      if (ghost.payload.dimension) setCapacityDimension(ghost.payload.dimension);
      setActiveVolantNode('capacity');
      setVolantMode('guided');
    } else if (ghost.type === 'target_job') {
      setSelectedRomeCode(ghost.payload.code);
      setCustomTargetTitle(ghost.payload.title);
      setActiveVolantNode('target_job');
      setVolantMode('guided');
    }
  };

  // Construction du connectome final
  const finalGraph = useMemo(() => {
    const nodes: AnyCognitiveNode[] = [];
    const edges: GraphEdge[] = [];

    const finalName = personName.trim() || 'Alexandre Martin';
    const finalTarget = customTargetTitle.trim() || 'Conducteur de travaux BTP & VRD';

    // 1. Nœud racine Profil
    const rootNode: ExperienceNode = {
      id: 'user-root',
      name: finalName,
      category: 'experience',
      period: 'Connectome Actif',
      startYear: 2024,
      endYear: 2026,
      institutionOrContext: 'Cognitorium Connectome',
      role: finalTarget,
      missions: ['Cartographie des acquis', 'Tissage du connectome'],
      cognitiveEfforts: ['Raisonnement épistémique', 'Synthèse'],
      description: `Profil cognitif de ${finalName}`,
      verificationStatus: 'verified',
      confidenceScore: 100
    };
    nodes.push(rootNode);

    // 2. Nœud Horizon ROME
    const targetCode = selectedRomeCode.trim() || 'F1201';
    const horizonNode: HorizonJobNode = {
      id: 'target-horizon',
      name: `${targetCode} - ${finalTarget}`,
      category: 'horizon_job',
      domain: 'Cap Professionnel Cible',
      matchScore: Math.min(95, 60 + skillsList.length * 8),
      rationale: `Orientation cible : ${finalTarget}`,
      matchingSkills: skillsList.map(s => s.name),
      missingSkills: [],
      unlockedOpportunities: ['Direction de chantier', 'Ingénierie de projet'],
      romeCode: targetCode,
      description: `Vocation professionnelle ciblée : ${finalTarget}`
    };
    nodes.push(horizonNode);

    edges.push({
      id: 'edge-root-target',
      source: 'user-root',
      target: 'target-horizon',
      type: 'unlocks_horizon',
      strength: 0.95,
      label: 'Vocation Cible'
    });

    // 3. Nœud Expérience
    const expRole = experienceRole.trim() || 'Conducteur de travaux VRD';
    const expContext = experienceContext.trim() || 'SOBECA';
    const expNode: ExperienceNode = {
      id: 'exp-main',
      name: expRole,
      category: 'experience',
      period: experiencePeriod.trim() || '2023 - 2025',
      startYear: 2023,
      endYear: 2025,
      institutionOrContext: expContext,
      role: expRole,
      missions: missions.length > 0 ? missions : ['Pilotage de chantier', 'Coordination VRD'],
      cognitiveEfforts: ['Coordination', 'Résolution d’aléas'],
      description: `Poste exercé chez ${expContext}`
    };
    nodes.push(expNode);

    edges.push({
      id: 'edge-root-exp',
      source: 'user-root',
      target: 'exp-main',
      type: 'composed_of',
      strength: 1.0,
      label: 'Expérience pivot'
    });

    // 4. Missions / Tâches
    missions.forEach((m, idx) => {
      const taskId = `task-${idx}`;
      nodes.push({
        id: taskId,
        name: m,
        category: 'task',
        experienceId: 'exp-main',
        context: expContext,
        actions: [m],
        skillsProduced: [],
        description: `Action de terrain : ${m}`,
        verificationStatus: 'verified',
        confidenceScore: 90
      } as TaskNode);

      edges.push({
        id: `edge-exp-task-${idx}`,
        source: 'exp-main',
        target: taskId,
        type: 'composed_of',
        strength: 0.85,
        label: 'Action concrète'
      });
    });

    // 5. Compétences
    skillsList.forEach((s, idx) => {
      const skillId = `skill-${idx}`;
      nodes.push({
        id: skillId,
        name: s.name,
        category: s.category,
        baseMastery: s.mastery,
        acquiredYear: 2023,
        lastPracticedYear: 2025,
        halfLifeYears: 4,
        decayFactor: 0.1,
        subSkills: [s.name],
        transferabilityScore: 8,
        description: `Compétence : ${s.name}`,
        verificationStatus: 'verified',
        confidenceScore: s.mastery
      } as SkillNode);

      edges.push({
        id: `edge-exp-skill-${idx}`,
        source: 'exp-main',
        target: skillId,
        type: 'acquired_in',
        strength: s.mastery / 100,
        label: 'Compétence acquise'
      });

      edges.push({
        id: `edge-skill-horizon-${idx}`,
        source: skillId,
        target: 'target-horizon',
        type: 'unlocks_horizon',
        strength: 0.8,
        label: 'Adéquation'
      });
    });

    // 6. Savoirs
    if (knowledgeName.trim()) {
      nodes.push({
        id: 'know-main',
        name: knowledgeName.trim(),
        category: 'knowledge',
        domain: knowledgeDomain.trim() || 'Théorie & Méthodologie',
        acquiredYear: 2023,
        decayRate: 'lent',
        description: `Savoir : ${knowledgeName.trim()}`,
        verificationStatus: 'verified',
        confidenceScore: 90
      } as KnowledgeNode);

      edges.push({
        id: 'edge-root-know',
        source: 'user-root',
        target: 'know-main',
        type: 'requires_knowledge',
        strength: 0.85,
        label: 'Connaissance'
      });
    }

    // 7. Capacité Cognitive
    if (capacityName.trim()) {
      nodes.push({
        id: 'cap-main',
        name: capacityName.trim(),
        category: 'capacity_cognitive',
        level: 'avancé',
        underlyingSkills: skillsList.map(s => s.name),
        cognitiveDimension: capacityDimension,
        description: `Capacité cognitive : ${capacityName.trim()}`,
        verificationStatus: 'verified',
        confidenceScore: 95
      } as CapacityNode);

      edges.push({
        id: 'edge-root-cap',
        source: 'user-root',
        target: 'cap-main',
        type: 'feeds_capacity',
        strength: 0.9,
        label: 'Capacité clé'
      });
    }

    return { nodes, edges };
  }, [
    personName,
    customTargetTitle,
    selectedRomeCode,
    experienceRole,
    experienceContext,
    experiencePeriod,
    missions,
    skillsList,
    knowledgeName,
    knowledgeDomain,
    capacityName,
    capacityDimension
  ]);

  // Finalisation et redirection vers l'accueil
  const handleFinalize = () => {
    const finalName = personName.trim() || 'Alexandre Martin';
    const finalTitle = customTargetTitle.trim() || 'Conducteur de travaux BTP & VRD';
    const finalEmail = email.trim() || `${finalName.toLowerCase().replace(/\s+/g, '.')}@cognitorium.fr`;

    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.55 }
    });

    const accountId = `usr_${Date.now()}`;
    const profileId = `prof_${Date.now()}`;

    const newAccount: UserAccount = {
      id: accountId,
      email: finalEmail,
      personName: finalName,
      headline: `${finalTitle} • Connectome Vivant Certifié`,
      targetTitle: finalTitle,
      targetRomeCode: selectedRomeCode || 'F1201',
      journeyType: journeyType,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      hasCompletedOnboarding: true,
      profileId: profileId
    };

    const newProfile: CognitiveProfile = {
      ...INITIAL_COGNITORIUM_PROFILE,
      id: profileId,
      personName: finalName,
      headline: `${finalTitle} • Connectome Certifié`,
      coreMotto: coreMotto || 'Rigueur technique et maîtrise du connectome',
      journeyType: journeyType,
      cvConfig: {
        template: 'moderne',
        targetRomeCode: selectedRomeCode || 'F1201',
        targetJobTitle: finalTitle,
        includeSummary: true,
        includeCognitiveCapacities: true
      },
      nodes: finalGraph.nodes,
      edges: finalGraph.edges
    };

    setTimeout(() => {
      onComplete(newAccount, newProfile, 'dashboard');
    }, 450);
  };

  return (
    <div
      id="cognitorium-organic-studio"
      className="relative w-full h-screen bg-[#03050C] text-slate-100 flex flex-col justify-between select-none overflow-hidden font-sans"
    >
      {/* ==================================================================== */}
      {/* HEADER SUPÉRIEUR */}
      {/* ==================================================================== */}
      <header className="relative z-30 px-5 py-3 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-black text-slate-950 shadow-md shadow-cyan-500/20">
            C
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                Studio de Genèse • Graphe Obsidian
              </span>
              <span className="text-[10px] text-slate-500 font-mono">• Connectome Vivant</span>
            </div>
            <h1 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>{personName ? `Connectome de ${personName}` : 'Création de Compte par le Graphe'}</span>
              {isTemplateDeployed && (
                <span className="text-xs font-mono font-normal text-slate-400">
                  ({completedCount}/6 nœuds renseignés)
                </span>
              )}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Bouton de bascule du volant gauche */}
          {isTemplateDeployed && (
            <button
              type="button"
              onClick={() => setIsVolantOpen(!isVolantOpen)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ListTree className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isVolantOpen ? 'Masquer Volant' : 'Ouvrir Volant'}</span>
            </button>
          )}

          {/* Bouton de pré-remplissage rapide en 1 clic */}
          {isTemplateDeployed && (
            <button
              type="button"
              onClick={handleApplyFullPreset}
              className="hidden sm:flex px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 text-xs font-mono items-center gap-1.5 transition-colors cursor-pointer"
              title="Pré-remplir un profil complet pour tester en 3 secondes"
            >
              <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Modèle rapide</span>
            </button>
          )}

          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
          >
            Quitter
          </button>

          {/* Bouton de validation final */}
          {isTemplateDeployed && (
            <button
              id="btn-validate-studio-account"
              type="button"
              onClick={handleFinalize}
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <span>Valider mon Connectome</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* ==================================================================== */}
      {/* ESPACE PRINCIPAL : VOLANT SUR LA GAUCHE + GRAPHE OBSIDIAN SUR LA DROITE */}
      {/* ==================================================================== */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex">
        
        {/* LE VOLANT LATÉRAL GAUCHE (Ouvert après clic sur Créer mon compte) */}
        {isTemplateDeployed && isVolantOpen && (
          <aside className="relative z-20 w-full sm:w-[420px] max-w-full h-full bg-slate-950/95 border-r border-slate-800/80 shadow-2xl flex flex-col justify-between backdrop-blur-2xl animate-in slide-in-from-left-4 duration-300">
            {/* Header du Volant */}
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  {volantMode === 'skeleton' ? 'Squelette du Profil' : 'Tissage Guidé & Rigoureux'}
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                {volantMode === 'guided' && (
                  <button
                    type="button"
                    onClick={handleBackToSkeleton}
                    className="p-1 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-cyan-400 text-xs font-mono flex items-center gap-1"
                    title="Voir l'arborescence globale"
                  >
                    <ListTree className="w-3.5 h-3.5" />
                    <span>Squelette</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsVolantOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-900 text-slate-500 hover:text-slate-300"
                  title="Masquer le volant"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Corps défilable du Volant */}
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {volantMode === 'skeleton' ? (
                <CognitoriumVolantSkeleton
                  activeNode={activeVolantNode}
                  onSelectNode={handleSelectNode}
                  isProfileFilled={isProfileFilled}
                  isKnowledgeFilled={isKnowledgeFilled}
                  isExperienceFilled={isExperienceFilled}
                  isSkillsFilled={isSkillsFilled}
                  isCapacityFilled={isCapacityFilled}
                  isTargetJobFilled={isTargetJobFilled}
                  personName={personName}
                  knowledgeName={knowledgeName}
                  experienceRole={experienceRole}
                  skillsCount={skillsList.length}
                  capacityName={capacityName}
                  targetJobTitle={customTargetTitle || selectedRomeCode}
                  onStartGuidedSequence={handleStartGuidedSequence}
                  onApplyFullPreset={handleApplyFullPreset}
                />
              ) : (
                <CognitoriumGuidedSequence
                  activeNodeType={activeVolantNode}
                  onSelectNodeType={setActiveVolantNode}
                  onBackToSkeleton={handleBackToSkeleton}
                  personName={personName}
                  setPersonName={setPersonName}
                  email={email}
                  setEmail={setEmail}
                  journeyType={journeyType}
                  setJourneyType={setJourneyType}
                  coreMotto={coreMotto}
                  setCoreMotto={setCoreMotto}
                  knowledgeName={knowledgeName}
                  setKnowledgeName={setKnowledgeName}
                  knowledgeDomain={knowledgeDomain}
                  setKnowledgeDomain={setKnowledgeDomain}
                  experienceRole={experienceRole}
                  setExperienceRole={setExperienceRole}
                  experienceContext={experienceContext}
                  setExperienceContext={setExperienceContext}
                  experiencePeriod={experiencePeriod}
                  setExperiencePeriod={setExperiencePeriod}
                  missions={missions}
                  setMissions={setMissions}
                  skillsList={skillsList}
                  setSkillsList={setSkillsList}
                  capacityName={capacityName}
                  setCapacityName={setCapacityName}
                  capacityDimension={capacityDimension}
                  setCapacityDimension={setCapacityDimension}
                  selectedRomeCode={selectedRomeCode}
                  setSelectedRomeCode={setSelectedRomeCode}
                  customTargetTitle={customTargetTitle}
                  setCustomTargetTitle={setCustomTargetTitle}
                  onApplyPresetForNode={handleApplyPresetForNode}
                  onFinalizeConnectome={handleFinalize}
                />
              )}
            </div>

            {/* Footer du Volant */}
            <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/90 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Données locales privées</span>
              </span>

              <button
                type="button"
                onClick={handleFinalize}
                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Finaliser</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </aside>
        )}

        {/* Bouton pour réouvrir le volant s'il est fermé */}
        {isTemplateDeployed && !isVolantOpen && (
          <button
            type="button"
            onClick={() => setIsVolantOpen(true)}
            className="absolute top-4 left-4 z-30 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-cyan-300 shadow-xl backdrop-blur-md flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
          >
            <ChevronRight className="w-4 h-4 text-cyan-400" />
            <span>Ouvrir Volant ({completedCount}/6)</span>
          </button>
        )}

        {/* SURFACE DU GRAPHE OBSIDIAN (Occupe tout l'espace restant à droite) */}
        <main className="flex-1 h-full relative overflow-hidden">
          <CognitoriumObsidianGraph
            isTemplateDeployed={isTemplateDeployed}
            activeNode={activeVolantNode}
            onSelectNode={handleSelectNode}
            onDeployTemplate={handleDeployTemplate}
            onApplyFullPreset={handleApplyFullPreset}
            personName={personName}
            knowledgeName={knowledgeName}
            experienceRole={experienceRole}
            experienceContext={experienceContext}
            missions={missions}
            skillsList={skillsList}
            capacityName={capacityName}
            targetJobTitle={customTargetTitle}
            selectedRomeCode={selectedRomeCode}
            onAdoptGhostNode={handleAdoptGhostNode}
          />
        </main>
      </div>

      {/* ==================================================================== */}
      {/* BARRE DU BAS : GUIDAGE & INDICATEURS DE SYNAPSE */}
      {/* ==================================================================== */}
      <footer className="relative z-20 px-6 py-2 bg-slate-950/95 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-slate-300">
            {!isTemplateDeployed
              ? "Graphe Obsidian Vierge • Cliquez au centre pour déployer le volant et votre connectome"
              : isVolantOpen
              ? "Volant actif à gauche • Cliquez sur n'importe quel nœud actif ou fantôme grisé pour l'intégrer"
              : "Graphe interactif Obsidian • Cliquez sur 'Ouvrir Volant' pour continuer votre saisie"}
          </span>
        </div>

        {isTemplateDeployed && (
          <div className="hidden md:flex items-center gap-3.5 text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Profil</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Savoirs</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Expériences</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span>Compétences</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Capacités</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Horizon ROME</span>
            </span>
            <span className="flex items-center gap-1.5 border-l border-slate-800 pl-2.5 text-slate-500">
              <span className="w-2 h-2 rounded-full border border-dashed border-slate-400" />
              <span>Nœuds pré-liés (Grisé)</span>
            </span>
          </div>
        )}
      </footer>
    </div>
  );
};
