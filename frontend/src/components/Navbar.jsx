import { useState, useEffect } from "react";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar({ user, activePage, onNavigate, onLogout }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pageTitle = {
    dashboard: "Dashboard",
    billing: "Billing",
    inventory: "Inventory",
    analytics: "Analytics",
    "ai-suggestions": "AI Suggestions",
    sales: "Sales History",
    profile: "Profile"
  }[activePage] || "Dashboard";

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-20">
      <div>
        <h2 className="text-white font-semibold text-lg">{pageTitle}</h2>
        <p className="text-slate-500 text-xs">
          {time.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Live clock */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 text-xs font-mono">
            {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all">
          🔔
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-[8px] font-bold">3</span>
          </div>
        </button>

        {/* Profile */}
        <ProfileDropdown user={user} onNavigate={onNavigate} onLogout={onLogout} />
      </div>
    </header>
  );
}
