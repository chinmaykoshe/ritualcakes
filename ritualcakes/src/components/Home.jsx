import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import Card from './Card';
import DesignCard from './DesignCard';
import { designnames } from '../designs/designassets';
import { motion } from 'framer-motion';
import { FaUtensils, FaTruck, FaBirthdayCake, FaQuoteLeft, FaStar, FaMapMarkerAlt, FaPhone, FaChevronRight } from 'react-icons/fa';

function Home() {
  const navigate = useNavigate();
  const [randomDesigns, setRandomDesigns] = useState([]);

  useEffect(() => {
    if (!designnames || typeof designnames !== 'object') return;
    const designKeys = Object.keys(designnames);
    setRandomDesigns(designKeys.sort(() => Math.random() - 0.5).slice(0, 4));
  }, []);

  const reviews = [
    { id: 1, name: 'Aarti K.', text: 'The cakes are absolutely divine! The blueberry cheesecake is my favorite.', rating: 5 },
    { id: 2, name: 'Swapnil P.', text: 'Ordered a custom cake for my daughter\'s birthday. It was perfect in every way.', rating: 5 },
    { id: 3, name: 'Meenal S.', text: 'Fast delivery and the freshest cakes in town. Ritual Cakes is my go-to!', rating: 5 },
  ];

  const features = [
    { icon: <FaUtensils />, title: 'Custom Creations', desc: 'Handcrafted with love and your unique vision.' },
    { icon: <FaBirthdayCake />, title: 'Freshly Baked', desc: 'From our oven to your heart, every single day.' },
    { icon: <FaTruck />, title: 'Seamless Delivery', desc: 'Safe, fast, and reliable delivery to your doorstep.' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-bakery-cream/20">
      {/* Hero Section - Elegant & Spacious */}
      <section className="relative min-h-screen flex items-center overflow-hidden pb-20">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-bakery-pista/10 rounded-l-[200px] -z-10" />
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-bakery-pista/5 rounded-full blur-3xl -z-10" />
        
        <div className="container mx-auto px-8 lg:px-16 xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-10"
            >
              <div className="inline-flex items-center space-x-3 px-5 py-2 bg-white/80 backdrop-blur-sm border border-bakery-pista/30 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-bakery-pista-deep animate-pulse" />
                <span className="text-bakery-pista-deep font-black text-xs uppercase tracking-[0.2em]">The Ultimate Baking Ritual</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl xl:text-8xl font-serif font-black text-bakery-chocolate leading-[1.1]">
                Cakes That <br />
                <span className="text-bakery-rose italic font-medium">Make Every</span> <br />
                Moment Sweeter!
              </h1>
              
              <p className="text-xl text-bakery-chocolate/60 max-w-xl leading-relaxed font-medium">
                Experience the ritual of pure indulgence. Our artisanal cakes are crafted with the finest ingredients to celebrate your life's most precious moments.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                <button onClick={() => navigate('/cakes')} className="btn-premium px-12 py-5 text-lg group">
                  Explore Collection
                  <FaChevronRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => navigate('/customization')} className="btn-outline px-12 py-5 text-lg">
                  Custom Order
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="lg:col-span-5 relative"
            >
              <div className="relative z-10 w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-bakery-pista-deep/20 to-transparent rounded-full blur-2xl animate-pulse" />
                <img 
                  src={assets.blueberryCheesecake} 
                  alt="Signature Cake" 
                  className="w-full h-full object-cover drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] animate-float rounded-[60px]" 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Clear & Grid Balanced */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-8 lg:px-16 xl:px-24 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group space-y-6"
              >
                <div className="w-20 h-20 bg-bakery-pista-light rounded-3xl flex items-center justify-center mx-auto text-bakery-pista-deep text-3xl shadow-premium group-hover:bg-bakery-pista-deep group-hover:text-white transition-all duration-500 group-hover:-translate-y-2">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-serif font-black text-bakery-chocolate tracking-tight">{f.title}</h3>
                <p className="text-bakery-chocolate/50 leading-relaxed max-w-xs mx-auto font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specials Section - High Ratio Grid */}
      <section className="py-32 bg-bakery-cream/30">
        <div className="container mx-auto px-8 lg:px-16 xl:px-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-6 max-w-2xl">
              <span className="text-bakery-pista-deep font-black text-xs uppercase tracking-widest">Our Selection</span>
              <h2 className="text-5xl lg:text-6xl font-serif font-black text-bakery-chocolate">Discover Our Specials</h2>
              <p className="text-lg text-bakery-chocolate/60 font-medium">A curated selection of our most loved ritual cakes, baked fresh every morning.</p>
            </div>
            <button onClick={() => navigate('/cakes')} className="btn-outline px-10 py-4">View All Cakes</button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {["rituals5", "rituals6", "rituals1", "rituals10"].map((id, i) => (
              <motion.div
                key={id}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 40 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Card orderID={id} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Form CTA - Clear Split Layout */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-8 lg:px-16 xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="space-y-6">
                <span className="text-bakery-pista-deep font-black text-xs uppercase tracking-widest">Bespoke Rituals</span>
                <h2 className="text-5xl lg:text-6xl font-serif font-black text-bakery-chocolate leading-tight">Your Dream Cake, <br /> Our Artistry</h2>
                <p className="text-lg text-bakery-chocolate/60 font-medium leading-relaxed">
                  Can't find exactly what you're looking for? Let's build it together. Choose your flavor, theme, and size, and we'll bring your vision to life.
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  { n: 1, t: "Pick Your Base Flavor" },
                  { n: 2, t: "Choose Your Theme & Decor" },
                  { n: 3, t: "Set the Date for Delivery" }
                ].map((item) => (
                  <div key={item.n} className="flex items-center space-x-5 p-5 bg-bakery-pista-light/30 rounded-[24px] border border-bakery-pista/10 hover:border-bakery-pista-mid/30 transition-colors">
                    <div className="w-10 h-10 bg-bakery-pista-deep text-white rounded-full flex items-center justify-center font-black text-sm shadow-lg">{item.n}</div>
                    <span className="font-bold text-bakery-chocolate">{item.t}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/customization')} className="btn-premium px-12 py-5 text-lg">Start Customizing →</button>
            </motion.div>

            <div className="grid grid-cols-2 gap-6 lg:gap-8">
              {randomDesigns.map((designKey, i) => (
                <motion.div 
                  key={designKey}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={i % 2 === 1 ? 'mt-12' : ''}
                >
                  <DesignCard designnames={designnames} designKey={designKey} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - Atmospheric Glass Section */}
      <section className="py-40 relative overflow-hidden bg-bakery-chocolate text-bakery-cream">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] bg-repeat" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-bakery-pista-deep/10 rounded-full blur-[120px] -z-0" />
        
        <div className="container mx-auto px-8 lg:px-16 xl:px-24 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto space-y-12"
          >
            <h2 className="text-5xl lg:text-7xl font-serif font-black italic tracking-tight">How We Bake</h2>
            <div className="glass border-none p-12 md:p-20 rounded-[60px] shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
              <FaQuoteLeft className="text-8xl text-bakery-pista/10 absolute top-10 left-10" />
              
              <p className="text-2xl md:text-4xl font-serif leading-snug italic opacity-90 relative z-10">
                "Every Ritual Cake is made with fresh, carefully chosen ingredients and a genuine love for baking. 
                From selecting premium cocoa to the final delicate brush of gold, we use precision and care at every stage."
              </p>
              
              <div className="mt-16 pt-16 border-t border-white/10 grid grid-cols-3 gap-8 relative z-10">
                {[
                  { v: "100%", t: "Natural" },
                  { v: "Daily", t: "Fresh" },
                  { v: "Hand", t: "Crafted" }
                ].map((stat) => (
                  <div key={stat.t} className="space-y-2">
                    <div className="text-4xl md:text-6xl font-black text-bakery-pista-deep">{stat.v}</div>
                    <div className="text-xs font-black uppercase tracking-[0.3em] opacity-40">{stat.t}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials - Clear 3-Column Grid */}
      <section className="py-32 bg-bakery-cream/20">
        <div className="container mx-auto px-8 lg:px-16 xl:px-24">
          <div className="text-center mb-24 space-y-6">
            <span className="text-bakery-pista-deep font-black text-xs uppercase tracking-widest">Testimonials</span>
            <h2 className="text-5xl lg:text-6xl font-serif font-black text-bakery-chocolate">Words From Our Clients</h2>
            <div className="flex justify-center text-bakery-pista-deep space-x-1.5 text-xl">
              {[...Array(5)].map((_, i) => <FaStar key={i} />)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {reviews.map((r, i) => (
              <motion.div 
                key={r.id}
                whileHover={{ y: -12 }}
                className="card-premium p-10 space-y-8 bg-white border border-bakery-pista/20"
              >
                <p className="text-xl italic text-bakery-chocolate/70 leading-relaxed font-medium">"{r.text}"</p>
                <div className="flex items-center space-x-5 pt-8 border-t border-bakery-pista/20">
                  <div className="w-14 h-14 bg-bakery-pista-deep rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-bakery-chocolate text-lg">{r.name}</h4>
                    <span className="text-xs font-black uppercase tracking-widest text-bakery-pista-deep/60">Verified Order</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map & Contact - Modern Split Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-8 lg:px-16 xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 items-center">
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <span className="text-bakery-pista-deep font-black text-xs uppercase tracking-widest">Location</span>
                <h2 className="text-5xl lg:text-6xl font-serif font-black text-bakery-chocolate">Visit Our Shop</h2>
                <p className="text-xl text-bakery-chocolate/60 font-medium leading-relaxed">
                  Visit our cozy shop in the heart of Dronagiri. Experience the aroma of freshly baked magic and pick up your favorite treats.
                </p>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-6 group">
                  <div className="w-12 h-12 bg-bakery-pista-light rounded-2xl flex items-center justify-center text-bakery-pista-deep text-xl shadow-sm group-hover:bg-bakery-pista-deep group-hover:text-white transition-all">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h4 className="font-black text-bakery-chocolate uppercase text-xs tracking-widest mb-1">Our Address</h4>
                    <p className="text-bakery-chocolate/60 font-bold">Shop no.:1, Uma Imperial, Dronagiri Sec.:48</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6 group">
                  <div className="w-12 h-12 bg-bakery-pista-light rounded-2xl flex items-center justify-center text-bakery-pista-deep text-xl shadow-sm group-hover:bg-bakery-pista-deep group-hover:text-white transition-all">
                    <FaPhone />
                  </div>
                  <div>
                    <h4 className="font-black text-bakery-chocolate uppercase text-xs tracking-widest mb-1">Call Us</h4>
                    <p className="text-bakery-chocolate/60 font-bold">+91 81692 96802</p>
                  </div>
                </div>
              </div>
              
              <button className="btn-premium px-12 py-5 text-lg">Get Directions</button>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-7 h-[600px] rounded-[60px] overflow-hidden shadow-premium border-8 border-white"
            >
              <iframe
                title="Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3775.2711623626733!2d72.9600834!3d18.8750479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7dbac33768917%3A0xdcaf157aff2365c!2sRitual%20Cakes!5e0!3m2!1sen!2sin!4v1737397597102!5m2!1sen!2sin"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;