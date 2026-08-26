export type NodeCategory = 
  | 'experience' 
  | 'formation' 
  | 'research_project'
  | 'task'
  | 'skill_tech' 
  | 'skill_transversal' 
  | 'skill_relational' 
  | 'capacity_cognitive' 
  | 'knowledge' 
  | 'horizon_job';

export type VerificationStatus = 'verified' | 'pending' | 'inferred' | 'rejected';

export type InferenceType = 'explicite' | 'inference_forte' | 'inference_a_valider';

export interface EvidenceItem {
  id: string;
  source: 'cv' | 'declaration' | 'project' | 'diploma' | 'ai_inference' | 'peer_review' | 'validation_humaine' | 'exp' | 'attest';
  label: string;
  detail?: string;
  confidenceScore: number; // 0 - 100
  inferenceType?: InferenceType;
  inferenceMethod?: string;
  sourceDocument?: string;
  sourcePage?: number;
  date?: string;
  volumeMetric?: string;
}

export interface NodeMetrics {
  participantsCount?: number;
  classesCount?: number;
  teamsCount?: number;
  durationMonths?: number;
  experimentsCount?: number;
  studentsCount?: number;
  summaryVolume?: string;
}

export interface BaseNode {
  id: string;
  name: string;
  category: NodeCategory;
  description?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  // Core Knowledge Model: Provenance & Confiance
  verificationStatus?: VerificationStatus;
  confidenceScore?: number; // 0 - 100
  inferenceType?: InferenceType;
  evidence?: EvidenceItem[];
  verifiedAt?: string;
  verifiedBy?: string;
  metrics?: NodeMetrics;
}

export interface MissionDetail {
  id: string;
  title: string;
  actions: string[];
  associatedSkillIds?: string[];
  cognitiveLoad?: 'faible' | 'modérée' | 'élevée';
}

export interface ExperienceNode extends BaseNode {
  category: 'experience' | 'formation' | 'research_project';
  period: string;
  startYear: number;
  endYear?: number;
  institutionOrContext: string;
  role: string;
  missions: string[];
  detailedMissions?: MissionDetail[];
  cognitiveEfforts: string[];
}

export interface TaskNode extends BaseNode {
  category: 'task';
  experienceId: string;
  context: string;
  actions: string[];
  skillsProduced: string[];
}

export interface SkillNode extends BaseNode {
  category: 'skill_tech' | 'skill_transversal' | 'skill_relational';
  baseMastery: number; // 0 - 100 at peak
  acquiredYear: number;
  lastPracticedYear: number;
  halfLifeYears: number; // typical cognitive decay rate if unpracticed
  decayFactor: number; // 0 to 1 (calculated dynamically)
  isReactivated?: boolean;
  subSkills: string[];
  transferabilityScore: number; // 1 - 10 (how easily it transfers to other domains)
  originExperienceIds?: string[];
  connectedCapacityIds?: string[];
}

export interface CapacityNode extends BaseNode {
  category: 'capacity_cognitive';
  level: 'fondamental' | 'avancé' | 'expert';
  underlyingSkills: string[];
  cognitiveDimension: 'Raisonnement & Analyse' | 'Coordination & Systémique' | 'Adaptabilité & Imprévus' | 'Spatial & Abstraction' | 'Humain & Médiation';
  emergentInsight?: string;
}

export interface KnowledgeNode extends BaseNode {
  category: 'knowledge';
  domain: string;
  acquiredYear: number;
  decayRate: 'lent' | 'moyen' | 'rapide';
}

export interface TrainingPathway {
  title: string;
  providerOrType: string;
  duration: string;
  format: 'Certifiante' | 'Autodidacte' | 'Universitaire' | 'Micro-learning';
  url?: string;
  targetedSkill: string;
}

export interface HorizonJobNode extends BaseNode {
  category: 'horizon_job';
  domain: string;
  romeCode?: string; // e.g. 'F1208', 'K2102', 'M1508'
  romeTitle?: string;
  matchScore: number; // 0 - 100%
  matchingSkillIds?: string[];
  salaryRange?: string;
  growthRate?: string;
  requiredSkills?: string[];
  criticalGaps?: string[];
  trainingPathways?: any[];
  compatibilityLevel?: 'Élevée' | 'Très Élevée' | 'Très forte' | 'Forte' | 'Modérée' | 'En développement' | 'À explorer';
  isDirectlyExercised?: boolean;
  rationale: string;
  matchingSkills: string[];
  missingSkills: {
    name: string;
    importance: 'critique' | 'recommandée' | 'bonus';
    learningBridge: string;
    recommendedTraining?: TrainingPathway;
  }[];
  unlockedOpportunities: string[];
  explainabilityFactors?: {
    strengthPoints: string[];
    riskPoints: string[];
    suggestedNextAction: string;
    evidenceConvergence?: string[];
    missingVerifications?: string[];
  };
}

export type AssessmentKind =
  | 'diplome'
  | 'certification'
  | 'verification'
  | 'evaluation'
  | 'test_psy'
  | 'physio'
  | 'bci';

export interface ProfileAssessment {
  id: string;
  kind: AssessmentKind;
  title: string;
  issuer: string;
  year: number | string;
  summary: string;
  status?: VerificationStatus;
  relatedNodeIds?: string[];
  documentLabel?: string;
  clinical?: boolean;
  tags?: string[];
}

export type AnyCognitiveNode = 
  | ExperienceNode 
  | TaskNode
  | SkillNode 
  | CapacityNode 
  | KnowledgeNode 
  | HorizonJobNode;

