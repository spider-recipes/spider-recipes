require('dotenv').config({override: true}); // Load environment variables from .env file
var sql = require('mssql');

let pool;

const dbConfig = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_ENDPOINT,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

// This code sets up a connection pool and connects to the MSSQL database, allowing you to reuse connections efficiently for performing database operations.
// Doing it this way makes it 6x faster than creating a new connection for each query.
async function initializePool() {
  try {
    pool = await sql.connect(dbConfig);
  } catch (error) {
    throw error;
  }
}

async function getPool() {
  if (!pool) {
    await initializePool();
    console.log('Pool initialized');
  }
  return pool;
}

module.exports = {
  getPool
};
