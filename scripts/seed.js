const path = require('path');
const neo4j = require('neo4j-driver');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../server/.env') });

const uri = process.env.COGNODB_URI || 'bolt+s://db-1d94f5cc.databases.cognodb.com';
const user = process.env.COGNODB_USERNAME || 'cognodb';
const password = process.env.COGNODB_PASSWORD;

if (!password) {
  console.error('❌ COGNODB_PASSWORD missing in environment variables. Aborting seed.');
  process.exit(1);
}

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

// ----------------------------------------------------
// SEED DATA ARRAYS
// ----------------------------------------------------

const SKILLS = [
  { name: 'Python', category: 'Programming Languages' },
  { name: 'JavaScript', category: 'Programming Languages' },
  { name: 'TypeScript', category: 'Programming Languages' },
  { name: 'Java', category: 'Programming Languages' },
  { name: 'C++', category: 'Programming Languages' },
  { name: 'Go', category: 'Programming Languages' },
  { name: 'SQL', category: 'Databases' },
  { name: 'MongoDB', category: 'Databases' },
  { name: 'Redis', category: 'Databases' },
  { name: 'GraphQL', category: 'Web Development' },
  { name: 'React', category: 'Web Development' },
  { name: 'Node.js', category: 'Web Development' },
  { name: 'Machine Learning', category: 'Artificial Intelligence' },
  { name: 'Data Analysis', category: 'Data Science' },
  { name: 'Power BI', category: 'Data Science' },
  { name: 'Tableau', category: 'Data Science' },
  { name: 'TensorFlow', category: 'Artificial Intelligence' },
  { name: 'PyTorch', category: 'Artificial Intelligence' },
  { name: 'Pandas', category: 'Data Science' },
  { name: 'NLP', category: 'Artificial Intelligence' },
  { name: 'Computer Vision', category: 'Artificial Intelligence' },
  { name: 'Docker', category: 'DevOps & Cloud' },
  { name: 'AWS', category: 'DevOps & Cloud' },
  { name: 'Kubernetes', category: 'DevOps & Cloud' },
  { name: 'Git', category: 'Developer Tools' }
];

const COMPANIES = [
  { name: 'Google', industry: 'Technology' },
  { name: 'Microsoft', industry: 'Software' },
  { name: 'Meta', industry: 'Social Media' },
  { name: 'Amazon', industry: 'Cloud & E-Commerce' },
  { name: 'Apple', industry: 'Hardware & Software' },
  { name: 'Netflix', industry: 'Entertainment & Streaming' },
  { name: 'Spotify', industry: 'Audio Streaming' },
  { name: 'Stripe', industry: 'Financial Technology' },
  { name: 'Snowflake', industry: 'Data Cloud' },
  { name: 'Databricks', industry: 'Unified Analytics' },
  { name: 'Uber', industry: 'Transportation & Mobility' },
  { name: 'Airbnb', industry: 'Hospitality & Tech' }
];

