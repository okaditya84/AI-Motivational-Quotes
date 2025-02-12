const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your_secret_key_here'; // In production, use an environment variable

app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database and create tables if they don't exist
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the SQLite database.");
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT,
    generated_at DATE DEFAULT CURRENT_DATE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    quote_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, quote_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS saved_quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    quote_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, quote_id)
  )`);
});

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });
  const hashedPassword = await bcrypt.hash(password, 10);
  const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
  stmt.run(username, hashedPassword, function(err) {
    if (err) {
      return res.status(400).json({ message: "Username already exists" });
    }
    res.json({ message: "User registered successfully" });
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!user)
      return res.status(400).json({ message: "Invalid username or password" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Invalid username or password" });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  });
});

// Get today's quote endpoint
app.get('/api/quotes/daily', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  db.get("SELECT * FROM quotes WHERE generated_at = ?", [today], async (err, row) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (row) {
      res.json({ quote: row.text, id: row.id });
    } else {
      // No quote exists for today. Generate one using the FastAPI service.
      try {
        const response = await axios.get("http://localhost:8000/generate_quote");
        const quoteText = response.data.quote;
        const insertStmt = db.prepare("INSERT INTO quotes (text) VALUES (?)");
        insertStmt.run(quoteText, function(err) {
          if (err) {
            return res.status(500).json({ message: "Error saving quote" });
          }
          res.json({ quote: quoteText, id: this.lastID });
        });
      } catch (error) {
        res.status(500).json({ message: "Error generating quote" });
      }
    }
  });
});

// Like a quote endpoint
app.post('/api/quotes/like', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { quote_id } = req.body;
  if (!quote_id)
    return res.status(400).json({ message: "Quote ID required" });

  const stmt = db.prepare("INSERT OR IGNORE INTO likes (user_id, quote_id) VALUES (?, ?)");
  stmt.run(userId, quote_id, function(err) {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "Quote liked" });
  });
});

// Save a quote endpoint
app.post('/api/quotes/save', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { quote_id } = req.body;
  if (!quote_id)
    return res.status(400).json({ message: "Quote ID required" });

  const stmt = db.prepare("INSERT OR IGNORE INTO saved_quotes (user_id, quote_id) VALUES (?, ?)");
  stmt.run(userId, quote_id, function(err) {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "Quote saved" });
  });
});

// Fetch saved quotes for the user
app.get('/api/quotes/saved', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.all(
    "SELECT q.id, q.text, q.generated_at FROM saved_quotes sq JOIN quotes q ON sq.quote_id = q.id WHERE sq.user_id = ?",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ saved_quotes: rows });
    }
  );
});

// Fetch liked quotes for the user
app.get('/api/quotes/liked', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.all(
    "SELECT q.id, q.text, q.generated_at FROM likes l JOIN quotes q ON l.quote_id = q.id WHERE l.user_id = ?",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ liked_quotes: rows });
    }
  );
});

// Profile endpoint to fetch user details and statistics
app.get('/api/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const username = req.user.username;
  db.get(
    "SELECT COUNT(*) as likedCount FROM likes WHERE user_id = ?",
    [userId],
    (err, likedRow) => {
      if (err) return res.status(500).json({ message: "Database error" });
      db.get(
        "SELECT COUNT(*) as savedCount FROM saved_quotes WHERE user_id = ?",
        [userId],
        (err, savedRow) => {
          if (err) return res.status(500).json({ message: "Database error" });
          res.json({ username, likedCount: likedRow.likedCount, savedCount: savedRow.savedCount });
        }
      );
    }
  );
});

// ------------------------------
// New Endpoints for Enhanced Features
// ------------------------------

// Endpoint: Get popular quotes (sorted by number of likes)
app.get('/api/quotes/popular', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  db.all(
    `SELECT q.id, q.text, q.generated_at, COUNT(l.id) as like_count
     FROM quotes q
     LEFT JOIN likes l ON q.id = l.quote_id
     GROUP BY q.id
     ORDER BY like_count DESC
     LIMIT ?;`,
    [limit],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ quotes: rows });
    }
  );
});

// Endpoint: Get latest quotes (sorted by generated date)
app.get('/api/quotes/latest', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  db.all(
    "SELECT * FROM quotes ORDER BY generated_at DESC LIMIT ?;",
    [limit],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ quotes: rows });
    }
  );
});

// Endpoint: Search quotes by text
app.get('/api/quotes/search', (req, res) => {
  const searchQuery = req.query.query;
  if (!searchQuery) return res.status(400).json({ message: "Query parameter required" });
  const query = '%' + searchQuery + '%';
  db.all(
    "SELECT * FROM quotes WHERE text LIKE ?",
    [query],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ quotes: rows });
    }
  );
});

// Endpoint: Update user profile (e.g., update username)
app.put('/api/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: "Username required" });
  db.run(
    "UPDATE users SET username = ? WHERE id = ?",
    [username, userId],
    function(err) {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ message: "Profile updated successfully" });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 