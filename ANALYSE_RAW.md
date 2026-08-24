# Analyse complète du dossier `raw/`

**Date de l'analyse :** 24 août 2026
**Contenu analysé :** 337 fichiers du dossier `raw/` + code applicatif (`src/`, `server.ts`)
**Objet :** Inventorier, catégoriser et extraire la substantifique moelle de toutes les maquettes, prototypes, documentations, référentiels et données brutes du projet.

---

## 1. Vue d'ensemble — ce que contient `raw/`

| Type | Nombre | Rôle |
|---|---|---|
| PDF — fiches ROME | **271** | Fiches emploi officielles France Travail (juin 2026) |
| HTML — prototypes & maquettes | **30** | ~12 générations de maquettes interactives |
| XLSX — référentiels & données | **11** | Données ROME, Formacode, planning, fiches taguées |
| DOCX — cahiers des charges & docs de référence | **5** | Documents fondateurs du projet |
| MD — manifeste, persona, synthèses | **5** | Documents de vision et de spécification |
| JSON — paramétrage, profils de test, identifiants | **3** | Source de vérité config + tests |
| ZIP — données ROME brutes | **2** | CSV et XML officiels France Travail |
| TXT — arborescence produit, export texte | **2** | Structure produit finale vs MVP |
| SQL — schéma de base de données | **1** | DDL SQLite complet (12 tables) |
| PNG — diagramme UML | **1** | Schéma entité-association |
| PDF — documents annexes | **5** | CV, résultats PRIOS, référentiels Licence Psycho, guide Licence |

**Volume total : ~45 Mo.**

> ⚠️ Le dossier contient **deux projets imbriqués sous deux noms proches** :
> - **Cognitorium** (avec « o ») : la plateforme individuelle de pilotage des compétences / navigation professionnelle — c'est **le projet principal**, celui du MVP et du code actuel.
> - **Cognitarium** (avec « a ») : la vision long terme — jumeau cognitif (« Digital Human Twin »), déclinaisons scolaire / territoire / entreprise. C'est la marque utilisée sur les prototypes HTML et le manifeste.

---

## 2. Le projet en une page

**Cognitorium** est une application de **représentation dynamique et d'audit du capital cognitif** d'une personne :

1. Elle construit un profil évolutif (parcours scolaire, expériences, formations, projets, événements personnels).
2. Elle **extrait des compétences** à partir des textes saisis (extraction déterministe par règles/règles + regex en MVP).
3. Chaque compétence a : un **niveau historique**, un **niveau actuel** (qui décroît selon un **Decay Engine** exponentiel), un **potentiel de récupération**, une **confiance** (fonction des preuves), et des **preuves** (diplôme, projet, expérience, attestation, auto-évaluation).
4. Elle compare le profil aux **fiches ROME** (référentiel France Travail local, hors ligne) et produit des **recommandations de métiers** explicables : *Disponible maintenant / Formation rapide / Formation longue / Éloigné*.
5. Elle permet de **construire plusieurs projets professionnels en parallèle** avec étapes, compétences manquantes et formations.
6. Elle visualise tout sous forme de **graphe de connaissances** (NetworkX en calcul, QGraphicsView/PySide6 en desktop), **timeline** et **dashboard**.
7. Elle intègre un **questionnaire de biais cognitifs** (10 biais, échelle de Likert 7 points).
8. Elle génère des **CV** (3 modèles : Classique, Moderne, ATS) exportables en PDF.
9. **Positionnement unique : individuel, continu, hors ligne, gratuit et explicable** — créneau vacant par rapport aux acteurs centrés entreprise (Bridge, Eightfold) ou ponctuels (bilan de compétences, MyPass, Neobrain).

**Cible prioritaire :** adulte en recherche d'emploi (extension : étudiants, salariés, reconversion).

**Marché adressable cité :** 12 Md€ formation pro en France, 2,5 M demandeurs d'emploi + reconversions/an.

---

