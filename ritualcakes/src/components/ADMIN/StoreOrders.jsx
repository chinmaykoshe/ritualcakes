import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";

const StoreOrders = () => {
  const [adminOrders, setAdminOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FILTER STATES -- these are user-controlled, never cleared by reload!
  const [searchQuery, setSearchQuery] = useState("");
  const [shapeFilter, setShapeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedTotalDate, setSelectedTotalDate] = useState("");  // new

  // This function only fetches order data, nothing else.
  const fetchAdminOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("user");
      if (!token) throw new Error("Token not found. Please log in again.");
      if (!userEmail) throw new Error("User email not found.");
      const apiUrl = `/api/orders/${userEmail}`;
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const orders = Array.isArray(response.data)
        ? response.data
        : response.data.orders || [];
      const filteredOrders = orders.filter(order => order.userEmail === userEmail);
      const sortedOrders = filteredOrders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setAdminOrders(sortedOrders);
    } catch (err) {
      setError(err.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on mount; reload button calls fetchAdminOrders again.
  useEffect(() => {
    fetchAdminOrders();
  }, [fetchAdminOrders]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour12: true });
  };

  // FILTERED ORDERS, depends on controlled filter states (which never reset by reload)
  const filteredOrders = useMemo(() => {
    return adminOrders.filter(order =>
      order.orderItems.some(item => {
        const matchesSearchQuery =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (order.status && order.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (order.cakeMessage && order.cakeMessage.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesShapeFilter = shapeFilter ? item.shape === shapeFilter : true;
        const matchesDateFilter = dateFilter
          ? new Date(order.createdAt).toLocaleDateString("en-US") ===
          new Date(dateFilter).toLocaleDateString("en-US")
          : true;
        const matchesMinAmount = minAmount ? order.totalAmount >= Number(minAmount) : true;
        const matchesMaxAmount = maxAmount ? order.totalAmount <= Number(maxAmount) : true;
        return (
          matchesSearchQuery &&
          matchesShapeFilter &&
          matchesDateFilter &&
          matchesMinAmount &&
          matchesMaxAmount
        );
      })
    );
  }, [adminOrders, searchQuery, shapeFilter, dateFilter, minAmount, maxAmount]);

  // Today's total
  const todayTotal = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return adminOrders
      .filter((order) => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      })
      .reduce((total, order) => total + order.totalAmount, 0);
  }, [adminOrders]);

  // Total for selected date
  const totalForSelectedDate = useMemo(() => {
    if (!selectedTotalDate) return null;
    const chosen = new Date(selectedTotalDate);
    chosen.setHours(0, 0, 0, 0);
    return adminOrders
      .filter(order => {
        const od = new Date(order.createdAt);
        od.setHours(0, 0, 0, 0);
        return od.getTime() === chosen.getTime();
      })
      .reduce((total, order) => total + order.totalAmount, 0);
  }, [adminOrders, selectedTotalDate]);

  // Export visible (filtered) orders to CSV
  const exportToCSV = () => {
    const headers = [
      "Cake Name",
      "Shape",
      "Quantity",
      "Weight",
      "Total Amount",
      "Order Date",
      "Order Time",
    ];
    const rows = filteredOrders.flatMap(order =>
      order.orderItems.map(item => [
        item.name,
        item.shape,
        item.quantity || 1,
        item.weight,
        `₹${order.totalAmount}`,
        formatDate(order.createdAt),
        formatTime(order.createdAt),
      ])
    );
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8 h-full">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h2 className="text-xl font-bold">ORDERS FROM STORE</h2>
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center gap-2">
            <div className="border p-4 rounded bg-gray-100 shadow">
              <h3 className="text-lg font-semibold">Today's Total</h3>
              <p className="text-2xl font-bold">₹{todayTotal.toFixed(2)}</p>
            </div>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            >
              Export to CSV
            </button>
            <button
              onClick={fetchAdminOrders}
              className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
            >
              Reload Orders
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label className="mr-2 font-semibold text-gray-600">See Total For:</label>
            <input
              type="date"
              value={selectedTotalDate}
              onChange={e => setSelectedTotalDate(e.target.value)}
              className="border p-2 rounded"
            />
            {selectedTotalDate && (
              <div className="border p-4 rounded bg-gray-50 shadow">
                <h3 className="text-lg font-semibold">
                  Total for {new Date(selectedTotalDate).toLocaleDateString("en-US")}
                </h3>
                <p className="text-xl font-bold">
                  ₹{totalForSelectedDate?.toFixed(2) ?? 0}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-6 gap-4">
        <input
          type="text"
          placeholder="Search by Cake Name, Order ID, or Status"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={shapeFilter}
          onChange={(e) => setShapeFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Shapes</option>
          <option value="round">Round</option>
          <option value="square">Square</option>
          <option value="heart">Heart</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Min Amount"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Max Amount"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      {filteredOrders.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Cake Name</th>
              <th className="border border-gray-300 p-2">Shape</th>
              <th className="border border-gray-300 p-2">Quantity</th>
              <th className="border border-gray-300 p-2">Weight</th>
              <th className="border border-gray-300 p-2">Total Amount</th>
              <th className="border border-gray-300 p-2">Order Date</th>
              <th className="border border-gray-300 p-2">Order Time</th>
              <th className="border border-gray-300 p-2">Phone no</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) =>
              order.orderItems.map((item, index) => (
                <tr key={`${order._id}-${index}`}>
                  <td className="border border-gray-300 p-2">{item.name}</td>
                  <td className="border border-gray-300 p-2">{item.shape}</td>
                  <td className="border border-gray-300 p-2">{item.quantity || 1}</td>
                  <td className="border border-gray-300 p-2">{item.weight}</td>
                  <td className="border border-gray-300 p-2">₹{order.totalAmount}</td>
                  <td className="border border-gray-300 p-2">{formatDate(order.createdAt)}</td>
                  <td className="border border-gray-300 p-2">{formatTime(order.createdAt)}</td>
                  <td className={`border border-gray-300 p-2 ${order.cakeMessage === 'Ordered from store' ? 'text-gray-500' : 'text-black'}`}>
                    {order.cakeMessage}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-lg font-semibold mb-4">No orders available</div>
      )}
    </div>
  );
};

export default StoreOrders;
