import api from "./api";

export const getCart = async () => {
  const res = await api.get("/cart");
  return res.data;
};

export const addToCart = async (data) => {
  const res = await api.post("/cart", data);
  return res.data;
};
