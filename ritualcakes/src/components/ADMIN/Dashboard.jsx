import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend, AreaChart, Area
} from "recharts";
import { FaChevronLeft, FaChevronRight, FaShoppingCart, FaWallet, FaChartBar, FaHistory, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";

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
  if (!orders.length) return [{ year: new Date().getFullYear(), month: new Date().getMonth() }];
  const all = orders.map(order => new Date(order.createdAt));
  const start = new Date(2025, 0, 1);
  const end = new Date(Math.max(...all.map(d => d.getTime())));
  let months = [];
  let cur = new Date(end.getFullYear(), end.getMonth(), 1);
  while (cur >= start) {
    months.push({ year: cur.getFullYear(), month: cur.getMonth() });
    cur.setMonth(cur.getMonth() - 1);
  }
  return months;
};

const getYearOptions = (orders) => {
  if (!orders.length) return [new Date().getFullYear()];
  const all = orders.map(order => new Date(order.createdAt));
  const startYear = 2025;
  const endYear = new Date(Math.max(...all.map(d => d.getTime()))).getFullYear();
  let years = [];
  for (let y = endYear; y >= startYear; y--) years.push(y);
  return years;
};

function Dashboard() {
  const [statData, setStatData] = useState({ mostSoldToday: "", bestSoldAllTime: "", totalCollectionToday: 0, totalOrdersToday: 0, totalOrdersAllTime: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState({ start: "", end: "" });

  const [salesMode, setSalesMode] = useState("month");
  const [salesMonthIdx, setSalesMonthIdx] = useState(0);
  const [salesYearIdx, setSalesYearIdx] = useState(0);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token) throw new Error("Please log in again.");
        if (role !== "admin") throw new Error("Access restricted.");

        const apiUrl = `/api/orders`;
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

  const monthOptions = getMonthOptions(filteredOrders);
  const yearOptions = getYearOptions(filteredOrders);

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
  };

  const salesCurrentMonth = monthOptions[salesMonthIdx] || { month: 0, year: 2025 };
  const salesCurrentYear = yearOptions[salesYearIdx] || 2025;
  const salesChartData = salesMode === "month"
    ? fillMonthWithZeros(getDailyStats(filteredOrders.filter(o =>
      new Date(o.createdAt).getFullYear() === salesCurrentMonth.year &&
      new Date(o.createdAt).getMonth() === salesCurrentMonth.month
    )), salesCurrentMonth.month, salesCurrentMonth.year)
    : fillYearWithMonths(filteredOrders.filter(o =>
      new Date(o.createdAt).getFullYear() === salesCurrentYear
    ), salesCurrentYear);

  const topCakes = getTopCakes(filteredOrders);

  const stats = [
    { title: "Total Revenue", value: `₹${filteredOrders.reduce((t, o) => t + o.totalAmount, 0).toFixed(0)}`, icon: <FaWallet />, color: "bg-blue-500" },
    { title: "Total Orders", value: filteredOrders.length, icon: <FaShoppingCart />, color: "bg-bakery-rose" },
    { title: "Best Selling", value: statData.bestSoldAllTime, icon: <FaChartBar />, color: "bg-bakery-chocolate" },
    { title: "Today's Orders", value: statData.totalOrdersToday, icon: <FaHistory />, color: "bg-green-500" },
  ];

  if (loading) return <div className="flex items-center justify-center h-96"><div className="w-12 h-12 border-4 border-bakery-rose border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-10">
      {/* Date Filter & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 rounded-3xl shadow-premium">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-3 bg-bakery-cream/30 px-4 py-2 rounded-2xl border border-bakery-pink/20">
            <FaCalendarAlt className="text-bakery-rose" />
            <input 
              type="date" 
              className="bg-transparent border-none focus:ring-0 text-sm font-bold"
              value={filter.start}
              onChange={e => setFilter({...filter, start: e.target.value})}
            />
            <span className="text-bakery-chocolate/20">to</span>
            <input 
              type="date" 
              className="bg-transparent border-none focus:ring-0 text-sm font-bold"
              value={filter.end}
              onChange={e => setFilter({...filter, end: e.target.value})}
            />
          </div>
          <button onClick={applyFilter} className="btn-premium py-2 px-6 text-sm">Apply Filter</button>
          <button onClick={() => {setFilter({start: "", end: ""}); setFilteredOrders(allOrders);}} className="text-sm font-bold text-bakery-chocolate/40 hover:text-bakery-rose transition-colors">Reset</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-premium p-6 bg-white flex items-center space-x-4"
          >
            <div className={`w-14 h-14 ${s.color} text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-bakery-chocolate/30">{s.title}</p>
              <h3 className="text-2xl font-serif font-black text-bakery-chocolate mt-1">{s.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sales Chart */}
        <div className="lg:col-span-2 card-premium p-8 bg-white space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-serif font-bold">Revenue Analytics</h3>
            <div className="flex bg-bakery-cream p-1 rounded-xl">
              <button 
                onClick={() => setSalesMode('month')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${salesMode === 'month' ? 'bg-white shadow-sm text-bakery-rose' : 'text-bakery-chocolate/40'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setSalesMode('year')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${salesMode === 'year' ? 'bg-white shadow-sm text-bakery-rose' : 'text-bakery-chocolate/40'}`}
              >
                Yearly
              </button>
            </div>
          </div>
          <div className="h-[350px] w-full relative">
            <ResponsiveContainer width="100%" height="100%" minHeight={350}>
              <AreaChart data={salesChartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E57373" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#E57373" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis 
                  dataKey={salesMode === "month" ? "day" : "month"} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fontWeight: 600, fill: '#A0A0A0'}} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fontWeight: 600, fill: '#A0A0A0'}} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
                    fontWeight: 'bold' 
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="collection" 
                  stroke="#E57373" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="card-premium p-8 bg-white space-y-6">
          <h3 className="text-xl font-serif font-bold">Top Products</h3>
          <div className="space-y-6">
            {topCakes.map((cake, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-bakery-cream rounded-xl flex items-center justify-center font-bold text-bakery-rose text-sm group-hover:bg-bakery-rose group-hover:text-white transition-colors">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-bold text-bakery-chocolate line-clamp-1">{cake.name}</p>
                    <p className="text-xs text-bakery-chocolate/40 font-bold uppercase tracking-widest">{cake.quantity} Sold</p>
                  </div>
                </div>
                <div className="h-1.5 w-16 bg-bakery-cream rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-bakery-rose" 
                    style={{ width: `${(cake.quantity / topCakes[0].quantity) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full btn-outline py-3 text-sm mt-4">Full Product Report</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
