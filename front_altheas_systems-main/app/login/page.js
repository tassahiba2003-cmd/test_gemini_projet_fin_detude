"use client";
import { useState } from "react";
// 👈 NOUVEAU : On importe ta VRAIE fonction qui parle au Backend !
import { loginWithCredentials } from "../../services/api/authApi"; 
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // 👈 NOUVEAU : Pour afficher les messages d'erreur

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // On efface l'erreur précédente

    try {
      // On appelle le Backend sur le port 5002
      const res = await loginWithCredentials({ email, password });
      
      if (res.ok) {
        // Succès ! La session est sauvegardée dans le bon format, on redirige vers l'accueil
        window.location.href = "/";
      } else {
        // Échec (utilisateur inconnu ou mauvais mot de passe)
        setError(res.message || "Identifiants incorrects.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur. Vérifiez que le Backend tourne.");
    }
  };

  return (
    <main style={{ maxWidth: "400px", margin: "80px auto", padding: "40px", backgroundColor: "white", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.8rem", textAlign: "center", marginBottom: "30px" }}>Connexion</h1>
      
      {/* 👈 NOUVEAU : Affichage d'un bel encadré rouge si la connexion échoue */}
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