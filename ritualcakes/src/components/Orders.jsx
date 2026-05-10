import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import { useCustomization } from "../context/customizeContext";
import { designnames } from "../designs/designassets";
import { elements, assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaBox, FaClock, FaCalendarAlt, FaMapMarkerAlt, FaWhatsapp, FaCheckCircle, FaPenNib } from "react-icons/fa";

function Orders() {
  const { orders, loading: ordersLoading } = useOrder();
  const { customizations, setCustomizations, error: customizationError } = useCustomization();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("user");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCustomizations = async () => {
      if (!userEmail) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/customizations/${userEmail}`);
        if (!response.ok) throw new Error("Failed to fetch customizations");
        const data = await response.json();
        setCustomizations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomizations();
  }, [userEmail, setCustomizations]);

  const StatusBadge = ({ status }) => {
    const styles = {
      Pending: "bg-amber-100 text-amber-700 border-amber-200",
      Accepted: "bg-emerald-100 text-emerald-700 border-emerald-200",
      Completed: "bg-blue-100 text-blue-700 border-blue-200",
      Cancelled: "bg-rose-100 text-rose-700 border-rose-200",
    };
    return (
      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.Pending}`}>
        {status}
      </span>
    );
  };

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-bakery-pista-light/30 flex items-center justify-center p-8">
        <div className="card-premium p-16 text-center space-y-8 bg-white max-w-xl shadow-2xl">
          <div className="w-24 h-24 bg-bakery-pista-light/40 rounded-full flex items-center justify-center mx-auto text-bakery-pista-deep/30 text-4xl">
            <FaBox />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-serif font-black text-bakery-chocolate">Ritual History Locked</h1>
            <p className="text-bakery-chocolate/50 font-medium leading-relaxed">Please sign in to your sanctuary to view your past and pending rituals.</p>
          </div>
          <button onClick={() => navigate("/login")} className="btn-premium px-12 py-5 text-base">Sign In to Your Rituals</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bakery-pista-light/10 pt-10 pb-32">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-bakery-pista/40 pb-12">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center space-x-2 text-bakery-rose hover:text-bakery-chocolate transition-colors font-black uppercase tracking-widest text-[10px]">
              <FaArrowLeft /> <span>Return to Sanctuary</span>
            </Link>
            <h1 className="text-5xl md:text-7xl font-serif font-black text-bakery-chocolate">Your <span className="text-bakery-rose italic font-medium">Ritual</span> Logs</h1>
          </div>
          <div className="flex flex-col md:items-end gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-bakery-chocolate/30">Logged in as</p>
            <p className="font-bold text-bakery-chocolate">{userEmail}</p>
          </div>
        </header>

        <div className="space-y-24">
          {/* Main Orders Section */}
          <section className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-bakery-chocolate text-white rounded-xl flex items-center justify-center shadow-lg"><FaBox /></div>
              <h2 className="text-3xl font-serif font-black text-bakery-chocolate">Standard Rituals</h2>
            </div>

            {ordersLoading || loading ? (
              <div className="grid grid-cols-1 gap-8 animate-pulse">
                {[1, 2].map(i => <div key={i} className="h-64 bg-white/50 rounded-[40px] border border-bakery-pista/20" />)}
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="grid grid-cols-1 gap-10">
                <AnimatePresence>
                  {orders.map((order) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-white rounded-[40px] overflow-hidden shadow-premium border border-bakery-pista/30 hover:border-bakery-pista-mid/60 transition-all"
                    >
                      {/* Order Header */}
                      <div className="bg-bakery-pista-light/40 px-8 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-bakery-pista/20">
                        <div className="flex flex-wrap items-center gap-6">
                          <div className="space-y-1">
                            <p className="text-[8px] font-black uppercase tracking-widest text-bakery-chocolate/40">Reference ID</p>
                            <p className="font-black text-bakery-chocolate text-xs tracking-widest">#{order._id.slice(-8).toUpperCase()}</p>
                          </div>
                          <div className="space-y-1 border-l border-bakery-pista/30 pl-6">
                            <p className="text-[8px] font-black uppercase tracking-widest text-bakery-chocolate/40">Ritual Placed</p>
                            <p className="font-bold text-bakery-chocolate text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <StatusBadge status={order.status} />
                          <div className="text-right">
                            <p className="text-[8px] font-black uppercase tracking-widest text-bakery-chocolate/40">Grand Ritual Total</p>
                            <p className="text-2xl font-black text-bakery-chocolate">₹{order.totalAmount || 0}</p>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="p-8 md:p-12 space-y-12">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="flex flex-col lg:flex-row gap-12">
                            <div className="shrink-0 lg:w-72 h-72 rounded-[32px] overflow-hidden shadow-premium cursor-pointer group-hover:scale-[1.01] transition-transform" onClick={() => navigate(`/product/${item.orderID}`)}>
                              <img src={findProductImage(item)} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="flex-1 space-y-8">
                              <div className="space-y-4">
                                <h3 className="text-3xl font-serif font-black text-bakery-chocolate hover:text-bakery-pista-deep transition-colors cursor-pointer" onClick={() => navigate(`/product/${item.orderID}`)}>{item.name}</h3>
                                <div className="flex flex-wrap gap-4">
                                  <span className="px-4 py-1.5 bg-bakery-pista-light/30 rounded-full text-[10px] font-black uppercase tracking-widest text-bakery-pista-deep">{item.shape}</span>
                                  <span className="px-4 py-1.5 bg-bakery-rose/5 rounded-full text-[10px] font-black uppercase tracking-widest text-bakery-rose">{item.weight}</span>
                                  <span className="px-4 py-1.5 bg-bakery-chocolate/5 rounded-full text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/70">Qty: {item.quantity}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                                <div className="space-y-4">
                                  <div className="flex items-start gap-4">
                                    <FaCalendarAlt className="text-bakery-pista-deep mt-1" />
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/30">Delivery Ritual</p>
                                      <p className="font-bold text-bakery-chocolate">{new Date(order.orderDate).toLocaleDateString()} at {order.orderTime}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-4">
                                    <FaMapMarkerAlt className="text-bakery-pista-deep mt-1" />
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/30">Destination</p>
                                      <p className="font-bold text-bakery-chocolate leading-relaxed">{order.deliveryAddress}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div className="flex items-start gap-4">
                                    <FaPenNib className="text-bakery-rose mt-1" />
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/30">Ritual Message</p>
                                      <p className="font-serif italic font-medium text-bakery-chocolate text-lg">"{order.cakeMessage || "No message"}"</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="px-8 md:px-12 py-8 bg-bakery-pista-light/20 border-t border-bakery-pista/20 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            <FaCheckCircle className="text-bakery-pista-deep" />
                            <span>Quality Guaranteed</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            <FaClock className="text-bakery-pista-deep" />
                            <span>Express Delivery</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <button
                            onClick={() => {
                              const confirmCall = window.confirm("Call +91 8169296802 to cancel the order! OR Reply to the mail for cancellation !");
                              if (confirmCall) window.location.href = "tel:+918169296802";
                            }}
                            className="flex-1 sm:flex-none px-8 py-4 text-rose-600 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 rounded-2xl transition-all"
                          >
                            Request Cancellation
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="py-20 text-center space-y-6 bg-white/40 rounded-[40px] border-2 border-dashed border-bakery-pista/30">
                <FaBox className="text-6xl text-bakery-pista/40 mx-auto" />
                <p className="text-bakery-chocolate/40 font-medium">Your ritual history is waiting to be written.</p>
                <button onClick={() => navigate("/cakes")} className="btn-premium px-10">Discover Cakes</button>
              </div>
            )}
          </section>

          {/* Customizations Section */}
          <section className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-bakery-pista-deep text-white rounded-xl flex items-center justify-center shadow-lg"><FaPenNib /></div>
              <h2 className="text-3xl font-serif font-black text-bakery-chocolate">Custom Inspirations</h2>
            </div>

            {customizations && customizations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {customizations.map((custom, index) => (
                  <motion.div
                    key={custom._id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group bg-white rounded-[40px] p-8 md:p-10 shadow-premium border border-bakery-pista/20 hover:border-bakery-pista-mid/50 transition-all flex flex-col lg:flex-row gap-10"
                  >
                    <div className="shrink-0 lg:w-48 h-48 rounded-[32px] overflow-hidden shadow-premium relative bg-bakery-pista-light/20">
                      <img
                        src={custom.imageOrDesign?.startsWith("http") ? custom.imageOrDesign : designnames?.[custom.imageOrDesign] || assets.fallbackImage}
                        alt="Custom Design"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => window.open(custom.imageOrDesign?.startsWith("http") ? custom.imageOrDesign : designnames?.[custom.imageOrDesign], "_blank")} className="p-3 bg-white rounded-full text-bakery-chocolate shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                          <FaArrowLeft className="rotate-[135deg]" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-[8px] font-black uppercase tracking-widest text-bakery-chocolate/40">Customization ID</p>
                          <p className="font-black text-bakery-chocolate text-[10px] tracking-widest">#{custom._id.slice(-6).toUpperCase()}</p>
                        </div>
                        <StatusBadge status={custom.approvalStatus === "approved" ? "Accepted" : custom.approvalStatus === "pending" ? "Pending" : "Cancelled"} />
                      </div>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-[10px] font-bold">
                        <div className="space-y-1">
                          <p className="uppercase tracking-widest text-bakery-chocolate/40">Ritual Type</p>
                          <p className="text-bakery-chocolate">{custom.cakeType} • {custom.size}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="uppercase tracking-widest text-bakery-chocolate/40">Flavor Choice</p>
                          <p className="text-bakery-chocolate">{custom.flavor}</p>
                        </div>
                        <div className="space-y-1 col-span-2 pt-2 border-t border-bakery-pista/10">
                          <p className="uppercase tracking-widest text-bakery-chocolate/40">Personal Message</p>
                          <p className="text-bakery-chocolate italic">"{custom.message || "No message"}"</p>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-between items-center border-t border-bakery-pista/20">
                        <div className="flex items-center gap-2 text-bakery-rose">
                          <FaWhatsapp />
                          <span className="text-[8px] font-black uppercase tracking-widest">WhatsApp Inquiry</span>
                        </div>
                        <p className="text-xl font-black text-bakery-chocolate">₹{custom.price || "TBD"}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-6 bg-white/40 rounded-[40px] border-2 border-dashed border-bakery-pista/30">
                <FaPenNib className="text-6xl text-bakery-pista/40 mx-auto" />
                <p className="text-bakery-chocolate/40 font-medium">No custom inspirations yet.</p>
                <button onClick={() => navigate("/designs")} className="btn-premium px-10">Browse Designs</button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Orders;