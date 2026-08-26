export type FunctionalStatus = 'demo' | 'adaptation' | 'specific';
export type PlanType = 'intra_sujets' | 'inter_sujets' | 'mixte';

export interface ExperimentReference {
  authors: string;
  year: number;
  title: string;
  venue: string;
  doi?: string;
  url?: string;
  status: 'fondatrice' | 'revue' | 'replication';
}

export interface FunctionalModel {
  plateforme: string;
  statut: FunctionalStatus;
  niveauDeFidelite: string;
  demoUrl?: string;
  downloadUrl?: string;
  donneesExportables: boolean;
  modificationPossible: boolean;
  avertissement: string;
}

export interface IndependentVariable {
  nom: string;
  modalites: string[];
}

export interface DependentVariable {
  nom: string;
  modalites: string[];
}

export interface LabExperiment {
  id: string;
  domaine: string;
  concepts: string[];
  paradigme: string;
  posterTitle: string;
  biaisCognitif: string | null;
  hypotheseGenerale: string;
  hypotheseExperimentale: string;
  plan: { type: PlanType; randomisation: string; contrebalancement: string };
  variablesIndependantes: IndependentVariable[];
  variablesDependantes: DependentVariable[];
  methode: { participants: string; materiel: string; procedure: string };
  resultatsAttendus: string;
  discussion: string;
  conclusion: string;
  reference: ExperimentReference;
  modele: FunctionalModel;
  transfert: string[];
}

