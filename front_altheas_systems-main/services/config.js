export const API_CONFIG = {
  // Vos URLs de base
  authBaseUrl: process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:5002", 
  catalogBaseUrl: process.env.NEXT_PUBLIC_CATALOG_API_URL || "http://localhost:8082",
  supportBaseUrl: process.env.NEXT_PUBLIC_SUPPORT_API_URL || "http://localhost:8081",
  adminBaseUrl: process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:8083",
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8082",
  
  // 👇 LA CORRECTION EST ICI : On coupe DÉFINITIVEMENT les fausses données !
  useMocks: false, 
  
  defaultHeaders: {
    "Content-Type": "application/json",
  },
};