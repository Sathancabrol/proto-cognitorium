import React from 'react';
import { ChevronRight, ListTree, Network } from 'lucide-react';

export type SavoirsViewMode = 'coverflow' | 'titres' | 'graphe';

export const ViewModeBar: React.FC<{
  mode: SavoirsViewMode;
  onMode: (m: SavoirsViewMode) => void;
}> = ({ mode, onMode }) => (
  <div className="flex flex-wrap gap-1.5">
    {(
      [
        { id: 'coverflow' as const, label: 'Coverflow', icon: <ChevronRight className="w-3.5 h-3.5" /> },
        { id: 'titres' as const, label: 'Titres / affiche', icon: <ListTree className="w-3.5 h-3.5" /> },
        { id: 'graphe' as const, label: 'Graphe', icon: <Network className="w-3.5 h-3.5" /> }
      ]
    ).map((m) => (
      <button
        key={m.id}
        type="button"
        onClick={() => onMode(m.id)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
          mode === m.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200'
        }`}
      >
        {m.icon}
        {m.label}
      </button>
    ))}
  </div>
);
