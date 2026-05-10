import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaTrash, FaUserCircle, FaPaperPlane, FaQuoteLeft, FaLock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Reviews = ({ orderID }) => {
  const userEmail = localStorage.getItem("user");
  const userName = userEmail ? userEmail.split("@")[0] : "Guest";
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [authorName, setAuthorName] = useState(userName);
  const [error, setError] = useState(null);
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const navigate = useNavigate();
  const apiUrl = `/api/reviews`; // Using relative path for proxy
  const isLoggedIn = !!localStorage.getItem("token");

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${apiUrl}/${orderID}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError("Unable to load the ritual feedback.");
    }
  };

  useEffect(() => {
    if (orderID) {
      fetchReviews();
    }
  }, [orderID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return setError("Please share your ritual experience.");
    if (!authorName.trim()) return setError("Please provide your name.");
    const token = localStorage.getItem("token");
    if (!token) return setError("You must be logged in to share feedback.");
    
    try {
      const response = await fetch(`${apiUrl}/${orderID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newReview, authorName }),
      });
      const responseData = await response.json();
      if (!response.ok) return setError(responseData.message || "Failed to submit ritual feedback.");
      setReviews((prev) => [responseData, ...prev]);
      setNewReview("");
      setError(null);
    } catch {
      setError("Failed to share feedback. Please try again.");
    }
  };

  const handleDelete = async (reviewID) => {
    setDeletingReviewId(reviewID);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/${orderID}/${reviewID}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setReviews((prev) => prev.filter((review) => review._id !== reviewID));
      } else {
        setError("Failed to remove feedback.");
      }
    } catch {
      setError("Error removing feedback.");
    } finally {
      setDeletingReviewId(null);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-bakery-pista/30 pb-8">
        <div className="space-y-1">
          <h4 className="text-2xl font-serif font-black text-bakery-chocolate">Ritual Testimonials</h4>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-bakery-pista-deep/60">Genuine Customer Voices</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end text-bakery-rose space-x-1 mb-1">
            {[...Array(5)].map((_, i) => <FaStar key={i} size={14} />)}
          </div>
          <p className="text-xs font-bold text-bakery-chocolate/40 uppercase tracking-widest">{reviews.length} Experiences Shared</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {reviews.map((review) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative bg-white p-8 rounded-[32px] shadow-sm border border-bakery-pista/20 hover:border-bakery-pista-mid/40 transition-all group"
                >
                  <FaQuoteLeft className="absolute top-6 right-8 text-bakery-rose/5 text-4xl" />
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-bakery-pista-light rounded-full flex items-center justify-center text-bakery-pista-deep shadow-inner">
                      <FaUserCircle size={24} />
                    </div>
                    <div>
                      <p className="font-black text-bakery-chocolate text-sm uppercase tracking-widest">{review.authorName}</p>
                      <p className="text-[10px] font-bold text-bakery-chocolate/30">Verified Connoisseur</p>
                    </div>
                  </div>
                  <p className="italic text-bakery-chocolate/70 leading-relaxed font-medium">"{review.content}"</p>
                  
                  {review.authorEmail === userEmail && (
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="mt-6 flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-red-300 hover:text-red-600 transition-colors"
                      disabled={deletingReviewId === review._id}
                    >
                      <FaTrash size={10} />
                      <span>{deletingReviewId === review._id ? "Removing..." : "Remove Ritual Feedback"}</span>
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="py-20 text-center space-y-6 bg-bakery-pista-light/20 rounded-[40px] border-2 border-dashed border-bakery-pista/30">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-bakery-rose/20 text-3xl shadow-sm">
                <FaStar />
              </div>
              <div className="space-y-2">
                <p className="font-serif font-black text-bakery-chocolate text-xl">The first ritual is yours to tell.</p>
                <p className="text-sm text-bakery-chocolate/40 font-medium">Share your experience with our artisanal cakes.</p>
              </div>
            </div>
          )}
        </div>

        {/* Post Review Section */}
        <div className="sticky top-32">
          {isLoggedIn ? (
            <form onSubmit={handleSubmit} className="bg-bakery-chocolate text-white p-10 rounded-[48px] space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-bakery-pista-light/20 rounded-full -mr-16 -mt-16 blur-2xl" />
              
              <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                  <h5 className="text-2xl font-serif font-black">Share Your Ritual</h5>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-bakery-rose/60">Contribute to the collection</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Signature Name</label>
                    <input
                      type="text"
                      placeholder="Your ritual name..."
                      value={authorName}
                      required
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-white/20 outline-none focus:border-bakery-pista transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">The Experience</label>
                    <textarea
                      placeholder="Tell us about the texture, flavor, and moment..."
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-[28px] px-6 py-6 text-sm font-medium placeholder:text-white/20 outline-none focus:border-bakery-pista transition-all h-32 resize-none"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="text-red-400 text-xs font-black uppercase tracking-widest text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  className="w-full bg-bakery-pista-deep text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-bakery-chocolate transition-all shadow-xl flex items-center justify-center space-x-3"
                >
                  <FaPaperPlane size={14} />
                  <span>Publish Ritual Feedback</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-bakery-pista-light/30 p-12 rounded-[48px] text-center space-y-8 border border-bakery-pista/20 shadow-premium">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-bakery-rose shadow-sm">
                <FaLock />
              </div>
              <div className="space-y-3">
                <h5 className="text-xl font-serif font-black text-bakery-chocolate">Locked Rituals</h5>
                <p className="text-sm text-bakery-chocolate/40 font-medium leading-relaxed">Please sign in to share your personal ritual experience with our community.</p>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="btn-premium w-full"
              >
                Sign In to Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;