import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Loader2,
  FileText
} from 'lucide-react';
import { UserAccount } from '../../types/authTypes';
import { CognitiveProfile, UserJourneyType } from '../../types';
import { INITIAL_COGNITORIUM_PROFILE } from '../../data/initialData';

interface CognitoriumSignUpFlowProps {
  onCancel: () => void;
  onSignUpSuccess: (newAccount: UserAccount, generatedProfile: CognitiveProfile) => void;
}

const COMMON_TARGET_JOBS = [
  { code: 'F1201', title: 'Conducteur de travaux BTP & VRD', category: 'BTP & Travaux' },
  { code: 'M1402', title: 'Ergonome & Facteurs Humains', category: 'Sciences Cognitives' },
  { code: 'M1805', title: 'Développeur Full-Stack & Systèmes', category: 'Informatique' },
  { code: 'K2102', title: 'Coordinateur Pédagogique & Formation', category: 'Formation' },
  { code: 'M1403', title: 'Chef de projet Études & Organisation', category: 'Direction' }
];

export const CognitoriumSignUpFlow: React.FC<CognitoriumSignUpFlowProps> = ({
  onCancel,
  onSignUpSuccess
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [personName, setPersonName] = useState('');
  const [email, setEmail] = useState('');
  const [targetTitle, setTargetTitle] = useState('Conducteur de travaux BTP & VRD');
  const [targetRomeCode, setTargetRomeCode] = useState('F1201');
  const [journeyType, setJourneyType] = useState<UserJourneyType>('professional');
  const [summaryText, setSummaryText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim()) {
      setErrorMsg("Veuillez renseigner votre nom complet.");
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg("Veuillez renseigner une adresse email valide.");
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTitle.trim()) {
      setErrorMsg("Veuillez indiquer un métier visé ou un objectif professionnel.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    setTimeout(() => {
      const newUserId = 'usr_' + Date.now().toString(36);
      const newProfileId = 'prof_' + Date.now().toString(36);

      const newAccount: UserAccount = {
        id: newUserId,
        email: email.trim(),
        personName: personName.trim(),
        headline: targetTitle,
        targetTitle,
        targetRomeCode,
        journeyType,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        hasCompletedOnboarding: false,
        profileId: newProfileId
      };

      // Créer un profil initialisé basé sur le socle avec les informations personnalisées
      const customProfile: CognitiveProfile = {
        ...INITIAL_COGNITORIUM_PROFILE,
        id: newProfileId,
        personName: personName.trim(),
        headline: targetTitle,
        email: email.trim(),
        journeyType,
        coreMotto: summaryText.trim() || `Professionnel engagé et rigoureux dans le domaine de ${targetTitle}.`
      };

      setIsSubmitting(false);
      onSignUpSuccess(newAccount, customProfile);
    }, 600);
  };

  return (
    <div
      id="signup-flow-screen"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#050508] text-slate-100 overflow-y-auto"
    >
      {/* Halos d'ambiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={step === 1 ? onCancel : () => setStep(1)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Retour"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 block">
                Création de Compte
              </span>
              <h1 className="text-base font-bold text-slate-100">
                Rejoindre Cognitorium
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className={`px-2 py-0.5 rounded-md ${step === 1 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-600'}`}>
              1. Identité
            </span>
            <span>→</span>
            <span className={`px-2 py-0.5 rounded-md ${step === 2 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-600'}`}>
              2. Objectif
            </span>
          </div>
        </div>
      </header>

      {/* Formulaire Principal */}
      <main className="relative z-10 max-w-xl mx-auto px-4 py-8 sm:py-12 w-full flex-1 flex flex-col justify-center">
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl relative">
          {errorMsg && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 font-mono">
              ⚠️ {errorMsg}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
                  <User className="w-3.5 h-3.5" />
                  <span>Étape 1 : Identité & Contact</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Comment vous appelez-vous ?
                </h2>
                <p className="text-xs text-slate-400">
                  Ces informations permettront d'éditer vos bilans de compétences et vos CV ciblés.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Nom & Prénom <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-input-name"
                      type="text"
                      required
                      value={personName}
                      onChange={(e) => setPersonName(e.target.value)}
                      placeholder="Ex: Näthan Cabrol, Sarah Martin..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Adresse Email <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-input-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre.email@exemple.fr"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-2">
                    Votre situation actuelle
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setJourneyType('professional')}
                      className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                        journeyType === 'professional'
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Briefcase className="w-4 h-4 mb-1 text-cyan-400" />
                      <span className="block font-bold">En poste / Salarié</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setJourneyType('student')}
                      className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                        journeyType === 'student'
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4 mb-1 text-cyan-400" />
                      <span className="block font-bold">Étudiant / Alternant</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setJourneyType('transition')}
                      className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                        journeyType === 'transition'
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 mb-1 text-cyan-400" />
                      <span className="block font-bold">Reconversion</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
                >
                  Annuler
                </button>

                <button
                  id="signup-btn-step1-next"
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold font-mono transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <span>Continuer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Étape 2 : Métier Cible & Vocation</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Quel métier souhaitez-vous cibler ?
                </h2>
                <p className="text-xs text-slate-400">
                  Cognitorium calculera instantanément votre taux d'adéquation et alignera votre CV sur ce métier.
                </p>
              </div>

              <div className="space-y-4">
                {/* Suggestions métiers rapides */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-2">
                    Suggestions rapides de métiers clés
                  </label>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {COMMON_TARGET_JOBS.map((job) => (
                      <button
                        key={job.code}
                        type="button"
                        onClick={() => {
                          setTargetTitle(job.title);
                          setTargetRomeCode(job.code);
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                          targetRomeCode === job.code
                            ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <span className="font-mono text-[10px] text-cyan-400 mr-2">{job.code}</span>
                          <span className="font-semibold text-slate-200">{job.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{job.category}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Intitulé personnalisé ou ajusté
                  </label>
                  <input
                    type="text"
                    required
                    value={targetTitle}
                    onChange={(e) => setTargetTitle(e.target.value)}
                    placeholder="Ex: Conducteur de travaux BTP & VRD..."
                    className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Phrase d'accroche ou résumé (facultatif)
                  </label>
                  <textarea
                    rows={2}
                    value={summaryText}
                    onChange={(e) => setSummaryText(e.target.value)}
                    placeholder="Ex: Rigoureux et méthodique, passionné par la gestion des aléas et la conduite d'opérations..."
                    className="w-full px-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour</span>
                </button>

                <button
                  id="signup-btn-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold font-mono transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Initialisation...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>Créer mon compte & Démarrer le tuto</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/60 py-3 text-center text-xs text-slate-500 font-mono">
        <span>Sécurisé • Persistance locale dans votre navigateur • Prêt pour le tutoriel d'onboarding</span>
      </footer>
    </div>
  );
};
