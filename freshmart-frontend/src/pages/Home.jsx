import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Truck, Leaf, ShieldCheck, Gift } from "lucide-react";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { getProducts } from "../api/products";
import { useAuth } from "../context/AuthContext";

const perks = [
  { icon: Leaf, title: "Picked Fresh Daily", desc: "Produce sourced from local farms every morning." },
  { icon: Truck, title: "Fast Restocking", desc: "Shelves updated in real time so you know what's in." },
  { icon: ShieldCheck, title: "Trusted Quality", desc: "Every item checked before it reaches the shelf." },
];

export default function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data.slice(0, 4)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-market-green">
        <div className="absolute inset-0 bg-stripes-green opacity-[0.06]" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="stamp-in bg-transparent border-gold text-gold mb-6">Open Today · 7am–9pm</span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-paper leading-[1.05] mt-4 mb-6">
              Neighborhood fresh,
              <br />
              stocked <span className="text-gold">every day.</span>
            </h1>
            <p className="text-paper/70 text-lg max-w-md mb-8">
              From vine-ripened produce to pantry staples — Fresh Mini Mart keeps
              the shelves honest. What you see online is what's on the shelf.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-gold">
                Shop the shelves <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn-outline !border-paper/40 !text-paper hover:!bg-paper hover:!text-market-green">
                Find our store
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1519996529931-28324d5a630e?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1573246123716-6b1782bfc499?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1506617420156-8e4536971650?q=80&w=600&auto=format&fit=crop",
            ].map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                className={`rounded-lg object-cover w-full h-40 sm:h-48 shadow-crate ${i % 2 ? "mt-6" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-6xl mx-auto px-5 sm:px-8 py-8"
      >
        <div className="rounded-2xl border border-market-green/15 bg-gradient-to-r from-market-green to-market-green-dark p-6 text-paper shadow-crate">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-gold">Loyalty rewards</p>
              <h2 className="text-2xl font-semibold">{user ? `Welcome back, ${user.full_name || user.email}` : "Join the Fresh Mini Mart rewards club"}</h2>
              <p className="mt-2 max-w-2xl text-sm text-paper/80">
                Earn points with every order. Reach the next milestone and unlock a discount on your next basket.
              </p>
            </div>
            <div className="rounded-xl bg-paper/15 px-4 py-3 text-center">
              <div className="flex items-center gap-2 text-gold font-semibold">
                <Gift size={16} /> {user?.loyalty_points ?? 120} pts
              </div>
              <p className="mt-1 text-xs text-paper/70">Next reward at 500 points</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Perks */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 grid sm:grid-cols-3 gap-8">
        {perks.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex gap-4">
            <div className="w-11 h-11 shrink-0 rounded-md bg-market-green/10 text-market-green flex items-center justify-center">
              <Icon size={20} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-ink mb-1">{title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Featured products */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-gold-dark mb-2">On the shelf</p>
            <h2 className="text-3xl font-semibold text-ink">Today's fresh picks</h2>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-market-green hover:gap-2 transition-all">
            View all products <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <Loader label="Stocking shelves…" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <Link to="/products" className="sm:hidden mt-8 flex items-center justify-center gap-1 text-sm font-semibold text-market-green">
          View all products <ArrowRight size={15} />
        </Link>
      </section>
    </div>
  );
}
