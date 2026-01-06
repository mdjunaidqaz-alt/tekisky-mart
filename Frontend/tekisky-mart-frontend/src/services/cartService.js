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
