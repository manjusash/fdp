const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied. No token." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token." });
    req.user = user;
    next();
  });
};

// ─── AUTH ROUTES ───────────────────────────────────────────────

// Admin Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password required." });

  try {
    const [rows] = await db.execute("SELECT * FROM admins WHERE username = ?", [username]);
    if (rows.length === 0)
      return res.status(401).json({ message: "Invalid credentials." });

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token, username: admin.username, message: "Login successful." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// ─── STUDENT ROUTES ────────────────────────────────────────────

// Add student
app.post("/api/students", authenticateToken, async (req, res) => {
  const { student_name, moodle_id, course_name } = req.body;
  if (!student_name || !moodle_id || !course_name)
    return res.status(400).json({ message: "All fields are required." });

  try {
    const [result] = await db.execute(
      "INSERT INTO students (student_name, moodle_id, course_name) VALUES (?, ?, ?)",
      [student_name.trim(), moodle_id.trim(), course_name.trim()]
    );
    const [newStudent] = await db.execute("SELECT * FROM students WHERE id = ?", [result.insertId]);
    res.status(201).json({ message: "Student added successfully.", student: newStudent[0] });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ message: "Moodle ID already exists." });
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// Get all students
app.get("/api/students", authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM students ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// Delete student
app.delete("/api/students/:id", authenticateToken, async (req, res) => {
  try {
    await db.execute("DELETE FROM students WHERE id = ?", [req.params.id]);
    res.json({ message: "Student deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
