import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { VolantSidebar } from './components/VolantSidebar';
import { TopHeaderBar } from './components/TopHeaderBar';
import { DashboardView } from './components/DashboardView';
import { NetworkGraph } from './components/NetworkGraph';
import { TemporalNetworkGraph } from './components/TemporalNetworkGraph';
import { TreeView } from './components/TreeView';
import { TableView } from './components/TableView';
import { HorizonsBridge } from './components/HorizonsBridge';
import { MetiersGraph } from './components/MetiersGraph';
import { DecayTimeline } from './components/DecayTimeline';
import { CognitiveSignature } from './components/CognitiveSignature';
import { NodeInspectorModal } from './components/NodeInspectorModal';
import { ExperienceDistillerModal } from './components/ExperienceDistillerModal';
import { ValidationCenterModal } from './components/ValidationCenterModal';
import { OnboardingModal } from './components/OnboardingModal';
import { QuickAddNodeModal, QuickCreateType } from './components/QuickAddNodeModal';
import { PsychologyAtlasView } from './components/PsychologyAtlasView';
import { ExperimentStudio } from './components/ExperimentStudio';
import { MetacogLoopView } from './components/MetacogLoopView';
import { PsyRefView } from './components/PsyRefView';
import { ResourcesView } from './components/ResourcesView';
import { MesEvaluationsView } from './components/MesEvaluationsView';
import { CognitiveBiasesView } from './components/CognitiveBiasesView';
import { MultiProjectsView } from './components/MultiProjectsView';
import { TargetedCvView } from './components/TargetedCvView';
import { ProfileManagementModal } from './components/ProfileManagementModal';
import { CognitoriumBrandSplash } from './components/auth/CognitoriumBrandSplash';
import { CognitoriumAuthPortal } from './components/auth/CognitoriumAuthPortal';
import { CognitoriumSignUpFlow } from './components/auth/CognitoriumSignUpFlow';
import { CognitoriumTutorialOnboarding } from './components/auth/CognitoriumTutorialOnboarding';
import { CognitoriumOrganicStudio } from './components/auth/CognitoriumOrganicStudio';
import { AuthFlowStep, UserAccount } from './types/authTypes';
import { INITIAL_COGNITORIUM_PROFILE, PROFILES_PRESETS } from './data/initialData';
import { 
  CognitiveProfile, 
  AnyCognitiveNode, 
  GraphEdge, 
  SkillNode, 
  HorizonJobNode, 
  AppActiveTab, 
  ComplexityMode,
  ProfileAssessment
} from './types';

const STORAGE_KEY = 'cognitorium_active_profile_v10_full_fusion';
const ACCOUNTS_STORAGE_KEY = 'cognitorium_auth_accounts_v2';
const CUSTOM_PROFILES_STORAGE_KEY = 'cognitorium_custom_profiles_v2';
const ACTIVE_USER_STORAGE_KEY = 'cognitorium_active_user_v2';
const SESSION_ACTIVE_KEY = 'cognitorium_session_active_v2';

const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr_nathan_cabrol',
    email: 'nathan.cabrol@cognitorium.fr',
    personName: 'Näthan Cabrol',
    headline: 'Conducteur de travaux BTP & VRD • Ergonome • Ingénierie Pédagogique',
    targetTitle: 'Conducteur de travaux BTP & VRD',
    targetRomeCode: 'F1201',
    journeyType: 'professional',
    createdAt: '2024-01-15T08:00:00.000Z',
    lastLoginAt: new Date().toISOString(),
    hasCompletedOnboarding: true,
    profileId: INITIAL_COGNITORIUM_PROFILE.id
  }
];

