import { useState } from "react";

const adminNavItems = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "billing", label: "Billing", icon: "🧾" },
  { id: "inventory", label: "Inventory", icon: "📦" },
  { id: "analytics", label: "Analytics", icon: "📈" },
   { id: "sales", label: "Sales History", icon: "📜" },
   {
  id: "ai-suggestions",
  label: "AI Suggestions",
  icon: "🤖"
},
{
  id: "predictions",
  label: "Predictions",
  icon: "📈"
},
];
const customerNavItems = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "billing", label: "My Orders", icon: "🛒" },
  { id: "profile", label: "Profile", icon: "👤" },
];

export default function Sidebar({ activePage, onNavigate, onLogout, user, aiSuggestionCount }) {
  const [collapsed, setCollapsed] = useState(false);
  // const navItems =
  // user?.role === "admin"
  //   ? adminNavItems
  //   : customerNavItems;
  const navItems = adminNavItems;

  return (
    <aside className={`${collapsed ? "w-20" : "w-64"} transition-all duration-300 bg-slate-900 border-r border-white/5 flex flex-col h-screen sticky top-0 z-30`}>
      {/* Logo */}
      <div className="p-5 border-b border-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
          <span className="text-lg">🛒</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="font-bold text-white text-sm truncate">SmartPOS</div>
            <div className="text-indigo-400 text-xs truncate">{user?.shop || "My Store"}</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-slate-400 hover:text-white transition-colors text-xs p-1 rounded-lg hover:bg-white/5"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
              ${activePage === item.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
          >
            <div className="relative flex items-center gap-3">
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {item.id === "ai-suggestions" && aiSuggestionCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white shadow-lg shadow-rose-500/30 px-1.5">
                  {aiSuggestionCount}
                </span>
              )}
            </div>
            {!collapsed && <span className="truncate">{item.label}</span>}
            {!collapsed && activePage === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80" />
            )}
          </button>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-white/5 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="overflow-hidden">
              <div className="text-white text-xs font-medium truncate">{user?.name || "User"}</div>
              <div className="text-slate-500 text-xs truncate">{user?.email || ""}</div>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <span className="text-base flex-shrink-0">🚪</span>
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
