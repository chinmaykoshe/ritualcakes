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
        <div className="glass absolute right-2 top-2 rounded-full border border-white/50 px-2.5 py-1 text-[11px] font-black text-bakery-chocolate shadow-xl md:right-4 md:top-4 md:px-4 md:py-1.5 md:text-sm">
          ₹{displayPrice}
        </div>

        {/* Quick Add Button - Floating Overlay */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 z-20 flex h-10 w-10 translate-y-4 items-center justify-center rounded-xl bg-white text-bakery-rose opacity-0 shadow-2xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:bottom-6 md:right-6 md:h-12 md:w-12 md:rounded-2xl"
        >
          <FaPlus />
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex flex-grow flex-col space-y-2 p-3 md:space-y-3 md:p-6">
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-sm font-serif font-black leading-tight text-bakery-chocolate transition-colors group-hover:text-bakery-rose md:line-clamp-1 md:text-xl">
            {product.name}
          </h3>
          <p className="text-[9px] font-black uppercase tracking-widest text-bakery-chocolate/30 md:text-[10px]">
            {product.category || "Premium Ritual"}
          </p>
        </div>
        
        <p className="line-clamp-2 text-xs font-medium leading-relaxed text-bakery-chocolate/50 md:text-sm">
          {product.description || "Experience the ritual of pure indulgence with our artisanal baked creations."}
        </p>
        
        <div className="mt-auto pt-3 md:pt-6">
          <button 
            onClick={handleAddToCart}
            className="btn-premium flex w-full items-center justify-center space-x-2 px-3 py-2 text-[10px] shadow-sm transition-all group-hover:shadow-lg md:py-3 md:text-xs"
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
