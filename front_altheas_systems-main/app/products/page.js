"use client";
import Link from "next/link";
import { mockCatalogData } from "../../services/mocks/catalog.mock";

export default function CatalogPage() {
  
  // 🚀 PRÉPARATION DES DONNÉES : On récupère les catégories ET on trie les produits
  const categories = Object.entries(mockCatalogData).map(([id, data]) => {
    
    // Le même tri intelligent que sur la page Catégorie (Priorité > Stock > Rupture)
    const sortedProducts = [...data.products].sort((a, b) => {
      if (a.inStock && !b.inStock) return -1;
      if (!a.inStock && b.inStock) return 1;
      if (a.inStock && b.inStock) {
        if (a.isPriority && !b.isPriority) return -1;
        if (!a.isPriority && b.isPriority) return 1;
      }
      return 0;
    });

    return { id, ...data, products: sortedProducts };
  });

  return (
    <main style={{ backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "sans-serif", paddingBottom: "80px" }}>
      
      {/* 🦸‍♂️ HERO BANNER */}
      <section style={{ 
        backgroundColor: "#0f172a", color: "white", padding: "70px 20px", textAlign: "center", 
        backgroundImage: "url('https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1600')", 
        backgroundSize: "cover", backgroundPosition: "center", backgroundBlendMode: "overlay" 
      }}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: "bold", margin: "0 0 15px 0", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
          Catalogue Général
        </h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto", lineHeight: "1.6", textShadow: "0 1px 5px rgba(0,0,0,0.5)" }}>
          Parcourez l'intégralité de nos équipements de pointe. Plus de 6 domaines d'expertise pour répondre à tous vos besoins médicaux.
        </p>
      </section>

      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "40px 20px" }}>
        
        {/* 🔗 SOMMAIRE RAPIDE (Boutons d'ancrage) */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginBottom: "60px", justifyContent: "center" }}>
          {categories.map(cat => (
            <a key={cat.id} href={`#${cat.id}`} style={{ 
                textDecoration: "none", backgroundColor: "white", padding: "12px 25px", 
                borderRadius: "50px", color: "#0f172a", fontWeight: "bold", 
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", transition: "all 0.2s" 
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#2563eb"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.color = "#0f172a"; }}
            >
              {cat.name} ↓
            </a>
          ))}
        </div>

        {/* 📦 AFFICHAGE DES CATÉGORIES ET PRODUITS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "80px" }}>
          {categories.map(category => (
            
            // L'ID ici permet au bouton du sommaire de faire défiler jusqu'à cette section
            <section key={category.id} id={category.id} style={{ scrollMarginTop: "40px" }}>
              
              {/* EN-TÊTE DE LA CATÉGORIE */}
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderBottom: "3px solid #e2e8f0", paddingBottom: "15px", marginBottom: "30px", flexWrap: "wrap", gap: "15px" }}>
                <div>
                  <h2 style={{ fontSize: "2.2rem", color: "#0f172a", margin: "0 0 10px 0" }}>{category.name}</h2>
                  <p style={{ color: "#64748b", margin: 0, fontSize: "1.1rem", maxWidth: "800px" }}>{category.description}</p>
                </div>
                <Link href={`/categories/${category.id}`}>
                  <button style={{ padding: "10px 25px", backgroundColor: "#e0e7ff", color: "#2563eb", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e=>e.currentTarget.style.backgroundColor="#dbeafe"} onMouseLeave={e=>e.currentTarget.style.backgroundColor="#e0e7ff"}>
                    Voir la catégorie
                  </button>
                </Link>
              </div>

              {/* GRILLE DE PRODUITS (Design Premium) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "30px" }}>
                {category.products.map(product => (
                  <Link href={`/products/${product.id}`} key={product.id} style={{ 
                      textDecoration: "none", color: "inherit",
                      opacity: product.inStock ? 1 : 0.7,
                      filter: product.inStock ? "none" : "grayscale(0.9)"
                    }}>
                    <div style={{ backgroundColor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", transition: "transform 0.3s ease", height: "100%", display: "flex", flexDirection: "column" }}
                         onMouseEnter={e => product.inStock && (e.currentTarget.style.transform = "translateY(-6px)")} 
                         onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                      
                      {/* Image avec sécurité */}
                      <div style={{ height: "220px", overflow: "hidden", backgroundColor: "#f8fafc" }}>
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400"; }} 
                        />
                      </div>
                      
                      {/* Contenu de la carte */}
                      <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                        <h4 style={{ margin: "0 0 10px 0", fontSize: "1.2rem", color: "#0f172a", lineHeight: "1.4" }}>{product.name}</h4>
                        <p style={{ fontWeight: "bold", color: "#2563eb", fontSize: "1.4rem", margin: "0 0 15px 0" }}>
                          {product.price.toLocaleString("fr-FR")} €
                        </p>

                        {/* Badge Rupture */}
                        {!product.inStock && (
                          <span style={{ backgroundColor: "#fee2e2", color: "#dc2626", padding: "5px 10px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "bold", width: "fit-content", marginBottom: "15px" }}>
                            ⚠️ RUPTURE DE STOCK
                          </span>
                        )}
                        
                        {/* Faux bouton "Détails" poussé vers le bas */}
                        <div style={{ marginTop: "auto", paddingTop: "15px", borderTop: "1px solid #f1f5f9", color: "#64748b", fontSize: "0.95rem", fontWeight: "bold" }}>
                          Détails du produit →
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

      </div>
    </main>
  );
}