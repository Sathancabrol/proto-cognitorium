import { CognitiveProfile, ExperienceNode, HorizonJobNode } from '../types';
import { ROME_FICHES, RomeFiche } from '../data/romeData';
import {
  computeAllRomeMatches,
  computeFicheMatch,
  getCompatibilityInfo,
  normalizeName,
  RomeMatchResult
} from './romeMatching';

const ROME_BY_CODE = new Map(ROME_FICHES.map((f) => [f.code, f]));

const STOPWORDS = new Set([
  'de', 'des', 'du', 'd', 'la', 'le', 'les', 'un', 'une', 'et', 'ou', 'en', 'au', 'aux',
  'avec', 'pour', 'sur', 'dans', 'par', 'a', 'the', 'of', 'and', 'or', 'in', 'on', 'to',
  'operateur', 'operatrice', 'agent', 'agente', 'ouvrier', 'ouvriere', 'technicien',
  'technicienne', 'aide', 'stagiaire', 'chef', 'cheffe'
]);

function tokens(s: string): string[] {
  return normalizeName(s)
    .split(' ')
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

const FICHES_BY_DOMAINE = new Map<string, RomeFiche[]>();
const FICHES_BY_FAMILLE = new Map<string, RomeFiche[]>();
const LIBELLE_TOKEN_INDEX = new Map<string, RomeFiche[]>();

for (const fiche of ROME_FICHES) {
  const domList = FICHES_BY_DOMAINE.get(fiche.domaine) || [];
  domList.push(fiche);
  FICHES_BY_DOMAINE.set(fiche.domaine, domList);

  const fam = fiche.code.slice(0, 3);
  const famList = FICHES_BY_FAMILLE.get(fam) || [];
  famList.push(fiche);
  FICHES_BY_FAMILLE.set(fam, famList);

  for (const tok of tokens(fiche.libelle)) {
    const bucket = LIBELLE_TOKEN_INDEX.get(tok) || [];
    bucket.push(fiche);
    LIBELLE_TOKEN_INDEX.set(tok, bucket);
  }
}

const SKIP_LIVED_ROLE = /^(bachelier|bacheliere|etudiant|etudiante|diplome|diplomee|eleve|certifie|certifiee|habilite|habilitee)$/;

export type MetierCompat = 'tres_forte' | 'forte' | 'moderee' | 'explorer';
export type MetierKind = 'domain' | 'exercised' | 'equivalent' | 'voisin' | 'horizon' | 'suggestion';

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
  livedTitle?: string;
}

export interface MetierGraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'in_domain' | 'shared_skills' | 'equivalent' | 'voisin';
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

