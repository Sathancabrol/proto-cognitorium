import { AnyCognitiveNode, GraphEdge, RpgStampType, NodeStamp, GameCartographyMode, QuestItem, QuestPriority, QuestType } from '../types';

export interface RpgStampDef {
  type: RpgStampType;
  label: string;
  emoji: string;
  color: string;
  borderGlow: string;
  desc: string;
  gameAnalogy: string;
}

export const RPG_STAMPS: RpgStampDef[] = [
  {
    type: 'flag',
    label: 'Quête Prioritaire',
    emoji: '🚩',
    color: '#ef4444',
    borderGlow: 'rgba(239, 68, 68, 0.45)',
    desc: 'Objectif immédiat à consolider ou quête critique',
    gameAnalogy: 'Balise de Quête Narrative Principale'
  },
  {
    type: 'star',
    label: 'Chef-d\'œuvre / Fierté',
    emoji: '⭐',
    color: '#f59e0b',
    borderGlow: 'rgba(245, 158, 11, 0.45)',
    desc: 'Réalisation majeure de référence & fierté',
    gameAnalogy: 'Trésor Légendaire / Succès Débloqué'
  },
  {
    type: 'lightning',
    label: 'En Entraînement',
    emoji: '⚡',
    color: '#06b6d4',
    borderGlow: 'rgba(6, 182, 212, 0.45)',
    desc: 'Montée en niveau active & apprentissage en cours',
    gameAnalogy: 'Nœud de Forge / Montée d\'XP'
  },
  {
    type: 'target',
    label: 'Cible ROME',
    emoji: '🎯',
    color: '#8b5cf6',
    borderGlow: 'rgba(139, 92, 246, 0.45)',
    desc: 'Objectif de visée de carrière / reconversion',
    gameAnalogy: 'Sanctuaire Ultime / Horizon de Destin'
  },
  {
    type: 'shield',
    label: 'Pilier Fondamental',
    emoji: '🛡️',
    color: '#10b981',
    borderGlow: 'rgba(16, 185, 129, 0.45)',
    desc: 'Socle inébranlable certifié et acquis',
    gameAnalogy: 'Forteresse Sécurisée / Compétence Passive'
  },
  {
    type: 'question',
    label: 'Point Secret / Audit',
    emoji: '❓',
    color: '#ec4899',
    borderGlow: 'rgba(236, 72, 153, 0.45)',
    desc: 'Zone à explorer, secret à auditer ou preuve manquante',
    gameAnalogy: 'Point d\'Intérêt Inconnu (POI & Secrets à Débloquer)'
  }
];

export interface CartographyEffectItem {
  id: string;
  label: string;
  state: 'active' | 'inactive' | 'contextual';
  description: string;
}

export interface CartographyModelDef {
  id: GameCartographyMode;
  name: string;
  shortLabel: string;
  icon: string;
  badge: string;
  tagline: string;
  archetypeLore: string;
  themeColor: string;
  effects: CartographyEffectItem[];
  filterBehavior: {
    labels: 'contextual' | 'minimal' | 'all';
    vitalityRings: 'skills' | 'hover_only' | 'all';
    ariadneGlow: 'balanced' | 'radiant_beacon' | 'detailed';
    fogOfWar: boolean;
    poiAlerts: 'contextual' | 'hidden' | 'prominent';
    stampsVisible: boolean;
  };
}

