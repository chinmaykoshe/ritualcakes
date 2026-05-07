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
    <div className="min-h-screen bg-bakery-cream/20 pt-10 pb-32">
      <div className="container mx-auto px-8 lg:px-16 xl:px-24">
        <header className="mb-16 space-y-6">
          <button onClick={() => navigate(-1)} className="inline-flex items-center space-x-2 text-bakery-chocolate/40 hover:text-bakery-rose transition-colors font-black uppercase tracking-widest text-xs">
            <FaArrowLeft /> <span>Back to Inspiration</span>
          </button>
          <h1 className="text-5xl lg:text-7xl font-serif font-black text-bakery-chocolate">
            Customize This <span className="text-bakery-rose italic font-medium">Ritual</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Design Preview */}
          <div className="lg:col-span-5 space-y-8 sticky top-32">
            <div className="relative group">
              <div className="absolute -inset-4 bg-bakery-rose/10 rounded-[60px] -rotate-2" />
              <div className="relative z-10 bg-white p-4 rounded-[50px] shadow-premium">
                <img
                  src={design.imageUrl}
                  alt={design.name}
                  className="w-full h-[600px] object-cover rounded-[40px] shadow-inner"
                />
              </div>
            </div>
            
            <div className="card-premium p-8 bg-bakery-chocolate text-bakery-cream space-y-4">
              <div className="flex items-center space-x-3 text-bakery-rose">
                <FaExclamationTriangle />
                <span className="font-black text-xs uppercase tracking-widest">Important Note</span>
              </div>
              <p className="text-sm font-medium opacity-80 leading-relaxed">
                If this design is multi-tiered, please choose a weight above 1.5kg for 2 tiers or 2.5kg for 3 tiers.
              </p>
            </div>
          </div>

          {/* Customization Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="card-premium p-8 md:p-12 bg-white space-y-12 shadow-2xl">
              
              {/* Contact Section */}
              <div className="space-y-8">
                <div className="flex items-center space-x-4 border-b border-bakery-pink pb-4">
                  <div className="w-10 h-10 bg-bakery-rose text-white rounded-xl flex items-center justify-center shadow-lg"><FaUser /></div>
                  <h2 className="text-2xl font-serif font-black text-bakery-chocolate">Contact Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      className="input-premium"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">WhatsApp Number</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91"
                      className="input-premium"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Delivery Address</label>
                    <textarea
                      name="address"
                      placeholder="Full delivery address..."
                      className="input-premium h-24 pt-3 resize-none"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Specs Section */}
              <div className="space-y-8">
                <div className="flex items-center space-x-4 border-b border-bakery-pink pb-4">
                  <div className="w-10 h-10 bg-bakery-chocolate text-white rounded-xl flex items-center justify-center shadow-lg"><FaMagic /></div>
                  <h2 className="text-2xl font-serif font-black text-bakery-chocolate">Cake Specifications</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Size (Weight)</label>
                    <select
                      name="size"
                      className="input-premium appearance-none"
                      value={selectedSize}
                      onChange={(e) => {
                        setSelectedSize(e.target.value);
                        handleChange(e);
                      }}
                      required
                    >
                      <option value="">Select Size</option>
                      {Object.keys(availableCakeTypes).map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Cake Shape</label>
                    <select
                      name="cakeType"
                      className="input-premium appearance-none"
                      value={formData.cakeType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Shape</option>
                      {availableTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Select Flavor</label>
                    <select
                      name="flavor"
                      className="input-premium appearance-none"
                      value={formData.flavor}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Choose a flavor...</option>
                      {flavors.map((flavor) => (
                        <option key={flavor} value={flavor}>{flavor}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Delivery Section */}
              <div className="space-y-8">
                <div className="flex items-center space-x-4 border-b border-bakery-pink pb-4">
                  <div className="w-10 h-10 bg-bakery-rose text-white rounded-xl flex items-center justify-center shadow-lg"><FaCalendarAlt /></div>
                  <h2 className="text-2xl font-serif font-black text-bakery-chocolate">Event Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Delivery Date & Time</label>
                    <input
                      type="datetime-local"
                      name="deliveryDate"
                      className="input-premium"
                      value={formData.deliveryDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Message on Cake</label>
                    <input
                      type="text"
                      name="message"
                      placeholder="Happy Birthday..."
                      className="input-premium"
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold flex items-center gap-3">
                  <FaExclamationTriangle />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-8 bg-green-50 text-green-700 rounded-[40px] text-center space-y-6 border border-green-100">
                  <FaCheckCircle className="text-5xl mx-auto" />
                  <h3 className="text-2xl font-serif font-black">Inquiry Sent!</h3>
                  <button onClick={() => navigate("/orders")} className="btn-premium px-12">Track Order</button>
                </div>
              )}

              {!success && (
                <button
                  type="submit"
                  className="w-full btn-premium py-5 text-xl font-black shadow-xl transform active:scale-[0.98] transition-all"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : isLoggedIn ? "Submit Ritual Inquiry" : "Login to Submit"}
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