const PERSONS = [
  { name: 'Alex Rivera', role: 'Senior AI Engineer', location: 'San Francisco, CA', experienceYears: 8 },
  { name: 'Sarah Chen', role: 'Full Stack Tech Lead', location: 'Seattle, WA', experienceYears: 10 },
  { name: 'Marcus Vance', role: 'DevOps & Infrastructure Lead', location: 'Austin, TX', experienceYears: 7 },
  { name: 'Elena Rostova', role: 'Data Scientist', location: 'New York, NY', experienceYears: 5 },
  { name: 'David Kim', role: 'Backend Engineer', location: 'San Jose, CA', experienceYears: 6 },
  { name: 'Priya Sharma', role: 'Machine Learning Researcher', location: 'Boston, MA', experienceYears: 9 },
  { name: 'James Wilson', role: 'Frontend Architect', location: 'Chicago, IL', experienceYears: 11 },
  { name: 'Maya Lin', role: 'Cloud Solutions Architect', location: 'Denver, CO', experienceYears: 8 },
  { name: 'Carlos Mendez', role: 'Data Platform Engineer', location: 'Miami, FL', experienceYears: 4 },
  { name: 'Aisha Patel', role: 'NLP Specialist', location: 'Seattle, WA', experienceYears: 6 },
  { name: 'Lucas Meyer', role: 'Computer Vision Engineer', location: 'San Francisco, CA', experienceYears: 7 },
  { name: 'Sophia Tanaka', role: 'Distributed Systems Engineer', location: 'New York, NY', experienceYears: 9 },
  { name: 'Liam O\'Connor', role: 'Site Reliability Engineer', location: 'Dublin, Ireland', experienceYears: 5 },
  { name: 'Amara Okafor', role: 'BI & Analytics Developer', location: 'London, UK', experienceYears: 6 },
  { name: 'Vikram Joshi', role: 'Senior Go Developer', location: 'Toronto, Canada', experienceYears: 8 },
  { name: 'Hannah Abbott', role: 'Product Engineer', location: 'Austin, TX', experienceYears: 4 },
  { name: 'Gabriel Silva', role: 'Database Administrator', location: 'Sao Paulo, Brazil', experienceYears: 12 },
  { name: 'Zoe Zhang', role: 'Full Stack Engineer', location: 'Vancouver, Canada', experienceYears: 5 },
  { name: 'Noah Miller', role: 'Security & Systems Developer', location: 'Berlin, Germany', experienceYears: 7 },
  { name: 'Chloe Dubois', role: 'UX & Frontend Developer', location: 'Paris, France', experienceYears: 6 },
  { name: 'Tariq Al-Mansoor', role: 'AI Infrastructure Lead', location: 'Dubai, UAE', experienceYears: 10 },
  { name: 'Isabella Rossi', role: 'Data Engineer', location: 'Milan, Italy', experienceYears: 6 },
  { name: 'Ethan Wright', role: 'Cloud DevOps Engineer', location: 'San Diego, CA', experienceYears: 5 },
  { name: 'Nisha Gupta', role: 'Machine Learning Engineer', location: 'Bengaluru, India', experienceYears: 7 },
  { name: 'Benjamin Hayes', role: 'Senior Java Architect', location: 'Chicago, IL', experienceYears: 13 },
  { name: 'Olivia Martin', role: 'Analytics Lead', location: 'Atlanta, GA', experienceYears: 8 },
  { name: 'Daniel Becker', role: 'High Performance Computing Engineer', location: 'Munich, Germany', experienceYears: 9 },
  { name: 'Mia Takahashi', role: 'Full Stack React/Node Developer', location: 'Tokyo, Japan', experienceYears: 4 },
  { name: 'Samuel Taylor', role: 'Search & Recommender Engineer', location: 'New York, NY', experienceYears: 7 },
  { name: 'Fatima Zahra', role: 'Deep Learning Specialist', location: 'Casablanca, Morocco', experienceYears: 5 },
  { name: 'Oliver Scott', role: 'Platform Engineer', location: 'London, UK', experienceYears: 6 },
  { name: 'Ava Kowalski', role: 'GraphQL & API Engineer', location: 'Warsaw, Poland', experienceYears: 4 }
];

