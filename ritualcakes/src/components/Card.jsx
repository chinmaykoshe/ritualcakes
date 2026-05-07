import React from "react";
import { useNavigate } from "react-router-dom";
import { elements } from "../assets/assets";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { FaPlus, FaShoppingBag } from "react-icons/fa";

function Card({ orderID }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const allProducts = Object.values(elements).flat();
  const product = allProducts.find((item) => item.orderID === orderID);

  if (!product) {
    return null;
  }

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    navigate(`/product/${orderID}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const defaultWeight = Object.keys(product.prices)[0];
    const defaultPrice = product.prices[defaultWeight];
    
    const productToAdd = {
      orderID: product.orderID,
      name: product.name,
      shape: "Round",
      weight: defaultWeight,
      quantity: 1,
      price: defaultPrice,
      img: product.img,
    };
    
    addToCart(productToAdd);
  };

  const displayPrice = product.prices["500g"] ||
    product.prices["6 pieces"] ||
    product.prices["1 jar"] ||
    product.prices["1 serving"] ||
    Object.values(product.prices)[0] ||
    "N/A";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group card-premium h-full flex flex-col bg-white overflow-hidden cursor-pointer"
      onClick={handleDetailsClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.img}
          alt={product.name}
          onError={(e) => (e.target.src = elements.fallbackImage)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bakery-chocolate/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Price Tag */}
        <div className="absolute top-4 right-4 glass px-4 py-1.5 rounded-full text-sm font-black text-bakery-chocolate shadow-xl border border-white/50">
          ₹{displayPrice}
        </div>

        {/* Quick Add Button - Floating Overlay */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleAddToCart}
          className="absolute bottom-6 right-6 w-12 h-12 bg-white text-bakery-rose rounded-2xl flex items-center justify-center shadow-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20"
        >
          <FaPlus />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow space-y-3">
        <div className="space-y-1">
          <h3 className="text-xl font-serif font-black text-bakery-chocolate group-hover:text-bakery-rose transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/30">
            {product.category || "Premium Ritual"}
          </p>
        </div>
        
        <p className="text-sm text-bakery-chocolate/50 line-clamp-2 leading-relaxed font-medium">
          {product.description || "Experience the ritual of pure indulgence with our artisanal baked creations."}
        </p>
        
        <div className="pt-6 mt-auto">
          <button 
            onClick={handleAddToCart}
            className="w-full btn-premium py-3 text-xs flex items-center justify-center space-x-2 shadow-sm group-hover:shadow-lg transition-all"
          >
            <FaShoppingBag size={12} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Card;
