import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export function UserSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !password || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    if (!emailRegex.test(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(`${baseUrl}/api/auth/signup/user`, {
        full_name: name,
        email,
        password,
      });

      const { token } = response.data;
      const { id }=response.data.user;
      localStorage.setItem("user", token);
      localStorage.setItem("user_id", id);

      setMessage({ type: "success", text: "Signup successful! Redirecting..." });

      setTimeout(() => {
        navigate("/challenges");
      }, 1000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Signup failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    if (message?.type === "error") setMessage(null);
  };

  const handleLoginNavigate = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-50 relative overflow-hidden">
      <Navbar />

      {/* Floating Climate Emojis (No custom Tailwind config needed) */}
      <div className="absolute top-20 left-8 text-green-300 text-5xl animate-pulse pointer-events-none select-none">🌿</div>
      <div className="absolute top-48 right-10 text-green-300 text-4xl animate-pulse pointer-events-none select-none">🍃</div>
      <div className="absolute bottom-15 left-16 text-green-200 text-4xl animate-pulse pointer-events-none select-none">🌳</div>
      <div className="absolute bottom-8 right-18 text-yellow-200 text-3xl animate-pulse pointer-events-none select-none">☀️</div>

      {/* Reduced height more (~80px off from full screen) */}
      <div className="flex-grow flex items-center justify-center px-4 py-6" style={{ minHeight: "calc(100vh - 85px)" }}>
        <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          
          {/* LEFT SIDE */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-100 to-green-200 items-center justify-center p-10 relative z-10">
            <div className="text-center max-w-md">
              <h2 className="text-4xl font-bold text-green-800 mb-4 leading-snug">
                Be the 🌱 change <br /> our planet needs
              </h2>
              <p className="text-gray-700 text-lg">
                Join <span className="font-semibold text-green-900">EcoBuddy</span> and help create a greener, cleaner future — one step at a time.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE - Signup Form */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex items-center justify-center bg-white z-10">
            <div className="w-full max-w-md">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-green-800 mb-6">
                Create Your Account
              </h2>

              {message && (
                <div
                  className={`mb-6 p-3 rounded text-center font-medium text-sm ${
                    message.type === "error"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                  role="alert"
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-5">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-800">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      clearError();
                    }}
                    required
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-100 focus:outline-none bg-gray-50 placeholder-gray-400 text-sm"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-800">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError();
                    }}
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-100 focus:outline-none bg-gray-50 placeholder-gray-400 text-sm"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-800">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError();
                    }}
                    required
                    placeholder="Create a password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-100 focus:outline-none bg-gray-50 placeholder-gray-400 text-sm"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-800">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearError();
                    }}
                    required
                    placeholder="Re-enter password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-100 focus:outline-none bg-gray-50 placeholder-gray-400 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-green-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-green-700 transition transform duration-200 ${
                    loading ? "opacity-80 cursor-not-allowed" : "hover:scale-105"
                  }`}
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={handleLoginNavigate}
                  className="text-green-700 hover:underline font-medium"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
