import React from "react";
import { useLocation, Link } from "react-router-dom"; 
import { designnames } from "../designs/designassets";
import DesignCard from "./DesignCard";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

const FullThemeSection = ({ title, categoryPrefix, designnames }) => {
  const filteredDesignKeys = Object.keys(designnames).filter((key) =>
    key.startsWith(categoryPrefix)
  );
  
  return (
    <section className="space-y-12">
      <div className="flex items-center space-x-6">
        <h2 className="text-4xl font-serif font-black text-bakery-chocolate">{title}</h2>
        <div className="h-px flex-1 bg-bakery-pista/40" />
        <span className="text-xs font-black text-bakery-pista-deep uppercase tracking-widest">{filteredDesignKeys.length} Masterpieces</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {filteredDesignKeys.map((designKey, i) => (
          <motion.div
            key={designKey}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <DesignCard
              designnames={designnames}
              designKey={designKey}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

function PageDesigns() {
  return (
    <div className="min-h-screen bg-bakery-pista-light/30 pt-10 pb-32">
      <div className="container mx-auto px-8 lg:px-16 xl:px-24">
        <header className="mb-16 space-y-6">
          <Link
            to="/designs"
            className="inline-flex items-center space-x-2 text-bakery-chocolate/40 hover:text-bakery-pista-deep transition-colors font-black uppercase tracking-widest text-xs"
          >
            <FaArrowLeft /> <span>Back to Inspiration</span>
          </Link>
          <h1 className="text-5xl lg:text-7xl font-serif font-black text-bakery-chocolate">Collection <span className="text-bakery-rose italic font-medium">Archive</span></h1>
        </header>

        <section>
          <FullThemeSection
            title="Page Designs"
            categoryPrefix="page_design_"
            designnames={designnames}
          />
        </section>
      </div>
    </div>
  );
}

export default PageDesigns;