const PROJECTS = [
  { name: 'AI Career Graph Engine', description: 'Real-time graph reasoning engine for skill matching and career guidance', difficulty: 'Hard' },
  { name: 'Distributed Microservices Bus', description: 'Event-driven high throughput message broker in Go', difficulty: 'Hard' },
  { name: 'Neural Text Summarizer', description: 'Transformer-based NLP pipeline for automated documentation analysis', difficulty: 'Hard' },
  { name: 'E-Commerce Recommendation System', description: 'Personalized collaborative filtering engine powering million+ users', difficulty: 'Medium' },
  { name: 'Real-time Fraud Detection Pipeline', description: 'Low latency transaction scoring pipeline using PyTorch & Kafka', difficulty: 'Hard' },
  { name: 'Cloud Infrastructure Automation Kit', description: 'Terraform & Kubernetes orchestration templates for multi-cloud', difficulty: 'Medium' },
  { name: 'Autonomous Vision Tracker', description: 'YOLO-based object detection system for real-time edge processing', difficulty: 'Hard' },
  { name: 'Smart Enterprise BI Portal', description: 'Interactive executive reporting dashboard integrating SQL & Power BI', difficulty: 'Easy' },
  { name: 'GraphQL Supergraph Gateway', description: 'Unified GraphQL schema aggregator serving federated microservices', difficulty: 'Medium' },
  { name: 'High Throughput Analytics Platform', description: 'Spark & Snowflake data pipeline handling terabytes daily', difficulty: 'Hard' },
  { name: 'SaaS Customer Churn Predictor', description: 'Scikit-learn and Pandas predictive ML model with automated retries', difficulty: 'Medium' },
  { name: 'Video Streaming Transcoder', description: 'Distributed C++ adaptive bitrate video encoder for live streams', difficulty: 'Hard' },
  { name: 'Cloud Native Telemetry Collector', description: 'OpenTelemetry collector agent built with Go and Docker', difficulty: 'Medium' },
  { name: 'Interactive Graph Visualization UI', description: 'Custom force-directed React component for complex node graphs', difficulty: 'Medium' },
  { name: 'Enterprise Knowledge Graph', description: 'Neo4j powered semantic graph connecting company silos', difficulty: 'Hard' },
  { name: 'Log Anomaly Detector', description: 'Unsupervised ML model analyzing server logs for security breaches', difficulty: 'Medium' },
  { name: 'Smart IoT Edge Gateway', description: 'Low power telemetry processing service running on Kubernetes Edge', difficulty: 'Hard' },
  { name: 'Developer Portfolio Generator', description: 'Dynamic React/Tailwind application showcasing software projects', difficulty: 'Easy' }
];

const JOB_ROLES = [
  { title: 'Senior AI Engineer', company: 'Google', location: 'San Francisco, CA', experienceLevel: 'Senior' },
  { title: 'Staff Machine Learning Engineer', company: 'Meta', location: 'Menlo Park, CA', experienceLevel: 'Lead' },
  { title: 'Full Stack Engineer', company: 'Stripe', location: 'San Francisco, CA', experienceLevel: 'Mid' },
  { title: 'Principal DevOps Architect', company: 'Amazon', location: 'Seattle, WA', experienceLevel: 'Senior' },
  { title: 'Senior Data Scientist', company: 'Snowflake', location: 'San Mateo, CA', experienceLevel: 'Senior' },
  { title: 'Senior Backend Go Specialist', company: 'Uber', location: 'San Francisco, CA', experienceLevel: 'Senior' },
  { title: 'Lead NLP Scientist', company: 'Microsoft', location: 'Redmond, WA', experienceLevel: 'Lead' },
  { title: 'Frontend React Architect', company: 'Airbnb', location: 'San Francisco, CA', experienceLevel: 'Senior' },
  { title: 'Computer Vision Engineer', company: 'Apple', location: 'Cupertino, CA', experienceLevel: 'Mid' },
  { title: 'Distributed Systems Engineer', company: 'Databricks', location: 'San Francisco, CA', experienceLevel: 'Senior' },
  { title: 'Site Reliability Engineer', company: 'Netflix', location: 'Los Gatos, CA', experienceLevel: 'Mid' },
  { title: 'Data Platform Engineer', company: 'Spotify', location: 'New York, NY', experienceLevel: 'Mid' },
  { title: 'BI & Analytics Manager', company: 'Amazon', location: 'Austin, TX', experienceLevel: 'Lead' },
  { title: 'Cloud Security Engineer', company: 'Google', location: 'Sunnyvale, CA', experienceLevel: 'Mid' },
  { title: 'Database Architect', company: 'Snowflake', location: 'San Jose, CA', experienceLevel: 'Senior' },
  { title: 'Machine Learning Infrastructure Engineer', company: 'Meta', location: 'Seattle, WA', experienceLevel: 'Senior' },
  { title: 'Product Software Developer', company: 'Spotify', location: 'Stockholm, Sweden', experienceLevel: 'Mid' },
  { title: 'Senior GraphQL Architect', company: 'Stripe', location: 'Remote', experienceLevel: 'Senior' },
  { title: 'Deep Learning Research Engineer', company: 'Google', location: 'Mountain View, CA', experienceLevel: 'Senior' },
  { title: 'Kubernetes Platform Specialist', company: 'Microsoft', location: 'Bellevue, WA', experienceLevel: 'Mid' },
  { title: 'Full Stack React & Node Lead', company: 'Netflix', location: 'Remote', experienceLevel: 'Lead' },
  { title: 'Analytics Engineer', company: 'Databricks', location: 'New York, NY', experienceLevel: 'Mid' }
];

