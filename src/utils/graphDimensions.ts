import { AnyCognitiveNode, GraphEdge, NodeCategory } from '../types';

export type DimensionMode = '2d' | 'timeline';

export interface NodeSpatialData {
  id: string;
  name: string;
  category: NodeCategory;
  radius: number;
  vitality?: number;
  yearAcquired: number;
  layerIndex: number; // 0 à 4 pour les strates 3D
  // Coordonnées 2D
  x2d: number;
  y2d: number;
  vx: number;
  vy: number;
  // Coordonnées 3D (espace 3D normalisé)
  x3d: number;
  y3d: number;
  z3d: number;
  // Coordonnées 4D (sur la Timeline chronologique)
  xTimeline: number;
  yTimeline: number;
}

export interface CameraOrbit {
  pitch: number; // angle élévation (-pi/2 à pi/2)
  yaw: number;   // rotation azimutale (0 à 2*pi)
  distance: number;
  fov: number;
}

/**
 * Détermine la strate 3D d'abstraction (0 à 4)
 * 0: Formations & Savoirs (Socle fondamental)
 * 1: Expériences professionnelles & Projets de recherche (Terrain)
 * 2: Tâches & Actions opérationnelles (Missions)
 * 3: Compétences (Techniques, transverses, relationnelles)
 * 4: Cognition & Horizons Métiers (Émergence & Avenir)
 */
export function getNodeStrataLayer(node: AnyCognitiveNode): number {
  switch (node.category) {
    case 'formation':
    case 'knowledge':
      return 0;
    case 'experience':
    case 'research_project':
      return 1;
    case 'task':
    case 'mission' as any:
      return 2;
    case 'skill_tech':
    case 'skill_transversal':
    case 'skill_relational':
    case 'skill_domain' as any:
      return 3;
    case 'capacity_cognitive':
    case 'horizon_job':
      return 4;
    default:
      return 2;
  }
}

/**
 * Récupère l'année chronologique précise d'apparition/ancrage d'un nœud
 */
export function extractNodeYear(node: AnyCognitiveNode): number {
  if ('startYear' in node && typeof (node as any).startYear === 'number') {
    return (node as any).startYear;
  }
  if ('period' in node && typeof (node as any).period === 'string') {
    const match = (node as any).period.match(/\b(20\d\d|19\d\d)\b/);
    if (match) return parseInt(match[1], 10);
  }
  if ('year' in node && typeof (node as any).year === 'number') {
    return (node as any).year;
  }
  if ('lastPracticedYear' in node && typeof (node as any).lastPracticedYear === 'number') {
    return (node as any).lastPracticedYear;
  }
  
  // Par défaut basé sur la catégorie si non spécifié
  switch (node.category) {
    case 'formation':
      return 2013;
    case 'experience':
    case 'research_project':
      return 2018;
    case 'task':
      return 2020;
    case 'skill_tech':
    case 'skill_transversal':
    case 'skill_relational':
    case 'knowledge':
      return 2021;
    case 'capacity_cognitive':
      return 2023;
    case 'horizon_job':
      return 2026;
    default:
      return 2020;
  }
}

/**
 * Propage chronologiquement les années d'implantation/acquisition réelles
 * le long des relations du graphe (ex: Diplôme/Formation -> Tâches/Modules -> Compétences validées -> Capacités -> Horizons).
 */
export function computeChronologicalGraphYears(nodes: AnyCognitiveNode[], edges: GraphEdge[]): Map<string, number> {
  const yearMap = new Map<string, number>();

  // 1. Détection des années explicites sur les ancres (formations, expériences, projets, etc.)
  nodes.forEach((node) => {
    if ('startYear' in node && typeof (node as any).startYear === 'number') {
      yearMap.set(node.id, (node as any).startYear);
    } else if ('period' in node && typeof (node as any).period === 'string') {
      const match = (node as any).period.match(/\b(20\d\d|19\d\d)\b/);
      if (match) {
        yearMap.set(node.id, parseInt(match[1], 10));
      }
    } else if ('year' in node && typeof (node as any).year === 'number') {
      yearMap.set(node.id, (node as any).year);
    } else if ('lastPracticedYear' in node && typeof (node as any).lastPracticedYear === 'number') {
      yearMap.set(node.id, (node as any).lastPracticedYear);
    }
  });

  // 2. Construction de la table d'adjacence
  const adj = new Map<string, string[]>();
  edges.forEach((edge) => {
    if (!adj.has(edge.source)) adj.set(edge.source, []);
    if (!adj.has(edge.target)) adj.set(edge.target, []);
    adj.get(edge.source)!.push(edge.target);
    adj.get(edge.target)!.push(edge.source);
  });

  // 3. Propagation multi-passes pour transmettre l'année des formations/expériences aux modules & compétences
  for (let pass = 0; pass < 5; pass++) {
    nodes.forEach((node) => {
      const neighbors = adj.get(node.id) || [];
      const neighborYears = neighbors
        .map((nid) => yearMap.get(nid))
        .filter((y): y is number => typeof y === 'number');

      if (neighborYears.length > 0) {
        const minNeighborYear = Math.min(...neighborYears);
        if (!yearMap.has(node.id)) {
          yearMap.set(node.id, minNeighborYear);
        } else {
          // Pour les compétences transversales, si acquises plus tôt via une formation antérieure, garder la plus précoce
          if (node.category.startsWith('skill_') || node.category === 'knowledge') {
            yearMap.set(node.id, Math.min(yearMap.get(node.id)!, minNeighborYear));
          }
        }
      }
    });
  }

  // 4. Compléter les résiduels avec les années par défaut
  nodes.forEach((node) => {
    if (!yearMap.has(node.id)) {
      yearMap.set(node.id, extractNodeYear(node));
    }
  });

  return yearMap;
}

/**
 * Projection 3D vers 2D pour une bulle 3D avec perspective sphérique
 */
export function project3DToScreen(
  x: number,
  y: number,
  z: number,
  camera: CameraOrbit,
  screenWidth: number,
  screenHeight: number
): { x2d: number; y2d: number; scale: number; depth: number; lightAngle: number } {
  // Matrice de rotation Yaw (autour de Y) et Pitch (autour de X)
  const cosY = Math.cos(camera.yaw);
  const sinY = Math.sin(camera.yaw);
  const cosP = Math.cos(camera.pitch);
  const sinP = Math.sin(camera.pitch);

  // Rotation Yaw
  const x1 = x * cosY - z * sinY;
  const z1 = x * sinY + z * cosY;

  // Rotation Pitch
  const y2 = y * cosP - z1 * sinP;
  const z2 = y * sinP + z1 * cosP;

  // Projection Perspective
  const cameraZ = camera.distance;
  const depth = z2;
  const perspective = camera.fov / Math.max(80, cameraZ + depth);

  const x2d = screenWidth / 2 + x1 * perspective;
  const y2d = screenHeight / 2 + y2 * perspective;
  const scale = Math.max(0.35, Math.min(2.2, perspective * 1.15));

  // Angle d'éclairage pour le dégradé sphérique de la bulle 3D
  const lightAngle = Math.atan2(y2 - 200, x1 - 200);

  return {
    x2d,
    y2d,
    scale,
    depth,
    lightAngle
  };
}
