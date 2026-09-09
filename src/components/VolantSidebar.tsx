import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  FolderKanban,
  Wrench,
  Compass,
  TrendingUp,
  BookOpen,
  Sparkles,
  RotateCcw,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Pin,
  PinOff,
  SlidersHorizontal,
  LayoutDashboard,
  Brain,
  ListTree,
  Network,
  Clock,
  Table2,
  GitFork,
  Activity,
  FlaskConical,
  Award,
  Layers,
  HelpCircle,
  CheckCircle2,
  FileText
} from 'lucide-react';
import {
  AppActiveTab,
  CognitiveProfile,
  CognitoriumSection,
  SECTION_LABELS,
  SECTION_OF_TAB,
  SECTION_DEFAULT_TAB,
  ComplexityMode
} from '../types';
import { PROFILES_PRESETS } from '../data/initialData';

interface VolantSidebarProps {
  activeTab: AppActiveTab;
  onTabChange: (tab: AppActiveTab) => void;
  currentProfile: CognitiveProfile;
  onSelectProfile: (profile: CognitiveProfile) => void;
  onOpenDistiller: () => void;
  onOpenOnboarding: () => void;
  onOpenValidationCenter: () => void;
  pendingValidationCount: number;
  complexityMode: ComplexityMode;
  onToggleComplexity: () => void;
  onResetToDemo: () => void;
  isPinned: boolean;
  onTogglePin: () => void;
  onLogout?: () => void;
}

interface SectionItem {
  id: CognitoriumSection;
  icon: React.ReactNode;
  color: string;
  activeBg: string;
  badge?: string;
  views: {
    tab: AppActiveTab;
    label: string;
    icon: React.ReactNode;
    testId: string;
  }[];
}

