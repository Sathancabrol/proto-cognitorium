import { CognitiveProfile } from '../types';

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
      id: 'task-lea-model-explicability',
      name: 'Développer un modèle d’explicabilité médicale',
      category: 'task',
      experienceId: 'exp-lea-master',
      context: 'Master 2 Data Science & IA',
      actions: ['Préparer les données', 'Entraîner et évaluer le modèle', 'Expliquer les résultats'],
      skillsProduced: ['skill-lea-python-sql', 'skill-lea-vulgarisation'],
      description: 'Tâche de projet reliant la pratique technique à la communication des résultats.',
      verificationStatus: 'verified',
      confidenceScore: 96,
      evidence: [{ id: 'ev-task-lea-1', source: 'project', label: 'Projet de classification médicale', confidenceScore: 96 }]
    },
    {
      id: 'task-lea-dashboard-clinical',
      name: 'Construire des tableaux de bord cliniques',
      category: 'task',
      experienceId: 'exp-lea-stage-analyst',
      context: 'Stage Data Analyst — HealthTech',
      actions: ['Nettoyer les données hétérogènes', 'Écrire les requêtes SQL', 'Restituer les indicateurs dans Streamlit'],
      skillsProduced: ['skill-lea-python-sql', 'skill-lea-vulgarisation'],
      description: 'Tâche opérationnelle issue du stage Data Analyst.',
      verificationStatus: 'verified',
      confidenceScore: 96,
      evidence: [{ id: 'ev-task-lea-2', source: 'cv', label: 'Stage Data Analyst — dashboards et données cliniques', confidenceScore: 96 }]
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
    { id: 'el-1', source: 'exp-lea-master', target: 'task-lea-model-explicability', type: 'composed_of', strength: 0.95 },
    { id: 'el-2', source: 'task-lea-model-explicability', target: 'skill-lea-python-sql', type: 'demonstrates_skill', strength: 0.95 },
    { id: 'el-2b', source: 'exp-lea-stage-analyst', target: 'task-lea-dashboard-clinical', type: 'composed_of', strength: 0.95 },
    { id: 'el-2c', source: 'task-lea-dashboard-clinical', target: 'skill-lea-python-sql', type: 'demonstrates_skill', strength: 0.92 },
    { id: 'el-2d', source: 'task-lea-dashboard-clinical', target: 'skill-lea-vulgarisation', type: 'demonstrates_skill', strength: 0.88 },
    { id: 'el-3', source: 'skill-lea-python-sql', target: 'cap-lea-abstraction', type: 'feeds_capacity', strength: 0.95 },
    { id: 'el-4', source: 'cap-lea-abstraction', target: 'job-lea-data-pm', type: 'unlocks_horizon', strength: 0.93 }
  ]
};
