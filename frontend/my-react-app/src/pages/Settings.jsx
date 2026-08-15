import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import { clearHabits } from "../services/mockDb";

function Settings() {
  const navigate = useNavigate();
  const user = useAuthUser();
  const queryClient = useQueryClient();

  // logs the user out.
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // wipes the saved habits so the starter habits come back.
  const handleResetData = () => {
    clearHabits(user.id);

    // Tell React Query the data changed so the pages reload it.
    queryClient.invalidateQueries({ queryKey: ["habits"] });

    alert("Your habit data has been reset.");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-900 mb-6">Settings</h1>

      <div className="bg-white rounded-2xl p-6 max-w-md mb-6">
        <h2 className="text-xl font-semibold text-red-900 mb-2">Account</h2>

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
        <h2 className="text-xl font-semibold text-red-900 mb-2">Demo Data</h2>

        <p className="text-gray-600 mb-4">
          Habits are currently saved in this browser for testing. Resetting
          deletes them and brings back the starter habits.
        </p>

        <button
          onClick={handleResetData}
          className="px-4 py-2 rounded-lg bg-amber-800 text-amber-50 hover:bg-amber-600 transition"
        >
          Reset Habit Data
        </button>
      </div>
    </div>
  );
}

export default Settings;
