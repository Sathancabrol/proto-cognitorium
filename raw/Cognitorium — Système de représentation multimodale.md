# Cognitorium — Système de représentation multimodale

> **Document de référence — Representation Engine**
>
> Une information complexe ne doit pas être enfermée dans une visualisation unique. Cognitorium doit pouvoir représenter un même objet selon plusieurs projections coordonnées, choisies en fonction de la nature des données, de la tâche cognitive, de l'échelle, de l'incertitude et du contexte.

---

# 1. Principe fondamental

Cognitorium ne doit pas être pensé comme une application possédant « un graphe ».

Il doit être conçu comme un **moteur de représentation multimodale** capable de transformer une information en plusieurs représentations adaptées.

```text
INFORMATION
    ↓
ANALYSE SÉMANTIQUE
    ↓
STRUCTURE DES DONNÉES
    ↓
TÂCHE COGNITIVE
    ↓
ENCODAGE
    ↓
PROJECTION
    ↓
INTERACTION
    ↓
VUES COORDONNÉES
```

Le principe central est :

> **Une même information peut avoir plusieurs représentations valides.**

Le choix ne doit donc pas être :

> « Quel graphique utiliser ? »

mais :

> **« Quelle représentation permet le mieux de comprendre cette information pour cette tâche ? »**

---

# 2. Modèle formel

Une visualisation peut être décrite par :

```text
V = (D, E, I)
```

où :

- `D` = structure et sémantique des données ;
- `E` = encodage visuel ou multisensoriel ;
- `I` = interactions et mécanismes de coordination.

Une visualisation devient multimodale lorsqu'elle combine plusieurs modalités informationnelles ou plusieurs modalités de restitution.

Exemples :

- géolocalisation ;
- mesures ;
- texte ;
- image ;
- audio ;
- vidéo ;
- relations ;
- données probabilistes ;
- son ;
- haptique ;
- interaction vocale.

---

# 3. Ne pas confondre les niveaux

Les termes `2D`, `3D`, `4D`, `isométrique`, `Gaussien`, `carte`, `graphe` ne désignent pas la même chose.

| Concept | Niveau |
|---|---|
| Carte | Type de représentation |
| Graphe | Type de représentation |
| 2D | Géométrie |
| 3D | Géométrie |
| 4D | Dimension supplémentaire, généralement temps |
| Isométrique | Projection |
| Perspective | Projection |
| Gaussien | Modèle probabiliste |
| Position | Canal d'encodage |
| Couleur | Canal d'encodage |
| Taille | Canal d'encodage |
| Texture | Canal d'encodage |
| Animation | Encodage / interaction temporelle |
| Zoom | Interaction |
| Filtre | Interaction |
| Multi-vue | Architecture |

Cette distinction est fondamentale pour construire un moteur générique.

---

# 4. Les dimensions de représentation

## 4.1 0D — État / valeur

Une information ponctuelle.

Exemples :

- KPI ;
- score ;
- badge ;
- jauge ;
- indicateur.

---

## 4.2 1D — Axe

Une dimension principale.

Exemples :

- timeline ;
- séquence ;
- axe numérique ;
- distribution ;
- rang.

---

## 4.3 2D — Plan

Deux dimensions :

```text
(x, y)
```

Représentations :

- carte ;
- scatterplot ;
- heatmap ;
- matrice ;
- diagramme ;
- graphe.

La 2D est généralement privilégiée lorsque la comparaison précise est importante.

---

## 4.4 2.5D — Surface + hauteur

Une représentation plane à laquelle est ajoutée une dimension de hauteur.

Exemples :

- relief ;
- terrain ;
- surface de densité ;
- barres 3D.

---

## 4.5 3D — Espace volumique

Trois dimensions :

```text
(x, y, z)
```

Applications :

- architecture ;
- géologie ;
- anatomie ;
- environnement ;
- bâtiments ;
- volumes ;
- simulation.

La 3D est particulièrement pertinente lorsque la profondeur ou la structure verticale constitue l'objet même de l'analyse.

Elle n'est cependant pas nécessairement meilleure que la 2D :

**2D → comparaison**

**3D → structure spatiale**

---

# 5. Projections

La projection détermine comment un espace est rendu.

## Perspective

- points de fuite ;
- profondeur perceptuelle ;
- objets lointains plus petits.

Adaptée à :

- immersion ;
- environnement ;
- visite virtuelle.

## Orthographique

- absence de perspective ;
- meilleure conservation des alignements.

Adaptée à :

- plans ;
- schémas techniques ;
- analyse spatiale.

