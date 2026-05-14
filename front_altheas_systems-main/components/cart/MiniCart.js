"use client";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function MiniCart() {
  const { cart, isMiniCartOpen, setIsMiniCartOpen, cartTotal, removeFromCart, updateQuantity } = useCart();

  if (!isMiniCartOpen) return null;

  return (
    <>
      <div onClick={() => setIsMiniCartOpen(false)} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9998, backdropFilter: "blur(2px)" }}></div>

      <div style={{ position: "fixed", top: 0, right: 0, width: "450px", height: "100vh", backgroundColor: "white", zIndex: 9999, boxShadow: "-10px 0 30px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", padding: "25px", fontFamily: "sans-serif", animation: "slideIn 0.3s ease-out", boxSizing: "border-box" }}>
        <style>{`
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
          .cart-scroll::-webkit-scrollbar { width: 8px; }
          .cart-scroll::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
          .cart-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        `}</style>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "2px solid #f1f5f9", paddingBottom: "15px", flexShrink: 0 }}>
          <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#0f172a" }}>Mon Panier</h2>
          <button onClick={() => setIsMiniCartOpen(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#64748b" }}>✕</button>
        </div>

        <div className="cart-scroll" style={{ flex: 1, overflowY: "auto", paddingRight: "15px", marginBottom: "15px" }}>
          {cart.map((item) => (
            <div key={item.id} style={{ display: "flex", gap: "15px", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "20px" }}>
              
              {/* 🔗 LIEN SUR L'IMAGE MINIATURE */}
              <Link href={`/products/${item.id}`} onClick={() => setIsMiniCartOpen(false)} style={{ flexShrink: 0 }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "10px", overflow: "hidden", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </Link>
              
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  {/* 🔗 LIEN SUR LE NOM */}
                  <Link href={`/products/${item.id}`} onClick={() => setIsMiniCartOpen(false)} style={{ textDecoration: "none" }}>
                    <h4 style={{ margin: "0", fontSize: "1rem", color: "#0f172a", lineHeight: "1.3" }}>{item.name}</h4>
                  </Link>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1.2rem", padding: 0 }}>🗑️</button>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "8px", overflow: "hidden" }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} style={{ padding: "5px 10px", border: "none", background: "#f8fafc" }}>-</button>
                    <span style={{ width: "30px", textAlign: "center", fontWeight: "bold", fontSize: "0.9rem" }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stockCount} style={{ padding: "5px 10px", border: "none", background: "#f8fafc" }}>+</button>
                  </div>
                  <p style={{ margin: 0, fontWeight: "bold", color: "#2563eb", fontSize: "1.1rem" }}>{(item.price * item.quantity).toLocaleString()} €</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div style={{ borderTop: "2px solid #f1f5f9", paddingTop: "20px", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontWeight: "bold", fontSize: "1.3rem" }}>
              <span>Total :</span><span>{cartTotal.toLocaleString()} €</span>
            </div>
            <button onClick={() => setIsMiniCartOpen(false)} style={{ width: "100%", padding: "16px", backgroundColor: "white", border: "2px solid #e2e8f0", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", marginBottom: "12px" }}>Continuer mes achats</button>
            <Link href="/cart" onClick={() => setIsMiniCartOpen(false)} style={{ textDecoration: "none" }}>
              <button style={{ width: "100%", padding: "18px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" }}>Accéder à ma commande</button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}