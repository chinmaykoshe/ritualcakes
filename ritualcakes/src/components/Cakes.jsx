import React, { useState, useEffect } from "react";
import { elements } from "../assets/assets"; 
import Card from "./Card"; 
import { motion, AnimatePresence } from "framer-motion";
import { FaFilter, FaSortAmountDown } from "react-icons/fa";

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
    <div className="min-h-screen bg-bakery-cream/20 pt-10 pb-32">
      <div className="container mx-auto px-8 lg:px-16 xl:px-24">
        {/* Header Section - Airy & Centered */}
        <header className="mb-20 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-5 py-2 bg-bakery-rose/10 text-bakery-rose rounded-full font-black text-xs uppercase tracking-[0.2em]"
          >
            The Collection
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-serif font-black text-bakery-chocolate leading-tight"
          >
            Sweets for Every <span className="text-bakery-rose italic font-medium">Ritual</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-bakery-chocolate/50 max-w-2xl mx-auto font-medium"
          >
            Handcrafted with precision and passion. Explore our artisanal range of cakes designed to elevate your special moments.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Sidebar Filters - Clearly Defined */}
          <aside className="lg:col-span-3 space-y-12">
            <div className="space-y-8">
              <div className="flex items-center space-x-3 text-bakery-chocolate">
                <FaFilter className="text-bakery-rose" />
                <h3 className="text-xl font-serif font-black uppercase tracking-tight">Categories</h3>
              </div>
              <div className="flex flex-wrap lg:flex-col gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setActiveCategory(category);
                      setVisibleCount(8);
                    }}
                    className={`text-left px-6 py-3 rounded-2xl transition-all text-sm font-bold border-2 ${
                      activeCategory === category
                        ? "bg-bakery-chocolate border-bakery-chocolate text-white shadow-xl translate-x-2"
                        : "bg-white border-bakery-pink/20 text-bakery-chocolate/60 hover:border-bakery-rose/30 hover:text-bakery-chocolate"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-3 text-bakery-chocolate">
                <FaSortAmountDown className="text-bakery-rose" />
                <h3 className="text-xl font-serif font-black uppercase tracking-tight">Sort By</h3>
              </div>
              <div className="relative group">
                <select
                  id="sortOrder"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full bg-white border-2 border-bakery-pink/20 rounded-2xl px-6 py-4 focus:outline-none focus:border-bakery-rose/50 transition-colors text-sm font-bold appearance-none shadow-sm cursor-pointer"
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
            <div className="card-premium p-8 bg-bakery-rose text-white space-y-4">
              <h4 className="font-serif font-black text-xl">Special Event?</h4>
              <p className="text-xs font-medium opacity-80 leading-relaxed">Let's create something unique. Our custom order requests are currently open.</p>
              <button className="w-full py-3 bg-white text-bakery-rose rounded-xl font-black text-xs uppercase tracking-widest hover:bg-bakery-cream transition-colors">Start Request</button>
            </div>
          </aside>

          {/* Product Grid - Spacious & Organized */}
          <main className="lg:col-span-9">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6 bg-white/40 p-6 rounded-3xl backdrop-blur-sm border border-white/20 shadow-sm">
              <span className="text-xs font-black text-bakery-chocolate/40 uppercase tracking-widest">
                Showing {Math.min(visibleCount, sortedCakes.length)} of {sortedCakes.length} creations
              </span>
              <div className="h-1 w-24 bg-bakery-pink/30 rounded-full hidden sm:block" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeCategory + sortOrder}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10"
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
                className="text-center py-32 bg-white rounded-[40px] shadow-premium border border-dashed border-bakery-pink/50"
              >
                <div className="text-bakery-pink text-6xl mb-6">🍰</div>
                <p className="text-bakery-chocolate/40 font-serif text-2xl italic">No cakes found in this category.</p>
                <button onClick={() => setActiveCategory("All Products")} className="mt-8 text-bakery-rose font-black text-xs uppercase tracking-widest hover:underline">Reset Selection</button>
              </motion.div>
            )}

            {sortedCakes.length > visibleCount && (
              <div className="mt-20 text-center">
                <button
                  onClick={handleToggleVisibility}
                  className="btn-premium px-16 py-5 text-lg shadow-xl active:scale-95 transition-transform"
                >
                  Load More Masterpieces
                </button>
              </div>
            )}
            
            {visibleCount >= sortedCakes.length && sortedCakes.length > 8 && (
              <div className="mt-20 text-center">
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
