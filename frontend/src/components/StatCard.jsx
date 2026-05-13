export default function StatCard({ label, value, icon, change, color = "indigo", loading }) {
  const colorMap = {
    indigo: "from-indigo-600 to-indigo-700 shadow-indigo-500/25",
    emerald: "from-emerald-600 to-emerald-700 shadow-emerald-500/25",
    amber: "from-amber-500 to-amber-600 shadow-amber-500/25",
    red: "from-red-600 to-red-700 shadow-red-500/25",
    violet: "from-violet-600 to-violet-700 shadow-violet-500/25",
  };

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-3 w-20 bg-white/10 rounded" />
            <div className="h-7 w-28 bg-white/10 rounded" />
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-200 group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
          <p className="text-white text-2xl font-bold tracking-tight">{value}</p>
          {change !== undefined && (
            <p className={`text-xs mt-1.5 font-medium ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {change >= 0 ? "▲" : "▼"} {Math.abs(change)}% vs last month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
