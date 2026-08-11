const { runQuery } = require('../config/database');

/**
 * Service to fetch aggregate graph statistics from CognoDB.
 */
async function getGraphStats() {
  const query = `
    MATCH (n)
    WITH labels(n)[0] AS label, count(n) AS count
    RETURN collect({label: label, count: count}) AS nodes,
           sum(count) AS totalNodes
  `;

  const relQuery = `
    MATCH ()-[r]->()
    RETURN count(r) AS totalRelationships
  `;

  const [nodeResults, relResults] = await Promise.all([
    runQuery(query),
    runQuery(relQuery)
  ]);

  const nodes = {};
  if (nodeResults.length > 0 && nodeResults[0].get('nodes')) {
    nodeResults[0].get('nodes').forEach(item => {
      if (item.label) {
        nodes[item.label] = item.count ? item.count.toNumber ? item.count.toNumber() : Number(item.count) : 0;
      }
    });
  }

  const totalRelRaw = relResults.length > 0 ? relResults[0].get('totalRelationships') : 0;
  const totalRelationships = totalRelRaw.toNumber ? totalRelRaw.toNumber() : Number(totalRelRaw);

  return {
    nodes: {
      Person: nodes.Person || 0,
      Skill: nodes.Skill || 0,
      Project: nodes.Project || 0,
      Company: nodes.Company || 0,
      JobRole: nodes.JobRole || 0
    },
    totalNodes: Object.values(nodes).reduce((acc, curr) => acc + curr, 0),
    totalRelationships
  };
}

module.exports = {
  getGraphStats
};
