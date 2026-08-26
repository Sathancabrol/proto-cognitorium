# CONSOLIDATION COGNITORIUM — Phase de consolidation du prototype

**Date :** 24 août 2026
**Branche :** `arena/01a034f2-proto-cognitorium`
**Référentiel d'entrée :** l'audit de la version actuelle du repo (18 points) + l'analyse complète du dossier `raw/` (voir `ANALYSE_RAW.md`).

> Principe directeur de cette phase : **ne pas empiler de nouvelles fonctionnalités, mais faire fonctionner proprement la chaîne complète** — Onboarding → CV/parcours → Extraction IA → Propositions → Validation humaine → Graphe → Référentiel ROME → Métiers compatibles → Pourquoi ? / Il manque quoi ? → Passerelle → Prochaine action.

---

## Récapitulatif des changements

| Fichier | Changement |
|---|---|
| `scripts/build_rome_data.py` | **Nouveau** — génère le module de données ROME à partir des XLSX officiels France Travail du dossier `raw/` |
| `src/data/romeData.ts` | **Nouveau (généré)** — 1 911 fiches ROME taguées, 17 920 compétences → codes ROME, mapping FORMACODE (5,4 Mo) |
| `src/utils/romeMatching.ts` | **Nouveau** — moteur de matching ROME explicable (index par jeton, cache par profil) |
| `src/utils/epistemics.ts` | **Nouveau** — échelle épistémique à 5 niveaux (fait → compétence → capacité → hypothèse → conclusion) |
| `src/types.ts` | `CognitoriumSection` + sections produit, `compatibilityLevel` élargi, `matchingSkillIds` |
| `src/components/HorizonsBridge.tsx` | **Réécrit** — moteur ROME réel + labels qualitatifs + pourquoi/écarts/formations |
| `src/components/Header.tsx` | Navigation restructurée en **5 sections** avec modes de représentation |
| `src/App.tsx` | Câblage profil/mode vers HorizonsBridge |
| `src/components/DashboardView.tsx` | « Prochaine étape » calculée (fini le texte codé en dur), labels qualitatifs, garde-fou épistémique |
| `src/components/NodeInspectorModal.tsx` | Échelle épistémique + preuves structurées (Source / Mission / Résultat / Contexte / Validation) |
| `src/components/CognitiveSignature.tsx` | Badges épistémiques sur les capacités + garde-fou « pas de conclusion psychologique » |
| `src/components/ExperienceDistillerModal.tsx` | L'IA **propose** (statut *pending*), relations par correspondance de noms (fini le « tout → tout ») |
| `server.ts` | Schéma Gemini : capacités liées par nom, `matchingSkillIds` pour les métiers |
| `vite.config.ts` | Correction d'un bug préexistant : Vite ne scanne plus les HTML bruts de `raw/` |

---

## Correspondance avec les 18 points de l'audit

### Priorité 1 — Brancher les données réelles ✅
**Avant :** les métiers du profil affichaient des scores codés en dur (« Ergonome 97 »), aucune donnée ROME utilisée par l'application.
**Maintenant :**
- Les **1 911 fiches ROME officielles** (juin 2026) sont dans l'app (`romeData.ts`), avec tags Transition écologique/numérique, emploi cadre/réglementé.
- L'**arborescence des compétences** (17 920 compétences → codes ROME) alimente un moteur de matching qui croise réellement le profil avec chaque fiche.
- Le **mapping FORMACODE** fournit les formations suggérées par métier.
- Dans « Mes possibilités » : recherche libre (métier, code, domaine) + classement automatique des meilleures correspondances, calculés à la volée (327 ms pour les 1 911 fiches).
- Pipeline : `raw ROME → normalisation (script) → Core Knowledge Model (profil) → matching → interface`.

### Priorité 2 — Rendre les relations explicables ✅
Chaque résultat du moteur affiche désormais :
- **Pourquoi ?** — compétences du profil mobilisées par la fiche (avec nombre de preuves chacune), expériences reliées, compétences non vérifiées.
- **Il manque quoi ?** — compétences du référentiel non couvertes + formations FORMACODE suggérées.
- **Prochaine action** proposée dans `explainabilityFactors`.
- Les cartes d'horizons existantes montrent le bilan « ✅ déjà démontré / ⚠️ à combler ».

