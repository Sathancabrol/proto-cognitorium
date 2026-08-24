import { CognitiveProfile } from '../types';

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
      id: 'task-thomas-pilotage-operations',
      name: 'Piloter délais, budgets et équipes chantier',
      category: 'task',
      experienceId: 'exp-thomas-btp-legacy',
      context: 'Conduite de travaux gros œuvre',
      actions: ['Ordonnancer les travaux', 'Suivre les écarts budgétaires', 'Coordonner ouvriers et sous-traitants'],
      skillsProduced: ['skill-thomas-pilotage'],
      description: 'Tâche récurrente documentant le pilotage opérationnel de chantier.',
      verificationStatus: 'verified',
      confidenceScore: 99,
      evidence: [{ id: 'ev-task-thomas-1', source: 'cv', label: 'Portefeuille de 12 opérations livrées', confidenceScore: 99 }]
    },
    {
      id: 'task-thomas-audit-energetique',
      name: 'Réaliser un audit thermique et une analyse de cycle de vie',
      category: 'task',
      experienceId: 'exp-thomas-formation-eco',
      context: 'Formation Référent Éco-Construction',
      actions: ['Observer le bâtiment', 'Calculer les indicateurs thermiques et carbone', 'Comparer les solutions biosourcées'],
      skillsProduced: ['skill-thomas-re2020'],
      description: 'Mise en pratique des connaissances RE2020 sur deux chantiers témoins.',
      verificationStatus: 'verified',
      confidenceScore: 96,
      evidence: [{ id: 'ev-task-thomas-2', source: 'project', label: 'Deux audits sur chantiers témoins', confidenceScore: 96 }]
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
    { id: 'et-1', source: 'exp-thomas-btp-legacy', target: 'task-thomas-pilotage-operations', type: 'composed_of', strength: 0.98 },
    { id: 'et-1b', source: 'task-thomas-pilotage-operations', target: 'skill-thomas-pilotage', type: 'demonstrates_skill', strength: 0.98 },
    { id: 'et-2', source: 'exp-thomas-formation-eco', target: 'task-thomas-audit-energetique', type: 'composed_of', strength: 0.95 },
    { id: 'et-2b', source: 'task-thomas-audit-energetique', target: 'skill-thomas-re2020', type: 'demonstrates_skill', strength: 0.95 },
    { id: 'et-3', source: 'skill-thomas-pilotage', target: 'cap-thomas-conversion', type: 'feeds_capacity', strength: 0.9 },
    { id: 'et-4', source: 'skill-thomas-re2020', target: 'cap-thomas-conversion', type: 'feeds_capacity', strength: 0.95 },
    { id: 'et-5', source: 'cap-thomas-conversion', target: 'job-thomas-chef-eco', type: 'unlocks_horizon', strength: 0.95 }
  ]
};
