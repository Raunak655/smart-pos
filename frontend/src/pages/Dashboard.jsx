import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { api } from "../services/api";
import StatCard from "../components/StatCard";

const COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-800 border border-white/10 rounded-xl p-3 shadow-xl">
        <p className="text-slate-400 text-xs mb-2">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-medium" style={{ color: p.color }}>
            {p.name}: {typeof p.value === "number" && p.name?.toLowerCase().includes("sale") ? `₹${p.value.toLocaleString()}` : p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  // const [summary, setSummary] = useState(null);
  // const [sales, setSales] = useState([]);
  // const [topProducts, setTopProducts] = useState([]);
  // const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  // useEffect(() => {
  //   const load = async () => {
  //     try {
  //       const [s, sl, tp, cat] = await Promise.all([
  //         api.analytics.getSummary(),
  //         api.analytics.getSales(),
  //         api.analytics.getTopProducts(),
  //         api.analytics.getCategoryDistribution(),
  //       ]);
  //       setSummary(s);
  //       setSales(sl);
  //       setTopProducts(tp);
  //       setCategories(cat);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   load();
  // }, []);
useEffect(() => {

  api.analytics.getAnalytics()
    .then((data) => {

      setAnalytics(data);

    })
    .finally(() => setLoading(false));

}, []);
  
  // const stats = summary ? [
  //   { label: "Total Sales", value: `₹${(summary.totalSales / 1000).toFixed(1)}K`, icon: "💰", color: "indigo", change: 12.4 },
  //   { label: "Total Profit", value: `₹${(summary.totalProfit / 1000).toFixed(1)}K`, icon: "📈", color: "emerald", change: 8.7 },
  //   { label: "Total Products", value: summary.totalProducts, icon: "📦", color: "violet", change: 2.1 },
  //   { label: "Low Stock Items", value: summary.lowStock, icon: "⚠️", color: "amber", change: -3.2 },
  // ] : Array(4).fill(null);
  const stats = analytics ? [

  {
    label: "Total Revenue",
    value: `₹${(analytics.total_revenue || 0).toFixed(2)}`,
    icon: "💰",
    color: "indigo",
    change: 12.4
  },

  {
    label: "Total Orders",
    value: analytics.total_orders,
    icon: "🧾",
    color: "emerald",
    change: 8.7
  },

  {
    label: "Top Products",
    value: analytics.top_products?.length || 0,
    icon: "📦",
    color: "violet",
    change: 2.1
  },

  {
    label: "Low Stock Items",
    value: analytics.low_stock_count,
    icon: "⚠️",
    color: "amber",
    change: -3.2
  },

] : Array(4).fill(null);
const realTopProducts =
  analytics?.top_products?.map(item => ({
    name: item[0],
    sales: item[1]
  })) || [];
  const salesChartData =
  analytics?.monthly_sales
    ? Object.entries(analytics.monthly_sales).map(
        ([month, sales]) => ({
          month,
          sales,
          profit: sales * 0.3
        })
      )
    : [];

const categoryChartData =
  analytics?.category_distribution
    ? Object.entries(analytics.category_distribution).map(
        ([name, value], i) => ({
          name,
          value,
          color: COLORS[i % COLORS.length]
        })
      )
    : [];
  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) =>
          stat ? (
            <StatCard key={i} {...stat} />
          ) : (
            <StatCard key={i} loading />
          )
        )}
      </div>
      

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Line Chart */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold">Sales Overview</h3>
              <p className="text-slate-400 text-xs mt-0.5">Monthly revenue — 2024</p>
            </div>
            <div className="flex gap-2">
              {["6M", "12M", "YTD"].map((t) => (
                <button key={t} className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${t === "12M" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white bg-white/5"}`}>{t}</button>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="h-56 bg-white/5 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2.5} dot={false} name="Sales" />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2.5} dot={false} name="Profit" strokeDasharray="5 3" />
              </LineChart>
            </ResponsiveContainer>
          )}
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400"><div className="w-5 h-0.5 bg-indigo-500 rounded" />Sales</div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400"><div className="w-5 h-0.5 bg-emerald-500 rounded border-dashed" />Profit</div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-1">Category Split</h3>
          <p className="text-slate-400 text-xs mb-4">Revenue by category</p>
          {loading ? (
            <div className="h-56 bg-white/5 rounded-xl animate-pulse" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={categoryChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {categoryChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: "#1e293b", border: "1px solid #ffffff15", borderRadius: "12px", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {categoryChartData.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                      <span className="text-slate-300">{cat.name}</span>
                    </div>
                    <span className="text-slate-400 font-medium">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bar Chart - Top Products */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-1">Top Selling Products</h3>
        <p className="text-slate-400 text-xs mb-6">Units sold this month</p>
        {loading ? (
          <div className="h-48 bg-white/5 rounded-xl animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={realTopProducts} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #ffffff15", borderRadius: "12px", fontSize: "12px", color: "#fff" }} cursor={{ fill: "#ffffff05" }} />
              <Bar dataKey="sales" name="Units Sold" radius={[6, 6, 0, 0]}>
                {realTopProducts.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
