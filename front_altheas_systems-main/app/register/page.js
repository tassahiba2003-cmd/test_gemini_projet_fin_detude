"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// 💡 Correction : On importe 'registerAccount' depuis le bon fichier 'registrationService'
import { registerAccount } from "../../services/registrationService"; 

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "",
    confirmPassword: "", address: "", city: "", zipCode: "",
    specialty: "", company: "", siret: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // État pour la validation du mot de passe
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false, upper: false, number: false, special: false
  });

  useEffect(() => {
    const p = formData.password;
    setPasswordCriteria({
      length: p.length >= 8,
      upper: /[A-Z]/.test(p),
      number: /[0-9]/.test(p),
      special: /[^A-Za-z0-9]/.test(p)
    });
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Les mots de passe ne sont pas identiques.");
      return;
    }

    const missing = [];
    if (!passwordCriteria.length) missing.push("8 caractères minimum");
    if (!passwordCriteria.upper) missing.push("une majuscule");
    if (!passwordCriteria.number) missing.push("un chiffre");
    if (!passwordCriteria.special) missing.push("un caractère spécial");

    if (missing.length > 0) {
      setErrorMessage(`Mot de passe trop faible. Il vous manque : ${missing.join(", ")}.`);
      return;
    }

    setIsLoading(true);
    try {
      // 🚀 Appel de la bonne fonction 'registerAccount'
      const res = await registerAccount({
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        company: formData.company,
        siret: formData.siret,
        specialty: formData.specialty,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode
      });

      if (!res.ok) throw new Error(res.message || "Erreur lors de l'inscription.");

      setSuccessMessage("Compte créé ! Un mail de confirmation a été envoyé à " + formData.email);
      setTimeout(() => router.push("/login"), 5000);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ backgroundColor: "white", maxWidth: "700px", margin: "0 auto", borderRadius: "30px", padding: "50px", boxShadow: "0 20px 60px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
        <h1 style={{ textAlign: "center", color: "#003d5c", marginBottom: "30px" }}>Inscription Althea Pro</h1>

        {errorMessage && <div style={{ padding: "15px", backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: "10px", marginBottom: "20px", fontWeight: "bold", textAlign: "center", lineHeight: "1.5" }}>{errorMessage}</div>}
        {successMessage && <div style={{ padding: "15px", backgroundColor: "#f0fdf4", color: "#16a34a", borderRadius: "10px", marginBottom: "20px", fontWeight: "bold", textAlign: "center" }}>{successMessage}</div>}

        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <input type="text" required placeholder="Prénom *" style={inputStyle} onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <input type="text" required placeholder="Nom *" style={inputStyle} onChange={e => setFormData({...formData, lastName: e.target.value})} />
          
          <input type="text" placeholder="Établissement (Optionnel)" style={{...inputStyle, gridColumn: "span 2"}} onChange={e => setFormData({...formData, company: e.target.value})} />
          
          <select required style={inputStyle} onChange={e => setFormData({...formData, specialty: e.target.value})}>
            <option value="">Spécialité *</option>
            <option value="Generaliste">Médecin Généraliste</option>
            <option value="Radiologue">Radiologue</option>
            <option value="Dentiste">Dentiste</option>
            <option value="Autre">Autre professionnel</option>
          </select>
          <input type="text" required placeholder="N° SIRET *" style={inputStyle} onChange={e => setFormData({...formData, siret: e.target.value})} />

          <input type="email" required placeholder="Email Pro *" style={{...inputStyle, gridColumn: "span 2"}} onChange={e => setFormData({...formData, email: e.target.value})} />

          <div>
            <input type="password" required placeholder="Mot de passe *" style={inputStyle} onChange={e => setFormData({...formData, password: e.target.value})} />
            <div style={{ fontSize: "0.8rem", marginTop: "10px", color: "#64748b" }}>
              <div style={{ color: passwordCriteria.length ? "#16a34a" : "#dc2626", marginBottom: "4px" }}>
                {passwordCriteria.length ? "✓" : "●"} 8 caractères min.
              </div>
              <div style={{ color: passwordCriteria.upper ? "#16a34a" : "#dc2626", marginBottom: "4px" }}>
                {passwordCriteria.upper ? "✓" : "●"} 1 Majuscule
              </div>
              <div style={{ color: passwordCriteria.number ? "#16a34a" : "#dc2626", marginBottom: "4px" }}>
                {passwordCriteria.number ? "✓" : "●"} 1 Chiffre
              </div>
              <div style={{ color: passwordCriteria.special ? "#16a34a" : "#dc2626" }}>
                {passwordCriteria.special ? "✓" : "●"} 1 Caractère spécial
              </div>
            </div>
          </div>
          <input type="password" required placeholder="Confirmer *" style={inputStyle} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />

          <button type="submit" disabled={isLoading} style={{ gridColumn: "span 2", padding: "18px", backgroundColor: "#0f172a", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", fontSize: "1.1rem" }}>
            {isLoading ? "Traitement..." : "Valider mon inscription professionnelle"}
          </button>
        </form>
      </div>
    </main>
  );
}

const inputStyle = { width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #cbd5e1", outline: "none", boxSizing: "border-box" };