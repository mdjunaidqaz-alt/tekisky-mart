import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10 animate-fadeInUp">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div className="transition-transform duration-300 hover:-translate-y-1">
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Tekisky Mart
          </h2>
          <p className="text-sm mt-3 text-gray-400 leading-relaxed">
            Your trusted online store for quality products at the best price.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            {["/", "/products", "/cart", "/orders"].map((path, i) => (
              <li key={i}>
                <Link
                  to={path}
                  className="inline-block transition-all duration-300 hover:text-white hover:translate-x-1"
                >
                  {path === "/" && "Home"}
                  {path === "/products" && "Products"}
                  {path === "/cart" && "Cart"}
                  {path === "/orders" && "My Orders"}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CUSTOMER */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Customer
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {["Help Center", "Returns", "Shipping", "Privacy Policy"].map(
              (item, i) => (
                <li
                  key={i}
                  className="cursor-pointer transition-all duration-300 hover:text-white hover:translate-x-1"
                >
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

        {/* CONTACT */}
        <div className="transition-transform duration-300 hover:-translate-y-1">
          <h3 className="text-white font-semibold mb-4">
            Contact
          </h3>
          <p className="text-sm text-gray-400">
            Email: support@tekiskymart.com
          </p>
          <p className="text-sm mt-2 text-gray-400">
            Phone: +91 90000 00000
          </p>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-400 transition-opacity duration-300 hover:text-white">
        © {new Date().getFullYear()} Tekisky Mart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
