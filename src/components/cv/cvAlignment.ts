import { CognitiveProfile, ExperienceNode, SkillNode } from '../../types';
import { ROME_FICHES, ROME_CODE_SKILLS, RomeFiche } from '../../data/romeData';
import { computeFicheMatch, normalizeName } from '../../utils/romeMatching';
import { CvState, CvExperienceItem, CvSkillItem, CvFormationItem, CvCapacityItem } from './cvTypes';

/**
 * Mots-clés et synonymes par familles de métiers clés pour un ciblage pointu
 */
const DOMAIN_KEYWORDS: Record<string, string[]> = {
  // BTP & Travaux Publics / Conduite de travaux (F1201, F1202, F1208, etc.)
  btp: [
    'chantier', 'travaux', 'vrd', 'conducteur', 'sobeca', 'colas', 'tp', 'génie civil', 
    'fouilles', 'tranchée', 'sécurité', 'sst', 'aipr', 'métré', 'chiffrage', 'doe', 
    'récolement', 'terrassement', 'réseaux', 'ppsps', 'cadence', 'approvisionnement'
  ],
  // Ergonomie & Facteurs Humains (M1402, M1805, etc.)
  ergonomie: [
    'ergonome', 'cognit', 'facteurs humains', 'wayfinding', 'orientation', 'eye-tracking', 
    'sncf', 'catie', 'gare', 'flux', 'usager', 'ux research', 'psychologie', 'protocole', 'stats'
  ],
  // Pédagogie & Formation (K2102, K2101, etc.)
  pedagogie: [
    'pédagogie', 'formation', 'tuteur', 'enseignant', 'apprenant', 'parcours', 
    'ingénierie pédagogique', 'transmission', 'évaluation'
  ],
  // QSE & Prévention des risques (H1502, H1523, etc.)
  qse: [
    'qualité', 'sécurité', 'environnement', 'qse', 'hse', 'prévention', 
    'risques', 'conformité', 'audit', 'sst', 'ppsps'
  ]
};

function getKeywordsForRomeCode(code: string, fiche?: RomeFiche): string[] {
  const result: string[] = [];
  if (fiche) {
    result.push(...normalizeName(fiche.libelle).split(' ').filter(w => w.length > 3));
    result.push(...normalizeName(fiche.grandDomaine).split(' ').filter(w => w.length > 3));
  }

  // Fiches BTP Conduite de travaux
  if (code.startsWith('F12') || code.startsWith('F11')) {
    result.push(...DOMAIN_KEYWORDS.btp);
  }
  // Fiches Ergonomie / Cognition
  if (code.startsWith('M14') || code.startsWith('M18')) {
    result.push(...DOMAIN_KEYWORDS.ergonomie);
  }
  // Pédagogie
  if (code.startsWith('K21')) {
    result.push(...DOMAIN_KEYWORDS.pedagogie);
  }
  // QSE
  if (code.startsWith('H15')) {
    result.push(...DOMAIN_KEYWORDS.qse);
  }

  // Ajout des mots issus des compétences officielles de la fiche ROME
  const skills = ROME_CODE_SKILLS[code] || [];
  skills.slice(0, 8).forEach(s => {
    normalizeName(s).split(' ').forEach(w => {
      if (w.length > 4 && !result.includes(w)) {
        result.push(w);
      }
    });
  });

  return Array.from(new Set(result));
}

/**
 * Calcule l'affinité d'une expérience par rapport aux mots-clés de la cible
 */
function scoreExperienceAffinity(exp: ExperienceNode, targetKeywords: string[]): { score: number; reason?: string } {
  let score = 0;
  const fullText = normalizeName(`${exp.name} ${exp.role || ''} ${exp.institutionOrContext || ''} ${exp.description || ''} ${(exp.missions || []).join(' ')}`);

  const matchedKeywords: string[] = [];
  for (const kw of targetKeywords) {
    if (fullText.includes(kw)) {
      score += 15;
      matchedKeywords.push(kw);
    }
  }

  // Bonus spécifique pour correspondance forte
  if (matchedKeywords.length > 0) {
    return {
      score,
      reason: `Aligné avec la cible (${matchedKeywords.slice(0, 3).join(', ')})`
    };
  }

  return { score: 0 };
}

/**
 * Génère une synthèse professionnelle percutante selon la fiche ROME
 */
