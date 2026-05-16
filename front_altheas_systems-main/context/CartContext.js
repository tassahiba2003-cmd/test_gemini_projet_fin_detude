"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getAuthToken } from "../services/authSession";
// On utilise tes fonctions API existantes
import { fetchCart, addCartItem, updateCartItem, deleteCartItem } from "../services/api/cartApi";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

  // 📥 1. CHARGEMENT INITIAL (Au démarrage de l'app ou à la connexion)
  useEffect(() => {
    async function loadCart() {
      const token = getAuthToken();
      
      // Si l'utilisateur est connecté, on va chercher son panier officiel dans ta base de données
      if (token) {
        try {
          const serverCart = await fetchCart();
          if (serverCart && serverCart.items) {
            // On adapte le format de ta BDD vers les variables lues par ton MiniCart.js
            const formattedItems = serverCart.items.map(item => ({
              id: item.productId, // On utilise le productId comme identifiant unique côté Front
              name: item.name || "Produit",
              price: item.unitPrice || 0,
              imageUrl: "/images/placeholder.png", // Image par défaut
              quantity: item.quantity,
              stockCount: item.availableStock || 99
            }));
            setCart(formattedItems);
            setIsLoaded(true);
            return; // On s'arrête ici pour ignorer le localStorage
          }
        } catch (e) {
          console.error("Erreur lors de la récupération du panier serveur :", e);
        }
      }
      
      // Si c'est un visiteur invité (pas connecté), on utilise la mémoire locale du navigateur
      const savedCart = localStorage.getItem("althea_cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error("Erreur de parsing du panier local :", e);
        }
      }
      setIsLoaded(true);
    }

    loadCart();
  }, []);

  // 💾 2. SAUVEGARDE LOCALE AUTOMATIQUE (localStorage de secours)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("althea_cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // 🛒 AJOUTER UN ARTICLE AU PANIER
  const addToCart = async (product, quantity = 1, openMiniCart = true) => {
    // Étape A : On met à jour l'interface immédiatement pour l'utilisateur
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      const currentQty = existingItem ? existingItem.quantity : 0;
      
      if (currentQty + quantity > product.stockCount) {
        alert(`Stock insuffisant pour ce produit.`);
        return prevCart;
      }
      
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });

    // Étape B : Si connecté, on enregistre l'ajout dans ta vraie base de données
    if (getAuthToken()) {
      try {
        await addCartItem({ productId: product.id, quantity });
      } catch (e) {
        console.error("Erreur de synchronisation de l'ajout au serveur :", e);
      }
    }

    if (openMiniCart) setIsMiniCartOpen(true);
  };

  // 🔄 MODIFIER LA QUANTITÉ AVEC LES BOUTONS (+ / -)
  const updateQuantity = async (productId, newQuantity) => {
    // Étape A : On modifie la quantité sur l'écran
    setCart((prevCart) => prevCart.map((item) => {
      if (item.id === productId) {
        const safeQty = Math.max(1, Math.min(item.stockCount, newQuantity));
        return { ...item, quantity: safeQty };
      }
      return item;
    }));

    // Étape B : Si connecté, on envoie la nouvelle quantité exacte à ton Backend
    if (getAuthToken()) {
      try {
        await updateCartItem(productId, { quantity: newQuantity });
      } catch (e) {
        console.error("Erreur de synchronisation de la quantité au serveur :", e);
      }
    }
  };

  // 🗑️ SUPPRIMER UN PRODUIT UNIQUE (Résout le bug de la corbeille !)
  const removeFromCart = async (productId) => {
    // Étape A : On retire UNIQUEMENT ce produit de la liste locale (l'écran se met à jour proprement)
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));

    // Étape B : Si connecté, on dit au Backend d'effacer cette ligne de la base de données
    if (getAuthToken()) {
      try {
        await deleteCartItem(productId);
      } catch (e) {
        console.error("Erreur de synchronisation de la suppression au serveur :", e);
      }
    }
  };

  // 🧹 VIDER TOUT LE PANIER
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("althea_cart");
  };

  return (
    <CartContext.Provider value={{ 
        cart, addToCart, updateQuantity, removeFromCart, clearCart, 
        cartCount: cart.reduce((total, item) => total + item.quantity, 0),
        cartTotal: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
        isMiniCartOpen, setIsMiniCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);