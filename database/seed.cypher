// ====================================================================
// SKILLGRAPH — CYPHER SEED REFERENCE
// ====================================================================

// 1. Create Core Node Types
MERGE (p1:Person {name: 'Alex Rivera'}) SET p1.role = 'Senior AI Engineer', p1.location = 'San Francisco, CA', p1.experienceYears = 8;
MERGE (p2:Person {name: 'Sarah Chen'}) SET p2.role = 'Full Stack Tech Lead', p2.location = 'Seattle, WA', p2.experienceYears = 10;
MERGE (p3:Person {name: 'Marcus Vance'}) SET p3.role = 'DevOps & Infrastructure Lead', p3.location = 'Austin, TX', p3.experienceYears = 7;

MERGE (s1:Skill {name: 'Python', category: 'Programming Languages'});
MERGE (s2:Skill {name: 'React', category: 'Web Development'});
MERGE (s3:Skill {name: 'Machine Learning', category: 'Artificial Intelligence'});
MERGE (s4:Skill {name: 'AWS', category: 'DevOps & Cloud'});
MERGE (s5:Skill {name: 'Node.js', category: 'Web Development'});

MERGE (pr1:Project {name: 'AI Career Graph Engine', description: 'Real-time graph reasoning engine for skill matching', difficulty: 'Hard'});
MERGE (pr2:Project {name: 'Interactive Graph Visualization UI', description: 'Custom force-directed node graph renderer', difficulty: 'Medium'});

MERGE (c1:Company {name: 'Google', industry: 'Technology'});
MERGE (c2:Company {name: 'Stripe', industry: 'Financial Technology'});

MERGE (j1:JobRole {title: 'Senior AI Engineer', location: 'San Francisco, CA', experienceLevel: 'Senior'});
MERGE (j2:JobRole {title: 'Full Stack Engineer', location: 'San Francisco, CA', experienceLevel: 'Mid'});

// 2. Connect Relationships
MERGE (c1)-[:OFFERS]->(j1);
MERGE (c2)-[:OFFERS]->(j2);

MERGE (p1)-[:KNOWS]->(s1);
MERGE (p1)-[:KNOWS]->(s3);
MERGE (p1)-[:KNOWS]->(s4);

MERGE (p2)-[:KNOWS]->(s2);
MERGE (p2)-[:KNOWS]->(s5);

MERGE (p1)-[:BUILT]->(pr1);
MERGE (pr1)-[:USES]->(s1);
MERGE (pr1)-[:USES]->(s3);

MERGE (j1)-[:REQUIRES]->(s1);
MERGE (j1)-[:REQUIRES]->(s3);
MERGE (j1)-[:REQUIRES]->(s4);

MERGE (p1)-[:WORKED_AT]->(c1);
