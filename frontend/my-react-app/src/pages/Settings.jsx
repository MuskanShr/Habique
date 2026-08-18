import { useNavigate } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";

function Settings() {
  const navigate = useNavigate();
  const user = useAuthUser();

  // This function logs the user out.
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-900 mb-6">Settings</h1>

      <div className="bg-white rounded-2xl p-6 max-w-md mb-6">
        <h2 className="text-xl font-semibold text-red-900 mb-2">Account</h2>

        <p className="text-gray-600 mb-1">
          Signed in as {user ? user.email : "unknown"}
        </p>

        <p className="text-gray-600 mb-4">
          Logging out removes your saved token from this browser.
        </p>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-red-800 text-amber-50 hover:bg-amber-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 max-w-md">
        <h2 className="text-xl font-semibold text-red-900 mb-2">Data</h2>

        <p className="text-gray-600">
          Your habits are saved in MongoDB and linked to your account, so they
          are available on any device you log in from.
        </p>
      </div>
    </div>
  );
}

export default Settings;