export const KIND_META: Record<Exclude<MetierKind, 'domain'>, { label: string; filterLabel: string }> = {
  exercised: { label: 'Exercé', filterLabel: 'Exercés' },
  equivalent: { label: 'Autre nom', filterLabel: 'Autre nom' },
  voisin: { label: 'Métier proche', filterLabel: 'Proches' },
  horizon: { label: 'Mon horizon', filterLabel: 'Horizons' },
  suggestion: { label: 'Passerelle', filterLabel: 'Passerelles' }
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

function jobSymbol(kind: MetierKind, score: number): string {
  if (kind === 'exercised') return '⭐';
  if (kind === 'equivalent') return '🔁';
  if (kind === 'voisin') return '🧩';
  if (kind === 'horizon') return '🧭';
  if (score >= 75) return '🚀';
  if (score >= 50) return '🔭';
  return '🧭';
}

function slug(s: string): string {
  return normalizeName(s).replace(/\s+/g, '-').slice(0, 48) || 'metier';
}

function rankFichesForTitle(title: string, limit = 8): { fiche: RomeFiche; score: number }[] {
  const toks = tokens(title);
  if (!toks.length) return [];
  const scores = new Map<string, { fiche: RomeFiche; score: number }>();

  const bump = (fiche: RomeFiche, pts: number) => {
    const cur = scores.get(fiche.code) || { fiche, score: 0 };
    cur.score += pts;
    scores.set(fiche.code, cur);
  };

  for (const tok of toks) {
    const exact = LIBELLE_TOKEN_INDEX.get(tok) || [];
    for (const f of exact) bump(f, tok.length >= 6 ? 5 : 3);

    if (tok.length >= 4 && exact.length === 0) {
      for (const [key, list] of LIBELLE_TOKEN_INDEX) {
        if (key.startsWith(tok) || (tok.startsWith(key) && key.length >= 4)) {
          for (const f of list) bump(f, 2);
        }
      }
    }
  }

  return Array.from(scores.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function nearbyFiches(seed: RomeFiche, role: string, limit: number): RomeFiche[] {
  const roleToks = new Set(tokens(`${role} ${seed.libelle}`));
  const fam = FICHES_BY_FAMILLE.get(seed.code.slice(0, 3)) || [];
  const ranked = fam
    .filter((f) => f.code !== seed.code)
    .map((f) => {
      const ft = tokens(f.libelle);
      const shared = ft.filter((t) => roleToks.has(t)).length;
      return { f, shared, sameDomaine: f.domaine === seed.domaine };
    })
    .sort((a, b) => b.shared - a.shared || Number(b.sameDomaine) - Number(a.sameDomaine));

  const out: RomeFiche[] = [];
  const used = new Set<string>();
  for (const row of ranked) {
    if (row.shared < 1) continue;
    out.push(row.f);
    used.add(row.f.code);
    if (out.length >= limit) return out;
  }

  const domaine = FICHES_BY_DOMAINE.get(seed.domaine) || [];
  for (const f of domaine) {
    if (f.code === seed.code || used.has(f.code)) continue;
    out.push(f);
    used.add(f.code);
    if (out.length >= limit) break;
  }
  return out;
}

export function horizonFromMatch(match: RomeMatchResult, extra?: Partial<HorizonJobNode>): HorizonJobNode {
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
    description: `${match.fiche.domaine} · ${match.matchedSkillCount} compétence${match.matchedSkillCount > 1 ? 's' : ''} mobilisée${match.matchedSkillCount > 1 ? 's' : ''}`,
    ...extra
  };
}

function horizonFromFiche(
  profile: CognitiveProfile,
  fiche: RomeFiche,
  opts: { id: string; name: string; rationale: string; exercised?: boolean }
): HorizonJobNode {
  const match = computeFicheMatch(profile, fiche);
  const score = match.evaluated ? match.score : opts.exercised ? 88 : 20;
  const label = match.evaluated ? match.label : opts.exercised ? 'tres_forte' : 'explorer';
  const info = getCompatibilityInfo(label);
  return {
    id: opts.id,
    name: opts.name,
    category: 'horizon_job',
    domain: fiche.grandDomaine,
    romeCode: fiche.code,
    romeTitle: fiche.libelle,
    matchScore: score,
    compatibilityLevel: info.short as HorizonJobNode['compatibilityLevel'],
    isDirectlyExercised: opts.exercised,
    rationale: opts.rationale,
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
    verificationStatus: opts.exercised ? 'verified' : 'inferred',
    inferenceType: opts.exercised ? 'explicite' : 'inference_a_valider',
    confidenceScore: opts.exercised ? 96 : Math.max(40, Math.min(90, score)),
    description: `${fiche.domaine}${fiche.libelle !== opts.name ? ` · intitulé ROME : ${fiche.libelle}` : ''}`
  };
}

function jobNodeFromHorizon(
  job: HorizonJobNode,
  kind: Exclude<MetierKind, 'domain'>,
  score: number,
  compat: MetierCompat,
  grandDomaine: string,
  domaine?: string,
  livedTitle?: string
): MetierGraphNode {
  const letter = letterOf(grandDomaine);
  const meta = ROME_DOMAIN_META[letter] || { short: 'Autre', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.45)' };
  const color = kind === 'exercised' ? '#f97316' : COMPAT_META[compat].color;
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
    inProfile: kind === 'horizon' || kind === 'exercised',
    horizon: job,
    symbol: jobSymbol(kind, score),
    color,
    glow: meta.glow,
    livedTitle
  };
}

function collectLivedRoles(profile: CognitiveProfile): { role: string; experiences: ExperienceNode[] }[] {
  const byRole = new Map<string, { role: string; experiences: ExperienceNode[] }>();
  const experiences = profile.nodes.filter(
    (n) => n.category === 'experience' || n.category === 'research_project'
  ) as ExperienceNode[];

  for (const exp of experiences) {
    const role = (exp.role || '').trim();
    if (!role) continue;
    const key = normalizeName(role);
    if (!key || SKIP_LIVED_ROLE.test(key.split(' ')[0] || '')) continue;
    const cur = byRole.get(key) || { role, experiences: [] };
    cur.experiences.push(exp);
    byRole.set(key, cur);
  }
  return Array.from(byRole.values());
}

function addJob(
  jobNodes: MetierGraphNode[],
  byId: Map<string, MetierGraphNode>,
  byRome: Map<string, MetierGraphNode>,
  node: MetierGraphNode,
  occupyRome = true
): MetierGraphNode {
  const existingId = byId.get(node.id);
  if (existingId) return existingId;
  if (occupyRome && node.romeCode) {
    const existingRome = byRome.get(node.romeCode);
    if (existingRome) return existingRome;
    byRome.set(node.romeCode, node);
  }
  byId.set(node.id, node);
  jobNodes.push(node);
  return node;
}

/** Construit le graphe métiers : vécus + équivalents + voisins + passerelles moins attractives. */
export function buildMetiersGraph(profile: CognitiveProfile, matchLimit = 90): {
  nodes: MetierGraphNode[];
  edges: MetierGraphEdge[];
} {
  const jobNodes: MetierGraphNode[] = [];
  const byId = new Map<string, MetierGraphNode>();
  const byRome = new Map<string, MetierGraphNode>();
  const edges: MetierGraphEdge[] = [];
  const edgeIds = new Set<string>();

  const pushEdge = (e: MetierGraphEdge) => {
    if (edgeIds.has(e.id) || e.source === e.target) return;
    edgeIds.add(e.id);
    edges.push(e);
  };

  const lived = collectLivedRoles(profile);

  for (const group of lived) {
    const ranked = rankFichesForTitle(group.role, 8);
    const best = ranked[0]?.fiche;
    const contexts = group.experiences
      .map((e) => `${e.institutionOrContext || e.name}${e.period ? ` (${e.period})` : ''}`)
      .slice(0, 4)
      .join(' · ');

    if (!best) {
      const synthetic: HorizonJobNode = {
        id: `lived-${slug(group.role)}`,
        name: group.role,
        category: 'horizon_job',
        domain: 'Parcours vécu',
        matchScore: 90,
        compatibilityLevel: 'Très forte',
        isDirectlyExercised: true,
        rationale: `Métier réellement exercé : ${contexts || group.role}. Pas de fiche ROME univoque — nœud conservé tel que vécu.`,
        matchingSkills: [],
        missingSkills: [],
        unlockedOpportunities: [],
        verificationStatus: 'verified',
        inferenceType: 'explicite',
        description: contexts
      };
      addJob(
        jobNodes,
        byId,
        byRome,
        jobNodeFromHorizon(synthetic, 'exercised', 90, 'tres_forte', 'Parcours vécu', undefined, group.role)
      );
      continue;
    }

    const livedHorizon = horizonFromFiche(profile, best, {
      id: `lived-${slug(group.role)}`,
      name: group.role,
      rationale: `Métier réellement exercé : ${contexts || group.role}. Rapprochement ROME ${best.code} « ${best.libelle} ».`,
      exercised: true
    });
    const officialName = best.libelle;
    const namesDiffer = normalizeName(officialName) !== normalizeName(group.role);
    const livedNode = addJob(
      jobNodes,
      byId,
      byRome,
      jobNodeFromHorizon(
        livedHorizon,
        'exercised',
        livedHorizon.matchScore,
        scoreToCompat(livedHorizon.matchScore),
        best.grandDomaine,
        best.domaine,
        group.role
      ),
      !namesDiffer
    );

    if (namesDiffer) {
      const eqHorizon = horizonFromFiche(profile, best, {
        id: `rome-${best.code}`,
        name: officialName,
        rationale: `Même métier que « ${group.role} », sous l'intitulé officiel ROME ${best.code}.`,
        exercised: true
      });
      const eqNode = addJob(
        jobNodes,
        byId,
        byRome,
        jobNodeFromHorizon(
          eqHorizon,
          'equivalent',
          eqHorizon.matchScore,
          scoreToCompat(eqHorizon.matchScore),
          best.grandDomaine,
          best.domaine,
          group.role
        )
      );
      pushEdge({
        id: `e-eq-${livedNode.id}-${eqNode.id}`,
        source: livedNode.id,
        target: eqNode.id,
        type: 'equivalent',
        strength: 1
      });
    }

    const neighbors = nearbyFiches(best, group.role, 6);
    for (const nf of neighbors) {
      const nHorizon = horizonFromFiche(profile, nf, {
        id: `rome-${nf.code}`,
        name: nf.libelle,
        rationale: `Métier proche de « ${group.role} » (même famille ROME ${nf.code.slice(0, 3)} / ${nf.domaine}).`,
        exercised: false
      });
      const nNode = addJob(
        jobNodes,
        byId,
        byRome,
        jobNodeFromHorizon(
          nHorizon,
          'voisin',
          nHorizon.matchScore,
          scoreToCompat(nHorizon.matchScore),
          nf.grandDomaine,
          nf.domaine,
          group.role
        )
      );
      pushEdge({
        id: `e-vois-${livedNode.id}-${nNode.id}`,
        source: livedNode.id,
        target: nNode.id,
        type: 'voisin',
        strength: 0.75
      });
    }
  }

  const profileJobs = profile.nodes.filter((n) => n.category === 'horizon_job') as HorizonJobNode[];
  for (const job of profileJobs) {
    if (job.romeCode && byRome.has(job.romeCode)) continue;
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
    addJob(jobNodes, byId, byRome, jobNodeFromHorizon(job, 'horizon', score, compat, grand, fiche?.domaine));
  }

  const matches = computeAllRomeMatches(profile, matchLimit);
  const strong = matches.filter((m) => m.score >= 50);
  const mid = matches.filter((m) => m.score >= 25 && m.score < 50);
  const weak = matches.filter((m) => m.score < 25);
  const stratified: RomeMatchResult[] = [...strong.slice(0, 24), ...mid.slice(0, 20), ...weak.slice(0, 14)];

  for (const match of stratified) {
    if (byRome.has(match.fiche.code)) {
      const existing = byRome.get(match.fiche.code)!;
      const lived = jobNodes.find((n) => n.kind === 'exercised' && n.romeCode === match.fiche.code) || existing;
      if (lived.id !== existing.id) {
        pushEdge({
          id: `e-skill-${lived.id}-${existing.id}`,
          source: lived.id,
          target: existing.id,
          type: 'voisin',
          strength: 0.45
        });
      }
      continue;
    }
    const horizon = horizonFromMatch(match);
    const node = addJob(
      jobNodes,
      byId,
      byRome,
      jobNodeFromHorizon(horizon, 'suggestion', match.score, match.label, match.fiche.grandDomaine, match.fiche.domaine)
    );

    const family = match.fiche.code.slice(0, 3);
    const anchor = jobNodes.find((n) => n.kind === 'exercised' && n.romeCode?.slice(0, 3) === family);
    if (anchor) {
      pushEdge({
        id: `e-pass-${anchor.id}-${node.id}`,
        source: anchor.id,
        target: node.id,
        type: 'voisin',
        strength: 0.4
      });
    }
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
      compat: 'explorer' as const,
      description: label,
      matchingSkills: [],
      missingSkills: [],
      inProfile: false,
      symbol: '🗂️',
      color: meta.color,
      glow: meta.glow
    };
  });

  for (const job of jobNodes) {
    pushEdge({
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
      if (neighbors >= 3 || sharedCount >= 90) break;
      if (skillSets[i].skills.size === 0) break;
      let shared = 0;
      for (const s of skillSets[i].skills) {
        if (skillSets[j].skills.has(s)) {
          shared += 1;
          if (shared >= 2) break;
        }
      }
      if (shared >= 2) {
        pushEdge({
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