## 3. Les documents fondateurs (5 DOCX + 3 synthèses)

### 3.1 Hiérarchie des documents

| Fichier | Nature | Statut |
|---|---|---|
| `Cognitorium_document_reference_v1.docx` | Document fondateur : vision, variantes, architecture, feuille de route | v1.0 — 07/08/2026 |
| `Cognitorium_Document_Reference_v1.2.docx` | **Version maîtresse** : décisions validées + état de l'art + spécifications complétées | v1.2 — 07/08/2026 |
| `Cahier_des_charges_Cognitorium_MVP.docx` | CDC fonctionnel/technique du **MVP Windows** | v1.0 — 07/08/2026 |
| `Cahier_des_charges_complet_Cognitorium_Produit_final_et_MVP.docx` | CDC complet (22 sections) : produit final **et** MVP | v1.0 — 07/08/2026 |
| `Cognitorium_Projet_individuel_Specification_finale_et_MVP.docx` | Cadrage consolidé, décisions, points restants | 07/08/2026 |
| `deepseek_markdown_20260807_a21eef.md` + `deepseek_word_20260807_d19dec.txt` | Synthèse « document de référence unique » (générée via DeepSeek) | 07/08/2026 |
| `arborescence cognitorium final vs mvp.txt` | **Arborescence produit complète** (17 blocs final / 17 blocs MVP) | — |

### 3.2 Les 12 décisions définitives (validées le 07/08/2026)

1. **ROME** : fichier CSV officiel France Travail, colonnes conservées (code, intitulé, savoirs, savoir-faire, savoir-être, activités, contextes, accès, passerelles), versionnage des imports.
2. **Scoring** : `Score = Niveau_estimé × Confiance`. Poids : auto-éval 0,3 · diplôme 0,9 · projet 0,8 · exp. pro 0,7 · attestation 0,6. Sans preuve : confiance 0,2 et niveau plafonné à 40. **Formule affichée dans l'UI**.
3. **Decay Engine** : courbe exponentielle, λ technique 0,12/an · transversal 0,06/an · langue 0,08/an, constantes configurables.
4. **Biais cognitifs** : 10 biais, Likert 7 points, affichage score + niveau + confiance + explication + stratégie.
5. **Graphes** : NetworkX (calcul) + PySide6/QGraphicsView (affichage), profondeur par défaut 2, max 5.
6. **CV** : 3 modèles (Classique, Moderne, ATS = texte brut, sans colonnes, Arial/Calibri), export PDF.
7. **Sauvegardes** : 5 auto + manuelles, restauration `.cognitorium_backup` (ZIP SQLite + métadonnées).
8. **Sécurité** : MVP sans chiffrement → final SQLCipher.
9. **Tests** : 4 profils synthétiques, couverture d'acceptation 90 % des cas métier.
10. **Distribution** : 100 % gratuite, PyInstaller + Inno Setup, auto-signature.
11. **Marché** : INSEE/APEC statique en MVP → API France Travail en final.
12. **Terminologie** : usage exclusif du terme ATS (Applicant Tracking System).

### 3.3 Feuille de route MVP (MVP-0 → MVP-6)

| Phase | Contenu |
|---|---|
| MVP-0 | Comptes locaux + SQLite + sauvegarde auto + fenêtre principale |
| MVP-1 | Onboarding (12 étapes) + saisie parcours/formations + extraction déterministe + validation |
| MVP-2 | Preuves & decay + scoring (Niveau × Confiance) |
| MVP-3 | Import ROME + moteur de recommandation (gaps, métiers accessibles) |
| MVP-4 | Multi-projets + étapes + recommandations formations |
| MVP-5 | Dashboard + graphes + biais (Likert 7) |
| MVP-6 | Éditeur CV (3 modèles) + export PDF + installateur Inno Setup |

**V2** : IA locale légère, imports enrichis, RNCP/RS · **V3** : tests cognitifs, simulations, mobile · **V4** : collaboration, versions scolaire/territoire.

