import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, PackageCheck, PackageX, PlusCircle } from "lucide-react";
import { getProducts } from "../../api/products";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = products.length - inStockCount;

  const stats = [
    { label: "Total products", value: products.length, icon: Package, tone: "text-market-green bg-market-green/10" },
    { label: "In stock", value: inStockCount, icon: PackageCheck, tone: "text-basil bg-basil/10" },
    { label: "Sold out", value: outOfStockCount, icon: PackageX, tone: "text-tomato bg-tomato/10" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-gold-dark mb-2">Admin</p>
          <h1 className="text-4xl font-semibold text-ink">Welcome back{user?.email ? `, ${user.email}` : ""}</h1>
        </div>
        <Link to="/admin/products/new" className="btn-gold">
          <PlusCircle size={17} /> Add product
        </Link>
      </div>

      {loading ? (
        <Loader label="Loading dashboard…" />
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-5 mb-10">
            {stats.map(({ label, value, icon: Icon, tone }) => (
              <div key={label} className="crate-tag p-5 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-md flex items-center justify-center ${tone}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-display font-semibold text-ink">{value}</p>
                  <p className="text-xs text-ink/50">{label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="crate-tag p-6">
            <h2 className="font-display font-semibold text-lg mb-2">Manage your catalog</h2>
            <p className="text-sm text-ink/60 mb-4">
              Add new items, update photos, adjust prices, and flag what's in
              stock or sold out.
            </p>
            <Link to="/admin/products" className="btn-outline">
              Go to product manager
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
