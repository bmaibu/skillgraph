const jobService = require('../services/jobService');

async function getJobs(req, res, next) {
  try {
    const jobs = await jobService.getAllJobs();
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    next(err);
  }
}

async function getJobByTitle(req, res, next) {
  try {
    const { title } = req.params;
    const job = await jobService.getJobByTitle(title);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: `Job title "${title}" not found.`
      });
    }
    res.status(200).json({
      success: true,
      data: job
    });
  } catch (err) {
    next(err);
  }
}

async function getJobSkillGap(req, res, next) {
  try {
    const { title, developerName } = req.params;
    const gap = await jobService.getSkillGap(title, developerName);
    if (!gap) {
      return res.status(404).json({
        success: false,
        error: `Unable to compute skill gap for job "${title}" and developer "${developerName}".`
      });
    }
    res.status(200).json({
      success: true,
      data: gap
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getJobs,
  getJobByTitle,
  getJobSkillGap
};
