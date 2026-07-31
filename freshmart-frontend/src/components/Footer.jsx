import { Link } from "react-router-dom";
import { Leaf, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-market-green text-paper/90 mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 grid gap-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-semibold text-paper mb-3">
            <span className="w-7 h-7 rounded-full bg-gold text-market-green-dark flex items-center justify-center">
              <Leaf size={14} />
            </span>
            Fresh Mini Mart
          </div>
          <p className="text-sm text-paper/70 leading-relaxed">
            Your neighborhood stop for fresh produce, pantry staples, and everyday
            essentials — stocked daily.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-gold mb-3">Get in touch</h4>
          <ul className="space-y-2 text-sm text-paper/80">
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-gold" /> +254 700 123 456
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-gold" /> hello@freshminimart.co.ke
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} className="text-gold" /> Moi Avenue, Nairobi, Kenya
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-gold mb-3">Quick links</h4>
          <ul className="space-y-2 text-sm text-paper/80">
            <li>
              <Link to="/products" className="hover:text-gold transition-colors">Browse products</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gold transition-colors">Visit us</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-gold transition-colors">Admin login</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10 py-4 text-center text-xs text-paper/50">
        © {new Date().getFullYear()} Fresh Mini Mart. All rights reserved.
      </div>
    </footer>
  );
}
