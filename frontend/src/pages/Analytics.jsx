import { useState, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { api } from "../services/api";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-800 border border-white/10 rounded-xl p-3 shadow-xl">
        <p className="text-slate-400 text-xs mb-2">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="text-xs font-medium">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

const URGENCY = {
  high: { cls: "bg-red-500/15 border-red-500/30 text-red-400", badge: "bg-red-500", label: "Urgent" },
  medium: { cls: "bg-amber-500/15 border-amber-500/30 text-amber-400", badge: "bg-amber-500", label: "Medium" },
  low: { cls: "bg-blue-500/15 border-blue-500/30 text-blue-400", badge: "bg-blue-500", label: "Low" },
};

export default function Analytics() {
  // const [sales, setSales] = useState([]);
  // const [trends, setTrends] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  // const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [dismissedIds, setDismissedIds] = useState([]);

  // useEffect(() => {
  //   Promise.all([
  //     api.analytics.getSales(),
  //     api.analytics.getDemandTrends(),
  //     // api.analytics.getAISuggestions(),
  //   ]).then(([s, t]) => {
  //     setSales(s);
  //     setTrends(t);
  //     // setSuggestions(ai);
  //   }).finally(() => setLoading(false));
  // }, []);
  useEffect(() => {

  api.analytics.getAnalytics()
    .then((data) => {

      setAnalytics(data);

    })
    .finally(() => setLoading(false));

}, []);

  // const totalProfit = sales.reduce((s, d) => s + d.profit, 0);
  // const totalSales = sales.reduce((s, d) => s + d.sales, 0);
  const totalSales = analytics?.total_revenue || 0;
  const totalProfit = totalSales * 0.3;
  const margin = totalSales ? ((totalProfit / totalSales) * 100).toFixed(1) : 0;

  // const activeSuggestions = suggestions.filter((_, i) => !dismissedIds.includes(i));
const salesChartData =
  analytics?.monthly_sales
    ? Object.entries(analytics.monthly_sales).map(
        ([month, sales]) => ({
          month,
          sales: Number(sales),
          profit: sales * 0.3
        })
      )
    : [];
    const categoryChartData =
  analytics?.category_distribution
    ? Object.entries(analytics.category_distribution).map(
        ([name, value]) => ({
          name,
          value
        })
      )
    : [];
  //   const demandTrendData =
  // analytics?.demand_trends?.map(item => ({
  //   name: item.product,
  //   demand: item.demand
  // })) || [];
  const demandTrendData =
  analytics?.demand_trends || [];
  return (
    <div className="p-6 space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Annual Revenue", value: `₹${(totalSales / 1000).toFixed(1)}K`, sub: "FY 2024", color: "text-indigo-400" },
          { label: "Total Profit", value: `₹${(totalProfit / 1000).toFixed(1)}K`, sub: "Net after expenses", color: "text-emerald-400" },
          { label: "Profit Margin", value: `${margin}%`, sub: "Revenue efficiency", color: "text-violet-400" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
            {loading ? <div className="space-y-2"><div className="h-3 w-20 bg-white/10 rounded animate-pulse" /><div className="h-7 w-24 bg-white/10 rounded animate-pulse" /></div> : (
              <>
                <p className="text-slate-400 text-xs">{label}</p>
                <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{sub}</p>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

  <h3 className="text-white font-semibold mb-4">
    Category Distribution
  </h3>

  <div className="space-y-3">

    {categoryChartData.map((item, i) => (

      <div
        key={i}
        className="flex items-center justify-between text-white"
      >
        <span>{item.name}</span>

        <span>{item.value}</span>
      </div>

    ))}

  </div>

</div>

      {/* Profit/Loss Area Chart */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-1">Profit & Loss Analysis</h3>
        <p className="text-slate-400 text-xs mb-6">Monthly breakdown — 2024</p>
        {loading ? <div className="h-56 bg-white/5 rounded-xl animate-pulse" /> : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesChartData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2} fill="url(#salesGrad)" name="Sales" />
              <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fill="url(#profitGrad)" name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Demand Trends */}
      { <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-1">Demand Trends</h3>
        <p className="text-slate-400 text-xs mb-6">Weekly category demand — last 6 weeks</p>
        {loading ? <div className="h-48 bg-white/5 rounded-xl animate-pulse" /> : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={demandTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {[
  { key: "Beverages", color: "#6366f1" },
  { key: "Snacks", color: "#ec4899" },
  { key: "Bakery", color: "#f59e0b" },
  { key: "Condiments", color: "#10b981" },
  { key: "Confectionery", color: "#8b5cf6" },
].map(({ key, color }) => (

  <Line
    key={key}
    type="monotone"
    dataKey={key}
    stroke={color}
    strokeWidth={3}
    dot={false}
  />

))}
            </LineChart>
          </ResponsiveContainer>
        )}
        <div className="flex flex-wrap gap-4 mt-3">
          {[["Beverages", "#6366f1"], ["Snacks", "#ec4899"], ["Bakery", "#f59e0b"], ["Tea", "#10b981"]].map(([l, c]) => (
            <div key={l} className="flex items-center gap-1.5 text-xs text-slate-400">
              <div className="w-4 h-0.5 rounded" style={{ background: c }} />{l}
            </div>
          ))}
        </div>
      </div> }

      {/* AI Suggestions */}
      {/* <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-xs">🤖</span>
              AI Suggestions
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">{activeSuggestions.length} actionable insights</p>
          </div>
          <div className="px-3 py-1 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-medium">
            Powered by AI
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : activeSuggestions.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-sm">All suggestions addressed!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeSuggestions.map((s, i) => {
              const u = URGENCY[s.urgency];
              return (
                <div key={i} className={`p-4 rounded-xl border ${u.cls} flex items-start gap-4`}>
                  <div className="text-2xl flex-shrink-0">{s.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white text-sm font-medium">{s.product}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${u.badge}`}>{u.label}</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{s.message}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all">Act</button>
                    <button onClick={() => setDismissedIds(p => [...p, suggestions.indexOf(s)])} className="text-xs px-2 py-1.5 rounded-lg hover:bg-white/10 text-slate-400 transition-all">✕</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div> */
      }
    </div>
  );
}
