import { CognitiveProfile } from '../types';

// ============================================================================
// PROFIL : AMÉLIE CRUAGNES — Technicienne du son & Sonorisatrice
// Source : CV_2021-11-10_AMELIE_CRUAGNES (3).pdf (raw/)
// Parcours : Bac STL -> Licence Ciné/AV -> BTS Audiovisuel Métiers du son
//            -> Technicien Son RNCP III -> expériences de sonorisation live
// ============================================================================
export const AMELIE_PROFILE: CognitiveProfile = {
  id: 'profile-amelie-cruagnes',
  personName: 'Amélie Cruagnes',
  headline: 'Technicienne du son & sonorisatrice — BTS Audiovisuel Métiers du son',
  coreMotto: 'Faire résonner le spectacle : la technique au service de l\u2019émotion.',
  location: 'Frontignan (34110) • Occitanie',
  email: 'ameliecruagnes@gmail.com',
  journeyType: 'student',
  currentSimulationYear: 2026,

  cognitiveSignature: {
    dominantReasoning: 'Perception auditive fine & coordination technique en direct',
    transferabilityIndex: 78,
    learningVelocity: 'Élevée',
    adaptabilityIndex: 85,
    summaryText: 'Profil de technicienne du spectacle vivant et de l\u2019audiovisuel : une oreille entraînée par la pratique musicale (batterie, percussions, chant), une maîtrise technique complète de la chaîne son (captation, synchronisation, mixage, sonorisation) et une capacité éprouvée à travailler sous pression en direct, en équipe, sur des scènes variées.',
    keyStrengths: [
      'Chaîne son complète maîtrisée : captation, synchronisation, mixage, façade et retours',
      'Double culture spectacle vivant & audiovisuel (théâtre, court-métrage, concerts)',
      'Autonomie et réactivité sur plateau (installation, câblage, dépannage en direct)',
      'Pratique musicale active (batterie, percussions, chant) : sensibilité artistique concrète',
      'Anglais courant (B2) : communication avec équipes et artistes internationaux'
    ]
  },

  nodes: [
    // ========================================================================
    // 1. FORMATIONS (Explicite — diplômes)
    // ========================================================================
    {
      id: 'form-bac-stl',
      name: 'Baccalauréat Technologique STL (Sciences et Technologies de Laboratoire)',
      category: 'formation',
      period: '2015 – 2016',
      startYear: 2015,
      endYear: 2016,
      institutionOrContext: 'Lycée Paul Valéry, Sète',
      role: 'Bachelière',
      description: 'Formation technologique centrée sur les sciences de laboratoire : mesure, instrumentation, démarche expérimentale.',
      verificationStatus: 'verified',
      confidenceScore: 100,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-amelie-bac', source: 'diploma', label: 'Diplôme du Baccalauréat STL', confidenceScore: 100, date: '2016' }
      ],
      missions: [
        'Pratique de laboratoire et rigueur de mesure',
        'Analyse de signaux et instrumentation'
      ],
      cognitiveEfforts: [
        'Rigueur méthodologique et précision des relevés',
        'Compréhension des phénomènes physiques'
      ],
      x: 120,
      y: 80
    },
    {
      id: 'form-licence-cine',
      name: '1ère année de Licence Études Cinématographiques et Audiovisuelles',
      category: 'formation',
      period: '2016 – 2017',
      startYear: 2016,
      endYear: 2017,
      institutionOrContext: 'Université Paul Valéry Montpellier',
      role: 'Étudiante en études audiovisuelles',
      description: 'Année de licence centrée sur l\u2019analyse filmique, l\u2019histoire du cinéma et les bases de la production audiovisuelle.',
      verificationStatus: 'verified',
      confidenceScore: 100,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-amelie-licence', source: 'diploma', label: 'Validation 1ère année de Licence (attestation)', confidenceScore: 95, date: '2017' }
      ],
      missions: [
        'Analyse de séquences et écriture audiovisuelle',
        'Initiation aux métiers de la production'
      ],
      cognitiveEfforts: [
        'Lecture critique d\u2019images et de sons',
        'Mise en récit et analyse esthétique'
      ],
      x: 120,
      y: 180
    },
    {
      id: 'form-bts-son',
      name: 'BTS Audiovisuel — Option Métiers du son',
      category: 'formation',
      period: '2017 – 2019',
      startYear: 2017,
      endYear: 2019,
      institutionOrContext: 'ACFA MULTIMEDIA, Montpellier',
      role: 'Étudiante BTS',
      description: 'Formation professionnelle complète aux métiers du son : prise de son, montage, mixage, sonorisation, technologies audio.',
      verificationStatus: 'verified',
      confidenceScore: 100,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-amelie-bts', source: 'diploma', label: 'Diplôme BTS Audiovisuel option Métiers du son', confidenceScore: 100, date: '2019' }
      ],
      missions: [
        'Prise de son et captation en conditions réelles',
        'Montage et mixage sur stations de travail audio',
        'Sonorisation de spectacles et concerts'
      ],
      cognitiveEfforts: [
        'Écoute analytique et comparaison critique',
        'Gestion de projets techniques sous contraintes'
      ],
      x: 120,
      y: 280
    },
    {
      id: 'form-rncp-son',
      name: 'Technicien Son orienté Sonorisation — RNCP niveau III',
      category: 'formation',
      period: '2019',
      startYear: 2019,
      endYear: 2019,
      institutionOrContext: 'ACFA MULTIMEDIA, Montpellier',
      role: 'Diplômée RNCP III',
      description: 'Certification professionnelle spécialisée en sonorisation : systèmes de diffusion, façade, retours, régie.',
      verificationStatus: 'verified',
      confidenceScore: 100,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-amelie-rncp', source: 'diploma', label: 'Titre professionnel Technicien Son (RNCP III)', confidenceScore: 100, date: '2019' }
      ],
      missions: [
        'Installation et réglage de systèmes de sonorisation',
        'Conduite de la régie son pendant les représentations'
      ],
      cognitiveEfforts: [
        'Anticipation des besoins scéniques et acoustiques',
        'Réactivité en situation de direct'
      ],
      x: 120,
      y: 380
    },

    // ========================================================================
    // 2. EXPÉRIENCES PROFESSIONNELLES
    // ========================================================================
    {
      id: 'exp-collectif-orchestre',
      name: 'Sonorisatrice — « Collectif Orchestré » du Conservatoire (CRI bassin de Thau)',
      category: 'experience',
      period: '2017 – aujourd\u2019hui',
      startYear: 2017,
      endYear: 2026,
      institutionOrContext: 'Conservatoire à Rayonnement Intercommunal du bassin de Thau, Frontignan',
      role: 'Sonorisatrice',
      description: 'Sonorisation des concerts et spectacles du collectif orchestral du conservatoire : installation plateau, façade et retours.',
      verificationStatus: 'verified',
      confidenceScore: 97,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-amelie-exp1', source: 'exp', label: 'CV — Sonorisatrice Collectif Orchestré (depuis 09/2017)', confidenceScore: 97, date: '2017-2026' }
      ],
      missions: [
        'Installation du plateau (enceintes, micros, retours)',
        'Sonorisation façade et retours de spectacle',
        'Réglages en répétition et gestion du direct'
      ],
      cognitiveEfforts: [
        'Écoute critique continue pendant la représentation',
        'Coordination avec musiciens et régisseurs'
      ],
      metrics: { durationMonths: 100 },
      x: 400,
      y: 120
    },
    {
      id: 'exp-cabane-cie',
      name: 'Technicienne Son — La Cabane Cie',
      category: 'experience',
      period: '2018 – aujourd\u2019hui',
      startYear: 2018,
      endYear: 2026,
      institutionOrContext: 'La Cabane Cie, Sète',
      role: 'Technicienne Son',
      description: 'Prestations audiovisuelles et théâtrales : captation sonore de court-métrage, synchronisation, mixage et sonorisation de représentations.',
      verificationStatus: 'verified',
      confidenceScore: 96,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-amelie-exp2', source: 'exp', label: 'CV — Technicienne Son La Cabane Cie (depuis 08/2018)', confidenceScore: 96, date: '2018-2026' }
      ],
      missions: [
        'Captation sonore sur un court-métrage (perche)',
        'Synchronisation sonore et mixage',
        'Sonorisation lors de représentations théâtrales'
      ],
      cognitiveEfforts: [
        'Passage fluide entre plateau, post-production et live',
        'Adaptation au langage artistique de chaque projet'
      ],
      metrics: { durationMonths: 90 },
      x: 400,
      y: 240
    },
    {
      id: 'exp-orchestre-selmer',
      name: 'Stagiaire Technicienne Son — Orchestre Paul Selmer',
      category: 'experience',
      period: '2018',
      startYear: 2018,
      endYear: 2018,
      institutionOrContext: 'Orchestre Paul Selmer, Hérault',
      role: 'Stagiaire Technicienne Son',
      description: 'Stage d\u2019assistance à l\u2019ingénieur du son : installation, câblage et sonorisation.',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-amelie-exp3', source: 'exp', label: 'CV — Stage Orchestre Paul Selmer (08-09/2018)', confidenceScore: 98, date: '2018' }
      ],
      missions: [
        'Assistance de l\u2019ingénieur du son',
        'Installation du plateau, câblage, rangement de scène',
        'Sonorisation'
      ],
      cognitiveEfforts: [
        'Vitesse et organisation du montage/démontage',
        'Respect des procédures techniques'
      ],
      x: 400,
      y: 360
    },
    {
      id: 'exp-demd',
      name: 'Stagiaire Technicienne Son — DEMD Productions « Tandem »',
      category: 'experience',
      period: '2018',
      startYear: 2018,
      endYear: 2018,
      institutionOrContext: 'DEMD PRODUCTIONS, Montpellier',
      role: 'Stagiaire Technicienne Son',
      description: 'Stage en production : assistance du technicien son et captation sonore.',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-amelie-exp4', source: 'exp', label: 'CV — Stage DEMD Productions (11-12/2018)', confidenceScore: 98, date: '2018' }
      ],
      missions: [
        'Assistance du technicien son',
        'Captation sonore'
      ],
      cognitiveEfforts: [
        'Apprentissage rapide des méthodes de production',
        'Polyvalence sur les postes techniques'
      ],
      x: 400,
      y: 460
    },

    // ========================================================================
    // 3. TÂCHES (traçabilité fine)
    // ========================================================================
    {
      id: 'task-amelie-facade',
      name: 'Sonoriser façade et retours d\u2019un spectacle',
      category: 'task',
      experienceId: 'exp-collectif-orchestre',
      context: 'Conservatoire CRI bassin de Thau',
      actions: [
        'Positionner et régler les enceintes de façade',
        'Configurer les retours de scène pour les musiciens',
        'Conduire la régie son en direct'
      ],
      skillsProduced: ['skill-installation-sono', 'skill-coordination-sono', 'skill-determination-materiel'],
      description: 'Tâche extraite du CV et reliée aux compétences de sonorisation.',
      verificationStatus: 'verified',
      confidenceScore: 95,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-task-amelie-1', source: 'cv', sourceDocument: 'CV_2021-11-10_AMELIE_CRUAGNES (3).pdf', label: 'CV — Installation plateau, sonorisation façade et retours', confidenceScore: 97, date: '2017-2026' }
      ],
      x: 640,
      y: 140
    },
    {
      id: 'task-amelie-captation',
      name: 'Captation sonore d\u2019un court-métrage',
      category: 'task',
      experienceId: 'exp-cabane-cie',
      context: 'La Cabane Cie, Sète',
      actions: [
        'Captation au micro-perche',
        'Synchronisation son/image en post-production',
        'Mixage du projet'
      ],
      skillsProduced: ['skill-captation-son', 'skill-mixage-protools'],
      description: 'Tâche extraite du CV et reliée aux compétences de prise de son et de mixage.',
      verificationStatus: 'verified',
      confidenceScore: 95,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-task-amelie-2', source: 'cv', sourceDocument: 'CV_2021-11-10_AMELIE_CRUAGNES (3).pdf', label: 'CV — Captation sonore, synchronisation et mixage (court-métrage)', confidenceScore: 96, date: '2018-2026' }
      ],
      x: 640,
      y: 260
    },

    // ========================================================================
    // 4. COMPÉTENCES (formulations alignées sur le référentiel ROME)
    // ========================================================================
    {
      id: 'skill-installation-sono',
      name: 'Installer du matériel de sonorisation',
      category: 'skill_tech',
      baseMastery: 88,
      acquiredYear: 2017,
      lastPracticedYear: 2026,
      halfLifeYears: 6,
      decayFactor: 0.1,
      transferabilityScore: 8,
      subSkills: ['Câblage', 'Positionnement enceintes', 'Réglage retours'],
      description: 'Mise en place et configuration de systèmes de sonorisation pour le spectacle vivant.',
      verificationStatus: 'verified',
      confidenceScore: 96,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-sk-amelie-1', source: 'cv', label: 'Installation plateau, façade et retours (Collectif Orchestré)', confidenceScore: 96, date: '2017-2026' },
        { id: 'ev-sk-amelie-1b', source: 'cv', label: 'Installation plateau et câblage (stage Orchestre Paul Selmer)', confidenceScore: 96, date: '2018' }
      ],
      x: 800,
      y: 100
    },
    {
      id: 'skill-coordination-sono',
      name: 'Coordonner les activités de sonorisation lors d\u2019événements',
      category: 'skill_tech',
      baseMastery: 82,
      acquiredYear: 2017,
      lastPracticedYear: 2026,
      halfLifeYears: 6,
      decayFactor: 0.1,
      transferabilityScore: 8,
      subSkills: ['Régie direct', 'Coordination artistes', 'Conduite de spectacle'],
      description: 'Coordination technique et humaine de la sonorisation en conditions de direct.',
      verificationStatus: 'verified',
      confidenceScore: 94,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-sk-amelie-2', source: 'cv', label: 'Sonorisation de concerts et représentations en direct', confidenceScore: 94, date: '2017-2026' }
      ],
      x: 800,
      y: 200
    },
    {
      id: 'skill-determination-materiel',
      name: 'Déterminer le type et l\u2019emplacement du matériel sonore',
      category: 'skill_tech',
      baseMastery: 80,
      acquiredYear: 2018,
      lastPracticedYear: 2026,
      halfLifeYears: 6,
      decayFactor: 0.1,
      transferabilityScore: 7,
      subSkills: ['Choix du système adapté à la salle', 'Plan d\u2019implantation', 'Écoute comparative'],
      description: 'Conception technique de l\u2019installation sonore en fonction de la jauge et de l\u2019acoustique.',
      verificationStatus: 'verified',
      confidenceScore: 92,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-sk-amelie-3', source: 'cv', label: 'BTS Métiers du son + titres RNCP sonorisation', confidenceScore: 92, date: '2017-2019' }
      ],
      x: 800,
      y: 300
    },
    {
      id: 'skill-captation-son',
      name: 'Captation sonore (prise de son)',
      category: 'skill_tech',
      baseMastery: 85,
      acquiredYear: 2017,
      lastPracticedYear: 2026,
      halfLifeYears: 5,
      decayFactor: 0.1,
      transferabilityScore: 7,
      subSkills: ['Micro-perche', 'Prise de son studio', 'Placement micros'],
      description: 'Captation sonore en conditions réelles : perche, studio, concert.',
      verificationStatus: 'verified',
      confidenceScore: 95,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-sk-amelie-4', source: 'cv', label: 'Captation sonore court-métrage (La Cabane Cie) et stage DEMD', confidenceScore: 95, date: '2018' }
      ],
      x: 800,
      y: 400
    },
    {
      id: 'skill-mixage-protools',
      name: 'Utiliser des logiciels de production musicale et de mixage',
      category: 'skill_tech',
      baseMastery: 78,
      acquiredYear: 2017,
      lastPracticedYear: 2025,
      halfLifeYears: 5,
      decayFactor: 0.12,
      transferabilityScore: 7,
      subSkills: ['ProTools', 'Mixage musical', 'Synchronisation sonore'],
      description: 'Production et post-production audio sur stations de travail numériques (ProTools, MAC/PC).',
      verificationStatus: 'verified',
      confidenceScore: 93,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-sk-amelie-5', source: 'cv', label: 'ProTools — mixage, synchronisation (CV)', confidenceScore: 93, date: '2017-2026' }
      ],
      x: 800,
      y: 500
    },
    {
      id: 'skill-composition-musicale',
      name: 'Composer des morceaux de musique et des effets sonores',
      category: 'skill_tech',
      baseMastery: 70,
      acquiredYear: 2010,
      lastPracticedYear: 2026,
      halfLifeYears: 8,
      decayFactor: 0.06,
      transferabilityScore: 8,
      subSkills: ['Batterie', 'Percussions', 'Chant'],
      description: 'Pratique musicale active (batterie, percussions, chant) nourrissant la sensibilité sonore.',
      verificationStatus: 'verified',
      confidenceScore: 90,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-sk-amelie-6', source: 'declaration', label: 'Musicienne : batterie, percussions et chant (centres d\u2019intérêt CV)', confidenceScore: 88, date: '—' }
      ],
      x: 800,
      y: 600
    },
    {
      id: 'skill-communication-anglais',
      name: 'Communiquer en anglais professionnel',
      category: 'skill_relational',
      baseMastery: 72,
      acquiredYear: 2015,
      lastPracticedYear: 2026,
      halfLifeYears: 7,
      decayFactor: 0.08,
      transferabilityScore: 9,
      subSkills: ['Vocabulaire technique audio', 'Communication d\u2019équipe'],
      description: 'Anglais niveau B2 courant, utile aux équipes et artistes internationaux.',
      verificationStatus: 'verified',
      confidenceScore: 88,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-sk-amelie-7', source: 'cv', label: 'Anglais B2 — courant (CV)', confidenceScore: 88, date: '2021' }
      ],
      x: 800,
      y: 700
    },
    {
      id: 'skill-travail-equipe',
      name: 'Travailler en équipe technique',
      category: 'skill_transversal',
      baseMastery: 85,
      acquiredYear: 2017,
      lastPracticedYear: 2026,
      halfLifeYears: 8,
      decayFactor: 0.06,
      transferabilityScore: 9,
      subSkills: ['Coordination plateau', 'Entraide et polyvalence'],
      description: 'Travail en équipe sur plateau et en régie : savoir-être cité dans le CV.',
      verificationStatus: 'verified',
      confidenceScore: 95,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-sk-amelie-8', source: 'cv', label: 'Savoir-être : travail en équipe, autonomie, adaptation (CV)', confidenceScore: 95, date: '2021' }
      ],
      x: 800,
      y: 800
    },
    {
      id: 'skill-adaptation',
      name: 'Capacité d\u2019adaptation & réactivité',
      category: 'skill_transversal',
      baseMastery: 88,
      acquiredYear: 2017,
      lastPracticedYear: 2026,
      halfLifeYears: 8,
      decayFactor: 0.06,
      transferabilityScore: 9,
      subSkills: ['Prise de recul', 'Réactivité', 'Autonomie'],
      description: 'Adaptation rapide aux contextes variés : concerts, théâtre, tournage, productions.',
      verificationStatus: 'verified',
      confidenceScore: 95,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-sk-amelie-9', source: 'cv', label: 'Savoir-être : capacité d\u2019adaptation, prise de recul, réactivité (CV)', confidenceScore: 95, date: '2021' }
      ],
      x: 800,
      y: 900
    },

    // ========================================================================
    // 5. CAPACITÉS COGNITIVES (candidates — niveau 3)
    // ========================================================================
    {
      id: 'cap-coordination-technique',
      name: 'Coordination technique & gestion du direct',
      category: 'capacity_cognitive',
      level: 'avancé',
      cognitiveDimension: 'Coordination & Systémique',
      underlyingSkills: ['skill-installation-sono', 'skill-coordination-sono', 'skill-determination-materiel', 'skill-travail-equipe'],
      description: 'Capacité à orchestrer l\u2019ensemble de la chaîne son en conditions réelles : installation, réglages, régie en direct.',
      verificationStatus: 'inferred',
      inferenceType: 'inference_forte',
      confidenceScore: 88,
      emergentInsight: 'La coordination plateau/façade/retours repose sur une anticipation constante des besoins scéniques — transférable à toute organisation d\u2019événements.',
      x: 1000,
      y: 150
    },
    {
      id: 'cap-ecoute-adaptative',
      name: 'Écoute fine & adaptation en situation',
      category: 'capacity_cognitive',
      level: 'avancé',
      cognitiveDimension: 'Adaptabilité & Imprévus',
      underlyingSkills: ['skill-captation-son', 'skill-mixage-protools', 'skill-adaptation', 'skill-composition-musicale'],
      description: 'Perception auditive affûtée par la pratique musicale, mobilisée pour ajuster le son en continu pendant les représentations.',
      verificationStatus: 'inferred',
      inferenceType: 'inference_forte',
      confidenceScore: 86,
      emergentInsight: 'L\u2019oreille musicale constitue un atout différenciant face aux aléas acoustiques de chaque salle.',
      x: 1000,
      y: 300
    },
    {
      id: 'cap-sensibilite-artistique',
      name: 'Sensibilité artistique & médiation culturelle',
      category: 'capacity_cognitive',
      level: 'fondamental',
      cognitiveDimension: 'Humain & Médiation',
      underlyingSkills: ['skill-composition-musicale', 'skill-communication-anglais'],
      description: 'Compréhension du langage artistique (musique, théâtre, cinéma) permettant de traduire les intentions des artistes en solutions techniques.',
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
      id: 'job-amelie-1508',
      name: 'Ingénieur / Ingénieure du son (ROME L1508)',
      category: 'horizon_job',
      domain: 'Arts & Spectacle — Son',
      romeCode: 'L1508',
      romeTitle: 'Ingénieur / Ingénieure du son',
      matchScore: 86,
      compatibilityLevel: 'Très forte',
      verificationStatus: 'inferred',
      inferenceType: 'inference_a_valider',
      confidenceScore: 84,
      rationale: 'Profil aligné sur la fiche ROME L1508 : installation et contrôle des installations sonores, détermination du matériel, diffusion sonore. Le BTS Métiers du son et les expériences de sonorisation en direct constituent les preuves principales.',
      matchingSkills: [
        'Installer du matériel de sonorisation',
        'Coordonner les activités de sonorisation lors d\u2019événements',
        'Déterminer le type et l\u2019emplacement du matériel sonore',
        'Contrôler la conformité des installations sonores'
      ],
      missingSkills: [
        {
          name: 'Gestion de projet technique complet',
          importance: 'recommandée',
          learningBridge: 'Approfondir la direction technique de projets de grande ampleur (jauge, budgets, équipes).'
        }
      ],
      unlockedOpportunities: [
        'Régisseur son de tournées et festivals',
        'Ingénieur du son studio',
        'Coordinateur technique d\u2019événements'
      ],
      description: 'Conception, installation et conduite des systèmes sonores pour le spectacle, le cinéma et l\u2019audiovisuel.',
      x: 1200,
      y: 150
    },
    {
      id: 'job-amelie-1511',
      name: 'Technicien / Technicienne spectacle en site de divertissement (ROME L1511)',
      category: 'horizon_job',
      domain: 'Arts & Spectacle — Technique',
      romeCode: 'L1511',
      romeTitle: 'Technicien / Technicienne spectacle en site de divertissement',
      matchScore: 82,
      compatibilityLevel: 'Très forte',
      verificationStatus: 'inferred',
      inferenceType: 'inference_a_valider',
      confidenceScore: 80,
      rationale: 'Les compétences de détermination du matériel sonore et d\u2019installation de sonorisation correspondent directement à cette fiche ROME. Expériences en régie live (Collectif Orchestré, La Cabane Cie).',
      matchingSkills: [
        'Déterminer le type et l\u2019emplacement du matériel sonore',
        'Installer du matériel de sonorisation',
        'Travailler en équipe technique'
      ],
      missingSkills: [
        {
          name: 'Techniques d\u2019éclairage et machinerie de scène',
          importance: 'bonus',
          learningBridge: 'Module complémentaire régie générale (lumière, machinerie) pour élargir le spectre technique.'
        }
      ],
      unlockedOpportunities: [
        'Technicienne plateau polyvalente',
        'Régisseuse de site',
        'Technicienne d\u2019accueil d\u2019événements'
      ],
      description: 'Technique du spectacle en sites et parcs : installation, exploitation et dépannage des équipements.',
      x: 1200,
      y: 300
    },
    {
      id: 'job-amelie-dj',
      name: 'DJ / Orchestrateur musical (ROME L1101 / L1210)',
      category: 'horizon_job',
      domain: 'Arts & Spectacle — Musique',
      romeCode: 'L1101',
      romeTitle: 'DJ',
      matchScore: 68,
      compatibilityLevel: 'Forte',
      verificationStatus: 'inferred',
      inferenceType: 'inference_a_valider',
      confidenceScore: 70,
      rationale: 'La maîtrise des logiciels de production musicale et de mixage (ProTools) ainsi que la pratique musicale active (batterie, percussions, chant) ouvrent vers les métiers de la diffusion musicale.',
      matchingSkills: [
        'Utiliser des logiciels de production musicale et de mixage',
        'Composer des morceaux de musique et des effets sonores'
      ],
      missingSkills: [
        {
          name: 'Techniques avancées de DJing et de programmation musicale',
          importance: 'recommandée',
          learningBridge: 'Formation courte aux techniques DJ (mixing, transitions, set building).'
        }
      ],
      unlockedOpportunities: [
        'DJ / sélectionneuse musicale',
        'Assistante de production musicale',
        'Compositrice d\u2019ambiances sonores'
      ],
      description: 'Diffusion et création musicale : mixage live, programmation, composition d\u2019ambiances.',
      x: 1200,
      y: 450
    }
  ],

  edges: [
    // Formations -> Compétences
    { id: 'e-amelie-f1', source: 'form-bac-stl', target: 'skill-adaptation', type: 'acquired_in', strength: 0.6, label: 'Rigueur méthodologique' },
    { id: 'e-amelie-f2', source: 'form-licence-cine', target: 'skill-composition-musicale', type: 'acquired_in', strength: 0.7, label: 'Culture audiovisuelle' },
    { id: 'e-amelie-f3', source: 'form-bts-son', target: 'skill-captation-son', type: 'acquired_in', strength: 0.95, label: 'Prise de son' },
    { id: 'e-amelie-f3b', source: 'form-bts-son', target: 'skill-mixage-protools', type: 'acquired_in', strength: 0.95, label: 'Mixage ProTools' },
    { id: 'e-amelie-f4', source: 'form-rncp-son', target: 'skill-installation-sono', type: 'acquired_in', strength: 0.98, label: 'Sonorisation' },
    { id: 'e-amelie-f4b', source: 'form-rncp-son', target: 'skill-coordination-sono', type: 'acquired_in', strength: 0.9, label: 'Régie direct' },

    // Expériences -> Tâches -> Compétences
    { id: 'e-amelie-e1', source: 'exp-collectif-orchestre', target: 'task-amelie-facade', type: 'composed_of', strength: 1, label: 'Tâche documentée' },
    { id: 'e-amelie-e2', source: 'exp-cabane-cie', target: 'task-amelie-captation', type: 'composed_of', strength: 1, label: 'Tâche documentée' },
    { id: 'e-amelie-t1', source: 'task-amelie-facade', target: 'skill-installation-sono', type: 'demonstrates_skill', strength: 0.95, label: 'Installation démontrée' },
    { id: 'e-amelie-t1b', source: 'task-amelie-facade', target: 'skill-coordination-sono', type: 'demonstrates_skill', strength: 0.9, label: 'Régie démontrée' },
    { id: 'e-amelie-t1c', source: 'task-amelie-facade', target: 'skill-determination-materiel', type: 'demonstrates_skill', strength: 0.85, label: 'Choix matériel' },
    { id: 'e-amelie-t2', source: 'task-amelie-captation', target: 'skill-captation-son', type: 'demonstrates_skill', strength: 0.95, label: 'Captation démontrée' },
    { id: 'e-amelie-t2b', source: 'task-amelie-captation', target: 'skill-mixage-protools', type: 'demonstrates_skill', strength: 0.9, label: 'Mixage démontré' },

    // Expériences directes -> compétences
    { id: 'e-amelie-e3', source: 'exp-orchestre-selmer', target: 'skill-installation-sono', type: 'acquired_in', strength: 0.9, label: 'Installation & câblage' },
    { id: 'e-amelie-e4', source: 'exp-demd', target: 'skill-captation-son', type: 'acquired_in', strength: 0.9, label: 'Captation stage' },
    { id: 'e-amelie-e5', source: 'exp-collectif-orchestre', target: 'skill-travail-equipe', type: 'acquired_in', strength: 0.85, label: 'Travail d\u2019équipe' },
    { id: 'e-amelie-e6', source: 'exp-cabane-cie', target: 'skill-adaptation', type: 'acquired_in', strength: 0.85, label: 'Polyvalence projets' },

    // Compétences -> Capacités
    { id: 'e-amelie-c1', source: 'skill-installation-sono', target: 'cap-coordination-technique', type: 'feeds_capacity', strength: 0.9 },
    { id: 'e-amelie-c2', source: 'skill-coordination-sono', target: 'cap-coordination-technique', type: 'feeds_capacity', strength: 0.9 },
    { id: 'e-amelie-c3', source: 'skill-determination-materiel', target: 'cap-coordination-technique', type: 'feeds_capacity', strength: 0.8 },
    { id: 'e-amelie-c4', source: 'skill-captation-son', target: 'cap-ecoute-adaptative', type: 'feeds_capacity', strength: 0.85 },
    { id: 'e-amelie-c5', source: 'skill-mixage-protools', target: 'cap-ecoute-adaptative', type: 'feeds_capacity', strength: 0.85 },
    { id: 'e-amelie-c6', source: 'skill-composition-musicale', target: 'cap-ecoute-adaptative', type: 'feeds_capacity', strength: 0.9 },
    { id: 'e-amelie-c7', source: 'skill-composition-musicale', target: 'cap-sensibilite-artistique', type: 'feeds_capacity', strength: 0.9 },
    { id: 'e-amelie-c8', source: 'skill-communication-anglais', target: 'cap-sensibilite-artistique', type: 'feeds_capacity', strength: 0.6 },

    // Capacités & compétences -> Horizons
    { id: 'e-amelie-h1', source: 'skill-installation-sono', target: 'job-amelie-1508', type: 'unlocks_horizon', strength: 0.9 },
    { id: 'e-amelie-h2', source: 'skill-coordination-sono', target: 'job-amelie-1508', type: 'unlocks_horizon', strength: 0.9 },
    { id: 'e-amelie-h3', source: 'skill-determination-materiel', target: 'job-amelie-1511', type: 'unlocks_horizon', strength: 0.85 },
    { id: 'e-amelie-h4', source: 'skill-installation-sono', target: 'job-amelie-1511', type: 'unlocks_horizon', strength: 0.85 },
    { id: 'e-amelie-h5', source: 'skill-mixage-protools', target: 'job-amelie-dj', type: 'unlocks_horizon', strength: 0.85 },
    { id: 'e-amelie-h6', source: 'skill-composition-musicale', target: 'job-amelie-dj', type: 'unlocks_horizon', strength: 0.85 },
    { id: 'e-amelie-h7', source: 'cap-coordination-technique', target: 'job-amelie-1508', type: 'unlocks_horizon', strength: 0.8 },
    { id: 'e-amelie-h8', source: 'cap-ecoute-adaptative', target: 'job-amelie-1511', type: 'unlocks_horizon', strength: 0.8 }
  ]
};
