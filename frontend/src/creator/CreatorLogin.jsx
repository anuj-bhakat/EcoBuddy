import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function CreatorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(`${baseUrl}/api/auth/login/creator`, {
        email,
        password,
      });

      const { token } = response.data;
      const creatorId =response.data.user.id;
      localStorage.setItem("creator", token);
      localStorage.setItem("creatorId", creatorId);

      setMessage({ type: "success", text: "Login successful! Redirecting..." });

      setTimeout(() => {
        navigate("/creator/create-challenge");
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

  // Clear error message on input edit
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-green-200 px-4 relative overflow-hidden">
      <div className="absolute right-4 bottom-4 opacity-15 pointer-events-none z-0 flex flex-col items-center space-y-5 text-green-400">
        <svg width="44" height="34" viewBox="0 0 44 34" fill="currentColor">
          <ellipse cx="22" cy="17" rx="20" ry="10" />
        </svg>
        <svg width="60" height="45" viewBox="0 0 60 45" fill="currentColor">
          <ellipse cx="30" cy="22.5" rx="28" ry="15" />
        </svg>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-xl border border-green-200 shadow-xl px-8 py-6 font-sans relative z-10"
        noValidate
      >
        <h2 className="text-3xl font-semibold mb-8 text-center text-green-700 tracking-wide">
          Creator Login
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded text-center font-medium text-base ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 font-semibold text-gray-700 text-lg"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            placeholder="Email address"
            className="w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-700 placeholder-gray-400 font-normal text-base transition focus:outline-none focus:border-green-600 focus:shadow-lg"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 font-semibold text-gray-700 text-lg"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            placeholder="Password"
            className="w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-700 placeholder-gray-400 font-normal text-base transition focus:outline-none focus:border-blue-600 focus:shadow-lg"
          />
        </div>

        <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white text-lg font-semibold rounded-lg py-3 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-green-400 ${
                loading
                ? "cursor-not-allowed opacity-80 hover:bg-green-600 scale-100"
                : "hover:bg-green-700 hover:scale-105 cursor-pointer"
            }`}
            >
            {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-5 text-center text-gray-700 text-sm">
          Don't have an account?{" "}
          <button
            onClick={handleSignupNavigation}
            className="text-green-700 font-medium hover:underline focus:outline-none"
            type="button"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}
