const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "users.json");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Load existing users or create file
let users = [];
if (fs.existsSync(DATA_FILE)) {
  try {
    users = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (err) {
    console.error("❌ Error reading users.json:", err);
    users = [];
  }
} else {
  fs.writeFileSync(DATA_FILE, "[]");
}

// Helper function to save users
function saveUsers() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

// Routes
app.get("/api/users", (req, res) => {
  res.json(users);
});

app.post("/api/users", (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const newUser = { id: Date.now(), name, email, role };
  users.push(newUser);
  saveUsers();
  res.json(newUser);
});

app.put("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, role } = req.body;
  users = users.map(u => (u.id === id ? { ...u, name, email, role } : u));
  saveUsers();
  res.json({ success: true });
});

app.delete("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  users = users.filter(u => u.id !== id);
  saveUsers();
  res.json({ success: true });
});

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
