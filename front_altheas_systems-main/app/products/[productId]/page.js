"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchProductById, fetchSimilarProducts } from "../../../services/api/catalogApi";
import { useCart } from "../../../context/CartContext";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0); // Pour le carrousel
  
  const { cart, addToCart } = useCart();

  useEffect(() => {
    // 🚀 Correction du scroll : remonter tout en haut au chargement
    window.scrollTo(0, 0);

    async function loadData() {
      const data = await fetchProductById(productId);
      if (data) {
        const similar = await fetchSimilarProducts(productId, data.categoryId);
        setProduct(data);
        setSimilarProducts(similar);
      }
      setLoading(false);
    }
    loadData();
  }, [productId]);

  if (loading) return <div style={{ padding: "100px", textAlign: "center", fontFamily: "sans-serif" }}>Chargement de l'équipement...</div>;
  if (!product) return <div style={{ padding: "100px", textAlign: "center" }}><h1>Équipement introuvable</h1><Link href="/">Retour à l'accueil</Link></div>;

  const itemInCart = cart.find(item => item.id == product.id);
  const availableStock = product.stockCount - (itemInCart ? itemInCart.quantity : 0);
  const displayQuantity = quantity > availableStock ? Math.max(1, availableStock) : quantity;

  // Simulation de plusieurs images pour le carrousel (comme demandé dans le cahier des charges)
  const productImages = [product.imageUrl, product.imageUrl, product.imageUrl];

  const handleBuyNow = () => {
    addToCart(product, displayQuantity, false);
    router.push('/cart');
  };

  return (
    <main style={{ maxWidth: "1200px", margin: "40px auto", padding: "20px", fontFamily: "'Inter', sans-serif" }}>
      
      {/* 🧭 Fil d'ariane */}
      <nav style={{ marginBottom: "30px", color: "#64748b", fontSize: "0.9rem" }}>
        <Link href="/" style={{ color: "#2563eb", textDecoration: "none" }}>Accueil</Link> / 
        <Link href="/products" style={{ color: "#2563eb", textDecoration: "none", margin: "0 5px" }}>Catalogue</Link> / 
        <span style={{ color: "#0f172a", fontWeight: "bold" }}>{product.name}</span>
      </nav>

      <div style={{ display: "flex", gap: "60px", flexWrap: "wrap", marginBottom: "80px" }}>
        
        {/* 📸 CARROUSEL D'IMAGES (Demandé Page 7) */}
        <div style={{ flex: "1.2", minWidth: "350px" }}>
          <div style={{ borderRadius: "24px", overflow: "hidden", border: "1px solid #e2e8f0", position: "relative", backgroundColor: "white", marginBottom: "20px" }}>
            <img 
              src={productImages[activeImage]} 
              alt={product.name} 
              style={{ width: "100%", height: "500px", objectFit: "contain", display: "block" }} 
            />
            {product.isPriority && (
              <span style={{ position: "absolute", top: "20px", left: "20px", backgroundColor: "#2563eb", color: "white", padding: "6px 15px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: "bold" }}>NOUVEAUTÉ</span>
            )}
            {!product.inStock && (
              <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ backgroundColor: "#dc2626", color: "white", padding: "10px 30px", borderRadius: "50px", fontWeight: "bold" }}>RUPTURE DE STOCK</span>
              </div>
            )}
          </div>
          
          {/* Miniatures du carrousel */}
          <div style={{ display: "flex", gap: "15px" }}>
            {productImages.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveImage(idx)}
                style={{ width: "80px", height: "80px", borderRadius: "12px", border: activeImage === idx ? "2px solid #2563eb" : "1px solid #e2e8f0", cursor: "pointer", overflow: "hidden", opacity: activeImage === idx ? 1 : 0.6 }}
              >
                <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>

        {/* ℹ️ INFOS À DROITE */}
        <div style={{ flex: "1", minWidth: "350px" }}>
          <span style={{ color: "#2563eb", fontWeight: "bold", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1px" }}>{product.categoryName}</span>
          <h1 style={{ fontSize: "2.5rem", color: "#0f172a", margin: "10px 0 20px 0" }}>{product.name}</h1>
          
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "30px" }}>
            <span style={{ fontSize: "2.2rem", fontWeight: "bold", color: "#0f172a" }}>{product.price.toLocaleString()} €</span>
            <span style={{ color: "#64748b", fontSize: "1rem" }}>HT par unité</span>
          </div>

          <div style={{ backgroundColor: "#f8fafc", padding: "25px", borderRadius: "20px", border: "1px solid #e2e8f0", marginBottom: "30px" }}>
            <h3 style={{ fontSize: "1rem", color: "#0f172a", marginBottom: "10px" }}>Description</h3>
            <p style={{ color: "#475569", lineHeight: "1.6", margin: 0 }}>{product.description}</p>
          </div>

          {/* 🛠️ CARACTÉRISTIQUES TECHNIQUES (Structurées) */}
          <div style={{ marginBottom: "40px" }}>
            <h3 style={{ fontSize: "1rem", color: "#0f172a", marginBottom: "15px" }}>Spécifications techniques</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {product.specs?.map((spec, i) => (
                <div key={i} style={{ padding: "12px", backgroundColor: "white", border: "1px solid #f1f5f9", borderRadius: "10px", fontSize: "0.9rem", color: "#64748b" }}>
                  • {spec}
                </div>
              ))}
            </div>
          </div>

          {/* 🛒 ACTIONS CTA */}
          {product.inStock && availableStock > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "5px", backgroundColor: "white" }}>
                  <button onClick={() => setQuantity(Math.max(1, displayQuantity - 1))} disabled={displayQuantity <= 1} style={{ padding: "10px 20px", border: "none", background: "none", cursor: "pointer", fontSize: "1.2rem", color: displayQuantity <= 1 ? "#cbd5e1" : "#0f172a" }}>-</button>
                  <span style={{ width: "40px", textAlign: "center", fontWeight: "bold" }}>{displayQuantity}</span>
                  <button onClick={() => setQuantity(Math.min(availableStock, displayQuantity + 1))} disabled={displayQuantity >= availableStock} style={{ padding: "10px 20px", border: "none", background: "none", cursor: "pointer", fontSize: "1.2rem", color: displayQuantity >= availableStock ? "#cbd5e1" : "#0f172a" }}>+</button>
                </div>
                <button 
                  onClick={() => addToCart(product, displayQuantity, true)}
                  style={{ flex: 1, padding: "18px", backgroundColor: "white", color: "#2563eb", border: "2px solid #2563eb", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" }}
                >
                  Ajouter au panier
                </button>
              </div>
              <button 
                onClick={handleBuyNow}
                style={{ width: "100%", padding: "20px", backgroundColor: "#0f172a", color: "white", border: "none", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer" }}
              >
                Acheter maintenant
              </button>
            </div>
          ) : (
            <button disabled style={{ width: "100%", padding: "20px", backgroundColor: "#f1f5f9", color: "#94a3b8", border: "1px solid #e2e8f0", borderRadius: "12px", fontWeight: "bold", cursor: "not-allowed" }}>
              Équipement indisponible
            </button>
          )}
        </div>
      </div>

      {/* 🔄 6 PRODUITS SIMILAIRES (Priorité disponibilité) */}
      <section style={{ borderTop: "1px solid #e2e8f0", paddingTop: "60px" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "40px", color: "#0f172a" }}>Produits similaires suggérés</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "25px" }}>
          {similarProducts.map(item => (
            <Link href={`/products/${item.id}`} key={item.id} style={{ textDecoration: "none" }}>
              <div style={{ backgroundColor: "white", borderRadius: "20px", border: "1px solid #f1f5f9", padding: "15px", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{ height: "180px", borderRadius: "12px", overflow: "hidden", backgroundColor: "#f8fafc", marginBottom: "15px" }}>
                  <img src={item.imageUrl} style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200"; }} />
                </div>
                <h4 style={{ margin: "0 0 5px 0", color: "#0f172a", fontSize: "1rem" }}>{item.name}</h4>
                <p style={{ color: "#2563eb", fontWeight: "bold", margin: 0 }}>{item.price.toLocaleString()} €</p>
                {!item.inStock && <span style={{ fontSize: "0.75rem", color: "#dc2626", fontWeight: "bold" }}>Sur commande</span>}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}