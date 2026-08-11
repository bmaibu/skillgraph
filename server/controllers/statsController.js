const statsService = require('../services/statsService');

async function getStats(req, res, next) {
  try {
    const stats = await statsService.getGraphStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStats
};
