# COGNITORIUM — Livrable 3 : Mockups / Wireframes des 6 Écrans Principaux
**Version :** 1.0 — 7 août 2026  
**Cible :** PySide6 (Qt) — Résolution de référence 1280×800 (responsive 1024×600 min)

---

## Conventions graphiques

| Élément | Style |
|---------|-------|
| **Fond principal** | `#F5F6FA` (gris très clair) |
| **Sidebar** | `#FFFFFF`, bordure droite `#E1E4E8`, largeur 320px |
| **Header** | Hauteur 56px, fond `#FFFFFF`, ombre portée 2px |
| **Texte principal** | `Segoe UI` / `Inter`, 14px, `#2C3E50` |
| **Texte secondaire** | 12px, `#7F8C8D` |
| **Bouton primaire** | Fond `#3498DB`, texte blanc, radius 4px |
| **Bouton secondaire** | Fond transparent, bordure `#3498DB`, texte `#3498DB` |
| **Badge disponible** | `#2ECC71` (vert) |
| **Badge formation rapide** | `#3498DB` (bleu) |
| **Badge formation longue** | `#F39C12` (orange) |
| **Badge éloigné** | `#9B59B6` (violet) |
| **Alerte / Decay fort** | `#E74C3C` (rouge) |
| **Info / Objectif** | `#1ABC9C` (cyan) |

---

## ÉCRAN 1 — ONBOARDING (QWizard, 12 étapes)

**État :** Bloque l'accès au dashboard tant que non terminé.  
**Navigation :** Précédent / Suivant / Quitter (avec confirmation de perte de données).  
**Barre de progression :** 12 segments en haut, étape active en `#3498DB`, complétées en `#2ECC71`.

```
+------------------------------------------------------------------+
|  Cognitorium                                    [ ? ]  [ X ]     |
+------------------------------------------------------------------+
|  ●────●────●────○────○────○────○────○────○────○────○────○       |
|  Étape 3/12 : Vos formations                                     |
+------------------------------------------------------------------+
|                                                                  |
|  +----------------------------------------------------------+    |
|  |  🎓 Ajoutez vos diplômes et certifications               |    |
|  |                                                          |    |
|  |  [ Diplôme ▼ ]  [ Intitulé : Licence Informatique    ]  |    |
|  |  [ Établissement : Université Paris-Saclay           ]  |    |
|  |  [ Date début : 09/2018 ]  [ Date fin : 06/2021 ▼ ]   |    |
|  |  [ Niveau RNCP ▼ ]  [ ECTS : 180 ]                     |    |
|  |                                                          |    |
|  |  [ + Ajouter une autre formation ]                     |    |
|  |                                                          |    |
|  |  ┌────────────────────────────────────────────────┐     |    |
|  |  │ 📄 Licence Informatique — Paris-Saclay         │     |    |
|  |  │    09/2018 → 06/2021  [ 🗑 ] [ ✏ ]             │     |    |
|  |  └────────────────────────────────────────────────┘     |    |
|  +----------------------------------------------------------+    |
|                                                                  |
|  [ < Précédent ]              [ Suivant > ]                      |
|                                                                  |
+------------------------------------------------------------------+
```

**Détail des 12 étapes :**
1. Bienvenue + création compte local
2. Profil de base (nom, ville, email, téléphone)
3. Formations (diplômes, certifications)
4. Expériences professionnelles (postes, entreprises, dates)
5. Projets personnels / bénévolat
6. Compétences auto-évaluées (grille rapide 0-100)
7. Validation des compétences extraites (liste détectée depuis étapes 3-5)
8. Objectifs professionnels (métiers cibles ROME)
9. Langues
10. Biais cognitifs (questionnaire Likert 7 points, 10 questions)
11. Import ROME (sélection fichier CSV ou mode dégradé)
12. Récapitulatif + accès dashboard

---

## ÉCRAN 2 — DASHBOARD (Vue d'ensemble)

**Layout :** Header fixe + grille 3 colonnes (responsive 2→1 sur petit écran).  
**Données temps réel :** Decay recalculé à l'ouverture.

