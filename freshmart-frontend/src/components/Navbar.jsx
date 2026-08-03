import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, Leaf, LayoutDashboard, LogOut, Search, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { categories } from "../data/sampleProducts";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
  }

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-market-green/10">
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-market-green">
          <span className="w-8 h-8 rounded-full bg-market-green text-gold flex items-center justify-center">
            <Leaf size={16} />
          </span>
          Fresh Mini Mart
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-market-green" : "text-ink/60 hover:text-market-green"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <form onSubmit={handleSearch} className="flex items-center rounded-full border border-market-green/20 bg-white px-3 py-2">
            <Search size={16} className="text-ink/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="ml-2 w-32 border-0 bg-transparent text-sm outline-none"
            />
          </form>
          <button onClick={() => setSidebarOpen(true)} className="btn-outline !py-2 !px-4 text-sm">
            Categories
          </button>
          {isAuthenticated ? (
            <>
              <Link to="/admin" className="btn-outline !py-2 !px-4 text-sm">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <button onClick={logout} className="text-sm text-ink/60 hover:text-tomato transition-colors flex items-center gap-1">
                <LogOut size={15} /> Log out
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary !py-2 !px-4 text-sm">
              Sign in
            </Link>
          )}
        </div>

        <button
          className="md:hidden text-market-green"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-market-green/10 bg-paper px-5 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-sm font-medium py-1.5 ${isActive ? "text-market-green" : "text-ink/70"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/admin" onClick={() => setOpen(false)} className="btn-outline text-sm justify-center">
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="text-sm text-tomato text-left"
              >
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="btn-primary text-sm justify-center">
              Admin Login
            </Link>
          )}
        </div>
      )}

      <div className={`fixed inset-0 z-[60] transition ${sidebarOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-ink/30 transition ${sidebarOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setSidebarOpen(false)} />
        <aside className={`absolute left-0 top-0 h-full w-80 max-w-[85%] bg-paper p-6 shadow-2xl transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-gold-dark">Browse</p>
              <h2 className="text-xl font-semibold text-ink">Categories</h2>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="rounded-full p-2 text-ink/60 hover:bg-paper-dark">
              <X size={18} />
            </button>
          </div>
          <div className="mt-6 space-y-2">
            {categories.filter((c) => c !== "All").map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSidebarOpen(false);
                  navigate(`/products?category=${encodeURIComponent(category)}`);
                }}
                className="flex w-full items-center justify-between rounded-lg border border-market-green/10 px-4 py-3 text-left text-sm font-medium text-ink/70 hover:bg-paper-dark"
              >
                <span>{category}</span>
                <ChevronRight size={16} className="text-market-green" />
              </button>
            ))}
          </div>
        </aside>
      </div>
    </header>
  );
}
