import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const location = useLocation();
  const fromCart = location.state?.from === "cart";
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const addToCartHandler = async () => {
    await addToCart(product);
    showToast(`Added to cart: ${product.name}`);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await api.get("/products");
      const foundProduct = res.data.products?.find((p) => p._id === id);
      setProduct(foundProduct);
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-500">
        Loading product...
      </div>
    );
  }

  const discountedPrice =
    product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;

  const buyNowHandler = async () => {
    await addToCart(product);
    showToast(`Buying now: ${product.name}`);
    navigate("/checkout");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 bg-white border rounded-xl shadow-sm p-6">
        {/* IMAGE */}
        <div className="flex items-center justify-center">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="
              w-full
              max-h-[420px]
              object-contain
              rounded-lg
              bg-gray-50
            "
          />
        </div>

        {/* DETAILS */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {product.name}
            </h1>

            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* PRICE */}
            <div className="mt-5">
              {product.discount > 0 && (
                <p className="text-sm text-gray-400 line-through">
                  ₹{product.price}
                </p>
              )}

              <p className="text-3xl font-bold text-green-600">
                ₹{discountedPrice.toFixed(0)}
              </p>

              {product.discount > 0 && (
                <span className="inline-block mt-1 text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* STOCK */}
            <p
              className={`mt-4 text-sm font-semibold ${
                product.stock > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {product.stock > 0
                ? `In Stock (${product.stock} left)`
                : "Out of Stock"}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-6 flex flex-wrap gap-3">
            {!fromCart && (
              <button
                onClick={addToCartHandler}
                className="
                  flex-1
                  bg-blue-600
                  text-white
                  py-2.5
                  rounded-lg
                  font-medium
                  hover:bg-blue-700
                  transition
                  active:scale-95
                "
              >
                Add to Cart
              </button>
            )}

            <button
              onClick={buyNowHandler}
              className="
                flex-1
                bg-green-600
                text-white
                py-2.5
                rounded-lg
                font-medium
                hover:bg-green-700
                transition
                active:scale-95
              "
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
