import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { elements } from "../assets/assets";
import Card from "./Card";
import Reviews from "./Reviews.jsx";
import { useCart } from "../context/CartContext"; 
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus, FaStar, FaShoppingBag, FaArrowLeft } from "react-icons/fa";

const ProductPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState("500g");
  const [shape, setShape] = useState("Square");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [price, setPrice] = useState(0);
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    for (const category of Object.values(elements)) {
      const foundProduct = category.find((item) => item.orderID === orderId);
      if (foundProduct) {
        setProduct(foundProduct);
        break;
      }
    }
  }, [orderId]);

  useEffect(() => {
    if (product) {
      setPrice(product.prices[weight]);
      const availableShapes = getAvailableShapes(weight);
      if (!availableShapes.includes(shape)) {
        setShape(availableShapes[0]);
      }
    }
  }, [product, weight]);

  useEffect(() => {
    if (product && product.related) {
      const related = product.related
        .map((relatedId) => {
          for (const category of Object.values(elements)) {
            const found = category.find((item) => item.orderID === relatedId);
            if (found) return found;
          }
          return null;
        })
        .filter((item) => item !== null);
      setRelatedProducts(related);
    }
  }, [product]);

  const getAvailableShapes = (weight) => {
    if (weight === "500g") return ["Round", "Heart", "Square"];
    return ["Round", "Square"];
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try { 
      const productToAdd = {
        orderID: product.orderID,
        name: product.name,
        shape,
        weight,
        quantity,
        price,
        img: product.img,
      };
      await addToCart(productToAdd);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="min-h-screen bg-bakery-pista-light/30 pt-10 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center space-x-2 text-bakery-chocolate hover:text-bakery-pista-deep transition-colors mb-8 font-bold uppercase tracking-widest text-sm"
        >
          <FaArrowLeft /> <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Product Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-bakery-pista/10 rounded-[60px] group-hover:bg-bakery-pista/20 transition-all duration-700" />
            <img 
              src={product.img} 
              alt={product.name} 
              className="relative z-10 w-full h-[600px] object-cover rounded-[50px] shadow-premium"
            />
          </motion.div>

          {/* Product Details */}
          <div className="space-y-10">
            <header className="space-y-4">
              <div className="flex items-center space-x-2 text-bakery-rose">
                {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                <span className="text-sm font-bold text-bakery-chocolate/40 ml-2">(4.8 / 5 Rating)</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-serif font-black text-bakery-chocolate leading-tight">{product.name}</h1>
              <p className="text-3xl font-black text-bakery-rose">₹{price * quantity}</p>
            </header>

            <div className="space-y-8">
              {/* Weight Selection */}
              <div className="space-y-4">
                <p className="text-sm font-black uppercase tracking-widest text-bakery-chocolate/40">Choose Weight</p>
                <div className="flex flex-wrap gap-3">
                  {Object.keys(product.prices).map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeight(w)}
                      className={`px-6 py-3 rounded-2xl border-2 font-bold transition-all ${
                        weight === w 
                          ? 'border-bakery-pista-deep bg-bakery-pista-deep text-white shadow-lg' 
                          : 'border-bakery-pista/40 hover:border-bakery-pista-mid/50 text-bakery-chocolate'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shape Selection */}
              <div className="space-y-4">
                <p className="text-sm font-black uppercase tracking-widest text-bakery-chocolate/40">Select Shape</p>
                <div className="flex flex-wrap gap-3">
                  {getAvailableShapes(weight).map((s) => (
                    <button
                      key={s}
                      onClick={() => setShape(s)}
                      className={`px-6 py-3 rounded-2xl border-2 font-bold transition-all ${
                        shape === s 
                          ? 'border-bakery-chocolate bg-bakery-chocolate text-white shadow-lg' 
                          : 'border-bakery-pista/40 hover:border-bakery-pista-mid/50 text-bakery-chocolate'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-4">
                <p className="text-sm font-black uppercase tracking-widest text-bakery-chocolate/40">Quantity</p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center bg-white rounded-2xl p-1 shadow-sm border border-bakery-pista/30">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-bakery-pista-light transition-colors text-bakery-chocolate"
                    >
                      <FaMinus />
                    </button>
                    <span className="w-12 text-center font-black text-xl">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-bakery-pista-light transition-colors text-bakery-chocolate"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="w-full btn-premium py-5 text-xl flex items-center justify-center space-x-4 shadow-xl active:scale-95 transition-transform"
            >
              <FaShoppingBag />
              <span>{loading ? "Adding Ritual..." : "Add to Cart"}</span>
            </button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-24">
          <div className="flex space-x-12 border-b border-bakery-pista/30 mb-12">
            {['Description', 'Reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`pb-6 text-xl font-serif font-bold transition-all relative ${
                  activeTab === tab.toLowerCase() ? 'text-bakery-chocolate' : 'text-bakery-chocolate/30 hover:text-bakery-chocolate/60'
                }`}
              >
                {tab}
                {activeTab === tab.toLowerCase() && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-1 bg-bakery-pista-deep" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[300px]">
            {activeTab === 'description' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-xl text-bakery-chocolate/70 leading-relaxed max-w-4xl">
                <p>{product.description || "A masterpiece of baking ritual. Our artisanal cakes are made with fresh, carefully chosen ingredients and a genuine love for baking. From selecting quality flour, chocolate, and fruits, we use precision and care at every stage."}</p>
              </motion.div>
            ) : (
              <Reviews orderID={product.orderID} />
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 space-y-12">
            <h2 className="text-4xl font-serif font-bold">You Might Also Love</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <Card key={p.orderID} orderID={p.orderID} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;