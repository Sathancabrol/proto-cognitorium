import React, { useState } from 'react';
import { 
  UserPlus, 
  LogIn, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  RefreshCw, 
  ShieldCheck, 
  ArrowRight, 
  Compass, 
  Check, 
  Search,
  Users
} from 'lucide-react';
import { CognitiveProfile, UserJourneyType } from '../types';
import { PROFILES_PRESETS } from '../data/initialData';

interface AccountLoginGateProps {
  currentProfile: CognitiveProfile;
  savedCustomProfiles: CognitiveProfile[];
  onSelectAndLogin: (profile: CognitiveProfile) => void;
  onOpenCreateAccount: () => void;
  onContinueAsGuest: () => void;
}

export const AccountLoginGate: React.FC<AccountLoginGateProps> = ({
  currentProfile,
  savedCustomProfiles,
  onSelectAndLogin,
  onOpenCreateAccount,
  onContinueAsGuest
}) => {
  const [filterJourney, setFilterJourney] = useState<UserJourneyType | 'all' | 'custom'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Combiner les profils certifiés et les profils personnalisés créés par l'utilisateur
  const allProfiles = [
    ...savedCustomProfiles,
    ...PROFILES_PRESETS.map((p) => p.profile)
  ];

  // Filtrer les profils
  const filteredProfiles = allProfiles.filter((p) => {
    const isCustom = savedCustomProfiles.some((c) => c.id === p.id);
    if (filterJourney === 'custom' && !isCustom) return false;
    if (filterJourney !== 'all' && filterJourney !== 'custom' && p.journeyType !== filterJourney) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.personName.toLowerCase().includes(q);
      const matchHead = p.headline.toLowerCase().includes(q);
      return matchName || matchHead;
    }
    return true;
  });

  return (
    <div id="account-login-gate" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Halo d'ambiance en arrière-plan */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Barre supérieure minimaliste */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/20">
              C
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 block">
                Portail d'Accès & Connexion
              </span>
              <h1 className="text-base font-bold text-white tracking-tight">
                Cognitorium • Cartographie Cognitive
              </h1>
            </div>
          </div>

          <button
            id="gate-btn-guest-quick"
            onClick={onContinueAsGuest}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span>Accès direct Découverte</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Corps Principal */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col justify-center space-y-10 w-full">
        {/* Titre & Proposition */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Environnement sécurisé • Aucune donnée vendue</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Bienvenue dans votre espace cognitif
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Connectez-vous à un compte existant pour reprendre votre exploration, ou créez votre nouveau profil à partir de votre parcours réel.
          </p>
        </div>

        {/* Bloc Principal : 2 colonnes / cartes d'action */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Colonne Gauche : Créer un nouveau compte (Mise en avant) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-900/40 via-slate-900/80 to-indigo-950/40 border border-blue-500/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                <UserPlus className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  Nouveau sur Cognitorium ?
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Créer mon Compte & Profil
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Laissez notre assistant distiller votre CV ou vos expériences. Obtenez instantanément votre arbre de compétences, vos capacités transversales et vos passerelles métiers.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">1</div>
                  <span>Choisissez votre contexte (Étudiant, Cadre, Reconversion)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">2</div>
                  <span>Collez votre CV ou utilisez nos suggestions guidées</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">3</div>
                  <span>Extraction IA assistée avec secours local instantané</span>
                </div>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                id="gate-btn-create-account"
                type="button"
                onClick={onOpenCreateAccount}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center justify-center gap-2 group-hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4 text-blue-200 animate-pulse" />
                <span>Commencer la création de compte</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Colonne Droite : Sélectionner un compte existant */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
                    <LogIn className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Se connecter à un compte
                    </h3>
                    <p className="text-xs text-slate-400">
                      Sélectionnez un profil pour ouvrir directement l'interface.
                    </p>
                  </div>
                </div>

                {/* Champ de recherche */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Chercher un profil..."
                    className="pl-8 pr-3 py-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-48"
                  />
                </div>
              </div>

              {/* Filtres par parcours */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                <button
                  onClick={() => setFilterJourney('all')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    filterJourney === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  Tous ({allProfiles.length})
                </button>
                {savedCustomProfiles.length > 0 && (
                  <button
                    onClick={() => setFilterJourney('custom')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      filterJourney === 'custom'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-800 text-amber-400/80 hover:bg-slate-700'
                    }`}
                  >
                    ⭐ Mes Profils ({savedCustomProfiles.length})
                  </button>
                )}
                <button
                  onClick={() => setFilterJourney('student')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    filterJourney === 'student'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  Étudiants
                </button>
                <button
                  onClick={() => setFilterJourney('professional')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    filterJourney === 'professional'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  Professionnels
                </button>
                <button
                  onClick={() => setFilterJourney('transition')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    filterJourney === 'transition'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  Reconversions
                </button>
              </div>

              {/* Grille des profils disponibles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
                {filteredProfiles.map((p) => {
                  const isCurrent = currentProfile.id === p.id;
                  const isCustom = savedCustomProfiles.some((c) => c.id === p.id);

                  return (
                    <div
                      key={p.id}
                      onClick={() => onSelectAndLogin(p)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 text-left group ${
                        isCurrent
                          ? 'border-blue-500/80 bg-blue-950/30 ring-1 ring-blue-500/40'
                          : 'border-slate-800 bg-slate-850 hover:border-slate-700 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                          {p.personName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white truncate block">
                              {p.personName}
                            </span>
                            {isCustom && (
                              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[9px] font-bold rounded-md">
                                Créé
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight mt-0.5">
                            {p.headline}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                        <span>{p.nodes?.length || 0} éléments cartographiés</span>
                        <div className="flex items-center gap-1 text-blue-400 group-hover:text-blue-300 font-semibold">
                          <span>Se connecter</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Vous pouvez changer de compte à tout moment depuis l'interface.</span>
              <button
                type="button"
                onClick={() => onSelectAndLogin(currentProfile)}
                className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <span>Reprendre avec {currentProfile.personName}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Pied de page */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/60 px-6 py-3 text-center text-xs text-slate-500">
        Cognitorium • Cartographie Cognitive & Système d'Exploitation du Capital Humain • 2026
      </footer>
    </div>
  );
};
