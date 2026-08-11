import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response Interceptor for Error Handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An error occurred while connecting to the server.';
    if (error.response && error.response.data && error.response.data.error) {
      message = error.response.data.error;
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

export const HealthService = {
  getHealth: () => api.get('/health'),
  getStats: () => api.get('/stats')
};

export const DeveloperService = {
  getAll: () => api.get('/developers'),
  getByName: (name) => api.get(`/developers/${encodeURIComponent(name)}`),
  getSkills: (name) => api.get(`/developers/${encodeURIComponent(name)}/skills`),
  getProjects: (name) => api.get(`/developers/${encodeURIComponent(name)}/projects`),
  getRecommendations: (name) => api.get(`/developers/${encodeURIComponent(name)}/recommendations`),
  getSimilar: (name) => api.get(`/developers/${encodeURIComponent(name)}/similar`),
  getGraph: (name) => api.get(`/developers/${encodeURIComponent(name)}/graph`)
};

export const JobService = {
  getAll: () => api.get('/jobs'),
  getByTitle: (title) => api.get(`/jobs/${encodeURIComponent(title)}`),
  getSkillGap: (title, developerName) => api.get(`/jobs/${encodeURIComponent(title)}/skill-gap/${encodeURIComponent(developerName)}`)
};

export const SkillService = {
  getAll: () => api.get('/skills'),
  getByName: (name) => api.get(`/skills/${encodeURIComponent(name)}`)
};

export const CompanyService = {
  getAll: () => api.get('/companies'),
  getByName: (name) => api.get(`/companies/${encodeURIComponent(name)}`)
};

export const GraphService = {
  getFullGraph: (limit = 120) => api.get(`/graph?limit=${limit}`)
};

export default api;
