"use client";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  // 📭 Affichage si le panier est vide
  if (cart.length === 0) {
    return (
      <main style={{ maxWidth: "1200px", margin: "80px auto", padding: "20px", textAlign: "center", minHeight: "60vh", fontFamily: "sans-serif" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#0f172a", marginBottom: "20px" }}>Votre panier est vide</h1>
        <p style={{ color: "#64748b", fontSize: "1.2rem", marginBottom: "40px" }}>Vous n'avez pas encore ajouté d'équipements médicaux à votre commande.</p>
        <Link href="/products">
          <button style={{ padding: "15px 30px", backgroundColor: "#2563eb", color: "white", borderRadius: "12px", border: "none", fontSize: "1.2rem", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 15px rgba(37,99,235,0.2)" }}>
            Découvrir notre catalogue
          </button>
        </Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "1200px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif", minHeight: "80vh" }}>
      <h1 style={{ fontSize: "2.5rem", color: "#0f172a", marginBottom: "40px" }}>Mon Panier</h1>

      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        
        {/* 📦 LISTE DES ARTICLES */}
        <div style={{ flex: "2", minWidth: "350px", display: "flex", flexDirection: "column", gap: "25px" }}>
          {cart.map((item) => (
            <div key={item.id} style={{ display: "flex", gap: "20px", backgroundColor: "white", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 10px rgba(0,0,0,0.02)", position: "relative" }}>
              
              {/* Image */}
              <img src={item.imageUrl} alt={item.name} style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "10px", backgroundColor: "#f8fafc" }} onError={(e) => e.target.src = "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200"} />
              
              {/* Infos Produit */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ margin: "0 0 5px 0", fontSize: "1.2rem", color: "#0f172a" }}>{item.name}</h3>
                  <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Réf: #{item.id}</span>
                </div>
                <p style={{ color: "#2563eb", fontWeight: "bold", fontSize: "1.3rem", margin: 0 }}>
                  {item.price.toLocaleString("fr-FR")} €
                </p>
              </div>

              {/* Contrôles (Suppression + Sélecteur de Quantité) */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
                <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#ef4444", fontSize: "0.9rem", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}>
                  Supprimer
                </button>
                
                {/* 🧠 LE SÉLECTEUR INTELLIGENT DU PANIER */}
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "8px", overflow: "hidden", marginTop: "15px" }}>
                  
                  {/* Bouton Moins */}
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                    disabled={item.quantity <= 1}
                    style={{ padding: "8px 15px", border: "none", background: "#f8fafc", cursor: item.quantity <= 1 ? "not-allowed" : "pointer", color: item.quantity <= 1 ? "#cbd5e1" : "#0f172a", fontSize: "1.2rem" }}
                  >-</button>
                  
                  <span style={{ width: "40px", textAlign: "center", fontWeight: "bold", fontSize: "1.1rem" }}>{item.quantity}</span>
                  
                  {/* Bouton Plus (Grisé si max atteint !) */}
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                    disabled={item.quantity >= item.stockCount}
                    style={{ padding: "8px 15px", border: "none", background: "#f8fafc", cursor: item.quantity >= item.stockCount ? "not-allowed" : "pointer", color: item.quantity >= item.stockCount ? "#cbd5e1" : "#0f172a", fontSize: "1.2rem" }}
                  >+</button>
                </div>

                {/* Petit message d'alerte visuelle si le max est atteint */}
                {item.quantity >= item.stockCount && (
                  <span style={{ color: "#eab308", fontSize: "0.75rem", fontWeight: "bold", marginTop: "5px", textTransform: "uppercase" }}>
                    Stock Max Atteint
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>

        {/* 💳 RÉSUMÉ DE LA COMMANDE */}
        <div style={{ flex: "1", minWidth: "300px" }}>
          <div style={{ backgroundColor: "#f8fafc", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0", position: "sticky", top: "40px" }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "1.5rem", color: "#0f172a", borderBottom: "2px solid #e2e8f0", paddingBottom: "15px" }}>Résumé</h3>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", color: "#475569", fontSize: "1.1rem" }}>
              <span>Sous-total HT</span>
              <span>{cartTotal.toLocaleString("fr-FR")} €</span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", color: "#475569", fontSize: "1.1rem" }}>
              <span>Frais de port</span>
              <span style={{ color: "#16a34a", fontWeight: "bold" }}>Gratuit</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", margin: "20px 0", color: "#0f172a", fontSize: "1.5rem", fontWeight: "bold", borderTop: "2px solid #e2e8f0", paddingTop: "20px" }}>
              <span>Total TTC</span>
              <span style={{ color: "#2563eb" }}>{cartTotal.toLocaleString("fr-FR")} €</span>
            </div>

            <Link href="/checkout">
              <button style={{ width: "100%", padding: "18px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "12px", fontSize: "1.2rem", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 15px rgba(37, 99, 235, 0.2)", transition: "all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2563eb"}>
                Valider la commande
              </button>
            </Link>
            
            <div style={{ marginTop: "20px", textAlign: "center", fontSize: "0.9rem", color: "#64748b" }}>
              🔒 Paiement 100% sécurisé
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}