
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// ---------- Utility Functions ----------
const fillMonthWithZeros = (stats, month, year) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let result = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month, d);
    const key = dt.toLocaleDateString("en-CA");
    const found = stats.find(item => item.day === key);
    result.push({
      day: d,
      orders: found ? found.orders : 0,
      collection: found ? found.collection : 0
    });
  }
  return result;
};
const fillYearWithMonths = (orders, year) => {
  let monthMap = {};
  for (let m = 0; m < 12; m++) {
    monthMap[m] = {
      monthIdx: m,
      month: new Date(year, m).toLocaleString("default", { month: "short" }),
      orders: 0,
      collection: 0
    };
  }
  orders.forEach(order => {
    const d = new Date(order.createdAt);
    if (d.getFullYear() === year) {
      monthMap[d.getMonth()].orders += 1;
      monthMap[d.getMonth()].collection += order.totalAmount;
    }
  });
  return Object.values(monthMap);
};
const getDailyStats = (orders) => {
  const dailyMap = {};
  orders.forEach(order => {
    const dateObj = new Date(order.createdAt);
    const d = dateObj.toLocaleDateString("en-CA");
    if (!dailyMap[d]) dailyMap[d] = { day: d, orders: 0, collection: 0 };
    dailyMap[d].orders++;
    dailyMap[d].collection += order.totalAmount;
  });
  return Object.values(dailyMap);
};
const getTopCakes = (orders) => {
  const cakeMap = {};
  orders.forEach(order => {
    order.orderItems.forEach(item => {
      cakeMap[item.name] = (cakeMap[item.name] || 0) + item.quantity;
    });
  });
  return Object.entries(cakeMap)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 6);
};
const getMostSoldCake = (orders) => {
  const cakeCount = {};
  orders.forEach(order => {
    order.orderItems.forEach(item => {
      cakeCount[item.name] = (cakeCount[item.name] || 0) + item.quantity;
    });
  });
  let mostSold = "";
  let maxCount = 0;
  for (const cake in cakeCount) {
    if (cakeCount[cake] > maxCount) {
      maxCount = cakeCount[cake];
      mostSold = cake;
    }
  }
  return mostSold || "N/A";
};
const getMonthOptions = (orders) => {
  const all = orders.map(order => new Date(order.createdAt));
  const start = new Date(2025, 10, 1);
  const end = all.length ? new Date(Math.max(...all.map(d => d.getTime()))) : new Date();
  let months = [];
  let cur = new Date(end.getFullYear(), end.getMonth(), 1);
  while (cur >= start) {
    months.push({ year: cur.getFullYear(), month: cur.getMonth() });
    cur.setMonth(cur.getMonth() - 1);
  }
  return months;
};
const getYearOptions = (orders) => {
  const all = orders.map(order => new Date(order.createdAt));
  const startYear = 2025;
  const endYear = all.length ? new Date(Math.max(...all.map(d => d.getTime()))).getFullYear() : new Date().getFullYear();
  let years = [];
  for (let y = endYear; y >= startYear; y--) years.push(y);
  return years;
};