// Relationships mapping logic
const PERSON_KNOWS_SKILLS = [
  { person: 'Alex Rivera', skills: ['Python', 'Machine Learning', 'PyTorch', 'NLP', 'Docker', 'AWS'] },
  { person: 'Sarah Chen', skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'GraphQL', 'SQL', 'Git'] },
  { person: 'Marcus Vance', skills: ['Docker', 'AWS', 'Kubernetes', 'Go', 'Git', 'Python'] },
  { person: 'Elena Rostova', skills: ['Python', 'SQL', 'Data Analysis', 'Pandas', 'Tableau', 'Machine Learning'] },
  { person: 'David Kim', skills: ['Java', 'Go', 'SQL', 'Redis', 'Node.js', 'Docker'] },
  { person: 'Priya Sharma', skills: ['Python', 'TensorFlow', 'PyTorch', 'Computer Vision', 'Machine Learning', 'C++'] },
  { person: 'James Wilson', skills: ['JavaScript', 'TypeScript', 'React', 'GraphQL', 'Git'] },
  { person: 'Maya Lin', skills: ['AWS', 'Kubernetes', 'Docker', 'Python', 'SQL'] },
  { person: 'Carlos Mendez', skills: ['Python', 'SQL', 'MongoDB', 'Redis', 'Docker', 'Pandas'] },
  { person: 'Aisha Patel', skills: ['Python', 'NLP', 'PyTorch', 'Pandas', 'Data Analysis'] },
  { person: 'Lucas Meyer', skills: ['Python', 'C++', 'Computer Vision', 'TensorFlow', 'Docker'] },
  { person: 'Sophia Tanaka', skills: ['Go', 'C++', 'Java', 'Distributed Systems', 'Kubernetes', 'Redis'] },
  { person: 'Liam O\'Connor', skills: ['Python', 'Docker', 'Kubernetes', 'AWS', 'Git'] },
  { person: 'Amara Okafor', skills: ['SQL', 'Power BI', 'Tableau', 'Data Analysis', 'Pandas'] },
  { person: 'Vikram Joshi', skills: ['Go', 'Docker', 'Kubernetes', 'GraphQL', 'SQL'] },
  { person: 'Hannah Abbott', skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'] },
  { person: 'Gabriel Silva', skills: ['SQL', 'MongoDB', 'Redis', 'Java', 'Python'] },
  { person: 'Zoe Zhang', skills: ['TypeScript', 'React', 'Node.js', 'MongoDB', 'Git'] },
  { person: 'Noah Miller', skills: ['C++', 'Python', 'Docker', 'Git', 'Linux'] },
  { person: 'Chloe Dubois', skills: ['JavaScript', 'React', 'TypeScript', 'Git'] },
  { person: 'Tariq Al-Mansoor', skills: ['Python', 'PyTorch', 'TensorFlow', 'Docker', 'AWS', 'Kubernetes'] },
  { person: 'Isabella Rossi', skills: ['Python', 'SQL', 'Pandas', 'Docker', 'AWS'] },
  { person: 'Ethan Wright', skills: ['AWS', 'Docker', 'Kubernetes', 'Python', 'Git'] },
  { person: 'Nisha Gupta', skills: ['Python', 'Machine Learning', 'TensorFlow', 'Pandas', 'Data Analysis'] },
  { person: 'Benjamin Hayes', skills: ['Java', 'SQL', 'Redis', 'Docker', 'Git'] },
  { person: 'Olivia Martin', skills: ['SQL', 'Data Analysis', 'Tableau', 'Power BI', 'Pandas'] },
  { person: 'Daniel Becker', skills: ['C++', 'Python', 'Go', 'Docker'] },
  { person: 'Mia Takahashi', skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git'] },
  { person: 'Samuel Taylor', skills: ['Python', 'Machine Learning', 'NLP', 'SQL', 'Redis'] },
  { person: 'Fatima Zahra', skills: ['Python', 'PyTorch', 'Computer Vision', 'Pandas'] },
  { person: 'Oliver Scott', skills: ['Go', 'Kubernetes', 'Docker', 'AWS'] },
  { person: 'Ava Kowalski', skills: ['TypeScript', 'Node.js', 'GraphQL', 'MongoDB'] }
];

const PERSON_BUILT_PROJECTS = [
  { person: 'Alex Rivera', project: 'AI Career Graph Engine' },
  { person: 'Alex Rivera', project: 'Neural Text Summarizer' },
  { person: 'Sarah Chen', project: 'Interactive Graph Visualization UI' },
  { person: 'Sarah Chen', project: 'GraphQL Supergraph Gateway' },
  { person: 'Marcus Vance', project: 'Cloud Infrastructure Automation Kit' },
  { person: 'Marcus Vance', project: 'Cloud Native Telemetry Collector' },
  { person: 'Elena Rostova', project: 'SaaS Customer Churn Predictor' },
  { person: 'Elena Rostova', project: 'Smart Enterprise BI Portal' },
  { person: 'David Kim', project: 'Distributed Microservices Bus' },
  { person: 'Priya Sharma', project: 'Autonomous Vision Tracker' },
  { person: 'Aisha Patel', project: 'Neural Text Summarizer' },
  { person: 'Lucas Meyer', project: 'Autonomous Vision Tracker' },
  { person: 'Sophia Tanaka', project: 'Distributed Microservices Bus' },
  { person: 'Carlos Mendez', project: 'High Throughput Analytics Platform' },
  { person: 'Vikram Joshi', project: 'Cloud Native Telemetry Collector' },
  { person: 'Amara Okafor', project: 'Smart Enterprise BI Portal' },
  { person: 'Tariq Al-Mansoor', project: 'Enterprise Knowledge Graph' },
  { person: 'Samuel Taylor', project: 'E-Commerce Recommendation System' },
  { person: 'Mia Takahashi', project: 'Developer Portfolio Generator' },
  { person: 'Daniel Becker', project: 'Video Streaming Transcoder' }
];

const PROJECT_USES_SKILLS = [
  { project: 'AI Career Graph Engine', skills: ['Python', 'Machine Learning', 'GraphQL'] },
  { project: 'Distributed Microservices Bus', skills: ['Go', 'Redis', 'Docker'] },
  { project: 'Neural Text Summarizer', skills: ['Python', 'PyTorch', 'NLP', 'Pandas'] },
  { project: 'E-Commerce Recommendation System', skills: ['Python', 'Machine Learning', 'SQL', 'Redis'] },
  { project: 'Real-time Fraud Detection Pipeline', skills: ['Python', 'PyTorch', 'Kafka', 'Redis'] },
  { project: 'Cloud Infrastructure Automation Kit', skills: ['AWS', 'Kubernetes', 'Docker'] },
  { project: 'Autonomous Vision Tracker', skills: ['Python', 'C++', 'Computer Vision', 'TensorFlow'] },
  { project: 'Smart Enterprise BI Portal', skills: ['SQL', 'Power BI', 'Tableau', 'Data Analysis'] },
  { project: 'GraphQL Supergraph Gateway', skills: ['TypeScript', 'GraphQL', 'Node.js'] },
  { project: 'High Throughput Analytics Platform', skills: ['Python', 'SQL', 'Pandas', 'AWS'] },
  { project: 'SaaS Customer Churn Predictor', skills: ['Python', 'Pandas', 'Data Analysis', 'Machine Learning'] },
  { project: 'Video Streaming Transcoder', skills: ['C++', 'Go', 'Docker'] },
  { project: 'Cloud Native Telemetry Collector', skills: ['Go', 'Docker', 'Kubernetes'] },
  { project: 'Interactive Graph Visualization UI', skills: ['JavaScript', 'TypeScript', 'React'] },
  { project: 'Enterprise Knowledge Graph', skills: ['Python', 'Machine Learning', 'Docker'] },
  { project: 'Log Anomaly Detector', skills: ['Python', 'Machine Learning', 'Pandas'] },
  { project: 'Smart IoT Edge Gateway', skills: ['C++', 'Go', 'Kubernetes'] },
  { project: 'Developer Portfolio Generator', skills: ['JavaScript', 'React', 'Node.js'] }
];

const PERSON_WORKED_AT_COMPANIES = [
  { person: 'Alex Rivera', company: 'Google' },
  { person: 'Alex Rivera', company: 'Meta' },
  { person: 'Sarah Chen', company: 'Stripe' },
  { person: 'Sarah Chen', company: 'Airbnb' },
  { person: 'Marcus Vance', company: 'Amazon' },
  { person: 'Elena Rostova', company: 'Snowflake' },
  { person: 'David Kim', company: 'Uber' },
  { person: 'Priya Sharma', company: 'Apple' },
  { person: 'James Wilson', company: 'Airbnb' },
  { person: 'Maya Lin', company: 'Google' },
  { person: 'Carlos Mendez', company: 'Spotify' },
  { person: 'Aisha Patel', company: 'Microsoft' },
  { person: 'Lucas Meyer', company: 'Apple' },
  { person: 'Sophia Tanaka', company: 'Databricks' },
  { person: 'Liam O\'Connor', company: 'Netflix' },
  { person: 'Amara Okafor', company: 'Amazon' },
  { person: 'Vikram Joshi', company: 'Uber' },
  { person: 'Tariq Al-Mansoor', company: 'Meta' },
  { person: 'Isabella Rossi', company: 'Databricks' }
];

const JOB_REQUIRES_SKILLS = [
  { job: 'Senior AI Engineer', skills: ['Python', 'Machine Learning', 'PyTorch', 'Docker', 'AWS'] },
  { job: 'Staff Machine Learning Engineer', skills: ['Python', 'PyTorch', 'TensorFlow', 'Machine Learning', 'Docker'] },
  { job: 'Full Stack Engineer', skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL'] },
  { job: 'Principal DevOps Architect', skills: ['AWS', 'Kubernetes', 'Docker', 'Git', 'Go'] },
  { job: 'Senior Data Scientist', skills: ['Python', 'SQL', 'Data Analysis', 'Pandas', 'Machine Learning'] },
  { job: 'Senior Backend Go Specialist', skills: ['Go', 'SQL', 'Redis', 'Docker', 'Kubernetes'] },
  { job: 'Lead NLP Scientist', skills: ['Python', 'NLP', 'PyTorch', 'TensorFlow', 'Pandas'] },
  { job: 'Frontend React Architect', skills: ['JavaScript', 'TypeScript', 'React', 'GraphQL', 'Git'] },
  { job: 'Computer Vision Engineer', skills: ['Python', 'C++', 'Computer Vision', 'PyTorch', 'TensorFlow'] },
  { job: 'Distributed Systems Engineer', skills: ['Go', 'C++', 'Java', 'Redis', 'Docker'] },
  { job: 'Site Reliability Engineer', skills: ['Docker', 'Kubernetes', 'AWS', 'Python', 'Git'] },
  { job: 'Data Platform Engineer', skills: ['Python', 'SQL', 'MongoDB', 'Redis', 'Docker'] },
  { job: 'BI & Analytics Manager', skills: ['SQL', 'Power BI', 'Tableau', 'Data Analysis', 'Pandas'] },
  { job: 'Cloud Security Engineer', skills: ['AWS', 'Docker', 'Kubernetes', 'Python', 'Git'] },
  { job: 'Database Architect', skills: ['SQL', 'MongoDB', 'Redis', 'Java', 'Python'] },
  { job: 'Machine Learning Infrastructure Engineer', skills: ['Python', 'PyTorch', 'Docker', 'Kubernetes', 'AWS'] },
  { job: 'Product Software Developer', skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'] },
  { job: 'Senior GraphQL Architect', skills: ['TypeScript', 'GraphQL', 'Node.js', 'React'] },
  { job: 'Deep Learning Research Engineer', skills: ['Python', 'PyTorch', 'TensorFlow', 'Computer Vision', 'NLP'] },
  { job: 'Kubernetes Platform Specialist', skills: ['Kubernetes', 'Docker', 'AWS', 'Go'] },
  { job: 'Full Stack React & Node Lead', skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'GraphQL'] },
  { job: 'Analytics Engineer', skills: ['SQL', 'Python', 'Pandas', 'Tableau', 'Data Analysis'] }
];

const COLLABORATIONS = [
  { p1: 'Alex Rivera', p2: 'Priya Sharma' },
  { p1: 'Alex Rivera', p2: 'Aisha Patel' },
  { p1: 'Sarah Chen', p2: 'James Wilson' },
  { p1: 'Sarah Chen', p2: 'Ava Kowalski' },
  { p1: 'Marcus Vance', p2: 'Maya Lin' },
  { p1: 'Marcus Vance', p2: 'Liam O\'Connor' },
  { p1: 'Elena Rostova', p2: 'Amara Okafor' },
  { p1: 'David Kim', p2: 'Sophia Tanaka' },
  { p1: 'Lucas Meyer', p2: 'Priya Sharma' },
  { p1: 'Tariq Al-Mansoor', p2: 'Alex Rivera' }
];

// ----------------------------------------------------
// SEED EXECUTION ENGINE
// ----------------------------------------------------

async function runSeed() {
  console.log('🚀 Starting CognoDB Graph Seed Process...');
  const session = driver.session();

  try {
    // 1. Create Constraints
    console.log('📦 Applying Database Constraints...');
    const constraints = [
      'CREATE CONSTRAINT person_name_unique IF NOT EXISTS FOR (p:Person) REQUIRE p.name IS UNIQUE',
      'CREATE CONSTRAINT skill_name_unique IF NOT EXISTS FOR (s:Skill) REQUIRE s.name IS UNIQUE',
      'CREATE CONSTRAINT project_name_unique IF NOT EXISTS FOR (pr:Project) REQUIRE pr.name IS UNIQUE',
      'CREATE CONSTRAINT company_name_unique IF NOT EXISTS FOR (c:Company) REQUIRE c.name IS UNIQUE',
      'CREATE CONSTRAINT jobrole_title_unique IF NOT EXISTS FOR (j:JobRole) REQUIRE j.title IS UNIQUE'
    ];

    for (const c of constraints) {
      try {
        await session.run(c);
      } catch (err) {
        // CognoDB / Neo4j fallback if IF NOT EXISTS or syntax varies slightly
        console.warn(`Constraint status (${c.split(' ')[2]}): ${err.message}`);
      }
    }

    // 2. Seed Skills
    console.log(`📌 Merging ${SKILLS.length} Skills...`);
    for (const skill of SKILLS) {
      await session.run(
        `MERGE (s:Skill {name: $name})
         SET s.category = $category`,
        skill
      );
    }

    // 3. Seed Companies
    console.log(`🏢 Merging ${COMPANIES.length} Companies...`);
    for (const company of COMPANIES) {
      await session.run(
        `MERGE (c:Company {name: $name})
         SET c.industry = $industry`,
        company
      );
    }

    // 4. Seed Persons
    console.log(`👤 Merging ${PERSONS.length} Persons...`);
    for (const person of PERSONS) {
      await session.run(
        `MERGE (p:Person {name: $name})
         SET p.role = $role,
             p.location = $location,
             p.experienceYears = $experienceYears`,
        person
      );
    }

    // 5. Seed Projects
    console.log(`🚀 Merging ${PROJECTS.length} Projects...`);
    for (const project of PROJECTS) {
      await session.run(
        `MERGE (pr:Project {name: $name})
         SET pr.description = $description,
             pr.difficulty = $difficulty`,
        project
      );
    }

    // 6. Seed Job Roles & Company OFFERS relationship
    console.log(`💼 Merging ${JOB_ROLES.length} Job Roles & OFFERS relationships...`);
    for (const job of JOB_ROLES) {
      await session.run(
        `MERGE (j:JobRole {title: $title})
         SET j.location = $location,
             j.experienceLevel = $experienceLevel
         WITH j
         MATCH (c:Company {name: $company})
         MERGE (c)-[:OFFERS]->(j)`,
        job
      );
    }

    // 7. Seed KNOWS relationships (Person -> Skill)
    console.log('🔗 Creating Person -[:KNOWS]-> Skill relationships...');
    for (const item of PERSON_KNOWS_SKILLS) {
      for (const skillName of item.skills) {
        await session.run(
          `MATCH (p:Person {name: $person})
           MATCH (s:Skill {name: $skill})
           MERGE (p)-[:KNOWS]->(s)`,
          { person: item.person, skill: skillName }
        );
      }
    }

    // 8. Seed BUILT relationships (Person -> Project)
    console.log('🔗 Creating Person -[:BUILT]-> Project relationships...');
    for (const item of PERSON_BUILT_PROJECTS) {
      await session.run(
        `MATCH (p:Person {name: $person})
         MATCH (pr:Project {name: $project})
         MERGE (p)-[:BUILT]->(pr)`,
        item
      );
    }

    // 9. Seed USES relationships (Project -> Skill)
    console.log('🔗 Creating Project -[:USES]-> Skill relationships...');
    for (const item of PROJECT_USES_SKILLS) {
      for (const skillName of item.skills) {
        await session.run(
          `MATCH (pr:Project {name: $project})
           MATCH (s:Skill {name: $skill})
           MERGE (pr)-[:USES]->(s)`,
          { project: item.project, skill: skillName }
        );
      }
    }

    // 10. Seed WORKED_AT relationships (Person -> Company)
    console.log('🔗 Creating Person -[:WORKED_AT]-> Company relationships...');
    for (const item of PERSON_WORKED_AT_COMPANIES) {
      await session.run(
        `MATCH (p:Person {name: $person})
         MATCH (c:Company {name: $company})
         MERGE (p)-[:WORKED_AT]->(c)`,
        item
      );
    }

    // 11. Seed REQUIRES relationships (JobRole -> Skill)
    console.log('🔗 Creating JobRole -[:REQUIRES]-> Skill relationships...');
    for (const item of JOB_REQUIRES_SKILLS) {
      for (const skillName of item.skills) {
        await session.run(
          `MATCH (j:JobRole {title: $job})
           MATCH (s:Skill {name: $skill})
           MERGE (j)-[:REQUIRES]->(s)`,
          { job: item.job, skill: skillName }
        );
      }
    }

    // 12. Seed COLLABORATED_WITH relationships (Person <-> Person)
    console.log('🔗 Creating Person -[:COLLABORATED_WITH]-> Person relationships...');
    for (const item of COLLABORATIONS) {
      await session.run(
        `MATCH (p1:Person {name: $p1})
         MATCH (p2:Person {name: $p2})
         MERGE (p1)-[:COLLABORATED_WITH]->(p2)`,
        item
      );
    }

    console.log('✅ Graph Seed Completed Successfully!');

    // Get Summary Stats
    const result = await session.run(`
      MATCH (n)
      RETURN labels(n)[0] AS label, count(n) AS count
    `);

    console.log('\n📊 Database Node Counts:');
    result.records.forEach(record => {
      console.log(`   - ${record.get('label')}: ${record.get('count')}`);
    });

  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

runSeed();
