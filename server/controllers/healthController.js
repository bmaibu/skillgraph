const { verifyConnection } = require('../config/database');

async function getHealth(req, res, next) {
  try {
    const dbStatus = await verifyConnection();
    if (dbStatus.ok) {
      return res.status(200).json({
        api: 'ok',
        database: 'ok',
        timestamp: new Date().toISOString()
      });
    } else {
      return res.status(503).json({
        api: 'ok',
        database: 'unavailable',
        error: dbStatus.message,
        timestamp: new Date().toISOString()
      });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getHealth
};