function generateContextualSummary(targetCode: string, targetTitle: string, defaultMotto: string): string {
  if (targetCode.startsWith('F1201') || targetCode.startsWith('F1202') || targetCode.startsWith('F1208')) {
    return "Professionnel de terrain rigoureux et méthodique, combinant encadrement d'équipes de chantier VRD/BTP, maîtrise de la sécurité SST/AIPR et suivi technique des opérations (métrés, récolement, DOE). Force d'organisation éprouvée face aux aléas de chantier.";
  }
  if (targetCode.startsWith('M1402')) {
    return "Expert en sciences cognitives appliquées et facteurs humains, spécialisé dans l'analyse des comportements, l'ergonomie spatiale et l'évaluation d'interfaces et d'environnements complexes (eye-tracking, protocoles expérimentaux, modélisation des flux).";
  }
  if (targetCode.startsWith('K2102') || targetCode.startsWith('K2101')) {
    return "Coordinateur et ingénieur pédagogique expérimenté, articulant conception de parcours d'apprentissage, transmission de méthodes rigoureuses et dynamique d'accompagnement individualisé d'équipes et d'apprenants.";
  }
  if (targetCode.startsWith('H1502') || targetCode.startsWith('H1523')) {
    return "Responsable QSE & Sécurité opérationnelle, alliant culture de prévention des risques (SST, AIPR, PPSPS), animation de causeries sécurité et rigueur d'audit terrain dans des environnements exigeants.";
  }

  return defaultMotto || `Professionnel polyvalent et structuré, orienté résultats, apportant une approche méthodique et rigoureuse au service des exigences du métier de ${targetTitle}.`;
}

/**
 * Construit l'état initial du CV complet, pré-aligné sur la cible ROME
 */
export function buildAlignedCvState(
  profile: CognitiveProfile,
  targetCode: string,
  targetTitle: string
): CvState {
  const fiche = ROME_FICHES.find((f) => f.code === targetCode);
  const romeMatch = fiche ? computeFicheMatch(profile, fiche) : null;
  const targetKeywords = getKeywordsForRomeCode(targetCode, fiche);

  const matchedSkillNames = new Set((romeMatch?.matchedSkills || []).map((m) => normalizeName(m.name)));
  const matchedExpNames = new Set((romeMatch?.experiences || []).map((n) => normalizeName(n)));

  // 1. En-tête
  const headline = targetTitle || profile.headline || 'Ingénieur d’Études & Expert Opérationnel';
  const summary = generateContextualSummary(targetCode, targetTitle, profile.coreMotto);

  // 2. Expériences
  const rawExperiences = (profile.nodes || []).filter((n) => n.category === 'experience') as ExperienceNode[];
  const experiences: CvExperienceItem[] = rawExperiences.map((node) => {
    const affinity = scoreExperienceAffinity(node, targetKeywords);
    const isDirectMatch = matchedExpNames.has(normalizeName(node.name));
    const isRomePriority = isDirectMatch || affinity.score >= 30;

    // Réordonner les missions pour mettre en avant celles contenant des mots-clés de la cible
    const missions = (node.missions && node.missions.length > 0)
      ? [...node.missions].sort((a, b) => {
          const aMatch = targetKeywords.some(kw => normalizeName(a).includes(kw)) ? 1 : 0;
          const bMatch = targetKeywords.some(kw => normalizeName(b).includes(kw)) ? 1 : 0;
          return bMatch - aMatch;
        })
      : [];

    return {
      id: node.id,
      name: node.name,
      role: node.role || '',
      institutionOrContext: node.institutionOrContext || '',
      period: node.period || (node.startYear ? `${node.startYear}` : ''),
      description: node.description || '',
      missions,
      visible: true,
      isRomePriority,
      matchScore: affinity.score + (isDirectMatch ? 50 : 0),
      matchReason: affinity.reason
    };
  });

  // Tri des expériences : Prioritaires ROME en tête, puis par score/date
  experiences.sort((a, b) => {
    if (a.isRomePriority !== b.isRomePriority) {
      return a.isRomePriority ? -1 : 1;
    }
    return (b.matchScore || 0) - (a.matchScore || 0);
  });

  // 3. Compétences
  const rawSkills = (profile.nodes || []).filter((n) => n.category.startsWith('skill_')) as SkillNode[];
  const skills: CvSkillItem[] = rawSkills.map((node) => {
    const norm = normalizeName(node.name);
    const isDirectMatch = matchedSkillNames.has(norm);
    const hasKeyword = targetKeywords.some(kw => norm.includes(kw));
    const isRomeAligned = isDirectMatch || hasKeyword;

    const categoryLabel = node.category === 'skill_tech' 
      ? 'Technique & Méthodes' 
      : node.category === 'skill_relational' 
        ? 'Humain & Terrain' 
        : 'Transversal';

    return {
      id: node.id,
      name: node.name,
      categoryLabel,
      level: node.baseMastery || 80,
      visible: true,
      isRomeAligned,
      verified: node.verificationStatus === 'verified',
      evidenceCount: node.evidence?.length || 0,
      matchReason: isRomeAligned ? `Recommandé par la fiche ${targetCode}` : undefined
    };
  });

  // Tri des compétences : Cibles en premier
  skills.sort((a, b) => {
    if (a.isRomeAligned !== b.isRomeAligned) {
      return a.isRomeAligned ? -1 : 1;
    }
    // Si alignées, privilégier vérifiées
    if (a.verified !== b.verified) {
      return a.verified ? -1 : 1;
    }
    return b.level - a.level;
  });

  // 4. Capacités cognitives
  const rawCapacities = (profile.nodes || []).filter((n) => n.category === 'capacity_cognitive');
  const capacities: CvCapacityItem[] = rawCapacities.map((node) => ({
    id: node.id,
    name: node.name,
    visible: true
  }));

  // 5. Formations
  const rawFormations = (profile.nodes || []).filter((n) => n.category === 'formation') as ExperienceNode[];
  const formations: CvFormationItem[] = rawFormations.map((node) => {
    const norm = normalizeName(`${node.name} ${node.institutionOrContext || ''} ${node.description || ''}`);
    const isPriority = targetKeywords.some(kw => norm.includes(kw));

    return {
      id: node.id,
      name: node.name,
      institution: node.institutionOrContext || '',
      period: node.period || (node.startYear ? `${node.startYear}` : ''),
      description: node.description || '',
      visible: true,
      isRomePriority: isPriority,
      matchReason: isPriority ? `Formation clé pour ${targetTitle}` : undefined
    };
  });

  // Tri des formations : prioritaires en premier
  formations.sort((a, b) => {
    if (a.isRomePriority !== b.isRomePriority) {
      return a.isRomePriority ? -1 : 1;
    }
    return 0;
  });

  return {
    header: {
      personName: profile.personName || 'Näthan Cabrol',
      headline,
      targetTitle,
      targetCode,
      email: profile.email || 'nathancabrol@hotmail.fr',
      phone: '06 00 00 00 00',
      location: profile.location || 'Frontignan (34110) • Occitanie',
      linkedin: 'linkedin.com/in/nathancabrol',
      website: '',
      summary
    },
    experiences,
    skills,
    capacities,
    formations
  };
}

