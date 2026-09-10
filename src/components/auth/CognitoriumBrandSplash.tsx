import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CognitoriumBrandSplashProps {
  onComplete: () => void;
  autoAdvanceDelay?: number; // ms, défaut 2400
}

export const CognitoriumBrandSplash: React.FC<CognitoriumBrandSplashProps> = ({
  onComplete,
  autoAdvanceDelay = 2600
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / autoAdvanceDelay) * 100));
      setProgress(pct);

      if (elapsed >= autoAdvanceDelay) {
        clearInterval(interval);
        onComplete();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [autoAdvanceDelay, onComplete]);

  return (
    <div
      id="brand-splash-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#050508] text-slate-100 select-none overflow-hidden"
    >
      {/* Halos d'ambiance et nébuleuses neuronales */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-[380px] h-[380px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Bouton passer discret en haut à droite */}
      <div className="w-full max-w-6xl px-6 pt-6 flex justify-end relative z-10">
        <button
          id="splash-btn-skip"
          onClick={onComplete}
          className="px-3.5 py-1.5 rounded-full text-xs font-mono text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 border border-slate-800/80 transition-all flex items-center gap-1.5 backdrop-blur-sm cursor-pointer"
        >
          <span>Passer l'introduction</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Cœur visuel : Logo Animé du Connectome */}
      <div className="flex flex-col items-center justify-center text-center px-4 relative z-10 max-w-xl mx-auto my-auto space-y-7">
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Cercles orbitaux pulsants */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping opacity-25 scale-110" />
          <div className="absolute -inset-3 rounded-full border border-dashed border-cyan-500/25 animate-spin duration-1000" style={{ animationDuration: '24s' }} />
          
          {/* Logo SVG interactif avec constellation neurale */}
          <svg className="w-32 h-32 relative z-10" viewBox="0 0 120 120" fill="none">
            {/* Lignes de synapses */}
            <path d="M60 20 L30 45 L40 85 L60 98 L80 85 L90 45 Z" stroke="rgba(0, 229, 204, 0.35)" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M60 20 L60 60 L40 85" stroke="rgba(0, 229, 204, 0.6)" strokeWidth="1.8" />
            <path d="M30 45 L60 60 L80 85" stroke="rgba(155, 89, 182, 0.7)" strokeWidth="1.8" />
            <path d="M90 45 L60 60 L60 98" stroke="rgba(0, 229, 204, 0.6)" strokeWidth="1.8" />

            {/* Nœuds périphériques */}
            <circle cx="60" cy="20" r="5" fill="#00E5CC" className="drop-shadow-[0_0_8px_#00E5CC]" />
            <circle cx="30" cy="45" r="4.5" fill="#38BDF8" className="drop-shadow-[0_0_6px_#38BDF8]" />
            <circle cx="90" cy="45" r="4.5" fill="#38BDF8" className="drop-shadow-[0_0_6px_#38BDF8]" />
            <circle cx="40" cy="85" r="5" fill="#9B59B6" className="drop-shadow-[0_0_8px_#9B59B6]" />
            <circle cx="80" cy="85" r="5" fill="#9B59B6" className="drop-shadow-[0_0_8px_#9B59B6]" />
            <circle cx="60" cy="98" r="4" fill="#00E5CC" />

            {/* Nœud Central Cœur (Hub) */}
            <circle cx="60" cy="60" r="8" fill="#00E5CC" className="drop-shadow-[0_0_12px_#00E5CC]" />
            <circle cx="60" cy="60" r="3.5" fill="#050508" />
          </svg>
        </div>

        {/* Titre & Identité */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-[11px] tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Moteur de Représentation Multimodale</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-widest text-slate-100 font-sans">
            COGNITO<span className="text-cyan-400 font-black">RIUM</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto font-sans leading-relaxed">
            Cartographie dynamique du capital cognitif, traçabilité des compétences, passerelles ROME et vitalité temporelle.
          </p>
        </div>

        {/* Barre de progression fine */}
        <div className="w-64 max-w-full space-y-2 pt-4">
          <div className="w-full h-1 bg-slate-800/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>Initialisation du modèle...</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      {/* Footer épuré */}
      <footer className="w-full text-center pb-6 text-xs text-slate-500 font-mono relative z-10">
        <span>Épistémique • Traçabilité des preuves • Zéro hallucination</span>
      </footer>
    </div>
  );
};