## Isométrique

Projection 2D d'un espace 3D.

Caractéristiques :

- trois axes visibles ;
- parallélismes conservés ;
- représentation compacte ;
- lecture pseudo-3D.

Applications possibles dans Cognitorium :

> **campus des compétences**

> **monde des connaissances**

> **environnement cognitif navigable**

L'isométrie est donc une **projection**, et non une quatrième dimension.

---

# 6. Temps et « 4D »

Dans le contexte de la visualisation :

```text
4D = (x, y, z, t)
```

Le quatrième axe représente généralement le temps.

Plusieurs représentations sont possibles.

### Animation

Le temps est représenté par le mouvement.

### Timeline

Le temps devient un axe explicite.

### Small multiples

Chaque état temporel devient une vue.

### Trajectoire

```text
t0 → t1 → t2 → t3
```

### Space-time cube

L'espace et le temps sont représentés simultanément dans une structure géométrique.

### Scrubber temporel

L'utilisateur parcourt l'évolution avec un curseur.

---

# 7. Données multidimensionnelles

Une entité peut être décrite par :

```text
x, y, z, t, v1, v2, v3, ..., vn
```

Les représentations possibles sont :

- coordonnées parallèles ;
- scatterplot matrix ;
- radar ;
- glyphes ;
- heatmap ;
- PCA ;
- UMAP ;
- t-SNE.

Attention :

> Une projection de haute dimension vers 2D ou 3D est une transformation et peut introduire des distorsions.

Elle sert principalement à explorer des structures de similarité.

---

# 8. Données relationnelles

Lorsque l'information est définie par ses relations, la représentation spatiale n'est plus nécessairement prioritaire.

Exemple :

```text
Compétence A
     │
     ├── prérequis → B
     ├── prérequis → C
     └── associée → D
```

Représentations :

- graphe nœuds-liens ;
- arbre ;
- matrice d'adjacence ;
- Sankey ;
- chord diagram ;
- alluvial.

Pour Cognitorium :

```text
Métier
  ↓
Mission
  ↓
Compétence
  ↓
Capacité
  ↓
Connaissance
```

Le graphe est donc une **projection relationnelle** du modèle cognitif.

---

# 9. Hiérarchies

Pour les structures parent-enfant :

- arbre ;
- treemap ;
- sunburst ;
- icicle.

Exemple :

```text
Domaine
 ├── Sous-domaine A
 │    ├── Compétence A1
 │    └── Compétence A2
 │
 └── Sous-domaine B
      ├── Compétence B1
      └── Compétence B2
```

---

# 10. Flux

Lorsqu'on cherche à comprendre des transitions :

- Sankey ;
- alluvial ;
- flux géographique ;
- trajectoires.

Exemple Cognitorium :

```text
Formation
    ↓
Compétence
    ↓
Mission
    ↓
Métier
```

ou :

```text
Métier A
   ↓
Transition
   ↓
Métier B
```

---

# 11. Données statistiques

## Valeur

- bar chart ;
- dot plot ;
- line chart.

## Distribution

- histogramme ;
- boxplot ;
- violin plot ;
- KDE ;
- ridgeline.

## Corrélation

- scatterplot ;
- scatterplot matrix.

## Composition

- barres empilées ;
- treemap.

## Évolution

- courbe ;
- area chart ;
- horizon chart.

---

# 12. Probabilité et incertitude

Une valeur ne doit pas nécessairement être représentée comme certaine.

Pour une distribution gaussienne :

```text
X ~ N(μ, σ²)
```

où :

- `μ` = estimation centrale ;
- `σ` = dispersion.

Une représentation robuste devrait pouvoir afficher :

```text
Estimation
    +
Intervalle
    +
Distribution
    +
Provenance
    +
Hypothèses
    +
Scénarios
```

## Représentations

| Incertitude | Représentation |
|---|---|
| Valeur | point + intervalle |
| Distribution | densité / violin |
| Temporelle | bande / fan chart |
| Spatiale | contour probabiliste |
| Catégorielle | probabilités |
| Relationnelle | transparence / épaisseur |
| Scénarios | small multiples / enveloppes |

Le principe :

> **Ne jamais masquer l'incertitude derrière une valeur unique lorsque cette incertitude est décisionnelle.**

---

# 13. Encodages visuels

Une visualisation repose sur des marques :

- points ;
- lignes ;
- surfaces ;
- volumes ;
- textes ;
- glyphes ;
- régions.

Ces marques utilisent différents canaux.

