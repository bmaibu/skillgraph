const skillService = require('../services/skillService');

async function getSkills(req, res, next) {
  try {
    const skills = await skillService.getAllSkills();
    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (err) {
    next(err);
  }
}

async function getSkillByName(req, res, next) {
  try {
    const { name } = req.params;
    const skill = await skillService.getSkillByName(name);
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: `Skill "${name}" not found.`
      });
    }
    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSkills,
  getSkillByName
};
