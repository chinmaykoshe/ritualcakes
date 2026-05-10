import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useCustomization } from "../context/customizeContext";
import { designnames } from "../designs/designassets";
import { motion } from "framer-motion";
import { FaArrowLeft, FaUser, FaPhoneAlt, FaMapMarkerAlt, FaWeightHanging, FaShapes, FaMagic, FaCalendarAlt, FaPenNib, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const availableCakeTypes = {
  "0.5 kg": ["Round", "Heart", "Square"],
  "1 kg": ["Round", "Heart", "Square"],
  "1.5 kg": ["Round", "Square"],
  "2 kg": ["Square"],
  "2.5 kg": ["Square"],
  "3 kg": ["Square"],
  "3.5 kg": ["Square"],
  "4 kg": ["Square"],
};

const flavors = [
  "Plain Chocolate", "Chocochips Zebra", "Vanilla Chocochips", "Hazelnut Mousse Cream Cake",
  "White Forest", "Black Forest", "Chocolate Forest", "Belgium Chocolate", "Coffee", "Roasted Almond",
  "Dairy Milk", "Dry Fruits", "Hazelnut Nutella", "Dairy Milk Dry Fruits", "KitKat", "Alpento (White Chocolate + Dark Chocolate)",
  "Casotto (Strawberry Crush + Roasted Almonds)", "Celebration (Butterscotch + Chocolate)", "Truffle",
  "Chocochips Truffle", "White Truffle", "White Chocochips Truffle", "Roasted Almond Truffle",
  "Walnut Brownie", "Cashew Nut Brownie", "Vanilla", "Mango", "Strawberry", "Blueberry", "Litchi",
  "Bubble Gum", "Opera (Mixed Flavors)", "Berry Berry (Strawberry + Pineapple)", "Butterscotch",
  "Berry Custard (Strawberry + Custard Apple)", "Tender Coconut", "Anjeer", "Rose Falooda", "Kulfi Falooda",
  "Rasmalai", "Rose Rasmalai", "Rajbhog", "Gulab Jamun", "Rabdi", "Kaju Katli", "Lotus Biscoff", "Kesar Milk",
  "Rose Milk", "American Ice Cream", "Red Velvet Cheesecake", "Blueberry Cheesecake", "Mango Cheesecake",
  "Pineapple (Real Fruit)", "Strawberry Sitaphal (Real Fruit)", "Cranberry(Real Fruit)", "Blueberry (Real Fruit)",
  "Mixed Fruit (Real Fruit)", "Strawberry (Real Fruit)", "Mango (Real Fruit)"
];

const DesignCustomizationPage = () => {
  const { designName } = useParams(); 
  const { formData, handleChange, submitCustomization, loading, error, success } = useCustomization();
  const [design, setDesign] = useState(null);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(formData.size || "");
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (designnames.hasOwnProperty(designName)) {
      const currentDesign = {
        name: designName,
        imageUrl: designnames[designName],
      };
      setDesign(currentDesign);
      formData.imageOrDesign = currentDesign.name; 
    }
  }, [designName, formData]);

  useEffect(() => {
    if (selectedSize) {
      setAvailableTypes(availableCakeTypes[selectedSize] || []);
    }
  }, [selectedSize]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      localStorage.setItem("pendingCustomization", JSON.stringify(formData));
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    submitCustomization(e); 
  };

  if (!design) {
    return (
      <div className="min-h-screen bg-bakery-cream/20 flex items-center justify-center p-8">
        <div className="card-premium p-12 text-center space-y-4">
          <FaExclamationTriangle className="text-bakery-rose text-4xl mx-auto" />
          <h2 className="text-2xl font-serif font-black text-bakery-chocolate">Design Not Found</h2>
          <button onClick={() => navigate('/designs')} className="btn-premium px-8">Back to Designs</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bakery-cream/10 pt-6 md:pt-10 pb-20 md:pb-32">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 xl:px-24">
        <header className="mb-8 md:mb-16 space-y-4 md:space-y-6 text-center md:text-left">
          <button onClick={() => navigate(-1)} className="inline-flex items-center space-x-2 text-bakery-chocolate/40 hover:text-bakery-pista-deep transition-colors font-black uppercase tracking-widest text-[10px] md:text-xs">
            <FaArrowLeft /> <span>Back to Inspiration</span>
          </button>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-black text-bakery-chocolate leading-tight">
            Customize Your <span className="text-bakery-rose italic font-medium">Ritual</span>
          </h1>
        </header>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 md:gap-16 items-start">
          {/* Design Preview - Removed Sticky, improved for mobile */}
          <div className="lg:col-span-5 w-full space-y-6 md:space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group w-full"
            >
              <div className="absolute -inset-2 md:-inset-4 bg-bakery-rose/10 rounded-[40px] md:rounded-[60px] -rotate-1" />
              <div className="relative z-10 bg-white p-2 md:p-4 rounded-[35px] md:rounded-[50px] shadow-premium overflow-hidden">
                <img
                  src={design.imageUrl}
                  alt={design.name}
                  className="w-full h-[400px] md:h-[600px] object-cover rounded-[30px] md:rounded-[40px] shadow-inner transform group-hover:scale-[1.02] transition-transform duration-700"
                />
              </div>
            </motion.div>
            
            <div className="card-premium p-6 md:p-8 bg-bakery-chocolate text-bakery-cream space-y-4 shadow-xl">
              <div className="flex items-center space-x-3 text-bakery-rose">
                <FaExclamationTriangle className="animate-pulse" />
                <span className="font-black text-[10px] md:text-xs uppercase tracking-widest">Ritual Guidelines</span>
              </div>
              <p className="text-xs md:text-sm font-medium opacity-80 leading-relaxed">
                For multi-tiered masterpieces, please select a weight above 1.5kg (2 tiers) or 2.5kg (3 tiers) to ensure structural integrity and aesthetic perfection.
              </p>
            </div>
          </div>

          {/* Customization Form */}
          <div className="lg:col-span-7 w-full">
            <form onSubmit={handleSubmit} className="card-premium p-6 md:p-12 bg-white space-y-10 md:space-y-12 shadow-2xl border border-bakery-pista/20">
              
              {/* Contact Section */}
              <div className="space-y-6 md:space-y-8">
                <div className="flex items-center space-x-4 border-b border-bakery-pista/30 pb-4 md:pb-6">
                  <div className="w-10 h-10 bg-bakery-rose/10 text-bakery-rose rounded-xl flex items-center justify-center shadow-sm"><FaUser /></div>
                  <h2 className="text-xl md:text-2xl font-serif font-black text-bakery-chocolate">Contact Details</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Sarah Jenkins"
                      className="input-premium"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">WhatsApp for Updates</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 00000 00000"
                      className="input-premium"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Delivery Destination</label>
                    <textarea
                      name="address"
                      placeholder="Street, Building, Apartment No..."
                      className="input-premium h-24 pt-4 resize-none"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Specs Section */}
              <div className="space-y-6 md:space-y-8">
                <div className="flex items-center space-x-4 border-b border-bakery-pista/30 pb-4 md:pb-6">
                  <div className="w-10 h-10 bg-bakery-chocolate/10 text-bakery-chocolate rounded-xl flex items-center justify-center shadow-sm"><FaMagic /></div>
                  <h2 className="text-xl md:text-2xl font-serif font-black text-bakery-chocolate">Cake Specifications</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Intended Weight</label>
                    <select
                      name="size"
                      className="input-premium appearance-none bg-white cursor-pointer"
                      value={selectedSize}
                      onChange={(e) => {
                        setSelectedSize(e.target.value);
                        handleChange(e);
                      }}
                      required
                    >
                      <option value="">Select Ritual Size</option>
                      {Object.keys(availableCakeTypes).map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Desired Shape</label>
                    <select
                      name="cakeType"
                      className="input-premium appearance-none bg-white cursor-pointer"
                      value={formData.cakeType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Ritual Shape</option>
                      {availableTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Signature Flavor</label>
                    <select
                      name="flavor"
                      className="input-premium appearance-none bg-white cursor-pointer"
                      value={formData.flavor}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Discover your flavor...</option>
                      {flavors.map((flavor) => (
                        <option key={flavor} value={flavor}>{flavor}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Delivery Section */}
              <div className="space-y-6 md:space-y-8">
                <div className="flex items-center space-x-4 border-b border-bakery-pista/30 pb-4 md:pb-6">
                  <div className="w-10 h-10 bg-bakery-rose/10 text-bakery-rose rounded-xl flex items-center justify-center shadow-sm"><FaCalendarAlt /></div>
                  <h2 className="text-xl md:text-2xl font-serif font-black text-bakery-chocolate">Delivery Ritual</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Scheduled Date & Time</label>
                    <input
                      type="datetime-local"
                      name="deliveryDate"
                      className="input-premium bg-white"
                      value={formData.deliveryDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Personal Message</label>
                    <input
                      type="text"
                      name="message"
                      placeholder="e.g. Forever yours, Mike"
                      className="input-premium"
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold flex items-center gap-3 text-sm"
                >
                  <FaExclamationTriangle />
                  <span>{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-10 bg-green-50 text-green-700 rounded-[40px] text-center space-y-6 border border-green-100 shadow-inner"
                >
                  <FaCheckCircle className="text-6xl mx-auto text-green-500" />
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif font-black">Ritual Inquiry Received</h3>
                    <p className="text-sm opacity-70">Our artisan will contact you on WhatsApp shortly.</p>
                  </div>
                  <button onClick={() => navigate("/orders")} className="btn-premium px-12 bg-green-600 border-none">Track Status</button>
                </motion.div>
              )}

              {!success && (
                <button
                  type="submit"
                  className="w-full btn-premium py-6 text-xl font-black shadow-premium transform active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{isLoggedIn ? "Send Ritual Inquiry" : "Login to Inquire"}</span>
                  )}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignCustomizationPage;
