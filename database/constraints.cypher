// Unique name constraints for core entities
CREATE CONSTRAINT person_name_unique IF NOT EXISTS FOR (p:Person) REQUIRE p.name IS UNIQUE;
CREATE CONSTRAINT skill_name_unique IF NOT EXISTS FOR (s:Skill) REQUIRE s.name IS UNIQUE;
CREATE CONSTRAINT project_name_unique IF NOT EXISTS FOR (pr:Project) REQUIRE pr.name IS UNIQUE;
CREATE CONSTRAINT company_name_unique IF NOT EXISTS FOR (c:Company) REQUIRE c.name IS UNIQUE;
CREATE CONSTRAINT jobrole_title_unique IF NOT EXISTS FOR (j:JobRole) REQUIRE j.title IS UNIQUE;
