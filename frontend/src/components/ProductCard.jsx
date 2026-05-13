export default function ProductCard({ product, onAdd }) {
  const isOut = product.stock === 0;
  const isLow = product.stock > 0 && product.stock <= 10;

  return (
    <div className={`bg-white/5 border rounded-2xl p-4 flex flex-col gap-3 transition-all duration-200 hover:bg-white/8 ${isOut ? "border-red-500/20 opacity-60" : "border-white/10"}`}>
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
          {product.image}
        </div>
        {isOut ? (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 font-medium">Out</span>
        ) : isLow ? (
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 font-medium">Low</span>
        ) : null}
      </div>
      <div>
        <p className="text-white text-sm font-medium leading-tight">{product.name}</p>
        <p className="text-slate-500 text-xs mt-0.5">{product.category}</p>
      </div>
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-2">
          <p className="text-indigo-400 font-bold text-base">₹{product.price.toFixed(2)}</p>
          <p className={`text-xs font-medium ${product.stock <= 0 ? "text-red-400" : product.stock < 5 ? "text-amber-400" : "text-slate-400"}`}>
            {product.stock} in stock
          </p>
        </div>
        
        {product.stock > 0 && product.stock < 5 && (
          <div className="mb-3 px-2 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
            <p className="text-xs text-amber-300 font-semibold text-center">⚡ Hurry! Only {product.stock} left</p>
          </div>
        )}
        
        <button
          onClick={() => onAdd(product)}
          disabled={product.stock <= 0}
          className={`w-full py-2.5 rounded-xl font-medium transition-all ${
            product.stock <= 0
              ? "bg-red-500/20 text-red-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
          }`}
        >
          {product.stock <= 0 ? "Out of Stock" : "Add"}
        </button>
      </div>
    </div>
  );
}