export const VolantSidebar: React.FC<VolantSidebarProps> = ({
  activeTab,
  onTabChange,
  currentProfile,
  onSelectProfile,
  onOpenDistiller,
  onOpenOnboarding,
  onOpenValidationCenter,
  pendingValidationCount,
  complexityMode,
  onToggleComplexity,
  onResetToDemo,
  isPinned,
  onTogglePin,
  onLogout
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = isPinned || isHovered;

  const currentSection = SECTION_OF_TAB[activeTab] || 'profil';

  const sections: SectionItem[] = [
    {
      id: 'profil',
      icon: <User className="w-4 h-4" />,
      color: 'text-blue-400',
      activeBg: 'bg-blue-600/20 text-blue-300 border-blue-500/40',
      views: [
        { tab: 'dashboard', label: 'Synthèse du profil', icon: <LayoutDashboard className="w-3.5 h-3.5" />, testId: 'sidebar-tab-dashboard' },
        { tab: 'signature', label: 'Passeport cognitif', icon: <Brain className="w-3.5 h-3.5" />, testId: 'sidebar-tab-signature' },
        { tab: 'cv', label: 'CV Ciblé & Format ATS', icon: <FileText className="w-3.5 h-3.5" />, testId: 'sidebar-tab-cv' }
      ]
    },
    {
      id: 'experiences',
      icon: <FolderKanban className="w-4 h-4" />,
      color: 'text-emerald-400',
      activeBg: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40',
      badge: `${(currentProfile.nodes || []).filter(n => n?.category === 'experience' || n?.category === 'formation').length}`,
      views: [
        { tab: 'tree', label: 'Arbre hiérarchique', icon: <ListTree className="w-3.5 h-3.5" />, testId: 'sidebar-tab-tree' },
        { tab: 'network', label: 'Graphe réseau 2D', icon: <Network className="w-3.5 h-3.5" />, testId: 'sidebar-tab-network' },
        { tab: 'temporal', label: 'Graphe temporel animé', icon: <Clock className="w-3.5 h-3.5" />, testId: 'sidebar-tab-temporal' }
      ]
    },
    {
      id: 'competences',
      icon: <Wrench className="w-4 h-4" />,
      color: 'text-cyan-400',
      activeBg: 'bg-cyan-600/20 text-cyan-300 border-cyan-500/40',
      badge: `${(currentProfile.nodes || []).filter(n => n?.category?.startsWith('skill_')).length}`,
      views: [
        { tab: 'table', label: 'Matrice de maîtrise', icon: <Table2 className="w-3.5 h-3.5" />, testId: 'sidebar-tab-table' }
      ]
    },
    {
      id: 'possibilites',
      icon: <Compass className="w-4 h-4" />,
      color: 'text-orange-400',
      activeBg: 'bg-orange-600/20 text-orange-300 border-orange-500/40',
      views: [
        { tab: 'horizons', label: 'Horizons ROME', icon: <Compass className="w-3.5 h-3.5" />, testId: 'sidebar-tab-horizons' },
        { tab: 'metiers', label: 'Graphe & Radar Métiers', icon: <GitFork className="w-3.5 h-3.5" />, testId: 'sidebar-tab-metiers' },
        { tab: 'projets', label: 'Multi-Projets & Roadmaps', icon: <FolderKanban className="w-3.5 h-3.5" />, testId: 'sidebar-tab-projets' }
      ]
    },
    {
      id: 'evolution',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-indigo-400',
      activeBg: 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40',
      views: [
        { tab: 'decay', label: 'Vitalité & Temporalité', icon: <Activity className="w-3.5 h-3.5" />, testId: 'sidebar-tab-decay' },
        { tab: 'biais', label: '10 Biais Cognitifs', icon: <Brain className="w-3.5 h-3.5" />, testId: 'sidebar-tab-biais' },
        { tab: 'temporal', label: 'Reconstitution chronologique', icon: <Clock className="w-3.5 h-3.5" />, testId: 'sidebar-tab-temporal-ev' }
      ]
    },
    {
      id: 'savoirs',
      icon: <BookOpen className="w-4 h-4" />,
      color: 'text-violet-400',
      activeBg: 'bg-violet-600/20 text-violet-300 border-violet-500/40',
      views: [
        { tab: 'atlas', label: 'Arborescence des savoirs', icon: <BookOpen className="w-3.5 h-3.5" />, testId: 'sidebar-tab-atlas' },
        { tab: 'posters', label: 'Posters expérimentaux', icon: <FlaskConical className="w-3.5 h-3.5" />, testId: 'sidebar-tab-posters' },
        { tab: 'metacog', label: 'Boucle SRL Métacognitive', icon: <Brain className="w-3.5 h-3.5" />, testId: 'sidebar-tab-metacog' },
        { tab: 'psyref', label: 'Bibliothèque PsyRef', icon: <Layers className="w-3.5 h-3.5" />, testId: 'sidebar-tab-psyref' },
        { tab: 'ressources', label: 'Ressources & OER', icon: <HelpCircle className="w-3.5 h-3.5" />, testId: 'sidebar-tab-ressources' },
        { tab: 'evaluations', label: 'Mes évaluations & Preuves', icon: <Award className="w-3.5 h-3.5" />, testId: 'sidebar-tab-evaluations' }
      ]
    }
  ];

  return (
    <aside
      id="cognitorium-volant-sidebar"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 ease-out flex flex-col ${
        isExpanded ? 'w-72 shadow-2xl shadow-black/40' : 'w-[68px] shadow-lg shadow-black/20'
      } bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/80 text-slate-200 select-none`}
    >
      {/* 1. Header: Brand Logo & Title */}
      <div className="p-3 border-b border-slate-800/70 flex items-center justify-between min-h-[58px]">
        <div
          onClick={() => onTabChange('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
          title="Mon Cognitorium"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 font-black text-lg tracking-wider group-hover:scale-105 transition-transform flex-shrink-0">
            C
          </div>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <div className="font-extrabold text-white tracking-tight text-sm flex items-center gap-1.5">
                <span>COGNITORIUM</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-400/30 font-bold">
                  v3.1
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                Graphe cognitif & ROME
              </p>
            </motion.div>
          )}
        </div>

        {isExpanded && (
          <button
            id="sidebar-pin-toggle-btn"
            onClick={onTogglePin}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title={isPinned ? 'Détacher le volant (réduction auto)' : 'Épingler le volant ouvert'}
          >
            {isPinned ? <Pin className="w-4 h-4 text-blue-400" /> : <PinOff className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* 2. User Profile Card & Switcher */}
      <div className="p-2.5 border-b border-slate-800/70">
        {isExpanded ? (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {(currentProfile.personName || 'U').charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">
                    {currentProfile.personName}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {currentProfile.headline || 'Profil actif'}
                  </div>
                </div>
              </div>
            </div>

            {/* Direct button to create/manage profile */}
            <button
              id="sidebar-create-profile-btn"
              onClick={onOpenOnboarding}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow-xs transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Créer / Gérer mon compte</span>
            </button>

            <select
              value={currentProfile.id}
              onChange={(e) => {
                if (e.target.value === 'new') {
                  onOpenOnboarding();
                } else {
                  const found = PROFILES_PRESETS.find((p) => p.profile.id === e.target.value);
                  if (found) onSelectProfile(found.profile);
                }
              }}
              className="w-full text-xs font-medium text-slate-200 bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {!PROFILES_PRESETS.some((p) => p.profile.id === currentProfile.id) && (
                <option value={currentProfile.id}>
                  ⭐ {currentProfile.personName} (Personnalisé)
                </option>
              )}
              {PROFILES_PRESETS.map((preset) => (
                <option key={preset.profile.id} value={preset.profile.id}>
                  👤 {preset.name}
                </option>
              ))}
              <option value="new">+ Créer un nouveau profil...</option>
            </select>
          </div>
        ) : (
          <div
            onClick={() => onTabChange('dashboard')}
            className="w-10 h-10 mx-auto rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 cursor-pointer transition-colors relative"
            title={`Profil actif : ${currentProfile.personName}`}
          >
            <span className="font-bold text-xs">{(currentProfile.personName || 'U').charAt(0)}</span>
            <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        )}
      </div>

      {/* 3. Navigation Sections & Sub-views */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1.5 custom-scrollbar">
        {sections.map((section) => {
          const isCurrentSection = currentSection === section.id;

          return (
            <div key={section.id} className="space-y-0.5">
              {/* Section Main Button */}
              <button
                id={`sidebar-sec-${section.id}`}
                onClick={() => onTabChange(SECTION_DEFAULT_TAB[section.id])}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isCurrentSection
                    ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
                }`}
                title={!isExpanded ? SECTION_LABELS[section.id] : undefined}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isCurrentSection ? section.color : 'text-slate-400'
                  }`}
                >
                  {section.icon}
                </div>

                {isExpanded && (
                  <div className="flex-1 flex items-center justify-between text-left truncate">
                    <span className="truncate">{SECTION_LABELS[section.id]}</span>
                    {section.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 font-medium ml-1">
                        {section.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>

              {/* Sub-modes of the Section */}
              {isExpanded && isCurrentSection && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-7 pr-1 space-y-0.5 py-1"
                >
                  {section.views.map((view) => {
                    const isTabActive = activeTab === view.tab;
                    return (
                      <button
                        key={view.tab}
                        id={view.testId}
                        onClick={() => onTabChange(view.tab)}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                          isTabActive
                            ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-xs font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                        }`}
                      >
                        <span className={isTabActive ? 'text-blue-400' : 'text-slate-500'}>
                          {view.icon}
                        </span>
                        <span className="truncate">{view.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Actions: Human Validation, Quick Distiller & Demo Reset */}
      <div className="p-2.5 border-t border-slate-800/80 space-y-2 bg-slate-950">
        {/* Pending Validation Alert Button */}
        {pendingValidationCount > 0 && (
          <button
            id="sidebar-btn-validation"
            onClick={onOpenValidationCenter}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all animate-pulse"
            title={`${pendingValidationCount} inférences IA à valider`}
          >
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            {isExpanded && (
              <span className="truncate">{pendingValidationCount} inférences à valider</span>
            )}
          </button>
        )}

        {/* Distiller Quick Add Button */}
        <button
          id="sidebar-btn-distiller"
          onClick={onOpenDistiller}
          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          title="Ajouter un vécu (Distillateur IA)"
        >
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          {isExpanded && <span className="truncate">+ Ajouter un vécu</span>}
        </button>

        {/* Déconnexion / Portail d'accueil */}
        {onLogout && isExpanded && (
          <button
            id="sidebar-btn-switch-account"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 text-[11px] font-medium transition-all"
            title="Changer de compte ou retourner au portail de connexion"
          >
            <User className="w-3 h-3 text-blue-400" />
            <span>Changer de compte</span>
          </button>
        )}

        {/* Footer utilities: Reset & Complexity */}
        {isExpanded && (
          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
            <button
              onClick={onResetToDemo}
              className="flex items-center gap-1 hover:text-slate-300 transition-colors"
              title="Réinitialiser les profils certifiés"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Démos</span>
            </button>

            <button
              onClick={onToggleComplexity}
              className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:text-slate-300 transition-colors font-semibold"
            >
              Mode {complexityMode === 'essential' ? 'Essentiel' : 'Expert'}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
