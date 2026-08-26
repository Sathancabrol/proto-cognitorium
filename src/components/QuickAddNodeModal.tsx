import React, { useState } from 'react';
import { X, Sparkles, Plus, Check, Brain, Shield, Award, Wrench, Users, Compass, BookOpen } from 'lucide-react';
import { 
  NodeCategory, 
  AnyCognitiveNode, 
  SkillNode, 
  ExperienceNode, 
  CapacityNode, 
  HorizonJobNode, 
  KnowledgeNode,
  GraphEdge 
} from '../types';
import confetti from 'canvas-confetti';

export type QuickCreateType = 
  | 'experience' 
  | 'skill_tech' 
  | 'skill_soft' 
  | 'formation' 
  | 'knowledge'
  | 'capacity' 
  | 'horizon';

interface QuickAddNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: QuickCreateType;
  existingNodes: AnyCognitiveNode[];
  onAddNode: (newNode: AnyCognitiveNode, newEdges?: GraphEdge[]) => void;
}

const TYPE_CONFIGS: Record<QuickCreateType, {
  label: string;
  badge: string;
  icon: any;
  color: string;
  category: NodeCategory;
  description: string;
  placeholder: string;
}> = {
  experience: {
    label: 'Expérience & Mission',
    badge: 'Vécu Pro & Terrain',
    icon: Award,
    color: 'from-blue-600 to-indigo-600',
    category: 'experience',
    description: 'Une mission, un poste, une responsabilité ou un projet marquant.',
    placeholder: 'ex: Lead Développeur Full-Stack, Chef de Projet ERP...'
  },
  skill_tech: {
    label: 'Compétence Technique',
    badge: 'Hard Skill',
    icon: Wrench,
    color: 'from-indigo-600 to-purple-600',
    category: 'skill_tech',
    description: 'Outil, langage, technologie, méthode ou savoir-faire technique.',
    placeholder: 'ex: TypeScript, React, Docker, Analyse de Données...'
  },
  skill_soft: {
    label: 'Compétence Transverse',
    badge: 'Soft Skill & Humain',
    icon: Users,
    color: 'from-emerald-600 to-teal-600',
    category: 'skill_transversal',
    description: 'Aisance relationnelle, gestion des imprévus, leadership, communication.',
    placeholder: 'ex: Négociation Fournisseurs, Résolution de Conflits...'
  },
  formation: {
    label: 'Formation & Diplôme',
    badge: 'Sanctuaire Académique',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-600',
    category: 'formation',
    description: 'Diplôme d\'État, titre RNCP, certification d\'éditeur, bootcamp.',
    placeholder: 'ex: Master Informatique & IA, Certif AWS Solutions Arch...'
  },
  knowledge: {
    label: 'Savoir Théorique & Norme',
    badge: 'Corpus & Notions Fondamentales',
    icon: BookOpen,
    color: 'from-sky-600 to-blue-700',
    category: 'knowledge',
    description: 'Notion théorique, modèle scientifique, réglementation légale, norme NF / ISO ou corpus académique.',
    placeholder: 'ex: Codex des 188 Biais Cognitifs, Norme NF P98-332, Analyse de Variance (ANOVA)...'
  },
  capacity: {
    label: 'Capacité Cognitive',
    badge: 'Ordre Supérieur',
    icon: Brain,
    color: 'from-pink-600 to-rose-600',
    category: 'capacity_cognitive',
    description: 'Capacité émergente (raisonnement systémique, pensée critique, modélisation).',
    placeholder: 'ex: Modélisation des Architectures Complexes...'
  },
  horizon: {
    label: 'Objectif / Horizon ROME',
    badge: 'Métier & Ambition Cible',
    icon: Compass,
    color: 'from-amber-600 to-yellow-500',
    category: 'horizon_job',
    description: 'Métier visé, transition de carrière ou rôle cible ROME.',
    placeholder: 'ex: Architecte Solutions Cloud, Chief Technology Officer...'
  }
};

