const { runQuery } = require('../config/database');

function toNumber(val) {
  if (val === null || val === undefined) return 0;
  return val.toNumber ? val.toNumber() : Number(val);
}

/**
 * Fetch all companies with open job role count and headcount.
 */
async function getAllCompanies() {
  const query = `
    MATCH (c:Company)
    OPTIONAL MATCH (c)-[:OFFERS]->(j:JobRole)
    OPTIONAL MATCH (p:Person)-[:WORKED_AT]->(c)
    RETURN c.name AS name,
           c.industry AS industry,
           count(DISTINCT j) AS jobCount,
           count(DISTINCT p) AS developerCount
    ORDER BY c.name ASC
  `;

  const records = await runQuery(query);
  return records.map(r => ({
    name: r.get('name'),
    industry: r.get('industry'),
    jobCount: toNumber(r.get('jobCount')),
    developerCount: toNumber(r.get('developerCount'))
  }));
}

/**
 * Fetch details of a company including job roles offered and past/present developers.
 */
async function getCompanyByName(name) {
  const query = `
    MATCH (c:Company {name: $name})
    OPTIONAL MATCH (c)-[:OFFERS]->(j:JobRole)
    OPTIONAL MATCH (j)-[:REQUIRES]->(s:Skill)
    OPTIONAL MATCH (p:Person)-[:WORKED_AT]->(c)
    RETURN c.name AS name,
           c.industry AS industry,
           collect(DISTINCT {title: j.title, location: j.location, experienceLevel: j.experienceLevel}) AS jobs,
           collect(DISTINCT s.name) AS requiredSkills,
           collect(DISTINCT {name: p.name, role: p.role}) AS developers
  `;

  const records = await runQuery(query, { name });
  if (!records || records.length === 0 || !records[0].get('name')) {
    return null;
  }

  const r = records[0];
  return {
    name: r.get('name'),
    industry: r.get('industry'),
    jobs: (r.get('jobs') || []).filter(j => j.title !== null),
    requiredSkills: (r.get('requiredSkills') || []).filter(s => s !== null),
    developers: (r.get('developers') || []).filter(p => p.name !== null)
  };
}

module.exports = {
  getAllCompanies,
  getCompanyByName
};
