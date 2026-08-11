import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImage from "./assets/images.jpg";
import { useMutation } from "@tanstack/react-query";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (user) => {
    const response = await fetch("http://localhost:3000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return response.json();
  };

  const loginMutation = useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      localStorage.setItem("token", data.token);

      alert("Login successful!");

      navigate("/dashboard");
    },

    onError: (error) => {
      alert(error.message);
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    loginMutation.mutate({
      email,
      password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-100">
      <div className="max-w-225 min-h-125 bg-white rounded-2xl flex overflow-hidden">
        <div className="w-1/2 p-20">
          <h2 className="text-3xl font-bold text-red-900 mb-5 text-center">
            Login
          </h2>
          <form onSubmit={handleLogin}>
            <input
              className="w-full border rounded-lg px-4 py-3 mb-5"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full border rounded-lg px-4 py-3 mb-5"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full text-lg bg-amber-800 text-amber-50 py-3 rounded-lg hover:bg-amber-600 transition mb-4"
            >
              Login
            </button>

            <p className="text-center text-md">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600">
                Register
              </Link>
            </p>
          </form>
        </div>

        <div className="w-1/2 bg-red-300 flex items-center justify-center">
          <img
            src={loginImage}
            alt="Login"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
