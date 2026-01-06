import api from "./api";

export const getCart = async () => {
  const res = await api.get("/cart");
  return res.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const res = await api.post("/cart", {
    product: productId,   // ✅ matches schema
    quantity              // ✅ matches schema
  });

  return res.data;
};

export const removeFromCart = async (productId) => {
  const res = await api.delete(`/cart/${productId}`);
  return res.data;
};

export const updateCartItem = async (productId, quantity) => {
  const res = await api.put("/cart", {
    product: productId,
    quantity
  });
  return res.data;
};
