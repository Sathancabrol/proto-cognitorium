import React, { useState } from 'react';
import { X, Sparkles, Loader2, CheckCircle2, BookOpen, Layers, ArrowRight } from 'lucide-react';
import { AnyCognitiveNode, GraphEdge } from '../types';
import confetti from 'canvas-confetti';

interface ExperienceDistillerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDistillComplete: (newNodes: AnyCognitiveNode[], newEdges: GraphEdge[]) => void;
}

const SAMPLE_NARRATIVES = [
  {
    title: '🏗️ Chantier & Gros Œuvre',
    text: "Conducteur de travaux sur un chantier de réhabilitation lourde en centre-ville pendant 2 ans. Coordination quotidienne de 15 artisans et sous-traitants, négociation des devis fournisseurs avec marges serrées, résolution d'imprévus de structure en direct avec les architectes et tenue d'un planning sous pénalités de retard."
  },
  {
    title: '🎵 Organisation d\'Événement Culturel',
    text: "Co-fondateur et coordinateur général d'un festival associatif de musique accueillant 3 500 festivaliers. Gestion du budget de 60 000 €, encadrement de 45 bénévoles, respect des protocoles préfectoraux de sécurité ERP, gestion des annulations d'artistes en urgence et logistique des flux."
  },
  {
    title: '💻 Projet Personnel App & IA',
    text: "Conception et déploiement en autodidacte d'une application d'analyse de données satellites pour le suivi de la déforestation. Utilisation de Python, pipelines de données géospatiales, intégration d'un modèle de vision par ordinateur et vulgarisation pour le grand public."
  },
  {
    title: '🚑 Bénévolat Premiers Secours',
    text: "Secouriste opérationnel bénévole pendant 3 ans au sein d'une association de sécurité civile. Interventions d'urgence lors d'événements de grande ampleur, communication en milieu stressant, gestion de victimes en état de choc et travail d'équipe sous forte charge émotionnelle."
  }
];

export const ExperienceDistillerModal: React.FC<ExperienceDistillerModalProps> = ({
  isOpen,
  onClose,
  onDistillComplete
}) => {
  const [narrativeText, setNarrativeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDistill = async (textToUse?: string) => {
    const text = textToUse || narrativeText;
    if (!text.trim()) {
      setError("Veuillez saisir ou sélectionner un récit d'expérience.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/distill-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experienceText: text })
      });

      const data = await response.json();
      if (!data.success || !data.distilled) {
        throw new Error(data.error || "Erreur lors de la distillation cognitive.");
      }

      const { experience, skills, capacities, potentialJobs } = data.distilled;

      const newNodes: AnyCognitiveNode[] = [
        experience,
        ...(skills || []),
        ...(capacities || []),
        ...(potentialJobs || [])
      ];

      // Build edges connecting newly created nodes
      const newEdges: GraphEdge[] = [];

      // Connect experience to skills
      (skills || []).forEach((s: any, idx: number) => {
        newEdges.push({
          id: `edge-${experience.id}-${s.id}`,
          source: experience.id,
          target: s.id,
          type: 'acquired_in',
          strength: 0.9,
          label: 'Acquis dans cette expérience'
        });
      });

      // Connect skills to capacities
      (capacities || []).forEach((c: any) => {
        (skills || []).forEach((s: any) => {
          newEdges.push({
            id: `edge-${s.id}-${c.id}`,
            source: s.id,
            target: c.id,
            type: 'feeds_capacity',
            strength: 0.85,
            label: 'Nourrit la capacité'
          });
        });
      });

      // Connect capacities/skills to potential jobs
      (potentialJobs || []).forEach((j: any) => {
        if (capacities && capacities.length > 0) {
          newEdges.push({
            id: `edge-${capacities[0].id}-${j.id}`,
            source: capacities[0].id,
            target: j.id,
            type: 'unlocks_horizon',
            strength: 0.9,
            label: 'Débloque cet horizon'
          });
        }
      });

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });

      onDistillComplete(newNodes, newEdges);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erreur lors de l'analyse IA.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="experience-distiller-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Distillateur d'Expérience Cognitorium</h2>
              <p className="text-xs text-blue-100">
                Transformez un récit brut en réseau de compétences et capacités cognitives
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Sample Prompts */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Exemples de récits prêts à tester (1 clic)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_NARRATIVES.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setNarrativeText(sample.text);
                  }}
                  className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-xs text-slate-700 group"
                >
                  <strong className="block text-slate-900 font-semibold mb-0.5 group-hover:text-blue-600">
                    {sample.title}
                  </strong>
                  <span className="line-clamp-2 text-[11px] text-slate-500">{sample.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Narrative Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
              <span>Votre vécu / projet / mission</span>
              <span className="text-[11px] font-normal text-slate-400">Langage naturel libre</span>
            </label>
            <textarea
              rows={4}
              value={narrativeText}
              onChange={(e) => setNarrativeText(e.target.value)}
              placeholder="Décrivez une expérience, un projet ou un apprentissage avec vos propres mots (missions, difficultés rencontrées, outils manipulés, contexte)..."
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Value Proposition Note */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
            <strong className="text-slate-800 block font-semibold">Ce que Cognitorium va extraire :</strong>
            <p>
              1. Compétences techniques & transversales précises avec demi-vie temporelle.
              <br />
              2. Capacités cognitives méta (organisation systémique, agilité spatiale, gestion du stress).
              <br />
              3. Nouveaux horizons et ponts de formation vers des métiers insoupçonnés.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Annuler
          </button>

          <button
            id="submit-distill-btn"
            onClick={() => handleDistill()}
            disabled={isLoading || !narrativeText.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Distillation du capital cognitif en cours...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Distiller et intégrer au réseau</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
