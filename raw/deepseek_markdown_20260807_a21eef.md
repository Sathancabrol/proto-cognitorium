# COGNITORIUM – DOCUMENT DE RÉFÉRENCE UNIQUE (VERSION MAÎTRESSE)

**Version consolidée** : 1.1 – 8 août 2026  
**Statut** : Synthèse exécutive, décisions, état de l'art et spécifications techniques pour le passage au développement.

---

## TABLE DES MATIÈRES
1. Vision, Positionnement & Business
2. Décisions Définitives (Validées le 07/08/2026)
3. Modèles Fonctionnels et Moteurs Métier (Détails opérationnels)
4. Feuille de Route Produit (V1 MVP → V4 Finale)
5. Architecture Technique Retenue
6. État de l’Art Scientifique – Synthèse et Recommandations Applicables
7. État de l’Art Business & Analyse Concurrentielle – Justification de la niche
8. SPÉCIFICATIONS MANQUANTES – COMBLÉES PAR L'ÉTAT DE L'ART (À intégrer au MVP)
9. ÉLÉMENTS RESTANT À SPÉCIFIER (BLOCANTS POUR LE DÉVELOPPEMENT)
10. Critères d’Acceptation du MVP (Version consolidée)
11. Recommandations Stratégiques Finales

---

## 1. VISION, POSITIONNEMENT & BUSINESS

- **Vision** : Plateforme personnelle de pilotage des compétences et de navigation professionnelle. Elle construit une représentation évolutive du parcours, relie expériences, formations, compétences, preuves, objectifs, puis propose des trajectoires explicables.
- **Promesse** : Comprendre où l’on en est, ce que l’on sait faire aujourd’hui, ce qui peut être réactivé, quels métiers sont accessibles.
- **Positionnement unique (Business)** : Là où les acteurs existants sont centrés entreprise (RH) ou ponctuels (bilan), Cognitorium est **individuel, continu, hors ligne, gratuit et explicable**.
- **Cible prioritaire** : Adulte en recherche d'emploi (extension vers étudiants, salariés, reconversion).
- **Marché adressable** : Formation pro en France = 12 Md€. 2,5M de demandeurs d'emploi + reconversions/an.

---

## 2. DÉCISIONS DÉFINITIVES (VALIDÉES LE 07/08/2026)
*Ces décisions sont figées pour le MVP.*

