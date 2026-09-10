import React, { useState } from 'react';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Layers, 
  GitBranch, 
  Compass, 
  FileText, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAccount } from '../../types/authTypes';

interface CognitoriumTutorialOnboardingProps {
  user: UserAccount | null;
  onFinish: () => void;
  onSkip: () => void;
}

const TUTORIAL_STEPS = [
  {
    stepNumber: 1,
    badge: 'Fondation • Étape 1/5',
    title: "L'Expérience décomposée en missions",
    subtitle: "Une expérience n'est pas une simple ligne de CV, c'est un ensemble d'actions concrètes.",
    icon: <Layers className="w-6 h-6 text-cyan-400" />,
    description: "Dans Cognitorium, chaque formation, poste ou projet personnel est modélisé comme un nœud source. Ce nœud est découpé en tâches réelles, situations professionnelles et contraintes rencontrées sur le terrain.",
    highlights: [
      "Traçabilité par contexte d'action (chantier, entreprise, laboratoire)",
      "Décomposition précise en missions élémentaires",
      "Prise en compte des contraintes et des imprévus surmontés"
    ],
    demoVisual: {
      type: 'experience',
      title: 'Conduite de travaux VRD (SOBECA)',
      items: [
        'Mission : Implantation et piquetage de réseaux',
        'Mission : Coordination de 2 équipes sous-traitantes',
        'Mission : Sécurité chantier et accueil PPSPS / SST'
      ]
    }
  },
  {
    stepNumber: 2,
    badge: 'Épistémologie • Étape 2/5',
    title: "L'Émergence des compétences et des preuves",
    subtitle: "Zéro hallucination : chaque compétence est liée à une réalisation mesurable.",
    icon: <GitBranch className="w-6 h-6 text-purple-400" />,
    description: "Les compétences ne sont pas auto-proclamées. Elles émergent directement des missions accomplies, avec des indices de confiance et des statuts épistémiques stricts : Établi (validé), Modèle (inféré par IA) ou Spéculatif.",
    highlights: [
      "Distinction entre compétences techniques, relationnelles et transversales",
      "Évaluation par triangulation et pièces de preuve",
      "Validation humaine systématique pour toutes les suggestions IA"
    ],
    demoVisual: {
      type: 'skills',
      title: 'Compétences générées',
      items: [
        'Métrés & Récolement DOE (Technique • 90%)',
        'Management & Cadence opérationnelle (Humain • 85%)',
        'Régulation du stress & Imprévus (Capacité cognitive)'
      ]
    }
  },
  {
    stepNumber: 3,
    badge: 'Navigation • Étape 3/5',
    title: "Le Volant de navigation & le Connectome",
    subtitle: "Passez instantanément d'une vue synthétique à une exploration en profondeur.",
    icon: <Compass className="w-6 h-6 text-blue-400" />,
    description: "Le Volant Cognitorium permet de basculer en un clic entre les 6 grands rayons cardinaux : Profil, Expériences, Compétences, Possibilités, Évolution et Savoirs théoriques. Visualisez vos acquis en réseau 2D, arbre hiérarchique ou matrice de maîtrise.",
    highlights: [
      "Volant circulaire ergonomique toujours accessible",
      "Navigation multi-angles : Réseau 2D, Arbre, Matrice",
      "Zoom sémantique progressif du macroscopique au microscopique"
    ],
    demoVisual: {
      type: 'wheel',
      title: '6 Rayons Cardinaux',
      items: [
        '🧭 Profil & Synthèse globale',
        '🌳 Expériences & Arbre décisionnel',
        '⚡ Passerelles ROME & Métiers cibles'
      ]
    }
  },
  {
    stepNumber: 4,
    badge: 'Orientation • Étape 4/5',
    title: "Les Passerelles ROME (1 911 Métiers)",
    subtitle: "Découvrez toutes les opportunités ouvertes par votre capital cognitif.",
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    description: "Cognitorium croise automatiquement votre profil avec le répertoire officiel de France Travail (1 911 fiches ROME). Le moteur calcule vos scores d'adéquation, met en lumière vos points forts et identifie les compétences complémentaires à acquérir.",
    highlights: [
      "Calcul d'affinité sémantique et compétences communes",
      "Recommandations d'apprentissages ciblés pour combler les manques",
      "Exploration de transitions professionnelles inattendues"
    ],
    demoVisual: {
      type: 'rome',
      title: 'Correspondances calculées',
      items: [
        'F1201 • Conduite de travaux BTP : 88% de couverture',
        'M1402 • Conseil en ergonomie & cognition : 92% de couverture',
        'K2102 • Coordination pédagogique : 84% de couverture'
      ]
    }
  },
  {
    stepNumber: 5,
    badge: 'Finalisation • Étape 5/5',
    title: "CV Ciblé en 1 clic & Vitalité temporelle",
    subtitle: "Vos expériences et compétences prioritaires se mettent à jour selon votre cible.",
    icon: <FileText className="w-6 h-6 text-emerald-400" />,
    description: "Générez un CV entièrement réordonné selon le métier visé : les expériences et compétences clés de la fiche ROME sont automatiquement placées en tête. Vous pouvez tout personnaliser manuellement, exporter en PDF ou copier pour les ATS.",
    highlights: [
      "Priorisation automatique selon le métier cible choisi",
      "Personnalisation intégrale (textes, ordre, masquage)",
      "Suivi de la courbe d'oubli d'Ebbinghaus pour réactiver vos acquis"
    ],
    demoVisual: {
      type: 'cv',
      title: 'Générateur de CV Actif',
      items: [
        'Aligné automatiquement sur votre cible ROME',
        'Édition manuelle complète de chaque puce et mission',
        'Format Moderne, Classique ou ATS exportable'
      ]
    }
  }
];

