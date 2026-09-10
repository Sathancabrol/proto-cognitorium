import React, { useState, useMemo } from 'react';
import { 
  User, 
  BookOpen, 
  Briefcase, 
  Cpu, 
  Zap, 
  Target, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Plus, 
  Trash2, 
  Search, 
  Wand2, 
  Info,
  Layers,
  ChevronRight,
  ListTree,
  CheckCircle2,
  HelpCircle,
  Compass,
  Award,
  Tag
} from 'lucide-react';
import { UserJourneyType } from '../../types';
import { VolantNodeType } from './CognitoriumNodeVolant';
import { searchRomeFiches } from '../../utils/romeMatching';
import { ROME_FICHES, RomeFiche } from '../../data/romeData';
import { ROME_DOMAIN_META } from '../../utils/metiersGraphData';
import {
  VALIDATED_KNOWLEDGES,
  VALIDATED_EXPERIENCE_ROLES,
  VALIDATED_SKILLS_BANK,
  VALIDATED_CAPACITIES,
  VALIDATED_MOTTOS,
  ValidatedKnowledge,
  ValidatedExperienceRole,
  ValidatedSkill,
  ValidatedCapacity
} from '../../data/cognitoriumCatalog';

interface CognitoriumGuidedSequenceProps {
  activeNodeType: VolantNodeType;
  onSelectNodeType: (type: VolantNodeType) => void;
  onBackToSkeleton: () => void;

  // Données de profil
  personName: string;
  setPersonName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  journeyType: UserJourneyType;
  setJourneyType: (val: UserJourneyType) => void;
  coreMotto: string;
  setCoreMotto: (val: string) => void;

  // Données savoirs
  knowledgeName: string;
  setKnowledgeName: (val: string) => void;
  knowledgeDomain: string;
  setKnowledgeDomain: (val: string) => void;

  // Données expérience
  experienceRole: string;
  setExperienceRole: (val: string) => void;
  experienceContext: string;
  setExperienceContext: (val: string) => void;
  experiencePeriod: string;
  setExperiencePeriod: (val: string) => void;
  missions: string[];
  setMissions: React.Dispatch<React.SetStateAction<string[]>>;

  // Données compétences
  skillsList: { name: string; category: 'skill_tech' | 'skill_relational' | 'skill_transversal'; mastery: number }[];
  setSkillsList: React.Dispatch<React.SetStateAction<{ name: string; category: 'skill_tech' | 'skill_relational' | 'skill_transversal'; mastery: number }[]>>;

  // Données capacité cognitive
  capacityName: string;
  setCapacityName: (val: string) => void;
  capacityDimension: string;
  setCapacityDimension: (val: string) => void;

  // Données métier cible ROME
  selectedRomeCode: string;
  setSelectedRomeCode: (val: string) => void;
  customTargetTitle: string;
  setCustomTargetTitle: (val: string) => void;

  // Presets & Finalisation
  onApplyPresetForNode: (type: VolantNodeType) => void;
  onFinalizeConnectome: () => void;
}

const SEQUENCE_ORDER: VolantNodeType[] = [
  'profile',
  'knowledge',
  'experience',
  'skill',
  'capacity',
  'target_job'
];