| N° | Domaine | Décision / Spécification |
|----|---------|---------------------------|
| 1 | **ROME** | Fichier CSV officiel France Travail. Colonnes conservées : code, intitulé, compétences_savoirs, compétences_savoir_faire, compétences_savoir_être, activités, contextes, accès, passerelles. Versionnage des imports. |
| 2 | **Scoring** | `Score = Niveau_estimé × Confiance`. Poids : Auto-éval=0,3 ; Diplôme=0,9 ; Projet=0,8 ; Exp.pro=0,7 ; Attest.=0,6. Si aucune preuve : Confiance=0,2 et Niveau plafonné à 40. Formule affichée dans l’interface. |
| 3 | **Decay Engine** | Courbe exponentielle. λ technique = 0,12/an ; λ transversal = 0,06/an ; λ langues = 0,08/an. Constantes configurables via interface. |
| 4 | **Biais cognitifs** | Questionnaire 10 biais. Échelle de Likert en 7 points (1=pas d'accord, 7=OK). Affichage score, niveau, confiance, explication, stratégie. |
| 5 | **Graphes** | Calcul : NetworkX. Affichage : PySide6 / QGraphicsView. Profondeur par défaut : 2 niveaux, curseur jusqu'à 5. |
| 6 | **CV** | 3 modèles : Classique, Moderne, ATS (texte brut, sans colonnes). Export PDF intégré. |
| 7 | **Sauvegardes** | 5 versions auto + manuelle. Restauration via `.cognitorium_backup`. |
| 8 | **Sécurité** | MVP : pas de chiffrement. Final : SQLCipher. |
| 9 | **Tests** | 4 profils synthétiques (jeune diplômé, reconversion, expert, sans expérience). Seuil d'acceptation : couverture 90% des cas. |
| 10 | **Distribution** | Stratégie 100% gratuite. Auto-signature (alerte Windows). Installateur : Inno Setup. |
| 11 | **Marché** | MVP : INSEE/APEC en statique. Final : API France Travail. |
| 12 | **Terminologie** | Utilisation exclusive du terme ATS (Applicant Tracking System). |

---

## 3. MODÈLES FONCTIONNELS ET MOTEURS MÉTIER (DÉTAILS OPÉRATIONNELS)

### 3.1 Modèle de la compétence (Unicité & Contexte)
- Une compétence est **unique** dans le référentiel interne.
- Elle peut être possédée dans **plusieurs contextes** (ex. "Python" en contexte "Dev web" et "Data Analyst").
- Chaque contexte possède ses propres pratiques (fréquence, dernière date) et preuves.

### 3.2 Statuts d’une compétence
1. **Détectée** (extraction auto) → 2. **Proposée** → 3. **Acceptée** → 4. **Validée par preuve** (externe). 
5. **Refusée** (exclue du profil actif). 6. **Archivée** (masquée techniquement).

### 3.3 Decay Engine (opérationnel)
- **Formule** : `Niveau_actuel = Niveau_historique × exp(-λ × Δt)`
- Affichage distinct : *Niveau historique*, *Niveau actuel*, *Potentiel de récupération*.
- Calcul déclenché à chaque consultation **ET** en arrière-plan pour les objectifs actifs.
- Rappels générés pour réactiver les compétences en déclin liées à un objectif.

### 3.4 Recommandations (Career Navigator)
- Comparaison profil vs fiches ROME → **Score de compatibilité (0-100)**.
- Catégorisation :
  - **Disponible maintenant** : Compétences/preuves compatibles.
  - **Formation rapide** : Écart limité ou courte formation.
  - **Formation longue** : Reconversion longue.
  - **Éloigné / à explorer** : Écart important.

---

## 4. FEUILLE DE ROUTE PRODUIT (V1 → V4)

| Phase | Contenu | Livrables clés |
|-------|---------|----------------|
| **MVP-0** | Fondations | Comptes locaux + SQLite + Sauvegarde auto + Fenêtre principale |
| **MVP-1** | Onboarding | Saisie parcours/formations/événements + Extraction déterministe + Validation |
| **MVP-2** | Preuves & Decay | Gestion preuves + Scoring (Niveau×Confiance) + Moteur décroissance |
| **MVP-3** | ROME & Recommandations | Import ROME + Moteur recommandation (gaps, métiers accessibles) |
| **MVP-4** | Projets & Formations | Multi-projets + Étapes + Recommandations formations basiques |
| **MVP-5** | Visualisations | Dashboard + Graphes + Biais (Likert 7) |
| **MVP-6** | CV & Packaging | Éditeur CV (3 modèles) + Export PDF + Installateur Inno Setup |
| **V2** | IA & Imports | Multi-plateforme, Imports enrichis, RNCP/RS, IA locale légère |
| **V3** | Cognitif & Mobile | Tests avancés, Simulations, Mobile Companion |
| **V4** | Collaboration | Partage, Audit, Versions spécialisées (scolaire, territoire) |

---

## 5. ARCHITECTURE TECHNIQUE RETENUE

| Brique | Choix | Justification |
|--------|-------|---------------|
| Langage | Python 3.10+ | Écosystème scientifique (NetworkX, pandas) |
| Interface | PySide6 (Qt) | Meilleur desktop Python, QGraphicsView natif pour graphes |
| Base | SQLite | Locale, légère, supporte SQLCipher (final) |
| Graphes | NetworkX (calc) + QGraphicsView (UI) | Standard Python + interaction riche |
| Installateur | PyInstaller + Inno Setup | Standards éprouvés, gratuits |

---

## 6. ÉTAT DE L’ART SCIENTIFIQUE – SYNTHÈSE ET RECOMMANDATIONS

| Domaine | Référence | Apport / Décision pour Cognitorium |
|---------|-----------|-----------------------------------|
| **Decay** | DAS3H (Popineau, Bourda) / Ebbinghaus | Valide le λ différencié par famille. Utiliser une heuristique simplifiée pour MVP. |
| **Recommandation** | SkillBridge (ISEC 2026) / GNN IEEE | Valide l'approche par graphe (NetworkX). L'IA d'inférence implicite est reportée en V2. |
| **Scoring & Confiance** | Modèles Bayésiens | Valide la dissociation `Niveau × Confiance`. La confiance dynamique est une force. |
| **Biais** | Kahneman & Tversky | Likert 7 points validé pour meilleure fidélité. |
| **Extraction** | NLP (TF-IDF + Random Forest) | 93,2% de précision. Pour le MVP, on reste sur du **déterministe (règles + regex)**. |

---

## 7. ÉTAT DE L’ART BUSINESS – SYNTHÈSE

**Concurrents RH (Bridge, Eightfold)** : IA puissante, mais centré entreprise, coûteux, pas d'usage individuel.  
**Concurrents Bilan (MyPass, Neobrain)** : Connaissance du ROME, mais ponctuel, pas de suivi continu (ni decay).  
**Tendances lourdes** : Skills Intelligence (postes → compétences), Souveraineté des données (hors ligne), Lifelong Learning.  
**Niche exacte de Cognitorium** : Combinaison **Individuel + Hors-ligne + Continu + Explicable + Graphe multi-projections**. Aucun acteur ne fait cela.

---

## 8. SPÉCIFICATIONS MANQUANTES – COMBLÉES PAR L'ÉTAT DE L'ART
*Ces points étaient flous dans les docs initiaux. Voici les recommandations opérationnelles validées par la recherche et la pratique, à intégrer directement dans le code.*

### 8.1 Extraction déterministe des compétences
- **Méthode retenue** : Approche **hybride (règles + expressions régulières)**.
- **Principe** : Création d'un lexique de base (mots-clés métiers, technologies, softskills). L'application scanne les saisies (formations, expériences) et propose les compétences correspondantes.
- **Mapping ROME** : Une table de correspondance manuelle (*Compétence_utilisateur* ↔ *Compétence_ROME*) sera fournie initialement, extensible par l'utilisateur.

### 8.2 Calcul du "Niveau estimé" (Scoring)
- **Formule concrète** : Le niveau estimé est la **moyenne pondérée** des évaluations rattachées à la compétence.
  - Exemple : Diplôme (poids 0,9) niveau 80 + Auto-éval (poids 0,3) niveau 90 
    → `Niveau = ((80×0,9) + (90×0,3)) / (0,9+0,3) = 82,5`.
- La **date** de chaque preuve est obligatoire pour le decay.

### 8.3 Questions exactes pour les 10 biais (Likert 7 points)
Voici les formulations validées à coder dans le questionnaire :

| Biais | Formulation (Echelle : 1 = Pas du tout d'accord, 7 = Tout à fait d'accord) |
|-------|-----------------------------------------------------------------------------|
| Confirmation | "Je cherche activement des informations qui confirment mes opinions préexistantes." |
| Ancrage | "Je me fie fortement à la première information reçue pour prendre une décision." |
| Excès de confiance | "Je suis généralement très confiant dans la justesse de mes jugements." |
| Statu quo | "Je préfère maintenir les choses en l'état plutôt que de les changer." |
| Aversion à la perte | "La peur de perdre m'affecte plus que la perspective de gagner." |
| Effet de halo | "Une première impression positive influence fortement mon jugement global." |
| Disponibilité | "Je surestime la probabilité d'événements récents ou marquants." |
| Rétrospectif | "Après coup, j'ai tendance à penser que les événements étaient prévisibles." |
| Autorité | "Je me fie facilement aux avis des experts ou des autorités." |
| Omission | "Je considère qu'une action nuisible est pire qu'une omission nuisible." |

### 8.4 Structure exacte du CV ATS (Texte brut)
1. **Contact Information** : Nom, email, téléphone, ville.
2. **Professional Summary** : 2-3 lignes de résumé.
3. **Skills** : Compétences techniques (séparées par des virgules ou puces).
4. **Work Experience** : Poste, entreprise, dates (MM/AAAA), réalisations en puces.
5. **Education** : Diplômes, établissements, dates.
6. **References** : "Disponibles sur demande".
- **Format** : Colonne unique, police Arial ou Calibri.

### 8.5 Algorithme de matching ROME (Moteur de recommandation)
- **Méthode** : **TF-IDF + Similarité Cosinus**.
- **Comparaison** : Le texte du profil utilisateur (compétences + expériences) est vectorisé, comparé aux vecteurs des champs *savoirs* et *savoir-faire* des fiches ROME.
- **Seuil de catégorisation** (à paramétrer dans le code) :
  - *Disponible* : Score > 75%
  - *Formation rapide* : Score entre 50% et 75%
  - *Formation longue* : Score entre 25% et 50%
  - *Éloigné* : Score < 25%

---

## 9. ÉLÉMENTS RESTANT À SPÉCIFIER (BLOCANTS POUR LE DÉVELOPPEMENT)
*Ces points doivent ABSOLUMENT être tranchés en réunion d'équipe avant d'écrire la première ligne de code.*

| # | Domaine | Question précise en attente |
|---|---------|-----------------------------|
| **1** | **Schéma SQLite** | Quelles sont EXACTEMENT les colonnes et types de chaque table ? (ex: table `competence_context` : `id`, `competence_id`, `contexte_nom`, `derniere_pratique_date` (DATE ou TIMESTAMP), `frequence` (INTEGER ou TEXT)). Faut-il une base unique avec `user_id` partout, ou une base SQLite par compte utilisateur ? |
| **2** | **UI/UX & Wireframes** | L'onboarding est-il un QWizard (pas-à-pas) ou un formulaire défilant ? La timeline est-elle cliquable pour éditer ? Le clic sur un nœud du graphe ouvre-t-il une sidebar ou une popup ? **Il faut des mockups (même papier scanné)**. |
| **3** | **Seuils exacts du moteur** | Confirmet-on les seuils de matching (75%, 50%, 25%) proposés en 8.5 ? Le decay est-il calculé à l'ouverture de l'appli, toutes les heures, ou à chaque modification du profil ? |
| **4** | **Cas limites (Edge Cases)** | Que faire si l'utilisateur supprime toutes ses preuves (score passe à 20 ou à 0) ? Si le fichier ROME est manquant au premier lancement, l'appli bloque-t-elle ou affiche-t-elle un mode dégradé ? Si un projet est créé sans métier cible, les recommandations affichent-elles un message vide ou une alerte ? |
| **5** | **Profs de test (JSON)** | Fournir les fichiers **JSON d'import** des 4 profils (jeune diplômé, reconversion, expert, sans expérience) avec leurs données précises (formations, expériences, preuves, niveaux). Sans cela, les tests de couverture 90% sont impossibles à automatiser. |
| **6** | **Trigger des sauvegardes** | Les 5 versions automatiques : à quel moment exactement sont-elles déclenchées (à la fermeture, toutes les 5 min, après chaque validation de compétence) ? Où sont stockées ces versions (`AppData/Local` ou `Documents/Cognitorium/Backups`) ? |
| **7** | **Logs techniques** | Le fichier de log doit-il contenir des traces Python brutes (`logging.DEBUG`) ou un format structuré (JSON lines) ? Quel est le niveau de log par défaut (INFO, WARNING) ? |
| **8** | **PDF & Bibliothèque** | Quelle bibliothèque Python pour l'export PDF (ReportLab, FPDF, WeasyPrint) ? Le choix impacte le rendu des 3 modèles de CV. |

---

## 10. CRITÈRES D’ACCEPTATION DU MVP (VERSION CONSOLIDÉE)
- [ ] Deux comptes locaux peuvent être créés et séparés.
- [ ] L’onboarding bloque l’accès au dashboard tant qu’il n’est pas terminé (avec les 12 étapes).
- [ ] Le parcours apparaît dans une timeline interactive (ajout/modification possible).
- [ ] Les événements proposent des compétences (extraction déterministe par regex).
- [ ] Compétences acceptables, modifiables ou refusables.
- [ ] Niveau, contexte, preuves et confiance sont affichés (avec la formule).
- [ ] Une compétence non pratiquée affiche une baisse visible (Decay Engine).
- [ ] Le decay influence la catégorisation de la recommandation.
- [ ] Deux projets sont suivis en parallèle.
- [ ] Le ROME est consultable hors ligne (recherche libre).
- [ ] Les recommandations affichent leur raisonnement détaillé (pourcentage de matching).
- [ ] Un CV ciblé (par métier) peut être modifié et exporté en PDF (3 modèles).
- [ ] Les données persistent après fermeture.
- [ ] L’application est lancée par un exécutable Windows (.exe) généré par Inno Setup.

---

## 11. RECOMMANDATIONS STRATÉGIQUES FINALES

1. **Prioriser le Decay Engine (MVP-2)** en s'inspirant de DAS3H, mais en restant sur une heuristique à 3 λ pour ne pas complexifier le MVP.
2. **Soigner les graphes (MVP-5)** : c'est le différenciateur visuel. Utiliser strictement le code couleur défini (Vert, Bleu, Orange, Violet, Rouge, Cyan).
3. **Capitaliser sur l'explicabilité** : Afficher systématiquement les formules, les poids et les sources (ROME versionnée). C'est l'argument de confiance numéro 1.
4. **Valider les maths** sur les 4 profils synthétiques **avant** la sortie MVP. (Nécessite de produire les JSON du point 9.5).
5. **Préparer l'IA pour V2** : Structurer les moteurs (Scoring, Extraction, Recommandation) avec des **Design Patterns Strategy** pour remplacer les règles déterministes par des modèles légers (ML) sans refonte.

---

**FIN DU DOCUMENT DE RÉFÉRENCE UNIQUE**

**Prochaine action impérative** : Organiser une réunion de 2h pour trancher les **8 points bloquants** du chapitre 9. Une fois ces décisions prises, le développement du MVP peut démarrer immédiatement sur la base de ce document.