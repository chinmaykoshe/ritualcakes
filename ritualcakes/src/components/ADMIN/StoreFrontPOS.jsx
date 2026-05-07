import React, { useState, useEffect, useMemo, useRef } from 'react';
import { elements } from '../../assets/assets';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaShoppingCart, 
  FaUser, 
  FaPhone, 
  FaPrint, 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaBirthdayCake,
  FaFilter,
  FaCreditCard,
  FaMoneyBillWave,
  FaQrcode,
  FaTimes
} from 'react-icons/fa';

const cakes = Object.values(elements).flat();

const StoreFrontPOS = () => {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [printData, setPrintData] = useState(null);
  const searchInputRef = useRef(null);

  const categories = ['All', ...Object.keys(elements)];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        if (cart.length > 0) handleCheckout();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, customerMobile]);

  const filteredCakes = useMemo(() => {
    let list = selectedCategory === 'All' 
      ? cakes 
      : elements[selectedCategory] || [];
    
    if (searchQuery) {
      list = list.filter(cake => 
        cake.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cake.orderID.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const addToCart = (cake) => {
    const existingIndex = cart.findIndex(item => item.orderID === cake.orderID);
    if (existingIndex !== -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      setCart(newCart);
    } else {
      const defaultWeight = Object.keys(cake.prices)[0];
      setCart([{ 
        ...cake, 
        quantity: 1, 
        selectedWeight: defaultWeight, 
        selectedShape: 'Round',
        finalPrice: cake.prices[defaultWeight]
      }, ...cart]);
    }
  };

  const updateCartItem = (index, updates) => {
    const newCart = [...cart];
    const item = { ...newCart[index], ...updates };
    if (updates.selectedWeight) {
      item.finalPrice = item.prices[updates.selectedWeight];
    }
    newCart[index] = item;
    setCart(newCart);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% GST example
  const totalAmount = Math.round(subtotal + tax);

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    // Removed mandatory mobile check as per user request
    if (customerMobile && customerMobile.length !== 10) return toast.error("Enter valid 10-digit mobile");

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const orderData = {
        userEmail: localStorage.getItem('user') || "ritualcakes2019@gmail.com",
        customerName: customerName || "Walk-in Customer",
        customerMobile: customerMobile || "0000000000",
        orderItems: cart.map(item => ({
          orderID: item.orderID,
          name: item.name,
          shape: item.selectedShape,
          quantity: item.quantity,
          price: item.finalPrice,
          weight: item.selectedWeight,
          image: item.img
        })),
        totalAmount,
        paymentMethod: 'COD', // 'COD' maps to in-store payment in our schema
        status: 'Completed',
        deliveryAddress: "In-Store Purchase",
        cakeMessage: "POS Order", // Required field in schema
        orderDate: new Date().toISOString(),
        orderTime: new Date().toLocaleTimeString(), // Required field in schema
      };

      await axios.post('/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Capture current order data for printing
      setPrintData({
        cart: [...cart],
        customerName: customerName || "Walk-in Customer",
        customerMobile: customerMobile || "N/A",
        totalAmount,
        paymentMethod,
        orderNumber: `RC-${Math.floor(1000 + Math.random() * 9000)}`,
        orderDate: new Date().toLocaleDateString()
      });

      toast.success("Order Successful!");
      setShowBill(true);
    } catch (error) {
      toast.error("Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetOrder = () => {
    setCart([]);
    setCustomerName('');
    setCustomerMobile('');
    setShowBill(false);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans selection:bg-bakery-rose/20">
      <ToastContainer theme="colored" />
      
      {/* 1. Category Bar (Vertical Slim) */}
      <aside className="w-20 bg-white border-r border-gray-100 flex flex-col items-center py-8 gap-6 z-20">
        <div className="w-12 h-12 bg-bakery-rose rounded-2xl flex items-center justify-center text-white shadow-lg shadow-bakery-rose/20 mb-4">
          <FaBirthdayCake size={24} />
        </div>
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar px-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group ${
                selectedCategory === cat 
                  ? 'bg-bakery-rose text-white shadow-xl scale-110' 
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <span className="text-[8px] font-black uppercase text-center leading-tight">
                {cat === 'All' ? 'ALL' : cat.replace('Cakes', '').substring(0, 5)}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-serif font-black text-bakery-chocolate tracking-tight">Ritual POS</h2>
            <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">Live</span>
          </div>
          
          <div className="relative w-full max-w-xl">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Quick search (Alt + S)..." 
              className="w-full pl-14 pr-6 py-4 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-bakery-rose/50 transition-all text-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-bakery-chocolate">Admin Panel</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Store View</p>
            </div>
            <div className="w-10 h-10 bg-bakery-chocolate rounded-xl flex items-center justify-center text-white font-bold">A</div>
          </div>
        </header>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 custom-scrollbar bg-white/30">
          <AnimatePresence mode='popLayout'>
            {filteredCakes.map((cake, idx) => (
              <motion.div 
                layout
                key={cake.orderID}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => addToCart(cake)}
                className="bg-white rounded-[1.5rem] p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group border border-gray-100 flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] rounded-[1rem] overflow-hidden mb-3">
                  <img src={cake.img} alt={cake.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">Add to Order</span>
                  </div>
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm">
                    <span className="text-[11px] font-black text-bakery-rose">₹{Object.values(cake.prices)[0]}</span>
                  </div>
                </div>
                <div className="px-1 flex-1 flex flex-col justify-between">
                  <h4 className="font-bold text-bakery-chocolate text-sm line-clamp-2 leading-tight mb-1 group-hover:text-bakery-rose transition-colors">{cake.name}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{cake.orderID}</span>
                    <div className="w-6 h-6 rounded-lg bg-bakery-cream text-bakery-rose flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaPlus size={10} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* 3. Checkout Sidebar */}
      <aside className="w-[400px] bg-white border-l border-gray-100 flex flex-col shadow-2xl z-30">
        <div className="p-8 border-b border-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-bakery-chocolate">Order Details</h3>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Payable</p>
              <p className="text-3xl font-black text-bakery-rose">₹{totalAmount}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Customer</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="text" 
                  placeholder="Guest" 
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-bakery-rose/20"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile No</label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="text" 
                  placeholder="Required" 
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-bakery-rose/20"
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          <AnimatePresence initial={false}>
            {cart.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-gray-200"
              >
                <FaShoppingCart size={80} className="mb-4 opacity-10" />
                <p className="font-serif italic text-xl">Ready for a new order...</p>
              </motion.div>
            ) : (
              cart.map((item, idx) => (
                <motion.div 
                  key={`${item.orderID}-${idx}`}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  className="relative group flex gap-4 bg-gray-50 rounded-[2rem] p-4 transition-all hover:bg-white hover:shadow-xl hover:scale-[1.02]"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-md">
                    <img src={item.img} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <h5 className="font-bold text-bakery-chocolate text-sm line-clamp-1">{item.name}</h5>
                      <span className="font-black text-bakery-rose">₹{item.finalPrice * item.quantity}</span>
                    </div>

                    <div className="flex gap-2">
                      <select 
                        className="text-[9px] font-black bg-white border border-gray-100 rounded-lg py-1 px-2 focus:ring-1 focus:ring-bakery-rose"
                        value={item.selectedWeight}
                        onChange={(e) => updateCartItem(idx, { selectedWeight: e.target.value })}
                      >
                        {Object.keys(item.prices).map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                      <select 
                        className="text-[9px] font-black bg-white border border-gray-100 rounded-lg py-1 px-2 focus:ring-1 focus:ring-bakery-rose"
                        value={item.selectedShape}
                        onChange={(e) => updateCartItem(idx, { selectedShape: e.target.value })}
                      >
                        <option value="Round">Round</option>
                        <option value="Square">Square</option>
                        <option value="Heart">Heart</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <button 
                          onClick={() => updateCartItem(idx, { quantity: Math.max(1, item.quantity - 1) })}
                          className="p-1.5 hover:bg-bakery-rose hover:text-white transition-colors"
                        >
                          <FaMinus size={8} />
                        </button>
                        <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartItem(idx, { quantity: item.quantity + 1 })}
                          className="p-1.5 hover:bg-bakery-rose hover:text-white transition-colors"
                        >
                          <FaPlus size={8} />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(idx)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <FaTimes size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Summary & Footer */}
        <div className="p-8 bg-bakery-chocolate text-white rounded-t-[3rem] space-y-4 shadow-[0_-20px_40px_rgba(45,35,30,0.1)]">
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-3">
               <FaShoppingCart className="text-white/20" size={24} />
               <span className="text-sm font-bold opacity-60">{cart.length} Items</span>
            </div>
            <button onClick={() => setCart([])} className="text-white/20 hover:text-red-400 transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest">
              <FaTrash size={12} /> Clear Cart
            </button>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={isProcessing || cart.length === 0}
            className="w-full py-5 rounded-[2rem] bg-bakery-rose text-white font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/20 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 group"
          >
            {isProcessing ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                PROCESS ORDER
                <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity }}>
                  <FaPlus size={16} />
                </motion.div>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Modern Receipt Modal */}
      <AnimatePresence>
        {showBill && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bakery-chocolate/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ y: 50, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl relative"
            >
              <button onClick={resetOrder} className="absolute top-6 right-6 text-gray-400 hover:text-bakery-chocolate transition-colors p-2">
                <FaTimes size={24} />
              </button>

              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-green-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20">
                  <FaPlus size={32} />
                </div>
                <h3 className="text-3xl font-serif font-black text-bakery-chocolate mb-2 tracking-tight">Order Successful!</h3>
                <p className="text-gray-400 font-medium">Receipt has been generated.</p>
                
                <div className="mt-10 p-6 bg-gray-50 rounded-3xl text-left space-y-4 border border-gray-100">
                  <div className="flex justify-between text-xs font-black uppercase text-gray-400 tracking-widest">
                    <span>Order Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-bakery-chocolate">
                    <span>Customer</span>
                    <span>{customerName || 'Walk-in'}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-bakery-chocolate">
                    <span>Payment</span>
                    <span className="px-2 py-0.5 bg-bakery-rose/10 text-bakery-rose rounded-md">{paymentMethod}</span>
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => {
                      setTimeout(() => window.print(), 100);
                    }}
                    className="flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-gray-100 font-black text-bakery-chocolate hover:bg-gray-50 transition-all"
                  >
                    <FaPrint /> PRINT
                  </button>
                  <button 
                    onClick={resetOrder}
                    className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-bakery-chocolate text-white font-black hover:bg-black transition-all"
                  >
                    NEW ORDER
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Professional Print Section (Invoice Style) - Moved to root level for visibility */}
      <div id="print-area" className="hidden print:block p-8 font-sans text-slate-900 bg-white">
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
          <div>a
            <h1 className="text-4xl font-serif font-black text-bakery-chocolate tracking-tighter uppercase mb-1">Ritual Cakes</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Authentic Cake Studio</p>
          </div>
          <div className="text-right text-[10px] space-y-1">
            <p className="font-black uppercase">Tax Invoice / Bill</p>
            <p>#RC-{Math.floor(1000 + Math.random() * 9000)}</p>
            <p>{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8 text-[11px]">
          <div>
            <h4 className="font-black uppercase text-slate-400 mb-2 tracking-widest text-[9px]">Store Details</h4>
            <p className="font-bold">Ritual Cakes & Studio</p>
            <p>Shop no.: 1, Uma Imperial,</p>
            <p>Dronagiri Sec.: 48, Uran, Raigad</p>
            <p>Maharashtra - 400702</p>
            <p>Tel: +91 9773137485</p>
          </div>
          <div className="text-right">
            <h4 className="font-black uppercase text-slate-400 mb-2 tracking-widest text-[9px]">Customer Details</h4>
            <p className="font-bold">{customerName || 'Walk-in Customer'}</p>
            <p>{customerMobile || 'N/A'}</p>
            <p className="mt-2 font-black uppercase text-slate-400 text-[8px]">Payment Status</p>
            <p className="font-bold text-bakery-rose uppercase">{paymentMethod || 'Paid'}</p>
          </div>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-y-2 border-slate-900 text-[10px] font-black uppercase tracking-widest bg-slate-50">
              <th className="text-left py-3 px-2">Description</th>
              <th className="text-center py-3">Qty</th>
              <th className="text-right py-3 px-2">Price</th>
              <th className="text-right py-3 px-2">Amount</th>
            </tr>
          </thead>
          <tbody className="text-[11px]">
            {cart.map((item, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-4 px-2">
                  <p className="font-bold uppercase">{item.name}</p>
                  <p className="text-[9px] text-slate-500">{item.selectedWeight} | {item.selectedShape}</p>
                </td>
                <td className="text-center py-4">{item.quantity}</td>
                <td className="text-right py-4 px-2">₹{item.finalPrice}</td>
                <td className="text-right py-4 px-2 font-bold">₹{item.finalPrice * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-12">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-xs font-bold border-t-2 border-slate-900 pt-3">
              <span className="uppercase tracking-widest">Total Amount</span>
              <span className="text-lg">₹{totalAmount}</span>
            </div>
            <div className="text-[9px] text-right text-slate-400 italic">
              Amount in words: {totalAmount} Rupees Only
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 mt-auto">
          <div className="grid grid-cols-2 items-end gap-8">
            <div className="space-y-2">
              <h4 className="font-black uppercase text-[9px] tracking-widest">Terms & Notes</h4>
              <ul className="text-[8px] text-slate-500 list-disc pl-3 space-y-1">
                <li>Cakes are best consumed within 24 hours of purchase.</li>
                <li>Store in a cool, dry place. Refrigerate if needed.</li>
                <li>Goods once sold will not be taken back.</li>
              </ul>
            </div>
            <div className="text-right">
              <div className="w-32 h-px bg-slate-900 ml-auto mb-2"></div>
              <p className="text-[9px] font-black uppercase tracking-widest">Authorized Signatory</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 pt-4 border-t border-dashed border-slate-200">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Thank you for choosing Ritual Cakes</p>
        </div>
      </div>
    </div>
  );
};

export default StoreFrontPOS;
