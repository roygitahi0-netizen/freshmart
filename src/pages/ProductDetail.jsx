import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import StockBadge from "../components/StockBadge";
import Loader from "../components/Loader";
import { getProduct } from "../api/products";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Fetching product…" />;

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24 text-center">
        <h1 className="text-2xl font-semibold mb-2">Product not found</h1>
        <p className="text-ink/60 mb-6">It may have been removed from the shelf.</p>
        <Link to="/products" className="btn-primary">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
      <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-market-green font-medium mb-8 hover:gap-2 transition-all">
        <ArrowLeft size={15} /> Back to products
      </Link>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="rounded-lg overflow-hidden shadow-crate border border-market-green/10 bg-paper-dark aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover ${product.inStock ? "" : "grayscale opacity-70"}`}
          />
        </div>

        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-market-green/60 mb-3">
            {product.category}
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-ink mb-4">{product.name}</h1>

          <div className="mb-5">
            <StockBadge inStock={product.inStock} />
          </div>

          <div className="flex items-baseline gap-2 font-mono mb-6">
            <span className="text-3xl font-semibold text-gold-dark">${product.price.toFixed(2)}</span>
            <span className="text-ink/50">/ {product.unit}</span>
          </div>

          <p className="text-ink/70 leading-relaxed mb-8">{product.description}</p>

          <div className="flex flex-wrap gap-3">
            <button
              disabled={!product.inStock}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {product.inStock ? "Available in-store" : "Currently unavailable"}
            </button>
            <Link to="/contact" className="btn-outline">
              Ask about this item
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
