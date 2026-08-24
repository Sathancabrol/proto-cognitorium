import { SkillNode } from '../types';

/**
 * Moteur Heuristique de Vitalité & Disponibilité Estimée Cognitorium
 * 
 * Modèle heuristique inspiré des courbes d'oubli et de rétention (Ebbinghaus & mémoire procédurale/cristallisée)
 * appliqué au capital de compétences professionnelles.
 * 
 * - Si récemment pratiquée : disponibilité estimée ~100% de la base.
 * - Si non pratiquée : décroissance progressive selon la demi-vie estimée du domaine.
 * - Plancher de rétention résiduelle (mémoire cristallisée/schèmes acquis) : ~35% minimum.
 * - Réactivation : reprise estimée 4x à 6x plus rapide par rapport à un primo-apprentissage.
 */
export function calculateSkillVitality(
  skill: SkillNode,
  currentYear: number,
  isReactivated: boolean = false
): number {
  if (isReactivated) {
    // La réactivation ramène quasi instantanément la compétence à son niveau de base + consolidation
    return Math.min(100, Math.round(skill.baseMastery * 0.96));
  }

  const yearsInactive = Math.max(0, currentYear - skill.lastPracticedYear);
  if (yearsInactive === 0) {
    return skill.baseMastery;
  }

  const halfLife = Math.max(1, skill.halfLifeYears || 4);
  // Modèle exponentiel avec plancher de mémoire procédurale/cristallisée
  const retentionFloor = skill.baseMastery * 0.35; // 35% de plancher résiduel
  const decayablePortion = skill.baseMastery - retentionFloor;
  
  const decayMultiplier = Math.exp(-Math.LN2 * (yearsInactive / halfLife));
  const currentVitality = retentionFloor + decayablePortion * decayMultiplier;

  return Math.max(10, Math.min(100, Math.round(currentVitality)));
}

export function getEstimatedReactivationEffort(vitality: number, baseMastery: number): {
  daysToReactivate: number;
  effortLabel: string;
  advice: string;
} {
  if (vitality >= 80) {
    return {
      daysToReactivate: 1,
      effortLabel: 'Immédiat (< 24h)',
      advice: 'Une simple mise en contexte suffit pour mobiliser 100% du potentiel.'
    };
  } else if (vitality >= 55) {
    return {
      daysToReactivate: 3,
      effortLabel: 'Rapide (2 à 5 jours)',
      advice: 'Un projet pratique court ou 2 jours d\'immersion réactivent les automatismes réflexes.'
    };
  } else {
    return {
      daysToReactivate: 10,
      effortLabel: 'Moyen (1 à 2 semaines)',
      advice: 'Les bases fondamentales sont préservées en mémoire cristallisée. 1 à 2 semaines de mise en pratique suffisent pour retrouver le niveau d\'expertise initial.'
    };
  }
}

export function getVitalityStatus(vitality: number): {
  label: string;
  badgeColor: string;
  colorHex: string;
  glowClass: string;
  stateDescription: string;
} {
  if (vitality >= 80) {
    return {
      label: 'Disponibilité Immédiate',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      colorHex: '#10b981',
      glowClass: 'shadow-emerald-500/40 border-emerald-500',
      stateDescription: 'Pratique active ou récente. Automatismes affûtés et mobilisation sans friction.'
    };
  } else if (vitality >= 55) {
    return {
      label: 'En veille active',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      colorHex: '#f59e0b',
      glowClass: 'shadow-amber-500/30 border-amber-500/70',
      stateDescription: 'Pratique espacée. Notions solides, nécessite quelques jours de réimmersion pour revenir au sommet.'
    };
  } else {
    return {
      label: 'Dormante (Cristallisée)',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      colorHex: '#f43f5e',
      glowClass: 'shadow-rose-500/20 border-rose-400/50',
      stateDescription: 'Peu sollicitée récemment. Fondations intactes en mémoire résiduelle, réactivation beaucoup plus rapide qu\'un apprentissage neuf.'
    };
  }
}

