import { CognitiveBiasQuestion } from '../types';

export const COGNITIVE_BIASES_CATALOG: CognitiveBiasQuestion[] = [
  {
    id: 'bias-confirmation',
    name: 'Biais de confirmation',
    shortCode: 'CONFIRM',
    definition: 'Tendance systématique à privilégier, rechercher et mémoriser les informations qui confortent ses hypothèses initiales, tout en négligeant ou dévalorisant les faits contradictoires.',
    question: 'Dans une recherche ou une prise de décision, j’ai naturellement tendance à chercher en priorité des avis, données ou articles qui valident ce que je pressentais déjà.',
    remediationAdvice: 'Pratiquez l’avocat du diable : cherchez activement 3 contre-preuves solides avant de trancher. Sollicitez des contradicteurs bienveillants.',
    score: 4
  },
  {
    id: 'bias-ancrage',
    name: 'Biais d’ancrage',
    shortCode: 'ANCRE',
    definition: 'Difficulté à se départir d’une première impression ou d’une première donnée chiffrée reçue, qui sert de point d’ancrage faussant les estimations ultérieures.',
    question: 'Lors d’une négociation, d’une estimation de durée ou d’un budget, le tout premier chiffre mentionné influence fortement ma propre estimation finale.',
    remediationAdvice: 'Déterminez vos critères et fourchettes de référence à froid, avant d’entrer en réunion ou d’entendre la première proposition chiffrée.',
    score: 4
  },
  {
    id: 'bias-exces-confiance',
    name: 'Excès de confiance (Overconfidence)',
    shortCode: 'SURCONFIANCE',
    definition: 'Surestimation subjective de la précision de ses propres jugements, de ses connaissances techniques ou de la probabilité de réussite d’un projet.',
    question: 'Je pense souvent maîtriser les tenants et aboutissants d’un sujet complexe plus rapidement et plus précisément que la moyenne des intervenants.',
    remediationAdvice: 'Documentez vos prédictions chiffrées passées et mesurez vos écarts réels. Utilisez des protocoles d’évaluation pré-mortem (« Imaginons que le projet a échoué dans un an, pourquoi ? »).',
    score: 4
  },
  {
    id: 'bias-statu-quo',
    name: 'Biais de statu quo',
    shortCode: 'STATU_QUO',
    definition: 'Préférence disproportionnée pour le maintien de l’état actuel, le changement étant perçu comme générateur de risques et d’efforts asymétriques.',
    question: 'Face à une situation incertaine, je préfère généralement reconduire les méthodes, outils ou habitudes existants plutôt que d’expérimenter une rupture.',
    remediationAdvice: 'Calculez le « coût de l’inaction » sur 2 ans. Testez les changements sous forme de petits sprints d’expérimentation réversibles (pilotes).',
    score: 3
  },
  {
    id: 'bias-aversion-perte',
    name: 'Aversion à la perte',
    shortCode: 'PERTE',
    definition: 'La souffrance psychologique ressentie lors d’une perte est environ deux fois plus intense que la satisfaction procurée par un gain équivalent (Kahneman & Tversky).',
    question: 'L’idée de perdre des avantages acquis ou d’essuyer un revers me bloque nettement plus que la perspective de réaliser une progression prometteuse.',
    remediationAdvice: 'Recadrez les décisions en termes d’opportunités d’apprentissage. Fixez un montant ou un temps de risque maximal acceptable à l’avance.',
    score: 4
  },
  {
    id: 'bias-effet-halo',
    name: 'Effet de halo',
    shortCode: 'HALO',
    definition: 'Généralisation hâtive d’une impression favorable (ou défavorable) liée à une seule caractéristique visible (aisance oratoire, prestige de diplôme) à l’ensemble des compétences.',
    question: 'Lorsqu’une personne fait une excellente impression initiale ou s’exprime avec brio, j’ai tendance à lui accorder immédiatement du crédit sur d’autres compétences non vérifiées.',
    remediationAdvice: 'Évaluez chaque compétence séparément sur une grille critériée objective, sans laisser la première impression contaminer les critères factuels.',
    score: 3
  },
  {
    id: 'bias-disponibilite',
    name: 'Heuristique de disponibilité',
    shortCode: 'DISPO',
    definition: 'Évaluation de la fréquence ou de la gravité d’un événement en fonction de la facilité avec laquelle des exemples frappants ou récents viennent à l’esprit.',
    question: 'Je fonde souvent mes priorités ou mes craintes sur un fait marquant récent ou un exemple marquant vu dans l’actualité, plutôt que sur des statistiques de fond.',
    remediationAdvice: 'Recherchez systématiquement les données de taux de base (fréquence statistique réelle) plutôt que de vous fier à des anecdotes mémorables.',
    score: 4
  },
  {
    id: 'bias-retrospectif',
    name: 'Biais rétrospectif (« Je le savais depuis le début »)',
    shortCode: 'RETROSPECTIF',
    definition: 'Illusion selon laquelle un événement survenu était prévisible et inévitable avant qu’il ne se produise, modifiant a posteriori son propre souvenir.',
    question: 'Après qu’un problème ou une crise a éclaté, je me dis très souvent que les signaux étaient évidents et qu’on aurait dû le voir venir dès le départ.',
    remediationAdvice: 'Tenez un journal de bord de décision consignant par écrit vos hypothèses, incertitudes et alternatives au moment exact où la décision est prise.',
    score: 3
  },
  {
    id: 'bias-autorite',
    name: 'Biais d’autorité',
    shortCode: 'AUTORITE',
    definition: 'Tendance à attribuer une plus grande valeur et une véracité aveugle à l’opinion d’une figure d’autorité ou d’un expert, y compris en dehors de son domaine de compétence.',
    question: 'J’ai du mal à remettre en cause la recommandation d’un supérieur hiérarchique ou d’un expert reconnu, même quand des observations de terrain suggèrent le contraire.',
    remediationAdvice: 'Séparez l’émetteur de l’argument : analysez la preuve apportée et les données de terrain de manière déconnectée du statut hiérarchique.',
    score: 3
  },
  {
    id: 'bias-omission',
    name: 'Biais d’omission',
    shortCode: 'OMISSION',
    definition: 'Jugement moral asymétrique considérant qu’un dommage causé par l’inaction est moins grave ou moins blâmable qu’un dommage équivalent causé par une action directe.',
    question: 'Face à un risque d’erreur, je préfère m’abstenir d’intervenir et laisser la situation évoluer d’elle-même, plutôt que d’agir et risquer d’être tenu responsable d’un échec.',
    remediationAdvice: 'Évaluez la non-décision comme un choix actif à part entière avec ses propres conséquences, responsabilités et coûts cumulatifs.',
    score: 3
  }
];

export function calculateLucidityScore(scores: Record<string, number>): {
  averageScore: number;
  lucidityIndex: number;
  highBiases: string[];
} {
  const values = Object.values(scores);
  if (values.length === 0) {
    return { averageScore: 3.5, lucidityIndex: 58, highBiases: [] };
  }
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;
  // Échelle 1-7 : un score moyen de 1 = vulnérabilité minime / lucidité 100%
  // un score moyen de 7 = vulnérabilité maximale / lucidité 0%
  const lucidity = Math.max(0, Math.min(100, Math.round(100 - ((avg - 1) / 6) * 100)));
  const high = Object.entries(scores)
    .filter(([_, score]) => score >= 5)
    .map(([id]) => id);

  return {
    averageScore: Math.round(avg * 10) / 10,
    lucidityIndex: lucidity,
    highBiases: high
  };
}
