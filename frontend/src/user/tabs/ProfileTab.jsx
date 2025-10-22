import React from "react";

export default function ProfileTab({ user, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <svg
          className="animate-spin h-10 w-10 text-green-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl shadow p-6 sm:p-8 w-full">
      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-green-200 flex items-center justify-center text-green-900 text-3xl font-bold shadow-inner">
            {user?.full_name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="break-words">
            <div className="text-sm text-green-700 font-medium">Name</div>
            <div className="text-lg font-semibold text-green-900">{user?.full_name}</div>
          </div>
          <div className="break-words">
            <div className="text-sm text-green-700 font-medium">Email</div>
            <div className="text-lg font-semibold text-green-900 break-all">{user?.email}</div>
          </div>
          <div className="sm:col-span-2">
            <div className="text-sm text-green-700 font-medium mb-1">Green Points</div>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-extrabold text-green-800 bg-green-100 px-5 py-2 rounded-xl shadow">
                {user?.green_points}
              </span>
              <span className="text-2xl">🌱</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
