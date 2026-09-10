import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  User, 
  Briefcase, 
  Target, 
  Cpu, 
  BookOpen, 
  Zap, 
  Search, 
  Plus, 
  Trash2, 
  ArrowRight,
  HelpCircle,
  Wand2,
  Sliders,
  Award
} from 'lucide-react';
import { UserJourneyType } from '../../types';
import { searchRomeFiches } from '../../utils/romeMatching';
import { ROME_FICHES, RomeFiche } from '../../data/romeData';

export type VolantNodeType = 
  | 'profile' 
  | 'target_job' 
  | 'experience' 
  | 'skill' 
  | 'knowledge' 
  | 'capacity';

interface CognitoriumNodeVolantProps {
  nodeType: VolantNodeType;
  onClose: () => void;
  onNextNode?: () => void;

  // Données de profil
  personName: string;
  setPersonName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  journeyType: UserJourneyType;
  setJourneyType: (val: UserJourneyType) => void;
  coreMotto: string;
  setCoreMotto: (val: string) => void;

  // Données métier cible ROME
  selectedRomeCode: string;
  setSelectedRomeCode: (val: string) => void;
  customTargetTitle: string;
  setCustomTargetTitle: (val: string) => void;

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

  // Données savoirs
  knowledgeName: string;
  setKnowledgeName: (val: string) => void;
  knowledgeDomain: string;
  setKnowledgeDomain: (val: string) => void;

  // Données capacité cognitive
  capacityName: string;
  setCapacityName: (val: string) => void;
  capacityDimension: string;
  setCapacityDimension: (val: string) => void;

  // Callback pour pré-remplir un exemple concret
  onApplyPresetForNode: (type: VolantNodeType) => void;
}

const POPULAR_ROME_TARGETS = [
  { code: 'F1201', title: 'Conducteur de travaux BTP & VRD', domain: 'BTP & Construction' },
  { code: 'M1805', title: 'Développeur Full-Stack & Systèmes', domain: 'Numérique & Logiciel' },
  { code: 'M1402', title: 'Ergonome & Facteurs Humains', domain: 'Sciences Cognitives' },
  { code: 'M1403', title: 'Chef de projet Études & Organisation', domain: 'Stratégie & Conseil' },
  { code: 'K2102', title: 'Coordinateur Pédagogique & Formation', domain: 'Éducation' },
  { code: 'H1502', title: 'Ingénieur QSE & Risques', domain: 'Industrie & Sécurité' },
  { code: 'M1508', title: 'Conseiller en Évolution Professionnelle', domain: 'Ressources Humaines' }
];

