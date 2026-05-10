import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaMagic, FaAward, FaQuoteLeft, FaStar } from 'react-icons/fa';

function About() {
  const reviews = [
    { id: 1, name: "John Thakur", text: "Ritual Cakes turned my vision into a masterpiece. The attention to detail is unmatched." },
    { id: 2, name: "Jane Mhate", text: "The most delicious cupcakes I've ever had. You can taste the quality in every bite." },
    { id: 3, name: "Emily Patil", text: "Amazing service and even better taste. They really care about their craft." }
  ];

  const values = [
    { icon: <FaHeart />, title: "Baked with Love", desc: "Every cake is a labor of love, crafted with passion and precision." },
    { icon: <FaMagic />, title: "Artistic Magic", desc: "We turn your sweetest dreams into edible works of art." },
    { icon: <FaAward />, title: "Premium Quality", desc: "Only the finest ingredients make it into our sacred ovens." },
  ];

  return (
    <div className="min-h-screen bg-bakery-pista-light/30 pt-10 pb-32">
      <div className="container mx-auto px-8 lg:px-16 xl:px-24">
        {/* Hero Section - Centered & Airy */}
        <header className="text-center mb-32 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-6 py-2 bg-bakery-pista-light/60 text-bakery-pista-deep rounded-full font-black text-xs uppercase tracking-[0.2em] border border-bakery-pista/20"
          >
            Our Sweet Story
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl lg:text-8xl font-serif font-black text-bakery-chocolate leading-tight"
          >
            Baked with <span className="text-bakery-rose italic font-medium">Passion</span>,<br />
            Served with <span className="text-bakery-rose italic font-medium">Love</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-bakery-chocolate/50 max-w-2xl mx-auto font-medium"
          >
            From our humble beginnings to becoming a destination for cake lovers, our journey has been defined by one thing: the ritual of excellence.
          </motion.p>
        </header>

        {/* Story Section - Modern Split */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-40">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <span className="text-bakery-pista-deep font-black text-xs uppercase tracking-widest">Philosophy</span>
              <h2 className="text-5xl font-serif font-black text-bakery-chocolate">The Ritual of Baking</h2>
            </div>
            <p className="text-2xl text-bakery-chocolate/70 leading-relaxed italic font-serif">
              "At Ritual Cakes, we believe that baking is more than just a process—it's a celebration of life's most precious moments."
            </p>
            <p className="text-lg text-bakery-chocolate/60 leading-relaxed font-medium">
              Founded in 2024 in the heart of Dronagiri, our journey began with a simple mission: to create cakes that don't just look stunning, but taste like a piece of heaven. Every sponge we bake, every swirl of frosting we pipe, and every sprinkle we add is part of our ritual of excellence.
            </p>
            <div className="flex space-x-12 pt-4">
              <div className="space-y-1">
                <div className="text-4xl font-black text-bakery-pista-deep">500+</div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Cakes Baked</div>
              </div>
              <div className="w-px h-12 bg-bakery-pista/30" />
              <div className="space-y-1">
                <div className="text-4xl font-black text-bakery-pista-deep">1k+</div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Happy Clients</div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-bakery-rose/5 rounded-[80px] -rotate-3" />
            <div className="absolute inset-0 bg-bakery-chocolate/5 rounded-[60px] translate-x-4 translate-y-4" />
            <img 
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000" 
              alt="Our Craft" 
              className="relative z-10 rounded-[60px] shadow-premium w-full h-[600px] object-cover" 
            />
          </motion.div>
        </section>

        {/* Values Section - Clear 3-Column Grid */}
        <section className="py-32 bg-white rounded-[80px] shadow-premium mb-40 border border-bakery-pink/10">
          <div className="container mx-auto px-12 lg:px-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
              {values.map((v, i) => (
                <div key={i} className="text-center space-y-6 group">
                  <div className="w-24 h-24 bg-bakery-pista-light rounded-[32px] flex items-center justify-center mx-auto text-bakery-pista-deep text-4xl shadow-sm group-hover:bg-bakery-pista-deep group-hover:text-white transition-all duration-500 group-hover:-translate-y-2">
                    {v.icon}
                  </div>
                  <h3 className="text-2xl font-serif font-black text-bakery-chocolate">{v.title}</h3>
                  <p className="text-bakery-chocolate/50 leading-relaxed font-medium">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder Section - Artistic Split */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-40 px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 relative"
          >
            <div className="absolute -inset-10 bg-bakery-cream rounded-full blur-3xl opacity-50" />
            <img 
              src="https://images.unsplash.com/photo-1556910110-ad52841ad02f?auto=format&fit=crop&q=80&w=1000" 
              alt="Our Founder" 
              className="relative z-10 rounded-[100px] shadow-premium w-full h-[700px] object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700" 
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 space-y-12"
          >
            <div className="space-y-6">
              <span className="text-bakery-pista-deep font-black text-xs uppercase tracking-widest">Leadership</span>
              <h2 className="text-5xl font-serif font-black text-bakery-chocolate">Meet the Heart Behind the Oven</h2>
            </div>
            <p className="text-2xl text-bakery-chocolate/70 leading-relaxed italic border-l-8 border-bakery-pista-deep pl-8 font-serif">
              "We don't just sell cakes; we share joy. Seeing the smile on a client's face when they see their dream cake is why we do what we do."
            </p>
            <p className="text-lg text-bakery-chocolate/60 leading-relaxed font-medium">
              Our team consists of passionate artisans who treat every order as a masterpiece. From custom wedding cakes to your daily afternoon treat, we apply the same level of care and artistic integrity to everything that leaves our kitchen.
            </p>
            <div className="pt-6">
              <h4 className="text-2xl font-serif font-black text-bakery-chocolate">Jyoti Joshi</h4>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-bakery-pista-deep">Founder & Lead Artisan</span>
            </div>
          </motion.div>
        </section>

        {/* Client Love - Clear Grid */}
        <section className="py-24">
          <div className="text-center mb-24 space-y-6">
            <span className="text-bakery-pista-deep font-black text-xs uppercase tracking-widest">Feedback</span>
            <h2 className="text-5xl lg:text-6xl font-serif font-black text-bakery-chocolate">Client Love</h2>
            <div className="flex justify-center text-bakery-pista-deep space-x-1.5 text-xl">
              {[...Array(5)].map((_, i) => <FaStar key={i} />)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {reviews.map((r, i) => (
              <motion.div 
                key={r.id}
                whileHover={{ y: -12 }}
                className="card-premium p-10 space-y-8 bg-white border border-bakery-pink/20"
              >
                <FaQuoteLeft className="text-5xl text-bakery-rose/10" />
                <p className="text-xl italic text-bakery-chocolate/70 leading-relaxed font-medium">"{r.text}"</p>
                <div className="flex items-center space-x-5 pt-8 border-t border-bakery-pista/20">
                  <div className="w-14 h-14 bg-bakery-pista-deep rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-bakery-chocolate text-lg">{r.name}</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-bakery-pista-deep/60">Verified Client</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
