import React, { useState } from "react";
import DesignCard from "./DesignCard";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const ThemeSection = ({ title, categoryPrefix, designnames, handleZoomIn }) => {
  if (!designnames || typeof designnames !== 'object') {
    return <div className="text-bakery-chocolate/40 italic">Inspiration loading...</div>;
  }
  
  const filteredDesignKeys = Object.keys(designnames).filter((key) =>
    key.startsWith(categoryPrefix)
  );

  const [visibleDesignsCount, setVisibleDesignsCount] = useState(4);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLoadMore = (e) => {
    e.stopPropagation();
    if (isExpanded) {
      setVisibleDesignsCount(4);
    } else {
      setVisibleDesignsCount(filteredDesignKeys.length);
    }
    setIsExpanded((prev) => !prev); 
  };

  if (filteredDesignKeys.length === 0) return null;

  return (
    <section className="space-y-10"> 
      <div className="flex items-center space-x-6">
        <h2 className="text-3xl font-serif font-black text-bakery-chocolate truncate">{title}</h2>
        <div className="h-px flex-1 bg-bakery-pink/30" />
        <span className="text-[10px] font-black text-bakery-rose uppercase tracking-[0.2em]">{filteredDesignKeys.length} Designs</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredDesignKeys.slice(0, visibleDesignsCount).map((designKey, i) => (
          <motion.div
            key={designKey}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <DesignCard
              designnames={designnames}
              designKey={designKey}
              handleZoomIn={handleZoomIn}
            />
          </motion.div>
        ))}
      </div>

      {filteredDesignKeys.length > 4 && (
        <div className="mt-8 text-center">
          <button
            className="btn-outline px-10 py-3 text-xs flex items-center justify-center gap-2 mx-auto"
            onClick={handleLoadMore}
          >
            {isExpanded ? (
              <><span>Show Less</span> <FaChevronUp /></>
            ) : (
              <><span>Discover More</span> <FaChevronDown /></>
            )}
          </button>
        </div>
      )}
    </section>
  );
};

export default ThemeSection;