### 3.4 Périmètre MVP (tableau « périmètre réel » du CDC complet)

Windows 🇫🇷, multi-comptes locaux, onboarding obligatoire, saisie manuelle, extraction déterministe + validation, score 0-100 + confiance, decay, questionnaire biais exploratoire (pas de tests cognitifs), **toute la base ROME locale**, recommandations de formation basiques, plusieurs projets, 3 visualisations (arborescence, réseau, temporel), CV manuel/ciblé/ATS/PDF, sauvegarde auto+manuelle, **pas de réseau, pas d'API**, IA = règles déterministes.

### 3.5 Architecture technique retenue (pour le MVP desktop)

- **Python 3.10+**, **PySide6 (Qt)**, **SQLite** (WAL, FK activées), **NetworkX**, ReportLab (fallback fpdf2), PyInstaller + Inno Setup.
- Architecture en couches : UI → domaine → services → données → graphes.
- Onboarding = **QWizard 12 étapes** bloquant le dashboard.
- Pas de popups bloquants : édition par **sidebar** ; toasts 3 s ; responsive ≥ 1024×600.

---

## 4. Modèle de données (`01_cognitorium_schema_ddl.sql`)

DDL SQLite v1.0 (7 août 2026) — **12 tables + 2 triggers + 2 vues** :

| # | Table | Rôle clé |
|---|---|---|
| 1 | `users` | Comptes locaux, config_json de surcharge |
| 2 | `competence` | Référentiel interne **unique** (name UNIQUE), famille technique/transversal/langue, `rome_codes` JSON |
| 3 | `competence_context` | **Une compétence = N contextes** (ex. Python × Dev web / Data Analyst) ; statuts `detectee → proposee → acceptee → validee → refusee → archivee` ; niveau_historique, niveau_actuel, confiance, potentiel_recup, fréquences |
| 4 | `preuve` | Types `diplome/projet/exp/attest/auto`, niveau 0-100, poids, date obligatoire |
| 5 | `parcours_event` | Timeline : formation, expérience, certification, projet personnel, volontariat + `raw_text` pour extraction |
| 6 | `formation` | Enrichissement : niveau RNCP, ECTS, certifiante |
| 7 | `projet` | Projets multiples, ROME cible, statuts |
| 8 | `projet_etape` | Étapes ordonnées, types d'action, compétences cibles |
| 9 | `recommandation` | Matching ROME : score 0-1, catégorie (disponible / formation_rapide / formation_longue / eloigne), raisonnement texte, compétences manquantes, formations suggérées |
| 10 | `biais_scores` | 10 biais (Likert 1-7) + score_global |
| 11 | `rome_import` / `rome_fiche` | **Versionnage des imports ROME** (hash SHA-256, version active) |
| 12 | `backups_meta`, `app_logs` | Sauvegardes et logs JSON Lines (rotation 10 Mo × 5) |

**Triggers :** suppression de toutes les preuves → confiance replafonnée à 0,2 et niveau ≤ 40, statut `validee` → `acceptee` ; ajout d'une preuve → `detectee/proposee` → `acceptee`.

**Vues :** `v_profil_competences` (profil complet + nb preuves) et `v_rome_actif` (fiche de la version ROME active).

Ce schéma est **cohérent à 100 %** avec les 12 décisions du document de référence (colonnes ROME, poids, statuts, versionnage).

---

## 5. Paramétrage métier (`02_cognitorium_parametrage.json`)

Fichier déclaré **« source de vérité — tout hardcodage interdit »** (v1.0, applicable MVP-0 à MVP-6). Points structurants :

