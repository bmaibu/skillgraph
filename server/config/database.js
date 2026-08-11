const neo4j = require('neo4j-driver');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const uri = process.env.COGNODB_URI;
const user = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !user || !password) {
  console.warn('⚠️ Warning: CognoDB environment variables are missing. Please check your .env file.');
}

let driver;

function getDriver() {
  if (!driver) {
    driver = neo4j.driver(
      uri || 'bolt+s://db-1d94f5cc.databases.cognodb.com',
      neo4j.auth.basic(user || 'cognodb', password || ''),
      {
        maxConnectionPoolSize: 50,
        connectionTimeout: 15000,
        logging: neo4j.logging.console('warn')
      }
    );
  }
  return driver;
}

/**
 * Executes a Cypher query with optional parameters inside a auto-managed session.
 * Ensures session is properly closed regardless of success or failure.
 * @param {string} query - Parameterized Cypher query
 * @param {Object} params - Query parameters
 * @returns {Promise<Array<Object>>} Array of records converted to plain JS objects
 */
async function runQuery(query, params = {}) {
  const drv = getDriver();
  const session = drv.session();
  try {
    const result = await session.run(query, params);
    return result.records;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Verifies connectivity to the CognoDB instance.
 * @returns {Promise<{ok: boolean, message: string}>} Connection status
 */
async function verifyConnection() {
  const drv = getDriver();
  try {
    await drv.verifyConnectivity();
    return { ok: true, message: 'Connected to CognoDB successfully' };
  } catch (error) {
    console.error('CognoDB connectivity verification failed:', error.message);
    return { ok: false, message: error.message };
  }
}

/**
 * Closes the database driver connection pool gracefully.
 */
async function closeDriver() {
  if (driver) {
    await driver.close();
    driver = null;
  }
}

module.exports = {
  getDriver,
  runQuery,
  verifyConnection,
  closeDriver
};
