const developerService = require('../services/developerService');
const graphService = require('../services/graphService');

async function getDevelopers(req, res, next) {
  try {
    const developers = await developerService.getAllDevelopers();
    res.status(200).json({
      success: true,
      count: developers.length,
      data: developers
    });
  } catch (err) {
    next(err);
  }
}

async function getDeveloperByName(req, res, next) {
  try {
    const { name } = req.params;
    const developer = await developerService.getDeveloperByName(name);
    if (!developer) {
      return res.status(404).json({
        success: false,
        error: `Developer with name "${name}" not found.`
      });
    }
    res.status(200).json({
      success: true,
      data: developer
    });
  } catch (err) {
    next(err);
  }
}

async function getDeveloperSkills(req, res, next) {
  try {
    const { name } = req.params;
    const skills = await developerService.getDeveloperSkills(name);
    res.status(200).json({
      success: true,
      developer: name,
      count: skills.length,
      data: skills
    });
  } catch (err) {
    next(err);
  }
}

async function getDeveloperProjects(req, res, next) {
  try {
    const { name } = req.params;
    const projects = await developerService.getDeveloperProjects(name);
    res.status(200).json({
      success: true,
      developer: name,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    next(err);
  }
}

async function getDeveloperRecommendations(req, res, next) {
  try {
    const { name } = req.params;
    const recommendations = await developerService.getJobRecommendations(name);
    res.status(200).json({
      success: true,
      developer: name,
      count: recommendations.length,
      data: recommendations
    });
  } catch (err) {
    next(err);
  }
}

async function getSimilarDevelopers(req, res, next) {
  try {
    const { name } = req.params;
    const similar = await developerService.getSimilarDevelopers(name);
    res.status(200).json({
      success: true,
      developer: name,
      count: similar.length,
      data: similar
    });
  } catch (err) {
    next(err);
  }
}

async function getDeveloperGraph(req, res, next) {
  try {
    const { name } = req.params;
    const graphData = await graphService.getDeveloperGraphData(name);
    res.status(200).json({
      success: true,
      developer: name,
      data: graphData
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDevelopers,
  getDeveloperByName,
  getDeveloperSkills,
  getDeveloperProjects,
  getDeveloperRecommendations,
  getSimilarDevelopers,
  getDeveloperGraph
};
