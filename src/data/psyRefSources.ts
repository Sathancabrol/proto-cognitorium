export type SourceLayer =
  | 'normative'
  | 'synthesis'
  | 'primary'
  | 'professional'
  | 'platform'
  | 'public';

export type SourceScope = 'international' | 'france' | 'both';

export interface PsyRefSource {
  id: string;
  name: string;
  layer: SourceLayer;
  scope: SourceScope;
  role: string;
  url?: string;
  caveat: string;
  tags: string[];
}

export const EVIDENCE_HIERARCHY: {
  id: SourceLayer;
  rank: number;
  title: string;
  use: string;
  not: string;
}[] = [
  {
    id: 'normative',
    rank: 1,
    title: 'Norme juridique ou sanitaire',
    use: 'Cadre, codage, exercice, recommandations officielles.',
    not: 'Ne cartographie pas toute la psychologie (CIM/DSM = troubles, pas cognition/sociale/I-O).'
  },
  {
    id: 'synthesis',
    rank: 2,
    title: 'Synthèse de haut niveau',
    use: 'Revues systématiques, méta-analyses, Cochrane, avis HAS / expertises INSERM.',
    not: 'Pas une preuve individuelle ; dépend du protocole de revue.'
  },
  {
    id: 'primary',
    rank: 3,
    title: 'Recherche primaire évaluée',
    use: 'Articles peer-reviewed, réplications, pre-registrations.',
    not: 'Une étude isolée ne fonde pas un modèle produit.'
  },
  {
    id: 'professional',
    rank: 4,
    title: 'Organisation savante / professionnelle',
    use: 'Taxonomie des sous-domaines, éthique, réseaux, standards de pratique.',
    not: 'Pas équivalent à une méta-analyse.'
  },
  {
    id: 'platform',
    rank: 5,
    title: 'Plateforme d’accès / index',
    use: 'Trouver et citer : PsycInfo, PubMed, Cairn, HAL…',
    not: 'L’indexation ne garantit pas la qualité de chaque item.'
  },
  {
    id: 'public',
    rank: 6,
    title: 'Vulgarisation publique',
    use: 'Psychoéducation, orientation, déstigmatisation.',
    not: 'Ne suffit pas à établir un modèle scientifique.'
  }
];

