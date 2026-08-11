const { runQuery } = require('../config/database');

function toNumber(val) {
  if (val === null || val === undefined) return 0;
  return val.toNumber ? val.toNumber() : Number(val);
}

/**
 * Fetch all skills with category and usage statistics across developers and jobs.
 */
async function getAllSkills() {
  const query = `
    MATCH (s:Skill)
    OPTIONAL MATCH (p:Person)-[:KNOWS]->(s)
    OPTIONAL MATCH (pr:Project)-[:USES]->(s)
    OPTIONAL MATCH (j:JobRole)-[:REQUIRES]->(s)
    RETURN s.name AS name,
           s.category AS category,
           count(DISTINCT p) AS developerCount,
           count(DISTINCT pr) AS projectCount,
           count(DISTINCT j) AS jobCount
    ORDER BY s.category ASC, developerCount DESC, s.name ASC
  `;

  const records = await runQuery(query);
  return records.map(r => ({
    name: r.get('name'),
    category: r.get('category'),
    developerCount: toNumber(r.get('developerCount')),
    projectCount: toNumber(r.get('projectCount')),
    jobCount: toNumber(r.get('jobCount'))
  }));
}

/**
 * Fetch comprehensive graph details for a single skill.
 */
async function getSkillByName(name) {
  const query = `
    MATCH (s:Skill {name: $name})
    OPTIONAL MATCH (p:Person)-[:KNOWS]->(s)
    OPTIONAL MATCH (pr:Project)-[:USES]->(s)
    OPTIONAL MATCH (j:JobRole)-[:REQUIRES]->(s)
    OPTIONAL MATCH (c:Company)-[:OFFERS]->(j)
    RETURN s.name AS name,
           s.category AS category,
           collect(DISTINCT {name: p.name, role: p.role, location: p.location}) AS developers,
           collect(DISTINCT {name: pr.name, description: pr.description, difficulty: pr.difficulty}) AS projects,
           collect(DISTINCT {title: j.title, company: c.name, location: j.location}) AS jobs,
           collect(DISTINCT c.name) AS companies
  `;

  const records = await runQuery(query, { name });
  if (!records || records.length === 0 || !records[0].get('name')) {
    return null;
  }

  const r = records[0];
  return {
    name: r.get('name'),
    category: r.get('category'),
    developers: (r.get('developers') || []).filter(dev => dev.name !== null),
    projects: (r.get('projects') || []).filter(pr => pr.name !== null),
    jobs: (r.get('jobs') || []).filter(j => j.title !== null),
    companies: (r.get('companies') || []).filter(c => c !== null)
  };
}

module.exports = {
  getAllSkills,
  getSkillByName
};
