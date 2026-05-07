import React, { useState, useEffect } from 'react';
import { elements } from '../../assets/assets';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import { FaPlus, FaSearch, FaTrash, FaEdit, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function CakesAvailable() {
  const [dbCakes, setDbCakes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    orderID: '',
    name: '',
    description: '',
    category: 'ChocolateCakes',
    basePrice: '350',
    sizes: ['Round', 'Heart', 'Square'],
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const localCakes = Object.values(elements).flat();

  const fetchDbCakes = async () => {
    try {
      const response = await axios.get('/api/products');
      setDbCakes(response.data);
    } catch (error) {
      console.error("Error fetching cakes:", error);
    }
  };

  useEffect(() => {
    fetchDbCakes();
  }, []);

  const allCakes = [...dbCakes, ...localCakes];

  const filteredCakes = allCakes.filter((cake) =>
    cake.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cake.orderID.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!selectedFile) return toast.error("Please select an image");
    
    setLoading(true);
    let fileToUpload = selectedFile;
    if (selectedFile && selectedFile.size > 500 * 1024) {
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
    
    const data = new FormData();
    data.append('image', fileToUpload);
    data.append('orderID', formData.orderID);
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('sizes', JSON.stringify(formData.sizes));
    
    // Create a prices object based on basePrice
    const prices = {
      "500g": parseInt(formData.basePrice),
      "1kg": parseInt(formData.basePrice) * 2,
      "1.5kg": parseInt(formData.basePrice) * 3,
      "2kg": parseInt(formData.basePrice) * 4
    };
    data.append('prices', JSON.stringify(prices));

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/products', data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Product added successfully!");
      setShowAddModal(false);
      fetchDbCakes();
      setFormData({ orderID: '', name: '', description: '', category: 'ChocolateCakes', basePrice: '350', sizes: ['Round', 'Heart', 'Square'] });
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Product deleted");
      fetchDbCakes();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <ToastContainer />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-black text-bakery-chocolate tracking-tight">Cakes Inventory</h2>
          <p className="text-gray-400 text-sm">Manage your available cakes and add new ones to MongoDB/Supabase.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-bakery-rose text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-bakery-rose/20 hover:scale-105 transition-all"
        >
          <FaPlus /> ADD NEW CAKE
        </button>
      </div>

      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search inventory by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-bakery-rose/50"
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Table View */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Image</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Details</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCakes.map((cake, idx) => (
                <tr key={cake._id || cake.orderID} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
                      <img src={cake.img} alt={cake.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-bakery-chocolate text-sm">{cake.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{cake.orderID}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-500">
                    {cake.category || 'Legacy (File)'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {cake._id && (
                        <button 
                          onClick={() => handleDelete(cake._id)}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash size={14} />
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                        <FaEdit size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-bakery-chocolate/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: 50, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.9 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-2xl font-serif font-black text-bakery-chocolate tracking-tight">Add New Cake</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-300 hover:text-bakery-chocolate transition-colors"><FaTimes size={24} /></button>
              </div>

              <form onSubmit={handleAddProduct} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Order ID / Code</label>
                    <input 
                      required
                      placeholder="e.g. CHOCO01"
                      className="w-full px-4 py-3 bg-gray-100 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-bakery-rose/20"
                      value={formData.orderID}
                      onChange={e => setFormData({...formData, orderID: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cake Name</label>
                    <input 
                      required
                      placeholder="e.g. Belgian Dark Truffle"
                      className="w-full px-4 py-3 bg-gray-100 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-bakery-rose/20"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    rows="3"
                    placeholder="Describe the richness..."
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-bakery-rose/20"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-100 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-bakery-rose/20"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      {Object.keys(elements).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Base Price (500g)</label>
                    <input 
                      type="number"
                      required
                      className="w-full px-4 py-3 bg-gray-100 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-bakery-rose/20"
                      value={formData.basePrice}
                      onChange={e => setFormData({...formData, basePrice: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cake Image (Upload to Supabase)</label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-[2rem] p-8 hover:border-bakery-rose/50 transition-colors group relative overflow-hidden min-h-[200px]">
                    {previewUrl ? (
                      <div className="absolute inset-0">
                        <img src={previewUrl} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => {setSelectedFile(null); setPreviewUrl(null);}}
                          className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg text-red-500"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <>
                        <FaCloudUploadAlt size={40} className="text-gray-300 group-hover:text-bakery-rose transition-colors mb-2" />
                        <p className="text-xs font-bold text-gray-400">Drag and drop or click to upload</p>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleFileChange}
                        />
                      </>
                    )}
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-bakery-rose text-white font-black rounded-2xl shadow-xl shadow-bakery-rose/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>CONFIRM & ADD TO DATABASE</>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CakesAvailable;
