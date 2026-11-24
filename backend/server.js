/**
 * SakhiShakti Backend — Express Entry Point
 * Port: 5000
 */
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { connectDB } = require('./src/db');
const setupSocket = require('./src/socket');

const authRoutes = require('./src/routes/auth');
const healthCardRoutes = require('./src/routes/healthCards');
const schemeRoutes = require('./src/routes/schemes');
const supportRequestRoutes = require('./src/routes/supportRequests');
const donationRoutes = require('./src/routes/donations');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SakhiShakti Backend', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/health-cards', healthCardRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/support-requests', supportRequestRoutes);
app.use('/api/donations', donationRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Setup Socket.io
setupSocket(server);

// Start
const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`\n🌸 SakhiShakti Backend running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
  });
}

start();
