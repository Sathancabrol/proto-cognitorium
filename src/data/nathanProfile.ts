import { CognitiveProfile } from '../types';

// ============================================================================
// PROFIL 1 : NÄTHAN CABROL (Master Sciences Cognitives & VRD / Génie Civil)
// Restructuration intégrale selon la taxonomie Cognitorium :
// Identité -> Formations -> Recherches -> Expériences -> Compétences -> Capacités -> Horizons
// ============================================================================
export const NATHAN_PROFILE: CognitiveProfile = {
  id: 'profile-nathan-cabrol',
  personName: 'Näthan Cabrol, MS',
  headline: 'Expert Sciences Cognitives (Master 2) & Conduite de Travaux / Génie Civil (VRD)',
  coreMotto: 'L’alliance de la rigueur expérimentale des sciences cognitives et du pragmatisme opérationnel du terrain.',
  location: 'Frontignan (34110) • Occitanie',
  email: 'nathancabrol@hotmail.fr',
  journeyType: 'professional',
  currentSimulationYear: 2026,
  
  riasec: {
    social: 76,
    investigatif: 69,
    conventionnel: 63,
    entreprenant: 53,
    artistique: 44,
    realiste: 43,
    code: 'SIC',
    dominantSummary: 'Profil Social-Investigateur-Conventionnel : Alliance d\'une grande humanité et écoute (S: 76%), d\'une curiosité scientifique et esprit d\'analyse rigoureux (I: 69%) et du goût pour les structures fiables et méthodiques (C: 63%).'
  },

  matchMetiers: {
    workLifeBalance: 100,
    socialImpact: 73,
    remuneration: 50,
    collaborationScore: 100,
    adaptabilityScore: 70,
    agileOrgScore: 76,
    managerRoleScore: 66,
    topActivities: [
      { name: 'Échanger & Transmettre', score: 85, stars: 5 },
      { name: 'Encadrer & Fédérer', score: 80, stars: 5 },
      { name: 'Gérer & Coordonner', score: 70, stars: 4 },
      { name: 'Administrer & Structurer', score: 65, stars: 4 },
      { name: 'Argumenter & Débattre', score: 55, stars: 3 }
    ],
    recommendedRomeCodes: [
      {
        code: 'M1402',
        title: 'Ergonome Facteurs Humains & Mobilités',
        matchScore: 97,
        description: 'Conception cognitive des espaces de circulation, wayfinding, ergonomie physique et cognitive des systèmes de transport.'
      },
      {
        code: 'K2102',
        title: 'Coordinateur / Coordinatrice Pédagogique',
        matchScore: 96,
        description: 'Liaison entre apprenants, formateurs et programmes éducatifs. Conception de parcours et supervision pédagogique.'
      },
      {
        code: 'M1508',
        title: 'Conseiller en Gestion de Carrière & Talents (Bilans Cognitifs)',
        matchScore: 94,
        description: 'Évaluation des compétences, bilans de parcours, plans de formation continue et accompagnement du développement individuel.'
      },
      {
        code: 'M1805 / M1402',
        title: 'Chef de Projet R&D & UX Research Environnements Complexes',
        matchScore: 93,
        description: 'Conception de protocoles, passation d\'études utilisateurs et transfert de découvertes vers l\'ingénierie produit.'
      },
      {
        code: 'H1523',
        title: 'Responsable QSE & Facteurs Humains de Sécurité',
        matchScore: 90,
        description: 'Sécurité terrain, respect environnemental, facteurs humains et culture de prévention SST/AIPR.'
      }
    ]
  },

  cognitiveSignature: {
    dominantReasoning: 'Pensée Hybride : Expérimentation Scientifique & Pragmatique Terrain',
    transferabilityIndex: 95,
    learningVelocity: 'Exceptionnelle',
    adaptabilityIndex: 93,
    summaryText: 'Profil d\'une rare polyvalence combinant un bagage universitaire pointu en psychologie cognitive expérimentale (attention spatio-temporelle, eye-tracking, modélisation des biais, 4 projets de recherche) et une solide expérience opérationnelle de terrain dans les Travaux Publics / VRD (gestion de 4 équipes, sous-traitants, métrés, sécurité SST/AIPR, gestion logistique de dépôt). Exceptionnelle intelligence relationnelle (100% collaboration RIASEC), capacité éprouvée de transmission pédagogique (6 classes, 18 à 60 ans) et aisance remarquable dans le transfert de méthodes d\'un domaine à un autre.',
    keyStrengths: [
      'Contrôle adaptatif fondé sur les données (Hypothèse/Métré ➔ Mesure ➔ Écart ➔ Ajustement)',
      'Transfert intercontextuel (Laboratoire ➔ Recherche transports ➔ Chantiers VRD & Génie civil)',
      'Expertise spatiale & temporelle (Wayfinding, eye-tracking Tobii, modélisation des flux piétons)',
      'Chaîne expérimentale complète (Revue litt., protocoles, 220+ participants, stats R/JASP, restitution client)',
      'Pédagogie bienveillante & gestion d\'équipes intergénérationnelles (18 à 60 ans, ouvriers, étudiants)',
      'Régulation du stress et réactivité face aux aléas d\'infrastructure physique'
    ],
    codexInsights: [
      'Maîtrise des 4 quadrants du Codex : Surcharge d\'information, rétention mnésique, prise de décision rapide et comblement de sens.',
      'Neutralisation des biais de confirmation et d\'ancrage dans le diagnostic technique et la conception d\'outils.'
    ]
  },

  nodes: [
    // ========================================================================
    // 1. FORMATIONS & TRAJECTOIRE ACADÉMIQUE (Explicite)
    // ========================================================================
    {
      id: 'form-sti2d',
      name: 'Baccalauréat STI2D SIN (Systèmes d\'Information et Numérique)',
      category: 'formation',
      period: '2013',
      startYear: 2013,
      endYear: 2013,
      institutionOrContext: 'Lycée Polyvalent Paul Cézanne (Aix-en-Provence)',
      role: 'Bachelier Sciences et Technologies de l\'Industrie',
      description: 'Formation initiale technologique centrée sur les systèmes d\'information, les réseaux, la programmation embarquée et la modélisation numérique.',
      verificationStatus: 'verified',
      confidenceScore: 100,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-f1', source: 'diploma', label: 'Diplôme du Baccalauréat STI2D mention SIN', confidenceScore: 100, date: '2013' }
      ],
      missions: [
        'Analyse structurelle des flux d\'information et des architectures numériques',
        'Programmation logique, interfaçage matériel et capteurs',
        'Compréhension des systèmes technologiques complexes'
      ],
      cognitiveEfforts: [
        'Raisonnement algorithmique et logique booléenne',
        'Modélisation fonctionnelle et schématisation de circuits'
      ],
      x: 140,
      y: 80
    },
    {
      id: 'form-licence-psycho',
      name: 'Licence de Psychologie (Dynamiques Cognitives & Sociocognitives)',
      category: 'formation',
      period: '2013 – 2016',
      startYear: 2013,
      endYear: 2016,
      institutionOrContext: 'Université Paul Valéry 3 Montpellier',
      role: 'Étudiant en Psychologie & Sciences Cognitives',
      description: 'Acquisition des bases fondamentales en neurosciences, psychologie cognitive, psychologie sociale, épistémologie et statistiques inférentielles.',
      verificationStatus: 'verified',
      confidenceScore: 100,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-f2', source: 'diploma', label: 'Diplôme d\'État de Licence - Université Paul Valéry', confidenceScore: 100, date: '2016' }
      ],
      missions: [
        'Apprentissage des paradigmes de psychologie expérimentale et chronométrie mentale',
        'Statistiques descriptives et inférentielles appliquées aux sciences du comportement',
        'Initiation aux biais cognitifs et dynamiques de groupe'
      ],
      cognitiveEfforts: [
        'Assimilation des modèles théoriques de mémoire, d\'attention et de perception',
        'Développement de l\'esprit critique scientifique'
      ],
      x: 140,
      y: 200
    },
    {
      id: 'form-m1-cognition',
      name: 'Master 1 Sciences Cognitives & Psychologie Expérimentale',
      category: 'formation',
      period: '2016 – 2017',
      startYear: 2016,
      endYear: 2017,
      institutionOrContext: 'Université Paul Valéry 3 Montpellier',
      role: 'Étudiant Chercheur M1',
      description: 'Spécialisation dans les processus attentionnels, la conception expérimentale, la programmation de protocoles et la recherche documentaire approfondie.',
      verificationStatus: 'verified',
      confidenceScore: 100,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-f3', source: 'diploma', label: 'Relevé de notes et validation Master 1', confidenceScore: 100, date: '2017' }
      ],
      missions: [
        'Conception de tâches expérimentales informatisées sous E-Prime / OpenSesame',
        'Modélisation des distributions de temps de réaction et de précision',
        'Synthèse de littérature scientifique internationale en anglais'
      ],
      cognitiveEfforts: [
        'Opérationnalisation fine de variables psychologiques abstraites',
        'Rigueur de contrôle des variables parasites'
      ],
      x: 140,
      y: 320
    },
    {
      id: 'form-m2-cognition',
      name: 'Master 2 Évaluation du Fonctionnement Cognitif (Mention)',
      category: 'formation',
      period: '2017 – 2019',
      startYear: 2017,
      endYear: 2019,
      institutionOrContext: 'Université Paul Valéry 3 Montpellier',
      role: 'Étudiant Chercheur M2 (Dir. Pom Charras)',
      description: 'Diplômé avec mention. Spécialité évaluation du fonctionnement cognitif et des comportements en situation complexe. Travaux approfondis sur l\'attention spatio-temporelle, psychométrie et ergonomie cognitive.',
      verificationStatus: 'verified',
      confidenceScore: 100,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-f4', source: 'diploma', label: 'Diplôme d\'État de Master 2 - Université Paul Valéry', confidenceScore: 100, date: '2019' }
      ],
      missions: [
        'Direction de recherches en attention visuelle, spatiale et temporelle',
        'Création et étalonnage d\'outils psychométriques d\'évaluation',
        'Modélisation bayésienne et analyses multi-factorielles sous R et JASP'
      ],
      cognitiveEfforts: [
        'Formalisation de construits théoriques innovants',
        'Traitement statistique de données expérimentales massives'
      ],
      x: 140,
      y: 440
    },
    {
      id: 'form-conducteur-afpa',
      name: 'Formation Conducteur de Travaux TP / VRD & Habilitations',
      category: 'formation',
      period: '2022 – 2023',
      startYear: 2022,
      endYear: 2023,
      institutionOrContext: 'AFPA / SOCOTEC / FIRALP',
      role: 'Stagiaire Professionnel Conduite de Travaux',
      description: 'Formation qualifiante aux techniques de génie civil, réseaux secs/humides, voirie, métrés, gestion contractuelle, sécurité AIPR Encadrant et SST.',
      verificationStatus: 'verified',
      confidenceScore: 100,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-f5', source: 'diploma', label: 'Certifications AIPR Concepteur/Encadrant & SST', confidenceScore: 100, date: '2023' }
      ],
      missions: [
        'Lecture de plans d\'exécution, profils en long et en travers',
        'Implantation topographique au niveau laser et théodolite',
        'Sécurité réglementaire sur chantiers et prévention des risques d\'endommagement de réseaux'
      ],
      cognitiveEfforts: [
        'Projection spatiale 3D des réseaux souterrains',
        'Assimilation des normes et contraintes réglementaires BTP'
      ],
      x: 140,
      y: 560
    },

    // ========================================================================
    // 2. PROJETS DE RECHERCHE UNIVERSITAIRES (4 Projets Distincts)
    // ========================================================================
    {
      id: 'res-projet-m2-preference',
      name: 'Recherche M2 : Attention Spatiale & Temporelle - Une Préférence ?',
      category: 'research_project',
      period: '2018 – 2019',
      startYear: 2018,
      endYear: 2019,
      institutionOrContext: 'Laboratoire Epsylon / Université Paul Valéry 3 (Dir. Pom Charras)',
      role: 'Chercheur Principal (Mémoire M2)',
      description: 'Étude expérimentale visant à tester l\'existence d\'une priorité ou d\'une dissociation fonctionnelle entre le traitement attentionnel spatial (« où ») et temporel (« quand »).',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      metrics: {
        summaryVolume: 'Projet de recherche universitaire — volume à confirmer'
      },
      evidence: [
        { id: 'ev-r1', source: 'diploma', sourceDocument: 'cv_spécialisé_2020.pdf', label: 'Mémoire de recherche Master 2 soutenu avec mention', confidenceScore: 99, date: '2019' }
      ],
      missions: [
        'Conception expérimentale combinant indiçage spatial et temporal cueing',
        'Organisation des passations et contrôle des temps de réponse (volume à confirmer)',
        'Analyse comportementale et comparaison de profils (méthodes précises à confirmer)'
      ],
      cognitiveEfforts: [
        'Dissociation des mécanismes d\'inhibition et de facilitation attentionnelle',
        'Conception d\'un paradigme expérimental original'
      ],
      x: 140,
      y: 690
    },
    {
      id: 'res-projet-m1-outil-prep',
      name: 'Recherche M1 : Outil d\'Évaluation de la Préparation Temporelle',
      category: 'research_project',
      period: '2017 – 2018',
      startYear: 2017,
      endYear: 2018,
      institutionOrContext: 'Université Paul Valéry 3 (Dir. Pom Charras)',
      role: 'Concepteur & Chercheur (Mémoire M1)',
      description: 'Création d\'un outil informatisé innovant unifiant l\'évaluation de la préparation temporelle, réduisant la charge expérimentale tout en augmentant la validité écologique.',
      verificationStatus: 'verified',
      confidenceScore: 97,
      inferenceType: 'explicite',
      metrics: {
        summaryVolume: 'Outil logiciel expérimental d\'évaluation unifié'
      },
      evidence: [
        { id: 'ev-r2', source: 'diploma', sourceDocument: 'cv_spécialisé_2020.pdf', label: 'Mémoire de Master 1 validé', confidenceScore: 98, date: '2018' }
      ],
      missions: [
        'Formalisation du construit psychologique de la préparation temporelle',
        'Conception et programmation logicielle de la tâche informatisée',
        'Optimisation de protocole pour réduire la fatigue des sujets sans perte de puissance statistique'
      ],
      cognitiveEfforts: [
        'Ingénierie métrologique et ergonomie de passation',
        'Intégration multi-modalités sensorielles'
      ],
      x: 140,
      y: 810
    },
    {
      id: 'res-projet-jeux-video',
      name: 'Recherche : Pratique des Jeux Vidéo & Attention Visuelle',
      category: 'research_project',
      period: '2016 – 2017',
      startYear: 2016,
      endYear: 2017,
      institutionOrContext: 'Université Paul Valéry 3',
      role: 'Étudiant Chercheur',
      description: 'Étude des différences interindividuelles et de l\'effet de l\'expertise vidéoludique sur la dynamique d\'orientation et la flexibilité de l\'attention visuelle.',
      verificationStatus: 'verified',
      confidenceScore: 95,
      inferenceType: 'explicite',
      metrics: {
        summaryVolume: 'Étude comparative groupes experts vs non-joueurs'
      },
      evidence: [
        { id: 'ev-r3', source: 'project', sourceDocument: 'cv_spécialisé_2020.pdf', label: 'Rapport d\'étude de recherche universitaire', confidenceScore: 95, date: '2017' }
      ],
      missions: [
        'Constitution de cohortes selon les types de jeux (Action, FPS, Stratégie, Contrôles)',
        'Passation de tâches de détection de cibles sous distracteurs visuels',
        'Classification et comparaison de profils cognitifs'
      ],
      cognitiveEfforts: [
        'Analyse des transferts d\'apprentissage moteur et visuel',
        'Modélisation des facteurs de variabilité interindividuelle'
      ],
      x: 140,
      y: 930
    },
    {
      id: 'res-projet-endogene',
      name: 'Recherche : Orientation Endogène de l\'Attention Spatio-Temporelle',
      category: 'research_project',
      period: '2015 – 2016',
      startYear: 2015,
      endYear: 2016,
      institutionOrContext: 'Université Paul Valéry 3',
      role: 'Étudiant Chercheur',
      description: 'Investigation des processus volontaires (endogènes) d\'orientation du focus attentionnel dans les dimensions spatiales et temporelles.',
      verificationStatus: 'verified',
      confidenceScore: 94,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-r4', source: 'project', sourceDocument: 'cv_spécialisé_2020.pdf', label: 'Travail de recherche de Licence 3', confidenceScore: 94, date: '2016' }
      ],
      missions: [
        'Programmation de paradigmes d\'indiçage symbolique (flèches, repères contextuels)',
        'Mesure précise des asynchronies d\'apparition des cibles (SOA)',
        'Détermination des décours temporels d\'engagement et de désengagement attentionnel'
      ],
      cognitiveEfforts: [
        'Chronométrie mentale au milliseconde près',
        'Discernement entre composantes réflexes (exogènes) et contrôlées (endogènes)'
      ],
      x: 140,
      y: 1050
    },

    // ========================================================================
    // 3. EXPÉRIENCES PROFESSIONNELLES & TERRAINS (Explicite avec Volumes)
    // ========================================================================
    {
      id: 'exp-sncf',
      name: 'Recherche Cognition & Orientation en Gare (SNCF Innovation)',
      category: 'experience',
      period: 'Avril 2019 – Sept 2019',
      startYear: 2019,
      endYear: 2019,
      institutionOrContext: 'SNCF, Direction Innovation et Recherche (Paris)',
      role: 'Chercheur en Cognition Spatiale & Wayfinding',
      description: 'Projet « Orientation enrichie » sous la direction de Céline Durupt & Simone Morgagni. Étude de l\'utilisation des points de repères spatiaux lors de parcours en gare pour concevoir une catégorisation cognitive des repères et guider la signalétique.',
      verificationStatus: 'verified',
      confidenceScore: 99,
      inferenceType: 'explicite',
      metrics: {
        participantsCount: 160,
        experimentsCount: 3,
        durationMonths: 6,
        summaryVolume: '3 protocoles expérimentaux, 160 participants en gare'
      },
      evidence: [
        { id: 'ev-sncf-1', source: 'cv', sourceDocument: 'cv_spécialisé_2020.pdf', label: 'Rapport de recherche SNCF Innovation', confidenceScore: 99, date: '2019', volumeMetric: '160 participants, 3 expériences' },
        { id: 'ev-sncf-2', source: 'diploma', label: 'Validation stage Master 2 recherche', confidenceScore: 100, date: '2019' }
      ],
      missions: [
        'Conception et passation de 3 protocoles expérimentaux avec 160 participants',
        'Analyse des trajectoires piétonnes et points de fixation visuelle',
        'Rédaction de rapports de synthèse et préconisations pour le wayfinding et la signalétique ferroviaire',
        'Présentation des résultats devant les comités de direction de l\'innovation SNCF'
      ],
      detailedMissions: [
        {
          id: 'm-sncf-1',
          title: 'Conception expérimentale & passation de tests volumineux',
          actions: ['Recrutement et accueil de 160 participants', 'Paramétrage des scénarios de déplacement en gare', 'Passation standardisée'],
          cognitiveLoad: 'élevée'
        },
        {
          id: 'm-sncf-2',
          title: 'Analyse statistique et modélisation des points de repères',
          actions: ['Extraction des flux de regard', 'Traitement statistique ANOVA & Bayes sous R', 'Formalisation d\'une typologie de repères visuels'],
          cognitiveLoad: 'élevée'
        }
      ],
      cognitiveEfforts: [
        'Modélisation de la cognition spatiale et des représentations mentales urbaines',
        'Traitement statistique rigoureux de données volumineuses sous R et JASP',
        'Vulgarisation et transfert de notions scientifiques vers des recommandations design'
      ],
      x: 140,
      y: 1180
    },
    {
      id: 'exp-catie',
      name: 'Recherche Itinéraire en Milieu Clos & Eye-Tracking (CATIE)',
      category: 'experience',
      period: 'Mars 2018 – Sept 2018',
      startYear: 2018,
      endYear: 2018,
      institutionOrContext: 'Association CATIE (Bordeaux)',
      role: 'Chercheur Cognitif (Eye-Tracking & Itinéraire)',
      description: 'Projet « Cognition spatiale et optimisation de la recherche d\'itinéraire », sous la direction de Lisa Creno & Florian Larrue. Évaluation des stratégies de marche en milieu clos via eye-tracking.',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      metrics: {
        participantsCount: 60,
        experimentsCount: 3,
        durationMonths: 6,
        summaryVolume: '3 expériences, 60 participants, lunettes Tobii'
      },
      evidence: [
        { id: 'ev-catie-1', source: 'cv', sourceDocument: 'cv_spécialisé_2020.pdf', label: 'Stage M1 recherche CATIE', confidenceScore: 98, date: '2018', volumeMetric: '60 participants, 3 expériences' }
      ],
      missions: [
        'Revue de littérature approfondie en cognition spatiale et navigation intérieure',
        'Mise en place de 3 expériences avec 60 participants (mesures Tobii / OpenSesame)',
        'Formulation de recommandations d\'optimisation ergonomique pour les clients partenaires'
      ],
      detailedMissions: [
        {
          id: 'm-catie-1',
          title: 'Expérimentation eye-tracking Tobii Studio & Glasses',
          actions: ['Calibrage optique individuel', 'Enregistrement des fixations oculaires et saccades', 'Cartographie des zones d\'intérêt (AOI)'],
          cognitiveLoad: 'élevée'
        }
      ],
      cognitiveEfforts: [
        'Analyse fine de l\'attention visuelle et synchronisation tâche/mesure',
        'Interfaçage matériel eye-tracking et logiciels de psychologie expérimentale'
      ],
      x: 140,
      y: 1300
    },
    {
      id: 'exp-tutorat',
      name: 'Enseignant Tuteur & Représentant Étudiant (UM3)',
      category: 'experience',
      period: '2017 – 2019',
      startYear: 2017,
      endYear: 2019,
      institutionOrContext: 'Université Paul Valéry 3 Montpellier',
      role: 'Enseignant Tuteur & Élu UFR 5',
      description: 'Encadrement et animation pédagogique de 6 classes d\'une trentaine d\'étudiants (âgés de 18 à 60 ans en formation initiale et reprise d\'études). Représentation étudiante sur les commissions projet-budget.',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      metrics: {
        classesCount: 6,
        studentsCount: 180,
        summaryVolume: '6 classes de ~30 étudiants (18 à 60 ans)'
      },
      evidence: [
        { id: 'ev-tut-1', source: 'cv', sourceDocument: 'cv_spécialisé_2020.pdf', label: 'Contrats de tutorat universitaire UM3 (2 années)', confidenceScore: 99, date: '2019', volumeMetric: '6 classes, 18-60 ans' },
        { id: 'ev-tut-2', source: 'declaration', label: 'Procès-verbal d\'élection UFR 5', confidenceScore: 97, date: '2018' }
      ],
      missions: [
        'Vulgarisation scientifique, soutien méthodologique et aide à la rédaction',
        'Adaptation continue du discours pédagogique à des profils intergénérationnels très variés',
        'Participation active aux réunions de gouvernance budgétaire et amélioration des maquettes d\'enseignement'
      ],
      cognitiveEfforts: [
        'Pédagogie active, régulation de dynamiques de groupe et désamorçage de l\'anxiété',
        'Médiation institutionnelle et diplomatie collégiale'
      ],
      x: 140,
      y: 1420
    },
    {
      id: 'exp-sobeca',
      name: 'Conduite de Travaux Réseau Sec & TP (SOBECA)',
      category: 'experience',
      period: '2023 – 2024',
      startYear: 2023,
      endYear: 2024,
      institutionOrContext: 'SOBECA – Groupe FIRALP (Toulouse)',
      role: 'Aide Conducteur de Travaux / Chef de Chantier',
      description: 'Supervision de chantiers Réseau sec & Génie Civil. Encadrement de 4 équipes et sous-traitants. Préparation, suivi et clôture de chantiers sous strictes exigences de sécurité.',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      metrics: {
        teamsCount: 4,
        summaryVolume: '4 équipes directes + sous-traitants, gestion d\'un dépôt annexe'
      },
      evidence: [
        { id: 'ev-sob-1', source: 'cv', sourceDocument: 'cv 2024 (1).pdf', label: 'Contrat Conducteur de Travaux SOBECA', confidenceScore: 98, date: '2024', volumeMetric: '4 équipes, gestion dépôt annexe' },
        { id: 'ev-sob-2', source: 'diploma', label: 'Habilitations AIPR Encadrant & SST à jour', confidenceScore: 100, date: '2024' }
      ],
      missions: [
        'Planification opérationnelle, métrés et suivi des cadences de pose',
        'Accueil chantier, causeries sécurité, respect des protocoles SST & AIPR',
        'Interface clients (collectivités, concessionnaires Enedis/GrDF), riverains et fournisseurs',
        'Gestion logistique complète du dépôt annexe (matériaux, outillage, engins)'
      ],
      detailedMissions: [
        {
          id: 'm-sobeca-1',
          title: 'Pilotage opérationnel de chantiers VRD & réseaux secs',
          actions: ['Métrés sur site', 'Ordonnancement des engins', 'Suivi des cadences de terrassement'],
          cognitiveLoad: 'élevée'
        },
        {
          id: 'm-sobeca-2',
          title: 'Sécurité terrain et conformité réglementaire DICT',
          actions: ['Animation des causeries sécurité', 'Contrôle du respect des plans DICT', 'Audit SST'],
          cognitiveLoad: 'modérée'
        }
      ],
      cognitiveEfforts: [
        'Coordination multi-acteurs sous forte contrainte temporelle',
        'Prise de décision rapide face aux aléas de voirie et de terrassement',
        'Transposition de la rigueur d\'analyse vers la rentabilité et la conformité de chantier'
      ],
      x: 140,
      y: 1540
    },
    {
      id: 'exp-colas',
      name: 'Ouvrier VRD Polyvalent & Implantation (COLAS)',
      category: 'experience',
      period: '2022',
      startYear: 2022,
      endYear: 2022,
      institutionOrContext: 'COLAS (Montpellier)',
      role: 'Ouvrier VRD & Implantation',
      description: 'Pose de bordures, pavés, caniveaux, réseaux humides et secs. Lecture de plans de terrassement et utilisation de niveaux laser.',
      verificationStatus: 'verified',
      confidenceScore: 96,
      inferenceType: 'explicite',
      metrics: {
        summaryVolume: 'Chantiers de voirie urbaine et réseaux d\'aménagement'
      },
      evidence: [
        { id: 'ev-col-1', source: 'cv', sourceDocument: 'cv 2024 (1).pdf', label: 'Expérience terrain ouvrier TP COLAS', confidenceScore: 96, date: '2022' }
      ],
      missions: [
        'Implantation altimétrique au niveau laser et théodolite',
        'Terrassement et pose de réseaux sous contrainte stricte de pente',
        'Entraide et esprit d\'équipe sur site en environnement exigeant'
      ],
      cognitiveEfforts: [
        'Visualisation dans l\'espace des cotes de pente et d\'écoulement gravitaire',
        'Endurance physique et rigueur d\'exécution géométrique'
      ],
      x: 140,
      y: 1660
    },

    // ========================================================================
    // 4. TÂCHES : niveau intermédiaire entre vécu et compétences
    // Les formulations ci-dessous restent volontairement proches des CV.
    // ========================================================================
    {
      id: 'task-sncf-protocoles',
      name: 'Concevoir et conduire les protocoles d’orientation en gare',
      category: 'task',
      experienceId: 'exp-sncf',
      context: 'SNCF Innovation — projet Orientation enrichie',
      actions: ['Préparer trois protocoles', 'Organiser les passations', 'Recueillir les données de 160 participants'],
      skillsProduced: ['skill-metho-experimentale', 'skill-gestion-participants', 'skill-cognition-spatiale'],
      description: 'Mission explicitement documentée par le CV recherche ; les modalités fines de recrutement restent à confirmer.',
      verificationStatus: 'verified',
      confidenceScore: 99,
      inferenceType: 'explicite',
      evidence: [{ id: 'ev-task-sncf-1', source: 'cv', sourceDocument: 'cv_spécialisé_2020.pdf', label: 'CV spécialisé — SNCF : 3 expériences, 160 participants', confidenceScore: 99, date: '2019', volumeMetric: '3 expériences, 160 participants' }]
    },
    {
      id: 'task-sncf-restitution',
      name: 'Analyser les parcours et restituer des recommandations',
      category: 'task',
      experienceId: 'exp-sncf',
      context: 'SNCF Innovation — cognition spatiale et wayfinding',
      actions: ['Analyser les données comportementales', 'Synthétiser les résultats', 'Formuler des pistes pour l’orientation des voyageurs'],
      skillsProduced: ['skill-stats-r-jasp', 'skill-traduction-recherche-reco', 'skill-relation-client-rd'],
      description: 'La chaîne analyse–restitution est explicite ; le niveau exact d’autonomie et les destinataires doivent être confirmés.',
      verificationStatus: 'pending',
      confidenceScore: 88,
      inferenceType: 'inference_forte',
      evidence: [{ id: 'ev-task-sncf-2', source: 'cv', sourceDocument: 'cv_spécialisé_2020.pdf', label: 'CV spécialisé — travaux SNCF sur les repères spatiaux', confidenceScore: 92, date: '2019' }]
    },
    {
      id: 'task-catie-etat-art',
      name: 'Établir l’état de l’art en cognition spatiale',
      category: 'task',
      experienceId: 'exp-catie',
      context: 'CATIE — recherche d’itinéraire en milieu clos',
      actions: ['Rechercher la littérature', 'Analyser les facteurs d’influence', 'Synthétiser les résultats utiles au projet'],
      skillsProduced: ['skill-revue-litterature', 'skill-analyse-besoins'],
      description: 'Revue de littérature explicitement mentionnée dans le CV spécialisé.',
      verificationStatus: 'verified',
      confidenceScore: 99,
      inferenceType: 'explicite',
      evidence: [{ id: 'ev-task-catie-1', source: 'cv', sourceDocument: 'cv_spécialisé_2020.pdf', label: 'CV spécialisé — revue de littérature CATIE', confidenceScore: 99, date: '2018' }]
    },
    {
      id: 'task-catie-experimentation',
      name: 'Évaluer les stratégies de marche par expérimentation',
      category: 'task',
      experienceId: 'exp-catie',
      context: 'CATIE — protocoles avec instrumentation eye-tracking',
      actions: ['Mettre en œuvre trois expériences', 'Conduire les passations auprès de 60 participants', 'Exploiter les mesures instrumentées'],
      skillsProduced: ['skill-eye-tracking', 'skill-gestion-participants', 'skill-metho-experimentale'],
      description: 'Volumes et instrumentation issus du CV ; les traitements techniques détaillés sont à confirmer.',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [{ id: 'ev-task-catie-2', source: 'cv', sourceDocument: 'cv_spécialisé_2020.pdf', label: 'CV spécialisé — CATIE : 3 expériences, 60 participants', confidenceScore: 98, date: '2018', volumeMetric: '3 expériences, 60 participants' }]
    },
    {
      id: 'task-tutorat-transmission',
      name: 'Accompagner des groupes d’étudiants hétérogènes',
      category: 'task',
      experienceId: 'exp-tutorat',
      context: 'Université Paul Valéry — tutorat',
      actions: ['Animer six classes', 'Adapter les explications aux publics de 18 à 60 ans', 'Soutenir la méthodologie universitaire'],
      skillsProduced: ['skill-pedagogie', 'skill-collaboration-ecoute', 'skill-encadrement-equipes'],
      description: 'Mission documentée par les volumes déclarés dans les CV.',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [{ id: 'ev-task-tutorat-1', source: 'cv', sourceDocument: 'cv_spécialisé_2020.pdf', label: 'CV — tutorat de 6 classes d’environ 30 étudiants', confidenceScore: 98, date: '2017–2019', volumeMetric: '6 classes, publics de 18 à 60 ans' }]
    },
    {
      id: 'task-sobeca-pilotage',
      name: 'Préparer et suivre les chantiers de réseaux secs',
      category: 'task',
      experienceId: 'exp-sobeca',
      context: 'SOBECA — travaux publics et génie civil',
      actions: ['Réaliser ou vérifier les métrés', 'Suivre planning et budget', 'Coordonner quatre équipes et les sous-traitants'],
      skillsProduced: ['skill-gestion-financiere-contrat', 'skill-encadrement-equipes', 'skill-controle-operationnel'],
      description: 'Mission explicitement soutenue par le CV professionnel BTP.',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [{ id: 'ev-task-sobeca-1', source: 'cv', sourceDocument: 'cv 2024 (1).pdf', label: 'CV professionnel — SOBECA, 4 équipes et sous-traitants', confidenceScore: 98, date: '2023–2024', volumeMetric: '4 équipes + sous-traitants' }]
    },
    {
      id: 'task-sobeca-securite',
      name: 'Assurer la sécurité et la logistique du chantier',
      category: 'task',
      experienceId: 'exp-sobeca',
      context: 'SOBECA — chantier et dépôt annexe',
      actions: ['Contrôler les exigences de sécurité', 'Organiser les ressources du dépôt', 'Ajuster l’activité aux aléas terrain'],
      skillsProduced: ['skill-securite-sst', 'skill-gestion-financiere-contrat', 'skill-controle-operationnel'],
      description: 'Sécurité et gestion du dépôt sont explicites ; la portée des arbitrages reste à valider.',
      verificationStatus: 'pending',
      confidenceScore: 91,
      inferenceType: 'inference_forte',
      evidence: [{ id: 'ev-task-sobeca-2', source: 'cv', sourceDocument: 'cv 2024 (1).pdf', label: 'CV professionnel — sécurité et gestion d’un dépôt annexe', confidenceScore: 96, date: '2023–2024' }]
    },
    {
      id: 'task-colas-controle',
      name: 'Implanter et contrôler les ouvrages VRD',
      category: 'task',
      experienceId: 'exp-colas',
      context: 'COLAS — chantier VRD',
      actions: ['Lire les plans et les cotes', 'Utiliser les instruments de mesure', 'Contrôler puis ajuster l’implantation'],
      skillsProduced: ['skill-controle-operationnel', 'skill-cognition-spatiale'],
      description: 'La pratique VRD est explicite ; la formulation en boucle de contrôle est une inférence à confirmer.',
      verificationStatus: 'pending',
      confidenceScore: 89,
      inferenceType: 'inference_forte',
      evidence: [{ id: 'ev-task-colas-1', source: 'cv', sourceDocument: 'cv 2024 (1).pdf', label: 'CV professionnel — expérience terrain COLAS', confidenceScore: 95, date: '2022' }]
    },

    // ========================================================================
    // 5. COMPÉTENCES (SKILLS) : MÉTHODOLOGIE, RECHERCHE, GESTION, HUMAIN
    // ========================================================================
    {
      id: 'skill-metho-experimentale',
      name: 'Méthodologie Expérimentale & Protocoles Scientifiques',
      category: 'skill_tech',
      baseMastery: 96,
      acquiredYear: 2016,
      lastPracticedYear: 2019,
      halfLifeYears: 8,
      decayFactor: 0.05,
      transferabilityScore: 9.8,
      verificationStatus: 'verified',
      confidenceScore: 99,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-sk-metho', source: 'cv', label: 'Chaîne expérimentale complète validée sur 4 projets de recherche + SNCF/CATIE', confidenceScore: 99, date: '2019' }
      ],
      description: 'Maîtrise complète de la démarche scientifique : formulation de problématique, hypothèses opérationnelles, création de protocoles, recueil, traitement statistique et interprétation.',
      subSkills: ['Opérationnalisation de variables', 'Contrôle des biais expérimentaux', 'Standardisation des consignes', 'Plans factoriels'],
      originExperienceIds: ['form-m2-cognition', 'res-projet-m2-preference', 'exp-sncf', 'exp-catie'],
      connectedCapacityIds: ['cap-conception-methodo', 'cap-controle-adaptatif', 'cap-rigueur-scientifique'],
      x: 440,
      y: 100
    },
    {
      id: 'skill-gestion-participants',
      name: 'Gestion de Participants & Cohortes Expérimentales (220+)',
      category: 'skill_tech',
      baseMastery: 94,
      acquiredYear: 2017,
      lastPracticedYear: 2024,
      halfLifeYears: 7,
      decayFactor: 0.08,
      transferabilityScore: 9.2,
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-sk-part', source: 'cv', label: '160 participants SNCF + 60 participants CATIE + passations M2', confidenceScore: 98, date: '2019', volumeMetric: '220+ participants cumulés' }
      ],
      description: 'Recrutement, accueil, passation éthique, calibrage et gestion de volumétries importantes de sujets expérimentaux sous contraintes opérationnelles.',
      subSkills: ['Recrutement ciblé', 'Gestion du consentement éthique', 'Standardisation de passation', 'Réduction de l\'anxiété de test'],
      originExperienceIds: ['exp-sncf', 'exp-catie', 'res-projet-m2-preference'],
      connectedCapacityIds: ['cap-mediation-multi-publics', 'cap-conception-methodo'],
      x: 440,
      y: 220
    },
    {
      id: 'skill-revue-litterature',
      name: 'Recherche Bibliographique & État de l\'Art Scientifique',
      category: 'skill_tech',
      baseMastery: 92,
      acquiredYear: 2015,
      lastPracticedYear: 2019,
      halfLifeYears: 8,
      decayFactor: 0.06,
      transferabilityScore: 9.5,
      verificationStatus: 'verified',
      confidenceScore: 97,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-sk-rev', source: 'diploma', label: 'Revues de littérature de 4 mémoires universitaires et rapports R&D', confidenceScore: 97, date: '2019' }
      ],
      description: 'Exploitation des bases documentaires scientifiques internationales (ScienceDirect, PubMed, Google Scholar), analyse critique d\'articles et synthèse des facteurs d\'influence.',
      subSkills: ['Veille scientifique internationale', 'Analyse critique méthodologique', 'Synthèse thématique', 'Mapping conceptuel'],
      originExperienceIds: ['form-m1-cognition', 'form-m2-cognition', 'exp-catie', 'exp-sncf'],
      connectedCapacityIds: ['cap-rigueur-scientifique', 'cap-analyse-systemique'],
      x: 440,
      y: 340
    },
    {
      id: 'skill-traduction-recherche-reco',
      name: 'Traduction Recherche ➔ Recommandations Opérationnelles',
      category: 'skill_transversal',
      baseMastery: 95,
      acquiredYear: 2018,
      lastPracticedYear: 2019,
      halfLifeYears: 9,
      decayFactor: 0.04,
      transferabilityScore: 10,
      verificationStatus: 'pending',
      confidenceScore: 98,
      inferenceType: 'inference_forte',
      evidence: [
        { id: 'ev-sk-trad', source: 'project', label: 'Livrables de préconisations signalétiques SNCF et ergonomiques CATIE', confidenceScore: 98, date: '2019' }
      ],
      description: 'Capacité clé à convertir des résultats statistiques bruts et des observations comportementales en leviers d\'action concrets, lisibles et directement exploitables par des décideurs.',
      subSkills: ['Vulgarisation des données', 'Rédaction de préconisations actionnables', 'Synthèse pour comités de direction', 'Design cognitif'],
      originExperienceIds: ['exp-sncf', 'exp-catie'],
      connectedCapacityIds: ['cap-traduction-action', 'cap-transfert-intercontextuel'],
      x: 440,
      y: 460
    },
    {
      id: 'skill-relation-client-rd',
      name: 'Gestion de Relation Client R&D / Commanditaire',
      category: 'skill_relational',
      baseMastery: 90,
      acquiredYear: 2018,
      lastPracticedYear: 2019,
      halfLifeYears: 7,
      decayFactor: 0.08,
      transferabilityScore: 9.3,
      verificationStatus: 'verified',
      confidenceScore: 96,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-sk-rd-client', source: 'cv', label: 'Interactions partenaires R&D SNCF Innovation et industriels CATIE', confidenceScore: 96, date: '2019' }
      ],
      description: 'Cadrage des besoins du commanditaire, suivi d\'avancement, restitution pédagogique des livrables et gestion des retours clients.',
      subSkills: ['Cadrage de besoin R&D', 'Communication de projet', 'Présentation orale de livrables', 'Écoute active client'],
      originExperienceIds: ['exp-sncf', 'exp-catie'],
      connectedCapacityIds: ['cap-mediation-multi-publics', 'cap-traduction-action'],
      x: 440,
      y: 580
    },
    {
      id: 'skill-analyse-besoins',
      name: 'Analyse des Besoins Multi-Contextuelle (Recherche & Terrain)',
      category: 'skill_transversal',
      baseMastery: 93,
      acquiredYear: 2017,
      lastPracticedYear: 2024,
      halfLifeYears: 10,
      decayFactor: 0.03,
      transferabilityScore: 9.7,
      verificationStatus: 'pending',
      confidenceScore: 97,
      inferenceType: 'inference_forte',
      evidence: [
        { id: 'ev-sk-besoins', source: 'declaration', label: 'Croisement analyse des besoins piétons en gare et besoins opérationnels de chantier', confidenceScore: 97 }
      ],
      description: 'Aptitude à identifier les besoins explicites et implicites des utilisateurs, des usagers d\'espaces publics ou des équipes terrain, et à les formaliser en exigences techniques.',
      subSkills: ['Audit de besoins usagers', 'Observation in situ', 'Diagnostic organisationnel', 'Spécifications fonctionnelles'],
      originExperienceIds: ['exp-sncf', 'exp-sobeca', 'exp-tutorat'],
      connectedCapacityIds: ['cap-analyse-systemique', 'cap-transfert-intercontextuel'],
      x: 440,
      y: 700
    },
    {
      id: 'skill-gestion-financiere-contrat',
      name: 'Gestion Contractuelle, Métrés & Logistique de Dépôt',
      category: 'skill_tech',
      baseMastery: 88,
      acquiredYear: 2022,
      lastPracticedYear: 2024,
      halfLifeYears: 6,
      decayFactor: 0.12,
      transferabilityScore: 8.6,
      verificationStatus: 'verified',
      confidenceScore: 96,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-sk-ges', source: 'cv', label: 'Conduite de chantiers SOBECA : métrés, sous-traitance et dépôt annexe', confidenceScore: 96, date: '2024' }
      ],
      description: 'Métrés quantitatifs, suivi des cadences de sous-traitance, vérification de conformité contractuelle et gestion logistique des flux de matériel d\'un dépôt annexe.',
      subSkills: ['Métrés contradictoires', 'Contrôle sous-traitants', 'Gestion de stocks & outillage', 'Planning Gantt opérationnel'],
      originExperienceIds: ['exp-sobeca', 'form-conducteur-afpa'],
      connectedCapacityIds: ['cap-controle-adaptatif', 'cap-arbitrage-stress'],
      x: 440,
      y: 820
    },
    {
      id: 'skill-encadrement-equipes',
      name: 'Encadrement d\'Équipes & Animation de Collectifs',
      category: 'skill_relational',
      baseMastery: 95,
      acquiredYear: 2017,
      lastPracticedYear: 2024,
      halfLifeYears: 10,
      decayFactor: 0.04,
      transferabilityScore: 9.6,
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-sk-encadre', source: 'cv', label: 'Encadrement de 4 équipes travaux SOBECA et animation de 6 classes universitaires', confidenceScore: 98, date: '2024' }
      ],
      description: 'Capacité prouvée à fédérer, motiver et encadrer des collectifs hétérogènes (ouvriers TP, sous-traitants, étudiants de 18 à 60 ans), instaurer un climat de confiance et réguler les tensions.',
      subSkills: ['Management bienveillant', 'Causeries & briefings', 'Animation de groupe', 'Gestion de conflits'],
      originExperienceIds: ['exp-sobeca', 'exp-tutorat'],
      connectedCapacityIds: ['cap-mediation-multi-publics', 'cap-coordination-humaine'],
      x: 440,
      y: 940
    },
    {
      id: 'skill-controle-operationnel',
      name: 'Contrôle & Vérification Opérationnelle (Boucle d\'Écart)',
      category: 'skill_tech',
      baseMastery: 94,
      acquiredYear: 2022,
      lastPracticedYear: 2024,
      halfLifeYears: 6.5,
      decayFactor: 0.09,
      transferabilityScore: 9.4,
      verificationStatus: 'pending',
      confidenceScore: 97,
      inferenceType: 'inference_forte',
      evidence: [
        { id: 'ev-sk-ctrl', source: 'cv', label: 'Implantation laser COLAS, métrés SOBECA et contrôle d\'hypothèses expérimentales', confidenceScore: 97, date: '2024' }
      ],
      description: 'Mise en œuvre systématique d\'une boucle de contrôle : Spécification/Métré ➔ Mesure in situ ➔ Détection d\'écart ➔ Ajustement correctif ➔ Validation finale.',
      subSkills: ['Implantation altimétrique laser', 'Détection d\'anomalies', 'Ajustement itératif', 'Contrôle qualité conformité'],
      originExperienceIds: ['exp-colas', 'exp-sobeca', 'form-conducteur-afpa'],
      connectedCapacityIds: ['cap-controle-adaptatif', 'cap-rigueur-scientifique'],
      x: 440,
      y: 1060
    },
    {
      id: 'skill-cognition-spatiale',
      name: 'Cognition Spatiale & Modélisation Wayfinding',
      category: 'skill_tech',
      baseMastery: 96,
      acquiredYear: 2017,
      lastPracticedYear: 2019,
      halfLifeYears: 8,
      decayFactor: 0.05,
      transferabilityScore: 9.5,
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-s1', source: 'diploma', label: 'Publications & Mémoires M1/M2, projets SNCF & CATIE', confidenceScore: 98, date: '2019' }
      ],
      description: 'Compréhension et modélisation de la façon dont l\'esprit humain perçoit, encode et navigue dans les espaces 2D/3D (repères visuels, points de choix, cartes cognitives, orientation piétonne).',
      subSkills: ['Wayfinding ferroviaire & urbain', 'Cartographie mentale', 'Points de repères saillants', 'Signalétique cognitive'],
      originExperienceIds: ['exp-sncf', 'exp-catie', 'res-projet-m2-preference'],
      connectedCapacityIds: ['cap-spatial-syst', 'cap-transfert-intercontextuel'],
      x: 440,
      y: 1180
    },
    {
      id: 'skill-eye-tracking',
      name: 'Eye-Tracking & Chronométrie Attentionnelle (Tobii / OpenSesame)',
      category: 'skill_tech',
      baseMastery: 91,
      acquiredYear: 2017,
      lastPracticedYear: 2020,
      halfLifeYears: 5,
      decayFactor: 0.3,
      transferabilityScore: 8.5,
      verificationStatus: 'verified',
      confidenceScore: 94,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-s2', source: 'project', label: 'Protocoles CATIE & SNCF Tobii Glass, OpenSesame, E-Prime', confidenceScore: 94, date: '2019' }
      ],
      description: 'Mise en œuvre d\'équipements de suivi du regard (Tobii Studio/Glasses), extraction des fixations, saccades, cartes de chaleur, chronométrie au milliseconde et zones d\'intérêt (AOI).',
      subSkills: ['Calibration optique Tobii', 'Cartes de chaleur AOI', 'Synchronisation temporelle', 'Filtrage de bruit oculaire'],
      originExperienceIds: ['exp-catie', 'form-m1-cognition'],
      connectedCapacityIds: ['cap-spatial-syst', 'cap-conception-methodo'],
      x: 440,
      y: 1300
    },
    {
      id: 'skill-stats-r-jasp',
      name: 'Statistiques Expérimentales & Logiciels (R, JASP)',
      category: 'skill_tech',
      baseMastery: 90,
      acquiredYear: 2016,
      lastPracticedYear: 2019,
      halfLifeYears: 6,
      decayFactor: 0.15,
      transferabilityScore: 9.2,
      verificationStatus: 'verified',
      confidenceScore: 96,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-s3', source: 'diploma', label: 'Traitement de données 160 sujets SNCF et mémoires sous R et JASP', confidenceScore: 96, date: '2019' }
      ],
      description: 'Analyses de variance (ANOVA), régressions, statistiques bayésiennes sur JASP et scripts d\'automatisation de traitement de données sous R.',
      subSkills: ['ANOVA multi-facteurs', 'Statistiques Bayésiennes (JASP)', 'Scripts R data-cleaning', 'Visualisation ggplot2'],
      originExperienceIds: ['form-m2-cognition', 'res-projet-m2-preference', 'exp-sncf'],
      connectedCapacityIds: ['cap-rigueur-scientifique', 'cap-controle-adaptatif'],
      x: 440,
      y: 1420
    },
    {
      id: 'skill-biais-cognitifs',
      name: 'Détection des Biais Cognitifs & Codex',
      category: 'skill_transversal',
      baseMastery: 95,
      acquiredYear: 2016,
      lastPracticedYear: 2019,
      halfLifeYears: 10,
      decayFactor: 0.04,
      transferabilityScore: 10,
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-s4', source: 'declaration', label: 'Expertise théorique et appliquée Codex 4 quadrants', confidenceScore: 98 }
      ],
      description: 'Maîtrise du Codex des biais cognitifs : détection des distorsions d\'attention, de mémoire, de prise de décision rapide et de comblement de sens.',
      subSkills: ['Codex 4 quadrants', 'Biais de confirmation & d\'ancrage', 'Heuristique de disponibilité', 'Facteurs humains'],
      originExperienceIds: ['form-m2-cognition', 'exp-sncf'],
      connectedCapacityIds: ['cap-rigueur-scientifique', 'cap-arbitrage-stress'],
      x: 440,
      y: 1540
    },
    {
      id: 'skill-pedagogie',
      name: 'Ingénierie Pédagogique & Médiation des Savoirs',
      category: 'skill_relational',
      baseMastery: 94,
      acquiredYear: 2017,
      lastPracticedYear: 2019,
      halfLifeYears: 8.5,
      decayFactor: 0.08,
      transferabilityScore: 9.8,
      verificationStatus: 'verified',
      confidenceScore: 97,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-s5', source: 'cv', label: 'Tutorat 6 classes universitaires UM3 (18 à 60 ans)', confidenceScore: 97, date: '2019' }
      ],
      description: 'Capacité à transmettre des notions scientifiques et techniques à des publics hétérogènes, conception de supports clairs et animation bienveillante.',
      subSkills: ['Animation pédagogique', 'Vulgarisation scientifique', 'Feedback constructif', 'Accompagnement individuel'],
      originExperienceIds: ['exp-tutorat'],
      connectedCapacityIds: ['cap-mediation-multi-publics', 'cap-coordination-humaine'],
      x: 440,
      y: 1660
    },
    {
      id: 'skill-securite-sst',
      name: 'Sécurité Opérationnelle, SST & AIPR Encadrant',
      category: 'skill_transversal',
      baseMastery: 96,
      acquiredYear: 2022,
      lastPracticedYear: 2024,
      halfLifeYears: 5.5,
      decayFactor: 0.08,
      transferabilityScore: 9.0,
      verificationStatus: 'verified',
      confidenceScore: 100,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-s7', source: 'diploma', label: 'Certificats officiels AIPR Encadrant & SST', confidenceScore: 100, date: '2024' }
      ],
      description: 'Réglementation anti-endommagement de réseaux (AIPR), sauvetage secourisme du travail (SST), culture de prévention des risques et accueil sécurité.',
      subSkills: ['Réglementation AIPR & DICT', 'Gestes d\'urgence SST', 'Évaluation des risques professionnels', 'Causeries sécurité'],
      originExperienceIds: ['exp-sobeca', 'form-conducteur-afpa'],
      connectedCapacityIds: ['cap-arbitrage-stress', 'cap-coordination-humaine'],
      x: 440,
      y: 1780
    },
    {
      id: 'skill-systemes-numeriques',
      name: 'Systèmes Numériques & Modélisation Technologique',
      category: 'skill_tech',
      baseMastery: 86,
      acquiredYear: 2013,
      lastPracticedYear: 2024,
      halfLifeYears: 7,
      decayFactor: 0.12,
      transferabilityScore: 9.1,
      verificationStatus: 'verified',
      confidenceScore: 95,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-sk-sti', source: 'diploma', label: 'Baccalauréat STI2D SIN & programmation expérimentale', confidenceScore: 95, date: '2013' }
      ],
      description: 'Culture des systèmes numériques, programmation logique, capteurs, interfaçage matériel et compréhension des architectures logicielles.',
      subSkills: ['Logique booléenne', 'Capteurs et acquisition de données', 'Interfaçage matériel', 'Architecture logicielle'],
      originExperienceIds: ['form-sti2d', 'form-m1-cognition'],
      connectedCapacityIds: ['cap-analyse-systemique', 'cap-conception-methodo'],
      x: 440,
      y: 1900
    },
    {
      id: 'skill-collaboration-ecoute',
      name: 'Médiation Relationnelle & Écoute Empathique',
      category: 'skill_relational',
      baseMastery: 98,
      acquiredYear: 2015,
      lastPracticedYear: 2024,
      halfLifeYears: 12,
      decayFactor: 0.02,
      transferabilityScore: 10,
      verificationStatus: 'verified',
      confidenceScore: 99,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-s8', source: 'declaration', label: 'Score RIASEC Collaboration 100% & Représentation UFR', confidenceScore: 99 }
      ],
      description: 'Intelligence interpersonnelle remarquable (100% collaboration RIASEC). Écoute active, diplomatie, gestion de conflits et création d\'un climat de sécurité psychologique.',
      subSkills: ['Écoute active', 'Création de confiance', 'Résolution diplomatique de conflits', 'Intelligence relationnelle'],
      originExperienceIds: ['exp-tutorat', 'exp-sobeca'],
      connectedCapacityIds: ['cap-mediation-multi-publics', 'cap-coordination-humaine'],
      x: 440,
      y: 2020
    },

    {
      id: 'skill-analyse-differences-individuelles',
      name: 'Analyse des Différences Interindividuelles',
      category: 'skill_tech',
      baseMastery: 82,
      acquiredYear: 2016,
      lastPracticedYear: 2019,
      halfLifeYears: 7,
      decayFactor: 0.12,
      transferabilityScore: 8.8,
      verificationStatus: 'pending',
      confidenceScore: 88,
      inferenceType: 'inference_forte',
      evidence: [
        { id: 'ev-sk-diff-ind', source: 'project', sourceDocument: 'cv_spécialisé_2020.pdf', label: 'Projet universitaire comparant pratique vidéoludique et orientation de l’attention', confidenceScore: 92, date: '2016–2017' }
      ],
      description: 'Comparer des groupes ou profils afin d’identifier des variations comportementales. La profondeur méthodologique exacte doit être confirmée par le mémoire ou l’utilisateur.',
      subSkills: ['Comparaison de profils', 'Variabilité interindividuelle', 'Interprétation prudente des écarts'],
      originExperienceIds: ['res-projet-jeux-video', 'res-projet-m2-preference'],
      connectedCapacityIds: ['cap-analyse-systemique', 'cap-conception-methodo']
    },
    {
      id: 'skill-outils-bureautiques-planification',
      name: 'Outils Bureautiques & Planification (Pack Office, Gantt)',
      category: 'skill_tech',
      baseMastery: 80,
      acquiredYear: 2017,
      lastPracticedYear: 2024,
      halfLifeYears: 5,
      decayFactor: 0.15,
      transferabilityScore: 8.5,
      verificationStatus: 'verified',
      confidenceScore: 96,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-sk-office', source: 'cv', sourceDocument: 'cv_spécialisé_2020.pdf', label: 'Logiciels explicitement listés : Pack Office et diagramme de Gantt', confidenceScore: 96, date: '2020' }
      ],
      description: 'Utilisation des outils bureautiques pour structurer les livrables et des représentations Gantt pour planifier les activités.',
      subSkills: ['Traitement de texte', 'Tableur', 'Présentation', 'Diagramme de Gantt'],
      originExperienceIds: ['exp-sncf', 'exp-catie', 'exp-sobeca'],
      connectedCapacityIds: ['cap-traduction-action', 'cap-controle-adaptatif']
    },

    // ========================================================================
    // 6. CAPACITÉS COGNITIVES MÉTA & TRANSVERSALES (8 Cognition)
    // ========================================================================
    {
      id: 'cap-controle-adaptatif',
      name: 'Contrôle Adaptatif Fondé sur les Données',
      category: 'capacity_cognitive',
      level: 'expert',
      cognitiveDimension: 'Coordination & Systémique',
      verificationStatus: 'pending',
      confidenceScore: 98,
      inferenceType: 'inference_forte',
      description: 'Pont direct recherche/chantier : capacité à piloter une boucle rigoureuse (Hypothèse/Métré ➔ Mesure ➔ Détection d\'écart ➔ Ajustement itératif ➔ Validation).',
      emergentInsight: 'Transposition immédiate de la méthode expérimentale vers la gestion d\'imprévus et le contrôle de chantier.',
      underlyingSkills: ['skill-metho-experimentale', 'skill-controle-operationnel', 'skill-stats-r-jasp', 'skill-gestion-financiere-contrat'],
      x: 740,
      y: 120
    },
    {
      id: 'cap-transfert-intercontextuel',
      name: 'Transfert Intercontextuel & Transposition',
      category: 'capacity_cognitive',
      level: 'expert',
      cognitiveDimension: 'Adaptabilité & Imprévus',
      verificationStatus: 'pending',
      confidenceScore: 97,
      inferenceType: 'inference_forte',
      description: 'Aptitude exceptionnelle à mobiliser et adapter connaissances et méthodes d\'un domaine à l\'autre : du laboratoire universitaire aux R&D transports et aux chantiers TP physiques.',
      emergentInsight: 'Rareté du profil : naviguer avec la même aisance entre abstraction conceptuelle et réalité matérielle.',
      underlyingSkills: ['skill-traduction-recherche-reco', 'skill-analyse-besoins', 'skill-cognition-spatiale'],
      x: 740,
      y: 340
    },
    {
      id: 'cap-analyse-systemique',
      name: 'Analyse Systémique & Modélisation de Systèmes Complexes',
      category: 'capacity_cognitive',
      level: 'expert',
      cognitiveDimension: 'Raisonnement & Analyse',
      verificationStatus: 'pending',
      confidenceScore: 96,
      inferenceType: 'inference_forte',
      description: 'Compréhension globale des interactions entre cognition humaine, contraintes techniques/numériques, environnements physiques et dynamiques temporelles.',
      underlyingSkills: ['skill-revue-litterature', 'skill-analyse-besoins', 'skill-systemes-numeriques'],
      x: 740,
      y: 560
    },
    {
      id: 'cap-conception-methodo',
      name: 'Conception Méthodologique & Outillage d\'Évaluation',
      category: 'capacity_cognitive',
      level: 'expert',
      cognitiveDimension: 'Raisonnement & Analyse',
      verificationStatus: 'verified',
      confidenceScore: 97,
      inferenceType: 'explicite',
      description: 'Création de protocoles expérimentaux originaux, formalisation de construits psychologiques et fabrication d\'outils de mesure fiables.',
      underlyingSkills: ['skill-metho-experimentale', 'skill-gestion-participants', 'skill-eye-tracking', 'skill-systemes-numeriques'],
      x: 740,
      y: 780
    },
    {
      id: 'cap-traduction-action',
      name: 'Traduction Analytique ➔ Action Opérationnelle',
      category: 'capacity_cognitive',
      level: 'expert',
      cognitiveDimension: 'Coordination & Systémique',
      verificationStatus: 'pending',
      confidenceScore: 97,
      inferenceType: 'inference_forte',
      description: 'Conversion fluide des constats théoriques ou statistiques en recommandations d\'aménagement, décisions de conception et plans d\'action opérationnels.',
      underlyingSkills: ['skill-traduction-recherche-reco', 'skill-relation-client-rd', 'skill-analyse-besoins'],
      x: 740,
      y: 1000
    },
    {
      id: 'cap-mediation-multi-publics',
      name: 'Adaptation de la Communication & Médiation Multi-Publics',
      category: 'capacity_cognitive',
      level: 'expert',
      cognitiveDimension: 'Humain & Médiation',
      verificationStatus: 'verified',
      confidenceScore: 99,
      inferenceType: 'explicite',
      description: 'Aisance remarquable pour dialoguer avec des directeurs R&D, chercheurs, étudiants de 18 à 60 ans, ouvriers de voirie, concessionnaires et clients.',
      underlyingSkills: ['skill-pedagogie', 'skill-collaboration-ecoute', 'skill-encadrement-equipes', 'skill-gestion-participants'],
      x: 740,
      y: 1220
    },
    {
      id: 'cap-spatial-syst',
      name: 'Modélisation Spatio-Temporelle & Wayfinding',
      category: 'capacity_cognitive',
      level: 'expert',
      cognitiveDimension: 'Spatial & Abstraction',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      description: 'Capacité à se projeter mentalement dans des environnements 3D, à anticiper les flux, les repères et les dynamiques de déplacement complexes.',
      underlyingSkills: ['skill-cognition-spatiale', 'skill-eye-tracking', 'skill-controle-operationnel'],
      x: 740,
      y: 1440
    },
    {
      id: 'cap-arbitrage-stress',
      name: 'Arbitrage Rapide & Décision Sous Contrainte Terrain',
      category: 'capacity_cognitive',
      level: 'avancé',
      cognitiveDimension: 'Adaptabilité & Imprévus',
      verificationStatus: 'verified',
      confidenceScore: 94,
      inferenceType: 'explicite',
      description: 'Évaluation des risques en direct face aux aléas de chantier ou d\'expérimentation, maintien du calme et réajustement des ressources sans panique.',
      underlyingSkills: ['skill-securite-sst', 'skill-gestion-financiere-contrat', 'skill-biais-cognitifs'],
      x: 740,
      y: 1660
    },

    // ========================================================================
    // 5b. SAVOIRS THÉORIQUES & CADRES NORMATIFS (PILIERS DE CONNAISSANCE)
    // ========================================================================
    {
      id: 'know-psychologie-cognitive',
      name: 'Modèles de la Mémoire, Attention & Charge Cognitive (Sweller, Kahneman)',
      category: 'knowledge',
      domain: 'Sciences Cognitives & Neuroergonomie',
      acquiredYear: 2016,
      decayRate: 'lent',
      description: 'Corpus théorique fondamental des architectures cognitives : modèles attentionnels (Kahneman), mémoire de travail (Baddeley), théorie de la charge cognitive (Sweller) et modèles de prise de décision heuristique (Tversky).',
      verificationStatus: 'verified',
      confidenceScore: 99,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-kn-cog', source: 'diploma', label: 'Diplômes Licence & Master Sciences Cognitives UM3', confidenceScore: 100, date: '2019' }
      ],
      x: 300,
      y: 80
    },
    {
      id: 'know-statistiques-inferentielles',
      name: 'Fondements Mathématiques de l\'Inférence & Modélisation Bayésienne',
      category: 'knowledge',
      domain: 'Méthodologie & Modélisation',
      acquiredYear: 2017,
      decayRate: 'lent',
      description: 'Théorie de l\'estimation statistique, tests paramétriques/non-paramétriques, théorie de la décision bayésienne et calcul des tailles d\'effet.',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-kn-stat', source: 'diploma', label: 'Unités d\'enseignement Statistiques Avancées Master 1 & 2', confidenceScore: 98, date: '2019' }
      ],
      x: 300,
      y: 260
    },
    {
      id: 'know-normes-aipr-dict',
      name: 'Cadre Réglementaire DT-DICT & Réglementation Anti-Endommagement',
      category: 'knowledge',
      domain: 'Génie Civil & Droit de la Voirie',
      acquiredYear: 2023,
      decayRate: 'lent',
      description: 'Réglementation relative aux travaux à proximité des réseaux (décret DT-DICT, fascicule 3, normes NF P98-032 et sécurité des tiers).',
      verificationStatus: 'verified',
      confidenceScore: 100,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-kn-dict', source: 'diploma', label: 'Habilitation AIPR Encadrant & Titre Professionnel Conducteur de Travaux', confidenceScore: 100, date: '2024' }
      ],
      x: 300,
      y: 1100
    },
    {
      id: 'know-normes-ergonomie-iso',
      name: 'Normes ISO 9241 & Principes de Conception Centrée Humain (UCD)',
      category: 'knowledge',
      domain: 'Ergonomie & Facteurs Humains',
      acquiredYear: 2018,
      decayRate: 'lent',
      description: 'Normes ergonomiques internationales de l\'interaction homme-système (ISO 9241-210), utilisabilité, accessibilité universelle et critères de Bastien & Scapin.',
      verificationStatus: 'verified',
      confidenceScore: 97,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-kn-iso', source: 'project', label: 'Application sur les livrables SNCF Direction Innovation', confidenceScore: 97, date: '2019' }
      ],
      x: 300,
      y: 620
    },

    // ========================================================================
    // 6. HORIZONS ROME & MÉTIERS (Nuancés : Preuves convergentes & Passerelles)
    // ========================================================================
    {
      id: 'job-ergonome-facteurs-humains',
      name: 'Ergonome Facteurs Humains & Mobilités (ROME M1402)',
      category: 'horizon_job',
      domain: 'Ingénierie Cognitive & Transports',
      romeCode: 'M1402',
      romeTitle: 'Conseil en organisation et management d\'entreprise (Facteurs Humains)',
      matchScore: 97,
      compatibilityLevel: 'Très Élevée',
      verificationStatus: 'inferred',
      inferenceType: 'inference_a_valider',
      confidenceScore: 97,
      rationale: 'Votre parcours fournit plusieurs preuves convergentes solides vers ce métier : expérience de recherche appliquée SNCF Innovation (« Orientation enrichie »), mesures eye-tracking CATIE (« Recherche d\'itinéraire »), mémoire M2 sur l\'attention spatiale et compréhension physique des infrastructures.',
      matchingSkills: [
        'Cognition Spatiale & Modélisation Wayfinding',
        'Méthodologie Expérimentale & Protocoles Scientifiques',
        'Eye-Tracking & Chronométrie Attentionnelle (Tobii)',
        'Statistiques Expérimentales & Logiciels (R, JASP)'
      ],
      missingSkills: [
        {
          name: 'Normes d\'Accessibilité PMR Ferroviaire & Bâti (STI PMR)',
          importance: 'bonus',
          learningBridge: 'Sensibilisation aux normes STI PMR et aux principes du design universel inclusif.',
          recommendedTraining: {
            title: 'Accessibilité universelle et aménagements PMR dans les transports',
            providerOrType: 'Cerema',
            duration: '14 heures',
            format: 'Micro-learning',
            targetedSkill: 'Normes PMR'
          }
        }
      ],
      unlockedOpportunities: [
        'Expert UX Research & Facteurs Humains en transports',
        'Chef de projet Signalétique & Expérience Voyageur',
        'Consultant en aménagement cognitif des gares et pôles multimodaux'
      ],
      explainabilityFactors: {
        strengthPoints: [
          'Preuves directes issues des 3 expériences SNCF (160 participants) et 3 expériences CATIE (60 participants)',
          'Double maîtrise de la mesure physiologique (eye-tracking) et de la signalétique spatiale',
          'Compréhension des contraintes d\'infrastructure matérielle (expérience VRD)'
        ],
        riskPoints: ['Nécessite la formalisation des normes d\'accessibilité réglementaires PMR récentes'],
        suggestedNextAction: 'Consulter un guide de synthèse Cerema sur la signalétique inclusive pour conforter la passerelle.',
        evidenceConvergence: [
          'Preuve explicite : Rapport SNCF Innovation Direction Recherche (2019)',
          'Preuve explicite : Étude CATIE Itinéraire en milieu clos (2018)',
          'Preuve explicite : Mémoire M2 Attention spatiale et temporelle (2019)'
        ]
      },
      description: 'Conception de dispositifs d\'orientation spatiale optimisés et sécurisés pour les usagers dans les infrastructures complexes.',
      x: 1040,
      y: 120
    },
    {
      id: 'job-k2102-coord-pedago',
      name: 'Coordinateur Pédagogique & Ingénieur Formation (ROME K2102)',
      category: 'horizon_job',
      domain: 'Formation & Enseignement Supérieur',
      romeCode: 'K2102',
      romeTitle: 'Coordination pédagogique',
      matchScore: 96,
      compatibilityLevel: 'Très Élevée',
      verificationStatus: 'inferred',
      inferenceType: 'inference_a_valider',
      confidenceScore: 96,
      rationale: 'Votre parcours démontre une forte convergence de compétences transférables : animation de 6 classes universitaires hétérogènes (18 à 60 ans), écoute empathique (100% collaboration RIASEC), et expertise théorique des mécanismes d\'apprentissage et de rétention (sciences cognitives).',
      matchingSkills: [
        'Ingénierie Pédagogique & Médiation des Savoirs',
        'Encadrement d\'Équipes & Animation de Collectifs',
        'Médiation Relationnelle & Écoute Empathique',
        'Détection des Biais Cognitifs & Codex'
      ],
      missingSkills: [
        {
          name: 'Cadre Réglementaire Qualiopi & Gestion CPF',
          importance: 'recommandée',
          learningBridge: 'Formation courte aux 7 critères du référentiel national Qualiopi et aux financements OPCO/CPF.',
          recommendedTraining: {
            title: 'Certification Responsable de Dispositifs de Formation (Qualiopi)',
            providerOrType: 'Centre National de la Fonction Publique / FFP',
            duration: '35 heures',
            format: 'Certifiante',
            targetedSkill: 'Gestion Qualiopi'
          }
        }
      ],
      unlockedOpportunities: [
        'Responsable pédagogique d\'organismes de formation',
        'Coordinateur de dispositifs d\'apprentissage pour adultes',
        'Directeur d\'études en école d\'ingénieurs ou institut universitaire'
      ],
      explainabilityFactors: {
        strengthPoints: [
          'Pratique avérée de l\'animation de classes intergénérationnelles (18-60 ans)',
          'Double maîtrise des sciences de l\'apprentissage et de la gestion de groupe',
          'Aisance relationnelle remarquable (100% collaboration RIASEC)'
        ],
        riskPoints: ['Prise en main du jargon administratif de la formation professionnelle requise'],
        suggestedNextAction: 'Suivre un module court de 3h d\'introduction au référentiel Qualiopi.',
        evidenceConvergence: [
          'Preuve explicite : Tutorat universitaire 2 années UM3 (6 classes de 30 étudiants)',
          'Preuve explicite : Élection représentant UFR 5',
          'Preuve explicite : Master 2 psychologie cognitive de l\'apprentissage'
        ]
      },
      description: 'Coordination des équipes d\'enseignants/formateurs, élaboration des maquettes pédagogiques et suivi bienveillant de la progression des apprenants.',
      x: 1040,
      y: 380
    },
    {
      id: 'job-m1508-conseil-carriere',
      name: 'Conseiller en Gestion de Carrière & Bilans Cognitifs (ROME M1508)',
      category: 'horizon_job',
      domain: 'Ressources Humaines & Bilans de Compétences',
      romeCode: 'M1508',
      romeTitle: 'Conseil en ressources humaines et mobilité',
      matchScore: 94,
      compatibilityLevel: 'Élevée',
      verificationStatus: 'inferred',
      inferenceType: 'inference_a_valider',
      confidenceScore: 94,
      rationale: 'Votre parcours fournit des preuves solides : diplôme d\'État Master 2 en évaluation cognitive, maîtrise des biais psychologiques et qualité d\'écoute rare (100% RIASEC collaboration).',
      matchingSkills: [
        'Rigueur Méthodologique & Pensée Analytique',
        'Médiation Relationnelle & Écoute Empathique',
        'Détection des Biais Cognitifs & Codex',
        'Analyse des Besoins Multi-Contextuelle'
      ],
      missingSkills: [
        {
          name: 'Outils Psychotechniques d\'Entreprise & Démarche Bilan',
          importance: 'recommandée',
          learningBridge: 'Prise en main des inventaires de personnalité d\'entreprise (MBTI, SOSIE) et méthodologie du bilan de compétences.',
          recommendedTraining: {
            title: 'Certification Praticien Bilan de Compétences',
            providerOrType: 'AFPA / Centre National des Bilans',
            duration: '40 heures',
            format: 'Certifiante',
            targetedSkill: 'Outils Psychotechniques'
          }
        }
      ],
      unlockedOpportunities: [
        'Consultant en mobilité professionnelle et bilans cognitifs',
        'Talent Manager en organisation agile',
        'Conseiller en évolution et transition professionnelle'
      ],
      explainabilityFactors: {
        strengthPoints: [
          'Formation universitaire de pointe en évaluation du fonctionnement psychologique',
          'Sens profond de l\'écoute bienveillante et du non-jugement',
          'Capacité à révéler les compétences transférables invisibles'
        ],
        riskPoints: ['Maîtrise du marché de l\'emploi local et des conventions collectives à consolider'],
        suggestedNextAction: 'Effectuer 2 entretiens exploratoires de bilan de compétences avec un praticien.',
        evidenceConvergence: [
          'Preuve explicite : Master 2 Évaluation du fonctionnement cognitif',
          'Preuve explicite : Test RIASEC Social 76%, Collaboration 100%'
        ]
      },
      description: 'Accompagnement des personnes dans leur trajectoire professionnelle, révélation de leur capital cognitif et co-construction de projets porteurs de sens.',
      x: 1040,
      y: 640
    },
    {
      id: 'job-chef-projet-rd',
      name: 'Chef de Projet R&D & UX Research Environnements Complexes (ROME M1805 / M1402)',
      category: 'horizon_job',
      domain: 'Recherche Appliquée & Innovation Produit',
      romeCode: 'M1805',
      romeTitle: 'Études et prospective systèmes d\'information',
      matchScore: 93,
      compatibilityLevel: 'Élevée',
      verificationStatus: 'inferred',
      inferenceType: 'inference_a_valider',
      confidenceScore: 93,
      rationale: 'Hypothèse soutenue par 4 projets de recherche conduits avec succès, la gestion de partenariats R&D industriels (SNCF Innovation, CATIE) et une capacité éprouvée à traduire la science en décisions.',
      matchingSkills: [
        'Méthodologie Expérimentale & Protocoles Scientifiques',
        'Gestion de Relation Client R&D / Commanditaire',
        'Traduction Recherche ➔ Recommandations Opérationnelles',
        'Systèmes Numériques & Modélisation Technologique'
      ],
      missingSkills: [
        {
          name: 'Gestion de Projet Agile (Scrum / Design Thinking)',
          importance: 'recommandée',
          learningBridge: 'Sensibilisation aux cérémonies Scrum et aux sprints d\'innovation rapide.',
          recommendedTraining: {
            title: 'Certification Scrum Master / Design Sprint',
            providerOrType: 'Scrum.org',
            duration: '16 heures',
            format: 'Certifiante',
            targetedSkill: 'Méthodes Agiles'
          }
        }
      ],
      unlockedOpportunities: [
        'Lead UX Researcher sur systèmes complexes (mobilité, aéronautique, industrie)',
        'Chef de projet R&D Facteurs Humains',
        'Consultant Innovation & Cognition'
      ],
      explainabilityFactors: {
        strengthPoints: [
          'Rigueur méthodologique et expérience de protocoles avec 220+ participants',
          'Aisance dans l\'interaction avec des commanditaires exigeants',
          'Culture systèmes numériques (STI2D)'
        ],
        riskPoints: ['Pratique du rythme des sprints agiles d\'entreprise à roder'],
        suggestedNextAction: 'Formaliser un portfolio d\'études de cas R&D issues de vos travaux SNCF et CATIE.'
      },
      description: 'Pilotage d\'études utilisateurs et de recherche cognitive pour orienter le design de systèmes et services complexes.',
      x: 1040,
      y: 900
    },
    {
      id: 'job-qse-rse-chantier',
      name: 'Responsable QSE & Facteurs Humains de Sécurité (ROME H1523)',
      category: 'horizon_job',
      domain: 'Qualité Sécurité Environnement & RSE',
      romeCode: 'H1523',
      romeTitle: 'Management et ingénierie qualité, sécurité, environnement',
      matchScore: 90,
      compatibilityLevel: 'Élevée',
      verificationStatus: 'inferred',
      inferenceType: 'inference_a_valider',
      confidenceScore: 90,
      rationale: 'Votre profil conjugue l\'expérience concrète des chantiers TP (SOBECA/COLAS, SST, AIPR) et la compréhension cognitive des biais de vigilance et d\'habitude qui causent les accidents de travail.',
      matchingSkills: [
        'Sécurité Opérationnelle, SST & AIPR Encadrant',
        'Gestion Contractuelle, Métrés & Logistique de Dépôt',
        'Détection des Biais Cognitifs & Codex',
        'Encadrement d\'Équipes & Animation de Collectifs'
      ],
      missingSkills: [
        {
          name: 'Auditeur Normes ISO 45001 (Santé & Sécurité au Travail)',
          importance: 'recommandée',
          learningBridge: 'Formation de 3 jours à l\'audit interne du système de management SST selon la norme ISO 45001.',
          recommendedTraining: {
            title: 'Auditeur interne ISO 45001 Sécurité au travail',
            providerOrType: 'AFNOR Compétences',
            duration: '21 heures',
            format: 'Certifiante',
            targetedSkill: 'Normes ISO'
          }
        }
      ],
      unlockedOpportunities: [
        'Responsable Prévention & Facteurs Humains dans les TP / Industrie',
        'Chargé de mission RSE et Qualité de Vie au Travail (QVT)',
        'Formateur Santé & Sécurité au Travail spécialisé biais de vigilance'
      ],
      explainabilityFactors: {
        strengthPoints: [
          'Connaissance intime du terrain et respect des ouvriers',
          'Approche scientifique de la vigilance humaine et de l\'attention',
          'Habilitations SST et AIPR actives'
        ],
        riskPoints: ['Acquisition des référentiels normatifs ISO 45001/14001'],
        suggestedNextAction: 'Examiner le référentiel ISO 45001 pour identifier les ponts avec vos protocoles de sécurité.'
      },
      description: 'Pilotage de la prévention des risques professionnels par la prise en compte des biais cognitifs et de la réalité opérationnelle du terrain.',
      x: 1040,
      y: 1160
    }
  ],

  // ========================================================================
  // 7. ARÊTES DU GRAPHE (EDGES) : CONNEXIONS & RELATIONS PONDÉRÉES
  // ========================================================================
  edges: [
    // Formations -> Compétences & Savoirs
    { id: 'e-f1', source: 'form-sti2d', target: 'skill-systemes-numeriques', type: 'acquired_in', strength: 0.95, label: 'Bases SIN & Logique' },
    { id: 'e-f2', source: 'form-licence-psycho', target: 'skill-revue-litterature', type: 'acquired_in', strength: 0.9, label: 'Recherche documentaire' },
    { id: 'e-f3', source: 'form-m1-cognition', target: 'skill-metho-experimentale', type: 'acquired_in', strength: 0.95, label: 'Protocoles & Chronométrie' },
    { id: 'e-f4', source: 'form-m2-cognition', target: 'skill-stats-r-jasp', type: 'acquired_in', strength: 0.95, label: 'Stats R & Bayes' },
    { id: 'e-f5', source: 'form-m2-cognition', target: 'skill-biais-cognitifs', type: 'acquired_in', strength: 0.98, label: 'Modèles cognitifs' },
    { id: 'e-f6', source: 'form-conducteur-afpa', target: 'skill-gestion-financiere-contrat', type: 'acquired_in', strength: 0.9, label: 'Métrés & Gestion TP' },
    { id: 'e-f7', source: 'form-conducteur-afpa', target: 'skill-securite-sst', type: 'acquired_in', strength: 0.98, label: 'AIPR & SST' },

    // Formations & Expériences -> Savoirs Fondamentaux (acquired_in)
    { id: 'e-fk1', source: 'form-m2-cognition', target: 'know-psychologie-cognitive', type: 'acquired_in', strength: 1.0, label: 'Corpus académique M2' },
    { id: 'e-fk2', source: 'form-m2-cognition', target: 'know-statistiques-inferentielles', type: 'acquired_in', strength: 0.98, label: 'Inférence & Bayes' },
    { id: 'e-fk3', source: 'form-conducteur-afpa', target: 'know-normes-aipr-dict', type: 'acquired_in', strength: 1.0, label: 'Normes réglementaires TP' },
    { id: 'e-fk4', source: 'exp-sncf', target: 'know-normes-ergonomie-iso', type: 'acquired_in', strength: 0.95, label: 'Normes ISO 9241 appliquées' },

    // Compétences -> Savoirs Requis (requires_knowledge)
    { id: 'e-sk-kn1', source: 'skill-biais-cognitifs', target: 'know-psychologie-cognitive', type: 'requires_knowledge', strength: 0.98, label: 'Appui théorique' },
    { id: 'e-sk-kn2', source: 'skill-cognition-spatiale', target: 'know-psychologie-cognitive', type: 'requires_knowledge', strength: 0.95, label: 'Modèles attentionnels' },
    { id: 'e-sk-kn3', source: 'skill-stats-r-jasp', target: 'know-statistiques-inferentielles', type: 'requires_knowledge', strength: 0.98, label: 'Fondement mathématique' },
    { id: 'e-sk-kn4', source: 'skill-securite-sst', target: 'know-normes-aipr-dict', type: 'requires_knowledge', strength: 0.98, label: 'Conformité légale' },
    { id: 'e-sk-kn5', source: 'skill-traduction-recherche-reco', target: 'know-normes-ergonomie-iso', type: 'requires_knowledge', strength: 0.92, label: 'Cadre ISO' },

    // Recherches Universitaires -> Compétences
    { id: 'e-r1', source: 'res-projet-m2-preference', target: 'skill-cognition-spatiale', type: 'acquired_in', strength: 0.95, label: 'Attention spatio-temporelle' },
    { id: 'e-r2', source: 'res-projet-m2-preference', target: 'skill-stats-r-jasp', type: 'acquired_in', strength: 0.95, label: 'ANOVA & Comparaisons' },
    { id: 'e-r3', source: 'res-projet-m1-outil-prep', target: 'skill-metho-experimentale', type: 'acquired_in', strength: 0.95, label: 'Conception d\'outils' },
    { id: 'e-r4', source: 'res-projet-jeux-video', target: 'skill-revue-litterature', type: 'acquired_in', strength: 0.9, label: 'Différences interindividuelles' },
    { id: 'e-r5', source: 'res-projet-endogene', target: 'skill-metho-experimentale', type: 'acquired_in', strength: 0.9, label: 'Chronométrie mentale' },
    { id: 'e-r6', source: 'res-projet-jeux-video', target: 'skill-analyse-differences-individuelles', type: 'acquired_in', strength: 0.9, label: 'Comparaison de profils' },

    // Expériences -> Tâches -> Compétences (traçabilité fine)
    { id: 'e-m1', source: 'exp-sncf', target: 'task-sncf-protocoles', type: 'composed_of', strength: 1, label: 'Tâche documentée' },
    { id: 'e-m2', source: 'exp-sncf', target: 'task-sncf-restitution', type: 'composed_of', strength: 0.9, label: 'Tâche à confirmer' },
    { id: 'e-m3', source: 'exp-catie', target: 'task-catie-etat-art', type: 'composed_of', strength: 1, label: 'Tâche documentée' },
    { id: 'e-m4', source: 'exp-catie', target: 'task-catie-experimentation', type: 'composed_of', strength: 1, label: 'Tâche documentée' },
    { id: 'e-m5', source: 'exp-tutorat', target: 'task-tutorat-transmission', type: 'composed_of', strength: 1, label: 'Tâche documentée' },
    { id: 'e-m6', source: 'exp-sobeca', target: 'task-sobeca-pilotage', type: 'composed_of', strength: 1, label: 'Tâche documentée' },
    { id: 'e-m7', source: 'exp-sobeca', target: 'task-sobeca-securite', type: 'composed_of', strength: 0.9, label: 'Périmètre à confirmer' },
    { id: 'e-m8', source: 'exp-colas', target: 'task-colas-controle', type: 'composed_of', strength: 0.9, label: 'Inférence forte' },
    { id: 'e-ms1', source: 'task-sncf-protocoles', target: 'skill-metho-experimentale', type: 'demonstrates_skill', strength: 0.98 },
    { id: 'e-ms2', source: 'task-sncf-protocoles', target: 'skill-gestion-participants', type: 'demonstrates_skill', strength: 0.98 },
    { id: 'e-ms3', source: 'task-sncf-restitution', target: 'skill-traduction-recherche-reco', type: 'demonstrates_skill', strength: 0.9 },
    { id: 'e-ms4', source: 'task-catie-etat-art', target: 'skill-revue-litterature', type: 'demonstrates_skill', strength: 0.98 },
    { id: 'e-ms5', source: 'task-catie-experimentation', target: 'skill-eye-tracking', type: 'demonstrates_skill', strength: 0.98 },
    { id: 'e-ms6', source: 'task-catie-experimentation', target: 'skill-gestion-participants', type: 'demonstrates_skill', strength: 0.95 },
    { id: 'e-ms7', source: 'task-tutorat-transmission', target: 'skill-pedagogie', type: 'demonstrates_skill', strength: 0.98 },
    { id: 'e-ms8', source: 'task-tutorat-transmission', target: 'skill-collaboration-ecoute', type: 'demonstrates_skill', strength: 0.9 },
    { id: 'e-ms9', source: 'task-sobeca-pilotage', target: 'skill-gestion-financiere-contrat', type: 'demonstrates_skill', strength: 0.95 },
    { id: 'e-ms10', source: 'task-sobeca-pilotage', target: 'skill-encadrement-equipes', type: 'demonstrates_skill', strength: 0.95 },
    { id: 'e-ms11', source: 'task-sobeca-securite', target: 'skill-securite-sst', type: 'demonstrates_skill', strength: 0.98 },
    { id: 'e-ms12', source: 'task-colas-controle', target: 'skill-controle-operationnel', type: 'demonstrates_skill', strength: 0.95 },

    // Expériences Professionnelles -> Compétences (raccourcis de synthèse)
    { id: 'e-exp1', source: 'exp-sncf', target: 'skill-cognition-spatiale', type: 'acquired_in', strength: 0.98, label: 'Wayfinding en gare' },
    { id: 'e-exp2', source: 'exp-sncf', target: 'skill-gestion-participants', type: 'acquired_in', strength: 0.98, label: '160 participants' },
    { id: 'e-exp3', source: 'exp-sncf', target: 'skill-traduction-recherche-reco', type: 'acquired_in', strength: 0.95, label: 'Préconisations design' },
    { id: 'e-exp4', source: 'exp-sncf', target: 'skill-relation-client-rd', type: 'acquired_in', strength: 0.92, label: 'Direction Innovation' },
    { id: 'e-exp5', source: 'exp-catie', target: 'skill-eye-tracking', type: 'acquired_in', strength: 0.98, label: 'Mesures Tobii' },
    { id: 'e-exp6', source: 'exp-catie', target: 'skill-gestion-participants', type: 'acquired_in', strength: 0.92, label: '60 participants' },
    { id: 'e-exp7', source: 'exp-catie', target: 'skill-cognition-spatiale', type: 'acquired_in', strength: 0.9, label: 'Itinéraires clos' },
    { id: 'e-exp8', source: 'exp-tutorat', target: 'skill-pedagogie', type: 'acquired_in', strength: 0.98, label: '6 classes universitaires' },
    { id: 'e-exp9', source: 'exp-tutorat', target: 'skill-collaboration-ecoute', type: 'acquired_in', strength: 0.98, label: 'Écoute & Médiation' },
    { id: 'e-exp10', source: 'exp-tutorat', target: 'skill-encadrement-equipes', type: 'acquired_in', strength: 0.92, label: '18-60 ans' },
    { id: 'e-exp11', source: 'exp-sobeca', target: 'skill-gestion-financiere-contrat', type: 'acquired_in', strength: 0.95, label: 'Métrés & Dépôt annexe' },
    { id: 'e-exp12', source: 'exp-sobeca', target: 'skill-encadrement-equipes', type: 'acquired_in', strength: 0.95, label: '4 équipes travaux' },
    { id: 'e-exp13', source: 'exp-sobeca', target: 'skill-securite-sst', type: 'acquired_in', strength: 0.98, label: 'AIPR & SST' },
    { id: 'e-exp14', source: 'exp-colas', target: 'skill-controle-operationnel', type: 'acquired_in', strength: 0.95, label: 'Implantation laser' },
    { id: 'e-exp15', source: 'exp-sncf', target: 'skill-outils-bureautiques-planification', type: 'acquired_in', strength: 0.75, label: 'Livrables & planification' },
    { id: 'e-exp16', source: 'exp-sobeca', target: 'skill-outils-bureautiques-planification', type: 'acquired_in', strength: 0.85, label: 'Planning de chantier' },

    // Compétences -> Cognition
    { id: 'e-c1', source: 'skill-metho-experimentale', target: 'cap-controle-adaptatif', type: 'feeds_capacity', strength: 0.95 },
    { id: 'e-c2', source: 'skill-controle-operationnel', target: 'cap-controle-adaptatif', type: 'feeds_capacity', strength: 0.95 },
    { id: 'e-c3', source: 'skill-stats-r-jasp', target: 'cap-controle-adaptatif', type: 'feeds_capacity', strength: 0.9 },
    { id: 'e-c4', source: 'skill-traduction-recherche-reco', target: 'cap-transfert-intercontextuel', type: 'feeds_capacity', strength: 0.98 },
    { id: 'e-c5', source: 'skill-analyse-besoins', target: 'cap-transfert-intercontextuel', type: 'feeds_capacity', strength: 0.92 },
    { id: 'e-c6', source: 'skill-cognition-spatiale', target: 'cap-transfert-intercontextuel', type: 'feeds_capacity', strength: 0.9 },
    { id: 'e-c7', source: 'skill-revue-litterature', target: 'cap-analyse-systemique', type: 'feeds_capacity', strength: 0.95 },
    { id: 'e-c8', source: 'skill-systemes-numeriques', target: 'cap-analyse-systemique', type: 'feeds_capacity', strength: 0.9 },
    { id: 'e-c9', source: 'skill-metho-experimentale', target: 'cap-conception-methodo', type: 'feeds_capacity', strength: 0.98 },
    { id: 'e-c10', source: 'skill-eye-tracking', target: 'cap-conception-methodo', type: 'feeds_capacity', strength: 0.9 },
    { id: 'e-c11', source: 'skill-traduction-recherche-reco', target: 'cap-traduction-action', type: 'feeds_capacity', strength: 0.98 },
    { id: 'e-c12', source: 'skill-relation-client-rd', target: 'cap-traduction-action', type: 'feeds_capacity', strength: 0.92 },
    { id: 'e-c13', source: 'skill-pedagogie', target: 'cap-mediation-multi-publics', type: 'feeds_capacity', strength: 0.98 },
    { id: 'e-c14', source: 'skill-collaboration-ecoute', target: 'cap-mediation-multi-publics', type: 'feeds_capacity', strength: 0.98 },
    { id: 'e-c15', source: 'skill-encadrement-equipes', target: 'cap-mediation-multi-publics', type: 'feeds_capacity', strength: 0.92 },
    { id: 'e-c16', source: 'skill-cognition-spatiale', target: 'cap-spatial-syst', type: 'feeds_capacity', strength: 0.98 },
    { id: 'e-c17', source: 'skill-eye-tracking', target: 'cap-spatial-syst', type: 'feeds_capacity', strength: 0.9 },
    { id: 'e-c18', source: 'skill-securite-sst', target: 'cap-arbitrage-stress', type: 'feeds_capacity', strength: 0.95 },
    { id: 'e-c19', source: 'skill-biais-cognitifs', target: 'cap-arbitrage-stress', type: 'feeds_capacity', strength: 0.9 },
    { id: 'e-c20', source: 'skill-gestion-financiere-contrat', target: 'cap-arbitrage-stress', type: 'feeds_capacity', strength: 0.88 },
    { id: 'e-c21', source: 'skill-analyse-differences-individuelles', target: 'cap-analyse-systemique', type: 'feeds_capacity', strength: 0.86 },
    { id: 'e-c22', source: 'skill-outils-bureautiques-planification', target: 'cap-traduction-action', type: 'feeds_capacity', strength: 0.75 },

    // Cognition -> Horizons ROME
    { id: 'e-h1', source: 'cap-spatial-syst', target: 'job-ergonome-facteurs-humains', type: 'unlocks_horizon', strength: 0.98 },
    { id: 'e-h2', source: 'cap-transfert-intercontextuel', target: 'job-ergonome-facteurs-humains', type: 'unlocks_horizon', strength: 0.95 },
    { id: 'e-h3', source: 'cap-conception-methodo', target: 'job-ergonome-facteurs-humains', type: 'unlocks_horizon', strength: 0.92 },
    { id: 'e-h4', source: 'cap-mediation-multi-publics', target: 'job-k2102-coord-pedago', type: 'unlocks_horizon', strength: 0.98 },
    { id: 'e-h5', source: 'cap-analyse-systemique', target: 'job-k2102-coord-pedago', type: 'unlocks_horizon', strength: 0.9 },
    { id: 'e-h6', source: 'cap-mediation-multi-publics', target: 'job-m1508-conseil-carriere', type: 'unlocks_horizon', strength: 0.96 },
    { id: 'e-h7', source: 'cap-conception-methodo', target: 'job-m1508-conseil-carriere', type: 'unlocks_horizon', strength: 0.92 },
    { id: 'e-h8', source: 'cap-conception-methodo', target: 'job-chef-projet-rd', type: 'unlocks_horizon', strength: 0.96 },
    { id: 'e-h9', source: 'cap-traduction-action', target: 'job-chef-projet-rd', type: 'unlocks_horizon', strength: 0.94 },
    { id: 'e-h10', source: 'cap-arbitrage-stress', target: 'job-qse-rse-chantier', type: 'unlocks_horizon', strength: 0.92 },
    { id: 'e-h11', source: 'cap-controle-adaptatif', target: 'job-qse-rse-chantier', type: 'unlocks_horizon', strength: 0.9 }
  ]
};
