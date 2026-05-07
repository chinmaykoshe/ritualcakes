import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import { useCustomization } from "../context/customizeContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaBox, FaMagic, FaArrowLeft, FaClock, FaCalendarAlt, FaMapMarkerAlt, FaPhoneAlt, FaCheckCircle, FaSpinner, FaHistory } from "react-icons/fa";

function Orders() {
  const { orders } = useOrder();
  const { customizations, setCustomizations } = useCustomization();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("user");
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    const fetchCustomizations = async () => {
      try {
        const response = await fetch(`/api/customizations/${userEmail}`);
        if (response.ok) {
          const data = await response.json();
          setCustomizations(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (userEmail) fetchCustomizations();
  }, [userEmail, setCustomizations]);

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-bakery-cream/30 pt-10 pb-20">
        <div className="container mx-auto px-6 max-w-4xl text-center space-y-8">
          <div className="card-premium p-20 bg-white shadow-xl">
            <h1 className="text-4xl font-serif font-bold text-bakery-chocolate mb-4">Your Ritual History</h1>
            <p className="text-bakery-chocolate/60 mb-8">Please log in to view your orders and unique creations.</p>
            <button onClick={() => navigate("/login")} className="btn-premium px-12">Sign In to Continue</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bakery-cream/30 pt-10 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2">
            <Link to="/" className="inline-flex items-center space-x-2 text-bakery-chocolate hover:text-bakery-rose transition-colors mb-4 font-bold uppercase tracking-widest text-xs">
              <FaArrowLeft /> <span>Back to Home</span>
            </Link>
            <h1 className="text-5xl font-serif font-black text-bakery-chocolate">My Rituals</h1>
            <p className="text-bakery-chocolate/40 font-medium italic">Tracking your sweet journey with us.</p>
          </div>
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-bakery-pink/20">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-8 py-3 rounded-xl text-sm font-black transition-all flex items-center space-x-2 ${activeTab === 'orders' ? 'bg-bakery-rose text-white shadow-lg' : 'text-bakery-chocolate/40 hover:text-bakery-chocolate'}`}
            >
              <FaBox /> <span>Orders</span>
            </button>
            <button 
              onClick={() => setActiveTab('customizations')}
              className={`px-8 py-3 rounded-xl text-sm font-black transition-all flex items-center space-x-2 ${activeTab === 'customizations' ? 'bg-bakery-chocolate text-white shadow-lg' : 'text-bakery-chocolate/40 hover:text-bakery-chocolate'}`}
            >
              <FaMagic /> <span>Custom Creations</span>
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'orders' ? (
            <motion.div 
              key="orders-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order._id} className="card-premium bg-white overflow-hidden">
                    <div className="bg-bakery-chocolate p-4 flex flex-wrap justify-between items-center gap-4 text-bakery-cream/70 text-xs font-black uppercase tracking-widest">
                      <div className="flex items-center space-x-6">
                        <span className="text-white">Order ID: #{order._id.slice(-8)}</span>
                        <span>Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-white">
                        <FaCheckCircle className="text-green-400" />
                        <span>Status: {order.status}</span>
                      </div>
                    </div>
                    <div className="p-8 space-y-8">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                          <img src={item.image || "/fallback-image.png"} alt={item.name} className="w-32 h-32 object-cover rounded-3xl shadow-premium" />
                          <div className="flex-1 space-y-4 text-center md:text-left">
                            <div>
                              <h3 className="text-2xl font-serif font-bold text-bakery-chocolate">{item.name}</h3>
                              <p className="text-sm text-bakery-chocolate/40 font-bold uppercase tracking-widest">{item.weight} • {item.shape} • Qty: {item.quantity}</p>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                              <div className="flex items-center space-x-2 text-xs font-bold bg-bakery-cream px-3 py-1.5 rounded-full text-bakery-chocolate/60">
                                <FaCalendarAlt className="text-bakery-rose" />
                                <span>Delivery: {new Date(order.orderDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-xs font-bold bg-bakery-cream px-3 py-1.5 rounded-full text-bakery-chocolate/60">
                                <FaClock className="text-bakery-rose" />
                                <span>Time: {order.orderTime}</span>
                              </div>
                            </div>
                            {order.cakeMessage && (
                              <div className="p-4 bg-bakery-rose/5 border-l-4 border-bakery-rose rounded-r-xl italic text-bakery-chocolate/70">
                                "{order.cakeMessage}"
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-black text-bakery-chocolate">₹{item.price * item.quantity}</p>
                            <p className="text-xs text-bakery-chocolate/40 font-black uppercase tracking-widest mt-1">Paid via Online</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-8 py-6 bg-slate-50 border-t border-bakery-pink/20 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center space-x-3 text-bakery-chocolate/60">
                        <FaMapMarkerAlt className="text-bakery-rose" />
                        <span className="text-sm font-bold">{order.deliveryAddress}</span>
                      </div>
                      <button 
                        onClick={() => window.confirm("Please call +91 8169296802 for cancellations.") && (window.location.href = "tel:+918169296802")}
                        className="text-red-400 hover:text-red-600 font-bold text-sm uppercase tracking-widest transition-colors"
                      >
                        Request Cancellation
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card-premium p-20 bg-white text-center space-y-6">
                  <FaHistory className="text-5xl text-bakery-cream mx-auto" />
                  <h3 className="text-2xl font-serif font-bold text-bakery-chocolate">No orders yet</h3>
                  <p className="text-bakery-chocolate/40">Start your sweet ritual today!</p>
                  <button onClick={() => navigate("/cakes")} className="btn-premium px-12">Explore Menu</button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="custom-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {customizations && customizations.length > 0 ? (
                customizations.map((c) => (
                  <div key={c._id} className="card-premium bg-white p-8 flex flex-col h-full border-b-8 border-bakery-chocolate">
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-bakery-cream px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/60">
                        Inquiry ID: #{c._id.slice(-6)}
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                        c.approvalStatus === 'approved' ? 'bg-green-100 text-green-700' : 
                        c.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {c.approvalStatus}
                      </div>
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="flex gap-6">
                        {c.imageOrDesign && (
                          <img src={c.imageOrDesign.startsWith('http') ? c.imageOrDesign : "/fallback-image.png"} alt="Custom Design" className="w-24 h-24 object-cover rounded-2xl shadow-premium border-2 border-white" />
                        )}
                        <div className="space-y-1">
                          <h3 className="text-xl font-serif font-bold text-bakery-chocolate">{c.cakeType}</h3>
                          <p className="text-xs text-bakery-rose font-black uppercase tracking-widest">{c.flavor} • {c.size}</p>
                          <div className="flex items-center space-x-2 text-[10px] font-bold text-bakery-chocolate/40 pt-2 uppercase">
                            <FaCalendarAlt /> <span>Delivery: {new Date(c.deliveryDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl text-sm leading-relaxed text-bakery-chocolate/70">
                        <p className="font-bold text-bakery-chocolate mb-1 uppercase text-[10px] tracking-widest">Message on Cake:</p>
                        "{c.message}"
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-bakery-pink/20 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-bakery-chocolate/30 font-black uppercase tracking-widest">Estimated Price</p>
                        <p className="text-2xl font-black text-bakery-chocolate">₹{c.price || "TBD"}</p>
                      </div>
                      <button 
                        onClick={() => window.location.href = `tel:+918169296802`}
                        className="w-12 h-12 rounded-full bg-bakery-chocolate text-white flex items-center justify-center hover:bg-bakery-rose transition-colors shadow-lg"
                      >
                        <FaPhoneAlt size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="md:col-span-2 card-premium p-20 bg-white text-center space-y-6">
                  <FaMagic className="text-5xl text-bakery-cream mx-auto" />
                  <h3 className="text-2xl font-serif font-bold text-bakery-chocolate">No custom creations yet</h3>
                  <p className="text-bakery-chocolate/40">Have a unique vision? Let's bring it to life.</p>
                  <button onClick={() => navigate("/customization")} className="btn-premium px-12">Start Customizing</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Orders;