export const CARTOGRAPHY_MODELS: Record<GameCartographyMode, CartographyModelDef> = {
  hybrid: {
    id: 'hybrid',
    name: 'Modèle Hybride Évolutif',
    shortLabel: '🌿 Hybride',
    icon: '🌿',
    badge: 'Recommandé (Golden Standard)',
    tagline: 'Équilibre parfait : découverte progressive, clarté contextuelle et repères libres.',
    archetypeLore: 'Inspiré des jeux d\'aventure et d\'exploration ouverte : affichage contextuel selon le zoom, brouillard doux et personnalisation par tampons.',
    themeColor: '#10b981',
    effects: [
      { id: 'labels', label: 'Libellés des Nœuds', state: 'contextual', description: 'Affichage adaptatif au zoom et sur les nœuds structurants' },
      { id: 'ariadne', label: 'Fil d\'Ariane Lumineux', state: 'active', description: 'Faisceau doré reliant vos compétences au métier cible ROME' },
      { id: 'stamps', label: 'Boîte à Tampons & Repères', state: 'active', description: 'Pins personnalisables flottants au-dessus des nœuds clés' },
      { id: 'vitality', label: 'Jauges de Vitalité (Mémoire)', state: 'active', description: 'Anneaux de décroissance Ebbinghaus visibles sur les compétences' },
      { id: 'fog', label: 'Voile d\'Exploration', state: 'contextual', description: 'Brouillard d\'ambiance doux centré sur vos acquisitions actuelles' },
      { id: 'poi', label: 'Points d\'Intérêt & POI', state: 'contextual', description: 'Indicateurs d\'audit et de défi visibles au survol/focus' }
    ],
    filterBehavior: {
      labels: 'contextual',
      vitalityRings: 'skills',
      ariadneGlow: 'balanced',
      fogOfWar: true,
      poiAlerts: 'contextual',
      stampsVisible: true
    }
  },
  minimalist: {
    id: 'minimalist',
    name: 'Modèle Minimaliste Diégétique',
    shortLabel: '✨ Diégétique',
    icon: '✨',
    badge: 'Immersion & Clarté Pure',
    tagline: 'Topologie épurée, aucun bruit parasite : seul le Fil d\'Ariane doré vous guide.',
    archetypeLore: 'Inspiré du purisme diégétique : interface invisible, mise en avant exclusive du chemin critique et des sanctuaires fondateurs.',
    themeColor: '#f59e0b',
    effects: [
      { id: 'labels', label: 'Libellés des Nœuds', state: 'inactive', description: 'Masqués par défaut (visibles uniquement pour le nœud sélectionné et la cible)' },
      { id: 'ariadne', label: 'Fil d\'Ariane Lumineux', state: 'active', description: 'Faisceau radiant doré amplifié pour une trajectoire limpide' },
      { id: 'stamps', label: 'Boîte à Tampons & Repères', state: 'inactive', description: 'Atténués pour préserver la pureté visuelle' },
      { id: 'vitality', label: 'Jauges de Vitalité (Mémoire)', state: 'inactive', description: 'Masquées par défaut (visibles uniquement au survol)' },
      { id: 'fog', label: 'Voile d\'Exploration', state: 'active', description: 'Atténuation marquée des nœuds hors trajectoire' },
      { id: 'poi', label: 'Points d\'Intérêt & POI', state: 'inactive', description: 'Désactivés pour éliminer toute distraction' }
    ],
    filterBehavior: {
      labels: 'minimal',
      vitalityRings: 'hover_only',
      ariadneGlow: 'radiant_beacon',
      fogOfWar: true,
      poiAlerts: 'hidden',
      stampsVisible: false
    }
  },
  maximalist: {
    id: 'maximalist',
    name: 'Modèle Exhaustif Guidé',
    shortLabel: '🗺️ Exhaustif',
    icon: '🗺️',
    badge: 'Atlas & Radar Total',
    tagline: 'Visibilité intégrale : tous les libellés, jauges de vitalité, scores et points d\'intérêt affichés.',
    archetypeLore: 'Inspiré des atlas et tableaux de bord de jeux de rôle : aucun élément n\'est masqué, repérage universel immédiat.',
    themeColor: '#8b5cf6',
    effects: [
      { id: 'labels', label: 'Libellés des Nœuds', state: 'active', description: 'Tous les libellés sont affichés en permanence sans exception' },
      { id: 'ariadne', label: 'Fil d\'Ariane Lumineux', state: 'active', description: 'Faisceau d\'or enrichi avec les pourcentages de matching' },
      { id: 'stamps', label: 'Boîte à Tampons & Repères', state: 'active', description: 'Tous les tampons et statuts sont mis en évidence' },
      { id: 'vitality', label: 'Jauges de Vitalité (Mémoire)', state: 'active', description: 'Anneaux de vitalité 360° sur l\'ensemble des compétences et savoirs' },
      { id: 'fog', label: 'Voile d\'Exploration', state: 'inactive', description: 'Désactivé pour une clarté topographique intégrale' },
      { id: 'poi', label: 'Points d\'Intérêt & POI', state: 'active', description: 'Indicateurs d\'audit permanents (? ⚠️ ⭐)' }
    ],
    filterBehavior: {
      labels: 'all',
      vitalityRings: 'all',
      ariadneGlow: 'detailed',
      fogOfWar: false,
      poiAlerts: 'prominent',
      stampsVisible: true
    }
  }
};

