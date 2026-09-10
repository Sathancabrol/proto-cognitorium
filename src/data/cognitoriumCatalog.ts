// ============================================================================
// RÉFÉRENTIEL DE VALIDATION & CATALOGUE DES NŒUDS COGNITORIUM
// Fournit des choix pré-validés vérifiés pour chaque typologie de nœud
// ============================================================================

export interface ValidatedKnowledge {
  id: string;
  name: string;
  domain: string;
  category: 'Sciences de l\'Ingénieur & BTP' | 'Informatique & Systèmes' | 'Sciences Humaines & Cognition' | 'Management, Droit & Économie' | 'Sciences Fondamentales & Santé';
  description: string;
  synapseTag: string;
}

export interface ValidatedExperienceRole {
  role: string;
  category: 'BTP & Chantier' | 'Ingénierie & Tech' | 'Management & Stratégie' | 'Sciences & Recherche' | 'Santé & Social';
  typicalContext: string;
  suggestedMissions: string[];
  suggestedSkills: { name: string; category: 'skill_tech' | 'skill_relational' | 'skill_transversal'; mastery: number }[];
  suggestedKnowledge: string;
  suggestedTargetRome: { code: string; title: string };
}

export interface ValidatedSkill {
  name: string;
  category: 'skill_tech' | 'skill_relational' | 'skill_transversal';
  domain: string;
  defaultMastery: number;
  description: string;
}

export interface ValidatedCapacity {
  name: string;
  dimension: 'Adaptabilité & Imprévus' | 'Régulation de la Charge Mentale' | 'Pensée Systémique' | 'Décision sous Contrainte' | 'Apprentissage Métacognitif';
  description: string;
  manifestation: string;
}

export interface ValidatedMotto {
  label: string;
  stance: string;
  archetype: string;
}

