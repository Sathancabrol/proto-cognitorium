import { CognitiveProfile } from '../types';

// ============================================================================
// PROFIL 1 : NÄTHAN CABROL (Master Sciences Cognitives & Génie Civil / VRD)
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
        code: 'K2102',
        title: 'Coordinateur / Coordinatrice Pédagogique',
        matchScore: 96,
        description: 'Liaison entre apprenants, formateurs et programmes éducatifs. Conception de parcours et supervision pédagogique.'
      },
      {
        code: 'M1508',
        title: 'Conseiller en Gestion de Carrière & Talents',
        matchScore: 94,
        description: 'Évaluation des compétences, bilans de parcours, plans de formation continue et accompagnement du développement individuel.'
      },
      {
        code: 'H1523 / M1413',
        title: 'Responsable QSE & Facteurs Humains de Sécurité',
        matchScore: 89,
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
      verificationStatus: 'verified',
      confidenceScore: 98,
      evidence: [
        { id: 'ev-1', source: 'cv', label: 'Rapport de recherche SNCF Innovation', confidenceScore: 98, date: '2019' },
        { id: 'ev-2', source: 'diploma', label: 'Validation stage Master 2 recherche', confidenceScore: 99, date: '2019' }
      ],
      missions: [
        'Conception et passation de 3 protocoles expérimentaux avec 160 participants',
        'Analyse des trajectoires piétonnes et points de fixation visuelle',
        'Rédaction de rapports de synthèse pour la signalétique et le wayfinding ferroviaire'
      ],
      detailedMissions: [
        {
          id: 'm-sncf-1',
          title: 'Conception expérimentale & passation de tests',
          actions: ['Recrutement de 160 participants', 'Paramétrage des scénarios de déplacement en gare', 'Passation standardisée'],
          cognitiveLoad: 'élevée'
        },
        {
          id: 'm-sncf-2',
          title: 'Analyse statistique et modélisation cognitive',
          actions: ['Extraction des flux de regard', 'Calcul d\'inhibition spatiale sous R', 'Synthèse design'],
          cognitiveLoad: 'élevée'
        }
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
      verificationStatus: 'verified',
      confidenceScore: 96,
      evidence: [
        { id: 'ev-3', source: 'cv', label: 'Stage M1 recherche CATIE', confidenceScore: 96, date: '2018' }
      ],
      missions: [
        'Revue de littérature approfondie en cognition spatiale',
        'Mise en place de 3 expériences avec 60 participants (mesures Tobii / OpenSesame)',
        'Formulation de recommandations d\'optimisation pour les clients partenaires'
      ],
      detailedMissions: [
        {
          id: 'm-catie-1',
          title: 'Expérimentation eye-tracking Tobii',
          actions: ['Calibrage optique', 'Enregistrement des fixations oculaires', 'Cartographie des zones d\'intérêt (AOI)'],
          cognitiveLoad: 'élevée'
        }
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
      verificationStatus: 'verified',
      confidenceScore: 100,
      evidence: [
        { id: 'ev-4', source: 'diploma', label: 'Diplôme d\'État Master 2 - Université Paul Valéry', confidenceScore: 100, date: '2019' }
      ],
      missions: [
        'Mémoire M2 : « Attention spatiale & temporelle : Une préférence ? »',
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
      verificationStatus: 'verified',
      confidenceScore: 95,
      evidence: [
        { id: 'ev-5', source: 'declaration', label: 'Contrat tutorat universitaire & Procès verbal d\'élection', confidenceScore: 95, date: '2019' }
      ],
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
      verificationStatus: 'verified',
      confidenceScore: 97,
      evidence: [
        { id: 'ev-6', source: 'cv', label: 'Contrat Conducteur Travaux SOBECA', confidenceScore: 97, date: '2024' },
        { id: 'ev-7', source: 'diploma', label: 'Habilitations AIPR Encadrant & SST à jour', confidenceScore: 100, date: '2024' }
      ],
      missions: [
        'Planification opérationnelle et suivi des sous-traitants',
        'Accueil chantier, causeries sécurité, respect des protocoles SST & AIPR',
        'Interface clients (collectivités, concessionnaires), riverains et fournisseurs',
        'Gestion logistique du dépôt annexe'
      ],
      detailedMissions: [
        {
          id: 'm-sobeca-1',
          title: 'Pilotage opérationnel de chantiers VRD',
          actions: ['Métrés sur site', 'Ordonnancement des engins', 'Suivi des cadences de terrassement'],
          cognitiveLoad: 'élevée'
        },
        {
          id: 'm-sobeca-2',
          title: 'Sécurité terrain et conformité réglementaire',
          actions: ['Animation des causeries sécurité', 'Contrôle du respect des plans DICT', 'Audit SST'],
          cognitiveLoad: 'modérée'
        }
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
      confidenceScore: 94,
      evidence: [
        { id: 'ev-8', source: 'cv', label: 'Expérience terrain ouvrier TP COLAS', confidenceScore: 94, date: '2022' }
      ],
      missions: [
        'Implantation altimétrique au niveau laser et théodolite',
        'Terrassement et pose de réseaux sous contrainte de pente',
        'Entraide et esprit d\'équipe sur site'
      ],
      cognitiveEfforts: [
        'Visualisation dans l\'espace des cotes de pente et d\'écoulement',
        'Endurance et rigueur d\'exécution géométrique'
      ],
      x: 160,
      y: 1030
    },

    // ==========================================
    // 2. COMPÉTENCES (SKILLS)
    // ==========================================
    {
      id: 'skill-cognition-spatiale',
      name: 'Cognition Spatiale & Modélisation Wayfinding',
      category: 'skill_tech',
      baseMastery: 95,
      acquiredYear: 2018,
      lastPracticedYear: 2025,
      halfLifeYears: 8,
      decayFactor: 0.05,
      transferabilityScore: 9.5,
      verificationStatus: 'verified',
      confidenceScore: 97,
      evidence: [{ id: 'ev-s1', source: 'diploma', label: 'Publications & Mémoires M1/M2', confidenceScore: 97 }],
      description: 'Compréhension et modélisation de la façon dont l\'esprit humain perçoit, encode et navigue dans les espaces 2D/3D (repères visuels, points de choix, cartes cognitives).',
      subSkills: ['Wayfinding ferroviaire & urbain', 'Cartographie mentale', 'Eye-tracking visuel', 'Signalétique cognitive'],
      x: 440,
      y: 130
    },
    {
      id: 'skill-eye-tracking',
      name: 'Eye-Tracking & Analyse Attentionnelle (Tobii)',
      category: 'skill_tech',
      baseMastery: 90,
      acquiredYear: 2018,
      lastPracticedYear: 2020,
      halfLifeYears: 4.5,
      decayFactor: 0.35,
      transferabilityScore: 8.2,
      verificationStatus: 'verified',
      confidenceScore: 92,
      evidence: [{ id: 'ev-s2', source: 'project', label: 'Protocoles CATIE & SNCF Tobii Glass', confidenceScore: 92 }],
      description: 'Mise en œuvre d\'équipements de suivi du regard (Tobii Studio/Glasses), extraction des fixations, saccades, cartes de chaleur et analyse des zones d\'intérêt (AOI).',
      subSkills: ['Calibration Tobii', 'Cartes de chaleur AOI', 'Synchronisation temporelle', 'Filtrage de bruit oculaire'],
      x: 440,
      y: 270
    },
    {
      id: 'skill-stats-r-jasp',
      name: 'Statistiques Expérimentales & Logiciels (R, JASP)',
      category: 'skill_tech',
      baseMastery: 88,
      acquiredYear: 2017,
      lastPracticedYear: 2024,
      halfLifeYears: 5.5,
      decayFactor: 0.18,
      transferabilityScore: 9.0,
      verificationStatus: 'verified',
      confidenceScore: 94,
      evidence: [{ id: 'ev-s3', source: 'diploma', label: 'Traitement de données 160 sujets SNCF', confidenceScore: 94 }],
      description: 'Analyses de variance (ANOVA), régressions, statistiques bayésiennes sur JASP et scripts d\'automatisation de traitement de données sous R.',
      subSkills: ['ANOVA multi-facteurs', 'Stats Bayésiennes (JASP)', 'Scripts R data-cleaning', 'Visualisation ggplot2'],
      x: 440,
      y: 410
    },
    {
      id: 'skill-biais-cognitifs',
      name: 'Détection des Biais Cognitifs & Codex',
      category: 'skill_transversal',
      baseMastery: 94,
      acquiredYear: 2016,
      lastPracticedYear: 2026,
      halfLifeYears: 10,
      decayFactor: 0.05,
      transferabilityScore: 10,
      verificationStatus: 'verified',
      confidenceScore: 98,
      evidence: [{ id: 'ev-s4', source: 'declaration', label: 'Expertise théorique et appliquée Codex', confidenceScore: 98 }],
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
      verificationStatus: 'verified',
      confidenceScore: 96,
      evidence: [{ id: 'ev-s5', source: 'declaration', label: 'Tutorat 6 classes universitaires', confidenceScore: 96 }],
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
      verificationStatus: 'verified',
      confidenceScore: 95,
      evidence: [{ id: 'ev-s6', source: 'cv', label: 'Chantiers SOBECA Toulouse', confidenceScore: 95 }],
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
      verificationStatus: 'verified',
      confidenceScore: 99,
      evidence: [{ id: 'ev-s7', source: 'diploma', label: 'Certificats AIPR & SST délivrés', confidenceScore: 100 }],
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
      verificationStatus: 'verified',
      confidenceScore: 98,
      evidence: [{ id: 'ev-s8', source: 'declaration', label: 'Test RIASEC Collaboration 100%', confidenceScore: 98 }],
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
      verificationStatus: 'verified',
      confidenceScore: 85,
      evidence: [{ id: 'ev-s9', source: 'declaration', label: 'Pratique universitaire autodidacte', confidenceScore: 85 }],
      description: 'Apprentissage de l\'alphabet cyrillique, notions de grammaire casuelle et phonétique. Compétence en veille nécessitant une brève immersion pour pleine réactivation.',
      subSkills: ['Lecture cyrillique', 'Grammaire casuelle', 'Vocabulaire de base', 'Gymnastique mnésique'],
      x: 440,
      y: 1250
    },
    {
      id: 'skill-inferred-gis',
      name: 'Analyse Spatiale & SIG (Systèmes d\'Information Géographique)',
      category: 'skill_tech',
      baseMastery: 82,
      acquiredYear: 2020,
      lastPracticedYear: 2025,
      halfLifeYears: 5,
      decayFactor: 0.12,
      transferabilityScore: 9.1,
      verificationStatus: 'pending',
      confidenceScore: 88,
      evidence: [{ id: 'ev-s10', source: 'ai_inference', label: 'Inféré à partir de la recherche spatiale SNCF & métrés VRD', confidenceScore: 88 }],
      description: 'Compétence inférée par l\'IA : capacité à exploiter des couches géographiques et plans de voirie pour modéliser des flux territoriaux.',
      subSkills: ['Lecture de couches SIG', 'Croisement spatial', 'Topologie de réseau'],
      x: 440,
      y: 1390
    },

    // ==========================================
    // 3. CAPACITÉS COGNITIVES MÉTA
    // ==========================================
    {
      id: 'cap-spatial-syst',
      name: 'Modélisation Spatio-Temporelle & Wayfinding',
      category: 'capacity_cognitive',
      level: 'expert',
      cognitiveDimension: 'Spatial & Abstraction',
      verificationStatus: 'verified',
      confidenceScore: 98,
      description: 'Capacité à se projeter mentalement dans des environnements 3D, à anticiper les flux, les points de repères et les dynamiques de déplacement complexes.',
      underlyingSkills: ['skill-cognition-spatiale', 'skill-eye-tracking', 'skill-gestion-chantier'],
      x: 740,
      y: 220
    },
    {
      id: 'cap-pedago-trans',
      name: 'Pédagogie Différenciée & Transmission Empathique',
      category: 'capacity_cognitive',
      level: 'expert',
      cognitiveDimension: 'Humain & Médiation',
      verificationStatus: 'verified',
      confidenceScore: 96,
      description: 'Aptitude à décoder les besoins cognitifs de l\'interlocuteur (qu\'il soit jeune étudiant, ouvrier ou adulte en reconversion) et à adapter le niveau d\'explication avec bienveillance.',
      underlyingSkills: ['skill-pedagogie', 'skill-collaboration-ecoute', 'skill-biais-cognitifs'],
      x: 740,
      y: 460
    },
    {
      id: 'cap-arbitrage-stress',
      name: 'Arbitrage Rapide & Décision Sous Contrainte Terrain',
      category: 'capacity_cognitive',
      level: 'avancé',
      cognitiveDimension: 'Adaptabilité & Imprévus',
      verificationStatus: 'verified',
      confidenceScore: 92,
      description: 'Capacité à évaluer les risques en direct face aux aléas de chantier ou d\'expérimentation, à maintenir son calme et à réajuster les ressources sans panique.',
      underlyingSkills: ['skill-gestion-chantier', 'skill-securite-sst', 'skill-biais-cognitifs'],
      x: 740,
      y: 700
    },
    {
      id: 'cap-rigueur-scientifique',
      name: 'Rigueur Méthodologique & Pensée Analytique',
      category: 'capacity_cognitive',
      level: 'expert',
      cognitiveDimension: 'Raisonnement & Analyse',
      verificationStatus: 'verified',
      confidenceScore: 97,
      description: 'Sens aigu du protocole, de la preuve statistique et du discernement critique face aux données trompeuses ou aux biais de confirmation.',
      underlyingSkills: ['skill-stats-r-jasp', 'skill-cognition-spatiale', 'skill-biais-cognitifs'],
      x: 740,
      y: 940
    },
    {
      id: 'cap-coordination-humaine',
      name: 'Fédération d\'Équipes & Intelligence Collective',
      category: 'capacity_cognitive',
      level: 'expert',
      cognitiveDimension: 'Coordination & Systémique',
      verificationStatus: 'verified',
      confidenceScore: 95,
      description: 'Facilité à créer de la cohésion au sein de collectifs hétérogènes, à donner du sens aux actions partagées et à instaurer un climat de sécurité psychologique.',
      underlyingSkills: ['skill-collaboration-ecoute', 'skill-pedagogie', 'skill-gestion-chantier'],
      x: 740,
      y: 1180
    },

    // ==========================================
    // 4. HORIZONS & PASSERELLES (ROME & BRIDGES)
    // ==========================================
    {
      id: 'job-k2102-coord-pedago',
      name: 'Coordinateur Pédagogique & Ingénieur Formation (ROME K2102)',
      category: 'horizon_job',
      domain: 'Formation & Enseignement Supérieur',
      romeCode: 'K2102',
      romeTitle: 'Coordination pédagogique',
      matchScore: 96,
      verificationStatus: 'verified',
      confidenceScore: 96,
      rationale: 'Alignement parfait avec le profil RIASEC Social-Investigateur (S-I) et l\'expérience confirmée de tutorat universitaire (6 classes, 18-60 ans) croisée avec l\'ingénierie des sciences cognitives.',
      matchingSkills: ['Ingénierie Pédagogique & Vulgarisation', 'Médiation Relationnelle & Écoute Empathique', 'Détection des Biais Cognitifs & Codex'],
      missingSkills: [
        {
          name: 'Cadre Réglementaire Qualiopi & Gestion CPF',
          importance: 'recommandée',
          learningBridge: 'Formation courte de 2 semaines aux référentiels de certification Qualiopi et gestion administrative des centres de formation.',
          recommendedTraining: {
            title: 'Certification Responsable de Dispositifs de Formation (Qualiopi)',
            providerOrType: 'Centre National de la Fonction Publique / FFP',
            duration: '35 heures (e-learning + atelier)',
            format: 'Certifiante',
            targetedSkill: 'Gestion Qualiopi'
          }
        }
      ],
      unlockedOpportunities: [
        'Responsable pédagogique d\'organismes de formation',
        'Coordinateur de dispositifs d\'apprentissage pour adultes',
        'Directeur d\'études en école d\'ingénieurs ou université'
      ],
      explainabilityFactors: {
        strengthPoints: [
          'Pratique avérée de l\'animation de classes hétérogènes (18-60 ans)',
          'Double maîtrise des sciences de l\'apprentissage et de la gestion de projet',
          'Aisance relationnelle (100% collaboration RIASEC)'
        ],
        riskPoints: ['Nécessite la prise en main rapide du jargon réglementaire de la formation professionnelle'],
        suggestedNextAction: 'Consulter un module de 3h de découverte Qualiopi pour valider l\'appétence.'
      },
      description: 'Coordination des équipes d\'enseignants/formateurs, élaboration des maquettes pédagogiques et suivi bienveillant de la progression des apprenants.',
      x: 1040,
      y: 200
    },
    {
      id: 'job-m1508-conseil-carriere',
      name: 'Conseiller en Gestion de Carrière & Talents (ROME M1508)',
      category: 'horizon_job',
      domain: 'Ressources Humaines & Bilan de Compétences',
      romeCode: 'M1508',
      romeTitle: 'Conseil en ressources humaines et mobilité',
      matchScore: 94,
      verificationStatus: 'verified',
      confidenceScore: 94,
      rationale: 'La combinaison de votre Master 2 en Évaluation du Fonctionnement Cognitif et de votre score de 100% en Écoute & Relation fait de vous un expert naturel du diagnostic de capital humain.',
      matchingSkills: ['Rigueur Méthodologique & Pensée Analytique', 'Médiation Relationnelle & Écoute Empathique', 'Détection des Biais Cognitifs & Codex'],
      missingSkills: [
        {
          name: 'Outils Psychotechniques d\'Entreprise & SIRH',
          importance: 'recommandée',
          learningBridge: 'Certification Praticien MBTI / SOSIE ou maîtrise d\'un progiciel SIRH de GPEC.',
          recommendedTraining: {
            title: 'Certification Évaluateur et Praticien Bilan de Compétences',
            providerOrType: 'AFPA / Centre National des Bilan de Compétences',
            duration: '40 heures',
            format: 'Certifiante',
            targetedSkill: 'Outils Psychotechniques'
          }
        }
      ],
      unlockedOpportunities: [
        'Consultant en mobilité professionnelle et bilans de compétences',
        'Talent Manager en organisation agile',
        'Conseiller en évolution et reconversion professionnelle'
      ],
      explainabilityFactors: {
        strengthPoints: ['Diplôme d\'État en évaluation psychologique & cognitive', 'Écoute empathique profonde'],
        riskPoints: ['Connaissance des conventions collectives d\'entreprise à consolider'],
        suggestedNextAction: 'Pratiquer 2 simulations de bilans de compétences pour éprouver la méthode.'
      },
      description: 'Accompagnement des salariés dans leur trajectoire professionnelle, révélation des talents cachés et co-construction de projets épanouissants.',
      x: 1040,
      y: 440
    },
    {
      id: 'job-ergonome-facteurs-humains',
      name: 'Ergonome Facteurs Humains & Mobilités (ROME M1402)',
      category: 'horizon_job',
      domain: 'Ingénierie Cognitive & Transports',
      romeCode: 'M1402',
      romeTitle: 'Conseil en organisation et management d\'entreprise (Facteurs Humains)',
      matchScore: 95,
      verificationStatus: 'verified',
      confidenceScore: 95,
      rationale: 'Filiation directe avec vos travaux de recherche SNCF (« Orientation enrichie ») et CATIE (« Recherche d\'itinéraire »), combinés à votre compréhension physique des infrastructures (VRD/Chantiers).',
      matchingSkills: ['Cognition Spatiale & Modélisation Wayfinding', 'Eye-Tracking & Analyse Attentionnelle (Tobii)', 'Statistiques Expérimentales & Logiciels (R, JASP)'],
      missingSkills: [
        {
          name: 'Normes d\'Accessibilité PMR Ferroviaire & Urbaine',
          importance: 'bonus',
          learningBridge: 'Sensibilisation aux normes STI PMR et principes de design inclusif.',
          recommendedTraining: {
            title: 'Accessibilité universelle et aménagements PMR',
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
      description: 'Conception de dispositifs d\'orientation spatiale optimisés et sécurisés pour les usagers dans les infrastructures complexes.',
      x: 1040,
      y: 680
    },
    {
      id: 'job-qse-rse-chantier',
      name: 'Responsable QSE & Facteurs Humains de Sécurité (ROME H1523)',
      category: 'horizon_job',
      domain: 'Qualité Sécurité Environnement & RSE',
      romeCode: 'H1523',
      romeTitle: 'Management et ingénierie qualité, sécurité, environnement',
      matchScore: 89,
      verificationStatus: 'verified',
      confidenceScore: 89,
      rationale: 'Votre double regard (psychologie des biais décisionnels + expérience terrain SOBECA/COLAS SST & AIPR) offre une valeur inestimable pour transformer la sécurité au travail en culture partagée.',
      matchingSkills: ['Sécurité Opérationnelle, SST & AIPR Encadrant', 'Pilotage de Chantier & VRD / Génie Civil', 'Détection des Biais Cognitifs & Codex'],
      missingSkills: [
        {
          name: 'Normes ISO 45001 / ISO 14001',
          importance: 'recommandée',
          learningBridge: 'Formation auditeur interne QSE / RSE (3 jours).',
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
      description: 'Pilotage de la prévention des risques professionnels par la prise en compte des biais cognitifs et de la réalité opérationnelle du chantier.',
      x: 1040,
      y: 920
    }
  ],

  edges: [
    // Connexions Expériences -> Compétences
    { id: 'e1', source: 'exp-sncf', target: 'skill-cognition-spatiale', type: 'acquired_in', strength: 0.95, label: 'Protocole recherche' },
    { id: 'e2', source: 'exp-sncf', target: 'skill-stats-r-jasp', type: 'acquired_in', strength: 0.9, label: 'Traitement données' },
    { id: 'e3', source: 'exp-catie', target: 'skill-eye-tracking', type: 'acquired_in', strength: 0.95, label: 'Mesures Tobii' },
    { id: 'e4', source: 'exp-catie', target: 'skill-cognition-spatiale', type: 'acquired_in', strength: 0.85, label: 'Itinéraires clos' },
    { id: 'e5', source: 'exp-m2-cognition', target: 'skill-biais-cognitifs', type: 'acquired_in', strength: 0.95, label: 'Master 2 Recherche' },
    { id: 'e6', source: 'exp-m2-cognition', target: 'skill-stats-r-jasp', type: 'acquired_in', strength: 0.9, label: 'Analyses statistiques' },
    { id: 'e7', source: 'exp-tutorat', target: 'skill-pedagogie', type: 'acquired_in', strength: 0.98, label: '6 classes encadrées' },
    { id: 'e8', source: 'exp-tutorat', target: 'skill-collaboration-ecoute', type: 'acquired_in', strength: 0.95, label: 'Médiation étudiants' },
    { id: 'e9', source: 'exp-sobeca', target: 'skill-gestion-chantier', type: 'acquired_in', strength: 0.95, label: 'Conduite de travaux' },
    { id: 'e10', source: 'exp-sobeca', target: 'skill-securite-sst', type: 'acquired_in', strength: 0.98, label: 'AIPR & SST' },
    { id: 'e11', source: 'exp-colas', target: 'skill-gestion-chantier', type: 'acquired_in', strength: 0.7, label: 'Terrain VRD' },

    // Connexions Compétences -> Capacités Méta
    { id: 'e12', source: 'skill-cognition-spatiale', target: 'cap-spatial-syst', type: 'feeds_capacity', strength: 0.95 },
    { id: 'e13', source: 'skill-eye-tracking', target: 'cap-spatial-syst', type: 'feeds_capacity', strength: 0.85 },
    { id: 'e14', source: 'skill-gestion-chantier', target: 'cap-spatial-syst', type: 'feeds_capacity', strength: 0.8 },
    { id: 'e15', source: 'skill-pedagogie', target: 'cap-pedago-trans', type: 'feeds_capacity', strength: 0.95 },
    { id: 'e16', source: 'skill-collaboration-ecoute', target: 'cap-pedago-trans', type: 'feeds_capacity', strength: 0.9 },
    { id: 'e17', source: 'skill-biais-cognitifs', target: 'cap-pedago-trans', type: 'feeds_capacity', strength: 0.8 },
    { id: 'e18', source: 'skill-gestion-chantier', target: 'cap-arbitrage-stress', type: 'feeds_capacity', strength: 0.9 },
    { id: 'e19', source: 'skill-securite-sst', target: 'cap-arbitrage-stress', type: 'feeds_capacity', strength: 0.9 },
    { id: 'e20', source: 'skill-biais-cognitifs', target: 'cap-arbitrage-stress', type: 'feeds_capacity', strength: 0.8 },
    { id: 'e21', source: 'skill-stats-r-jasp', target: 'cap-rigueur-scientifique', type: 'feeds_capacity', strength: 0.95 },
    { id: 'e22', source: 'skill-cognition-spatiale', target: 'cap-rigueur-scientifique', type: 'feeds_capacity', strength: 0.85 },
    { id: 'e23', source: 'skill-biais-cognitifs', target: 'cap-rigueur-scientifique', type: 'feeds_capacity', strength: 0.9 },
    { id: 'e24', source: 'skill-collaboration-ecoute', target: 'cap-coordination-humaine', type: 'feeds_capacity', strength: 0.98 },
    { id: 'e25', source: 'skill-pedagogie', target: 'cap-coordination-humaine', type: 'feeds_capacity', strength: 0.9 },

    // Connexions Capacités -> Horizons ROME
    { id: 'e26', source: 'cap-pedago-trans', target: 'job-k2102-coord-pedago', type: 'unlocks_horizon', strength: 0.96 },
    { id: 'e27', source: 'cap-coordination-humaine', target: 'job-k2102-coord-pedago', type: 'unlocks_horizon', strength: 0.9 },
    { id: 'e28', source: 'cap-rigueur-scientifique', target: 'job-m1508-conseil-carriere', type: 'unlocks_horizon', strength: 0.92 },
    { id: 'e29', source: 'cap-pedago-trans', target: 'job-m1508-conseil-carriere', type: 'unlocks_horizon', strength: 0.95 },
    { id: 'e30', source: 'cap-spatial-syst', target: 'job-ergonome-facteurs-humains', type: 'unlocks_horizon', strength: 0.97 },
    { id: 'e31', source: 'cap-rigueur-scientifique', target: 'job-ergonome-facteurs-humains', type: 'unlocks_horizon', strength: 0.9 },
    { id: 'e32', source: 'cap-arbitrage-stress', target: 'job-qse-rse-chantier', type: 'unlocks_horizon', strength: 0.92 },
    { id: 'e33', source: 'cap-coordination-humaine', target: 'job-qse-rse-chantier', type: 'unlocks_horizon', strength: 0.88 }
  ]
};

// ============================================================================
// PROFIL 2 : LÉA MARTIN (Étudiante Master Data Science & IA)
// ============================================================================
export const STUDENT_PROFILE: CognitiveProfile = {
  id: 'profile-lea-martin-student',
  personName: 'Léa Martin',
  headline: 'Étudiante Master 2 Data Science & IA • Aspirante Data Product Manager',
  coreMotto: 'Traduire la complexité des modèles algorithmiques en outils d’aide à la décision humaine.',
  location: 'Lyon (69000) • France',
  email: 'lea.martin.data@gmail.com',
  journeyType: 'student',
  currentSimulationYear: 2026,

  riasec: {
    social: 55,
    investigatif: 88,
    conventionnel: 72,
    entreprenant: 60,
    artistique: 48,
    realiste: 35,
    code: 'ICE',
    dominantSummary: 'Profil Investigateur-Conventionnel-Entreprenant : Rigueur mathématique & algorithmique (I: 88%), organisation méthodique des pipelines de données (C: 72%) et ambition de porter des projets orientés impact (E: 60%).'
  },

  matchMetiers: {
    workLifeBalance: 85,
    socialImpact: 80,
    remuneration: 75,
    collaborationScore: 85,
    adaptabilityScore: 90,
    agileOrgScore: 88,
    managerRoleScore: 70,
    topActivities: [
      { name: 'Modéliser & Coder', score: 92, stars: 5 },
      { name: 'Structurer des données', score: 88, stars: 5 },
      { name: 'Vulgariser les résultats', score: 78, stars: 4 }
    ],
    recommendedRomeCodes: [
      {
        code: 'M1805',
        title: 'Études et prospective systèmes d\'information (Data Product Manager)',
        matchScore: 93,
        description: 'Conception de solutions data adaptées aux besoins métiers.'
      },
      {
        code: 'M1403',
        title: 'Études et conseil en innovation data / IA',
        matchScore: 90,
        description: 'Accompagnement de la transformation technologique des organisations.'
      }
    ]
  },

  cognitiveSignature: {
    dominantReasoning: 'Pensée Algorithmique & Abstraction Structurée',
    transferabilityIndex: 91,
    learningVelocity: 'Exceptionnelle',
    adaptabilityIndex: 88,
    summaryText: 'Profil à haut potentiel analytique capable de faire la passerelle entre l\'ingénierie mathématique lourde et les besoins concrets des utilisateurs finaux.',
    keyStrengths: [
      'Apprentissage express de nouveaux frameworks et langages',
      'Structuration de données multidimensionnelles',
      'Sens de l\'éthique algorithmique et de l\'explicabilité'
    ]
  },

  nodes: [
    {
      id: 'exp-lea-master',
      name: 'Master 2 Data Science & IA (INSA Lyon)',
      category: 'formation',
      period: '2024 – 2026',
      startYear: 2024,
      endYear: 2026,
      institutionOrContext: 'INSA Lyon',
      role: 'Étudiante en Master 2',
      description: 'Projets d\'apprentissage profond (LLMs, Computer Vision), algorithmique distribuée et éthique des systèmes d\'IA.',
      verificationStatus: 'verified',
      confidenceScore: 100,
      evidence: [{ id: 'ev-l1', source: 'diploma', label: 'Attestation scolarité Master INSA', confidenceScore: 100 }],
      missions: [
        'Développement d\'un modèle d\'explicabilité de classification médicale',
        'Benchmarking de pipelines MLOps sur cloud souverain',
        'Animation d\'ateliers de découverte du code pour lycéennes'
      ],
      cognitiveEfforts: ['Raisonnement abstrait haut niveau', 'Optimisation sous contraintes de calcul'],
      x: 160,
      y: 200
    },
    {
      id: 'exp-lea-stage-analyst',
      name: 'Stage Data Analyst (HealthTech Lyon)',
      category: 'experience',
      period: 'Avril 2025 – Sept 2025',
      startYear: 2025,
      endYear: 2025,
      institutionOrContext: 'BioData Solutions',
      role: 'Stagiaire Data Analyst',
      description: 'Automatisation de tableaux de bord cliniques et analyse statistique de cohortes de patients.',
      verificationStatus: 'verified',
      confidenceScore: 96,
      evidence: [{ id: 'ev-l2', source: 'cv', label: 'Convention et attestation de stage', confidenceScore: 96 }],
      missions: ['Création de dashboards sous Streamlit & SQL', 'Nettoyage de données hétérogènes'],
      cognitiveEfforts: ['Rigueur de validation des données de santé'],
      x: 160,
      y: 400
    },
    {
      id: 'skill-lea-python-sql',
      name: 'Python, PyTorch & SQL Avancé',
      category: 'skill_tech',
      baseMastery: 92,
      acquiredYear: 2023,
      lastPracticedYear: 2026,
      halfLifeYears: 4,
      decayFactor: 0.05,
      transferabilityScore: 9.6,
      verificationStatus: 'verified',
      confidenceScore: 98,
      evidence: [{ id: 'ev-l3', source: 'project', label: 'Projets GitHub publics & Kaggle', confidenceScore: 98 }],
      description: 'Développement de modèles d\'IA, requêtage complexe et structuration de bases de données relationnelles.',
      subSkills: ['PyTorch', 'Pandas/Polars', 'PostgreSQL', 'Scikit-Learn'],
      x: 440,
      y: 200
    },
    {
      id: 'skill-lea-vulgarisation',
      name: 'Vulgarisation & Data Storytelling',
      category: 'skill_relational',
      baseMastery: 86,
      acquiredYear: 2024,
      lastPracticedYear: 2026,
      halfLifeYears: 7,
      decayFactor: 0.08,
      transferabilityScore: 9.4,
      verificationStatus: 'verified',
      confidenceScore: 90,
      evidence: [{ id: 'ev-l4', source: 'declaration', label: 'Présentations comités d\'entreprise', confidenceScore: 90 }],
      description: 'Capacité à transformer des métriques statistiques complexes en narratifs clairs pour les décideurs.',
      subSkills: ['Data Viz', 'Synthèse visuelle', 'Présentation orale'],
      x: 440,
      y: 400
    },
    {
      id: 'cap-lea-abstraction',
      name: 'Modélisation & Abstraction Mathématique',
      category: 'capacity_cognitive',
      level: 'expert',
      cognitiveDimension: 'Raisonnement & Analyse',
      verificationStatus: 'verified',
      confidenceScore: 95,
      description: 'Compréhension intuitive des structures mathématiques et des architectures d\'algorithmes.',
      underlyingSkills: ['skill-lea-python-sql'],
      x: 740,
      y: 250
    },
    {
      id: 'job-lea-data-pm',
      name: 'Data Product Manager (ROME M1805)',
      category: 'horizon_job',
      domain: 'Produit & Intelligence Artificielle',
      romeCode: 'M1805',
      romeTitle: 'Études et prospective systèmes d\'information',
      matchScore: 93,
      verificationStatus: 'verified',
      confidenceScore: 93,
      rationale: 'Double compétence rare : maîtrise technique du machine learning et grande capacité d\'écoute des besoins utilisateurs.',
      matchingSkills: ['Python, PyTorch & SQL Avancé', 'Vulgarisation & Data Storytelling'],
      missingSkills: [
        {
          name: 'Gestion de Produit Agile (Scrum/Kanban)',
          importance: 'recommandée',
          learningBridge: 'Certification Product Owner / Agile PSPO I.'
        }
      ],
      unlockedOpportunities: ['Lead Data Product Manager', 'Consultante IA Stratégique'],
      x: 1040,
      y: 300
    }
  ],
  edges: [
    { id: 'el-1', source: 'exp-lea-master', target: 'skill-lea-python-sql', type: 'acquired_in', strength: 0.95 },
    { id: 'el-2', source: 'exp-lea-stage-analyst', target: 'skill-lea-vulgarisation', type: 'acquired_in', strength: 0.9 },
    { id: 'el-3', source: 'skill-lea-python-sql', target: 'cap-lea-abstraction', type: 'feeds_capacity', strength: 0.95 },
    { id: 'el-4', source: 'cap-lea-abstraction', target: 'job-lea-data-pm', type: 'unlocks_horizon', strength: 0.93 }
  ]
};

// ============================================================================
// PROFIL 3 : THOMAS VALADIER (Adulte en Reconversion Transition Écologique)
// ============================================================================
export const TRANSITION_PROFILE: CognitiveProfile = {
  id: 'profile-thomas-transition',
  personName: 'Thomas Valadier',
  headline: 'Conducteur de Travaux (8 ans) en reconversion vers le BTP Bas Carbone & Rénovation Énergétique',
  coreMotto: 'Mettre 8 années de maîtrise opérationnelle du chantier au service de la transition écologique du bâtiment.',
  location: 'Bordeaux (33000) • France',
  email: 'thomas.valadier.btp@gmail.com',
  journeyType: 'transition',
  currentSimulationYear: 2026,

  riasec: {
    social: 62,
    investigatif: 74,
    conventionnel: 70,
    entreprenant: 65,
    artistique: 40,
    realiste: 85,
    code: 'RIC',
    dominantSummary: 'Profil Réaliste-Investigateur-Conventionnel : Pragmatisme de terrain très fort (R: 85%), intérêt poussé pour les solutions techniques bas carbone (I: 74%) et respect rigoureux des normes constructives (C: 70%).'
  },

  matchMetiers: {
    workLifeBalance: 75,
    socialImpact: 92,
    remuneration: 80,
    collaborationScore: 90,
    adaptabilityScore: 85,
    agileOrgScore: 82,
    managerRoleScore: 88,
    topActivities: [
      { name: 'Piloter des chantiers', score: 95, stars: 5 },
      { name: 'Évaluer l\'empreinte carbone', score: 85, stars: 4 },
      { name: 'Négocier avec les artisans', score: 90, stars: 5 }
    ],
    recommendedRomeCodes: [
      {
        code: 'F1106',
        title: 'Ingénieur Conseil en Rénovation Énergétique et Matériaux Biosourcés',
        matchScore: 95,
        description: 'Diagnostic thermique et pilotage de chantiers de décarbonation du bâti.'
      },
      {
        code: 'H1523',
        title: 'Auditeur RSE & Décarbonation du BTP',
        matchScore: 91,
        description: 'Accompagnement des entreprises de construction vers la neutralité carbone.'
      }
    ]
  },

  cognitiveSignature: {
    dominantReasoning: 'Pragmatisme Terrain & Transition Systémique',
    transferabilityIndex: 93,
    learningVelocity: 'Élevée',
    adaptabilityIndex: 90,
    summaryText: 'Expérience solide de la réalité des chantiers BTP, réorientée vers la mise en œuvre de matériaux biosourcés et l\'optimisation thermique.',
    keyStrengths: [
      'Connaissance intime des corps de métiers du bâtiment',
      'Sens de l\'économie circulaire et du réemploi des matériaux',
      'Leadership direct et respecté sur le terrain'
    ]
  },

  nodes: [
    {
      id: 'exp-thomas-btp-legacy',
      name: 'Conducteur de Travaux Principal (8 ans BTP)',
      category: 'experience',
      period: '2016 – 2024',
      startYear: 2016,
      endYear: 2024,
      institutionOrContext: 'Eiffage Construction Sud-Ouest',
      role: 'Conducteur de Travaux Gros Œuvre',
      description: 'Livraison de 12 opérations de logements collectifs et tertiaires (budgets de 3M€ à 15M€).',
      verificationStatus: 'verified',
      confidenceScore: 100,
      evidence: [{ id: 'ev-t1', source: 'cv', label: '8 ans d\'attestations employeur Eiffage', confidenceScore: 100 }],
      missions: ['Tenue des délais et budgets sous pénalités', 'Coordination de 30 ouvriers et sous-traitants'],
      cognitiveEfforts: ['Gestion du stress opérationnel et arbitrage budgétaire'],
      x: 160,
      y: 200
    },
    {
      id: 'exp-thomas-formation-eco',
      name: 'Titre Professionnel Référent Éco-Construction (2025)',
      category: 'formation',
      period: '2025 – 2026',
      startYear: 2025,
      endYear: 2026,
      institutionOrContext: 'FEEBAT & Institut Négawatt',
      role: 'Stagiaire Professionnel Adulte',
      description: 'Formation continue certifiante : Bilan Carbone RE2020, audit énergétique bâtiment et matériaux biosourcés (paille, chanvre, bois).',
      verificationStatus: 'verified',
      confidenceScore: 98,
      evidence: [{ id: 'ev-t2', source: 'diploma', label: 'Certificat Référent FEEBAT', confidenceScore: 98 }],
      missions: ['Audit thermique réel sur 2 chantiers témoins', 'Calcul ACV (Analyse de Cycle de Vie)'],
      cognitiveEfforts: ['Intégration rapide de nouvelles normes environnementales'],
      x: 160,
      y: 400
    },
    {
      id: 'skill-thomas-pilotage',
      name: 'Pilotage Économique & Ordonnancement de Chantier',
      category: 'skill_tech',
      baseMastery: 95,
      acquiredYear: 2016,
      lastPracticedYear: 2025,
      halfLifeYears: 8,
      decayFactor: 0.05,
      transferabilityScore: 9.5,
      verificationStatus: 'verified',
      confidenceScore: 99,
      evidence: [{ id: 'ev-t3', source: 'cv', label: 'Portefeuille de 12 opérations livrées', confidenceScore: 99 }],
      description: 'Maîtrise totale des cycles de chantier, des métrés et de la relation sous-traitants.',
      subSkills: ['Planning MS Project', 'Métrés', 'Négociation achats'],
      x: 440,
      y: 200
    },
    {
      id: 'skill-thomas-re2020',
      name: 'Réglementation RE2020 & Matériaux Biosourcés',
      category: 'skill_tech',
      baseMastery: 88,
      acquiredYear: 2025,
      lastPracticedYear: 2026,
      halfLifeYears: 5,
      decayFactor: 0.02,
      transferabilityScore: 9.0,
      verificationStatus: 'verified',
      confidenceScore: 95,
      evidence: [{ id: 'ev-t4', source: 'diploma', label: 'Certification RE2020', confidenceScore: 95 }],
      description: 'Calcul d\'impact carbone du mètre carré bâti et substitution de béton par des structures bois/paille.',
      subSkills: ['Audit ACV', 'Conduite de chantiers biosourcés', 'Isolation thermique par l\'extérieur'],
      x: 440,
      y: 400
    },
    {
      id: 'cap-thomas-conversion',
      name: 'Arbitrage Technique & Transition Énergétique Appliquée',
      category: 'capacity_cognitive',
      level: 'expert',
      cognitiveDimension: 'Coordination & Systémique',
      verificationStatus: 'verified',
      confidenceScore: 96,
      description: 'Capacité à convaincre les artisans traditionnels d\'adopter des méthodes constructives écologiques sans perte de rentabilité.',
      underlyingSkills: ['skill-thomas-pilotage', 'skill-thomas-re2020'],
      x: 740,
      y: 300
    },
    {
      id: 'job-thomas-chef-eco',
      name: 'Chef de Projet Rénovation Bas Carbone (ROME F1106)',
      category: 'horizon_job',
      domain: 'Transition Écologique & Construction Durable',
      romeCode: 'F1106',
      romeTitle: 'Ingénierie et études du BTP (Éco-rénovation)',
      matchScore: 95,
      verificationStatus: 'verified',
      confidenceScore: 95,
      rationale: 'L\'alliance parfaite entre 8 années de terrain concret et la maîtrise des nouvelles exigences environnementales RE2020.',
      matchingSkills: ['Pilotage Économique & Ordonnancement de Chantier', 'Réglementation RE2020 & Matériaux Biosourcés'],
      missingSkills: [
        {
          name: 'Logiciel Pleiades (Simulation Thermique Dynamique)',
          importance: 'bonus',
          learningBridge: 'Formation de 3 jours au logiciel de STD Pleiades.'
        }
      ],
      unlockedOpportunities: ['Directeur Rénovation Énergétique', 'Conseiller AMO Décarbonation'],
      x: 1040,
      y: 300
    }
  ],
  edges: [
    { id: 'et-1', source: 'exp-thomas-btp-legacy', target: 'skill-thomas-pilotage', type: 'acquired_in', strength: 0.98 },
    { id: 'et-2', source: 'exp-thomas-formation-eco', target: 'skill-thomas-re2020', type: 'acquired_in', strength: 0.95 },
    { id: 'et-3', source: 'skill-thomas-pilotage', target: 'cap-thomas-conversion', type: 'feeds_capacity', strength: 0.9 },
    { id: 'et-4', source: 'skill-thomas-re2020', target: 'cap-thomas-conversion', type: 'feeds_capacity', strength: 0.95 },
    { id: 'et-5', source: 'cap-thomas-conversion', target: 'job-thomas-chef-eco', type: 'unlocks_horizon', strength: 0.95 }
  ]
};

export const INITIAL_COGNITORIUM_PROFILE = NATHAN_PROFILE;

export const PROFILES_PRESETS: { id: string; name: string; tag: string; profile: CognitiveProfile }[] = [
  {
    id: 'nathan',
    name: 'Näthan Cabrol, MS',
    tag: 'Sciences Cognitives (M2) & VRD / Génie Civil',
    profile: NATHAN_PROFILE
  },
  {
    id: 'student',
    name: 'Léa Martin',
    tag: 'Étudiante Master Data Science & IA',
    profile: STUDENT_PROFILE
  },
  {
    id: 'transition',
    name: 'Thomas Valadier',
    tag: 'Reconversion : BTP vers Transition Écologique',
    profile: TRANSITION_PROFILE
  }
];
