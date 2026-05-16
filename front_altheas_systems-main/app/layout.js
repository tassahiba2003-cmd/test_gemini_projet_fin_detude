"use client"; 
import Link from "next/link";
import Image from "next/image";
import DesktopFooter from "../components/layout/DesktopFooter";
import ChatWidget from "../components/chat/ChatWidget";
import HeaderSearchBar from "../components/layout/HeaderSearchBar";
import MiniCart from "../components/cart/MiniCart"; 
import { CartProvider, useCart } from "../context/CartContext";

// 👈 NOUVEAU : Imports pour gérer la session et l'affichage de l'utilisateur
import { useEffect, useState } from "react";
import { getAuthUser, clearAuthSession } from "../services/authSession";

// Petit composant interne pour gérer le lien du panier avec son badge
function NavCartLink() {
  const { cart, setIsMiniCartOpen } = useCart(); 
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <button 
      onClick={() => setIsMiniCartOpen(true)}
      style={{ background: "none", border: "none", color: "white", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", fontSize: "1rem", padding: 0, fontWeight: "500", fontFamily: "inherit" }}
    >
      Panier
      {itemCount > 0 && (
        <span style={{
          backgroundColor: "#ef4444",
          color: "white",
          fontSize: "0.75rem",
          fontWeight: "bold",
          padding: "2px 6px",
          borderRadius: "10px",
          minWidth: "15px",
          textAlign: "center"
        }}>
          {itemCount}
        </span>
      )}
    </button>
  );
}

// 👈 NOUVEAU : Composant interne pour afficher "Bonjour X" et le bouton Déconnexion
function NavAccountLink() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Au chargement, on cherche s'il y a un utilisateur connecté
    setUser(getAuthUser());
  }, []);

  const handleLogout = () => {
    clearAuthSession(); // Vide le localStorage
    window.location.href = "/login"; // Force un rechargement propre vers la page de connexion
  };

  // Si on a un utilisateur, on affiche son nom et le bouton de déconnexion
  if (user) {
    return (
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link href="/account" style={{ color: "#38bdf8", textDecoration: "none", fontWeight: "bold" }}>
          👋 Bonjour {user.fullName?.split(" ")[0] || "Client"}
        </Link>
        <button 
          onClick={handleLogout} 
          style={{ background: "none", border: "1px solid rgba(255,255,255,0.4)", color: "white", cursor: "pointer", padding: "4px 10px", borderRadius: "5px", fontSize: "0.85rem" }}
        >
          Déconnexion
        </button>
      </div>
    );
  }

  // S'il n'y a personne, on affiche le lien classique vers la connexion
  return (
    <Link href="/login" style={{ color: "white", textDecoration: "none" }}>Connexion / Compte</Link>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>
        <CartProvider>
          
          <MiniCart />
          
          <header style={{ 
            padding: "1rem 2rem", 
            background: "#003d5c", 
            color: "white",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            position: "sticky", 
            top: 0, 
            zIndex: 1000
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
                <Image
                  src="/images/logo.png"
                  alt="Althea Systems"
                  width={160}
                  height={40}
                  priority
                  style={{ width: "auto", height: "40px" }}
                />
              </Link>
              
              <HeaderSearchBar />
            </div>
            
            <nav style={{ 
              marginTop: "1rem", 
              display: "flex", 
              gap: "2rem", 
              borderTop: "1px solid rgba(255,255,255,0.1)", 
              paddingTop: "1rem",
              fontWeight: "500"
            }}>
              <Link href="/" style={{ color: "white", textDecoration: "none" }}>Accueil</Link>
              <Link href="/products" style={{ color: "white", textDecoration: "none" }}>Catalogue</Link>
              <Link href="/search" style={{ color: "white", textDecoration: "none" }}>Recherche</Link>
              
              <NavCartLink />
              
              {/* 👈 MODIFICATION : On utilise le nouveau composant dynamique ici */}
              <NavAccountLink />
            </nav>
          </header>

          <main style={{ minHeight: "calc(100vh - 200px)" }}>
            {children}
          </main>

          <DesktopFooter />
          <ChatWidget />

        </CartProvider>
      </body>
    </html>
  );
}