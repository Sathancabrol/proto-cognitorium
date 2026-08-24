# Analyse des versions du prototype Cognitorium — branches & merges

**Date de l'analyse :** 24 août 2026
**Dépôt :** `Sathancabrol/proto-cognitorium`
**État analysé :** 4 branches distantes, 2 PR mergées, ~30 commits

---

## 1. Le produit en bref

**Cognitorium** — prototype React 19 + Vite + TypeScript, serveur Express (`server.ts`) adossé à l'API Gemini (`@google/genai`). Objet : *système de représentation dynamique et d'audit du capital cognitif* — traçabilité des preuves, décomposition par missions, passerelles ROME (France Travail), courbe d'oubli (Decay Engine) et validation humaine. Le profil par défaut est celui de Näthan Cabrol (benchmark), avec persistance en `localStorage`.

---

## 2. Cartographie Git complète

```
* 383b86b  (origin/arena/01a034f2)  Add files via upload                     ◄ NON MERGÉ — version avancée
* 2411b1d                          Nouveau profil : Pierre DENIAUD
* f0dabb9                          Add files via upload
* a435d5a                          Nouveaux profils : Amélie & Gianni (CVs)
* 6cf99ff                          Add files via upload
* 1eceb5c                          Consolidation : moteur ROME réel, …
| * 36b2d2b (HEAD → arena/01a035a5, main)  update                             ◄ MAIN — état courant
| * c895759                          update   (purge raw/, +4400 lignes package-lock retiré)
| * ec09cc2 / f971be3              Add files via upload
|/
* 8e39aeb … 59c21c4                Add files via upload + « Create fiche rome »
*   392f0c1                        Merge PR #2 ← arena/01a03436 (raw/README.md)
|\
| * b75f700 (origin/arena/01a03436) Add raw/ folder for unprocessed project data
|/
*   ce08d8a                        Merge PR #1 ← arena/01a033e8
|\
| * 05058b3 (origin/arena/01a033e8) feat: add five-level graph hierarchy
| * f7cae9e                        feat: enrich Nathan profile from CV evidence
|/
* c5526fa  v2
* d6d9558  update 1
* 69b57f5  feat: initialize Cognitorium project structure
* 443a83f  Initial commit
```

**4 branches identifiées :**

