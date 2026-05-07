import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { designnames } from "../designs/designassets";
import ThemeSection from "./ThemeSection"; 
import { motion } from "framer-motion";
import { FaInstagram, FaMagic, FaEye } from "react-icons/fa";

const Designs = () => {
  const navigate = useNavigate();
  const handleClickDesign = (designImages) => {
    navigate("/pagedesigns", { state: { designImages } });
  };

  return (
    <div className="min-h-screen bg-bakery-cream/20 pt-10 pb-32">
      <div className="container mx-auto px-8 lg:px-16 xl:px-24">
        {/* Header */}
        <header className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-6 py-2 bg-bakery-rose/10 text-bakery-rose rounded-full font-black text-xs uppercase tracking-[0.2em]"
          >
            Inspiration Gallery
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-serif font-black text-bakery-chocolate leading-tight"
          >
            A Gallery of <span className="text-bakery-rose italic font-medium">Ritual</span> Designs
          </motion.h1>
          <p className="text-lg text-bakery-chocolate/50 max-w-2xl mx-auto font-medium">
            Browse our curated collection of themed cakes. Use these designs as inspiration for your own custom ritual cake.
          </p>
        </header>

        {/* Hero Section */}
        <section className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center bg-white p-12 rounded-[60px] shadow-premium">
          <div className="relative group cursor-pointer" onClick={() => handleClickDesign(Object.values(designnames))}>
            <div className="absolute -inset-4 bg-bakery-rose/10 rounded-[40px] group-hover:bg-bakery-rose/20 transition-all duration-700" />
            <Carousel
              showThumbs={false}
              showStatus={false}
              showIndicators={true}
              infiniteLoop={true}
              autoPlay={true}
              interval={3000}
              className="relative z-10 rounded-[30px] overflow-hidden shadow-2xl"
            >
              {Object.values(designnames).slice(0, 10).map((img, index) => (
                <div key={index} className="h-[450px]">
                  <img
                    src={img}
                    alt={`Cake design ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </Carousel>
            <div className="absolute bottom-6 right-6 z-20 w-12 h-12 bg-white text-bakery-rose rounded-2xl flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all">
              <FaEye />
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-serif font-black text-bakery-chocolate">Explore Every Detail</h2>
              <p className="text-bakery-chocolate/60 font-medium leading-relaxed">
                Our portfolio spans hundreds of unique designs. From elegant engagement themes to playful celebrations, find the spark for your next event.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => handleClickDesign(Object.values(designnames))}
                className="btn-premium py-4 flex items-center justify-center gap-2"
              >
                <FaMagic /> <span>View All Designs</span>
              </button>
              <NavLink
                to="https://www.instagram.com/ritualcakes"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline py-4 flex items-center justify-center gap-2"
              >
                <FaInstagram size={20} />
                <span>Instagram Live</span>
              </NavLink>
            </div>
            
            <p className="text-xs font-black uppercase tracking-widest text-bakery-chocolate/30">
              * Click the gallery to view in full screen mode
            </p>
          </div>
        </section>

        {/* Theme Sections */}
        <div className="space-y-32">
          {[
            { title: "Engagement Theme", prefix: "theme_engagement_design_" },
            { title: "Mom Theme", prefix: "theme_mom_design_" },
            { title: "Dad Theme", prefix: "theme_dad_design_" },
            { title: "Anniversary Theme", prefix: "theme_anniversary_design_" },
            { title: "Boy Theme", prefix: "theme_boy_design_" },
            { title: "Cute Cake Theme", prefix: "theme_cute_cake_design_" },
            { title: "Girl Theme", prefix: "theme_girl_design_" },
            { title: "Profession Theme", prefix: "theme_profession_design_" },
            { title: "Retirement Theme", prefix: "theme_retirement_design_" }
          ].map((theme, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <ThemeSection
                title={theme.title}
                categoryPrefix={theme.prefix}
                designnames={designnames}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Designs;
