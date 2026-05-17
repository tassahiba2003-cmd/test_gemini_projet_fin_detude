"use client";
import { useState, useEffect, useMemo, Suspense } from "react"; // 💡 Ajout de Suspense ici
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchAllProducts } from "../../services/api/catalogApi";
import { useCart } from "../../context/CartContext";

// 🚀 On déplace la logique dans un sous-composant interne
function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { addToCart } = useCart();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState("newest"); 
  const [selectedCategories, setSelectedCategories] = useState([]); 
  const [maxPrice, setMaxPrice] = useState(300000);
  const [onlyInStock, setOnlyInStock] = useState(false);

  useEffect(() => {
    async function load() {
      const products = await fetchAllProducts();
      setAllProducts(products);
      setLoading(false);
    }
    load();
  }, []);

  const categories = [
    { id: "imagerie", name: "Imagerie Médicale" },
    { id: "mobilier", name: "Mobilier Médical" },
    { id: "dentaire", name: "Équipement Dentaire" },
    { id: "laboratoire", name: "Laboratoire" },
    { id: "chirurgie", name: "Bloc Opératoire" },
    { id: "monitoring", name: "Monitoring" }
  ];

  const filteredProducts = useMemo(() => {
    let results = allProducts.filter(p => {
      const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(p.categoryId);
      const matchPrice = p.price <= maxPrice;
      const matchStock = onlyInStock ? p.inStock : true;
      return matchQuery && matchCategory && matchPrice && matchStock;
    });

    if (sortBy === "price-asc") results.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") results.sort((a, b) => b.price - a.price);
    if (sortBy === "newest") results.sort((a, b) => (b.isPriority ? 1 : 0) - (a.isPriority ? 1 : 0));
    
    return results;
  }, [allProducts, searchQuery, selectedCategories, maxPrice, onlyInStock, sortBy]);

  const toggleCategory = (id) => {
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Recherche dans le catalogue...</div>;

  return (
    <main style={{ maxWidth: "1400px", margin: "40px auto", padding: "0 20px", fontFamily: "'Inter', sans-serif" }}>
      
      {/* HEADER DE RECHERCHE */}
      <section style={{ marginBottom: "50px" }}>
        <nav style={{ marginBottom: "20px", fontSize: "0.85rem", color: "#64748b" }}><Link href="/">Accueil</Link> / Recherche</nav>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: "2rem", color: "#0f172a", margin: 0 }}>Résultats pour "{searchQuery || "Tous les produits"}"</h1>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "0.9rem", color: "#64748b" }}>Trier par</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: "10px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}>
              <option value="newest">Nouveautés (Priorité)</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "50px" }}>
        
        {/* SIDEBAR FILTRES */}
        <aside style={{ alignSelf: "start", position: "sticky", top: "120px" }}>
          <div style={{ marginBottom: "40px" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>Catégories</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {categories.map(cat => (
                <label key={cat.id} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.95rem", color: "#475569" }}>
                  <input type="checkbox" checked={selectedCategories.includes(cat.id)} onChange={() => toggleCategory(cat.id)} style={{ width: "18px", height: "18px" }} />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "40px" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>Budget maximum</h3>
            <p style={{ fontWeight: "bold", color: "#2563eb", marginBottom: "10px" }}>{maxPrice.toLocaleString()} €</p>
            <input type="range" min="0" max="300000" step="1000" value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value))} style={{ width: "100%", cursor: "pointer" }} />
          </div>

          <div style={{ marginBottom: "40px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", fontWeight: "bold" }}>
              <input type="checkbox" checked={onlyInStock} onChange={() => setOnlyInStock(!onlyInStock)} style={{ width: "20px", height: "20px" }} />
              En stock uniquement
            </label>
          </div>

          <button onClick={() => { setSelectedCategories([]); setMaxPrice(300000); setOnlyInStock(false); }} style={{ width: "100%", padding: "12px", backgroundColor: "#f1f5f9", border: "none", borderRadius: "10px", color: "#64748b", fontWeight: "bold", cursor: "pointer" }}>Réinitialiser les filtres</button>
        </aside>

        {/* GRILLE DE RÉSULTATS */}
        <section>
          <p style={{ color: "#64748b", marginBottom: "20px" }}>{filteredProducts.length} équipement(s) trouvé(s)</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "30px" }}>
            {filteredProducts.map(product => (
              <div key={product.id} style={{ backgroundColor: "white", borderRadius: "24px", border: "1px solid #e2e8f0", padding: "20px", transition: "all 0.3s" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <Link href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ height: "220px", borderRadius: "18px", overflow: "hidden", backgroundColor: "#f8fafc", marginBottom: "20px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={product.imageUrl} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200"; }} />
                    {product.isPriority && <span style={{ position: "absolute", top: "15px", left: "15px", backgroundColor: "#2563eb", color: "white", padding: "4px 10px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: "bold" }}>NOUVEAU</span>}
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: "bold", textTransform: "uppercase" }}>{product.categoryName}</span>
                  <h3 style={{ margin: "5px 0 10px 0", fontSize: "1.1rem", color: "#0f172a", height: "48px", overflow: "hidden" }}>{product.name}</h3>
                  <p style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#0f172a", marginBottom: "20px" }}>{product.price.toLocaleString()} €</p>
                </Link>
                <button 
                  onClick={() => addToCart(product, 1)}
                  disabled={!product.inStock}
                  style={{ width: "100%", padding: "14px", backgroundColor: product.inStock ? "#0f172a" : "#f1f5f9", color: product.inStock ? "white" : "#94a3b8", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: product.inStock ? "pointer" : "not-allowed" }}
                >
                  {product.inStock ? "Ajouter au panier" : "En rupture"}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

// 💡 Export principal enveloppé dans un Suspense Boundary requis pour le build de production Next.js
export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: "100px", textAlign: "center" }}>Recherche dans le catalogue...</div>}>
      <SearchContent />
    </Suspense>
  );
}