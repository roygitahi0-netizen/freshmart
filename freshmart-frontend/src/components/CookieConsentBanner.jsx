import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = window.localStorage.getItem("freshmart_cookie_consent");
    if (!accepted) setVisible(true);
  }, []);

  function accept() {
    window.localStorage.setItem("freshmart_cookie_consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="sticky bottom-0 z-40 border-t border-market-green/15 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-market-green/10 p-2 text-market-green">
            <Cookie size={16} />
          </div>
          <div>
            <p className="font-semibold text-ink">We use cookies to keep your session secure and personalize your experience.</p>
            <p className="text-sm text-ink/60">By continuing, you accept our session cookies for authentication and loyalty features.</p>
          </div>
        </div>
        <button onClick={accept} className="btn-primary">Accept cookies</button>
      </div>
    </div>
  );
}