export const QuickAddNodeModal: React.FC<QuickAddNodeModalProps> = ({
  isOpen,
  onClose,
  initialType = 'skill_tech',
  existingNodes,
  onAddNode
}) => {
  const [selectedType, setSelectedType] = useState<QuickCreateType>(initialType);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [institution, setInstitution] = useState('');
  const [startYear, setStartYear] = useState<number>(new Date().getFullYear());
  const [mastery, setMastery] = useState<number>(85);
  const [parentExperienceId, setParentExperienceId] = useState<string>('');
  const [romeCode, setRomeCode] = useState<string>('');

  if (!isOpen) return null;

  const currentConfig = TYPE_CONFIGS[selectedType] || TYPE_CONFIGS.skill_tech;
  const experiences = existingNodes.filter(
    (n) => n.category === 'experience' || n.category === 'formation' || n.category === 'research_project'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = `node-manual-${selectedType}-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    let newNode: AnyCognitiveNode;
    const newEdges: GraphEdge[] = [];

    if (selectedType === 'skill_tech' || selectedType === 'skill_soft') {
      const category: NodeCategory = selectedType === 'skill_tech' ? 'skill_tech' : 'skill_transversal';
      const skillNode: SkillNode = {
        id: newId,
        name: name.trim(),
        category,
        description: description.trim() || undefined,
        baseMastery: mastery,
        acquiredYear: startYear,
        lastPracticedYear: startYear,
        halfLifeYears: selectedType === 'skill_tech' ? 3 : 7,
        decayFactor: 1.0,
        subSkills: [],
        transferabilityScore: selectedType === 'skill_soft' ? 9 : 7,
        originExperienceIds: parentExperienceId ? [parentExperienceId] : [],
        verificationStatus: 'verified',
        confidenceScore: 100,
        evidence: [
          {
            id: `ev-${Date.now()}`,
            source: 'declaration',
            label: 'Ajout manuel utilisateur',
            confidenceScore: 100,
            date: today
          }
        ]
      };
      newNode = skillNode;

      if (parentExperienceId) {
        newEdges.push({
          id: `edge-${parentExperienceId}-${newId}`,
          source: parentExperienceId,
          target: newId,
          type: 'acquired_in',
          strength: 0.9,
          label: 'Acquis dans'
        });
      }
    } else if (selectedType === 'experience' || selectedType === 'formation') {
      const expNode: ExperienceNode = {
        id: newId,
        name: name.trim(),
        category: selectedType === 'formation' ? 'formation' : 'experience',
        period: `${startYear}`,
        startYear: startYear,
        institutionOrContext: institution.trim() || 'Organisation',
        role: name.trim(),
        missions: description.trim() ? [description.trim()] : ['Réalisations & missions clés'],
        cognitiveEfforts: ['Analyse', 'Autonomie', 'Coordination'],
        description: description.trim() || undefined,
        verificationStatus: 'verified',
        confidenceScore: 100,
        evidence: [
          {
            id: `ev-${Date.now()}`,
            source: 'declaration',
            label: 'Ajout manuel utilisateur',
            confidenceScore: 100,
            date: today
          }
        ]
      };
      newNode = expNode;
    } else if (selectedType === 'knowledge') {
      const knowledgeNode: KnowledgeNode = {
        id: newId,
        name: name.trim(),
        category: 'knowledge',
        domain: institution.trim() || 'Sciences Cognitives & Normes',
        acquiredYear: startYear,
        decayRate: 'lent',
        description: description.trim() || undefined,
        verificationStatus: 'verified',
        confidenceScore: 100,
        evidence: [
          {
            id: `ev-${Date.now()}`,
            source: 'declaration',
            label: 'Ajout manuel utilisateur',
            confidenceScore: 100,
            date: today
          }
        ]
      };
      newNode = knowledgeNode;

      if (parentExperienceId) {
        newEdges.push({
          id: `edge-${parentExperienceId}-${newId}`,
          source: parentExperienceId,
          target: newId,
          type: 'acquired_in',
          strength: 0.9,
          label: 'Acquis dans'
        });
      }
    } else if (selectedType === 'capacity') {
      const capNode: CapacityNode = {
        id: newId,
        name: name.trim(),
        category: 'capacity_cognitive',
        level: mastery >= 85 ? 'expert' : (mastery >= 65 ? 'avancé' : 'fondamental'),
        underlyingSkills: [],
        cognitiveDimension: 'Raisonnement & Analyse',
        description: description.trim() || undefined,
        verificationStatus: 'verified',
        confidenceScore: 100,
        evidence: [
          {
            id: `ev-${Date.now()}`,
            source: 'declaration',
            label: 'Ajout manuel utilisateur',
            confidenceScore: 100,
            date: today
          }
        ]
      };
      newNode = capNode;
    } else {
      // Horizon Job
      const horizonNode: HorizonJobNode = {
        id: newId,
        name: name.trim(),
        category: 'horizon_job',
        romeCode: romeCode.trim() || 'M1805',
        domain: 'Numérique & Stratégie',
        matchScore: 80,
        salaryRange: '45k€ - 75k€',
        growthRate: '+14% d\'ici 2030',
        requiredSkills: [],
        criticalGaps: [],
        description: description.trim() || undefined,
        trainingPathways: [],
        verificationStatus: 'verified',
        confidenceScore: 100,
        rationale: 'Créé manuellement dans Cognitorium',
        matchingSkills: [],
        missingSkills: [],
        unlockedOpportunities: []
      };
      newNode = horizonNode;
    }

    onAddNode(newNode, newEdges.length > 0 ? newEdges : undefined);

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 }
    });

    onClose();
    setName('');
    setDescription('');
    setInstitution('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with tactical Dossier Pattern */}
        <div className="relative p-5 sm:p-6 bg-slate-900 text-white border-b border-slate-800 overflow-hidden">
          {/* Subtle Grid / Dossier Lines Background */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(
                119deg,
                rgba(255, 255, 255, 0.12) 0,
                rgba(255, 255, 255, 0.12) 1px,
                transparent 1px,
                transparent 6px
              )`
            }}
          />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${currentConfig.color} flex items-center justify-center text-white shadow-lg shadow-blue-500/20`}>
                <currentConfig.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
                    Formulaire d'Enrichissement
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200 border border-white/10">
                    {currentConfig.badge}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  Ajouter : {currentConfig.label}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Category Selector Pills */}
          <div className="relative z-10 flex items-center gap-1.5 mt-4 overflow-x-auto pb-1">
            {(Object.keys(TYPE_CONFIGS) as QuickCreateType[]).map((typeKey) => {
              const cfg = TYPE_CONFIGS[typeKey];
              const isSelected = selectedType === typeKey;
              return (
                <button
                  key={typeKey}
                  type="button"
                  onClick={() => setSelectedType(typeKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <cfg.icon className="w-3.5 h-3.5" />
                  <span>{cfg.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Label / Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Intitulé / Nom du Nœud <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={currentConfig.placeholder}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-medium text-sm transition-all"
              autoFocus
            />
          </div>

          {/* Context / Institution for Experiences & Formations */}
          {(selectedType === 'experience' || selectedType === 'formation') && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Organisme / Entreprise / Université
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="ex: Université Paris-Saclay, Startup Tech..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-medium text-sm transition-all"
              />
            </div>
          )}

          {/* Domain for Knowledge Node */}
          {selectedType === 'knowledge' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Domaine Scientifique / Cadre Normatif
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="ex: Sciences Cognitives, Normes VRD, Psychophysique, Droit RGPD..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-medium text-sm transition-all"
              />
            </div>
          )}

          {/* ROME Code for Horizon Job */}
          {selectedType === 'horizon' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Code ROME France Travail (Optionnel)
              </label>
              <input
                type="text"
                value={romeCode}
                onChange={(e) => setRomeCode(e.target.value)}
                placeholder="ex: M1805, M1802, M1402..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-medium text-sm transition-all"
              />
            </div>
          )}

          {/* Connect to Parent Experience (for Skills & Knowledge) */}
          {(selectedType === 'skill_tech' || selectedType === 'skill_soft' || selectedType === 'knowledge') && experiences.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Rattacher à une Expérience / Formation / Recherche d'Origine
              </label>
              <select
                value={parentExperienceId}
                onChange={(e) => setParentExperienceId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-medium text-sm transition-all"
              >
                <option value="">-- Aucun rattachement direct (Autonome) --</option>
                {experiences.map((exp) => (
                  <option key={exp.id} value={exp.id}>
                    {exp.name} ({exp.category === 'formation' ? 'Formation' : exp.category === 'research_project' ? 'Recherche' : 'Expérience'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Mastery Slider (for Skills & Capacities) */}
          {(selectedType === 'skill_tech' || selectedType === 'skill_soft' || selectedType === 'capacity') && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Niveau de Maîtrise / Vitalité Initiale
                </label>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                  {mastery}%
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="5"
                value={mastery}
                onChange={(e) => setMastery(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                <span>Notions (30%)</span>
                <span>Opérationnel (65%)</span>
                <span>Expert (100%)</span>
              </div>
            </div>
          )}

          {/* Start / Acquisition Year */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Année d'Acquisition / Réalisation
            </label>
            <input
              type="number"
              min="1990"
              max={new Date().getFullYear() + 5}
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-medium text-sm transition-all"
            />
          </div>

          {/* Description / Evidence Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Description & Preuves / Contexte (Optionnel)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails du contexte, réalisations clés, livrables ou certification associée..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-medium text-sm transition-all resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center gap-2 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Créer & Intégrer au Graphe</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
