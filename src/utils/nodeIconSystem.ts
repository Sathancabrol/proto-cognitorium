import { 
  AnyCognitiveNode, 
  SkillNode, 
  ExperienceNode, 
  MissionNode, 
  HorizonJobNode, 
  NodeCategory, 
  SkillSubCategory 
} from '../types';
import { calculateVitality } from './decay';

export type NodeIconKey = 
  | 'building'
  | 'rocket'
  | 'graduation'
  | 'heart'
  | 'briefcase'
  | 'target'
  | 'trophy'
  | 'zap'
  | 'code'
  | 'layout'
  | 'server'
  | 'cloud'
  | 'brain'
  | 'shield'
  | 'kanban'
  | 'layers'
  | 'users'
  | 'message'
  | 'trending'
  | 'design'
  | 'globe'
  | 'compass'
  | 'telescope'
  | 'flame';

export interface NodeVisualMetadata {
  iconKey: NodeIconKey;
  symbol: string;
  categoryLabel: string;
  subCategoryLabel: string;
  fillColor: string;
  strokeColor: string;
  glowColor: string;
  textColor: string;
  vitality: number;
  isDecayed: boolean;
  isReactivated: boolean;
  isExpert: boolean;
  criteriaSummary: string;
}

export function inferSubCategory(skill: SkillNode): SkillSubCategory {
  if (skill.subCategory) return skill.subCategory;
  const name = (skill.name || '').toLowerCase();
  if (/react|vue|front|tailwind|css|html|web|angular|svelte|next/.test(name)) return 'frontend';
  if (/node|python|sql|back|api|express|fastapi|java|django|flask|rust|golang/.test(name)) return 'backend';
  if (/docker|k8s|kubernetes|ci\/cd|cloud|aws|gcp|devops|terraform/.test(name)) return 'devops';
  if (/ia|gemini|llm|data|machine learning|rag|nlp|deep learning|gpt|pandas/.test(name)) return 'data_ai';
  if (/scrum|agile|kanban|sprint|jira/.test(name)) return 'agile';
  if (/lead|management|mentor|équipe|recrutement/.test(name)) return 'management';
  if (/communication|pitch|negociation|écoute|pédagogie/.test(name)) return 'communication';
  if (/ux|ui|figma|design|ergonomie|wireframe/.test(name)) return 'design_ux';
  if (/fintech|saas|business|stratégie|vente|marketing/.test(name)) return 'business';
  if (/securite|cyber|auth|owasp|crypt/.test(name)) return 'security';
  return 'other';
}

