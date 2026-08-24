import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

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

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // --- API ROUTE 1: DISTILLATION D'UNE EXPÉRIENCE EN CAPITAL COGNITIF & RELATIONS ---
  app.post("/api/distill-experience", async (req, res) => {
    try {
      const { experienceText, currentProfileNodes } = req.body;
      if (!experienceText || typeof experienceText !== "string") {
        return res.status(400).json({ error: "Texte d'expérience requis." });
      }

      const ai = getAiClient();
      if (!ai) {
        // Mode heuristique intelligent hors-ligne
        const idBase = "exp-auto-" + Date.now().toString(36);
        const words = experienceText.slice(0, 40);
        return res.json({
          success: true,
          source: 'local_engine',
          distilled: {
            experience: {
              id: idBase,
              name: words + (experienceText.length > 40 ? '...' : ''),
              category: 'experience',
              period: '2024 - 2026',
              startYear: 2024,
              endYear: 2026,
              institutionOrContext: 'Contexte déduit de l\'expérience',
              role: 'Pratiquant / Acteur clé',
              description: experienceText,
              missions: ['Réalisation opérationnelle directe', 'Gestion des flux et des contraintes', 'Coordination et rendu'],
              cognitiveEfforts: ['Capacité d\'adaptation continue', 'Prise d\'initiative et priorisation']
            },
            skills: [
              {
                id: `skill-${idBase}-1`,
                name: 'Exécution & Pratique Opérationnelle',
                category: 'skill_tech',
                baseMastery: 85,
                acquiredYear: 2024,
                lastPracticedYear: 2026,
                halfLifeYears: 5,
                decayFactor: 0.1,
                subSkills: ['Méthode d\'exécution', 'Contrôle qualité'],
                transferabilityScore: 8,
                description: 'Compétence technique et méthodologique extraite du récit.'
              },
              {
                id: `skill-${idBase}-2`,
                name: 'Adaptabilité & Rigueur de Contexte',
                category: 'skill_transversal',
                baseMastery: 88,
                acquiredYear: 2024,
                lastPracticedYear: 2026,
                halfLifeYears: 8,
                decayFactor: 0.05,
                subSkills: ['Flexibilité', 'Rigueur d\'exécution'],
                transferabilityScore: 9,
                description: 'Compétence transversale transposable à d\'autres domaines.'
              }
            ],
            capacities: [
              {
                id: `cap-${idBase}-1`,
                name: 'Résolution Empirique & Adaptation',
                category: 'capacity_cognitive',
                level: 'avancé',
                cognitiveDimension: 'Adaptabilité & Imprévus',
                underlyingSkills: [`skill-${idBase}-1`, `skill-${idBase}-2`],
                description: 'Faculté cognitive à faire face à des contextes changeants.'
              }
            ],
            potentialJobs: [
              {
                id: `job-${idBase}-1`,
                name: 'Coordinateur / Spécialiste Projets Mixtes',
                category: 'horizon_job',
                domain: 'Gestion & Opérations',
                matchScore: 82,
                rationale: 'Parcours combinant sens du détail et exécution structurée.',
                matchingSkills: ['Exécution & Pratique Opérationnelle', 'Adaptabilité & Rigueur de Contexte'],
                matchingSkillIds: [`skill-${idBase}-1`, `skill-${idBase}-2`],
                missingSkills: [
                  {
                    name: 'Gouvernance Stratégique',
                    importance: 'recommandée',
                    learningBridge: 'Formation courte sur le pilotage budgétaire et stratégique.'
                  }
                ],
                unlockedOpportunities: ['Responsable de déploiement opérationnel']
              }
            ]
          }
        });
      }

      // Appel Gemini 3.7 Flash avec Structured Output
      const prompt = `
Vous êtes le moteur d'analyse cognitive de COGNITORIUM.
Votre mission est de déconstruire le récit d'une expérience (professionnelle, personnelle, associative, sportive ou académique) pour en extraire la structure profonde du capital humain :

1. L'Expérience globale structurée (missions, efforts cognitifs)
2. Les Compétences techniques & transversales concrètes associées (avec score de maîtrise 0-100, année d'acquisition, demi-vie cognitive d'oubli/decay en années, sous-compétences, score de transférabilité 1-10)
3. Les Capacités cognitives de haut niveau nourries par ces compétences (ex: raisonnement spatial, coordination systémique, résistance à l'incertitude)
4. Les Horizons & Métiers potentiels débloqués par ces compétences transférables (avec analyse de match, compétences acquises vs compétences manquantes et passerelle de formation/pont d'apprentissage).

Récit de l'expérience à analyser :
"""
${experienceText}
"""
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
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
      console.error("Erreur distillation experience:", err);
      res.status(500).json({ error: err.message || "Erreur lors de l'analyse IA." });
    }
  });

  // --- API ROUTE 2: EXPLORATION ÉTENDUE DES PASSERELLES & HORIZONS ---
  app.post("/api/explore-horizons", async (req, res) => {
    try {
      const { skillsSummary, capacitiesSummary } = req.body;
      const ai = getAiClient();

      if (!ai) {
        return res.json({
          success: true,
          source: 'local_engine',
          horizons: [
            {
              id: 'job-extra-1',
              name: 'Ingénieur d\'Intégration & Résilience des Systèmes',
              domain: 'Infrastructures & Systèmes Complexes',
              matchScore: 89,
              rationale: 'Votre agilité face aux imprévus et votre vision tridimensionnelle permettent de piloter des systèmes cyber-physiques.',
              matchingSkills: ['Gestion des Imprévus', 'Organisation & Ordonnancement', 'Pensée Spatiale'],
              missingSkills: [
                {
                  name: 'Cybersécurité Industrielle (OT)',
                  importance: 'recommandée',
                  learningBridge: 'Module certifiant de 30 heures sur les protocoles industriels sécurisés.'
                }
              ],
              unlockedOpportunities: ['Responsable de supervision opérationnelle', 'Architecte de résilience industrielle']
            }
          ]
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
        model: "gemini-3.7-flash",
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

      res.json({ success: true, horizons: formatted });
    } catch (err: any) {
      console.error("Erreur explore horizons:", err);
      res.status(500).json({ error: err.message || "Erreur de génération d'horizons." });
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
        model: "gemini-3.7-flash",
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
      console.error("Erreur signature cognitive:", err);
      res.status(500).json({ error: err.message || "Erreur de synthèse." });
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
