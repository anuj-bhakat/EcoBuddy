import React, { useState } from "react";
import axios from "axios";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <div className="relative max-w-md w-full mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-200 transform transition-all duration-300 hover:shadow-xl">

      <header className="mb-4 sm:mb-6 text-center sm:text-left">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight select-none">
          Change Password
        </h3>
      </header>

      <form className="flex flex-col gap-4 sm:gap-5" onSubmit={handlePasswordChange} noValidate>
        {[
          {
            label: "Current Password",
            value: currentPassword,
            setter: setCurrentPassword,
            placeholder: "Enter current password",
            show: showCurrentPassword,
            setShow: setShowCurrentPassword,
          },
          {
            label: "New Password",
            value: newPassword,
            setter: setNewPassword,
            placeholder: "Enter new password",
            show: showNewPassword,
            setShow: setShowNewPassword,
          },
          {
            label: "Confirm Password",
            value: confirmPassword,
            setter: setConfirmPassword,
            placeholder: "Confirm new password",
            show: showConfirmPassword,
            setShow: setShowConfirmPassword,
          },
        ].map(({ label, value, setter, placeholder, show, setShow }) => (
          <div key={label} className="flex flex-col">
            <label
              htmlFor={label.toLowerCase().replace(/\s/g, "-")}
              className="text-sm font-semibold text-gray-700 mb-2"
            >
              {label}
            </label>
            <div className="relative">
              <input
                id={label.toLowerCase().replace(/\s/g, "-")}
                type={show ? "text" : "password"}
                placeholder={placeholder}
                className="pl-3 pr-10 py-2.5 w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                value={value}
                onChange={(e) => setter(e.target.value)}
                required
                autoComplete="new-password"
                aria-required="true"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
              >
                {show ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-4 focus-visible:ring-blue-400 text-white font-bold text-base rounded-lg px-6 py-3 shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-60 disabled:pointer-events-none disabled:transform-none"
          aria-busy={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Updating...
            </div>
          ) : (
            "Update Password"
          )}
        </button>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg font-medium select-text transform transition-all duration-300 ${
              message.toLowerCase().includes("success")
                ? "bg-blue-50 text-blue-800 border border-blue-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
            role="alert"
          >
            <div className="flex items-center gap-2 text-sm">
              {message.toLowerCase().includes("success") ? (
                <FaLock className="text-blue-600 w-4 h-4" />
              ) : (
                <FaLock className="text-red-600 w-4 h-4" />
              )}
              {message}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
