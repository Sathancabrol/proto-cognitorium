import { AnyCognitiveNode } from '../types';

// ============================================================================
// ÉCHELLE ÉPISTÉMIQUE COGNITORIUM
// Distingue ce qui est FAIT de ce qui est INTERPRÉTÉ, pour ne jamais présenter
// une hypothèse cognitive comme une conclusion psychologique.
//
//   Niveau 1 — Fait documenté           (ex : eye-tracking Tobii utilisé)
//   Niveau 2 — Compétence inférée       (ex : analyse de données eye-tracking)
//   Niveau 3 — Capacité candidate       (ex : analyse systémique)
//   Niveau 4 — Hypothèse cognitive      (ex : forte capacité de transfert intercontextuel)
//   Niveau 5 — Conclusion psychologique (ex : profil cognitif X) — JAMAIS déduit automatiquement
// ============================================================================

export interface EpistemicLevel {
  level: 1 | 2 | 3 | 4;
  label: string;
  description: string;
  colorHex: string;
  badge: string;
}

export const EPISTEMIC_SCALE: { level: number; label: string; description: string }[] = [
  { level: 1, label: 'Fait documenté', description: "Élément directement observable ou documenté (CV, diplôme, projet, donnée factuelle)." },
  { level: 2, label: 'Compétence inférée', description: "Compétence déduite de faits documentés (ex : analyse de données eye-tracking)." },
  { level: 3, label: 'Capacité candidate', description: "Capacité cognitive de haut niveau proposée comme candidate à partir de plusieurs compétences." },
  { level: 4, label: 'Hypothèse cognitive', description: "Hypothèse sur un fonctionnement cognitif ou un transfert — à confirmer par l'échange humain." },
  { level: 5, label: 'Conclusion psychologique', description: "Profil psychologique concluant. Jamais déduit automatiquement d'un CV par Cognitorium." }
];

export function getEpistemicLevel(node: AnyCognitiveNode): EpistemicLevel {
  const inference = node.inferenceType;
  const category = node.category;

  // Faits documentés : expériences, formations, projets de recherche, savoirs
  if (category === 'experience' || category === 'formation' || category === 'research_project' || category === 'knowledge') {
    if (inference === 'inference_forte' || inference === 'inference_a_valider') {
      return {
        level: 2,
        label: 'Compétence inférée',
        description: "Reconstitué à partir d'éléments partiels ou déclaratifs.",
        colorHex: '#3b82f6',
        badge: 'bg-blue-50 text-blue-700 border-blue-200'
      };
    }
    return {
      level: 1,
      label: 'Fait documenté',
      description: "Élément directement observable ou documenté (CV, diplôme, projet, donnée factuelle).",
      colorHex: '#10b981',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
  }

  // Tâches : faits contextualisés
  if (category === 'task') {
    return {
      level: 1,
      label: 'Fait documenté',
      description: "Action documentée dans le contexte d'une expérience.",
      colorHex: '#10b981',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
  }

  // Compétences : niveau 2, montent au niveau 3 si inférence à valider
  if (category.startsWith('skill_')) {
    if (inference === 'inference_a_valider') {
      return {
        level: 3,
        label: 'Capacité candidate',
        description: "Compétence proposée par l'IA — à valider par l'utilisateur avant d'être ancrée.",
        colorHex: '#f59e0b',
        badge: 'bg-amber-50 text-amber-700 border-amber-200'
      };
    }
    return {
      level: 2,
      label: 'Compétence inférée',
      description: "Compétence déduite de faits documentés (parcours, expériences, preuves).",
      colorHex: '#3b82f6',
      badge: 'bg-blue-50 text-blue-700 border-blue-200'
    };
  }

  // Capacités cognitives : niveau 3 candidat (niveau 4 si inférence à valider)
  if (category === 'capacity_cognitive') {
    if (inference === 'inference_a_valider') {
      return {
        level: 4,
        label: 'Hypothèse cognitive',
        description: "Hypothèse sur un fonctionnement cognitif — à confirmer par l'échange humain.",
        colorHex: '#8b5cf6',
        badge: 'bg-violet-50 text-violet-700 border-violet-200'
      };
    }
    return {
      level: 3,
      label: 'Capacité candidate',
      description: "Capacité cognitive de haut niveau proposée comme candidate à partir de plusieurs compétences.",
      colorHex: '#f59e0b',
      badge: 'bg-amber-50 text-amber-700 border-amber-200'
    };
  }

  // Horizons métiers : hypothèse de rapprochement (niveau 4)
  if (category === 'horizon_job') {
    return {
      level: 4,
      label: 'Hypothèse cognitive',
      description: "Rapprochement métier fondé sur un indice de proximité — jamais une garantie d'embauche ou un diagnostic.",
      colorHex: '#8b5cf6',
      badge: 'bg-violet-50 text-violet-700 border-violet-200'
    };
  }

  return {
    level: 2,
    label: 'Compétence inférée',
    description: "Niveau épistémique par défaut pour ce type d'élément.",
    colorHex: '#3b82f6',
    badge: 'bg-blue-50 text-blue-700 border-blue-200'
  };
}
