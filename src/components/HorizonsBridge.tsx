import React, { useState } from 'react';
import { HorizonJobNode, AnyCognitiveNode } from '../types';
import { Compass, Sparkles, CheckCircle2, ArrowRight, BookOpen, AlertCircle, Plus, Layers, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HorizonsBridgeProps {
  nodes: AnyCognitiveNode[];
  onSelectNode: (node: AnyCognitiveNode) => void;
  onAddHorizon: (horizon: HorizonJobNode) => void;
}

export const HorizonsBridge: React.FC<HorizonsBridgeProps> = ({
  nodes,
  onSelectNode,
  onAddHorizon
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const horizonJobs = nodes.filter((n) => n.category === 'horizon_job') as HorizonJobNode[];
  const skills = nodes.filter((n) => n.category.startsWith('skill_'));
  const capacities = nodes.filter((n) => n.category === 'capacity_cognitive');

  const handleGenerateMoreHorizons = async () => {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/explore-horizons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillsSummary: skills.map((s) => s.name).join(', '),
          capacitiesSummary: capacities.map((c) => c.name).join(', ')
        })
      });

      const data = await res.json();
      if (data.horizons && data.horizons.length > 0) {
        data.horizons.forEach((h: HorizonJobNode) => {
          onAddHorizon(h);
        });
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Impossible d'explorer de nouveaux horizons pour le moment.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="cognitorium-horizons-view" className="space-y-6">
      {/* Hero Explanatory Banner */}
      <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Révélateur de Potentiel & Passerelles Transversales</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Qu'est-ce que tu pourrais faire avec ce que tu possèdes déjà ?
          </h2>

          <p className="text-sm text-orange-100 leading-relaxed">
            Plutôt que d'enfermer votre parcours dans l'intitulé de votre dernier poste, Cognitorium croise vos <strong>compétences réelles</strong> et <strong>capacités cognitives</strong> pour révéler des métiers inattendus et immédiatement accessibles avec de légères passerelles d'apprentissage.
          </p>

          <div className="pt-3">
            <button
              id="btn-ai-discover-horizons"
              onClick={handleGenerateMoreHorizons}
              disabled={isGenerating}
              className="px-4 py-2.5 bg-white hover:bg-orange-50 text-orange-900 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                  <span>Calcul des passerelles cognitives (IA)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  <span>Explorer de nouvelles passerelles (IA)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
          {errorMessage}
        </div>
      )}

      {/* Horizon Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {horizonJobs.map((job) => {
          return (
            <div
              key={job.id}
              onClick={() => onSelectNode(job)}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-orange-300 transition-all p-6 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                      {job.domain}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1.5">{job.name}</h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-2xl font-black text-orange-600">{job.matchScore}%</span>
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase">Affinité</span>
                  </div>
                </div>

                {/* Rationale */}
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {job.rationale}
                </p>

                {/* Matching Skills */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                    Compétences Déjà Possédées ({job.matchingSkills?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {job.matchingSkills?.map((ms, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium border border-emerald-200 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        {ms}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills & Bridge */}
                {job.missingSkills && job.missingSkills.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                      Pont d'apprentissage & Compétences Manquantes ({job.missingSkills.length})
                    </h4>
                    <div className="space-y-2">
                      {job.missingSkills.map((missing, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between font-semibold text-amber-900">
                            <span>{missing.name}</span>
                            <span className="text-[10px] uppercase px-1.5 py-0.5 bg-amber-200 text-amber-800 rounded">
                              {missing.importance}
                            </span>
                          </div>
                          <p className="text-[11px] text-amber-800">
                            💡 <strong>Formation conseillée :</strong> {missing.learningBridge}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Cliquez pour inspecter la filiation</span>
                <span className="font-semibold text-orange-600 flex items-center gap-1">
                  Voir dans le réseau <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
