"use client"; // 👈 Indispensable pour utiliser useEffect et useState
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser, clearAuthSession } from "../../services/authSession";

const pageStyle = {
  padding: "2rem 1rem",
  maxWidth: "640px",
  margin: "0 auto",
  fontFamily: "sans-serif"
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "1.5rem",
  marginTop: "1.5rem",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
};

const linkStyle = {
  display: "inline-block",
  marginTop: "1rem",
  color: "#003d5c",
  textDecoration: "none",
  fontWeight: 600,
};

export default function AccountDashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // On vérifie si l'utilisateur est connecté
    const currentUser = getAuthUser();
    if (!currentUser) {
      // S'il n'est pas connecté, on le renvoie à la page de connexion
      router.push("/login");
    } else {
      setUser(currentUser);
    }
  }, [router]);

  const handleLogout = () => {
    clearAuthSession();
    window.location.href = "/login"; // Recharge la page vers le login
  };

  // Écran de chargement le temps que useEffect fasse son travail
  if (!user) return <section style={pageStyle}>Chargement de votre profil...</section>;

  return (
    <section style={pageStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        {/* On affiche le nom de l'utilisateur ici ! */}
        <h1 style={{ margin: 0, fontSize: "1.8rem" }}>👋 Bonjour, {user.fullName || "Client"}</h1>
        
        <button 
          onClick={handleLogout} 
          style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "10px 18px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
        >
          Se déconnecter
        </button>
      </div>

      <p style={{ marginTop: "10px", color: "#555", fontSize: "1.1rem" }}>
        Bienvenue sur votre espace. Consultez vos commandes et mettez à jour vos informations.
      </p>

      <article style={cardStyle}>
        <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#003d5c" }}>Mes commandes</h2>
        <p style={{ margin: "0.5rem 0 0 0", color: "#555" }}>
          Suivez vos commandes récentes et leur statut d'expédition.
        </p>
        <Link href="/account/orders" style={linkStyle}>
          Voir mon historique de commandes &rarr;
        </Link>
      </article>

      <article style={cardStyle}>
        <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#003d5c" }}>Paramètres du compte</h2>
        <p style={{ margin: "0.5rem 0 0 0", color: "#555" }}>
          Modifiez vos informations personnelles, votre adresse ou votre mot de passe.
        </p>
        <Link href="/account/settings" style={linkStyle}>
          Ouvrir les paramètres &rarr;
        </Link>
      </article>
    </section>
  );
}