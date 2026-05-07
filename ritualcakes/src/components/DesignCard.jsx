import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaExpandAlt } from "react-icons/fa";

const DesignCard = ({ designnames, designKey }) => {
  if (!designnames || !designnames[designKey]) {
    return <div className="text-center text-bakery-rose/40 py-8 bg-bakery-cream rounded-3xl">Design Loading...</div>;
  }
  
  const designImage = designnames[designKey];
  // Format display name: remove prefixes and underscores, capitalize
  const displayName = designKey
    .replace(/^theme_.*?_design_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/design/${designKey}`);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group relative bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-premium transition-all duration-500 cursor-pointer border border-bakery-pink/10"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={designImage}
          alt={`Cake design ${displayName}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-bakery-chocolate/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Zoom Icon */}
        <div className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-bakery-rose opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <FaExpandAlt size={14} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black text-bakery-chocolate/60 group-hover:text-bakery-rose transition-colors duration-300 truncate pr-2">
            {displayName}
          </h3>
          <div className="w-1.5 h-1.5 bg-bakery-pink rounded-full group-hover:bg-bakery-rose transition-colors shrink-0" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-bakery-chocolate/20 mt-1">Design Concept</p>
      </div>
    </motion.div>
  );
};

export default DesignCard;
