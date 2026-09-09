import React from 'react';
import {
  Menu,
  ChevronRight,
  AlertCircle,
  Sparkles,
  SlidersHorizontal,
  User,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  FolderKanban,
  Wrench,
  Compass,
  TrendingUp,
  BookOpen,
  Database,
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
import { MotionCreateButton } from './MotionCreateButton';
import { QuickCreateType } from './QuickAddNodeModal';

interface ViewOption {
  tab: AppActiveTab;
  label: string;
}

const SECTION_VIEWS: Record<CognitoriumSection, ViewOption[]> = {
  profil: [
    { tab: 'dashboard', label: 'Synthèse' },
    { tab: 'signature', label: 'Passeport' },
    { tab: 'cv', label: 'CV & ATS' }
  ],
  experiences: [
    { tab: 'tree', label: 'Arbre' },
    { tab: 'network', label: 'Réseau 2D' },
    { tab: 'temporal', label: 'Temporel' }
  ],
  competences: [
    { tab: 'table', label: 'Matrice de maîtrise' }
  ],
  possibilites: [
    { tab: 'horizons', label: 'Horizons ROME' },
    { tab: 'metiers', label: 'Graphe Métiers' },
    { tab: 'projets', label: 'Multi-Projets' }
  ],
  evolution: [
    { tab: 'decay', label: 'Vitalité & Temps' },
    { tab: 'biais', label: '10 Biais' },
    { tab: 'temporal', label: 'Chronologie' }
  ],
  savoirs: [
    { tab: 'atlas', label: 'Arborescence' },
    { tab: 'posters', label: 'Posters' },
    { tab: 'metacog', label: 'Boucle SRL' },
    { tab: 'psyref', label: 'Référence' },
    { tab: 'ressources', label: 'Ressources' },
    { tab: 'evaluations', label: 'Évaluations' }
  ]
};

const SECTION_ICONS: Record<CognitoriumSection, React.ReactNode> = {
  profil: <User className="w-3.5 h-3.5" />,
  experiences: <FolderKanban className="w-3.5 h-3.5" />,
  competences: <Wrench className="w-3.5 h-3.5" />,
  possibilites: <Compass className="w-3.5 h-3.5" />,
  evolution: <TrendingUp className="w-3.5 h-3.5" />,
  savoirs: <BookOpen className="w-3.5 h-3.5" />
};

interface TopHeaderBarProps {
  activeTab: AppActiveTab;
  onTabChange: (tab: AppActiveTab) => void;
  currentProfile: CognitiveProfile;
  onOpenDistiller: () => void;
  onOpenQuickAdd?: (type: QuickCreateType) => void;
  onOpenValidationCenter: () => void;
  onOpenOnboarding?: () => void;
  onOpenProfileManagement?: () => void;
  pendingValidationCount: number;
  complexityMode: ComplexityMode;
  onToggleComplexity: () => void;
  isSidebarPinned: boolean;
  onToggleSidebarPin: () => void;
  onLogout?: () => void;
}

export const TopHeaderBar: React.FC<TopHeaderBarProps> = ({
  activeTab,
  onTabChange,
  currentProfile,
  onOpenDistiller,
  onOpenQuickAdd,
  onOpenValidationCenter,
  onOpenOnboarding,
  onOpenProfileManagement,
  pendingValidationCount,
  complexityMode,
  onToggleComplexity,
  isSidebarPinned,
  onToggleSidebarPin,
  onLogout
}) => {
  const currentSection = SECTION_OF_TAB[activeTab] || 'profil';
  const availableViews = SECTION_VIEWS[currentSection] || [];

  const handleSectionClick = (sec: CognitoriumSection) => {
    // Si on clique sur la section déjà active, ne rien changer sauf si on veut la vue par défaut
    if (SECTION_OF_TAB[activeTab] !== sec) {
      onTabChange(SECTION_DEFAULT_TAB[sec]);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs select-none">
      {/* Ligne 1 : Barre d'action principale et profil */}
      <div className="h-14 px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-3">
        {/* Gauche : Toggle sidebar + 6 Sections principales saillantes */}
        <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
          <button
            id="topbar-toggle-sidebar-btn"
            onClick={onToggleSidebarPin}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex-shrink-0"
            title={isSidebarPinned ? 'Réduire la barre latérale' : 'Déplier / Fixer la barre latérale'}
          >
            {isSidebarPinned ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>

          {/* Navigation Saillante des 6 Sections Principales (Le volant supérieur) */}
          <nav 
            id="topbar-volant-sections" 
            className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1"
          >
            {(Object.keys(SECTION_LABELS) as CognitoriumSection[]).map((sec) => {
              const isSecActive = currentSection === sec;
              return (
                <button
                  key={sec}
                  onClick={() => handleSectionClick(sec)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isSecActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className={isSecActive ? 'text-blue-400' : 'text-slate-400'}>
                    {SECTION_ICONS[sec]}
                  </span>
                  <span>{SECTION_LABELS[sec]}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Droite : Outils utiles non écrasés */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Badge Validation IA */}
          {pendingValidationCount > 0 && (
            <button
              id="topbar-btn-validation"
              onClick={onOpenValidationCenter}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all animate-pulse"
              title={`${pendingValidationCount} inférences IA en attente de validation`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{pendingValidationCount} à valider</span>
              <span className="md:hidden">{pendingValidationCount}</span>
            </button>
          )}

          {/* Bouton Export / Sauvegarde Profil */}
          {onOpenProfileManagement && (
            <button
              id="topbar-btn-profile-management"
              onClick={onOpenProfileManagement}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-bold border border-slate-200/80 transition-colors"
              title="Sauvegarde, Export .cognitorium et Transparence du Scoring"
            >
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden xl:inline">Sauvegarde</span>
            </button>
          )}

          {/* Toggle Complexité */}
          <button
            id="topbar-toggle-complexity"
            onClick={onToggleComplexity}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors"
            title="Basculer entre le mode Essentiel et le mode Expert"
          >
            <SlidersHorizontal className="w-3 h-3 text-slate-500" />
            <span>{complexityMode === 'essential' ? 'Essentiel' : 'Expert'}</span>
          </button>

          {/* Profil Actif */}
          {onOpenOnboarding ? (
            <button
              id="topbar-profile-btn"
              onClick={onOpenOnboarding}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 rounded-xl text-xs text-slate-700 transition-colors group cursor-pointer"
              title="Gérer mon compte ou changer de profil"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-bold truncate max-w-[100px] sm:max-w-[130px]">
                {currentProfile.personName}
              </span>
            </button>
          ) : null}

          {/* Déconnexion / Switch */}
          {onLogout && (
            <button
              id="topbar-btn-logout"
              onClick={onLogout}
              className="p-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 rounded-xl text-slate-600 hover:text-slate-900 transition-colors"
              title="Changer de compte ou retourner au portail"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Bouton d'action + Ajouter */}
          {onOpenQuickAdd ? (
            <MotionCreateButton
              onOpenQuickAdd={onOpenQuickAdd}
              onOpenDistiller={onOpenDistiller}
              buttonLabel="Créer"
            />
          ) : (
            <button
              id="topbar-btn-distiller"
              onClick={onOpenDistiller}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ Ajouter</span>
            </button>
          )}
        </div>
      </div>

      {/* Ligne 2 : Sous-vues immédiates de la section active (Ruban fin et saillant) */}
      {availableViews.length > 1 && (
        <div className="px-4 py-1.5 bg-slate-50/80 border-t border-slate-200/50 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mr-2 flex-shrink-0 font-medium">
              <span>{SECTION_LABELS[currentSection]}</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-700 font-bold">
                {availableViews.find((v) => v.tab === activeTab)?.label || 'Vue active'}
              </span>
            </div>
            <div className="h-3 w-px bg-slate-200 mx-1 flex-shrink-0" />
            {availableViews.map((v) => {
              const isActive = activeTab === v.tab;
              return (
                <button
                  key={v.tab}
                  onClick={() => onTabChange(v.tab)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