export const CognitoriumNodeVolant: React.FC<CognitoriumNodeVolantProps> = ({
  nodeType,
  onClose,
  onNextNode,
  personName,
  setPersonName,
  email,
  setEmail,
  journeyType,
  setJourneyType,
  coreMotto,
  setCoreMotto,
  selectedRomeCode,
  setSelectedRomeCode,
  customTargetTitle,
  setCustomTargetTitle,
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
  knowledgeName,
  setKnowledgeName,
  knowledgeDomain,
  setKnowledgeDomain,
  capacityName,
  setCapacityName,
  capacityDimension,
  setCapacityDimension,
  onApplyPresetForNode
}) => {
  // États locaux
  const [romeSearchQuery, setRomeSearchQuery] = useState(customTargetTitle || selectedRomeCode || '');
  const [isRomeDropdownOpen, setIsRomeDropdownOpen] = useState(false);
  const [newMissionInput, setNewMissionInput] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'skill_tech' | 'skill_relational' | 'skill_transversal'>('skill_tech');

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsRomeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Recherche dynamique des fiches ROME
  const filteredRomeFiches = useMemo(() => {
    if (!romeSearchQuery.trim()) {
      return POPULAR_ROME_TARGETS.map(p => ({
        code: p.code,
        libelle: p.title,
        grandDomaine: p.domain,
        domaine: '',
        transitionEcologique: '',
        transitionNumerique: '',
        transitionDemographique: '',
        emploiCadre: '',
        emploiReglemente: ''
      }));
    }

    const query = romeSearchQuery.trim();
    if (/^[a-zA-Z][0-9]{0,4}$/i.test(query)) {
      const codeUpper = query.toUpperCase();
      const codeMatches = ROME_FICHES.filter(f => f.code.toUpperCase().startsWith(codeUpper)).slice(0, 20);
      if (codeMatches.length > 0) return codeMatches;
    }

    const textMatches = searchRomeFiches(query, 25);
    if (textMatches.length > 0) return textMatches;

    const qLower = query.toLowerCase();
    return ROME_FICHES.filter(f => 
      f.libelle.toLowerCase().includes(qLower) || 
      f.domaine.toLowerCase().includes(qLower)
    ).slice(0, 20);
  }, [romeSearchQuery]);

  const handleSelectRomeJob = (code: string, title: string) => {
    setSelectedRomeCode(code);
    setCustomTargetTitle(title);
    setRomeSearchQuery(title);
    setIsRomeDropdownOpen(false);
  };

  const handleAddMission = () => {
    if (!newMissionInput.trim()) return;
    const missionText = newMissionInput.trim();
    setMissions(prev => [...prev, missionText]);
    setNewMissionInput('');

    // Déduction automatique d'une compétence liée si la liste est courte
    if (skillsList.length < 5) {
      const deducedName = missionText.length > 28 ? missionText.slice(0, 26) + '…' : missionText;
      setSkillsList(prev => [...prev, { name: deducedName, category: 'skill_tech', mastery: 85 }]);
    }
  };

  const handleRemoveMission = (idx: number) => {
    setMissions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkillsList(prev => [
      ...prev,
      { name: newSkillName.trim(), category: newSkillCategory, mastery: 85 }
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (idx: number) => {
    setSkillsList(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateSkillMastery = (idx: number, val: number) => {
    setSkillsList(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], mastery: val };
      return next;
    });
  };

  // Métadonnées du volant selon le nœud
  const nodeMeta = useMemo(() => {
    switch (nodeType) {
      case 'profile':
        return {
          title: 'Volant du Nœud Profil & Identité',
          desc: 'Le cœur de votre connectome personnel. Renseignez votre identité pour allumer le nœud central.',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          glow: 'shadow-cyan-500/10',
          icon: <User className="w-5 h-5 text-cyan-400" />
        };
      case 'target_job':
        return {
          title: 'Volant du Nœud Métier Cible (ROME)',
          desc: 'Votre cap vocationnel relié au répertoire officiel France Travail (1 911 fiches).',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          glow: 'shadow-amber-500/10',
          icon: <Target className="w-5 h-5 text-amber-400" />
        };
      case 'experience':
        return {
          title: 'Volant du Nœud Expérience & Terrain',
          desc: 'Votre expérience de référence qui ancre vos compétences dans une pratique vérifiable.',
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          glow: 'shadow-blue-500/10',
          icon: <Briefcase className="w-5 h-5 text-blue-400" />
        };
      case 'skill':
        return {
          title: 'Volant du Nœud Compétences & Savoir-Faire',
          desc: 'Vos compétences techniques, relationnelles et transversales qui tissent le réseau.',
          badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
          glow: 'shadow-teal-500/10',
          icon: <Cpu className="w-5 h-5 text-teal-400" />
        };
      case 'knowledge':
        return {
          title: 'Volant du Nœud Savoirs & Théorie',
          desc: 'Les connaissances théoriques, normes, concepts et cadres méthodologiques acquis.',
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          glow: 'shadow-purple-500/10',
          icon: <BookOpen className="w-5 h-5 text-purple-400" />
        };
      case 'capacity':
        return {
          title: 'Volant du Nœud Capacité Cognitive',
          desc: 'La dimension cognitive transversale mobilisée face aux aléas et situations complexes.',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          glow: 'shadow-emerald-500/10',
          icon: <Zap className="w-5 h-5 text-emerald-400" />
        };
    }
  }, [nodeType]);

  return (
    <div
      id="cognitorium-node-volant"
      className="w-full max-w-xl bg-[#090C16]/95 border border-slate-700/80 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95"
      style={{ maxHeight: '85vh' }}
    >
      {/* En-tête du Volant */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-md">
            {nodeMeta.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${nodeMeta.badgeColor}`}>
                Volant de Nœud
              </span>
              <span className="text-[11px] text-slate-400 font-mono">• Édition Interactive</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 mt-0.5">
              {nodeMeta.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Bouton d'aide rapide pour remplir ce nœud avec un exemple */}
          <button
            type="button"
            onClick={() => onApplyPresetForNode(nodeType)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Remplir ce nœud avec un exemple de test immédiat"
          >
            <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Exemple rapide</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Fermer le volant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Corps du Volant : Champs selon le type de nœud */}
      <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs font-sans">
        <p className="text-xs text-slate-400 leading-relaxed">
          {nodeMeta.desc}
        </p>

        {/* 1. VOLANT PROFIL */}
        {nodeType === 'profile' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Prénom & Nom <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="Ex : Alexandre Martin"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Adresse e-mail (privée & locale)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alexandre@cognitorium.fr"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Parcours de vie actuel
                </label>
                <select
                  value={journeyType}
                  onChange={(e) => setJourneyType(e.target.value as UserJourneyType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-xs font-mono text-slate-200 focus:outline-none"
                >
                  <option value="professional">Professionnel en activité</option>
                  <option value="transition">Reconversion / Transition</option>
                  <option value="student">Étudiant / Jeune diplômé</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Devise ou posture professionnelle
              </label>
              <input
                type="text"
                value={coreMotto}
                onChange={(e) => setCoreMotto(e.target.value)}
                placeholder="Ex : Rigueur technique, coordination humaine et zéro improvisation"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {/* 2. VOLANT MÉTIER CIBLE (ROME) */}
        {nodeType === 'target_job' && (
          <div className="space-y-3.5" ref={dropdownRef}>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono text-slate-300">
                Rechercher un métier cible officiel (ROME)
              </label>
              {selectedRomeCode && (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
                  Code ROME : {selectedRomeCode}
                </span>
              )}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={romeSearchQuery}
                onFocus={() => setIsRomeDropdownOpen(true)}
                onChange={(e) => {
                  setRomeSearchQuery(e.target.value);
                  setCustomTargetTitle(e.target.value);
                  setIsRomeDropdownOpen(true);
                }}
                placeholder="Tapez un métier ou code (ex : Conducteur de travaux, M1805, Ergonome...)"
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-colors"
                autoFocus
              />
              {romeSearchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setRomeSearchQuery('');
                    setCustomTargetTitle('');
                    setSelectedRomeCode('');
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Liste déroulante ROME */}
              {isRomeDropdownOpen && (
                <div className="absolute z-50 left-0 right-0 top-full mt-1.5 max-h-56 overflow-y-auto rounded-2xl bg-[#0C0F1D] border border-amber-500/40 shadow-2xl p-2 space-y-1 backdrop-blur-xl">
                  <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-1 mb-1">
                    <span>{filteredRomeFiches.length} Fiches disponibles</span>
                    <span className="text-amber-400">Cliquez pour associer</span>
                  </div>

                  {filteredRomeFiches.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-400">
                      <p>Aucune fiche officielle exacte.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomTargetTitle(romeSearchQuery);
                          setIsRomeDropdownOpen(false);
                        }}
                        className="mt-2 px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-mono hover:bg-amber-900 transition-colors"
                      >
                        Utiliser « {romeSearchQuery} » comme cible libre
                      </button>
                    </div>
                  ) : (
                    filteredRomeFiches.map((fiche) => (
                      <button
                        key={fiche.code}
                        type="button"
                        onClick={() => handleSelectRomeJob(fiche.code, fiche.libelle)}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-900 transition-all flex items-center justify-between gap-2 group cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/70 border border-amber-500/30 px-1.5 py-0.5 rounded">
                              {fiche.code}
                            </span>
                            <span className="text-xs font-medium text-slate-100 group-hover:text-amber-200 truncate">
                              {fiche.libelle}
                            </span>
                          </div>
                          {fiche.grandDomaine && (
                            <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                              {fiche.grandDomaine}
                            </span>
                          )}
                        </div>
                        {selectedRomeCode === fiche.code && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Suggestions rapides */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] font-mono text-slate-500 self-center mr-1">Raccourcis :</span>
              {POPULAR_ROME_TARGETS.map((pop) => (
                <button
                  key={pop.code}
                  type="button"
                  onClick={() => handleSelectRomeJob(pop.code, pop.title)}
                  className={`text-[10px] font-mono px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                    selectedRomeCode === pop.code
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {pop.code} • {pop.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. VOLANT EXPÉRIENCE */}
        {nodeType === 'experience' && (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Intitulé du poste ou rôle
                </label>
                <input
                  type="text"
                  value={experienceRole}
                  onChange={(e) => setExperienceRole(e.target.value)}
                  placeholder="Ex : Conducteur de travaux VRD, Développeur..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Entreprise / Cadre
                </label>
                <input
                  type="text"
                  value={experienceContext}
                  onChange={(e) => setExperienceContext(e.target.value)}
                  placeholder="Ex : SOBECA, SNCF..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Période exercée
              </label>
              <input
                type="text"
                value={experiencePeriod}
                onChange={(e) => setExperiencePeriod(e.target.value)}
                placeholder="Ex : 2023 - 2025"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Missions de terrain */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-mono text-slate-300">
                Actions et missions concrètes (engendrent des sous-nœuds de tâches)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMissionInput}
                  onChange={(e) => setNewMissionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMission();
                    }
                  }}
                  placeholder="Ex : Implantation de réseaux, contrôle sécurité PPSPS..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddMission}
                  className="px-3 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter</span>
                </button>
              </div>

              {missions.length > 0 && (
                <div className="space-y-1.5 pt-1 max-h-36 overflow-y-auto">
                  {missions.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs text-slate-200"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                        <span className="truncate">{m}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMission(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. VOLANT COMPÉTENCE */}
        {nodeType === 'skill' && (
          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Ex : Métrés VRD, TypeScript, Négociation..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500"
                autoFocus
              />
              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value as any)}
                className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-teal-500"
              >
                <option value="skill_tech">Technique</option>
                <option value="skill_relational">Humaine / Relationnelle</option>
                <option value="skill_transversal">Transversale</option>
              </select>
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-2.5 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 border border-teal-500/40 text-teal-300 text-xs font-mono font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>

            {/* Liste des compétences */}
            {skillsList.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pt-1">
                {skillsList.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-slate-200 block truncate">{skill.name}</span>
                      <span className="text-[10px] text-teal-400 font-mono">
                        {skill.category === 'skill_tech' ? 'Technique' : skill.category === 'skill_relational' ? 'Humaine' : 'Transversale'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span>{skill.mastery}%</span>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={skill.mastery}
                        onChange={(e) => handleUpdateSkillMastery(idx, parseInt(e.target.value))}
                        className="w-20 h-1 bg-slate-800 accent-teal-400 rounded-lg cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-mono italic">
                Aucune compétence pour l’instant. Ajoutez-en ou cliquez sur « Exemple rapide ».
              </p>
            )}
          </div>
        )}

        {/* 5. VOLANT SAVOIRS & THÉORIE */}
        {nodeType === 'knowledge' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Intitulé du corpus de connaissances théoriques
              </label>
              <input
                type="text"
                value={knowledgeName}
                onChange={(e) => setKnowledgeName(e.target.value)}
                placeholder="Ex : Réglementation VRD & Normes NF, Psychologie Cognitive..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Domaine disciplinaire
              </label>
              <input
                type="text"
                value={knowledgeDomain}
                onChange={(e) => setKnowledgeDomain(e.target.value)}
                placeholder="Ex : Génie Civil, Ergonomie, Informatique Théorique..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {/* 6. VOLANT CAPACITÉ COGNITIVE */}
        {nodeType === 'capacity' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Capacité cognitive transversale émergeante
              </label>
              <input
                type="text"
                value={capacityName}
                onChange={(e) => setCapacityName(e.target.value)}
                placeholder="Ex : Adaptabilité & Régulation des aléas de terrain"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Dimension cognitive principale
              </label>
              <select
                value={capacityDimension}
                onChange={(e) => setCapacityDimension(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-xs font-mono text-slate-200 focus:outline-none"
              >
                <option value="Adaptabilité & Imprévus">Adaptabilité & Imprévus</option>
                <option value="Raisonnement & Analyse">Raisonnement & Analyse</option>
                <option value="Coordination & Systémique">Coordination & Systémique</option>
                <option value="Spatial & Abstraction">Spatial & Abstraction</option>
                <option value="Humain & Médiation">Humain & Médiation</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Pied du Volant : Actions */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
        >
          Valider ce nœud
        </button>

        {onNextNode && (
          <button
            type="button"
            onClick={onNextNode}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <span>Nœud suivant</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
