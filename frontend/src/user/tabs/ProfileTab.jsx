import React from "react";
import { FaLeaf, FaTrophy, FaUser } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";

export default function ProfileTab({ user, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-16 px-4" role="status" aria-live="polite">
        <div className="text-center bg-white rounded-xl p-8 shadow-lg border border-gray-200">
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto">
              <div className="w-full h-full border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">Loading your profile...</p>
          <div className="mt-2 text-gray-500 text-sm">Please wait a moment</div>
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
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6" role="main" aria-label="User Profile">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className={`w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br ${getPointsColor(user?.green_points || 0)} p-1 shadow-lg`}>
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                      {getInitials(user?.full_name)}
                    </span>
                  </div>
                </div>
                
                {/* Verification Badge */}
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-2 shadow-md">
                  <MdVerifiedUser className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* User Info Section */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {user?.full_name || "Eco Warrior"}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                  <FaUser className="w-4 h-4" />
                  <span className="text-sm">{user?.email}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  ✓ Verified Member
                </span>
              </div>
            </div>

            {/* Green Points Card */}
            <div className="flex-shrink-0">
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200 min-w-[140px]">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FaTrophy className="w-5 h-5 text-green-600" />
                    <div className="text-green-700 text-sm font-semibold">
                      Green Points
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {user?.green_points || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="px-6 py-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 border border-gray-200">
                  {user?.full_name || "Not provided"}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 border border-gray-200">
                  {user?.email || "Not provided"}
                </div>
              </div>
            </div>

            {/* Eco Stats */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                <div className="px-3 py-2 bg-green-50 rounded-lg text-green-800 border border-green-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Active & Verified
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Eco Impact Summary */}
          <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <FaLeaf className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">Your Eco Impact</h3>
            </div>
            <p className="text-green-700 text-sm">
              You're making a positive difference for our planet! Every challenge you complete 
              and every eco-friendly choice you make contributes to a greener future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
