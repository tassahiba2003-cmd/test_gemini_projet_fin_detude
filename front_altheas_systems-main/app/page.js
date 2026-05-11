"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { mockHomeData } from "../services/mocks/home.mock";
import { mockCatalogData } from "../services/mocks/catalog.mock";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselData = mockHomeData.carousel || [];

  // 🚀 LOGIQUE DYNAMIQUE : On récupère TOUTES les catégories
  const allCategories = Object.keys(mockCatalogData).map(key => ({
    id: key,
    // Sécurité : si "name" n'existe pas, on affiche la clé (ex: "imagerie")
    name: mockCatalogData[key].name || key, 
    imageUrl: mockCatalogData[key].products && mockCatalogData[key].products[0] 
              ? mockCatalogData[key].products[0].imageUrl 
              : "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400"
  }));

  // 🚀 LOGIQUE DYNAMIQUE : On récupère les produits vedettes
  const featuredProducts = (mockHomeData.featuredProductIds || []).map(id => {
    let found = null;
    Object.values(mockCatalogData).forEach(cat => {
      const p = cat.products.find(prod => prod.id == id);
      if (p) found = p;
    });
    return found;
  }).filter(p => p !== null);

  // LOGIQUE DU CARROUSEL
  const nextSlide = () => setCurrentSlide((prev) => (prev === carouselData.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? carouselData.length - 1 : prev - 1));

  useEffect(() => {
    if (carouselData.length === 0) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [carouselData.length]);

  return (
    <main style={{ fontFamily: 'sans-serif', backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      
      {/* 🎠 1. CARROUSEL PREMIUM */}
      <section style={{ position: "relative", height: "550px", overflow: "hidden", backgroundColor: "#0f172a" }}>
        {carouselData.map((slide, index) => (
          <div key={slide.id} style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
              opacity: currentSlide === index ? 1 : 0, transition: "opacity 0.8s ease-in-out", zIndex: currentSlide === index ? 1 : 0
            }}>
            <div style={{
              width: "100%", height: "100%",
              backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.3)), url(${slide.imageUrl})`,
              backgroundSize: "cover", backgroundPosition: "center"
            }}></div>
            <div style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
              display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", color: "white", padding: "0 20px"
            }}>
              <h1 style={{ fontSize: "4rem", fontWeight: "bold", marginBottom: "20px", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>{slide.title}</h1>
              <p style={{ fontSize: "1.3rem", marginBottom: "40px", maxWidth: "700px", lineHeight: "1.6" }}>{slide.subtitle}</p>
              <Link href={slide.link}>
                <button style={{ backgroundColor: "#2563eb", color: "white", padding: "15px 40px", fontSize: "1.2rem", fontWeight: "bold", borderRadius: "50px", border: "none", cursor: "pointer", boxShadow: "0 4px 15px rgba(37, 99, 235, 0.4)" }}>
                  {slide.buttonText}
                </button>
              </Link>
            </div>
          </div>
        ))}
        <button onClick={prevSlide} style={{ position: "absolute", top: "50%", left: "30px", zIndex: 10, background: "rgba(255,255,255,0.2)", color: "white", border: "none", borderRadius: "50%", width: "50px", height: "50px", cursor: "pointer" }}>❮</button>
        <button onClick={nextSlide} style={{ position: "absolute", top: "50%", right: "30px", zIndex: 10, background: "rgba(255,255,255,0.2)", color: "white", border: "none", borderRadius: "50%", width: "50px", height: "50px", cursor: "pointer" }}>❯</button>
      </section>

      {/* 📝 2. BIENVENUE */}
      <section style={{ backgroundColor: "white", padding: "80px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", color: "#0f172a", marginBottom: "20px", fontWeight: "bold" }}>{mockHomeData.welcomeMessage?.title}</h2>
        <p style={{ fontSize: "1.2rem", color: "#475569", maxWidth: "850px", margin: "0 auto", lineHeight: "1.8" }}>{mockHomeData.welcomeMessage?.content}</p>
      </section>

      {/* 🗂️ 3. CATÉGORIES (CORRECTION TITRES VISIBLES) */}
      <section style={{ maxWidth: "1200px", margin: "60px auto", padding: "0 20px" }}>
        <h2 style={{ fontSize: "2.2rem", marginBottom: "40px", fontWeight: "bold", textAlign: "center", color: "#0f172a" }}>Nos Domaines d'Expertise</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px" }}>
          {allCategories.map((category) => (
            <Link href={`/categories/${category.id}`} key={category.id} style={{ textDecoration: "none" }}>
              <div style={{ 
                position: "relative", 
                height: "280px", 
                borderRadius: "20px", 
                overflow: "hidden", 
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                backgroundColor: "#0f172a" 
              }}>
                {/* L'Image de fond */}
                <div style={{ 
                  position: "absolute", top: 0, left: 0, width: "100%", height: "100%", 
                  backgroundImage: `url(${category.imageUrl})`, 
                  backgroundSize: "cover", backgroundPosition: "center"
                }}></div>
                
                {/* Le dégradé pour le contraste (force l'opacité ici) */}
                <div style={{ 
                  position: "absolute", top: 0, left: 0, width: "100%", height: "100%", 
                  background: "linear-gradient(to top, rgba(15,23,42,1) 0%, rgba(15,23,42,0.4) 40%, transparent 100%)",
                  zIndex: 2
                }}></div>
                
                {/* LE TEXTE - On force la visibilité ici */}
                <div style={{ 
                  position: "absolute", 
                  bottom: "0", 
                  left: "0", 
                  width: "100%", 
                  padding: "30px",
                  zIndex: "10", // Très élevé pour être au dessus de tout
                  display: "block" // On s'assure qu'il n'est pas caché
                }}>
                  <h3 style={{ 
                    color: "#ffffff", // Blanc pur
                    fontSize: "1.8rem", 
                    fontWeight: "bold", 
                    margin: 0, 
                    textShadow: "2px 2px 4px rgba(0,0,0,1)" // Ombre portée pour détacher le texte
                  }}>
                    {category.name} <span style={{color:"#3b82f6"}}>→</span>
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🛍️ 4. PRODUITS VEDETTES */}
      <section style={{ maxWidth: "1200px", margin: "80px auto", padding: "0 20px" }}>
        <h2 style={{ fontSize: "2.2rem", marginBottom: "40px", fontWeight: "bold", textAlign: "center", color: "#0f172a" }}>Produits Vedettes</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
          {featuredProducts.map((product) => (
            <div key={product.id} style={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", backgroundColor: "white", display: "flex", flexDirection: "column" }}>
              <Link href={`/products/${product.id}`} style={{ display: "block" }}>
                <div style={{ height: "230px", backgroundImage: `url(${product.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
              </Link>
              <div style={{ padding: "25px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "10px", color: "#0f172a" }}>{product.name}</h3>
                <p style={{ color: "#2563eb", fontSize: "1.5rem", fontWeight: "bold", margin: "0 0 20px 0" }}>{product.price.toLocaleString("fr-FR")} €</p>
                <Link href={`/products/${product.id}`} style={{ marginTop: "auto" }}>
                  <button style={{ width: "100%", padding: "12px", backgroundColor: "#f1f5f9", color: "#0f172a", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>Détails du produit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}