export const PSYREF_SOURCES: PsyRefSource[] = [
  {
    id: 'icd11',
    name: 'CIM-11 — OMS',
    layer: 'normative',
    scope: 'international',
    role: 'Classification internationale des maladies. Chapitre 06 : troubles mentaux, comportementaux et neurodéveloppementaux.',
    url: 'https://icd.who.int/browse/2024-01/mms/fr',
    caveat: 'Ne décrit pas la psychologie générale. Compléter par la CIF pour le fonctionnement.',
    tags: ['diagnostic', 'oms', 'clinique']
  },
  {
    id: 'icd11-cddr',
    name: 'CDDR CIM-11 (OMS, 2024)',
    layer: 'normative',
    scope: 'international',
    role: 'Clinical Descriptions and Diagnostic Requirements — manuel clinique complémentaire de la CIM-11.',
    url: 'https://www.who.int/publications/i/item/9789240077263',
    caveat: 'Soutient l’identification diagnostique, pas l’ontologie des processus cognitifs.',
    tags: ['diagnostic', 'oms']
  },
  {
    id: 'dsm5tr',
    name: 'DSM-5-TR — American Psychiatric Association',
    layer: 'normative',
    scope: 'international',
    role: 'Critères diagnostiques largement utilisés en psychiatrie et recherche nord-américaines.',
    url: 'https://www.psychiatry.org/psychiatrists/practice/dsm',
    caveat:
      'Publié par l’American Psychiatric Association (psychiatres), PAS l’American Psychological Association (psychologues).',
    tags: ['diagnostic', 'psychiatrie']
  },
  {
    id: 'icf',
    name: 'CIF / ICF — OMS',
    layer: 'normative',
    scope: 'international',
    role: 'Fonctionnement, activité, participation, facteurs environnementaux — au-delà du diagnostic.',
    url: 'https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health',
    caveat: 'Complète la CIM ; utile pour l’UX d’un profil de capacités, pas pour coder un trouble.',
    tags: ['fonctionnement', 'handicap']
  },
  {
    id: 'apa-div',
    name: 'APA Divisions (54)',
    layer: 'professional',
    scope: 'international',
    role: 'Taxonomie professionnelle des sous-domaines de la psychologie (clinique, sociale, expérimentale, éducation, I-O…).',
    url: 'https://www.apa.org/about/division',
    caveat: 'Carte des communautés savantes, pas une ontologie théorique unique.',
    tags: ['taxonomie', 'apa']
  },
  {
    id: 'legifrance-titre',
    name: 'Légifrance — titre de psychologue',
    layer: 'normative',
    scope: 'france',
    role: 'Article 44 de la loi du 25 juillet 1985 : titre professionnel protégé.',
    url: 'https://www.legifrance.gouv.fr/',
    caveat: 'Droit français de l’exercice, pas une source de théories.',
    tags: ['droit', 'titre']
  },
  {
    id: 'decret-90-255',
    name: 'Décret n° 90-255 du 22 mars 1990',
    layer: 'normative',
    scope: 'france',
    role: 'Diplômes et conditions d’usage du titre de psychologue.',
    url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000532723',
    caveat: 'Source juridique ; vérifier la version consolidée.',
    tags: ['droit']
  },
  {
    id: 'has',
    name: 'Haute Autorité de Santé',
    layer: 'synthesis',
    scope: 'france',
    role: 'Recommandations de bonnes pratiques, évaluations, parcours de soins.',
    url: 'https://www.has-sante.fr/',
    caveat: 'Portée clinique / sanitaire française. Pas un traité de cognition.',
    tags: ['recommandation', 'clinique']
  },
  {
    id: 'inserm',
    name: 'INSERM — expertises collectives',
    layer: 'synthesis',
    scope: 'france',
    role: 'Synthèses scientifiques (neurodéveloppement, santé mentale, addictions…).',
    url: 'https://www.inserm.fr/',
    caveat: 'Lire le protocole d’expertise et la date.',
    tags: ['expertise']
  },
  {
    id: 'spf',
    name: 'Santé publique France',
    layer: 'synthesis',
    scope: 'france',
    role: 'Données populationnelles, surveillance et prévention en santé mentale.',
    url: 'https://www.santepubliquefrance.fr/',
    caveat: 'Épidémiologie, pas modèles cognitifs individuels.',
    tags: ['sante-publique']
  },
  {
    id: 'psycinfo',
    name: 'APA PsycInfo',
    layer: 'platform',
    scope: 'international',
    role: 'Base spécialisée majeure (>5 M notices) en psychologie et sciences du comportement.',
    url: 'https://www.apa.org/pubs/databases/psycinfo',
    caveat: 'Accès souvent institutionnel. L’index n’est pas un jugement de qualité article par article.',
    tags: ['index']
  },
  {
    id: 'pubmed',
    name: 'PubMed / PMC',
    layer: 'platform',
    scope: 'international',
    role: 'NLM : psychiatrie, neuropsychologie, essais cliniques. PMC = texte intégral libre.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/',
    caveat: 'Couverture biomédicale plus que psychologie sociale / I-O.',
    tags: ['index']
  },
  {
    id: 'cochrane',
    name: 'Cochrane Library',
    layer: 'synthesis',
    scope: 'international',
    role: 'Revues systématiques d’interventions de santé, dont certaines psychothérapies.',
    url: 'https://www.cochranelibrary.com/',
    caveat: 'Priorité aux interventions évaluables, pas aux théories fondamentales.',
    tags: ['revue-systematique']
  },
  {
    id: 'wos',
    name: 'Web of Science / Scopus',
    layer: 'platform',
    scope: 'international',
    role: 'Index multidisciplinaires et bibliométrie (citations).',
    url: 'https://www.webofscience.com/',
    caveat: 'Les comptes de citations sont des ordres de grandeur, pas une vérité.',
    tags: ['bibliometrie']
  },
  {
    id: 'openalex',
    name: 'OpenAlex',
    layer: 'platform',
    scope: 'international',
    role: 'Catalogue ouvert de travaux et de graphes de citation — candidat API pour Référence.',
    url: 'https://openalex.org/',
    caveat: 'Couverture et désambiguïsation d’auteurs à contrôler.',
    tags: ['api', 'ouvert']
  },
  {
    id: 'cairn',
    name: 'Cairn.info / Persée / OpenEdition',
    layer: 'platform',
    scope: 'france',
    role: 'Canaux d’accès francophones (revues, archives historiques).',
    url: 'https://www.cairn.info/',
    caveat: 'La qualité dépend de chaque revue, pas de la plateforme.',
    tags: ['francophone']
  },
  {
    id: 'hal-theses',
    name: 'HAL / theses.fr',
    layer: 'platform',
    scope: 'france',
    role: 'Archive ouverte et thèses soutenues en France.',
    url: 'https://hal.science/',
    caveat: 'Mélange preprints, articles déposés, thèses — filtrer le statut.',
    tags: ['ouvert']
  },
  {
    id: 'pubpsych',
    name: 'PubPsych',
    layer: 'platform',
    scope: 'international',
    role: 'Portail européen spécialisé psychologie / psychiatrie.',
    url: 'https://www.pubpsych.eu/',
    caveat: 'Complémentaire, pas un substitut à PsycInfo.',
    tags: ['europe']
  },
  {
    id: 'sfp',
    name: 'Société Française de Psychologie',
    layer: 'professional',
    scope: 'france',
    role: 'Société savante historique (1901) — vie scientifique, branches.',
    url: 'https://www.sfpsy.org/',
    caveat: 'Organisation, pas base d’articles.',
    tags: ['france']
  },
  {
    id: 'ffpp',
    name: 'FFPP + code de déontologie',
    layer: 'professional',
    scope: 'france',
    role: 'Exercice professionnel et déontologie. Distinguer code professionnel et droit opposable (Légifrance).',
    url: 'https://ffpp.net/',
    caveat: 'Le code n’est pas automatiquement une norme légale.',
    tags: ['deontologie']
  },
  {
    id: 'psycom',
    name: 'Psycom',
    layer: 'public',
    scope: 'france',
    role: 'Information publique et lutte contre la stigmatisation.',
    url: 'https://www.psycom.org/',
    caveat: 'Psychoéducation, pas source primaire de recherche.',
    tags: ['grand-public']
  },
  {
    id: 'rome',
    name: 'France Travail — ROME',
    layer: 'normative',
    scope: 'france',
    role: 'Métiers, activités, compétences, formations — déjà dans le moteur Cognitorium.',
    url: 'https://www.francetravail.fr/',
    caveat: 'Référentiel métier, pas une théorie psychologique.',
    tags: ['competences', 'orientation']
  }
];

