const graphService = require('../services/graphService');

async function getFullGraph(req, res, next) {
  try {
    const { limit = 120 } = req.query;
    const graphData = await graphService.getFullGraphData(limit);
    res.status(200).json({
      success: true,
      data: graphData
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getFullGraph
};