export const CognitoriumTutorialOnboarding: React.FC<CognitoriumTutorialOnboardingProps> = ({
  user,
  onFinish,
  onSkip
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const step = TUTORIAL_STEPS[currentStepIndex];
  const isLast = currentStepIndex === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      onFinish();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      id="onboarding-tutorial-flow"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#050508] text-slate-100 overflow-y-auto"
    >
      {/* Halo d'ambiance */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header avec progression */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
              C
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 block">
                Tutoriel de Prise en Main
              </span>
              <h1 className="text-sm sm:text-base font-bold text-slate-100">
                Bienvenue dans Cognitorium, {user?.personName || 'Explorateur'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Étapes pills */}
            <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-slate-400">
              {TUTORIAL_STEPS.map((s, idx) => (
                <button
                  key={s.stepNumber}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    idx === currentStepIndex
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                      : idx < currentStepIndex
                      ? 'bg-slate-800 text-cyan-300'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {idx < currentStepIndex ? <Check className="w-3.5 h-3.5" /> : s.stepNumber}
                </button>
              ))}
            </div>

            <button
              id="tutorial-btn-skip"
              onClick={onSkip}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800 transition-colors"
            >
              Passer
            </button>
          </div>
        </div>
      </header>

      {/* Contenu de l'étape */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full flex-1 flex flex-col justify-center">
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Badge & Titre */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-xs font-semibold">
              {step.icon}
              <span>{step.badge}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {step.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              {step.subtitle}
            </p>
          </div>

          {/* Grille : Explication + Démo Visuelle Interactive */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6 items-center">
            {/* Colonne gauche : Description & points clés */}
            <div className="md:col-span-7 space-y-4">
              <p className="text-sm text-slate-400 leading-relaxed">
                {step.description}
              </p>

              <div className="space-y-2.5 pt-2">
                {step.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne droite : Carte visuelle démo */}
            <div className="md:col-span-5 bg-[#0A0A12] border border-cyan-500/20 rounded-2xl p-5 shadow-inner space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                  {step.demoVisual.title}
                </span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </div>

              <div className="space-y-2 pt-1">
                {step.demoVisual.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs text-slate-300 font-mono flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-slate-500 font-mono text-center pt-1">
                Exemple représentatif • Cognitorium Core
              </div>
            </div>
          </div>

          {/* Boutons d'action navigation */}
          <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-800/80">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
                currentStepIndex === 0
                  ? 'opacity-30 cursor-not-allowed text-slate-600'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                id="tutorial-btn-next"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold font-mono transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <span>{isLast ? "Accéder à mon espace Cognitorium" : "Étape suivante"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/60 py-3 text-center text-xs text-slate-500 font-mono">
        <span>Étape {step.stepNumber} sur {TUTORIAL_STEPS.length} • Vous pourrez revoir ce tutoriel à tout moment depuis votre menu profil</span>
      </footer>
    </div>
  );
};
