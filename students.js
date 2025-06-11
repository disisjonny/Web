const express = require('express');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const db = new sqlite3.Database('./server/db/database.sqlite');
const SECRET_KEY = 'your-secret-key';

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    req.user = decoded;
    next();
  });
};

router.get('/', authenticate, (req, res) => {
  db.all(`SELECT * FROM students`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/', authenticate, (req, res) => {
  const {
    full_name, birth_date, student_id, photo, nationality, address, neighborhood, class: className, grade,
    parent_father, parent_mother, guardian, activities
  } = req.body;
  db.run(
    `INSERT INTO students (full_name, birth_date, student_id, photo, nationality, address, neighborhood, class, grade, parent_father, parent_mother, guardian, activities)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [full_name, birth_date, student_id, photo, nationality, address, neighborhood, className, grade,
     JSON.stringify(parent_father), JSON.stringify(parent_mother), JSON.stringify(guardian), JSON.stringify(activities)],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

router.put('/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const {
    full_name, birth_date, student_id, photo, nationality, address, neighborhood, class: className, grade,
    parent_father, parent_mother, guardian, activities
  } = req.body;
  db.run(
    `UPDATE students SET full_name = ?, birth_date = ?, student_id = ?, photo = ?, nationality = ?, address = ?, neighborhood = ?, class = ?, grade = ?, parent_father = ?, parent_mother = ?, guardian = ?, activities = ? WHERE id = ?`,
    [full_name, birth_date, student_id, photo, nationality, address, neighborhood, className, grade,
     JSON.stringify(parent_father), JSON.stringify(parent_mother), JSON.stringify(guardian), JSON.stringify(activities), id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

router.get('/search', authenticate, (req, res) => {
  const { query } = req.query;
  db.all(`SELECT * FROM students WHERE full_name LIKE ? OR class LIKE ?`, [`%${query}%`, `%${query}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