export const CognitoriumGuidedSequence: React.FC<CognitoriumGuidedSequenceProps> = ({
  activeNodeType,
  onSelectNodeType,
  onBackToSkeleton,
  personName,
  setPersonName,
  email,
  setEmail,
  journeyType,
  setJourneyType,
  coreMotto,
  setCoreMotto,
  knowledgeName,
  setKnowledgeName,
  knowledgeDomain,
  setKnowledgeDomain,
  experienceRole,
  setExperienceRole,
  experienceContext,
  setExperienceContext,
  experiencePeriod,
  setExperiencePeriod,
  missions,
  setMissions,
  skillsList,
  setSkillsList,
  capacityName,
  setCapacityName,
  capacityDimension,
  setCapacityDimension,
  selectedRomeCode,
  setSelectedRomeCode,
  customTargetTitle,
  setCustomTargetTitle,
  onApplyPresetForNode,
  onFinalizeConnectome
}) => {
  const currentIndex = SEQUENCE_ORDER.indexOf(activeNodeType);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === SEQUENCE_ORDER.length - 1;

  // Filtres & recherches par étape
  const [knowledgeCategoryFilter, setKnowledgeCategoryFilter] = useState<string>('all');
  const [knowledgeSearchQuery, setKnowledgeSearchQuery] = useState('');
  
  const [roleCategoryFilter, setRoleCategoryFilter] = useState<string>('all');
  const [newMissionInput, setNewMissionInput] = useState('');
  
  const [skillsTab, setSkillsTab] = useState<'all' | 'skill_tech' | 'skill_relational' | 'skill_transversal'>('all');
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'skill_tech' | 'skill_relational' | 'skill_transversal'>('skill_tech');
  const [newSkillMastery, setNewSkillMastery] = useState(85);

  const [romeDomainFilter, setRomeDomainFilter] = useState<string>('F'); // BTP par défaut
  const [romeSearchQuery, setRomeSearchQuery] = useState('');

  // 1. Filtrage des savoirs pré-validés
  const filteredKnowledges = useMemo(() => {
    return VALIDATED_KNOWLEDGES.filter((k) => {
      const matchCat = knowledgeCategoryFilter === 'all' || k.category === knowledgeCategoryFilter;
      const matchQuery = !knowledgeSearchQuery.trim() || 
        k.name.toLowerCase().includes(knowledgeSearchQuery.toLowerCase()) ||
        k.domain.toLowerCase().includes(knowledgeSearchQuery.toLowerCase()) ||
        k.synapseTag.toLowerCase().includes(knowledgeSearchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [knowledgeCategoryFilter, knowledgeSearchQuery]);

  // 2. Filtrage des rôles d'expérience pré-validés
  const filteredRoles = useMemo(() => {
    return VALIDATED_EXPERIENCE_ROLES.filter((r) => {
      return roleCategoryFilter === 'all' || r.category === roleCategoryFilter;
    });
  }, [roleCategoryFilter]);

  // 3. Filtrage de la banque de compétences pré-validées
  const filteredSkillsBank = useMemo(() => {
    return VALIDATED_SKILLS_BANK.filter((s) => {
      const matchTab = skillsTab === 'all' || s.category === skillsTab;
      const matchQuery = !skillSearchQuery.trim() || 
        s.name.toLowerCase().includes(skillSearchQuery.toLowerCase()) ||
        s.domain.toLowerCase().includes(skillSearchQuery.toLowerCase());
      return matchTab && matchQuery;
    });
  }, [skillsTab, skillSearchQuery]);

  // 4. Recherche et filtrage des fiches ROME
  const popularFichesForDomain = useMemo(() => {
    if (romeSearchQuery.trim()) {
      return searchRomeFiches(romeSearchQuery, 8);
    }
    // Filtrer par lettre de grand domaine
    const fiches = ROME_FICHES.filter((f) => f.code.startsWith(romeDomainFilter));
    return fiches.slice(0, 8);
  }, [romeDomainFilter, romeSearchQuery]);

  // Navigation dans la séquence
  const handlePrev = () => {
    if (!isFirst) {
      onSelectNodeType(SEQUENCE_ORDER[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (!isLast) {
      onSelectNodeType(SEQUENCE_ORDER[currentIndex + 1]);
    } else {
      onFinalizeConnectome();
    }
  };

  // Ajout manuel d'une mission
  const handleAddMission = () => {
    if (!newMissionInput.trim()) return;
    setMissions((prev) => [...prev, newMissionInput.trim()]);
    setNewMissionInput('');
  };

  const handleRemoveMission = (index: number) => {
    setMissions((prev) => prev.filter((_, i) => i !== index));
  };

  // Ajout manuel d'une compétence
  const handleAddCustomSkill = () => {
    if (!newSkillName.trim()) return;
    setSkillsList((prev) => [
      ...prev,
      {
        name: newSkillName.trim(),
        category: newSkillCategory,
        mastery: newSkillMastery
      }
    ]);
    setNewSkillName('');
  };

  // Toggle d'une compétence pré-validée
  const handleToggleValidatedSkill = (valSkill: ValidatedSkill) => {
    const exists = skillsList.some((s) => s.name.toLowerCase() === valSkill.name.toLowerCase());
    if (exists) {
      setSkillsList((prev) => prev.filter((s) => s.name.toLowerCase() !== valSkill.name.toLowerCase()));
    } else {
      setSkillsList((prev) => [
        ...prev,
        {
          name: valSkill.name,
          category: valSkill.category,
          mastery: valSkill.defaultMastery
        }
      ]);
    }
  };

  const isSkillSelected = (name: string) => {
    return skillsList.some((s) => s.name.toLowerCase() === name.toLowerCase());
  };

  const handleRemoveSkill = (index: number) => {
    setSkillsList((prev) => prev.filter((_, i) => i !== index));
  };

  // Sélection d'un savoir pré-validé
  const handleSelectValidatedKnowledge = (item: ValidatedKnowledge) => {
    setKnowledgeName(item.name);
    setKnowledgeDomain(item.domain);
  };

  // Sélection d'un rôle pré-validé
  const handleSelectValidatedRole = (item: ValidatedExperienceRole) => {
    setExperienceRole(item.role);
    setExperienceContext(item.typicalContext);
  };

  // Import des missions suggérées pour un rôle
  const handleImportRoleMissions = (item: ValidatedExperienceRole) => {
    setMissions((prev) => {
      const merged = new Set([...prev, ...item.suggestedMissions]);
      return Array.from(merged);
    });
  };

  // Import des compétences suggérées pour un rôle
  const handleImportRoleSkills = (item: ValidatedExperienceRole) => {
    setSkillsList((prev) => {
      const existingNames = new Set(prev.map((s) => s.name.toLowerCase()));
      const toAdd = item.suggestedSkills.filter((s) => !existingNames.has(s.name.toLowerCase()));
      return [...prev, ...toAdd];
    });
  };

  // Sélection d'une capacité cognitive pré-validée
  const handleSelectValidatedCapacity = (cap: ValidatedCapacity) => {
    setCapacityName(cap.name);
    setCapacityDimension(cap.dimension);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* En-tête de navigation entre étapes */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToSkeleton}
            className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
            title="Retour au squelette"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Vue Squelette</span>
          </button>

          <span className="text-[11px] font-mono text-slate-400">
            Étape <strong className="text-cyan-400">{currentIndex + 1}</strong> / 6
          </span>
        </div>

        {/* Bouton d'exemple pré-rempli pour ce nœud */}
        <button
          type="button"
          onClick={() => onApplyPresetForNode(activeNodeType)}
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:text-cyan-300 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Wand2 className="w-3 h-3" />
          <span>Exemple concret</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 1. ÉTAPE PROFIL & IDENTITÉ */}
      {/* ==================================================================== */}
      {activeNodeType === 'profile' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Nœud Profil • Cœur de Gravité</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              <strong className="text-cyan-400">Rôle synaptique :</strong> Racine du connectome. Tous vos savoirs et vos expériences de terrain s'y rattachent. Il s'illumine en cyan au centre de l'univers Obsidian.
            </p>
          </div>

          {/* Choix d'identités pré-validées */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Exemples de profils vérifiés (clic rapide) :</span>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              {[
                { name: 'Alexandre Martin', motto: 'Coordination rigoureuse et vision globale du chantier', type: 'professional' },
                { name: 'Sarah Benali', motto: 'Analyse empirique et ergonomie des situations complexes', type: 'transition' },
                { name: 'Thomas Leroy', motto: 'Conception résiliente et agilité d\'exécution système', type: 'student' }
              ].map((ex) => (
                <button
                  key={ex.name}
                  type="button"
                  onClick={() => {
                    setPersonName(ex.name);
                    setCoreMotto(ex.motto);
                    setJourneyType(ex.type as UserJourneyType);
                  }}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 text-left transition-all cursor-pointer group"
                >
                  <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">{ex.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{ex.motto}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Prénom & Nom <span className="text-cyan-400">*</span>
              </label>
              <input
                id="input-volant-person-name"
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="ex : Alexandre Martin, Sarah Benali..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-400 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Email de contact
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex : alexandre.martin@cognitorium.fr"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-400 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Posture réflexive & Parcours
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
                {[
                  { id: 'professional', label: 'Professionnel' },
                  { id: 'student', label: 'Étudiant' },
                  { id: 'transition', label: 'Reconversion' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setJourneyType(item.id as UserJourneyType)}
                    className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                      journeyType === item.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Devises / Postures Épistémiques Pré-validées */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-slate-300">
                Devise ou posture épistémique vérifiée
              </label>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {VALIDATED_MOTTOS.map((motto) => {
                  const isSelected = coreMotto === motto.label;
                  return (
                    <button
                      key={motto.label}
                      type="button"
                      onClick={() => setCoreMotto(motto.label)}
                      className={`w-full p-2 rounded-xl border text-left text-xs transition-all flex items-start justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 font-bold'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold">{motto.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{motto.stance} • <span className="text-cyan-400 font-mono">{motto.archetype}</span></div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={coreMotto}
                onChange={(e) => setCoreMotto(e.target.value)}
                placeholder="Ou saisissez votre propre devise..."
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200 text-xs focus:border-cyan-400 focus:outline-none transition-colors mt-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. ÉTAPE SAVOIRS & THÉORIES (AVEC CATALOGUE PRÉ-VALIDÉ) */}
      {/* ==================================================================== */}
      {activeNodeType === 'knowledge' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Nœud Savoirs • Corpus Théorique & Disciplines</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              <strong className="text-purple-400">Qu'est-ce qu'un Savoir ?</strong> C'est un corpus académique, une science fondamentale ou un cadre normatif (ex : Résistance des matériaux, Ergonomie cognitive, Droit des marchés). Il stabilise vos compétences et évite l'oubli.
            </p>
          </div>

          {/* Filtres par Grand Domaine */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-purple-300 font-semibold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                <span>Sélectionnez un savoir vérifié :</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {filteredKnowledges.length} choix disponibles
              </span>
            </div>

            {/* Recherche interne */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={knowledgeSearchQuery}
                onChange={(e) => setKnowledgeSearchQuery(e.target.value)}
                placeholder="Rechercher par discipline, norme, mot-clé..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:border-purple-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Onglets thématiques */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-[10px] font-mono scrollbar-none">
              {[
                { id: 'all', label: 'Tous' },
                { id: 'Sciences de l\'Ingénieur & BTP', label: 'BTP & Ingénierie' },
                { id: 'Informatique & Systèmes', label: 'Tech & Systèmes' },
                { id: 'Sciences Humaines & Cognition', label: 'Sciences Humaines' },
                { id: 'Management, Droit & Économie', label: 'Management & Droit' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setKnowledgeCategoryFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors cursor-pointer border ${
                    knowledgeCategoryFilter === tab.id
                      ? 'bg-purple-600/30 border-purple-400 text-purple-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Liste scrollable des savoirs pré-validés */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredKnowledges.map((k) => {
                const isSelected = knowledgeName === k.name;
                return (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => handleSelectValidatedKnowledge(k)}
                    className={`w-full p-2 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 group ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-400 text-purple-200 shadow-md shadow-purple-950/40'
                        : 'bg-slate-900/80 border-slate-800 hover:border-purple-500/40 text-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span className={isSelected ? 'text-purple-300' : 'group-hover:text-purple-300'}>{k.name}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
                          {k.synapseTag}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 leading-snug line-clamp-2">{k.description}</div>
                    </div>
                    {isSelected && (
                      <span className="shrink-0 p-1 rounded-full bg-purple-500/20 text-purple-400">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Champs d'ajustement manuel */}
          <div className="space-y-2 pt-1 border-t border-slate-800/80">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Discipline active <span className="text-purple-400">*</span>
              </label>
              <input
                type="text"
                value={knowledgeName}
                onChange={(e) => setKnowledgeName(e.target.value)}
                placeholder="Cliquez sur un savoir ci-dessus ou saisissez le vôtre..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-purple-400 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Domaine de rattachement
              </label>
              <input
                type="text"
                value={knowledgeDomain}
                onChange={(e) => setKnowledgeDomain(e.target.value)}
                placeholder="ex : Génie Civil & Mécanique, Sciences Cognitives..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-purple-400 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. ÉTAPE EXPÉRIENCE & MISSIONS DE TERRAIN */}
      {/* ==================================================================== */}
      {activeNodeType === 'experience' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-blue-300 font-bold text-xs">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Nœud Expérience • Ancrage Réel & Tâches Concrètes</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              <strong className="text-blue-400">Rôle synaptique (composed_of) :</strong> Votre expérience incarne votre pratique de terrain. Chaque tâche satellite génère un nœud bleu céleste dans le connectome pour alimenter vos compétences.
            </p>
          </div>

          {/* Rôles Types Pré-validés */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-blue-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Rôles types vérifiés avec missions associées :</span>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
              {filteredRoles.map((roleDef) => {
                const isSelected = experienceRole === roleDef.role;
                return (
                  <div
                    key={roleDef.role}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-400'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleSelectValidatedRole(roleDef)}
                        className="text-left cursor-pointer flex-1"
                      >
                        <div className="text-xs font-bold text-slate-200 hover:text-blue-300 flex items-center gap-1.5">
                          <span>{roleDef.role}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800">
                            {roleDef.category}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">{roleDef.typicalContext}</div>
                      </button>

                      {isSelected && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleImportRoleMissions(roleDef)}
                            className="px-2 py-0.8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-mono transition-colors cursor-pointer"
                            title="Importer les missions suggérées"
                          >
                            + Missions
                          </button>
                          <button
                            type="button"
                            onClick={() => handleImportRoleSkills(roleDef)}
                            className="px-2 py-0.8 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-[10px] font-mono transition-colors cursor-pointer"
                            title="Importer les compétences associées"
                          >
                            + Compétences
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Intitulé du poste exercé <span className="text-blue-400">*</span>
              </label>
              <input
                type="text"
                value={experienceRole}
                onChange={(e) => setExperienceRole(e.target.value)}
                placeholder="ex : Conducteur de travaux VRD, Développeur Full-Stack..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Entreprise / Contexte
                </label>
                <input
                  type="text"
                  value={experienceContext}
                  onChange={(e) => setExperienceContext(e.target.value)}
                  placeholder="ex : SOBECA, Bouygues, Startup..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Période
                </label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={experiencePeriod}
                    onChange={(e) => setExperiencePeriod(e.target.value)}
                    placeholder="ex : 2023 - 2025"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-blue-400 focus:outline-none transition-colors"
                  />
                  {['2023 - 2025', 'En cours'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setExperiencePeriod(p)}
                      className="px-2 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-mono text-slate-400 hover:text-slate-200"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Missions de terrain / Tâches satellites */}
            <div className="space-y-2 pt-1 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                  <ListTree className="w-3.5 h-3.5 text-blue-400" />
                  <span>Missions de terrain (Nœuds satellites)</span>
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  {missions.length} mission(s)
                </span>
              </div>

              {/* Suggestions rapides de missions pré-validées */}
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400">Suggestions vérifiées (cliquez pour ajouter) :</span>
                <div className="flex flex-wrap gap-1">
                  {[
                    'Pilotage des sous-traitants & cadence',
                    'Contrôle qualité, sécurité & DOE',
                    'Gestion approvisionnements réseaux',
                    'Animation quarts d\'heure sécurité',
                    'Conception architectures logicielles',
                    'Arbitrage budgétaire & coûts'
                  ].map((m) => {
                    const alreadyAdded = missions.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        disabled={alreadyAdded}
                        onClick={() => setMissions((prev) => [...prev, m])}
                        className={`text-[10px] px-2 py-1 rounded-lg border transition-all ${
                          alreadyAdded
                            ? 'bg-slate-900/40 border-slate-800/40 text-slate-600 cursor-default'
                            : 'bg-blue-950/40 hover:bg-blue-900/50 border-blue-500/30 text-blue-300 cursor-pointer'
                        }`}
                      >
                        {alreadyAdded ? '✓ ' : '+ '} {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMissionInput}
                  onChange={(e) => setNewMissionInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMission())}
                  placeholder="Ajouter une mission concrète de terrain..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-blue-400 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddMission}
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter</span>
                </button>
              </div>

              {/* Liste des missions actives */}
              {missions.length > 0 && (
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {missions.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between text-slate-200"
                    >
                      <span className="flex items-center gap-1.5 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        {m}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMission(idx)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. ÉTAPE COMPÉTENCES (BANQUE PRÉ-VALIDÉE PAR CATÉGORIE) */}
      {/* ==================================================================== */}
      {activeNodeType === 'skill' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-3 rounded-xl bg-teal-950/20 border border-teal-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-teal-300 font-bold text-xs">
              <Cpu className="w-4 h-4 text-teal-400" />
              <span>Nœud Compétences • Savoir-Faire Opératoires</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              <strong className="text-teal-400">Rôle synaptique :</strong> Extraites de vos missions vécues, elles matérialisent votre valeur d'action. Elles ouvrent l'accès aux fiches métiers ROME de manière vérifiable.
            </p>
          </div>

          {/* Banque de Compétences Pré-Validées */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-teal-300 font-semibold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-teal-400" />
                <span>Banque de compétences vérifiées (cliquez pour activer) :</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {skillsList.length} activée(s)
              </span>
            </div>

            {/* Onglets Techniques / Relationnelles / Transversales */}
            <div className="flex gap-1 overflow-x-auto text-[10px] font-mono">
              {[
                { id: 'all', label: 'Toutes' },
                { id: 'skill_tech', label: '🛠️ Techniques' },
                { id: 'skill_relational', label: '🤝 Relationnelles' },
                { id: 'skill_transversal', label: '🧭 Transversales' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSkillsTab(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors cursor-pointer border ${
                    skillsTab === tab.id
                      ? 'bg-teal-600/30 border-teal-400 text-teal-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Chips cliquables de compétences */}
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 max-h-48 overflow-y-auto space-y-1.5">
              <div className="flex flex-wrap gap-1.5">
                {filteredSkillsBank.map((s) => {
                  const selected = isSkillSelected(s.name);
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => handleToggleValidatedSkill(s)}
                      className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                        selected
                          ? 'bg-teal-500/20 border-teal-400 text-teal-200 font-bold shadow-sm shadow-teal-500/20'
                          : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {selected ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>{s.name}</span>
                      <span className="text-[9px] font-mono opacity-60">({s.domain})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Formulaire d'ajout personnalisé si nécessaire */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
            <span className="text-[11px] font-mono text-slate-300 font-semibold block">
              Ou ajouter une compétence sur-mesure :
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Nom de la compétence..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-teal-400 focus:outline-none transition-colors"
              />
              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value as any)}
                className="px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-teal-400 focus:outline-none"
              >
                <option value="skill_tech">Technique</option>
                <option value="skill_relational">Relationnelle</option>
                <option value="skill_transversal">Transversale</option>
              </select>
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

          {/* Liste des compétences actuellement attachées */}
          {skillsList.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-slate-400">Compétences reliées au connectome :</div>
              <div className="flex flex-wrap gap-1.5">
                {skillsList.map((sk, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-300 text-xs font-mono"
                  >
                    <span>{sk.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(idx)}
                      className="text-slate-400 hover:text-rose-400 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. ÉTAPE CAPACITÉ COGNITIVE (MÉTACOGNITION & RÉGULATION) */}
      {/* ==================================================================== */}
      {activeNodeType === 'capacity' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Nœud Capacité • Métacognition & Régulation</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              <strong className="text-emerald-400">Qu'est-ce qu'une capacité cognitive ?</strong> C'est une méta-propriété émergente : comment votre esprit réagit sous stress, dans la complexité ou face à l'imprévu (ex : arbitrage sous contrainte, régulation du stress de cadence).
            </p>
          </div>

          {/* Sélection parmi les 6 capacités cognitives pré-validées */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-emerald-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Capacités cognitives fondamentales pré-validées :</span>
            </span>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {VALIDATED_CAPACITIES.map((cap) => {
                const isSelected = capacityName === cap.name;
                return (
                  <button
                    key={cap.name}
                    type="button"
                    onClick={() => handleSelectValidatedCapacity(cap)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-400 text-emerald-200 shadow-md shadow-emerald-950/40'
                        : 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/40 text-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                        <span>{cap.name}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {cap.dimension}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">{cap.description}</div>
                      <div className="text-[10px] text-emerald-400/80 font-mono italic">
                        Exemple terrain : {cap.manifestation}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="shrink-0 p-1 rounded-full bg-emerald-500/20 text-emerald-400 mt-1">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 pt-1 border-t border-slate-800">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Capacité active sélectionnée <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                value={capacityName}
                onChange={(e) => setCapacityName(e.target.value)}
                placeholder="Cliquez sur une capacité ci-dessus ou saisissez la vôtre..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-emerald-400 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Dimension réflexive
              </label>
              <select
                value={capacityDimension}
                onChange={(e) => setCapacityDimension(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-emerald-400 focus:outline-none"
              >
                <option value="Adaptabilité & Imprévus">Adaptabilité & Imprévus</option>
                <option value="Régulation de la Charge Mentale">Régulation de la Charge Mentale</option>
                <option value="Pensée Systémique">Pensée Systémique</option>
                <option value="Décision sous Contrainte">Décision sous Contrainte</option>
                <option value="Apprentissage Métacognitif">Apprentissage Métacognitif</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 6. ÉTAPE MÉTIER CIBLE ROME (AVEC DOMAINES DU STYLE GRAPHE DES MÉTIERS) */}
      {/* ==================================================================== */}
      {activeNodeType === 'target_job' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <Target className="w-4 h-4 text-amber-400" />
              <span>Nœud Métier Cible • Référentiel Officiel ROME</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              <strong className="text-amber-400">Rôle synaptique (unlocks_horizon) :</strong> L'horizon professionnel vers lequel converge votre profil. Il active le calcul d'affinité synaptique et la projection de carrière dans l'univers ROME.
            </p>
          </div>

          {/* Sélecteur de Grand Domaine ROME (Style Graphe des Métiers) */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-amber-300 font-semibold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Grands Domaines ROME (Style Graphe des Métiers) :</span>
            </span>

            {/* Boutons des Domaines A à N */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
              {Object.entries(ROME_DOMAIN_META).map(([letter, meta]) => {
                const isSelected = romeDomainFilter === letter;
                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => {
                      setRomeDomainFilter(letter);
                      setRomeSearchQuery('');
                    }}
                    className={`p-1.5 rounded-xl border text-center font-mono text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-white text-white font-bold scale-105 shadow-md'
                        : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 bg-slate-900/80'
                    }`}
                    style={{
                      backgroundColor: isSelected ? meta.color : undefined
                    }}
                    title={`Domaine ${letter} - ${meta.short}`}
                  >
                    <div className="font-bold">{letter}</div>
                    <div className="text-[9px] truncate">{meta.short}</div>
                  </button>
                );
              })}
            </div>

            {/* Champ de recherche ROME */}
            <div className="relative pt-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="text"
                value={romeSearchQuery}
                onChange={(e) => setRomeSearchQuery(e.target.value)}
                placeholder="Rechercher parmi les 1 911 fiches ROME officielles..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-amber-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Liste scrollable des métiers ROME filtrés */}
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
              {popularFichesForDomain.map((fiche) => {
                const isSelected = selectedRomeCode === fiche.code;
                const domainLetter = fiche.code.charAt(0);
                const meta = ROME_DOMAIN_META[domainLetter] || { color: '#F59E0B' };

                return (
                  <button
                    key={fiche.code}
                    type="button"
                    onClick={() => {
                      setSelectedRomeCode(fiche.code);
                      setCustomTargetTitle(fiche.libelle);
                    }}
                    className={`w-full p-2 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-400 text-amber-200 font-bold'
                        : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/40 text-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="font-mono text-[10px] px-1.5 py-0.2 rounded font-bold text-slate-950"
                          style={{ backgroundColor: meta.color }}
                        >
                          {fiche.code}
                        </span>
                        <span className="font-semibold text-slate-100">{fiche.libelle}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{fiche.domaine}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Titre sélectionné */}
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Métier cible actif <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={customTargetTitle}
                onChange={(e) => setCustomTargetTitle(e.target.value)}
                placeholder="ex : Conducteur de travaux BTP & VRD"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-amber-400 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* BARRE DE PIED DE PAGE : NAVIGATION PRÉCÉDENT / SUIVANT / VALIDER */}
      {/* ==================================================================== */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 mt-auto">
        <button
          type="button"
          onClick={handlePrev}
          disabled={isFirst}
          className={`px-3 py-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-colors ${
            isFirst
              ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-600 bg-slate-950'
              : 'border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white bg-slate-900 cursor-pointer'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Précédent</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            isLast
              ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
          }`}
        >
          <span>{isLast ? 'Valider mon Connectome' : 'Nœud Suivant'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
