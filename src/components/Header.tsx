import React from 'react';
import { Sparkles, Compass, Clock, Brain, Network, Plus, RotateCcw } from 'lucide-react';

export type ActiveTab = 'network' | 'decay' | 'horizons' | 'signature';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  simulationYear: number;
  onOpenDistiller: () => void;
  onResetToDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  simulationYear,
  onOpenDistiller,
  onResetToDemo
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Subline */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold text-lg tracking-wider">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base">COGNITORIUM</span>
                <span className="text-[10px] font-bold px-2 py-0.2 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                  v2.6
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Représentation dynamique du capital cognitif, expérientiel et potentiel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenDistiller}
              className="p-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Tabs Navigation */}
        <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/60 overflow-x-auto max-w-full">
          <button
            id="tab-btn-network"
            onClick={() => onTabChange('network')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'network'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Réseau Dynamique</span>
          </button>

          <button
            id="tab-btn-decay"
            onClick={() => onTabChange('decay')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'decay'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Vitalité & Decay ({simulationYear})</span>
          </button>

          <button
            id="tab-btn-horizons"
            onClick={() => onTabChange('horizons')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'horizons'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Passerelles & Horizons</span>
          </button>

          <button
            id="tab-btn-signature"
            onClick={() => onTabChange('signature')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'signature'
                ? 'bg-white text-pink-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Diagnostic Cognitive</span>
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-2">
          <button
            id="btn-reset-demo"
            onClick={onResetToDemo}
            title="Réinitialiser l'exemple (VRD & Russe)"
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            id="btn-open-distiller-header"
            onClick={onOpenDistiller}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Distiller un vécu</span>
          </button>
        </div>
      </div>
    </header>
  );
};
