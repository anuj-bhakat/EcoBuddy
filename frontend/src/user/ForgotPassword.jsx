import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const clearError = () => {
    if (message?.type === "error") setMessage(null);
  };

  // Corner themed icons - SVG, png, or emoji
  const BgDecor = () => (
    <>
      <span className="absolute top-7 left-8 text-3xl md:text-4xl select-none">🌳</span>
      <span className="absolute bottom-9 right-10 text-3xl md:text-4xl select-none">🌞</span>
      <span className="absolute top-7 right-10 text-3xl md:text-4xl select-none">🍃</span>
    </>
  );

  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-6 w-6 text-white inline mr-2"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
      role="img"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  );

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address" });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/api/auth/forgot-password`, {
        email,
      });
      setMessage({ type: "success", text: response.data.message || "OTP sent successfully" });
      setStep(2);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to send OTP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!otp || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/api/auth/reset-password`, {
        email,
        otp_code: otp,
        new_password: newPassword,
      });
      setMessage({ type: "success", text: response.data.message || "Password reset successful" });
      setResetSuccess(true);
      setLoading(false);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setLoading(false);
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Password reset failed. Please try again.",
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8faea] via-[#f6fff2] to-[#ade7c9] px-4 overflow-hidden">
      <BgDecor />
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl px-10 py-10 font-sans relative z-10 border border-green-100">
        <h2 className="text-3xl font-bold mb-2 text-center text-green-800">
          {step === 1 ? "Forgot Password" : "Reset Password"} <span role="img" aria-label="plant">🌱</span>
        </h2>
        <p className="text-center text-gray-700 mb-7">
          {step === 1
            ? "Enter your email to receive OTP and reset your password."
            : "Enter OTP sent to your email and create new password."}
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

        {step === 1 && (
          <form onSubmit={handleSendOtp} noValidate>
            <label
              htmlFor="email"
              className="block mb-2 text-gray-900 text-sm font-medium"
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
              className="w-full rounded-lg border border-green-300 py-3 px-4 mb-6 text-gray-900 placeholder-gray-400 font-medium text-sm transition focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-600 text-white font-semibold text-base rounded-lg py-3 shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 flex justify-center items-center ${
                loading
                  ? "cursor-not-allowed opacity-80"
                  : "hover:bg-green-700 cursor-pointer"
              }`}
              style={{ borderWidth: "1px", borderColor: "transparent", outline: "none" }}
            >
              {loading && <LoadingSpinner />}
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} noValidate>
            <label
              htmlFor="otp"
              className="block mb-2 text-gray-900 text-sm font-medium"
            >
              OTP Code
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                clearError();
              }}
              required
              placeholder="Enter OTP"
              className="w-full rounded-lg border border-green-300 py-3 px-4 mb-4 text-gray-900 placeholder-gray-400 font-medium text-sm transition focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              disabled={resetSuccess}
            />
            <label
              htmlFor="newPassword"
              className="block mb-2 text-gray-900 text-sm font-medium"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                clearError();
              }}
              required
              placeholder="Create new password"
              className="w-full rounded-lg border border-green-300 py-3 px-4 mb-4 text-gray-900 placeholder-gray-400 font-medium text-sm transition focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              disabled={resetSuccess}
            />
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-gray-900 text-sm font-medium"
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
              placeholder="Confirm new password"
              className="w-full rounded-lg border border-green-300 py-3 px-4 mb-8 text-gray-900 placeholder-gray-400 font-medium text-sm transition focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              disabled={resetSuccess}
            />

            <button
              type="submit"
              disabled={loading || resetSuccess}
              className={`w-full bg-green-600 text-white font-semibold text-base rounded-lg py-3 shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 flex justify-center items-center ${
                loading || resetSuccess
                  ? "cursor-not-allowed opacity-80"
                  : "hover:bg-green-700 cursor-pointer"
              }`}
              style={{ borderWidth: "1px", borderColor: "transparent", outline: "none" }}
            >
              {loading && <LoadingSpinner />}
              {loading ? "Resetting..." : resetSuccess ? "Success! Redirecting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
