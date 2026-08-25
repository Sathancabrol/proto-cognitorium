import {
  ALL_SAVOIRS_RESOURCES,
  RESOURCE_COLLECTIONS,
  SavoirsResource
} from '../data/savoirsResources';

const STOP = new Set([
  'je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils',
  'un', 'une', 'le', 'la', 'les', 'des', 'du', 'de', 'd',
  'en', 'au', 'aux', 'et', 'ou', 'a', 'à', 'pour', 'par', 'sur', 'dans', 'avec',
  'faire', 'fais', 'fait', 'veux', 'voudrais', 'cherche', 'chercher',
  'besoin', 'quelque', 'chose', 'qui', 'que', 'quoi', 'comment',
  'the', 'a', 'an', 'to', 'for', 'of', 'and', 'or', 'in'
]);

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokens(s: string): string[] {
  return norm(s)
    .split(' ')
    .filter((t) => t.length > 1 && !STOP.has(t));
}

const INTENTS: { keys: string[]; collections: string[]; kinds: SavoirsResource['kind'][] }[] = [
  {
    keys: [
      'outil',
      'outils',
      'logiciel',
      'software',
      'plateforme',
      'builder',
      'experiment',
      'experimentation',
      'labo',
      'laboratoire',
      'stimuli',
      'jspsych',
      'psychopy',
      'psytoolkit',
      'opensesame',
      'protocole'
    ],
    collections: ['outils', 'outils-eval', 'outils-data', 'methodes', 'concepts'],
    kinds: ['tool', 'platform']
  },
  {
    keys: [
      'evaluation',
      'cognitiv',
      'batterie',
      'neuropsy',
      'wais',
      'moca',
      'stroop',
      'nback',
      'cantab',
      'attention',
      'memoire'
    ],
    collections: ['outils-eval', 'tests'],
    kinds: ['tool', 'test']
  },
  {
    keys: [
      'donnee',
      'data',
      'stat',
      'analyse',
      'eeg',
      'fmri',
      'pipeline',
      'preprocessing',
      'jasp',
      'python',
      'matlab'
    ],
    collections: ['outils-data', 'outils', 'methodes'],
    kinds: ['tool']
  },
  {
    keys: ['test', 'tests', 'questionnaire', 'inventaire', 'echelle', 'scale', 'psychometr', 'sondage'],
    collections: ['tests', 'outils-eval'],
    kinds: ['test', 'tool']
  },
  {
    keys: ['concept', 'paradigme', 'theorie', 'biais', 'modele'],
    collections: ['concepts', 'fondations', 'srl'],
    kinds: ['concept', 'classic']
  },
  {
    keys: ['manuel', 'livre', 'cours', 'oer', 'open'],
    collections: ['portails', 'cognition', 'dev', 'edu'],
    kinds: ['oer']
  }
];

export interface RankedResource {
  item: SavoirsResource;
  score: number;
}

export function searchResources(query: string, limit = 24): RankedResource[] {
  const q = query.trim();
  if (q.length < 2) return [];
  const toks = tokens(q);
  if (!toks.length) return [];
  const nq = norm(q);

  const intentCols = new Set<string>();
  const intentKinds = new Set<string>();
  for (const intent of INTENTS) {
    if (intent.keys.some((k) => nq.includes(norm(k)) || toks.some((t) => norm(k).startsWith(t) || t.startsWith(norm(k))))) {
      intent.collections.forEach((c) => intentCols.add(c));
      intent.kinds.forEach((k) => intentKinds.add(k));
    }
  }

  const ranked: RankedResource[] = [];
  for (const item of ALL_SAVOIRS_RESOURCES) {
    const col = RESOURCE_COLLECTIONS.find((c) => c.id === item.collection);
    const hay = norm(
      [
        item.title,
        item.subtitle,
        item.authors,
        item.summary,
        item.kind,
        item.collection,
        col?.label,
        col?.blurb,
        ...(item.tags || [])
      ].join(' ')
    );
    let score = 0;
    if (hay.includes(nq)) score += 18;
    for (const t of toks) {
      if (norm(item.title).includes(t)) score += 10;
      else if (norm(item.subtitle).includes(t)) score += 7;
      else if ((item.tags || []).some((tag) => norm(tag).includes(t))) score += 8;
      else if (hay.includes(t)) score += 3;
    }
    if (intentCols.has(item.collection)) score += 12;
    if (intentKinds.has(item.kind)) score += 14;
    if (score > 0) ranked.push({ item, score });
  }

  ranked.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'fr'));
  return ranked.slice(0, limit);
}

export const SEARCH_EXAMPLES = [
  'outil pour une expérimentation',
  'évaluation cognitive',
  'traitement EEG',
  'MoCA screening',
  'test de personnalité open source',
  'questionnaire métacognition',
  'paradigme Stroop',
  'logiciel stats bayésien',
  'RIASEC orientation'
];
