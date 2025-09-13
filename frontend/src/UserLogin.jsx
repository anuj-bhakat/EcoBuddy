import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      localStorage.setItem("user", token);

      setMessage({ type: "success", text: "Login successful! Redirecting..." });

      setTimeout(() => {
        navigate("/home");
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

  // Clear error message when editing any input field
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-xl border border-gray-200 shadow-[0_8px_30px_rgba(56,161,105,0.3)] px-8 py-6 font-sans"
        noValidate
      >
        <p className="mb-8 text-center text-gray-700 text-xl font-medium tracking-wide">
          Please enter your details
        </p>

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
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
            required
            placeholder="Email address"
            className="w-full rounded-lg border border-gray-300 py-3 px-4 bg-[#f7f7f7] text-gray-900 placeholder-gray-400 font-normal text-base transition focus:outline-none focus:border-green-600 focus:bg-white focus:shadow-xl"
          />
        </div>

        <div className="mb-4">
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
            required
            placeholder="Password"
            className="w-full rounded-lg border border-gray-300 py-3 px-4 bg-[#f7f7f7] text-gray-900 placeholder-gray-400 font-normal text-base transition focus:outline-none focus:border-green-600 focus:bg-white focus:shadow-xl"
          />
        </div>

        <div className="mb-7 text-right">
          <button
            onClick={handleForgotPasswordNavigation}
            className="text-green-700 text-sm font-medium hover:underline"
            type="button"
          >
            Forgot password
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-700 text-white text-base font-semibold rounded-lg py-3 mb-3 shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-offset-2
            ${
              loading
                ? "cursor-not-allowed opacity-80 hover:bg-green-700 scale-100"
                : "hover:bg-green-800 hover:scale-105 cursor-pointer"
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
