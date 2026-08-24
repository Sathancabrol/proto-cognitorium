import React, { useState } from 'react';
import { HorizonJobNode, AnyCognitiveNode } from '../types';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  AlertCircle, 
  Plus, 
  Layers, 
  Loader2, 
  Search, 
  GraduationCap, 
  ShieldCheck, 
  ExternalLink,
  Target
} from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');

  const horizonJobs = nodes.filter((n) => n.category === 'horizon_job') as HorizonJobNode[];
  const skills = nodes.filter((n) => n.category.startsWith('skill_'));
  const capacities = nodes.filter((n) => n.category === 'capacity_cognitive');

  // Domains list
  const domains = Array.from(new Set(horizonJobs.map((j) => j.domain).filter(Boolean)));

  const filteredJobs = horizonJobs.filter((job) => {
    if (selectedDomain !== 'all' && job.domain !== selectedDomain) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = job.name.toLowerCase().includes(q);
      const matchRome = job.romeCode?.toLowerCase().includes(q) ?? false;
      const matchDesc = job.description?.toLowerCase().includes(q) ?? false;
      return matchName || matchRome || matchDesc;
    }
    return true;
  });

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
    <div id="cognitorium-horizons-view" className="space-y-6 pb-12">
      {/* Hero Explanatory Banner */}
      <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Révélateur de Potentiel & Référentiel ROME France Travail</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Qu'est-ce que vous pourriez faire avec ce que vous possédez déjà ?
          </h2>

          <p className="text-sm text-orange-100 leading-relaxed">
            Plutôt que d'enfermer votre parcours dans l'intitulé de votre dernier poste, Cognitorium croise vos <strong>compétences réelles</strong> et <strong>capacités cognitives</strong> pour révéler des métiers inattendus, alignés avec les codes ROME et immédiatement accessibles via des micro-passerelles d'apprentissage.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              id="btn-ai-discover-horizons"
              onClick={handleGenerateMoreHorizons}
              disabled={isGenerating}
              className="px-5 py-2.5 bg-white hover:bg-orange-50 text-orange-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
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
        <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200">
          {errorMessage}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-orange-600" />
          <span className="text-xs font-bold text-slate-800">
            {filteredJobs.length} Horizon{filteredJobs.length > 1 ? 's' : ''} Métier{filteredJobs.length > 1 ? 's' : ''} Détecté{filteredJobs.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par métier, code ROME..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none"
          >
            <option value="all">Tous les domaines</option>
            {domains.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Horizon Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job) => {
          return (
            <div
              key={job.id}
              onClick={() => onSelectNode(job)}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-orange-300 transition-all p-6 cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                        {job.domain}
                      </span>
                      {job.romeCode && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-900 text-white rounded-full">
                          ROME {job.romeCode}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">{job.name}</h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-orange-600">{job.compatibilityLevel || 'À explorer'}</span>
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase">Compatibilité estimée</span>
                  </div>
                </div>

                {/* Rationale & Explainability */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {job.rationale}
                  </p>

                  {job.explainabilityFactors && (
                    <div className="pt-2 border-t border-slate-200/60 text-[11px] space-y-1">
                      <span className="font-semibold text-slate-900 block">Pourquoi cette passerelle fonctionne :</span>
                      {job.explainabilityFactors.strengthPoints?.map((sp, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span>{sp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Matching Skills */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                    Compétences Déjà Validées ({job.matchingSkills?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {job.matchingSkills?.map((ms, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-medium border border-emerald-200 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{ms}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills & Learning Bridge */}
                {job.missingSkills && job.missingSkills.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                      Ponts d'Apprentissage & Micro-Formations ({job.missingSkills.length})
                    </h4>
                    <div className="space-y-2">
                      {job.missingSkills.map((missing, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between font-semibold text-amber-900">
                            <span>{missing.name}</span>
                            <span className="text-[10px] uppercase px-2 py-0.5 bg-amber-200 text-amber-800 rounded-md">
                              {missing.importance}
                            </span>
                          </div>
                          <p className="text-[11px] text-amber-800 leading-relaxed">
                            💡 <strong>Objectif :</strong> {missing.learningBridge}
                          </p>
                          {missing.recommendedTraining && (
                            <div className="p-2 bg-white/80 rounded-xl border border-amber-200 text-[10px] text-slate-700 space-y-0.5">
                              <span className="font-bold text-slate-900 block flex items-center gap-1">
                                <GraduationCap className="w-3 h-3 text-amber-600" />
                                {missing.recommendedTraining.title}
                              </span>
                              <span className="text-slate-500 block">
                                {missing.recommendedTraining.providerOrType} • {missing.recommendedTraining.duration} ({missing.recommendedTraining.format})
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Cliquez pour inspecter l'analyse complète</span>
                <span className="font-semibold text-orange-600 flex items-center gap-1">
                  Inspecter les détails <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
