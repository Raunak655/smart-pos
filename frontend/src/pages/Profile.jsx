import { useState, useEffect } from "react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "User",
    email: "user@example.com",
    role: "Store Owner",
    phone: "+1 234 567 890",
  });

  useEffect(() => {
    // Optionally fetch user profile data here from API
    // if using real data from the backend
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate API call to save data
    console.log("Saving user profile", formData);
    setIsEditing(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-slate-400">Manage your personal information</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg border border-slate-700 transition-colors"
        >
          {isEditing ? "Cancel Edit" : "Edit Profile"}
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
            {formData.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{formData.name}</h2>
            <p className="text-slate-400">{formData.role}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
              <p className="text-sm text-slate-500 mb-1">Full Name</p>
              <p className="text-white font-medium">{formData.name}</p>
            </div>
            <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
              <p className="text-sm text-slate-500 mb-1">Email Address</p>
              <p className="text-white font-medium">{formData.email}</p>
            </div>
            <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
              <p className="text-sm text-slate-500 mb-1">Phone Number</p>
              <p className="text-white font-medium">{formData.phone}</p>
            </div>
            <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
              <p className="text-sm text-slate-500 mb-1">Role</p>
              <p className="text-white font-medium">{formData.role}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