```
+------------------------------------------------------------------+
|  ≡  Cognitorium    [ 🔍 Rechercher... ]    [ ⚙ ]  [ 👤 Martin ]  |
+------------------------------------------------------------------+
|                                                                  |
|  +----------------+  +----------------+  +------------------+    |
|  |  COMPÉTENCES   |  |  PROJETS ACTIFS|  |  RECOMMANDATIONS |    |
|  |                |  |                |  |                  |    |
|  |  ● 42 actives  |  |  🎯 Data       |  |  🟢 Dév. Web     |    |
|  |  ● 8 en déclin |  |     Scientist  |  |    (score 82%)   |    |
|  |  ● 3 archivées |  |     3/7 étapes |  |  🔵 Data Analyst |    |
|  |                |  |                |  |    (score 64%)   |    |
|  |  [ Voir tout ] |  |  🎯 Reconversion|  |  🟠 ML Engineer  |    |
|  |                |  |     RH         |  |    (score 41%)   |    |
|  +----------------+  |     1/5 étapes |  |                  |    |
|                      |                |  |  [ Explorer ]    |    |
|                      +----------------+  +------------------+    |
|                                                                  |
|  +----------------------------------------------------------+    |
|  |  📊 TIMELINE (cliquable)                                  |    |
|  |                                                            |    |
|  |  2018──2019──2020──2021──2022──2023──2024──2025──2026    |    |
|  |    🎓     💼      💼      📜      🎯      💼               |    |
|  |   [Lic]  [Dev]   [Lead] [Cert] [Projet] [Freelance]      |    |
|  |                                                            |    |
|  |  Clic sur un point → ouvre la sidebar d'édition           |    |
|  +----------------------------------------------------------+    |
|                                                                  |
+------------------------------------------------------------------+
```

**Interactions :**
- Clic sur un chiffre de compétences → redirection Écran 3 (Vue Compétence)
- Clic sur un projet → sidebar avec détail des étapes et compétences liées
- Clic sur une recommandation → popup raisonnement détaillé + bouton "Créer un projet à partir de ce métier"
- Clic sur un point de timeline → sidebar d'édition de l'événement (pas de popup)

---

## ÉCRAN 3 — VUE COMPÉTENCE (Détail & Preuves)

**Layout :** Liste maître à gauche (60%) + Sidebar détail à droite (40%).  
**Filtres :** Famille (tous/technique/transversal/langue), Statut, Recherche texte.

```
+------------------------------------------------------------------+
|  ≡  Cognitorium  ←  Mes Compétences    [ 🔍 ] [ Filtres ▼ ]     |
+------------------------------------------------------------------+
|  +------------------------------+  +-------------------------+   |
|  | 🔍 Python                    |  | PYTHON                  |   |
|  |    Dev web | Niveau 72      |  | Contexte : Dev web      |   |
|  |    [━━━━━━░░░░] Conf: 0.85  |  | Famille : Technique     |   |
|  |                              |  |                         |   |
|  | 🔍 Gestion de projet         |  | ── SCORING ──           |   |
|  |    Transversal | Niveau 65   |  | Niveau estimé : 72.0    |   |
|  |    [━━━━━━░░░░] Conf: 0.70  |  | Confiance : 0.85        |   |
|  |                              |  | Formule : 72 × 0.85     |   |
|  | 🔍 JavaScript                |  |                         |   |
|  |    Dev web | Niveau 45 ↓    |  | ── DECAY ──             |   |
|  |    [━━━━░░░░░░] Conf: 0.60  |  | Niveau historique : 85  |   |
|  |    ⚠️ En déclin              |  | Niveau actuel : 72      |   |
|  |                              |  | Dernière pratique :     |   |
|  | 🔍 SQL                       |  |   14 mois               |   |
|  |    Data Analyst | Niveau 80  |  | λ = 0.12 / an           |   |
|  |    [━━━━━━━━░] Conf: 0.90   |  | Potentiel récup. : 78   |   |
|  |                              |  |                         |   |
|  | [ + Ajouter manuellement ]   |  | ── PREUVES ──           |   |
|  +------------------------------+  | 🎓 Diplôme (0.9) : 80   |   |
|                                    | 📅 06/2021              |   |
|                                    |                         |   |
|                                    | 💼 Exp. pro (0.7) : 70  |   |
|                                    | 📅 03/2022 → 05/2023    |   |
|                                    |                         |   |
|                                    | [ + Ajouter une preuve ]|   |
|                                    |                         |   |
|                                    | [ Modifier ] [ Archiver ]|   |
|                                    +-------------------------+   |
+------------------------------------------------------------------+
```

