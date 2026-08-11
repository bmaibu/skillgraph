const { runQuery } = require('../config/database');

/**
 * Helper to construct unique node object for visualization payload.
 */
function createNode(id, type, name, properties = {}) {
  return {
    id: `${type}:${id}`,
    rawId: id,
    type,
    label: name || id,
    ...properties
  };
}

/**
 * Helper to construct unique link object for visualization payload.
 */
function createLink(sourceId, targetId, relationship) {
  return {
    source: sourceId,
    target: targetId,
    relationship
  };
}

/**
 * Fetch graph neighborhood for a specific developer up to 2-3 hops.
 * Traversal: Person -> Skills, Person -> Projects -> Skills, Person -> WorkedAt -> Company -> JobRole -> Skills
 */
async function getDeveloperGraphData(name) {
  const query = `
    MATCH (p:Person {name: $name})
    
    // 1-hop skills & projects & companies
    OPTIONAL MATCH (p)-[rKnows:KNOWS]->(s:Skill)
    OPTIONAL MATCH (p)-[rBuilt:BUILT]->(pr:Project)
    OPTIONAL MATCH (pr)-[rUses:USES]->(ps:Skill)
    OPTIONAL MATCH (p)-[rWorked:WORKED_AT]->(c:Company)
    OPTIONAL MATCH (c)-[rOffers:OFFERS]->(j:JobRole)
    OPTIONAL MATCH (j)-[rRequires:REQUIRES]->(js:Skill)

    RETURN p,
           collect(DISTINCT s) AS skills,
           collect(DISTINCT pr) AS projects,
           collect(DISTINCT {project: pr.name, skill: ps.name}) AS projectSkills,
           collect(DISTINCT c) AS companies,
           collect(DISTINCT {company: c.name, job: j.title}) AS companyJobs,
           collect(DISTINCT {job: j.title, skill: js.name}) AS jobSkills
  `;

  const records = await runQuery(query, { name });
  if (!records || records.length === 0 || !records[0].get('p')) {
    return { nodes: [], links: [] };
  }

  const r = records[0];
  const person = r.get('p').properties;

  const nodeMap = new Map();
  const linkSet = new Set();
  const links = [];

  const addNode = (nodeObj) => {
    if (!nodeMap.has(nodeObj.id)) {
      nodeMap.set(nodeObj.id, nodeObj);
    }
  };

  const addLink = (src, tgt, rel) => {
    const key = `${src}->${tgt}:${rel}`;
    if (!linkSet.has(key)) {
      linkSet.add(key);
      links.push(createLink(src, tgt, rel));
    }
  };

  // Center Person node
  const personId = `Person:${person.name}`;
  addNode(createNode(person.name, 'Person', person.name, person));

  // 1. Direct Skills (KNOWS)
  (r.get('skills') || []).forEach(skillObj => {
    if (skillObj && skillObj.properties) {
      const s = skillObj.properties;
      const sId = `Skill:${s.name}`;
      addNode(createNode(s.name, 'Skill', s.name, s));
      addLink(personId, sId, 'KNOWS');
    }
  });

  // 2. Projects (BUILT & USES)
  (r.get('projects') || []).forEach(projObj => {
    if (projObj && projObj.properties) {
      const pr = projObj.properties;
      const prId = `Project:${pr.name}`;
      addNode(createNode(pr.name, 'Project', pr.name, pr));
      addLink(personId, prId, 'BUILT');
    }
  });

  (r.get('projectSkills') || []).forEach(ps => {
    if (ps.project && ps.skill) {
      const prId = `Project:${ps.project}`;
      const sId = `Skill:${ps.skill}`;
      if (nodeMap.has(prId)) {
        addNode(createNode(ps.skill, 'Skill', ps.skill));
        addLink(prId, sId, 'USES');
      }
    }
  });

  // 3. Companies & Jobs & Requirements
  (r.get('companies') || []).forEach(compObj => {
    if (compObj && compObj.properties) {
      const c = compObj.properties;
      const cId = `Company:${c.name}`;
      addNode(createNode(c.name, 'Company', c.name, c));
      addLink(personId, cId, 'WORKED_AT');
    }
  });

  (r.get('companyJobs') || []).forEach(cj => {
    if (cj.company && cj.job) {
      const cId = `Company:${cj.company}`;
      const jId = `JobRole:${cj.job}`;
      if (nodeMap.has(cId)) {
        addNode(createNode(cj.job, 'JobRole', cj.job));
        addLink(cId, jId, 'OFFERS');
      }
    }
  });

  (r.get('jobSkills') || []).forEach(js => {
    if (js.job && js.skill) {
      const jId = `JobRole:${js.job}`;
      const sId = `Skill:${js.skill}`;
      if (nodeMap.has(jId)) {
        addNode(createNode(js.skill, 'Skill', js.skill));
        addLink(jId, sId, 'REQUIRES');
      }
    }
  });

  return {
    nodes: Array.from(nodeMap.values()),
    links
  };
}

/**
 * Fetch full graph structure with optional limit for global explorer view.
 */
async function getFullGraphData(limit = 100) {
  const query = `
    MATCH (n)
    OPTIONAL MATCH (n)-[r]->(m)
    RETURN n, labels(n)[0] AS type, r, type(r) AS rel, m, labels(m)[0] AS targetType
    LIMIT $limit
  `;

  const records = await runQuery(query, { limit: Number(limit) });
  const nodeMap = new Map();
  const linkSet = new Set();
  const links = [];

  records.forEach(r => {
    const n = r.get('n');
    const type = r.get('type');
    if (n && n.properties && type) {
      const name = n.properties.name || n.properties.title;
      const id = `${type}:${name}`;
      if (!nodeMap.has(id)) {
        nodeMap.set(id, createNode(name, type, name, n.properties));
      }
    }

    const m = r.get('m');
    const targetType = r.get('targetType');
    const rel = r.get('rel');

    if (n && m && rel && type && targetType) {
      const srcName = n.properties.name || n.properties.title;
      const tgtName = m.properties.name || m.properties.title;

      const srcId = `${type}:${srcName}`;
      const tgtId = `${targetType}:${tgtName}`;

      if (!nodeMap.has(tgtId)) {
        nodeMap.set(tgtId, createNode(tgtName, targetType, tgtName, m.properties));
      }

      const key = `${srcId}->${tgtId}:${rel}`;
      if (!linkSet.has(key)) {
        linkSet.add(key);
        links.push(createLink(srcId, tgtId, rel));
      }
    }
  });

  return {
    nodes: Array.from(nodeMap.values()),
    links
  };
}

module.exports = {
  getDeveloperGraphData,
  getFullGraphData
};
