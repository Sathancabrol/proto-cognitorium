import React, { useState } from 'react';
import { X, Sparkles, GraduationCap, Briefcase, RefreshCw, Upload, ArrowRight, Loader2, Zap, Check, HelpCircle } from 'lucide-react';
import { CognitiveProfile, UserJourneyType, AnyCognitiveNode, GraphEdge, TaskNode } from '../types';
import { PROFILES_PRESETS } from '../data/initialData';
import confetti from 'canvas-confetti';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProfile: (profile: CognitiveProfile) => void;
  onCreateCustomProfile: (profile: CognitiveProfile) => void;
}

const OBJECTIVE_SUGGESTIONS = [
  {
    category: '👔 Cadre & Direction',
    items: ['Métier cadre', 'Cadre dirigeant', 'Manager d\'équipe', 'Chef de projet technique', 'Cadre des opérations']
  },
  {
    category: '🎓 STI2D & Diplômes',
    items: ['Bac STI2D SIN (Numérique)', 'Bachelier STI2D ITEC', 'Étudiant BTS / BUT', 'Alternant Informatique']
  },
  {
    category: '💻 Tech & Systèmes',
    items: ['Technicien Systèmes & Réseaux', 'Développeur Informatique', 'Administrateur Cloud', 'Expert Cybersécurité']
  },
  {
    category: '🔄 Reconversion & Mobilité',
    items: ['Reconversion vers le Numérique', 'Reconversion Éco-Transition', 'Évolution managériale', 'En recherche active']
  }
];

