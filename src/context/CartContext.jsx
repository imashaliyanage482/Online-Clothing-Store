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
    const restoreCart = async () => {
      const stored = localStorage.getItem('fashionstore_cart');
      if (!stored) return;

      const savedCart = JSON.parse(stored);
      if (!Array.isArray(savedCart)) {
        throw new Error('Saved shopping bag data is invalid.');
      }

      const missingPrices = savedCart.some(
        (item) => item.price === null || item.price === undefined || item.price === ''
          || !Number.isFinite(Number(item.price))
      );
      let productsById = new Map();

      if (missingPrices) {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Could not restore saved product prices.');
        }
        productsById = new Map((data.products || []).map((product) => [product.id, product]));
      }

      const restoredCart = savedCart.map((item) => {
        const product = productsById.get(item.productId);
        const price = item.price ?? item.basePrice ?? product?.price;
        const numericPrice = Number(price);
        return {
          ...item,
          price: Number.isFinite(numericPrice) && numericPrice >= 0
            ? numericPrice
            : Number(product?.price) || 0,
          quantity: Math.max(1, Number(item.quantity) || 1),
        };
      });

      setCart(restoredCart);
      localStorage.setItem('fashionstore_cart', JSON.stringify(restoredCart));
    };

    restoreCart().catch((error) => {
      console.error('Failed to restore shopping bag:', error);
    });
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem('fashionstore_cart', JSON.stringify(newCart));
    } catch (e) {}
  };

  const addToCart = (product, variant, quantity = 1) => {
    const productPrice = Number(product.basePrice ?? product.price ?? 0);
    const additionalPrice = Number(variant.additionalPrice) || 0;
    const unitPrice = Number.isFinite(productPrice) ? productPrice + additionalPrice : 0;
    const existingIndex = cart.findIndex(
      (item) => item.variantId === variant.id
    );

    let updatedCart;
    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        productId: product.id,
        title: product.title,
        price: unitPrice,
        quantity: (Number(updatedCart[existingIndex].quantity) || 0) + quantity,
      };
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
          price: unitPrice,
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
  const cartTotal = cart.reduce((total, item) => {
    const price = Number(item.price);
    const quantity = Number(item.quantity);
    return total + (Number.isFinite(price) && Number.isFinite(quantity) ? price * quantity : 0);
  }, 0);

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
