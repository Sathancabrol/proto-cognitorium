import React, { useState } from 'react';
import { X, Sparkles, GraduationCap, Briefcase, RefreshCw, Upload, FileText, ArrowRight, CheckCircle2, User, HelpCircle, Loader2 } from 'lucide-react';
import { CognitiveProfile, UserJourneyType, AnyCognitiveNode, GraphEdge, TaskNode } from '../types';
import { PROFILES_PRESETS } from '../data/initialData';
import confetti from 'canvas-confetti';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProfile: (profile: CognitiveProfile) => void;
  onCreateCustomProfile: (profile: CognitiveProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSelectProfile,
  onCreateCustomProfile
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedJourney, setSelectedJourney] = useState<UserJourneyType>('professional');
  const [entryMethod, setEntryMethod] = useState<'preset' | 'cv' | 'guided'>('preset');
  
  // Custom Profile Form Fields
  const [customName, setCustomName] = useState('');
  const [customHeadline, setCustomHeadline] = useState('');
  const [cvText, setCvText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChoosePreset = (presetProfile: CognitiveProfile) => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
    onSelectProfile(presetProfile);
    onClose();
  };

  const handleStartCvExtraction = async () => {
    if (!cvText.trim()) {
      setExtractError("Veuillez coller le texte de votre CV ou de votre parcours.");
      return;
    }

    setIsExtracting(true);
    setExtractError(null);

    try {
      const response = await fetch('/api/distill-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experienceText: cvText })
      });

      const data = await response.json();
      if (!data.success || !data.distilled) {
        throw new Error(data.error || "Erreur lors de l'extraction de profil.");
      }

      const { experience, skills, capacities, potentialJobs } = data.distilled;
      const taskLabels: string[] = experience.missions?.length
        ? experience.missions
        : ['Décrire les actions réalisées'];
      const tasks: TaskNode[] = taskLabels.map((label, index) => ({
        id: `task-${experience.id}-${index + 1}`,
        name: label,
        category: 'task',
        experienceId: experience.id,
        context: experience.institutionOrContext,
        actions: [label],
        skillsProduced: (skills || []).map((skill: { id: string }) => skill.id),
        description: 'Tâche extraite du CV et soumise à validation.',
        verificationStatus: 'pending',
        confidenceScore: 85,
        inferenceType: 'inference_a_valider'
      }));

      const newNodes: AnyCognitiveNode[] = [
        experience,
        ...tasks,
        ...(skills || []).map((s: any) => ({ ...s, verificationStatus: 'pending' })),
        ...(capacities || []).map((c: any) => ({ ...c, verificationStatus: 'pending' })),
        ...(potentialJobs || []).map((j: any) => ({ ...j, verificationStatus: 'pending' }))
      ];

      const newEdges: GraphEdge[] = [];
      tasks.forEach((task) => {
        newEdges.push({
          id: `edge-${experience.id}-${task.id}`,
          source: experience.id,
          target: task.id,
          type: 'composed_of',
          strength: 0.95,
          label: 'Tâche issue de cette expérience'
        });
        (skills || []).forEach((skill: { id: string }) => {
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

      (capacities || []).forEach((c: any) => {
        (skills || []).forEach((s: any) => {
          newEdges.push({
            id: `edge-${s.id}-${c.id}`,
            source: s.id,
            target: c.id,
            type: 'feeds_capacity',
            strength: 0.85
          });
        });
      });

      (potentialJobs || []).forEach((j: any) => {
        if (capacities && capacities.length > 0) {
          newEdges.push({
            id: `edge-${capacities[0].id}-${j.id}`,
            source: capacities[0].id,
            target: j.id,
            type: 'unlocks_horizon',
            strength: 0.9
          });
        }
      });

      const newProfile: CognitiveProfile = {
        id: `profile-custom-${Date.now().toString(36)}`,
        personName: customName.trim() || 'Mon Profil Cognitorium',
        headline: customHeadline.trim() || experience.name || 'Profil créé via distillation IA',
        coreMotto: 'Construire son capital cognitif étape par étape.',
        journeyType: selectedJourney,
        currentSimulationYear: 2026,
        cognitiveSignature: {
          dominantReasoning: 'En cours de caractérisation',
          transferabilityIndex: 85,
          learningVelocity: 'Élevée',
          adaptabilityIndex: 88,
          summaryText: 'Votre profil a été initialisé à partir de vos données initiales.',
          keyStrengths: skills?.slice(0, 3).map((s: any) => s.name) || ['Polyvalence']
        },
        nodes: newNodes,
        edges: newEdges
      };

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });

      onCreateCustomProfile(newProfile);
      onClose();
    } catch (err: any) {
      console.error(err);
      setExtractError(err.message || "Erreur lors de l'analyse du CV.");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div id="onboarding-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-xl text-white shadow-inner">
              C
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-200">
                Bienvenue dans Cognitorium
              </span>
              <h2 className="text-lg font-bold text-white">Construisons votre Cartographie Cognitive</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              1
            </span>
            <span className={step === 1 ? 'font-bold text-slate-900' : ''}>Votre Contexte</span>
          </div>
          <div className="w-8 h-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              2
            </span>
            <span className={step === 2 ? 'font-bold text-slate-900' : ''}>Mode d'Initialisation</span>
          </div>
          <div className="w-8 h-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              3
            </span>
            <span className={step === 3 ? 'font-bold text-slate-900' : ''}>Validation & Entrée</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: CONTEXT CHOICE */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Quel est votre profil ou votre situation actuelle ?</h3>
                <p className="text-xs text-slate-500">
                  Cognitorium adapte ses modèles d'analyse et ses passerelles de métiers selon votre réalité.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  id="journey-opt-student"
                  onClick={() => setSelectedJourney('student')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    selectedJourney === 'student'
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-3">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 mb-1">Étudiant / Jeune Diplômé</h4>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Valorisez vos projets d'études, stages, engagements associatifs et capacités d'apprentissage.
                    </p>
                  </div>
                </button>

                <button
                  id="journey-opt-professional"
                  onClick={() => setSelectedJourney('professional')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    selectedJourney === 'professional'
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 mb-1">Professionnel en Poste</h4>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Cartographiez vos acquis de terrain, vos compétences invisibles et préparez votre mobilité interne ou externe.
                    </p>
                  </div>
                </button>

                <button
                  id="journey-opt-transition"
                  onClick={() => setSelectedJourney('transition')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    selectedJourney === 'transition'
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 mb-1">Adulte en Reconversion</h4>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Révélez vos compétences transversales réutilisables et découvrez des passerelles concrètes vers d'autres secteurs.
                    </p>
                  </div>
                </button>
              </div>

              {/* Core Philosophy Banner */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
                <strong className="text-slate-900 block font-semibold">Le principe fondamental de Cognitorium :</strong>
                <p className="text-[11px]">
                  <strong>Simplicité en surface, profondeur à la demande.</strong> L'IA propose des compétences et des passerelles à partir de vos vécus, mais vous gardez toujours le contrôle total pour valider, modifier ou refuser chaque élément.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: ENTRY METHOD */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Comment souhaitez-vous démarrer ?</h3>
                <p className="text-xs text-slate-500">
                  Vous pouvez explorer un profil complet représentatif ou importer vos propres données.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  id="method-preset-btn"
                  onClick={() => setEntryMethod('preset')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    entryMethod === 'preset'
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 font-bold text-xs text-slate-900">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Découvrir un Profil Exemple</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Explorez immédiatement le profil de démonstration complet (Sciences Cognitives & VRD, Étudiante Data/IA ou Reconversion Éco-BTP).
                  </p>
                </button>

                <button
                  id="method-cv-btn"
                  onClick={() => setEntryMethod('cv')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    entryMethod === 'cv'
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 font-bold text-xs text-slate-900">
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <span>Importer mon CV ou mon Vécu</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Collez le texte de votre CV ou décrivez une expérience pour que l'IA en distille le réseau de compétences et capacités.
                  </p>
                </button>
              </div>

              {entryMethod === 'preset' && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Sélectionnez un profil pré-configuré :
                  </span>
                  <div className="space-y-2">
                    {PROFILES_PRESETS.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleChoosePreset(p.profile)}
                        className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600">{p.name}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">{p.profile.nodes.length} nœuds</span>
                          </div>
                          <p className="text-[11px] text-slate-500">{p.tag}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: CV / NARRATIVE INPUT & EXTRACTION */}
          {step === 3 && entryMethod === 'cv' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Saisie de vos informations</h3>
                <p className="text-xs text-slate-500">
                  Indiquez votre nom et collez le contenu textuel de votre parcours ou CV.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Votre Nom & Prénom</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="ex: Alex Dupont"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Intitulé de profil ou objectif</label>
                  <input
                    type="text"
                    value={customHeadline}
                    onChange={(e) => setCustomHeadline(e.target.value)}
                    placeholder="ex: Ingénieur logiciel en quête d'impact"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Contenu du CV ou récit de vos expériences clés
                </label>
                <textarea
                  rows={6}
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Collez ici le texte de votre CV (formations, postes occupés, missions réalisées, projets personnels, outils manipulés)..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              {extractError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {extractError}
                </div>
              )}

              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                <strong className="block font-semibold">Validation humaine garantie :</strong>
                <p className="text-[11px]">
                  Toutes les compétences et capacités extraites par l'IA recevront le statut <em>« En attente de validation »</em>. Vous pourrez vérifier la confiance et les preuves avant toute intégration définitive.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Retour
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Passer pour le moment
            </button>
          )}

          {step === 1 && (
            <button
              id="onboarding-next-step-1"
              onClick={() => setStep(2)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-all"
            >
              <span>Continuer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 2 && entryMethod === 'cv' && (
            <button
              id="onboarding-next-step-2"
              onClick={() => setStep(3)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-all"
            >
              <span>Remplir les informations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 3 && entryMethod === 'cv' && (
            <button
              id="onboarding-submit-cv"
              onClick={handleStartCvExtraction}
              disabled={isExtracting || !cvText.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyse & Distillation en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Créer mon Cognitorium</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
