"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchAllProducts } from "../../services/api/catalogApi";
import { useCart } from "../../context/CartContext";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { addToCart } = useCart();

  // --- ÉTATS ---
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState("relevance");
  
  // États des Filtres
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStock, setFilterStock] = useState(false);
  const [maxPrice, setMaxPrice] = useState(300000);

  useEffect(() => {
    async function load() {
      const products = await fetchAllProducts();
      setAllProducts(products);
      setLoading(false);
    }
    load();
  }, []);

  // --- LOGIQUE DE RECHERCHE ET FILTRAGE ---
  const filteredProducts = useMemo(() => {
    let results = allProducts.filter(p => {
      const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = filterCategory === "all" || p.categoryId === filterCategory;
      const matchStock = filterStock ? p.inStock : true;
      const matchPrice = p.price <= maxPrice;

      return matchQuery && matchCategory && matchStock && matchPrice;
    });

    // Tri
    if (sortBy === "price-asc") results.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") results.sort((a, b) => b.price - a.price);
    
    return results;
  }, [allProducts, searchQuery, filterCategory, filterStock, maxPrice, sortBy]);

  if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Recherche en cours...</div>;

  return (
    <main style={{ maxWidth: "1400px", margin: "40px auto", padding: "0 20px", fontFamily: "'Inter', sans-serif" }}>
      
      {/* 🔍 BARRE DE RECHERCHE SUPÉRIEURE */}
      <section style={{ marginBottom: "40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", color: "#0f172a", marginBottom: "20px" }}>Trouver un équipement</h1>
        <div style={{ position: "relative", maxWidth: "700px", margin: "0 auto" }}>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Scanner, IRM, Lit médicalisé..."
            style={{ width: "100%", padding: "18px 25px", borderRadius: "15px", border: "2px solid #e2e8f0", fontSize: "1.1rem", outline: "none", transition: "border-color 0.2s" }}
            onFocus={(e) => e.target.style.borderColor = "#2563eb"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
          />
          <span style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)", fontSize: "1.5rem" }}>🔍</span>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "40px" }}>
        
        {/* 🛠️ SIDEBAR : FILTRES */}
        <aside style={{ backgroundColor: "#f8fafc", padding: "30px", borderRadius: "20px", border: "1px solid #e2e8f0", alignSelf: "start", position: "sticky", top: "120px" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "25px", color: "#0f172a" }}>Filtres</h2>

          {/* Catégories */}
          <div style={{ marginBottom: "30px" }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "12px", fontSize: "0.9rem", color: "#64748b", textTransform: "uppercase" }}>Domaine d'expertise</label>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            >
              <option value="all">Toutes les catégories</option>
              <option value="imagerie">Imagerie Médicale</option>
              <option value="mobilier">Mobilier Médical</option>
              <option value="dentaire">Équipement Dentaire</option>
              <option value="laboratoire">Laboratoire</option>
              <option value="chirurgie">Bloc Opératoire</option>
              <option value="monitoring">Monitoring</option>
            </select>
          </div>

          {/* Prix Max */}
          <div style={{ marginBottom: "30px" }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "12px", fontSize: "0.9rem", color: "#64748b", textTransform: "uppercase" }}>Budget Max : {maxPrice.toLocaleString()} €</label>
            <input 
              type="range" 
              min="0" 
              max="300000" 
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              style={{ width: "100%", cursor: "pointer" }}
            />
          </div>

          {/* Disponibilité */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input 
              type="checkbox" 
              id="stock" 
              checked={filterStock} 
              onChange={() => setFilterStock(!filterStock)} 
              style={{ width: "18px", height: "18px" }}
            />
            <label htmlFor="stock" style={{ fontWeight: "600", fontSize: "0.95rem", cursor: "pointer" }}>En stock uniquement</label>
          </div>

          <button 
            onClick={() => { setFilterCategory("all"); setFilterStock(false); setMaxPrice(300000); }}
            style={{ marginTop: "30px", width: "100%", padding: "10px", background: "none", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", color: "#64748b" }}
          >
            Réinitialiser
          </button>
        </aside>

        {/* 📦 RÉSULTATS */}
        <section>
          {/* Header des résultats */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
            <p style={{ color: "#64748b" }}><strong>{filteredProducts.length}</strong> produits trouvés</p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "0.9rem", color: "#64748b" }}>Trier par :</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none" }}
              >
                <option value="relevance">Pertinence</option>
                <option value="price-asc">Prix : Croissant</option>
                <option value="price-desc">Prix : Décroissant</option>
              </select>
            </div>
          </div>

          {/* Grille de produits */}
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px", backgroundColor: "#f8fafc", borderRadius: "20px" }}>
              <p style={{ fontSize: "1.2rem", color: "#64748b" }}>Aucun résultat ne correspond à vos critères.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
              {filteredProducts.map((product) => (
                <div key={product.id} style={{ backgroundColor: "white", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "20px", transition: "transform 0.2s, box-shadow 0.2s", position: "relative" }}
                     onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.05)"; }}
                     onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  
                  {/* Badge Disponibilité */}
                  {!product.inStock && <span style={{ position: "absolute", top: "15px", right: "15px", backgroundColor: "#fee2e2", color: "#dc2626", padding: "4px 10px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "bold", zIndex: 1 }}>Rupture</span>}
                  
                  <Link href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ height: "200px", borderRadius: "12px", overflow: "hidden", backgroundColor: "#f8fafc", marginBottom: "15px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={product.imageUrl} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} onError={(e) => e.target.src = "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200"} />
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: "bold", textTransform: "uppercase" }}>{product.categoryName}</span>
                    <h3 style={{ margin: "5px 0 10px 0", fontSize: "1.1rem", color: "#0f172a", height: "45px", overflow: "hidden" }}>{product.name}</h3>
                    <p style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#0f172a", marginBottom: "15px" }}>{product.price.toLocaleString()} €</p>
                  </Link>

                  <button 
                    onClick={() => addToCart(product, 1)}
                    disabled={!product.inStock}
                    style={{ width: "100%", padding: "12px", backgroundColor: product.inStock ? "#0f172a" : "#f1f5f9", color: product.inStock ? "white" : "#94a3b8", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: product.inStock ? "pointer" : "not-allowed" }}
                  >
                    {product.inStock ? "Ajouter au panier" : "Indisponible"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}