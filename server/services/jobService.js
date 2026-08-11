const { runQuery } = require('../config/database');

function toNumber(val) {
  if (val === null || val === undefined) return 0;
  return val.toNumber ? val.toNumber() : Number(val);
}

/**
 * Fetch all job roles with their offering company and required skills.
 */
async function getAllJobs() {
  const query = `
    MATCH (c:Company)-[:OFFERS]->(j:JobRole)
    OPTIONAL MATCH (j)-[:REQUIRES]->(s:Skill)
    RETURN j.title AS title,
           j.location AS location,
           j.experienceLevel AS experienceLevel,
           c.name AS company,
           c.industry AS industry,
           collect(DISTINCT s.name) AS requiredSkills
    ORDER BY j.title ASC
  `;

  const records = await runQuery(query);
  return records.map(r => ({
    title: r.get('title'),
    location: r.get('location'),
    experienceLevel: r.get('experienceLevel'),
    company: r.get('company'),
    industry: r.get('industry'),
    requiredSkills: (r.get('requiredSkills') || []).filter(s => s !== null)
  }));
}

/**
 * Fetch details of a job role by title.
 */
async function getJobByTitle(title) {
  const query = `
    MATCH (j:JobRole {title: $title})
    OPTIONAL MATCH (c:Company)-[:OFFERS]->(j)
    OPTIONAL MATCH (j)-[:REQUIRES]->(s:Skill)
    RETURN j.title AS title,
           j.location AS location,
           j.experienceLevel AS experienceLevel,
           c.name AS company,
           c.industry AS industry,
           collect(DISTINCT {name: s.name, category: s.category}) AS requiredSkills
  `;

  const records = await runQuery(query, { title });
  if (!records || records.length === 0 || !records[0].get('title')) {
    return null;
  }

  const r = records[0];
  return {
    title: r.get('title'),
    location: r.get('location'),
    experienceLevel: r.get('experienceLevel'),
    company: r.get('company'),
    industry: r.get('industry'),
    requiredSkills: (r.get('requiredSkills') || []).filter(s => s.name !== null)
  };
}

/**
 * Calculate skill gap for a target developer against a specific job role.
 */
async function getSkillGap(title, developerName) {
  const query = `
    MATCH (j:JobRole {title: $title})-[:REQUIRES]->(req:Skill)
    WITH j, collect(DISTINCT req.name) AS allRequired

    OPTIONAL MATCH (p:Person {name: $developerName})-[:KNOWS]->(devSkill:Skill)
    WITH j, allRequired, collect(DISTINCT devSkill.name) AS knownSkills

    WITH j, allRequired, knownSkills,
         [s IN allRequired WHERE s IN knownSkills] AS matchedSkills,
         [s IN allRequired WHERE NOT s IN knownSkills] AS missingSkills

    RETURN j.title AS title,
           allRequired,
           matchedSkills,
           missingSkills,
           size(matchedSkills) AS matchedCount,
           size(missingSkills) AS missingCount,
           size(allRequired) AS totalCount,
           CASE WHEN size(allRequired) > 0
                THEN round((toFloat(size(matchedSkills)) / toFloat(size(allRequired))) * 100)
                ELSE 0 END AS readinessScore
  `;

  const records = await runQuery(query, { title, developerName });
  if (!records || records.length === 0) {
    return null;
  }

  const r = records[0];
  return {
    jobTitle: r.get('title'),
    developerName,
    allRequired: r.get('allRequired') || [],
    matchedSkills: r.get('matchedSkills') || [],
    missingSkills: r.get('missingSkills') || [],
    matchedCount: toNumber(r.get('matchedCount')),
    missingCount: toNumber(r.get('missingCount')),
    totalCount: toNumber(r.get('totalCount')),
    readinessScore: toNumber(r.get('readinessScore'))
  };
}

module.exports = {
  getAllJobs,
  getJobByTitle,
  getSkillGap
};
