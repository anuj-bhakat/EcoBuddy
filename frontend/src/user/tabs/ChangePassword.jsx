import React, { useState } from "react";
import axios from "axios";
import { FaShieldAlt } from "react-icons/fa";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePasswordChange(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    const userId = localStorage.getItem("user_id");
    const requestData = {
      user_id: userId,
      current_password: currentPassword,
      new_password: newPassword,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/change-password`,
        requestData
      );

      if (response.data.message) {
        setMessage(response.data.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error || "An error occurred. Please try again.");
      } else {
        setMessage("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
          Change Password
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Keep your account safe with a new password
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-center font-medium ${
              message.toLowerCase().includes("success") || message.toLowerCase().includes("updated")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
            role="alert"
          >
            <div className="flex items-center justify-center gap-2 text-sm">
              <FaShieldAlt className={`w-4 h-4 ${message.toLowerCase().includes("success") ? "text-green-600" : "text-red-600"}`} />
              {message}
            </div>
          </div>
        )}

        <form onSubmit={handlePasswordChange} noValidate className="space-y-5">
          {/* Current Password */}
          <div>
            <label htmlFor="current-password" className="block text-sm font-semibold text-gray-900 mb-2">
              Current Password
            </label>
            <input
              id="current-password"
              type="password"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none bg-white placeholder-gray-400 text-base transition-colors"
              autoComplete="current-password"
              required
              style={{ WebkitAppearance: "none", appearance: "none" }}
            />
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="new-password" className="block text-sm font-semibold text-gray-900 mb-2">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none bg-white placeholder-gray-400 text-base transition-colors"
              autoComplete="new-password"
              required
              style={{ WebkitAppearance: "none", appearance: "none" }}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-900 mb-2">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none bg-white placeholder-gray-400 text-base transition-colors"
              autoComplete="new-password"
              required
              style={{ WebkitAppearance: "none", appearance: "none" }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
            aria-busy={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Updating Password...
              </div>
            ) : (
              "Update Password"
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <FaShieldAlt className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Password Tips</h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Use at least 8 characters</li>
                <li>• Mix letters, numbers, and symbols</li>
                <li>• Don't use the same password elsewhere</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
