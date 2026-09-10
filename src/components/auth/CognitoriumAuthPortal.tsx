import React, { useState } from 'react';
import { 
  LogIn, 
  UserPlus, 
  Sparkles, 
  ArrowRight, 
  Search, 
  Compass, 
  ShieldCheck, 
  Layers, 
  Zap, 
  GraduationCap, 
  Briefcase, 
  CheckCircle2, 
  UserCheck,
  User,
  Play
} from 'lucide-react';
import { UserAccount } from '../../types/authTypes';
import { CognitiveProfile, UserJourneyType } from '../../types';
import { PROFILES_PRESETS } from '../../data/initialData';

interface CognitoriumAuthPortalProps {
  savedAccounts: UserAccount[];
  savedCustomProfiles: CognitiveProfile[];
  currentActiveProfile: CognitiveProfile;
  onSelectAccount: (account: UserAccount | null, profile: CognitiveProfile) => void;
  onStartSignUp: () => void;
  onContinueAsGuest: () => void;
  onReplaySplash: () => void;
}

export const CognitoriumAuthPortal: React.FC<CognitoriumAuthPortalProps> = ({
  savedAccounts,
  savedCustomProfiles,
  currentActiveProfile,
  onSelectAccount,
  onStartSignUp,
  onContinueAsGuest,
  onReplaySplash
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'custom' | 'student' | 'professional' | 'transition'>('all');

  // Construire la liste combinée des profils disponibles
  const presetProfiles = PROFILES_PRESETS.map((p) => ({
    profile: p.profile,
    badge: p.tag,
    isPreset: true
  }));

  const customProfiles = savedCustomProfiles.map((p) => ({
    profile: p,
    badge: 'Compte personnalisé',
    isPreset: false
  }));

  const allAvailable = [...customProfiles, ...presetProfiles];

  const filteredProfiles = allAvailable.filter((item) => {
    const p = item.profile;
    if (selectedFilter === 'custom' && item.isPreset) return false;
    if (selectedFilter === 'student' && p.journeyType !== 'student') return false;
    if (selectedFilter === 'professional' && p.journeyType !== 'professional') return false;
    if (selectedFilter === 'transition' && p.journeyType !== 'transition') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.personName.toLowerCase().includes(q) ||
        p.headline.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handlePickProfile = (profile: CognitiveProfile) => {
    // Vérifier si un compte correspondant existe
    const matchingAccount = savedAccounts.find((a) => a.profileId === profile.id) || null;
    onSelectAccount(matchingAccount, profile);
  };

  return (
    <div
      id="cognitorium-auth-portal"
      className="min-h-screen bg-[#050508] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden"
    >
      {/* Halos d'ambiance */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 block">
                  Portail d'Accès & Authentification
                </span>
                <button
                  onClick={onReplaySplash}
                  className="text-[10px] font-mono text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-0.5"
                  title="Rejouer l'animation de marque"
                >
                  <Play className="w-2.5 h-2.5" />
                  <span>Intro</span>
                </button>
              </div>
              <h1 className="text-base font-bold text-slate-100 tracking-tight">
                Cognitorium • Cartographie Cognitive
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="portal-btn-guest"
              onClick={onContinueAsGuest}
              className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Accès direct Invité</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Corps Principal */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 flex flex-col justify-center space-y-8 w-full">
        {/* Titre & Proposition de valeur */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Environnement Épistémique • Données Privées & Locales</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Connectez votre capital cognitif
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl mx-auto font-sans">
            Sélectionnez un profil existant pour reprendre vos explorations, ou créez votre compte pour bénéficier du tutoriel guidé pas-à-pas et de votre cartographie personnalisée.
          </p>
        </div>

        {/* Grille principale : Créer un compte vs Choisir un compte existant */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Colonne Gauche : Créer un nouveau compte (CTA majeur) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-blue-950/40 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <UserPlus className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Nouveau compte • Inconnu qui teste l'app
                </span>
                <h3 className="text-xl font-bold text-slate-100 mt-1">
                  Création de Compte par le Graphe
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Créez votre profil directement au cœur du graphe. Cliquez sur « Créer un nouveau compte » pour déployer le squelette abstrait de votre profil, puis cliquez sur chaque nœud pour ouvrir son volant interactif et le tisser proactivement.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 font-sans">
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-mono font-bold">1</div>
                  <span>Graphe vierge & Déploiement du template abstrait</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-mono font-bold">2</div>
                  <span>Clic direct sur les nœuds & Volant interactif orbital</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-mono font-bold">3</div>
                  <span>Recherche ROME dynamique (1 911 fiches), missions & savoirs</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-mono font-bold">4</div>
                  <span>Validation & Arrivée directe sur l'accueil Cognitorium</span>
                </div>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                id="portal-btn-signup"
                type="button"
                onClick={onStartSignUp}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs sm:text-sm font-black font-mono transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Créer par le Graphe & Volants de Nœuds</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Colonne Droite : Sélectionner un compte existant / profil certifié */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-cyan-400 flex items-center justify-center">
                    <LogIn className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">
                      Choisir un compte existant
                    </h3>
                    <p className="text-xs text-slate-400">
                      Connectez-vous à un profil pour ouvrir directement l'application.
                    </p>
                  </div>
                </div>

                {/* Recherche */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrer un compte..."
                    className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 w-full sm:w-48"
                  />
                </div>
              </div>

              {/* Filtres par parcours */}
              <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                    selectedFilter === 'all'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tous ({allAvailable.length})
                </button>
                {savedCustomProfiles.length > 0 && (
                  <button
                    onClick={() => setSelectedFilter('custom')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                      selectedFilter === 'custom'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-amber-300/80 hover:text-amber-200'
                    }`}
                  >
                    ⭐ Mes Profils ({savedCustomProfiles.length})
                  </button>
                )}
                <button
                  onClick={() => setSelectedFilter('professional')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                    selectedFilter === 'professional'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Professionnels
                </button>
                <button
                  onClick={() => setSelectedFilter('student')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                    selectedFilter === 'student'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Étudiants
                </button>
                <button
                  onClick={() => setSelectedFilter('transition')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                    selectedFilter === 'transition'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Reconversions
                </button>
              </div>

              {/* Liste des comptes / profils disponibles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                {filteredProfiles.map(({ profile, badge, isPreset }) => {
                  const isActive = currentActiveProfile.id === profile.id;
                  return (
                    <div
                      key={profile.id}
                      onClick={() => handlePickProfile(profile)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left group ${
                        isActive
                          ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                            isPreset ? 'bg-slate-800 text-slate-300' : 'bg-amber-500/20 text-amber-300 font-bold'
                          }`}>
                            {badge}
                          </span>
                          {isActive && (
                            <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                              Actuel
                            </span>
                          )}
                        </div>

                        <div className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                          {profile.personName}
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                          {profile.headline}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-500">
                        <span>{profile.nodes.length} nœuds modélisés</span>
                        <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                          Connexion →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Aide & Note */}
            <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between pt-2 border-t border-slate-800/60">
              <span>Conseil : Näthan Cabrol offre le profil le plus complet (BTP, Ergonomie, Pédagogie)</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/70 py-3 text-center text-xs text-slate-500 font-mono">
        <span>COGNITORIUM • Moteur de représentation multimodale du capital cognitif</span>
      </footer>
    </div>
  );
};
