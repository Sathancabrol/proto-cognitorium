export type ResourceKind = 'oer' | 'classic' | 'platform' | 'synthesis' | 'norm';
export type ResourceLegal = 'oer' | 'institutionnel' | 'commercial-ne-pas-telecharger';

export interface ResourceCollection {
  id: string;
  label: string;
  blurb: string;
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
  }
];

export const KIND_LABEL: Record<ResourceKind, string> = {
  oer: 'Manuel / cours OER',
  classic: 'Classique (éditeur)',
  platform: 'Plateforme',
  synthesis: 'Synthèse / méta-analyse',
  norm: 'Norme / institution'
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
    posterId: 'asch',
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
  }
];
