import React, { useState } from 'react';
import { designnames } from '../../designs/designassets';
import { FaSearch, FaImage } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function Products() {
  const designs = Object.entries(designnames); 
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredDesigns = designs.filter(([name]) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-8 bg-white/50 min-h-screen rounded-[3rem]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div>
          <h2 className="text-3xl font-serif font-black text-bakery-chocolate tracking-tight">Design Catalog</h2>
          <p className="text-gray-400 font-medium">Browse the library of available cake designs and patterns.</p>
        </div>
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
          <input 
            type="text" 
            placeholder="Search designs..." 
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-bakery-rose/20 text-sm font-bold transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <AnimatePresence mode='popLayout'>
          {filteredDesigns.map(([name, image], idx) => (
            <motion.div 
              layout
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.01 }}
              className="group bg-white p-3 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer border border-transparent hover:border-bakery-rose/10"
            >
              <div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-4 bg-gray-50">
                <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-bakery-chocolate/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="bg-white/90 backdrop-blur-md p-3 rounded-full text-bakery-rose shadow-lg">
                      <FaImage size={20} />
                   </div>
                </div>
              </div>
              <div className="px-2 pb-2">
                <h4 className="font-bold text-bakery-chocolate text-xs truncate uppercase tracking-widest">{name}</h4>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredDesigns.length === 0 && (
        <div className="py-20 text-center text-gray-300">
           <FaSearch size={48} className="mx-auto mb-4 opacity-10" />
           <p className="font-serif italic text-lg">No designs found matching your search</p>
        </div>
      )}
    </div>
  );
}

export default Products;