| Canal | Usage principal |
|---|---|
| Position | comparaison quantitative |
| Longueur | magnitude |
| Taille | ordre de grandeur |
| Aire | poids |
| Volume | contexte 3D |
| Teinte | catégorie |
| Valeur lumineuse | intensité / ordre |
| Forme | catégorie |
| Orientation | direction |
| Texture | catégorie / incertitude |
| Transparence | densité / incertitude |
| Flou | précision |
| Mouvement | changement |
| Son | événement / alerte |
| Haptique | seuil / événement |

---

# 14. Hiérarchie perceptive

Pour une comparaison quantitative :

```text
Position
   ↓
Longueur
   ↓
Aire
   ↓
Angle
   ↓
Volume
```

La position sur une échelle commune doit être privilégiée lorsque la précision est importante.

Donc :

### Pour comparer

Préférer :

- position ;
- longueur ;
- axes communs.

### Pour catégoriser

Préférer :

- teinte ;
- forme ;
- texture.

### Pour représenter l'incertitude

Utiliser :

- intervalle ;
- densité ;
- texture ;
- transparence ;
- enveloppe.

---

# 15. Règle des canaux

Une même marque graphique ne devrait généralement pas porter un nombre excessif de variables simultanément.

Mauvais exemple :

```text
Carte 3D
+ couleur
+ taille
+ forme
+ transparence
+ texture
+ ombre
+ animation
+ labels
```

Le résultat devient difficile à décoder.

Meilleure stratégie :

```text
CARTE
→ position

ENCODAGE PRINCIPAL
→ valeur

VUE SECONDAIRE
→ détails

PANNEAU
→ preuves / sources

VUE LIÉE
→ relations
```

---

# 16. Taxonomie générale des données

| Données | Représentations |
|---|---|
| Catégorielles | barres, symboles, couleurs |
| Ordinales | barres triées, échelles |
| Quantitatives | barres, lignes, scatterplots |
| Temporelles | timeline, courbes, animation |
| Spatiales 2D | cartes, heatmaps |
| Spatiales 3D | terrain, maillage, volume |
| Spatio-temporelles | trajectoires, animation, space-time cube |
| Relationnelles | graphe, matrice, Sankey |
| Hiérarchiques | arbre, treemap, sunburst |
| Multidimensionnelles | PCA, UMAP, parallel coordinates |
| Textuelles | documents, annotations, réseaux sémantiques |
| Audio | waveform, spectrogramme |
| Vidéo | timeline, storyboard |
| Images | segmentation, overlays, cartes de saillance |
| Incertaines | intervalles, densité, probabilités |

---

# 17. Multimodalité

La multimodalité peut exister à plusieurs niveaux.

| Niveau | Exemple |
|---|---|
| Multivarié | niveau + confiance + durée |
| Multi-structurel | graphe + matrice + timeline |
| Multi-source | ROME + CV + évaluations |
| Multi-sensoriel | GPS + audio + image |
| Multi-sortie | écran + son + haptique |
| Multi-vue coordonnée | carte + graphe + timeline + documents |

Le niveau particulièrement pertinent pour Cognitorium est :

# Multi-vue coordonnée

Chaque représentation reste spécialisée, mais les vues restent liées.

---

# 18. Architecture de fusion multimodale

## Fusion précoce

Les données sont fusionnées avant leur représentation.

```text
Source A ─┐
Source B ─┼→ Fusion → Modèle → Visualisation
Source C ─┘
```

Avantage :

- synthèse ;
- recommandation ;
- calcul.

Risque :

- perte de traçabilité.

Il faut donc conserver :

- sources ;
- pondérations ;
- score ;
- confiance.

---

## Fusion visuelle intégrée

Plusieurs variables sont représentées dans une même scène.

Exemple :

```text
Carte
├── position → lieu
├── couleur → catégorie
├── luminosité → intensité
├── taille → volume
└── texture → incertitude
```

Avantage :

- forte contextualisation.

Risque :

- surcharge.

---

## Vues coordonnées

Chaque modalité conserve sa propre représentation.

```text
                    DONNÉE
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
      CARTE         GRAPHE        TEMPS
        │             │             │
        └─────────────┼─────────────┘
                      ↓
                 DOCUMENTS
```

Une sélection dans une vue est propagée aux autres.

```text
Sélection
   │
   ├── carte → localisation
   ├── timeline → période
   ├── graphe → voisinage
   ├── matrice → correspondances
   └── documents → preuves
```

**C'est l'architecture recommandée pour Cognitorium.**

---

# 19. Superposition à la demande

La vue principale doit rester lisible.

