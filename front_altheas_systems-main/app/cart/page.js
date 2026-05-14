"use client";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  const tva = cartTotal * 0.2;
  const totalHT = cartTotal - tva;

  if (cart.length === 0) {
    return (
      <main style={{ maxWidth: "1200px", margin: "60px auto", padding: "0 20px", fontFamily: "'Inter', sans-serif", textAlign: "center" }}>
        <div style={{ padding: "80px 0", backgroundColor: "#f8fafc", borderRadius: "30px", border: "2px dashed #e2e8f0" }}>
          <div style={{ fontSize: "5rem", marginBottom: "20px" }}>📦</div>
          <h1 style={{ color: "#0f172a", fontSize: "2rem", marginBottom: "15px" }}>Votre panier est vide</h1>
          <Link href="/products">
            <button style={{ padding: "16px 40px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" }}>
              Explorer le catalogue
            </button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "1300px", margin: "40px auto", padding: "0 20px", fontFamily: "'Inter', sans-serif" }}>
      <header style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.2rem", color: "#0f172a", marginBottom: "10px" }}>Ma Sélection</h1>
        <p style={{ color: "#64748b" }}>Vous avez <strong>{cart.length} équipement(s)</strong> dans votre panier professionnel.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "40px", alignItems: "start" }}>
        <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {cart.map((item) => (
            <div key={item.id} style={{ display: "flex", backgroundColor: "white", borderRadius: "20px", padding: "25px", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
              
              {/* 🔗 LIEN SUR L'IMAGE */}
              <Link href={`/products/${item.id}`} style={{ display: "block", flexShrink: 0 }}>
                <div style={{ width: "150px", height: "150px", backgroundColor: "#f8fafc", borderRadius: "15px", overflow: "hidden", border: "1px solid #f1f5f9" }}>
                  <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => e.target.src = "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200"} />
                </div>
              </Link>

              <div style={{ flex: 1, marginLeft: "25px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  {/* 🔗 LIEN SUR LE TITRE */}
                  <Link href={`/products/${item.id}`} style={{ textDecoration: "none" }}>
                    <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#0f172a", fontWeight: "600" }}>{item.name}</h3>
                  </Link>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1.1rem" }}>✕</button>
                </div>
                
                <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "auto" }}>Réf : AL-{item.id}2026</p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "5px", backgroundColor: "#f8fafc" }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} style={{ padding: "5px 12px", border: "none", background: "none", cursor: "pointer", color: "#64748b" }}>-</button>
                    <span style={{ width: "40px", textAlign: "center", fontWeight: "bold" }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stockCount} style={{ padding: "5px 12px", border: "none", background: "none", cursor: "pointer", color: "#2563eb" }}>+</button>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>Unit : {item.price.toLocaleString()} €</p>
                    <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: "bold", color: "#0f172a" }}>{(item.price * item.quantity).toLocaleString()} €</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div style={{ backgroundColor: "#eff6ff", padding: "20px", borderRadius: "15px", border: "1px solid #dbeafe", display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ fontSize: "1.5rem" }}>🚚</span>
            <p style={{ margin: 0, color: "#1e40af", fontSize: "0.95rem" }}><strong>Livraison sécurisée :</strong> Transporteur spécialisé sous 3 à 5 jours ouvrés.</p>
          </div>
        </section>

        <aside style={{ position: "sticky", top: "100px" }}>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "25px", border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
            <h2 style={{ fontSize: "1.4rem", color: "#0f172a", marginBottom: "25px" }}>Résumé du devis</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", borderBottom: "1px solid #f1f5f9", paddingBottom: "20px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}><span>Sous-total HT</span><span>{totalHT.toLocaleString()} €</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}><span>TVA (20%)</span><span>{tva.toLocaleString()} €</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#16a34a", fontWeight: "bold" }}><span>Livraison</span><span>OFFERTE</span></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Total TTC</span>
              <span style={{ fontSize: "1.8rem", fontWeight: "800", color: "#2563eb" }}>{cartTotal.toLocaleString()} €</span>
            </div>
            <Link href="/checkout" style={{ textDecoration: "none" }}>
              <button style={{ width: "100%", padding: "20px", backgroundColor: "#0f172a", color: "white", border: "none", borderRadius: "15px", fontWeight: "bold", cursor: "pointer" }}>Valider ma commande</button>
            </Link>
            <div style={{ textAlign: "center", marginTop: "25px" }}>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "15px" }}>Moyens de paiement acceptés</p>
              <div style={{ display: "flex", justifyContent: "center", gap: "15px", opacity: 0.7 }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" height="20" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" height="20" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" height="15" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}