export function getNodeVisualMetadata(node: AnyCognitiveNode, simulationYear = 2026): NodeVisualMetadata {
  // 1. EXPÉRIENCES
  if (node.category === 'experience') {
    const exp = node as ExperienceNode;
    const contract = exp.contractType || 'cdi';
    let iconKey: NodeIconKey = 'building';
    let symbol = '🏢';
    let label = 'Entreprise';

    if (contract === 'freelance' || contract === 'projet_perso') {
      iconKey = 'rocket';
      symbol = '🚀';
      label = contract === 'freelance' ? 'Freelance' : 'Projet Perso';
    } else if (contract === 'stage' || contract === 'alternance') {
      iconKey = 'graduation';
      symbol = '🎓';
      label = contract === 'stage' ? 'Stage' : 'Alternance';
    } else if (contract === 'associatif') {
      iconKey = 'heart';
      symbol = '🤝';
      label = 'Associatif';
    } else if (exp.role && /lead|fondateur|cto|directeur/i.test(exp.role)) {
      iconKey = 'briefcase';
      symbol = '💼';
      label = 'Direction';
    }

    return {
      iconKey,
      symbol,
      categoryLabel: 'Expérience',
      subCategoryLabel: label,
      fillColor: '#0284c7', // Sky 600
      strokeColor: '#38bdf8', // Sky 400
      glowColor: 'rgba(56, 189, 248, 0.45)',
      textColor: '#e0f2fe',
      vitality: 100,
      isDecayed: false,
      isReactivated: false,
      isExpert: false,
      criteriaSummary: `${contract.toUpperCase()} · ${exp.periodStart}${exp.periodEnd ? ' - ' + exp.periodEnd : ' - En cours'}`
    };
  }

  // 2. MISSIONS
  if (node.category === 'mission') {
    const mission = node as MissionNode;
    const isImpact = (mission.challengesFaced && mission.challengesFaced.length > 1) || (mission.impactAchieved && mission.impactAchieved.length > 20);
    const hasChallenges = (mission.challengesFaced && mission.challengesFaced.length > 0);

    let iconKey: NodeIconKey = 'target';
    let symbol = '🎯';
    if (isImpact) {
      iconKey = 'trophy';
      symbol = '🏆';
    } else if (hasChallenges) {
      iconKey = 'zap';
      symbol = '⚡';
    }

    return {
      iconKey,
      symbol,
      categoryLabel: 'Mission',
      subCategoryLabel: mission.year ? `${mission.year}` : 'Action',
      fillColor: '#7c3aed', // Violet 600
      strokeColor: '#a78bfa', // Violet 400
      glowColor: 'rgba(167, 139, 250, 0.45)',
      textColor: '#ede9fe',
      vitality: 100,
      isDecayed: false,
      isReactivated: false,
      isExpert: false,
      criteriaSummary: `${mission.deliverables?.length || 0} livrables prouvés · ${mission.year || 2025}`
    };
  }

  // 3. HORIZONS (ROME)
  if (node.category === 'horizon_job') {
    const horizon = node as HorizonJobNode;
    const match = horizon.matchPercentage || 0;
    let iconKey: NodeIconKey = 'compass';
    let symbol = '🧭';

    if (match >= 80) {
      iconKey = 'rocket';
      symbol = '🚀';
    } else if (horizon.marketTensionScore && horizon.marketTensionScore >= 4) {
      iconKey = 'flame';
      symbol = '🔥';
    } else {
      iconKey = 'telescope';
      symbol = '🔭';
    }

    return {
      iconKey,
      symbol,
      categoryLabel: 'Horizon ROME',
      subCategoryLabel: `ROME ${horizon.romeCode || ''}`,
      fillColor: '#ea580c', // Orange 600
      strokeColor: '#fb923c', // Orange 400
      glowColor: 'rgba(251, 146, 60, 0.5)',
      textColor: '#ffedd5',
      vitality: 100,
      isDecayed: false,
      isReactivated: false,
      isExpert: false,
      criteriaSummary: `Adéquation: ${match}% · Tension: ${horizon.marketTensionScore || 3}/5`
    };
  }

  // 4. COMPÉTENCES (SKILLS)
  const skill = node as SkillNode;
  const vitality = calculateVitality(
    skill.lastPracticedYear,
    simulationYear,
    skill.halfLifeMonths,
    skill.isReactivated
  );

  const subCat = inferSubCategory(skill);
  const isExpert = (skill.level || 0) >= 5;
  const isDecayed = vitality < 40;
  const isReactivated = Boolean(skill.isReactivated);

  let iconKey: NodeIconKey = 'code';
  let symbol = '💻';
  let categoryLabel = 'Hard Skill Tech';
  let fillColor = '#059669'; // Emerald 600
  let strokeColor = '#34d399';
  let glowColor = 'rgba(52, 211, 153, 0.4)';
  let textColor = '#d1fae5';

  if (node.category === 'skill_tech') {
    categoryLabel = 'Hard Skill Tech';
    fillColor = '#059669';
    strokeColor = '#34d399';
    glowColor = 'rgba(52, 211, 153, 0.4)';
    textColor = '#d1fae5';

    switch (subCat) {
      case 'frontend':
        iconKey = 'layout';
        symbol = '🎨';
        break;
      case 'backend':
        iconKey = 'server';
        symbol = '⚙️';
        break;
      case 'devops':
        iconKey = 'cloud';
        symbol = '☁️';
        break;
      case 'data_ai':
        iconKey = 'brain';
        symbol = '🧠';
        break;
      case 'security':
        iconKey = 'shield';
        symbol = '🛡️';
        break;
      default:
        iconKey = 'code';
        symbol = '💻';
    }
  } else if (node.category === 'skill_method') {
    categoryLabel = 'Méthodologie';
    fillColor = '#d97706'; // Amber 600
    strokeColor = '#fbbf24';
    glowColor = 'rgba(251, 191, 36, 0.4)';
    textColor = '#fef3c7';

    if (subCat === 'agile') {
      iconKey = 'kanban';
      symbol = '📋';
    } else {
      iconKey = 'layers';
      symbol = '📐';
    }
  } else if (node.category === 'skill_human') {
    categoryLabel = 'Soft Skill';
    fillColor = '#db2777'; // Pink 600
    strokeColor = '#f472b6';
    glowColor = 'rgba(244, 114, 182, 0.4)';
    textColor = '#fce7f3';

    if (subCat === 'communication') {
      iconKey = 'message';
      symbol = '💬';
    } else {
      iconKey = 'users';
      symbol = '👥';
    }
  } else if (node.category === 'skill_domain') {
    categoryLabel = 'Expertise Métier';
    fillColor = '#4f46e5'; // Indigo 600
    strokeColor = '#818cf8';
    glowColor = 'rgba(129, 140, 248, 0.4)';
    textColor = '#e0e7ff';

    if (subCat === 'business') {
      iconKey = 'trending';
      symbol = '📈';
    } else if (subCat === 'design_ux') {
      iconKey = 'design';
      symbol = '✏️';
    } else {
      iconKey = 'globe';
      symbol = '🌐';
    }
  }

  if (isDecayed && !isReactivated) {
    strokeColor = '#f87171';
    glowColor = 'rgba(239, 68, 68, 0.35)';
  } else if (isReactivated) {
    strokeColor = '#38bdf8';
    glowColor = 'rgba(56, 189, 248, 0.5)';
  }

  return {
    iconKey,
    symbol,
    categoryLabel,
    subCategoryLabel: subCat.toUpperCase(),
    fillColor,
    strokeColor,
    glowColor,
    textColor,
    vitality,
    isDecayed,
    isReactivated,
    isExpert,
    criteriaSummary: `Niv.${skill.level || 3}/5 · Vitalité: ${vitality}% · Dernier exercice: ${skill.lastPracticedYear} (Demi-vie ${skill.halfLifeMonths}m)`
  };
}

/**
 * Dessine un symbole ou icône propre et responsive au centre du nœud dans le Canvas
 */
export function drawCanvasNodeIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  symbol: string,
  _iconKey: NodeIconKey
) {
  ctx.save();
  const fontSize = Math.max(11, Math.round(radius * 0.9));
  ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol, x, y + 1);
  ctx.restore();
}
