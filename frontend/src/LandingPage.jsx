import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./user/Navbar";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-green-100 to-green-200">
      {/* Use the reusable Navbar component */}
      <Navbar />

      {/* Main Content */}
      <main className="flex flex-1 flex-col-reverse md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-8 gap-10">
        {/* Left - Text */}
        <div className="w-full md:w-1/2 flex flex-col items-start pt-4 md:pt-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-4 leading-tight">
            Join <span className="text-green-700">EcoBuddy</span><br />
            Make a Greener Tomorrow
          </h1>
          <p className="mb-8 text-lg text-green-800 max-w-md leading-relaxed">
            EcoBuddy empowers communities to take real action for the planet.
            Track eco-challenges, share green initiatives, shop eco-friendly, and inspire others.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => navigate("/signup")}
              className="bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow hover:bg-green-800 transition"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-white border border-green-700 text-green-700 font-semibold px-8 py-3 rounded-lg hover:bg-green-100 transition"
            >
              Login
            </button>
          </div>
        </div>

        {/* Right - Illustration */}
        <div className="w-full md:w-1/2 flex items-center justify-center md:px-8">
          <div className="w-full max-w-lg md:max-w-md aspect-[4/3] bg-green-100 rounded-2xl flex items-center justify-center shadow-inner mx-auto">
            {/* SVG Illustration */}
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none" className="w-2/3 h-2/3">
              <circle cx="50" cy="50" r="48" fill="#A7F3D0" stroke="#22C55E" strokeWidth="3" />
              <path d="M32 65 Q50 30 68 65" stroke="#166534" strokeWidth="5" fill="none" />
              <ellipse cx="40" cy="63" rx="4" ry="10" fill="#15803D" />
              <ellipse cx="60" cy="63" rx="4" ry="10" fill="#16A34A" />
              <ellipse cx="50" cy="60" rx="10" ry="5" fill="#BBF7D0" />
            </svg>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} EcoBuddy. All rights reserved.
      </footer>
    </div>
  );
}
