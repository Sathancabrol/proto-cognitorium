import { CognitiveProfile } from '../types';

export const INITIAL_COGNITORIUM_PROFILE: CognitiveProfile = {
  id: 'profile-nathan-cabrol',
  personName: 'Näthan Cabrol, MS',
  headline: 'Expert Sciences Cognitives (Master 2) & Conduite de Travaux / Génie Civil (VRD)',
  coreMotto: 'L’alliance de la rigueur expérimentale des sciences cognitives et du pragmatisme opérationnel du terrain.',
  location: 'Frontignan (34110) • Occitanie',
  email: 'nathancabrol@hotmail.fr',
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
        code: 'K2102',
        title: 'Coordinateur / Coordinatrice Pédagogique',
        matchScore: 95,
        description: 'Liaison entre apprenants, formateurs et programmes éducatifs. Conception de parcours et supervision pédagogique.'
      },
      {
        code: 'M1508',
        title: 'Conseiller en Gestion de Carrière & Talents',
        matchScore: 92,
        description: 'Évaluation des compétences, bilans de parcours, plans de formation continue et accompagnement du développement individuel.'
      },
      {
        code: 'H1523 / M1413',
        title: 'Responsable QSE & Mission RSE',
        matchScore: 88,
        description: 'Sécurité terrain, respect environnemental, facteurs humains et bien-être au travail.'
      },
      {
        code: 'F1208',
        title: 'Conducteur de Travaux / Chef de Chantier TP',
        matchScore: 86,
        description: 'Coordination opérationnelle, gestion contractuelle et sécurité d\'équipes pluridisciplinaires.'
      }
    ]
  },

  cognitiveSignature: {
    dominantReasoning: 'Pensée Hybride : Expérimentation Scientifique & Pragmatique Terrain',
    transferabilityIndex: 94,
    learningVelocity: 'Exceptionnelle',
    adaptabilityIndex: 92,
    summaryText: 'Profil rare combinant un bagage universitaire pointu en psychologie cognitive expérimentale (attention spatio-temporelle, eye-tracking, modélisation des biais) et une solide expérience opérationnelle de terrain dans les Travaux Publics / VRD (gestion de sous-traitants, métrés, sécurité SST/AIPR). Excellente intelligence interpersonnelle (100% collaboration RIASEC), capacité innée de transmission pédagogique et aisance dans la gestion des environnements complexes.',
    keyStrengths: [
      'Expertise spatiale & temporelle (wayfinding, repères urbains, eye-tracking Tobii)',
      'Leadership bienveillant & gestion d\'équipes variées (18 à 60 ans, ouvriers, étudiants)',
      'Résistance au stress et gestion des imprévus opérationnels (chantiers TP)',
      'Maîtrise des protocoles scientifiques, stats (R, JASP) et modélisation cognitive (Codex)',
      'Forte adhésion aux valeurs de bienveillance, impact social et équilibre de vie'
    ],
    codexInsights: [
      'Expertise sur les 4 quadrants du Codex : Gestion du trop-plein d\'info, comblement de sens, raccourcis d\'action et rétention mnésique.',
      'Sensibilité particulière aux biais d\'ancrage, disponibilité heuristique et cadrage dans la prise de décision sur site et en recherche.'
    ]
  },

  nodes: [
    // ==========================================
    // 1. EXPÉRIENCES & FORMATIONS
    // ==========================================
    {
      id: 'exp-sncf',
      name: 'Recherche Cognition & Orientation (SNCF)',
      category: 'experience',
      period: 'Avril 2019 – Sept 2019',
      startYear: 2019,
      endYear: 2019,
      institutionOrContext: 'SNCF, Direction Innovation et Recherche (Paris)',
      role: 'Chercheur en Cognition Spatiale',
      description: 'Projet « Orientation enrichie » sous la direction de Céline Durupt & Simone Morgagni. Étude de l\'utilisation des points de repères spatiaux lors de parcours en gare pour concevoir une catégorisation cognitive des repères.',
      missions: [
        'Conception et passation de 3 protocoles expérimentaux avec 160 participants',
        'Analyse des trajectoires piétonnes et points de fixation visuelle',
        'Rédaction de rapports de synthèse pour la signalétique et le wayfinding ferroviaire'
      ],
      cognitiveEfforts: [
        'Modélisation de la cognition spatiale et des représentations mentales urbaines',
        'Traitement statistique de données volumineuses sur R et JASP',
        'Vulgarisation auprès des équipes produit et design'
      ],
      x: 160,
      y: 130
    },
    {
      id: 'exp-catie',
      name: 'Recherche Itinéraire en Milieu Clos (CATIE)',
      category: 'experience',
      period: 'Mars 2018 – Sept 2018',
      startYear: 2018,
      endYear: 2018,
      institutionOrContext: 'Association CATIE (Bordeaux)',
      role: 'Chercheur Cognitif (Eye-Tracking & Itinéraire)',
      description: 'Projet « Cognition spatiale et optimisation de la recherche d\'itinéraire », sous la direction de Lisa Creno & Florian Larrue. Évaluation des stratégies de marche en milieu clos via eye-tracking.',
      missions: [
        'Revue de littérature approfondie en cognition spatiale',
        'Mise en place de 3 expériences avec 60 participants (mesures Tobii / OpenSesame)',
        'Formulation de recommandations d\'optimisation pour les clients partenaires'
      ],
      cognitiveEfforts: [
        'Analyse fine de l\'attention visuelle et des saccades oculaires',
        'Interfaçage matériel eye-tracking et logiciels de psychologie expérimentale'
      ],
      x: 160,
      y: 310
    },
    {
      id: 'exp-m2-cognition',
      name: 'Master 2 Évaluation Fonctionnement Cognitif',
      category: 'formation',
      period: '2017 – 2019',
      startYear: 2017,
      endYear: 2019,
      institutionOrContext: 'Université Paul Valéry 3 Montpellier',
      role: 'Étudiant Chercheur (Dir. Pom Charras)',
      description: 'Diplômé avec mention. Spécialité évaluation du fonctionnement cognitif et des comportements en situation complexe. Travaux de recherche sur l\'attention spatio-temporelle et création d\'outils d\'évaluation psychométrique.',
      missions: [
        'Mémoire M2 : « Attention spatiale & temporelle : Une préférence ? » (Inhibition attentionnelle)',
        'Mémoire M1 : « Création d\'un outil d\'évaluation unifié de la préparation temporelle »',
        'Étude : « L\'influence de la pratique des jeux vidéo sur l\'orientation de l\'attention »',
        'Étude : « L\'orientation endogène de l\'attention visuelle temporelle et spatiale »'
      ],
      cognitiveEfforts: [
        'Conception de protocoles sous E-Prime et OpenSesame',
        'Modélisation statistique sous R et JASP',
        'Compréhension fine des architectures cognitives humaines'
      ],
      x: 160,
      y: 490
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
      missions: [
        'Vulgarisation scientifique et soutien méthodologique',
        'Adaptation du discours à des profils intergénérationnels très variés',
        'Participation aux réunions de gouvernance budgétaire et amélioration des maquettes'
      ],
      cognitiveEfforts: [
        'Pédagogie active et régulation de dynamiques de groupe',
        'Médiation et diplomatie institutionnelle'
      ],
      x: 160,
      y: 670
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
      missions: [
        'Planification opérationnelle et suivi des sous-traitants',
        'Accueil chantier, causeries sécurité, respect des protocoles SST & AIPR',
        'Interface clients (collectivités, concessionnaires), riverains et fournisseurs',
        'Gestion logistique du dépôt annexe'
      ],
      cognitiveEfforts: [
        'Coordination multi-acteurs sous forte contrainte temporelle',
        'Prise de décision rapide face aux aléas de voirie et de terrassement',
        'Transposition de la rigueur d\'analyse vers la rentabilité de chantier'
      ],
      x: 160,
      y: 850
    },
    {
      id: 'exp-lherm-colas',
      name: 'Chantiers VRD & Enrobés (LHERM TP / COLAS)',
      category: 'experience',
      period: '2022 – 2023',
      startYear: 2022,
      endYear: 2023,
      institutionOrContext: 'LHERM TP Midi Pyrénées & COLAS (Sète / Toulouse)',
      role: 'Aide Conducteur / Aide Chef de Chantier',
      description: 'Chantiers de voirie, réseaux divers, terrassements et pose d\'enrobés. Vérification et ajustement des métrés, côtes de nivellement, budgets et plannings.',
      missions: [
        'Vérification des métrés et côtes d\'implantation topographique',
        'Contrôle sécurité, premiers secours et gestion des équipes en roulement',
        'Suivi du budget de production et tenue des délais contractuels'
      ],
      cognitiveEfforts: [
        'Projection spatiale 3D et lecture critique de plans d\'exécution',
        'Gestion de la fatigue et de la concentration en milieu à risque'
      ],
      x: 160,
      y: 1030
    },
    {
      id: 'exp-sti2d-afpa',
      name: 'Formation STI2D SIN & AFPA Conducteur TP',
      category: 'formation',
      period: '2013 & 2023',
      startYear: 2013,
      endYear: 2023,
      institutionOrContext: 'Lycée Joliot Curie (Sète) & AFPA Palays (Toulouse)',
      role: 'Apprenant Technique & Gestion de Projet',
      description: 'Bac STI2D option Systèmes d\'Information et Numérique (2013), suivi du Titre Professionnel Conducteur de Travaux TP à l\'AFPA (2023, réalisation de 4 projets complets VRD, SST & AIPR encadrant).',
      missions: [
        'Montage contractuel et financier de 4 dossiers de consultation d\'entreprises',
        'Culture informatique, électronique et systèmes numériques',
        'Certifications SST (Sauveteur Secouriste) & AIPR Encadrant'
      ],
      cognitiveEfforts: [
        'Pensée logique, algorithmique et modélisation financière'
      ],
      x: 160,
      y: 1210
    },

    // ==========================================
    // 2. COMPÉTENCES DÉCOMPOSÉES (SKILLS)
    // ==========================================
    {
      id: 'skill-cognition-spatiale',
      name: 'Cognition Spatiale & Wayfinding',
      category: 'skill_tech',
      baseMastery: 96,
      acquiredYear: 2018,
      lastPracticedYear: 2024,
      halfLifeYears: 7,
      decayFactor: 0.12,
      transferabilityScore: 9.5,
      description: 'Compréhension approfondie des mécanismes d\'orientation humaine, traitement des points de repères, cartes cognitives et comportement piéton.',
      subSkills: ['Repères visuels', 'Stratégies de marche', 'Navigation en milieu clos', 'Orientation spatiale 3D'],
      x: 440,
      y: 130
    },
    {
      id: 'skill-eye-tracking',
      name: 'Eye-Tracking & Outils Expérimentaux',
      category: 'skill_tech',
      baseMastery: 92,
      acquiredYear: 2018,
      lastPracticedYear: 2020,
      halfLifeYears: 5,
      decayFactor: 0.35,
      transferabilityScore: 8.5,
      description: 'Mise en œuvre d\'oculomètres Tobii, programmation sous OpenSesame et E-Prime pour mesurer fixations, saccades et temps de réaction.',
      subSkills: ['Matériel Tobii', 'Scripts OpenSesame', 'Protocoles E-Prime', 'Pupillométrie & Saccades'],
      x: 440,
      y: 270
    },
    {
      id: 'skill-stats-r',
      name: 'Statistiques Appliquées & Modélisation (R / JASP)',
      category: 'skill_tech',
      baseMastery: 88,
      acquiredYear: 2017,
      lastPracticedYear: 2021,
      halfLifeYears: 4.5,
      decayFactor: 0.45,
      transferabilityScore: 9.0,
      description: 'Analyse inférentielle, tests d\'hypothèses, ANOVA, régressions et traitement de données expérimentales sous R et JASP.',
      subSkills: ['Scripting R', 'Analyses factorielles', 'Visualisation de données', 'Modèles statistiques'],
      x: 440,
      y: 410
    },
    {
      id: 'skill-biais-cognitifs',
      name: 'Diagnostic des Biais Cognitifs & Heuristiques',
      category: 'skill_transversal',
      baseMastery: 94,
      acquiredYear: 2016,
      lastPracticedYear: 2026,
      halfLifeYears: 10,
      decayFactor: 0.05,
      transferabilityScore: 10,
      description: 'Maîtrise du Codex des biais cognitifs (Buster Benson / Manoogian) : détection des distorsions d\'attention, de mémoire, de prise de décision et de sens.',
      subSkills: ['Codex 4 quadrants', 'Biais de confirmation & d\'ancrage', 'Heuristique de disponibilité', 'Facteurs humains'],
      x: 440,
      y: 550
    },
    {
      id: 'skill-pedagogie',
      name: 'Ingénierie Pédagogique & Vulgarisation',
      category: 'skill_relational',
      baseMastery: 92,
      acquiredYear: 2017,
      lastPracticedYear: 2025,
      halfLifeYears: 8,
      decayFactor: 0.1,
      transferabilityScore: 9.8,
      description: 'Capacité à transmettre des notions scientifiques complexes à des publics hétérogènes (18-60 ans, équipes terrain, clients), conception de supports et écoute active.',
      subSkills: ['Animation de groupe', 'Vulgarisation scientifique', 'Feedback constructif', 'Accompagnement individuel'],
      x: 440,
      y: 690
    },
    {
      id: 'skill-gestion-chantier',
      name: 'Pilotage de Chantier & VRD / Génie Civil',
      category: 'skill_tech',
      baseMastery: 90,
      acquiredYear: 2022,
      lastPracticedYear: 2024,
      halfLifeYears: 6,
      decayFactor: 0.15,
      transferabilityScore: 8.8,
      description: 'Coordination d\'équipes travaux, gestion des sous-traitants, métrés, planification Gantt, budget et réception des ouvrages de réseaux secs.',
      subSkills: ['Métrés & Topographie', 'Planning Gantt', 'Coordination sous-traitance', 'Gestion dépôt & stocks'],
      x: 440,
      y: 830
    },
    {
      id: 'skill-securite-sst',
      name: 'Sécurité Opérationnelle, SST & AIPR Encadrant',
      category: 'skill_transversal',
      baseMastery: 95,
      acquiredYear: 2022,
      lastPracticedYear: 2025,
      halfLifeYears: 5,
      decayFactor: 0.1,
      transferabilityScore: 9.0,
      description: 'Réglementation anti-endommagement de réseaux (AIPR), sauvetage secourisme du travail (SST), culture de prévention des risques et accueil sécurité.',
      subSkills: ['Réglementation AIPR', 'Gestes d\'urgence SST', 'Évaluation des risques professionnels', 'Causeries sécurité'],
      x: 440,
      y: 970
    },
    {
      id: 'skill-collaboration-ecoute',
      name: 'Médiation Relationnelle & Écoute Empathique',
      category: 'skill_relational',
      baseMastery: 98,
      acquiredYear: 2015,
      lastPracticedYear: 2026,
      halfLifeYears: 12,
      decayFactor: 0.02,
      transferabilityScore: 10,
      description: 'Qualités humaines exceptionnelles (100% RIASEC Social & Collaboration). Création d\'ambiance bienveillante, diplomatie, gestion de conflits et soutien des pairs.',
      subSkills: ['Écoute active', 'Création de confiance', 'Résolution diplomatique de conflits', 'Intelligence relationnelle'],
      x: 440,
      y: 1110
    },
    {
      id: 'skill-russe',
      name: 'Langue Russe (Cyrillique & Bases)',
      category: 'skill_transversal',
      baseMastery: 75,
      acquiredYear: 2016,
      lastPracticedYear: 2018,
      halfLifeYears: 3.5,
      decayFactor: 0.65,
      isReactivated: false,
      transferabilityScore: 7.2,
      description: 'Apprentissage de l\'alphabet cyrillique, notions de grammaire casuelle et phonétique. Compétence en veille nécessitant une brève immersion pour pleine réactivation.',
      subSkills: ['Lecture cyrillique', 'Grammaire casuelle', 'Vocabulaire de base', 'Gymnastique mnésique'],
      x: 440,
      y: 1250
    },

    // ==========================================
    // 3. CAPACITÉS COGNITIVES MÉTA (CAPACITIES)
    // ==========================================
    {
      id: 'cap-spatial-syst',
      name: 'Modélisation Spatio-Temporelle & Wayfinding',
      category: 'capacity_cognitive',
      level: 'expert',
      cognitiveDimension: 'Spatial & Abstraction',
      description: 'Capacité à se projeter mentalement dans des environnements 3D, à anticiper les flux, les points de repères et les dynamiques de déplacement complexes.',
      underlyingSkills: ['Cognition Spatiale', 'Lecture de Plans', 'Eye-tracking', 'Métrés'],
      x: 740,
      y: 220
    },
    {
      id: 'cap-pedago-trans',
      name: 'Pédagogie Différenciée & Transmission Empathique',
      category: 'capacity_cognitive',
      level: 'expert',
      cognitiveDimension: 'Humain & Médiation',
      description: 'Aptitude à décoder les besoins cognitifs de l\'interlocuteur (qu\'il soit jeune étudiant, ouvrier ou adulte en reconversion) et à adapter le niveau d\'explication avec bienveillance.',
      underlyingSkills: ['Ingénierie Pédagogique', 'Écoute Empathique', 'Vulgarisation', 'Codex Biais'],
      x: 740,
      y: 460
    },
    {
      id: 'cap-arbitrage-stress',
      name: 'Arbitrage Rapide & Décision Sous Contrainte Terrain',
      category: 'capacity_cognitive',
      level: 'avancé',
      cognitiveDimension: 'Adaptabilité & Imprévus',
      description: 'Capacité à évaluer les risques en direct face aux aléas de chantier ou d\'expérimentation, à maintenir son calme et à réajuster les ressources sans panique.',
      underlyingSkills: ['Pilotage de Chantier', 'Sécurité SST/AIPR', 'Biais Cognitifs', 'Gestion du stress'],
      x: 740,
      y: 700
    },
    {
      id: 'cap-rigueur-scientifique',
      name: 'Rigueur Méthodologique & Pensée Analytique',
      category: 'capacity_cognitive',
      level: 'expert',
      cognitiveDimension: 'Raisonnement & Analyse',
      description: 'Sens aigu du protocole, de la preuve statistique et du discernement critique face aux données trompeuses ou aux biais de confirmation.',
      underlyingSkills: ['Statistiques R/JASP', 'Protocoles Expérimentaux', 'Codex Biais', 'Analyse des besoins'],
      x: 740,
      y: 940
    },
    {
      id: 'cap-coordination-humaine',
      name: 'Fédération d\'Équipes & Intelligence Collective',
      category: 'capacity_cognitive',
      level: 'expert',
      cognitiveDimension: 'Coordination & Systémique',
      description: 'Facilité à créer de la cohésion au sein de collectifs hétérogènes, à donner du sens aux actions partagées et à instaurer un climat de sécurité psychologique.',
      underlyingSkills: ['Médiation Relationnelle', 'Management Bienveillant', 'Coordination sous-traitance'],
      x: 740,
      y: 1180
    },

    // ==========================================
    // 4. HORIZONS & PASSERELLES (HORIZON JOBS)
    // ==========================================
    {
      id: 'job-k2102-coord-pedago',
      name: 'Coordinateur / Directrice Pédagogique (ROME K2102)',
      category: 'horizon_job',
      domain: 'Formation & Enseignement Supérieur',
      matchScore: 96,
      rationale: 'Alignement parfait avec le profil RIASEC Social-Investigateur (S-I) et l\'expérience confirmée de tutorat universitaire (6 classes, 18-60 ans) croisée avec l\'ingénierie des sciences cognitives.',
      matchingSkills: ['Ingénierie Pédagogique', 'Écoute Empathique', 'Gestion de Projet Pédagogique', 'Vulgarisation Scientifique'],
      missingSkills: [
        {
          name: 'Cadre Réglementaire Qualiopi & CPF',
          importance: 'recommandée',
          learningBridge: 'Formation courte de 2 semaines aux référentiels de certification Qualiopi et gestion de centres de formation.'
        }
      ],
      unlockedOpportunities: [
        'Responsable pédagogique d\'organismes de formation',
        'Coordinateur de dispositifs d\'apprentissage pour adultes',
        'Directeur d\'études en école d\'ingénieurs ou université'
      ],
      description: 'Coordination des équipes d\'enseignants/formateurs, élaboration des maquettes pédagogiques et suivi bienveillant de la progression des apprenants.',
      x: 1040,
      y: 200
    },
    {
      id: 'job-m1508-conseil-carriere',
      name: 'Conseiller en Gestion de Carrière & Talents (ROME M1508)',
      category: 'horizon_job',
      domain: 'Ressources Humaines & Bilan de Compétences',
      matchScore: 94,
      rationale: 'La combinaison de votre Master 2 en Évaluation du Fonctionnement Cognitif et de votre score de 100% en Écoute & Relation fait de vous un expert naturel du diagnostic de capital humain.',
      matchingSkills: ['Évaluation Cognition & Profils', 'Médiation Relationnelle', 'Diagnostic de Biais', 'Écoute Active'],
      missingSkills: [
        {
          name: 'Outils Psychotechniques d\'Entreprise & SIRH',
          importance: 'recommandée',
          learningBridge: 'Certification Praticien MBTI / SOSIE ou maîtrise d\'un progiciel SIRH de GPEC.'
        }
      ],
      unlockedOpportunities: [
        'Consultant en mobilité professionnelle et bilans de compétences',
        'Talent Manager en organisation agile',
        'Conseiller en évolution et reconversion professionnelle'
      ],
      description: 'Accompagnement des salariés dans leur trajectoire professionnelle, révélation des talents cachés et co-construction de projets épanouissants.',
      x: 1040,
      y: 440
    },
    {
      id: 'job-ergonome-facteurs-humains',
      name: 'Ergonome Facteurs Humains & Mobilités (SNCF / Smart City)',
      category: 'horizon_job',
      domain: 'Ingénierie Cognitive & Transports',
      matchScore: 95,
      rationale: 'Filiation directe avec vos travaux de recherche SNCF (« Orientation enrichie ») et CATIE (« Recherche d\'itinéraire »), combinés à votre compréhension physique des infrastructures (VRD/Chantiers).',
      matchingSkills: ['Cognition Spatiale & Wayfinding', 'Eye-tracking Tobii', 'Protocoles R/JASP', 'Connaissance des chantiers'],
      missingSkills: [
        {
          name: 'Normes d\'Accessibilité PMR Ferroviaire & Urbaine',
          importance: 'bonus',
          learningBridge: 'Sensibilisation aux normes STI PMR et design inclusif.'
        }
      ],
      unlockedOpportunities: [
        'Expert UX Research & Facteurs Humains en transports',
        'Chef de projet Signalétique & Expérience Voyageur',
        'Consultant en aménagement cognitif des gares et pôles multimodaux'
      ],
      description: 'Conception de dispositifs d\'orientation spatiale optimisés et sécurisés pour les usagers dans les infrastructures complexes.',
      x: 1040,
      y: 680
    },
    {
      id: 'job-qse-rse-chantier',
      name: 'Responsable QSE & Facteurs Humains de Sécurité',
      category: 'horizon_job',
      domain: 'Qualité Sécurité Environnement & RSE',
      matchScore: 89,
      rationale: 'Votre double regard (psychologie des biais décisionnels + expérience terrain SOBECA/COLAS SST & AIPR) offre une valeur inestimable pour transformer la sécurité au travail en culture partagée plutôt qu\'en contrainte administrative.',
      matchingSkills: ['Sécurité SST & AIPR', 'Détection des Biais (excès de confiance, conformisme)', 'Causeries de Sécurité', 'Coordination Terrain'],
      missingSkills: [
        {
          name: 'Normes ISO 45001 / ISO 14001',
          importance: 'recommandée',
          learningBridge: 'Formation auditeur interne QSE / RSE (3 jours).'
        }
      ],
      unlockedOpportunities: [
        'Responsable Prévention & Facteurs Humains dans les TP / Industrie',
        'Chargé de mission RSE et Qualité de Vie au Travail (QVT)',
        'Formateur Santé & Sécurité au Travail spécialisé biais de vigilance'
      ],
      description: 'Pilotage de la prévention des risques professionnels par la prise en compte des biais cognitifs et de la réalité opérationnelle du chantier.',
      x: 1040,
      y: 920
    },
    {
      id: 'job-mediateur-scientifique',
      name: 'Médiateur Scientifique & Formateur Esprit Critique',
      category: 'horizon_job',
      domain: 'Culture Scientifique & Sensibilisation',
      matchScore: 93,
      rationale: 'Passion pour le Codex des Biais Cognitifs, aisance oratoire démontrée en tutorat universitaire et volonté d\'éveiller l\'esprit critique et l\'autonomie intellectuelle.',
      matchingSkills: ['Codex Biais Cognitifs', 'Vulgarisation', 'Animation Interactive', 'Écoute'],
      missingSkills: [
        {
          name: 'Techniques de Gamification & Théâtre Forum',
          importance: 'bonus',
          learningBridge: 'Atelier de médiation par le jeu ou mise en situation théâtrale.'
        }
      ],
      unlockedOpportunities: [
        'Concepteur d\'ateliers de sensibilisation aux biais cognitifs pour entreprises',
        'Médiateur en musée scientifique ou tiers-lieu apprenant',
        'Intervenant en écoles d\'enseignement supérieur sur la décision rationnelle'
      ],
      description: 'Animation de conférences et d\'ateliers immersifs pour désamorcer les pièges de la pensée et promouvoir la rigueur intellectuelle.',
      x: 1040,
      y: 1160
    }
  ],

  edges: [
    // --- SNCF Links ---
    { id: 'e-sncf-spatial', source: 'exp-sncf', target: 'skill-cognition-spatiale', type: 'acquired_in', strength: 0.95, label: 'Orientation enrichie & repères' },
    { id: 'e-sncf-stats', source: 'exp-sncf', target: 'skill-stats-r', type: 'acquired_in', strength: 0.85, label: '160 participants analysés' },

    // --- CATIE Links ---
    { id: 'e-catie-eye', source: 'exp-catie', target: 'skill-eye-tracking', type: 'acquired_in', strength: 0.95, label: 'Mesures oculaires Tobii' },
    { id: 'e-catie-spatial', source: 'exp-catie', target: 'skill-cognition-spatiale', type: 'acquired_in', strength: 0.9, label: 'Itinéraires milieu clos' },

    // --- M2 Links ---
    { id: 'e-m2-biais', source: 'exp-m2-cognition', target: 'skill-biais-cognitifs', type: 'acquired_in', strength: 0.95, label: 'Recherches attention & biais' },
    { id: 'e-m2-stats', source: 'exp-m2-cognition', target: 'skill-stats-r', type: 'acquired_in', strength: 0.9, label: 'Analyses R & JASP' },
    { id: 'e-m2-russe', source: 'exp-m2-cognition', target: 'skill-russe', type: 'acquired_in', strength: 0.7, label: 'Période d\'apprentissage 2016' },

    // --- Tutorat UM3 Links ---
    { id: 'e-tut-pedago', source: 'exp-tutorat', target: 'skill-pedagogie', type: 'acquired_in', strength: 0.95, label: '6 classes de 30 étudiants' },
    { id: 'e-tut-relation', source: 'exp-tutorat', target: 'skill-collaboration-ecoute', type: 'acquired_in', strength: 0.95, label: 'Écoute & accompagnement 18-60 ans' },

    // --- SOBECA Links ---
    { id: 'e-sob-chantier', source: 'exp-sobeca', target: 'skill-gestion-chantier', type: 'acquired_in', strength: 0.95, label: '4 équipes réseau sec' },
    { id: 'e-sob-secu', source: 'exp-sobeca', target: 'skill-securite-sst', type: 'acquired_in', strength: 0.95, label: 'AIPR & SST sur site' },
    { id: 'e-sob-relation', source: 'exp-sobeca', target: 'skill-collaboration-ecoute', type: 'acquired_in', strength: 0.85, label: 'Management de proximité' },

    // --- LHERM / COLAS Links ---
    { id: 'e-col-chantier', source: 'exp-lherm-colas', target: 'skill-gestion-chantier', type: 'acquired_in', strength: 0.9, label: 'Métrés & enrobés' },
    { id: 'e-col-secu', source: 'exp-lherm-colas', target: 'skill-securite-sst', type: 'acquired_in', strength: 0.9, label: 'Sécurité voirie' },

    // --- Skills to Capacities ---
    { id: 'e-spat-cap', source: 'skill-cognition-spatiale', target: 'cap-spatial-syst', type: 'feeds_capacity', strength: 0.95, label: 'Alimente l\'abstraction spatiale' },
    { id: 'e-eye-cap', source: 'skill-eye-tracking', target: 'cap-spatial-syst', type: 'feeds_capacity', strength: 0.85, label: 'Alimente l\'attention visuelle' },
    
    { id: 'e-ped-cap', source: 'skill-pedagogie', target: 'cap-pedago-trans', type: 'feeds_capacity', strength: 0.95, label: 'Nourrit la transmission empathique' },
    { id: 'e-rel-cap', source: 'skill-collaboration-ecoute', target: 'cap-pedago-trans', type: 'feeds_capacity', strength: 0.9, label: 'Sensibilité humaine' },
    
    { id: 'e-cha-cap', source: 'skill-gestion-chantier', target: 'cap-arbitrage-stress', type: 'feeds_capacity', strength: 0.9, label: 'Gestion des aléas' },
    { id: 'e-sec-cap', source: 'skill-securite-sst', target: 'cap-arbitrage-stress', type: 'feeds_capacity', strength: 0.9, label: 'Vigilance & prévention' },
    
    { id: 'e-sta-cap', source: 'skill-stats-r', target: 'cap-rigueur-scientifique', type: 'feeds_capacity', strength: 0.95, label: 'Méthode scientifique' },
    { id: 'e-bia-cap', source: 'skill-biais-cognitifs', target: 'cap-rigueur-scientifique', type: 'feeds_capacity', strength: 0.9, label: 'Critique des biais' },
    
    { id: 'e-rel-coor', source: 'skill-collaboration-ecoute', target: 'cap-coordination-humaine', type: 'feeds_capacity', strength: 0.95, label: 'Fédération d\'équipe' },
    { id: 'e-cha-coor', source: 'skill-gestion-chantier', target: 'cap-coordination-humaine', type: 'feeds_capacity', strength: 0.85, label: 'Coordination terrain' },

    // --- Capacities to Horizons ---
    { id: 'e-cap-k2102', source: 'cap-pedago-trans', target: 'job-k2102-coord-pedago', type: 'unlocks_horizon', strength: 0.95, label: 'Débloque K2102' },
    { id: 'e-coor-k2102', source: 'cap-coordination-humaine', target: 'job-k2102-coord-pedago', type: 'unlocks_horizon', strength: 0.9, label: 'Gestion d\'équipe éducative' },
    
    { id: 'e-cap-m1508', source: 'cap-pedago-trans', target: 'job-m1508-conseil-carriere', type: 'unlocks_horizon', strength: 0.92, label: 'Débloque M1508' },
    { id: 'e-rig-m1508', source: 'cap-rigueur-scientifique', target: 'job-m1508-conseil-carriere', type: 'unlocks_horizon', strength: 0.88, label: 'Évaluation psychométrique' },
    
    { id: 'e-spat-ergo', source: 'cap-spatial-syst', target: 'job-ergonome-facteurs-humains', type: 'unlocks_horizon', strength: 0.95, label: 'Ergonomie cognitive' },
    { id: 'e-rig-ergo', source: 'cap-rigueur-scientifique', target: 'job-ergonome-facteurs-humains', type: 'unlocks_horizon', strength: 0.9, label: 'UX Research Mobilités' },
    
    { id: 'e-arb-qse', source: 'cap-arbitrage-stress', target: 'job-qse-rse-chantier', type: 'unlocks_horizon', strength: 0.92, label: 'Prévention terrain' },
    { id: 'e-bia-qse', source: 'cap-rigueur-scientifique', target: 'job-qse-rse-chantier', type: 'unlocks_horizon', strength: 0.88, label: 'Facteurs humains sécurité' },
    
    { id: 'e-ped-med', source: 'cap-pedago-trans', target: 'job-mediateur-scientifique', type: 'unlocks_horizon', strength: 0.95, label: 'Médiation scientifique' }
  ]
};
