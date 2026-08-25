export interface PsyNode {
  id: string;
  label: string;
  children?: PsyNode[];
}

export interface PsyBranch {
  id: string;
  title: string;
  object: string;
  color: string;
  accent: string;
  trees: { title: string; children: PsyNode[] }[];
}

export interface Citation {
  id: string;
  authors: string;
  year: number;
  title: string;
  venue: string;
  citationsApprox?: number;
  category: string;
  note: string;
}

export interface ExperimentDef {
  id: string;
  title: string;
  posterTitle: string;
  branch: string;
  concept: string;
  question: string;
  critique: string;
  transfer: string[];
  cognitorium: string;
  protocol: string[];
}

export const PSYCHOLOGY_BRANCHES: PsyBranch[] = [
  {
    id: 'cognitive',
    title: 'Psychologie cognitive',
    object:
      'Processus mentaux par lesquels on acquiert, traite, stocke et utilise l’information.',
    color: 'blue',
    accent: 'from-blue-600 to-indigo-600',
    trees: [
      {
        title: 'Par processus',
        children: [
          {
            id: 'perception',
            label: 'Perception',
            children: [
              { id: 'p-vis', label: 'Visuelle — formes, couleurs, profondeur, mouvement' },
              { id: 'p-aud', label: 'Auditive — parole, musique, localisation' },
              { id: 'p-multi', label: 'Multisensorielle — intégration, effet McGurk' },
              { id: 'p-act', label: 'Perception–action — embodied cognition' }
            ]
          },
          {
            id: 'attention',
            label: 'Attention',
            children: [
              { id: 'a-sel', label: 'Sélective — filtrage, Stroop, recherche visuelle' },
              { id: 'a-sus', label: 'Soutenue / vigilance' },
              { id: 'a-div', label: 'Divisée / multitâche' },
              { id: 'a-exe', label: 'Exécutive — inhibition, flexibilité' },
              { id: 'a-con', label: 'Attention et conscience' }
            ]
          },
          {
            id: 'memory',
            label: 'Mémoire & apprentissage',
            children: [
              { id: 'm-sens', label: 'Sensorielle — iconique, échoïque' },
              { id: 'm-wm', label: 'Mémoire de travail — Baddeley (phonologique, visuo-spatial, administrateur)' },
              {
                id: 'm-ltm',
                label: 'Mémoire à long terme',
                children: [
                  { id: 'm-epi', label: 'Épisodique — événements personnels' },
                  { id: 'm-sem', label: 'Sémantique — faits, concepts' },
                  { id: 'm-pro', label: 'Procédurale — savoir-faire' }
                ]
              },
              { id: 'm-cons', label: 'Consolidation — sommeil, espacement, implicite/explicite' },
              { id: 'm-dist', label: 'Oubli & distorsions — interférence, faux souvenirs' },
              { id: 'm-meta', label: 'Métamémoire — confiance, prédictions de performance' }
            ]
          },
          {
            id: 'language',
            label: 'Langage (psycholinguistique)',
            children: [
              { id: 'l-pho', label: 'Phonologie et perception de la parole' },
              { id: 'l-syn', label: 'Syntaxe et grammaire' },
              { id: 'l-sem', label: 'Sémantique' },
              { id: 'l-pra', label: 'Pragmatique — implicites, inférences' },
              { id: 'l-acq', label: 'Acquisition, bilinguisme' },
              { id: 'l-rw', label: 'Lecture et écriture' },
              { id: 'l-dis', label: 'Troubles — aphasies, dyslexie' }
            ]
          },
          {
            id: 'thinking',
            label: 'Pensée, raisonnement, problèmes',
            children: [
              { id: 't-cat', label: 'Concepts & catégorisation — prototypes, exemplaires' },
              { id: 't-ind', label: 'Induction et déduction' },
              { id: 't-prob', label: 'Résolution de problèmes — heuristiques, insight' },
              { id: 't-cre', label: 'Pensée créative' },
              { id: 't-sci', label: 'Raisonnement scientifique — biais de confirmation' }
            ]
          },
          {
            id: 'decision',
            label: 'Décision & jugement',
            children: [
              { id: 'd-bias', label: 'Heuristiques et biais — disponibilité, ancrage' },
              { id: 'd-mod', label: 'Modèles — utilité attendue, prospect theory' },
              { id: 'd-risk', label: 'Risque et incertitude' },
              { id: 'd-mor', label: 'Décision morale' },
              { id: 'd-nat', label: 'Décision naturelle — médicale, financière, juridique' }
            ]
          },
          {
            id: 'metacog',
            label: 'Métacognition & fonctions exécutives',
            children: [
              { id: 'mc-k', label: 'Connaissances métacognitives — soi, tâches, stratégies' },
              { id: 'mc-e', label: 'Expériences — difficulté, confiance' },
              { id: 'mc-r', label: 'Régulation — planification, monitoring, ajustement' },
              { id: 'mc-ef', label: 'Fonctions exécutives — inhibition, flexibilité, updating' },
              { id: 'mc-srl', label: 'Auto-régulation de l’apprentissage (SRL)' },
              { id: 'mc-soc', label: 'Métacognition sociale — théorie de l’esprit' }
            ]
          },
          {
            id: 'socemo',
            label: 'Cognition sociale & émotionnelle',
            children: [
              { id: 'se-emo', label: 'Perception des émotions' },
              { id: 'se-tom', label: 'Théorie de l’esprit, attributions' },
              { id: 'se-reg', label: 'Régulation émotionnelle' },
              { id: 'se-path', label: 'Biais dans dépression, anxiété' }
            ]
          },
          {
            id: 'space',
            label: 'Cognition numérique & spatiale',
            children: [
              { id: 'sp-num', label: 'Nombres, calcul, dyscalculie' },
              { id: 'sp-nav', label: 'Navigation, cartes cognitives, rotation mentale' },
              { id: 'sp-stem', label: 'Cognition spatiale en STEM' }
            ]
          }
        ]
      },
      {
        title: 'Par approche',
        children: [
          { id: 'ap-exp', label: 'Cognitive expérimentale' },
          { id: 'ap-ns', label: 'Neurosciences cognitives' },
          { id: 'ap-comp', label: 'Cognitive computationnelle' },
          { id: 'ap-np', label: 'Neuropsychologie cognitive' },
          { id: 'ap-dev', label: 'Cognitive développementale' },
          { id: 'ap-app', label: 'Cognitive appliquée' }
        ]
      },
      {
        title: 'Par application',
        children: [
          { id: 'app-edu', label: 'Éducation' },
          { id: 'app-hci', label: 'Ergonomie & IHM' },
          { id: 'app-cli', label: 'Clinique & TCC' },
          { id: 'app-re', label: 'Rééducation neuropsychologique' },
          { id: 'app-ai', label: 'Cognition et IA' }
        ]
      }
    ]
  },
  {
    id: 'clinical',
    title: 'Clinique & santé mentale',
    object: 'Évaluation et prise en charge des troubles psychologiques et de la souffrance mentale.',
    color: 'rose',
    accent: 'from-rose-600 to-pink-600',
    trees: [
      {
        title: 'Clinique',
        children: [
          { id: 'cl-eval', label: 'Évaluation — entretiens, tests, observations' },
          { id: 'cl-dx', label: 'Diagnostic & psychopathologie — DSM, CIM' },
          {
            id: 'cl-th',
            label: 'Psychothérapies',
            children: [
              { id: 'th-tcc', label: 'TCC' },
              { id: 'th-psy', label: 'Psychanalyse / psychodynamique' },
              { id: 'th-hum', label: 'Humanistes et existentielles' },
              { id: 'th-sys', label: 'Systémiques et familiales' },
              { id: 'th-3w', label: '3e vague — ACT, MBCT, DBT' }
            ]
          },
          { id: 'cl-pop', label: 'Populations — enfant, adulte, gérontopsychologie' }
        ]
      },
      {
        title: 'Psychopathologie',
        children: [
          { id: 'pp-mood', label: 'Troubles de l’humeur' },
          { id: 'pp-anx', label: 'Troubles anxieux' },
          { id: 'pp-psy', label: 'Troubles psychotiques' },
          { id: 'pp-pers', label: 'Troubles de la personnalité' },
          { id: 'pp-eat', label: 'Troubles alimentaires' },
          { id: 'pp-add', label: 'Addictions' },
          { id: 'pp-nd', label: 'Neurodéveloppement — TDAH, TSA, apprentissages' }
        ]
      },
      {
        title: 'Santé & crise',
        children: [
          { id: 'hs-np', label: 'Neuropsychologie clinique' },
          { id: 'hs-beh', label: 'Comportements de santé, adhésion, douleur' },
          { id: 'hs-urg', label: 'Urgence, deuil, psychotraumatologie' }
        ]
      }
    ]
  },
  {
    id: 'dev',
    title: 'Psychologie du développement',
    object: 'Changements psychologiques de la conception à la mort.',
    color: 'emerald',
    accent: 'from-emerald-600 to-teal-600',
    trees: [
      {
        title: 'Par période',
        children: [
          { id: 'dv-pre', label: 'Prénatal et périnatal' },
          { id: 'dv-inf', label: 'Petite enfance 0–6 — attachement, langage, jeu' },
          { id: 'dv-chi', label: 'Enfance 6–12 — opérations, pairs, morale' },
          { id: 'dv-ado', label: 'Adolescence — identité, pairs, prise de risque' },
          { id: 'dv-ad', label: 'Âge adulte — carrière, couple, parentalité' },
          { id: 'dv-old', label: 'Vieillissement — cognition, retraite, sagesse' }
        ]
      },
      {
        title: 'Par domaine',
        children: [
          { id: 'dd-phy', label: 'Physique et motricité' },
          { id: 'dd-cog', label: 'Cognitif — Piaget, Vygotsky, métacognition' },
          { id: 'dd-soc', label: 'Socio-émotionnel — attachement, empathie' },
          { id: 'dd-lan', label: 'Langage, bilinguisme, troubles' },
          { id: 'dd-aty', label: 'Développement atypique — TSA, TDAH, HPI, trauma' }
        ]
      },
      {
        title: 'Approches',
        children: [
          { id: 'da-sta', label: 'Stadiales — Piaget, Erikson, Kohlberg' },
          { id: 'da-soc', label: 'Socio-culturelles — Vygotsky' },
          { id: 'da-att', label: 'Attachement — Bowlby, Ainsworth' },
          { id: 'da-eco', label: 'Bio-écologique — Bronfenbrenner' },
          { id: 'da-ns', label: 'Neurosciences du développement' }
        ]
      }
    ]
  },
  {
    id: 'social',
    title: 'Psychologie sociale',
    object: 'Pensées, sentiments et comportements influencés par la présence d’autrui.',
    color: 'amber',
    accent: 'from-amber-500 to-orange-600',
    trees: [
      {
        title: 'Mécanismes',
        children: [
          { id: 'so-cog', label: 'Cognition sociale — impressions, attributions, stéréotypes' },
          { id: 'so-att', label: 'Attitudes — persuasion, dissonance, engagement' },
          { id: 'so-inf', label: 'Influence — conformité (Asch), obéissance (Milgram), normes (Sherif)' },
          { id: 'so-grp', label: 'Relations intergroupes — Tajfel, Robbers Cave' },
          { id: 'so-pro', label: 'Prosocialité et agression' },
          { id: 'so-dyn', label: 'Dynamique de groupe, leadership, groupthink' }
        ]
      },
      {
        title: 'Applications',
        children: [
          { id: 'so-pol', label: 'Politique' },
          { id: 'so-env', label: 'Environnement' },
          { id: 'so-mkt', label: 'Consommation' },
          { id: 'so-pub', label: 'Santé publique' },
          { id: 'so-law', label: 'Juridique et testimoniale' }
        ]
      }
    ]
  },
  {
    id: 'personality',
    title: 'Personnalité',
    object: 'Différences individuelles stables dans la façon de penser, sentir et agir.',
    color: 'violet',
    accent: 'from-violet-600 to-purple-600',
    trees: [
      {
        title: 'Théories',
        children: [
          { id: 'pe-dyn', label: 'Psychodynamiques — Freud, Jung' },
          { id: 'pe-hum', label: 'Humanistes — Rogers, Maslow' },
          { id: 'pe-big', label: 'Traits — Big Five, Eysenck' },
          { id: 'pe-sc', label: 'Socio-cognitives — Bandura, Mischel' },
          { id: 'pe-bio', label: 'Biologiques et génétiques' }
        ]
      },
      {
        title: 'Structure & mesure',
        children: [
          { id: 'pe-str', label: 'Traits, tempérament, identité, estime de soi' },
          { id: 'pe-dev', label: 'Stabilité et changement au cours de la vie' },
          { id: 'pe-adj', label: 'Ajustement — santé, relations, performance' },
          { id: 'pe-mes', label: 'NEO-PI, MMPI, projectifs, 360°' }
        ]
      }
    ]
  },
  {
    id: 'bio',
    title: 'Biologique / neurosciences',
    object: 'Bases biologiques — cerveau, hormones, gènes — des comportements et processus mentaux.',
    color: 'teal',
    accent: 'from-teal-600 to-cyan-600',
    trees: [
      {
        title: 'Domaines',
        children: [
          { id: 'bi-nc', label: 'Neurosciences cognitives — réseaux, plasticité' },
          { id: 'bi-np', label: 'Neuropsychologie — lésions, syndromes' },
          { id: 'bi-pp', label: 'Psychophysiologie — EEG, conductance, stress' },
          { id: 'bi-en', label: 'Psycho-endocrinologie — cortisol, hormones' },
          { id: 'bi-ph', label: 'Psychopharmacologie' },
          { id: 'bi-ge', label: 'Génétique du comportement — jumeaux, GWAS' },
          { id: 'bi-af', label: 'Neurosciences affectives et sociales, neuroéconomie' }
        ]
      }
    ]
  },
  {
    id: 'education',
    title: 'Psychologie de l’éducation',
    object: 'Comment les gens apprennent, et comment améliorer l’enseignement.',
    color: 'indigo',
    accent: 'from-indigo-600 to-blue-700',
    trees: [
      {
        title: 'Apprentissage & instruction',
        children: [
          { id: 'ed-beh', label: 'Béhaviorisme — renforcement' },
          { id: 'ed-cog', label: 'Cognitivisme — schémas, charge cognitive' },
          { id: 'ed-con', label: 'Constructivisme — Piaget' },
          { id: 'ed-vyg', label: 'Socio-constructivisme — ZPD' },
          { id: 'ed-str', label: 'Stratégies — espacement, retrieval practice' },
          { id: 'ed-tech', label: 'Technologies, adaptive learning, IA éducative' }
        ]
      },
      {
        title: 'Motivation, évaluation, inclusion',
        children: [
          { id: 'ed-mot', label: 'Autodétermination, buts, auto-efficacité' },
          { id: 'ed-eva', label: 'Évaluation formative / sommative, feedback' },
          { id: 'ed-cls', label: 'Climat de classe, inclusion' },
          { id: 'ed-sen', label: 'Besoins particuliers — dys, TDAH, HPI, handicap' },
          { id: 'ed-ori', label: 'Orientation et conseil scolaire' },
          { id: 'ed-eq', label: 'Inégalités, équité, politiques' }
        ]
      }
    ]
  },
  {
    id: 'io',
    title: 'Travail & organisations (I-O)',
    object: 'Comportement au travail : performance et bien-être.',
    color: 'slate',
    accent: 'from-slate-700 to-slate-900',
    trees: [
      {
        title: 'Personnel',
        children: [
          { id: 'io-sel', label: 'Sélection — KSAOs, tests, entretiens' },
          { id: 'io-perf', label: 'Évaluation de la performance' },
          { id: 'io-trn', label: 'Formation et carrières' }
        ]
      },
      {
        title: 'Organisation',
        children: [
          { id: 'io-mot', label: 'Motivation, engagement, culture' },
          { id: 'io-lead', label: 'Leadership et coaching' },
          { id: 'io-team', label: 'Équipes, conflits, décisions' },
          { id: 'io-chg', label: 'Changement organisationnel' }
        ]
      },
      {
        title: 'Santé & formes du travail',
        children: [
          { id: 'io-erg', label: 'Ergonomie et facteurs humains' },
          { id: 'io-rps', label: 'Stress, burn-out, RPS' },
          { id: 'io-dei', label: 'Diversité, équité, inclusion' },
          { id: 'io-hyb', label: 'Télétravail, plateformes, IA' },
          { id: 'io-voc', label: 'Conseil de carrière, reconversions' }
        ]
      }
    ]
  }
];

