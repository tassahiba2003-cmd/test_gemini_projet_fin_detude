"use client";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import { getAuthToken } from "../../services/authSession";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [address, setAddress] = useState({
    firstName: "", lastName: "", street: "", city: "", 
    region: "", zipCode: "", country: "France", phone: ""
  });

  const [payment, setPayment] = useState({
    cardName: "", cardNumber: "", expiryDate: "", cvv: ""
  });

  // NOUVEAU : États pour l'autocomplétion des villes de France
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/cart");
    }
    if (!getAuthToken()) {
       router.push("/login?redirect=/checkout");
    }
  }, [cart, router]);

  // 🌍 NOUVEAU : Fonction pour chercher la ville via l'API du Gouvernement
  const handleCitySearch = async (text) => {
    setAddress({ ...address, city: text }); // Met à jour le champ texte
    
    if (text.length >= 2) {
      try {
        // Interroge l'API officielle pour récupérer les villes et codes postaux
        const res = await fetch(`https://geo.api.gouv.fr/communes?nom=${text}&fields=nom,codesPostaux,region&boost=population&limit=5`);
        const data = await res.json();
        setCitySuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Erreur API Geo:", error);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  // 🎯 NOUVEAU : Quand l'utilisateur clique sur une ville de la liste
  const handleSelectCity = (ville) => {
    setAddress({
      ...address,
      city: ville.nom, // On écrit le nom officiel
      zipCode: ville.codesPostaux[0], // On remplit le premier code postal trouvé
      region: ville.region ? ville.region.nom : address.region // (Bonus) On remplit même la région si elle existe !
    });
    setShowSuggestions(false); // On ferme la liste déroulante
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (step === 1) {
      if (!/^\d{5}$/.test(address.zipCode)) {
        setErrorMessage("Le code postal doit contenir exactement 5 chiffres.");
        return;
      }
      const phoneClean = address.phone.replace(/\s/g, '');
      if (!/^\d{10}$/.test(phoneClean)) {
        setErrorMessage("Le numéro de téléphone doit contenir 10 chiffres valides.");
        return;
      }
    }

    if (step === 2) {
      if (payment.cardNumber.length !== 16) {
        setErrorMessage("Le numéro de carte bancaire doit contenir 16 chiffres.");
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiryDate)) {
        setErrorMessage("La date d'expiration doit être au format MM/AA (ex: 08/25).");
        return;
      }
      if (payment.cvv.length !== 3) {
        setErrorMessage("Le cryptogramme (CVV) doit contenir 3 chiffres.");
        return;
      }
    }

    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setErrorMessage("");
    setStep(step - 1);
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearCart();
      router.push("/checkout/confirmation");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la confirmation de la commande.");
      setIsProcessing(false);
    }
  };

  const taxes = cartTotal * 0.20;
  const finalTotal = cartTotal + taxes;

  if (cart.length === 0) return null;

  return (
    <main style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>
        
        <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", borderBottom: "2px solid #e2e8f0", paddingBottom: "20px" }}>
            <span style={{ fontWeight: step >= 1 ? "bold" : "normal", color: step >= 1 ? "#0f172a" : "#94a3b8" }}>1. Livraison</span>
            <span style={{ fontWeight: step >= 2 ? "bold" : "normal", color: step >= 2 ? "#0f172a" : "#94a3b8" }}>2. Paiement</span>
            <span style={{ fontWeight: step === 3 ? "bold" : "normal", color: step === 3 ? "#0f172a" : "#94a3b8" }}>3. Confirmation</span>
          </div>

          {errorMessage && (
            <div style={{ padding: "15px", backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: "10px", marginBottom: "20px", fontWeight: "bold", border: "1px solid #f87171" }}>
              ⚠️ {errorMessage}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleNextStep}>
              <h2 style={{ marginBottom: "20px", color: "#003d5c" }}>Adresse de livraison</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <input required type="text" placeholder="Prénom" value={address.firstName} onChange={e => setAddress({...address, firstName: e.target.value})} style={inputStyle} />
                <input required type="text" placeholder="Nom" value={address.lastName} onChange={e => setAddress({...address, lastName: e.target.value})} style={inputStyle} />
                <input required type="text" placeholder="Adresse complète" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} style={{...inputStyle, gridColumn: "span 2"}} />
                
                {/* 🔽 ZONE MODIFIÉE POUR LA RECHERCHE DE VILLE */}
                <div style={{ position: "relative" }}>
                  <input required type="text" placeholder="Ville (Tapez 2 lettres...)" value={address.city} onChange={e => handleCitySearch(e.target.value)} style={inputStyle} />
                  
                  {/* Le menu déroulant qui s'affiche si on a des résultats */}
                  {showSuggestions && citySuggestions.length > 0 && (
                    <ul style={{
                      position: "absolute", top: "100%", left: 0, right: 0, backgroundColor: "white",
                      border: "1px solid #cbd5e1", borderRadius: "10px", zIndex: 50,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)", maxHeight: "200px", overflowY: "auto",
                      padding: 0, margin: "5px 0 0 0", listStyle: "none"
                    }}>
                      {citySuggestions.map((ville, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelectCity(ville)}
                          style={{
                            padding: "12px 15px", cursor: "pointer", borderBottom: index !== citySuggestions.length - 1 ? "1px solid #f1f5f9" : "none",
                            display: "flex", justifyContent: "space-between", alignItems: "center"
                          }}
                        >
                          <span style={{ fontWeight: "bold", color: "#0f172a" }}>{ville.nom}</span>
                          <span style={{ color: "#2563eb", fontSize: "0.9rem", backgroundColor: "#eff6ff", padding: "3px 8px", borderRadius: "20px" }}>{ville.codesPostaux[0]}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* 🔼 FIN DE LA ZONE MODIFIÉE */}

                <input required type="text" placeholder="Code Postal" maxLength="5" value={address.zipCode} onChange={e => setAddress({...address, zipCode: e.target.value.replace(/\D/g,'')})} style={inputStyle} />
                <input required type="text" placeholder="Région / Province" value={address.region} onChange={e => setAddress({...address, region: e.target.value})} style={inputStyle} />
                <input required type="text" placeholder="Pays" value={address.country} onChange={e => setAddress({...address, country: e.target.value})} style={inputStyle} />
                <input required type="tel" placeholder="Téléphone (ex: 0612345678)" maxLength="10" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value.replace(/\D/g,'')})} style={{...inputStyle, gridColumn: "span 2"}} />
              </div>
              <button type="submit" style={nextBtnStyle}>Passer au paiement →</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNextStep}>
              <h2 style={{ marginBottom: "20px", color: "#003d5c" }}>Informations de paiement</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <input required type="text" placeholder="Nom sur la carte" value={payment.cardName} onChange={e => setPayment({...payment, cardName: e.target.value})} style={inputStyle} />
                <input required type="text" maxLength="16" placeholder="Numéro de carte (16 chiffres)" value={payment.cardNumber} onChange={e => setPayment({...payment, cardNumber: e.target.value.replace(/\D/g,'')})} style={inputStyle} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <input required type="text" placeholder="MM/AA (Expiration)" maxLength="5" value={payment.expiryDate} onChange={e => setPayment({...payment, expiryDate: e.target.value})} style={inputStyle} />
                  <input required type="text" maxLength="3" placeholder="CVV (Dos de la carte)" value={payment.cvv} onChange={e => setPayment({...payment, cvv: e.target.value.replace(/\D/g,'')})} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
                <button type="button" onClick={handlePrevStep} style={backBtnStyle}>← Retour</button>
                <button type="submit" style={nextBtnStyle}>Vérifier la commande →</button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ marginBottom: "20px", color: "#003d5c" }}>Vérification finale</h2>
              <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "10px" }}>Livraison à :</h3>
                <p style={{ margin: 0, color: "#475569", lineHeight: "1.5" }}>
                  {address.firstName} {address.lastName}<br/>
                  {address.street}<br/>
                  {address.zipCode} {address.city}, {address.region}<br/>
                  {address.country}<br/>
                  Tél : {address.phone}
                </p>
              </div>
              <div style={{ display: "flex", gap: "15px" }}>
                <button type="button" onClick={handlePrevStep} style={backBtnStyle}>← Modifier</button>
                <button type="button" onClick={handleConfirmOrder} disabled={isProcessing} style={{...nextBtnStyle, backgroundColor: "#16a34a"}}>
                  {isProcessing ? "Validation en cours..." : "Confirmer l'achat sécurisé"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* COLONNE DROITE : RÉSUMÉ DU PANIER */}
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", height: "fit-content" }}>
          <h2 style={{ fontSize: "1.3rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "15px", marginBottom: "20px" }}>Résumé</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "20px", maxHeight: "300px", overflowY: "auto" }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ color: "#475569" }}>{item.quantity}x {item.name.substring(0, 20)}...</span>
                <span style={{ fontWeight: "bold" }}>{(item.price * item.quantity).toFixed(2)} €</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "15px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.95rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Sous-total HT</span><span>{cartTotal.toFixed(2)} €</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>TVA (20%)</span><span>{taxes.toFixed(2)} €</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "1.2rem", fontWeight: "bold", color: "#0f172a" }}>
              <span>Total TTC</span><span>{finalTotal.toFixed(2)} €</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

const inputStyle = { padding: "15px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none", width: "100%", boxSizing: "border-box", marginTop: "5px" };
const nextBtnStyle = { width: "100%", backgroundColor: "#0f172a", color: "white", padding: "16px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "1.1rem", marginTop: "20px" };
const backBtnStyle = { flex: 0.5, backgroundColor: "transparent", color: "#64748b", padding: "16px", borderRadius: "10px", border: "1px solid #cbd5e1", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" };