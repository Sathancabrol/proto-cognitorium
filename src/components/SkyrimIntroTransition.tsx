import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, ArrowRight, Shield, Swords } from 'lucide-react';

interface SkyrimIntroTransitionProps {
  personName: string;
  headline?: string;
  onComplete: () => void;
}

/**
 * Skyrim Intro & Flashbang Easter Egg Transition
 * "Hey, you. You're finally awake..."
 * Inclut l'effet flashbang blanc, la brume scandinave, la réplique culte adaptée à Cognitorium
 * et un accord orchestral synthétisé via la Web Audio API (100% autonome et sécurisé).
 */
export const SkyrimIntroTransition: React.FC<SkyrimIntroTransitionProps> = ({
  personName,
  headline,
  onComplete
}) => {
  const [phase, setPhase] = useState<'flash' | 'skyrim' | 'fadeout'>('flash');
  const [textIndex, setTextIndex] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Synthétiseur audio Web Audio API pour le flashbang puis l'accord de Skyrim
  useEffect(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const now = ctx.currentTime;

      // 1. Son du Flashbang : sifflement aigu qui décroît
      const oscFlash = ctx.createOscillator();
      const gainFlash = ctx.createGain();
      oscFlash.type = 'sine';
      oscFlash.frequency.setValueAtTime(2800, now);
      oscFlash.frequency.exponentialRampToValueAtTime(800, now + 0.8);
      gainFlash.gain.setValueAtTime(0.12, now);
      gainFlash.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      oscFlash.connect(gainFlash);
      gainFlash.connect(ctx.destination);
      oscFlash.start(now);
      oscFlash.stop(now + 1.2);

      // 2. Accord orchestral Skyrim (Ré mineur épique : Ré - Fa - La - Ré avec nappe de violoncelles)
      const freqs = [73.42, 110.0, 146.83, 174.61, 220.0, 293.66]; // D2, A2, D3, F3, A3, D4
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + 0.6);

        // Filtre passe-bas pour sonner chaud et orchestral
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350 + idx * 100, now + 0.6);
        filter.frequency.exponentialRampToValueAtTime(900, now + 2.5);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.setValueAtTime(0.0001, now + 0.6);
        gain.gain.linearRampToValueAtTime(0.04 / (idx + 1), now + 1.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + 0.6);
        osc.stop(now + 4.5);
      });
    } catch (e) {
      // Audio facultatif si bloqué par les restrictions de l'iframe
      console.warn("Audio intro:", e);
    }

    return () => {
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (_) {}
      }
    };
  }, []);

  // Déroulement des phases cinématiques
  useEffect(() => {
    // 0.0s -> 0.7s : Flashbang blanc aveuglant
    const timerFlash = setTimeout(() => {
      setPhase('skyrim');
    }, 700);

    // 1.8s : Deuxième réplique
    const timerText = setTimeout(() => {
      setTextIndex(1);
    }, 2000);

    // 3.8s : Transition vers la sortie
    const timerFade = setTimeout(() => {
      setPhase('fadeout');
    }, 3800);

    // 4.3s : Fin et ouverture de l'interface
    const timerEnd = setTimeout(() => {
      onComplete();
    }, 4300);

    return () => {
      clearTimeout(timerFlash);
      clearTimeout(timerText);
      clearTimeout(timerFade);
      clearTimeout(timerEnd);
    };
  }, [onComplete]);

  return (
    <div
      id="skyrim-intro-easter-egg"
      onClick={onComplete}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-700 select-none cursor-pointer overflow-hidden ${
        phase === 'flash'
          ? 'bg-white'
          : phase === 'skyrim'
          ? 'bg-black text-slate-100'
          : 'bg-black opacity-0'
      }`}
    >
      {/* 1. EFFET FLASHBANG */}
      {phase === 'flash' && (
        <div className="absolute inset-0 bg-white flex flex-col items-center justify-center animate-pulse">
          <div className="text-slate-300 text-xs font-mono tracking-widest uppercase">
            ⚡ INITIALISATION DU COMPTE EN COURS...
          </div>
        </div>
      )}

      {/* 2. ATMOSPHÈRE SKYRIM */}
      {phase !== 'flash' && (
        <>
          {/* Brume et particules de fond animées */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black pointer-events-none opacity-95" />
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08)_0%,transparent_70%)] pointer-events-none" />

          {/* Silhouette de montagnes et de forêt scandinave */}
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black via-slate-950/80 to-transparent pointer-events-none flex items-end justify-center opacity-40">
            <div className="w-full text-center text-[10px] text-slate-700 tracking-widest uppercase font-serif pb-4">
              ▲ ▲ ▲   T H E   E L D E R   S C R O L L S   V :   C O G N I T O R I U M   ▲ ▲ ▲
            </div>
          </div>

          {/* Contenu textuel iconique */}
          <div className="relative z-10 max-w-xl mx-auto px-6 text-center space-y-6">
            {/* Emblème impérial / Cognitorium */}
            <div className="w-16 h-16 mx-auto rounded-full border border-amber-500/30 bg-amber-950/30 flex items-center justify-center text-amber-300/80 shadow-[0_0_25px_rgba(245,158,11,0.15)] animate-fade-in">
              <Shield className="w-8 h-8" />
            </div>

            {/* Titre Skyrim Style */}
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-[0.35em] text-amber-400/90 font-serif font-semibold block">
                The Elder Scrolls V
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-wider text-slate-100 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                COGNITORIUM
              </h1>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto pt-1" />
            </div>

            {/* La Réplique Culte */}
            <div className="min-h-[70px] flex items-center justify-center">
              {textIndex === 0 ? (
                <p className="text-base sm:text-lg italic font-serif text-slate-200 tracking-wide transition-opacity duration-500 leading-relaxed drop-shadow-md">
                  « Hey, you. You're finally awake... »
                </p>
              ) : (
                <div className="space-y-1 transition-opacity duration-500">
                  <p className="text-sm sm:text-base italic font-serif text-slate-200 tracking-wide">
                    « Vous alliez franchir la frontière de Cognitorium, n'est-ce pas ? »
                  </p>
                  <p className="text-xs text-amber-200/80 font-medium">
                    Compte activé pour <strong className="text-white font-bold">{personName}</strong>
                    {headline ? ` • ${headline}` : ''}
                  </p>
                </div>
              )}
            </div>

            {/* Bouton pour sauter ou avancer immédiatement */}
            <div className="pt-4 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete();
                }}
                className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-slate-200 hover:text-white font-serif tracking-wider uppercase transition-all flex items-center gap-2 shadow-lg backdrop-blur-xs"
              >
                <span>Entrer dans l'interface</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] text-slate-500 font-sans">
                (Cliquez n'importe où pour passer)
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
