import { Phone, Mail, MapPin, Clock } from "lucide-react";
import StoreMap from "../components/StoreMap";

const info = [
  { icon: Phone, label: "Phone", value: "+254 700 123 456", href: "tel:+254700123456" },
  { icon: Mail, label: "Email", value: "hello@freshminimart.co.ke", href: "mailto:hello@freshminimart.co.ke" },
  { icon: MapPin, label: "Address", value: "Moi Avenue, Nairobi, Kenya", href: null },
  { icon: Clock, label: "Hours", value: "Mon–Sun · 7:00am – 9:00pm", href: null },
];

export default function Contact() {
  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
      <div className="mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-gold-dark mb-2">Visit us</p>
        <h1 className="text-4xl font-semibold text-ink mb-3">Find our store</h1>
        <p className="text-ink/60 max-w-xl">
          Drop by, call ahead, or send us a note — we're happy to help with
          anything from stock questions to bulk orders.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            {info.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="crate-tag p-5 flex items-start gap-3">
                <div className="w-10 h-10 shrink-0 rounded-md bg-market-green/10 text-market-green flex items-center justify-center">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-ink/40 mb-1">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm font-medium text-ink hover:text-market-green transition-colors">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-ink">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="crate-tag p-6 space-y-4"
          >
            <h2 className="font-display font-semibold text-lg text-ink mb-1">Send a message</h2>
            <p className="text-sm text-ink/50 mb-4">
              This form is UI-only for now — connect it to your backend's
              contact endpoint when ready.
            </p>
            <div>
              <label className="label-field">Name</label>
              <input className="input" placeholder="Your name" />
            </div>
            <div>
              <label className="label-field">Email</label>
              <input type="email" className="input" placeholder="you@example.com" />
            </div>
            <div>
              <label className="label-field">Message</label>
              <textarea className="input min-h-[110px] resize-none" placeholder="How can we help?" />
            </div>
            <button type="submit" className="btn-gold w-full sm:w-auto">
              Send message
            </button>
          </form>
        </div>

        <div>
          <StoreMap />
          <p className="text-xs text-ink/40 mt-3 font-mono">
            Map data via OpenStreetMap. See README to switch to Google Maps.
          </p>
        </div>
      </div>
    </div>
  );
}
