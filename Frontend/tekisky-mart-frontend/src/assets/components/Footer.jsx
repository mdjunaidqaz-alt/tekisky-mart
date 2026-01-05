import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white">Tekisky Mart</h2>
          <p className="text-sm mt-3">
            Your trusted online store for quality products at the best price.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/products" className="hover:text-white">Products</Link></li>
            <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
            <li><Link to="/orders" className="hover:text-white">My Orders</Link></li>
          </ul>
        </div>

        {/* Customer */}
        <div>
          <h3 className="text-white font-semibold mb-3">Customer</h3>
          <ul className="space-y-2 text-sm">
            <li>Help Center</li>
            <li>Returns</li>
            <li>Shipping</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <p className="text-sm">Email: support@tekiskymart.com</p>
          <p className="text-sm mt-1">Phone: +91 90000 00000</p>
        </div>

      </div>

      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © {new Date().getFullYear()} Tekisky Mart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
