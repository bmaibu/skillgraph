const companyService = require('../services/companyService');

async function getCompanies(req, res, next) {
  try {
    const companies = await companyService.getAllCompanies();
    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies
    });
  } catch (err) {
    next(err);
  }
}

async function getCompanyByName(req, res, next) {
  try {
    const { name } = req.params;
    const company = await companyService.getCompanyByName(name);
    if (!company) {
      return res.status(404).json({
        success: false,
        error: `Company "${name}" not found.`
      });
    }
    res.status(200).json({
      success: true,
      data: company
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCompanies,
  getCompanyByName
};