**Règles d'affichage :**
- Barre de niveau : verte si ≥70, orange si 40-69, rouge si <40
- Badge "⚠️ En déclin" si niveau_actuel < niveau_historique × 0.8
- Formule affichée en toutes lettres : "Niveau estimé = ((80×0.9)+(70×0.7))/(0.9+0.7) = 75.6"
- Confiance affichée avec étoiles visuelles (0.2 = 1 étoile, 1.0 = 5 étoiles)

---

## ÉCRAN 4 — GRAPHE (NetworkX + QGraphicsView)

**Layout :** Plein écran canvas interactif + sidebar flottante droite (320px, masquable).  
**Contrôles :** Zoom (molette / boutons +/-), recentrer, légende, curseur profondeur 1-5.

```
+------------------------------------------------------------------+
|  ≡  Cognitorium  ←  Graphe de compétences                        |
|  [ Profondeur : ●───●───○───○───○  2 ]  [ 🔄 Recentrer ]        |
+------------------------------------------------------------------+
|                                                                  |
|                         🟢 Python                                |
|                        /    |    \                               |
|                       /     |     \                              |
|                   🟢 Django 🟢 Pandas 🟢 Flask                   |
|                      |        |        |                         |
|                   🟢 SQL───🔵 Projet Data                       |
|                             /                                    |
|                        🟣 Data Scientist (ROME)                  |
|                                                                  |
|  +----------------------------------------------------------+    |
|  |  LÉGENDE          |  DÉTAIL DU NŒUD SÉLECTIONNÉ          |    |
|  |  🟢 Compétence    |                                      |    |
|  |  🔵 Projet        |  SQL                                  |    |
|  |  🟣 Métier ROME   |  Niveau : 80 | Confiance : 0.90      |    |
|  |  🟡 Formation     |  Famille : Technique                  |    |
|  |  🔴 Expérience    |  Contexte : Data Analyst              |    |
|  |  🟢 Objectif      |  Dernière pratique : 2 mois           |    |
|  |                   |  Preuves : 2 (Diplôme + Expérience)   |    |
|  |                   |                                      |    |
|  |                   |  [ Voir fiche complète ]             |    |
|  +----------------------------------------------------------+    |
|                                                                  |
+------------------------------------------------------------------+
```

**Interactions :**
- Clic nœud → sidebar détail avec niveau, preuves, decay, formules
- Glisser-déposer pour réorganiser
- Double-clic sur compétence → ouvre Écran 3 (Vue Compétence) filtré sur cette compétence
- Curseur profondeur : modifie dynamiquement le sous-graphe affiché (BFS depuis nœuds actifs)

---

## ÉCRAN 5 — ÉDITEUR CV (3 modèles + Export PDF)

**Layout :** Split vertical : panneau gauche (édition) / panneau droit (prévisualisation PDF).  
**Modèles switchables par onglets :** Classique | Moderne | ATS.

```
+------------------------------------------------------------------+
|  ≡  Cognitorium  ←  Générateur de CV                             |
|  [ Classique ] [ Moderne ] [ ATS ]    [ 📄 Exporter PDF ]       |
+------------------------------------------------------------------+
|  +---------------------------+  +-----------------------------+  |
|  |  🎯 Ciblage (optionnel)   |  |  MARTIN DUPONT              |  |
|  |  Métier visé : [Data      |  |  martindupont@email.com     |  |
|  |   Scientist ▼ ]           |  |  Paris, France              |  |
|  |                           |  |                             |  |
|  |  ── SECTIONS ──           |  |  RÉSUMÉ                     |  |
|  |  ☑ Contact                |  |  Développeur Python avec    |  |
|  |  ☑ Résumé professionnel   |  |  4 ans d'expérience...      |  |
|  |  ☑ Compétences            |  |                             |  |
|  |  ☑ Expériences            |  |  COMPÉTENCES                |  |
|  |  ☑ Formations             |  |  • Python (niv. 72)         |  |
|  |  ☑ Langues                |  |  • SQL (niv. 80) ★          |  |
|  |  ☑ Références             |  |  • Gestion de projet        |  |
|  |                           |  |                             |  |
|  |  [ Réorganiser ↑↓ ]       |  |  EXPÉRIENCES                |  |
|  |                           |  |  • Lead Dev — ABC Corp      |  |
|  |  ── OPTIONS ATS ──        |  |    03/2022 → 05/2023        |  |
|  |  Police : [Arial ▼]       |  |    - Développement API      |  |
|  |  Sans colonnes : ☑        |  |    - Architecture data      |  |
|  |  Texte brut : ☑           |  |                             |  |
|  |                           |  |  FORMATIONS                 |  |
|  |  [ Réinitialiser ]        |  |  • Licence Informatique     |  |
|  |                           |  |    Université Paris-Saclay  |  |
|  +---------------------------+  +-----------------------------+  |
+------------------------------------------------------------------+
```