const CV_EXAMPLE_TEMPLATES = [
  {
    label: '🎓 Bac STI2D SIN (Sète / Numérique)',
    headline: 'Bac STI2D SIN (Numérique)',
    text: "Baccalauréat STI2D option Systèmes d'Information et Numérique (SIN) au lycée à Sète. Projets de programmation Arduino et Python, configuration d'un réseau local (adresses IP, switch, Wi-Fi), conception d'une station connectée en équipe, épreuves pratiques et soutenance orale."
  },
  {
    label: '👔 Métier Cadre & Management',
    headline: 'Métier cadre',
    text: "Cadre responsable de pôle : management d'une équipe de 10 personnes, gestion d'un budget annuel de 350 k€, négociation des contrats avec les sous-traitants, optimisation des processus opérationnels et reporting auprès du comité de direction."
  },
  {
    label: '💻 Développeur & Tech',
    headline: 'Développeur Informatique',
    text: "Développeur full-stack : conception d'applications en TypeScript et React, développement d'APIs Node.js, modélisation de bases de données relationnelles, travail en équipe avec méthode agile (Scrum) et tests unitaires."
  },
  {
    label: '🔄 Reconversion Professionnelle',
    headline: 'Reconversion vers le Numérique',
    text: "10 ans d'expérience dans la logistique et la coordination des flux terrain. En reconversion professionnelle vers l'administration systèmes et réseaux. Forte autonomie, esprit de rigueur et capacité d'apprentissage rapide."
  }
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSelectProfile,
  onCreateCustomProfile
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedJourney, setSelectedJourney] = useState<UserJourneyType>('professional');
  const [entryMethod, setEntryMethod] = useState<'preset' | 'cv' | 'guided'>('cv');
  
  // Custom Profile Form Fields
  const [customName, setCustomName] = useState('');
  const [customHeadline, setCustomHeadline] = useState('');
  const [cvText, setCvText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

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

  const handleApplyTemplate = (tpl: typeof CV_EXAMPLE_TEMPLATES[0]) => {
    setCvText(tpl.text);
    if (!customHeadline.trim()) {
      setCustomHeadline(tpl.headline);
    }
  };

  const handleStartCvExtraction = async (forceLocal = false) => {
    if (!cvText.trim()) {
      setExtractError("Veuillez coller le texte de votre CV ou de votre parcours.");
      return;
    }

    setIsExtracting(true);
    setExtractError(null);
    setFallbackNotice(null);

    try {
      const response = await fetch('/api/distill-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          experienceText: cvText,
          targetObjective: customHeadline.trim() || undefined,
          forceLocal
        })
      });

      const data = await response.json();
      if (!data.success || !data.distilled) {
        throw new Error(data.error || "Erreur lors de l'extraction de profil.");
      }

      if (data.notice) {
        setFallbackNotice(data.notice);
      }

      const { experience, skills, capacities, potentialJobs } = data.distilled;
      const taskLabels: string[] = experience.missions?.length
        ? experience.missions
        : ['Décrire les actions réalisées'];
      const tasks: TaskNode[] = taskLabels.map((label: string, index: number) => ({
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

      // Formatage ultra-sécurisé de tous les nœuds pour garantir l'absence de régression ou d'écran blanc
      const expNode: AnyCognitiveNode = {
        ...experience,
        category: experience.category || 'experience',
        verificationStatus: 'certified'
      };

      const skillNodes: AnyCognitiveNode[] = (skills || []).map((s: any, idx: number) => ({
        id: s.id || `skill-custom-${idx + 1}`,
        name: s.name || `Compétence ${idx + 1}`,
        category: s.category || 'skill_tech',
        baseMastery: typeof s.baseMastery === 'number' ? s.baseMastery : 82,
        acquiredYear: s.acquiredYear || 2024,
        lastPracticedYear: s.lastPracticedYear || 2026,
        halfLifeYears: s.halfLifeYears || 5,
        decayFactor: s.decayFactor || 0.08,
        subSkills: Array.isArray(s.subSkills) ? s.subSkills : [],
        transferabilityScore: s.transferabilityScore || 8,
        description: s.description || 'Compétence identifiée lors de la distillation.',
        verificationStatus: 'pending'
      }));

      const capacityNodes: AnyCognitiveNode[] = (capacities || []).map((c: any, idx: number) => ({
        id: c.id || `cap-custom-${idx + 1}`,
        name: c.name || `Capacité cognitive ${idx + 1}`,
        category: 'capacity_cognitive',
        level: c.level || 'avancé',
        cognitiveDimension: c.cognitiveDimension || 'Analyse & Synthèse',
        underlyingSkills: Array.isArray(c.underlyingSkills) ? c.underlyingSkills : [],
        description: c.description || 'Capacité cognitive sous-jacente.',
        verificationStatus: 'pending'
      }));

      const jobNodes: AnyCognitiveNode[] = (potentialJobs || []).map((j: any, idx: number) => ({
        id: j.id || `job-custom-${idx + 1}`,
        name: j.name || `Horizon métier ${idx + 1}`,
        category: 'horizon_job',
        domain: j.domain || 'Professionnel',
        matchScore: typeof j.matchScore === 'number' ? j.matchScore : 85,
        rationale: j.rationale || 'Passerelle métier identifiée sur la base de vos acquis.',
        matchingSkills: Array.isArray(j.matchingSkills) ? j.matchingSkills : [],
        matchingSkillIds: Array.isArray(j.matchingSkillIds) ? j.matchingSkillIds : [],
        missingSkills: Array.isArray(j.missingSkills) ? j.missingSkills : [],
        unlockedOpportunities: Array.isArray(j.unlockedOpportunities) ? j.unlockedOpportunities : [],
        verificationStatus: 'pending'
      }));

      const newNodes: AnyCognitiveNode[] = [
        expNode,
        ...tasks,
        ...skillNodes,
        ...capacityNodes,
        ...jobNodes
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
        skillNodes.forEach((skill) => {
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

      capacityNodes.forEach((c) => {
        skillNodes.forEach((s) => {
          newEdges.push({
            id: `edge-${s.id}-${c.id}`,
            source: s.id,
            target: c.id,
            type: 'feeds_capacity',
            strength: 0.85
          });
        });
      });

      jobNodes.forEach((j) => {
        if (capacityNodes.length > 0) {
          newEdges.push({
            id: `edge-${capacityNodes[0].id}-${j.id}`,
            source: capacityNodes[0].id,
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
        riasec: {
          social: 70,
          investigatif: 76,
          conventionnel: 68,
          entreprenant: 72,
          artistique: 54,
          realiste: 70,
          code: 'SIR',
          dominantSummary: 'Profil équilibré à forte transférabilité de compétences techniques et managériales.'
        },
        matchMetiers: {
          workLifeBalance: 82,
          socialImpact: 78,
          remuneration: 74,
          collaborationScore: 86,
          adaptabilityScore: 89,
          agileOrgScore: 82,
          managerRoleScore: 75,
          topActivities: [
            { name: 'Résolution de problèmes complexes', score: 90, stars: 5 },
            { name: 'Pilotage & Organisation', score: 84, stars: 4 },
            { name: 'Développement de compétences', score: 82, stars: 4 }
          ],
          recommendedRomeCodes: jobNodes.slice(0, 3).map((pj: any) => ({
            code: pj.name?.match(/[A-Z]\d{4}/)?.[0] || 'M1805',
            title: pj.name,
            matchScore: pj.matchScore || 85,
            description: pj.rationale || pj.domain || 'Horizon professionnel cohérent.'
          }))
        },
        cognitiveSignature: {
          dominantReasoning: 'Analytique & Systémique',
          transferabilityIndex: 85,
          learningVelocity: 'Élevée',
          adaptabilityIndex: 88,
          summaryText: `Votre profil a été initialisé avec succès à partir de votre parcours réel (${experience.name || 'Parcours analysé'}).`,
          keyStrengths: skillNodes.slice(0, 3).map((s) => s.name) || ['Polyvalence', 'Adaptabilité', 'Rigueur'],
          codexInsights: [
            'Capacité éprouvée de transfert de compétences entre situations variées',
            'Raisonnement méthodique et assimilation rapide de contextes nouveaux'
          ]
        },
        nodes: newNodes,
        edges: newEdges
      };

      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 }
      });

      onCreateCustomProfile(newProfile);
      onClose();
    } catch (err: any) {
      console.error("Erreur extraction:", err);
      const rawMsg = err?.message || "";
      if (rawMsg.includes("503") || rawMsg.includes("high demand") || rawMsg.includes("UNAVAILABLE") || rawMsg.startsWith("{")) {
        setExtractError("Les serveurs d'IA distants sont momentanément saturés (503). Utilisez notre extraction locale immédiate ci-dessous pour continuer sans attendre.");
      } else {
        setExtractError(rawMsg || "Erreur lors de l'analyse du CV.");
      }
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div id="onboarding-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-xl text-white shadow-inner">
              C
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-200">
                Création de votre compte & profil
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">Construisons votre Cartographie Cognitive</h2>
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
            <span className={step === 2 ? 'font-bold text-slate-900' : ''}>Mode d'Entrée</span>
          </div>
          <div className="w-8 h-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              3
            </span>
            <span className={step === 3 ? 'font-bold text-slate-900' : ''}>Saisie & Extraction</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
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
                      Valorisez vos projets d'études (STI2D, BTS, BUT, école), stages et compétences pratiques.
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
                    <h4 className="font-bold text-xs text-slate-900 mb-1">Professionnel & Cadre</h4>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Cartographiez vos responsabilités managériales, acquis de terrain et préparez votre mobilité.
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
                <h3 className="text-base font-bold text-slate-900">Comment souhaitez-vous créer votre espace ?</h3>
                <p className="text-xs text-slate-500">
                  Importez votre propre parcours pour créer votre profil, ou explorez d'abord un exemple complet.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  id="method-cv-btn"
                  onClick={() => setEntryMethod('cv')}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    entryMethod === 'cv'
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 bg-blue-600 text-white rounded-full">
                    Recommandé
                  </span>
                  <div className="flex items-center gap-2 mb-2 font-bold text-xs text-slate-900">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Créer Mon Profil (CV ou Parcours)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Collez le texte de votre CV ou décrivez une expérience clé. Notre moteur distillera instantanément vos compétences et passerelles.
                  </p>
                </button>

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
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Découvrir un Profil Exemple</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Explorez immédiatement une démonstration complète (Sciences Cognitives & VRD, Étudiante Data/IA ou Reconversion BTP).
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

          {/* STEP 3: CV / NARRATIVE INPUT & EXTRACTION WITH RICH INTERACTIVE SUGGESTIONS */}
          {step === 3 && entryMethod === 'cv' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Création de votre profil personnalisé</h3>
                <p className="text-xs text-slate-500">
                  Renseignez votre nom, votre objectif ou statut, puis décrivez ou collez votre parcours.
                </p>
              </div>

              {/* Identity & Headline with Interactive Suggestions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Votre Nom & Prénom <span className="text-slate-400 font-normal">(ou pseudo)</span>
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="ex: Alex Dupont, Thomas V."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] text-slate-400">Suggestions :</span>
                    <button
                      type="button"
                      onClick={() => setCustomName('Alex Dupont')}
                      className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"
                    >
                      Alex Dupont
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomName('Thomas V.')}
                      className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"
                    >
                      Thomas V.
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Intitulé de profil ou objectif
                    </label>
                    <span className="text-[10px] text-blue-600 font-medium">Suggestions interactives ci-dessous ↓</span>
                  </div>
                  <input
                    type="text"
                    list="headline-datalist"
                    value={customHeadline}
                    onChange={(e) => setCustomHeadline(e.target.value)}
                    placeholder="ex: Métier cadre, Bac STI2D SIN, Ingénieur logiciel..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <datalist id="headline-datalist">
                    <option value="Métier cadre" />
                    <option value="Cadre dirigeant" />
                    <option value="Manager d'équipe" />
                    <option value="Bac STI2D SIN (Numérique)" />
                    <option value="Technicien Systèmes & Réseaux" />
                    <option value="Développeur Informatique" />
                    <option value="Reconversion vers le Numérique" />
                  </datalist>
                </div>
              </div>

              {/* Interactive Suggestions Chips for Objective/Headline */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Cliquez pour choisir votre intitulé ou objectif :</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Remplissage direct</span>
                </div>

                <div className="space-y-2">
                  {OBJECTIVE_SUGGESTIONS.map((group) => (
                    <div key={group.category} className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-[10px] font-bold text-slate-500 min-w-[120px]">{group.category} :</span>
                      <div className="flex flex-wrap gap-1">
                        {group.items.map((item) => {
                          const isSelected = customHeadline.trim().toLowerCase() === item.toLowerCase();
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setCustomHeadline(item)}
                              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
                                isSelected
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-white hover:bg-blue-50 text-slate-700 border border-slate-200 hover:border-blue-300'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                              <span>{item}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience / CV Content with 1-Click Interactive Examples */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Contenu du CV ou récit de vos expériences clés
                  </label>
                  <span className="text-[11px] text-slate-500">
                    💡 Cliquez sur un exemple pour remplir ou tester directement :
                  </span>
                </div>

                {/* Example Quick Inserts */}
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {CV_EXAMPLE_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.label}
                      type="button"
                      onClick={() => handleApplyTemplate(tpl)}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 rounded-xl text-[11px] font-semibold transition-colors flex items-center gap-1"
                      title="Insérer cet exemple de parcours"
                    >
                      <Zap className="w-3 h-3 text-indigo-600" />
                      <span>{tpl.label}</span>
                    </button>
                  ))}
                </div>

                <textarea
                  rows={5}
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Collez ici le texte de votre CV (ex: Bac STI2D SIN à Sète, poste de cadre, formations, missions, projets réalisés, logiciels maîtrisés)..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              {extractError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl space-y-2">
                  <div className="font-semibold flex items-center gap-1.5">
                    <span>⚠️ {extractError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStartCvExtraction(true)}
                    className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Lancer l'analyse locale instantanée (moteur de secours)</span>
                  </button>
                </div>
              )}

              {fallbackNotice && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl">
                  {fallbackNotice}
                </div>
              )}

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                <strong className="block font-semibold">Validation humaine garantie :</strong>
                <p className="text-[11px]">
                  Toutes les compétences et capacités extraites recevront le statut <em>« En attente de validation »</em>. Vous pourrez vérifier la confiance et les preuves avant toute intégration définitive.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
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
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-all"
            >
              <span>Continuer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 2 && entryMethod === 'cv' && (
            <button
              id="onboarding-next-step-2"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-all"
            >
              <span>Remplir les informations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 3 && entryMethod === 'cv' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStartCvExtraction(true)}
                disabled={isExtracting || !cvText.trim()}
                className="hidden sm:flex px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200/80 rounded-xl transition-colors items-center gap-1 border border-slate-300"
                title="Analyser sans interroger l'IA distante"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Extraction Locale Rapide</span>
              </button>

              <button
                id="onboarding-submit-cv"
                onClick={() => handleStartCvExtraction(false)}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
