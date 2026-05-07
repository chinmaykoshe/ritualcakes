import React, { useState, useEffect } from "react";

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [error, setError] = useState(""); 
  const [searchTerm, setSearchTerm] = useState("");
  const apiUrl = '/api';
  useEffect(() => {
    fetchReviews();
  }, []);
  const fetchReviews = async () => {
    try {
      const response = await fetch(`${apiUrl}/reviews`);
      const data = await response.json();
      const groupedReviews = groupReviewsByProduct(data);
      setReviews(groupedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  const groupReviewsByProduct = (reviews) => {
    const grouped = reviews.reduce((acc, review) => {
      const { orderID } = review;
      if (!acc[orderID]) acc[orderID] = [];
      acc[orderID].push(review);
      return acc;
    }, {});
    return Object.entries(grouped).map(([productName, reviews]) => ({
      productName,
      reviews,
    }));
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const filteredReviews = reviews.filter(({ productName, reviews }) => {
    const productMatches = productName.toLowerCase().includes(searchTerm.toLowerCase());
    const reviewsMatch = reviews.some((review) =>
      review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.authorEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return productMatches || reviewsMatch;
  });

  const handleDeleteReview = async (orderID, reviewID) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this review?");
    if (!isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/reviews/${orderID}/${reviewID}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchReviews();
      } else {
        setError("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      setError("Error deleting review");
    }
  };
  const handleEditReview = (review) => {
    setEditingReview(review._id);
    setEditedContent(review.content);
  };

  const handleSaveEdit = async (reviewID) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/reviews/${reviewID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (response.ok) {
        fetchReviews();
        setEditingReview(null);
      } else {
        console.error("Failed to save the edited review");
      }
    } catch (error) {
      console.error("Error saving edited review:", error);
    }
  };

  return (
    <div>
      <h1>All Reviews</h1>
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search reviews..."
          className="border p-2 w-full"
        />
      </div>
      <table className="min-w-full bg-white border border-neutral-200">
        <thead>
          <tr className="grid grid-cols-6 text-left">
            <th className="border p-2">Order ID</th>
            <th className="border p-2 col-span-5">Reviews</th>
          </tr>
        </thead>
        <tbody>
          {filteredReviews.map(({ productName, reviews }) => (
            <tr key={productName} className="grid grid-cols-6 text-left border border-neutral-200">
              <td className="border px-2 py-4 "><span className="shadow-md py-1 px-2 font-bold uppercase">{productName} </span> </td>
              <td className="border p-2 col-span-5 ">
                {reviews.map((review) => (
                  <div key={review._id} className="flex justify-between items-center mb-2 shadow-md py-1 px-2 border-2 rounded-md">
                    <div className="flex items-center">
                      {editingReview === review._id ? (
                        <input
                          type="text"
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="border p-2 flex-1"
                        />
                      ) : (
                        <span>
                          <span className="font-bold">{review.authorEmail}</span>: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{review.content}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      {editingReview === review._id ? (
                        <button
                          onClick={() => handleSaveEdit(review._id)}
                          className="bg-green-500 text-white px-2 py-1 ml-2 rounded-md "
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditReview(review)}
                          className="bg-blue-500 text-white px-2 py-1 ml-2 rounded-md "
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReview(review.orderID, review._id)}
                        className="bg-red-500 text-white px-2 py-1 ml-2 rounded-md "
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewSection;
