"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getAuthToken } from "../services/authSession";
import { fetchCart, addCartItem, updateCartItem, deleteCartItem } from "../services/api/cartApi";
// 👇 1. NOUVEL IMPORT : On importe la fonction pour lire le vrai catalogue
import { fetchProductById } from "../services/api/catalogApi"; 

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

  useEffect(() => {
    async function loadCart() {
      const token = getAuthToken();
      
      if (token) {
        try {
          const serverCart = await fetchCart();
          if (serverCart && serverCart.items) {
            
            // 🚀 2. LA MAGIE : On traduit les faux noms du Back-end par les vrais noms du Front-end
            const formattedItems = await Promise.all(serverCart.items.map(async (item) => {
              // On cherche le produit dans ton mock de catalogue
              const realProduct = await fetchProductById(item.productId);
              
              return {
                id: item.productId,
                name: realProduct ? realProduct.name : item.name, // 👈 Prend le VRAI nom !
                price: realProduct ? realProduct.price : item.unitPrice, // 👈 Prend le VRAI prix !
                // 👈 Prend la VRAIE image (selon la structure de ton mock, adapte si besoin)
                imageUrl: realProduct ? (realProduct.image || realProduct.images?.[0] || "/images/placeholder.png") : "/images/placeholder.png", 
                quantity: item.quantity,
                stockCount: realProduct ? 99 : item.availableStock
              };
            }));
            
            setCart(formattedItems);
            setIsLoaded(true);
            return;
          }
        } catch (e) {
          console.error("Erreur lors de la récupération du panier serveur :", e);
        }
      }
      
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

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("althea_cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = async (product, quantity = 1, openMiniCart = true) => {
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

    if (getAuthToken()) {
      try {
        await addCartItem({ productId: product.id, quantity });
      } catch (e) {
        console.error("Erreur de synchronisation au serveur :", e);
      }
    }

    if (openMiniCart) setIsMiniCartOpen(true);
  };

  const updateQuantity = async (productId, newQuantity) => {
    setCart((prevCart) => prevCart.map((item) => {
      if (item.id === productId) {
        const safeQty = Math.max(1, Math.min(item.stockCount, newQuantity));
        return { ...item, quantity: safeQty };
      }
      return item;
    }));

    if (getAuthToken()) {
      try {
        await updateCartItem(productId, { quantity: newQuantity });
      } catch (e) {
        console.error("Erreur de synchronisation :", e);
      }
    }
  };

  const removeFromCart = async (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));

    if (getAuthToken()) {
      try {
        await deleteCartItem(productId);
      } catch (e) {
        console.error("Erreur de suppression :", e);
      }
    }
  };

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