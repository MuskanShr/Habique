import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoutes";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
