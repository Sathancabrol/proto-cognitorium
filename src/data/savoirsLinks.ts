import { KEY_CITATIONS, Citation } from './psychologyAtlas';
import { LAB_EXPERIMENTS, LabExperiment } from './experimentCatalog';
import { PSYREF_LIBRARY, LibraryWork } from './psyRefLibrary';
import { PSYREF_SOURCES, PsyRefSource } from './psyRefSources';

export interface RelatedBundle {
  posters: LabExperiment[];
  works: LibraryWork[];
  sources: PsyRefSource[];
  citations: Citation[];
}

const POSTER_BY_NODE: Record<string, string[]> = {
  cognitive: ['COG-ATT-STROOP-001', 'COG-MEM-SPERLING-004', 'COG-META-JOL-011'],
  perception: ['COG-ATT-CHANGE-003'],
  'p-vis': ['COG-ATT-CHANGE-003'],
  attention: ['COG-ATT-STROOP-001', 'COG-ATT-GORILLA-002'],
  'a-sel': ['COG-ATT-STROOP-001', 'COG-ATT-GORILLA-002'],
  'a-exe': ['COG-ATT-STROOP-001'],
  'a-con': ['COG-ATT-GORILLA-002'],
  memory: ['COG-MEM-SPERLING-004', 'COG-MEM-STERNBERG-005', 'COG-MEM-LOFTUS-007'],
  'm-sens': ['COG-MEM-SPERLING-004'],
  'm-wm': ['COG-MEM-STERNBERG-005', 'COG-WM-NBACK-012'],
  'm-ltm': ['COG-MEM-SERIAL-006'],
  'm-epi': ['COG-MEM-SERIAL-006'],
  'm-dist': ['COG-MEM-LOFTUS-007'],
  'm-meta': ['COG-META-JOL-011'],
  thinking: ['COG-REA-WASON-009'],
  't-ind': ['COG-REA-WASON-009'],
  't-sci': ['COG-REA-WASON-009'],
  decision: ['COG-DEC-FRAME-010'],
  'd-bias': ['COG-DEC-FRAME-010'],
  'd-mod': ['COG-DEC-FRAME-010'],
  metacog: ['COG-META-JOL-011'],
  'mc-e': ['COG-META-JOL-011'],
  'mc-r': ['COG-META-JOL-011'],
  'mc-srl': ['COG-META-JOL-011'],
  space: ['COG-SPA-ROTATION-008'],
  'sp-nav': ['COG-SPA-ROTATION-008'],
  social: ['COG-ATT-GORILLA-002'],
  'so-inf': ['COG-ATT-GORILLA-002'],
  'so-cog': ['COG-MEM-LOFTUS-007'],
  education: ['COG-META-JOL-011'],
  'ed-str': ['COG-META-JOL-011'],
  'ed-cog': ['COG-ATT-STROOP-001'],
  clinical: [],
  'cl-dx': []
};

const WORK_BY_NODE: Record<string, string[]> = {
  cognitive: ['mehta-memory', 'openstax-psy-2e', 'psytoolkit'],
  memory: ['mehta-memory', 'psytoolkit'],
  'm-wm': ['mehta-memory', 'psytoolkit'],
  metacog: ['seifert-sutton', 'rmp-4e'],
  'mc-srl': ['seifert-sutton'],
  education: ['seifert-sutton'],
  perception: ['mehta-memory', 'hornbaek-hci'],
  attention: ['psytoolkit', 'mehta-memory'],
  clinical: ['icd11-browser', 'icd11-cddr', 'openstax-disorders'],
  'cl-dx': ['icd11-browser', 'icd11-cddr'],
  'pp-mood': ['icd11-browser', 'has'],
  bio: ['hove-martinez-biopsych'],
  dev: ['lally-lifespan-4e'],
  social: ['openstax-social-ch'],
  io: ['rome', 'openstax-io'],
  'app-hci': ['hornbaek-hci', 'ixdf-encyclopedia'],
  space: ['psytoolkit'],
  thinking: ['rmp-4e', 'psytoolkit']
};

const SOURCE_BY_NODE: Record<string, string[]> = {
  clinical: ['icd11', 'dsm5tr', 'has'],
  'cl-dx': ['icd11', 'dsm5tr', 'icd11-cddr'],
  bio: ['pubmed'],
  io: ['rome'],
  social: ['apa-div'],
  cognitive: ['psycinfo', 'openalex']
};

const CITE_BY_NODE: Record<string, string[]> = {
  metacog: ['flavell1979', 'zimmerman2000', 'pintrich2000'],
  'mc-srl': ['zimmerman2000', 'winne1998', 'dignath2008b'],
  'mc-e': ['flavell1979', 'koriat1997'],
  memory: ['loftus1974', 'stroop1935'],
  'm-dist': ['loftus1974'],
  attention: ['stroop1935'],
  'a-sel': ['stroop1935'],
  social: ['asch1951', 'sherif1935', 'sherif1961'],
  'so-inf': ['asch1951', 'sherif1935'],
  education: ['muijs2020', 'deboer2018'],
  decision: ['festinger1959']
};

function uniq<T extends { id: string }>(xs: T[]): T[] {
  const seen = new Set<string>();
  return xs.filter((x) => {
    if (seen.has(x.id)) return false;
    seen.add(x.id);
    return true;
  });
}

export function relatedForAtlasNode(nodeId: string | null): RelatedBundle {
  if (!nodeId) return { posters: [], works: [], sources: [], citations: [] };
  const posterIds = POSTER_BY_NODE[nodeId] || [];
  const workIds = WORK_BY_NODE[nodeId] || [];
  const sourceIds = SOURCE_BY_NODE[nodeId] || [];
  const citeIds = CITE_BY_NODE[nodeId] || [];
  return {
    posters: uniq(posterIds.map((id) => LAB_EXPERIMENTS.find((e) => e.id === id)).filter(Boolean) as LabExperiment[]),
    works: uniq(workIds.map((id) => PSYREF_LIBRARY.find((w) => w.id === id)).filter(Boolean) as LibraryWork[]),
    sources: uniq(sourceIds.map((id) => PSYREF_SOURCES.find((s) => s.id === id)).filter(Boolean) as PsyRefSource[]),
    citations: uniq(citeIds.map((id) => KEY_CITATIONS.find((c) => c.id === id)).filter(Boolean) as Citation[])
  };
}

export function relatedForPoster(exp: LabExperiment): RelatedBundle {
  const cite = KEY_CITATIONS.filter(
    (c) =>
      c.title.toLowerCase().includes(exp.paradigme.split(' ')[0].toLowerCase()) ||
      exp.reference.authors.split(',')[0].split(' ')[0].toLowerCase() === c.authors.split(',')[0].split(' ')[0].toLowerCase()
  );
  return {
    posters: [],
    works: PSYREF_LIBRARY.filter((w) =>
      exp.domaine.startsWith('Timing') ? w.id === 'vatakis-2018' || w.id === 'psytoolkit' : w.id === 'psytoolkit' || w.id === 'rmp-4e'
    ),
    sources: [],
    citations: cite.slice(0, 3)
  };
}
