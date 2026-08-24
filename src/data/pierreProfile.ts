import { CognitiveProfile } from '../types';

// ============================================================================
// PROFIL : PIERRE DENIAUD — Jeune sauveteur aquatique & polyvalent saisonnier
// Source : raw/Pierre DENIAUD.doc
// Parcours : 1ère S Sciences de l'Ingénieur · BNSSA/PSE1/PSE2 (2012)
//            surveillant de baignade (Balaruc), magasinier (New Baby), ouvrier agricole
// ============================================================================
export const PIERRE_PROFILE: CognitiveProfile = {
  id: 'profile-pierre-deniaud',
  personName: 'Pierre DENIAUD',
  headline: 'Sauveteur aquatique (BNSSA) & polyvalent — 1ère S Sciences de l\u2019Ingénieur',
  coreMotto: 'Surveiller, secourir, s\u2019adapter : la sécurité et le terrain avant tout.',
  location: 'Frontignan (34110) • Occitanie',
  email: 'peterde@hotmail.fr',
  journeyType: 'student',
  currentSimulationYear: 2026,

  cognitiveSignature: {
    dominantReasoning: 'Vigilance situationnelle & sang-froid en environnement à risque',
    transferabilityIndex: 80,
    learningVelocity: 'Élevée',
    adaptabilityIndex: 90,
    summaryText: 'Profil de jeune sauveteur aquatique formé au BNSSA/PSE1/PSE2 : capacité éprouvée de surveillance et d\u2019intervention en milieu aquatique, complétée par des expériences saisonnières variées (magasinier, ouvrier agricole) qui témoignent d\u2019une grande adaptabilité et d\u2019un sens du service. Culture technique en cours (1ère S Sciences de l\u2019Ingénieur) et passions exigeantes : plongée en apnée et musculation.',
    keyStrengths: [
      'Surveillance de bassins et de zones de baignade (BNSSA, PSE1, PSE2)',
      'Sang-froid et réactivité : gestes de premiers secours certifiés',
      'Sens du service client (conseil, facing, réassort)',
      'Polyvalence saisonnière : agriculture, magasin, baignade',
      'Exigence physique : plongée en apnée, musculation, permis A/B/Côtier'
    ]
  },

  nodes: [
    // ========================================================================
    // 1. FORMATIONS & CERTIFICATIONS (Explicite)
    // ========================================================================
    {
      id: 'form-1ere-s-si',
      name: '1ère S option Sciences de l\u2019Ingénieur',
      category: 'formation',
      period: '2012',
      startYear: 2012,
      endYear: 2013,
      institutionOrContext: 'Lycée (Frontignan / Sète)',
      role: 'Élève de 1ère S',
      description: 'Première scientifique option Sciences de l\u2019Ingénieur : approche technologique, mécanique, électricité, projet technique.',
      verificationStatus: 'verified',
      confidenceScore: 95,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-1eres', source: 'cv', sourceDocument: 'Pierre DENIAUD.doc', label: 'CV — Actuellement en 1ère S option sciences de l\u2019ingénieur', confidenceScore: 95, date: '2012' }
      ],
      missions: [
        'Projets techniques et démarche d\u2019ingénierie',
        'Mécanique, électricité, conception assistée'
      ],
      cognitiveEfforts: [
        'Raisonnement scientifique et modélisation',
        'Analyse fonctionnelle de systèmes techniques'
      ],
      x: 120,
      y: 80
    },
    {
      id: 'form-pse-bnssa',
      name: 'PSE1, PSE2 & BNSSA (Premiers secours, Sauvetage aquatique)',
      category: 'formation',
      period: '2012',
      startYear: 2012,
      endYear: 2012,
      institutionOrContext: 'Formation secourisme & sauvetage aquatique',
      role: 'Secouriste / Sauveteur certifié',
      description: 'Certifications de premiers secours (PSE1, PSE2) et Brevet National de Sécurité et de Sauvetage Aquatique (BNSSA) : surveillance des baignades, gestes d\u2019urgence, sauvetage.',
      verificationStatus: 'verified',
      confidenceScore: 100,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-pse', source: 'attest', label: 'Certifications PSE1, PSE2, BNSSA (03/2012)', confidenceScore: 100, date: '2012' }
      ],
      missions: [
        'Gestes de premiers secours (PSE1/PSE2)',
        'Surveillance de baignade et sauvetage aquatique (BNSSA)',
        'Application des plans de secours'
      ],
      cognitiveEfforts: [
        'Vigilance continue et évaluation rapide des situations',
        'Intervention sous stress'
      ],
      x: 120,
      y: 180
    },
    {
      id: 'form-stage-sauveteur',
      name: 'Stage sauveteur de plage',
      category: 'formation',
      period: '2012',
      startYear: 2012,
      endYear: 2012,
      institutionOrContext: 'Sète',
      role: 'Stagiaire sauveteur de plage',
      description: 'Stage pratique de sauveteur de plage : surveillance de la baignade en milieu naturel, secours, prévention.',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-stage', source: 'attest', label: 'Stage sauveteur de plage (04/2012)', confidenceScore: 98, date: '2012' }
      ],
      missions: [
        'Surveillance de plage',
        'Prévention et secours aux baigneurs'
      ],
      cognitiveEfforts: [
        'Lecture des conditions de baignade (vagues, courants, météo)',
        'Coordination avec les autres sauveteurs'
      ],
      x: 120,
      y: 280
    },
    {
      id: 'form-brevet',
      name: 'Brevet des collèges & B2i',
      category: 'formation',
      period: '2008',
      startYear: 2006,
      endYear: 2008,
      institutionOrContext: 'Collège',
      role: 'Diplômé',
      description: 'Brevet des collèges (2008) et Brevet Informatique et Internet B2i (2006).',
      verificationStatus: 'verified',
      confidenceScore: 100,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-brevet', source: 'diploma', label: 'Brevet des collèges (2008) et B2i (2006)', confidenceScore: 100, date: '2006-2008' }
      ],
      missions: [],
      cognitiveEfforts: [],
      x: 120,
      y: 380
    },

    // ========================================================================
    // 2. EXPÉRIENCES PROFESSIONNELLES
    // ========================================================================
    {
      id: 'exp-surveillant-baignade',
      name: 'Surveillant de baignade / Sauveteur — Lo Solehau',
      category: 'experience',
      period: '2012',
      startYear: 2012,
      endYear: 2012,
      institutionOrContext: 'Lo Solehau, Balaruc (34)',
      role: 'Surveillant de baignade / Sauveteur',
      description: 'Surveillance des bassins et entretien des bassins et de la zone ludique dans un établissement de balnéothérapie.',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-exp1', source: 'exp', sourceDocument: 'Pierre DENIAUD.doc', label: 'CV — Surveillant de baignade Lo Solehau Balaruc (2012)', confidenceScore: 98, date: '2012' }
      ],
      missions: [
        'Surveillance des bassins',
        'Entretien des bassins et de la zone ludique',
        'Application des règles de sécurité aquatique'
      ],
      cognitiveEfforts: [
        'Attention soutenue et anticipation des risques',
        'Intervention rapide en cas d\u2019incident'
      ],
      metrics: { durationMonths: 6 },
      x: 380,
      y: 100
    },
    {
      id: 'exp-magasinier',
      name: 'Magasinier / Vendeur — New Baby',
      category: 'experience',
      period: '2011',
      startYear: 2011,
      endYear: 2011,
      institutionOrContext: 'New Baby, Trignac (44)',
      role: 'Magasinier / Vendeur',
      description: 'Magasin de puériculture : réception des commandes, rangement de la réserve, montage de meubles, facing, conseil client.',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-exp2', source: 'exp', sourceDocument: 'Pierre DENIAUD.doc', label: 'CV — Magasinier/vendeur New Baby Trignac (2011)', confidenceScore: 98, date: '2011' }
      ],
      missions: [
        'Réception des commandes',
        'Rangement de la réserve',
        'Montage de meubles',
        'Facing et conseil client'
      ],
      cognitiveEfforts: [
        'Organisation logistique et rangement',
        'Relation client et vente conseil'
      ],
      metrics: { durationMonths: 4 },
      x: 380,
      y: 220
    },
    {
      id: 'exp-ouvrier-agricole',
      name: 'Ouvrier agricole — Exploitation Berland & Baudouin',
      category: 'experience',
      period: '2010',
      startYear: 2010,
      endYear: 2010,
      institutionOrContext: 'Exploitation Berland (Doix, 85) & Exploitation Baudouin (Xanton, 85)',
      role: 'Ouvrier agricole',
      description: 'Saisons agricoles : cueillette de melons et manutention chez Berland ; castration de maïs (écimage) chez Baudouin.',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-exp3', source: 'exp', sourceDocument: 'Pierre DENIAUD.doc', label: 'CV — Ouvrier agricole Berland & Baudouin (2010)', confidenceScore: 98, date: '2010' }
      ],
      missions: [
        'Cueillette de melons',
        'Manutention',
        'Castration de maïs (écimage)'
      ],
      cognitiveEfforts: [
        'Gestes de récolte précis et rapides',
        'Endurance au travail saisonnier en extérieur'
      ],
      metrics: { durationMonths: 4 },
      x: 380,
      y: 340
    },

    // ========================================================================
    // 3. TÂCHES REPRÉSENTATIVES
    // ========================================================================
    {
      id: 'task-pierre-surveillance',
      name: 'Surveiller les bassins et appliquer le plan de secours',
      category: 'task',
      experienceId: 'exp-surveillant-baignade',
      context: 'Lo Solehau, Balaruc',
      actions: [
        'Surveillance continue des bassins',
        'Application des consignes de sécurité',
        'Intervention de secours si nécessaire'
      ],
      skillsProduced: ['skill-surveillance-bassins', 'skill-plan-secours', 'skill-premiers-secours', 'skill-hygiene-aquatique', 'skill-information-regles'],
      description: 'Tâche extraite du CV et reliée aux compétences de sauvetage aquatique.',
      verificationStatus: 'verified',
      confidenceScore: 96,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-task-pierre1', source: 'cv', sourceDocument: 'Pierre DENIAUD.doc', label: 'CV — surveillance des bassins, sauveteur (2012)', confidenceScore: 96, date: '2012' }
      ],
      x: 620,
      y: 140
    },
    {
      id: 'task-pierre-magasin',
      name: 'Réceptionner, ranger et présenter la marchandise',
      category: 'task',
      experienceId: 'exp-magasinier',
      context: 'New Baby, Trignac',
      actions: [
        'Réception des commandes',
        'Rangement de la réserve',
        'Facing et présentation des rayons',
        'Montage de meubles'
      ],
      skillsProduced: ['skill-manutention', 'skill-reassort', 'skill-conseil-client'],
      description: 'Tâche extraite du CV et reliée aux compétences logistiques et de vente.',
      verificationStatus: 'verified',
      confidenceScore: 96,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-task-pierre2', source: 'cv', sourceDocument: 'Pierre DENIAUD.doc', label: 'CV — magasinier/vendeur New Baby (2011)', confidenceScore: 96, date: '2011' }
      ],
      x: 620,
      y: 260
    },
    {
      id: 'task-pierre-cueillette',
      name: 'Récolter les melons et manutentionner',
      category: 'task',
      experienceId: 'exp-ouvrier-agricole',
      context: 'Exploitation Berland, Doix (85)',
      actions: [
        'Cueillette des melons selon les consignes de maturité',
        'Manutention des récoltes'
      ],
      skillsProduced: ['skill-recolte', 'skill-manutention'],
      description: 'Tâche extraite du CV et reliée aux compétences agricoles.',
      verificationStatus: 'verified',
      confidenceScore: 96,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-task-pierre3', source: 'cv', sourceDocument: 'Pierre DENIAUD.doc', label: 'CV — cueillette de melon, manutention (2010)', confidenceScore: 96, date: '2010' }
      ],
      x: 620,
      y: 380
    },

    // ========================================================================
    // 4. COMPÉTENCES (formulations alignées sur le référentiel ROME)
    // ========================================================================
    {
      id: 'skill-surveillance-bassins',
      name: 'Surveiller des bassins aquatiques ou un espace de baignade',
      category: 'skill_tech',
      baseMastery: 82,
      acquiredYear: 2012,
      lastPracticedYear: 2012,
      halfLifeYears: 4,
      decayFactor: 0.15,
      transferabilityScore: 7,
      subSkills: ['Surveillance des bassins', 'Zone ludique', 'Prévention des risques'],
      description: 'Surveillance des bassins et des espaces de baignade : vigilance continue, respect des règles, prévention.',
      verificationStatus: 'verified',
      confidenceScore: 97,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-sk1', source: 'exp', label: 'Surveillant de baignade Lo Solehau (2012)', confidenceScore: 97, date: '2012' }
      ],
      x: 800,
      y: 100
    },
    {
      id: 'skill-plan-secours',
      name: 'Appliquer le plan d\u2019organisation de la surveillance et des secours',
      category: 'skill_tech',
      baseMastery: 78,
      acquiredYear: 2012,
      lastPracticedYear: 2012,
      halfLifeYears: 4,
      decayFactor: 0.15,
      transferabilityScore: 7,
      subSkills: ['BNSSA', 'Plans de secours', 'Organisation de la surveillance'],
      description: 'Application des plans de surveillance et de secours des espaces aquatiques (BNSSA).',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-sk2', source: 'attest', label: 'BNSSA (03/2012)', confidenceScore: 98, date: '2012' }
      ],
      x: 800,
      y: 200
    },
    {
      id: 'skill-hygiene-aquatique',
      name: 'Contrôler le fonctionnement et l\u2019hygiène de l\u2019espace aquatique avant, pendant et après utilisation',
      category: 'skill_tech',
      baseMastery: 70,
      acquiredYear: 2012,
      lastPracticedYear: 2012,
      halfLifeYears: 4,
      decayFactor: 0.15,
      transferabilityScore: 6,
      subSkills: ['Entretien des bassins', 'Zone ludique', 'Contrôle avant/pendant/après'],
      description: 'Contrôle et entretien des bassins et de la zone ludique : hygiène, fonctionnement, propreté.',
      verificationStatus: 'verified',
      confidenceScore: 96,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-sk2b', source: 'exp', label: 'Entretien des bassins et de la zone ludique (Lo Solehau, 2012)', confidenceScore: 96, date: '2012' }
      ],
      x: 800,
      y: 250
    },
    {
      id: 'skill-information-regles',
      name: 'Informer les clients sur les règles de sécurité et les services disponibles',
      category: 'skill_relational',
      baseMastery: 72,
      acquiredYear: 2011,
      lastPracticedYear: 2012,
      halfLifeYears: 6,
      decayFactor: 0.08,
      transferabilityScore: 8,
      subSkills: ['Information sécurité', 'Accueil baigneurs', 'Conseil'],
      description: 'Information des usagers sur les règles de sécurité et les services : posture d\u2019accueil en baignade et en magasin.',
      verificationStatus: 'verified',
      confidenceScore: 95,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-sk2c', source: 'exp', label: 'Conseil client (New Baby) + surveillance baignade (2011-2012)', confidenceScore: 95, date: '2011-2012' }
      ],
      x: 800,
      y: 300
    },
    {
      id: 'skill-premiers-secours',
      name: 'Appliquer les protocoles de premiers secours en cas d\u2019urgence vitale',
      category: 'skill_tech',
      baseMastery: 76,
      acquiredYear: 2012,
      lastPracticedYear: 2012,
      halfLifeYears: 4,
      decayFactor: 0.15,
      transferabilityScore: 8,
      subSkills: ['PSE1', 'PSE2', 'Gestes d\u2019urgence'],
      description: 'Gestes de premiers secours et d\u2019urgence vitale : PSE1, PSE2, sauvetage.',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-sk3', source: 'attest', label: 'PSE1 & PSE2 (03/2012)', confidenceScore: 98, date: '2012' }
      ],
      x: 800,
      y: 300
    },
    {
      id: 'skill-manutention',
      name: 'Appliquer les techniques de levage et de manutention sécurisées',
      category: 'skill_tech',
      baseMastery: 72,
      acquiredYear: 2010,
      lastPracticedYear: 2011,
      halfLifeYears: 5,
      decayFactor: 0.1,
      transferabilityScore: 7,
      subSkills: ['Manutention', 'Rangement', 'Port de charges'],
      description: 'Manutention et rangement de marchandises : réception, réserve, port de charges en sécurité.',
      verificationStatus: 'verified',
      confidenceScore: 95,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-sk4', source: 'exp', label: 'Magasinier New Baby + manutention agricole (2010-2011)', confidenceScore: 95, date: '2010-2011' }
      ],
      x: 800,
      y: 400
    },
    {
      id: 'skill-preparation-commandes',
      name: 'Prélever les produits selon les instructions de préparation de commande et constituer les colis, lots etc.',
      category: 'skill_tech',
      baseMastery: 68,
      acquiredYear: 2011,
      lastPracticedYear: 2011,
      halfLifeYears: 5,
      decayFactor: 0.1,
      transferabilityScore: 7,
      subSkills: ['Réception des commandes', 'Préparation de colis', 'Réserve'],
      description: 'Préparation et constitution des commandes en magasin : réception, prélèvement, colisage, rangement de la réserve.',
      verificationStatus: 'verified',
      confidenceScore: 94,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-sk4b', source: 'exp', label: 'Réception des commandes et rangement de la réserve (New Baby, 2011)', confidenceScore: 94, date: '2011' }
      ],
      x: 800,
      y: 450
    },
    {
      id: 'skill-pictogrammes',
      name: 'Connaître les pictogrammes sur les produits et les matériels et appliquer les règles de manutention associées',
      category: 'skill_tech',
      baseMastery: 64,
      acquiredYear: 2010,
      lastPracticedYear: 2011,
      halfLifeYears: 5,
      decayFactor: 0.1,
      transferabilityScore: 6,
      subSkills: ['Pictogrammes sécurité', 'Règles de manutention', 'Produits et matériels'],
      description: 'Application des règles de manutention et connaissance des pictogrammes produits/matériels, exercée en magasin et en exploitation agricole.',
      verificationStatus: 'verified',
      confidenceScore: 92,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-sk4c', source: 'exp', label: 'Manutention magasin et agricole (2010-2011)', confidenceScore: 92, date: '2010-2011' }
      ],
      x: 800,
      y: 500
    },
    {
      id: 'skill-reassort',
      name: 'Réassortir les rayons et veiller à la bonne présentation du magasin',
      category: 'skill_tech',
      baseMastery: 70,
      acquiredYear: 2011,
      lastPracticedYear: 2011,
      halfLifeYears: 5,
      decayFactor: 0.1,
      transferabilityScore: 7,
      subSkills: ['Facing', 'Présentation des rayons', 'Réassort'],
      description: 'Facing, réassort et présentation des rayons dans un magasin de puériculture.',
      verificationStatus: 'verified',
      confidenceScore: 95,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-sk5', source: 'exp', label: 'Facing et rangement New Baby (2011)', confidenceScore: 95, date: '2011' }
      ],
      x: 800,
      y: 500
    },
    {
      id: 'skill-conseil-client',
      name: 'Conseiller et accueillir le client en magasin',
      category: 'skill_relational',
      baseMastery: 68,
      acquiredYear: 2011,
      lastPracticedYear: 2011,
      halfLifeYears: 6,
      decayFactor: 0.08,
      transferabilityScore: 8,
      subSkills: ['Conseil client', 'Accueil', 'Vente'],
      description: 'Conseil et accueil des clients en magasin : écoute du besoin, orientation, vente.',
      verificationStatus: 'verified',
      confidenceScore: 94,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-sk6', source: 'exp', label: 'Vendeur New Baby — conseil client (2011)', confidenceScore: 94, date: '2011' }
      ],
      x: 800,
      y: 600
    },
    {
      id: 'skill-recolte',
      name: 'Récolter un produit à maturité et selon les consignes de calibrage',
      category: 'skill_tech',
      baseMastery: 74,
      acquiredYear: 2010,
      lastPracticedYear: 2010,
      halfLifeYears: 5,
      decayFactor: 0.1,
      transferabilityScore: 6,
      subSkills: ['Cueillette de melons', 'Calibrage', 'Écimage du maïs'],
      description: 'Cueillette et récolte agricole : melons, manutention, travaux de plein champ (castration du maïs).',
      verificationStatus: 'verified',
      confidenceScore: 96,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-sk7', source: 'exp', label: 'Ouvrier agricole Berland & Baudouin (2010)', confidenceScore: 96, date: '2010' }
      ],
      x: 800,
      y: 700
    },
    {
      id: 'skill-equipements-cueillette',
      name: 'Utiliser des équipements de cueillette spécifiques',
      category: 'skill_tech',
      baseMastery: 62,
      acquiredYear: 2010,
      lastPracticedYear: 2010,
      halfLifeYears: 5,
      decayFactor: 0.12,
      transferabilityScore: 5,
      subSkills: ['Outils de cueillette', 'Manutention des récoltes', 'Plein champ'],
      description: 'Utilisation des équipements de cueillette et de récolte sur les exploitations (melons, maïs).',
      verificationStatus: 'verified',
      confidenceScore: 93,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-sk7b', source: 'exp', label: 'Cueillette de melon et manutention (Berland, 2010)', confidenceScore: 93, date: '2010' }
      ],
      x: 800,
      y: 750
    },
    {
      id: 'skill-travail-equipe',
      name: 'Travailler en équipe et en autonomie',
      category: 'skill_transversal',
      baseMastery: 85,
      acquiredYear: 2010,
      lastPracticedYear: 2012,
      halfLifeYears: 8,
      decayFactor: 0.06,
      transferabilityScore: 9,
      subSkills: ['Équipe de sauveteurs', 'Équipe magasin', 'Autonomie'],
      description: 'Travail en équipe sur site (équipe de surveillance, équipe magasin) et en autonomie complète.',
      verificationStatus: 'verified',
      confidenceScore: 95,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-sk8', source: 'exp', label: 'Expériences en équipe (baignade, magasin, agriculture)', confidenceScore: 95, date: '2010-2012' }
      ],
      x: 800,
      y: 800
    },
    {
      id: 'skill-sens-ervice',
      name: 'Sens du service et réactivité',
      category: 'skill_transversal',
      baseMastery: 82,
      acquiredYear: 2011,
      lastPracticedYear: 2012,
      halfLifeYears: 8,
      decayFactor: 0.06,
      transferabilityScore: 8,
      subSkills: ['Réactivité', 'Service à la personne', 'Fiabilité'],
      description: 'Sens du service et réactivité, exercés en accueil de clientèle et en surveillance de baignade.',
      verificationStatus: 'verified',
      confidenceScore: 95,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-pierre-sk9', source: 'exp', label: 'Conseil client + surveillance (2011-2012)', confidenceScore: 95, date: '2011-2012' }
      ],
      x: 800,
      y: 900
    },

    // ========================================================================
    // 5. CAPACITÉS COGNITIVES (candidates — niveau 3)
    // ========================================================================
    {
      id: 'cap-vigilance-secours',
      name: 'Vigilance soutenue & gestion de l\u2019urgence',
      category: 'capacity_cognitive',
      level: 'avancé',
      cognitiveDimension: 'Adaptabilité & Imprévus',
      underlyingSkills: ['skill-surveillance-bassins', 'skill-plan-secours', 'skill-premiers-secours', 'skill-sens-ervice'],
      description: 'Capacité à maintenir une attention soutenue sur un environnement à risque (bassins, baignade) et à basculer rapidement en mode intervention de secours.',
      verificationStatus: 'inferred',
      inferenceType: 'inference_forte',
      confidenceScore: 88,
      emergentInsight: 'La formation BNSSA/PSE et le stage sauveteur de plage indiquent un profil orienté sécurité, transférable à d\u2019autres contextes de surveillance (événements, établissements).',
      x: 1000,
      y: 150
    },
    {
      id: 'cap-polyvalence',
      name: 'Polyvalence & adaptation rapide aux métiers saisonniers',
      category: 'capacity_cognitive',
      level: 'avancé',
      cognitiveDimension: 'Adaptabilité & Imprévus',
      underlyingSkills: ['skill-manutention', 'skill-recolte', 'skill-travail-equipe'],
      description: 'Passage réussi entre trois univers en deux ans : agriculture, logistique/magasin, surveillance aquatique.',
      verificationStatus: 'inferred',
      inferenceType: 'inference_forte',
      confidenceScore: 86,
      x: 1000,
      y: 300
    },
    {
      id: 'cap-relation-client',
      name: 'Relation client & sens du service',
      category: 'capacity_cognitive',
      level: 'fondamental',
      cognitiveDimension: 'Humain & Médiation',
      underlyingSkills: ['skill-conseil-client', 'skill-sens-ervice', 'skill-travail-equipe'],
      description: 'Accueil, écoute et conseil du client en magasin, prolongés par une posture de service en surveillance de baignade.',
      verificationStatus: 'inferred',
      inferenceType: 'inference_a_valider',
      confidenceScore: 78,
      x: 1000,
      y: 450
    },

    // ========================================================================
    // 6. HORIZONS MÉTIERS (codes ROME réels — rapprochements à valider)
    // ========================================================================
    {
      id: 'job-pierre-g1247',
      name: 'Surveillant / Surveillante d\u2019espaces aquatiques (ROME G1247)',
      category: 'horizon_job',
      domain: 'Sport & Loisirs — Sécurité aquatique',
      romeCode: 'G1247',
      romeTitle: 'Surveillant / Surveillante d\u2019espaces aquatiques',
      matchScore: 46,
      compatibilityLevel: 'Modérée',
      verificationStatus: 'inferred',
      inferenceType: 'inference_a_valider',
      confidenceScore: 84,
      rationale: 'Certifications BNSSA/PSE1/PSE2 et expérience de surveillant de baignade : correspondance directe avec la fiche ROME G1247 (surveillance des bassins, plan de secours, hygiène des espaces aquatiques). Le score est recalculé par le moteur ROME à partir des compétences réellement documentées (46/100).',
      matchingSkills: [
        'Surveiller des bassins aquatiques ou un espace de baignade',
        'Appliquer le plan d\u2019organisation de la surveillance et des secours',
        'Appliquer les protocoles de premiers secours en cas d\u2019urgence vitale',
        'Contrôler le fonctionnement et l\u2019hygiène de l\u2019espace aquatique avant, pendant et après utilisation',
        'Informer les clients sur les règles de sécurité et les services disponibles'
      ],
      missingSkills: [
        {
          name: 'Évaluer les conditions météorologiques pour la sécurité',
          importance: 'recommandée',
          learningBridge: 'Consolider la lecture des conditions de baignade (vent, vagues, orages) pour la surveillance en milieu naturel.'
        },
        {
          name: 'Animer des temps de brief / débrief d\u2019équipe',
          importance: 'bonus',
          learningBridge: 'Développer les routines de brief d\u2019équipe avant et après les périodes de surveillance.'
        }
      ],
      unlockedOpportunities: [
        'Surveillant de baignade (piscines, centres aquatiques)',
        'Sauveteur de plage saisonnier',
        'Agent de surveillance en centre de balnéothérapie'
      ],
      description: 'Surveillance et sécurité des espaces aquatiques : bassins, baignades, zones ludiques.',
      x: 1200,
      y: 150
    },
    {
      id: 'job-pierre-g1224',
      name: 'Maître-nageur sauveteur / Maître-nageuse sauveteuse (ROME G1224)',
      category: 'horizon_job',
      domain: 'Sport & Loisirs — Enseignement aquatique',
      romeCode: 'G1224',
      romeTitle: 'Maître-nageur sauveteur / Maître-nageuse sauveteuse',
      matchScore: 16,
      compatibilityLevel: 'À explorer',
      verificationStatus: 'inferred',
      inferenceType: 'inference_a_valider',
      confidenceScore: 72,
      rationale: 'Le BNSSA et les gestes de secours ouvrent vers la filière maître-nageur : il manque le diplôme d\u2019État (BPJEPS AAN / BEESAN) pour enseigner et encadrer.',
      matchingSkills: [
        'Surveiller des bassins aquatiques ou un espace de baignade',
        'Appliquer les protocoles de premiers secours en cas d\u2019urgence vitale'
      ],
      missingSkills: [
        {
          name: 'Diplôme d\u2019État BPJEPS AAN (Activités Aquatiques et de la Natation)',
          importance: 'critique',
          learningBridge: 'Formation BPJEPS AAN (1 an environ) pour enseigner la natation et encadrer les activités aquatiques.'
        }
      ],
      unlockedOpportunities: [
        'Maître-nageur sauveteur en piscine',
        'Enseignant de natation',
        'Coordinateur d\u2019activités aquatiques'
      ],
      description: 'Enseignement de la natation, encadrement et sécurité des activités aquatiques.',
      x: 1200,
      y: 300
    },
    {
      id: 'job-pierre-n1103',
      name: 'Préparateur / Préparatrice de commandes (ROME N1103)',
      category: 'horizon_job',
      domain: 'Logistique & Magasinage',
      romeCode: 'N1103',
      romeTitle: 'Préparateur / Préparatrice de commandes',
      matchScore: 30,
      compatibilityLevel: 'Modérée',
      verificationStatus: 'inferred',
      inferenceType: 'inference_a_valider',
      confidenceScore: 68,
      rationale: 'Expérience de magasinier (réception, rangement, facing) et de manutention : base solide pour la préparation de commandes et les métiers de l\u2019entreposage.',
      matchingSkills: [
        'Appliquer les techniques de levage et de manutention sécurisées',
        'Réassortir les rayons et veiller à la bonne présentation du magasin'
      ],
      missingSkills: [
        {
          name: 'Utilisation des outils de préparation de commandes (scan, PDA, chariot)',
          importance: 'recommandée',
          learningBridge: 'Formation courte logistique entrepôt (CACES 1/3/5) pour élargir les postes accessibles.'
        }
      ],
      unlockedOpportunities: [
        'Préparateur de commandes',
        'Magasinier / cariste',
        'Employé logistique'
      ],
      description: 'Préparation et expédition des commandes en entrepôt : prélèvement, contrôle, colisage.',
      x: 1200,
      y: 450
    },
    {
      id: 'job-pierre-a1401',
      name: 'Cueilleur / Cueilleuse de fruits (ROME A1401)',
      category: 'horizon_job',
      domain: 'Agriculture — Récoltes',
      romeCode: 'A1401',
      romeTitle: 'Cueilleur / Cueilleuse de fruits',
      matchScore: 30,
      compatibilityLevel: 'Modérée',
      verificationStatus: 'inferred',
      inferenceType: 'inference_a_valider',
      confidenceScore: 66,
      rationale: 'Cueillette de melons, manutention et travaux de plein champ : compétences directement reconnues dans le référentiel des cueilleurs (récolte à maturité, calibrage).',
      matchingSkills: [
        'Récolter un produit à maturité et selon les consignes de calibrage',
        'Appliquer les techniques de levage et de manutention sécurisées'
      ],
      missingSkills: [
        {
          name: 'Conduite d\u2019engins agricoles et équipements de cueillette spécifiques',
          importance: 'bonus',
          learningBridge: 'Formation conduite d\u2019engins agricoles pour accéder aux postes d\u2019ouvrier agricole qualifié.'
        }
      ],
      unlockedOpportunities: [
        'Cueilleur saisonnier (maraîchage, arboriculture)',
        'Ouvrier agricole polyvalent',
        'Viticulture'
      ],
      description: 'Cueillette et récolte des fruits et légumes selon les consignes de maturité et de calibrage.',
      x: 1200,
      y: 600
    }
  ],

  edges: [
    // Formations -> Compétences
    { id: 'e-pierre-f1', source: 'form-1ere-s-si', target: 'skill-sens-ervice', type: 'acquired_in', strength: 0.5, label: 'Méthode' },
    { id: 'e-pierre-f2', source: 'form-pse-bnssa', target: 'skill-premiers-secours', type: 'acquired_in', strength: 0.98, label: 'PSE1/PSE2' },
    { id: 'e-pierre-f2b', source: 'form-pse-bnssa', target: 'skill-plan-secours', type: 'acquired_in', strength: 0.98, label: 'BNSSA' },
    { id: 'e-pierre-f3', source: 'form-stage-sauveteur', target: 'skill-surveillance-bassins', type: 'acquired_in', strength: 0.95, label: 'Surveillance plage' },

    // Expériences -> Tâches
    { id: 'e-pierre-e1', source: 'exp-surveillant-baignade', target: 'task-pierre-surveillance', type: 'composed_of', strength: 1, label: 'Tâche documentée' },
    { id: 'e-pierre-e2', source: 'exp-magasinier', target: 'task-pierre-magasin', type: 'composed_of', strength: 1, label: 'Tâche documentée' },
    { id: 'e-pierre-e3', source: 'exp-ouvrier-agricole', target: 'task-pierre-cueillette', type: 'composed_of', strength: 1, label: 'Tâche documentée' },

    // Tâches -> Compétences
    { id: 'e-pierre-t1', source: 'task-pierre-surveillance', target: 'skill-surveillance-bassins', type: 'demonstrates_skill', strength: 0.97, label: 'Surveillance démontrée' },
    { id: 'e-pierre-t1b', source: 'task-pierre-surveillance', target: 'skill-plan-secours', type: 'demonstrates_skill', strength: 0.9, label: 'Plan de secours' },
    { id: 'e-pierre-t1c', source: 'task-pierre-surveillance', target: 'skill-premiers-secours', type: 'demonstrates_skill', strength: 0.9, label: 'Secours' },
    { id: 'e-pierre-t1d', source: 'task-pierre-surveillance', target: 'skill-hygiene-aquatique', type: 'demonstrates_skill', strength: 0.9, label: 'Hygiène des bassins' },
    { id: 'e-pierre-t1e', source: 'task-pierre-surveillance', target: 'skill-information-regles', type: 'demonstrates_skill', strength: 0.85, label: 'Information sécurité' },
    { id: 'e-pierre-t2', source: 'task-pierre-magasin', target: 'skill-manutention', type: 'demonstrates_skill', strength: 0.95, label: 'Manutention démontrée' },
    { id: 'e-pierre-t2b', source: 'task-pierre-magasin', target: 'skill-reassort', type: 'demonstrates_skill', strength: 0.9, label: 'Réassort démontré' },
    { id: 'e-pierre-t2c', source: 'task-pierre-magasin', target: 'skill-conseil-client', type: 'demonstrates_skill', strength: 0.9, label: 'Conseil client' },
    { id: 'e-pierre-t2d', source: 'task-pierre-magasin', target: 'skill-preparation-commandes', type: 'demonstrates_skill', strength: 0.92, label: 'Préparation de commandes' },
    { id: 'e-pierre-t2e', source: 'task-pierre-magasin', target: 'skill-pictogrammes', type: 'demonstrates_skill', strength: 0.85, label: 'Règles de manutention' },
    { id: 'e-pierre-t3', source: 'task-pierre-cueillette', target: 'skill-recolte', type: 'demonstrates_skill', strength: 0.97, label: 'Récolte démontrée' },
    { id: 'e-pierre-t3b', source: 'task-pierre-cueillette', target: 'skill-manutention', type: 'demonstrates_skill', strength: 0.85, label: 'Manutention' },
    { id: 'e-pierre-t3c', source: 'task-pierre-cueillette', target: 'skill-equipements-cueillette', type: 'demonstrates_skill', strength: 0.9, label: 'Équipements de cueillette' },

    // Expériences directes -> compétences
    { id: 'e-pierre-e4', source: 'exp-surveillant-baignade', target: 'skill-travail-equipe', type: 'acquired_in', strength: 0.85, label: 'Équipe de surveillance' },
    { id: 'e-pierre-e5', source: 'exp-surveillant-baignade', target: 'skill-sens-ervice', type: 'acquired_in', strength: 0.85, label: 'Service baigneurs' },
    { id: 'e-pierre-e6', source: 'exp-magasinier', target: 'skill-sens-ervice', type: 'acquired_in', strength: 0.9, label: 'Service client' },
    { id: 'e-pierre-e7', source: 'exp-magasinier', target: 'skill-travail-equipe', type: 'acquired_in', strength: 0.85, label: 'Équipe magasin' },

    // Compétences -> Capacités
    { id: 'e-pierre-c1', source: 'skill-surveillance-bassins', target: 'cap-vigilance-secours', type: 'feeds_capacity', strength: 0.95 },
    { id: 'e-pierre-c2', source: 'skill-plan-secours', target: 'cap-vigilance-secours', type: 'feeds_capacity', strength: 0.9 },
    { id: 'e-pierre-c3', source: 'skill-premiers-secours', target: 'cap-vigilance-secours', type: 'feeds_capacity', strength: 0.9 },
    { id: 'e-pierre-c3b', source: 'skill-hygiene-aquatique', target: 'cap-vigilance-secours', type: 'feeds_capacity', strength: 0.8 },
    { id: 'e-pierre-c3c', source: 'skill-information-regles', target: 'cap-relation-client', type: 'feeds_capacity', strength: 0.85 },
    { id: 'e-pierre-c4', source: 'skill-manutention', target: 'cap-polyvalence', type: 'feeds_capacity', strength: 0.85 },
    { id: 'e-pierre-c5', source: 'skill-recolte', target: 'cap-polyvalence', type: 'feeds_capacity', strength: 0.85 },
    { id: 'e-pierre-c6', source: 'skill-travail-equipe', target: 'cap-polyvalence', type: 'feeds_capacity', strength: 0.8 },
    { id: 'e-pierre-c7', source: 'skill-conseil-client', target: 'cap-relation-client', type: 'feeds_capacity', strength: 0.9 },
    { id: 'e-pierre-c8', source: 'skill-sens-ervice', target: 'cap-relation-client', type: 'feeds_capacity', strength: 0.9 },

    // Compétences & capacités -> Horizons
    { id: 'e-pierre-h1', source: 'skill-surveillance-bassins', target: 'job-pierre-g1247', type: 'unlocks_horizon', strength: 0.95 },
    { id: 'e-pierre-h2', source: 'skill-plan-secours', target: 'job-pierre-g1247', type: 'unlocks_horizon', strength: 0.95 },
    { id: 'e-pierre-h3', source: 'skill-premiers-secours', target: 'job-pierre-g1247', type: 'unlocks_horizon', strength: 0.9 },
    { id: 'e-pierre-h3b', source: 'skill-hygiene-aquatique', target: 'job-pierre-g1247', type: 'unlocks_horizon', strength: 0.85 },
    { id: 'e-pierre-h3c', source: 'skill-information-regles', target: 'job-pierre-g1247', type: 'unlocks_horizon', strength: 0.8 },
    { id: 'e-pierre-h4', source: 'skill-surveillance-bassins', target: 'job-pierre-g1224', type: 'unlocks_horizon', strength: 0.9 },
    { id: 'e-pierre-h5', source: 'skill-premiers-secours', target: 'job-pierre-g1224', type: 'unlocks_horizon', strength: 0.85 },
    { id: 'e-pierre-h6', source: 'skill-manutention', target: 'job-pierre-n1103', type: 'unlocks_horizon', strength: 0.9 },
    { id: 'e-pierre-h7', source: 'skill-reassort', target: 'job-pierre-n1103', type: 'unlocks_horizon', strength: 0.85 },
    { id: 'e-pierre-h7b', source: 'skill-preparation-commandes', target: 'job-pierre-n1103', type: 'unlocks_horizon', strength: 0.92 },
    { id: 'e-pierre-h7c', source: 'skill-pictogrammes', target: 'job-pierre-n1103', type: 'unlocks_horizon', strength: 0.85 },
    { id: 'e-pierre-h8', source: 'skill-recolte', target: 'job-pierre-a1401', type: 'unlocks_horizon', strength: 0.95 },
    { id: 'e-pierre-h8b', source: 'skill-equipements-cueillette', target: 'job-pierre-a1401', type: 'unlocks_horizon', strength: 0.85 },
    { id: 'e-pierre-h9', source: 'cap-vigilance-secours', target: 'job-pierre-g1247', type: 'unlocks_horizon', strength: 0.85 },
    { id: 'e-pierre-h10', source: 'cap-vigilance-secours', target: 'job-pierre-g1224', type: 'unlocks_horizon', strength: 0.85 }
  ]
};
