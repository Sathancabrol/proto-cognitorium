export type NodeCategory = 
  | 'experience' 
  | 'formation' 
  | 'mission'
  | 'skill_tech' 
  | 'skill_transversal' 
  | 'skill_relational' 
  | 'capacity_cognitive' 
  | 'knowledge' 
  | 'horizon_job';

export type VerificationStatus = 'verified' | 'pending' | 'inferred' | 'rejected';

export interface EvidenceItem {
  id: string;
  source: 'cv' | 'declaration' | 'project' | 'diploma' | 'ai_inference' | 'peer_review';
  label: string;
  detail?: string;
  confidenceScore: number; // 0 - 100
  inferenceMethod?: string;
  date?: string;
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
  evidence?: EvidenceItem[];
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface MissionDetail {
  id: string;
  title: string;
  actions: string[];
  associatedSkillIds?: string[];
  cognitiveLoad?: 'faible' | 'modérée' | 'élevée';
}

export interface ExperienceNode extends BaseNode {
  category: 'experience' | 'formation';
  period: string;
  startYear: number;
  endYear?: number;
  institutionOrContext: string;
  role: string;
  missions: string[];
  detailedMissions?: MissionDetail[];
  cognitiveEfforts: string[];
}

export interface MissionNode extends BaseNode {
  category: 'mission';
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
  };
}

export type AnyCognitiveNode = 
  | ExperienceNode 
  | MissionNode
  | SkillNode 
  | CapacityNode 
  | KnowledgeNode 
  | HorizonJobNode;

export type EdgeRelationType = 
  | 'acquired_in'       // Compétence acquise dans une expérience
  | 'composed_of'       // Expérience composée de missions
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
}

export type AppActiveTab = 
  | 'dashboard'   // Mon Cognitorium (Accueil & Synthèse)
  | 'network'     // Graphe Réseau Dynamique (Canvas interactif)
  | 'tree'        // Vue Arbre & Décomposition Hiérarchique
  | 'table'       // Vue Tableau & Matrice de Maîtrise
  | 'horizons'    // Passerelles ROME & Horizons Métiers
  | 'decay'       // Vitalité & Temporalité (Decay Engine)
  | 'signature';  // Signature Cognitive & Passeport

export type ComplexityMode = 'essential' | 'expert';

