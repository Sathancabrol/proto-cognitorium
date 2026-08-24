import React, { useState } from 'react';
import { X, Sparkles, Loader2, CheckCircle2, BookOpen, Layers, ArrowRight, ShieldCheck, AlertCircle, Check } from 'lucide-react';
import { AnyCognitiveNode, GraphEdge, SkillNode, CapacityNode, HorizonJobNode, ExperienceNode, TaskNode } from '../types';
import confetti from 'canvas-confetti';

interface ExperienceDistillerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDistillComplete: (newNodes: AnyCognitiveNode[], newEdges: GraphEdge[]) => void;
}

/** Normalisation de chaîne pour les correspondances de noms (compétences ↔ capacités ↔ métiers). */
function normalizeName(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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

  // Review step state
  const [step, setStep] = useState<'input' | 'review'>('input');
  const [extractedData, setExtractedData] = useState<{
    experience: ExperienceNode;
    skills: SkillNode[];
    capacities: CapacityNode[];
    potentialJobs: HorizonJobNode[];
  } | null>(null);

  const [selectedSkillIds, setSelectedSkillIds] = useState<Record<string, boolean>>({});
  const [selectedCapacityIds, setSelectedCapacityIds] = useState<Record<string, boolean>>({});
  const [selectedHorizonIds, setSelectedHorizonIds] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleReset = () => {
    setStep('input');
    setExtractedData(null);
    setError(null);
  };

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

      // Mark extracted items as pending or verified
      const preparedExp: ExperienceNode = {
        ...experience,
        verificationStatus: 'verified',
        confidenceScore: 98,
        evidence: [{ id: `ev-${Date.now()}`, source: 'declaration', label: 'Récit saisi par l\'utilisateur', confidenceScore: 98 }]
      };

      // L'IA PROPOSE, l'humain VALIDE : tout ce qui est extrait arrive en attente de validation.
      const preparedSkills: SkillNode[] = (skills || []).map((s: any, idx: number) => ({
        ...s,
        verificationStatus: 'pending',
        inferenceType: 'inference_a_valider',
        confidenceScore: 82,
        evidence: [{ id: `ev-s-${idx}-${Date.now()}`, source: 'ai_inference', label: `Proposé par l'IA à partir de l'expérience « ${preparedExp.name} »`, confidenceScore: 82 }]
      }));

      const preparedCapacities: CapacityNode[] = (capacities || []).map((c: any) => ({
        ...c,
        verificationStatus: 'pending',
        inferenceType: 'inference_a_valider',
        confidenceScore: 78
      }));

      const preparedHorizons: HorizonJobNode[] = (potentialJobs || []).map((j: any) => ({
        ...j,
        verificationStatus: 'pending',
        inferenceType: 'inference_a_valider',
        confidenceScore: 75
      }));

      setExtractedData({
        experience: preparedExp,
        skills: preparedSkills,
        capacities: preparedCapacities,
        potentialJobs: preparedHorizons
      });

      // Default all selected
      const sMap: Record<string, boolean> = {};
      preparedSkills.forEach((s) => { sMap[s.id] = true; });
      setSelectedSkillIds(sMap);

      const cMap: Record<string, boolean> = {};
      preparedCapacities.forEach((c) => { cMap[c.id] = true; });
      setSelectedCapacityIds(cMap);

      const hMap: Record<string, boolean> = {};
      preparedHorizons.forEach((h) => { hMap[h.id] = true; });
      setSelectedHorizonIds(hMap);

      setStep('review');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erreur lors de l'analyse IA.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommitReview = () => {
    if (!extractedData) return;

    const finalSkills = extractedData.skills.filter((s) => selectedSkillIds[s.id]);
    const finalCapacities = extractedData.capacities.filter((c) => selectedCapacityIds[c.id]);
    const finalHorizons = extractedData.potentialJobs.filter((h) => selectedHorizonIds[h.id]);

    // Correspondance par nom : une capacité ou un métier n'est relié qu'aux compétences qu'il cite.
    const skillNameToId = new Map(finalSkills.map((s) => [normalizeName(s.name), s.id]));
    const mapSkillRefs = (refs: string[] | undefined): string[] => {
      if (!refs) return [];
      const ids: string[] = [];
      for (const ref of refs) {
        const direct = finalSkills.find((s) => s.id === ref);
        if (direct) {
          ids.push(direct.id);
        } else {
          const byName = skillNameToId.get(normalizeName(ref));
          if (byName) ids.push(byName);
        }
      }
      return Array.from(new Set(ids));
    };
    const taskLabels = extractedData.experience.missions?.length
      ? extractedData.experience.missions
      : ['Décrire les actions réalisées'];
    const finalTasks: TaskNode[] = taskLabels.map((label, index) => ({
      id: `task-${extractedData.experience.id}-${index + 1}`,
      name: label,
      category: 'task',
      experienceId: extractedData.experience.id,
      context: extractedData.experience.institutionOrContext,
      actions: [label],
      skillsProduced: finalSkills.map((skill) => skill.id),
      description: 'Tâche extraite du récit utilisateur et reliée aux compétences proposées.',
      verificationStatus: 'pending',
      confidenceScore: 85,
      inferenceType: 'inference_a_valider',
      evidence: [{
        id: `ev-task-${extractedData.experience.id}-${index + 1}`,
        source: 'ai_inference',
        label: 'Tâche extraite du récit utilisateur',
        confidenceScore: 85
      }]
    }));

    const newNodes: AnyCognitiveNode[] = [
      extractedData.experience,
      ...finalTasks,
      ...finalSkills,
      ...finalCapacities,
      ...finalHorizons
    ];

    // Build the complete five-level chain.
    const newEdges: GraphEdge[] = [];

    finalTasks.forEach((task) => {
      newEdges.push({
        id: `edge-${extractedData.experience.id}-${task.id}`,
        source: extractedData.experience.id,
        target: task.id,
        type: 'composed_of',
        strength: 0.95,
        label: 'Tâche réalisée dans cette expérience'
      });

      finalSkills.forEach((skill) => {
        newEdges.push({
          id: `edge-${task.id}-${skill.id}`,
          source: task.id,
          target: skill.id,
          type: 'demonstrates_skill',
          strength: 0.85,
          label: 'Cette tâche démontre la compétence'
        });
      });
    });

    // Chaque capacité n'est reliée qu'aux compétences qui la nourrissent (pas de "tout → tout").
    finalCapacities.forEach((c) => {
      const feedingSkills = mapSkillRefs(c.underlyingSkills);
      feedingSkills.forEach((skillId) => {
        newEdges.push({
          id: `edge-${skillId}-${c.id}`,
          source: skillId,
          target: c.id,
          type: 'feeds_capacity',
          strength: 0.85,
          label: 'Cette compétence nourrit la capacité'
        });
      });
    });

    // Chaque métier n'est relié qu'aux compétences matching (par nom) et aux capacités qu'elles alimentent.
    finalHorizons.forEach((j) => {
      const jobSkillIds = mapSkillRefs(j.matchingSkillIds || j.matchingSkills);
      jobSkillIds.forEach((skillId) => {
        newEdges.push({
          id: `edge-${skillId}-${j.id}`,
          source: skillId,
          target: j.id,
          type: 'unlocks_horizon',
          strength: 0.9,
          label: 'Cette compétence ouvre ce métier'
        });
      });
      // Si une capacité est nourrie par l'une de ces compétences, elle devient un pont vers le métier.
      finalCapacities.forEach((c) => {
        const feeds = mapSkillRefs(c.underlyingSkills);
        if (feeds.some((id) => jobSkillIds.includes(id))) {
          newEdges.push({
            id: `edge-${c.id}-${j.id}`,
            source: c.id,
            target: j.id,
            type: 'unlocks_horizon',
            strength: 0.7,
            label: 'Cette capacité renforce le rapprochement'
          });
        }
      });
    });

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 }
    });

    onDistillComplete(newNodes, newEdges);
    handleReset();
    onClose();
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
              <h2 className="text-lg font-bold">Distillateur d'Expérience & CV</h2>
              <p className="text-xs text-blue-100">
                {step === 'input'
                  ? "Transformez un récit brut en réseau de compétences et capacités"
                  : "Validation humaine des compétences extraites par l'IA"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="p-2 hover:bg-white/20 rounded-full text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {step === 'input' && (
            <>
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
                  <span>Votre vécu / projet / missions / CV</span>
                  <span className="text-[11px] font-normal text-slate-400">Langage naturel libre</span>
                </label>
                <textarea
                  rows={5}
                  value={narrativeText}
                  onChange={(e) => setNarrativeText(e.target.value)}
                  placeholder="Décrivez une expérience, un projet ou collez des sections de votre CV avec vos propres mots (missions, outils, imprévus surmontés, résultats)..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 leading-relaxed"
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
                <p className="text-[11px]">
                  1. <strong>Tâches & Actions</strong> précises avec charges cognitives.
                  <br />
                  2. <strong>Compétences techniques & humaines</strong> avec demi-vie temporelle.
                  <br />
                  3. <strong>Capacités cognitives méta</strong> et <strong>Horizons métiers ROME</strong>.
                </p>
              </div>
            </>
          )}

          {step === 'review' && extractedData && (
            <div className="space-y-5">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3 text-xs text-blue-900">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <span>
                  <strong>Validation Humaine :</strong> Cochez les compétences que vous confirmez maîtriser. Vous pourrez les modifier ultérieurement dans l'inspecteur.
                </span>
              </div>

              {/* Experience Info */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400">Expérience extraite</span>
                <h3 className="font-bold text-sm text-slate-900">{extractedData.experience.name}</h3>
                <p className="text-xs text-slate-600">{extractedData.experience.description}</p>
              </div>

              {/* Skills Checkboxes */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Compétences Déduites ({extractedData.skills.length})
                </span>
                <div className="space-y-2">
                  {extractedData.skills.map((skill) => (
                    <label
                      key={skill.id}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedSkillIds[skill.id]
                          ? 'bg-emerald-50/60 border-emerald-300'
                          : 'bg-white border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedSkillIds[skill.id] ?? false}
                          onChange={(e) =>
                            setSelectedSkillIds((prev) => ({ ...prev, [skill.id]: e.target.checked }))
                          }
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <div>
                          <strong className="text-xs text-slate-900 font-bold block">{skill.name}</strong>
                          <span className="text-[11px] text-slate-500">{skill.description}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 shrink-0 ml-2">
                        {skill.baseMastery}%
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Capacities */}
              {extractedData.capacities.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                    Cognition Détectées
                  </span>
                  <div className="space-y-1.5">
                    {extractedData.capacities.map((cap) => (
                      <label
                        key={cap.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer text-xs ${
                          selectedCapacityIds[cap.id]
                            ? 'bg-pink-50/60 border-pink-300'
                            : 'bg-white border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedCapacityIds[cap.id] ?? false}
                            onChange={(e) =>
                              setSelectedCapacityIds((prev) => ({ ...prev, [cap.id]: e.target.checked }))
                            }
                            className="w-4 h-4 text-pink-600 rounded"
                          />
                          <span className="font-bold text-pink-900">{cap.name}</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-pink-700">{cap.level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Horizons */}
              {extractedData.potentialJobs.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                    Horizons Métiers Débloqués
                  </span>
                  <div className="space-y-1.5">
                    {extractedData.potentialJobs.map((job) => (
                      <label
                        key={job.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer text-xs ${
                          selectedHorizonIds[job.id]
                            ? 'bg-orange-50/60 border-orange-300'
                            : 'bg-white border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedHorizonIds[job.id] ?? false}
                            onChange={(e) =>
                              setSelectedHorizonIds((prev) => ({ ...prev, [job.id]: e.target.checked }))
                            }
                            className="w-4 h-4 text-orange-600 rounded"
                          />
                          <div>
                            <span className="font-bold text-orange-950 block">{job.name}</span>
                            {job.romeCode && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-orange-100 text-orange-800 rounded font-semibold">
                                ROME {job.romeCode}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-2 py-0.5">
                          Proposition IA · à valider
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          {step === 'review' ? (
            <button
              onClick={() => setStep('input')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Modifier le récit
            </button>
          ) : (
            <button
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Annuler
            </button>
          )}

          {step === 'input' ? (
            <button
              id="submit-distill-btn"
              onClick={() => handleDistill()}
              disabled={isLoading || !narrativeText.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Distillation en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyser & Prévisualiser</span>
                </>
              )}
            </button>
          ) : (
            <button
              id="confirm-distill-review-btn"
              onClick={handleCommitReview}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Confirmer & Intégrer au profil</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