export const KEY_CITATIONS: Citation[] = [
  {
    id: 'flavell1979',
    authors: 'Flavell, J. H.',
    year: 1979,
    title: 'Metacognition and cognitive monitoring: A new area of cognitive–developmental inquiry',
    venue: 'American Psychologist',
    citationsApprox: 18000,
    category: 'Fondations',
    note: 'Référence canonique : connaissances vs expériences / régulation métacognitive.'
  },
  {
    id: 'zimmerman2000',
    authors: 'Zimmerman, B. J.',
    year: 2000,
    title: 'Attaining self-regulation: A social cognitive perspective',
    venue: 'Handbook of Self-Regulation',
    citationsApprox: 4169,
    category: 'Modèles SRL',
    note: 'Modèle en 3 phases : forethought → performance → self-reflection. Le plus cité.'
  },
  {
    id: 'pintrich2000',
    authors: 'Pintrich, P. R.',
    year: 2000,
    title: 'The role of goal orientation in self-regulated learning',
    venue: 'Handbook of Self-Regulation',
    citationsApprox: 3416,
    category: 'Modèles SRL',
    note: 'Articule motivation (buts, efficacité) et métacognition.'
  },
  {
    id: 'winne1998',
    authors: 'Winne, P. H. & Hadwin, A. F.',
    year: 1998,
    title: 'Studying as self-regulated learning',
    venue: 'Metacognition in Educational Theory and Practice',
    citationsApprox: 1037,
    category: 'Modèles SRL',
    note: '4 phases : task definition, goals, tactics, adapting.'
  },
  {
    id: 'boekaerts2000',
    authors: 'Boekaerts, M.',
    year: 2000,
    title: 'Self-regulation: Dual processing and goals',
    venue: 'Handbook of Self-Regulation',
    citationsApprox: 2500,
    category: 'Modèles SRL',
    note: 'Buts d’apprentissage vs protection de l’ego.'
  },
  {
    id: 'dignath2008a',
    authors: 'Dignath, C., Büttner, G. & Langfeldt, H.-P.',
    year: 2008,
    title: 'How can primary school students learn self-regulated learning strategies most effectively?',
    venue: 'Educational Research Review',
    citationsApprox: 1800,
    category: 'Méta-analyses',
    note: 'SRL dès le primaire ; effets sur stratégies, motivation, maths.'
  },
  {
    id: 'dignath2008b',
    authors: 'Dignath, C. & Büttner, G.',
    year: 2008,
    title: 'Components of fostering self-regulated learning among students',
    venue: 'Metacognition and Learning',
    citationsApprox: 2000,
    category: 'Méta-analyses',
    note: 'g ≈ 0,69. Combiner stratégies + expliquer pourquoi + feedback.'
  },
  {
    id: 'donker2014',
    authors: 'Donker, A. S., de Boer, H., Kostons, D., Dignath-van Ewijk, C. C. & van der Werf, M. P. C.',
    year: 2014,
    title: 'Effectiveness of learning strategy instruction on academic performance: A meta-analysis',
    venue: 'Educational Research Review',
    citationsApprox: 1600,
    category: 'Méta-analyses',
    note: 'Écriture g≈1,25 · sciences 0,73 · maths 0,66 · lecture 0,36.'
  },
  {
    id: 'deboer2018',
    authors: 'de Boer, H., Donker, A. S., Kostons, D. & van der Werf, M. P. C.',
    year: 2018,
    title: 'Long-term effects of metacognitive strategy instruction on student academic performance',
    venue: 'Educational Research Review',
    citationsApprox: 900,
    category: 'Méta-analyses',
    note: 'g ≈ 0,63 à long terme. Plus fort pour les élèves de faible SES.'
  },
  {
    id: 'muijs2020',
    authors: 'Muijs, D. & Bokhove, C.',
    year: 2020,
    title: 'Metacognition and self-regulation: Evidence Review',
    venue: 'Education Endowment Foundation',
    citationsApprox: 400,
    category: 'Preuves éducatives',
    note: 'Impact significatif au-delà du niveau initial.'
  },
  {
    id: 'pintrichAssess2000',
    authors: 'Pintrich, P. R., Wolters, C. A. & Baxter, G. P.',
    year: 2000,
    title: 'Assessing metacognition and self-regulated learning',
    venue: 'Issues in the Measurement of Metacognition',
    citationsApprox: 2200,
    category: 'Mesure',
    note: 'Cadre pour concevoir des mesures. MAI largement utilisé.'
  },
  {
    id: 'zimmerman2009',
    authors: 'Zimmerman, B. J. & Moylan, A. R.',
    year: 2009,
    title: 'Self-regulation: where metacognition and motivation intersect',
    venue: 'Handbook of Metacognition in Education',
    citationsApprox: 1800,
    category: 'Motivation',
    note: 'Intersection métacognition–motivation.'
  },
  {
    id: 'azevedo2004',
    authors: 'Azevedo, R. et al.',
    year: 2004,
    title: 'Does adaptive scaffolding facilitate students’ ability to regulate their learning with hypermedia?',
    venue: 'Contemporary Educational Psychology',
    citationsApprox: 1400,
    category: 'Technologies',
    note: 'SRL en environnements web : prompts et traces.'
  },
  {
    id: 'prompts2022',
    authors: 'Guo, L. (synthèse citée 2022)',
    year: 2022,
    title: 'Using metacognitive prompts to enhance SRL and learning outcomes in computer-based environments',
    venue: 'Educational Psychology Review / meta-analysis',
    citationsApprox: 350,
    category: 'Technologies',
    note: 'Les prompts métacognitifs améliorent SRL et résultats.'
  },
  {
    id: 'sherif1935',
    authors: 'Sherif, M.',
    year: 1935,
    title: 'A study of some social factors in perception',
    venue: 'Archives of Psychology',
    citationsApprox: 4000,
    category: 'Expériences',
    note: 'Illusion autocinétique : l’incertitude fabrique une norme.'
  },
  {
    id: 'asch1951',
    authors: 'Asch, S. E.',
    year: 1951,
    title: 'Effects of group pressure upon the modification and distortion of judgments',
    venue: 'Groups, Leadership and Men',
    citationsApprox: 8000,
    category: 'Expériences',
    note: 'Conformité face à une évidence perceptive.'
  },
  {
    id: 'sherif1961',
    authors: 'Sherif, M., Harvey, O. J., White, B. J., Hood, W. R. & Sherif, C. W.',
    year: 1961,
    title: 'Intergroup conflict and cooperation: The Robbers Cave experiment',
    venue: 'University of Oklahoma',
    citationsApprox: 6000,
    category: 'Expériences',
    note: 'Conflit intergroupe et buts supraordonnés.'
  },
  {
    id: 'bandura1961',
    authors: 'Bandura, A., Ross, D. & Ross, S. A.',
    year: 1961,
    title: 'Transmission of aggression through imitation of aggressive models',
    venue: 'Journal of Abnormal and Social Psychology',
    citationsApprox: 10000,
    category: 'Expériences',
    note: 'Poupée Bobo : apprentissage observationnel.'
  },
  {
    id: 'stroop1935',
    authors: 'Stroop, J. R.',
    year: 1935,
    title: 'Studies of interference in serial verbal reactions',
    venue: 'Journal of Experimental Psychology',
    citationsApprox: 20000,
    category: 'Expériences',
    note: 'Interférence lecture automatique vs dénomination de couleur.'
  },
  {
    id: 'loftus1974',
    authors: 'Loftus, E. F. & Palmer, J. C.',
    year: 1974,
    title: 'Reconstruction of automobile destruction',
    venue: 'Journal of Verbal Learning and Verbal Behavior',
    citationsApprox: 7000,
    category: 'Expériences',
    note: 'Mémoire reconstructive et suggestion.'
  },
  {
    id: 'festinger1959',
    authors: 'Festinger, L. & Carlsmith, J. M.',
    year: 1959,
    title: 'Cognitive consequences of forced compliance',
    venue: 'Journal of Abnormal and Social Psychology',
    citationsApprox: 9000,
    category: 'Expériences',
    note: 'Dissonance : faible récompense → plus de changement d’attitude.'
  }
];