export const KEY_JOURNALS: { field: string; titles: string[] }[] = [
  {
    field: 'Généraliste & méthodes',
    titles: [
      'Annual Review of Psychology',
      'Psychological Bulletin',
      'Psychological Review',
      'Perspectives on Psychological Science',
      'Advances in Methods and Practices in Psychological Science',
      'Nature Reviews Psychology',
      'American Psychologist'
    ]
  },
  {
    field: 'Cognition & neurosciences',
    titles: [
      'Cognitive Psychology',
      'Journal of Experimental Psychology: General',
      'Psychological Science',
      'Cognition',
      'Memory & Cognition',
      'Trends in Cognitive Sciences',
      'Journal of Cognitive Neuroscience',
      'L’Année psychologique'
    ]
  },
  {
    field: 'Développement & éducation',
    titles: [
      'Developmental Psychology',
      'Child Development',
      'Journal of Educational Psychology',
      'Educational Psychologist',
      'Learning and Instruction',
      'L’Orientation scolaire et professionnelle'
    ]
  },
  {
    field: 'Sociale, personnalité, travail',
    titles: [
      'Journal of Personality and Social Psychology',
      'Personality and Social Psychology Review',
      'Journal of Applied Psychology',
      'Personnel Psychology',
      'European Journal of Work and Organizational Psychology'
    ]
  },
  {
    field: 'Clinique & santé',
    titles: [
      'Clinical Psychology Review',
      'Journal of Consulting and Clinical Psychology',
      'World Psychiatry',
      'The Lancet Psychiatry',
      'Annales Médico-Psychologiques',
      'Revue de neuropsychologie'
    ]
  }
];

export const PSYREF_NOTES = {
  version: '0.1.0',
  dated: '2026-08-25',
  principle:
    'Classer les sources par fonction, jamais au même niveau. Une plateforme n’est pas une preuve ; un code de déontologie n’est pas une loi ; CIM/DSM ne sont pas toute la psychologie.',
  icdVsDsm: [
    'Éditeur : OMS (CIM) vs American Psychiatric Association (DSM) — pas l’APA psychologues.',
    'Portée : CIM = toutes les maladies, usage statistique/légal mondial ; DSM = troubles mentaux, usage clinique/recherche surtout nord-américain.',
    'CIM-11 : descriptions + CDDR 2024 ; davantage dimensionnelle sur certains ensembles.',
    'Dans Cognitorium : CIM/DSM uniquement pour le versant clinique. Atlas des processus = APA Divisions + littérature. Insertion = ROME.'
  ],
  icdApi: [
    'API officielle : ICD-11 API (icd.who.int/icdapi) — OAuth2, inscription OMS obligatoire.',
    'Endpoints : recherche, entité, linéarisation MMS, multi-langue (dont fr).',
    'Ne pas scraper browse.who.int. Versionner le release (ex. 2024-01) dans Référence.',
    'CIF : pas la même API ; ICF Browser / fichiers de référence OMS.'
  ],
  ux: [
    'Embodiment : actions (glisser un nœud, jouer un poster) = métaphores de processus, pas de décor.',
    'Métacognition : confiance et incertitude visibles avant toute reco IA.',
    'Source monitoring : chaque assertion porte sa couche (norme / synthèse / primaire / hypothèse).',
    'Stroop / charge : ne jamais faire porter couleur, icône et libellé des messages contradictoires.'
  ],
  limits: [
    'Pas de liste exhaustive : millions de publications.',
    'Citations ≈ influence, pas vérité.',
    'Réplication et pre-registration à privilégier (AMPS, Psych Science).',
    'Conflits d’intérêts, échantillons WEIRD, validité écologique des démos navigateur.',
    'Niveau 5 (conclusion psychologique individuelle) jamais auto-déduit.'
  ],
  versioning: [
    'Référence — version sémantique : MAJOR rupture de schéma, MINOR ajout de sources/paradigmes, PATCH corrections.',
    'Chaque fiche : id stable, validFrom, validTo, supersededBy.',
    'Snapshots datés des XLSX ROME et du release CIM-11.',
    'Changelog humain : ce qui a changé, pourquoi, quelle couche de preuve.'
  ]
};

export const LAYER_LABEL: Record<SourceLayer, string> = {
  normative: 'Norme',
  synthesis: 'Synthèse',
  primary: 'Primaire',
  professional: 'Professionnel',
  platform: 'Plateforme',
  public: 'Public'
};
