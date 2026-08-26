import { OUTILS_DATA, OUTILS_EVAL } from './savoirsOutilsCatalog';

export type ResourceKind = 'oer' | 'classic' | 'platform' | 'synthesis' | 'norm' | 'tool' | 'test' | 'concept';
export type ResourceLegal = 'oer' | 'institutionnel' | 'commercial-ne-pas-telecharger';

export type ResourceLayer = 'lecture' | 'outils';

export interface ResourceCollection {
  id: string;
  label: string;
  blurb: string;
  layer?: ResourceLayer;
}

export interface SavoirsResource {
  id: string;
  collection: string;
  title: string;
  subtitle: string;
  authors: string;
  year: number | string;
  kind: ResourceKind;
  legal: ResourceLegal;
  url: string;
  doi?: string;
  summary: string;
  citationsApprox?: number;
  atlasId?: string;
  posterId?: string;
  clinical?: boolean;
  tags?: string[];
}

export const RESOURCE_COLLECTIONS: ResourceCollection[] = [
  {
    id: 'portails',
    label: 'Plateformes OER',
    blurb: 'Manuels open source validés — OpenStax, LibreTexts, Open Textbook Library, OSF.'
  },
  {
    id: 'fondations',
    label: 'Fondations métacog',
    blurb: 'Flavell 1979 et le monitoring de second ordre — les plus cités du champ.'
  },
  {
    id: 'srl',
    label: 'Modèles SRL',
    blurb: 'Zimmerman, Pintrich, Winne & Hadwin, Boekaerts — boucle forethought → performance → reflection.'
  },
  {
    id: 'meta',
    label: 'Méta-analyses',
    blurb: 'Donker, de Boer, Dignath — effets de l’instruction métacognitive sur la performance.'
  },
  {
    id: 'cognition',
    label: 'Cognition & neurosciences',
    blurb: 'Manuels OER mémoire, biological psychology — pas de PDF commercial.'
  },
  {
    id: 'dev',
    label: 'Développement',
    blurb: 'Lifespan en accès libre : Lally, Lumen, LibreTexts.'
  },
  {
    id: 'edu',
    label: 'Éducation',
    blurb: 'Métacognition à l’école : Seifert & Sutton, EEF, interventions SRL.'
  },
  {
    id: 'social',
    label: 'Sociale & expériences',
    blurb: 'Sherif, Asch, Robbers Cave, Bandura, Festinger — paradigmes, pas recettes.'
  },
  {
    id: 'methodes',
    label: 'Méthodes & stats',
    blurb: 'Research Methods in Psychology, OpenIntro, OSF, Crossref, OpenAlex.'
  },
  {
    id: 'ux',
    label: 'Ergonomie & UX',
    blurb: 'HCI open access : Hornbæk (OUP), encyclopédie IxDF.'
  },
  {
    id: 'normes',
    label: 'Normes & clinique',
    blurb: 'CIM-11 OMS, HAS, Psycom — information documentaire, jamais un diagnostic automatique.'
  },
  {
    id: 'outils',
    label: 'Outils d’expérimentation',
    blurb: 'jsPsych, PsychoPy, PsyToolkit, OpenSesame, JATOS… pour construire, héberger et analyser une expérience.',
    layer: 'outils'
  },
  {
    id: 'outils-eval',
    label: 'Évaluation cognitive',
    blurb: 'Batteries et tâches (NIH Toolbox, CANTAB, MoCA, Stroop, n-back, WAIS…). Documentaire, jamais un diagnostic auto.',
    layer: 'outils'
  },
  {
    id: 'outils-data',
    label: 'Traitement de données',
    blurb: 'Stats, EEG/IRM, psychophysique, pipelines comportementaux (R, JASP, MNE, fMRIPrep, HDDM…).',
    layer: 'outils'
  },
  {
    id: 'tests',
    label: 'Tests & questionnaires',
    blurb: 'Instruments documentaires (personnalité, métacognition, UX). Clinique = non diagnostique. Commerciaux = éditeur.'
  },
  {
    id: 'concepts',
    label: 'Concepts & paradigmes',
    blurb: 'Attention, mémoire, biais, SRL, influence sociale — relais vers l’arborescence et les posters.'
  }
];

export const KIND_LABEL: Record<ResourceKind, string> = {
  oer: 'Manuel / cours OER',
  classic: 'Classique (éditeur)',
  platform: 'Plateforme',
  synthesis: 'Synthèse / méta-analyse',
  norm: 'Norme / institution',
  tool: 'Outil / logiciel',
  test: 'Test / questionnaire',
  concept: 'Concept / paradigme'
};

