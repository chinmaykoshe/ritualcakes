import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { FaBars, FaTimes, FaSearch, FaShoppingBag, FaUser } from "react-icons/fa";
import SearchBar from "./SearchBar";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isOpen, setIsOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSignOut = () => {
    const isConfirmed = window.confirm("Are you sure you want to sign out?");
    if (isConfirmed) {
      localStorage.clear();
      setIsLoggedIn(false);
      navigate("/");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Designs", path: "/designs" },
    { name: "Cakes", path: "/cakes" },
    { name: "Catalogue", path: "/catalogue" },
    { name: "Custom", path: "/customization" },
    { name: "About", path: "/about" },
    { name: "Orders", path: "/orders" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ${
          scrolled ? "py-3 glass shadow-premium" : "py-6 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-3 group">
            <motion.img 
              whileHover={{ rotate: 10 }}
              src={assets.logo} 
              className="h-10 w-auto" 
              alt="Ritual Cakes Logo" 
            />
            <span className="text-xl font-serif font-black tracking-tighter text-bakery-chocolate group-hover:text-bakery-rose transition-colors">
              RITUAL CAKES
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-300 rounded-full ${
                    isActive
                      ? "text-white bg-bakery-chocolate shadow-premium"
                      : "text-bakery-chocolate hover:text-bakery-rose"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 md:space-x-5">
            <button
              onClick={() => setShowSearchBar(!showSearchBar)}
              className="p-2 text-bakery-chocolate hover:text-bakery-rose transition-colors"
              aria-label="Search"
            >
              <FaSearch className="text-xl" />
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 text-bakery-chocolate hover:text-bakery-rose transition-colors"
              aria-label="Cart"
            >
              <FaShoppingBag className="text-xl" />
              {cart?.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-bakery-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate("/UserDetails")}
              className="hidden md:block p-2 text-bakery-chocolate hover:text-bakery-rose transition-colors"
              aria-label="User Profile"
            >
              <FaUser className="text-xl" />
            </button>

            <button
              type="button"
              onClick={isLoggedIn ? handleSignOut : () => navigate("/login")}
              className="btn-premium py-2 px-6 text-sm hidden md:block"
            >
              {isLoggedIn ? "Sign Out" : "Sign In"}
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-bakery-chocolate"
              aria-label="Toggle Menu"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Search Bar Overlay */}
      <AnimatePresence>
        {showSearchBar && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 w-full z-[1001]"
          >
            <SearchBar showSearchBar={showSearchBar} setShowSearchBar={setShowSearchBar} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-bakery-chocolate/40 backdrop-blur-sm z-[1002]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-80 h-full bg-bakery-cream shadow-2xl z-[1003] p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-serif text-2xl font-bold text-bakery-chocolate">Menu</span>
                <button onClick={toggleMenu} className="text-bakery-chocolate">
                  <FaTimes size={28} />
                </button>
              </div>
              <div className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={toggleMenu}
                    className={({ isActive }) =>
                      `text-2xl font-serif font-medium transition-colors ${
                        isActive ? "text-bakery-rose" : "text-bakery-chocolate hover:text-bakery-rose"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
                <hr className="border-bakery-pink" />
                <button
                  onClick={() => {
                    navigate("/UserDetails");
                    toggleMenu();
                  }}
                  className="flex items-center space-x-3 text-xl text-bakery-chocolate"
                >
                  <FaUser /> <span>My Account</span>
                </button>
                <button
                  onClick={() => {
                    isLoggedIn ? handleSignOut() : navigate("/login");
                    toggleMenu();
                  }}
                  className="btn-premium w-full mt-4"
                >
                  {isLoggedIn ? "Sign Out" : "Sign In"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Spacer to prevent content from jumping */}
      <div className="h-24"></div>
    </>
  );
}

export default Navbar;