/**
 * Réaligne un état existant (en conservant les textes déjà modifiés par l'utilisateur)
 * mais en recalculant l'ordre de priorité ROME et les badges
 */
export function realignExistingCvState(
  currentState: CvState,
  profile: CognitiveProfile,
  newTargetCode: string,
  newTargetTitle: string
): CvState {
  const fiche = ROME_FICHES.find((f) => f.code === newTargetCode);
  const romeMatch = fiche ? computeFicheMatch(profile, fiche) : null;
  const targetKeywords = getKeywordsForRomeCode(newTargetCode, fiche);

  const matchedSkillNames = new Set((romeMatch?.matchedSkills || []).map((m) => normalizeName(m.name)));
  const matchedExpNames = new Set((romeMatch?.experiences || []).map((n) => normalizeName(n)));

  // Mise à jour des expériences
  const updatedExperiences = currentState.experiences.map((exp) => {
    const norm = normalizeName(`${exp.name} ${exp.role} ${exp.institutionOrContext} ${exp.description} ${exp.missions.join(' ')}`);
    const isDirectMatch = matchedExpNames.has(normalizeName(exp.name));
    const hasKeyword = targetKeywords.some(kw => norm.includes(kw));
    const isRomePriority = isDirectMatch || hasKeyword;

    return {
      ...exp,
      isRomePriority,
      matchReason: isRomePriority ? `Aligné avec la cible ${newTargetTitle}` : undefined
    };
  });

  // Tri automatique : prioritaires en tête
  updatedExperiences.sort((a, b) => {
    if (a.isRomePriority !== b.isRomePriority) {
      return a.isRomePriority ? -1 : 1;
    }
    return 0;
  });

  // Mise à jour des compétences
  const updatedSkills = currentState.skills.map((skill) => {
    const norm = normalizeName(skill.name);
    const isDirectMatch = matchedSkillNames.has(norm);
    const hasKeyword = targetKeywords.some(kw => norm.includes(kw));
    const isRomeAligned = isDirectMatch || hasKeyword;

    return {
      ...skill,
      isRomeAligned,
      matchReason: isRomeAligned ? `Compétence prioritaire ROME (${newTargetCode})` : undefined
    };
  });

  // Tri : alignées ROME en premier
  updatedSkills.sort((a, b) => {
    if (a.isRomeAligned !== b.isRomeAligned) {
      return a.isRomeAligned ? -1 : 1;
    }
    return 0;
  });

  // Formations
  const updatedFormations = currentState.formations.map((f) => {
    const norm = normalizeName(`${f.name} ${f.institution} ${f.description || ''}`);
    const isPriority = targetKeywords.some(kw => norm.includes(kw));
    return {
      ...f,
      isRomePriority: isPriority,
      matchReason: isPriority ? `Pertinent pour ${newTargetTitle}` : undefined
    };
  });

  updatedFormations.sort((a, b) => {
    if (a.isRomePriority !== b.isRomePriority) {
      return a.isRomePriority ? -1 : 1;
    }
    return 0;
  });

  return {
    ...currentState,
    header: {
      ...currentState.header,
      targetCode: newTargetCode,
      targetTitle: newTargetTitle,
      headline: newTargetTitle,
      summary: generateContextualSummary(newTargetCode, newTargetTitle, currentState.header.summary)
    },
    experiences: updatedExperiences,
    skills: updatedSkills,
    formations: updatedFormations
  };
}

