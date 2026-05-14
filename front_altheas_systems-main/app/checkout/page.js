"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal } = useCart();
  
  // Gestion des étapes : 1 = Identification, 2 = Livraison, 3 = Paiement
  const [currentStep, setCurrentStep] = useState(1);

  // Formulaire : Identification
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  // Formulaire : Livraison (Champs B2B)
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "", lastName: "", company: "", siret: "", 
    address: "", city: "", zipCode: "", phone: ""
  });

  // Calculs
  const tva = cartTotal * 0.2;
  const totalHT = cartTotal - tva;

  // Redirection si le panier est vide
  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px", fontFamily: "'Inter', sans-serif" }}>
        <h2>Votre panier est vide</h2>
        <p>Vous devez ajouter des articles avant de valider une commande.</p>
        <Link href="/products"><button style={{ padding: "10px 20px", backgroundColor: "#2563eb", color: "white", borderRadius: "8px", border: "none", cursor: "pointer", marginTop: "20px" }}>Retour au catalogue</button></Link>
      </div>
    );
  }

  const handleNextStep = (e) => {
    e.preventDefault();
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePayment = () => {
    alert("Simulation de paiement réussie ! Redirection vers la confirmation...");
    // Ici, plus tard, on appellera l'API de paiement Stripe ou PayPal
    router.push('/checkout/confirmation'); // Redirige vers une page de succès (à créer ensuite)
  };

  return (
    <main style={{ backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif", paddingBottom: "50px" }}>
      
      {/* 🚀 HEADER MINIMALISTE (Mode tunnel d'achat) */}
      <header style={{ backgroundColor: "white", padding: "20px 0", borderBottom: "1px solid #e2e8f0", textAlign: "center", marginBottom: "40px" }}>
        <Link href="/cart" style={{ color: "#64748b", textDecoration: "none", position: "absolute", left: "40px", top: "25px", fontWeight: "bold" }}>
          ← Retour au panier
        </Link>
        <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#003d5c" }}>Sécurisation de votre commande</h1>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 400px", gap: "40px", padding: "0 20px" }}>
        
        {/* 📋 COLONNE GAUCHE : LES ÉTAPES */}
        <div style={{ backgroundColor: "white", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "40px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
          
          {/* Barre de progression */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px", position: "relative" }}>
            <div style={{ position: "absolute", top: "15px", left: "10%", right: "10%", height: "3px", backgroundColor: "#e2e8f0", zIndex: 1 }}></div>
            <div style={{ position: "absolute", top: "15px", left: "10%", width: currentStep === 1 ? "0%" : currentStep === 2 ? "40%" : "80%", height: "3px", backgroundColor: "#2563eb", zIndex: 2, transition: "width 0.3s" }}></div>
            
            {["Identification", "Livraison B2B", "Paiement"].map((stepName, idx) => (
              <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 3, position: "relative", backgroundColor: "white", padding: "0 10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: currentStep > idx ? "#2563eb" : "white", border: currentStep > idx ? "none" : "2px solid #cbd5e1", color: currentStep > idx ? "white" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", marginBottom: "10px", transition: "all 0.3s" }}>
                  {currentStep > idx + 1 ? "✓" : idx + 1}
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: "bold", color: currentStep >= idx + 1 ? "#0f172a" : "#94a3b8" }}>{stepName}</span>
              </div>
            ))}
          </div>

          {/* ÉTAPE 1 : IDENTIFICATION */}
          {currentStep === 1 && (
            <form onSubmit={handleNextStep}>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "20px", color: "#0f172a" }}>Connectez-vous à votre compte pro</h2>
              <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                <button type="button" onClick={() => setIsNewUser(false)} style={{ flex: 1, padding: "15px", border: isNewUser ? "1px solid #cbd5e1" : "2px solid #2563eb", backgroundColor: isNewUser ? "white" : "#eff6ff", borderRadius: "10px", fontWeight: "bold", color: isNewUser ? "#64748b" : "#2563eb", cursor: "pointer" }}>J'ai déjà un compte</button>
                <button type="button" onClick={() => setIsNewUser(true)} style={{ flex: 1, padding: "15px", border: !isNewUser ? "1px solid #cbd5e1" : "2px solid #2563eb", backgroundColor: !isNewUser ? "white" : "#eff6ff", borderRadius: "10px", fontWeight: "bold", color: !isNewUser ? "#64748b" : "#2563eb", cursor: "pointer" }}>Nouveau client (Créer un compte)</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "30px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "bold", marginBottom: "8px", color: "#475569" }}>Email professionnel *</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #cbd5e1", outline: "none" }} placeholder="docteur@clinique.com" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "bold", marginBottom: "8px", color: "#475569" }}>Mot de passe *</label>
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #cbd5e1", outline: "none" }} placeholder="••••••••" />
                </div>
              </div>

              <button type="submit" style={{ width: "100%", padding: "18px", backgroundColor: "#0f172a", color: "white", borderRadius: "10px", border: "none", fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer" }}>
                Continuer vers la livraison
              </button>
            </form>
          )}

          {/* ÉTAPE 2 : LIVRAISON B2B */}
          {currentStep === 2 && (
            <form onSubmit={handleNextStep}>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "20px", color: "#0f172a" }}>Où devons-nous livrer l'équipement ?</h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <input type="text" required placeholder="Prénom du contact *" style={{ padding: "15px", borderRadius: "10px", border: "1px solid #cbd5e1" }} />
                <input type="text" required placeholder="Nom du contact *" style={{ padding: "15px", borderRadius: "10px", border: "1px solid #cbd5e1" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <input type="text" required placeholder="Nom du Cabinet / Hôpital *" style={{ padding: "15px", borderRadius: "10px", border: "1px solid #cbd5e1" }} />
                <input type="text" required placeholder="Numéro SIRET *" style={{ padding: "15px", borderRadius: "10px", border: "1px solid #cbd5e1" }} />
              </div>
              
              <input type="text" required placeholder="Adresse de livraison complète *" style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #cbd5e1", marginBottom: "15px" }} />
              
              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "15px", marginBottom: "15px" }}>
                <input type="text" required placeholder="Code Postal *" style={{ padding: "15px", borderRadius: "10px", border: "1px solid #cbd5e1" }} />
                <input type="text" required placeholder="Ville *" style={{ padding: "15px", borderRadius: "10px", border: "1px solid #cbd5e1" }} />
              </div>

              <input type="tel" required placeholder="Téléphone de contact pour le livreur *" style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #cbd5e1", marginBottom: "30px" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button type="button" onClick={() => setCurrentStep(1)} style={{ background: "none", border: "none", color: "#64748b", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}>← Retour</button>
                <button type="submit" style={{ padding: "18px 40px", backgroundColor: "#0f172a", color: "white", borderRadius: "10px", border: "none", fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer" }}>Procéder au paiement</button>
              </div>
            </form>
          )}

          {/* ÉTAPE 3 : PAIEMENT */}
          {currentStep === 3 && (
            <div>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "20px", color: "#0f172a" }}>Choisissez votre moyen de paiement</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "30px" }}>
                {/* Stripe / Carte Bancaire */}
                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px", border: "2px solid #2563eb", borderRadius: "12px", backgroundColor: "#eff6ff", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <input type="radio" name="payment" defaultChecked style={{ width: "20px", height: "20px" }} />
                    <span style={{ fontWeight: "bold", color: "#0f172a" }}>Carte Bancaire Professionnelle (Stripe)</span>
                  </div>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" height="20" alt="Stripe" />
                </label>

                {/* PayPal */}
                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px", border: "1px solid #cbd5e1", borderRadius: "12px", backgroundColor: "white", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <input type="radio" name="payment" style={{ width: "20px", height: "20px" }} />
                    <span style={{ fontWeight: "bold", color: "#0f172a" }}>Paiement via PayPal</span>
                  </div>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" height="20" alt="PayPal" />
                </label>

                {/* Virement Bancaire */}
                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px", border: "1px solid #cbd5e1", borderRadius: "12px", backgroundColor: "white", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <input type="radio" name="payment" style={{ width: "20px", height: "20px" }} />
                    <span style={{ fontWeight: "bold", color: "#0f172a" }}>Virement Bancaire à 30 jours</span>
                  </div>
                  <span style={{ fontSize: "1.5rem" }}>🏦</span>
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button type="button" onClick={() => setCurrentStep(2)} style={{ background: "none", border: "none", color: "#64748b", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}>← Modifier la livraison</button>
                <button onClick={handlePayment} style={{ padding: "18px 40px", backgroundColor: "#16a34a", color: "white", borderRadius: "10px", border: "none", fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer", boxShadow: "0 5px 15px rgba(22, 163, 74, 0.3)" }}>Payer {cartTotal.toLocaleString()} € TTC</button>
              </div>
            </div>
          )}

        </div>

        {/* 💳 COLONNE DROITE : RÉCAPITULATIF (Toujours visible) */}
        <aside style={{ alignSelf: "start", position: "sticky", top: "20px" }}>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
            <h2 style={{ fontSize: "1.2rem", color: "#0f172a", marginBottom: "20px", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px" }}>Récapitulatif</h2>
            
            <div style={{ maxHeight: "250px", overflowY: "auto", marginBottom: "20px" }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "0.9rem" }}>
                  <div style={{ display: "flex", gap: "10px", color: "#475569" }}>
                    <span style={{ fontWeight: "bold" }}>{item.quantity}x</span>
                    <span style={{ maxWidth: "180px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</span>
                  </div>
                  <span style={{ fontWeight: "bold", color: "#0f172a" }}>{(item.price * item.quantity).toLocaleString()} €</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "2px solid #f1f5f9", paddingTop: "20px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: "0.95rem" }}><span>Sous-total HT</span><span>{totalHT.toLocaleString()} €</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: "0.95rem" }}><span>TVA (20%)</span><span>{tva.toLocaleString()} €</span></div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px dashed #cbd5e1", paddingTop: "20px" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#0f172a" }}>Total à payer</span>
              <span style={{ fontSize: "1.6rem", fontWeight: "900", color: "#2563eb" }}>{cartTotal.toLocaleString()} €</span>
            </div>
            
            <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f0fdf4", borderRadius: "10px", textAlign: "center", color: "#166534", fontSize: "0.85rem", fontWeight: "bold" }}>
              🔒 Connexion sécurisée SSL 256-bit
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
}