const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your-secret-key'; // Replace with secure key in production

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// SQLite Database Setup
const db = new sqlite3.Database('./server/db/database.sqlite', (err) => {
  if (err) console.error(err.message);
  console.log('Connected to SQLite database.');
});

// Create Tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT,
      birth_date TEXT,
      student_id TEXT UNIQUE,
      photo TEXT,
      nationality TEXT,
      address TEXT,
      neighborhood TEXT,
      class TEXT,
      grade TEXT,
      parent_father JSON,
      parent_mother JSON,
      guardian JSON,
      activities JSON
    )
  `);

  // Insert default admin user
  const defaultUser = { username: 'admin', password: 'admin' };
  bcrypt.hash(defaultUser.password, 10, (err, hash) => {
    if (err) return console.error(err);
    db.run(`INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`, [defaultUser.username, hash]);
  });
});

// Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const reportRoutes = require('./routes/reports');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/reports', reportRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
