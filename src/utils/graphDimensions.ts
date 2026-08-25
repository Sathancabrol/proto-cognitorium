import { AnyCognitiveNode, CapacityNode, HorizonJobNode, NodeCategory, TaskNode } from '../types';

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
 * Récupère l'année chronologique précise d'apparition/ancrage de l'élément
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
      return 2021;
    case 'skill_tech':
    case 'skill_transversal':
    case 'skill_relational':
    case 'knowledge':
      return 2022;
    case 'capacity_cognitive':
      return 2024;
    case 'horizon_job':
      return 2026;
    default:
      return 2020;
  }
}

/**
 * Année d'apparition dans le graphe temporel.
 * Cascade : vécu → tâches → compétences → capacités → horizons.
 * Un léger décalage intra-année évite que tous les ronds d'une même année explosent d'un coup.
 */
export function computeAppearYears(nodes: AnyCognitiveNode[]): Map<string, number> {
  const years = new Map<string, number>();
  const byId = new Map(nodes.map((n) => [n.id, n]));

  for (const node of nodes) {
    if (
      node.category === 'task' ||
      node.category === 'capacity_cognitive' ||
      node.category === 'horizon_job'
    ) {
      continue;
    }
    years.set(node.id, extractNodeYear(node));
  }

  for (const node of nodes) {
    if (node.category !== 'task') continue;
    const task = node as TaskNode;
    const parent = byId.get(task.experienceId);
    const parentYear = parent
      ? (years.get(parent.id) ?? extractNodeYear(parent))
      : extractNodeYear(node);
    years.set(node.id, parentYear + 0.16);
  }

  for (const node of nodes) {
    if (node.category !== 'capacity_cognitive') continue;
    const cap = node as CapacityNode;
    const skillYears = (cap.underlyingSkills || [])
      .map((id) => years.get(id))
      .filter((y): y is number => typeof y === 'number');
    years.set(node.id, skillYears.length > 0 ? Math.max(...skillYears) + 0.28 : extractNodeYear(node));
  }

  const knownYears = Array.from(years.values());
  const fallbackHorizon = knownYears.length > 0 ? Math.max(...knownYears) + 0.35 : extractNodeYear(nodes[0] || ({ category: 'horizon_job' } as AnyCognitiveNode));

  for (const node of nodes) {
    if (node.category !== 'horizon_job') continue;
    const job = node as HorizonJobNode;
    const related = (job.matchingSkillIds || [])
      .map((id) => years.get(id))
      .filter((y): y is number => typeof y === 'number');
    years.set(node.id, related.length > 0 ? Math.max(...related) + 0.42 : fallbackHorizon);
  }

  const buckets = new Map<number, string[]>();
  for (const [id, year] of years) {
    const key = Math.round(year);
    const list = buckets.get(key) || [];
    list.push(id);
    buckets.set(key, list);
  }
  for (const ids of buckets.values()) {
    ids.forEach((id, index) => {
      years.set(id, (years.get(id) || 0) + index * 0.032);
    });
  }

  return years;
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
