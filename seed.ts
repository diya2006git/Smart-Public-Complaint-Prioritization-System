import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('complaints.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('citizen', 'officer', 'admin')) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    priority TEXT CHECK(priority IN ('High', 'Medium', 'Low')) NOT NULL,
    status TEXT DEFAULT 'Pending',
    citizen_id INTEGER,
    officer_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(citizen_id) REFERENCES users(id),
    FOREIGN KEY(officer_id) REFERENCES users(id)
  );
`);

async function seed() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Seed Users
  const insertUser = db.prepare('INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
  
  insertUser.run('John Citizen', 'citizen@test.com', hashedPassword, 'citizen');
  insertUser.run('Officer Sarah', 'officer@test.com', hashedPassword, 'officer');
  insertUser.run('Admin User', 'admin@test.com', hashedPassword, 'admin');
  
  console.log('Database seeded successfully!');
  console.log('Citizen: citizen@test.com / password123');
  console.log('Officer: officer@test.com / password123');
  console.log('Admin: admin@test.com / password123');
}

seed();
