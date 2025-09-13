import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

    // Validate all fields are filled
    if (!name || !email || !password || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    // Validate password confirmation
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
      localStorage.setItem("user", token);

      setMessage({ type: "success", text: "Signup successful! Redirecting..." });

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
        console.log(error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.error ||
          "Signup failed. Please try again.",
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
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg px-8 py-6 font-sans"
        noValidate
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-green-800 tracking-wide">
          Join EcoBuddy
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

        <div className="mb-5">
          <label
            htmlFor="name"
            className="block mb-2 text-gray-800 text-sm font-medium tracking-wide"
          >
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
            className="w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 placeholder-gray-500 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 tracking-wide leading-relaxed"
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-gray-800 text-sm font-medium tracking-wide"
          >
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
            className="w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 placeholder-gray-500 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 tracking-wide leading-relaxed"
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-gray-800 text-sm font-medium tracking-wide"
          >
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
            className="w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 placeholder-gray-500 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 tracking-wide leading-relaxed"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block mb-2 text-gray-800 text-sm font-medium tracking-wide"
          >
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
            placeholder="Confirm your password"
            className="w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 placeholder-gray-500 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 tracking-wide leading-relaxed"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-700 text-white font-semibold text-base rounded-lg py-3 mb-4 shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-offset-2 ${
            loading
              ? "cursor-not-allowed opacity-80 hover:bg-green-700 scale-100"
              : "hover:bg-green-800 hover:scale-105 cursor-pointer"
          }`}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="mt-4 text-center text-gray-700 text-sm">
          Already have an account?{" "}
          <button
            onClick={handleLoginNavigate}
            className="text-green-700 font-medium hover:underline focus:outline-none"
            type="button"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