export const SAVOIRS_RESOURCES: SavoirsResource[] = [
  {
    id: 'openstax',
    collection: 'portails',
    title: 'OpenStax — Psychology 2e',
    subtitle: 'Manuel universitaire CC BY 4.0',
    authors: 'Spielman, Jenkins & Lovett',
    year: 2020,
    kind: 'oer',
    legal: 'oer',
    url: 'https://openstax.org/details/books/psychology-2e',
    summary: 'Cartographie générale de la discipline. Point d’entrée légal n°1.'
  },
  {
    id: 'otl',
    collection: 'portails',
    title: 'Open Textbook Library',
    subtitle: 'Catalogue de manuels universitaires ouverts',
    authors: 'Open Education Network / University of Minnesota',
    year: 'continu',
    kind: 'platform',
    legal: 'oer',
    url: 'https://open.umn.edu/opentextbooks',
    summary: 'Filtrer Psychology, Education, Statistics. Vérifier la licence de chaque titre.'
  },
  {
    id: 'libretexts',
    collection: 'portails',
    title: 'LibreTexts — Social Sciences',
    subtitle: 'Livreshelves psychologie, éducation, développement',
    authors: 'LibreTexts',
    year: 'continu',
    kind: 'platform',
    legal: 'oer',
    url: 'https://socialsci.libretexts.org/',
    summary: 'Agrégateur OER. La qualité dépend de chaque ouvrage, pas de la plateforme.'
  },
  {
    id: 'osf',
    collection: 'portails',
    title: 'OSF / Center for Open Science',
    subtitle: 'Pré-enregistrement, open data, réplication',
    authors: 'Center for Open Science',
    year: 'continu',
    kind: 'platform',
    legal: 'institutionnel',
    url: 'https://www.cos.io/',
    summary: 'Infrastructure de science ouverte. Pas une revue.'
  },
  {
    id: 'hal',
    collection: 'portails',
    title: 'HAL / theses.fr',
    subtitle: 'Archive ouverte française',
    authors: 'CCSD',
    year: 'continu',
    kind: 'platform',
    legal: 'institutionnel',
    url: 'https://hal.science/',
    summary: 'Filtrer le statut (article, preprint, thèse).'
  },
  {
    id: 'flavell1979',
    collection: 'fondations',
    title: 'Metacognition and cognitive monitoring',
    subtitle: 'American Psychologist — origine du concept éducatif',
    authors: 'Flavell, J. H.',
    year: 1979,
    kind: 'classic',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://doi.org/10.1037/0003-066X.34.10.906',
    doi: '10.1037/0003-066X.34.10.906',
    citationsApprox: 18000,
    atlasId: 'metacog',
    summary: 'Connaissances métacognitives vs expériences / régulation. Référence canonique — accès APA / BU.'
  },
  {
    id: 'koriat1997',
    collection: 'fondations',
    title: 'Monitoring one’s own knowledge during study',
    subtitle: 'Judgments of learning (JOL)',
    authors: 'Koriat, A.',
    year: 1997,
    kind: 'classic',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://doi.org/10.1037/0033-295X.104.3.499',
    doi: '10.1037/0033-295X.104.3.499',
    atlasId: 'mc-e',
    posterId: 'COG-META-JOL-011',
    summary: 'Comment on estime ce qu’on saura plus tard. Accès éditeur uniquement.'
  },
  {
    id: 'zimmerman2000',
    collection: 'srl',
    title: 'Attaining self-regulation: A social cognitive perspective',
    subtitle: 'Handbook of Self-Regulation — modèle le plus cité (~4 169 cit.)',
    authors: 'Zimmerman, B. J.',
    year: 2000,
    kind: 'classic',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://doi.org/10.1016/B978-012109890-2/50031-7',
    doi: '10.1016/B978-012109890-2/50031-7',
    citationsApprox: 4169,
    atlasId: 'mc-srl',
    summary: 'Forethought → performance → self-reflection. Architecture de la Boucle SRL Cognitorium.'
  },
  {
    id: 'pintrich2000',
    collection: 'srl',
    title: 'The role of goal orientation in self-regulated learning',
    subtitle: 'Handbook of Self-Regulation (~3 416 cit.)',
    authors: 'Pintrich, P. R.',
    year: 2000,
    kind: 'classic',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://doi.org/10.1016/B978-012109890-2/50043-3',
    doi: '10.1016/B978-012109890-2/50043-3',
    citationsApprox: 3416,
    summary: 'Articule orientations de but, efficacité et métacognition.'
  },
  {
    id: 'winne1998',
    collection: 'srl',
    title: 'Studying as self-regulated learning',
    subtitle: '4 phases COPES (~1 037 cit.)',
    authors: 'Winne, P. H. & Hadwin, A. F.',
    year: 1998,
    kind: 'classic',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://www.routledge.com/',
    citationsApprox: 1037,
    summary: 'Task definition, goals, tactics, adapting. Handbook — lien éditeur, pas de PDF hébergé.'
  },
  {
    id: 'boekaerts2000',
    collection: 'srl',
    title: 'Self-regulation and ego-protection',
    subtitle: 'Buts d’apprentissage vs protection de l’ego',
    authors: 'Boekaerts, M.',
    year: 2000,
    kind: 'classic',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://www.sciencedirect.com/book/9780121098902/handbook-of-self-regulation',
    citationsApprox: 2500,
    summary: 'Explique pourquoi un apprenant peut quitter la tâche pour se protéger. Accès handbook.'
  },
  {
    id: 'zimmerman2009',
    collection: 'srl',
    title: 'Where metacognition and motivation intersect',
    subtitle: 'Handbook of Metacognition in Education',
    authors: 'Zimmerman, B. J. & Moylan, A. R.',
    year: 2009,
    kind: 'classic',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://www.routledge.com/Handbook-of-Metacognition-in-Education/Hacker-Dunlosky-Graesser/p/book/9780805863543',
    citationsApprox: 1800,
    summary: 'Référence majeure métacognition × motivation.'
  },
  {
    id: 'dignath2008a',
    collection: 'meta',
    title: 'SRL strategies in primary school',
    subtitle: 'Educational Research Review (~1 800 cit.)',
    authors: 'Dignath, C., Büttner, G. & Langfeldt, H.-P.',
    year: 2008,
    kind: 'synthesis',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://doi.org/10.1016/j.edurev.2008.02.003',
    doi: '10.1016/j.edurev.2008.02.003',
    citationsApprox: 1800,
    summary: 'SRL dès le primaire ; effets sur stratégies, motivation, maths. Combiner entraînement + feedback.'
  },
  {
    id: 'dignath2008b',
    collection: 'meta',
    title: 'Components of fostering SRL',
    subtitle: 'Metacognition and Learning — g ≈ 0,69 (~2 000 cit.)',
    authors: 'Dignath, C. & Büttner, G.',
    year: 2008,
    kind: 'synthesis',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://doi.org/10.1007/s11409-008-9029-x',
    doi: '10.1007/s11409-008-9029-x',
    citationsApprox: 2000,
    summary: 'Plus fort si on combine stratégies cognitives + métacognitives + gestion, et si on explique pourquoi.'
  },
  {
    id: 'donker2014',
    collection: 'meta',
    title: 'Learning strategy instruction — meta-analysis',
    subtitle: 'ERR — écriture g≈1,25 · sciences 0,73 · maths 0,66',
    authors: 'Donker, de Boer, Kostons, Dignath-van Ewijk & van der Werf',
    year: 2014,
    kind: 'synthesis',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://doi.org/10.1016/j.edurev.2013.11.002',
    doi: '10.1016/j.edurev.2013.11.002',
    citationsApprox: 1600,
    summary: 'Enseigner quand / pourquoi / comment utiliser une stratégie augmente l’effet.'
  },
  {
    id: 'deboer2018',
    collection: 'meta',
    title: 'Long-term effects of metacognitive strategy instruction',
    subtitle: 'ERR — g ≈ 0,63 à long terme',
    authors: 'de Boer, Donker, Kostons & van der Werf',
    year: 2018,
    kind: 'synthesis',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://doi.org/10.1016/j.edurev.2018.03.002',
    doi: '10.1016/j.edurev.2018.03.002',
    citationsApprox: 900,
    summary: 'Les élèves de faible SES bénéficient le plus dans la durée.'
  },
  {
    id: 'muijs2020',
    collection: 'edu',
    title: 'Metacognition and self-regulation: Evidence Review',
    subtitle: 'Education Endowment Foundation — accès libre',
    authors: 'Muijs, D. & Bokhove, C.',
    year: 2020,
    kind: 'synthesis',
    legal: 'oer',
    url: 'https://educationendowmentfoundation.org.uk/education-evidence/evidence-reviews/metacognition-and-self-regulation',
    citationsApprox: 400,
    atlasId: 'education',
    summary: 'Impact significatif au-delà du niveau initial. Document institutionnel UK, pas un article payant.'
  },
  {
    id: 'seifert',
    collection: 'edu',
    title: 'Educational Psychology',
    subtitle: 'Manuel OER CC BY',
    authors: 'Seifert, K. & Sutton, R.',
    year: 2022,
    kind: 'oer',
    legal: 'oer',
    url: 'https://socialsci.libretexts.org/Bookshelves/Education_and_Professional_Development/Educational_Psychology_(Seifert_and_Sutton)',
    atlasId: 'education',
    summary: 'Apprentissage, motivation, évaluation, diversité, climat de classe.'
  },
  {
    id: 'mehta',
    collection: 'cognition',
    title: 'Memory & Cognition',
    subtitle: 'Manuel OER — Open Textbook Library',
    authors: 'Mehta, P.',
    year: 2026,
    kind: 'oer',
    legal: 'oer',
    url: 'https://open.umn.edu/opentextbooks/textbooks/memory-cognition',
    atlasId: 'memory',
    summary: 'Mémoire, imagerie, décision, raisonnement.'
  },
  {
    id: 'hove',
    collection: 'cognition',
    title: 'Biological Psychology [Revised Edition]',
    subtitle: 'ROTEL / OTL — CC BY-NC-SA',
    authors: 'Hove, M. J. & Martinez, S. A.',
    year: 2024,
    kind: 'oer',
    legal: 'oer',
    url: 'https://open.umn.edu/opentextbooks/textbooks/1626',
    atlasId: 'bio',
    summary: 'Gènes, hormones, structures, émotions. Alternative légale à Garrett (SAGE, commercial).'
  },
  {
    id: 'stroop1935',
    collection: 'cognition',
    title: 'Studies of interference in serial verbal reactions',
    subtitle: 'Journal of Experimental Psychology (~20 000 cit.)',
    authors: 'Stroop, J. R.',
    year: 1935,
    kind: 'classic',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://doi.org/10.1037/h0054651',
    doi: '10.1037/h0054651',
    citationsApprox: 20000,
    atlasId: 'a-sel',
    posterId: 'COG-ATT-STROOP-001',
    summary: 'Interférence lecture automatique vs dénomination de couleur. Démo Cognitorium ≠ réplication.'
  },
  {
    id: 'lally',
    collection: 'dev',
    title: 'Lifespan Development: A Psychological Perspective, 4e',
    subtitle: 'OER CC BY-NC-SA',
    authors: 'Lally, M. & Valentine-French, S.',
    year: 2022,
    kind: 'oer',
    legal: 'oer',
    url: 'https://socialsci.libretexts.org/Bookshelves/Human_Development/Lifespan_Development%3A_A_Psychological_Perspective_4e_(Lally_and_Valentine-French)',
    atlasId: 'dev',
    summary: 'De la conception à la mort. PDF institutionnel — pas un miroir pirate.'
  },
  {
    id: 'lumen-dev',
    collection: 'dev',
    title: 'Lifespan Development (Lumen Learning)',
    subtitle: 'Cours OER',
    authors: 'Lumen Learning',
    year: 's.d.',
    kind: 'oer',
    legal: 'oer',
    url: 'https://courses.lumenlearning.com/wm-lifespandevelopment/',
    atlasId: 'dev',
    summary: 'Développement physique, cognitif, social, émotionnel.'
  },
  {
    id: 'sherif1935',
    collection: 'social',
    title: 'A study of some social factors in perception',
    subtitle: 'Norme autocinétique',
    authors: 'Sherif, M.',
    year: 1935,
    kind: 'classic',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://psycnet.apa.org/record/1936-01741-001',
    citationsApprox: 4000,
    atlasId: 'so-inf',
    summary: 'L’incertitude perceptive fabrique une norme. Ne pas confondre avec Asch.'
  },
  {
    id: 'asch1951',
    collection: 'social',
    title: 'Effects of group pressure upon the modification and distortion of judgments',
    subtitle: 'Conformité face à une évidence',
    authors: 'Asch, S. E.',
    year: 1951,
    kind: 'classic',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://psycnet.apa.org/record/1952-00837-001',
    citationsApprox: 8000,
    atlasId: 'so-inf',
    summary: 'Pression normative, pas informationnelle. Accès archive / BU.'
  },
  {
    id: 'bandura1961',
    collection: 'social',
    title: 'Transmission of aggression through imitation of aggressive models',
    subtitle: 'Poupée Bobo',
    authors: 'Bandura, A., Ross, D. & Ross, S. A.',
    year: 1961,
    kind: 'classic',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://doi.org/10.1037/h0045925',
    doi: '10.1037/h0045925',
    citationsApprox: 10000,
    summary: 'Apprentissage observationnel. Démo pédagogique, pas reproduction de l’agression.'
  },
  {
    id: 'festinger1959',
    collection: 'social',
    title: 'Cognitive consequences of forced compliance',
    subtitle: 'Dissonance — faible récompense, plus de changement d’attitude',
    authors: 'Festinger, L. & Carlsmith, J. M.',
    year: 1959,
    kind: 'classic',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://doi.org/10.1037/h0042694',
    doi: '10.1037/h0042694',
    citationsApprox: 9000,
    summary: 'Pas une loi mécanique. Dépend du sentiment de choix et de la justification.'
  },
  {
    id: 'openstax-social',
    collection: 'social',
    title: 'Psychology 2e — Social Psychology',
    subtitle: 'Chapitre OER',
    authors: 'Spielman, Jenkins & Lovett',
    year: 2020,
    kind: 'oer',
    legal: 'oer',
    url: 'https://openstax.org/books/psychology-2e/pages/12-introduction',
    atlasId: 'social',
    summary: 'Attitudes, influence, groupes. Compléter par méta-analyses, pas seulement les classiques.'
  },
  {
    id: 'rmp',
    collection: 'methodes',
    title: 'Research Methods in Psychology, 4e',
    subtitle: 'KPU Pressbooks — CC BY-NC-SA',
    authors: 'Jhangiani, Chiang, Cuttler & Leighton',
    year: 2019,
    kind: 'oer',
    legal: 'oer',
    url: 'https://kpu.pressbooks.pub/psychmethods4e/',
    summary: 'Hypothèses, plans, VI/VD, validité, éthique — pour qualifier chaque fiche Cognitorium.'
  },
  {
    id: 'openintro',
    collection: 'methodes',
    title: 'OpenIntro Statistics',
    subtitle: 'CC BY-SA',
    authors: 'Diez, Çetinkaya-Rundel & Barr',
    year: 2019,
    kind: 'oer',
    legal: 'oer',
    url: 'https://www.openintro.org/book/os/',
    summary: 'Descriptives, inférentielles, modèles de base.'
  },
  {
    id: 'openalex',
    collection: 'methodes',
    title: 'OpenAlex',
    subtitle: 'Catalogue ouvert + graphe de citations',
    authors: 'OurResearch',
    year: 'continu',
    kind: 'platform',
    legal: 'institutionnel',
    url: 'https://openalex.org/',
    summary: 'Compter les citations ≈ influence, pas vérité. Candidat API Référence.'
  },
  {
    id: 'crossref',
    collection: 'methodes',
    title: 'Crossref',
    subtitle: 'Résolution des DOI',
    authors: 'Crossref',
    year: 'continu',
    kind: 'platform',
    legal: 'institutionnel',
    url: 'https://www.crossref.org/documentation/',
    summary: 'Vérifier un DOI avant de l’afficher comme preuve.'
  },
  {
    id: 'pintrich-assess',
    collection: 'methodes',
    title: 'Assessing metacognition and self-regulated learning',
    subtitle: 'Cadre de mesure (~2 200 cit.)',
    authors: 'Pintrich, Wolters & Baxter',
    year: 2000,
    kind: 'classic',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://digitalcommons.unl.edu/burosmetacognition/3/',
    citationsApprox: 2200,
    summary: 'MAI largement utilisé. Digital Commons UNL — vérifier le dépôt institutionnel.'
  },
  {
    id: 'hornbaek',
    collection: 'ux',
    title: 'Introduction to Human-Computer Interaction',
    subtitle: 'Oxford Academic OA — CC BY-NC-ND',
    authors: 'Hornbæk, Kristensson & Oulasvirta',
    year: 2025,
    kind: 'oer',
    legal: 'oer',
    url: 'https://academic.oup.com/book/59525',
    atlasId: 'app-hci',
    summary: 'Design, méthodes empiriques, UX, IA, VR. ND : pas de dérivés.'
  },
  {
    id: 'ixdf',
    collection: 'ux',
    title: 'Encyclopedia of Human-Computer Interaction, 2e',
    subtitle: 'Interaction Design Foundation',
    authors: 'IxDF',
    year: '2e éd.',
    kind: 'oer',
    legal: 'oer',
    url: 'https://www.interaction-design.org/literature/book/the-encyclopedia-of-human-computer-interaction-2nd-ed',
    summary: 'Perception, évaluation, accessibilité. Lecture gratuite, conditions du site.'
  },
  {
    id: 'icd11',
    collection: 'normes',
    title: 'CIM-11 — navigateur MMS',
    subtitle: 'OMS — latest release',
    authors: 'OMS / WHO',
    year: '2024–2026',
    kind: 'norm',
    legal: 'institutionnel',
    url: 'https://icd.who.int/browse/latest-release/mms/en',
    clinical: true,
    summary:
      'information_documentaire_non_diagnostique. Classification des maladies, pas toute la psychologie. API officielle OAuth2, pas de scraping.'
  },
  {
    id: 'dsm5tr',
    collection: 'normes',
    title: 'DSM-5-TR',
    subtitle: 'American Psychiatric Association — pas l’APA psychologues',
    authors: 'American Psychiatric Association',
    year: 2022,
    kind: 'norm',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://www.psychiatry.org/psychiatrists/practice/dsm',
    clinical: true,
    summary:
      'Critères diagnostiques psychiatriques. Éditeur = American Psychiatric Association. information_documentaire_non_diagnostique.'
  },
  {
    id: 'has',
    collection: 'normes',
    title: 'HAS — recommandations',
    subtitle: 'Haute Autorité de Santé',
    authors: 'HAS',
    year: 'continu',
    kind: 'norm',
    legal: 'institutionnel',
    url: 'https://www.has-sante.fr/',
    clinical: true,
    summary: 'Pratique clinique française. Pas un traité de cognition.'
  },
  {
    id: 'psycom',
    collection: 'normes',
    title: 'Psycom',
    subtitle: 'Information publique, déstigmatisation',
    authors: 'Psycom',
    year: 'continu',
    kind: 'norm',
    legal: 'institutionnel',
    url: 'https://www.psycom.org/',
    clinical: true,
    summary: 'Psychoéducation. Pas une source primaire de recherche.'
  },
  {
    id: 'rome',
    collection: 'normes',
    title: 'France Travail — ROME',
    subtitle: 'Métiers, activités, compétences',
    authors: 'France Travail',
    year: 2026,
    kind: 'norm',
    legal: 'institutionnel',
    url: 'https://www.francetravail.fr/employeur/vos-recrutements/le-rome-et-les-fiches-metiers.html',
    summary: 'Déjà dans Mes possibilités. Référentiel métier, pas une théorie psychologique.'
  },

  // ----- Outils d’expérimentation -----
  {
    id: 'psytoolkit',
    collection: 'outils',
    title: 'PsyToolkit',
    subtitle: 'Bibliothèque d’expériences + questionnaires, usage académique',
    authors: 'Stoet, G.',
    year: 'continu',
    kind: 'tool',
    legal: 'oer',
    url: 'https://www.psytoolkit.org/',
    tags: ['outil', 'expérimentation', 'labo', 'stroop', 'n-back', 'questionnaire', 'démo'],
    posterId: 'COG-ATT-STROOP-001',
    summary: 'Stroop, n-back, Simon, Flanker, Posner, Go/No-Go. Démo ≠ réplication. Gratuit pour usage académique (conditions du site).'
  },
  {
    id: 'jspsych',
    collection: 'outils',
    title: 'jsPsych',
    subtitle: 'Framework JS pour expériences navigateur',
    authors: 'de Leeuw, J. R. et al.',
    year: 'continu',
    kind: 'tool',
    legal: 'oer',
    url: 'https://www.jspsych.org/',
    tags: ['outil', 'expérimentation', 'javascript', 'timeline', 'labo', 'open source'],
    summary: 'Construire des protocoles (essais, randomisation, plugins). Souvent déployé avec cognition.run ou JATOS.'
  },
  {
    id: 'psychopy',
    collection: 'outils',
    title: 'PsychoPy',
    subtitle: 'Builder + Coder, timing précis, local ou en ligne',
    authors: 'Peirce, J. et al.',
    year: 'continu',
    kind: 'tool',
    legal: 'oer',
    url: 'https://www.psychopy.org/',
    tags: ['outil', 'expérimentation', 'python', 'timing', 'labo'],
    summary: 'Standard de labo. Open source. Expériences locales ou via Pavlovia.'
  },
  {
    id: 'pavlovia',
    collection: 'outils',
    title: 'Pavlovia',
    subtitle: 'Hébergement d’expériences PsychoPy / jsPsych',
    authors: 'Open Science Tools',
    year: 'continu',
    kind: 'tool',
    legal: 'institutionnel',
    url: 'https://pavlovia.org/',
    tags: ['outil', 'hébergement', 'expérimentation', 'recrutement'],
    summary: 'Déploiement en ligne. Compte et crédits selon usage — site officiel.'
  },
  {
    id: 'opensesame',
    collection: 'outils',
    title: 'OpenSesame',
    subtitle: 'Builder graphique d’expériences, open source',
    authors: 'Mathôt, S., Schreij, D. & Theeuwes, J.',
    year: 'continu',
    kind: 'tool',
    legal: 'oer',
    url: 'https://osdoc.cogsci.nl/',
    tags: ['outil', 'expérimentation', 'gui', 'labo'],
    summary: 'Chaînes d’items, Python, backend PsychoPy ou Expyriment.'
  },
  {
    id: 'labjs',
    collection: 'outils',
    title: 'lab.js',
    subtitle: 'Builder navigateur, export jsPsych / OpenSesame',
    authors: 'Henninger, F. et al.',
    year: 'continu',
    kind: 'tool',
    legal: 'oer',
    url: 'https://lab.js.org/',
    tags: ['outil', 'expérimentation', 'builder', 'open source'],
    summary: 'Interface visuelle pour assembler des études en ligne.'
  },
  {
    id: 'jatos',
    collection: 'outils',
    title: 'JATOS',
    subtitle: 'Just Another Tool for Online Studies — serveur d’études',
    authors: 'Lange, K., Kühn, S. & Filevich, E.',
    year: 'continu',
    kind: 'tool',
    legal: 'oer',
    url: 'https://www.jatos.org/',
    tags: ['outil', 'hébergement', 'expérimentation', 'serveur'],
    summary: 'Héberger jsPsych / lab.js sur ton serveur, gérer les workers et les données.'
  },
  {
    id: 'cognitionrun',
    collection: 'outils',
    title: 'Cognition.run',
    subtitle: 'Hébergement jsPsych sans serveur',
    authors: 'Cognition.run',
    year: 'continu',
    kind: 'tool',
    legal: 'institutionnel',
    url: 'https://www.cognition.run/',
    tags: ['outil', 'jspsych', 'hébergement', 'expérimentation'],
    summary: 'Déployer une timeline jsPsych. Vérifier les conditions d’usage.'
  },
  {
    id: 'pcibex',
    collection: 'outils',
    title: 'PCIbex Farm',
    subtitle: 'Expériences linguistiques / Ibex',
    authors: 'Zehr, J. & Schwarz, F.',
    year: 'continu',
    kind: 'tool',
    legal: 'oer',
    url: 'https://farm.pcibex.net/',
    tags: ['outil', 'psycholinguistique', 'expérimentation', 'ibex'],
    summary: 'Paradigmes de lecture, acceptabilité, self-paced reading.'
  },
  {
    id: 'pebl',
    collection: 'outils',
    title: 'PEBL',
    subtitle: 'Psychology Experiment Building Language — batteries de tâches',
    authors: 'Mueller, S. T. & Piper, B. J.',
    year: 'continu',
    kind: 'tool',
    legal: 'oer',
    url: 'https://pebl.sourceforge.net/',
    tags: ['outil', 'batterie', 'expérimentation', 'open source', 'stroop', 'iowa'],
    summary: 'Tâches classiques packagées (Stroop, Iowa, WCST pédagogique). Pas un kit clinique.'
  },
  {
    id: 'psychtoolbox',
    collection: 'outils',
    title: 'Psychtoolbox-3',
    subtitle: 'Stimuli précis sous MATLAB / Octave',
    authors: 'Brainard, Pelli, Kleiner et al.',
    year: 'continu',
    kind: 'tool',
    legal: 'oer',
    url: 'http://psychtoolbox.org/',
    tags: ['outil', 'matlab', 'timing', 'vision', 'expérimentation'],
    summary: 'Contrôle fin de l’affichage et du timing. Standard neurosciences visuelles.'
  },
  {
    id: 'otree',
    collection: 'outils',
    title: 'oTree',
    subtitle: 'Expériences comportementales / économie expérimentale',
    authors: 'Chen, D. L., Schonger, M. & Wickens, C.',
    year: 'continu',
    kind: 'tool',
    legal: 'oer',
    url: 'https://www.otree.org/',
    tags: ['outil', 'économie', 'jeu', 'expérimentation', 'python'],
    summary: 'Dilemmes, enchères, biens publics. Open source.'
  },
  {
    id: 'limesurvey',
    collection: 'outils',
    title: 'LimeSurvey',
    subtitle: 'Questionnaires open source auto-hébergeables',
    authors: 'LimeSurvey GmbH / communauté',
    year: 'continu',
    kind: 'tool',
    legal: 'oer',
    url: 'https://www.limesurvey.org/',
    tags: ['outil', 'questionnaire', 'sondage', 'survey'],
    summary: 'Enquêtes, branching, export. Alternative auto-hébergée à Qualtrics.'
  },
  {
    id: 'qualtrics',
    collection: 'outils',
    title: 'Qualtrics',
    subtitle: 'Plateforme d’enquêtes (licence institutionnelle)',
    authors: 'Qualtrics',
    year: 'continu',
    kind: 'tool',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://www.qualtrics.com/',
    tags: ['outil', 'questionnaire', 'survey', 'licence'],
    summary: 'Très utilisé en labo via BU. Accès éditeur / campus uniquement.'
  },
  {
    id: 'gorilla',
    collection: 'outils',
    title: 'Gorilla Experiment Builder',
    subtitle: 'Builder web d’expériences (licence)',
    authors: 'Cauldron / Gorilla',
    year: 'continu',
    kind: 'tool',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://gorilla.sc/',
    tags: ['outil', 'expérimentation', 'builder', 'en ligne'],
    summary: 'Interface no-code. Compte et tarifs sur le site officiel.'
  },
  {
    id: 'prolific',
    collection: 'outils',
    title: 'Prolific',
    subtitle: 'Recrutement de participants en ligne',
    authors: 'Prolific',
    year: 'continu',
    kind: 'tool',
    legal: 'institutionnel',
    url: 'https://www.prolific.com/',
    tags: ['outil', 'recrutement', 'participants', 'échantillon'],
    summary: 'Panneau de participants. Complète un protocole hébergé ailleurs (Pavlovia, JATOS…).'
  },
  {
    id: 'eprime',
    collection: 'outils',
    title: 'E-Prime',
    subtitle: 'Psychology Software Tools — commercial',
    authors: 'Psychology Software Tools',
    year: 'continu',
    kind: 'tool',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://pstnet.com/products/e-prime/',
    tags: ['outil', 'expérimentation', 'labo', 'timing'],
    summary: 'Standard historique de labo Windows. Lien éditeur uniquement.'
  },
  {
    id: 'inquisit',
    collection: 'outils',
    title: 'Inquisit',
    subtitle: 'Millisecond — scripts et batteries',
    authors: 'Millisecond Software',
    year: 'continu',
    kind: 'tool',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://www.millisecond.com/',
    tags: ['outil', 'expérimentation', 'iat', 'labo'],
    summary: 'IAT et nombreuses tâches. Licence éditeur.'
  },
  {
    id: 'jasp',
    collection: 'outils',
    title: 'JASP',
    subtitle: 'Stats bayésiennes et fréquentielles, GUI',
    authors: 'JASP Team (Amsterdam)',
    year: 'continu',
    kind: 'tool',
    legal: 'oer',
    url: 'https://jasp-stats.org/',
    tags: ['outil', 'statistiques', 'analyse', 'bayésien', 'open source'],
    summary: 'Alternative ouverte à SPSS pour analyser les données d’expérience.'
  },
  {
    id: 'jamovi',
    collection: 'outils',
    title: 'jamovi',
    subtitle: 'Stats open source, feuille de calcul',
    authors: 'The jamovi project',
    year: 'continu',
    kind: 'tool',
    legal: 'oer',
    url: 'https://www.jamovi.org/',
    tags: ['outil', 'statistiques', 'analyse', 'open source'],
    summary: 'ANOVA, régression, modules. Idéal pour un premier labo.'
  },
  {
    id: 'gpower',
    collection: 'outils',
    title: 'G*Power',
    subtitle: 'Analyse de puissance a priori',
    authors: 'Faul, Erdfelder, Lang & Buchner',
    year: 'continu',
    kind: 'tool',
    legal: 'oer',
    url: 'https://www.psychologie.hhu.de/arbeitsgruppen/allgemeine-psychologie-und-arbeitspsychologie/gpower',
    tags: ['outil', 'puissance', 'échantillon', 'statistiques', 'plan'],
    summary: 'Calculer n avant de lancer l’expérience. Téléchargement officiel HHU Düsseldorf.'
  },
  {
    id: 'rstat',
    collection: 'outils',
    title: 'R / RStudio',
    subtitle: 'Analyse, figures, papaja',
    authors: 'R Core Team',
    year: 'continu',
    kind: 'tool',
    legal: 'oer',
    url: 'https://www.r-project.org/',
    tags: ['outil', 'statistiques', 'reproductibilité', 'open source'],
    summary: 'Pipeline ouvert. Compléter par OSF pour le dépôt des scripts.'
  },

  // ----- Tests & questionnaires -----
  {
    id: 'ipip',
    collection: 'tests',
    title: 'IPIP — International Personality Item Pool',
    subtitle: 'Items Big Five / HEXACO en accès libre',
    authors: 'Goldberg, L. R. et al.',
    year: 'continu',
    kind: 'test',
    legal: 'oer',
    url: 'https://ipip.ori.org/',
    tags: ['test', 'personnalité', 'big five', 'questionnaire', 'open source'],
    atlasId: 'pe-big',
    summary: 'Items publics pour mesurer des traits. Ce n’est pas le NEO-PI-R (commercial).'
  },
  {
    id: 'onet-ip',
    collection: 'tests',
    title: 'O*NET Interest Profiler',
    subtitle: 'RIASEC / Holland — outil public US',
    authors: 'U.S. Department of Labor / O*NET',
    year: 'continu',
    kind: 'test',
    legal: 'institutionnel',
    url: 'https://www.onetcenter.org/IP.html',
    tags: ['test', 'intérêts', 'riasec', 'holland', 'orientation'],
    summary: 'Profil d’intérêts professionnels ouvert. Utile à croiser avec ROME, pas un diagnostic.'
  },
  {
    id: 'mai',
    collection: 'tests',
    title: 'MAI — Metacognitive Awareness Inventory',
    subtitle: 'Connaissances + régulation auto-rapportées',
    authors: 'Schraw, G. & Dennison, R. S.',
    year: 1994,
    kind: 'test',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://doi.org/10.1006/ceps.1994.1033',
    doi: '10.1006/ceps.1994.1033',
    tags: ['test', 'métacognition', 'questionnaire', 'mai', 'srl'],
    atlasId: 'mc-k',
    summary: 'Instrument très utilisé. Article éditeur — pas d’hébergement du questionnaire ici.'
  },
  {
    id: 'mslq',
    collection: 'tests',
    title: 'MSLQ — Motivated Strategies for Learning Questionnaire',
    subtitle: 'Motivation + stratégies d’étude',
    authors: 'Pintrich, P. R. et al.',
    year: 1991,
    kind: 'test',
    legal: 'institutionnel',
    url: 'https://files.eric.ed.gov/fulltext/ED338122.pdf',
    tags: ['test', 'srl', 'motivation', 'stratégies', 'questionnaire'],
    summary: 'Rapport technique ERIC (domaine public US). Auto-rapport, pas une note scolaire.'
  },
  {
    id: 'sus',
    collection: 'tests',
    title: 'SUS — System Usability Scale',
    subtitle: '10 items d’utilisabilité',
    authors: 'Brooke, J.',
    year: 1996,
    kind: 'test',
    legal: 'oer',
    url: 'https://www.usability.gov/how-to-and-tools/methods/system-usability-scale.html',
    tags: ['test', 'ux', 'utilisabilité', 'questionnaire'],
    atlasId: 'app-hci',
    summary: 'Échelle courte, largement documentée. Usage UX, pas clinique.'
  },
  {
    id: 'nasa-tlx',
    collection: 'tests',
    title: 'NASA-TLX',
    subtitle: 'Charge de travail subjective',
    authors: 'Hart, S. G. & Staveland, L. E.',
    year: 1988,
    kind: 'test',
    legal: 'institutionnel',
    url: 'https://humansystems.arc.nasa.gov/groups/TLX/',
    tags: ['test', 'charge cognitive', 'ergonomie', 'questionnaire'],
    summary: 'Page officielle NASA. Six dimensions de charge.'
  },
  {
    id: 'phq9',
    collection: 'tests',
    title: 'PHQ-9',
    subtitle: 'Dépistage documentaire de symptômes dépressifs',
    authors: 'Kroenke, Spitzer & Williams / Pfizer',
    year: 2001,
    kind: 'test',
    legal: 'institutionnel',
    url: 'https://www.phqscreeners.com/',
    clinical: true,
    tags: ['test', 'clinique', 'dépression', 'questionnaire'],
    summary: 'information_documentaire_non_diagnostique. Site officiel des screeners. Jamais auto-diagnostiquer.'
  },
  {
    id: 'gad7',
    collection: 'tests',
    title: 'GAD-7',
    subtitle: 'Dépistage documentaire de l’anxiété généralisée',
    authors: 'Spitzer et al. / Pfizer',
    year: 2006,
    kind: 'test',
    legal: 'institutionnel',
    url: 'https://www.phqscreeners.com/',
    clinical: true,
    tags: ['test', 'clinique', 'anxiété', 'questionnaire'],
    summary: 'information_documentaire_non_diagnostique. Pas un diagnostic automatique.'
  },
  {
    id: 'neo-pi',
    collection: 'tests',
    title: 'NEO-PI-3 / NEO-PI-R',
    subtitle: 'Big Five commercial (Hogrefe / PAR)',
    authors: 'Costa, P. T. & McCrae, R. R.',
    year: '1992–',
    kind: 'test',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://www.hogrefe.com/',
    tags: ['test', 'personnalité', 'big five', 'commercial'],
    atlasId: 'pe-big',
    summary: 'Instrument commercial. Éditeur uniquement. Pour un usage ouvert, préférer IPIP.'
  },
  {
    id: 'wais',
    collection: 'tests',
    title: 'WAIS-IV / WAIS-5',
    subtitle: 'Échelle d’intelligence adulte — Pearson',
    authors: 'Wechsler / Pearson',
    year: 'continu',
    kind: 'test',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://www.pearsonclinical.com/',
    clinical: true,
    tags: ['test', 'clinique', 'intelligence', 'neuropsychologie'],
    summary: 'information_documentaire_non_diagnostique. Réservé aux professionnels habilités. Pas de cotation dans Cognitorium.'
  },
  {
    id: 'mmpi',
    collection: 'tests',
    title: 'MMPI-3',
    subtitle: 'Personnalité / psychopathologie — University of Minnesota / Pearson',
    authors: 'Ben-Porath & Tellegen',
    year: 2020,
    kind: 'test',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://www.pearsonclinical.com/',
    clinical: true,
    tags: ['test', 'clinique', 'personnalité'],
    summary: 'information_documentaire_non_diagnostique. Éditeur uniquement.'
  },
  {
    id: 'stai',
    collection: 'tests',
    title: 'STAI',
    subtitle: 'Anxiété état / trait — Mind Garden',
    authors: 'Spielberger, C. D.',
    year: 1983,
    kind: 'test',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://www.mindgarden.com/',
    clinical: true,
    tags: ['test', 'anxiété', 'questionnaire'],
    summary: 'information_documentaire_non_diagnostique. Licence Mind Garden.'
  },
  {
    id: 'crt',
    collection: 'tests',
    title: 'Cognitive Reflection Test',
    subtitle: '3 items — intuition vs réflexion',
    authors: 'Frederick, S.',
    year: 2005,
    kind: 'test',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://doi.org/10.1080/13546780542000075',
    doi: '10.1080/13546780542000075',
    tags: ['test', 'raisonnement', 'réflexion', 'biais'],
    atlasId: 'thinking',
    summary: 'Article Journal of Economic Perspectives / Judgment. Accès éditeur. Tâche de recherche, pas un QI.'
  },
  {
    id: 'rosenberg',
    collection: 'tests',
    title: 'Rosenberg Self-Esteem Scale',
    subtitle: '10 items d’estime de soi',
    authors: 'Rosenberg, M.',
    year: 1965,
    kind: 'test',
    legal: 'institutionnel',
    url: 'https://socy.umd.edu/about-us/rosenberg-self-esteem-scale',
    tags: ['test', 'estime de soi', 'questionnaire'],
    summary: 'Échelle largement utilisée. Page institutionnelle University of Maryland.'
  },
  {
    id: 'brief',
    collection: 'tests',
    title: 'BRIEF-2',
    subtitle: 'Fonctions exécutives — PAR',
    authors: 'Gioia et al. / PAR',
    year: 'continu',
    kind: 'test',
    legal: 'commercial-ne-pas-telecharger',
    url: 'https://www.parinc.com/',
    clinical: true,
    tags: ['test', 'fonctions exécutives', 'clinique'],
    atlasId: 'mc-ef',
    summary: 'information_documentaire_non_diagnostique. Éditeur PAR.'
  },

  // ----- Concepts & paradigmes -----
  {
    id: 'c-stroop',
    collection: 'concepts',
    title: 'Paradigme Stroop',
    subtitle: 'Interférence automatique / contrôle inhibiteur',
    authors: 'Stroop, 1935',
    year: 1935,
    kind: 'concept',
    legal: 'oer',
    url: 'https://www.psytoolkit.org/experiment-library/stroop.html',
    tags: ['concept', 'paradigme', 'attention', 'inhibition', 'expérience'],
    atlasId: 'a-sel',
    posterId: 'COG-ATT-STROOP-001',
    summary: 'Mesure un conflit de voies, pas une « intelligence ». Poster + démo Cognitorium / PsyToolkit.'
  },
  {
    id: 'c-nback',
    collection: 'concepts',
    title: 'N-back',
    subtitle: 'Mise à jour en mémoire de travail',
    authors: 'Kirchner, 1958',
    year: 1958,
    kind: 'concept',
    legal: 'oer',
    url: 'https://www.psytoolkit.org/experiment-library/2back.html',
    tags: ['concept', 'paradigme', 'mémoire de travail', 'expérience'],
    posterId: 'COG-WM-NBACK-012',
    summary: 'Charge n = 1, 2, 3. Pas une mesure pure de QI.'
  },
  {
    id: 'c-jol',
    collection: 'concepts',
    title: 'Judgments of Learning / calibration',
    subtitle: 'Confiance vs exactitude',
    authors: 'Koriat, 1997',
    year: 1997,
    kind: 'concept',
    legal: 'oer',
    url: 'https://doi.org/10.1037/0096-3445.126.4.349',
    tags: ['concept', 'métacognition', 'confiance', 'monitoring'],
    atlasId: 'mc-e',
    posterId: 'COG-META-JOL-011',
    summary: 'Être sûr n’est pas avoir raison. Boucle SRL Cognitorium.'
  },
  {
    id: 'c-srl',
    collection: 'concepts',
    title: 'Apprentissage auto-régulé (SRL)',
    subtitle: 'Forethought → performance → reflection',
    authors: 'Zimmerman, 2000',
    year: 2000,
    kind: 'concept',
    legal: 'oer',
    url: 'https://doi.org/10.1016/B978-012109890-2/50031-7',
    tags: ['concept', 'srl', 'métacognition', 'éducation', 'planification'],
    atlasId: 'mc-srl',
    summary: 'Modèle le plus cité pour structurer une boucle pédagogique.'
  },
  {
    id: 'c-conformity',
    collection: 'concepts',
    title: 'Conformité (Asch) vs norme (Sherif)',
    subtitle: 'Pression normative vs influence informationnelle',
    authors: 'Asch 1951 · Sherif 1935',
    year: '1935–1951',
    kind: 'concept',
    legal: 'oer',
    url: 'https://openstax.org/books/psychology-2e/pages/12-introduction',
    tags: ['concept', 'sociale', 'conformité', 'norme', 'expérience'],
    atlasId: 'so-inf',
    summary: 'Ne pas confondre les deux paradigmes. Ambiguïté réelle (Sherif) vs évidence (Asch).'
  },
  {
    id: 'c-framing',
    collection: 'concepts',
    title: 'Effet de cadrage',
    subtitle: 'Mêmes chiffres, autre choix',
    authors: 'Tversky & Kahneman, 1981',
    year: 1981,
    kind: 'concept',
    legal: 'oer',
    url: 'https://doi.org/10.1126/science.7455683',
    tags: ['concept', 'décision', 'biais', 'prospect theory', 'expérience'],
    atlasId: 'd-bias',
    posterId: 'COG-DEC-FRAME-010',
    summary: 'Gains vs pertes. Une UI responsable montre les deux formulations.'
  },
  {
    id: 'c-wason',
    collection: 'concepts',
    title: 'Tâche de sélection de Wason',
    subtitle: 'Falsification vs confirmation',
    authors: 'Wason, 1966',
    year: 1966,
    kind: 'concept',
    legal: 'oer',
    url: 'https://openstax.org/books/psychology-2e/pages/7-introduction',
    tags: ['concept', 'raisonnement', 'biais de confirmation', 'expérience'],
    atlasId: 't-sci',
    posterId: 'COG-REA-WASON-009',
    summary: 'Chercher le contre-exemple (P et non-Q). Transfert : valider une reco ROME.'
  },
  {
    id: 'c-loftus',
    collection: 'concepts',
    title: 'Mémoire reconstructive / désinformation',
    subtitle: 'Vu, inféré, ou suggéré ?',
    authors: 'Loftus & Palmer, 1974',
    year: 1974,
    kind: 'concept',
    legal: 'oer',
    url: 'https://doi.org/10.1016/S0022-5371(74)80011-3',
    tags: ['concept', 'mémoire', 'suggestion', 'source monitoring'],
    atlasId: 'm-dist',
    posterId: 'COG-MEM-LOFTUS-007',
    summary: 'La mémoire n’est pas une copie. Tracer la provenance dans Cognitorium.'
  },
  {
    id: 'c-gorilla',
    collection: 'concepts',
    title: 'Cécité inattentionnelle',
    subtitle: 'Regarder n’est pas voir',
    authors: 'Simons & Chabris, 1999',
    year: 1999,
    kind: 'concept',
    legal: 'oer',
    url: 'https://doi.org/10.1068/p281059',
    tags: ['concept', 'attention', 'gorilla', 'expérience'],
    atlasId: 'a-con',
    posterId: 'COG-ATT-GORILLA-002',
    summary: 'Un objet visible peut échapper à la conscience si hors foyer. Ne pas rejouer la vidéo originale sans droits.'
  },
  {
    id: 'c-changeblind',
    collection: 'concepts',
    title: 'Cécité au changement',
    subtitle: 'Le détail a changé. L’as-tu vu ?',
    authors: 'Simons & Levin, 1997',
    year: 1997,
    kind: 'concept',
    legal: 'oer',
    url: 'https://doi.org/10.1016/S1364-6613(97)01080-2',
    tags: ['concept', 'attention', 'perception', 'expérience'],
    posterId: 'COG-ATT-CHANGE-003',
    summary: 'Échec de comparaison entre deux représentations, distinct de la cécité inattentionnelle.'
  },
  {
    id: 'c-wm',
    collection: 'concepts',
    title: 'Mémoire de travail (Baddeley)',
    subtitle: 'Boucle phonologique, calepin visuo-spatial, administrateur',
    authors: 'Baddeley & Hitch',
    year: 1974,
    kind: 'concept',
    legal: 'oer',
    url: 'https://openstax.org/books/psychology-2e/pages/8-introduction',
    tags: ['concept', 'mémoire', 'baddeley', 'charge'],
    atlasId: 'm-wm',
    summary: 'Capacité limitée. Externaliser les listes dans l’interface.'
  },
  {
    id: 'c-zpd',
    collection: 'concepts',
    title: 'Zone proximale de développement',
    subtitle: 'Vygotsky — étayage',
    authors: 'Vygotsky, L. S.',
    year: 1978,
    kind: 'concept',
    legal: 'oer',
    url: 'https://socialsci.libretexts.org/',
    tags: ['concept', 'développement', 'éducation', 'étayage'],
    atlasId: 'ed-vyg',
    summary: 'Ce que l’apprenant peut faire avec de l’aide. Mode guidé vs libre dans Cognitorium.'
  },
  {
    id: 'c-dissonance',
    collection: 'concepts',
    title: 'Dissonance cognitive',
    subtitle: 'Acte vs croyance',
    authors: 'Festinger & Carlsmith, 1959',
    year: 1959,
    kind: 'concept',
    legal: 'oer',
    url: 'https://doi.org/10.1037/h0042694',
    tags: ['concept', 'sociale', 'attitude', 'justification'],
    atlasId: 'so-att',
    summary: 'Pas une loi mécanique. Dépend du choix perçu et de la justification.'
  },
  {
    id: 'c-bigfive',
    collection: 'concepts',
    title: 'Big Five (OCEAN)',
    subtitle: 'Traits de personnalité',
    authors: 'Costa & McCrae / Goldberg',
    year: '1990–',
    kind: 'concept',
    legal: 'oer',
    url: 'https://ipip.ori.org/',
    tags: ['concept', 'personnalité', 'traits', 'ocean'],
    atlasId: 'pe-big',
    summary: 'Pour mesurer : IPIP (ouvert) plutôt que NEO commercial.'
  },
  {
    id: 'c-riasec',
    collection: 'concepts',
    title: 'RIASEC / Holland',
    subtitle: 'Typologie d’intérêts professionnels',
    authors: 'Holland, J. L.',
    year: 1959,
    kind: 'concept',
    legal: 'oer',
    url: 'https://www.onetcenter.org/IP.html',
    tags: ['concept', 'orientation', 'intérêts', 'holland', 'riasec'],
    summary: 'Croiser avec le graphe métiers ROME. O*NET Interest Profiler est public.'
  }
];

export const ALL_SAVOIRS_RESOURCES: SavoirsResource[] = [
  ...SAVOIRS_RESOURCES,
  ...OUTILS_EVAL,
  ...OUTILS_DATA
];

export function layerOfCollection(id: string): ResourceLayer {
  return RESOURCE_COLLECTIONS.find((c) => c.id === id)?.layer === 'outils' ? 'outils' : 'lecture';
}

export function collectionsForLayer(layer: ResourceLayer): ResourceCollection[] {
  return RESOURCE_COLLECTIONS.filter((c) => layerOfCollection(c.id) === layer);
}

export function resourcesOf(collectionId: string): SavoirsResource[] {
  return ALL_SAVOIRS_RESOURCES.filter((r) => r.collection === collectionId);
}
