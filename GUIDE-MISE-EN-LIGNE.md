# Mettre Spot en ligne et synchroniser les appareils

Deux services gratuits : **GitHub Pages** héberge l'application, **Firebase** garde les données
pour que Charles, Clara et toi voyiez la même chose sur tous les appareils.
Compte environ 30 minutes. Tout se fait dans le navigateur.

## Étape 1 — La base de données (Firebase)

1. Va sur https://console.firebase.google.com et connecte-toi avec un compte Google.
2. Clique **Créer un projet**. Nom : `spot-devoirs`. Désactive Google Analytics (inutile). Clique **Créer le projet**.
3. Dans le menu de gauche, ouvre **Créer** (Build) → **Firestore Database** → **Créer une base de données**.
   - Emplacement : `northamerica-northeast1 (Montréal)`.
   - Mode : choisis **Mode test** pour l'instant, puis **Créer**.
4. Dans Firestore, ouvre l'onglet **Règles** et remplace tout le texte par ceci, puis clique **Publier** :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /familles/{code} {
      allow read, write: if code.size() >= 12;
    }
  }
}
```

   Ces règles n'autorisent que les familles qui connaissent un code d'au moins 12 caractères.

5. Clique sur la roue dentée en haut à gauche → **Paramètres du projet**. Descends jusqu'à **Vos applications**
   et clique sur l'icône **</>** (Web).
   - Pseudo de l'application : `spot`. Ne coche pas Firebase Hosting. Clique **Enregistrer l'application**.
   - Firebase affiche un bloc qui commence par `const firebaseConfig = {`. **Copie tout ce bloc.**
6. Ouvre le fichier `firebase-config.js` du dossier Projet Spot avec le Bloc-notes.
   Remplace la ligne `const FIREBASE_CONFIG = null;` par le bloc copié, en renommant `firebaseConfig` en `FIREBASE_CONFIG`.
   Le résultat ressemble à :

```
const FIREBASE_CONFIG = {
  apiKey: "AIzaSy…",
  authDomain: "spot-devoirs.firebaseapp.com",
  projectId: "spot-devoirs",
  storageBucket: "spot-devoirs.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123"
};
```

   Enregistre le fichier. (Cette clé n'est pas un secret : elle identifie seulement ton projet. La protection vient des règles et du code famille.)

## Étape 2 — L'hébergement (GitHub Pages)

1. Va sur https://github.com et crée un compte (ou connecte-toi). Note bien ton **nom d'utilisateur**.
2. Clique le **+** en haut à droite → **New repository**.
   - Repository name : `spot`. Laisse **Public**. Clique **Create repository**.
3. Sur la page qui s'ouvre, clique le lien **uploading an existing file**.
4. Ouvre le dossier Projet Spot dans l'Explorateur Windows. Sélectionne **tous les fichiers et le dossier `icons`**
   (pas le dossier caché `.claude`) et glisse-les dans la zone de la page GitHub.
   Attends que tous les fichiers apparaissent dans la liste, puis clique **Commit changes** en bas.
5. Dans le dépôt, ouvre **Settings** (onglet en haut) → **Pages** (menu de gauche).
   - Source : **Deploy from a branch**. Branch : **main**, dossier **/ (root)**. Clique **Save**.
6. Attends 1 à 2 minutes, puis rafraîchis la page Pages : l'adresse de ton application apparaît, du genre
   `https://TON-NOM.github.io/spot/`. Ouvre-la pour vérifier.

## Étape 3 — Sur chaque appareil

1. Ouvre l'adresse `https://TON-NOM.github.io/spot/` dans le navigateur de l'appareil.
2. Spot demande le **code famille**. Invente un code long la première fois, par exemple `bourgeois-spot-2026`,
   et utilise exactement le même sur tous les appareils. Note-le quelque part.
3. Ajoute Spot à l'écran d'accueil pour avoir une vraie icône :
   - **iPad / iPhone (Safari)** : bouton Partager (carré avec flèche) → **Sur l'écran d'accueil**.
   - **Android (Chrome)** : menu ⋮ → **Ajouter à l'écran d'accueil** ou **Installer l'application**.
   - **Windows (Edge ou Chrome)** : icône d'installation à droite de la barre d'adresse, ou menu → **Applications** → **Installer**.

À partir de là, tout est synchronisé : le plan du lundi entré sur ton téléphone apparaît sur la tablette,
et les points gagnés par Clara se voient sur ton PC. L'application fonctionne aussi hors ligne une fois ouverte une
première fois, et rattrape la synchronisation au retour d'Internet.

## Mettre l'application à jour plus tard

Quand un fichier change (nouvelle version de Spot, correction d'un mot) :
dans le dépôt GitHub, **Add file** → **Upload files**, glisse les fichiers modifiés, **Commit changes**.
Les anciens fichiers sont remplacés. L'application se met à jour sur les appareils au prochain lancement avec Internet.

## Si quelque chose ne marche pas

- **« Non configurée » dans Réglages → Synchronisation** : `firebase-config.js` contient encore `null`, ou le fichier n'a pas été envoyé sur GitHub.
- **« Erreur de connexion »** : vérifie les règles Firestore (étape 1.4) et que le code famille a au moins 12 caractères.
- **La page GitHub affiche 404** : attends 2 minutes de plus, ou vérifie que `index.html` est bien à la racine du dépôt.
- **Deux appareils affichent des choses différentes** : ferme et rouvre l'application sur celui qui est en retard.