// 1. SAVOIRS THÉORIQUES & DISCIPLINES FONDAMENTALES PRÉ-VALIDÉES
export const VALIDATED_KNOWLEDGES: ValidatedKnowledge[] = [
  // BTP & Sciences de l'ingénieur
  {
    id: 'know-rdm',
    name: 'Résistance des matériaux (RDM) & Mécanique des structures',
    domain: 'Génie Civil & Mécanique',
    category: 'Sciences de l\'Ingénieur & BTP',
    description: 'Calcul des contraintes, déformations et dimensionnement des poutres, dalles et ouvrages.',
    synapseTag: 'Structure & Calcul'
  },
  {
    id: 'know-vrd',
    name: 'Normes NF, Eurocodes & Réglementation VRD',
    domain: 'Voirie & Réseaux Divers',
    category: 'Sciences de l\'Ingénieur & BTP',
    description: 'Cadre normatif pour terrassements, réseaux humides/secs, voirie et sécurisation des tranchées.',
    synapseTag: 'Normes NF'
  },
  {
    id: 'know-geotech',
    name: 'Géotechnique & Mécanique des sols',
    domain: 'Géologie & Fondations',
    category: 'Sciences de l\'Ingénieur & BTP',
    description: 'Comportement des sols, portance, tassements et stabilité des fouilles et fondations.',
    synapseTag: 'Sous-sol & Portance'
  },
  {
    id: 'know-thermo',
    name: 'Thermodynamique & Énergétique du bâtiment',
    domain: 'Physique du Bâtiment',
    category: 'Sciences de l\'Ingénieur & BTP',
    description: 'Transferts thermiques, performance RE2020 et bilans thermiques enveloppe.',
    synapseTag: 'RE2020 & Énergie'
  },
  {
    id: 'know-hydraulique',
    name: 'Hydraulique urbaine & Dynamique des fluides',
    domain: 'Réseaux & Environnement',
    category: 'Sciences de l\'Ingénieur & BTP',
    description: 'Écoulements en charge et surface libre, dimensionnement de bassins d\'orage et réseaux pluviaux.',
    synapseTag: 'Fluides & Pluvial'
  },

  // Informatique & Systèmes Numériques
  {
    id: 'know-algo',
    name: 'Algorithmique, Complexité & Structures de données',
    domain: 'Informatique Théorique',
    category: 'Informatique & Systèmes',
    description: 'Graphes, arbres, optimisation combinatoire et analyse asymptotique Big-O.',
    synapseTag: 'Graphes & Algorithmes'
  },
  {
    id: 'know-archi',
    name: 'Architectures logicielles distribuées & Systèmes réactifs',
    domain: 'Génie Logiciel',
    category: 'Informatique & Systèmes',
    description: 'Microservices, Event-Driven Architecture (EDA), idempotence et résilience CAP.',
    synapseTag: 'Architecture Système'
  },
  {
    id: 'know-cyber',
    name: 'Cybersécurité, Cryptographie & Sécurité applicative',
    domain: 'Sécurité Numérique',
    category: 'Informatique & Systèmes',
    description: 'Cryptographie asymétrique, protocoles Zero-Trust, OWASP et gestion des accès IAM.',
    synapseTag: 'Zero-Trust & OWASP'
  },
  {
    id: 'know-ia',
    name: 'Intelligence Artificielle & Réseaux de Neurones',
    domain: 'Data Science & Machine Learning',
    category: 'Informatique & Systèmes',
    description: 'Architectures Transformers, optimisation de gradients, embedding vectoriel et inférence.',
    synapseTag: 'LLM & Neurones'
  },

  // Sciences Humaines & Cognitives
  {
    id: 'know-ergo',
    name: 'Ergonomie cognitive & Facteurs humains',
    domain: 'Sciences Cognitives',
    category: 'Sciences Humaines & Cognition',
    description: 'Modèles de charge mentale (NASA-TLX), perception, affordance et conception centrée activité.',
    synapseTag: 'Charge Mentale & IHM'
  },
  {
    id: 'know-psycho',
    name: 'Psychologie du travail & Dynamique organisationnelle',
    domain: 'Psychologie Sociale',
    category: 'Sciences Humaines & Cognition',
    description: 'Régulation des collectifs, leadership situationnel, prévention RPS et climat de confiance.',
    synapseTag: 'Collectif & Régulation'
  },
  {
    id: 'know-didactique',
    name: 'Didactique professionnelle & Ingénierie pédagogique',
    domain: 'Sciences de l\'Éducation',
    category: 'Sciences Humaines & Cognition',
    description: 'Analyse du travail pour la formation, transposition didactique et métacognition en action.',
    synapseTag: 'Didactique & Transmission'
  },

  // Management, Droit & Économie
  {
    id: 'know-marches',
    name: 'Droit des marchés publics & CCAG Travaux',
    domain: 'Droit Administratif & Construction',
    category: 'Management, Droit & Économie',
    description: 'Règles de passation, avenants, mémoires de réclamation et décomptes généraux définitifs (DGD).',
    synapseTag: 'CCAG & Marchés'
  },
  {
    id: 'know-finance',
    name: 'Gestion budgétaire & Comptabilité analytique',
    domain: 'Finance d\'Entreprise',
    category: 'Management, Droit & Économie',
    description: 'Calcul de marge brute, trésorerie de chantier, décomposition des coûts et seuil de rentabilité.',
    synapseTag: 'Budget & Marges'
  },
  {
    id: 'know-hse',
    name: 'Réglementation Hygiène, Sécurité & Environnement (HSE)',
    domain: 'Droit du Travail & Prévention',
    category: 'Management, Droit & Économie',
    description: 'Coordination SPS, plans de prévention (PPSPS), Document Unique (DUERP) et normes ISO 45001.',
    synapseTag: 'HSE & SPS'
  },
  {
    id: 'know-agile',
    name: 'Management de projet systémique & Méthodes agiles',
    domain: 'Management de Projet',
    category: 'Management, Droit & Économie',
    description: 'Scrum/Kanban, planification par chemin critique (PERT/Gantt) et gestion des risques.',
    synapseTag: 'Agilité & PERT'
  }
];

