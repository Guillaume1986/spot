# Spot — Mes devoirs

Application web pour rendre les devoirs ludiques, avec Spot le robot comme compagnon.
Deux profils : **Charles** (1re année) et **Clara** (3e année, Spot à lunettes mauves).
Aucune installation, aucun compte, 100 % hors ligne.

## Mettre en ligne et synchroniser

Voir `GUIDE-MISE-EN-LIGNE.md` : hébergement gratuit sur GitHub Pages, synchronisation des appareils avec Firebase, icône sur l'écran d'accueil des tablettes.

## Lancer l'application

Double-clique sur `index.html`. Edge recommandé pour la voix de Spot (voix « Natural » en français canadien).
L'écran d'accueil demande « Qui fait ses devoirs ? ». Chaque enfant a son Spot, son plan, ses points et ses trophées.
Le bouton avec le prénom en haut à gauche permet de changer d'enfant.

## Côté enfant

Spot accueille l'enfant par son prénom, parle à voix haute et change d'humeur selon les réponses.
Chaque mission réussie donne des points et des étoiles. Tous les 100 points, Spot gagne un accessoire visible dans « Trophées ».

### Missions de Charles (1re année)

| Mission | Ce que Charles fait | Vérifié par |
|---|---|---|
| Petits livres | Minuterie, puis le parent coche « vérifié et signé » | Parent |
| Cahier des sons | Touche toutes les lettres du son, lit syllabes et mots, Spot dicte et il trouve, lit les phrases | Spot + parent |
| Tempête de sons | Cartes roses, bleues, jaunes. « Spot vérifie » dit le son avec un mot repère | Charles |
| Mots-étiquettes | Le photographe, puis la pêche | Spot |
| Calligraphie | Trace la lettre et les mots dans les trottoirs, coche sa page | Parent |
| Grille de nombres | Touche le nombre que Spot dit, avant, après, + 10, − 10 | Spot |
| Relations spatiales | « Où est le ballon ? », « Mets le ballon sous la table » | Spot |

### Missions de Clara (3e année)

| Mission | Ce que Clara fait | Vérifié par |
|---|---|---|
| Lecture 15 minutes | Minuterie, puis le parent coche | Parent |
| Mots à écrire (listes 1.1 à 4.6, mots courants, blocs 1 à 5) | Spot dicte le mot, Clara l'écrit. Les accents comptent. Spot rappelle la règle de la liste | Spot |
| Conjugaison (aimer, finir, avoir, être, aller) | Lit le tableau, puis conjugue chaque personne au présent, imparfait, futur, conditionnel, futur proche | Spot |
| Tables (+ − × ÷) | Table choisie ou toutes mélangées, avec chronomètre et record à battre | Spot |
| Lecture des nombres (grilles 0 à 10 000) | Spot dicte des nombres à écrire, puis Clara lit à voix haute et le parent signe la grille | Spot + parent |
| Calcul | Grands nombres posés en colonne, terme manquant, comparer | Spot |
| Quiz | Grammaire (nom, déterminant, groupe du nom, adjectif, verbe, pronom, phrase…) et maths (Tam Tam) | Spot |

Communs aux deux : quiz et tâches à cocher.

## Côté parent

Bouton « Parent » en haut à droite. NIP par défaut **1234**, commun aux deux enfants.
En haut de la zone, deux onglets : Charles et Clara. Tout ce qui suit s'applique à l'enfant sélectionné.

- **Semaine** : missions par jour. Ajouter, modifier, réordonner, copier vers un autre jour (📋), vider.
- **Banque** : missions réutilisables (quiz, tables, calculs…).
- **Suivi** : points, historique, records de vitesse, remise à zéro de la semaine.
- **Réglages** : prénom, points par mission, NIP, apparence de Spot (couleur, lunettes), voix (choix, hauteur, vitesse, bips), export et import.

Chaque lundi, avec le nouveau plan d'étude, ajuste les missions existantes. Pour Charles : page du son, lettre, groupe d'étiquettes, grille.
Pour Clara : liste de vocabulaire, table à mémoriser, grille de lecture des nombres, pages de grammaire. Le titre se remplit tout seul si tu le laisses vide.

Les missions se remettent automatiquement à « non faites » chaque lundi. Les points restent.

## Fichiers

- `index.html` : page d'entrée
- `style.css` : apparence
- `contenu.js` : matériel de 1re année (sons, étiquettes, orthographe, calligraphie, quiz Numérik)
- `contenu-clara.js` : matériel de 3e année (listes de vocabulaire, conjugaison, grilles, quiz grammaire et Tam Tam)
- `data.js` : les deux profils et leurs plans par défaut
- `app.js` : logique (exercices, points, zone parent)

Les données sont dans le navigateur (localStorage). Pour changer d'appareil : Réglages → Exporter, puis Importer.
