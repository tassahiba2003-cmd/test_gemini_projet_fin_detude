"use client";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function MiniCart() {
  const { cart, isMiniCartOpen, setIsMiniCartOpen, cartTotal, removeFromCart, updateQuantity } = useCart();

  if (!isMiniCartOpen) return null;

  return (
    <>
      {/* 🌑 L'arrière-plan sombre cliquable pour fermer */}
      <div 
        onClick={() => setIsMiniCartOpen(false)}
        style={{ 
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", 
          backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9998,
          backdropFilter: "blur(2px)"
        }}
      ></div>

      {/* 🛍️ Le panneau coulissant */}
      <div style={{ 
        position: "fixed", top: 0, right: 0, width: "450px", height: "100vh", 
        backgroundColor: "white", zIndex: 9999, boxShadow: "-10px 0 30px rgba(0,0,0,0.15)",
        display: "flex", flexDirection: "column", padding: "25px", fontFamily: "sans-serif",
        animation: "slideIn 0.3s ease-out",
        boxSizing: "border-box" /* 👈 LA CORRECTION MAGIQUE EST ICI */
      }}>
        <style>{`
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
          
          /* 🎨 NOUVEAU : Design de la barre de défilement (Scrollbar) */
          .cart-scroll::-webkit-scrollbar { width: 8px; }
          .cart-scroll::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
          .cart-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
          .cart-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        `}</style>

        {/* ❌ En-tête : Titre et bouton Fermer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "2px solid #f1f5f9", paddingBottom: "15px", flexShrink: 0 }}>
          <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#0f172a" }}>Mon Panier</h2>
          <button onClick={() => setIsMiniCartOpen(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#64748b" }}>✕</button>
        </div>

        {/* 📦 Contenu du panier avec LE SCROLL ACTIF */}
        <div className="cart-scroll" style={{ flex: 1, overflowY: "auto", paddingRight: "15px", marginBottom: "15px" }}>
          {cart.length === 0 ? (
            <p style={{ textAlign: "center", color: "#64748b", marginTop: "50px", fontSize: "1.1rem" }}>Votre panier est vide.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} style={{ display: "flex", gap: "15px", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "20px" }}>
                
                {/* Image miniature */}
                <div style={{ width: "80px", height: "80px", borderRadius: "10px", overflow: "hidden", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", flexShrink: 0 }}>
                  <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => e.target.src = "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200"}/>
                </div>
                
                {/* Détails */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h4 style={{ margin: "0", fontSize: "1rem", color: "#0f172a", lineHeight: "1.3" }}>{item.name}</h4>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1.2rem", padding: 0 }}>🗑️</button>
                  </div>
                  
                  {/* Sélecteur de quantité */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "8px", overflow: "hidden" }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} style={{ padding: "5px 10px", border: "none", background: "#f8fafc", cursor: item.quantity <= 1 ? "not-allowed" : "pointer", color: item.quantity <= 1 ? "#cbd5e1" : "#0f172a" }}>-</button>
                      <span style={{ width: "30px", textAlign: "center", fontWeight: "bold", fontSize: "0.9rem", color: "#0f172a" }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stockCount} style={{ padding: "5px 10px", border: "none", background: "#f8fafc", cursor: item.quantity >= item.stockCount ? "not-allowed" : "pointer", color: item.quantity >= item.stockCount ? "#cbd5e1" : "#0f172a" }}>+</button>
                    </div>
                    <p style={{ margin: 0, fontWeight: "bold", color: "#2563eb", fontSize: "1.1rem" }}>{(item.price * item.quantity).toLocaleString("fr-FR")} €</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 💳 Pied du panneau (Reste toujours visible en bas) */}
        {cart.length > 0 && (
          <div style={{ borderTop: "2px solid #f1f5f9", paddingTop: "20px", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontWeight: "bold", fontSize: "1.3rem", color: "#0f172a" }}>
              <span>Total Estimé :</span>
              <span>{cartTotal.toLocaleString("fr-FR")} €</span>
            </div>

            <button 
              onClick={() => setIsMiniCartOpen(false)}
              style={{ width: "100%", padding: "16px", backgroundColor: "white", border: "2px solid #e2e8f0", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", marginBottom: "12px", fontSize: "1rem", color: "#475569" }}
            >
              Continuer mes achats
            </button>

            <Link href="/cart" onClick={() => setIsMiniCartOpen(false)} style={{ textDecoration: "none" }}>
              <button style={{ width: "100%", padding: "18px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 5px 15px rgba(37,99,235,0.3)", fontSize: "1.1rem" }}>
                Accéder à ma commande
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}