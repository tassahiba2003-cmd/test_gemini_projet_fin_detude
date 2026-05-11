"use client";
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // 🛒 Fonction pour AJOUTER depuis la page produit (avec alerte)
  const addToCart = (product, quantity = 1) => {
    let success = false;
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      const currentQty = existingItem ? existingItem.quantity : 0;
      
      if (currentQty + quantity > product.stockCount) {
        alert(`Désolé, il n'y a que ${product.stockCount} exemplaires disponibles au total.`);
        return prevCart;
      }
      success = true;
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: currentQty + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    if (success) {
      alert(`${quantity}x ${product.name} a été ajouté à votre panier !`);
    }
  };

  // 🔄 NOUVELLE FONCTION : Modifier la quantité DANS LE PANIER (silencieux et sécurisé)
  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === productId) {
          // Sécurité absolue : on reste entre 1 et le stock maximum du produit
          const safeQuantity = Math.max(1, Math.min(item.stockCount, newQuantity));
          return { ...item, quantity: safeQuantity };
        }
        return item;
      });
    });
  };

  // 🗑️ Fonction pour SUPPRIMER du panier
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // 🔢 Compteurs
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);