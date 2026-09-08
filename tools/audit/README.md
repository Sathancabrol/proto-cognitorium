# Sondes d'audit — Cognitorium

Outils de vérification **réelle** (pas de lecture seule) utilisés pour produire
`docs/AUDIT_2026-09-08.md` et `docs/TRACEABILITE.csv`.

Chaque sonde charge les **vrais modules de `src/`** via le pipeline Vite
(`ssrLoadModule`) et les **vraies données**. Aucune logique n'est réimplémentée.

```bash
npm install                       # dépendances de l'application (vite, react…)
npm install --no-save jsdom       # dépendance des sondes uniquement (voir tools/audit/package.json)

node tools/audit/runtime-probe.mjs      # monte les 32 composants réels sur les 6 profils
                                        # → 143 rendus, 0 crash, 0 erreur console
node tools/audit/interaction-probe.mjs  # clics réels : validation, recherche ROME,
                                        # distillateur, persistance, bascule de profil
node tools/audit/data-audit.mjs         # intégrité des 6 profils + moteurs decay/ROME
node tools/audit/rome-diagnostic.mjs    # exact vs fuzzy, garde-fou exactCount,
                                        # recherche par code, horizons codés en dur
node tools/audit/content-audit.mjs      # inventaire des catalogues + texte réellement affiché
node tools/audit/fix-simulation.mjs     # chiffre l'impact des correctifs ROME
                                        # (ne modifie AUCUN fichier livré)
```

Les sorties JSON sont écrites dans `tools/audit/out/` (non versionné).

## Usage en CI

`runtime-probe.mjs` est déjà un harnais de non-régression : il rend tous les
composants et capture la moindre exception React. Il manque l'assertion —
voir `docs/ROADMAP_2026-09-08.md` §G3.

## Limites connues

- Les liens externes ne peuvent pas être testés depuis un environnement sans
  sortie HTTPS (`CONTENT-04`).
- Les sondes s'exécutent **sans `GEMINI_API_KEY`** : c'est volontaire, c'est le
  mode de repli que rencontre la preview publique (`IA-01`).
- Le rendu se fait dans jsdom : les `<canvas>` sont stubbés, donc le *dessin*
  des graphes n'est pas validé — seulement leur montage et leur logique.
