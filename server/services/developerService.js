const { runQuery } = require('../config/database');

/**
 * Helper to safely convert Neo4j Integers or Numbers to JS Numbers.
 */
function toNumber(val) {
  if (val === null || val === undefined) return 0;
  return val.toNumber ? val.toNumber() : Number(val);
}

/**
 * Fetch all developers with their skills count and built projects count.
 */
async function getAllDevelopers() {
  const query = `
    MATCH (p:Person)
    OPTIONAL MATCH (p)-[:KNOWS]->(s:Skill)
    OPTIONAL MATCH (p)-[:BUILT]->(pr:Project)
    OPTIONAL MATCH (p)-[:WORKED_AT]->(c:Company)
    RETURN p.name AS name,
           p.role AS role,
           p.location AS location,
           p.experienceYears AS experienceYears,
           count(DISTINCT s) AS skillCount,
           count(DISTINCT pr) AS projectCount,
           collect(DISTINCT c.name) AS companies
    ORDER BY p.name ASC
  `;

  const records = await runQuery(query);
  return records.map(r => ({
    name: r.get('name'),
    role: r.get('role'),
    location: r.get('location'),
    experienceYears: toNumber(r.get('experienceYears')),
    skillCount: toNumber(r.get('skillCount')),
    projectCount: toNumber(r.get('projectCount')),
    companies: r.get('companies') || []
  }));
}

/**
 * Fetch full profile details for a specific developer by name.
 */
async function getDeveloperByName(name) {
  const query = `
    MATCH (p:Person {name: $name})
    OPTIONAL MATCH (p)-[:KNOWS]->(s:Skill)
    OPTIONAL MATCH (p)-[:BUILT]->(pr:Project)-[:USES]->(ps:Skill)
    OPTIONAL MATCH (p)-[:WORKED_AT]->(c:Company)
    RETURN p.name AS name,
           p.role AS role,
           p.location AS location,
           p.experienceYears AS experienceYears,
           collect(DISTINCT {name: s.name, category: s.category}) AS skills,
           collect(DISTINCT {name: pr.name, description: pr.description, difficulty: pr.difficulty}) AS projects,
           collect(DISTINCT c.name) AS companies
  `;

  const records = await runQuery(query, { name });
  if (!records || records.length === 0 || !records[0].get('name')) {
    return null;
  }

  const r = records[0];
  return {
    name: r.get('name'),
    role: r.get('role'),
    location: r.get('location'),
    experienceYears: toNumber(r.get('experienceYears')),
    skills: (r.get('skills') || []).filter(s => s.name !== null),
    projects: (r.get('projects') || []).filter(pr => pr.name !== null),
    companies: (r.get('companies') || []).filter(c => c !== null)
  };
}

/**
 * Fetch skills known by a specific developer.
 */
async function getDeveloperSkills(name) {
  const query = `
    MATCH (p:Person {name: $name})-[:KNOWS]->(s:Skill)
    RETURN s.name AS name, s.category AS category
    ORDER BY s.category ASC, s.name ASC
  `;

  const records = await runQuery(query, { name });
  return records.map(r => ({
    name: r.get('name'),
    category: r.get('category')
  }));
}

/**
 * Fetch projects built by a developer along with the skills used in each project.
 */
async function getDeveloperProjects(name) {
  const query = `
    MATCH (p:Person {name: $name})-[:BUILT]->(pr:Project)
    OPTIONAL MATCH (pr)-[:USES]->(s:Skill)
    RETURN pr.name AS name,
           pr.description AS description,
           pr.difficulty AS difficulty,
           collect(s.name) AS skills
  `;

  const records = await runQuery(query, { name });
  return records.map(r => ({
    name: r.get('name'),
    description: r.get('description'),
    difficulty: r.get('difficulty'),
    skills: (r.get('skills') || []).filter(s => s !== null)
  }));
}

/**
 * Job recommendations based on skill overlap (2-hop graph matching).
 * Traversal: Person -> Skill <- JobRole <- Company
 */
async function getJobRecommendations(name) {
  const query = `
    MATCH (p:Person {name: $name})-[:KNOWS]->(skill:Skill)
    WITH p, collect(DISTINCT skill.name) AS personSkills

    MATCH (company:Company)-[:OFFERS]->(job:JobRole)-[:REQUIRES]->(reqSkill:Skill)
    WITH p, personSkills, company, job, collect(DISTINCT reqSkill.name) AS jobSkills

    WITH company, job, jobSkills, personSkills,
         [s IN jobSkills WHERE s IN personSkills] AS matchedSkills,
         [s IN jobSkills WHERE NOT s IN personSkills] AS missingSkills

    WHERE size(matchedSkills) > 0
    RETURN company.name AS company,
           company.industry AS industry,
           job.title AS title,
           job.location AS location,
           job.experienceLevel AS experienceLevel,
           matchedSkills,
           missingSkills,
           size(matchedSkills) AS matchCount,
           size(jobSkills) AS totalRequired,
           round((toFloat(size(matchedSkills)) / toFloat(size(jobSkills))) * 100) AS matchPercentage
    ORDER BY matchCount DESC, matchPercentage DESC
  `;

  const records = await runQuery(query, { name });
  return records.map(r => ({
    company: r.get('company'),
    industry: r.get('industry'),
    title: r.get('title'),
    location: r.get('location'),
    experienceLevel: r.get('experienceLevel'),
    matchedSkills: r.get('matchedSkills') || [],
    missingSkills: r.get('missingSkills') || [],
    matchCount: toNumber(r.get('matchCount')),
    totalRequired: toNumber(r.get('totalRequired')),
    matchPercentage: toNumber(r.get('matchPercentage'))
  }));
}

/**
 * Similar developers matching based on shared skill graph overlap.
 */
async function getSimilarDevelopers(name) {
  const query = `
    MATCH (p:Person {name: $name})-[:KNOWS]->(skill:Skill)<-[:KNOWS]-(other:Person)
    WHERE other <> p
    RETURN other.name AS name,
           other.role AS role,
           other.location AS location,
           other.experienceYears AS experienceYears,
           collect(DISTINCT skill.name) AS sharedSkills,
           count(DISTINCT skill) AS sharedSkillCount
    ORDER BY sharedSkillCount DESC
    LIMIT 10
  `;

  const records = await runQuery(query, { name });
  return records.map(r => ({
    name: r.get('name'),
    role: r.get('role'),
    location: r.get('location'),
    experienceYears: toNumber(r.get('experienceYears')),
    sharedSkills: r.get('sharedSkills') || [],
    sharedSkillCount: toNumber(r.get('sharedSkillCount'))
  }));
}

module.exports = {
  getAllDevelopers,
  getDeveloperByName,
  getDeveloperSkills,
  getDeveloperProjects,
  getJobRecommendations,
  getSimilarDevelopers
};
