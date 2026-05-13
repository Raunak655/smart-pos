import { useState, useRef, useEffect } from "react";

export default function ProfileDropdown({ user, onNavigate, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuClick = (action) => {
    setIsOpen(false);
    if (action === "view") {
      onNavigate?.("profile");
    } else if (action === "logout") {
      onLogout?.();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="flex items-center gap-2.5 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-sm font-bold text-white shadow-md">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="hidden sm:block">
          <div className="text-white text-sm font-medium leading-tight">{user?.name || "User"}</div>
          <div className="text-slate-400 text-xs text-left">Store Owner</div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700">
            <p className="text-sm text-white font-medium">{user?.name || "User"}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email || "user@example.com"}</p>
          </div>
          <div className="py-1">
            <button
              onClick={() => handleMenuClick("view")}
              className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
               View / Edit Profile
            </button>
            <button
              onClick={() => handleMenuClick("logout")}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
