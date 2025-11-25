import React from "react";
import { FaEnvelope, FaLeaf, FaTrophy, FaChartLine } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";

export default function ProfileTab({ user, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-16 px-4" role="status" aria-live="polite">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100">
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse"></div>
              <svg
                className="relative w-16 h-16 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
          </div>
          <p className="text-green-700 font-semibold text-lg">Loading your eco profile...</p>
          <div className="mt-2 text-green-600 text-sm">Preparing your green journey</div>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getPointsColor = (points) => {
    if (points >= 1000) return "from-yellow-400 to-orange-500";
    if (points >= 500) return "from-green-400 to-emerald-500";
    return "from-green-300 to-green-500";
  };



  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 lg:p-6" role="main" aria-label="User Profile">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-2xl shadow-xl border border-emerald-100/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10"></div>
        <div className="relative p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">

            {/* Avatar Section */}
            <div className="flex-shrink-0 group">
              <div className="relative">
                <div className={`w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-2xl bg-gradient-to-br ${getPointsColor(user?.green_points || 0)} p-1 shadow-xl transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-3`}>
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800">
                      {getInitials(user?.full_name)}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl p-2 shadow-lg transform transition-all duration-300 hover:scale-110">
                  <FaLeaf className="w-4 h-4" />
                </div>

                {/* Verification Badge */}
                <div className="absolute -top-1 -left-1 bg-blue-500 text-white rounded-full p-1.5 shadow-md">
                  <MdVerifiedUser className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 w-full lg:mr-4">

              {/* User Header Info */}
              <div className="text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1">
                  {user?.full_name || "Eco Warrior"}
                </h1>
                <p className="text-emerald-600 font-medium text-base mb-1">{user?.email}</p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-gray-600">
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                    Verified Member
                  </span>
                </div>
              </div>

            </div>

            {/* Green Points Section */}
            <div className="flex-shrink-0">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-emerald-100/50 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FaTrophy className="w-5 h-5 text-emerald-600" />
                    <div className="text-emerald-700 text-sm font-semibold uppercase tracking-wide">
                      Green Points
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-800">
                    {user?.green_points || 0}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
