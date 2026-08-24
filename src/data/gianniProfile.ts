import { CognitiveProfile } from '../types';

// ============================================================================
// PROFIL : GIANNI DUCOEUR — Parcours voyageur polyvalent
// Sources : CV_-_Agriculture gianni.pdf + CV_2025_BAT gianni.pdf (raw/)
// Parcours : agriculture, cueillette, logistique, restauration bâtiment,
//            contrôle routier (NZ), manœuvre BTP, cordiste (travaux en hauteur)
// ============================================================================
export const GIANNI_PROFILE: CognitiveProfile = {
  id: 'profile-gianni-ducoeur',
  personName: 'Gianni Ducoeur',
  headline: 'Parcours voyageur polyvalent — agriculture, logistique, BTP & travaux en hauteur',
  coreMotto: 'Curieux de tout, j\u2019apprends et j\u2019ajoute des cordes à mon arc — en voyageant.',
  location: 'Sète (34200) • Occitanie',
  email: 'gianniducoeur@gmail.com',
  journeyType: 'transition',
  currentSimulationYear: 2026,

  cognitiveSignature: {
    dominantReasoning: 'Apprentissage accéléré par l\u2019expérience & adaptation interculturelle',
    transferabilityIndex: 88,
    learningVelocity: 'Exceptionnelle',
    adaptabilityIndex: 92,
    summaryText: 'Profil de travailleur polyvalent international : plus de 12 expériences sur 4 continents (France, Nouvelle-Zélande, Danemark), couvrant l\u2019agriculture (viticulture, cueillette, élevage, transformation fromagère), la logistique (conditionnement, stockage), le bâtiment (maçonnerie, menuiserie, peinture, plâtrerie) et les travaux en hauteur (cordiste, SST, habilitation électrique). Capacité d\u2019apprentissage terrain exceptionnelle, autonomie complète, et savoir-être reconnu : débrouillardise, bonne humeur et fiabilité.',
    keyStrengths: [
      'Polyvalence métiers extrême : agriculture, logistique, BTP, travaux en hauteur',
      'Mobilité internationale éprouvée (Nouvelle-Zélande, Danemark) et adaptation immédiate',
      'Sécurité : SST (2023), habilitation électrique H0B0 (2023), gestes de premiers secours',
      'Travaux en hauteur et accès difficile (cordiste certifié sur cordes)',
      'Autonomie complète : chantier, ferme, entrepôt — de la préparation à la livraison'
    ]
  },

  nodes: [
    // ========================================================================
    // 1. FORMATIONS & CERTIFICATIONS (Explicite)
    // ========================================================================
    {
      id: 'form-bac-sti-gianni',
      name: 'Baccalauréat STI Génie Électronique',
      category: 'formation',
      period: '2012',
      startYear: 2012,
      endYear: 2012,
      institutionOrContext: 'Sète',
      role: 'Bachelier STI',
      description: 'Baccalauréat technologique en génie électronique : bases en électricité, électronique et systèmes.',
      verificationStatus: 'verified',
      confidenceScore: 100,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-bac', source: 'diploma', label: 'Diplôme Baccalauréat STI Génie Électronique', confidenceScore: 100, date: '2012' }
      ],
      missions: [
        'Électricité, électronique, logique câblée',
        'Lecture de schémas techniques'
      ],
      cognitiveEfforts: [
        'Raisonnement technique et logique',
        'Compréhension des systèmes électriques'
      ],
      x: 120,
      y: 80
    },
    {
      id: 'form-bafa',
      name: 'BAFA — Diplôme d\u2019animation',
      category: 'formation',
      period: '2010',
      startYear: 2010,
      endYear: 2010,
      institutionOrContext: 'Sète',
      role: 'Animateur diplômé',
      description: 'Diplôme d\u2019animateur : encadrement d\u2019enfants, sécurité, activités collectives.',
      verificationStatus: 'verified',
      confidenceScore: 100,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-bafa', source: 'diploma', label: 'BAFA', confidenceScore: 100, date: '2010' }
      ],
      missions: [
        'Encadrement de groupes d\u2019enfants',
        'Organisation d\u2019activités'
      ],
      cognitiveEfforts: [
        'Sens des responsabilités',
        'Communication et pédagogie'
      ],
      x: 120,
      y: 180
    },
    {
      id: 'form-sst',
      name: 'Sauveteur Secouriste du Travail (SST)',
      category: 'formation',
      period: '2023',
      startYear: 2023,
      endYear: 2023,
      institutionOrContext: 'Vercors',
      role: 'Certifié SST',
      description: 'Certification aux gestes d\u2019urgence et de premiers secours en milieu professionnel.',
      verificationStatus: 'verified',
      confidenceScore: 100,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-sst', source: 'attest', label: 'Certificat SST (03/2023)', confidenceScore: 100, date: '2023' }
      ],
      missions: [
        'Gestes d\u2019urgence et de secours',
        'Protection et alerte en cas d\u2019accident'
      ],
      cognitiveEfforts: [
        'Sang-froid et réactivité',
        'Application de protocoles'
      ],
      x: 120,
      y: 280
    },
    {
      id: 'form-h0b0',
      name: 'Habilitation Électrique H0B0',
      category: 'formation',
      period: '2023',
      startYear: 2023,
      endYear: 2023,
      institutionOrContext: 'Vercors',
      role: 'Habilité électrique',
      description: 'Habilitation électrique niveau 0 (H0B0) : travaux d\u2019ordre non électrique à proximité d\u2019installations.',
      verificationStatus: 'verified',
      confidenceScore: 100,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-h0b0', source: 'attest', label: 'Habilitation H0B0 (03/2023)', confidenceScore: 100, date: '2023' }
      ],
      missions: [
        'Règles de sécurité électrique',
        'Travaux à proximité des installations'
      ],
      cognitiveEfforts: [
        'Respect strict des consignes de sécurité'
      ],
      x: 120,
      y: 380
    },

    // ========================================================================
    // 2. EXPÉRIENCES — PARCOURS VOYAGEUR
    // ========================================================================
    {
      id: 'exp-cordiste-sudacrobatic',
      name: 'Cordiste — SudAcrobatic',
      category: 'experience',
      period: '2024',
      startYear: 2024,
      endYear: 2024,
      institutionOrContext: 'SudAcrobatic, Gigean',
      role: 'Cordiste',
      description: 'Travaux d\u2019accès difficile urbain et industriel : toiture, façade, nettoyage de vitres, zones ATEX.',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-exp1', source: 'cv', sourceDocument: 'CV_2025_BAT gianni.pdf', label: 'CV — Cordiste SudAcrobatic (02-05/2024)', confidenceScore: 98, date: '2024' }
      ],
      missions: [
        'Travaux en hauteur sur cordes (toiture, façade)',
        'Nettoyage de vitres en accès difficile',
        'Interventions en zones ATEX'
      ],
      cognitiveEfforts: [
        'Gestion du risque et concentration prolongée en hauteur',
        'Autonomie totale sur site'
      ],
      metrics: { durationMonths: 4 },
      x: 380,
      y: 100
    },
    {
      id: 'exp-cordiste-a2cordes',
      name: 'Cordiste — A2cordes',
      category: 'experience',
      period: '2023',
      startYear: 2023,
      endYear: 2023,
      institutionOrContext: 'A2cordes, Bordeaux',
      role: 'Cordiste',
      description: 'Travaux d\u2019accès difficile urbain : bardage, façade, peinture.',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-exp2', source: 'cv', sourceDocument: 'CV_2025_BAT gianni.pdf', label: 'CV — Cordiste A2cordes (07-08/2023)', confidenceScore: 98, date: '2023' }
      ],
      missions: [
        'Bardage et travaux de façade',
        'Peinture en hauteur',
        'Installation des cordes d\u2019accès'
      ],
      cognitiveEfforts: [
        'Précision gestuelle en suspension',
        'Analyse des points d\u2019ancrage'
      ],
      metrics: { durationMonths: 2 },
      x: 380,
      y: 220
    },
    {
      id: 'exp-vinci',
      name: 'Manœuvre maçonnerie — Vinci Construction Bourdarios',
      category: 'experience',
      period: '2021',
      startYear: 2021,
      endYear: 2021,
      institutionOrContext: 'Vinci Construction Bourdarios, Toulouse',
      role: 'Manœuvre maçonnerie',
      description: 'Chantier de gros œuvre : (dés)étaiement, mise en sécurité du site, manipulation d\u2019outils et de matériaux.',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-exp3', source: 'cv', sourceDocument: 'CV_2025_BAT gianni.pdf', label: 'CV — Manœuvre Vinci (09-11/2021)', confidenceScore: 98, date: '2021' }
      ],
      missions: [
        'Désétaiement et étaiement',
        'Mise en sécurité du site',
        'Manipulation d\u2019outils et matériaux'
      ],
      cognitiveEfforts: [
        'Respect des consignes de sécurité chantier',
        'Effort physique soutenu et organisation'
      ],
      metrics: { durationMonths: 3 },
      x: 380,
      y: 340
    },
    {
      id: 'exp-viticole',
      name: 'Ouvrier viticole — Gea Leognan',
      category: 'experience',
      period: '2022',
      startYear: 2022,
      endYear: 2022,
      institutionOrContext: 'Gea Leognan (Gironde)',
      role: 'Ouvrier viticole',
      description: 'Travaux de la vigne : épamprage, levage (+ vendanges en 2014).',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-exp4', source: 'cv', sourceDocument: 'CV_-_Agriculture gianni.pdf', label: 'CV — Ouvrier viticole Gea Leognan (06-07/2022)', confidenceScore: 98, date: '2022' }
      ],
      missions: [
        'Épamprage et levage de la vigne',
        'Vendanges (2014)'
      ],
      cognitiveEfforts: [
        'Gestes techniques répétitifs précis',
        'Travail en extérieur toute saison'
      ],
      metrics: { durationMonths: 2 },
      x: 380,
      y: 460
    },
    {
      id: 'exp-planteur',
      name: 'Planteur — Planète Végétal & Nursery TeNgae RD',
      category: 'experience',
      period: '2020 – 2021',
      startYear: 2020,
      endYear: 2021,
      institutionOrContext: 'Planète Végétal (France) & Nursery TeNgae RD (Nouvelle-Zélande)',
      role: 'Planteur',
      description: 'Plantation de poireaux (4 mois, +3 mois été 2020) et plantation d\u2019arbres en Nouvelle-Zélande.',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-exp5', source: 'cv', sourceDocument: 'CV_-_Agriculture gianni.pdf', label: 'CV — Planteur Planète Végétal (05-08/2021) + NZ', confidenceScore: 98, date: '2020-2021' }
      ],
      missions: [
        'Plantation de poireaux (4 mois)',
        'Plantation d\u2019arbres en Nouvelle-Zélande'
      ],
      cognitiveEfforts: [
        'Rythme de travail soutenu',
        'Adaptation aux techniques de chaque exploitation'
      ],
      metrics: { durationMonths: 8 },
      x: 380,
      y: 580
    },
    {
      id: 'exp-watties',
      name: 'Conditionneur / stockeur — Watties / Mondial Relay',
      category: 'experience',
      period: '2017',
      startYear: 2017,
      endYear: 2017,
      institutionOrContext: 'Watties — Mondial Relay',
      role: 'Conditionneur / stockeur',
      description: '5 mois sur plusieurs missions de 1 à 2 mois : conditionnement, tri, emballage, stockage (jus, fruits, légumes, surgelés, colis).',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-exp6', source: 'cv', sourceDocument: 'CV_-_Agriculture gianni.pdf', label: 'CV — Conditionneur/stockeur Watties (02-06/2017)', confidenceScore: 98, date: '2017' }
      ],
      missions: [
        'Conditionnement et emballage',
        'Tri et répartition des colis (codification, format, poids)',
        'Stockage et gestion des flux'
      ],
      cognitiveEfforts: [
        'Rigueur de tri et rapidité',
        'Organisation logistique'
      ],
      metrics: { durationMonths: 5 },
      x: 380,
      y: 700
    },
    {
      id: 'exp-controleur-routier',
      name: 'Contrôleur Routier — Fulton Hogan',
      category: 'experience',
      period: '2017',
      startYear: 2017,
      endYear: 2017,
      institutionOrContext: 'Fulton Hogan, Nouvelle-Zélande',
      role: 'Contrôleur routier',
      description: 'Mise en sécurité de chantier routier : pose de panneaux de signalisation, organisation/gestion du trafic, entretien des espaces verts.',
      verificationStatus: 'verified',
      confidenceScore: 97,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-exp7', source: 'cv', sourceDocument: 'CV_2025_BAT gianni.pdf', label: 'CV — Contrôleur routier Fulton Hogan (07-12/2017, NZ)', confidenceScore: 97, date: '2017' }
      ],
      missions: [
        'Mise en sécurité du chantier (route)',
        'Pose des panneaux de signalisation',
        'Organisation et gestion du trafic routier',
        'Entretien des espaces verts (publics/privés)'
      ],
      cognitiveEfforts: [
        'Anticipation des risques routiers',
        'Communication avec les usagers et équipes'
      ],
      metrics: { durationMonths: 6 },
      x: 380,
      y: 820
    },
    {
      id: 'exp-restauration-appart',
      name: 'Restauration d\u2019appartement — Particuliers',
      category: 'experience',
      period: '2015',
      startYear: 2015,
      endYear: 2015,
      institutionOrContext: 'Sète',
      role: 'Ouvrier toutes corps d\u2019état',
      description: 'Travaux sous supervision : carrelage, bac à douche, toilettes, tirage cuivre/PER, gaines, placo, enduits, peinture, nettoyage de chantier.',
      verificationStatus: 'verified',
      confidenceScore: 97,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-exp8', source: 'cv', sourceDocument: 'CV_2025_BAT gianni.pdf', label: 'CV — Restauration appartement (01-09/2015)', confidenceScore: 97, date: '2015' }
      ],
      missions: [
        'Pose de carrelage, plomberie (cuivre/PER), gaines',
        'Pose de placo et enduits',
        'Peinture et nettoyage de chantier'
      ],
      cognitiveEfforts: [
        'Polyvalence tous corps d\u2019état',
        'Respect des délais et finitions soignées'
      ],
      metrics: { durationMonths: 9 },
      x: 380,
      y: 940
    },
    {
      id: 'exp-ferme',
      name: 'Aide agricole — Ferme la Chevalerie',
      category: 'experience',
      period: '2015 – 2016',
      startYear: 2015,
      endYear: 2016,
      institutionOrContext: 'Ferme la Chevalerie',
      role: 'Aide agricole',
      description: 'Aide à toutes les tâches de la ferme : terre et animaux (bovins, caprins, porcins, volaille), production et récolte de céréales/légumes, transformation en nourriture animale, fabrication de fromages lactiques (de la traite à l\u2019affinage) et vente aux marchés.',
      verificationStatus: 'verified',
      confidenceScore: 97,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-exp9', source: 'cv', sourceDocument: 'CV_-_Agriculture gianni.pdf', label: 'CV — Aide agricole Ferme la Chevalerie (12/2015-04/2016)', confidenceScore: 97, date: '2015-2016' }
      ],
      missions: [
        'Soins aux animaux (bovins, caprins, porcins, volaille)',
        'Production et récolte de céréales et légumes',
        'Fabrication de fromages lactiques (traite → affinage)',
        'Vente directe sur les marchés'
      ],
      cognitiveEfforts: [
        'Gestion du vivant et des cycles agricoles',
        'Transformation agroalimentaire artisanale'
      ],
      metrics: { durationMonths: 5 },
      x: 380,
      y: 1060
    },
    {
      id: 'exp-cueilleur',
      name: 'Cueilleur / récoltant',
      category: 'experience',
      period: '2015 – 2016',
      startYear: 2015,
      endYear: 2016,
      institutionOrContext: 'Plusieurs exploitations (France)',
      role: 'Cueilleur',
      description: 'Plus d\u2019un an d\u2019expérience cumulée : cueillette/récolte de pommes, raisins, myrtilles, tabac, muguet. Missions de 1 à 4 mois dans différentes entreprises.',
      verificationStatus: 'verified',
      confidenceScore: 97,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-exp10', source: 'cv', sourceDocument: 'CV_-_Agriculture gianni.pdf', label: 'CV — Cueilleur (08/2015-08/2016)', confidenceScore: 97, date: '2015-2016' }
      ],
      missions: [
        'Cueillette de pommes, raisins, myrtilles, tabac, muguet',
        'Respect des consignes de calibrage et de maturité'
      ],
      cognitiveEfforts: [
        'Sélectivité visuelle et gestuelle fine',
        'Endurance en extérieur'
      ],
      metrics: { durationMonths: 12 },
      x: 380,
      y: 1180
    },
    {
      id: 'exp-menuiserie',
      name: 'Manœuvre menuiserie — Artisan Bruy Jean Noël',
      category: 'experience',
      period: '2011 – 2012',
      startYear: 2011,
      endYear: 2012,
      institutionOrContext: 'Artisan Bruy Jean Noël, Sète',
      role: 'Manœuvre menuisier',
      description: 'Aide à la pose : fenêtres, portes, tables, escaliers, parquets, terrasses, meubles en tout genre.',
      verificationStatus: 'verified',
      confidenceScore: 97,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-exp11', source: 'cv', sourceDocument: 'CV_2025_BAT gianni.pdf', label: 'CV — Manœuvre menuiserie (01/2011-02/2012)', confidenceScore: 97, date: '2011-2012' }
      ],
      missions: [
        'Aide à la pose de fenêtres, portes, escaliers',
        'Parquets, terrasses, meubles'
      ],
      cognitiveEfforts: [
        'Lecture de plans et précision de pose',
        'Manutention et travail d\u2019atelier'
      ],
      metrics: { durationMonths: 13 },
      x: 380,
      y: 1300
    },

    // ========================================================================
    // 3. TÂCHES REPRÉSENTATIVES
    // ========================================================================
    {
      id: 'task-g-corde',
      name: 'Installer des cordes d\u2019accès à un poste de travail',
      category: 'task',
      experienceId: 'exp-cordiste-sudacrobatic',
      context: 'SudAcrobatic, Gigean',
      actions: [
        'Analyse des points d\u2019ancrage',
        'Montage des cordes et systèmes de sécurité',
        'Travail en suspension et déplacements verticaux'
      ],
      skillsProduced: ['skill-travaux-hauteur', 'skill-mise-securite', 'skill-secours'],
      description: 'Tâche extraite du CV et reliée aux compétences de travaux en hauteur.',
      verificationStatus: 'verified',
      confidenceScore: 96,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-task-g1', source: 'cv', sourceDocument: 'CV_2025_BAT gianni.pdf', label: 'CV — Installer des cordes d\u2019accès à un poste de travail', confidenceScore: 96, date: '2023-2024' }
      ],
      x: 620,
      y: 140
    },
    {
      id: 'task-g-conditionnement',
      name: 'Conditionner, trier et stocker des produits',
      category: 'task',
      experienceId: 'exp-watties',
      context: 'Watties — Mondial Relay',
      actions: [
        'Conditionnement et emballage des produits',
        'Tri selon codification, format, poids',
        'Stockage et répartition des colis'
      ],
      skillsProduced: ['skill-conditionnement', 'skill-travail-equipe'],
      description: 'Tâche extraite du CV et reliée aux compétences logistiques.',
      verificationStatus: 'verified',
      confidenceScore: 96,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-task-g2', source: 'cv', sourceDocument: 'CV_-_Agriculture gianni.pdf', label: 'CV — Conditionnement, tri, emballage, stockage', confidenceScore: 96, date: '2017' }
      ],
      x: 620,
      y: 720
    },

    // ========================================================================
    // 4. COMPÉTENCES (formulations alignées sur le référentiel ROME)
    // ========================================================================
    {
      id: 'skill-travaux-hauteur',
      name: 'Installer et utiliser des échafaudages roulants en respectant les conditions réglementaires et de sécurité',
      category: 'skill_tech',
      baseMastery: 85,
      acquiredYear: 2023,
      lastPracticedYear: 2024,
      halfLifeYears: 4,
      decayFactor: 0.15,
      transferabilityScore: 7,
      subSkills: ['Techniques de montage de cordes', 'Accès difficile', 'Bardage / façade / toiture'],
      description: 'Travaux en hauteur pratiqués en cordiste (montage de cordes, accès difficile, toiture, façade, zones ATEX). Compétence rapprochée de la formulation référentielle « échafaudages roulants » pour le matching ROME — à confirmer par l\u2019utilisateur.',
      verificationStatus: 'inferred',
      inferenceType: 'inference_forte',
      confidenceScore: 92,
      evidence: [
        { id: 'ev-g-sk1', source: 'cv', label: 'Cordiste SudAcrobatic (2024) & A2cordes (2023)', confidenceScore: 97, date: '2023-2024' }
      ],
      x: 800,
      y: 100
    },
    {
      id: 'skill-mise-securite',
      name: 'Mettre en sécurité un site / un chantier',
      category: 'skill_tech',
      baseMastery: 80,
      acquiredYear: 2015,
      lastPracticedYear: 2024,
      halfLifeYears: 6,
      decayFactor: 0.1,
      transferabilityScore: 8,
      subSkills: ['Mise en sécurité chantier', 'Signalisation', 'Protection collective'],
      description: 'Sécurisation de chantiers (BTP, route) : balisage, signalisation, gestion du risque.',
      verificationStatus: 'verified',
      confidenceScore: 96,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-sk2', source: 'cv', label: 'Vinci (mise en sécurité) + Fulton Hogan NZ (chantier route)', confidenceScore: 96, date: '2017-2021' }
      ],
      x: 800,
      y: 200
    },
    {
      id: 'skill-maçonnerie',
      name: 'Réaliser des ouvrages de maçonnerie',
      category: 'skill_tech',
      baseMastery: 68,
      acquiredYear: 2015,
      lastPracticedYear: 2021,
      halfLifeYears: 6,
      decayFactor: 0.1,
      transferabilityScore: 7,
      subSkills: ['Préparation du béton et mortier', 'Étaiement', 'Travaux de gros œuvre'],
      description: 'Travaux de maçonnerie : préparation des mortiers, étaiement, manœuvre sur chantier de gros œuvre.',
      verificationStatus: 'verified',
      confidenceScore: 94,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-sk3', source: 'cv', label: 'Manœuvre Vinci (2021) + restauration appartement (2015)', confidenceScore: 94, date: '2015-2021' }
      ],
      x: 800,
      y: 300
    },
    {
      id: 'skill-carrelage',
      name: 'Poser du carrelage',
      category: 'skill_tech',
      baseMastery: 70,
      acquiredYear: 2015,
      lastPracticedYear: 2015,
      halfLifeYears: 6,
      decayFactor: 0.1,
      transferabilityScore: 7,
      subSkills: ['Préparation du support', 'Pose', 'Finitions'],
      description: 'Pose de carrelage dans le cadre de la restauration d\u2019appartement.',
      verificationStatus: 'verified',
      confidenceScore: 92,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-sk4', source: 'cv', label: 'Restauration appartement — pose carrelage (2015)', confidenceScore: 92, date: '2015' }
      ],
      x: 800,
      y: 400
    },
    {
      id: 'skill-enduits-peinture',
      name: 'Réaliser des enduits et appliquer des peintures',
      category: 'skill_tech',
      baseMastery: 72,
      acquiredYear: 2015,
      lastPracticedYear: 2024,
      halfLifeYears: 6,
      decayFactor: 0.1,
      transferabilityScore: 8,
      subSkills: ['Pose de placo', 'Enduits', 'Peinture intérieure / façade'],
      description: 'Travaux de second œuvre : plaques de plâtre, enduits, peinture (intérieur et en hauteur).',
      verificationStatus: 'verified',
      confidenceScore: 93,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-sk5', source: 'cv', label: 'Restauration appartement (2015) + peinture en hauteur (A2cordes 2023)', confidenceScore: 93, date: '2015-2023' }
      ],
      x: 800,
      y: 500
    },
    {
      id: 'skill-menuserie-pose',
      name: 'Poser et installer des éléments de menuiserie',
      category: 'skill_tech',
      baseMastery: 65,
      acquiredYear: 2011,
      lastPracticedYear: 2015,
      halfLifeYears: 7,
      decayFactor: 0.08,
      transferabilityScore: 7,
      subSkills: ['Pose de fenêtres et portes', 'Escaliers, parquets, terrasses'],
      description: 'Aide à la pose de menuiseries bois : fenêtres, portes, escaliers, parquets, terrasses, meubles.',
      verificationStatus: 'verified',
      confidenceScore: 93,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-sk6', source: 'cv', label: 'Manœuvre menuiserie Artisan Bruy (2011-2012)', confidenceScore: 93, date: '2011-2012' }
      ],
      x: 800,
      y: 600
    },
    {
      id: 'skill-recolte-cueillette',
      name: 'Effectuer la cueillette ou la récolte des cultures',
      category: 'skill_tech',
      baseMastery: 80,
      acquiredYear: 2014,
      lastPracticedYear: 2022,
      halfLifeYears: 5,
      decayFactor: 0.1,
      transferabilityScore: 7,
      subSkills: ['Cueillette (pommes, raisins, myrtilles, tabac, muguet)', 'Vendanges', 'Calibrage'],
      description: 'Cueillette et récolte de produits agricoles selon les consignes de maturité et de calibrage.',
      verificationStatus: 'verified',
      confidenceScore: 97,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-sk7', source: 'cv', label: 'Cueilleur (2015-2016) + vendanges (2014) + viticulture (2022)', confidenceScore: 97, date: '2014-2022' }
      ],
      x: 800,
      y: 700
    },
    {
      id: 'skill-travail-vigne',
      name: 'Réaliser les travaux d\u2019entretien de la vigne',
      category: 'skill_tech',
      baseMastery: 72,
      acquiredYear: 2014,
      lastPracticedYear: 2022,
      halfLifeYears: 5,
      decayFactor: 0.1,
      transferabilityScore: 6,
      subSkills: ['Épamprage', 'Levage', 'Vendanges'],
      description: 'Travaux viticoles : épamprage, levage des palissages, vendanges.',
      verificationStatus: 'verified',
      confidenceScore: 95,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-sk8', source: 'cv', label: 'Ouvrier viticole Gea Leognan (2022)', confidenceScore: 95, date: '2022' }
      ],
      x: 800,
      y: 800
    },
    {
      id: 'skill-elevage',
      name: 'Soigner et élever des animaux de ferme',
      category: 'skill_tech',
      baseMastery: 65,
      acquiredYear: 2015,
      lastPracticedYear: 2016,
      halfLifeYears: 5,
      decayFactor: 0.12,
      transferabilityScore: 6,
      subSkills: ['Bovins, caprins, porcins, volaille', 'Alimentation', 'Soins courants'],
      description: 'Soins et élevage d\u2019animaux de ferme : alimentation, surveillance, hygiène des bâtiments.',
      verificationStatus: 'verified',
      confidenceScore: 94,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-sk9', source: 'cv', label: 'Aide agricole Ferme la Chevalerie (2015-2016)', confidenceScore: 94, date: '2015-2016' }
      ],
      x: 800,
      y: 900
    },
    {
      id: 'skill-fromagerie',
      name: 'Fabriquer des produits laitiers et fromagers',
      category: 'skill_tech',
      baseMastery: 62,
      acquiredYear: 2015,
      lastPracticedYear: 2016,
      halfLifeYears: 5,
      decayFactor: 0.12,
      transferabilityScore: 6,
      subSkills: ['Traite', 'Fabrication de fromages lactiques', 'Affinage', 'Vente sur les marchés'],
      description: 'Transformation laitière artisanale : de la traite à l\u2019affinage, fabrication de fromages lactiques et vente directe.',
      verificationStatus: 'verified',
      confidenceScore: 93,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-sk10', source: 'cv', label: 'Ferme la Chevalerie — fabrication de fromages lactiques (2015-2016)', confidenceScore: 93, date: '2015-2016' }
      ],
      x: 800,
      y: 1000
    },
    {
      id: 'skill-conditionnement',
      name: 'Conditionner et emballer des produits',
      category: 'skill_tech',
      baseMastery: 75,
      acquiredYear: 2017,
      lastPracticedYear: 2017,
      halfLifeYears: 5,
      decayFactor: 0.1,
      transferabilityScore: 7,
      subSkills: ['Conditionnement', 'Tri', 'Emballage', 'Stockage'],
      description: 'Conditionnement, tri et emballage de produits (alimentaire, surgelés, colis) selon codification.',
      verificationStatus: 'verified',
      confidenceScore: 95,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-sk11', source: 'cv', label: 'Watties / Mondial Relay (2017)', confidenceScore: 95, date: '2017' }
      ],
      x: 800,
      y: 1100
    },
    {
      id: 'skill-secours',
      name: 'Appliquer les protocoles de premiers secours',
      category: 'skill_tech',
      baseMastery: 78,
      acquiredYear: 2023,
      lastPracticedYear: 2024,
      halfLifeYears: 4,
      decayFactor: 0.12,
      transferabilityScore: 8,
      subSkills: ['Gestes d\u2019urgence', 'SST', 'Protection et alerte'],
      description: 'Gestes de premiers secours et de protection en milieu professionnel (certification SST).',
      verificationStatus: 'verified',
      confidenceScore: 98,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-sk12', source: 'attest', label: 'SST 2023', confidenceScore: 98, date: '2023' }
      ],
      x: 800,
      y: 1200
    },
    {
      id: 'skill-signalisation',
      name: 'Analyser les flux de trafic pour optimiser la signalisation',
      category: 'skill_tech',
      baseMastery: 60,
      acquiredYear: 2017,
      lastPracticedYear: 2017,
      halfLifeYears: 5,
      decayFactor: 0.12,
      transferabilityScore: 6,
      subSkills: ['Pose de signalisation', 'Gestion du trafic', 'Sécurité routière'],
      description: 'Sécurisation de chantiers routiers : signalisation, gestion du trafic, entretien des abords.',
      verificationStatus: 'verified',
      confidenceScore: 92,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-sk13', source: 'cv', label: 'Contrôleur routier Fulton Hogan NZ (2017)', confidenceScore: 92, date: '2017' }
      ],
      x: 800,
      y: 1300
    },
    {
      id: 'skill-travail-equipe',
      name: 'Travailler en équipe et en autonomie',
      category: 'skill_transversal',
      baseMastery: 90,
      acquiredYear: 2010,
      lastPracticedYear: 2026,
      halfLifeYears: 8,
      decayFactor: 0.06,
      transferabilityScore: 9,
      subSkills: ['Entraide', 'Autonomie', 'Bonne humeur'],
      description: 'Savoir-être reconnu sur tous les chantiers : débrouillardise, amabilité, fiabilité.',
      verificationStatus: 'verified',
      confidenceScore: 97,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-sk14', source: 'cv', label: 'Profil CV : « Débrouillard et amical »', confidenceScore: 95, date: '2022-2025' }
      ],
      x: 800,
      y: 1400
    },
    {
      id: 'skill-anglais',
      name: 'Communiquer en anglais',
      category: 'skill_transversal',
      baseMastery: 75,
      acquiredYear: 2015,
      lastPracticedYear: 2024,
      halfLifeYears: 7,
      decayFactor: 0.08,
      transferabilityScore: 8,
      subSkills: ['Anglais courant', 'Travail en milieu anglophone'],
      description: 'Anglais courant, pratiqué en Nouvelle-Zélande et au Danemark (chantiers et fermes).',
      verificationStatus: 'verified',
      confidenceScore: 95,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-sk15', source: 'cv', label: 'Anglais courant (CV)', confidenceScore: 95, date: '2022-2025' }
      ],
      x: 800,
      y: 1500
    },
    {
      id: 'skill-adaptation-voyage',
      name: 'Adaptation interculturelle & mobilité internationale',
      category: 'skill_transversal',
      baseMastery: 92,
      acquiredYear: 2015,
      lastPracticedYear: 2026,
      halfLifeYears: 9,
      decayFactor: 0.05,
      transferabilityScore: 10,
      subSkills: ['Mobilité (NZ, Danemark)', 'Intégration rapide', 'Ouverture culturelle'],
      description: 'Capacité à s\u2019intégrer et à travailler efficacement dans des pays et des cultures variés.',
      verificationStatus: 'verified',
      confidenceScore: 96,
      inferenceType: 'explicite',
      evidence: [
        { id: 'ev-g-sk16', source: 'cv', label: 'Expériences NZ (Fulton Hogan, TeNgae) et Danemark (Elizas)', confidenceScore: 96, date: '2017-2024' }
      ],
      x: 800,
      y: 1600
    },

    // ========================================================================
    // 5. CAPACITÉS COGNITIVES (candidates — niveau 3)
    // ========================================================================
    {
      id: 'cap-polyvalence',
      name: 'Polyvalence & apprentissage accéléré par l\u2019expérience',
      category: 'capacity_cognitive',
      level: 'expert',
      cognitiveDimension: 'Adaptabilité & Imprévus',
      underlyingSkills: ['skill-adaptation-voyage', 'skill-travail-equipe', 'skill-conditionnement', 'skill-maçonnerie'],
      description: 'Capacité à passer d\u2019un métier à un autre (ferme, entrepôt, chantier, hauteur) et à en apprendre les gestes en quelques jours.',
      verificationStatus: 'inferred',
      inferenceType: 'inference_forte',
      confidenceScore: 90,
      emergentInsight: '12+ expériences sur 4 continents sans période d\u2019inactivité : l\u2019apprentissage terrain est le mode d\u2019acquisition dominant.',
      x: 1000,
      y: 150
    },
    {
      id: 'cap-gestion-risque',
      name: 'Gestion du risque & sang-froid en hauteur',
      category: 'capacity_cognitive',
      level: 'avancé',
      cognitiveDimension: 'Adaptabilité & Imprévus',
      underlyingSkills: ['skill-travaux-hauteur', 'skill-mise-securite', 'skill-secours', 'skill-signalisation'],
      description: 'Travail régulier en environnement à risque (cordes, chantiers routiers, zones ATEX) avec certifications SST et H0B0.',
      verificationStatus: 'inferred',
      inferenceType: 'inference_forte',
      confidenceScore: 89,
      emergentInsight: 'La double certification sécurité (SST + H0B0) et la pratique du cordiste indiquent une tolérance et une discipline du risque élevées.',
      x: 1000,
      y: 300
    },
    {
      id: 'cap-organisation-logistique',
      name: 'Organisation & gestion des flux',
      category: 'capacity_cognitive',
      level: 'avancé',
      cognitiveDimension: 'Coordination & Systémique',
      underlyingSkills: ['skill-conditionnement', 'skill-mise-securite', 'skill-travail-equipe'],
      description: 'Tri, conditionnement, stockage et sécurisation de flux (produits, colis, chantiers) dans des environnements sous pression.',
      verificationStatus: 'inferred',
      inferenceType: 'inference_a_valider',
      confidenceScore: 80,
      x: 1000,
      y: 450
    },

    // ========================================================================
    // 6. HORIZONS MÉTIERS (codes ROME réels — rapprochements à valider)
    // ========================================================================
    {
      id: 'job-gianni-f1505',
      name: 'Échafaudeur / Échafaudeuse (ROME F1505)',
      category: 'horizon_job',
      domain: 'BTP — Travaux en hauteur',
      romeCode: 'F1505',
      romeTitle: 'Échafaudeur / Échafaudeuse',
      matchScore: 88,
      compatibilityLevel: 'Très forte',
      verificationStatus: 'inferred',
      inferenceType: 'inference_a_valider',
      confidenceScore: 86,
      rationale: 'Les compétences de travail en hauteur (cordes, échafaudages roulants), de mise en sécurité de site et les certifications SST/H0B0 correspondent directement à la fiche ROME F1505. Expériences cordiste chez SudAcrobatic et A2cordes.',
      matchingSkills: [
        'Installer des cordes et réaliser des travaux en hauteur',
        'Mettre en sécurité un site / un chantier',
        'Appliquer les protocoles de premiers secours'
      ],
      missingSkills: [
        {
          name: 'Montage d\u2019échafaudages de pied et techniques de levage',
          importance: 'recommandée',
          learningBridge: 'Formation montage échafaudages (R408/TS) pour compléter le travail sur cordes.'
        }
      ],
      unlockedOpportunities: [
        'Cordiste industriel',
        'Monteur d\u2019échafaudages',
        'Technicien d\u2019accès difficile'
      ],
      description: 'Montage, utilisation et démontage d\u2019échafaudages et accès difficiles sur chantiers.',
      x: 1200,
      y: 150
    },
    {
      id: 'job-gianni-f1703',
      name: 'Maçon / Maçonne (ROME F1703)',
      category: 'horizon_job',
      domain: 'BTP — Gros œuvre',
      romeCode: 'F1703',
      romeTitle: 'Maçon / Maçonne',
      matchScore: 74,
      compatibilityLevel: 'Forte',
      verificationStatus: 'inferred',
      inferenceType: 'inference_a_valider',
      confidenceScore: 76,
      rationale: 'Les compétences de maçonnerie (préparation du béton et mortier, enduits), la pose de carrelage et l\u2019expérience de manœuvre chez Vinci Construction alimentent cette fiche.',
      matchingSkills: [
        'Réaliser des ouvrages de maçonnerie',
        'Poser du carrelage',
        'Réaliser des enduits et appliquer des peintures'
      ],
      missingSkills: [
        {
          name: 'Techniques de maçonnerie traditionnelle (élévation de murs)',
          importance: 'critique',
          learningBridge: 'CAP Maçon ou compagnonnage pour structurer les gestes du gros œuvre.'
        }
      ],
      unlockedOpportunities: [
        'Maçon VRD / gros œuvre',
        'Ouvrier tous corps d\u2019état',
        'Chef de petite équipe chantier'
      ],
      description: 'Travaux de gros œuvre et de second œuvre : élévation, enduits, dallage, rénovation.',
      x: 1200,
      y: 300
    },
    {
      id: 'job-gianni-f1611',
      name: 'Façadier / Façadière itéiste (ROME F1611)',
      category: 'horizon_job',
      domain: 'BTP — Second œuvre / Façades',
      romeCode: 'F1611',
      romeTitle: 'Façadier / Façadière itéiste',
      matchScore: 72,
      compatibilityLevel: 'Forte',
      verificationStatus: 'inferred',
      inferenceType: 'inference_a_valider',
      confidenceScore: 74,
      rationale: 'Les travaux de façade et de peinture en hauteur (A2cordes, restauration d\u2019appartement) et la maîtrise des échafaudages roulants correspondent à la fiche F1611.',
      matchingSkills: [
        'Réaliser des enduits et appliquer des peintures',
        'Installer des cordes et réaliser des travaux en hauteur'
      ],
      missingSkills: [
        {
          name: 'Techniques d\u2019isolation thermique par l\u2019extérieur (ITE)',
          importance: 'recommandée',
          learningBridge: 'Formation ITE (enduits sur isolant) pour accéder aux marchés de la rénovation énergétique.'
        }
      ],
      unlockedOpportunities: [
        'Façadier / ravalement',
        'Peintre en bâtiment qualifié',
        'Applicateur ITE'
      ],
      description: 'Ravalement et isolation des façades : enduits, peintures, bardages, ITE.',
      x: 1200,
      y: 450
    },
    {
      id: 'job-gianni-agricole',
      name: 'Ouvrier agricole polyvalent / Récolte (ROME A1447 & A1407)',
      category: 'horizon_job',
      domain: 'Agriculture & Productions végétales',
      romeCode: 'A1447',
      romeTitle: 'Herboriste (récolte de végétaux)',
      matchScore: 70,
      compatibilityLevel: 'Forte',
      verificationStatus: 'inferred',
      inferenceType: 'inference_a_valider',
      confidenceScore: 72,
      rationale: 'Plus d\u2019un an de cueillette/récolte (pommes, raisins, myrtilles, tabac, muguet), la viticulture et les travaux de ferme (élevage, fromagerie) couvrent l\u2019essentiel des compétences de récolte du référentiel. L\u2019expérience de fromagerie ouvre vers les filières laitières.',
      matchingSkills: [
        'Effectuer la cueillette ou la récolte des cultures',
        'Réaliser les travaux d\u2019entretien de la vigne',
        'Soigner et élever des animaux de ferme',
        'Fabriquer des produits laitiers et fromagers'
      ],
      missingSkills: [
        {
          name: 'Conduite d\u2019engins agricoles',
          importance: 'recommandée',
          learningBridge: 'Formation conduite d\u2019engins (tracteur, chargeur) pour accéder aux postes d\u2019ouvrier agricole qualifié.'
        }
      ],
      unlockedOpportunities: [
        'Ouvrier agricole polyvalent',
        'Viticulture / arboriculture',
        'Aide fromager / transformation fermière'
      ],
      description: 'Travaux agricoles de production et de transformation : récolte, élevage, viticulture, produits fermiers.',
      x: 1200,
      y: 600
    }
  ],

  edges: [
    // Formations -> Compétences
    { id: 'e-g-f1', source: 'form-bac-sti-gianni', target: 'skill-mise-securite', type: 'acquired_in', strength: 0.6, label: 'Bases techniques' },
    { id: 'e-g-f2', source: 'form-bafa', target: 'skill-travail-equipe', type: 'acquired_in', strength: 0.8, label: 'Encadrement de groupes' },
    { id: 'e-g-f3', source: 'form-sst', target: 'skill-secours', type: 'acquired_in', strength: 0.98, label: 'Gestes d\u2019urgence' },
    { id: 'e-g-f4', source: 'form-h0b0', target: 'skill-mise-securite', type: 'acquired_in', strength: 0.9, label: 'Sécurité électrique' },

    // Expériences -> Tâches
    { id: 'e-g-e1', source: 'exp-cordiste-sudacrobatic', target: 'task-g-corde', type: 'composed_of', strength: 1, label: 'Tâche documentée' },
    { id: 'e-g-e2', source: 'exp-watties', target: 'task-g-conditionnement', type: 'composed_of', strength: 1, label: 'Tâche documentée' },

    // Tâches -> Compétences
    { id: 'e-g-t1', source: 'task-g-corde', target: 'skill-travaux-hauteur', type: 'demonstrates_skill', strength: 0.97, label: 'Cordes démontrées' },
    { id: 'e-g-t1b', source: 'task-g-corde', target: 'skill-mise-securite', type: 'demonstrates_skill', strength: 0.9, label: 'Sécurité démontrée' },
    { id: 'e-g-t1c', source: 'task-g-corde', target: 'skill-secours', type: 'demonstrates_skill', strength: 0.9, label: 'Secours mobilisés' },
    { id: 'e-g-t2', source: 'task-g-conditionnement', target: 'skill-conditionnement', type: 'demonstrates_skill', strength: 0.97, label: 'Conditionnement démontré' },
    { id: 'e-g-t2b', source: 'task-g-conditionnement', target: 'skill-travail-equipe', type: 'demonstrates_skill', strength: 0.8, label: 'Équipe' },

    // Expériences directes -> Compétences
    { id: 'e-g-e3', source: 'exp-cordiste-a2cordes', target: 'skill-travaux-hauteur', type: 'acquired_in', strength: 0.95, label: 'Bardage & peinture en hauteur' },
    { id: 'e-g-e4', source: 'exp-vinci', target: 'skill-maçonnerie', type: 'acquired_in', strength: 0.95, label: 'Gros œuvre' },
    { id: 'e-g-e5', source: 'exp-vinci', target: 'skill-mise-securite', type: 'acquired_in', strength: 0.9, label: 'Sécurité chantier' },
    { id: 'e-g-e6', source: 'exp-restauration-appart', target: 'skill-carrelage', type: 'acquired_in', strength: 0.9, label: 'Carrelage' },
    { id: 'e-g-e7', source: 'exp-restauration-appart', target: 'skill-enduits-peinture', type: 'acquired_in', strength: 0.9, label: 'Enduits & peinture' },
    { id: 'e-g-e8', source: 'exp-menuiserie', target: 'skill-menuserie-pose', type: 'acquired_in', strength: 0.9, label: 'Menuiserie' },
    { id: 'e-g-e9', source: 'exp-viticole', target: 'skill-travail-vigne', type: 'acquired_in', strength: 0.95, label: 'Viticulture' },
    { id: 'e-g-e10', source: 'exp-viticole', target: 'skill-recolte-cueillette', type: 'acquired_in', strength: 0.85, label: 'Vendanges' },
    { id: 'e-g-e11', source: 'exp-cueilleur', target: 'skill-recolte-cueillette', type: 'acquired_in', strength: 0.97, label: 'Cueillette' },
    { id: 'e-g-e12', source: 'exp-ferme', target: 'skill-elevage', type: 'acquired_in', strength: 0.95, label: 'Élevage' },
    { id: 'e-g-e13', source: 'exp-ferme', target: 'skill-fromagerie', type: 'acquired_in', strength: 0.95, label: 'Fromagerie' },
    { id: 'e-g-e14', source: 'exp-planteur', target: 'skill-recolte-cueillette', type: 'acquired_in', strength: 0.8, label: 'Plantation' },
    { id: 'e-g-e15', source: 'exp-controleur-routier', target: 'skill-signalisation', type: 'acquired_in', strength: 0.95, label: 'Signalisation routière' },
    { id: 'e-g-e16', source: 'exp-controleur-routier', target: 'skill-mise-securite', type: 'acquired_in', strength: 0.9, label: 'Sécurité route' },
    { id: 'e-g-e17', source: 'exp-controleur-routier', target: 'skill-anglais', type: 'acquired_in', strength: 0.9, label: 'Anglais NZ' },
    { id: 'e-g-e18', source: 'exp-cordiste-sudacrobatic', target: 'skill-adaptation-voyage', type: 'acquired_in', strength: 0.85, label: 'Mobilité' },

    // Compétences -> Capacités
    { id: 'e-g-c1', source: 'skill-adaptation-voyage', target: 'cap-polyvalence', type: 'feeds_capacity', strength: 0.95 },
    { id: 'e-g-c2', source: 'skill-travail-equipe', target: 'cap-polyvalence', type: 'feeds_capacity', strength: 0.8 },
    { id: 'e-g-c3', source: 'skill-travaux-hauteur', target: 'cap-gestion-risque', type: 'feeds_capacity', strength: 0.95 },
    { id: 'e-g-c4', source: 'skill-mise-securite', target: 'cap-gestion-risque', type: 'feeds_capacity', strength: 0.9 },
    { id: 'e-g-c5', source: 'skill-secours', target: 'cap-gestion-risque', type: 'feeds_capacity', strength: 0.9 },
    { id: 'e-g-c6', source: 'skill-conditionnement', target: 'cap-organisation-logistique', type: 'feeds_capacity', strength: 0.95 },
    { id: 'e-g-c7', source: 'skill-signalisation', target: 'cap-organisation-logistique', type: 'feeds_capacity', strength: 0.8 },

    // Compétences & capacités -> Horizons
    { id: 'e-g-h1', source: 'skill-travaux-hauteur', target: 'job-gianni-f1505', type: 'unlocks_horizon', strength: 0.95 },
    { id: 'e-g-h2', source: 'skill-mise-securite', target: 'job-gianni-f1505', type: 'unlocks_horizon', strength: 0.85 },
    { id: 'e-g-h3', source: 'skill-maçonnerie', target: 'job-gianni-f1703', type: 'unlocks_horizon', strength: 0.95 },
    { id: 'e-g-h4', source: 'skill-carrelage', target: 'job-gianni-f1703', type: 'unlocks_horizon', strength: 0.8 },
    { id: 'e-g-h5', source: 'skill-enduits-peinture', target: 'job-gianni-f1611', type: 'unlocks_horizon', strength: 0.9 },
    { id: 'e-g-h6', source: 'skill-travaux-hauteur', target: 'job-gianni-f1611', type: 'unlocks_horizon', strength: 0.85 },
    { id: 'e-g-h7', source: 'skill-recolte-cueillette', target: 'job-gianni-agricole', type: 'unlocks_horizon', strength: 0.95 },
    { id: 'e-g-h8', source: 'skill-travail-vigne', target: 'job-gianni-agricole', type: 'unlocks_horizon', strength: 0.9 },
    { id: 'e-g-h9', source: 'skill-elevage', target: 'job-gianni-agricole', type: 'unlocks_horizon', strength: 0.85 },
    { id: 'e-g-h10', source: 'skill-fromagerie', target: 'job-gianni-agricole', type: 'unlocks_horizon', strength: 0.8 },
    { id: 'e-g-h11', source: 'cap-gestion-risque', target: 'job-gianni-f1505', type: 'unlocks_horizon', strength: 0.85 },
    { id: 'e-g-h12', source: 'cap-polyvalence', target: 'job-gianni-agricole', type: 'unlocks_horizon', strength: 0.75 }
  ]
};
