"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      // Branchement direct avec ton backend auth-cart-service (port 5002)
      const response = await fetch("http://localhost:5002/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Une erreur est survenue.");

      // Affiche le message de succès renvoyé par ton backend parfait
      setSuccessMessage(data.message || "Un lien de réinitialisation vous a été envoyé par e-mail.");
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: "400px", margin: "80px auto", padding: "40px", backgroundColor: "white", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "1.8rem", textAlign: "center", marginBottom: "20px", color: "#0f172a" }}>Mot de passe oublié</h1>
      
      <p style={{ fontSize: "0.9rem", color: "#64748b", textAlign: "center", marginBottom: "30px", lineHeight: "1.5" }}>
        Saisissez l'adresse e-mail associée à votre compte professionnel Althea Pro. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
      </p>

      {errorMessage && <div style={{ padding: "15px", backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: "10px", marginBottom: "20px", fontWeight: "bold", textAlign: "center", fontSize: "0.9rem" }}>{errorMessage}</div>}
      {successMessage && <div style={{ padding: "15px", backgroundColor: "#f0fdf4", color: "#16a34a", borderRadius: "10px", marginBottom: "20px", fontWeight: "bold", textAlign: "center", fontSize: "0.9rem" }}>{successMessage}</div>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <input 
          type="email" 
          placeholder="Email professionnel" 
          required 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          style={inputStyle} 
        />
        <button type="submit" disabled={isLoading} style={btnStyle}>
          {isLoading ? "Envoi du lien..." : "Envoyer le lien de récupération"}
        </button>
      </form>

      <div style={{ marginTop: "30px", textAlign: "center", fontSize: "0.95rem" }}>
        <Link href="/login" style={{ color: "#003d5c", fontWeight: "bold", textDecoration: "none" }}>
          ← Retour à la connexion
        </Link>
      </div>
    </main>
  );
}

const inputStyle = { padding: "15px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none", width: "100%", boxSizing: "border-box" };
const btnStyle = { backgroundColor: "#0f172a", color: "white", padding: "16px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "1.1rem" };