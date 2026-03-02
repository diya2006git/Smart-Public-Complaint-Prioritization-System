import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

// SQLite Connection
const db = new Database('database.sqlite');

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('Citizen', 'Officer', 'Admin'))
  );

  CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT,
    priority TEXT CHECK(priority IN ('High', 'Medium', 'Low')),
    department TEXT,
    summary TEXT,
    status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'In Progress', 'Resolved')),
    citizen_id INTEGER,
    officer_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(citizen_id) REFERENCES users(id),
    FOREIGN KEY(officer_id) REFERENCES users(id)
  );
`);

// AI Setup
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Default Users Initialization
const initDefaultUsers = async () => {
  try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    if (userCount.count === 0) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      const insert = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
      insert.run('Default Citizen', 'citizen@test.com', hashedPassword, 'Citizen');
      insert.run('Default Officer', 'officer@test.com', hashedPassword, 'Officer');
      insert.run('Default Admin', 'admin@test.com', hashedPassword, 'Admin');
      console.log('Default users created');
    }
  } catch (err) {
    console.error('Error creating default users:', err);
  }
};

initDefaultUsers();

app.use(cors());
app.use(express.json());

// AI Analysis Function
const analyzeComplaint = async (title: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this public complaint and provide a structured JSON response.
      Title: ${title}
      Description: ${description}
      
      Rules:
      - Category: One of [Water Issue, Electricity, Road Damage, Garbage, Other]
      - Priority: One of [High, Medium, Low]
      - Department: Assign a relevant department (e.g., Water Works, Electrical Dept, Public Works, Sanitation)
      - Summary: A concise 1-sentence summary.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            priority: { type: Type.STRING },
            department: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ["category", "priority", "department", "summary"]
        }
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error('AI Analysis failed:', error);
    return {
      category: 'Other',
      priority: 'Medium',
      department: 'General Admin',
      summary: title
    };
  }
};

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const insert = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
    insert.run(name, email, hashedPassword, role);
    console.log("User Registered");
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Email already exists or invalid data' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (user.role !== role) {
      return res.status(401).json({ error: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    console.log("User Login Success");
    res.json({ 
      message: 'Login Successful',
      token, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Complaint Routes ---
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/api/complaints', authenticateToken, async (req: any, res) => {
  const { title, description, location } = req.body;
  const citizen_id = req.user.id;

  try {
    const aiResult = await analyzeComplaint(title, description);
    
    const insert = db.prepare(`
      INSERT INTO complaints (title, description, location, category, priority, department, summary, citizen_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const info = insert.run(
      title, 
      description, 
      location, 
      aiResult.category,
      aiResult.priority,
      aiResult.department,
      aiResult.summary,
      citizen_id
    );
    
    const newComplaint = db.prepare('SELECT * FROM complaints WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newComplaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create complaint' });
  }
});

app.get('/api/complaints', authenticateToken, async (req: any, res) => {
  try {
    let complaints;
    if (req.user.role === 'Citizen') {
      complaints = db.prepare('SELECT * FROM complaints WHERE citizen_id = ? ORDER BY created_at DESC').all(req.user.id);
    } else if (req.user.role === 'Officer') {
      const all = db.prepare(`
        SELECT c.*, u.name as citizen_name 
        FROM complaints c 
        JOIN users u ON c.citizen_id = u.id
      `).all() as any[];
      
      complaints = all.sort((a, b) => {
        const pMap: any = { 'High': 1, 'Medium': 2, 'Low': 3 };
        return pMap[a.priority as string] - pMap[b.priority as string];
      });
    } else {
      complaints = db.prepare(`
        SELECT c.*, u1.name as citizen_name, u2.name as officer_name
        FROM complaints c
        LEFT JOIN users u1 ON c.citizen_id = u1.id
        LEFT JOIN users u2 ON c.officer_id = u2.id
        ORDER BY c.created_at DESC
      `).all();
    }
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

app.patch('/api/complaints/:id/status', authenticateToken, async (req: any, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    db.prepare('UPDATE complaints SET status = ?, officer_id = ? WHERE id = ?').run(status, req.user.id, id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

app.patch('/api/complaints/:id/assign', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'Admin') return res.sendStatus(403);
  const { officer_id } = req.body;
  const { id } = req.params;
  try {
    db.prepare('UPDATE complaints SET officer_id = ? WHERE id = ?').run(officer_id, id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign officer' });
  }
});

app.get('/api/officers', authenticateToken, async (req: any, res) => {
  try {
    const officers = db.prepare("SELECT name, id FROM users WHERE role = 'Officer'").all();
    res.json(officers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch officers' });
  }
});

app.get('/api/stats', authenticateToken, async (req: any, res) => {
  try {
    const stats: any = {};
    if (req.user.role === 'Citizen') {
      stats.total = db.prepare('SELECT COUNT(*) as count FROM complaints WHERE citizen_id = ?').get(req.user.id);
      stats.pending = db.prepare("SELECT COUNT(*) as count FROM complaints WHERE citizen_id = ? AND status = 'Pending'").get(req.user.id);
      stats.resolved = db.prepare("SELECT COUNT(*) as count FROM complaints WHERE citizen_id = ? AND status = 'Resolved'").get(req.user.id);
    } else {
      stats.total = db.prepare('SELECT COUNT(*) as count FROM complaints').get();
      stats.high = db.prepare("SELECT COUNT(*) as count FROM complaints WHERE priority = 'High'").get();
      stats.medium = db.prepare("SELECT COUNT(*) as count FROM complaints WHERE priority = 'Medium'").get();
      stats.low = db.prepare("SELECT COUNT(*) as count FROM complaints WHERE priority = 'Low'").get();
      stats.resolved = db.prepare("SELECT COUNT(*) as count FROM complaints WHERE status = 'Resolved'").get();
      stats.pending = db.prepare("SELECT COUNT(*) as count FROM complaints WHERE status = 'Pending'").get();
      
      // Category breakdown for charts
      stats.categories = db.prepare('SELECT category as _id, COUNT(*) as count FROM complaints GROUP BY category').all();
      
      // Monthly trends (SQLite month extraction)
      stats.trends = db.prepare(`
        SELECT strftime('%m', created_at) as _id, COUNT(*) as count 
        FROM complaints 
        GROUP BY _id 
        ORDER BY _id ASC
      `).all();
    }
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// --- Vite Integration ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
