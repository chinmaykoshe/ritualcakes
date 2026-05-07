import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import { useCustomization } from "../context/customizeContext";
import { designnames } from "../designs/designassets";
import { div } from "framer-motion/client";

function Orders() {
  const { orders } = useOrder();
  const { customizations, setCustomizations, error: customizationError } = useCustomization();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("user");
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const handleImageLoad = () => {
    setLoading(false);
  };
  const handleImageError = (e) => {
    e.target.src = "/fallback-image.png";
    setLoading(false);
    setHasLoaded(true);
    setLoadError(true);
  };
  useEffect(() => {
    const fetchCustomizations = async () => {
      try {
        const response = await fetch(
          `https://ritualcakes-stg-92alpha.vercel.app/api/customizations/${userEmail}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch customizations");
        }
        const data = await response.json();
        setCustomizations(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (userEmail) {
      fetchCustomizations();
    }
  }, [userEmail, setCustomizations]);
  if (!userEmail) {
    return (
      <div className="mx-2 max-w-7xl md:mx-auto py-4 py-12 bg-white bg-opacity-70 rounded-lg md:px-2 lg:p-8 mt-2 lg:mt-16 shadow-lg">
        <div className="mb-6">
          <Link
            to="/"
            className="text-darkcustombg1 font-montserrat hover:text-darkcustombg1 active:text-darkcustombg2 transition-colors duration-300"
          >
            &larr; Back to Home
          </Link>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
          <p className="text-lg mb-4">Please log in to view your orders and customizations.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-darkcustombg2 text-white py-2 px-6 rounded-lg hover:text-darkcustombg2 hover:bg-white hover:border-2 hover:border-darkcustombg2"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-2 max-w-7xl md:mx-auto py-4 md:py-12 bg-white bg-opacity-70 rounded-lg md:px-2 lg:p-8 mt-2 lg:mt-16 shadow-lg">
      <div className="container mx-auto p-2 md:py-4 md:px-6">
        <div className="mb-6">
          <Link
            to="/"
            className="text-darkcustombg1 font-montserrat hover:text-darkcustombg1 active:text-darkcustombg2 transition-colors duration-300"
          >
            &larr; Back to Home
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center">Your Orders</h1>
        {loading ? (
          <p className="text-center">Loading orders...</p>
        ) : orders && orders.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 ">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-6 rounded-lg shadow-lg flex flex-col space-y-4 border border-opacity-30 border-darkcustombg2 "
              >
                {order.orderItems.map((item, index) => (
                  <div>
                    <p className="text-gray-600 font-bold text-xl my-2">Order id.: # {item._id}</p>
                    <div className="mb-6 ">
                      <span className="text-gray-500 text-lg ">
                        Ordered Placed on: <strong>{new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                        </strong>
                        &nbsp;To be delivered on: <strong>{new Date(order.orderDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                        </strong>
                        &nbsp;at <strong><span>{order.orderTime.split(':').slice(0, 2).join(':')}</span>
                        </strong>
                      </span>
                    </div>
                    <hr className="border-1 border-darkcustombg1 border-opacity-20 m-4 md:mx-20" />
                    <div
                      key={index}
                      className="flex flex-col md:flex-row items-start justify-between space-y-4 md:space-y-0 md:space-x-4"
                    >
                      <div>
                        <div
                          className="flex items-center space-x-4 cursor-pointer"
                          onClick={() => navigate(`/product/${item.orderID}`)}
                        >
                          <img
                            src={item.image || "/fallback-image.png"}
                            alt={item.name}
                            className="md:h-52 object-cover rounded-lg mb-4 md:mb-0"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <h2 className="text-xl font-bold cursor-pointer" onClick={() => navigate(`/product/${item.orderID}`)}>{item.name}</h2>
                        <p className="text-gray-500 text-sm">Shape: {item.shape}</p>
                        <p className="text-gray-500 text-sm">Weight: {item.weight}</p>
                        <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                        <p className="text-gray-500 text-sm">Amount: ₹ {item.price * item.quantity}</p>
                        <p className="text-gray-500 text-lg"><strong>Message: {order.cakeMessage}</strong></p>
                      </div>
                      <div className="flex flex-col space-y-2 mt-4">
                        <div className="flex items-center space-x-2">
                          <div className="align-left">
                            <span
                              className={`lg:m-2 md:m-2 mt-2 px-2 py-1 rounded 
                            ${order.status === "Completed"
                                  ? "bg-blue-200 text-blue-700"
                                  : order.status === "Pending"
                                    ? "bg-yellow-200 text-yellow-700"
                                    : order.status === "Accepted"
                                      ? "bg-green-200 text-green-700"
                                      : "bg-red-200 text-red-700"
                                }`}
                            >
                              {order.status}
                            </span>
                            <p className="lg:m-2 md:m-2 mt-2 text-gray-500 text-lg">
                              <strong>Address: {order.deliveryAddress}</strong>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center">
                        <button
                          onClick={() => {
                            const confirmCall = window.confirm("Call +91 8169296802 to cancel the order! OR Reply to the mail for cancellation !");
                            if (confirmCall) {
                              window.location.href = "tel:+91 8169296802";
                            }
                          }}
                          className="text-white bg-red-500 p-2 rounded-lg font-bold hover:bg-red-600 transition-colors"
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">You have no orders yet.</p>
        )}
        <div className="mt-12 space-y-8">
          <h1 className="text-3xl font-bold mb-6 text-center">All Customizations</h1>
          {customizations && customizations.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {customizations.map((customization, index) => (
                <div
                  className="p-6 bg-white pb-14 shadow-lg rounded-lg border border-gray-200 ">
                  <p className="text-gray-600 font-bold text-xl my-2">Order id.: # {customization._id}</p>
                  <div className="mb-6 ">
                    <span className="text-gray-500 text-lg ">
                      Ordered Placed on: <strong>{new Date(customization.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                      </strong>
                      &nbsp;To be delivered on: <strong>{new Date(customization.deliveryDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                      </strong>
                    </span>
                  </div>
                  <hr className="border-1 border-darkcustombg1 border-opacity-20 m-4 md:mx-20" />
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center lg:items-center items-left"
                  >
                    <div className="flex-1 space-y-2 text-gray-600 ">
                      <p><strong>Name:</strong> {customization.name}</p>
                      <p><strong>Email:</strong> {customization.email}</p>
                      <p><strong>Phone:</strong> {customization.phone}</p>
                      <p><strong>Address:</strong> {customization.address}</p>
                      <p><strong>Size:</strong> {customization.size}</p>
                      <p><strong>Cake Type:</strong> {customization.cakeType}</p>
                      <p><strong>Flavor:</strong> {customization.flavor}</p>
                      <p><strong>Message:</strong> {customization.message}</p>
                      <p><strong>Special Instructions:</strong> {customization.specialInstructions || "N/A"}</p>
                      <p>
                        <span
                          className={`px-2 py-1 rounded ${customization.approvalStatus === "approved"
                            ? "bg-green-200 text-green-700"
                            : customization.approvalStatus === "pending"
                              ? "bg-yellow-200 text-yellow-700"
                              : "bg-red-200 text-red-700"
                            }`}
                        >
                          {customization.approvalStatus}
                        </span>
                      </p>
                      <p className="text-lg"><strong>Price:</strong> Rs. {customization.price}</p>
                      <p><strong>Image or Design:</strong></p>
                      <p
                        className="break-all overflow-hidden text-ellipsis line-clamp-3 cursor-pointer"
                        onClick={() => {
                          const imagePath = customization.imageOrDesign.startsWith("http")
                            ? customization.imageOrDesign
                            : `/design/${customization.imageOrDesign}`;

                          window.open(imagePath, "_blank");
                        }}
                      >
                        {customization.imageOrDesign || "No image/design provided"}
                      </p>
                    </div>
                    <div className="m-4 md:mt-0 md:ml-8 md:w-1/3 lg:w-1/3 w-full">
                      {loading && !hasLoaded && !loadError && <div className="spinner">Loading...</div>}
                      {customization.imageOrDesign && (
                        <img
                          src={
                            customization.imageOrDesign.startsWith("http")
                              ? customization.imageOrDesign
                              : designnames?.[customization.imageOrDesign] || "/fallback-image.png"
                          }
                          alt={`Design: ${customization.imageOrDesign}`}
                          className="w-full h-full object-cover rounded-lg"
                          loading="lazy" // Improves performance by delaying loading until needed
                          onLoad={handleImageLoad}
                          onError={(e) => {
                            e.target.onerror = null; // Prevent infinite error loop
                            e.target.src = "/fallback-image.png"; // Fallback if image fails
                          }}
                        />
                      )}


                    </div>

                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => {
                          const confirmCall = window.confirm("Call +91 8169296802 to cancel the order! OR Reply to the mail for cancellation !");
                          if (confirmCall) {
                            window.location.href = "tel:+91 8169296802";
                          }
                        }}
                        className="text-white bg-red-500 p-2 rounded-lg font-bold hover:bg-red-600 transition-colors"
                      >
                        Cancel Order
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">You have no customizations yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;