import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./user/Navbar";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 relative overflow-hidden">
      {/* Simple Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle background gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-100/20 to-emerald-100/20"></div>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 lg:py-12 relative z-10">
        <div className="w-full max-w-6xl mx-auto">
          {/* Hero Content */}
          <div className="text-center mb-8 lg:mb-12">

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-green-900 mb-6 leading-tight">
              <span className="block">
                Fight Climate Change
              </span>
              <span className="text-green-700 relative inline-block">
                Every Action
                <span className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></span>
              </span>
              <span className="block text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-800 mt-2">
                Counts
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-green-800 max-w-4xl mx-auto leading-relaxed mb-8">
              Join a community dedicated to environmental action. 
              Together, we can create meaningful change for our planet through 
              awareness, education, and collective action. Every individual contribution 
              builds towards a sustainable future.
            </p>

            {/* Impact Row */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">🌍</div>
                <div className="text-sm text-green-600">Climate Awareness</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">🌱</div>
                <div className="text-sm text-green-600">Environmental Action</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">👥</div>
                <div className="text-sm text-green-600">Community Impact</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <button
                onClick={() => navigate("/signup")}
                className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>🌱</span>
                  Start Your Journey
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-white border-2 border-green-600 text-green-700 font-bold px-8 py-4 rounded-2xl hover:bg-green-50 hover:border-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>🔐</span>
                  Sign In
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>



      {/* Features Section */}
      <section className="py-10 lg:py-14 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-green-900 mb-4">
              Join the Climate Movement
            </h2>
            <p className="text-lg text-green-700 max-w-3xl mx-auto">
              Every small action contributes to a larger environmental impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-300">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Environmental Awareness</h3>
              <p className="text-green-700 text-sm">Learn about climate issues and sustainable living</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-300">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Community Action</h3>
              <p className="text-green-700 text-sm">Connect with like-minded climate advocates</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-300">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Global Impact</h3>
              <p className="text-green-700 text-sm">Be part of worldwide environmental change</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-10 lg:py-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl lg:text-2xl mb-8 text-green-100">
            Join a community committed to environmental awareness and climate action
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-green-700 font-bold px-10 py-5 rounded-2xl hover:bg-green-50 transition-all duration-300 transform hover:scale-105 active:scale-95 text-xl shadow-xl hover:shadow-2xl"
          >
            <span className="flex items-center justify-center gap-3">
              <span className="text-2xl">🌍</span>
              Join the Movement
            </span>
          </button>
        </div>
      </section>

      {/* Distinct Footer */}
      <footer className="py-8 lg:py-12 bg-gradient-to-b from-green-900 to-green-950 text-white relative">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400"></div>
        
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            {/* Brand Section */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-3">🌍 EcoBuddy</h3>
              <p className="text-green-300 text-sm leading-relaxed">
                Fighting climate change through community action and environmental awareness.
              </p>
            </div>

            {/* Contact Section */}
            <div className="text-center md:text-right">
              <h4 className="text-lg font-semibold text-green-400 mb-3">Get Involved</h4>
              <p className="text-green-300 text-sm mb-2">Ready to make a difference?</p>
              <button
                onClick={() => navigate("/signup")}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Join the Movement
              </button>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-green-800 pt-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-green-300">
                  © {new Date().getFullYear()} EcoBuddy. All rights reserved.
                </p>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <span className="text-lg">🌱</span>
                <span className="text-sm font-medium">Making the world greener, one step at a time</span>
                <span className="text-lg">🌱</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Simple Custom CSS */}
      <style>{`
        /* Mobile optimizations */
        @media (max-width: 640px) {
          /* Improve touch targets on mobile */
          button {
            min-height: 48px;
            min-width: 48px;
          }
          /* Better text sizing on mobile */
          h1 {
            line-height: 1.1;
          }
        }
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
