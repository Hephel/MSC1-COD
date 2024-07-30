# Express.js Authentication App

Cette application est un exemple simple d'authentification avec Express.js. Elle permet aux utilisateurs de s'enregistrer, de se connecter et d'accéder à une page d'accueil protégée s'ils sont connectés.

## Fonctionnalités

- Enregistrement des utilisateurs avec vérification de la politique de mot de passe.
- Connexion des utilisateurs avec vérification des mots de passe cryptés.
- Stockage sécurisé des informations de l'utilisateur (prénom, nom de famille, numéro de téléphone) avec chiffrement.
- Accès protégé à une page d'accueil.
- Déconnexion des utilisateurs.

## Prérequis

- Node.js (version 12 ou supérieure)
- npm (version 6 ou supérieure)

## Installation

1. Clonez ce dépôt :

    ```bash
    git clone https://github.com/votre-utilisateur/express-auth-app.git
    cd express-auth-app
    ```

2. Installez les dépendances :

    ```bash
    npm install
    ```

## Démarrage de l'application

1. Démarrez le serveur :

    ```bash
    node index.js
    ```

2. Ouvrez votre navigateur et accédez à `http://localhost:3000`

## Structure des fichiers

- `index.js` : Le fichier principal du serveur Express.js.
- `database.js` : Le fichier de configuration et d'initialisation de la base de données SQLite.
- `public/css/styles.css` : Le fichier de styles CSS pour les pages HTML.

## Utilisation

### Enregistrement

1. Accédez à `http://localhost:3000/register`.
2. Remplissez le formulaire d'enregistrement avec les informations suivantes :
    - Nom d'utilisateur
    - Mot de passe (qui respecte la politique de mot de passe)
    - Prénom
    - Nom de famille
    - Numéro de téléphone
3. Cliquez sur "Register".

### Connexion

1. Accédez à `http://localhost:3000/login`.
2. Remplissez le formulaire de connexion avec votre nom d'utilisateur et votre mot de passe.
3. Cliquez sur "Login".

### Page d'accueil protégée

- Une fois connecté, vous serez redirigé vers la page d'accueil protégée où vous verrez un message de bienvenue avec votre nom d'utilisateur.
- Pour accéder directement à cette page, accédez à `http://localhost:3000`.

### Déconnexion

- Cliquez sur le lien "Déconnexion" sur la page d'accueil pour vous déconnecter.

## Sécurité

- Les mots de passe sont hachés avec `bcryptjs` avant d'être stockés.
- La politique de mot de passe est vérifiée avant d'accepter un nouvel utilisateur.
- Les informations sensibles (prénom, nom de famille, numéro de téléphone) sont chiffrées avec `crypto-js` avant d'être stockées.
- Les routes sensibles sont protégées par des sessions.

## Dépendances

- `express` : Framework web pour Node.js.
- `express-session` : Middleware de gestion des sessions pour Express.
- `body-parser` : Middleware pour parser les données des formulaires.
- `bcryptjs` : Bibliothèque pour le hachage des mots de passe.
- `crypto-js` : Bibliothèque pour le chiffrement des données.
- `sqlite3` : Module SQLite pour Node.js.

