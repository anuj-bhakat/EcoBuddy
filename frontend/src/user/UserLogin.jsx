import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/api/auth/login/user`, {
        email,
        password,
      });

      const { token } = response.data;
      const { id } = response.data.user;
      localStorage.setItem("user", token);
      localStorage.setItem("user_id", id);

      setMessage({ type: "success", text: "Login successful! Redirecting..." });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.error ||
          "Login failed. Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (message?.type === "error") setMessage(null);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (message?.type === "error") setMessage(null);
  };

  const handleSignupNavigation = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  const handleForgotPasswordNavigation = (e) => {
    e.preventDefault();
    navigate("/forgot-password");
  };

  // -- ADD KEYFRAMES STYLE FOR ANIMATION --
  const emojiAnimationKeyframes = `
    @keyframes floatFade {
      0% { transform: translateY(0) scale(1); opacity: 0.7; }
      50% { transform: translateY(-15px) scale(1.1); opacity: 1; }
      100% { transform: translateY(0) scale(1); opacity: 0.7; }
    }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col relative overflow-hidden">
      <Navbar />
      {/* Inline styles for emoji animation */}
      <style>{emojiAnimationKeyframes}</style>
      {/* Floating Emojis in the background */}
      <div
        className="absolute top-10 left-8 text-green-300 text-5xl pointer-events-none select-none z-0"
        style={{ animation: "floatFade 6s ease-in-out infinite" }}
      >
        🌿
      </div>
      <div
        className="absolute top-24 right-10 text-green-300 text-4xl pointer-events-none select-none z-0"
        style={{ animation: "floatFade 6s ease-in-out infinite 1.2s" }}
      >
        🍃
      </div>
      <div
        className="absolute bottom-24 left-6 text-green-200 text-6xl pointer-events-none select-none z-0"
        style={{ animation: "floatFade 6s ease-in-out infinite 2.4s" }}
      >
        🌳
      </div>
      <div
        className="absolute bottom-10 right-10 text-yellow-200 text-5xl pointer-events-none select-none z-0"
        style={{ animation: "floatFade 6s ease-in-out infinite 3.6s" }}
      >
        ☀️
      </div>

      {/* Login Card */}
      <div className="flex-grow flex items-center justify-center px-4 py-10 relative z-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 px-8 py-10 md:py-12 lg:px-10 transition-all duration-300">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-green-800 mb-4">
            Welcome Back 🌱
          </h2>
          <p className="text-center text-gray-600 text-sm mb-8">
            Log in to continue your climate journey.
          </p>

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
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                autoComplete="email"
                placeholder="Email address"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-100 focus:outline-none bg-gray-50 placeholder-gray-400 text-sm"
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                autoComplete="current-password"
                placeholder="Password"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-100 focus:outline-none bg-gray-50 placeholder-gray-400 text-sm"
              />
            </div>

            <div className="text-right mb-6">
              <button
                type="button"
                onClick={handleForgotPasswordNavigation}
                className="text-sm text-green-700 hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-green-700 transition transform duration-200 ${
                loading ? "opacity-80 cursor-not-allowed" : "hover:scale-105"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={handleSignupNavigation}
              className="text-green-700 hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
