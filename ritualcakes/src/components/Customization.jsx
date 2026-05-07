import React, { useState } from 'react';
import { useCustomization } from '../context/customizeContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaWeightHanging, FaShapes, FaMagic, FaCalendarAlt, FaPenNib, FaCloudUploadAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import imageCompression from 'browser-image-compression';

function CustomizationForm() {
  const {
    formData,
    handleChange,
    submitCustomization,
    loading,
    error,
    success,
  } = useCustomization();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  const handleSizeChange = (event) => {
    handleChange(event);
  };

  const filteredCakeTypes = formData.size ? availableCakeTypes[formData.size] : [];
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);
  const minDateString = minDate.toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      localStorage.setItem("pendingCustomization", JSON.stringify(formData));
      navigate('/login', { state: { from: '/customization' } });
      return;
    }

    let fileToUpload = selectedFile;
    if (selectedFile && selectedFile.size > 500 * 1024) { // If larger than 500KB
      try {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        };
        fileToUpload = await imageCompression(selectedFile, options);
      } catch (err) {
        console.error("Compression failed:", err);
      }
    }
    submitCustomization(e, fileToUpload);
  };

  const isLoggedIn = localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-bakery-cream/20 pt-10 pb-32">
      <div className="container mx-auto px-8 lg:px-16 xl:px-32">
        {/* Header Section */}
        <header className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-6 py-2 bg-bakery-rose/10 text-bakery-rose rounded-full font-black text-xs uppercase tracking-[0.2em]"
          >
            Bespoke Creations
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-serif font-black text-bakery-chocolate"
          >
            Design Your <span className="text-bakery-rose italic font-medium">Ritual</span>
          </motion.h1>
          <p className="text-bakery-chocolate/60 max-w-2xl mx-auto font-medium">
            Every unique celebration deserves a masterpiece. Fill in the details below, and our artisans will bring your vision to life.
          </p>
        </header>

        {/* Removed Auth Warning for filling the form */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Form Area */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="card-premium p-8 md:p-12 bg-white space-y-12">
              
              {/* Section 1: Contact Information */}
              <div className="space-y-8">
                <div className="flex items-center space-x-4 border-b border-bakery-pink pb-4">
                  <div className="w-10 h-10 bg-bakery-rose text-white rounded-xl flex items-center justify-center shadow-lg"><FaUser /></div>
                  <h2 className="text-2xl font-serif font-black text-bakery-chocolate">Contact Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Full Name</label>
                    <div className="relative group">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/20 group-focus-within:text-bakery-rose transition-colors" />
                      <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        className="input-premium pl-12"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={false}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Email Address</label>
                    <div className="relative group">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/20" />
                      <input
                        type="email"
                        name="email"
                        className="input-premium pl-12 bg-bakery-cream/30 opacity-60"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Phone (WhatsApp Preferred)</label>
                    <div className="relative group">
                      <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/20 group-focus-within:text-bakery-rose transition-colors" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91 00000 00000"
                        className="input-premium pl-12"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        disabled={false}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Delivery Address</label>
                    <div className="relative group">
                      <FaMapMarkerAlt className="absolute left-4 top-4 text-bakery-chocolate/20 group-focus-within:text-bakery-rose transition-colors" />
                      <textarea
                        name="address"
                        placeholder="Flat no, Building, Street..."
                        className="input-premium pl-12 h-12 pt-3 resize-none"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        disabled={false}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Cake Specifications */}
              <div className="space-y-8">
                <div className="flex items-center space-x-4 border-b border-bakery-pink pb-4">
                  <div className="w-10 h-10 bg-bakery-chocolate text-white rounded-xl flex items-center justify-center shadow-lg"><FaMagic /></div>
                  <h2 className="text-2xl font-serif font-black text-bakery-chocolate">Cake Specifications</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Size (Weight)</label>
                    <div className="relative group">
                      <FaWeightHanging className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/20" />
                      <select
                        name="size"
                        className="input-premium pl-12 appearance-none"
                        onChange={handleSizeChange}
                        value={formData.size}
                        required
                        disabled={false}
                      >
                        <option value="">Select Weight</option>
                        {Object.keys(availableCakeTypes).map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Cake Shape</label>
                    <div className="relative group">
                      <FaShapes className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/20" />
                      <select
                        name="cakeType"
                        className="input-premium pl-12 appearance-none"
                        required
                        disabled={filteredCakeTypes.length === 0 || !isLoggedIn}
                        value={formData.cakeType}
                        onChange={handleChange}
                      >
                        <option value="">Select Shape</option>
                        {filteredCakeTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Artisan Flavor Selection</label>
                    <div className="relative group">
                      <FaMagic className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/20" />
                      <select
                        name="flavor"
                        className="input-premium pl-12 appearance-none"
                        value={formData.flavor}
                        onChange={handleChange}
                        required
                        disabled={false}
                      >
                        <option value="">Choose a flavor profile</option>
                        {flavors.map((flavor) => (
                          <option key={flavor} value={flavor}>{flavor}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Occasion & Style */}
              <div className="space-y-8">
                <div className="flex items-center space-x-4 border-b border-bakery-pink pb-4">
                  <div className="w-10 h-10 bg-bakery-rose text-white rounded-xl flex items-center justify-center shadow-lg"><FaPenNib /></div>
                  <h2 className="text-2xl font-serif font-black text-bakery-chocolate">Occasion & Style</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Event Date (Min 2 days notice)</label>
                    <div className="relative group">
                      <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/20" />
                      <input
                        type="date"
                        name="deliveryDate"
                        className="input-premium pl-12"
                        required
                        min={minDateString}
                        value={formData.deliveryDate}
                        onChange={handleChange}
                        disabled={false}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Message on Cake</label>
                    <div className="relative group">
                      <FaPenNib className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/20" />
                      <input
                        type="text"
                        name="message"
                        placeholder="Happy Birthday..."
                        className="input-premium pl-12"
                        value={formData.message}
                        onChange={handleChange}
                        disabled={false}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Reference Design (Upload Image)</label>
                    <div className="relative">
                      <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setSelectedFile(file);
                            setPreviewUrl(URL.createObjectURL(file));
                          }
                        }}
                      />
                      <label 
                        htmlFor="imageUpload"
                        className={`w-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${
                          previewUrl ? 'border-bakery-rose bg-bakery-rose/5' : 'border-bakery-pink/50 hover:border-bakery-rose hover:bg-bakery-cream/30'
                        }`}
                      >
                        {previewUrl ? (
                          <div className="relative group">
                            <img src={previewUrl} alt="Preview" className="h-40 w-40 object-cover rounded-2xl shadow-xl border-4 border-white" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center transition-opacity">
                              <span className="text-white text-xs font-black">CHANGE IMAGE</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <FaCloudUploadAlt className="text-5xl text-bakery-rose mb-4 animate-bounce" />
                            <p className="text-bakery-chocolate font-black uppercase text-xs tracking-widest">Click or Drag to Upload Inspiration</p>
                            <p className="text-bakery-chocolate/40 text-[10px] mt-2">JPG, PNG, WEBP (Max 5MB)</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-bakery-chocolate/40 ml-1">Special Instructions (Time preference, tier details...)</label>
                    <textarea
                      name="specialInstructions"
                      placeholder="Please mention delivery time (10 AM to 11 PM) or any other specific details."
                      className="input-premium min-h-[120px] pt-4"
                      value={formData.specialInstructions}
                      onChange={handleChange}
                      disabled={!isLoggedIn}
                    />
                  </div>
                </div>
              </div>

              {/* Status Messages */}
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold flex items-center space-x-3">
                  <FaExclamationTriangle />
                  <span>{error}</span>
                </motion.div>
              )}
              
              {success && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 bg-green-50 text-green-700 rounded-3xl border border-green-100 space-y-6 text-center">
                  <FaCheckCircle className="text-5xl mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif font-black">Inquiry Submitted!</h3>
                    <p className="font-medium">Our artisans will review your ritual request and contact you shortly.</p>
                  </div>
                  <button onClick={() => navigate("/orders")} className="btn-premium px-10">Check Order Status</button>
                </motion.div>
              )}

              {/* Submit Button */}
              {!success && (
                <button
                  type="submit"
                  className="w-full btn-premium py-5 text-xl font-black shadow-xl disabled:opacity-50 disabled:grayscale transition-all transform active:scale-[0.98]"
                  disabled={loading || !isLoggedIn}
                >
                  {loading ? (
                    <span className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Ritual...</span>
                    </span>
                  ) : "Submit Customization Request"}
                </button>
              )}
            </form>
          </div>

          {/* Sidebar / Guidelines Area */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="card-premium p-8 bg-bakery-chocolate text-bakery-cream space-y-6">
              <h3 className="text-xl font-serif font-black flex items-center space-x-3">
                <span className="text-bakery-rose text-2xl font-serif font-black">!</span>
                <span>Pro Baking Guidelines</span>
              </h3>
              <ul className="space-y-4 text-sm font-medium opacity-80 leading-relaxed">
                <li className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-bakery-rose rounded-full mt-1.5 shrink-0" />
                  <span>Multi-tiered designs require a minimum of 1.5kg (2 tiers) or 2.5kg (3 tiers).</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-bakery-rose rounded-full mt-1.5 shrink-0" />
                  <span>Custom orders must be placed at least 48 hours in advance.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-bakery-rose rounded-full mt-1.5 shrink-0" />
                  <span>Reference images help our artists match your vision perfectly.</span>
                </li>
              </ul>
            </div>

            <div className="card-premium p-8 bg-white border border-bakery-pink/20 space-y-6">
              <h3 className="text-xl font-serif font-black text-bakery-chocolate">Our Guarantee</h3>
              <p className="text-sm text-bakery-chocolate/50 font-medium leading-relaxed">
                Every custom Ritual Cake is a unique masterpiece. We guarantee premium quality ingredients and meticulous artistic attention.
              </p>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-bakery-cream overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Customer" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-bakery-rose text-white text-[10px] flex items-center justify-center font-black">
                  +1k
                </div>
              </div>
              <p className="text-xs font-bold text-bakery-rose">Join 1,000+ happy clients</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CustomizationForm;