- **Scoring** : moyenne pondérée `Σ(niveau_i × poids_i) / Σ(poids_i)`, arrondi 1 décimale, exemple chiffré (Diplôme 80×0.9 + Auto 90×0.3 = **82.5**).
- **Decay** : `Niveau_actuel = Niveau_historique × exp(-λ × Δt)`, Δt en années avec précision jour ; λ famille : 0,12 / 0,06 / 0,08 ; déclencheurs : ouverture appli, modification profil, consultation compétence, timer background. Rappels si `niveau_actuel < niveau_historique × 0.8` ET objectif actif.
- **Matching ROME** : TF-IDF + cosinus sur `competences.name`, `contexte_nom`, `parcours_event.raw_text` vs `competences_savoirs` + `competences_savoir_faire` des fiches. Seuils : ≥0,75 disponible 🟢 · 0,5-0,75 formation rapide 🔵 · 0,25-0,5 formation longue 🟠 · <0,25 éloigné 🟣.
- **Biais cognitifs** : les **10 formulations exactes** des questions sont fournies (confirmation, ancrage, excès de confiance, statu quo, aversion à la perte, effet de halo, disponibilité, rétrospectif, autorité, omission). Stratégie si score > 5.
- **Graphes** : couleurs/formes par type de nœud (compétence 🟢 cercle, projet 🔵 carré, métier ROME 🟣 hexagone, formation 🟠 triangle, expérience 🔴 diamant, objectif 🟢 étoile — le JSON note un doublon 🟢 pour compétence et objectif).
- **CV** : spécifications ATS précises (sections obligatoires : Contact, Professional Summary, Skills, Work Experience, Education, References ; dates MM/AAAA ; sans colonnes/tableaux/images).
- **Sauvegardes** : `%APPDATA%/Cognitorium/Backups/`, format `.cognitorium_backup`, déclencheurs (fermeture propre, validation importante, inactivité 30 min).
- **Sécurité** : MVP sans chiffrement, final SQLCipher ; **logs** JSON Lines, rotation 10 Mo × 5.
- **Extraction compétences** : MVP déterministe (règles + regex/PhraseMatcher), lexique mots-clés, mapping ROME manuel extensible ; **v2 : Random Forest / TF-IDF**.
- **UI/UX** : onboarding QWizard 12 étapes bloquant, timeline cliquable → sidebar, clic nœud → sidebar.

---

## 6. Mockups (`03_cognitorium_mockups.md`)

**6 écrans** en ASCII, conventions graphiques complètes (fond `#F5F6FA`, sidebar 320 px, header 56 px, boutons `#3498DB`, badges 🟢🟢🟠🟣, alerte rouge `#E74C3C`) :

1. **Onboarding** — QWizard 12 étapes avec barre de progression 12 segments (étapes détaillées : compte local → profil → formations → expériences → projets/bénévolat → auto-éval → validation des extractions → objectifs ROME → langues → biais → import ROME → récap).
2. **Dashboard** — 3 colonnes (Compétences / Projets actifs / Recommandations) + timeline cliquable en bas.
3. **Vue Compétence** — liste maître + sidebar détail (scoring avec formule en toutes lettres, decay, preuves, étoiles de confiance, badge « ⚠️ En déclin » si actuel < historique × 0,8).
4. **Graphe** — canvas plein écran, profondeur 1-5, légende, glisser-déposer, double-clic → Vue Compétence.
5. **Éditeur CV** — split gauche/droite, 3 modèles par onglets, ciblage métier avec surlignage vert des compétences alignées.
6. **Timeline/Parcoours** — ligne temporelle + sidebar d'édition, coche/décoche des compétences extraites.

**Règles transverses :** pas de popups modaux (sauf actions destructrices), états vides illustrés, toasts 3 s, WCAG AA, responsive ≥ 1024×600.

---

## 7. Profils de test (`04_cognitorium_test_profiles.json`)

**4 profils synthétiques** conformes aux décisions (imports complets JSON) :

