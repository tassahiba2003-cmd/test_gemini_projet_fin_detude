// services/api/catalogApi.js

import { API_CONFIG } from "../config";
import { mockCatalogData } from "../mocks/catalog.mock";

// 🛠️ Fonction utilitaire : Transforme le catalogue en une liste simple de tous les produits
const getFlattenedProducts = () => {
  const allProducts = [];
  Object.entries(mockCatalogData).forEach(([catId, category]) => {
    category.products.forEach(product => {
      allProducts.push({ 
        ...product, 
        categoryId: catId,
        categoryName: category.name 
      });
    });
  });
  return allProducts;
};

// 1. Récupère un seul produit par son ID (Utilisé par la page Détail Produit)
export async function fetchProductById(productId) {
  if (API_CONFIG.useMocks) {
    const products = getFlattenedProducts();
    // 💡 On utilise == pour que l'ID "101" (URL) trouve l'ID 101 (Nombre)
    return products.find(p => p.id == productId) || null;
  }
  return null;
}

// 2. Récupère une catégorie entière (Utilisé par la page Catégorie)
export async function fetchCategoryById(categoryId) {
  if (API_CONFIG.useMocks) {
    return mockCatalogData[categoryId] || null;
  }
  return null;
}

// 3. Récupère uniquement les produits d'une catégorie (C'est ça qui manquait !)
export async function fetchProductsByCategory(categoryId) {
  if (API_CONFIG.useMocks) {
    const category = mockCatalogData[categoryId];
    return category ? category.products : [];
  }
  return [];
}

// 4. Récupère TOUS les produits (Utilisé pour la barre de recherche ou la page Tous les produits)
export async function fetchAllProducts() {
  if (API_CONFIG.useMocks) {
    return getFlattenedProducts();
  }
  return [];
}

// 5. Récupère des produits similaires (Utilisé en bas de la page Détail Produit)
export async function fetchSimilarProducts(productId) {
  if (API_CONFIG.useMocks) {
    const products = getFlattenedProducts();
    // On prend 4 autres produits au hasard
    return products.filter(p => p.id != productId).slice(0, 4);
  }
  return [];
}