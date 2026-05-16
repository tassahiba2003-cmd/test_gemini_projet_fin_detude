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

// 1. Récupère un seul produit par son ID (FORCE LE MOCK)
export async function fetchProductById(productId) {
  const products = getFlattenedProducts();
  // Utilisation de == pour la compatibilité ID texte/nombre
  return products.find(p => p.id == productId) || null;
}

// 2. Récupère une catégorie entière (FORCE LE MOCK)
export async function fetchCategoryById(categoryId) {
  return mockCatalogData[categoryId] || null;
}

// 3. Récupère uniquement les produits d'une catégorie (FORCE LE MOCK)
export async function fetchProductsByCategory(categoryId) {
  const category = mockCatalogData[categoryId];
  return category ? category.products : [];
}

// 4. Récupère TOUS les produits pour la recherche (FORCE LE MOCK)
export async function fetchAllProducts() {
  return getFlattenedProducts();
}

// 5. Récupère 6 produits similaires (FORCE LE MOCK)
export async function fetchSimilarProducts(productId, categoryId) {
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