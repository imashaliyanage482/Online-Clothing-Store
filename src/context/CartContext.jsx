'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext({
  cart: [],
  cartCount: 0,
  cartTotal: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('fashionstore_cart');
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (e) {
      // LocalStorage unavailable
    }
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem('fashionstore_cart', JSON.stringify(newCart));
    } catch (e) {}
  };

  const addToCart = (product, variant, quantity = 1) => {
    const existingIndex = cart.findIndex(
      (item) => item.variantId === variant.id
    );

    let updatedCart;
    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart = [
        ...cart,
        {
          id: variant.id,
          variantId: variant.id,
          productId: product.id,
          title: product.title,
          slug: product.slug,
          size: variant.size,
          colorName: variant.colorName,
          price: Number(product.basePrice) + Number(variant.additionalPrice || 0),
          image: product.images?.[0]?.url || '/hero.png',
          quantity,
        },
      ];
    }
    saveCart(updatedCart);
  };

  const removeFromCart = (variantId) => {
    const updatedCart = cart.filter((item) => item.variantId !== variantId);
    saveCart(updatedCart);
  };

  const updateQuantity = (variantId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    const updatedCart = cart.map((item) =>
      item.variantId === variantId ? { ...item, quantity } : item
    );
    saveCart(updatedCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
