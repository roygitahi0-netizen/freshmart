import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Leaf, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

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
              Admin Login
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
    </header>
  );
}
