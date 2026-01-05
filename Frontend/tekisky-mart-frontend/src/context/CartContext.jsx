import { createContext, useState } from "react";
import * as cartService from "../services/cartService";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
    const data = await cartService.getCart();
    setCart(data);
  };

  return (
    <CartContext.Provider value={{ cart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