export default function App() {
  // Machine à états d'authentification et parcours utilisateur
  const [authStep, setAuthStep] = useState<AuthFlowStep>(() => {
    try {
      const isSessionActive = sessionStorage.getItem(SESSION_ACTIVE_KEY);
      if (isSessionActive === 'true') {
        return 'APP';
      }
    } catch (e) {
      console.warn("Session check failed:", e);
    }
    return 'SPLASH';
  });

  // Comptes utilisateurs enregistrés
  const [savedAccounts, setSavedAccounts] = useState<UserAccount[]>(() => {
    try {
      const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Erreur chargement comptes:", e);
    }
    return DEFAULT_ACCOUNTS;
  });

  // Profils personnalisés créés par les utilisateurs
  const [savedCustomProfiles, setSavedCustomProfiles] = useState<CognitiveProfile[]>(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_PROFILES_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Erreur chargement profils personnalisés:", e);
    }
    return [];
  });

  // Utilisateur actuellement authentifié
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const raw = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Erreur chargement utilisateur actif:", e);
    }
    return DEFAULT_ACCOUNTS[0];
  });

  const [profile, setProfile] = useState<CognitiveProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Erreur chargement profil sauvegardé:", e);
    }
    return INITIAL_COGNITORIUM_PROFILE;
  });

  const [activeTab, setActiveTab] = useState<AppActiveTab>('dashboard');
  const [complexityMode, setComplexityMode] = useState<ComplexityMode>('essential');
  const [simulationYear, setSimulationYear] = useState<number>(2026);
  const [selectedNode, setSelectedNode] = useState<AnyCognitiveNode | null>(null);

  // Modals state
  const [isDistillerOpen, setIsDistillerOpen] = useState<boolean>(false);
  const [isValidationCenterOpen, setIsValidationCenterOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [quickAddType, setQuickAddType] = useState<QuickCreateType>('experience');
  const [posterFocus, setPosterFocus] = useState<string | null>(null);
  const [refFocus, setRefFocus] = useState<string | null>(null);
  const [isSidebarPinned, setIsSidebarPinned] = useState<boolean>(false);
  const [isProfileManagementOpen, setIsProfileManagementOpen] = useState<boolean>(false);

  // Persist profile changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn("Impossible de persister le profil:", e);
    }
  }, [profile]);

  // Persist accounts
  useEffect(() => {
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(savedAccounts));
    } catch (e) {
      console.warn("Impossible de persister les comptes:", e);
    }
  }, [savedAccounts]);

  // Persist custom profiles
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_PROFILES_STORAGE_KEY, JSON.stringify(savedCustomProfiles));
    } catch (e) {
      console.warn("Impossible de persister les profils personnalisés:", e);
    }
  }, [savedCustomProfiles]);

  // Persist active user
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
      }
    } catch (e) {
      console.warn("Impossible de persister l'utilisateur actif:", e);
    }
  }, [currentUser]);

  // Compute pending validation count
  const pendingNodes = useMemo(() => {
    return profile.nodes.filter(
      (n) => n.verificationStatus === 'pending' || n.verificationStatus === 'inferred'
    );
  }, [profile.nodes]);

  const handleSelectNode = (node: AnyCognitiveNode | null) => {
    setSelectedNode(node);
  };

  const handleSelectNodeById = (nodeId: string) => {
    const found = profile.nodes.find((n) => n.id === nodeId);
    if (found) {
      setSelectedNode(found);
    }
  };

  const handleValidateNode = (nodeId: string, updatedFields?: Partial<AnyCognitiveNode>) => {
    const validationDate = new Date().toISOString().split('T')[0];

    setProfile((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              ...updatedFields,
              verificationStatus: 'verified',
              verifiedBy: 'utilisateur',
              verifiedAt: validationDate,
              evidence: [
                ...(n.evidence || []),
                {
                  id: `ev-val-${Date.now()}`,
                  source: 'validation_humaine',
                  label: 'Confirmé par l\'utilisateur',
                  date: validationDate,
                  confidenceScore: 100
                }
              ]
            } as AnyCognitiveNode
          : n
      )
    }));

    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode((prev) =>
        prev
          ? {
              ...prev,
              verificationStatus: 'verified',
              confidenceScore: 100
            }
          : null
      );
    }
  };

  const handleValidateAll = () => {
    setProfile((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.verificationStatus === 'pending' || n.verificationStatus === 'inferred'
          ? {
              ...n,
              verificationStatus: 'verified',
              verifiedBy: 'utilisateur',
              verifiedAt: new Date().toISOString().split('T')[0]
            }
          : n
      )
    }));
  };

  const handleRejectNode = (nodeId: string) => {
    setProfile((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((n) => n.id !== nodeId),
      edges: prev.edges.filter((e) => e.source !== nodeId && e.target !== nodeId)
    }));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const handleReactivateSkill = (skillId: string) => {
    setProfile((prev) => {
      const updatedNodes = prev.nodes.map((node) => {
        if (node.id === skillId && node.category.startsWith('skill_')) {
          const skill = node as SkillNode;
          return {
            ...skill,
            lastPracticedYear: simulationYear,
            isReactivated: true
          };
        }
        return node;
      });

      return {
        ...prev,
        nodes: updatedNodes
      };
    });

    if (selectedNode && selectedNode.id === skillId) {
      setSelectedNode((prev: any) => ({
        ...prev,
        lastPracticedYear: simulationYear,
        isReactivated: true
      }));
    }
  };

  const handleAddHorizon = (newHorizon: HorizonJobNode) => {
    setProfile((prev) => {
      if (prev.nodes.some((n) => n.name.toLowerCase() === newHorizon.name.toLowerCase())) {
        return prev;
      }
      return {
        ...prev,
        nodes: [...prev.nodes, newHorizon]
      };
    });
  };

  const handleDistillComplete = (newNodes: AnyCognitiveNode[], newEdges: GraphEdge[]) => {
    setProfile((prev) => ({
      ...prev,
      nodes: [...prev.nodes, ...newNodes],
      edges: [...prev.edges, ...newEdges]
    }));
  };

  const handleOpenQuickAdd = (type: QuickCreateType) => {
    setQuickAddType(type);
    setIsQuickAddOpen(true);
  };

  const handleAddNode = (newNode: AnyCognitiveNode, newEdges?: GraphEdge[]) => {
    setProfile((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      edges: newEdges ? [...prev.edges, ...newEdges] : prev.edges
    }));
    setSelectedNode(newNode);
  };

  const handleSelectProfile = (newProfile: CognitiveProfile) => {
    setProfile(newProfile);
    setSelectedNode(null);
    setSimulationYear(2026);
  };

  const handleResetToDemo = () => {
    if (window.confirm("Réinitialiser le profil courant avec les données initiales certifiées ?")) {
      setProfile(INITIAL_COGNITORIUM_PROFILE);
      setSimulationYear(2026);
      setSelectedNode(null);
    }
  };

  // Gestion des transitions du parcours utilisateur
  const handleSplashComplete = () => {
    setAuthStep('PORTAL');
  };

  const handleSelectAccount = (account: UserAccount | null, selectedProfile: CognitiveProfile) => {
    setProfile(selectedProfile);
    setCurrentUser(account);
    setSelectedNode(null);
    setSimulationYear(2026);
    try {
      sessionStorage.setItem(SESSION_ACTIVE_KEY, 'true');
    } catch (e) {}

    // Si le compte existe et n'a pas encore validé l'onboarding -> tutoriel
    if (account && !account.hasCompletedOnboarding) {
      setAuthStep('ONBOARDING_TUTORIAL');
    } else {
      setAuthStep('APP');
    }
  };

  const handleStartSignUp = () => {
    setAuthStep('SIGNUP');
  };

  const handleOrganicStudioSuccess = (
    newAccount: UserAccount,
    newProfile: CognitiveProfile,
    targetTab: AppActiveTab
  ) => {
    setSavedAccounts((prev) => [newAccount, ...prev.filter((a) => a.id !== newAccount.id)]);
    setSavedCustomProfiles((prev) => [newProfile, ...prev.filter((p) => p.id !== newProfile.id)]);
    setCurrentUser(newAccount);
    setProfile(newProfile);
    setSelectedNode(null);
    setSimulationYear(2026);
    setActiveTab(targetTab || 'dashboard');
    try {
      sessionStorage.setItem(SESSION_ACTIVE_KEY, 'true');
    } catch (e) {}
    setAuthStep('APP');
  };

  const handleFinishTutorial = () => {
    if (currentUser) {
      const updatedUser: UserAccount = {
        ...currentUser,
        hasCompletedOnboarding: true,
        lastLoginAt: new Date().toISOString()
      };
      setCurrentUser(updatedUser);
      setSavedAccounts((prev) =>
        prev.map((a) => (a.id === updatedUser.id ? updatedUser : a))
      );
    }
    try {
      sessionStorage.setItem(SESSION_ACTIVE_KEY, 'true');
    } catch (e) {}
    setAuthStep('APP');
  };

  const handleSkipTutorial = () => {
    if (currentUser) {
      const updatedUser: UserAccount = {
        ...currentUser,
        hasCompletedOnboarding: true,
        lastLoginAt: new Date().toISOString()
      };
      setCurrentUser(updatedUser);
      setSavedAccounts((prev) =>
        prev.map((a) => (a.id === updatedUser.id ? updatedUser : a))
      );
    }
    try {
      sessionStorage.setItem(SESSION_ACTIVE_KEY, 'true');
    } catch (e) {}
    setAuthStep('APP');
  };

  const handleContinueAsGuest = () => {
    setCurrentUser(null);
    try {
      sessionStorage.setItem(SESSION_ACTIVE_KEY, 'true');
    } catch (e) {}
    setAuthStep('APP');
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(SESSION_ACTIVE_KEY);
    } catch (e) {}
    setAuthStep('PORTAL');
  };

  const handleReplaySplash = () => {
    setAuthStep('SPLASH');
  };

  // 1. Écran d'accueil de marque & animation du logo
  if (authStep === 'SPLASH') {
    return <CognitoriumBrandSplash onComplete={handleSplashComplete} />;
  }

  // 2. Écran d'accueil & Choix de compte (Authentification / Inscription / Invité)
  if (authStep === 'PORTAL') {
    return (
      <CognitoriumAuthPortal
        savedAccounts={savedAccounts}
        savedCustomProfiles={savedCustomProfiles}
        currentActiveProfile={profile}
        onSelectAccount={handleSelectAccount}
        onStartSignUp={handleStartSignUp}
        onContinueAsGuest={handleContinueAsGuest}
        onReplaySplash={handleReplaySplash}
      />
    );
  }

  // 3. Studio Organique : Saisie vivante, Tissage du Connectome en temps réel, Test CV & ROME Matcher, et Volant
  if (authStep === 'SIGNUP' || authStep === 'ONBOARDING_TUTORIAL') {
    return (
      <CognitoriumOrganicStudio
        onCancel={() => setAuthStep('PORTAL')}
        onComplete={handleOrganicStudioSuccess}
      />
    );
  }

  // 5. Espace principal complet de l'application
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans selection:bg-blue-500 selection:text-white">
      {/* Volant Déroulant Gauche avec animation fluide */}
      <VolantSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentProfile={profile}
        onSelectProfile={handleSelectProfile}
        onOpenDistiller={() => setIsDistillerOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenValidationCenter={() => setIsValidationCenterOpen(true)}
        pendingValidationCount={pendingNodes.length}
        complexityMode={complexityMode}
        onToggleComplexity={() =>
          setComplexityMode((m) => (m === 'essential' ? 'expert' : 'essential'))
        }
        onResetToDemo={handleResetToDemo}
        isPinned={isSidebarPinned}
        onTogglePin={() => setIsSidebarPinned((p) => !p)}
        onLogout={handleLogout}
      />

      {/* Main Content Column with dynamic padding based on sidebar state */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarPinned ? 'pl-72' : 'pl-[68px]'
        }`}
      >
        {/* Sleek Minimalist Top Header Bar with breadcrumb and fast section sub-modes */}
        <TopHeaderBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentProfile={profile}
          onOpenDistiller={() => setIsDistillerOpen(true)}
          onOpenQuickAdd={handleOpenQuickAdd}
          onOpenValidationCenter={() => setIsValidationCenterOpen(true)}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          onOpenProfileManagement={() => setIsProfileManagementOpen(true)}
          pendingValidationCount={pendingNodes.length}
          complexityMode={complexityMode}
          onToggleComplexity={() =>
            setComplexityMode((m) => (m === 'essential' ? 'expert' : 'essential'))
          }
          isSidebarPinned={isSidebarPinned}
          onToggleSidebarPin={() => setIsSidebarPinned((p) => !p)}
          onLogout={handleLogout}
          onOpenTutorial={() => setAuthStep('ONBOARDING_TUTORIAL')}
        />

        {/* Main App Content Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* VIEW 0: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            simulationYear={simulationYear}
            onNavigateTab={setActiveTab}
            onSelectNode={setSelectedNode}
            onOpenDistiller={() => setIsDistillerOpen(true)}
            onOpenValidationCenter={() => setIsValidationCenterOpen(true)}
            onReactivateSkill={handleReactivateSkill}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            complexityMode={complexityMode}
            onToggleComplexity={() =>
              setComplexityMode((m) => (m === 'essential' ? 'expert' : 'essential'))
            }
          />
        )}

        {/* VIEW 1: DYNAMIC NETWORK GRAPH */}
        {activeTab === 'network' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Cartographie Dynamique du Réseau Cognitif
                </h1>
                <p className="text-xs text-slate-500">
                  5 niveaux traçables : Expérience ➔ Tâche ➔ Compétence ➔ Cognition ➔ Matching métier
                </p>
              </div>

              <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{profile.nodes.length} nœuds interconnectés</span>
                <span className="text-slate-300">•</span>
                <span>{profile.edges.length} passerelles actives</span>
              </div>
            </div>

            <NetworkGraph
              nodes={profile.nodes}
              edges={profile.edges}
              selectedNodeId={selectedNode?.id || null}
              onSelectNode={handleSelectNode}
              simulationYear={simulationYear}
              onAddExperienceClick={() => setIsDistillerOpen(true)}
            />
          </div>
        )}

        {/* VIEW 1b: TEMPORAL NETWORK — nœuds et liens s'activent dans le temps */}
        {activeTab === 'temporal' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Graphe Temporel du Réseau Cognitif
                </h1>
                <p className="text-xs text-slate-500">
                  Le réseau se construit année après année : les ronds s'allument, les liens se créent.
                </p>
              </div>
              <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <span>Lecture chronologique · {profile.nodes.length} nœuds</span>
              </div>
            </div>

            <TemporalNetworkGraph
              nodes={profile.nodes}
              edges={profile.edges}
              selectedNodeId={selectedNode?.id || null}
              onSelectNode={handleSelectNode}
              simulationYear={simulationYear}
            />
          </div>
        )}

        {/* VIEW 2: TREE & MISSIONS DECOMPOSITION */}
        {activeTab === 'tree' && (
          <TreeView
            profile={profile}
            simulationYear={simulationYear}
            onSelectNode={setSelectedNode}
          />
        )}

        {/* VIEW 3: TABLE & MATRIX VIEW */}
        {activeTab === 'table' && (
          <TableView
            profile={profile}
            simulationYear={simulationYear}
            onSelectNode={setSelectedNode}
            onValidateNode={handleValidateNode}
            onReactivateSkill={handleReactivateSkill}
          />
        )}

        {/* VIEW 4: HORIZONS & BRIDGES EXPLORER */}
        {activeTab === 'horizons' && (
          <HorizonsBridge
            nodes={profile.nodes}
            profile={profile}
            complexityMode={complexityMode}
            onSelectNode={setSelectedNode}
            onAddHorizon={handleAddHorizon}
          />
        )}

        {/* VIEW 4b: METIERS GRAPH */}
        {activeTab === 'metiers' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Graphe des métiers</h1>
                <p className="text-xs text-slate-500">
                  Tous les métiers exercés, les intitulés associés, les voisins ROME, et les passerelles — reliés entre eux.
                </p>
              </div>
              <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span>Référentiel France Travail · clustering par grand domaine</span>
              </div>
            </div>

            <MetiersGraph
              profile={profile}
              selectedNodeId={selectedNode?.id || null}
              onSelectNode={handleSelectNode}
              onAddHorizon={handleAddHorizon}
            />
          </div>
        )}

        {/* VIEW 5: DECAY TIMELINE & REACTIVATION */}
        {activeTab === 'decay' && (
          <DecayTimeline
            nodes={profile.nodes}
            simulationYear={simulationYear}
            onYearChange={setSimulationYear}
            onReactivateSkill={handleReactivateSkill}
            onSelectNode={setSelectedNode}
          />
        )}

        {/* VIEW 6: COGNITIVE SIGNATURE & PASSPORT */}
        {activeTab === 'signature' && (
          <CognitiveSignature
            profile={profile}
            simulationYear={simulationYear}
          />
        )}

        {/* SECTION SAVOIRS VIEWS */}
        {activeTab === 'atlas' && (
          <PsychologyAtlasView
            onNavigate={setActiveTab}
            onOpenPoster={(id) => {
              setPosterFocus(id);
              setActiveTab('posters');
            }}
            onOpenRef={(id) => {
              setRefFocus(id);
              setActiveTab('psyref');
            }}
          />
        )}

        {activeTab === 'posters' && (
          <ExperimentStudio
            focusId={posterFocus}
            profile={profile}
            onSelectNode={(nodeId) => {
              const target = profile.nodes.find((n) => n.id === nodeId);
              if (target) {
                setSelectedNode(target);
                setActiveTab('network');
              }
            }}
            onOpenRef={(id) => {
              setRefFocus(id);
              setActiveTab('psyref');
            }}
          />
        )}

        {activeTab === 'metacog' && <MetacogLoopView />}

        {activeTab === 'psyref' && <PsyRefView focusId={refFocus} />}

        {activeTab === 'ressources' && (
          <ResourcesView
            onOpenPoster={(id) => {
              setPosterFocus(id);
              setActiveTab('posters');
            }}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'evaluations' && (
          <MesEvaluationsView
            profile={profile}
            onSelectNodeById={handleSelectNodeById}
            onAdd={(item: ProfileAssessment) => {
              setProfile((prev) => ({
                ...prev,
                evaluations: [...(prev.evaluations || []), item]
              }));
            }}
          />
        )}

        {/* NOUVEAUX MODULES CDC / RECOMMANDATIONS */}
        {/* VUE CV CIBLÉ & ATS */}
        {activeTab === 'cv' && (
          <TargetedCvView profile={profile} />
        )}

        {/* VUE MULTI-PROJETS & ROADMAPS PROFESSIONNELLES */}
        {activeTab === 'projets' && (
          <MultiProjectsView
            profile={profile}
            onUpdateProjects={(projects) => {
              setProfile((prev) => ({
                ...prev,
                projects
              }));
            }}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* VUE ÉVALUATION DES 10 BIAIS COGNITIFS */}
        {activeTab === 'biais' && (
          <CognitiveBiasesView
            profile={profile}
            onSaveAssessment={(assessment) => {
              setProfile((prev) => ({
                ...prev,
                biasAssessment: assessment,
                biasAssessmentHistory: [
                  ...(prev.biasAssessmentHistory || []),
                  assessment
                ]
              }));
            }}
          />
        )}
      </main>
      </div>

      {/* Profile Management Modal (Export .cognitorium, Import, Scoring Explainability) */}
      <ProfileManagementModal
        isOpen={isProfileManagementOpen}
        onClose={() => setIsProfileManagementOpen(false)}
        profile={profile}
        onImportProfile={(imported) => {
          setProfile(imported);
        }}
      />

      {/* Slide-out Node Inspector Drawer */}
      <NodeInspectorModal
        node={selectedNode}
        allNodes={profile.nodes}
        edges={profile.edges}
        simulationYear={simulationYear}
        onClose={() => setSelectedNode(null)}
        onSelectNodeById={handleSelectNodeById}
        onReactivateSkill={handleReactivateSkill}
        onValidateNode={handleValidateNode}
      />

      {/* AI Experience Distiller Modal */}
      <ExperienceDistillerModal
        isOpen={isDistillerOpen}
        onClose={() => setIsDistillerOpen(false)}
        onDistillComplete={handleDistillComplete}
      />

      {/* Validation Center Modal (Human-in-the-loop) */}
      <ValidationCenterModal
        isOpen={isValidationCenterOpen}
        onClose={() => setIsValidationCenterOpen(false)}
        nodes={profile.nodes}
        onValidateNode={handleValidateNode}
        onRejectNode={handleRejectNode}
        onValidateAll={handleValidateAll}
      />

      {/* Profile Onboarding & Switcher Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSelectProfile={handleSelectProfile}
        onCreateCustomProfile={(custom) => {
          handleSelectProfile(custom);
          setIsOnboardingOpen(false);
        }}
      />

      {/* Quick Add Node Modal */}
      <QuickAddNodeModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        initialType={quickAddType}
        existingNodes={profile.nodes}
        onAddNode={handleAddNode}
      />
    </div>
  );
}