// 2. EXPÉRIENCES & RÔLES TYPES PRÉ-VALIDÉS
export const VALIDATED_EXPERIENCE_ROLES: ValidatedExperienceRole[] = [
  {
    role: 'Conducteur de travaux VRD & Canalisations',
    category: 'BTP & Chantier',
    typicalContext: 'Entreprise de Travaux Publics (SOBECA, Eurovia, Colas...)',
    suggestedMissions: [
      'Pilotage des sous-traitants & cadence de pose',
      'Contrôle qualité, sécurité et récolement DOE',
      'Gestion des approvisionnements réseaux humides & secs',
      'Animation des quarts d\'heure sécurité & prévention'
    ],
    suggestedSkills: [
      { name: 'Métrés & Récolement DOE', category: 'skill_tech', mastery: 90 },
      { name: 'Coordination cadence chantier', category: 'skill_relational', mastery: 85 },
      { name: 'Gestion des aléas sous-sol', category: 'skill_transversal', mastery: 85 }
    ],
    suggestedKnowledge: 'Normes NF, Eurocodes & Réglementation VRD',
    suggestedTargetRome: { code: 'F1201', title: 'Conduite de travaux du BTP' }
  },
  {
    role: 'Chef de chantier BTP Gros Œuvre',
    category: 'BTP & Chantier',
    typicalContext: 'Majors du BTP (Bouygues, Eiffage, Vinci...)',
    suggestedMissions: [
      'Organisation quotidienne des équipes compagnons',
      'Suivi du coulage béton et contrôle ferraillage',
      'Implantation topographique sur site',
      'Gestion des rotations de banches et grues'
    ],
    suggestedSkills: [
      { name: 'Implantation & Nivellement topographique', category: 'skill_tech', mastery: 88 },
      { name: 'Leadership d\'équipe compagnons', category: 'skill_relational', mastery: 92 },
      { name: 'Régulation des cadences de coulage', category: 'skill_transversal', mastery: 85 }
    ],
    suggestedKnowledge: 'Résistance des matériaux (RDM) & Mécanique des structures',
    suggestedTargetRome: { code: 'F1202', title: 'Direction de chantier du BTP' }
  },
  {
    role: 'Développeur Full-Stack TypeScript / Cloud',
    category: 'Ingénierie & Tech',
    typicalContext: 'ESN, Startup Scale-up ou Direction SI',
    suggestedMissions: [
      'Conception d\'architectures API REST & GraphQL résilientes',
      'Développement d\'interfaces interactives réactives (React/Vite)',
      'Mise en place de pipelines CI/CD et déploiement Cloud',
      'Revue de code, tests automatisés et monitoring Datadog'
    ],
    suggestedSkills: [
      { name: 'Développement TypeScript & Écosystème React', category: 'skill_tech', mastery: 92 },
      { name: 'Revue de code & Pédagogie d\'équipe', category: 'skill_relational', mastery: 82 },
      { name: 'Débogage et résolution d\'incidents en direct', category: 'skill_transversal', mastery: 88 }
    ],
    suggestedKnowledge: 'Architectures logicielles distribuées & Systèmes réactifs',
    suggestedTargetRome: { code: 'M1805', title: 'Études et développement informatique' }
  },
  {
    role: 'Ergonome Consultant Facteurs Humains',
    category: 'Sciences & Recherche',
    typicalContext: 'Cabinet d\'ergonomie, Services de Santé au Travail ou R&D',
    suggestedMissions: [
      'Analyse de l\'activité réelle de travail et chronobiologie',
      'Diagnostic des contraintes posturales et cognitives (TMS/RPS)',
      'Co-conception d\'espaces de travail et simulateurs avec les opérateurs',
      'Restitution stratégique auprès du CSE et de la Direction'
    ],
    suggestedSkills: [
      { name: 'Méthodologie d\'analyse du travail réel', category: 'skill_tech', mastery: 94 },
      { name: 'Animation d\'ateliers participatifs & écoute', category: 'skill_relational', mastery: 90 },
      { name: 'Postulation d\'hypothèses et rigueur scientifique', category: 'skill_transversal', mastery: 88 }
    ],
    suggestedKnowledge: 'Ergonomie cognitive & Facteurs humains',
    suggestedTargetRome: { code: 'K2401', title: 'Recherche en sciences de l\'homme et de la société' }
  },
  {
    role: 'Chef de projet MOE / Ingénieur Méthodes',
    category: 'Management & Stratégie',
    typicalContext: 'Bureau d\'études ingénierie ou Maîtrise d\'œuvre',
    suggestedMissions: [
      'Élaboration des plannings prévisionnels PERT/Gantt',
      'Chiffrage préliminaire et décomposition en lots techniques',
      'Arbitrage technique entre variantes architecturales et coûts',
      'Animation des réunions de coordination inter-entreprises'
    ],
    suggestedSkills: [
      { name: 'Planification OPC & Chemin critique', category: 'skill_tech', mastery: 86 },
      { name: 'Négociation contractuelle & Marchés', category: 'skill_relational', mastery: 84 },
      { name: 'Arbitrage sous contraintes de coûts et délais', category: 'skill_transversal', mastery: 90 }
    ],
    suggestedKnowledge: 'Droit des marchés publics & CCAG Travaux',
    suggestedTargetRome: { code: 'F1106', title: 'Ingénierie et études du BTP' }
  }
];

