import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { elements } from '../assets/assets'; 
import { motion } from 'framer-motion';
import { FaChevronRight, FaBookOpen, FaFilter } from 'react-icons/fa';

const Catalogue = () => {
  const categories = Object.keys(elements).filter(cat => Array.isArray(elements[cat]));
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const scrollToSection = (category) => {
    setActiveCategory(category);
    const element = document.getElementById(category);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-bakery-pista-light/30 pt-10 pb-20">
      <div className="container mx-auto px-8 lg:px-16 xl:px-24">
        {/* Header */}
        <header className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-6 py-2 bg-bakery-pista-light/60 text-bakery-pista-deep rounded-full font-black text-xs uppercase tracking-[0.2em] border border-bakery-pista/20"
          >
            Digital Catalogue
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-serif font-black text-bakery-chocolate leading-tight"
          >
            Our Complete <span className="text-bakery-pista-deep italic font-medium">Menu</span>
          </motion.h1>
          <p className="text-lg text-bakery-chocolate/50 max-w-2xl mx-auto font-medium">
            Explore our extensive range of ritual cakes and treats. A comprehensive guide to all our sweet creations.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3 lg:sticky lg:top-32 space-y-8 order-2 lg:order-1">
            <div className="card-premium p-8 bg-white space-y-6">
              <div className="flex items-center space-x-3 text-bakery-chocolate">
                <FaBookOpen className="text-bakery-pista-deep" />
                <h3 className="text-xl font-serif font-black uppercase tracking-tight">Index</h3>
              </div>
              
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => scrollToSection(category)}
                    className={`w-full text-left px-5 py-3 rounded-xl transition-all text-sm font-bold border-2 ${
                      activeCategory === category
                        ? 'border-bakery-pista-deep bg-bakery-pista-deep text-white shadow-lg' 
                        : 'border-bakery-pista/40 hover:border-bakery-pista-mid/50 text-bakery-chocolate hover:bg-bakery-pista-light'
                    }`}
                  >
                    {category.replace(/([A-Z])/g, ' $1')}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-premium p-8 bg-bakery-pista-deep text-white text-center space-y-4">
              <p className="text-xs font-black uppercase tracking-widest opacity-80">Can't decide?</p>
              <button onClick={() => navigate('/cakes')} className="w-full py-3 bg-white text-bakery-pista-deep rounded-xl font-black text-xs uppercase tracking-widest hover:bg-bakery-pista-light transition-colors">Visual Gallery</button>
            </div>
          </aside>

          {/* Main List */}
          <main className="lg:col-span-9 space-y-24 order-1 lg:order-2">
            {categories.map((category) => (
              <section key={category} id={category} className="space-y-10">
                <div className="flex items-center space-x-6">
                  <h2 className="text-4xl font-serif font-black text-bakery-chocolate">
                    {category.replace(/([A-Z])/g, ' $1')}
                  </h2>
                  <div className="flex space-x-12 border-b border-bakery-pista/30 mb-12" />
                  <span className="text-xs font-black text-bakery-pista-deep uppercase tracking-widest">{elements[category].length} Items</span>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {elements[category].map((item) => (
                    <motion.div
                      key={item.orderID}
                      whileHover={{ scale: 1.01, x: 10 }}
                      onClick={() => navigate(`/product/${item.orderID}`)}
                      className="group p-8 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-bakery-pista-mid/30 cursor-pointer flex flex-col md:flex-row justify-between items-center gap-8"
                    >
                      <div className="flex items-center space-x-8 flex-1">
                        <div className="w-20 h-20 bg-bakery-cream rounded-2xl overflow-hidden shrink-0 shadow-sm">
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-serif font-black text-bakery-chocolate group-hover:text-bakery-pista-deep transition-colors">{item.name}</h3>
                          <p className="text-sm text-bakery-chocolate/40 font-medium line-clamp-1">{item.description || "Artisanal ritual creation."}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-12">
                        <div className="text-right whitespace-nowrap">
                          {item.prices["500g"] && (
                            <p className="text-lg font-black text-bakery-chocolate">₹{item.prices["500g"]} <span className="text-[10px] text-bakery-chocolate/30 uppercase tracking-widest">/ 0.5kg</span></p>
                          )}
                          {item.prices["1kg"] && (
                            <p className="text-sm font-bold text-bakery-rose opacity-60">₹{item.prices["1kg"]} <span className="text-[10px] uppercase tracking-widest">/ 1kg</span></p>
                          )}
                        </div>
                        <div className="w-10 h-10 bg-bakery-pista-light rounded-full flex items-center justify-center text-bakery-pista-deep group-hover:bg-bakery-pista-deep group-hover:text-white transition-all shadow-inner">
                          <FaChevronRight size={12} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Catalogue;
