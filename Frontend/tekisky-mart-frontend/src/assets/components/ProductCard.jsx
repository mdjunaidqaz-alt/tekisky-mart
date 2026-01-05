import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="border rounded shadow-sm hover:shadow-md transition">
      <img
        src={product.images[0]}
        alt={product.name}
        className="h-48 w-full object-cover"
      />
      <div className="p-3">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600">₹{product.price}</p>
        <Link
          to={`/product/${product._id}`}
          className="block mt-2 text-blue-600"
        >
          View
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
