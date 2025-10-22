import React, { useState } from "react";
import axios from "axios";
import { FaLock, FaLeaf } from "react-icons/fa";

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
        "http://localhost:3000/api/auth/change-password",
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
    <div className="relative max-w-md w-full mx-auto p-8 bg-green-50 rounded-xl shadow-lg">

      <header className="flex items-center gap-3 mb-8 justify-center sm:justify-start">
        <FaLeaf className="text-green-700 text-3xl" aria-hidden="true" />
        <h3 className="text-2xl font-semibold text-green-900 tracking-tight select-none">
          Change Password
        </h3>
      </header>

      <form className="flex flex-col gap-6" onSubmit={handlePasswordChange} noValidate>
        {[
          {
            label: "Current Password",
            value: currentPassword,
            setter: setCurrentPassword,
            placeholder: "Enter current password",
          },
          {
            label: "New Password",
            value: newPassword,
            setter: setNewPassword,
            placeholder: "Enter new password",
          },
          {
            label: "Confirm Password",
            value: confirmPassword,
            setter: setConfirmPassword,
            placeholder: "Confirm new password",
          },
        ].map(({ label, value, setter, placeholder }) => (
          <div key={label} className="flex flex-col">
            <label
              htmlFor={label.toLowerCase().replace(/\s/g, "-")}
              className="text-sm font-semibold text-green-700 mb-2"
            >
              {label}
            </label>
            <div className="relative">
              <FaLock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id={label.toLowerCase().replace(/\s/g, "-")}
                type="password"
                placeholder={placeholder}
                className="pl-12 pr-4 py-3 w-full rounded-lg border border-green-300 bg-white text-green-900 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 shadow-sm transition"
                value={value}
                onChange={(e) => setter(e.target.value)}
                required
                autoComplete="new-password"
                aria-required="true"
              />
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-green-700 hover:bg-green-800 active:bg-green-900 focus-visible:ring-4 focus-visible:ring-green-400 text-white font-semibold text-lg rounded-lg px-10 py-3 shadow-md transition-transform transform hover:-translate-y-1 disabled:opacity-60 disabled:pointer-events-none"
          aria-busy={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {message && (
          <p
            className={`mt-5 text-center sm:text-left font-medium select-text ${
              message.toLowerCase().includes("success")
                ? "text-green-700"
                : "text-red-600"
            }`}
            role="alert"
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