export type EdgeRelationType = 
  | 'acquired_in'       // Compétence acquise dans une expérience
  | 'composed_of'       // Expérience composée de tâches
  | 'demonstrates_skill' // Tâche apportant une preuve de compétence
  | 'decomposes_into'  // Compétence composée de sous-compétences
  | 'feeds_capacity'   // Compétence alimentant une capacité cognitive
  | 'requires_knowledge' // Compétence nécessitant un savoir
  | 'unlocks_horizon'  // Compétence ou capacité ouvrant vers un métier potentiel
  | 'synergy_with';    // Synergie transversale entre 2 nœuds

export interface GraphEdge {
  id: string;
  source: string; // node id
  target: string; // node id
  type: EdgeRelationType;
  strength: number; // 0.1 to 1.0
  label?: string;
}

export interface RiasecScores {
  social: number; // 0-100
  investigatif: number;
  conventionnel: number;
  entreprenant: number;
  artistique: number;
  realiste: number;
  code: string; // e.g. 'SIC'
  dominantSummary: string;
}

export interface MatchMetiersProfile {
  workLifeBalance: number; // 100
  socialImpact: number; // 73
  remuneration: number; // 50
  collaborationScore: number; // 100
  adaptabilityScore: number; // 70
  agileOrgScore: number; // 76
  managerRoleScore: number; // 66
  topActivities: { name: string; score: number; stars: number }[];
  recommendedRomeCodes: { code: string; title: string; matchScore: number; description: string }[];
}

export type UserJourneyType = 'student' | 'professional' | 'transition';

export interface CognitiveProfile {
  id: string;
  personName: string;
  headline: string;
  coreMotto: string;
  location?: string;
  email?: string;
  journeyType?: UserJourneyType;
  currentSimulationYear: number;
  riasec?: RiasecScores;
  matchMetiers?: MatchMetiersProfile;
  cognitiveSignature: {
    dominantReasoning: string;
    transferabilityIndex: number; // 0 - 100
    learningVelocity: 'Élevée' | 'Exceptionnelle' | 'Modérée';
    adaptabilityIndex: number; // 0 - 100
    summaryText: string;
    keyStrengths: string[];
    codexInsights?: string[];
  };
  nodes: AnyCognitiveNode[];
  edges: GraphEdge[];
  evaluations?: ProfileAssessment[];
}

export type AppActiveTab = 
  | 'dashboard'   // Mon Cognitorium (Accueil & Synthèse)
  | 'network'     // Graphe Réseau Dynamique (Canvas interactif)
  | 'temporal'    // Graphe réseau animé dans le temps
  | 'tree'        // Vue Arbre & Décomposition Hiérarchique
  | 'table'       // Vue Tableau & Matrice de Maîtrise
  | 'horizons'    // Passerelles ROME & Horizons Métiers
  | 'metiers'     // Graphe métiers (données & filtres ROME)
  | 'decay'       // Vitalité & Temporalité (Decay Engine)
  | 'signature'   // Signature Cognitive & Passeport
  | 'atlas'       // Arborescence des savoirs psychologiques
  | 'posters'     // Atlas expérimental (posters / infographies)
  | 'metacog'     // Boucle métacognitive & SRL
  | 'psyref'      // Référence — bibliothèque de sources
  | 'ressources'  // Carte de lecture OER + classiques
  | 'evaluations'; // Mes évaluations — preuves, diplômes, mesures

// ============================================================================
// STRUCTURE DU PRODUIT : MON COGNITORIUM en 6 sections orientées parcours
// ============================================================================
export type CognitoriumSection = 'profil' | 'experiences' | 'competences' | 'possibilites' | 'evolution' | 'savoirs';

export const SECTION_LABELS: Record<CognitoriumSection, string> = {
  profil: 'Mon profil',
  experiences: 'Mes expériences',
  competences: 'Mes compétences',
  possibilites: 'Mes possibilités',
  evolution: 'Mon évolution',
  savoirs: 'Savoirs'
};

/** Section principale de chaque vue */
export const SECTION_OF_TAB: Record<AppActiveTab, CognitoriumSection> = {
  dashboard: 'profil',
  signature: 'profil',
  tree: 'experiences',
  network: 'experiences',
  temporal: 'experiences',
  table: 'competences',
  horizons: 'possibilites',
  metiers: 'possibilites',
  decay: 'evolution',
  atlas: 'savoirs',
  posters: 'savoirs',
  metacog: 'savoirs',
  psyref: 'savoirs',
  ressources: 'savoirs',
  evaluations: 'savoirs'
};

/** Vues par défaut de chaque section */
export const SECTION_DEFAULT_TAB: Record<CognitoriumSection, AppActiveTab> = {
  profil: 'dashboard',
  experiences: 'tree',
  competences: 'table',
  possibilites: 'horizons',
  evolution: 'decay',
  savoirs: 'atlas'
};

export type ComplexityMode = 'essential' | 'expert';

// Cartographie & Signalétique Cartes de Jeux Vidéo (Benchmark RPG)
export type GameCartographyMode = 'hybrid' | 'minimalist' | 'maximalist';
export type RpgStampType = 'flag' | 'star' | 'lightning' | 'target' | 'shield' | 'question';

export interface NodeStamp {
  nodeId: string;
  stampType: RpgStampType;
  label?: string;
  timestamp?: number;
}

export type QuestType = 'main' | 'secondary';
export type QuestPriority = 'critical' | 'high' | 'medium' | 'low';

export interface QuestItem {
  id: string;
  nodeId: string;
  title: string;
  type: QuestType; // Quête Principale ou Quête Secondaire
  priority: QuestPriority; // Priorité (Critique, Haute, Moyenne, Basse)
  completed: boolean; // Validée / Acquise ou En cours
  category: NodeCategory;
  loreDescription?: string;
  xpReward?: number;
}