| Branche | Pointe | Statut | Rôle |
|---|---|---|---|
| `main` (= `arena/01a035a5`, copie de travail) | `36b2d2b` | ✅ référence | Version courante — graphe réseau retravaillé, `raw/` purgé |
| `arena/01a034f2-proto-cognitorium` | `383b86b` | ⚠️ **non mergée** | **Version la plus avancée fonctionnellement** (moteur ROME réel + 6 profils) |
| `arena/01a033e8-proto-cognitorium` | `05058b3` | ✅ mergée (PR #1) | Hiérarchie de graphe à 5 niveaux + enrichissement profil Nathan |
| `arena/01a03436-proto-cognitorium` | `b75f700` | ✅ mergée (PR #2) | Création du dossier `raw/` (données non traitées) |

---

## 3. Chronologie des versions

### V0 — Initialisation (`443a83f` → `69b57f5`)
Squelette du projet : React/Vite, `server.ts` (Gemini), premiers composants (graphe, arbre, tableau, dashboard), données monolithiques dans `initialData.ts`.

### V1 → V2 (`d6d9558` → `c5526fa`)
- **Éclatement des données** : `initialData.ts` (−1131 lignes) remplacé par 3 profils :
  `nathanProfile.ts` (1434 lignes — profil détaillé issu du CV), `studentProfile.ts`, `transitionProfile.ts`.
- `NodeInspectorModal` enrichi (+136), preuves améliorées dans les types.

### PR #1 — `arena/01a033e8` (`ce08d8a`)
- **`f7cae9e`** Enrichissement du profil Nathan à partir des preuves du CV.
- **`05058b3`** **Hiérarchie de graphe à 5 niveaux** : *Expérience → Tâche → Compétence → Cognition → Matching* — le modèle conceptuel encore en vigueur.
- Onboarding enrichi, Distiller IA retravaillé (+54), `package-lock.json` ajouté (4402 lignes).
- +314/−149 lignes sur 13 fichiers.

### Uploads intermédiaires (`59c21c4` → `8e39aeb`)
6 commits « Add files via upload » + `b536ce6 Create fiche rome` — alimentation du dossier `raw/` (fiches ROME PDF, prototypes HTML, documents fondateurs DOCX…).

### PR #2 — `arena/01a03436` (`392f0c1`)
- Seulement `raw/README.md` (+15 lignes) : officialise le dossier `raw/` comme zone de données brutes non traitées.

---

## 4. LA DIVERGENCE — deux versions parallèles depuis `8e39aeb`

C'est le point clé de l'analyse : **le prototype existe aujourd'hui en deux versions divergentes, chacune possédant des avancées absentes de l'autre.**

### 4.1 Lignée A — `main` (`36b2d2b`) — état courant du working tree

| Commit | Apport |
|---|---|
| `f971be3`, `ec09cc2` | Uploads dans `raw/` (271 PDF fiches ROME, XLSX référentiels, maquettes HTML ~55 000 lignes) |
| `c895759` | **Purge** : suppression de tout `raw/` (~340 fichiers) et du `package-lock.json` |
| `36b2d2b` | **Réécriture majeure du graphe réseau** : `NetworkGraph.tsx` 769 → 1329 lignes ; nouveau système visuel dimensionnel `graphDimensions.ts` (+151) : modes **2D (type Obsidian) / timeline chronologique**, architecture prête pour la 3D (strates d'abstraction 0→4, caméra orbitale pitch/yaw) ; `nodeVisualDescriptor.ts` (+308) remplace `nodeIconSystem.ts` (−326) ; image de concept UI ajoutée |

**Caractéristiques :**
- 7 onglets plats de navigation : dashboard, signature, network, tree, table, horizons, decay.
- **3 profils** : nathan (1624 lignes), student, transition.
- Métiers « horizons » avec **scores codés en dur** dans les données (ex. 97, 96, 94).
- ~9 400 lignes TS/TSX. Léger, sans données lourdes.

### 4.2 Lignée B — `arena/01a034f2` (`383b86b`) — version avancée **non mergée**

| Commit | Apport |
|---|---|
| `1eceb5c` **« Consolidation »** | **Le saut fonctionnel majeur** (+25 492 lignes) : `scripts/build_rome_data.py` → génère `src/data/romeData.ts` (23 686 lignes, 5,4 Mo) depuis les XLSX officiels France Travail : **1 911 fiches ROME réelles (juin 2026), 17 920 compétences, mapping FORMACODE** ; `src/utils/romeMatching.ts` : **moteur de matching explicable** (index par jetons, cache par profil, exige ≥1 correspondance exacte) ; `src/utils/epistemics.ts` : **échelle épistémique à 5 niveaux** (fait → compétence → capacité → hypothèse → conclusion psychologique *jamais auto-déduite*) ; `HorizonsBridge` réécrit (+438) : labels qualitatifs *Très forte / Forte / Modérée / À explorer* (seuils 75/50/25), panneaux **« Pourquoi ? / Il manque quoi ? / formations FORMACODE »**, scores numériques réservés au mode expert ; **navigation restructurée en 5 sections produit** (Mon profil / Mes expériences / Mes compétences / Mes possibilités / Mon évolution) avec modes de représentation secondaires ; dashboard à « prochaine étape » **calculée** (fini le texte codé en dur) ; Distiller IA : statut *pending* obligatoire + relations par correspondance de noms (fini le « tout → tout ») ; schéma Gemini serveur mis à jour (`relatedSkills`, `matchingSkillIds`) ; docs `ANALYSE_RAW.md` (audit 337 fichiers) + `CONSOLIDATION.md` |
| `6cf99ff` | Uploads raw/ : 4 CV sources (Amélie, Gianni ×2, Pierre), rapports de stage, codex biais cognitifs… |
| `a435d5a` | **2 nouveaux profils issus des CV** : `amelieProfile.ts` (706 l. — technicienne du son) et `gianniProfile.ts` (1103 l. — parcours voyageur polyvalent) |
| `f0dabb9` | Uploads raw/ (collection citations, PDF) |
| `2411b1d` | **`pierreProfile.ts`** (856 l. — sauveteur aquatique BNSSA), scores recalculés honnêtement par le moteur |
| `383b86b` | Uploads raw/ (dossiers chantier, CV Benoît, TER, questionnaires…) — `raw/` atteint **377 fichiers** |

**Caractéristiques :**
- **6 profils** : nathan, amelie, gianni, pierre, student, transition.
- Chaîne complète jouable de bout en bout : Onboarding → CV → Extraction IA (propositions) → Validation humaine → Graphe → Moteur ROME réel → Pourquoi/Écarts → Formation → Prochaine action.
- ~35 800 lignes TS/TSX (dont 23 700 de données ROME générées).
- **N'a PAS** la réécriture du graphe de `main` (NetworkGraph inchangé : 769 lignes, 2D classique).

### 4.3 Comparatif direct A vs B

| Axe | `main` (A) | `01a034f2` (B) |
|---|---|---|
| Référentiel ROME | ❌ aucun (scores en dur) | ✅ 1 911 fiches officielles + FORMACODE |
| Explicabilité métiers | ❌ | ✅ Pourquoi / Écarts / Formations / Action |
| Scores | Chiffres « magiques » affichés | Labels qualitatifs, chiffre en mode expert |
| Rigueur épistémique | Partielle (statuts vérifié/inféré) | ✅ Échelle 5 niveaux + garde-fou psychologique |
| Flux IA | Relations « tout → tout » | ✅ IA propose (pending) / humain valide |
| Navigation | 7 onglets outils | 5 sections produit + modes de vue |
| Graphe réseau | ✅ **Réécrit** : 2D Obsidian + timeline, pré-3D | 2D classique (hérité de la base) |
| Profils | 3 | **6** (+ Amélie, Gianni, Pierre) |
| `raw/` | Purgé | 377 fichiers + script de régénération ROME |
| Docs d'audit | — | `ANALYSE_RAW.md` + `CONSOLIDATION.md` |
| Volume TS/TSX | ~9 400 lignes | ~35 800 lignes |

---

## 5. Faisabilité de réconciliation

- **Base de merge commune :** `8e39aeb`.
- **Test de merge (3-way) :** seul **`src/components/NodeInspectorModal.tsx`** est en conflit (modifié des deux côtés : échelle épistémique côté B vs ajustements graphe côté A). Tout le reste fusionne proprement — la réécriture du graphe de `main` et le moteur ROME de `01a034f2` touchent des fichiers quasi disjoints (**sauf** le `Header`, fusionné automatiquement mais à revérifier en runtime : B attend les sections, A a conservé les 7 onglets).
- **Stratégie naturelle :** merger `01a034f2` dans `main` (ou l'inverse) en résolvant `NodeInspectorModal`, donnerait une version cumulant **graphe timeline/pré-3D + moteur ROME réel + 6 profils**.

---

## 6. Points d'attention relevés

1. **⚠️ Branche avancée non mergée** : tout le travail de consolidation (ROME réel, épistémique, 3 profils) risque d'être perdu si le développement continue sur `main`. Il est également à noter que `main` a **supprimé** le dossier `raw/` que `01a034f2` continue d'alimenter — les données ROME XLSX sources sont nécessaires pour régénérer `romeData.ts`.
2. **Secrets** : `CONSOLIDATION.md` signale `raw/identifiants_cognitorium…json` en clair dans `raw/` (branche B) ; `.gitignore` ne couvre que `.env*`.
3. **Poids** : `romeData.ts` = 5,4 Mo dans le bundle (lazy-loading suggéré dans la doc de B) ; `raw/` ≈ 45 Mo versionné (~370 fichiers binaires) — candidat au stockage externe.
4. **Commits « Add files via upload »** répétés : historique peu descriptif côté uploads de données.
5. **Doublon de nommage** projet : *Cognitorium* (MVP, code actuel) vs *Cognitarium* (vision jumeau cognitif dans les maquettes HTML de `raw/`).

---

## 7. Synthèse en une phrase

Le dépôt contient **deux moitiés complémentaires du même prototype** : `main` détient la **visualisation** (graphe réseau 2D/timeline retravaillé, prêt pour la 3D), la branche non mergée `arena/01a034f2` détient la **substance** (moteur ROME réel explicable, rigueur épistémique, 6 profils dont le benchmark Näthan) — un seul fichier en conflit les sépare d'une version unifiée nettement supérieure.
