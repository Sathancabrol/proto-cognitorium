# COGNITORIUM — Version opérationnelle locale

## Lancer le projet

Aucune installation requise.

1. Télécharge `cognitorium.html`.
2. Double-clique dessus (ou ouvre-le depuis ton navigateur : `Fichier > Ouvrir`).
3. C'est tout — tout tourne en local, dans l'onglet, sans serveur ni backend.

Une connexion internet est nécessaire uniquement pour charger deux ressources externes via CDN : la police Inter/JetBrains Mono (Google Fonts) et la librairie D3.js (cdnjs). Si tu veux un fonctionnement 100% hors-ligne, ces deux fichiers peuvent être téléchargés et référencés en local — dis-le-moi si tu veux que je le fasse.

## Ce que fait réellement cette version

Elle fusionne les deux documents que tu as fournis :

- **COGNITORIUM_Specification_v1.md** — le connectome cognitif (réseaux → domaines → sous-domaines → capacités → micro-compétences), dont cette version reprend le design system exact (couleurs Void/Plasticity/Transfer, typographie Inter + JetBrains Mono).
- **Le document Cognitarium** (jumeau cognitif de parcours humain) — dont cette version reprend le modèle central : une expérience (formation, poste, projet) est un nœud relié explicitement aux compétences et processus cognitifs qu'elle mobilise.

Concrètement, le prototype affiche maintenant **deux couches reliées** :
- à gauche, la couche **Parcours** (5 expériences de démonstration : formation, emploi, encadrement d'équipe, pratique du piano, projet personnel) ;
- à droite, la couche **Cognition** (le connectome déjà livré précédemment) ;
- entre les deux, des **arêtes-pont** (couleur Transfer, violet) qui relient chaque expérience aux domaines cognitifs qu'elle mobilise réellement — c'est le cœur du modèle Cognitarium.

Le reste du fonctionnement (zoom sémantique, panneau à onglets, session N-back jouable, trajectoire avec incertitude, vue accessible en liste) est inchangé et pleinement fonctionnel.

## Ce que cette version n'est PAS

La spécification que tu as fournie décrit une **application complète** : rendu 3D en WebGPU avec pipeline de shaders (bloom, SSAO, tone mapping), backend en microservices (auth, connectome, protocoles, IA, analytics), base de données relationnelle, Web Workers pour le calcul de layout et de centralité, ML models pour les recommandations.

Rien de tout cela n'est réalisable comme fichier local unique livré dans une conversation — c'est un projet d'ingénierie de plusieurs mois avec une équipe dédiée. Cette version locale est un **prototype fonctionnel en 2D (SVG via D3.js)**, sans backend ni persistance : tout l'état (mesures, historique de session) vit en mémoire JavaScript et se réinitialise au rechargement de la page.

Ce que je peux faire à partir d'ici, selon ce qui t'intéresse le plus :
- **Étendre les données de démo** (plus d'expériences, plus de branches du connectome creusées en profondeur).
- **Faire persister l'état localement** (fichier JSON exporté/importé manuellement, puisque le stockage navigateur — localStorage — n'est pas utilisable dans ce type de livrable).
- **Démarrer une vraie base de code de projet** (structure de dossiers, `package.json`, composants séparés) que tu pourrais ouvrir dans un éditeur et faire évoluer toi-même vers la vision complète du document de spécification — c'est le chemin réaliste vers le WebGPU/backend décrits, mais ça dépasse ce qu'un seul fichier HTML peut porter.

Dis-moi laquelle de ces directions t'intéresse.
