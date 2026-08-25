# raw/

Dossier fourre-tout pour les **données brutes du projet**, en vrac.

Réintégré depuis `arena/01a034f2` (commit `383b86b`) — sources ROME, fiches PDF,
maquettes HTML, CV, docs fondateurs. Le fichier d'identifiants en clair n'a
**pas** été repris (voir `.gitignore`).

## À quoi il sert

- Notes, exports, dumps, captures, documents de travail…
- Données non traitées / non nettoyées qui ne sont **pas** importées par `src/`
- **Exception utile :** les XLSX officiels France Travail ci-dessous alimentent
  `scripts/build_rome_data.py` → `src/data/romeData.ts`

## Sources ROME (régénération)

```bash
python3 scripts/build_rome_data.py
```

| Fichier | Rôle |
|---|---|
| `250528-fiches-rome-26m06-tag-pour-diffusion.xlsx` | 1 911 fiches taguées |
| `260611-arborescence-simplifiee-des-competences.xlsx` | compétences → codes ROME |
| `260609-ref-formacode-v14-rome-26m06-v61-open-data.xlsx` | mapping FORMACODE |

## Conventions

- Rien ici n'est importé directement par l'application (`src/`, `server.ts`).
- Sous-dossiers libres.
- Secrets / identifiants : **jamais** versionnés (`raw/identifiants_cognitorium*.json` est ignoré).
