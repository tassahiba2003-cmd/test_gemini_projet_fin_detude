export const API_CONFIG = {
  // 👇 C'est ici qu'on change 8080 en 5002 !
  authBaseUrl: process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:5002", 
  catalogBaseUrl: process.env.NEXT_PUBLIC_CATALOG_API_URL || "http://localhost:8082",
  supportBaseUrl: process.env.NEXT_PUBLIC_SUPPORT_API_URL || "http://localhost:8081",
  adminBaseUrl: process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:8083",
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8082",
  useMocks: process.env.NEXT_PUBLIC_USE_API_MOCKS !== "false",
  defaultHeaders: {
    "Content-Type": "application/json",
  },
};