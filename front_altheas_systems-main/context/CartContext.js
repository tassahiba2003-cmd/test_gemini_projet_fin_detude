"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getAuthToken } from "../services/authSession";
// 👈 On importe les fonctions qui parlent à ton Back-end !
import { fetchCart, addCartItem, updateCartItem, deleteCartItem } from "../services/api/cartApi";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

  // 📥 1. CHARGEMENT au démarrage
  useEffect(() => {
    async function loadCart() {
      const token = getAuthToken();
      
      // Si l'utilisateur est connecté, on télécharge son VRAI panier depuis la Base de Données
      if (token) {
        try {
          const serverCart = await fetchCart();
          if (serverCart && serverCart.items) {
             const formattedItems = serverCart.items.map(item => ({
              id: item.productId,
              name: item.name || "Produit",
              price: item.unitPrice || 0,
              image: "/images/placeholder.png",
              quantity: item.quantity,
              stockCount: item.availableStock || 99
            }));
            setCart(formattedItems);
            setIsLoaded(true);
            return; // On s'arrête là pour ne pas lire le localStorage
          }
        } catch (e) {
          console.error("Erreur de chargement du panier serveur", e);
        }
      }
      
      // Si on est invité (pas de token), on lit le localStorage
      const savedCart = localStorage.getItem("althea_cart");
      if (savedCart) {
        try { setCart(JSON.parse(savedCart)); } catch (e) {}
      }
      setIsLoaded(true);
    }
    loadCart();
  }, []);

  // 💾 2. SAUVEGARDE LOCALE automatique
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("althea_cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // 🛒 AJOUTER UN ARTICLE
  const addToCart = async (product, quantity = 1, openMiniCart = true) => {
    // 1. On met à jour l'écran immédiatement
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      const currentQty = existingItem ? existingItem.quantity : 0;
      
      if (currentQty + quantity > product.stockCount) {
        alert(`Désolé, stock insuffisant.`);
        return prevCart;
      }
      
      let newCart;
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: currentQty + quantity } : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity }];
      }
      
      if (openMiniCart) setIsMiniCartOpen(true);
      return newCart;
    });

    // 2. Si on est connecté, on prévient le Back-end !
    if (getAuthToken()) {
      try {
        await addCartItem({ productId: product.id, quantity });
      } catch (e) {
        console.error("Erreur d'ajout au serveur", e);
      }
    }
  };

  // 🔄 MODIFIER QUANTITÉ
  const updateQuantity = async (productId, newQuantity) => {
    // 1. On met à jour l'écran
    setCart((prevCart) => prevCart.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: Math.max(1, Math.min(item.stockCount, newQuantity)) };
        }
        return item;
    }));

    // 2. Si on est connecté, on prévient le Back-end !
    if (getAuthToken()) {
      try {
        await updateCartItem(productId, { quantity: newQuantity });
      } catch (e) {
        console.error("Erreur de mise à jour au serveur", e);
      }
    }
  };

  // 🗑️ SUPPRIMER (La solution à ton bug !)
  const removeFromCart = async (productId) => {
    // 1. On efface de l'écran
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));

    // 2. Si on est connecté, on dit au Back-end de le supprimer de la Base de Données !
    if (getAuthToken()) {
      try {
        await deleteCartItem(productId);
      } catch (e) {
        console.error("Erreur de suppression au serveur", e);
      }
    }
  };

  // 🧹 VIDER LE PANIER COMPLET
  const clearCart = () => {
      setCart([]);
      localStorage.removeItem("althea_cart");
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
        cart, addToCart, updateQuantity, removeFromCart, clearCart, 
        cartCount, cartTotal, isMiniCartOpen, setIsMiniCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);