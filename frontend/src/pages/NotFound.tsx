import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="font-display text-5xl text-royal-600">404</h1>
      <p className="text-charcoal">The page you're looking for could not be found.</p>
      <Link to="/" className="rounded-full bg-royal-600 px-6 py-2 text-sm text-white hover:bg-royal-500">
        Back to Home
      </Link>
    </div>
  );
}
