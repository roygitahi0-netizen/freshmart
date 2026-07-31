import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Pencil, Trash2, PackageCheck, PackageX } from "lucide-react";
import { getProducts, deleteProduct } from "../../api/products";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";

export default function ManageProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }

  async function handleDelete(id) {
    if (!confirm("Remove this product from the catalog?")) return;
    try {
      await deleteProduct(id, token);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setNotice(err.message);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-gold-dark mb-2">Admin</p>
          <h1 className="text-4xl font-semibold text-ink">Manage products</h1>
        </div>
        <Link to="/admin/products/new" className="btn-gold">
          <PlusCircle size={17} /> Add product
        </Link>
      </div>

      {notice && (
        <div className="mb-6 text-sm text-tomato bg-tomato/5 border border-tomato/20 rounded-md px-4 py-3">
          {notice}
        </div>
      )}

      {loading ? (
        <Loader label="Loading products…" />
      ) : (
        <div className="crate-tag overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-market-green/10 text-left text-xs font-mono uppercase tracking-widest text-ink/40">
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-market-green/5 last:border-0 hover:bg-paper-dark/40">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="w-11 h-11 rounded-md object-cover shrink-0" />
                      <span className="font-medium text-ink">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-ink/60">{p.category}</td>
                  <td className="px-5 py-3.5 font-mono text-ink/70">${p.price.toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    {p.inStock ? (
                      <span className="inline-flex items-center gap-1.5 text-basil text-xs font-semibold">
                        <PackageCheck size={14} /> In stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-tomato text-xs font-semibold">
                        <PackageX size={14} /> Sold out
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-3">
                      <Link to={`/admin/products/${p.id}/edit`} className="text-market-green hover:text-market-green-dark" title="Edit">
                        <Pencil size={16} />
                      </Link>
                      <button onClick={() => handleDelete(p.id)} className="text-tomato/80 hover:text-tomato" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="text-center text-sm text-ink/50 py-10">No products yet — add your first one.</p>
          )}
        </div>
      )}
    </div>
  );
}
