import api from "./api";

export const placeOrder = async (data) => {
  const res = await api.post("/orders", data);
  return res.data;
};
