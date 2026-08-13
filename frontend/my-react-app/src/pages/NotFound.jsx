import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-red-900">404</h1>

      <p className="text-lg text-red-900">Sorry, this page does not exist.</p>

      <Link
        to="/dashboard"
        className="px-4 py-2 rounded-lg bg-amber-800 text-amber-50 hover:bg-amber-600 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;
