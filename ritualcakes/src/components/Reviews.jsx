import React, { useState, useEffect } from "react";
import { use } from "react";
import { useNavigate } from "react-router-dom";

const Reviews = ({ orderID }) => {
  const userEmail = localStorage.getItem("user");
  const userName = userEmail ? userEmail.split("@")[0] : "Guest";
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [authorName, setAuthorName] = useState(userName);
  const [error, setError] = useState(null);
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const navigate = useNavigate();
  const apiUrl = `/api/reviews`;
  const isLoggedIn = !!localStorage.getItem("user");
  const fetchReviews = async () => {
    try {
      const response = await fetch(`${apiUrl}/${orderID}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError("Unable to load reviews. Please try again later.");
    }
  };

  useEffect(() => {
    if (orderID) {
      fetchReviews();
    }
  }, [orderID]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return setError("Please enter a review.");
    if (!authorName.trim()) return setError("Please provide your name.");
    const token = localStorage.getItem("token");
    if (!token) return setError("You must be logged in to post a review.");
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
      if (!response.ok) return setError(responseData.message || "Failed to submit review.");
      setReviews((prev) => [responseData, ...prev]);
      setNewReview("");
      setError(null);
    } catch {
      setError("Failed to submit review. Please try again later.");
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
        setError("Failed to delete review.");
      }
    } catch {
      setError("Error deleting review.");
    } finally {
      setDeletingReviewId(null);
    }
  };
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000); // Clear after 3 seconds
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [error]);
  const clearError = () => setError(null); // Clear error on input focus

  return (
    <div className="reviews mt-4">
      <h4 className="text-sm font-semibold text-gray-800">Customer Reviews:</h4>
      {reviews.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {reviews.map((review) => (
            <li
              key={review._id}
              className="text-sm text-gray-700 bg-white px-4 py-4 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <p className="font-bold text-gray-900">{review.authorName}</p>
              <p className="italic text-gray-800 mt-2">"{review.content}"</p>
              {review.authorEmail === userEmail && (
                <button
                  onClick={() => handleDelete(review._id)}
                  className="text-red-500 mt-2 hover:text-red-700"
                  disabled={deletingReviewId === review._id}
                >
                  {deletingReviewId === review._id ? "Deleting..." : "Delete"}
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 text-gray-500">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      )}
      <hr className="border-2 border-darkcustombg1 m-12 md:mx-20" />
      {isLoggedIn ? (
        <>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Your Name"
              value={authorName}
              onFocus={clearError} 
              required
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4 text-gray-700">
            <div className="text-gray-700 w-full px-4 py-2 border rounded-lg bg-gray-100 flex items-center">
              <span className="text-gray-700">{userEmail}</span>
              <span className="text-gray-400 ml-2">uneditable</span>
            </div>
          </div>
          <div className="mt-4">
            <textarea
              placeholder="Write your review here..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              onFocus={clearError}
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </div>
          {error && <p className="text-red-500 text-center m-4">{error}</p>}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full mt-4 bg-darkcustombg2 text-white py-2 rounded-lg hover:bg-darkcustombg3 transition-all"
          >
            Submit Review
          </button>
        </>
      ) : (
        <>
          <p className="mt-4 text-gray-600">Please log in to post a review.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-darkcustombg2 text-white py-2 px-6 rounded-lg hover:text-darkcustombg2 hover:bg-white hover:border-2 hover:border-darkcustombg2"
          >
            Login to Post Review
          </button>
        </>
      )}
    </div>
  );
};

export default Reviews;