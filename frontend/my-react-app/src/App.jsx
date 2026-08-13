import { Routes, Route, Outlet } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoutes";
import Dashboard from "./Dashboard";
import Layout from "./components/Layout";
import Habits from "./pages/Habits";
import HabitDetails from "./pages/HabitDetails";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      {/* Public pages - anyone can open these */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Private pages.
          This Route has no path of its own. It is a wrapper.
          Every page listed inside it is protected AND gets the navbar.
          <Outlet /> is the spot where the current page is drawn. */}
      <Route
        element={
          <ProtectedRoute>
            <Layout>
              <Outlet />
            </Layout>
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/habits/:id" element={<HabitDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Any URL that matches nothing above */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