function Dashboard() {
  // --- State ---
  const [statData, setStatData] = useState({ mostSoldToday: "", bestSoldAllTime: "", totalCollectionToday: 0, totalOrdersToday: 0, totalOrdersAllTime: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState({ start: "", end: "" });

  const [salesMode, setSalesMode] = useState("month");
  const [salesMonthIdx, setSalesMonthIdx] = useState(0);
  const [salesYearIdx, setSalesYearIdx] = useState(0);

  const [ordersMode, setOrdersMode] = useState("month");
  const [ordersMonthIdx, setOrdersMonthIdx] = useState(0);
  const [ordersYearIdx, setOrdersYearIdx] = useState(0);

  const [cakesYearIdx, setCakesYearIdx] = useState(0);

  // --- Fetch Data ---
  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token) throw new Error("Token not found. Please log in again.");
        if (role !== "admin") throw new Error("Access restricted. Only admins can view this data.");

        const apiUrl = `https://ritualcakes-stg-92alpha.vercel.app/api/orders`;
        const resp = await axios.get(apiUrl, { headers: { Authorization: `Bearer ${token}` } });

        setAllOrders(resp.data);
        setFilteredOrders(resp.data);

        const todayDate = new Date().toLocaleDateString("en-CA");
        const todayOrders = resp.data.filter(order => new Date(order.createdAt).toLocaleDateString("en-CA") === todayDate);

        setStatData({
          mostSoldToday: getMostSoldCake(todayOrders),
          bestSoldAllTime: getMostSoldCake(resp.data),
          totalCollectionToday: todayOrders.reduce((tot, o) => tot + o.totalAmount, 0),
          totalOrdersToday: todayOrders.length,
          totalOrdersAllTime: resp.data.length
        });
        setError(null);
      } catch (error) {
        setError(error.message || "Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  // --- Options (dependent on filtered data) ---
  const monthOptions = getMonthOptions(filteredOrders);
  const yearOptions = getYearOptions(filteredOrders);
  const cakesYearOptions = yearOptions;

  // --- Filters ---
  const applyFilter = () => {
    if (!filter.start || !filter.end) {
      setFilteredOrders(allOrders);
      return;
    }
    const filtered = allOrders.filter(order => {
      const orderDate = new Date(order.createdAt).toLocaleDateString("en-CA");
      return orderDate >= filter.start && orderDate <= filter.end;
    });
    setFilteredOrders(filtered);

    const todayDate = new Date().toLocaleDateString("en-CA");
    const todayOrders = filtered.filter(order => new Date(order.createdAt).toLocaleDateString("en-CA") === todayDate);

    setStatData({
      mostSoldToday: getMostSoldCake(todayOrders),
      bestSoldAllTime: getMostSoldCake(filtered),
      totalCollectionToday: todayOrders.reduce((tot, o) => tot + o.totalAmount, 0),
      totalOrdersToday: todayOrders.length,
      totalOrdersAllTime: filtered.length
    });
  };

  // --- Orders Chart ---
  const ordersCurrentMonth = monthOptions[ordersMonthIdx] || { month: 10, year: 2025 };
  const ordersCurrentYear = yearOptions[ordersYearIdx] || 2025;
  const ordersChartData = ordersMode === "month"
    ? fillMonthWithZeros(getDailyStats(filteredOrders.filter(o =>
      new Date(o.createdAt).getFullYear() === ordersCurrentMonth.year &&
      new Date(o.createdAt).getMonth() === ordersCurrentMonth.month
    )), ordersCurrentMonth.month, ordersCurrentMonth.year)
    : fillYearWithMonths(filteredOrders.filter(o =>
      new Date(o.createdAt).getFullYear() === ordersCurrentYear
    ), ordersCurrentYear);

  // --- Sales Chart ---
  const salesCurrentMonth = monthOptions[salesMonthIdx] || { month: 10, year: 2025 };
  const salesCurrentYear = yearOptions[salesYearIdx] || 2025;
  const salesChartData = salesMode === "month"
    ? fillMonthWithZeros(getDailyStats(filteredOrders.filter(o =>
      new Date(o.createdAt).getFullYear() === salesCurrentMonth.year &&
      new Date(o.createdAt).getMonth() === salesCurrentMonth.month
    )), salesCurrentMonth.month, salesCurrentMonth.year)
    : fillYearWithMonths(filteredOrders.filter(o =>
      new Date(o.createdAt).getFullYear() === salesCurrentYear
    ), salesCurrentYear);

  // --- Cakes Chart ---
  const currentCakesYear = cakesYearOptions[cakesYearIdx] || 2025;
  const cakesStats = getTopCakes(filteredOrders.filter(o =>
    new Date(o.createdAt).getFullYear() === currentCakesYear
  ));
  const safeCakesStats = cakesStats.length ? cakesStats : [{ name: "None", quantity: 0 }];

  // --- Combined Chart (Filtered Range) ---
  const combinedChartData = getDailyStats(filteredOrders).sort((a, b) => new Date(a.day) - new Date(b.day));

  // --- Render ---
  return (
    <div className="p-8 h-full font-montserrat bg-orange-50 min-h-screen">
      <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
      <p className="text-neutral-500 mt-2 mb-6">Welcome to the admin dashboard!</p>

      {/* Date Filter */}
      <div className="bg-white rounded-lg p-4 flex flex-col md:flex-row items-center gap-4 mb-6 shadow-sm">
        <span className="font-semibold text-neutral-700 mr-2">Filter by date:</span>
        <input type="date" className="border rounded px-2 py-1"
          value={filter.start} max={filter.end} onChange={e => setFilter(f => ({ ...f, start: e.target.value }))} />
        <span className="mx-2">to</span>
        <input type="date" className="border rounded px-2 py-1"
          value={filter.end} min={filter.start} onChange={e => setFilter(f => ({ ...f, end: e.target.value }))} />
        <button onClick={applyFilter}
          className="ml-2 px-4 py-1 rounded bg-darkcustombg text-white hover:bg-orange-400 transition">Apply</button>
        <button onClick={() => {
          setFilter({ start: "", end: "" }); setFilteredOrders(allOrders);
          const todayDate = new Date().toLocaleDateString("en-CA");
          const todayOrders = allOrders.filter(o => new Date(o.createdAt).toLocaleDateString("en-CA") === todayDate);
          setStatData({
            mostSoldToday: getMostSoldCake(todayOrders),
            bestSoldAllTime: getMostSoldCake(allOrders),
            totalCollectionToday: todayOrders.reduce((t, o) => t + o.totalAmount, 0),
            totalOrdersToday: todayOrders.length,
            totalOrdersAllTime: allOrders.length,
          });
        }}
          className="ml-2 px-3 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 border">Reset</button>
      </div>

      {loading ? (
        <div className="text-center mt-8"><p>Loading...</p></div>
      ) : error ? (
        <div className="text-center mt-8 text-red-500"><p>{error}</p></div>
      ) : (
        <>


          {/* Combined Orders + Sales */}
          <div className="bg-white p-4 rounded-lg shadow mb-10">
            <h3 className="font-semibold text-center mb-2">Orders vs Sales (Filtered Range)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={combinedChartData}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#fb923c" strokeWidth={3} dot={{ r: 2 }} name="Orders" />
                <Line type="monotone" dataKey="collection" stroke="#eab308" strokeWidth={3} dot={{ r: 2 }} name="Sales (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-neutral-100 rounded-lg p-6 shadow">
              <h2 className="text-lg font-semibold text-neutral-700">Most Sold Cake (Filtered)</h2>
              <p className="text-2xl font-bold text-neutral-900 mt-4">{statData.mostSoldToday}</p>
            </div>
            <div className="bg-neutral-100 rounded-lg p-6 shadow">
              <h2 className="text-lg font-semibold text-neutral-700">Best Sold Cake All Time</h2>
              <p className="text-2xl font-bold text-neutral-900 mt-4">{statData.bestSoldAllTime}</p>
            </div>
            <div className="bg-neutral-100 rounded-lg p-6 shadow">
              <h2 className="text-lg font-semibold text-neutral-700">Sales (Filtered)</h2>
              <p className="text-2xl font-bold text-neutral-900 mt-4">₹{filteredOrders.reduce((t, o) => t + o.totalAmount, 0).toFixed(2)}</p>
            </div>
            <div className="bg-neutral-100 rounded-lg p-6 shadow">
              <h2 className="text-lg font-semibold text-neutral-700">Orders</h2>
              <p className="text-2xl font-bold text-neutral-900 mt-4">
                Filtered: {filteredOrders.length}<br />All Time: {statData.totalOrdersAllTime}
              </p>
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white p-4 rounded-lg shadow mb-10">
            <div className="flex items-center justify-between mb-2">
              <button
                disabled={ordersMonthIdx >= monthOptions.length - 1}
                onClick={() => {
                  if (ordersMode === "month") setOrdersMonthIdx(i => Math.min(i + 1, monthOptions.length - 1));
                  else setOrdersYearIdx(i => Math.min(i + 1, yearOptions.length - 1));
                }}>
                <FaChevronLeft />
              </button>
              <div className="flex items-center gap-2">
                <button className={`px-4 py-1 rounded-l ${ordersMode === "month" ? "bg-orange-400 text-white" : "bg-gray-100 text-gray-600"}`}
                  onClick={() => setOrdersMode("month")}>Month</button>
                <button className={`px-4 py-1 rounded-r ${ordersMode === "year" ? "bg-orange-400 text-white" : "bg-gray-100 text-gray-600"}`}
                  onClick={() => setOrdersMode("year")}>Year</button>
              </div>
              <button
                disabled={ordersMonthIdx <= 0}
                onClick={() => {
                  if (ordersMode === "month") setOrdersMonthIdx(i => Math.max(i - 1, 0));
                  else setOrdersYearIdx(i => Math.max(i - 1, 0));
                }}>
                <FaChevronRight />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={ordersChartData}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey={ordersMode === "month" ? "day" : "month"} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#fb923c" strokeWidth={3} dot={{ r: 3 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sales Chart */}
          <div className="bg-white p-4 rounded-lg shadow mb-10">
            <div className="flex items-center justify-between mb-2">
              <button
                disabled={salesMonthIdx >= monthOptions.length - 1}
                className="bg-gray-100 hover:bg-orange-200 rounded-full p-2 disabled:opacity-60"
                onClick={() => {
                  if (salesMode === "month") setSalesMonthIdx(i => Math.min(i + 1, monthOptions.length - 1));
                  else setSalesYearIdx(i => Math.min(i + 1, yearOptions.length - 1));
                }}>
                <FaChevronLeft />
              </button>
              <div className="flex items-center gap-2">
                <button className={`px-4 py-1 rounded-l ${salesMode === "month" ? "bg-orange-400 text-white" : "bg-gray-100 text-gray-600"}`}
                  onClick={() => setSalesMode("month")}>Month</button>
                <button className={`px-4 py-1 rounded-r ${salesMode === "year" ? "bg-orange-400 text-white" : "bg-gray-100 text-gray-600"}`}
                  onClick={() => setSalesMode("year")}>Year</button>
              </div>
              <button
                disabled={salesMonthIdx <= 0}
                className="bg-gray-100 hover:bg-orange-200 rounded-full p-2 disabled:opacity-60"
                onClick={() => {
                  if (salesMode === "month") setSalesMonthIdx(i => Math.max(i - 1, 0));
                  else setSalesYearIdx(i => Math.max(i - 1, 0));
                }}>
                <FaChevronRight />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={salesChartData}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey={salesMode === "month" ? "day" : "month"} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="collection" stroke="#eab308" strokeWidth={3} dot={{ r: 3 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Cakes Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <button
                disabled={cakesYearIdx >= cakesYearOptions.length - 1}
                onClick={() => setCakesYearIdx(i => Math.min(i + 1, cakesYearOptions.length - 1))}>
                <FaChevronLeft />
              </button>
              <span className="font-semibold">Top Cakes {currentCakesYear}</span>
              <button
                disabled={cakesYearIdx <= 0}
                onClick={() => setCakesYearIdx(i => Math.max(i - 1, 0))}>
                <FaChevronRight />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={safeCakesStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#fb923c" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