export const DEFAULT_INITIAL_STAMPS: Record<string, RpgStampType> = {
  'node-master-info': 'shield',
  'node-lead-dev': 'star',
  'node-skill-react': 'lightning',
  'node-horizon-lead-arch': 'target',
  'node-skill-ebbinghaus': 'question'
};

/**
 * Calcule l'angle de relèvement de la boussole (en radians) vers un nœud cible
 */
export function calculateCompassAngle(
  sourcePos: { x: number; y: number },
  targetPos: { x: number; y: number } | null
): number {
  if (!targetPos) return 0;
  const dx = targetPos.x - sourcePos.x;
  const dy = targetPos.y - sourcePos.y;
  return Math.atan2(dy, dx) + Math.PI / 2;
}

/**
 * Identifie les arêtes faisant partie du "Fil d'Ariane" (cheminement mythologique d'or vers le métier cible ROME)
 */
export function getAriadneThreadEdges(
  edges: GraphEdge[],
  nodes: AnyCognitiveNode[],
  targetNodeId: string | null
): Set<string> {
  const threadEdgeIds = new Set<string>();
  if (!targetNodeId) {
    // Si aucune cible n'est explicitement choisie, trouver le métier ROME avec le meilleur score
    const bestJob = nodes
      .filter((n) => n.category === 'horizon_job')
      .sort((a, b) => ((b as any).matchScore || 0) - ((a as any).matchScore || 0))[0];
    if (bestJob) {
      targetNodeId = bestJob.id;
    } else {
      return threadEdgeIds;
    }
  }

  // Remonter les arêtes qui mènent directement ou indirectement à ce nœud cible (1 à 2 sauts)
  const directAncestors = new Set<string>();
  edges.forEach((e) => {
    if (e.target === targetNodeId) {
      threadEdgeIds.add(e.id);
      directAncestors.add(e.source);
    }
  });

  edges.forEach((e) => {
    if (directAncestors.has(e.target)) {
      threadEdgeIds.add(e.id);
    }
  });

  return threadEdgeIds;
}

/**
 * Génère la liste des quêtes (Principales et Secondaires) à partir des nœuds du profil cognitif
 */
export function generateInitialQuests(nodes: AnyCognitiveNode[]): QuestItem[] {
  return nodes.map((node) => {
    const isMain = ['experience', 'formation', 'horizon_job'].includes(node.category);
    
    // Déterminer la priorité par défaut
    let priority: QuestPriority = 'medium';
    if (node.category === 'horizon_job') {
      priority = 'critical';
    } else if (node.category === 'experience') {
      priority = 'high';
    } else if (node.category === 'formation') {
      priority = 'high';
    } else if (['skill_tech', 'skill_transversal'].includes(node.category)) {
      priority = 'medium';
    } else {
      priority = 'low';
    }

    // Déterminer le statut validé ou en cours
    let completed = true;
    if (node.category === 'horizon_job') {
      completed = false; // Métier cible à atteindre
    } else if (node.category === 'experience' && (node as any).isCurrent) {
      completed = false; // Poste en cours
    } else if ((node as any).vitality !== undefined && (node as any).vitality < 60) {
      completed = false; // Compétence ayant besoin de consolidation
    }

    let loreDescription = '';
    if (isMain) {
      if (node.category === 'horizon_job') {
        loreDescription = 'Sanctuaire d\'accomplissement & visée d\'horizon ROME.';
      } else if (node.category === 'experience') {
        loreDescription = 'Campagne professionnelle structurante & déploiement de compétences.';
      } else {
        loreDescription = 'Parcours d\'apprentissage académique & socle fondateur.';
      }
    } else {
      loreDescription = 'Quête d\'affûtage technique, savoir théorique ou compétence comportementale.';
    }

    return {
      id: `quest-${node.id}`,
      nodeId: node.id,
      title: node.name,
      type: isMain ? 'main' : 'secondary',
      priority,
      completed,
      category: node.category,
      loreDescription,
      xpReward: isMain ? 250 : 100
    };
  });
}