### Priorité 3 — Corriger les scores ✅
- Les labels qualitatifs remplacent le chiffre comme message principal : **Très forte / Forte / Modérée / À explorer** (seuils du paramétrage officiel : 75 / 50 / 25).
- Le score numérique n'apparaît **qu'en mode expert**, toujours accompagné de son explication.
- Les scores « magiques » du profil (97, 96, 94…) ne sont plus affichés nus : la vue horizons les recatégorise qualitativement ; l'inspecteur affiche l'indice + son détail.
- La « Prochaine étape » du dashboard est désormais **calculée** (premier écart du premier horizon) au lieu du texte codé en dur « Qualiopi/SIRH pour 96 % ».

### Priorité 4 — Transformer les représentations en modes ✅
- Navigation restructurée : **MON COGNITORIUM** en 5 sections — **Mon profil / Mes expériences / Mes compétences / Mes possibilités / Mon évolution**.
- Les vues (Graphe, Arbre, Tableau, Temps) sont des **modes de représentation** accessibles dans les sections (chips secondaires dans le header), plus des destinations expertes de premier niveau.

### Priorité 5 — Le profil Näthan comme benchmark ✅ (déjà en place)
Le profil de Näthan reste le profil de référence ; le moteur ROME le croise désormais avec les vraies données (ex : Sophrologue, Biostatisticien, Ingénieur de recherche apparaissent comme correspondances documentées).

### Point 9 — Inférences présentées comme certifiées ✅
- Nouvelle **échelle épistémique à 5 niveaux** (`epistemics.ts`) : 1 Fait documenté · 2 Compétence inférée · 3 Capacité candidate · 4 Hypothèse cognitive · 5 Conclusion psychologique (**jamais déduite automatiquement**).
- Chaque nœud affiche son niveau dans l'inspecteur ; les capacités de niveau 4 portent un avertissement explicite ; le Passeport et le mode expert affichent le garde-fou.

### Point 10 — Système de preuves plus profond ✅
L'inspecteur structure chaque preuve : **Source** (CV, diplôme, projet, déclaration, IA…), **Mission / Résultat** (detail), **Résultat quantitatif** (volumeMetric), **Document source + page**, **Contexte temporel** (date), **Validation humaine** (qui, quand) pour les éléments vérifiés.