**Spécificités par modèle :**
- **Classique** : Mise en page traditionnelle, en-tête centré, sections avec lignes de séparation
- **Moderne** : Bandeau latéral couleur, icônes, hiérarchie visuelle aérée
- **ATS** : Colonne unique strict, police Arial/Calibri, pas de tableau, pas d'image, sections exactes : Contact → Summary → Skills → Experience → Education → References

**Ciblage métier :** Si un métier ROME est sélectionné, les compétences alignées sont surlignées en vert dans la prévisualisation et réordonnées en haut de la liste.

---

## ÉCRAN 6 — TIMELINE / PARCOURS (Édition interactive)

**Layout :** Ligne temporelle horizontale centrale, événements positionnés verticalement (alternance haut/bas).  
**Sidebar :** Apparaît à droite au clic sur un événement (pas de popup).

```
+------------------------------------------------------------------+
|  ≡  Cognitorium  ←  Mon Parcours    [ + Ajouter un événement ]  |
+------------------------------------------------------------------+
|                                                                  |
|                    🎓 Licence Info                               |
|                   09/2018 ── 06/2021                             |
|  ───────────────────●───────────────────────────────────────     |
|                     |                                            |
|                     |      💼 Développeur Web                    |
|                     |      07/2021 ── 02/2022                    |
|                     |     ●───────────────────────────────       |
|                     |     |                                      |
|                     |     |            💼 Lead Developer         |
|                     |     |            03/2022 ── 05/2023        |
|                     |     |           ────────────────●          |
|                     |     |                            |         |
|                     |     |                            |  📜 Certif|
|                     |     |                            |  06/2023  |
|                     |     |                            |     ●    |
|                     |     |                            |     |    |
|                     |     |                            |  🎯 Projet|
|                     |     |                            |  01/2024  |
|                     |     |                            |     ●    |
|                     |     |                            |          |
|                     |     |                            |  💼 Freel.|
|                     |     |                            |  06/2024  |
|                     |     |                            |     ●    |
|  ───────────────────┴─────┴────────────────────────────┴────     |
|                                                                  |
|  +----------------------------------------------------------+    |
|  |  SIDEBAR ÉDITION — Lead Developer                        |    |
|  |  [ Titre : Lead Developer              ]                 |    |
|  |  [ Organisation : ABC Corp             ]                 |    |
|  |  [ Début : 03/2022 ] [ Fin : 05/2023 ]                   |    |
|  |  [ Description :                       ]                 |    |
|  |   Encadrement de 3 devs, architecture...                 |    |
|  |                                                          |    |
|  |  Compétences détectées :                                 |    |
|  |  ☑ Python  ☑ Gestion d'équipe  ☑ Architecture           |    |
|  |  ☐ Scrum (refuser)                                       |    |
|  |                                                          |    |
|  |  [ 💾 Enregistrer ] [ 🗑 Supprimer ] [ ❌ Fermer ]       |    |
|  +----------------------------------------------------------+    |
+------------------------------------------------------------------+
```

**Interactions :**
- Clic événement → sidebar avec formulaire d'édition + compétences extraites
- Coche/décoche des compétences détectées → met à jour la table `competence_context`
- Glisser-déposer pour réordonner (met à jour `ordre_affichage`)
- Zoom temporel : molette pour étendre/réduire la fenêtre visible
- Double-clic sur une compétence extraite → ouvre Écran 3 préfiltré

---

## Notes transversales pour les développeurs front

1. **Pas de popups modaux bloquants** : Toute action d'édition passe par la sidebar droite. Seuls les messages de confirmation destructeurs (suppression compte, restauration backup) peuvent utiliser une modale.
2. **État vide (Empty state)** : Chaque écran doit avoir un état vide illustré avec un bouton d'action primaire clair.
3. **Feedback immédiat** : Toute sauvegarde déclenche un toast discret (3s, coin inférieur droit).
4. **Accessibilité MVP** : Tabulation logique, contrastes respectés (WCAG AA minimum), textes alternatifs sur les icônes.
5. **Responsive** : Minimum 1024×600. Sur largeur < 900px, la sidebar passe en overlay plein écran.
