import { CognitiveProfile, HorizonJobNode } from '../types';
import { ROME_FICHES } from '../data/romeData';
import {
  computeAllRomeMatches,
  computeFicheMatch,
  getCompatibilityInfo,
  RomeMatchResult
} from './romeMatching';

const ROME_BY_CODE = new Map(ROME_FICHES.map((f) => [f.code, f]));

export type MetierCompat = 'tres_forte' | 'forte' | 'moderee' | 'explorer';
export type MetierKind = 'domain' | 'horizon' | 'suggestion';

export interface MetierGraphNode {
  id: string;
  name: string;
  kind: MetierKind;
  domainLetter: string;
  domainLabel: string;
  domaine?: string;
  romeCode?: string;
  matchScore: number;
  compat: MetierCompat;
  description: string;
  matchingSkills: string[];
  missingSkills: string[];
  inProfile: boolean;
  horizon?: HorizonJobNode;
  symbol: string;
  color: string;
  glow: string;
}

export interface MetierGraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'in_domain' | 'shared_skills';
  strength: number;
}

export const ROME_DOMAIN_META: Record<string, { short: string; color: string; glow: string }> = {
  A: { short: 'Agri', color: '#22c55e', glow: 'rgba(34, 197, 94, 0.45)' },
  B: { short: 'Arts', color: '#f472b6', glow: 'rgba(244, 114, 182, 0.45)' },
  C: { short: 'Banque', color: '#60a5fa', glow: 'rgba(96, 165, 250, 0.45)' },
  D: { short: 'Commerce', color: '#fb923c', glow: 'rgba(251, 146, 60, 0.45)' },
  E: { short: 'Média', color: '#a78bfa', glow: 'rgba(167, 139, 250, 0.45)' },
  F: { short: 'BTP', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.45)' },
  G: { short: 'Hôtellerie', color: '#14b8a6', glow: 'rgba(20, 184, 166, 0.45)' },
  H: { short: 'Industrie', color: '#94a3b8', glow: 'rgba(148, 163, 184, 0.45)' },
  I: { short: 'Maintenance', color: '#22d3ee', glow: 'rgba(34, 211, 238, 0.45)' },
  J: { short: 'Santé', color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.45)' },
  K: { short: 'Services', color: '#818cf8', glow: 'rgba(129, 140, 248, 0.45)' },
  L: { short: 'Spectacle', color: '#e879f9', glow: 'rgba(232, 121, 249, 0.45)' },
  M: { short: 'Support', color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)' },
  N: { short: 'Transport', color: '#eab308', glow: 'rgba(234, 179, 8, 0.45)' }
};

export const COMPAT_META: Record<MetierCompat, { label: string; color: string; bgActive: string }> = {
  tres_forte: { label: 'Très forte', color: '#10b981', bgActive: 'bg-emerald-600' },
  forte: { label: 'Forte', color: '#3b82f6', bgActive: 'bg-blue-600' },
  moderee: { label: 'Modérée', color: '#f59e0b', bgActive: 'bg-amber-600' },
  explorer: { label: 'À explorer', color: '#8b5cf6', bgActive: 'bg-violet-600' }
};

function letterOf(grandDomaine: string | undefined): string {
  const ch = (grandDomaine || '').trim().charAt(0).toUpperCase();
  return /[A-N]/.test(ch) ? ch : '?';
}

function domainLabel(grandDomaine: string | undefined, letter: string): string {
  if (!grandDomaine) return letter === '?' ? 'Autre' : letter;
  const cut = grandDomaine.indexOf(' - ');
  return cut >= 0 ? grandDomaine.slice(cut + 3) : grandDomaine;
}

function scoreToCompat(score: number): MetierCompat {
  if (score >= 75) return 'tres_forte';
  if (score >= 50) return 'forte';
  if (score >= 25) return 'moderee';
  return 'explorer';
}

function jobSymbol(score: number, inProfile: boolean): string {
  if (inProfile && score >= 75) return '⭐';
  if (score >= 75) return '🚀';
  if (score >= 50) return '🔭';
  return '🧭';
}

export function horizonFromMatch(match: RomeMatchResult): HorizonJobNode {
  const info = getCompatibilityInfo(match.label);
  return {
    id: `rome-${match.fiche.code}`,
    name: match.fiche.libelle,
    category: 'horizon_job',
    domain: match.fiche.grandDomaine,
    romeCode: match.fiche.code,
    romeTitle: match.fiche.libelle,
    matchScore: match.score,
    compatibilityLevel: info.short as HorizonJobNode['compatibilityLevel'],
    rationale: `Indice de proximité ${match.score}/100 calculé par le moteur ROME. ${info.description}`,
    matchingSkills: match.matchedSkills.map((m) => m.name),
    matchingSkillIds: match.matchedSkills.map((m) => m.skillId),
    missingSkills: match.missingSkills.slice(0, 5).map((name) => ({
      name,
      importance: 'recommandée' as const,
      learningBridge: match.formations[0]?.libelle
        ? `Formation FORMACODE suggérée : ${match.formations[0].libelle}`
        : 'Formation à identifier auprès de France Travail / OPCO.'
    })),
    unlockedOpportunities: [],
    verificationStatus: 'inferred',
    inferenceType: 'inference_a_valider',
    confidenceScore: Math.max(40, Math.min(95, Math.round(match.score * 0.9))),
    description: `${match.fiche.domaine} · ${match.matchedSkillCount} compétence${match.matchedSkillCount > 1 ? 's' : ''} mobilisée${match.matchedSkillCount > 1 ? 's' : ''}`
  };
}

