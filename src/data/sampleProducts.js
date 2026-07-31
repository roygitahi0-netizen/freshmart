// Local preview data only — this is replaced automatically by live backend
// data as soon as VITE_API_BASE_URL is set (see src/api/products.js).
export const sampleProducts = [
  {
    id: 1,
    name: "Vine-Ripened Tomatoes",
    category: "Produce",
    price: 2.49,
    unit: "kg",
    image:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=800&auto=format&fit=crop",
    inStock: true,
    description: "Locally sourced, picked fresh this morning. Great for salads and sauces.",
  },
  {
    id: 2,
    name: "Free-Range Eggs (12pk)",
    category: "Dairy & Eggs",
    price: 3.99,
    unit: "dozen",
    image:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=800&auto=format&fit=crop",
    inStock: true,
    description: "Farm-fresh eggs from free-range hens, no additives.",
  },
  {
    id: 3,
    name: "Sourdough Loaf",
    category: "Bakery",
    price: 4.5,
    unit: "loaf",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
    inStock: false,
    description: "Baked daily in-house with a crisp crust and soft crumb.",
  },
  {
    id: 4,
    name: "Organic Avocados",
    category: "Produce",
    price: 1.75,
    unit: "each",
    image:
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=800&auto=format&fit=crop",
    inStock: true,
    description: "Creamy, ripe, and ready to eat. Great for toast or guacamole.",
  },
  {
    id: 5,
    name: "Whole Milk (1L)",
    category: "Dairy & Eggs",
    price: 1.6,
    unit: "bottle",
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800&auto=format&fit=crop",
    inStock: true,
    description: "Pasteurized whole milk from a local dairy co-op.",
  },
  {
    id: 6,
    name: "Basmati Rice (5kg)",
    category: "Pantry",
    price: 8.99,
    unit: "bag",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop",
    inStock: true,
    description: "Aromatic, long-grain basmati rice — a pantry staple.",
  },
  {
    id: 7,
    name: "Cold-Pressed Orange Juice",
    category: "Beverages",
    price: 3.25,
    unit: "1L",
    image:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800&auto=format&fit=crop",
    inStock: false,
    description: "No added sugar, just fresh-squeezed oranges.",
  },
  {
    id: 8,
    name: "Cheddar Cheese Block",
    category: "Dairy & Eggs",
    price: 5.4,
    unit: "400g",
    image:
      "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?q=80&w=800&auto=format&fit=crop",
    inStock: true,
    description: "Sharp, aged cheddar — perfect for sandwiches or snacking.",
  },
];

export const categories = [
  "All",
  "Produce",
  "Dairy & Eggs",
  "Bakery",
  "Pantry",
  "Beverages",
];
