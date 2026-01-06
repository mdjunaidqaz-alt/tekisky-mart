import { createContext, useContext, useState } from "react";
import * as cartService from "../services/cartService";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

  // get cart from backend
  const fetchCart = async () => {
    const data = await cartService.getCart();
    setCart(data);
  };

  // add item to cart
  const addToCart = async (product) => {
    await cartService.addToCart(product._id, 1);
    fetchCart();
  };

  // ❌ REMOVE ITEM
  const removeItem = async (productId) => {
    // optimistic update
    setCart((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.filter(
          (item) => item.product._id !== productId
        )
      };
    });

    try {
      await cartService.removeFromCart(productId);
    } catch (error) {
      fetchCart(); // fallback
    }
  };

  // ➕➖ UPDATE QUANTITY (OPTIMISTIC)
  const updateQuantity = async (productId, quantity) => {
    setCart((prev) => {
      if (!prev) return prev;

      const updatedItems = prev.items
        .map((item) =>
          item.product._id === productId
            ? { ...item, quantity }
            : item
        )
        .filter((item) => item.quantity > 0);

      return { ...prev, items: updatedItems };
    });

    try {
      await cartService.updateCartItem(productId, quantity);
    } catch (error) {
      fetchCart(); // fallback if API fails
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        addToCart,
        removeItem,
        updateQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ custom hook
export const useCart = () => {
  return useContext(CartContext);
};
