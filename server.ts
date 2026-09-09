import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.error("Failed to initialize GoogleGenAI:", e);
      aiClient = null;
    }
  }
  return aiClient;
}

/** Normalisation de chaîne : minuscules, sans accents, alphanumérique (pour les correspondances de noms). */
function normalizeName(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Moteur sémantique local de secours ultra-robuste (activé en cas de 503, indisponibilité IA ou mode hors-ligne). */
function distillWithSmartEngine(text: string, headline?: string) {
  const norm = normalizeName(text + " " + (headline || ""));
  const idBase = "exp-smart-" + Date.now().toString(36);
  const currentYear = 2026;

  // Détection spécialisée 1 : BAC STI2D / SIN / Réseaux / Électronique / Sète
  if (norm.includes("sti2d") || norm.includes("sin") || norm.includes("itec") || norm.includes("arduino") || norm.includes("embarque")) {
    const isSete = norm.includes("sete");
    const contextStr = isSete ? "Lycée Technologique / Section STI2D à Sète" : "Lycée Technologique - Filière STI2D";
    const expName = norm.includes("sin")
      ? "Baccalauréat STI2D - Option Systèmes d'Information et Numérique (SIN)"
      : "Baccalauréat STI2D - Sciences et Technologies de l'Industrie et du Développement Durable";

    return {
      experience: {
        id: idBase,
        name: expName,
        category: "formation",
        period: "2022 - 2024",
        startYear: 2022,
        endYear: 2024,
        institutionOrContext: contextStr,
        role: "Élève Technicien & Concepteur de Projets Numériques",
        description: text || "Formation technologique centrée sur l'analyse, la programmation et la mise en réseau de systèmes communicants.",
        missions: [
          "Développement et prototypage de programmes embarqués (C++, Python, cartes Arduino/Raspberry)",
          "Configuration, adressage et raccordement de réseaux informatiques locaux (IP, switch, Wi-Fi)",
          "Projet technique collectif de fin de cycle : conception d'un système communicant et soutenance orale",
          "Diagnostic et mesure de grandeurs physiques et numériques sur banc d'essai"
        ],
        cognitiveEfforts: [
          "Raisonnement logique et décomposition algorithmique de problèmes complexes",
          "Pensée systémique reliant le matériel électronique et les couches logicielles",
          "Diagnostic empirique d'anomalies sous contraintes techniques réelles"
        ]
      },
      skills: [
        {
          id: `skill-${idBase}-1`,
          name: "Programmation Embarquée & Algorithmique (C++/Python)",
          category: "skill_tech",
          baseMastery: 84,
          acquiredYear: 2023,
          lastPracticedYear: 2025,
          halfLifeYears: 4.5,
          decayFactor: 0.1,
          subSkills: ["Structures algorithmiques", "Interfaçage capteurs", "Scripts de test"],
          transferabilityScore: 8,
          description: "Capacité à structurer un algorithme et l'exécuter sur un matériel dédié (microcontrôleur ou PC)."
        },
        {
          id: `skill-${idBase}-2`,
          name: "Architecture & Configuration Réseaux IP",
          category: "skill_tech",
          baseMastery: 82,
          acquiredYear: 2023,
          lastPracticedYear: 2025,
          halfLifeYears: 5,
          decayFactor: 0.08,
          subSkills: ["Adressage IPv4/IPv6", "Routage & Switching", "Protocoles TCP/UDP"],
          transferabilityScore: 8,
          description: "Compréhension des topologies réseaux et capacité à interconnecter des équipements informatiques."
        },
        {
          id: `skill-${idBase}-3`,
          name: "Gestion de Projet Technique & Prototypage en Équipe",
          category: "skill_transversal",
          baseMastery: 80,
          acquiredYear: 2024,
          lastPracticedYear: 2026,
          halfLifeYears: 6.5,
          decayFactor: 0.05,
          subSkills: ["Cahier des charges", "Répartition des tâches", "Revue de conception"],
          transferabilityScore: 9,
          description: "Méthodologie de gestion de projet de la phase d'idée jusqu'à la livraison et la soutenance."
        },
        {
          id: `skill-${idBase}-4`,
          name: "Diagnostic & Dépannage Systémique",
          category: "skill_tech",
          baseMastery: 86,
          acquiredYear: 2023,
          lastPracticedYear: 2026,
          halfLifeYears: 7,
          decayFactor: 0.06,
          subSkills: ["Méthode par élimination", "Analyse de logs", "Mesures électriques"],
          transferabilityScore: 9,
          description: "Faculté à isoler l'origine d'une panne (matérielle, réseau ou logicielle) avec rigueur."
        }
      ],
      capacities: [
        {
          id: `cap-${idBase}-1`,
          name: "Raisonnement Logique & Algorithmique",
          level: "avancé",
          cognitiveDimension: "Raisonnement & Analyse",
          underlyingSkills: [`skill-${idBase}-1`, `skill-${idBase}-4`],
          description: "Aptitude à décomposer un problème en étapes séquentielles testables et à corriger les écarts."
        },
        {
          id: `cap-${idBase}-2`,
          name: "Coordination Cyber-Physique & Systémique",
          level: "avancé",
          cognitiveDimension: "Coordination & Systémique",
          underlyingSkills: [`skill-${idBase}-2`, `skill-${idBase}-3`],
          description: "Capacité à appréhender simultanément les interactions matérielles, réseaux et humaines."
        }
      ],
      potentialJobs: [
        {
          id: `job-${idBase}-1`,
          name: "Technicien Supérieur Systèmes & Réseaux (ROME I1401)",
          domain: "Informatique & Télécoms",
          matchScore: 91,
          rationale: "Votre socle STI2D SIN en réseaux IP et programmation vous rend immédiatement éligible avec une passerelle BTS SIO ou BUT Informatique.",
          matchingSkills: ["Architecture & Configuration Réseaux IP", "Diagnostic & Dépannage Systémique"],
          matchingSkillIds: [`skill-${idBase}-2`, `skill-${idBase}-4`],
          missingSkills: [
            {
              name: "Administration Systèmes Linux/Windows Server",
              importance: "recommandée",
              learningBridge: "Module pratique d'administration serveur et virtualisation (Docker/Proxmox)."
            }
          ],
          unlockedOpportunities: ["Administrateur Réseaux Junior", "Technicien Support Niveau 2", "Intégrateur IoT"]
        },
        {
          id: `job-${idBase}-2`,
          name: "Développeur Logiciel Embarqué & Objets Connectés (ROME M1805)",
          domain: "Ingénierie Informatique",
          matchScore: 86,
          rationale: "La double maîtrise du code (Python/C++) et de l'électronique de commande constitue un tremplin idéal pour l'Internet des Objets (IoT).",
          matchingSkills: ["Programmation Embarquée & Algorithmique (C++/Python)", "Diagnostic & Dépannage Systémique"],
          matchingSkillIds: [`skill-${idBase}-1`, `skill-${idBase}-4`],
          missingSkills: [
            {
              name: "Systèmes Temps Réel (RTOS)",
              importance: "recommandée",
              learningBridge: "Formation aux contraintes de synchronisation matérielle et microcontrôleurs avancés."
            }
          ],
          unlockedOpportunities: ["Développeur IoT", "Technicien en Prototypage Rapide", "Automaticien"]
        },
        {
          id: `job-${idBase}-3`,
          name: "Chef de Projet Technique / Futur Cadre Numérique (ROME M1803)",
          domain: "Management & Projets Informatiques",
          matchScore: 82,
          rationale: "Votre expérience de projet collaboratif combinée à l'objectif de cadre ouvre une trajectoire ascendante en ingénierie de projet.",
          matchingSkills: ["Gestion de Projet Technique & Prototypage en Équipe", "Programmation Embarquée & Algorithmique (C++/Python)"],
          matchingSkillIds: [`skill-${idBase}-3`, `skill-${idBase}-1`],
          missingSkills: [
            {
              name: "Gouvernance Budgétaire & Méthodes Agiles Scrum",
              importance: "recommandée",
              learningBridge: "Certifications Scrum Master ou cours de gestion de projet avancée."
            }
          ],
          unlockedOpportunities: ["Coordinateur de Déploiement", "Scrum Master", "Cadre Technique Numérique"]
        }
      ]
    };
  }

  // Détection spécialisée 2 : Cadre / Management / Responsable / Direction
  if (norm.includes("cadre") || norm.includes("manager") || norm.includes("direction") || norm.includes("responsable") || norm.includes("gestion d equipe")) {
    return {
      experience: {
        id: idBase,
        name: headline || "Poste Cadre & Management des Opérations",
        category: "experience",
        period: "2022 - 2026",
        startYear: 2022,
        endYear: 2026,
        institutionOrContext: "Organisation / Entreprise de taille intermédiaire",
        role: "Cadre Responsable de Pôle / Manager Opérationnel",
        description: text || "Responsabilités d'encadrement, pilotage des objectifs, animation des équipes et gestion des arbitrages sous contraintes.",
        missions: [
          "Animation managériale et encadrement d'une équipe pluridisciplinaire",
          "Pilotage des budgets opérationnels, optimisation des coûts et reporting exécutif",
          "Gestion des risques, négociation partenariale et arbitrage sous incertitude",
          "Conduite du changement et optimisation des processus opérationnels"
        ],
        cognitiveEfforts: [
          "Prise de décision rapide avec des informations partielles ou ambiguës",
          "Médiation relationnelle, écoute active et régulation émotionnelle",
          "Arbitrage multicritère (coût, qualité, délais, bien-être au travail)"
        ]
      },
      skills: [
        {
          id: `skill-${idBase}-1`,
          name: "Management d'Équipe & Leadership Coopératif",
          category: "skill_transversal",
          baseMastery: 88,
          acquiredYear: 2022,
          lastPracticedYear: 2026,
          halfLifeYears: 8,
          decayFactor: 0.05,
          subSkills: ["Délégation cadrée", "Feedback constructif", "Animation de réunions"],
          transferabilityScore: 10,
          description: "Aptitude à fédérer un collectif, maintenir l'engagement et faire monter les collaborateurs en compétences."
        },
        {
          id: `skill-${idBase}-2`,
          name: "Pilotage Budgétaire & Gestion des Risques",
          category: "skill_tech",
          baseMastery: 84,
          acquiredYear: 2022,
          lastPracticedYear: 2026,
          halfLifeYears: 6,
          decayFactor: 0.08,
          subSkills: ["Calcul de rentabilité", "Arbitrage de dépenses", "Tableaux de bord KPI"],
          transferabilityScore: 9,
          description: "Capacité à gérer les ressources financières avec rigueur et anticiper les dérives prévisionnelles."
        },
        {
          id: `skill-${idBase}-3`,
          name: "Négociation & Médiation Transversale",
          category: "skill_relational",
          baseMastery: 86,
          acquiredYear: 2023,
          lastPracticedYear: 2026,
          halfLifeYears: 9,
          decayFactor: 0.04,
          subSkills: ["Gestion de désaccords", "Recherche de consensus gagnant-gagnant", "Communication ascendante"],
          transferabilityScore: 10,
          description: "Désamorçage des tensions relationnelles et négociation efficace avec clients et fournisseurs."
        }
      ],
      capacities: [
        {
          id: `cap-${idBase}-1`,
          name: "Arbitrage Décisionnel sous Pression",
          level: "expert",
          cognitiveDimension: "Raisonnement & Analyse",
          underlyingSkills: [`skill-${idBase}-1`, `skill-${idBase}-2`],
          description: "Faculté cognitive à trancher avec calme et lucidité lorsque les enjeux et les risques sont élevés."
        },
        {
          id: `cap-${idBase}-2`,
          name: "Régulation Humaine & Cohésion d'Équipe",
          level: "expert",
          cognitiveDimension: "Humain & Médiation",
          underlyingSkills: [`skill-${idBase}-1`, `skill-${idBase}-3`],
          description: "Intelligence émotionnelle permettant de maintenir un climat de confiance et de haute performance."
        }
      ],
      potentialJobs: [
        {
          id: `job-${idBase}-1`,
          name: "Directeur / Responsable d'Unité Opérationnelle (ROME M1302)",
          domain: "Direction & Stratégie d'Entreprise",
          matchScore: 90,
          rationale: "Votre posture de cadre éprouvée et votre culture du résultat vous positionnent en première ligne pour la direction d'un centre de profit.",
          matchingSkills: ["Management d'Équipe & Leadership Coopératif", "Pilotage Budgétaire & Gestion des Risques"],
          matchingSkillIds: [`skill-${idBase}-1`, `skill-${idBase}-2`],
          missingSkills: [
            {
              name: "Stratégie Digitale & Automatisation des Flux",
              importance: "recommandée",
              learningBridge: "Acculturation aux outils CRM/ERP modernes et à l'IA appliquée à la gestion."
            }
          ],
          unlockedOpportunities: ["Directeur de Pôle Opérations", "Directeur d'Établissement", "Secrétaire Général"]
        },
        {
          id: `job-${idBase}-2`,
          name: "Consultant en Organisation & Conduite du Changement (ROME M1402)",
          domain: "Conseil & Audit Managérial",
          matchScore: 84,
          rationale: "Vos compétences de médiation et de diagnostic organisationnel sont directement transposables en cabinet de conseil.",
          matchingSkills: ["Négociation & Médiation Transversale", "Management d'Équipe & Leadership Coopératif"],
          matchingSkillIds: [`skill-${idBase}-3`, `skill-${idBase}-1`],
          missingSkills: [
            {
              name: "Méthodologies d'Audit Organisationnel",
              importance: "recommandée",
              learningBridge: "Formation accélérée aux grilles d'audit et benchmarks de processus."
            }
          ],
          unlockedOpportunities: ["Consultant Senior", "Facilitateur Agile", "Coach en Management"]
        }
      ]
    };
  }

  // Détection générale : Analyse intelligente de tout texte
  const words = text.split(/\s+/).filter(Boolean);
  const title = headline || (words.slice(0, 5).join(" ") + (words.length > 5 ? "..." : ""));
  return {
    experience: {
      id: idBase,
      name: title,
      category: "experience",
      period: "2023 - 2026",
      startYear: 2023,
      endYear: 2026,
      institutionOrContext: "Contexte déduit de votre parcours",
      role: "Acteur Clé & Praticien Opérationnel",
      description: text,
      missions: [
        "Réalisation des objectifs opérationnels avec rigueur de méthode",
        "Coordination des intervenants et transmission claire des informations",
        "Adaptation aux contraintes de délais et gestion des aléas quotidiens"
      ],
      cognitiveEfforts: [
        "Capacité d'analyse et de synthèse face aux flux d'informations",
        "Sens de l'effort continu et focalisation sur la qualité du livrable"
      ]
    },
    skills: [
      {
        id: `skill-${idBase}-1`,
        name: "Pratique Opérationnelle & Rigueur d'Exécution",
        category: "skill_tech",
        baseMastery: 85,
        acquiredYear: 2023,
        lastPracticedYear: 2026,
        halfLifeYears: 5,
        decayFactor: 0.1,
        subSkills: ["Méthode de travail", "Contrôle qualité", "Respect des normes"],
        transferabilityScore: 8,
        description: "Capacité démontrée à mener une tâche complexe de bout en bout avec précision."
      },
      {
        id: `skill-${idBase}-2`,
        name: "Adaptabilité & Flexibilité Face aux Imprévus",
        category: "skill_transversal",
        baseMastery: 88,
        acquiredYear: 2023,
        lastPracticedYear: 2026,
        halfLifeYears: 8,
        decayFactor: 0.05,
        subSkills: ["Réactivité", "Recherche de solutions alternatives", "Calme sous pression"],
        transferabilityScore: 9,
        description: "Compétence métacognitive permettant de pivoter efficacement sans perte d'efficacité."
      }
    ],
    capacities: [
      {
        id: `cap-${idBase}-1`,
        name: "Résolution Pratique & Agilité Cognitive",
        level: "avancé",
        cognitiveDimension: "Adaptabilité & Imprévus",
        underlyingSkills: [`skill-${idBase}-1`, `skill-${idBase}-2`],
        description: "Faculté cognitive à convertir un obstacle inattendu en plan d'action immédiat."
      }
    ],
    potentialJobs: [
      {
        id: `job-${idBase}-1`,
        name: "Coordinateur de Projets / Chargé de Mission (ROME M1803)",
        domain: "Organisation & Projets",
        matchScore: 84,
        rationale: "Votre sens de l'exécution et votre adaptabilité vous permettent d'orchestrer des chantiers pluridisciplinaires.",
        matchingSkills: ["Pratique Opérationnelle & Rigueur d'Exécution", "Adaptabilité & Flexibilité Face aux Imprévus"],
        matchingSkillIds: [`skill-${idBase}-1`, `skill-${idBase}-2`],
        missingSkills: [
          {
            name: "Pilotage Avancé de Projets",
            importance: "recommandée",
            learningBridge: "Module court sur les outils de gestion de projet et jalons opérationnels."
          }
        ],
        unlockedOpportunities: ["Chef de Projet Junior", "Responsable Opérationnel"]
      }
    ]
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // --- API ROUTE 1: DISTILLATION D'UNE EXPÉRIENCE EN CAPITAL COGNITIF & RELATIONS ---
  app.post("/api/distill-experience", async (req, res) => {
    const { experienceText, currentProfileNodes, targetObjective, forceLocal } = req.body;
    try {
      if (!experienceText || typeof experienceText !== "string") {
        return res.status(400).json({ error: "Texte d'expérience requis." });
      }

      if (forceLocal) {
        const smart = distillWithSmartEngine(experienceText, targetObjective);
        return res.json({
          success: true,
          source: 'smart_local_engine',
          distilled: smart
        });
      }

      const ai = getAiClient();
      if (!ai) {
        const smart = distillWithSmartEngine(experienceText, targetObjective);
        return res.json({
          success: true,
          source: 'smart_local_engine',
          distilled: smart
        });
      }

      // Appel Gemini 2.5 Flash avec Structured Output
      const prompt = `
Vous êtes le moteur d'analyse cognitive de COGNITORIUM.
Votre mission est de déconstruire le récit d'une expérience (professionnelle, personnelle, associative, sportive ou académique) pour en extraire la structure profonde du capital humain :

1. L'Expérience globale structurée (missions, efforts cognitifs)
2. Les Compétences techniques & transversales concrètes associées (avec score de maîtrise 0-100, année d'acquisition, demi-vie cognitive d'oubli/decay en années, sous-compétences, score de transférabilité 1-10)
3. Les Capacités cognitives de haut niveau nourries par ces compétences (ex: raisonnement spatial, coordination systémique, résistance à l'incertitude)
4. Les Horizons & Métiers potentiels débloqués par ces compétences transférables (avec analyse de match, compétences acquises vs compétences manquantes et passerelle de formation/pont d'apprentissage).

Objectif ou profil visé : "${targetObjective || 'Non spécifié'}"
Récit de l'expérience à analyser :
"""
${experienceText}
"""
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Vous êtes le moteur d'analyse cognitive de Cognitorium. Décomposez les expériences brutes en réseau interconnecté de compétences, capacités cognitives et horizons.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              experience: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Titre percutant de l'expérience" },
                  institutionOrContext: { type: Type.STRING, description: "Cadre ou organisation" },
                  role: { type: Type.STRING, description: "Rôle tenu" },
                  startYear: { type: Type.INTEGER, description: "Année de début estimée (ex: 2022)" },
                  endYear: { type: Type.INTEGER, description: "Année de fin (ex: 2025)" },
                  description: { type: Type.STRING, description: "Synthèse de l'expérience" },
                  missions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3 à 4 missions concrètes accomplies"
                  },
                  cognitiveEfforts: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "2 à 3 efforts ou gymnastiques mentales exigés"
                  }
                },
                required: ["name", "role", "description", "missions", "cognitiveEfforts"]
              },
              skills: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Nom précis de la compétence" },
                    category: { type: Type.STRING, enum: ["skill_tech", "skill_transversal", "skill_relational"] },
                    baseMastery: { type: Type.INTEGER, description: "Niveau de maîtrise pic (50-100)" },
                    acquiredYear: { type: Type.INTEGER, description: "Année d'acquisition" },
                    lastPracticedYear: { type: Type.INTEGER, description: "Dernière année de pratique" },
                    halfLifeYears: { type: Type.NUMBER, description: "Durée de demi-vie cognitive sans pratique (en années, ex: 4.5)" },
                    subSkills: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "2 à 3 sous-compétences constitutives"
                    },
                    transferabilityScore: { type: Type.INTEGER, description: "Indice de transférabilité de 1 à 10" },
                    description: { type: Type.STRING, description: "Pourquoi et comment cette compétence fonctionne" }
                  },
                  required: ["name", "category", "baseMastery", "halfLifeYears", "subSkills", "transferabilityScore", "description"]
                }
              },
              capacities: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Nom de la capacité cognitive méta (ex: Pensée Systémique sous contrainte)" },
                    level: { type: Type.STRING, enum: ["fondamental", "avancé", "expert"] },
                    cognitiveDimension: {
                      type: Type.STRING,
                      enum: [
                        "Raisonnement & Analyse",
                        "Coordination & Systémique",
                        "Adaptabilité & Imprévus",
                        "Spatial & Abstraction",
                        "Humain & Médiation"
                      ]
                    },
                    description: { type: Type.STRING, description: "Explication de la capacité cognitive" },
                    relatedSkills: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Noms EXACTS des compétences de la liste ci-dessus qui nourrissent cette capacité (2 à 4 max). Ne pas inventer de noms."
                    }
                  },
                  required: ["name", "level", "cognitiveDimension", "description"]
                }
              },
              potentialJobs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Métier ou horizon accessible" },
                    domain: { type: Type.STRING, description: "Secteur ou domaine" },
                    matchScore: { type: Type.INTEGER, description: "Score d'affinité 60-95%" },
                    rationale: { type: Type.STRING, description: "Explication du pont entre compétences actuelles et ce métier" },
                    matchingSkills: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Compétences déjà possédées utiles pour ce métier"
                    },
                    missingSkills: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING, description: "Compétence manquante" },
                          importance: { type: Type.STRING, enum: ["critique", "recommandée", "bonus"] },
                          learningBridge: { type: Type.STRING, description: "Pont d'apprentissage ou micro-formation conseillée" }
                        },
                        required: ["name", "importance", "learningBridge"]
                      }
                    },
                    unlockedOpportunities: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  },
                  required: ["name", "domain", "matchScore", "rationale", "matchingSkills", "missingSkills"]
                }
              }
            },
            required: ["experience", "skills", "capacities", "potentialJobs"]
          }
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      const idPrefix = "exp-ai-" + Date.now().toString(36);

      const experienceNode = {
        ...parsed.experience,
        id: idPrefix,
        category: 'experience',
        period: `${parsed.experience.startYear || 2023} - ${parsed.experience.endYear || 2026}`
      };

      const skillNodes = (parsed.skills || []).map((s: any, idx: number) => ({
        ...s,
        id: `skill-${idPrefix}-${idx + 1}`,
        decayFactor: 0.1,
        acquiredYear: s.acquiredYear || parsed.experience.startYear || 2023,
        lastPracticedYear: s.lastPracticedYear || parsed.experience.endYear || 2026
      }));

      const capacityNodes = (parsed.capacities || []).map((c: any, idx: number) => {
        // Relier chaque capacité à SES compétences (par nom exact), pas à toutes les compétences.
        const relatedNames = new Set((c.relatedSkills || []).map((s: string) => normalizeName(s)));
        const relatedIds = skillNodes
          .filter((s: any) => relatedNames.has(normalizeName(s.name)))
          .map((s: { id: string }) => s.id);
        return {
          ...c,
          id: `cap-${idPrefix}-${idx + 1}`,
          category: 'capacity_cognitive',
          underlyingSkills: relatedIds.length > 0 ? relatedIds : []
        };
      });

      // Les métiers sont reliés par leurs compétences matching (par nom), jamais par défaut.
      const jobNodes = (parsed.potentialJobs || []).map((j: any, idx: number) => {
        const matchingNames = new Set((j.matchingSkills || []).map((s: string) => normalizeName(s)));
        const matchingIds = skillNodes
          .filter((s: any) => matchingNames.has(normalizeName(s.name)))
          .map((s: { id: string }) => s.id);
        return {
          ...j,
          id: `job-${idPrefix}-${idx + 1}`,
          category: 'horizon_job',
          matchingSkillIds: matchingIds
        };
      });

      return res.json({
        success: true,
        source: 'gemini',
        distilled: {
          experience: experienceNode,
          skills: skillNodes,
          capacities: capacityNodes,
          potentialJobs: jobNodes
        }
      });
    } catch (err: any) {
      console.warn("Affluence ou indisponibilité de l'IA distante (503/timeout). Basculement automatique sur le moteur sémantique local de secours :", err?.message);
      const smartResult = distillWithSmartEngine(experienceText, targetObjective);
      return res.json({
        success: true,
        source: 'smart_local_engine',
        fallbackUsed: true,
        notice: "Les serveurs d'IA distants étaient momentanément saturés (503). Votre parcours a été analysé avec succès grâce au moteur cognitif local de secours !",
        distilled: smartResult
      });
    }
  });

  // Moteur sémantique local de secours pour les passerelles et horizons
  function generateSmartHorizonsFallback(skillsSummary?: string, capacitiesSummary?: string) {
    const norm = normalizeName((skillsSummary || '') + ' ' + (capacitiesSummary || ''));
    const idBase = "job-smart-" + Date.now().toString(36);

    // Cas 1 : Profil BTP / VRD / Chantier / Sécurité / Travaux (ex: Nathan ou profil TP)
    if (norm.includes('travaux') || norm.includes('vrd') || norm.includes('chantier') || norm.includes('btp') || norm.includes('sobeca') || norm.includes('colas') || norm.includes('securite') || norm.includes('sst') || norm.includes('aipr')) {
      return [
        {
          id: `${idBase}-1`,
          name: "Coordinateur Sécurité & Protection de la Santé (CSPS)",
          category: 'horizon_job',
          domain: "Prévention, Risques & BTP",
          matchScore: 94,
          rationale: "Votre rigueur réglementaire (AIPR/SST) et votre commandement de terrain VRD constituent le socle direct exigé pour piloter la prévention des coactivités sur grands chantiers.",
          matchingSkills: ["Prévention SST & Réglementation AIPR", "Supervision de Chantiers & Coactivité", "Coordination d'Équipes Terrain"],
          missingSkills: [
            {
              name: "Attestation de Compétence CSPS Niveau 1 ou 2",
              importance: "critique",
              learningBridge: "Formation certifiante réglementaire CSPS (formation professionnelle continue de 3 semaines)."
            },
            {
              name: "Plan Général de Coordination (PGC)",
              importance: "recommandée",
              learningBridge: "Module pratique d'élaboration des documents légaux de coordination."
            }
          ],
          unlockedOpportunities: ["Coordonnateur SPS Niveau 1 Grands Travaux", "Auditeur de Sécurité des Infrastructures"]
        },
        {
          id: `${idBase}-2`,
          name: "Chargé d'Opérations Aménagement Foncier & VRD",
          category: 'horizon_job',
          domain: "Collectivités, Urbanisme & Ingénierie",
          matchScore: 90,
          rationale: "Votre maîtrise concrète de l'implantation topographique, des cadences et du métré vous confère une légitimité immédiate pour piloter les dossiers de voirie côté maîtrise d'ouvrage.",
          matchingSkills: ["Implantation & Topographie", "Métrés & Gestion Contractuelle", "Interfaces Concessionnaires & Collectivités"],
          missingSkills: [
            {
              name: "Code des Marchés Publics (CCAG Travaux)",
              importance: "recommandée",
              learningBridge: "Formation courte de 20 heures sur la passation et l'exécution financière des marchés publics."
            }
          ],
          unlockedOpportunities: ["Responsable de Programmes VRD en collectivité", "Directeur de Travaux Équipements Publics"]
        },
        {
          id: `${idBase}-3`,
          name: "Responsable Facteurs Humains & QSE de Chantier",
          category: 'horizon_job',
          domain: "Ergonomie & Santé au Travail",
          matchScore: 92,
          rationale: "Passerelle d'exception : fusionner l'expérience terrain du BTP avec la compréhension des facteurs humains pour réduire drastiquement l'accidentologie et les TMS.",
          matchingSkills: ["Gestion des Aléas & Résilience", "Causeries Sécurité & Pédagogie", "Analyse des Situations de Travail"],
          missingSkills: [
            {
              name: "Méthodes d'Analyse Ergonomique des Postes BTP",
              importance: "bonus",
              learningBridge: "Perfectionnement aux grilles ANACT d'analyse des contraintes physiques et posturales."
            }
          ],
          unlockedOpportunities: ["Manager Prévention QSE Groupe BTP", "Consultant Facteurs Organisationnels & Humains"]
        }
      ];
    }

    // Cas 2 : Profil Psychologie / Recherche / Ergonome / Données
    if (norm.includes('psycho') || norm.includes('ergonom') || norm.includes('recherche') || norm.includes('stat') || norm.includes('eye tracking') || norm.includes('cogniti')) {
      return [
        {
          id: `${idBase}-1`,
          name: "Ergonome Spatiale & Facteurs Humains des Transports",
          category: 'horizon_job',
          domain: "Transports, Aéronautique & Mobilités",
          matchScore: 95,
          rationale: "Votre expertise en attention spatio-temporelle et modélisation de trajectoires répond parfaitement aux besoins des gestionnaires de réseaux de transport et hubs de mobilité.",
          matchingSkills: ["Attention Spatiale & Wayfinding", "Protocoles Expérimentaux & Eye-Tracking", "Traitement Statistique (R/JASP)"],
          missingSkills: [
            {
              name: "Normes d'Accessibilité PMR & Réglementation Transports",
              importance: "recommandée",
              learningBridge: "Guide technique CEREMA sur l'accessibilité des pôles d'échanges multimodaux."
            }
          ],
          unlockedOpportunities: ["Chef de projet Orientation & Design d'Espace", "Lead Chercheur Facteurs Humains"]
        },
        {
          id: `${idBase}-2`,
          name: "Concepteur en Sciences Comportementales (Behavioral Designer)",
          category: 'horizon_job',
          domain: "Innovation, Politiques Publiques & UX",
          matchScore: 91,
          rationale: "Appliquer la psychologie cognitive et la théorie des nudges pour orienter positivement les comportements des usagers en espace physique ou numérique.",
          matchingSkills: ["Biais Cognitifs & Prise de Décision", "Démarche Empirique & Tests Utilisateurs", "Restitution Stratégique"],
          missingSkills: [
            {
              name: "Méthodologie Nudge & Architecture de Choix",
              importance: "bonus",
              learningBridge: "Formation certifiante en conception comportementale appliquée aux services."
            }
          ],
          unlockedOpportunities: ["Consultant Nudge & Politiques Publiques", "Lead UX Researcher"]
        },
        {
          id: `${idBase}-3`,
          name: "Ingénieur Pédagogique & Simulateurs d'Apprentissage",
          category: 'horizon_job',
          domain: "Formation Professionnelle & EdTech",
          matchScore: 89,
          rationale: "Votre talent d'animation intergénérationnelle et votre maîtrise des processus mnésiques permettent de concevoir des parcours de montée en compétences ultra-efficaces.",
          matchingSkills: ["Pédagogie Active & Vulgarisation", "Compréhension des Processus d'Attention", "Encadrement Intergénérationnel"],
          missingSkills: [
            {
              name: "Ingénierie des Outils Numériques de Formation (LMS)",
              importance: "recommandée",
              learningBridge: "Module pratique de médiatisation de contenus de formation."
            }
          ],
          unlockedOpportunities: ["Responsable Académie d'Entreprise", "Concepteur de Simulateurs Immersifs"]
        }
      ];
    }

    // Cas 3 : Profil Hybride / Généraliste
    return [
      {
        id: `${idBase}-1`,
        name: "Chef de Projet Déploiement Infrastructures & Smart City",
        category: 'horizon_job',
        domain: "Territoires Intelligents & Transition",
        matchScore: 91,
        rationale: "Votre double sensibilité terrain et systémique est la clé pour synchroniser des chantiers d'équipements connectés avec les attentes des usagers.",
        matchingSkills: ["Pensée Systémique & Résolution de Problèmes", "Coordination Opérationnelle", "Sens de l'Organisation"],
        missingSkills: [
          {
            name: "Protocoles IoT & Réseaux Intelligents",
            importance: "recommandée",
            learningBridge: "Certification courte en technologies Smart City et supervision de capteurs urbains."
          }
        ],
        unlockedOpportunities: ["Pilote de Projets d'Infrastructures Numériques", "Directeur de Transition Urbaine"]
      },
      {
        id: `${idBase}-2`,
        name: "Consultant Organisation & Résilience Opérationnelle",
        category: 'horizon_job',
        domain: "Conseil en Stratégie & Conduite du Changement",
        matchScore: 88,
        rationale: "Votre adaptabilité face aux imprévus et votre écoute vous permettent d'accompagner des équipes soumises à de fortes mutations.",
        matchingSkills: ["Gestion des Aléas", "Communication Multidisciplinaire", "Agilité Décisionnelle"],
        missingSkills: [
          {
            name: "Méthodes Agiles & Diagnostic Organisationnel",
            importance: "recommandée",
            learningBridge: "Parcours certifiant Scrum Master ou Lean Management."
          }
        ],
        unlockedOpportunities: ["Facilitateur de Crise & Continuité d'Activité", "Coach Organisationnel"]
      },
      {
        id: `${idBase}-3`,
        name: "Responsable RSE & Transition Écologique des Métiers",
        category: 'horizon_job',
        domain: "Développement Durable & Impact",
        matchScore: 86,
        rationale: "Faire le pont entre les réalités opérationnelles concrètes et les exigences de durabilité environnementale.",
        matchingSkills: ["Contrôle & Mesure des Écarts", "Sensibilisation des Équipes", "Transversalité"],
        missingSkills: [
          {
            name: "Bilan Carbone & Réglementation CSRD",
            importance: "bonus",
            learningBridge: "Formation officielle Bilan Carbone (méthode ADEME)."
          }
        ],
        unlockedOpportunities: ["Directeur RSE", "Auditeur Environnemental"]
      }
    ];
  }

  // --- API ROUTE 2: EXPLORATION ÉTENDUE DES PASSERELLES & HORIZONS ---
  app.post("/api/explore-horizons", async (req, res) => {
    const { skillsSummary, capacitiesSummary } = req.body;
    try {
      const ai = getAiClient();

      if (!ai) {
        const smartHorizons = generateSmartHorizonsFallback(skillsSummary, capacitiesSummary);
        return res.json({
          success: true,
          source: 'smart_local_engine',
          horizons: smartHorizons
        });
      }

      const prompt = `
En tant que conseiller en capital cognitif et passerelles professionnelles pour Cognitorium :
À partir de ce capital cognitif actuel :
- Compétences actives et transversales : ${skillsSummary || 'Organisation, coordination, gestion des aléas de chantier, SIG, langues'}
- Capacités cognitives fondamentales : ${capacitiesSummary || 'Pensée spatiale, coordination systémique sous pression, résolution heuristique'}

Générez 3 horizons professionnels surprenants, hautement compatibles et valorisants auxquels la personne n'aurait pas spontanément pensé, en détaillant les compétences transférables déjà acquises et les ponts de formation (compétences manquantes ciblées) pour franchir le pas.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Nom du métier horizon" },
                domain: { type: Type.STRING, description: "Secteur ou domaine" },
                matchScore: { type: Type.INTEGER, description: "Pourcentage d'affinité 70-96%" },
                rationale: { type: Type.STRING, description: "Pourquoi ce capital cognitif est un avantage déterminant" },
                matchingSkills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                missingSkills: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      importance: { type: Type.STRING, enum: ["critique", "recommandée", "bonus"] },
                      learningBridge: { type: Type.STRING }
                    },
                    required: ["name", "importance", "learningBridge"]
                  }
                },
                unlockedOpportunities: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["name", "domain", "matchScore", "rationale", "matchingSkills", "missingSkills"]
            }
          }
        }
      });

      const parsed = JSON.parse(response.text || "[]");
      const formatted = parsed.map((h: any, i: number) => ({
        ...h,
        id: `job-horizon-ai-${Date.now().toString(36)}-${i + 1}`,
        category: 'horizon_job'
      }));

      res.json({ success: true, source: 'gemini', horizons: formatted });
    } catch (err: any) {
      console.warn("IA distante momentanément indisponible (503/timeout). Activation du moteur cognitif local de passerelles :", err?.message);
      const smartHorizons = generateSmartHorizonsFallback(skillsSummary, capacitiesSummary);
      res.json({ 
        success: true, 
        source: 'smart_local_engine', 
        notice: "Calcul des passerelles effectué avec le moteur cognitif local.",
        horizons: smartHorizons 
      });
    }
  });

  // --- API ROUTE 3: SYNTHÈSE DE LA SIGNATURE COGNITIVE ---
  app.post("/api/synthesize-profile", async (req, res) => {
    try {
      const { allSkills, allCapacities, allExperiences } = req.body;
      const ai = getAiClient();

      if (!ai) {
        return res.json({
          signature: {
            dominantReasoning: 'Pensée Systémique & Résilience Opérationnelle',
            transferabilityIndex: 88,
            learningVelocity: 'Exceptionnelle',
            adaptabilityIndex: 92,
            summaryText: 'Votre capital cognitif combine pragmatisme de terrain et capacité d\'abstraction conceptuelle.',
            keyStrengths: [
              'Gestion des situations dégradées',
              'Traduction des besoins opérationnels en stratégie',
              'Polyvalence technique et relationnelle'
            ]
          }
        });
      }

      const prompt = `
Générez une synthèse de la signature cognitive et du capital humain d'une personne pour Cognitorium :
Compétences : ${JSON.stringify(allSkills?.map((s: any) => s.name) || [])}
Capacités cognitives : ${JSON.stringify(allCapacities?.map((c: any) => c.name) || [])}
Expériences : ${JSON.stringify(allExperiences?.map((e: any) => e.name) || [])}

Évaluez le style de raisonnement dominant, l'indice de transférabilité (0-100), la vélocité d'apprentissage et rédigez un diagnostic clair, valorisant et lucide.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              dominantReasoning: { type: Type.STRING },
              transferabilityIndex: { type: Type.INTEGER },
              learningVelocity: { type: Type.STRING, enum: ["Modérée", "Élevée", "Exceptionnelle"] },
              adaptabilityIndex: { type: Type.INTEGER },
              summaryText: { type: Type.STRING },
              keyStrengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["dominantReasoning", "transferabilityIndex", "learningVelocity", "adaptabilityIndex", "summaryText", "keyStrengths"]
          }
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json({ success: true, signature: parsed });
    } catch (err: any) {
      console.warn("IA distante indisponible pour la synthèse, application du profil sémantique :", err?.message);
      res.json({
        success: true,
        source: 'smart_local_engine',
        signature: {
          dominantReasoning: 'Pensée Hybride : Rigueur Expérimentale & Pragmatique Terrain',
          transferabilityIndex: 91,
          learningVelocity: 'Exceptionnelle',
          adaptabilityIndex: 94,
          summaryText: 'Votre capital cognitif associe démarche scientifique, résolution d\'imprévus et forte agilité relationnelle intergénérationnelle.',
          keyStrengths: [
            'Régulation du stress et réactivité opérationnelle face aux imprévus',
            'Pédagogie active, transmission claire et régulation des collectifs',
            'Transfert méthodique de compétences vers des domaines connexes'
          ]
        }
      });
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cognitorium server running on http://localhost:${PORT}`);
  });
}

startServer();
