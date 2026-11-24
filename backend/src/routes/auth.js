/**
 * Auth Routes: POST /api/auth/register, POST /api/auth/login
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { isUsingFallback, jsonStore } = require('../db');
const { generateToken } = require('../middleware/auth');
let User;
try { User = require('../models/User'); } catch {}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, state = '', language = 'en' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });

    if (isUsingFallback()) {
      const existing = jsonStore.findOne('users', u => u.email === email.toLowerCase());
      if (existing) return res.status(409).json({ error: 'Email already registered' });
      const hashed = await bcrypt.hash(password, 12);
      const user = { _id: uuidv4(), name, email: email.toLowerCase(), password: hashed, role: 'USER', state, language, createdAt: new Date().toISOString() };
      jsonStore.add('users', user);
      const token = generateToken({ id: user._id, email: user.email, role: user.role });
      const { password: _, ...safeUser } = user;
      return res.status(201).json({ token, user: safeUser });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const user = await User.create({ name, email, password, role: 'USER', state, language });
    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    return res.status(201).json({ token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    if (isUsingFallback()) {
      const user = jsonStore.findOne('users', u => u.email === email.toLowerCase());
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
      const token = generateToken({ id: user._id, email: user.email, role: user.role });
      const { password: _, ...safeUser } = user;
      return res.json({ token, user: safeUser });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    return res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
