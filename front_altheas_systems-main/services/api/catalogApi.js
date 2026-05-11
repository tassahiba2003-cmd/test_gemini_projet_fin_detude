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

// 1. Récupère un seul produit par son ID
export async function fetchProductById(productId) {
  if (API_CONFIG.useMocks) {
    const products = getFlattenedProducts();
    // Utilisation de == pour la compatibilité ID texte/nombre
    return products.find(p => p.id == productId) || null;
  }
  return null;
}

// 2. Récupère une catégorie entière
export async function fetchCategoryById(categoryId) {
  if (API_CONFIG.useMocks) {
    return mockCatalogData[categoryId] || null;
  }
  return null;
}

// 3. Récupère uniquement les produits d'une catégorie
export async function fetchProductsByCategory(categoryId) {
  if (API_CONFIG.useMocks) {
    const category = mockCatalogData[categoryId];
    return category ? category.products : [];
  }
  return [];
}

// 4. Récupère TOUS les produits (pour la recherche)
export async function fetchAllProducts() {
  if (API_CONFIG.useMocks) {
    return getFlattenedProducts();
  }
  return [];
}

// 5. Récupère 6 produits similaires (Même catégorie + Priorité au Stock)
// 🚀 UNE SEULE DÉFINITION ICI POUR ÉVITER L'ERREUR "DEFINED MULTIPLE TIMES"
export async function fetchSimilarProducts(productId, categoryId) {
  if (API_CONFIG.useMocks) {
    const category = mockCatalogData[categoryId];
    if (!category) {
        // Si pas de catégorie, on prend n'importe quels produits au hasard
        const all = getFlattenedProducts();
        return all.filter(p => p.id != productId).slice(0, 6);
    }

    // 1. On filtre pour exclure le produit actuel
    const otherProducts = category.products.filter(p => p.id != productId);

    // 2. On trie : ceux en stock d'abord (inStock: true avant inStock: false)
    const sortedSimilar = [...otherProducts].sort((a, b) => {
      if (a.inStock && !b.inStock) return -1;
      if (!a.inStock && b.inStock) return 1;
      return 0;
    });

    // 3. On en prend 6 maximum
    return sortedSimilar.slice(0, 6);
  }
  return [];
}