import { CognitiveProfile, ProfileAssessment, AssessmentKind, ExperienceNode } from '../types';

export const ASSESSMENT_KIND_META: Record<
  AssessmentKind,
  { label: string; blurb: string; tone: string }
> = {
  diplome: {
    label: 'Diplômes',
    blurb: 'Titres académiques et relevés — preuves de parcours.',
    tone: 'from-violet-700 to-slate-900'
  },
  certification: {
    label: 'Certifications',
    blurb: 'Habilitations, SST, AIPR, titres professionnels.',
    tone: 'from-amber-600 to-slate-900'
  },
  verification: {
    label: 'Documents de vérification',
    blurb: 'CV, attestations, PV, contrats — provenance des nœuds.',
    tone: 'from-slate-700 to-slate-950'
  },
  evaluation: {
    label: 'Évaluations',
    blurb: 'Soutenances, validations de stage, bilans documentés.',
    tone: 'from-teal-700 to-slate-900'
  },
  test_psy: {
    label: 'Tests psychologiques',
    blurb: 'Inventaires documentaires. Jamais un diagnostic automatique.',
    tone: 'from-sky-800 to-slate-950'
  },
  physio: {
    label: 'Mesures physiologiques',
    blurb: 'Eye-tracking, chronométrie, capteurs — recherche, pas un examen médical.',
    tone: 'from-emerald-800 to-slate-950'
  },
  bci: {
    label: 'BCI',
    blurb: 'Interfaces cerveau-ordinateur documentaires. Pas un dispositif médical.',
    tone: 'from-indigo-800 to-slate-950'
  }
};

const NATHAN: ProfileAssessment[] = [
  {
    id: 'as-bac-sti2d',
    kind: 'diplome',
    title: 'Baccalauréat STI2D SIN',
    issuer: 'Lycée Paul Cézanne — Aix-en-Provence',
    year: 2013,
    status: 'verified',
    relatedNodeIds: ['form-sti2d'],
    documentLabel: 'Diplôme du Baccalauréat',
    summary: 'Systèmes d’information et numérique. Preuve explicite de formation initiale technologique.'
  },
  {
    id: 'as-licence',
    kind: 'diplome',
    title: 'Licence de Psychologie',
    issuer: 'Université Paul Valéry Montpellier 3',
    year: 2016,
    status: 'verified',
    relatedNodeIds: ['form-licence-psycho'],
    documentLabel: 'Diplôme d’État de Licence',
    summary: 'Bases cognitives, sociales, stats. Titre académique vérifié.'
  },
  {
    id: 'as-m1',
    kind: 'diplome',
    title: 'Master 1 Sciences Cognitives',
    issuer: 'Université Paul Valéry Montpellier 3',
    year: 2017,
    status: 'verified',
    relatedNodeIds: ['form-m1-cognition'],
    documentLabel: 'Relevé de notes / validation M1',
    summary: 'Protocoles, chronométrie, recherche documentaire.'
  },
  {
    id: 'as-m2',
    kind: 'diplome',
    title: 'Master 2 Évaluation du fonctionnement cognitif',
    issuer: 'Université Paul Valéry Montpellier 3',
    year: 2019,
    status: 'verified',
    relatedNodeIds: ['form-m2-cognition'],
    documentLabel: 'Diplôme d’État de Master 2 (mention)',
    summary: 'Évaluation cognitive, psychométrie, attention spatio-temporelle. Pas une habilitation clinique.'
  },
  {
    id: 'as-aipr',
    kind: 'certification',
    title: 'AIPR Encadrant / Concepteur',
    issuer: 'SOCOTEC / AFPA',
    year: '2023–2024',
    status: 'verified',
    relatedNodeIds: ['form-conducteur-afpa', 'skill-securite-sst'],
    documentLabel: 'Attestation AIPR',
    summary: 'Anti-endommagement des réseaux. Habilitation terrain, à jour.'
  },
  {
    id: 'as-sst',
    kind: 'certification',
    title: 'SST — Sauveteur secouriste du travail',
    issuer: 'AFPA / organisme habilité',
    year: 2024,
    status: 'verified',
    relatedNodeIds: ['form-conducteur-afpa', 'skill-securite-sst'],
    documentLabel: 'Certificat SST',
    summary: 'Gestes d’urgence. Recyclage à suivre selon la date d’échéance.'
  },
  {
    id: 'as-cv-recherche',
    kind: 'verification',
    title: 'CV spécialisé recherche 2020',
    issuer: 'Déclaré / dossier personnel',
    year: 2020,
    status: 'verified',
    documentLabel: 'cv_spécialisé_2020.pdf',
    relatedNodeIds: ['exp-sncf', 'exp-catie'],
    summary: 'Source de volumes SNCF (160) et CATIE (60). Document de provenance, pas une preuve unique.'
  },
  {
    id: 'as-cv-btp',
    kind: 'verification',
    title: 'CV professionnel 2024',
    issuer: 'Déclaré / dossier personnel',
    year: 2024,
    status: 'verified',
    documentLabel: 'cv 2024 (1).pdf',
    relatedNodeIds: ['exp-sobeca', 'exp-colas'],
    summary: 'Contrats et missions VRD. À croiser avec fiches de paie / attestations employeur.'
  },
  {
    id: 'as-pv-ufr',
    kind: 'verification',
    title: 'Procès-verbal d’élection UFR 5',
    issuer: 'Université Paul Valéry',
    year: 2018,
    status: 'verified',
    relatedNodeIds: ['exp-tutorat'],
    documentLabel: 'PV d’élection',
    summary: 'Preuve de mandat étudiant — gouvernance, pas une note.'
  },
  {
    id: 'as-soutenance-m2',
    kind: 'evaluation',
    title: 'Soutenance mémoire M2 (mention)',
    issuer: 'Laboratoire Epsylon / UM3 — Dir. Pom Charras',
    year: 2019,
    status: 'verified',
    relatedNodeIds: ['res-projet-m2-preference', 'form-m2-cognition'],
    documentLabel: 'Mémoire soutenu',
    summary: 'Évaluation académique du travail de recherche. Ce n’est pas un test psychologique de la personne.'
  },
  {
    id: 'as-stage-m2',
    kind: 'evaluation',
    title: 'Validation de stage M2 — SNCF Innovation',
    issuer: 'SNCF Direction Innovation et Recherche',
    year: 2019,
    status: 'verified',
    relatedNodeIds: ['exp-sncf'],
    documentLabel: 'Attestation / validation de stage',
    summary: 'Évaluation de mission R&D (orientation en gare, 160 participants).'
  },
  {
    id: 'as-riasec',
    kind: 'test_psy',
    title: 'Inventaire d’intérêts RIASEC (Holland)',
    issuer: 'Profil Cognitorium — auto-rapport',
    year: 2026,
    status: 'pending',
    clinical: true,
    tags: ['riasec', 'intérêts', 'orientation'],
    summary:
      'information_documentaire_non_diagnostique. Code SIC déclaré. Inventaire d’intérêts, pas un QI, pas un diagnostic. Niveau 5 jamais auto-déduit.'
  },
  {
    id: 'as-tobii',
    kind: 'physio',
    title: 'Sessions eye-tracking Tobii (CATIE / SNCF)',
    issuer: 'CATIE Bordeaux · SNCF Innovation',
    year: '2018–2019',
    status: 'verified',
    relatedNodeIds: ['exp-catie', 'skill-eye-tracking'],
    tags: ['tobii', 'regard', 'AOI'],
    summary:
      'Mesure de regard en recherche (fixations, saccades). Pas un examen ophtalmologique ni un diagnostic.'
  },
  {
    id: 'as-chrono',
    kind: 'physio',
    title: 'Chronométrie attentionnelle (OpenSesame / E-Prime)',
    issuer: 'Laboratoire Epsylon / protocoles M1–M2',
    year: '2016–2019',
    status: 'verified',
    relatedNodeIds: ['form-m1-cognition', 'res-projet-endogene'],
    tags: ['RT', 'SOA', 'attention'],
    summary: 'Temps de réponse au millième. Données de protocole, pas une cote clinique.'
  },
  {
    id: 'as-openbci',
    kind: 'bci',
    title: 'Collection documentaire OpenBCI',
    issuer: 'Veille personnelle / openbci.com/citations',
    year: 2026,
    status: 'pending',
    clinical: true,
    tags: ['eeg', 'openbci', 'bci'],
    summary:
      'information_documentaire_non_diagnostique. Références et matériel de veille — pas un enregistrement clinique, pas un dispositif médical, jamais un diagnostic.'
  }
];

