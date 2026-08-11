// ====================================================================
// SKILLGRAPH — CYPHER QUERIES REFERENCE
// ====================================================================

// A. Get a person's skills
// 1-hop traversal matching a Person to Skills they KNOW
MATCH (p:Person {name: $name})-[:KNOWS]->(s:Skill)
RETURN s.name AS skill, s.category AS category
ORDER BY skill;

// B. Get a person's projects and their skills
// 2-hop traversal: Person -> Project -> Skill
MATCH (p:Person {name: $name})-[:BUILT]->(project:Project)-[:USES]->(skill:Skill)
RETURN project.name AS project,
       project.description AS description,
       project.difficulty AS difficulty,
       collect(skill.name) AS skills;

// C. Job recommendation based on matching skills
// 2-hop traversal: Person -> Skill <- JobRole
MATCH (p:Person {name: $name})-[:KNOWS]->(skill:Skill)<-[:REQUIRES]-(job:JobRole)
RETURN job.title AS job,
       job.location AS location,
       job.experienceLevel AS experienceLevel,
       collect(DISTINCT skill.name) AS matchingSkills,
       count(DISTINCT skill) AS matchCount
ORDER BY matchCount DESC;

// D. Skill gap for a selected job
// Graph anti-pattern lookup: Skills required by JobRole that Person does NOT possess
MATCH (job:JobRole {title: $job})-[:REQUIRES]->(required:Skill)
OPTIONAL MATCH (p:Person {name: $name})-[:KNOWS]->(required)
WITH required, p
WHERE p IS NULL
RETURN required.name AS missingSkill, required.category AS category;

// E. Similar developers
// Graph collaborative filtering: Find developers who share skills with target person
MATCH (p:Person {name: $name})-[:KNOWS]->(skill:Skill)<-[:KNOWS]-(other:Person)
WHERE other <> p
RETURN other.name AS developer,
       other.role AS role,
       other.experienceYears AS experienceYears,
       collect(DISTINCT skill.name) AS sharedSkills,
       count(DISTINCT skill) AS sharedSkillCount
ORDER BY sharedSkillCount DESC;

// F. Multi-hop company / job / skill traversal
// 3-hop traversal: Person -> Skill <- JobRole <- Company
MATCH (p:Person {name: $name})-[:KNOWS]->(skill:Skill)<-[:REQUIRES]-(job:JobRole)<-[:OFFERS]-(company:Company)
RETURN company.name AS company,
       company.industry AS industry,
       job.title AS job,
       collect(DISTINCT skill.name) AS matchingSkills
ORDER BY size(matchingSkills) DESC;
