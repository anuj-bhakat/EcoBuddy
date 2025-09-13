import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function AdminLogin() {
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
      const response = await axios.post(`${baseUrl}/api/auth/login/admin`, {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("admin", token);

      setMessage({ type: "success", text: "Login successful! Redirecting..." });

      setTimeout(() => {
        navigate("/admin-home");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-xl border border-gray-200 shadow-md px-8 py-6 font-sans"
        noValidate
      >
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800 tracking-normal">
          Admin Login
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
            className="block mb-2 font-semibold text-gray-900 text-lg tracking-normal leading-relaxed"
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
            className="w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 placeholder-gray-400 font-normal text-base transition focus:outline-none focus:border-gray-700 focus:shadow-lg"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 font-semibold text-gray-900 text-lg tracking-normal leading-relaxed"
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
            className="w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 placeholder-gray-400 font-normal text-base transition focus:outline-none focus:border-gray-700 focus:shadow-lg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gray-800 text-white font-semibold text-lg rounded-lg py-3 mb-3 shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-600 ${
            loading
              ? "cursor-not-allowed opacity-80 hover:bg-gray-800 scale-100"
              : "hover:bg-gray-900 cursor-pointer hover:scale-105"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
