import React, { useState, useEffect } from "react";
import { elements } from "../assets/assets"; 
import Card from "./Card"; 
import { motion, AnimatePresence } from "framer-motion";
import { FaFilter, FaSortAmountDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const categoryMapping = {
  "All Products": "all",
  "Ritual's specials": "RitualsSpecials",
  "Extras(specials)": "ExtrasSpecial",
  "Chocolate": "ChocolateCakes",
  "Truffle": "Truffle",
  "Brownie Cakes": "Brownie",
  "More...": "OnlyFlavoured",
  "Real Fruits": "RealFruits",
  "Cheese Cakes": "CheeseCakes",
  "Extra Products": "ExtraProducts",
};

const CakesPage = () => {
  const navigate = useNavigate();
  const categories = Object.keys(categoryMapping);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [sortOrder, setSortOrder] = useState("recommended");
  const [visibleCount, setVisibleCount] = useState(8); 

  const filteredCakes =
    activeCategory === "All Products"
      ? Object.values(elements).flat()
      : elements[categoryMapping[activeCategory]] || [];

  const sortedCakes = [...filteredCakes]
    .filter((cake) => {
      if (activeCategory === "Extra Products") {
        return cake.prices && Object.values(cake.prices).some((price) => price > 0);
      }
      return cake.prices && cake.prices["500g"];
    })
    .sort((a, b) => {
      let priceA = 0;
      let priceB = 0;
      if (activeCategory === "Extra Products") {
        priceA = Object.values(a.prices)[0] || 0;
        priceB = Object.values(b.prices)[0] || 0;
      } else {
        priceA = a.prices["500g"] || 0;
        priceB = b.prices["500g"] || 0;
      }
      if (sortOrder === "lowToHigh") return priceA - priceB;
      if (sortOrder === "highToLow") return priceB - priceA;
      return 0;
    });

  const handleToggleVisibility = () => {
    const increment = 8; 
    if (visibleCount < sortedCakes.length) {
      setVisibleCount((prevCount) => Math.min(prevCount + increment, sortedCakes.length));
    } else {
      setVisibleCount(8); 
    }
  };

  return (
    <div className="min-h-screen bg-bakery-pista-light/30 pt-6 pb-20 md:pt-10 md:pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
        {/* Header Section - Airy & Centered */}
        <header className="mb-10 space-y-4 text-center md:mb-16 md:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block rounded-full bg-bakery-pista-light/60 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-bakery-pista-deep md:px-5 md:text-xs border border-bakery-pista/20"
          >
            The Collection
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-serif font-black leading-tight text-bakery-chocolate sm:text-4xl lg:text-6xl"
          >
            Sweets for Every <span className="text-bakery-rose italic font-medium">Ritual</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-sm font-medium leading-relaxed text-bakery-chocolate/50 md:text-base"
          >
            Handcrafted with precision and passion. Explore our artisanal range of cakes designed to elevate your special moments.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16 items-start">
          {/* Sidebar Filters - Clearly Defined */}
          <aside className="space-y-8 lg:col-span-3 lg:space-y-12">
            <div className="space-y-5 md:space-y-8">
              <div className="flex items-center space-x-3 text-bakery-chocolate">
                <FaFilter className="text-bakery-pista-deep" />
                <h3 className="text-base font-serif font-black uppercase tracking-tight md:text-xl">Categories</h3>
              </div>
              <div className="flex flex-wrap lg:flex-col gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setActiveCategory(category);
                      setVisibleCount(8);
                    }}
                    className={`rounded-xl border-2 px-4 py-2.5 text-left text-xs font-bold transition-all md:rounded-2xl md:px-6 md:py-3 md:text-sm ${
                      activeCategory === category
                        ? "bg-bakery-chocolate border-bakery-chocolate text-white shadow-xl lg:translate-x-2"
                        : "bg-white border-bakery-pista/20 text-bakery-chocolate/60 hover:border-bakery-pista-mid/40 hover:text-bakery-chocolate"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5 md:space-y-6">
              <div className="flex items-center space-x-3 text-bakery-chocolate">
                <FaSortAmountDown className="text-bakery-pista-deep" />
                <h3 className="text-base font-serif font-black uppercase tracking-tight md:text-xl">Sort By</h3>
              </div>
              <div className="relative group">
                <select
                  id="sortOrder"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-xl border-2 border-bakery-pista/20 bg-white px-4 py-3 text-xs font-bold shadow-sm transition-colors focus:border-bakery-pista-mid/50 focus:outline-none md:rounded-2xl md:px-6 md:py-4 md:text-sm"
                >
                  <option value="recommended">Recommended</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                  <FaSortAmountDown />
                </div>
              </div>
            </div>
            
            {/* Sidebar Promo */}
            <div className="card-premium p-5 bg-bakery-pista-deep text-white space-y-4 md:p-8">
              <h4 className="font-serif font-black text-lg md:text-xl">Special Event?</h4>
              <p className="text-xs font-medium opacity-80 leading-relaxed">Let's create something unique. Our custom order requests are currently open.</p>
              <button 
                onClick={() => navigate('/customization')}
                className="w-full py-3 bg-white text-bakery-pista-deep rounded-xl font-black text-xs uppercase tracking-widest hover:bg-bakery-pista-light transition-colors"
              >
                Start Request
              </button>
            </div>
          </aside>

          {/* Product Grid - Spacious & Organized */}
          <main className="lg:col-span-9">
            <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/20 bg-white/40 p-4 shadow-sm backdrop-blur-sm sm:flex-row md:mb-12 md:gap-6 md:p-6">
              <span className="text-xs font-black text-bakery-chocolate/40 uppercase tracking-widest">
                Showing {Math.min(visibleCount, sortedCakes.length)} of {sortedCakes.length} creations
              </span>
              <div className="h-1 w-24 bg-bakery-pista/40 rounded-full hidden sm:block" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeCategory + sortOrder}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:gap-8"
              >
                {sortedCakes.slice(0, visibleCount).map((cake) => (
                  <Card key={cake.orderID} orderID={cake.orderID} />
                ))}
              </motion.div>
            </AnimatePresence>

            {sortedCakes.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border border-dashed border-bakery-pista/50 bg-white py-20 text-center shadow-premium md:py-32"
              >
                <div className="text-bakery-pista-mid text-6xl mb-6">🍰</div>
                <p className="text-xl font-serif italic text-bakery-chocolate/40 md:text-2xl">No cakes found in this category.</p>
                <button onClick={() => setActiveCategory("All Products")} className="mt-8 text-bakery-pista-deep font-black text-xs uppercase tracking-widest hover:underline">Reset Selection</button>
              </motion.div>
            )}

            {sortedCakes.length > visibleCount && (
              <div className="mt-12 text-center md:mt-20">
                <button
                  onClick={handleToggleVisibility}
                  className="btn-premium px-8 py-3 text-sm shadow-xl transition-transform active:scale-95 md:px-16 md:py-5 md:text-base"
                >
                  Load More Masterpieces
                </button>
              </div>
            )}
            
            {visibleCount >= sortedCakes.length && sortedCakes.length > 8 && (
              <div className="mt-12 text-center md:mt-20">
                <button
                  onClick={() => setVisibleCount(8)}
                  className="btn-outline px-12 py-4"
                >
                  Show Less
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CakesPage;
