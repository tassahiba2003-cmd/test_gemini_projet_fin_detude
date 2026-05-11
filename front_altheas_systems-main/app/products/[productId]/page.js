"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchProductById, fetchSimilarProducts } from "../../../services/api/catalogApi";
import { useCart } from "../../../context/CartContext";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // 🛒 On récupère les infos du panier pour notre calcul
  const { cart, addToCart } = useCart();

  useEffect(() => {
    async function loadData() {
      const data = await fetchProductById(productId);
      const similar = await fetchSimilarProducts(productId);
      setProduct(data);
      setSimilarProducts(similar);
      setLoading(false);
    }
    loadData();
  }, [productId]);

  if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Chargement du produit...</div>;
  if (!product) return <div style={{ padding: "100px", textAlign: "center" }}><h1>Produit introuvable</h1><Link href="/">Retour</Link></div>;

  // 🧠 LE CALCUL INTELLIGENT DU STOCK
  // 1. On cherche si le produit est déjà dans le panier
  const itemInCart = cart.find(item => item.id == product.id);
  // 2. On regarde combien il y en a (sinon 0)
  const qtyInCart = itemInCart ? itemInCart.quantity : 0;
  // 3. On calcule combien on a encore le droit d'en ajouter
  const availableStock = product.stockCount - qtyInCart;

  // 🔄 Sécurité d'affichage : Si le stock dispo a baissé et que ma sélection est trop haute, je la corrige
  const displayQuantity = quantity > availableStock ? Math.max(1, availableStock) : quantity;

  return (
    <main style={{ maxWidth: "1200px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      
      {/* 🧭 Fil d'ariane */}
      <nav style={{ marginBottom: "30px", color: "#64748b", fontWeight: "bold" }}>
        <Link href="/" style={{ color: "#2563eb", textDecoration: "none" }}>Accueil</Link> / 
        <Link href="/products" style={{ color: "#2563eb", textDecoration: "none", margin: "0 5px" }}>Catalogue</Link> / 
        <Link href={`/categories/${product.categoryId}`} style={{ color: "#2563eb", textDecoration: "none", margin: "0 5px" }}>{product.categoryName}</Link> / 
        <span style={{ marginLeft: "5px", color: "#0f172a" }}>{product.name}</span>
      </nav>

      {/* 📦 HAUT DE PAGE */}
      <div style={{ display: "flex", gap: "60px", flexWrap: "wrap", marginBottom: "80px" }}>
        
        {/* 📸 IMAGE À GAUCHE */}
        <div style={{ flex: "1.2", minWidth: "350px" }}>
          <div style={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", position: "relative" }}>
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              style={{ width: "100%", height: "auto", display: "block" }} 
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400"; }}
            />
            {!product.inStock && (
              <div style={{ position: "absolute", top: "20px", right: "20px", backgroundColor: "#dc2626", color: "white", padding: "10px 20px", borderRadius: "50px", fontWeight: "bold", fontSize: "0.9rem" }}>
                ÉPUISÉ
              </div>
            )}
          </div>
        </div>

        {/* ℹ️ INFORMATIONS À DROITE */}
        <div style={{ flex: "1", minWidth: "350px", display: "flex", flexDirection: "column" }}>
          <span style={{ color: "#2563eb", fontWeight: "bold", textTransform: "uppercase", fontSize: "0.9rem", letterSpacing: "1px", marginBottom: "10px", display: "block" }}>
            {product.categoryName}
          </span>
          <h1 style={{ fontSize: "3rem", color: "#0f172a", margin: "0 0 20px 0", lineHeight: "1.2" }}>{product.name}</h1>
          
          <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#0f172a", marginBottom: "30px" }}>
            {product.price.toLocaleString("fr-FR")} €
          </p>

          <div style={{ backgroundColor: "#f8fafc", padding: "25px", borderRadius: "16px", marginBottom: "30px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "1.2rem", color: "#0f172a" }}>Description</h3>
            <p style={{ color: "#475569", lineHeight: "1.7", margin: 0, fontSize: "1.05rem" }}>
              {product.description || "Équipement professionnel haute performance."}
            </p>
          </div>

          {product.specs && product.specs.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ margin: "0 0 15px 0", fontSize: "1.2rem", color: "#0f172a" }}>Caractéristiques techniques</h3>
              <ul style={{ paddingLeft: "20px", color: "#64748b", margin: 0 }}>
                {product.specs.map((spec, i) => (
                  <li key={i} style={{ marginBottom: "10px", fontSize: "1.05rem" }}>{spec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Affichage du stock adaptatif */}
          {product.inStock && availableStock > 0 && (
            <p style={{ color: "#16a34a", fontWeight: "bold", fontSize: "0.95rem", marginBottom: "20px" }}>
              ✓ En stock ({availableStock} dispo{availableStock > 1 ? "s" : ""} à l'ajout)
            </p>
          )}

          {/* 🛒 GESTION DES BOUTONS SELON LE STOCK RESTANT */}
          {!product.inStock ? (
            <div style={{ marginTop: "auto" }}>
              <p style={{ color: "#dc2626", fontWeight: "bold", marginBottom: "10px", fontSize: "1.1rem" }}>⚠️ Cet article est indisponible.</p>
              <button disabled style={{ width: "100%", padding: "20px", backgroundColor: "#f1f5f9", color: "#94a3b8", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "1.2rem", fontWeight: "bold", cursor: "not-allowed" }}>
                Rupture de stock
              </button>
            </div>
          ) : availableStock <= 0 ? (
            <div style={{ marginTop: "auto" }}>
              <p style={{ color: "#eab308", fontWeight: "bold", marginBottom: "10px", fontSize: "1.1rem" }}>
                🛒 Vous avez pris tout le stock disponible.
              </p>
              <button disabled style={{ width: "100%", padding: "20px", backgroundColor: "#fef9c3", color: "#ca8a04", border: "1px solid #fde047", borderRadius: "12px", fontSize: "1.2rem", fontWeight: "bold", cursor: "not-allowed" }}>
                Quantité maximale atteinte
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "15px", alignItems: "center", marginTop: "auto" }}>
              {/* Le Sélecteur Intelligent avec availableStock */}
              <div style={{ display: "flex", alignItems: "center", border: "2px solid #e2e8f0", borderRadius: "12px", padding: "5px", backgroundColor: "white" }}>
                <button 
                  onClick={() => setQuantity(Math.max(1, displayQuantity - 1))} 
                  disabled={displayQuantity <= 1}
                  style={{ background: "none", border: "none", padding: "10px 20px", cursor: displayQuantity <= 1 ? "not-allowed" : "pointer", fontSize: "1.5rem", color: displayQuantity <= 1 ? "#cbd5e1" : "#0f172a" }}
                >
                  -
                </button>
                
                <span style={{ width: "40px", textAlign: "center", fontWeight: "bold", fontSize: "1.2rem", color: "#0f172a" }}>
                  {displayQuantity}
                </span>
                
                <button 
                  onClick={() => setQuantity(Math.min(availableStock, displayQuantity + 1))} 
                  disabled={displayQuantity >= availableStock}
                  style={{ background: "none", border: "none", padding: "10px 20px", cursor: displayQuantity >= availableStock ? "not-allowed" : "pointer", fontSize: "1.5rem", color: displayQuantity >= availableStock ? "#cbd5e1" : "#0f172a" }}
                >
                  +
                </button>
              </div>

              {/* Bouton d'ajout */}
              <button 
                onClick={() => {
                  addToCart(product, displayQuantity);
                  setQuantity(1); // On remet le compteur à 1 après avoir ajouté !
                }}
                style={{ flex: 1, padding: "20px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "12px", fontSize: "1.2rem", fontWeight: "bold", cursor: "pointer", boxShadow: "0 10px 20px rgba(37, 99, 235, 0.2)", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}
              >
                Ajouter au Panier
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🔄 PRODUITS SIMILAIRES */}
      <section style={{ borderTop: "1px solid #e2e8f0", paddingTop: "50px" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "30px", color: "#0f172a" }}>Vous pourriez aussi aimer</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "30px" }}>
          {similarProducts.map(item => (
            <Link href={`/products/${item.id}`} key={item.id} style={{ textDecoration: "none" }}>
              <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "15px", transition: "transform 0.2s", boxShadow: "0 4px 10px rgba(0,0,0,0.03)" }}
                   onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
                   onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <img src={item.imageUrl} style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "10px" }} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400"; }} />
                <h4 style={{ margin: "15px 0 5px 0", color: "#0f172a", fontSize: "1.1rem" }}>{item.name}</h4>
                <p style={{ color: "#2563eb", fontWeight: "bold", margin: 0, fontSize: "1.2rem" }}>{item.price.toLocaleString("fr-FR")} €</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}