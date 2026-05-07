import React, { useState, useEffect, } from "react";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAIL = "ritualcakes2019@gmail.com";

const OrdersPanel = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterAmount, setFilterAmount] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [hideAdminOrders, setHideAdminOrders] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState({
    createdAt: true,
    orderId: true,
    email: true,
    itemName: true,
    shape: true,
    quantity: true,
    price: true,
    weight: true,
    message: true,
    orderDate: true,
    orderTime: true,
    totalAmount: true,
    status: true,
    actions: true,
    delete: false,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const token = localStorage.getItem("token");
  const apiUrl = `https://ritualcakes-stg-92alpha.vercel.app/api/orders`;
  const updateOrderStatus = async (orderId, status) => {
    if (!token) {
      console.error("Token not found");
      return;
    }
    const order = orders.find((order) => order._id === orderId);
    const userEmail = order ? order.userEmail : null;
    const itemName = order ? order.orderItems[0].name : "Unknown Item";
    const itemWeight = order ? order.orderItems[0].weight : "Unknown Weight";
    if (!userEmail) {
      console.error("User email not found");
      return;
    }
    const confirmationMessage = `Are you sure you want to set ${userEmail}'s order of ${itemName} (Weight: ${itemWeight}) status to ${status}?`;
    const isConfirmed = window.confirm(confirmationMessage);
    if (!isConfirmed) {
      return;
    }
    try {
      const response = await axios.put(
        `${apiUrl}/${orderId}/status`,
        {
          status: status,
          userEmail: userEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error.response ? error.response.data : error.message);
      setError("Failed to update order status.");
    }
  };
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    const updatedOrder = await updateOrderStatus(orderId, newStatus);
    if (updatedOrder) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    }
    setUpdatingOrderId(null);
  };
  const deleteOrder = async (orderId) => {
    const confirmed = window.confirm("Are you sure you want to delete this order?");
    if (!confirmed) return;
    setLoading(true);
    try {
      if (!token) throw new Error("Token not found. Please log in again.");
      await axios.delete(`${apiUrl}/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to delete order");
      setError(err.response?.data?.message || err.message || "Failed to delete order");
    } finally {
      setLoading(false);
    }
  };
  const fetchOrders = async () => {
    setLoading(true);
    try {
      if (!token) throw new Error("Token not found. Please log in again.");
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  const filteredOrders = orders.filter((order) => {
    const matchesSearchQuery =
      !searchQuery ||
      [order.userEmail, order._id, order.deliveryAddress]
        .some((field) => field?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus ? order.status === filterStatus : true;
    const matchesDate = filterDate
      ? moment(order.orderDate).isSame(moment(filterDate), "day")
      : true;
    const matchesMaxAmount = (filterAmount === "" || parseFloat(filterAmount) === 0) ||
      (filterAmount && !isNaN(filterAmount) && order.totalAmount <= parseFloat(filterAmount));
    const matchesMinAmount = (minAmount === "" || parseFloat(minAmount) === 0) ||
      (minAmount && !isNaN(minAmount) && order.totalAmount >= parseFloat(minAmount));
    const notFromAdmin = hideAdminOrders ? order.userEmail?.toLowerCase() !== ADMIN_EMAIL : true;
    return matchesSearchQuery && matchesStatus && matchesDate && matchesMaxAmount && matchesMinAmount && notFromAdmin;
  });

  const sortedOrders = filteredOrders.sort((a, b) =>
    new Date(b.orderDate) - new Date(a.orderDate)
  );

  const renderColumnHeader = (column, label) => {
    return (
      <th className="border border-gray-300 px-4 py-2">
        {label}
      </th>
    );
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      Pending: "bg-gray-100",
      Completed: "bg-green-100",
      Accepted: "bg-yellow-100",
      Cancelled: "bg-red-100",
    };
    return statusClasses[status] || "";
  };
  const handleCheckboxChange = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };
  const generateCSV = () => {
    const headers = Object.keys(visibleColumns).filter(
      (column) => visibleColumns[column]
    );
    const csvData = [
      headers.join(","),
      ...sortedOrders.map((order) =>
        headers
          .map((column) => {
            if (column === "createdAt") return order.createdAt;
            if (column === "orderId") return order._id;
            if (column === "email") return order.userEmail;
            if (column === "itemName") return order.orderItems.map(item => item.name).join(", ");
            if (column === "shape") return order.orderItems.map(item => item.shape).join(", ");
            if (column === "quantity") return order.orderItems.map(item => item.quantity).join(", ");
            if (column === "price") return order.orderItems.map(item => item.price).join(", ");
            if (column === "weight") return order.orderItems.map(item => item.weight).join(", ");
            if (column === "message") return order.cakeMessage;
            if (column === "orderDate") return new Date(order.orderDate).toLocaleDateString();
            if (column === "orderTime") return order.orderTime;
            if (column === "totalAmount") return order.totalAmount;
            if (column === "status") return order.status;
            return "";
          })
          .join(",")
      ),
    ];

    return csvData.join("\n");
  };
  const downloadCSV = () => {
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "orders.csv";
    link.click();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pt-4 h-full">
      <h2 className="text-xl font-bold mb-4">Orders Panel</h2>
      <div className="flex items-center space-x-4 mb-4">

        <input
          type="text"
          className="border-2 border-gray-400 rounded px-2 py-1 h-10"
          placeholder="Search by Order ID, Email, or Address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="border-2 border-gray-400 rounded px-2 py-1 h-10"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Filter by Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Accepted">Accepted</option>
        </select>

        <input
          type="date"
          className="border-2 border-gray-400 rounded px-2 py-1 h-10"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />

        <input
          type="number"
          className="border-2 border-gray-400 rounded px-2 py-1 h-10"
          placeholder="Min Amount"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
          min="0"
        />

        <input
          type="number"
          className="border-2 border-gray-400 rounded px-2 py-1 h-10"
          placeholder="Max Amount"
          value={filterAmount}
          onChange={(e) => setFilterAmount(e.target.value)}
        />
        
        <div
          className="flex items-center space-x-2 border-2 border-gray-400 px-2 py-1 h-10 rounded-md bg-white"
          title="Hide orders from store"
        >
          <input
            type="checkbox"
            id="toggleAdminOrders"
            checked={hideAdminOrders}
            onChange={(e) => setHideAdminOrders(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="toggleAdminOrders" className="text-sm cursor-pointer">
            <i className="fa-solid fa-store"></i>
          </label>
        </div>


        <div
          className="flex items-center space-x-2 border-2 border-gray-400 px-2 py-1 h-10 rounded-md bg-white  hover:bg-red-500"
          title="Show or hide delete column"
        >
          <input
            type="checkbox"
            id="toggleDeleteColumn"
            checked={visibleColumns.delete}
            onChange={(e) =>
              setVisibleColumns((prev) => ({ ...prev, delete: e.target.checked }))
            }
            className="h-4 w-4"
          />
          <label
            htmlFor="toggleDeleteColumn"
            className="text-sm cursor-pointer flex items-center gap-1 whitespace-nowrap"
          >
            <i className="fa-solid fa-trash"></i>
            <span>Delete</span>
          </label>
        </div>

        <div className="relative">
          <button
            onClick={handleDropdownToggle}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 h-10"
          >
            Show/Hide
          </button>
          {dropdownOpen && (
            <div className="absolute bg-white shadow-lg border mt-2 rounded w-48 z-10">
              <div className="p-2">
                {Object.keys(visibleColumns).map((column) => (
                  <label key={column} className="block">
                    <input
                      type="checkbox"
                      checked={visibleColumns[column]}
                      onChange={() => handleCheckboxChange(column)}
                      className="mr-2"
                    />
                    {column}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 h-10 flex items-center space-x-2"
          onClick={downloadCSV}
        >
          <i className="fa-solid fa-download"></i>
          <span>.CSV</span>
        </button>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-1 my-4 rounded hover:bg-red-600"
        onClick={() => {
          setSearchQuery("");
          setFilterStatus("");
          setFilterDate("");
          setMinAmount("");
          setFilterAmount("");
          setHideAdminOrders("true");
        }}
      >
        Clear All Filters
      </button>
      {sortedOrders.length === 0 ? (
        <div className="text-center text-lg font-semibold mb-4">No orders yet</div>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr>
              {visibleColumns.createdAt && renderColumnHeader("createdAt", "Created on")}
              {visibleColumns.orderId && renderColumnHeader("orderId", "Order ID")}
              {visibleColumns.email && renderColumnHeader("email", "Customer Email")}
              {visibleColumns.itemName && renderColumnHeader("itemName", "Item Name")}
              {visibleColumns.shape && renderColumnHeader("shape", "Shape")}
              {visibleColumns.quantity && renderColumnHeader("quantity", "Quantity")}
              {visibleColumns.price && renderColumnHeader("price", "Price")}
              {visibleColumns.weight && renderColumnHeader("weight", "Weight")}
              {visibleColumns.message && renderColumnHeader("message", "Message")}
              {visibleColumns.orderDate && renderColumnHeader("orderDate", "Order Date")}
              {visibleColumns.orderTime && renderColumnHeader("orderTime", "Order Time")}
              {visibleColumns.totalAmount && renderColumnHeader("totalAmount", "Total")}
              {visibleColumns.status && renderColumnHeader("status", "Status")}
              {visibleColumns.actions && renderColumnHeader("actions", "Actions")}
              <th>Print Bill</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order, orderIndex) =>
              order.orderItems.map((item, itemIndex) => (
                <tr
                  key={`${order._id}-${itemIndex}`}
                  className={getStatusClass(order.status)}
                >
                  {itemIndex === 0 && visibleColumns.createdAt && (
                    <td className="border border-gray-300 px-4 py-2" rowSpan={order.orderItems.length}>
                      <p>{new Date(order.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p>
                    </td>
                  )}
                  {itemIndex === 0 && visibleColumns.orderId && (
                    <td className="border border-gray-300 px-4 py-2" rowSpan={order.orderItems.length}>
                      {order._id}
                    </td>
                  )}
                  {itemIndex === 0 && visibleColumns.email && (
                    <td className="border border-gray-300 px-4 py-2" rowSpan={order.orderItems.length}>
                      {order.userEmail}
                    </td>
                  )}
                  {visibleColumns.itemName && (
                    <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                  )}
                  {visibleColumns.shape && (
                    <td className="border border-gray-300 px-4 py-2">{item.shape}</td>
                  )}
                  {visibleColumns.quantity && (
                    <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                  )}
                  {visibleColumns.price && (
                    <td className="border border-gray-300 px-4 py-2">₹{item.price}</td>
                  )}
                  {visibleColumns.weight && (
                    <td className="border border-gray-300 px-4 py-2">{item.weight}</td>
                  )}
                  {itemIndex === 0 && visibleColumns.message && (
                    <td className="border border-gray-300 px-4 py-2" rowSpan={order.orderItems.length}>
                      {order.cakeMessage}
                    </td>
                  )}
                  {itemIndex === 0 && visibleColumns.orderDate && (
                    <td className="border border-gray-300 px-4 py-2" rowSpan={order.orderItems.length}>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                  )}
                  {itemIndex === 0 && visibleColumns.orderTime && (
                    <td className="border border-gray-300 px-4 py-2" rowSpan={order.orderItems.length}>
                      {order.orderTime}
                    </td>
                  )}
                  {itemIndex === 0 && visibleColumns.totalAmount && (
                    <td className="border border-gray-300 px-4 py-2" rowSpan={order.orderItems.length}>
                      ₹{order.totalAmount}
                    </td>
                  )}
                  {itemIndex === 0 && visibleColumns.status && (
                    <td className="border border-gray-300 px-4 py-2" rowSpan={order.orderItems.length}>
                      {order.status}
                    </td>
                  )}
                  {itemIndex === 0 && visibleColumns.actions && (
                    <td className="border border-gray-300 px-4 py-2" rowSpan={order.orderItems.length}>
                      <select
                        className="border border-gray-400 rounded px-2 py-1"
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        disabled={updatingOrderId === order._id}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Accepted">Accepted</option>
                      </select>
                      {updatingOrderId === order._id && (
                        <span className="text-blue-500 ml-2">Updating...</span>
                      )}
                    </td>
                  )}
                  {itemIndex === 0 && visibleColumns.delete && (
                    <td className="border border-gray-300 px-4 py-2" rowSpan={order.orderItems.length}>
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                        onClick={() => deleteOrder(order._id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                  {itemIndex === 0 && (
                    <td className="border border-gray-300 px-4 py-2" rowSpan={order.orderItems.length}>
                      <button
                        className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
                        onClick={() => navigate(`/admin/bill/${order._id}`)}
                      >
                        Print Bill
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersPanel;
