export const products = [
  { id: 1, name: "Premium Coffee Beans", category: "Beverages", price: 24.99, stock: 45, image: "☕" },
  { id: 2, name: "Organic Green Tea", category: "Beverages", price: 14.99, stock: 8, image: "🍵" },
  { id: 3, name: "Artisan Sourdough Bread", category: "Bakery", price: 8.99, stock: 0, image: "🍞" },
  { id: 4, name: "Dark Chocolate Bar", category: "Confectionery", price: 6.49, stock: 120, image: "🍫" },
  { id: 5, name: "Almond Granola Mix", category: "Snacks", price: 11.99, stock: 34, image: "🥜" },
  { id: 6, name: "Cold Brew Kit", category: "Beverages", price: 32.99, stock: 5, image: "🧊" },
  { id: 7, name: "Vanilla Extract", category: "Condiments", price: 9.49, stock: 67, image: "🫙" },
  { id: 8, name: "Honey Jar 500g", category: "Condiments", price: 13.99, stock: 22, image: "🍯" },
  { id: 9, name: "Mixed Nuts Bag", category: "Snacks", price: 18.99, stock: 3, image: "🥜" },
  { id: 10, name: "Blueberry Muffins (6pk)", category: "Bakery", price: 12.49, stock: 15, image: "🫐" },
  { id: 11, name: "Sparkling Water 1L", category: "Beverages", price: 3.99, stock: 200, image: "💧" },
  { id: 12, name: "Protein Bar", category: "Snacks", price: 4.49, stock: 88, image: "💪" },
];

export const salesData = [
  { date: "Jan", sales: 12400, profit: 4200 },
  { date: "Feb", sales: 18600, profit: 6100 },
  { date: "Mar", sales: 15200, profit: 5300 },
  { date: "Apr", sales: 21800, profit: 7400 },
  { date: "May", sales: 19300, profit: 6800 },
  { date: "Jun", sales: 25600, profit: 9200 },
  { date: "Jul", sales: 28900, profit: 10100 },
  { date: "Aug", sales: 24100, profit: 8600 },
  { date: "Sep", sales: 31200, profit: 11400 },
  { date: "Oct", sales: 29800, profit: 10700 },
  { date: "Nov", sales: 35400, profit: 13200 },
  { date: "Dec", sales: 42100, profit: 15800 },
];

export const topProducts = [
  { name: "Coffee Beans", sales: 340 },
  { name: "Granola Mix", sales: 280 },
  { name: "Dark Choco", sales: 220 },
  { name: "Green Tea", sales: 195 },
  { name: "Honey Jar", sales: 160 },
  { name: "Protein Bar", sales: 145 },
];

export const categoryData = [
  { name: "Beverages", value: 38, color: "#6366f1" },
  { name: "Snacks", value: 24, color: "#ec4899" },
  { name: "Bakery", value: 18, color: "#f59e0b" },
  { name: "Condiments", value: 13, color: "#10b981" },
  { name: "Confectionery", value: 7, color: "#3b82f6" },
];

export const aiSuggestions = [
  { type: "restock", product: "Artisan Sourdough Bread", message: "Out of stock for 3 days. Restock immediately — 47 customer searches missed.", urgency: "high", icon: "📦" },
  { type: "price", product: "Premium Coffee Beans", message: "Demand is 34% above average. Consider raising price by ₹50–80 to maximize margin.", urgency: "medium", icon: "💰" },
  { type: "restock", product: "Cold Brew Kit", message: "Only 5 units left. Historical trend shows weekend spike — restock before Friday.", urgency: "high", icon: "📦" },
  { type: "discount", product: "Vanilla Extract", message: "67 units, slow movement. Bundle with Coffee Beans or offer 10% discount to clear.", urgency: "low", icon: "🏷️" },
  { type: "price", product: "Blueberry Muffins", message: "Competitors priced at ₹14.99. You can increase by ₹2.50 without losing demand.", urgency: "medium", icon: "💰" },
];

export const demandTrends = [
  { week: "W1", coffee: 85, tea: 40, snacks: 60, bakery: 30 },
  { week: "W2", coffee: 92, tea: 45, snacks: 55, bakery: 38 },
  { week: "W3", coffee: 78, tea: 52, snacks: 70, bakery: 42 },
  { week: "W4", coffee: 110, tea: 48, snacks: 65, bakery: 35 },
  { week: "W5", coffee: 105, tea: 58, snacks: 80, bakery: 50 },
  { week: "W6", coffee: 125, tea: 62, snacks: 75, bakery: 55 },
];
