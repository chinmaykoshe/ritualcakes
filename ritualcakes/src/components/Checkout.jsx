import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaCheckCircle, FaMapMarkerAlt, FaUser, FaStickyNote, FaCalendarAlt, FaClock, FaCreditCard, FaShoppingBag } from "react-icons/fa";

function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const { createOrder, loading } = useOrder();
  
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [cakeMessage, setCakeMessage] = useState("Happy Birthday");
  const [orderDate, setOrderDate] = useState("");
  const [orderTime, setOrderTime] = useState("17:00"); 
  const [paymentMethod, setPaymentMethod] = useState("COD"); 
  const [errorMessages, setErrorMessages] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2); 
    const formattedDate = date.toISOString().split("T")[0];
    setOrderDate(formattedDate); 
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleOrderTimeChange = (event) => {
    const selectedTime = event.target.value;
    const selectedDate = new Date(`1970-01-01T${selectedTime}:00`);
    const startTime = new Date("1970-01-01T10:00:00");
    const endTime = new Date("1970-01-01T23:00:00");
    if (selectedDate >= startTime && selectedDate <= endTime) {
      setOrderTime(selectedTime);
      setErrorMessages("");
    } else {
      setErrorMessages("Please select a time between 10:00 AM and 11:00 PM.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      // Save data and redirect to login
      const pendingOrder = { customerName, address, cakeMessage, orderDate, orderTime, paymentMethod };
      localStorage.setItem("pendingOrderInfo", JSON.stringify(pendingOrder));
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (!customerName || !address || !cakeMessage || !orderTime) {
      setErrorMessages("Please fill in all required fields.");
      return;
    }

    try {
      const userEmail = localStorage.getItem("user");
      const orderItems = cart.map((item) => ({
        orderID: item.orderID,
        name: item.name,
        price: parseFloat(item.price),
        shape: item.shape,
        quantity: parseInt(item.quantity),
        weight: parseFloat(item.weight),
        image: item.img,
      }));

      const orderData = {
        userEmail,
        customerName,
        orderItems,
        totalAmount: parseFloat(calculateTotal()),
        deliveryAddress: address,
        paymentMethod,
        cakeMessage,
        orderDate: new Date(orderDate).toISOString(),
        orderTime: orderTime,
        status: "Pending",
      };

      await createOrder(orderData);
      setSuccessMessage("Your ritual order has been placed successfully!");
      setTimeout(async () => {
        await clearCart();
        navigate("/orders"); 
      }, 2500);
    } catch (error) {
      setErrorMessages(error.response?.data?.message || "Error placing order, please try again.");
    }
  };

  if (cart.length === 0 && !successMessage) {
    return (
      <div className="min-h-screen bg-bakery-cream/20 flex items-center justify-center p-8">
        <div className="card-premium p-16 bg-white text-center space-y-6 max-w-xl shadow-2xl">
          <FaShoppingBag className="text-6xl text-bakery-rose/20 mx-auto" />
          <h2 className="text-3xl font-serif font-black text-bakery-chocolate">Your Cart is Empty</h2>
          <p className="text-bakery-chocolate/50 font-medium">Add some sweet rituals to your cart before checking out.</p>
          <button onClick={() => navigate("/cakes")} className="btn-premium px-12">Browse Cakes</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bakery-pista-light/30 pt-10 pb-32">
      <div className="container mx-auto px-8 lg:px-16 xl:px-24 max-w-7xl">
        <header className="mb-16 space-y-6">
          <button onClick={() => navigate(-1)} className="inline-flex items-center space-x-2 text-bakery-chocolate/40 hover:text-bakery-pista-deep transition-colors font-black uppercase tracking-widest text-xs">
            <FaArrowLeft /> <span>Back to Cart</span>
          </button>
          <h1 className="text-5xl lg:text-7xl font-serif font-black text-bakery-chocolate">Finalize <span className="text-bakery-rose italic font-medium">Ritual</span></h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Order Details Form */}
          <div className="lg:col-span-8 space-y-12">
            <div className="card-premium p-8 md:p-12 bg-white space-y-12">
              
              {/* Delivery Info */}
              <div className="space-y-8">
                <div className="flex items-center space-x-4 border-b border-bakery-pista/30 pb-4">
                  <div className="w-10 h-10 bg-bakery-pista-deep text-white rounded-xl flex items-center justify-center shadow-lg"><FaMapMarkerAlt /></div>
                  <h2 className="text-2xl font-serif font-black text-bakery-chocolate">Delivery Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Recipient Name</label>
                    <div className="relative group">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/20 group-focus-within:text-bakery-pista-deep transition-colors" />
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Who is this for?"
                        className="input-premium pl-12"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Full Delivery Address</label>
                    <div className="relative group">
                      <FaMapMarkerAlt className="absolute left-4 top-4 text-bakery-chocolate/20 group-focus-within:text-bakery-pista-deep transition-colors" />
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House No, Street, Landmark..."
                        className="input-premium pl-12 pt-3 h-24 resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cake Details */}
              <div className="space-y-8">
                <div className="flex items-center space-x-4 border-b border-bakery-pista/30 pb-4">
                  <div className="w-10 h-10 bg-bakery-chocolate text-white rounded-xl flex items-center justify-center shadow-lg"><FaStickyNote /></div>
                  <h2 className="text-2xl font-serif font-black text-bakery-chocolate">Ritual Preferences</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Message on Cake</label>
                    <input
                      type="text"
                      value={cakeMessage}
                      onChange={(e) => setCakeMessage(e.target.value)}
                      placeholder="e.g. Happy Birthday Sarah!"
                      className="input-premium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Delivery Date (Min 2 days)</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/20" />
                      <input
                        type="date"
                        value={orderDate}
                        onChange={(e) => setOrderDate(e.target.value)}
                        min={orderDate}
                        className="input-premium pl-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Delivery Time (10 AM - 11 PM)</label>
                    <div className="relative">
                      <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/20" />
                      <input
                        type="time"
                        value={orderTime}
                        onChange={handleOrderTimeChange}
                        className="input-premium pl-12"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-8">
                <div className="flex items-center space-x-4 border-b border-bakery-pista/30 pb-4">
                  <div className="w-10 h-10 bg-bakery-pista-deep text-white rounded-xl flex items-center justify-center shadow-lg"><FaCreditCard /></div>
                  <h2 className="text-2xl font-serif font-black text-bakery-chocolate">Payment Method</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    onClick={() => setPaymentMethod("COD")}
                    className={`p-6 rounded-3xl border-2 flex items-center space-x-4 transition-all ${paymentMethod === 'COD' ? 'border-bakery-pista-deep bg-bakery-pista-light/60 shadow-inner' : 'border-bakery-pista/40 hover:border-bakery-pista-mid/50'}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-bakery-pista-deep' : 'border-bakery-pista/40'}`}>
                      {paymentMethod === 'COD' && <div className="w-3 h-3 bg-bakery-pista-deep rounded-full" />}
                    </div>
                    <div className="text-left">
                      <p className="font-black text-bakery-chocolate uppercase text-xs tracking-widest">Pay on Delivery</p>
                      <p className="text-[10px] text-bakery-chocolate/40 font-bold">Pay when your ritual arrives</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setPaymentMethod("Online")}
                    className={`p-6 rounded-3xl border-2 flex items-center space-x-4 transition-all ${paymentMethod === 'Online' ? 'border-bakery-pista-deep bg-bakery-pista-light/60 shadow-inner' : 'border-bakery-pista/40 hover:border-bakery-pista-mid/50'}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Online' ? 'border-bakery-pista-deep' : 'border-bakery-pista/40'}`}>
                      {paymentMethod === 'Online' && <div className="w-3 h-3 bg-bakery-pista-deep rounded-full" />}
                    </div>
                    <div className="text-left">
                      <p className="font-black text-bakery-chocolate uppercase text-xs tracking-widest">Online Payment</p>
                      <p className="text-[10px] text-bakery-chocolate/40 font-bold">Secure UPI or Card Payment</p>
                    </div>
                  </button>
                </div>
              </div>

              {errorMessages && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                  {errorMessages}
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full btn-premium py-5 text-xl font-black shadow-xl transform active:scale-[0.98] transition-all"
              >
                {loading ? "Processing..." : isLoggedIn ? "Complete Ritual Order" : "Login to Complete Order"}
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
            <div className="card-premium p-8 bg-white space-y-8 border-2 border-bakery-rose/10 shadow-2xl">
              <h2 className="text-2xl font-serif font-black text-bakery-chocolate border-b border-bakery-pista/30 pb-4">Order Summary</h2>
              
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.orderID} className="flex items-center gap-4">
                    <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded-xl shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-bakery-chocolate truncate">{item.name}</h4>
                      <p className="text-[10px] font-black text-bakery-chocolate/40 uppercase tracking-widest">{item.weight} • {item.quantity} Unit</p>
                    </div>
                    <p className="font-black text-bakery-chocolate">₹{(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-bakery-pista/30 space-y-4">
                <div className="flex justify-between text-bakery-chocolate/50 font-bold text-xs uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>₹{calculateTotal().toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-bakery-chocolate/50 font-bold text-xs uppercase tracking-widest">
                  <span>Delivery</span>
                  <span className="text-green-500">Free</span>
                </div>
                <div className="pt-4 flex justify-between items-end">
                  <span className="font-serif font-black text-bakery-chocolate text-xl">Total Amount</span>
                  <span className="text-4xl font-black text-bakery-rose">₹{calculateTotal().toFixed(0)}</span>
                </div>
              </div>
            </div>

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-premium p-8 bg-green-50 text-green-700 text-center space-y-6 border border-green-100"
              >
                <FaCheckCircle className="text-5xl mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-black">Success!</h3>
                  <p className="text-sm font-medium">{successMessage}</p>
                </div>
                <button onClick={() => navigate("/orders")} className="w-full py-3 bg-green-600 text-white rounded-xl font-black text-xs uppercase tracking-widest">Check Orders</button>
              </motion.div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Checkout;