Les informations secondaires apparaissent par :

- clic ;
- survol ;
- recherche ;
- filtre ;
- zoom ;
- panneau contextuel ;
- drill-down.

Principe :

> **Vue d'ensemble → zoom et filtrage → détails à la demande.**

---

# 20. Multi-échelle

La représentation doit pouvoir changer selon le niveau d'analyse.

```text
MACRO
Univers
 ↓
Pays
 ↓
Région
 ↓
Ville
 ↓
Organisation
 ↓
Individu
 ↓
Compétence
 ↓
Sous-compétence
 ↓
MICRO
Preuve / observation
```

Une même donnée peut donc avoir plusieurs représentations selon le niveau.

---

# 21. Representation Engine

Cognitorium peut formaliser son moteur comme suit :

```text
                    DATA
                     │
                     ▼
             Semantic Analysis
                     │
          ┌──────────┼──────────┐
          │          │          │
       Modalité   Structure   Métadonnées
          │          │          │
          └──────────┼──────────┘
                     ▼
              Task Analysis
                     │
                     ▼
             Representation
                 Engine
                     │
      ┌──────────────┼──────────────┐
      │              │              │
   Spatial       Relational      Temporal
      │              │              │
   2D / 3D       Graph / Tree    Timeline
   Isometric     Matrix/Sankey   Animation
   Volume                         4D
      │              │              │
      └──────────────┼──────────────┘
                     │
               Statistical
                     │
          Distribution / Uncertainty
                     │
                     ▼
              Coordinated Views
                     │
                     ▼
                 User
```

---

# 22. Modèle de données conceptuel

Le moteur peut recevoir une description abstraite :

```json
{
  "entity": "compétence",
  "modalities": [
    "text",
    "numeric",
    "relational",
    "temporal"
  ],
  "dimensions": [
    "level",
    "confidence",
    "time"
  ],
  "relations": [
    "prerequisite",
    "related_to",
    "required_by"
  ],
  "uncertainty": {
    "enabled": true
  },
  "scale": {
    "min": "domain",
    "max": "evidence"
  },
  "task": "explore"
}
```

Le Representation Engine peut alors proposer :

```text
PRIMARY
→ Graph

SECONDARY
→ Matrix

TEMPORAL
→ Timeline

STATISTICAL
→ Distribution

EVIDENCE
→ Document panel
```

---

# 23. Algorithme conceptuel de sélection

Le choix d'une représentation peut être formalisé :

```text
R* = argmax R Utility(R | D, T, U, S, C)
```

où :

- `R` = représentation candidate ;
- `D` = données ;
- `T` = tâche cognitive ;
- `U` = incertitude ;
- `S` = échelle ;
- `C` = contexte.

Le moteur cherche à maximiser :

```text
Compréhension
+ Précision
+ Comparabilité
+ Exploration
+ Traçabilité
```

et à minimiser :

```text
Occlusion
+ Surcharge
+ Ambiguïté
+ Charge cognitive
+ Perte d'information
```

---

# 24. Exemple : environnement

Prenons un environnement complexe.

Il contient :

- position ;
- altitude ;
- température ;
- bruit ;
- qualité de l'air ;
- personnes ;
- événements ;
- bâtiments ;
- incertitude ;
- historique.

Le système ne devrait pas choisir arbitrairement « une carte 3D ».

Il devrait produire :

```text
ENVIRONNEMENT
│
├── Où ?
│   └── Carte 2D
│
├── Quelle structure ?
│   └── 3D / Isométrique
│
├── Quelle évolution ?
│   └── Timeline / Animation
│
├── Où sont les concentrations ?
│   └── Heatmap
│
├── Quelle incertitude ?
│   └── Contours / Distribution
│
├── Quelles relations ?
│   └── Graphe
│
├── Quelle apparence ?
│   └── Image / Vidéo
│
├── Quel environnement sonore ?
│   └── Audio / Spectrogramme
│
└── Quels scénarios ?
    └── Simulation
```

Toutes ces vues peuvent représenter **le même environnement**.

---

# 25. Application à Cognitorium

La même logique peut être appliquée au modèle cognitif.

Une compétence peut être représentée comme :

### Graphe

```text
Compétence
├── prérequis
├── capacités associées
├── métiers
├── missions
└── formations
```

### Matrice

```text
                 Métier A  Métier B  Métier C
Compétence 1        ●         ●
Compétence 2                  ●         ●
Compétence 3        ●                   ●
```

### Timeline

```text
2022 ─── 2023 ─── 2024 ─── 2025 ─── 2026
          acquisition
                     consolidation
                              maîtrise
```

