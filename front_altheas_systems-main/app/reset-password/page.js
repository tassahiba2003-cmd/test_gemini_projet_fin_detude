"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);

    try {
      // On envoie le nouveau mot de passe à ton contrôleur (resetPassword)
      const res = await fetch(`http://localhost:5002/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la réinitialisation.");
      }

      setSuccessMessage("Mot de passe modifié avec succès ! Redirection vers la connexion...");
      setTimeout(() => router.push("/login"), 3000);
      
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Si pas de token dans l'URL, on bloque
  if (!token) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#dc2626" }}>
        <h2>Lien invalide</h2>
        <p>Aucun jeton de sécurité n'a été fourni.</p>
        <Link href="/forgot-password" style={{ color: "#2563eb", marginTop: "20px", display: "inline-block" }}>Retour</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Confirmer le mot de passe"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={inputStyle}
      />
      <button type="submit" disabled={isLoading} style={btnStyle}>
        {isLoading ? "Enregistrement..." : "Valider mon nouveau mot de passe"}
      </button>
    </form>
  );
}

// Le composant principal enveloppé dans Suspense (obligatoire dans Next.js quand on utilise useSearchParams)
export default function ResetPasswordPage() {
  return (
    <main style={{ maxWidth: "400px", margin: "80px auto", padding: "40px", backgroundColor: "white", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "1.8rem", textAlign: "center", marginBottom: "20px", color: "#0f172a" }}>Nouveau mot de passe</h1>
      
      <Suspense fallback={<div style={{ textAlign: "center" }}>Chargement sécurisé...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}

const inputStyle = { padding: "15px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none", width: "100%", boxSizing: "border-box" };
const btnStyle = { backgroundColor: "#0f172a", color: "white", padding: "16px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "1.1rem" };