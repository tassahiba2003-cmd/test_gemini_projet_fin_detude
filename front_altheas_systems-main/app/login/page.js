"use client";
import { useState } from "react";
import { loginWithCredentials } from "../../services/api/authApi"; 
import { addCartItem } from "../../services/api/cartApi"; 
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // NOUVEAU : État pour "Se souvenir de moi"
  const [rememberMe, setRememberMe] = useState(false); 
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. On se connecte au Backend en passant rememberMe
      const res = await loginWithCredentials({ email, password, rememberMe });
      
      if (res.ok) {
        
        // 🚀 2. LA MAGIE DE LA SYNCHRONISATION COMMENCE ICI
        const localCartRaw = localStorage.getItem("althea_cart");
        
        if (localCartRaw) {
          try {
            const localCart = JSON.parse(localCartRaw);
            
            if (localCart.length > 0) {
              const wantToSync = window.confirm(
                "Vous avez ajouté des articles en mode invité. Souhaitez-vous les conserver et les ajouter à votre compte ?"
              );

              if (wantToSync) {
                for (const item of localCart) {
                  const productId = item.id || item.productId;
                  await addCartItem({ productId: productId, quantity: item.quantity });
                }
              }
            }
          } catch (err) {
            console.error("Erreur lors de la lecture du panier invité", err);
          }
        }

        // 3. Qu'il ait dit OUI ou NON, on efface le panier "invité" et on l'envoie à l'accueil
        localStorage.removeItem("althea_cart");
        window.location.href = "/";
        
      } else {
        // En cas de mauvais mot de passe
        setError(res.message || "Identifiants incorrects.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur. Vérifiez que le Backend tourne.");
    }
  };

  return (
    <main style={{ maxWidth: "400px", margin: "80px auto", padding: "40px", backgroundColor: "white", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "1.8rem", textAlign: "center", marginBottom: "30px", color: "#0f172a" }}>Connexion</h1>
      
      {error && (
        <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "15px", borderRadius: "10px", marginBottom: "20px", textAlign: "center", fontWeight: "bold", fontSize: "0.9rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <input 
          type="email" 
          placeholder="Email professionnel" 
          required 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          style={inputStyle} 
        />
        
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input 
            type="password" 
            placeholder="Mot de passe" 
            required 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            style={inputStyle} 
          />
          {/* NOUVEAU : Lien Mot de passe oublié */}
          <Link href="/forgot-password" style={{ fontSize: "0.85rem", color: "#2563eb", textDecoration: "none", alignSelf: "flex-end", fontWeight: "500" }}>
            Mot de passe oublié ?
          </Link>
        </div>

        {/* NOUVEAU : Case à cocher "Se souvenir de moi" */}
        <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#475569", cursor: "pointer" }}>
          <input 
            type="checkbox" 
            checked={rememberMe} 
            onChange={e => setRememberMe(e.target.checked)} 
            style={{ width: "16px", height: "16px", cursor: "pointer" }}
          />
          Se souvenir de moi
        </label>

        <button type="submit" style={btnStyle}>Se connecter</button>
      </form>

      <div style={{ marginTop: "30px", textAlign: "center", fontSize: "0.95rem", color: "#64748b", borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
        Nouveau client ? <br/>
        <Link href="/register" style={{ color: "#003d5c", fontWeight: "bold", display: "inline-block", marginTop: "10px", textDecoration: "none" }}>Créer un compte professionnel</Link>
      </div>
    </main>
  );
}

const inputStyle = { padding: "15px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none", width: "100%", boxSizing: "border-box" };
const btnStyle = { backgroundColor: "#0f172a", color: "white", padding: "16px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "1.1rem", transition: "background-color 0.2s" };