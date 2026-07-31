import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5">
      <span className="stamp-out mb-5">404</span>
      <h1 className="text-3xl font-semibold text-ink mb-2">Aisle not found</h1>
      <p className="text-ink/60 mb-6">We couldn't find the page you're looking for.</p>
      <Link to="/" className="btn-primary">
        Back to store
      </Link>
    </div>
  );
}
