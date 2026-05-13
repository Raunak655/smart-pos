import { useState, useEffect } from "react";
import { api } from "../services/api";

const STATUS = (stock) => {
  if (stock === 0) return { label: "Out of Stock", cls: "bg-red-500/15 text-red-400 border-red-500/20" };
  if (stock <= 10) return { label: "Low Stock", cls: "bg-amber-500/15 text-amber-400 border-amber-500/20" };
  return { label: "In Stock", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" };
};

const EMPTY = { name: "", category: "Beverages", price: "", stock: "" };
const CATEGORIES = ["Beverages", "Snacks", "Bakery", "Condiments", "Confectionery"];

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    api.products.getAll().then(setProducts).finally(() => setLoading(false));
  }, []);

  const filtered = products
    .filter(p => p && typeof p.name === "string")
    .map(p => ({
      ...p,
      id: p.id ?? 0,
      price: Number(p.price || 0),
      stock: Number(p.stock || 0)
    }))
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      if (filter === "low") return matchSearch && p.stock > 0 && p.stock <= 10;
      if (filter === "out") return matchSearch && p.stock === 0;
      if (filter === "in") return matchSearch && p.stock > 10;
      return matchSearch;
    });

  const handleSubmit = async () => {
    if (!form.name || !form.price || form.stock === "") return;
    setFormLoading(true);
    try {
      const productData = {
        name: form.name,
        category: form.category,
        price: +form.price,
        stock: +form.stock,
        image: products.find(p => p.id === editId)?.image || "🛍️"
      };

      if (editId) {
        await api.products.update(editId, productData);
        setProducts(prev => prev.map(p => p.id === editId ? { ...p, ...productData, id: p.id } : p));
      } else {
        const newProd = await api.products.add(productData);
        setProducts(prev => [...prev, newProd]);
      }
      setForm(EMPTY);
      setShowForm(false);
      setEditId(null);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };
  const handleEdit = (p) => {
    setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.products.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product. Please try again.");
    }
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-sm" />
        </div>

        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
          {[["all", "All"], ["in", "In Stock"], ["low", "Low"], ["out", "Out"]].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${filter === v ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>
              {l}
            </button>
          ))}
        </div>

        <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY); }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/25">
          ＋ Add Product
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-white font-semibold mb-6 text-lg">{editId ? "✏️ Edit Product" : "➕ Add New Product"}</h3>
            
            <div className="space-y-4">
              {[
                { label: "Product Name", key: "name", type: "text", placeholder: "e.g. Green Tea" },
                { label: "Price (₹)", key: "price", type: "number", placeholder: "0.00" },
                { label: "Stock", key: "stock", type: "number", placeholder: "0" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">{label}</label>
                  <input 
                    type={type} 
                    value={form[key]} 
                    placeholder={placeholder} 
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-sm" 
                  />
                </div>
              ))}
              
              <div>
                <label className="text-slate-300 text-sm font-medium mb-2 block">Category</label>
                <select 
                  value={form.category} 
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm"
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button 
                onClick={handleSubmit} 
                disabled={formLoading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {formLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {editId ? "Saving..." : "Adding..."}
                  </>
                ) : editId ? "Save Changes" : "Add Product"}
              </button>
              <button 
                onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY); }} 
                className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium px-5 py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/3">
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left text-slate-400 text-xs font-medium px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(6).fill(0).map((__, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-white/5 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-slate-500">No products found</td></tr>
              ) : (
                filtered.map((p, index) => {
                  const status = STATUS(p.stock);
                  return (
                    <tr key={p.id || index} className="hover:bg-white/3 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg flex-shrink-0">{p.image}</div>
                          <span className="text-white text-sm font-medium">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-sm">{p.category}</td>
                      <td className="px-5 py-4 text-indigo-400 font-bold text-sm">₹{p.price.toFixed(2)}</td>
                      <td className="px-5 py-4 text-white text-sm font-medium">{p.stock}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${status.cls}`}>{status.label}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(p)} className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white transition-all">Edit</button>
                          <button onClick={() => setDeleteId(p.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-all">Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-white/10 text-slate-500 text-xs">
          Showing {filtered.length} of {products.length} products
        </div>
      </div>

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-3xl mb-3">🗑️</div>
            <h3 className="text-white font-semibold mb-2">Delete Product?</h3>
            <p className="text-slate-400 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-medium py-2.5 rounded-xl transition-all">Delete</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 text-sm py-2.5 rounded-xl transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