export const EXPERIMENTS: ExperimentDef[] = [
  {
    id: 'sherif',
    title: 'Sherif — norme autocinétique',
    posterTitle: 'Quand l’incertitude fabrique une norme',
    branch: 'social',
    concept: 'Influence informationnelle et formation des normes',
    question: 'Quand rien ne permet de savoir clairement, comment décidons-nous ?',
    critique:
      'Sherif étudie une situation réellement ambiguë. Ne pas confondre avec Asch, où la réponse perceptive est évidente et la pression est normative.',
    transfer: [
      'Avis peu vérifiables en ligne',
      '« Bonne » voie professionnelle dans un groupe familial',
      'Évaluation floue : « être créatif », « avoir du potentiel »'
    ],
    cognitorium:
      'Rendre visible la différence entre préférence personnelle, norme perçue du groupe et information vérifiée.',
    protocol: ['Seul — forte dispersion', 'En groupe — convergence', 'Seul après — norme internalisée']
  },
  {
    id: 'asch',
    title: 'Asch — conformité',
    posterTitle: 'Pourquoi dire « B » quand on voit « C » ?',
    branch: 'social',
    concept: 'Conformité majoritaire et pression normative',
    question: 'Change-t-on d’avis pour une meilleure information, ou pour éviter le coût social du désaccord ?',
    critique:
      'La conformité baisse fortement avec un allié, une réponse privée, ou une majorité plus petite. Ce n’est pas une « faiblesse de caractère » universelle.',
    transfer: [
      'Likes et avis majoritaires',
      'Premier avis d’une personne à haut statut en réunion',
      'Pression vers des filières « raisonnables »',
      'Recommandation IA qui paraît majoritaire et assurée'
    ],
    cognitorium: 'Distinguer influence informationnelle et pression normative avant d’accepter un matching.',
    protocol: ['Stimulus évident', 'Majorité donne une mauvaise réponse', 'Réponse publique vs privée']
  },
  {
    id: 'robbers',
    title: 'Robbers Cave — conflit',
    posterTitle: 'Deux groupes, un seul problème commun',
    branch: 'social',
    concept: 'Identité sociale, conflit, buts supraordonnés',
    critique:
      'La coopération ne suffit pas toujours : statut, sécurité et interdépendance réelle importent. Éviter une causalité absolue.',
    question: 'Comment un « nous / eux » se forme-t-il, et comment se défait-il ?',
    transfer: [
      'Équipes produit vs technique',
      'Filières scolaires rivales',
      'Usagers vs institution',
      'KPI séparés vs objectifs partagés'
    ],
    cognitorium: 'Montrer les objectifs interdépendants plutôt que les seuls scores de chaque sous-groupe.',
    protocol: ['Formation des groupes', 'Compétition', 'But supraordonné', 'Coopération']
  },
  {
    id: 'stroop',
    title: 'Stroop — contrôle inhibiteur',
    posterTitle: 'Lire le mot ou nommer la couleur ?',
    branch: 'cognitive',
    concept: 'Interférence cognitive et contrôle exécutif',
    critique:
      'Le coût Stroop mesure un conflit de voies, pas une « intelligence ». Fatigue et pression temporelle l’augmentent.',
    question: 'Que se passe-t-il quand une réponse automatique entre en conflit avec le but de la tâche ?',
    transfer: [
      'Notifications qui coupent une tâche complexe',
      'Couleur, icône et libellé contradictoires',
      'Inhiber une stratégie intuitive mais erronée',
      'Premier métier familier vs exploration contrôlée'
    ],
    cognitorium: 'Séparér la première réponse familière d’une exploration contrôlée des alternatives ROME.',
    protocol: ['Congruent — rapide', 'Incongruent — conflit', 'Mesure du coût temporel']
  },
  {
    id: 'memory',
    title: 'Faux souvenirs — source',
    posterTitle: 'Vu, imaginé, ou suggéré ?',
    branch: 'cognitive',
    concept: 'Mémoire reconstructive et source monitoring',
    critique:
      'La mémoire n’est pas « systématiquement fausse ». Elle est reconstructive, donc vulnérable à certaines transformations.',
    question: 'Ai-je perçu cela, l’ai-je inféré, ou me l’a-t-on suggéré ?',
    transfer: [
      'Témoignages',
      'Confondre « relu » et « su »',
      'Attribuer à une source fiable une information générée par l’IA'
    ],
    cognitorium:
      'Tracer la provenance : déclaré par l’utilisateur, source institutionnelle, recommandation, hypothèse IA.',
    protocol: ['Encodage d’une liste', 'Leurres sémantiques', 'Reconnaissance + source']
  },
  {
    id: 'calibration',
    title: 'Calibration de confiance',
    posterTitle: 'Être sûr n’est pas toujours avoir raison',
    branch: 'education',
    concept: 'Monitoring métacognitif et calibration',
    critique:
      'La relation confiance–performance n’est pas linéaire. Viser une régulation adaptée à la tâche, pas « plus de confiance ».',
    question: 'Ma confiance suit-elle vraiment mon exactitude ?',
    transfer: [
      'Sous-confiance : compétence sous-estimée',
      'Surconfiance : illusion de maîtrise',
      'Incertitude réaliste : besoin d’information'
    ],
    cognitorium:
      'Après une exploration métier : confiance déclarée → mini-vérification → comparaison → prochaine action adaptée.',
    protocol: ['Répondre', 'Déclarer 0–100 %', 'Feedback', 'Carte de calibration']
  }
];
