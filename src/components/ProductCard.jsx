import { Link } from "react-router-dom";
import StockBadge from "./StockBadge";

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="crate-tag group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-paper-dark">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            product.inStock ? "" : "grayscale opacity-70"
          }`}
        />
        <div className="absolute top-2.5 left-2.5">
          <StockBadge inStock={product.inStock} />
        </div>
      </div>
      <div className="p-4">
        <p className="text-[11px] font-mono uppercase tracking-widest text-market-green/60 mb-1">
          {product.category}
        </p>
        <h3 className="font-display font-semibold text-ink leading-snug mb-1.5">{product.name}</h3>
        <div className="flex items-baseline gap-1 font-mono">
          <span className="text-gold-dark font-semibold text-lg">${product.price.toFixed(2)}</span>
          <span className="text-xs text-ink/50">/ {product.unit}</span>
        </div>
      </div>
    </Link>
  );
}