| # | Profil | Contenu |
|---|---|---|
| 0 | **Jeune diplômé** (Master 2025, 1 an d'alternance) | 3 événements parcours, 7 compétences, 9 preuves, 1 projet, biais |
| 1 | **Reconversion** (15 ans vente → développement web) | 3 événements, 8 compétences, 9 preuves, **2 projets**, biais |
| 2 | **Expert** (12 ans d'expérience, compétences en déclin technique) | 5 événements, 9 compétences, 11 preuves, 1 projet, biais |
| 3 | **Sans expérience** (étudiant en fin de cursus) | 2 événements, 6 compétences, 6 preuves, 1 projet, biais |

Chaque profil a la structure exacte d'import : `_meta` (profil_id, label, description, date_reference), `user`, `parcours_events`, `competences`, `competence_contexts`, `preuves`, `projets`, `biais_scores` — prêt à être chargé par un moteur de test de couverture 90 %.

---

## 8. Référentiels & données ROME (XLSX, PDF, ZIP)

### 8.1 Fiches ROME PDF — **271 fiches**, couverture partielle du référentiel

Répartition par domaine :
- **A** (Agriculture, espaces verts, soins aux animaux) : **68 fiches** (A11-A14)
- **H** (Hôtellerie-restauration, tourisme, loisirs) : **33 fiches** (H2, H3)
- **K** (Social, soins) : **28 fiches** (K18, K19)
- **M** (Communication, information, art, management, tertiaire) : **41 fiches** (M18)
- **N** (Économie, ressources humaines, vente, services) : **101 fiches** (N1-N4)

Chaque PDF est la **fiche emploi officielle France Travail juin 2026** : code, intitulé, autres emplois, RIASEC, activités, savoir-faire (dont Transition écologique), savoirs, savoir-être, accès, passerelles. **La couverture est partielle** (focalisée sur les domaines A/H/K/M/N — pas de B, C, D, E, F, G, I, J, L).

### 8.2 Fiches taguées XLSX — `250528-fiches-rome-26m06-tag-pour-diffusion.xlsx`

**1 911 fiches ROME** avec tags : Transition Écologique (Emploi Vert / Emploi Blanc / stratégique), Transition Numérique, Transition Démographique, Emploi cadre ?, Emploi réglementé ? — c'est **le fichier de référence pour le matching et les recommandations**.

### 8.3 Autres référentiels XLSX (juin 2026, version ROME 26M06 / V61)

| Fichier | Contenu |
|---|---|
| `260609-ref-formacode...xlsx` | **Mapping ROME 26M06 → FORMACODE V14** : 5 997 lignes (code ROME, libellé, OGR, code + libellé Formacode) + 7 031 lignes ROME-Certif-Formacode |
| `260611-arborescence-simplifiee-des-competences.xlsx` | **Arborescence simplifiée des compétences** : 507 macro-compétences × 19 463 compétences, avec liste des fiches ROME mobilisant chaque objet |
| `rome-arborescence-des-competences-juin-2026.xlsx` | Arborescence complète : 508 macro + **19 480 compétences** |
| `ROME Arborescence Principale 24M06.xlsx` | Arborescence principale (12 257 lignes) — version 2024 |
| `rome-arborescence-des-savoirs-juin-2026.xlsx` | 15 628 savoirs |
| `rome-arborescence-des-centres-d-interet-juin-2026.xlsx` | 5 694 centres d'intérêt |
| `rome-arborescence-des-secteurs-d-activite-juin-2026.xlsx` | 3 221 secteurs d'activité |
| `rome-arborescence-des-secteurs-naf-juin-2026.xlsx` | 3 781 secteurs NAF |
| `rome-arborescence-des-contextes-de-travail-juin-2026.xlsx` | 192 contextes de travail |

### 8.4 Zips de données brutes France Travail (version V461, 12/06/2026)

- **`RefRomeCsv.zip`** : 13 CSV UTF-8 (arborescences, fiches emploi, référentiel appellations, code ROME, cohérence item, composition bloc, etc.)
- **`RefRomeXml.zip`** : les mêmes en XML ISO-8859-15, dont `unix_fiche_emploi_metier_v461` (**29,5 Mo** — fiches emploi complètes).

> **Le référentiel ROME est donc quadruplé** : PDF (271 fiches ciblées), XLSX tagués (1 911 fiches), arborescences XLSX (compétences/savoirs/intérêts/secteurs), ZIP CSV/XML officiels. Pour l'import MVP, le fichier le plus opérationnel est le XLSX « fiches ROME tag pour diffusion » (toutes les colonnes décidées + tags transition).

---

## 9. Prototypes HTML — l'évolution en 30 fichiers

Les 30 HTML couvrent **~12 générations** de maquettes. Chronologie reconstituée :

1. **Graphes isolés (v0)** : `cognitarium_graph.html`, `cognitarium_skill_graph.html`, `Skill Tree Cognitif v0.html`, `gemini-code-1782773891281.html` (Hyper-Cognition Skill Tree 2D/3D/4D) — premiers tests de visualisation de graphes.
2. **Storyboard** : `cognitarium_storyboard_complet.html` (14 écrans onboarding) — origine du QWizard 12 étapes.
3. **Jumeau Cognitif de « Miguelangelo Da Costa »** (concept) : `cognitarium version 0.1.html`, `Cognitarium — Jumeau Cognitif de Miguelangelo Da Costa.html`, `Cognitarium_v2.html`, `cognitarium v0.2.html`, `cognitarium v0.3.html` / `v0.3.1.html` / `v0.3.1.1..html` — interface sombre « jumeau cognitif » : import CV simulé, extraction de 45 compétences, score global 85/100, graphe de compétences. `cognitarium v0.3 john.html` = variante persona « John ».
4. **Digital Human Twin** : `digital_human_twin.html`, `deepseek_html_20260628_243cb1.html`, `v1+.html`, `Digital Human Twin — Career Intelligence.html` — version « Intelligence de carrière » : création d'avatar en 5 étapes, parcours Élève / Enseignant / Adulte.
5. **Cognitarium Atlas** : `cognitarium_atlas_v2.html`, `cognitarium_atlas_v3.html`, `cognitarium_atlas_v3 (1).html` — navigation Terre → France → Paris → BTP/Tech.
6. **Prototypes complets** : `cognitarium_prototype.html`, `cognitarium_prototype (1).html`, `cognitarium_prototype_v2.html` (Storyboard Interactif).
7. **Chaîne de valeur des compétences** : `competences_app.html`, `competences_app (1).html` — graphe Métier → Mission → Tâche → Compétence → Capacité humaine (identique au modèle `types.ts` actuel !).
8. **Cognitorium « Cognitive Constellation »** : `cognitorium_demo.html`, `cognitorium_demo_v2.html` — dashboard sombre style HUD/canvas, ancêtre direct de l'app React actuelle.
9. **Variant Scolaire** : `cognitarium_scolaire.html`, `cognitarium_scolaire_v2.html` — jumeau de « Léa » (élève).
10. **Carte conceptuelle** : `carte_conceptuelle_interactive.html` — « Neuro-Cognitive Knowledge Graph v3.2 » (connectome, predictive coding…).

**Constante à travers toutes les générations :** graphe de nœuds colorés par type, sidebar d'inspection, notion de niveau/confiance, score global, extraction automatique simulée depuis le CV.

---

## 10. Annexes & personas

- **`MANIFESTE_Cognitarium.md`** : manifeste fondateur (28/07/2026) — la vision « Système d'Exploitation du Réel » à l'échelle d'une ville (Frontignan) : 5 moteurs (Space, Knowledge, Simulation, Deliberation, Metacognition), boîtes noires civiques, Indice de Liberté Territoriale, anti-optimisation totale. **C'est la boussole philosophique du produit long terme**, pas la spec du MVP.
- **`cognitarium v0.1 persona kid.md`** : persona scolaire « Léa » (élève de 5ᵉ) — justification du variant scolaire, mission/vision, jumeau cognitif de parcours scolaire.
- **`Cognitarium_Planning.xlsx`** : planning produit (33 tâches, 141 h, 6 phases) + dashboard indicateurs + chemin critique + risques (scope creep 🔴, complexité graphe 🟡, données BTP 🟡, polish 🔴) + référentiel métier BTP (Conducteur de travaux → Chef de projet → Directeur travaux).
- **`Säthan cab Principles Journal.pdf` / `Säthan cab Results.pdf`** : résultats PRIOS (profil « The Coach » / Growth Seeker / Quiet Leader) — évaluation de l'utilisateur lui-même (Näthan Cabrol).
- **`cv 2024 (1).pdf`** : CV réel de Näthan Cabrol (Conducteur de travaux TP, AFPA Palays, SST & AIPR, Université Paul Valéry — **source du profil principal de l'app**).
- **`ref_activite_competences_evaluation_Licence Psychologie.pdf` / `…23.pdf`** : référentiels RNCP officiels Licence Psychologie (activités, compétences, évaluation) — utilisés comme **modèle de structure « compétences ↔ évaluation »** pour le référentiel interne.
- **`identifiants_cognitorium…json`** : identifiant client + clé secrète (⚠️ **fichier sensible — à ne jamais committer/publier** ; l'`.env.example` du repo n'attend qu'une `GEMINI_API_KEY`).
- **`fiche rome`** : fichier vide (1 octet) — trace de manipulation.

---

## 11. Le code actuel (`src/`, `server.ts`) face aux specs

L'application livrée dans le repo est un **prototype web React + Vite + Tailwind** (pas encore l'app desktop Python/PySide6 des cahiers des charges) :

| Aspect | Specs (raw/) | Code actuel |
|---|---|---|
| **Plateforme** | Desktop Windows (PySide6, PyInstaller) | **Web React 19 + Vite + Express + Gemini API** (métadonnées `metadata.json` : `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`) |
| **Stockage** | SQLite locale, 12 tables, versionnage ROME | `localStorage` (clé `cognitorium_active_profile_v5_graph_levels`) + profils statiques TS |
| **Données ROME** | Fichier CSV officiel, import versionné | Pas d'import ROME réel ; codes ROME en dur dans les profils (M1402, K2102, M1508, M1805, H1523…) |
| **Modèle** | `competence` unique + `competence_context` + `preuves` | Modèle par **catégories** : experience, formation, research_project, task, skill_*, capacity_cognitive, knowledge, horizon_job — plus riche, mais **sans la séparation contexte/preuves du SQL** |
| **Decay** | `Niveau_actuel = Niveau_historique × exp(-λ×Δt)`, λ par famille, plancher non spécifié | `calculateSkillVitality` : **modèle à demi-vie + plancher 35 % mémoire cristallisée**, seuils 80/55 pour disponibilité (implémentation différente mais compatible d'esprit) |
| **Scoring** | Niveau × Confiance, poids par type de preuve | `confidenceScore` 0-100 + statuts `verified/pending/inferred/rejected` ; **pas de moyenne pondérée par preuves** |
| **Biais cognitifs** | Questionnaire 10 biais Likert 7 | Module `CognitiveSignature` (RIASEC + match métiers + signature) — **pas le questionnaire 10 biais** |
| **Graphe** | NetworkX + QGraphicsView, profondeur 1-5 | `NetworkGraph` custom (force-directed), 5 niveaux « Expérience → Tâche → Compétence → Cognition → Métier » ✅ |
| **CV** | 3 modèles + PDF (ReportLab) | Non implémenté |
| **Sauvegardes** | 5 auto + manuelles, `.cognitorium_backup` | Non implémenté (localStorage) |
| **Onboarding** | QWizard 12 étapes bloquant | `OnboardingModal` : sélecteur de profil (3 presets) + création custom |
| **IA** | Règles déterministes en MVP | **`/api/distill-experience`** (Gemini si clé, sinon heuristique locale) : distille une expérience → compétences + capacités + métiers potentiels |
| **Profils** | 4 profils de test JSON | 3 profils TS : **Näthan Cabrol** (sciences cognitives + VRD/génie civil — cohérent avec le CV + PRIOS du raw), **Léa Martin** (Master Data Science), **Thomas Valadier** (reconversion BTP→transition écologique) |

**Vue actuelles implémentées :** Dashboard, Graphe réseau, Arbre, Tableau, Horizons ROME (avec `missingSkills`, `learningBridge`, `TrainingPathway`), Decay/Timeline (curseur d'année de simulation), Signature Cognitive (RIASEC, passeport).

---

## 12. Synthèse & observations

### 12.1 Ce qui est cohérent et verrouillé
- ✅ La vision, le positionnement (individuel/continu/hors-ligne/explicable) et la cible.
- ✅ Les 12 décisions définitives du 07/08/2026 (scoring, decay, biais, ROME, CV, sauvegardes…).
- ✅ Le schéma SQLite et le paramétrage JSON sont **alignés entre eux** et avec les CDC.
- ✅ Les 4 profils de test JSON sont prêts pour l'automatisation des tests (couverture 90 %).
- ✅ Le référentiel ROME juin 2026 est disponible sous 4 formats (fiches PDF ciblées, XLSX tagué 1 911 fiches, arborescences, ZIP officiels).

### 12.2 Écarts / tensions à connaître
1. **Deux noms** : `Cognitorium` (produit MVP, docs) vs `Cognitarium` (prototypes HTML, manifeste, planning). À unifier officiellement.
2. **Desktop vs Web** : tous les CDC décrivent une app **Python/PySide6/SQLite Windows**, mais le code livré est un **prototype web React** orienté démo/Gemini. Les deux sont complémentaires (le web = maquette interactive haute-fidélité, le desktop = cible MVP), mais il faut trancher ce qui est la base de production.
3. **Le modèle de données du web** (catégories de nœuds) ne correspond pas 1:1 au SQL (compétence/contexte/preuves). Le web est orienté « graphe de connaissances », le SQL orienté « base transactionnelle ».
4. **Implémentation du decay différente** : demi-vie + plancher 35 % (web) vs λ exponentiel sans plancher documenté (spec). Les deux sont défendables, mais il faut une **source de vérité unique** (le JSON de paramétrage l'exige).
5. **Le questionnaire des 10 biais** (formulations exactes fournies) n'est pas encore dans l'app web.
6. **Le fichier `identifiants_cognitorium…json`** contient des secrets en clair → le garder hors versionnage (le `.gitignore` ne couvre que `.env*`).
7. **Les 271 fiches PDF sont partielles** (A/H/K/M/N seulement) — pour un matching complet, utiliser le XLSX des 1 911 fiches ou les ZIP officiels.

### 12.3 Prochaines étapes naturelles (si on passe à l'action)
1. **Décider de la cible de production** : poursuivre le prototype web (React + SQLite côté serveur + import ROME réel) ou migrer vers le desktop Python spécifié.
2. **Brancher les vraies données ROME** : importer `250528-fiches-rome…xlsx` (1 911 fiches + tags transitions) avec versionnage (table `rome_import`/`rome_fiche`).
3. **Implémenter le scoring par preuves** (poids 0,3-0,9, plafond 40 sans preuve, formule affichée) et **unifier le decay** sur le paramétrage JSON.
4. **Ajouter le questionnaire des 10 biais** avec les formulations exactes du JSON.
5. **Charger les 4 profils de test JSON** pour valider la couverture 90 %.
6. **Éditeur CV 3 modèles + export PDF** (dernier jalon MVP-6).
7. **Nettoyer le dossier `raw/`** : déplacer les secrets, vider `fiche rome`, organiser en sous-dossiers (docs/, referentiels/, prototypes/), archiver les vieilles générations HTML.

---

*Document d'analyse généré à partir du contenu de `raw/` et du code source courant. Toutes les citations chiffrées (poids, λ, seuils, étapes onboarding, couleurs UI) proviennent directement des fichiers analysés.*