// 3. BANQUE DE COMPÉTENCES VÉRIFIÉES
export const VALIDATED_SKILLS_BANK: ValidatedSkill[] = [
  // Techniques
  { name: 'Métrés & Récolement DOE', category: 'skill_tech', domain: 'BTP', defaultMastery: 90, description: 'Chiffrage précis et vérification des plans d\'exécution récolement.' },
  { name: 'Modélisation 3D / BIM (Revit)', category: 'skill_tech', domain: 'BTP & Archi', defaultMastery: 85, description: 'Conception de maquettes numériques intelligentes.' },
  { name: 'Topographie & Nivellement laser', category: 'skill_tech', domain: 'Terrain', defaultMastery: 88, description: 'Mesures sur site et implantation d\'ouvrages.' },
  { name: 'Développement TypeScript & Architecture', category: 'skill_tech', domain: 'Tech', defaultMastery: 92, description: 'Typage strict, modularité et code maintenable.' },
  { name: 'Analyse statistique de données & KPIs', category: 'skill_tech', domain: 'Data', defaultMastery: 84, description: 'Traitement quantitatif et tableaux de bord de pilotage.' },
  { name: 'Audit de conformité réglementaire & SPS', category: 'skill_tech', domain: 'HSE', defaultMastery: 87, description: 'Contrôle des exigences normatives et sécuritaires.' },
  { name: 'Diagnostic ergonomique & Chrono-analyse', category: 'skill_tech', domain: 'Sciences', defaultMastery: 89, description: 'Mesure de la charge de travail et observation systématique.' },

  // Relationnelles
  { name: 'Coordination de cadence & alignement', category: 'skill_relational', domain: 'Management', defaultMastery: 88, description: 'Synchronisation fluide des corps d\'état ou équipes agiles.' },
  { name: 'Négociation contractuelle & Sous-traitance', category: 'skill_relational', domain: 'Achat & Droit', defaultMastery: 85, description: 'Défense des intérêts économiques tout en maintenant la coopération.' },
  { name: 'Médiation pluridisciplinaire & Désamorçage', category: 'skill_relational', domain: 'Humain', defaultMastery: 86, description: 'Résolution rapide des divergences d\'intérêts sur le terrain.' },
  { name: 'Écoute active & Recueil du besoin réel', category: 'skill_relational', domain: 'Consulting', defaultMastery: 90, description: 'Compréhension profonde des contraintes utilisateurs non verbalisées.' },
  { name: 'Pédagogie & Transfert de savoirs', category: 'skill_relational', domain: 'Transmission', defaultMastery: 85, description: 'Montée en compétence des alternants et compagnons.' },

  // Transversales
  { name: 'Gestion des aléas & Imprévus en direct', category: 'skill_transversal', domain: 'Opérations', defaultMastery: 88, description: 'Capacité à recalculer immédiatement une solution viable face au blocage.' },
  { name: 'Rigueur documentaire & Traçabilité légale', category: 'skill_transversal', domain: 'Qualité', defaultMastery: 86, description: 'Constitution de preuves infaillibles et procès-verbaux.' },
  { name: 'Priorisation sous haute pression temporelle', category: 'skill_transversal', domain: 'Efficacité', defaultMastery: 87, description: 'Sélection chirurgicale des batailles prioritaires du jour.' },
  { name: 'Pensée critique & Doute méthodique', category: 'skill_transversal', domain: 'Épistémologie', defaultMastery: 90, description: 'Remise en cause des affirmations non vérifiées par le terrain.' },
  { name: 'Vision systémique du flux opérationnel', category: 'skill_transversal', domain: 'Stratégie', defaultMastery: 85, description: 'Anticipation des effets de bord sur l\'ensemble de la chaîne de valeur.' }
];

