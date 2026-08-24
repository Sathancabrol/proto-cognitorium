import { ROME_FICHES, ROME_CODE_SKILLS, SKILL_TO_ROME, ROME_FORMACODE, RomeFiche } from '../data/romeData';
import { AnyCognitiveNode, SkillNode, GraphEdge, CognitiveProfile } from '../types';

// ============================================================================
// MOTEUR DE MATCHING ROME — Cognitorium
// Croise le profil (compétences + preuves) avec le référentiel ROME réel
// (fiches taguées + arborescence des compétences France Travail, juin 2026).
// Chaque résultat est EXPLICABLE : compétences démontrées, manques, formations.
// ============================================================================

const STOPWORDS = new Set([
  'de', 'des', 'du', 'd', 'la', 'le', 'les', 'un', 'une', 'et', 'ou', 'en', 'au', 'aux',
  'avec', 'pour', 'sur', 'dans', 'par', 'à', 'a', 'que', 'qui', 'quoi', 'son', 'sa', 'ses',
  'the', 'of', 'and', 'or', 'in', 'on', 'to', 'for', 'an', 'is', 'are'
]);

/** Normalisation : minuscules, sans accents, caractères alphanumériques. */
export function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokens(s: string): string[] {
  return normalizeName(s).split(' ').filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

// ---------------------------------------------------------------------------
// Index par jeton (construit une seule fois) : jeton -> codes ROME
// Permet le rapprochement flou sans scanner les 17 920 compétences du référentiel.
// ---------------------------------------------------------------------------
const TOKEN_INDEX = (() => {
  const idx = new Map<string, string[]>();
  for (const [refKey, codes] of Object.entries(SKILL_TO_ROME)) {
    for (const tok of refKey.split(' ')) {
      const list = idx.get(tok);
      if (list) {
        list.push(...codes);
      } else {
        idx.set(tok, codes.slice());
      }
    }
  }
  return idx;
})();

/**
 * Codes ROME associés à une compétence du profil.
 * 1) correspondance exacte sur le nom normalisé de la compétence ;
 * 2) correspondance floue : au moins 60 % des jetons significatifs du nom de la
 *    compétence apparaissent dans une compétence du référentiel qui mobilise le code.
 */
export function getRomeCodesForSkill(skillName: string): { code: string; matchType: 'exact' | 'fuzzy' }[] {
  const key = normalizeName(skillName);
  if (!key) return [];

  const exact = SKILL_TO_ROME[key];
  if (exact && exact.length > 0) {
    return exact.map((code) => ({ code, matchType: 'exact' as const }));
  }

  const skillTokens = tokens(skillName);
  if (skillTokens.length < 2) return [];

  const freq = new Map<string, number>();
  for (const tok of skillTokens) {
    const codes = TOKEN_INDEX.get(tok);
    if (!codes) continue;
    for (const code of codes) {
      freq.set(code, (freq.get(code) || 0) + 1);
    }
  }

  const threshold = Math.max(2, Math.floor(skillTokens.length * 0.6));
  const out: { code: string; matchType: 'fuzzy' }[] = [];
  for (const [code, count] of freq) {
    if (count >= threshold) {
      out.push({ code, matchType: 'fuzzy' });
    }
    if (out.length >= 40) break;
  }
  return out;
}

export interface RomeMatchSkill {
  skillId: string;
  name: string;
  baseMastery: number;
  confidence: number;
  evidenceCount: number;
  verified: boolean;
  matchType: 'exact' | 'fuzzy';
  lastPracticedYear?: number;
  acquiredYear?: number;
}

export interface RomeMatchResult {
  fiche: RomeFiche;
  score: number; // 0-100 — indice de proximité (toujours accompagné de son explication)
  label: 'tres_forte' | 'forte' | 'moderee' | 'explorer';
  matchedSkills: RomeMatchSkill[];
  missingSkills: string[];
  matchedSkillCount: number;
  requiredSkillCount: number;
  coverageRatio: number; // 0-1
  formations: { code: string; libelle: string }[];
  experiences: string[]; // noms d'expériences reliées aux compétences matchées
  unverifiedCount: number;
  evaluated: boolean; // false si la fiche n'a pas de données compétences dans l'arborescence
}

function ficheLabel(score: number): RomeMatchResult['label'] {
  // Seuils issus du paramétrage officiel (02_cognitorium_parametrage.json)
  if (score >= 75) return 'tres_forte';
  if (score >= 50) return 'forte';
  if (score >= 25) return 'moderee';
  return 'explorer';
}

// ---------------------------------------------------------------------------
// Index des compétences du profil, mis en cache par profil (WeakMap) :
// skillId -> codes ROME. Évite de recalculer les correspondances à chaque fiche.
// ---------------------------------------------------------------------------
interface ProfileSkillIndex {
  bySkill: Map<string, Set<string>>;
  bySkillTypes: Map<string, { code: string; matchType: 'exact' | 'fuzzy' }[]>;
  skills: RomeMatchSkill[];
}

const profileIndexCache = new WeakMap<CognitiveProfile, ProfileSkillIndex>();

function getProfileSkillIndex(profile: CognitiveProfile): ProfileSkillIndex {
  const cached = profileIndexCache.get(profile);
  if (cached) return cached;

  const skills = profile.nodes.filter((n) => n.category.startsWith('skill_')) as SkillNode[];
  const bySkill = new Map<string, Set<string>>();
  const bySkillTypes = new Map<string, { code: string; matchType: 'exact' | 'fuzzy' }[]>();
  const entries: RomeMatchSkill[] = [];

  for (const s of skills) {
    const codes = getRomeCodesForSkill(s.name);
    const codeSet = new Set<string>();
    for (const c of codes) codeSet.add(c.code);
    bySkill.set(s.id, codeSet);
    bySkillTypes.set(s.id, codes);
    entries.push({
      skillId: s.id,
      name: s.name,
      baseMastery: s.baseMastery,
      confidence: s.confidenceScore ?? (s.verificationStatus === 'verified' ? 95 : 60),
      evidenceCount: s.evidence?.length || 0,
      verified: s.verificationStatus === 'verified',
      matchType: 'exact',
      lastPracticedYear: s.lastPracticedYear,
      acquiredYear: s.acquiredYear
    });
  }

  const index: ProfileSkillIndex = { bySkill, bySkillTypes, skills: entries };
  profileIndexCache.set(profile, index);
  return index;
}

/** Calcule le match d'une fiche ROME contre le profil complet (nœuds + arêtes). */
export function computeFicheMatch(
  profile: CognitiveProfile,
  fiche: RomeFiche
): RomeMatchResult {
  const index = getProfileSkillIndex(profile);
  const required = ROME_CODE_SKILLS[fiche.code] || [];
  const requiredNorm = new Set(required.map((r) => normalizeName(r)).filter(Boolean));

  // Compétences du profil qui mobilisent cette fiche (exactes et floues)
  const matchedAll: RomeMatchSkill[] = [];
  for (const entry of index.skills) {
    const codeSet = index.bySkill.get(entry.skillId);
    if (codeSet && codeSet.has(fiche.code)) {
      const types = index.bySkillTypes.get(entry.skillId) || [];
      const matchType = types.find((t) => t.code === fiche.code)?.matchType || 'fuzzy';
      matchedAll.push({ ...entry, matchType });
    }
  }
  // Compter les correspondances EXACTES (seuil anti-bruit)
  const exactCount = matchedAll.filter((m) => m.matchType === 'exact').length;

  // Exiger au moins une correspondance EXACTE : sinon la fiche est du bruit
  // (compétences génériques partagées type "travailler en équipe").
  if (exactCount === 0) {
    return {
      fiche,
      score: 0,
      label: 'explorer',
      matchedSkills: [],
      missingSkills: required.slice(0, 12),
      matchedSkillCount: 0,
      requiredSkillCount: required.length,
      coverageRatio: 0,
      formations: ROME_FORMACODE[fiche.code] || [],
      experiences: [],
      unverifiedCount: 0,
      evaluated: false
    };
  }
  const matched = matchedAll;

  // Compétences requises manquantes (par correspondance de nom)
  const missing: string[] = [];
  const matchedNorm = new Set(matched.map((m) => normalizeName(m.name)));
  for (const req of required) {
    if (!matchedNorm.has(normalizeName(req))) {
      missing.push(req);
    }
  }

  // Expériences reliées aux compétences matchées (via les arêtes)
  // Chaîne : Expérience --composed_of--> Tâche --demonstrates_skill--> Compétence
  // et :     Expérience --acquired_in--> Compétence
  const matchedSkillIds = new Set(matched.map((m) => m.skillId));
  const experienceIds = new Set<string>();
  const taskIds = new Set<string>();
  for (const e of profile.edges) {
    if (matchedSkillIds.has(e.target) && e.type === 'acquired_in') {
      experienceIds.add(e.source);
    }
    if (matchedSkillIds.has(e.target) && e.type === 'demonstrates_skill') {
      taskIds.add(e.source);
    }
  }
  for (const e of profile.edges) {
    if (taskIds.has(e.target) && e.type === 'composed_of') {
      experienceIds.add(e.source);
    }
  }
  const experiences = profile.nodes
    .filter((n) => experienceIds.has(n.id) && (n.category === 'experience' || n.category === 'formation' || n.category === 'research_project'))
    .map((n) => n.name);

  const requiredSkillCount = required.length;
  const coverageRatio = requiredSkillCount > 0 ? matched.length / requiredSkillCount : 0;

  // Qualité des preuves (maîtrise + confiance), avec bonus pour les matches exacts
  const quality = matched.length > 0
    ? matched.reduce((acc, m) => acc + Math.min(1, m.baseMastery / 100) * (0.6 + 0.4 * Math.min(1, m.confidence / 100)), 0) / matched.length
    : 0;
  const exactBonus = exactCount >= 2 ? 0.06 : 0;

  // Score : un socle de ~6 compétences clés suffit à couvrir un métier ;
  // la couverture est plafonnée pour ne pas pénaliser les profils compacts.
  const rawScore = 100 * Math.min(1, matched.length / 6) * (0.68 + 0.32 * quality) + 8 * exactBonus;
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  const unverifiedCount = matched.filter((m) => !m.verified || m.confidence < 70).length;

  return {
    fiche,
    score,
    label: ficheLabel(score),
    matchedSkills: matched,
    missingSkills: missing.slice(0, 12),
    matchedSkillCount: matched.length,
    requiredSkillCount,
    coverageRatio,
    formations: ROME_FORMACODE[fiche.code] || [],
    experiences,
    unverifiedCount,
    evaluated: true
  };
}

/** Calcule le match de TOUTES les fiches ROME (index pré-calculé : rapide). */
export function computeAllRomeMatches(profile: CognitiveProfile, limit = 60): RomeMatchResult[] {
  const results: RomeMatchResult[] = [];
  for (const fiche of ROME_FICHES) {
    const r = computeFicheMatch(profile, fiche);
    if (r.evaluated && r.matchedSkillCount > 0) {
      results.push(r);
    }
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

/** Recherche textuelle dans les fiches ROME (jetons + préfixes de jetons). */
export function searchRomeFiches(query: string, limit = 30): RomeFiche[] {
  const q = normalizeName(query);
  if (!q) return [];
  const qTokens = tokens(query);
  const scored: { fiche: RomeFiche; score: number }[] = [];
  for (const fiche of ROME_FICHES) {
    const hay = normalizeName(fiche.libelle + ' ' + fiche.grandDomaine + ' ' + fiche.domaine);
    const hayTokens = new Set(hay.split(' '));

    // 1) Correspondance par jetons complets (évite les faux positifs type "Man-DATA-ire")
    const hits = qTokens.filter((t) => hayTokens.has(t)).length;
    if (hits > 0 && hits >= Math.max(1, Math.ceil(qTokens.length / 2))) {
      scored.push({ fiche, score: (hits / qTokens.length) * 90 + hits * 2 });
      continue;
    }

    // 2) Préfixe de jeton pour requêtes courtes (ex : "psycho" -> psychologue, "data" -> datacenter)
    if (q.length >= 4) {
      for (const tok of hayTokens) {
        if (tok.startsWith(q)) {
          scored.push({ fiche, score: 60 });
          break;
        }
      }
    }
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.fiche);
}

export const COMPATIBILITY_LABELS: Record<RomeMatchResult['label'], { label: string; short: string; description: string; category: string; colorHex: string; badge: string }> = {
  tres_forte: {
    label: 'Compatibilité très forte',
    short: 'Très forte',
    description: "Vous mobilisez l'essentiel des compétences attendues. Le métier est directement accessible.",
    category: 'disponible',
    colorHex: '#10b981',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  forte: {
    label: 'Compatibilité forte',
    short: 'Forte',
    description: 'La plupart des compétences sont présentes. Une formation courte peut combler les écarts.',
    category: 'formation_rapide',
    colorHex: '#3b82f6',
    badge: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  moderee: {
    label: 'Compatibilité modérée',
    short: 'Modérée',
    description: 'Des passerelles existent mais un parcours de formation structuré est nécessaire.',
    category: 'formation_longue',
    colorHex: '#f59e0b',
    badge: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  explorer: {
    label: 'À explorer',
    short: 'À explorer',
    description: "Écart important avec le référentiel. À garder comme horizon d'exploration long terme.",
    category: 'eloigne',
    colorHex: '#8b5cf6',
    badge: 'bg-violet-50 text-violet-700 border-violet-200'
  }
};

export function getCompatibilityInfo(label: RomeMatchResult['label']) {
  return COMPATIBILITY_LABELS[label];
}

/** Recalcule la catégorie qualitative d'un score numérique (utilisé pour les anciens horizons). */
export function compatibilityLabelFromScore(score: number): RomeMatchResult['label'] {
  return ficheLabel(score);
}