export const EVALUATIONS_BY_PROFILE: Record<string, ProfileAssessment[]> = {
  'profile-nathan-cabrol': NATHAN
};

function kindFromEvidence(label: string, source: string): AssessmentKind | null {
  const l = label.toLowerCase();
  if (/aipr|sst|habilitation|certif|bnssa|qualiopi|iso/.test(l)) return 'certification';
  if (source === 'diploma' || /dipl[oô]me|baccalaur|licence|master|brevet/.test(l)) return 'diplome';
  if (/soutenance|validation de stage|relevé|bilan/.test(l)) return 'evaluation';
  if (source === 'cv' || source === 'attest' || /attestation|pv |contrat|rapport/.test(l)) return 'verification';
  return null;
}

export function collectAssessments(profile: CognitiveProfile): ProfileAssessment[] {
  const seeded = [
    ...(EVALUATIONS_BY_PROFILE[profile.id] || []),
    ...(profile.evaluations || [])
  ];
  const byId = new Map<string, ProfileAssessment>();
  seeded.forEach((a) => byId.set(a.id, a));

  for (const n of profile.nodes) {
    if (n.category === 'formation') {
      const f = n as ExperienceNode;
      const id = `as-auto-${n.id}`;
      if (!byId.has(id) && !seeded.some((a) => a.relatedNodeIds?.includes(n.id) && a.kind === 'diplome')) {
        byId.set(id, {
          id,
          kind: 'diplome',
          title: f.name,
          issuer: f.institutionOrContext,
          year: f.endYear || f.startYear,
          status: n.verificationStatus,
          relatedNodeIds: [n.id],
          documentLabel: n.evidence?.find((e) => e.source === 'diploma')?.label,
          summary: f.description || 'Formation déclarée dans le profil.'
        });
      }
    }
    for (const ev of n.evidence || []) {
      const kind = kindFromEvidence(ev.label, ev.source);
      if (!kind) continue;
      const id = `as-ev-${ev.id}`;
      if (byId.has(id)) continue;
      if ([...byId.values()].some((a) => a.documentLabel === ev.label || a.title === ev.label)) continue;
      byId.set(id, {
        id,
        kind,
        title: ev.label,
        issuer: ev.sourceDocument || n.name,
        year: ev.date || 's.d.',
        status: n.verificationStatus,
        relatedNodeIds: [n.id],
        documentLabel: ev.sourceDocument,
        summary: ev.detail || ev.volumeMetric || `Preuve liée à « ${n.name} ».`
      });
    }
  }

  return [...byId.values()].sort((a, b) => String(b.year).localeCompare(String(a.year), 'fr'));
}
