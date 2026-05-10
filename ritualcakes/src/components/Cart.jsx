import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft, FaCheckCircle } from "react-icons/fa";

import { elements, assets } from "../assets/assets";
import { designnames } from "../designs/designassets";

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [loadingItem, setLoadingItem] = useState(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const findProductImage = (item) => {
    if (item.image && (item.image.startsWith('http') || item.image.startsWith('blob') || item.image.startsWith('data'))) return item.image;
    if (item.img && (item.img.startsWith('http') || item.img.startsWith('blob') || item.img.startsWith('data'))) return item.img;
    
    // Look it up in our local assets by name or orderID
    for (const category of Object.values(elements)) {
      const found = category.find(p => p.orderID === item.orderID || p.name === item.name);
      if (found) return found.img;
    }
    
    // Additional check if it matches a design name
    if (item.image && designnames?.[item.image]) return designnames[item.image];
    if (item.img && designnames?.[item.img]) return designnames[item.img];

    return item.image || item.img || assets.fallbackImage; 
  };

  const calculateTotal = () => {
    return cart?.reduce((total, item) => total + item.price * item.quantity, 0) || 0;
  };

  const handleQuantityChange = async (orderId, action) => {
    setLoadingItem(orderId);
    try {
      const item = cart.find((item) => item.orderID === orderId);
      const newQuantity = action === "increment" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
      await updateQuantity(orderId, newQuantity);
    } finally {
      setLoadingItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-bakery-pista-light/30 pt-6 pb-20 md:pt-10 md:pb-32">
      <div className="container mx-auto w-full px-3 sm:px-6 lg:px-12 xl:px-20">
        {/* Header Section */}
        <header className="mb-6 space-y-3 md:mb-16 md:space-y-6">
          <Link to="/" className="inline-flex items-center space-x-2 text-bakery-chocolate/40 hover:text-bakery-pista-deep transition-colors font-black uppercase tracking-widest text-[10px] md:text-xs">
            <FaArrowLeft /> <span>Back to Bakery</span>
          </Link>
          <div className="flex items-center justify-between border-b border-bakery-pista/30 pb-4 md:pb-0 md:border-none">
            <h1 className="text-2xl font-serif font-black text-bakery-chocolate sm:text-4xl lg:text-6xl">Your <span className="text-bakery-rose italic font-medium">Cart</span></h1>
            <div className="hidden md:flex items-center space-x-3 text-bakery-chocolate/30 font-black text-xs uppercase tracking-widest">
              <span className="text-bakery-pista-deep">Cart</span>
              <span>•</span>
              <span>Details</span>
              <span>•</span>
              <span>Payment</span>
            </div>
          </div>
        </header>

        {cart?.length > 0 ? (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-16">
            {/* Cart Items List */}
            <div className="space-y-3 lg:col-span-8 md:space-y-8">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <motion.div
                    key={item.orderID}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="card-premium group flex flex-row items-center gap-3 border border-bakery-pista/20 bg-white p-3 transition-all hover:border-bakery-pista-mid/50 md:gap-10 md:p-8"
                  >
                    <div className="relative shrink-0">
                      <div className="absolute -inset-1 bg-bakery-pista/10 rounded-2xl group-hover:bg-bakery-pista/20 transition-colors md:-inset-2 md:rounded-3xl" />
                      <img
                        src={findProductImage(item)}
                        alt={item.name}
                        className="relative h-16 w-16 rounded-xl object-cover shadow-sm transition-transform duration-500 group-hover:scale-[1.02] md:h-40 md:w-40 md:rounded-2xl md:shadow-premium"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-2 text-left md:space-y-6">
                      <div className="space-y-1 md:space-y-2">
                        <h2 className="text-sm font-serif font-black leading-tight text-bakery-chocolate truncate md:text-2xl">{item.name}</h2>
                        <div className="flex flex-wrap gap-1 md:gap-3">
                          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest bg-bakery-pista-light/60 px-2 py-0.5 md:px-3 md:py-1.5 rounded-full text-bakery-pista-deep">{item.shape}</span>
                          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest bg-bakery-pista-light/60 px-2 py-0.5 md:px-3 md:py-1.5 rounded-full text-bakery-pista-deep">{item.weight}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-start md:space-x-8">
                        <div className="flex items-center bg-bakery-pista-light/40 rounded-xl md:rounded-2xl p-0.5 md:p-1 border border-bakery-pista/30">
                          <button
                            onClick={() => handleQuantityChange(item.orderID, "decrement")}
                            className="w-6 h-6 md:w-10 md:h-10 flex items-center justify-center text-bakery-chocolate/40 hover:text-bakery-pista-deep transition-colors disabled:opacity-20"
                            disabled={loadingItem === item.orderID || item.quantity <= 1}
                          >
                            <FaMinus size={8} className="md:w-3 md:h-3" />
                          </button>
                          <span className="w-6 md:w-10 text-center font-black text-xs md:text-base text-bakery-chocolate">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.orderID, "increment")}
                            className="w-6 h-6 md:w-10 md:h-10 flex items-center justify-center text-bakery-chocolate/40 hover:text-bakery-pista-deep transition-colors disabled:opacity-20"
                            disabled={loadingItem === item.orderID}
                          >
                            <FaPlus size={8} className="md:w-3 md:h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.orderID)}
                          className="text-red-300 hover:text-red-500 transition-colors p-1 md:p-2 group/trash"
                          title="Remove item"
                        >
                          <FaTrash size={12} className="md:w-4 md:h-4 group-hover/trash:scale-125 transition-transform" />
                        </button>
                      </div>
                    </div>

                    <div className="w-auto text-right border-l border-bakery-pista/20 pl-3 md:min-w-[120px] md:border-l-0 md:pl-0">
                      <p className="text-lg md:text-3xl font-black text-bakery-chocolate">₹{(item.price * item.quantity).toFixed(0)}</p>
                      <p className="text-[8px] md:text-[10px] font-black text-bakery-chocolate/30 uppercase tracking-widest mt-0.5 md:mt-1">₹{item.price} per cake</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <aside className="lg:col-span-4">
              <div className="card-premium sticky top-24 md:top-32 space-y-5 border border-bakery-pista/30 bg-white p-5 shadow-xl md:space-y-10 md:p-10 md:shadow-2xl md:border-2">
                <div className="space-y-2">
                  <h2 className="text-lg font-serif font-black text-bakery-chocolate md:text-2xl">Order Summary</h2>
                  <div className="h-1 w-8 md:w-12 bg-bakery-pista-deep rounded-full" />
                </div>

                <div className="space-y-4 md:space-y-6 font-medium">
                  <div className="flex justify-between text-bakery-chocolate/50">
                    <span className="text-xs md:text-sm font-bold uppercase tracking-widest">Subtotal</span>
                    <span className="text-lg md:text-xl font-black text-bakery-chocolate">₹{calculateTotal().toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-bakery-chocolate/50">
                    <span className="text-xs md:text-sm font-bold uppercase tracking-widest">Delivery</span>
                    <span className="text-[10px] md:text-sm font-black text-green-500 uppercase tracking-widest">Complimentary</span>
                  </div>
                  <div className="pt-4 md:pt-8 border-t border-bakery-pista/30 flex justify-between items-end">
                    <span className="text-sm md:text-lg font-serif font-black text-bakery-chocolate">Grand Total</span>
                    <span className="text-2xl md:text-4xl font-black text-bakery-chocolate">₹{calculateTotal().toFixed(0)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="btn-premium w-full py-3 md:py-5 text-sm md:text-xl shadow-xl transition-all active:scale-[0.98] bg-bakery-pista-deep border-none text-white hover:bg-bakery-chocolate"
                >
                  Checkout Now →
                </button>
                
                <div className="flex items-center justify-center space-x-2 text-[10px] font-black text-bakery-chocolate/30 uppercase tracking-widest">
                  <FaCheckCircle className="text-green-500" />
                  <span>Secure SSL Encrypted Payment</span>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-premium mx-auto max-w-4xl space-y-6 border border-dashed border-bakery-pista/50 bg-white p-6 text-center shadow-lg md:space-y-10 md:p-32 md:shadow-2xl md:border-2"
          >
            <div className="w-16 h-16 md:w-24 md:h-24 bg-bakery-pista-light/50 rounded-full flex items-center justify-center mx-auto text-bakery-pista-deep/30 text-3xl md:text-6xl">
              <FaShoppingBag />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-black text-bakery-chocolate md:text-4xl">Your Cart is Quiet</h2>
              <p className="text-bakery-chocolate/50 font-medium max-w-sm mx-auto leading-relaxed">It seems you haven't added any ritual cakes to your selection yet. Let's find something delicious!</p>
            </div>
            <button onClick={() => navigate("/cakes")} className="btn-premium px-10 py-4 text-sm md:px-16 md:py-5 md:text-lg">Start Shopping</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Cart;
