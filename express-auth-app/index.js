const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const crypto = require('crypto-js');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

const isValidPassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/login');
  } else {
    next();
  }
};

app.get('/', redirectLogin, (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="/css/styles.css">
      <title>Accueil</title>
    </head>
    <body>
      <div class="container">
        <h2>Bienvenue, ${req.session.username}</h2>
        <a href="/logout">Déconnexion</a>
      </div>
    </body>
    </html>
  `);
});

app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="/css/styles.css">
      <title>Login</title>
    </head>
    <body>
      <div class="container">
        <h2>Login</h2>
        <form method="post" action="/login">
          <input type="text" id="username" name="username" placeholder="Nom d'utilisateur" required><br>
          <input type="password" id="password" name="password" placeholder="Mot de passe" required><br>
          <button type="submit">Login</button>
        </form>
        <a href="/register">Register</a>
      </div>
    </body>
    </html>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.userId = user.id;
      req.session.username = username;
      res.redirect('/');
    } else {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="/css/styles.css">
          <title>Login</title>
        </head>
        <body>
          <div class="container">
            <h2>Nom d'utilisateur ou mot de passe incorrect</h2>
            <a href="/login">Réessayer</a>
          </div>
        </body>
        </html>
      `);
    }
  });
});

app.get('/register', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="/css/styles.css">
      <title>Register</title>
    </head>
    <body>
      <div class="container">
        <h2>Register</h2>
        <form method="post" action="/register">
          <input type="text" id="username" name="username" placeholder="Nom d'utilisateur" required><br>
          <input type="password" id="password" name="password" placeholder="Mot de passe" required><br>
          <input type="text" id="firstName" name="firstName" placeholder="Prénom" required><br>
          <input type="text" id="lastName" name="lastName" placeholder="Nom de famille" required><br>
          <input type="text" id="phoneNumber" name="phoneNumber" placeholder="Numéro de téléphone" required><br>
          <button type="submit">Register</button>
        </form>
        <a href="/login">Login</a>
      </div>
    </body>
    </html>
  `);
});

app.post('/register', (req, res) => {
  const { username, password, firstName, lastName, phoneNumber } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (user) {
      return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="/css/styles.css">
          <title>Register</title>
        </head>
        <body>
          <div class="container">
            <h2>Utilisateur déjà existant</h2>
            <a href="/register">Réessayer</a>
          </div>
        </body>
        </html>
      `);
    }
    if (!isValidPassword(password)) {
      return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="/css/styles.css">
          <title>Register</title>
        </head>
        <body>
          <div class="container">
            <h2>Le mot de passe doit contenir au moins 8 caractères, avec au moins une majuscule, une minuscule, un chiffre et un caractère spécial.</h2>
            <a href="/register">Réessayer</a>
          </div>
        </body>
        </html>
      `);
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const encryptedFirstName = crypto.AES.encrypt(firstName, 'yourSecretKey').toString();
    const encryptedLastName = crypto.AES.encrypt(lastName, 'yourSecretKey').toString();
    const encryptedPhoneNumber = crypto.AES.encrypt(phoneNumber, 'yourSecretKey').toString();
    db.run('INSERT INTO users (id, username, password, firstName, lastName, phoneNumber) VALUES (?, ?, ?, ?, ?, ?)', 
      [Date.now().toString(), username, hashedPassword, encryptedFirstName, encryptedLastName, encryptedPhoneNumber], (err) => {
        if (err) {
          return res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link rel="stylesheet" href="/css/styles.css">
              <title>Register</title>
            </head>
            <body>
              <div class="container">
                <h2>Erreur lors de l'enregistrement de l'utilisateur</h2>
                <a href="/register">Réessayer</a>
              </div>
            </body>
            </html>
          `);
        }
        res.redirect('/login');
    });
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('sid');
    res.redirect('/login');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
