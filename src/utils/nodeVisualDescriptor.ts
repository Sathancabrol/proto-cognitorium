import { 
  AnyCognitiveNode, 
  SkillNode, 
  ExperienceNode, 
  TaskNode, 
  HorizonJobNode, 
  CapacityNode,
  KnowledgeNode,
  NodeCategory 
} from '../types';
import { calculateSkillVitality } from './decay';

export interface NodeVisualDescriptor {
  symbol: string;
  badgeSymbol?: string;
  categoryLabel: string;
  subTypeLabel: string;
  color: string;
  ringColor: string;
  bgColor: string;
  vitality?: number;
  criteriaSummary: string;
}

/**
 * Calcule l'icône / glyphe précis, la couleur et les critères dynamiques d'un nœud du graphe.
 * L'icône change selon :
 * - La catégorie principale (expérience, formation, tâche/mission, skill tech, skill transversal, skill relationnel, capacité cognitive, savoir, horizon)
 * - Les sous-critères (ex: rôle lead vs dev, type de tâche avec défi, sous-domaine de skill IA / front / back / devops / sécu, niveau de match horizon, niveau cognitif, statut d'érosion / réactivation).
 */
export function getNodeVisualDescriptor(
  node: AnyCognitiveNode,
  simulationYear: number = 2026
): NodeVisualDescriptor {
  // 1. EXPÉRIENCES & FORMATIONS & PROJETS DE RECHERCHE
  if (node.category === 'experience') {
    const exp = node as ExperienceNode;
    const roleLower = (exp.role || exp.name || '').toLowerCase();
    const contextLower = (exp.institutionOrContext || '').toLowerCase();

    let symbol = '🏢'; // Défaut entreprise
    let subType = 'Poste en entreprise';

    if (roleLower.includes('directeur') || roleLower.includes('lead') || roleLower.includes('fondateur') || roleLower.includes('cto') || roleLower.includes('président')) {
      symbol = '💼'; // Leadership / Direction
      subType = 'Poste Direction / Lead';
    } else if (roleLower.includes('architecte') || roleLower.includes('ingénieur') || roleLower.includes('architect')) {
      symbol = '🏗️'; // Architecture / Ingénierie
      subType = 'Ingénierie & Architecture';
    } else if (roleLower.includes('enseignant') || roleLower.includes('prof') || roleLower.includes('formateur') || contextLower.includes('école') || contextLower.includes('académie')) {
      symbol = '👨‍🏫'; // Enseignement
      subType = 'Pédagogie & Enseignement';
    } else if (roleLower.includes('chercheur') || roleLower.includes('doctorant') || roleLower.includes('recherche')) {
      symbol = '🔬'; // Recherche
      subType = 'Recherche & Innovation';
    } else if (roleLower.includes('freelance') || roleLower.includes('indépendant') || roleLower.includes('consultant')) {
      symbol = '🚀'; // Freelance
      subType = 'Mission Conseil / Freelance';
    }

    return {
      symbol,
      categoryLabel: 'Expérience',
      subTypeLabel: subType,
      color: '#3b82f6',
      ringColor: 'rgba(59, 130, 246, 0.4)',
      bgColor: '#eff6ff',
      criteriaSummary: `${exp.role || 'Poste'} · ${exp.period || exp.startYear}`
    };
  }

  if (node.category === 'formation') {
    return {
      symbol: '🎓',
      categoryLabel: 'Formation',
      subTypeLabel: 'Diplôme / Certification',
      color: '#8b5cf6',
      ringColor: 'rgba(139, 92, 246, 0.4)',
      bgColor: '#f5f3ff',
      criteriaSummary: `${node.name}`
    };
  }

  if (node.category === 'research_project') {
    return {
      symbol: '🔬',
      categoryLabel: 'Projet de Recherche',
      subTypeLabel: 'Protocole & Expérimentation',
      color: '#7c3aed',
      ringColor: 'rgba(124, 58, 237, 0.4)',
      bgColor: '#f5f3ff',
      criteriaSummary: 'Projet & Publication'
    };
  }

  // 2. TÂCHES & ACTIONS OPÉRATIONNELLES (Missions)
  if (node.category === 'task') {
    const task = node as TaskNode;
    const nameLower = (task.name || '').toLowerCase();
    const actionCount = task.actions?.length || 0;

    let symbol = '🎯'; // Action ciblée
    let subType = 'Tâche / Action';

    if (actionCount >= 4 || nameLower.includes('conception') || nameLower.includes('moteur') || nameLower.includes('architecture')) {
      symbol = '🏆'; // Défi majeur / Réalisation d'envergure
      subType = 'Mission à Fort Impact';
    } else if (nameLower.includes('analyse') || nameLower.includes('audit') || nameLower.includes('évaluation')) {
      symbol = '🔍'; // Audit / Analyse
      subType = 'Audit & Diagnostic';
    } else if (nameLower.includes('coordination') || nameLower.includes('animation') || nameLower.includes('gestion')) {
      symbol = '⚡'; // Coordination dynamique
      subType = 'Coordination Opérationnelle';
    }

    return {
      symbol,
      categoryLabel: 'Action & Mission',
      subTypeLabel: subType,
      color: '#6366f1',
      ringColor: 'rgba(99, 102, 241, 0.4)',
      bgColor: '#eef2ff',
      criteriaSummary: `${actionCount} livrables prouvés`
    };
  }

  // 3. CAPACITÉS COGNITIVES ÉMERGENTES
  if (node.category === 'capacity_cognitive') {
    const cap = node as CapacityNode;
    let symbol = '🧠';
    let subType = cap.cognitiveDimension || 'Cognition';

    if (cap.cognitiveDimension === 'Spatial & Abstraction') {
      symbol = '📐';
    } else if (cap.cognitiveDimension === 'Coordination & Systémique') {
      symbol = '🌐';
    } else if (cap.cognitiveDimension === 'Humain & Médiation') {
      symbol = '💡';
    } else if (cap.cognitiveDimension === 'Adaptabilité & Imprévus') {
      symbol = '⚡';
    } else if (cap.level === 'expert') {
      symbol = '👑';
    }

    return {
      symbol,
      categoryLabel: 'Capacité Cognitive',
      subTypeLabel: `Niveau ${cap.level || 'avancé'}`,
      color: '#ec4899',
      ringColor: 'rgba(236, 72, 153, 0.4)',
      bgColor: '#fdf2f8',
      criteriaSummary: `${cap.cognitiveDimension || 'Capacité cognitive'}`
    };
  }

  // 4. SAVOIRS THÉORIQUES & NORMES
  if (node.category === 'knowledge') {
    const kn = node as KnowledgeNode;
    return {
      symbol: '📚',
      categoryLabel: 'Savoir Théorique',
      subTypeLabel: kn.domain || 'Corpus',
      color: '#64748b',
      ringColor: 'rgba(100, 116, 139, 0.4)',
      bgColor: '#f8fafc',
      criteriaSummary: `Domaine: ${kn.domain || 'Général'}`
    };
  }

  // 5. HORIZONS DE CARRIÈRE & MATCHING ROME
  if (node.category === 'horizon_job') {
    const horizon = node as HorizonJobNode;
    const score = horizon.matchScore || 0;

    let symbol = '🧭'; // Boussole horizon
    let subType = `Match ${score}%`;

    if (score >= 85) {
      symbol = '🚀'; // Forte opportunité immédiate
      subType = `Haute compatibilité (${score}%)`;
    } else if (horizon.isDirectlyExercised) {
      symbol = '⭐'; // Déjà exercé / cœur de métier
      subType = 'Déjà exercé / Référent';
    } else if (score >= 70) {
      symbol = '🔭'; // En perspective
      subType = `Transition fluide (${score}%)`;
    }

    return {
      symbol,
      categoryLabel: 'Horizon Métier',
      subTypeLabel: subType,
      color: '#f97316',
      ringColor: 'rgba(249, 115, 22, 0.4)',
      bgColor: '#fff7ed',
      criteriaSummary: `Code ROME: ${horizon.romeCode || 'N/A'} · ${score}% compatibilité`
    };
  }

  // 6. COMPÉTENCES (TECHNIQUES, TRANSVERSES, RELATIONNELLES)
  const skill = node as SkillNode;
  const rawVitality = calculateSkillVitality(
    skill,
    simulationYear,
    skill.isReactivated
  );
  const vitality = Math.round(rawVitality);

  const nameLower = (skill.name || '').toLowerCase();
  let symbol = '⚙️';
  let categoryLabel = 'Compétence';
  let subTypeLabel = 'Général';
  let color = '#06b6d4';
  let ringColor = 'rgba(6, 182, 212, 0.4)';
  let bgColor = '#ecfeff';

  // --- A. Hard Skills Tech ---
  if (node.category === 'skill_tech') {
    categoryLabel = 'Compétence Tech';
    color = '#06b6d4';
    ringColor = 'rgba(6, 182, 212, 0.4)';
    bgColor = '#ecfeff';

    if (/ia|gemini|llm|machine learning|data|deep learning|rag|gpt|nlp|python/.test(nameLower)) {
      symbol = '🧠'; // IA & Data
      subTypeLabel = 'IA & Data Science';
    } else if (/react|vue|front|tailwind|css|html|ui|typescript|javascript|next/.test(nameLower)) {
      symbol = '🎨'; // Frontend & Interface
      subTypeLabel = 'Frontend & UI';
    } else if (/node|backend|api|fastapi|express|sql|bdd|serveur|django|postgres/.test(nameLower)) {
      symbol = '⚙️'; // Backend & Systèmes
      subTypeLabel = 'Backend & API';
    } else if (/docker|cloud|aws|gcp|k8s|devops|ci\/cd|kubernetes/.test(nameLower)) {
      symbol = '☁️'; // Cloud & DevOps
      subTypeLabel = 'Cloud & DevOps';
    } else if (/securite|cyber|auth|owasp|crypto|sécurité/.test(nameLower)) {
      symbol = '🛡️'; // CyberSécurité
      subTypeLabel = 'Sécurité & Auth';
    } else {
      symbol = '💻';
      subTypeLabel = 'Technologie Logicielle';
    }
  } 
  // --- B. Compétences Transversales & Méthodes ---
  else if (node.category === 'skill_transversal') {
    categoryLabel = 'Compétence Transverse';
    color = '#10b981';
    ringColor = 'rgba(16, 185, 129, 0.4)';
    bgColor = '#ecfdf5';

    if (/agile|scrum|kanban|sprint|jira|product/.test(nameLower)) {
      symbol = '📋'; // Méthode Agile
      subTypeLabel = 'Agile & Organisation';
    } else if (/analyse|resolution|probl|diagnostic|optimisation/.test(nameLower)) {
      symbol = '🧩'; // Résolution de problèmes
      subTypeLabel = 'Résolution & Analyse';
    } else if (/gestion|projet|planning|budget|suivi/.test(nameLower)) {
      symbol = '📊'; // Pilotage de projet
      subTypeLabel = 'Pilotage de Projet';
    } else {
      symbol = '🔄';
      subTypeLabel = 'Méthodologie';
    }
  } 
  // --- C. Compétences Relationnelles & Humaines ---
  else if (node.category === 'skill_relational') {
    categoryLabel = 'Compétence Humaine';
    color = '#f59e0b';
    ringColor = 'rgba(245, 158, 11, 0.4)';
    bgColor = '#fffbeb';

    if (/leadership|management|mentor|équipe|direction/.test(nameLower)) {
      symbol = '👑'; // Leadership
      subTypeLabel = 'Leadership & Mentorat';
    } else if (/communication|negociation|pitch|écoute|présentation/.test(nameLower)) {
      symbol = '💬'; // Communication
      subTypeLabel = 'Communication & Négociation';
    } else if (/pedagogie|formation|transmission|vulgarisation|animation/.test(nameLower)) {
      symbol = '💡'; // Pédagogie
      subTypeLabel = 'Transmission & Pédagogie';
    } else {
      symbol = '🤝';
      subTypeLabel = 'Interpersonnel';
    }
  }

  // Érosion mémorielle : si la compétence est érodée (< 40%) et non réactivée, indicateur visuel
  let badgeSymbol: string | undefined;
  if (skill.isReactivated) {
    badgeSymbol = '⚡'; // Réactivée récemment
  } else if (vitality < 40) {
    badgeSymbol = '⏳'; // Érosion active
  } else if ((skill.baseMastery || 80) >= 90) {
    badgeSymbol = '⭐'; // Expertise de pointe
  }

  return {
    symbol,
    badgeSymbol,
    categoryLabel,
    subTypeLabel,
    color,
    ringColor,
    bgColor,
    vitality,
    criteriaSummary: `${subTypeLabel} · Vitalité: ${vitality}% · Dernier exercice: ${skill.lastPracticedYear || 2024}`
  };
}
