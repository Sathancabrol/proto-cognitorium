import React from 'react';
import { 
  Sparkles, 
  Compass, 
  Clock, 
  Brain, 
  Network, 
  RotateCcw, 
  LayoutDashboard, 
  ListTree, 
  Table2, 
  AlertCircle, 
  User, 
  FlaskConical,
  FolderKanban,
  Wrench,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { 
  AppActiveTab, 
  ComplexityMode, 
  CognitiveProfile,
  CognitoriumSection,
  SECTION_LABELS,
  SECTION_OF_TAB,
  SECTION_DEFAULT_TAB 
} from '../types';
import { PROFILES_PRESETS } from '../data/initialData';
import { MotionCreateButton } from './MotionCreateButton';
import { QuickCreateType } from './QuickAddNodeModal';

interface SectionMeta {
  id: CognitoriumSection;
  icon: React.ReactNode;
  color: string;
}

const SECTION_META: SectionMeta[] = [
  { id: 'profil', icon: <User className="w-3.5 h-3.5" />, color: 'blue' },
  { id: 'experiences', icon: <FolderKanban className="w-3.5 h-3.5" />, color: 'emerald' },
  { id: 'competences', icon: <Wrench className="w-3.5 h-3.5" />, color: 'cyan' },
  { id: 'possibilites', icon: <Compass className="w-3.5 h-3.5" />, color: 'orange' },
  { id: 'evolution', icon: <TrendingUp className="w-3.5 h-3.5" />, color: 'indigo' },
  { id: 'savoirs', icon: <BookOpen className="w-3.5 h-3.5" />, color: 'violet' }
];

interface ViewOption {
  tab: AppActiveTab;
  label: string;
  testId: string;
}

const SECTION_VIEWS: Record<CognitoriumSection, ViewOption[]> = {
  profil: [
    { tab: 'dashboard', label: 'Synthèse', testId: 'tab-btn-dashboard' },
    { tab: 'signature', label: 'Passeport cognitif', testId: 'tab-btn-signature' }
  ],
  experiences: [
    { tab: 'tree', label: 'Arbre hiérarchique', testId: 'tab-btn-tree' },
    { tab: 'network', label: 'Graphe réseau', testId: 'tab-btn-network' },
    { tab: 'temporal', label: 'Graphe temporel', testId: 'tab-btn-temporal' }
  ],
  competences: [
    { tab: 'table', label: 'Matrice de maîtrise', testId: 'tab-btn-table' }
  ],
  possibilites: [
    { tab: 'horizons', label: 'Horizons ROME', testId: 'tab-btn-horizons' },
    { tab: 'metiers', label: 'Graphe métiers', testId: 'tab-btn-metiers-graph' }
  ],
  evolution: [
    { tab: 'decay', label: 'Vitalité & Temps', testId: 'tab-btn-decay' },
    { tab: 'temporal', label: 'Graphe Temporel', testId: 'tab-btn-temporal-evolution' }
  ],
  savoirs: [
    { tab: 'atlas', label: 'Arborescence', testId: 'tab-btn-atlas' },
    { tab: 'posters', label: 'Posters', testId: 'tab-btn-posters' },
    { tab: 'metacog', label: 'Boucle SRL', testId: 'tab-btn-metacog' },
    { tab: 'psyref', label: 'Référence', testId: 'tab-btn-psyref' },
    { tab: 'ressources', label: 'Ressources', testId: 'tab-btn-ressources' },
    { tab: 'evaluations', label: 'Mes évaluations', testId: 'tab-btn-evaluations' }
  ]
};

const ACTIVE_COLORS: Record<string, { active: string }> = {
  blue: { active: 'bg-white text-blue-600 shadow-xs' },
  emerald: { active: 'bg-white text-emerald-600 shadow-xs' },
  cyan: { active: 'bg-white text-cyan-600 shadow-xs' },
  orange: { active: 'bg-white text-orange-600 shadow-xs' },
  indigo: { active: 'bg-white text-indigo-600 shadow-xs' },
  violet: { active: 'bg-white text-violet-600 shadow-xs' }
};

const VIEW_ACTIVE_COLORS: Record<AppActiveTab, string> = {
  dashboard: 'bg-blue-600 text-white',
  signature: 'bg-pink-600 text-white',
  tree: 'bg-emerald-600 text-white',
  network: 'bg-blue-600 text-white',
  temporal: 'bg-cyan-600 text-white',
  table: 'bg-cyan-600 text-white',
  horizons: 'bg-orange-600 text-white',
  metiers: 'bg-amber-600 text-white',
  decay: 'bg-indigo-600 text-white',
  atlas: 'bg-violet-600 text-white',
  posters: 'bg-amber-600 text-white',
  metacog: 'bg-violet-700 text-white',
  psyref: 'bg-slate-900 text-amber-200',
  ressources: 'bg-teal-700 text-white',
  evaluations: 'bg-teal-800 text-white'
};

interface HeaderProps {
  activeTab: AppActiveTab;
  onTabChange: (tab: AppActiveTab) => void;
  simulationYear: number;
  currentProfile: CognitiveProfile;
  onSelectProfile: (profile: CognitiveProfile) => void;
  onOpenDistiller: () => void;
  onOpenQuickAdd?: (type: QuickCreateType) => void;
  onOpenOnboarding: () => void;
  onOpenValidationCenter: () => void;
  pendingValidationCount: number;
  complexityMode: ComplexityMode;
  onToggleComplexity: () => void;
  onResetToDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  simulationYear,
  currentProfile,
  onSelectProfile,
  onOpenDistiller,
  onOpenQuickAdd,
  onOpenOnboarding,
  onOpenValidationCenter,
  pendingValidationCount,
  complexityMode,
  onToggleComplexity,
  onResetToDemo
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Left: Brand & Profile Switcher */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-2.5">
            <div 
              onClick={() => onTabChange('dashboard')}
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold text-lg tracking-wider cursor-pointer active:scale-95 transition-transform"
            >
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span 
                  onClick={() => onTabChange('dashboard')}
                  className="font-extrabold text-slate-900 tracking-tight text-base cursor-pointer hover:text-blue-600 transition-colors"
                >
                  COGNITORIUM
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                  v3.0 Core
                </span>
              </div>
            </div>
          </div>

          {/* Profile Switcher Selector */}
          <div className="flex items-center gap-2">
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
              className="text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
            >
              {PROFILES_PRESETS.map((preset) => (
                <option key={preset.profile.id} value={preset.profile.id}>
                  👤 {preset.name}
                </option>
              ))}
              <option value="new">+ Nouveau profil / Découverte</option>
            </select>

            {/* Validation Badge Indicator (if any pending) */}
            {pendingValidationCount > 0 && (
              <button
                id="header-btn-validation-center"
                onClick={onOpenValidationCenter}
                title={`${pendingValidationCount} inférences IA en attente de validation`}
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[11px] font-bold shadow-xs transition-all animate-pulse"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{pendingValidationCount} à valider</span>
              </button>
            )}
          </div>
        </div>

        {/* Center: Sections Navigation (MON COGNITORIUM en 6 sections) */}
        <div className="flex flex-col items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/60 overflow-x-auto max-w-full">
          <nav className="flex items-center gap-0.5">
            {SECTION_META.map((s) => {
              const isActive = SECTION_OF_TAB[activeTab] === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onTabChange(SECTION_DEFAULT_TAB[s.id])}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive ? ACTIVE_COLORS[s.color].active : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s.icon}
                  <span>{SECTION_LABELS[s.id]}</span>
                </button>
              );
            })}
          </nav>

          {/* Modes de représentation de la section active */}
          {SECTION_VIEWS[SECTION_OF_TAB[activeTab]]?.length > 1 && (
            <nav className="flex items-center gap-0.5">
              {SECTION_VIEWS[SECTION_OF_TAB[activeTab]].map((v) => (
                <button
                  key={v.testId}
                  id={v.testId}
                  onClick={() => onTabChange(v.tab)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                    activeTab === v.tab ? VIEW_ACTIVE_COLORS[v.tab] : 'text-slate-500 hover:text-slate-800 hover:bg-white/70'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Right CTA Actions */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            id="btn-reset-demo"
            onClick={onResetToDemo}
            title="Réinitialiser les profils d'exemple"
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {onOpenQuickAdd ? (
            <MotionCreateButton
              onOpenQuickAdd={onOpenQuickAdd}
              onOpenDistiller={onOpenDistiller}
              buttonLabel="Créer / Ajouter"
            />
          ) : (
            <button
              id="btn-open-distiller-header"
              onClick={onOpenDistiller}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ Ajouter un vécu</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