### Distribution

```text
Niveau estimé
       μ
       │
   ────┼────
      σ
```

### Carte

Uniquement lorsque la géographie est pertinente :

```text
Compétence
    ↓
Métier
    ↓
Territoire
    ↓
Opportunités
```

### Documents

```text
CV
│
├── expérience
├── formation
├── projet
└── preuve
```

---

# 26. Principe fondamental pour Cognitorium

> **Le graphe n'est pas le produit.**
>
> **Le modèle informationnel est le produit.**
>
> Le graphe, la carte, la matrice, la timeline, la 3D, l'isométrie, la distribution ou le document sont des **projections de ce modèle**.

C'est cette distinction qui permet à Cognitorium de devenir un véritable **HUB de cognition et d'information**, plutôt qu'une application spécialisée dans un seul type de visualisation.

---

# 27. Architecture finale

```text
┌──────────────────────────────────────────────┐
│                  COGNITORIUM                 │
│                                              │
│            INFORMATION MODEL                 │
│                                              │
│  Entities • Attributes • Relations • Events  │
│  Sources • Evidence • Confidence • Context   │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│             REPRESENTATION ENGINE            │
│                                              │
│  Analyse modalité                            │
│  Analyse structure                           │
│  Analyse tâche                               │
│  Analyse échelle                             │
│  Analyse incertitude                         │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│              PROJECTION LAYER                │
│                                              │
│  2D • 3D • Isometric • Temporal • Graph      │
│  Matrix • Map • Tree • Sankey • Distribution │
│  PCA • UMAP • Volume • Image • Audio • Video │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│             COORDINATED VIEWS                │
│                                              │
│   Carte ←→ Graphe ←→ Matrice ←→ Timeline    │
│              ↕                               │
│         Documents / preuves                  │
│              ↕                               │
│       Distribution / confiance               │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                 INTERACTION                  │
│                                              │
│ Zoom • Filter • Search • Select • Compare    │
│ Drill-down • Time • Scenario • Explain       │
└──────────────────────────────────────────────┘
```

---

# 28. Formule synthétique

La chaîne générale devient :

```text
MODALITÉ
    ↓
STRUCTURE
    ↓
DIMENSIONS
    ↓
TÂCHE COGNITIVE
    ↓
ENCODAGE
    ↓
PROJECTION
    ↓
INTERACTION
    ↓
VUE COORDONNÉE
```

Ou, sous forme conceptuelle :

> **Source → Modèle → Question → Représentation → Interaction → Compréhension**

---

# 29. Principe directeur

## Cognitorium doit représenter l'information, pas imposer une forme à l'information.

Une information multimodale doit pouvoir être :

- spatiale ;
- relationnelle ;
- temporelle ;
- multidimensionnelle ;
- probabiliste ;
- textuelle ;
- visuelle ;
- sonore ;
- interactive.

Et son mode d'affichage doit pouvoir changer dynamiquement selon :

- **ce que l'on regarde ;**
- **ce que l'on cherche ;**
- **le niveau d'abstraction ;**
- **la précision nécessaire ;**
- **l'incertitude ;**
- **le contexte ;**
- **les modalités disponibles.**

---

# 30. Architecture cible

```text
                   COGNITION / INFORMATION
                              │
                              ▼
                    ┌─────────────────┐
                    │ INFORMATION     │
                    │ MODEL           │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ REPRESENTATION  │
                    │ ENGINE          │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
           SPATIAL        RELATIONAL      TEMPORAL
              │              │              │
           2D / 3D       Graph / Matrix   Timeline
           Isometric     Tree / Sankey    Animation
           Volume                         4D
              │              │              │
              └──────────────┼──────────────┘
                             │
                    ┌────────▼────────┐
                    │ STATISTICAL /   │
                    │ PROBABILISTIC   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ MULTIMODAL      │
                    │ TEXT IMAGE AUDIO│
                    │ VIDEO SENSOR    │
                    └────────┬────────┘
                             │
                             ▼
                    COORDINATED VIEWS
                             │
                             ▼
                         UTILISATEUR
```

**Conclusion :** la véritable abstraction de Cognitorium n'est donc pas le *Skill Graph*, mais le **Cognitive Representation Engine** : un moteur capable de projeter un même modèle cognitif dans différentes géométries, structures, dimensions, modalités et niveaux d'abstraction, tout en maintenant les correspondances entre les vues. Le document source converge déjà vers cette architecture avec la recommandation explicite de la multi-vue coordonnée.