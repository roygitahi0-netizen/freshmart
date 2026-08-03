import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, PackageSearch } from "lucide-react";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { getProducts } from "../api/products";
import { categories } from "../data/sampleProducts";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [stockFilter, setStockFilter] = useState("all"); // all | in | out

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    setCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || p.category === category;
      const matchesStock =
        stockFilter === "all" || (stockFilter === "in" ? p.inStock : !p.inStock);
      return matchesQuery && matchesCategory && matchesStock;
    });
  }, [products, query, category, stockFilter]);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
      <div className="mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-gold-dark mb-2">Full catalog</p>
        <h1 className="text-4xl font-semibold text-ink">All products</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              const next = new URLSearchParams(searchParams);
              if (e.target.value) next.set("q", e.target.value);
              else next.delete("q");
              setSearchParams(next);
            }}
            placeholder="Search products…"
            className="input pl-10"
          />
        </div>

        <select value={category} onChange={(e) => {
          const next = new URLSearchParams(searchParams);
          setCategory(e.target.value);
          if (e.target.value !== "All") next.set("category", e.target.value);
          else next.delete("category");
          setSearchParams(next);
        }} className="input lg:w-56">
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="flex rounded-md border border-market-green/20 overflow-hidden shrink-0">
          {[
            { key: "all", label: "All" },
            { key: "in", label: "In Stock" },
            { key: "out", label: "Sold Out" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setStockFilter(opt.key)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                stockFilter === opt.key
                  ? "bg-market-green text-paper"
                  : "bg-white text-ink/60 hover:bg-paper-dark"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader label="Loading catalog…" />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center text-ink/50">
          <PackageSearch size={40} className="mb-4 text-market-green/40" />
          <p className="font-medium">No products match your filters.</p>
          <p className="text-sm">Try a different search term or category.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
