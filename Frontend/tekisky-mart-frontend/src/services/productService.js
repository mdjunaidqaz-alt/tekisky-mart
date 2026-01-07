import api from "./api";

/**
 * Fetch products with optional filters
 * @param {Object} params
 * @param {string} params.keyword
 * @param {string} params.category
 * @param {number} params.page
 */
export const getProducts = async ({
  keyword = "",
  category = "",
  page = 1
} = {}) => {
  const { data } = await api.get("/products", {
    params: { keyword, category, page }
  });

  return data; 
};