// 4. CAPACITÉS COGNITIVES PRÉ-VALIDÉES
export const VALIDATED_CAPACITIES: ValidatedCapacity[] = [
  {
    name: 'Arbitrage et décision sous forte incertitude',
    dimension: 'Décision sous Contrainte',
    description: 'Trancher rapidement lorsque les informations sont partielles ou contradictoires.',
    manifestation: 'Décision immédiate d\'arrêt de fouille lors d\'une découverte de réseau non cartographié.'
  },
  {
    name: 'Régulation de la charge mentale et du stress de cadence',
    dimension: 'Régulation de la Charge Mentale',
    description: 'Maintenir une lucidité d\'analyse et un calme opérationnel sous pression continue.',
    manifestation: 'Gestion sans panique des imprévus simultanés en fin de phase de chantier critique.'
  },
  {
    name: 'Résolution d\'aléas en direct sur le terrain',
    dimension: 'Adaptabilité & Imprévus',
    description: 'Improvisation contrôlée et reconfiguration tactique d\'un protocole défaillant.',
    manifestation: 'Bascule immédiate d\'équipes vers un front de travail alternatif sans perte de journée.'
  },
  {
    name: 'Pensée systémique et vision holistique du flux',
    dimension: 'Pensée Systémique',
    description: 'Percevoir les interdépendances invisibles entre corps d\'état ou composants logiciels.',
    manifestation: 'Anticipation qu\'un retard sur les réseaux secs bloquera les finitions intérieures à J+15.'
  },
  {
    name: 'Flexibilité mentale et bascule cognitive rapide',
    dimension: 'Adaptabilité & Imprévus',
    description: 'Passer sans friction d\'une tâche hautement conceptuelle à une urgence humaine immédiate.',
    manifestation: 'Interrompre une analyse de plan pour désamorcer un conflit physique sur site.'
  },
  {
    name: 'Auto-évaluation réflexive et métacognition en action',
    dimension: 'Apprentissage Métacognitif',
    description: 'Analyser ses propres erreurs de jugement pour ajuster ses modèles mentaux de terrain.',
    manifestation: 'Débriefing post-chantier pour intégrer un coefficient de marge plus réaliste.'
  }
];

// 5. POSTURES ÉPISTÉMIQUES / DEVISES PRÉ-VALIDÉES
export const VALIDATED_MOTTOS: ValidatedMotto[] = [
  {
    label: 'Rigueur de terrain et intelligence systémique',
    stance: 'Ancrage concret et vision d\'ensemble',
    archetype: 'Ingénieur de Terrain & Conduite'
  },
  {
    label: 'Analyse empirique et robustesse opérationnelle',
    stance: 'Preuve par le réel et non par les hypothèses',
    archetype: 'Praticien Réflexif'
  },
  {
    label: 'Coordination humaine et vision globale du chantier',
    stance: 'L\'humain comme moteur de la réussite technique',
    archetype: 'Leader Coordinateur'
  },
  {
    label: 'Pragmatisme technique et amélioration continue',
    stance: 'Résolution méthodique sans dogmatisme',
    archetype: 'Optimisateur Méthodes'
  },
  {
    label: 'Conception résiliente et agilité d\'exécution',
    stance: 'Anticipation des pannes et réactivité fluide',
    archetype: 'Architecte Systèmes'
  },
  {
    label: 'Pédagogie active et transfert d\'excellence',
    stance: 'La maîtrise n\'a de valeur que si elle est transmise',
    archetype: 'Mentor & Transmetteur'
  }
];
