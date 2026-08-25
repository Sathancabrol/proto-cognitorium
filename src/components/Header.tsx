import React from 'react';
import { 
  Sparkles, 
  Compass, 
  Clock, 
  Brain, 
  Network, 
  Plus, 
  RotateCcw, 
  LayoutDashboard, 
  ListTree, 
  Table2, 
  AlertCircle, 
  User, 
  ChevronDown 
} from 'lucide-react';
import { AppActiveTab, ComplexityMode, CognitiveProfile } from '../types';
import { PROFILES_PRESETS } from '../data/initialData';
import { MotionCreateButton } from './MotionCreateButton';
import { QuickCreateType } from './QuickAddNodeModal';

interface HeaderProps {
  activeTab: AppActiveTab;
  onTabChange: (tab: AppActiveTab) => void;
  simulationYear: number;
  currentProfile: CognitiveProfile;
  onSelectProfile: (profile: CognitiveProfile) => void;
  onOpenDistiller: () => void;
  onOpenQuickAdd: (type: QuickCreateType) => void;
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

        {/* Center: Tabs Navigation */}
        <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/60 overflow-x-auto max-w-full">
          <button
            id="tab-btn-dashboard"
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Mon Cognitorium</span>
          </button>

          <button
            id="tab-btn-network"
            onClick={() => onTabChange('network')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'network'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Graphe Réseau</span>
          </button>

          <button
            id="tab-btn-tree"
            onClick={() => onTabChange('tree')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'tree'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            <span>Arbre & Tâches</span>
          </button>

          <button
            id="tab-btn-table"
            onClick={() => onTabChange('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'table'
                ? 'bg-white text-cyan-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table2 className="w-3.5 h-3.5" />
            <span>Matrice</span>
          </button>

          <button
            id="tab-btn-horizons"
            onClick={() => onTabChange('horizons')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'horizons'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Horizons ROME</span>
          </button>

          <button
            id="tab-btn-decay"
            onClick={() => onTabChange('decay')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'decay'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Vitalité ({simulationYear})</span>
          </button>

          <button
            id="tab-btn-signature"
            onClick={() => onTabChange('signature')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'signature'
                ? 'bg-white text-pink-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Passeport</span>
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden lg:flex items-center gap-2.5">
          <button
            id="btn-reset-demo"
            onClick={onResetToDemo}
            title="Réinitialiser les profils d'exemple"
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Morphing Dossier Motion Create Button */}
          <MotionCreateButton
            onOpenQuickAdd={onOpenQuickAdd}
            onOpenDistiller={onOpenDistiller}
            buttonLabel="Créer / Ajouter"
          />
        </div>
      </div>
    </header>
  );
};
