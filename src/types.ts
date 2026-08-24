export type NodeCategory = 
  | 'experience' 
  | 'formation' 
  | 'skill_tech' 
  | 'skill_transversal' 
  | 'skill_relational' 
  | 'capacity_cognitive' 
  | 'knowledge' 
  | 'horizon_job';

export interface BaseNode {
  id: string;
  name: string;
  category: NodeCategory;
  description?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface ExperienceNode extends BaseNode {
  category: 'experience' | 'formation';
  period: string;
  startYear: number;
  endYear?: number;
  institutionOrContext: string;
  role: string;
  missions: string[];
  cognitiveEfforts: string[];
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

export interface HorizonJobNode extends BaseNode {
  category: 'horizon_job';
  domain: string;
  matchScore: number; // 0 - 100%
  rationale: string;
  matchingSkills: string[];
  missingSkills: {
    name: string;
    importance: 'critique' | 'recommandée' | 'bonus';
    learningBridge: string;
  }[];
  unlockedOpportunities: string[];
}

export type AnyCognitiveNode = 
  | ExperienceNode 
  | SkillNode 
  | CapacityNode 
  | KnowledgeNode 
  | HorizonJobNode;

export type EdgeRelationType = 
  | 'acquired_in'       // Compétence acquise dans une expérience
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

export interface CognitiveProfile {
  id: string;
  personName: string;
  headline: string;
  coreMotto: string;
  location?: string;
  email?: string;
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
