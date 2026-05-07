import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft, FaCheckCircle } from "react-icons/fa";

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [loadingItem, setLoadingItem] = useState(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

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
    <div className="min-h-screen bg-bakery-cream/20 pt-10 pb-32">
      <div className="container mx-auto px-8 lg:px-16 xl:px-24 max-w-7xl">
        {/* Header Section */}
        <header className="mb-16 space-y-6">
          <Link to="/" className="inline-flex items-center space-x-2 text-bakery-chocolate/40 hover:text-bakery-rose transition-colors font-black uppercase tracking-widest text-xs">
            <FaArrowLeft /> <span>Back to Bakery</span>
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-5xl lg:text-7xl font-serif font-black text-bakery-chocolate">Your <span className="text-bakery-rose italic font-medium">Cart</span></h1>
            <div className="hidden md:flex items-center space-x-3 text-bakery-chocolate/30 font-black text-xs uppercase tracking-widest">
              <span className="text-bakery-rose">Cart</span>
              <span>•</span>
              <span>Details</span>
              <span>•</span>
              <span>Payment</span>
            </div>
          </div>
        </header>

        {cart?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-8">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <motion.div
                    key={item.orderID}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="card-premium p-8 flex flex-col md:flex-row items-center gap-10 bg-white group hover:border-bakery-rose/20 transition-all border-transparent"
                  >
                    <div className="relative shrink-0">
                      <div className="absolute -inset-2 bg-bakery-rose/5 rounded-3xl group-hover:bg-bakery-rose/10 transition-colors" />
                      <img
                        src={item.img}
                        alt={item.name}
                        className="relative w-40 h-40 object-cover rounded-2xl shadow-premium group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-6 text-center md:text-left">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-serif font-black text-bakery-chocolate leading-tight">{item.name}</h2>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                          <span className="text-[10px] font-black uppercase tracking-widest bg-bakery-cream px-3 py-1.5 rounded-full text-bakery-chocolate/60">{item.shape}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest bg-bakery-cream px-3 py-1.5 rounded-full text-bakery-chocolate/60">{item.weight}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center md:justify-start space-x-8">
                        <div className="flex items-center bg-bakery-cream/50 rounded-2xl p-1 border border-bakery-pink/20">
                          <button
                            onClick={() => handleQuantityChange(item.orderID, "decrement")}
                            className="w-10 h-10 flex items-center justify-center text-bakery-chocolate/40 hover:text-bakery-rose transition-colors disabled:opacity-20"
                            disabled={loadingItem === item.orderID || item.quantity <= 1}
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="w-10 text-center font-black text-bakery-chocolate">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.orderID, "increment")}
                            className="w-10 h-10 flex items-center justify-center text-bakery-chocolate/40 hover:text-bakery-rose transition-colors disabled:opacity-20"
                            disabled={loadingItem === item.orderID}
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.orderID)}
                          className="text-red-400 hover:text-red-600 transition-colors p-2 group/trash"
                          title="Remove item"
                        >
                          <FaTrash className="group-hover/trash:scale-125 transition-transform" />
                        </button>
                      </div>
                    </div>

                    <div className="md:text-right md:min-w-[120px] pt-4 md:pt-0 border-t md:border-t-0 border-bakery-pink/20 w-full md:w-auto">
                      <p className="text-3xl font-black text-bakery-chocolate">₹{(item.price * item.quantity).toFixed(0)}</p>
                      <p className="text-[10px] font-black text-bakery-chocolate/30 uppercase tracking-widest mt-1">₹{item.price} per cake</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              <div className="card-premium p-10 bg-white space-y-10 border-2 border-bakery-rose/10 shadow-2xl sticky top-32">
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-black text-bakery-chocolate">Order Summary</h2>
                  <div className="h-1 w-12 bg-bakery-rose rounded-full" />
                </div>

                <div className="space-y-6 font-medium">
                  <div className="flex justify-between text-bakery-chocolate/50">
                    <span className="text-sm font-bold uppercase tracking-widest">Subtotal</span>
                    <span className="text-xl font-black text-bakery-chocolate">₹{calculateTotal().toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-bakery-chocolate/50">
                    <span className="text-sm font-bold uppercase tracking-widest">Delivery</span>
                    <span className="text-sm font-black text-green-500 uppercase tracking-widest">Complimentary</span>
                  </div>
                  <div className="pt-8 border-t border-bakery-pink/30 flex justify-between items-end">
                    <span className="text-lg font-serif font-black text-bakery-chocolate">Grand Total</span>
                    <span className="text-4xl font-black text-bakery-rose">₹{calculateTotal().toFixed(0)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full btn-premium py-5 text-xl shadow-xl active:scale-[0.98] transition-all"
                >
                  Checkout Now →
                </button>
                
                <div className="flex items-center justify-center space-x-2 text-[10px] font-black text-bakery-chocolate/30 uppercase tracking-widest">
                  <FaCheckCircle className="text-green-500" />
                  <span>Secure SSL Encrypted Payment</span>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="card-premium p-8 bg-bakery-chocolate text-bakery-cream text-center space-y-4">
                <div className="inline-block px-4 py-1 bg-bakery-rose text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Pro Tip</div>
                <p className="text-sm font-medium opacity-80 leading-relaxed">Order 2+ Ritual Cakes and receive a complimentary artisan chocolate box!</p>
              </div>
            </aside>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-premium p-32 text-center space-y-10 bg-white max-w-4xl mx-auto shadow-2xl border-dashed border-2 border-bakery-pink/50"
          >
            <div className="w-24 h-24 bg-bakery-cream rounded-full flex items-center justify-center mx-auto text-bakery-rose/20 text-6xl">
              <FaShoppingBag />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-serif font-black text-bakery-chocolate">Your Cart is Quiet</h2>
              <p className="text-bakery-chocolate/50 font-medium max-w-sm mx-auto leading-relaxed">It seems you haven't added any ritual cakes to your selection yet. Let's find something delicious!</p>
            </div>
            <button onClick={() => navigate("/cakes")} className="btn-premium px-16 py-5 text-lg">Start Shopping</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Cart;