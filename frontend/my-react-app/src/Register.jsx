import { useState } from "react";
import { Link } from "react-router-dom";
import RegisterImage from "./assets/images.jpg";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const registerUser = async (user) => {
    const response = await fetch("http://localhost:3000/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  };

  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: registerUser,

    onSuccess: () => {
      alert("Registration Successful!");
      navigate("/");
    },

    onError: (error) => {
      alert(error.message);
    },
  });

  const handleRegister = (e) => {
    e.preventDefault();
    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (username.length < 3) {
      alert("Username must be at least 3 characters.");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    registerMutation.mutate({
      name: username,
      email,
      password,
    });

    console.log({
      username,
      email,
      password,
    });
  };

  return (
    <div className="min-h-screen bg-amber-100 items-center flex justify-center">
      <div className="bg-white text-center max-w-225 min-h-125 rounded-2xl flex overflow-hidden">
        <div className="w-1/2 p-20">
          <h2 className="text-4xl mb-6 text-red-900 font-bold">Register</h2>
          <form onSubmit={handleRegister}>
            <input
              className="w-full border rounded-lg px-4 py-3 mb-5"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />

            <input
              className="w-full max-w-sm border rounded-lg px-4 py-2 mb-5"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full max-w-sm border rounded-lg px-4 py-2 mb-5"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              className="w-full max-w-sm border rounded-lg px-4 py-2 mb-5"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-red-800 text-lg text-amber-50 rounded-lg py-3 hover:bg-amber-600 transition mb-4"
            >
              Register
            </button>
            <p className="text-center text-md">
              Already have an account?
              <Link to="/" className="text-blue-600 ">
                {" "}
                Login
              </Link>
            </p>
          </form>
        </div>
        <div className="w-1/2 bg-red-300 flex items-center justify-center">
          <img
            src={RegisterImage}
            alt="Register"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Register;
