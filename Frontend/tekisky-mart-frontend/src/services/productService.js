import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

export const getProducts = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

axios.get("http://localhost:5000/api/products");
