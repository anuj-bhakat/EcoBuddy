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
        text:
          error.response?.data?.error || "Failed to send OTP. Please try again.",
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
        text:
          error.response?.data?.error || "Password reset failed. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      {step === 1 && (
        <form
          onSubmit={handleSendOtp}
          className="w-full max-w-sm bg-white rounded-xl shadow-lg px-8 py-6 font-sans"
          noValidate
        >
          <h2 className="text-3xl font-semibold mb-6 text-center text-green-800 tracking-wide">
            Forgot Password
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
            className="w-full rounded-lg border border-gray-300 py-3 px-4 mb-6 text-gray-900 placeholder-gray-500 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 tracking-wide leading-relaxed"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-700 text-white font-semibold text-base rounded-lg py-3 shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-offset-2 ${
              loading
                ? "cursor-not-allowed opacity-80 hover:bg-green-700 scale-100"
                : "hover:bg-green-800 hover:scale-105 cursor-pointer"
            }`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={handleResetPassword}
          className="w-full max-w-sm bg-white rounded-xl shadow-lg px-8 py-6 font-sans"
          noValidate
        >
          <h2 className="text-3xl font-semibold mb-6 text-center text-green-800 tracking-wide">
            Reset Password
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

          <label
            htmlFor="otp"
            className="block mb-2 text-gray-800 text-sm font-medium tracking-wide"
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
            className="w-full rounded-lg border border-gray-300 py-3 px-4 mb-4 text-gray-900 placeholder-gray-500 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 tracking-wide leading-relaxed"
            disabled={resetSuccess}
          />

          <label
            htmlFor="newPassword"
            className="block mb-2 text-gray-800 text-sm font-medium tracking-wide"
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
            className="w-full rounded-lg border border-gray-300 py-3 px-4 mb-4 text-gray-900 placeholder-gray-500 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 tracking-wide leading-relaxed"
            disabled={resetSuccess}
          />

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
            placeholder="Confirm new password"
            className="w-full rounded-lg border border-gray-300 py-3 px-4 mb-6 text-gray-900 placeholder-gray-500 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 tracking-wide leading-relaxed"
            disabled={resetSuccess}
          />

          <button
            type="submit"
            disabled={loading || resetSuccess}
            className={`w-full bg-green-700 text-white font-semibold text-base rounded-lg py-3 shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-offset-2 ${
              loading || resetSuccess
                ? "cursor-not-allowed opacity-80 hover:bg-green-700 scale-100"
                : "hover:bg-green-800 hover:scale-105 cursor-pointer"
            }`}
          >
            {loading ? "Resetting..." : resetSuccess ? "Success! Redirecting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
}
