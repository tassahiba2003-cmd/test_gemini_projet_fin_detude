"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false); // Pour éviter les bugs de chargement au début
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false); // 👈 NOUVEAU: État pour le mini-panier

  // 📥 1. CHARGEMENT au démarrage (Une seule fois)
  useEffect(() => {
    const savedCart = localStorage.getItem("althea_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Erreur de lecture du panier", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 💾 2. SAUVEGARDE automatique dès que le panier change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("althea_cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // 🛒 AJOUTER avec sécurité stock
  // 👈 MODIFICATION : ajout du paramètre openMiniCart et suppression du alert()
  const addToCart = (product, quantity = 1, openMiniCart = true) => {
    let success = false;
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      const currentQty = existingItem ? existingItem.quantity : 0;
      
      if (currentQty + quantity > product.stockCount) {
        alert(`Désolé, il n'y a que ${product.stockCount} exemplaires disponibles.`);
        return prevCart;
      }
      success = true;
      let newCart;
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: currentQty + quantity } : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity }];
      }
      
      // 👈 NOUVEAU : Ouverture du mini-panier
      if (openMiniCart) setIsMiniCartOpen(true);
      
      return newCart;
    });
  };

  // 🔄 MODIFIER QUANTITÉ
  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === productId) {
          const safeQuantity = Math.max(1, Math.min(item.stockCount, newQuantity));
          return { ...item, quantity: safeQuantity };
        }
        return item;
      });
    });
  };

  // 🗑️ SUPPRIMER
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
        cart, 
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        cartCount, 
        cartTotal,
        isMiniCartOpen,       // 👈 NOUVEAU
        setIsMiniCartOpen     // 👈 NOUVEAU
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);