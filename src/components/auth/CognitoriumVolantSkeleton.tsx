import React from 'react';
import { 
  User, 
  BookOpen, 
  Briefcase, 
  Cpu, 
  Zap, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  CircleDashed,
  Sparkles,
  GitFork,
  ArrowDown
} from 'lucide-react';
import { VolantNodeType } from './CognitoriumNodeVolant';

interface CognitoriumVolantSkeletonProps {
  activeNode: VolantNodeType | null;
  onSelectNode: (nodeType: VolantNodeType) => void;
  isProfileFilled: boolean;
  isKnowledgeFilled: boolean;
  isExperienceFilled: boolean;
  isSkillsFilled: boolean;
  isCapacityFilled: boolean;
  isTargetJobFilled: boolean;
  personName: string;
  knowledgeName: string;
  experienceRole: string;
  skillsCount: number;
  capacityName: string;
  targetJobTitle: string;
  onStartGuidedSequence: () => void;
  onApplyFullPreset: () => void;
}

interface SkeletonItemDef {
  id: VolantNodeType;
  stepNumber: number;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  isFilled: boolean;
  currentValue: string;
  relationType: string;
  relationDescription: string;
}

export const CognitoriumVolantSkeleton: React.FC<CognitoriumVolantSkeletonProps> = ({
  activeNode,
  onSelectNode,
  isProfileFilled,
  isKnowledgeFilled,
  isExperienceFilled,
  isSkillsFilled,
  isCapacityFilled,
  isTargetJobFilled,
  personName,
  knowledgeName,
  experienceRole,
  skillsCount,
  capacityName,
  targetJobTitle,
  onStartGuidedSequence,
  onApplyFullPreset
}) => {
  const skeletonItems: SkeletonItemDef[] = [
    {
      id: 'profile',
      stepNumber: 1,
      label: 'Nœud Profil & Identité',
      sublabel: 'Cœur de gravité épistémique & posture réflexive',
      icon: <User className="w-4 h-4" />,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/40 bg-cyan-950/20',
      isFilled: isProfileFilled,
      currentValue: personName.trim() || 'Non renseigné (en attente)',
      relationType: 'Nœud Racine',
      relationDescription: 'Centre gravitationnel du connectome'
    },
    {
      id: 'knowledge',
      stepNumber: 2,
      label: 'Savoirs & Théories',
      sublabel: 'Corpus conceptuels et disciplines fondamentales',
      icon: <BookOpen className="w-4 h-4" />,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/40 bg-purple-950/20',
      isFilled: isKnowledgeFilled,
      currentValue: knowledgeName.trim() || 'Non renseigné (en attente)',
      relationType: 'requires_knowledge',
      relationDescription: 'Relié au profil pour sous-tendre les actions'
    },
    {
      id: 'experience',
      stepNumber: 3,
      label: 'Expériences & Terrain',
      sublabel: 'Ancrage concret et missions de terrain',
      icon: <Briefcase className="w-4 h-4" />,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/40 bg-blue-950/20',
      isFilled: isExperienceFilled,
      currentValue: experienceRole.trim() || 'Non renseigné (en attente)',
      relationType: 'composed_of',
      relationDescription: 'Relié au profil par les missions réelles'
    },
    {
      id: 'skill',
      stepNumber: 4,
      label: 'Compétences & Savoir-faire',
      sublabel: 'Techniques, relationnelles et transversales',
      icon: <Cpu className="w-4 h-4" />,
      color: 'text-teal-400',
      borderColor: 'border-teal-500/40 bg-teal-950/20',
      isFilled: isSkillsFilled,
      currentValue: skillsCount > 0 ? `${skillsCount} compétence(s) active(s)` : 'Non renseigné (en attente)',
      relationType: 'acquired_in',
      relationDescription: 'Germent des tâches et de l’expérience'
    },
    {
      id: 'capacity',
      stepNumber: 5,
      label: 'Capacités Cognitives',
      sublabel: 'Adaptabilité, régulation et métacognition',
      icon: <Zap className="w-4 h-4" />,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/40 bg-emerald-950/20',
      isFilled: isCapacityFilled,
      currentValue: capacityName.trim() || 'Non renseigné (en attente)',
      relationType: 'feeds_capacity',
      relationDescription: 'Couronne le profil par transfert d’acquis'
    },
    {
      id: 'target_job',
      stepNumber: 6,
      label: 'Métier Cible & ROME',
      sublabel: 'Horizon vocationnel et matching en temps réel',
      icon: <Target className="w-4 h-4" />,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/40 bg-amber-950/20',
      isFilled: isTargetJobFilled,
      currentValue: targetJobTitle.trim() || 'Non renseigné (en attente)',
      relationType: 'unlocks_horizon',
      relationDescription: 'Mesure l’adéquation exacte avec les compétences'
    }
  ];

  const totalFilled = [
    isProfileFilled,
    isKnowledgeFilled,
    isExperienceFilled,
    isSkillsFilled,
    isCapacityFilled,
    isTargetJobFilled
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Bannière explicative d'orientation */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-950 to-cyan-950/30 border border-cyan-500/30 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5 text-cyan-400" />
            <span>Squelette Abstrait du Profil</span>
          </span>
          <span className="text-xs font-mono font-bold text-slate-300">
            {totalFilled} / 6 nœuds
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Voici l'architecture causale de votre profil. Cliquez sur le <strong className="text-cyan-300 font-semibold">Nœud Profil</strong> dans le graphe à droite (ou ci-dessous) pour démarrer la séquence guidée rigoureuse.
        </p>

        <div className="pt-1 flex flex-col gap-2">
          <button
            type="button"
            onClick={onStartGuidedSequence}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition-all cursor-pointer hover:scale-[1.01]"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Lancer la séquence guidée</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onApplyFullPreset}
            className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer text-center"
          >
            ⚡ Ou pré-remplir un profil modèle (test en 3s)
          </button>
        </div>
      </div>

      {/* Arborescence interactive du Squelette */}
      <div className="space-y-2 relative">
        {skeletonItems.map((item, index) => {
          const isSelected = activeNode === item.id;
          const isNext = index < skeletonItems.length - 1;

          return (
            <div key={item.id} className="relative">
              {/* Carte du Nœud dans le squelette */}
              <button
                type="button"
                onClick={() => onSelectNode(item.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 group ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/15 ring-1 ring-cyan-400/40'
                    : item.isFilled
                    ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-900 hover:border-slate-800 opacity-90 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                      item.isFilled
                        ? 'bg-slate-900 ' + item.color + ' ' + item.borderColor
                        : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}
                  >
                    {item.icon}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        0{item.stepNumber}
                      </span>
                      <h4 className={`text-xs font-bold truncate ${item.color}`}>
                        {item.label}
                      </h4>
                    </div>

                    <p className="text-[11px] text-slate-400 truncate">
                      {item.isFilled ? (
                        <span className="text-slate-200 font-medium">
                          {item.currentValue}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">
                          {item.sublabel}
                        </span>
                      )}
                    </p>

                    <div className="pt-0.5 flex items-center gap-1.5 text-[9px] font-mono text-slate-500">
                      <span className="text-slate-400">{item.relationType}</span>
                      <span>•</span>
                      <span className="truncate">{item.relationDescription}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 pt-0.5">
                  {item.isFilled ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <CircleDashed className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  )}
                </div>
              </button>

              {/* Connecteur synaptique vertical vers le nœud suivant */}
              {isNext && (
                <div className="w-full flex items-center justify-center py-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-600">
                    <div className="w-px h-3 bg-slate-800" />
                    <ArrowDown className="w-2.5 h-2.5 text-slate-600" />
                    <span className="text-[8px] uppercase tracking-wider text-slate-600">
                      {skeletonItems[index + 1].relationType}
                    </span>
                    <div className="w-px h-3 bg-slate-800" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
