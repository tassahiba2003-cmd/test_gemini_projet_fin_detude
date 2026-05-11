// app/categories/[categoryId]/page.js

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchCategoryById } from "../../../services/api/catalogApi";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchCategoryById(categoryId);
      setCategory(data);
      setLoading(false);
    }
    loadData();
  }, [categoryId]);

  if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Chargement de la catégorie...</div>;
  if (!category) return <div style={{ padding: "100px", textAlign: "center" }}><h1>Catégorie introuvable</h1></div>;

  // 🔢 Logique de tri obligatoire : 
  // 1. En stock + Prioritaire d'abord
  // 2. En stock normal ensuite
  // 3. Rupture de stock à la fin
  const sortedProducts = [...category.products].sort((a, b) => {
    if (a.inStock && !b.inStock) return -1;
    if (!a.inStock && b.inStock) return 1;
    if (a.inStock && b.inStock) {
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
    }
    return 0;
  });

  return (
    <main style={{ fontFamily: "sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      
      {/* 🖼️ Hero Section avec Overlay */}
      <section style={{ 
        position: "relative", height: "350px", width: "100%", overflow: "hidden", backgroundColor: "#0f172a" 
      }}>
        <div style={{
          width: "100%", height: "100%",
          backgroundImage: `url(${category.products[0]?.imageUrl})`,
          backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.4)"
        }}></div>
        <div style={{
          position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <h1 style={{ color: "white", fontSize: "3.5rem", fontWeight: "bold", textTransform: "uppercase", textShadow: "2px 2px 10px rgba(0,0,0,0.5)" }}>
            {category.name}
          </h1>
        </div>
      </section>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "50px 20px" }}>
        
        {/* 📄 Description */}
        <div style={{ marginBottom: "60px", borderLeft: "6px solid #2563eb", paddingLeft: "25px" }}>
          <p style={{ fontSize: "1.3rem", color: "#475569", lineHeight: "1.7", maxWidth: "900px" }}>
            {category.description}
          </p>
        </div>

        {/* 📦 Grille de Produits */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: "35px" 
        }}>
          {sortedProducts.map(prod => (
            <Link 
              href={`/products/${prod.id}`} 
              key={prod.id} 
              style={{ 
                textDecoration: "none", 
                color: "inherit",
                opacity: prod.inStock ? 1 : 0.7, // Grisé si rupture
                filter: prod.inStock ? "none" : "grayscale(0.9)"
              }}
            >
              <div style={{ 
                backgroundColor: "white", borderRadius: "20px", overflow: "hidden", 
                boxShadow: "0 10px 20px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0",
                transition: "transform 0.3s ease", height: "100%", display: "flex", flexDirection: "column"
              }} onMouseEnter={e => prod.inStock && (e.currentTarget.style.transform = "translateY(-8px)")} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                
                {/* 🚀 CORRECTION IMAGE : Balise img pour être sûr qu'elle s'affiche */}
                <div style={{ width: "100%", height: "240px", overflow: "hidden", backgroundColor: "#f1f5f9" }}>
                  <img 
                    src={prod.imageUrl} 
                    alt={prod.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400"; }} // Image de secours
                  />
                </div>
                
                <div style={{ padding: "25px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ margin: "0 0 10px 0", color: "#0f172a", fontSize: "1.3rem", fontWeight: "bold", lineHeight: "1.4" }}>
                    {prod.name}
                  </h3>
                  
                  <p style={{ color: "#2563eb", fontWeight: "bold", fontSize: "1.5rem", margin: "0 0 10px 0" }}>
                    {prod.price.toLocaleString("fr-FR")} €
                  </p>

                  {/* 🏷️ Mention rupture de stock */}
                  {!prod.inStock && (
                    <span style={{ 
                      backgroundColor: "#fee2e2", color: "#dc2626", padding: "5px 12px", 
                      borderRadius: "6px", fontSize: "0.85rem", fontWeight: "bold", width: "fit-content"
                    }}>
                      ⚠️ EN RUPTURE DE STOCK
                    </span>
                  )}
                  
                  <div style={{ marginTop: "auto", paddingTop: "20px", color: "#64748b", fontWeight: "bold", fontSize: "0.9rem" }}>
                    Détails du produit →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}