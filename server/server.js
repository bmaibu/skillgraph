const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');
const { verifyConnection, closeDriver } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Catch-all 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint ${req.originalUrl} not found.`
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Server initialization
let server;
async function startServer() {
  console.log('🔄 Initializing SkillGraph API Server...');
  const conn = await verifyConnection();
  if (conn.ok) {
    console.log('✅ Connected to CognoDB successfully!');
  } else {
    console.warn(`⚠️ Warning: Database connectivity issue: ${conn.message}`);
  }

  server = app.listen(PORT, () => {
    console.log(`🚀 SkillGraph API Server running on port ${PORT}`);
    console.log(`📡 Health Check URL: http://localhost:${PORT}/api/health`);
  });
}

// Graceful shutdown handling
async function gracefulShutdown(signal) {
  console.log(`\n🛑 Received ${signal}. Shutting down server gracefully...`);
  if (server) {
    server.close(async () => {
      console.log('🔌 HTTP server closed.');
      await closeDriver();
      console.log('🔒 CognoDB driver connection closed.');
      process.exit(0);
    });
  } else {
    await closeDriver();
    process.exit(0);
  }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

startServer();
