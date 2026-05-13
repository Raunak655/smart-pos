import jsPDF from "jspdf";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Billing() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [billLoading, setBillLoading] = useState(false);
  const [generatedBill, setGeneratedBill] = useState(null);

  useEffect(() => {
    api.products.getAll().then(setProducts).finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  // const addToCart = (product) => {
  //   setCart(prev => {
  //     const existing = prev.find(i => i.id === product.id);
  //     if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
  //     return [...prev, { ...product, quantity: 1 }];
  //   });
  // };
  const addToCart = (product) => {

  // OUT OF STOCK
  if (product.stock <= 0) {

    alert("Out of Stock");

    return;
  }

  // CHECK EXISTING CART ITEM
  const existing = cart.find(
    (item) => item.name === product.name
  );

  // INSUFFICIENT STOCK
  if (
    existing &&
    existing.quantity >= product.stock
  ) {

    alert(`Only ${product.stock} left in stock`);

    return;
  }

  // ADD TO CART
  if (existing) {

    setCart(

      cart.map((item) =>

        item.name === product.name

          ? {
              ...item,
              quantity: item.quantity + 1
            }

          : item
      )
    );

  } else {

    setCart([
      ...cart,
      {
        ...product,
        quantity: 1
      }
    ]);
  }
};

  const updateQty = (id, delta) => {
    setCart(prev => prev
      .map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0)
    );
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => { setCart([]); setGeneratedBill(null); };

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = total * 0.18;

  // const generateBill = async () => {
  //   if (!cart.length) return;
  //   setBillLoading(true);
  //   try {
  //     const bill = await api.billing.generateBill(cart);
  //     setGeneratedBill(bill);
  //   } finally {
  //     setBillLoading(false);
  //   }
  // };
  const generateBill = async () => {

  if (!cart.length) return;

  setBillLoading(true);

  try {

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const grandTotal = total + tax;

const billData = {

  items: cart,

  subtotal: total,

  tax,

  total: grandTotal
};

    const response = await api.billing.generateBill(billData);

    // setGeneratedBill({
    //   ...billData,
    //   message: response.msg
    // });

    alert("Bill saved successfully!");

  } catch (error) {

    console.error(error);
    alert("Failed to save bill");

  } finally {

    setBillLoading(false);

  }
};
// const downloadInvoice = () => {

//   if (!cart.length) return;

//   const doc = new jsPDF();

//   doc.setFontSize(18);
//   doc.text("SMART POS INVOICE", 20, 20);

//   let y = 40;

//   cart.forEach((item) => {

//     doc.text(
//       `${item.name} - ${item.quantity} x ₹${item.price}`,
//       20,
//       y
//     );

//     y += 10;
//   });

//   const total = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   doc.text(`Total: ₹${total}`, 20, y + 20);

//   doc.save("invoice.pdf");
// };
const downloadInvoice = () => {

  if (!cart.length) return;

  const doc = new jsPDF();

  // ===== STORE HEADER =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);

  doc.text("SMART POS STORE", 55, 20);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  doc.text("Address: Main Market, Delhi", 20, 35);
  doc.text("Phone: +91 9876543210", 20, 42);
  doc.text("Email: smartpos@gmail.com", 20, 49);

  // ===== DATE & TIME =====
  const currentDate = new Date();

  doc.text(`Invoice No: INV-${Date.now()}`, 130, 35);

  doc.text(
    `Date: ${currentDate.toLocaleDateString()}`,
    130,
    42
  );

  doc.text(
    `Time: ${currentDate.toLocaleTimeString()}`,
    130,
    49
  );

  // ===== LINE =====
  doc.line(20, 60, 190, 60);

  // ===== TABLE HEADER =====
  let y = 75;

  doc.setFont("helvetica", "bold");

  doc.text("Product", 20, y);
  doc.text("Qty", 110, y);
  doc.text("Price", 140, y);
  doc.text("Total", 170, y);

  y += 8;

  doc.line(20, y, 190, y);

  // ===== PRODUCT LIST =====
  doc.setFont("helvetica", "normal");

  y += 10;

  let grandTotal = 0;

  cart.forEach((item) => {

    const itemTotal = item.price * item.quantity;

    grandTotal += itemTotal;

    doc.text(item.name, 20, y);

    doc.text(String(item.quantity), 110, y);

    doc.text(`Rs ${item.price}`, 140, y);

    doc.text(`Rs ${itemTotal.toFixed(2)}`, 170, y);

    y += 10;
  });

  // ===== GST =====
  const gst = grandTotal * 0.18;

  const finalTotal = grandTotal + gst;

  y += 10;

  doc.line(120, y, 190, y);

  y += 10;

  doc.setFont("helvetica", "bold");

  doc.text(`Subtotal: Rs ${grandTotal.toFixed(2)}`, 130, y);

  y += 10;

  doc.text(`GST (18%): Rs ${gst.toFixed(2)}`, 130, y);

  y += 10;

  doc.setFontSize(14);

  doc.text(`Grand Total: Rs ${finalTotal.toFixed(2)}`, 120, y);

  // ===== FOOTER =====
  y += 25;

  doc.setFontSize(11);

  doc.setFont("helvetica", "normal");

  doc.text(
    "Thank you for shopping with us!",
    55,
    y
  );

  y += 8;

  doc.text(
    "Visit Again - SmartPOS",
    70,
    y
  );

  // ===== SAVE PDF =====
  doc.save(`Invoice-${Date.now()}.pdf`);
};

  return (
    <div className="p-6 h-full">
      <div className="flex gap-6 h-full" style={{ minHeight: "calc(100vh - 100px)" }}>
        {/* Products */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="mb-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-sm"
              />
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 h-40 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-1">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} onAdd={addToCart} />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-16 text-slate-500">
                  <div className="text-4xl mb-3">🔍</div>
                  <p>No products found for "{search}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="w-80 xl:w-96 flex-shrink-0 flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">Current Order</h3>
              <p className="text-slate-400 text-xs">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
            </div>
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10">
                Clear
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <div className="text-5xl mb-3">🛒</div>
                <p className="text-sm">Cart is empty</p>
                <p className="text-xs mt-1">Add products to get started</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xl flex-shrink-0">{item.image}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{item.name}</p>
                    <p className="text-indigo-400 text-xs font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm flex items-center justify-center transition-all">-</button>
                    <span className="text-white text-xs w-6 text-center font-bold">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-md bg-indigo-600/80 hover:bg-indigo-500 text-white text-sm flex items-center justify-center transition-all">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-500 hover:text-red-400 text-xs ml-1">✕</button>
                </div>
              ))
            )}
          </div>

          {/* Totals */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-white/10 space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span><span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST (18%)</span><span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-white/10">
                  <span>Total</span><span>₹{(total + tax).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={generateBill}
                disabled={billLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {billLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</> : "🧾 Generate Bill"}
              </button>
              <button
  onClick={downloadInvoice}
  className="w-full mt-3 bg-green-600 text-white py-3 rounded-xl"
>
  Download Invoice
</button>

              {generatedBill && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <button onClick={handleCheckout}>
  Checkout
</button>
                  <p className="text-emerald-400 text-xs font-medium">✅ Bill #{generatedBill.billId}</p>
                  <p className="text-slate-400 text-xs mt-0.5">Generated successfully!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
