// Global API configuration
export const API_CONFIG = {
  BASE_URL: 'https://dev-journal-backend.vercel.app',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  // Posts
  POSTS_META_LIST: `${API_CONFIG.BASE_URL}/posts/metaList`,
  POST_BY_ID: (id: string) => `${API_CONFIG.BASE_URL}/posts/${id}`,
  
  // Projects
  PROJECTS_META_LIST: `${API_CONFIG.BASE_URL}/projects/metaList`,
  PROJECT_BY_ID: (id: string) => `${API_CONFIG.BASE_URL}/projects/${id}`,
  
  // Subscribers
  SUBSCRIBERS_NEW: `${API_CONFIG.BASE_URL}/subscribers/new`,
} as const;