### Point 11 — Bug conceptuel de l'import CV ✅
- **Serveur** : le schéma Gemini demande désormais `relatedSkills` (noms exacts) par capacité ; les métiers reçoivent `matchingSkillIds` calculés par correspondance de noms.
- **Client** : une capacité n'est reliée qu'aux compétences qui la nourrissent ; un métier n'est relié qu'à ses compétences matching (et aux capacités qu'elles alimentent). Fini « toutes les compétences → toutes les capacités » et « première capacité → tous les métiers ».
- **Flux IA propose / humain valide** : tout ce qui est extrait (compétences, capacités, métiers) arrive en statut `pending` / `inference_a_valider` et passe par le Centre de validation — plus rien n'est auto-certifié.

### Points 12-13 — Graphe 5 niveaux et modèle conceptuel ✅ (conservés)
Le modèle de graphe validé (Expérience → Tâche → Compétence → Cognition → Matching) est **inchangé**, conformément à la recommandation de ne pas le refaire.

### Point 14 — UX : 5 sections au lieu de 7 outils ✅ (voir Priorité 4)

### Point 15 — Mode essential / expert approfondi ✅
- Mode expert uniquement : scores numériques, métriques approfondies du dashboard.
- Mode essentiel : labels qualitatifs, hiérarchie simple.

### Points 16-18 — Démonstrateur de bout en bout ✅
Le scénario complet est désormais jouable : **Onboarding → Ajouter un vécu/CV → Extraction IA (propositions pending) → Revue → Validation humaine → Graphe → Moteur ROME réel → « Pourquoi ? / Il manque quoi ? » → Formation FORMACODE → Prochaine action calculée**.

---

## Nouveaux profils issus des CV (24/08/2026)

| Profil | Source | Contenu |
|---|---|---|
| **Amélie Cruagnes** (`src/data/amelieProfile.ts`) | `raw/CV_2021-11-10_AMELIE_CRUAGNES (3).pdf` | Technicienne du son & sonorisatrice : Bac STL → Licence Ciné/AV → BTS Audiovisuel Métiers du son → RNCP III. 4 expériences (Collectif Orchestré, La Cabane Cie, Orchestre Paul Selmer, DEMD), 9 compétences alignées référentiel, 3 capacités, 3 horizons ROME (L1508, L1511, L1101). |
| **Gianni Ducoeur** (`src/data/gianniProfile.ts`) | `raw/CV_-_Agriculture gianni.pdf` + `raw/CV_2025_BAT gianni.pdf` | Parcours voyageur polyvalent (2 CV fusionnés) : agriculture/viticulture/cueillette, élevage & fromagerie, logistique, restauration bâtiment, contrôle routier (NZ), maçonnerie (Vinci), cordiste. 11 expériences, 16 compétences, 3 capacités, 4 horizons ROME (F1505, F1703, F1611, A1447/A1407). |
| **Pierre DENIAUD** (`src/data/pierreProfile.ts`) | `raw/Pierre DENIAUD.doc` | Jeune sauveteur aquatique : 1ère S Sciences de l'Ingénieur, BNSSA/PSE1/PSE2 (2012), stage sauveteur de plage. 3 expériences (surveillant de baignade Lo Solehau Balaruc, magasinier New Baby, ouvrier agricole Berland/Baudouin), 12 compétences alignées référentiel, 3 capacités, 4 horizons ROME (G1247, G1224, N1103, A1401). Scores codés en dur alignés sur le moteur (G1247 = 46/100 modérée — honnête : la fiche demande 25 compétences, il en documente 3). |
| *Näthan Cabrol (CV spécialisé 2021)* | `raw/cv_spA_cialisA_2021.pdf` | **Déjà couvert** : c'est la source historique de `nathanProfile.ts` (référencé comme `cv_spécialisé_2020.pdf` dans les preuves). Pas de doublon créé. |

**Cohérence anti « chiffres magiques »** : les horizons de ces profils affichent désormais la compatibilité **recalculée par le moteur ROME** (via `computeFicheMatch` dans `HorizonsBridge`), pas les valeurs codées en dur dans les données. Le moteur a aussi été durci : il exige ≥ 1 correspondance **exacte** avec le référentiel (élimine le bruit type « travailler en équipe » → métiers aberrants), et le score est plafonné à 100 avec un socle de ~6 compétences clés.

## Limites connues / prochaines étapes possibles

1. **Taille du bundle** : `romeData.ts` = 5,4 Mo (1,17 Mo gzip). Un lazy-loading du référentiel (dynamic import au premier accès à « Mes possibilités ») est possible en V2 de cette consolidation.
2. **Matching approximatif** : la couverture d'une fiche est calculée sur les compétences de l'arborescence simplifiée (max 40 par fiche) — les scores sont des **indices de proximité**, jamais des garanties. L'UI le dit explicitement.
3. **Le questionnaire des 10 biais** (formulations exactes dans `raw/02_cognitorium_parametrage.json`) n'est toujours pas intégré à l'app web : c'est le prochain candidat d'implémentation.
4. **Persistance** : le profil reste en `localStorage` ; le schéma SQL (`raw/01_cognitorium_schema_ddl.sql`) n'est toujours pas branché — un serveur de persistance SQLite est la suite naturelle (la table `rome_import`/`rome_fiche` est prête pour versionner le référentiel).
5. **`raw/identifiants_cognitorium…json`** contient des secrets en clair : à déplacer hors du dépôt (le `.gitignore` ne couvre que `.env*`).

---

## Comment régénérer les données ROME

```bash
# Après une mise à jour des XLSX dans raw/ :
python3 scripts/build_rome_data.py
```

Le module généré (`src/data/romeData.ts`) est la source de vérité du moteur ; ne pas l'éditer à la main.