function jobNodeFromHorizon(
  job: HorizonJobNode,
  kind: 'horizon' | 'suggestion',
  score: number,
  compat: MetierCompat,
  grandDomaine: string,
  domaine?: string
): MetierGraphNode {
  const letter = letterOf(grandDomaine);
  const meta = ROME_DOMAIN_META[letter] || { short: 'Autre', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.45)' };
  const compatColor = COMPAT_META[compat].color;
  return {
    id: job.id,
    name: job.name,
    kind,
    domainLetter: letter,
    domainLabel: domainLabel(grandDomaine, letter),
    domaine: domaine || job.domain,
    romeCode: job.romeCode,
    matchScore: score,
    compat,
    description: job.description || job.rationale || '',
    matchingSkills: job.matchingSkills || [],
    missingSkills: (job.missingSkills || []).map((m) => (typeof m === 'string' ? m : m.name)),
    inProfile: kind === 'horizon',
    horizon: job,
    symbol: jobSymbol(score, kind === 'horizon'),
    color: compatColor,
    glow: meta.glow
  };
}

/** Construit le graphe métiers : domaines + fiches du profil + top matching ROME. */
export function buildMetiersGraph(profile: CognitiveProfile, matchLimit = 40): {
  nodes: MetierGraphNode[];
  edges: MetierGraphEdge[];
} {
  const profileJobs = profile.nodes.filter((n) => n.category === 'horizon_job') as HorizonJobNode[];
  const matches = computeAllRomeMatches(profile, matchLimit);
  const usedCodes = new Set<string>();

  const jobNodes: MetierGraphNode[] = [];

  for (const job of profileJobs) {
    const fiche = job.romeCode ? ROME_BY_CODE.get(job.romeCode) : undefined;
    let score = job.matchScore || 0;
    let compat = scoreToCompat(score);
    if (fiche) {
      const m = computeFicheMatch(profile, fiche);
      if (m.evaluated) {
        score = m.score;
        compat = m.label;
      }
    }
    const grand = fiche?.grandDomaine || job.domain;
    jobNodes.push(jobNodeFromHorizon(job, 'horizon', score, compat, grand, fiche?.domaine));
    if (job.romeCode) usedCodes.add(job.romeCode);
  }

  for (const match of matches) {
    if (usedCodes.has(match.fiche.code)) continue;
    usedCodes.add(match.fiche.code);
    const horizon = horizonFromMatch(match);
    jobNodes.push(
      jobNodeFromHorizon(
        horizon,
        'suggestion',
        match.score,
        match.label,
        match.fiche.grandDomaine,
        match.fiche.domaine
      )
    );
  }

  const letters = Array.from(new Set(jobNodes.map((n) => n.domainLetter)));
  const domainNodes: MetierGraphNode[] = letters.map((letter) => {
    const sample = jobNodes.find((n) => n.domainLetter === letter);
    const meta = ROME_DOMAIN_META[letter] || { short: 'Autre', color: '#a1a1aa', glow: 'rgba(161, 161, 170, 0.4)' };
    const label = sample?.domainLabel || meta.short;
    return {
      id: `dom-${letter}`,
      name: `${letter} · ${meta.short}`,
      kind: 'domain' as const,
      domainLetter: letter,
      domainLabel: label,
      matchScore: 0,
      compat: 'explorer',
      description: label,
      matchingSkills: [],
      missingSkills: [],
      inProfile: false,
      symbol: '🗂️',
      color: meta.color,
      glow: meta.glow
    };
  });

  const edges: MetierGraphEdge[] = [];
  for (const job of jobNodes) {
    edges.push({
      id: `e-${job.id}-dom`,
      source: `dom-${job.domainLetter}`,
      target: job.id,
      type: 'in_domain',
      strength: 0.9
    });
  }

  const skillSets = jobNodes.map((n) => ({
    id: n.id,
    skills: new Set(n.matchingSkills.map((s) => s.toLowerCase()))
  }));
  let sharedCount = 0;
  for (let i = 0; i < skillSets.length; i++) {
    let neighbors = 0;
    for (let j = i + 1; j < skillSets.length; j++) {
      if (neighbors >= 3 || sharedCount >= 70) break;
      let shared = 0;
      for (const s of skillSets[i].skills) {
        if (skillSets[j].skills.has(s)) {
          shared += 1;
          if (shared >= 2) break;
        }
      }
      if (shared >= 2) {
        edges.push({
          id: `e-share-${skillSets[i].id}-${skillSets[j].id}`,
          source: skillSets[i].id,
          target: skillSets[j].id,
          type: 'shared_skills',
          strength: Math.min(1, 0.4 + shared * 0.2)
        });
        neighbors += 1;
        sharedCount += 1;
      }
    }
  }

  return { nodes: [...domainNodes, ...jobNodes], edges };
}
