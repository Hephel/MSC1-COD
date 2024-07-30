const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true
}));

const users = {};

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

const styles = `
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background-color: #f4f4f4;
    }
    .container {
      text-align: center;
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    input {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    button {
      width: 100%;
      padding: 10px;
      background: #007BFF;
      border: none;
      color: white;
      border-radius: 5px;
      cursor: pointer;
    }
    button:hover {
      background: #0056b3;
    }
    a {
      display: block;
      margin-top: 10px;
      color: #007BFF;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
`;

app.get('/', redirectLogin, (req, res) => {
  res.send(`
    ${styles}
    <div class="container">
      <h2>Bienvenue, ${req.session.username}</h2>
      <a href="/logout">Déconnexion</a>
    </div>
  `);
});

app.get('/login', (req, res) => {
  res.send(`
    ${styles}
    <div class="container">
      <h2>Login</h2>
      <form method="post" action="/login">
        <input type="text" id="username" name="username" placeholder="Nom d'utilisateur" required><br>
        <input type="password" id="password" name="password" placeholder="Mot de passe" required><br>
        <button type="submit">Login</button>
      </form>
      <a href="/register">Register</a>
    </div>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.userId = user.id;
    req.session.username = username;
    res.redirect('/');
  } else {
    res.send(`
      ${styles}
      <div class="container">
        <h2>Nom d'utilisateur ou mot de passe incorrect</h2>
        <a href="/login">Réessayer</a>
      </div>
    `);
  }
});

app.get('/register', (req, res) => {
  res.send(`
    ${styles}
    <div class="container">
      <h2>Register</h2>
      <form method="post" action="/register">
        <input type="text" id="username" name="username" placeholder="Nom d'utilisateur" required><br>
        <input type="password" id="password" name="password" placeholder="Mot de passe" required><br>
        <button type="submit">Register</button>
      </form>
      <a href="/login">Login</a>
    </div>
  `);
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    return res.send(`
      ${styles}
      <div class="container">
        <h2>Utilisateur déjà existant</h2>
        <a href="/register">Réessayer</a>
      </div>
    `);
  }
  if (!isValidPassword(password)) {
    return res.send(`
      ${styles}
      <div class="container">
        <h2>Le mot de passe doit contenir au moins 8 caractères, avec au moins une majuscule, une minuscule, un chiffre et un caractère spécial.</h2>
        <a href="/register">Réessayer</a>
      </div>
    `);
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  users[username] = { id: Date.now().toString(), password: hashedPassword };
  res.redirect('/login');
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
