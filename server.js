require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/proctor', require('./routes/proctoring'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check — verifies all 4 databases
app.get('/api/health', async (req, res) => {
  const status = { postgres: false, redis: false, couchdb: false, neo4j: false };

  try {
    const pool = require('./config/postgres');
    await pool.query('SELECT 1');
    status.postgres = true;
  } catch (e) { console.error('PG health fail:', e.message); }

  try {
    const redis = require('./config/redis');
    await redis.ping();
    status.redis = true;
  } catch (e) { console.error('Redis health fail:', e.message); }

  try {
    const { couch } = require('./config/couchdb');
    await couch.db.list();
    status.couchdb = true;
  } catch (e) { console.error('CouchDB health fail:', e.message); }

  try {
    const { driver } = require('./config/neo4j');
    const session = driver.session();
    await session.run('RETURN 1');
    await session.close();
    status.neo4j = true;
  } catch (e) { console.error('Neo4j health fail:', e.message); }

  const allHealthy = Object.values(status).every(Boolean);
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'degraded',
    databases: status,
    timestamp: new Date().toISOString(),
  });
});

// SPA fallback — serve index.html for non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// Initialize databases and start server
async function start() {
  try {
    // Initialize PostgreSQL schema
    const pool = require('./config/postgres');
    const schemaPath = path.join(__dirname, 'models', 'postgres', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('✅ PostgreSQL schema initialized');

    // Initialize CouchDB
    const { initCouchDB } = require('./config/couchdb');
    await initCouchDB();

    // Initialize Neo4j
    const { initNeo4j } = require('./config/neo4j');
    await initNeo4j();

    // Start server
    app.listen(PORT, () => {
      console.log(`\n🛡️  ProctorShield running at http://localhost:${PORT}\n`);
    });
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
}

start();
