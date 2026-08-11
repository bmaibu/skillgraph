const express = require('express');
const router = express.Router();

const healthController = require('../controllers/healthController');
const statsController = require('../controllers/statsController');
const developerController = require('../controllers/developerController');
const jobController = require('../controllers/jobController');
const skillController = require('../controllers/skillController');
const companyController = require('../controllers/companyController');
const graphController = require('../controllers/graphController');

// Health & Stats
router.get('/health', healthController.getHealth);
router.get('/stats', statsController.getStats);

// Developers
router.get('/developers', developerController.getDevelopers);
router.get('/developers/:name', developerController.getDeveloperByName);
router.get('/developers/:name/skills', developerController.getDeveloperSkills);
router.get('/developers/:name/projects', developerController.getDeveloperProjects);
router.get('/developers/:name/recommendations', developerController.getDeveloperRecommendations);
router.get('/developers/:name/similar', developerController.getSimilarDevelopers);
router.get('/developers/:name/graph', developerController.getDeveloperGraph);

// Jobs & Skill Gap
router.get('/jobs', jobController.getJobs);
router.get('/jobs/:title', jobController.getJobByTitle);
router.get('/jobs/:title/skill-gap/:developerName', jobController.getJobSkillGap);

// Skills
router.get('/skills', skillController.getSkills);
router.get('/skills/:name', skillController.getSkillByName);

// Companies
router.get('/companies', companyController.getCompanies);
router.get('/companies/:name', companyController.getCompanyByName);

// Visual Graph Explorer
router.get('/graph', graphController.getFullGraph);

module.exports = router;
