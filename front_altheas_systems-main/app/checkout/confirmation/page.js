"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "../../../context/CartContext";

export default function ConfirmationPage() {
  const { cart, cartTotal } = useCart();
  
  // Dans un vrai site, on viderait le panier ici après avoir enregistré la commande en base de données.
  // Pour le test, on garde les infos pour l'affichage.

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const orderNumber = "AL-" + Math.floor(Math.random() * 900000 + 100000);

  return (
    <main style={{ maxWidth: "800px", margin: "80px auto", padding: "40px", fontFamily: "'Inter', sans-serif", textAlign: "center" }}>
      
      <div style={{ backgroundColor: "#f0fdf4", width: "100px", height: "100px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 30px auto", border: "2px solid #bbf7d0" }}>
        <span style={{ fontSize: "3rem" }}>✅</span>
      </div>

      <h1 style={{ fontSize: "2.5rem", color: "#0f172a", marginBottom: "15px" }}>Commande confirmée !</h1>
      <p style={{ color: "#64748b", fontSize: "1.2rem", marginBottom: "40px" }}>
        Merci pour votre confiance. Votre commande <strong>#{orderNumber}</strong> est en cours de préparation par nos équipes logistiques.
      </p>

      <div style={{ backgroundColor: "white", borderRadius: "24px", border: "1px solid #e2e8f0", padding: "30px", textAlign: "left", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", marginBottom: "40px" }}>
        <h3 style={{ margin: "0 0 20px 0", fontSize: "1.1rem", color: "#0f172a", borderBottom: "1px solid #f1f5f9", paddingBottom: "15px" }}>Détails de l'expédition</h3>
        <p style={{ color: "#475569", margin: "0 0 10px 0" }}>📦 <strong>Mode :</strong> Transporteur spécialisé matériel médical</p>
        <p style={{ color: "#475569", margin: "0 0 10px 0" }}>📅 <strong>Délai estimé :</strong> 3 à 5 jours ouvrés</p>
        <p style={{ color: "#475569", margin: 0 }}>📧 Un email récapitulatif a été envoyé à votre adresse professionnelle.</p>
      </div>

      <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        <Link href="/account/orders">
          <button style={{ padding: "16px 30px", backgroundColor: "white", border: "2px solid #e2e8f0", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", color: "#475569" }}>
            Suivre ma commande
          </button>
        </Link>
        <Link href="/">
          <button style={{ padding: "16px 30px", backgroundColor: "#003d5c", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 10px 20px rgba(0,61,92,0.2)" }}>
            Retour à l'accueil
          </button>
        </Link>
      </div>

    </main>
  );
}