const PEDAGO =
  'Vérifier durée des stimuli, nombre d’essais, exclusions et randomisation avant toute comparaison avec une étude publiée.';

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: 'COG-ATT-STROOP-001',
    domaine: 'Attention et fonctions exécutives',
    concepts: ['contrôle inhibiteur', 'automaticité', 'interférence cognitive'],
    paradigme: 'Stroop couleur-mot',
    posterTitle: 'Lire le mot ou nommer la couleur ?',
    biaisCognitif: null,
    hypotheseGenerale: 'Un automatisme cognitif peut perturber une tâche contrôlée contradictoire.',
    hypotheseExperimentale:
      'Les participants seront plus lents et commettront davantage d’erreurs pour nommer la couleur d’un mot incongruent que d’un mot congruent.',
    plan: { type: 'intra_sujets', randomisation: 'essais', contrebalancement: 'blocs si nécessaire' },
    variablesIndependantes: [
      { nom: 'congruence', modalites: ['congruente', 'incongruente', 'neutre'] }
    ],
    variablesDependantes: [
      { nom: 'temps_de_reponse', modalites: ['médiane essais corrects (ms)'] },
      { nom: 'exactitude', modalites: ['proportion correcte'] },
      { nom: 'score_stroop', modalites: ['RT incongruent − RT congruent'] }
    ],
    methode: {
      participants: 'Adultes volontaires',
      materiel: 'Mots de couleur en encre colorée ; réponses clavier / boutons couleur',
      procedure:
        '40–80 essais par condition. Fixation → stimulus → réponse (couleur, pas le mot) → intervalle. Ordre randomisé.'
    },
    resultatsAttendus: 'RT plus élevé et exactitude plus faible en incongruent ; interférence robuste.',
    discussion:
      'Conflit entre lecture automatique et dénomination de couleur. Ne mesure pas isolément une capacité générale unique de « contrôle exécutif ».',
    conclusion:
      'Le système traite automatiquement certaines dimensions très entraînées ; l’inhibition a un coût comportemental observable.',
    reference: {
      authors: 'Stroop, J. R.',
      year: 1935,
      title: 'Studies of interference in serial verbal reactions',
      venue: 'Journal of Experimental Psychology',
      doi: '10.1037/h0054651',
      url: 'https://doi.org/10.1037/h0054651',
      status: 'fondatrice'
    },
    modele: {
      plateforme: 'Cognitorium / PsyToolkit',
      statut: 'demo',
      niveauDeFidelite: 'adaptation pédagogique',
      demoUrl: 'https://www.psytoolkit.org/experiment-library/stroop.html',
      donneesExportables: true,
      modificationPossible: true,
      avertissement: PEDAGO
    },
    transfert: [
      'Notifications vs tâche complexe',
      'Couleur / icône / libellé contradictoires',
      'Inhiber une stratégie intuitive mais erronée'
    ]
  },
  {
    id: 'COG-ATT-GORILLA-002',
    domaine: 'Attention sélective',
    concepts: ['allocation limitée', 'sélection guidée par le but', 'accès conscient'],
    paradigme: 'Cécité inattentionnelle / Invisible Gorilla',
    posterTitle: 'Regarder n’est pas voir',
    biaisCognitif: 'Biais attentionnel lié à la tâche (absence de détection, pas une erreur perceptive simple)',
    hypotheseGenerale:
      'La visibilité physique d’un objet ne garantit pas son accès conscient lorsqu’il est hors du foyer attentionnel.',
    hypotheseExperimentale:
      'Les personnes chargées de compter des passes détecteront moins souvent un événement inattendu que celles qui observent librement.',
    plan: { type: 'inter_sujets', randomisation: 'consigne', contrebalancement: 'événement présent/absent' },
    variablesIndependantes: [
      { nom: 'consigne_attentionnelle', modalites: ['comptage focalisé', 'observation libre'] },
      { nom: 'evenement_inattendu', modalites: ['présent', 'absent'] }
    ],
    variablesDependantes: [
      { nom: 'detection_consciente', modalites: ['oui/non', 'rappel descriptif', 'confiance'] }
    ],
    methode: {
      participants: 'Adultes volontaires naïfs (connaître le paradigme annule l’effet)',
      materiel: 'Scène courte 30–60 s ; événement inattendu',
      procedure:
        'Compter les passes d’une équipe. Questionnaire immédiat : « Avez-vous remarqué quelque chose d’inhabituel ? » Débriefing obligatoire.'
    },
    resultatsAttendus: 'Une proportion notable ne détecte pas l’événement inattendu en condition focalisée.',
    discussion:
      'Regarder ≠ encoder consciemment tout le visible. Les répétitions doivent être évitées : la familiarité annule la démonstration.',
    conclusion:
      'Une interface critique ne doit pas supposer qu’une information affichée a été perçue ; elle doit soutenir l’orientation attentionnelle.',
    reference: {
      authors: 'Simons, D. J. & Chabris, C. F.',
      year: 1999,
      title: 'Gorillas in our midst: Sustained inattentional blindness for dynamic events',
      venue: 'Perception',
      doi: '10.1068/p281059',
      url: 'https://doi.org/10.1068/p281059',
      status: 'fondatrice'
    },
    modele: {
      plateforme: 'Cognitorium (animation) / PsyToolkit Library',
      statut: 'adaptation',
      niveauDeFidelite: 'adaptation pédagogique (pas la vidéo originale)',
      demoUrl: 'https://www.psytoolkit.org/experiment-library/',
      donneesExportables: true,
      modificationPossible: true,
      avertissement: PEDAGO
    },
    transfert: ['Alerte critique noyée', 'Bannière ignorée', 'Supervision multi-écrans']
  },
  {
    id: 'COG-ATT-CHANGE-003',
    domaine: 'Perception et attention visuelle',
    concepts: ['comparaison visuelle', 'représentation partielle de scènes'],
    paradigme: 'Cécité au changement',
    posterTitle: 'Le détail a changé. L’as-tu vu ?',
    biaisCognitif: 'Cécité au changement — échec de comparaison entre représentations',
    hypotheseGenerale:
      'Les observateurs ne conservent pas une représentation exhaustive et stable de tous les détails d’une scène.',
    hypotheseExperimentale:
      'Un changement sera détecté moins souvent et plus lentement après une interruption visuelle que s’il est signalé en continu.',
    plan: { type: 'intra_sujets', randomisation: 'position et type de changement', contrebalancement: 'central/périphérique' },
    variablesIndependantes: [
      { nom: 'type_de_transition', modalites: ['continuité', 'flash', 'masque'] },
      { nom: 'localisation', modalites: ['central', 'périphérique'] }
    ],
    variablesDependantes: [
      { nom: 'detection', modalites: ['succès', 'temps de détection', 'localisation correcte'] }
    ],
    methode: {
      participants: 'Adultes volontaires',
      materiel: 'Paires d’images A/B',
      procedure: 'Alternance A → écran blanc ~100 ms → B jusqu’à réponse. Indiquer le changement.'
    },
    resultatsAttendus:
      'Des changements visuellement importants peuvent rester non détectés longtemps ; ceux liés à la tâche sont mieux détectés.',
    discussion:
      'Distinct de la cécité inattentionnelle : ici l’échec est la comparaison entre deux représentations séparées par une interruption.',
    conclusion:
      'Les changements d’état d’interface doivent être signalés : surbrillance, animation locale, historique, avant/après.',
    reference: {
      authors: 'Simons, D. J. & Levin, D. T.',
      year: 1997,
      title: 'Change blindness',
      venue: 'Trends in Cognitive Sciences',
      doi: '10.1016/S1364-6613(97)01080-2',
      url: 'https://doi.org/10.1016/S1364-6613(97)01080-2',
      status: 'revue'
    },
    modele: {
      plateforme: 'Cognitorium / PsyToolkit Library',
      statut: 'adaptation',
      niveauDeFidelite: 'adaptation pédagogique avec scènes SVG',
      donneesExportables: true,
      modificationPossible: true,
      avertissement: PEDAGO
    },
    transfert: ['UI qui mute sans signal', 'Diff de statut non marqué', 'Supervision de tableaux de bord']
  },
  {
    id: 'COG-MEM-SPERLING-004',
    domaine: 'Mémoire sensorielle',
    concepts: ['mémoire iconique', 'capacité', 'persistance de la trace visuelle'],
    paradigme: 'Sperling : rapport total / rapport partiel',
    posterTitle: 'Vu un instant, perdu déjà',
    biaisCognitif: null,
    hypotheseGenerale:
      'La mémoire visuelle sensorielle contient brièvement davantage d’informations que la personne ne peut en restituer par un rapport total.',
    hypotheseExperimentale:
      'Le rappel d’une ligne indiquée juste après l’affichage sera supérieur au rappel total ; l’avantage diminuera si l’indice est retardé.',
    plan: { type: 'intra_sujets', randomisation: 'essais', contrebalancement: 'délais' },
    variablesIndependantes: [
      { nom: 'type_de_rappel', modalites: ['total', 'partiel'] },
      { nom: 'delai_indice', modalites: ['0', '150', '300', '500', '1000 ms'] }
    ],
    variablesDependantes: [
      { nom: 'rappel', modalites: ['proportion de lettres correctes', 'capacité estimée', 'pente d’oubli'] }
    ],
    methode: {
      participants: 'Adultes volontaires',
      materiel: 'Matrice 3×3 ou 3×4 lettres ~50 ms',
      procedure: 'Soit rappel de toute la matrice, soit signal indiquant la ligne. Manipulation du délai matrice → signal.'
    },
    resultatsAttendus: 'Rapport partiel initial > rapport total ; décroissance rapide de l’avantage avec le délai.',
    discussion:
      'Sépare disponibilité momentanée et capacité de production verbale. Contrôler lisibilité, durée, confusions visuelles.',
    conclusion:
      'Beaucoup d’information peut être brièvement disponible sans pouvoir être stabilisée ni rapportée intégralement.',
    reference: {
      authors: 'Sperling, G.',
      year: 1960,
      title: 'The information available in brief visual presentations',
      venue: 'Psychological Monographs',
      doi: '10.1037/h0093759',
      url: 'https://doi.org/10.1037/h0093759',
      status: 'fondatrice'
    },
    modele: {
      plateforme: 'Cognitorium',
      statut: 'specific',
      niveauDeFidelite: 'construction pédagogique (timings approximatifs)',
      donneesExportables: true,
      modificationPossible: true,
      avertissement: PEDAGO
    },
    transfert: ['Toasts trop brefs', 'Captures d’écran vs mémoire', 'Affichage flash d’un code']
  },
  {
    id: 'COG-MEM-STERNBERG-005',
    domaine: 'Mémoire de travail',
    concepts: ['recherche en mémoire', 'balayage mental', 'décision présent/absent'],
    paradigme: 'Sternberg memory scanning',
    posterTitle: 'Combien d’items à comparer ?',
    biaisCognitif: null,
    hypotheseGenerale:
      'Une comparaison avec des items maintenus en mémoire a un coût qui dépend de la taille de l’ensemble à examiner.',
    hypotheseExperimentale:
      'Le temps de réponse augmentera avec le nombre d’items mémorisés, pour les sondes présentes comme absentes.',
    plan: { type: 'intra_sujets', randomisation: 'blocs', contrebalancement: 'présent/absent équilibré' },
    variablesIndependantes: [
      { nom: 'charge_mnésique', modalites: ['2', '4', '6'] },
      { nom: 'presence', modalites: ['sonde présente', 'sonde absente'] }
    ],
    variablesDependantes: [
      { nom: 'decision', modalites: ['RT médian correct', 'taux d’erreur', 'pente RT / taille'] }
    ],
    methode: {
      participants: 'Adultes volontaires',
      materiel: 'Chiffres à mémoriser puis sonde unique',
      procedure: 'Séquence → délai court → sonde présent/absent. Essais positifs et négatifs équilibrés.'
    },
    resultatsAttendus:
      'Le RT augmente avec la taille de l’ensemble. Interprétation historique : recherche sérielle rapide.',
    discussion:
      'Stratégies, familiarité, vitesse/précision et charge modifient l’effet. L’interprétation « sérialité stricte » doit rester prudente.',
    conclusion:
      'La mémoire de travail est limitée ; plus d’éléments à comparer, plus le coût de décision augmente.',
    reference: {
      authors: 'Sternberg, S.',
      year: 1966,
      title: 'High-speed scanning in human memory',
      venue: 'Science',
      doi: '10.1126/science.153.3736.652',
      url: 'https://doi.org/10.1126/science.153.3736.652',
      status: 'fondatrice'
    },
    modele: {
      plateforme: 'Cognitorium / PsyToolkit Library',
      statut: 'adaptation',
      niveauDeFidelite: 'adaptation pédagogique',
      demoUrl: 'https://www.psytoolkit.org/experiment-library/',
      donneesExportables: true,
      modificationPossible: true,
      avertissement: PEDAGO
    },
    transfert: ['Comparer 8 métriques de tête', 'Externaliser les listes', 'Recherche dans un historique']
  },
  {
    id: 'COG-MEM-SERIAL-006',
    domaine: 'Mémoire épisodique',
    concepts: ['encodage', 'répétition', 'disponibilité immédiate'],
    paradigme: 'Effet de position sérielle',
    posterTitle: 'Début et fin, le milieu s’efface',
    biaisCognitif: null,
    hypotheseGenerale: 'La position d’un item dans une liste influence sa probabilité de rappel.',
    hypotheseExperimentale:
      'Les mots du début et de la fin d’une liste seront plus souvent rappelés que les mots centraux.',
    plan: { type: 'intra_sujets', randomisation: 'listes', contrebalancement: 'immédiat vs délai distracteur' },
    variablesIndependantes: [
      { nom: 'position_serielle', modalites: ['début', 'milieu', 'fin'] },
      { nom: 'delai', modalites: ['rappel immédiat', 'tâche distractrice'] }
    ],
    variablesDependantes: [
      { nom: 'rappel_libre', modalites: ['P(rappel) par position', 'intrusions', 'ordre'] }
    ],
    methode: {
      participants: 'Adultes volontaires',
      materiel: 'Listes de 12–15 mots équilibrés, 1 mot / 1,2 s',
      procedure: 'Présentation sérielle puis rappel libre. Condition optionnelle avec délai distracteur.'
    },
    resultatsAttendus: 'Courbe en U : primauté + récence. La récence diminue après un délai distracteur.',
    discussion:
      'Mécanismes distincts : répétition/encodage élaboré au début ; disponibilité temporaire à la fin.',
    conclusion: 'Dans une séquence longue, segmenter et réactiver les contenus du milieu.',
    reference: {
      authors: 'Murdock, B. B.',
      year: 1962,
      title: 'The serial position effect of free recall',
      venue: 'Journal of Experimental Psychology',
      doi: '10.1037/h0045106',
      url: 'https://doi.org/10.1037/h0045106',
      status: 'fondatrice'
    },
    modele: {
      plateforme: 'Cognitorium',
      statut: 'specific',
      niveauDeFidelite: 'construction pédagogique',
      donneesExportables: true,
      modificationPossible: true,
      avertissement: PEDAGO
    },
    transfert: ['Longues listes de compétences', 'Briefings trop longs', 'Onboarding en 20 items']
  },
  {
    id: 'COG-MEM-LOFTUS-007',
    domaine: 'Mémoire reconstructive',
    concepts: ['suggestibilité', 'source monitoring', 'désinformation'],
    paradigme: 'Loftus & Palmer',
    posterTitle: 'Vu, inféré, ou suggéré ?',
    biaisCognitif: 'Effet de désinformation ; biais de suggestion ; reconstruction mnésique',
    hypotheseGenerale:
      'Le rappel n’est pas une copie de l’événement : les informations postérieures peuvent infléchir le souvenir rapporté.',
    hypotheseExperimentale:
      'Une formulation plus intense produira des estimations de vitesse plus élevées et pourra modifier le rappel d’un détail critique.',
    plan: { type: 'inter_sujets', randomisation: 'formulation', contrebalancement: 'mesure immédiate vs différée' },
    variablesIndependantes: [
      { nom: 'formulation', modalites: ['neutre (heurté)', 'intense (percuté / smashé)'] }
    ],
    variablesDependantes: [
      { nom: 'memoire_rapportee', modalites: ['estimation de vitesse', 'verre brisé oui/non', 'confiance'] }
    ],
    methode: {
      participants: 'Adultes volontaires',
      materiel: 'Scène d’accident (ici : récit fixe) + questionnaire',
      procedure: 'Lecture / visionnage → formulation assignée → estimation → détail critique → débriefing.'
    },
    resultatsAttendus:
      'Formulations plus fortes → estimations plus élevées ; parfois influence sur un détail non présenté.',
    discussion:
      'La mémoire est souvent utile, mais reconstructive. Un résultat de groupe ne permet pas de déclarer un souvenir individuel « faux ».',
    conclusion:
      'Séparer observation, inférence, suggestion et source externe — dans un entretien comme dans Cognitorium.',
    reference: {
      authors: 'Loftus, E. F. & Palmer, J. C.',
      year: 1974,
      title: 'Reconstruction of automobile destruction: An example of the interaction between language and memory',
      venue: 'Journal of Verbal Learning and Verbal Behavior',
      doi: '10.1016/S0022-5371(74)80011-3',
      url: 'https://doi.org/10.1016/S0022-5371(74)80011-3',
      status: 'fondatrice'
    },
    modele: {
      plateforme: 'Cognitorium',
      statut: 'specific',
      niveauDeFidelite: 'adaptation par récit + formulation (pas la vidéo originale)',
      donneesExportables: true,
      modificationPossible: true,
      avertissement: PEDAGO
    },
    transfert: ['Formulaires suggestifs', 'Prompts IA qui présupposent', 'Confusion « relu » / « su »']
  },
  {
    id: 'COG-SPA-ROTATION-008',
    domaine: 'Cognition spatiale',
    concepts: ['imagerie mentale', 'transformation visuo-spatiale'],
    paradigme: 'Rotation mentale',
    posterTitle: 'Tourner l’objet dans la tête',
    biaisCognitif: null,
    hypotheseGenerale:
      'Les représentations mentales d’objets peuvent être transformées de manière graduelle, avec un coût lié à l’angle.',
    hypotheseExperimentale:
      'Le temps de décision augmentera avec l’angle ; les objets miroir produiront plus d’erreurs que les mêmes objets tournés.',
    plan: { type: 'intra_sujets', randomisation: 'essais', contrebalancement: 'angles et même/miroir' },
    variablesIndependantes: [
      { nom: 'angle', modalites: ['0°', '60°', '120°', '180°'] },
      { nom: 'relation', modalites: ['identique tourné', 'miroir'] }
    ],
    variablesDependantes: [
      { nom: 'reconnaissance', modalites: ['RT correct', 'exactitude', 'pente RT/degré'] }
    ],
    methode: {
      participants: 'Adultes volontaires',
      materiel: 'Lettres / formes 2D (adaptation pédagogique des assemblages 3D de Shepard & Metzler)',
      procedure: '« Même objet tourné ou image miroir ? » Essais randomisés, équilibrés par angle.'
    },
    resultatsAttendus: 'Relation croissante angle ↔ RT ; fortes différences individuelles.',
    discussion:
      'Peut refléter une imagerie mentale, ou des stratégies de comparaison locale / de caractéristiques.',
    conclusion: 'Préserver les repères spatiaux et les transitions visuelles réduit le coût de transformation.',
    reference: {
      authors: 'Shepard, R. N. & Metzler, J.',
      year: 1971,
      title: 'Mental rotation of three-dimensional objects',
      venue: 'Science',
      doi: '10.1126/science.171.3972.701',
      url: 'https://doi.org/10.1126/science.171.3972.701',
      status: 'fondatrice'
    },
    modele: {
      plateforme: 'Cognitorium / PsyToolkit Library',
      statut: 'demo',
      niveauDeFidelite: 'adaptation 2D pédagogique',
      demoUrl: 'https://www.psytoolkit.org/experiment-library/',
      donneesExportables: true,
      modificationPossible: true,
      avertissement: PEDAGO
    },
    transfert: ['Plans techniques rotatifs', 'Cartes mentales', 'UI 3D sans ancres']
  },
  {
    id: 'COG-REA-WASON-009',
    domaine: 'Raisonnement',
    concepts: ['règle conditionnelle', 'contre-exemple', 'falsification'],
    paradigme: 'Tâche de sélection de Wason',
    posterTitle: 'Quelle carte retourner pour tester la règle ?',
    biaisCognitif: 'Biais de confirmation',
    hypotheseGenerale:
      'Les individus évaluent plus facilement ce qui confirme une règle que ce qui pourrait la réfuter.',
    hypotheseExperimentale:
      'En version abstraite, les participants sélectionneront plus souvent P et Q que la combinaison pertinente P et non-Q.',
    plan: { type: 'intra_sujets', randomisation: 'ordre des versions', contrebalancement: 'abstrait vs déontique' },
    variablesIndependantes: [
      { nom: 'contexte', modalites: ['abstrait', 'déontique / concret'] }
    ],
    variablesDependantes: [
      { nom: 'qualite_raisonnement', modalites: ['cartes choisies', 'solution correcte', 'justification'] }
    ],
    methode: {
      participants: 'Adultes volontaires',
      materiel: 'Quatre cartes (ex. A, D, 4, 7) ; règle « si voyelle, alors nombre pair »',
      procedure: 'Choisir les cartes à retourner + justification courte.'
    },
    resultatsAttendus:
      'Réponses confirmatoires fréquentes en abstrait ; souvent meilleures en contexte déontique.',
    discussion:
      'Ne démontre pas une « irrationalité » simple. Mesure l’interaction forme logique × contenu × stratégie.',
    conclusion:
      'Une décision robuste cherche aussi l’information susceptible d’invalider une hypothèse ou une reco IA.',
    reference: {
      authors: 'Wason, P. C.',
      year: 1966,
      title: 'Reasoning',
      venue: 'In Foss (éd.), New Horizons in Psychology',
      status: 'fondatrice'
    },
    modele: {
      plateforme: 'Cognitorium',
      statut: 'specific',
      niveauDeFidelite: 'construction pédagogique',
      donneesExportables: true,
      modificationPossible: true,
      avertissement: PEDAGO
    },
    transfert: ['Valider une reco ROME', 'Chercher le contre-exemple', 'Revue de matching']
  },
  {
    id: 'COG-DEC-FRAME-010',
    domaine: 'Jugement et décision',
    concepts: ['gains et pertes', 'choix sous risque', 'théorie des perspectives'],
    paradigme: 'Effet de cadrage',
    posterTitle: 'Même chiffres, autre choix',
    biaisCognitif: 'Effet de cadrage ; aversion à la perte',
    hypotheseGenerale:
      'Des descriptions sémantiquement différentes mais mathématiquement équivalentes peuvent modifier les préférences.',
    hypotheseExperimentale:
      'Le cadrage de gain favorise l’option certaine ; le cadrage de perte favorise l’option risquée.',
    plan: { type: 'inter_sujets', randomisation: 'formulation unique', contrebalancement: 'non (évite la détection d’équivalence)' },
    variablesIndependantes: [{ nom: 'cadrage', modalites: ['gain', 'perte'] }],
    variablesDependantes: [
      { nom: 'choix', modalites: ['certain / risqué', 'confiance', 'perception de risque'] }
    ],
    methode: {
      participants: 'Adultes volontaires',
      materiel: 'Scénario de santé / formation / orientation à probabilités équivalentes',
      procedure: 'Une seule formulation par personne. Contrôle de compréhension des probabilités.'
    },
    resultatsAttendus: 'Les choix diffèrent selon le cadrage malgré une structure identique.',
    discussion:
      'Le cadrage change l’interprétation subjective. Contexte et valeurs personnelles comptent. Pas « irrationnel » au sens trivial.',
    conclusion:
      'Une interface responsable montre probabilités, conséquences et incertitudes — pas une seule formulation orientante.',
    reference: {
      authors: 'Tversky, A. & Kahneman, D.',
      year: 1981,
      title: 'The framing of decisions and the psychology of choice',
      venue: 'Science',
      doi: '10.1126/science.7455683',
      url: 'https://doi.org/10.1126/science.7455683',
      status: 'fondatrice'
    },
    modele: {
      plateforme: 'Cognitorium / PsyToolkit Survey Library',
      statut: 'adaptation',
      niveauDeFidelite: 'questionnaire randomisé pédagogique',
      demoUrl: 'https://www.psytoolkit.org/survey-library/',
      donneesExportables: true,
      modificationPossible: true,
      avertissement: PEDAGO
    },
    transfert: ['Scores ROME formulés en perte', 'Taux de réussite vs échec', 'Consentement éclairé']
  },
  {
    id: 'COG-META-JOL-011',
    domaine: 'Métacognition',
    concepts: ['monitoring', 'calibration', 'jugement de confiance', 'auto-régulation'],
    paradigme: 'Confiance–exactitude / Judgments of Learning',
    posterTitle: 'Être sûr n’est pas avoir raison',
    biaisCognitif: 'Surconfiance ou sous-confiance ; illusion de savoir',
    hypotheseGenerale:
      'La confiance subjective est une mesure imparfaite de l’exactitude ; le feedback peut améliorer l’ajustement.',
    hypotheseExperimentale:
      'Après feedback, l’écart absolu confiance − exactitude diminuera par rapport à une condition sans feedback.',
    plan: { type: 'intra_sujets', randomisation: 'items', contrebalancement: 'blocs avec/sans feedback' },
    variablesIndependantes: [
      { nom: 'feedback', modalites: ['absent', 'immédiat'] },
      { nom: 'difficulte', modalites: ['faible', 'élevée'] }
    ],
    variablesDependantes: [
      { nom: 'calibration', modalites: ['exactitude', 'confiance 0–100', 'biais confiance−exactitude'] }
    ],
    methode: {
      participants: 'Adultes volontaires',
      materiel: '20–40 questions ; éviter les items trop culture-spécifiques',
      procedure: 'Réponse → confiance → correction selon condition → calibration individuelle.'
    },
    resultatsAttendus:
      'Sur- ou sous-confiance fréquente ; la confiance discrimine imparfaitement juste/faux ; le feedback aide souvent.',
    discussion:
      'La confiance n’est pas une preuve de compétence. Trianguler auto-évaluation, performance, traces et validation externe.',
    conclusion:
      'Une IA éducative utile rend visibles l’incertitude, le niveau de preuve et les stratégies de vérification.',
    reference: {
      authors: 'Koriat, A.',
      year: 1997,
      title: 'Monitoring one’s own knowledge during study: A cue-utilization approach to judgments of learning',
      venue: 'Journal of Experimental Psychology: General',
      doi: '10.1037/0096-3445.126.4.349',
      url: 'https://doi.org/10.1037/0096-3445.126.4.349',
      status: 'fondatrice'
    },
    modele: {
      plateforme: 'Cognitorium / PsyToolkit Survey Library',
      statut: 'adaptation',
      niveauDeFidelite: 'quiz + curseur de confiance',
      demoUrl: 'https://www.psytoolkit.org/survey-library/',
      donneesExportables: true,
      modificationPossible: true,
      avertissement: PEDAGO
    },
    transfert: ['Confiance sur un métier', 'Auto-éval de compétence', 'Validation humaine vs score IA']
  },
  {
    id: 'COG-WM-NBACK-012',
    domaine: 'Mémoire de travail et attention',
    concepts: ['mise à jour continue', 'maintien actif', 'monitoring'],
    paradigme: 'N-back',
    posterTitle: 'C’était le même il y a n essais ?',
    biaisCognitif: null,
    hypotheseGenerale:
      'L’augmentation de charge de mise à jour en mémoire de travail diminue la performance et accroît le coût attentionnel.',
    hypotheseExperimentale:
      'L’exactitude diminuera et les fausses alarmes augmenteront de 1-back à 2-back puis 3-back.',
    plan: { type: 'intra_sujets', randomisation: 'stimuli', contrebalancement: 'n croissant par blocs' },
    variablesIndependantes: [
      { nom: 'niveau_de_charge', modalites: ['1-back', '2-back'] },
      { nom: 'modalite', modalites: ['lettres visuelles'] }
    ],
    variablesDependantes: [
      { nom: 'detection', modalites: ['hits', 'fausses alarmes', 'RT', 'difficulté auto-évaluée'] }
    ],
    methode: {
      participants: 'Adultes volontaires',
      materiel: 'Suite de lettres',
      procedure: 'Répondre si l’item correspond à celui présenté n essais plus tôt. Cibles et non-cibles équilibrées.'
    },
    resultatsAttendus: 'La performance se dégrade lorsque n augmente ; difficulté subjective plus élevée.',
    discussion:
      'Combine mise à jour, attention soutenue, vitesse et stratégie. Pas une mesure pure d’intelligence ou de « capacité globale ».',
    conclusion: 'La surcharge de MdT altère la détection ; externaliser ce qu’il faut comparer.',
    reference: {
      authors: 'Kirchner, W. K.',
      year: 1958,
      title: 'Age differences in short-term retention of rapidly changing information',
      venue: 'Journal of Experimental Psychology',
      doi: '10.1037/h0043688',
      url: 'https://doi.org/10.1037/h0043688',
      status: 'fondatrice'
    },
    modele: {
      plateforme: 'Cognitorium / PsyToolkit 2-back',
      statut: 'demo',
      niveauDeFidelite: 'adaptation pédagogique',
      demoUrl: 'https://www.psytoolkit.org/experiment-library/2back.html',
      donneesExportables: true,
      modificationPossible: true,
      avertissement: PEDAGO
    },
    transfert: ['Suivre 3 flux à la fois', 'Chat + graphe + reco', 'Comparer sans notes']
  },
  {
    id: 'COG-TIME-BISECT-013',
    domaine: 'Timing et perception du temps',
    concepts: ['durée', 'catégorisation temporelle', 'scalar expectancy'],
    paradigme: 'Bissection temporelle',
    posterTitle: 'Court ou long — où est le milieu ?',
    biaisCognitif: null,
    hypotheseGenerale:
      'Les durées peuvent être classées par rapport à des ancres courtes et longues, avec un point de bissection souvent proche de la moyenne géométrique.',
    hypotheseExperimentale:
      'La proportion de réponses « long » augmentera avec la durée de la sonde ; le point de bissection (50 % « long ») se situera entre les deux ancres.',
    plan: { type: 'intra_sujets', randomisation: 'sondes', contrebalancement: 'ancres d’apprentissage d’abord' },
    variablesIndependantes: [
      { nom: 'duree_sonde', modalites: ['ancres court/long', 'durées intermédiaires'] }
    ],
    variablesDependantes: [
      { nom: 'categorisation', modalites: ['P(long)', 'point de bissection', 'pente de discrimination'] }
    ],
    methode: {
      participants: 'Adultes volontaires',
      materiel: 'Intervalle visuel (carré) sans compteur',
      procedure:
        'Apprentissage des ancres court / long, puis sondes à classer. Pas de chronomètre affiché. Démo pédagogique, pas un protocole SET complet.'
    },
    resultatsAttendus: 'Courbe sigmoïde P(long) ; bissection souvent plus proche de la moyenne géométrique que arithmétique.',
    discussion:
      'Procédure standard du timing humain (voir Vatakis, Balcı, Di Luca & Correa, 2018). La démo n’estime pas un pacemaker ; elle illustre la catégorisation de durées.',
    conclusion: 'Comparer des durées exige des ancres ; un timer UI n’est pas une perception du temps.',
    reference: {
      authors: 'Church, R. M. & Deluty, M. Z.',
      year: 1977,
      title: 'Bisection of temporal intervals',
      venue: 'Journal of Experimental Psychology: Animal Behavior Processes',
      doi: '10.1037/0097-7403.3.3.216',
      url: 'https://doi.org/10.1037/0097-7403.3.3.216',
      status: 'fondatrice'
    },
    modele: {
      plateforme: 'Cognitorium',
      statut: 'demo',
      niveauDeFidelite: 'adaptation pédagogique (Vatakis et al., 2018, procédures de timing)',
      donneesExportables: true,
      modificationPossible: true,
      avertissement: PEDAGO
    },
    transfert: ['Attentes de latence', 'Barres de progression', 'Délais sans feedback']
  },
  {
    id: 'COG-TIME-REPRO-014',
    domaine: 'Timing et perception du temps',
    concepts: ['production', 'reproduction', 'erreur temporelle'],
    paradigme: 'Reproduction de durée',
    posterTitle: 'Rejouer la durée, pas la compter',
    biaisCognitif: null,
    hypotheseGenerale:
      'Reproduire une durée encodée introduit une erreur (souvent Vierordt : les courtes sont surestimées, les longues sous-estimées).',
    hypotheseExperimentale:
      'L’erreur relative de reproduction variera avec la durée cible ; les reproductions ne colleront pas à une horloge mentale parfaite.',
    plan: { type: 'intra_sujets', randomisation: 'durées cibles', contrebalancement: 'ordre des cibles' },
    variablesIndependantes: [{ nom: 'duree_cible', modalites: ['court (~0,6 s)', 'moyen (~1,2 s)', 'long (~2 s)'] }],
    variablesDependantes: [
      { nom: 'reproduction', modalites: ['durée produite', 'erreur signée', 'erreur absolue'] }
    ],
    methode: {
      participants: 'Adultes volontaires',
      materiel: 'Intervalle visuel puis maintien d’un bouton',
      procedure: 'Observer la cible → reproduis en maintenant. Interdire le comptage verbal si possible.'
    },
    resultatsAttendus: 'Dispersion ; tendance Vierordt possible. Mesure individuelle instable sur peu d’essais.',
    discussion:
      'Méthode classique de timing prospectif (Block, Grondin & Zakay in Vatakis et al., 2018). Compter à voix haute change la tâche.',
    conclusion: 'Une durée « ressentie » n’est pas un chronomètre ; l’UI doit ancrer les attentes temporelles.',
    reference: {
      authors: 'Vatakis, A., Balcı, F., Di Luca, M. & Correa, Á. (éds.)',
      year: 2018,
      title: 'Timing and Time Perception: Procedures, Measures, & Applications',
      venue: 'Brill',
      doi: '10.1163/9789004280205',
      url: 'https://brill.com/display/title/26606',
      status: 'revue'
    },
    modele: {
      plateforme: 'Cognitorium',
      statut: 'demo',
      niveauDeFidelite: 'construction pédagogique',
      donneesExportables: true,
      modificationPossible: true,
      avertissement: PEDAGO
    },
    transfert: ['Micro-interactions trop longues', 'Timeouts mal calibrés', 'Feedback trop tardif']
  },
  {
    id: 'COG-TIME-TOJ-015',
    domaine: 'Timing et perception du temps',
    concepts: ['ordre temporel', 'synchronie', 'seuil de discrimination'],
    paradigme: 'Jugement d’ordre temporel (TOJ)',
    posterTitle: 'Lequel d’abord ?',
    biaisCognitif: null,
    hypotheseGenerale:
      'Deux événements proches dans le temps ne sont pas toujours ordonnés correctement ; un asynchronisme minimal est requis.',
    hypotheseExperimentale:
      'La proportion de réponses « gauche d’abord » suivra une sigmoïde en fonction du SOA (stimulus onset asynchrony).',
    plan: { type: 'intra_sujets', randomisation: 'SOA et côté', contrebalancement: 'gauche/droite' },
    variablesIndependantes: [{ nom: 'SOA', modalites: ['négatif', 'nul', 'positif (ms)'] }],
    variablesDependantes: [
      { nom: 'ordre_percu', modalites: ['premier côté', 'PSS', 'seuil de discrimination'] }
    ],
    methode: {
      participants: 'Adultes volontaires',
      materiel: 'Deux flashs visuels gauche/droite',
      procedure: 'Deux flashs décalés → « lequel le premier ? ». Démo à SOA grossiers, pas un psychophysique complet.'
    },
    resultatsAttendus: 'Aux SOA nuls, l’ordre est au hasard ; aux SOA larges, presque parfait.',
    discussion:
      'TOJ et jugements de simultanéité (SJ) sont des procédures distinctes (Vatakis et al., 2018). Ne pas confondre ordre et « en même temps ».',
    conclusion: 'Des événements quasi-simultanés dans une UI peuvent être mal ordonnés ; séparer les signaux critiques.',
    reference: {
      authors: 'Hirsh, I. J. & Sherrick, C. E.',
      year: 1961,
      title: 'Perceived order in different sense modalities',
      venue: 'Journal of Experimental Psychology',
      doi: '10.1037/h0045283',
      url: 'https://doi.org/10.1037/h0045283',
      status: 'fondatrice'
    },
    modele: {
      plateforme: 'Cognitorium',
      statut: 'demo',
      niveauDeFidelite: 'adaptation pédagogique TOJ visuel',
      donneesExportables: true,
      modificationPossible: true,
      avertissement: PEDAGO
    },
    transfert: ['Toasts simultanés', 'Ordre des notifications', 'Feedback visuel vs sonore']
  }
];

export const LAB_DOMAINS = [...new Set(LAB_EXPERIMENTS.map((e) => e.domaine))];

export function doiUrl(doi?: string) {
  return doi ? `https://doi.org/${doi}` : undefined;
}
