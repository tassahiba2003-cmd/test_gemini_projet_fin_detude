"use client";
import { useState } from "react";
import { loginWithCredentials } from "../../services/api/authApi"; 
// 👈 On importe la fonction pour envoyer les articles au Backend !
import { addCartItem } from "../../services/api/cartApi"; 
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. On se connecte au Backend
      const res = await loginWithCredentials({ email, password });
      
      if (res.ok) {
        
        // 🚀 2. LA MAGIE DE LA SYNCHRONISATION COMMENCE ICI
        const localCartRaw = localStorage.getItem("althea_cart");
        
        if (localCartRaw) {
          try {
            const localCart = JSON.parse(localCartRaw);
            
            // S'il y a au moins 1 article dans le panier invité
            if (localCart.length > 0) {
              
              // On affiche le message pour demander à l'utilisateur
              const wantToSync = window.confirm(
                "Vous avez ajouté des articles en mode invité. Souhaitez-vous les conserver et les ajouter à votre compte ?"
              );

              // S'il dit OUI, on les envoie un par un à la base de données
              if (wantToSync) {
                for (const item of localCart) {
                  // On s'assure d'utiliser le bon ID
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
    <main style={{ maxWidth: "400px", margin: "80px auto", padding: "40px", backgroundColor: "white", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.8rem", textAlign: "center", marginBottom: "30px" }}>Connexion</h1>
      
      {error && (
        <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", fontWeight: "bold", fontSize: "0.9rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <input 
          type="email" 
          placeholder="Email" 
          required 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          style={inputStyle} 
        />
        <input 
          type="password" 
          placeholder="Mot de passe" 
          required 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          style={inputStyle} 
        />
        <button type="submit" style={btnStyle}>Se connecter</button>
      </form>

      <p style={{ marginTop: "20px", textAlign: "center" }}>
        Nouveau client ? <Link href="/register" style={{ color: "#2563eb", fontWeight: "bold" }}>Créer un compte</Link>
      </p>
    </main>
  );
}

const inputStyle = { padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "1rem" };
const btnStyle = { backgroundColor: "#003d5c", color: "white", padding: "14px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" };