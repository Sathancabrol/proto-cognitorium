import { SkillNode } from '../types';

/**
 * Calcule la vitalité / maîtrise actuelle d'une compétence en fonction du temps écoulé
 * selon un modèle cognitif d'Ebbinghaus adapté au capital professionnel.
 * 
 * - Si récemment pratiquée : maîtrise ~100% de la base.
 * - Si non pratiquée : décroissance progressive (demi-vie).
 * - Plancher de rétention résiduelle (mémoire cristallisée) : ~25-40% minimum.
 * - Réactivation : reprise ultra-rapide par rapport à un primo-apprentissage.
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
  const retentionFloor = skill.baseMastery * 0.35; // 35% de plancher indélébile
  const decayablePortion = skill.baseMastery - retentionFloor;
  
  const decayMultiplier = Math.exp(-Math.LN2 * (yearsInactive / halfLife));
  const currentVitality = retentionFloor + decayablePortion * decayMultiplier;

  return Math.max(10, Math.min(100, Math.round(currentVitality)));
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
      label: 'Active & Maîtrisée',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400',
      colorHex: '#10b981',
      glowClass: 'shadow-emerald-500/40 border-emerald-500',
      stateDescription: 'Pratique récente ou consolidée. Réflexes affûtés et disponibilité immédiate.'
    };
  } else if (vitality >= 55) {
    return {
      label: 'En veille active',
      badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400',
      colorHex: '#f59e0b',
      glowClass: 'shadow-amber-500/30 border-amber-500/70',
      stateDescription: 'Pratique espacée. Notions solides, nécessite 2-3 jours de réajustement pour revenir au pic.'
    };
  } else {
    return {
      label: 'Dormante / Décroissance',
      badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/30 dark:text-rose-400',
      colorHex: '#f43f5e',
      glowClass: 'shadow-rose-500/20 border-rose-400/50',
      stateDescription: 'Peu sollicitée récemment. Fondations intactes en mémoire cristallisée, réactivation rapide possible.'
    };
  }
}
