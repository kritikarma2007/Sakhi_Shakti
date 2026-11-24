/**
 * SakhiShakti Database Layer
 * Primary: MongoDB via Mongoose
 * Fallback: Local JSON file store (backend/data/db.json)
 */
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let usingFallback = false;

// ─────────────────────────────────────────────
// JSON Fallback Store
// ─────────────────────────────────────────────

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    return { users: [], healthCards: [], schemes: [], supportRequests: [], donations: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (err) {
    throw new Error(`Unable to parse fallback database at ${DB_FILE}: ${err.message}`);
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

const jsonStore = {
  get: (collection) => {
    const db = readDB();
    return db[collection] || [];
  },
  set: (collection, data) => {
    const db = readDB();
    db[collection] = data;
    writeDB(db);
  },
  add: (collection, item) => {
    const db = readDB();
    if (!db[collection]) db[collection] = [];
    db[collection].push(item);
    writeDB(db);
    return item;
  },
  update: (collection, id, updates) => {
    const db = readDB();
    if (!db[collection]) return null;
    const idx = db[collection].findIndex(i => i._id === id || i.id === id);
    if (idx === -1) return null;
    db[collection][idx] = { ...db[collection][idx], ...updates };
    writeDB(db);
    return db[collection][idx];
  },
  findOne: (collection, predicate) => {
    const db = readDB();
    return (db[collection] || []).find(predicate) || null;
  },
  find: (collection, predicate) => {
    const db = readDB();
    const items = db[collection] || [];
    return predicate ? items.filter(predicate) : items;
  }
};

// ─────────────────────────────────────────────
// Connection
// ─────────────────────────────────────────────

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.log('⚠️  MONGO_URI not set — using local JSON file store');
    usingFallback = true;
    return;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.log(`⚠️  MongoDB connection failed (${err.message}) — falling back to local JSON store`);
    usingFallback = true;
  }
}

module.exports = { connectDB, jsonStore, isUsingFallback: () => usingFallback };
