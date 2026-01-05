import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { addToCart } from "../services/cartService";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(`/products`).then(res => {
      setProduct(res.data.find(p => p._id === id));
    });
  }, [id]);

  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 grid md:grid-cols-2 gap-6">
      <img src={product.images[0]} className="w-full" />
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="mt-2">{product.description}</p>
        <p className="mt-2 text-xl">₹{product.price}</p>
        <button
          onClick={() => addToCart({ productId: product._id, quantity: 1 })}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
