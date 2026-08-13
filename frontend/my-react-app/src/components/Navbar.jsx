import { NavLink, useNavigate } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";

// This decides the styling for one navigation link.
// react-router passes in "isActive", which is true for the page
// you are currently on, so we can highlight it.
function linkClass({ isActive }) {
  if (isActive) {
    return "px-3 py-2 rounded-lg bg-amber-800 text-amber-50";
  }
  return "px-3 py-2 rounded-lg text-red-900 hover:bg-amber-200";
}

function Navbar() {
  const navigate = useNavigate();
  const user = useAuthUser();

  // This function logs the user out.
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-amber-100 border-b border-amber-300">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
        <span className="text-2xl font-bold text-red-900">Habique</span>

        <div className="flex flex-wrap gap-1">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/habits" className={linkClass}>
            Habits
          </NavLink>
          <NavLink to="/profile" className={linkClass}>
            Profile
          </NavLink>
          <NavLink to="/settings" className={linkClass}>
            Settings
          </NavLink>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-red-900">{user ? user.name : "Guest"}</span>

          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg bg-red-800 text-amber-50 hover:bg-amber-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
