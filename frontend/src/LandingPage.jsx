import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./user/Navbar";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-green-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100 rounded-full translate-x-1/2 translate-y-1/2 opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Make Every Day
                <span className="text-green-600 block mt-2">
                  Earth Day
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Join thousands taking action for our planet. Track your eco-friendly activities, 
                compete in challenges, and shop sustainable products.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base sm:text-lg min-h-[52px]"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-white border-2 border-gray-300 hover:border-green-600 text-gray-700 hover:text-green-600 font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base sm:text-lg min-h-[52px]"
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* Right Content - Features Preview */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Join Eco Challenges</h3>
                      <p className="text-sm text-gray-600">Complete environmental challenges and earn green points</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🛒</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Shop Eco Products</h3>
                      <p className="text-sm text-gray-600">Discover sustainable products for everyday life</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Connect Community</h3>
                      <p className="text-sm text-gray-600">Share your journey and inspire others</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started is simple. Follow these easy steps to begin your eco-friendly journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your free account in seconds and join our eco-community</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Take Action</h3>
              <p className="text-gray-600">Join challenges, complete eco-tasks, and shop sustainably</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Impact</h3>
              <p className="text-gray-600">Monitor your progress and see the positive difference you make</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EcoBuddy?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy to Use</h3>
              <p className="text-sm text-gray-600">Simple interface designed for everyone</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">🌍</div>
              <h3 className="font-semibold text-gray-900 mb-2">Real Impact</h3>
              <p className="text-sm text-gray-600">See the positive environmental difference</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">🏆</div>
              <h3 className="font-semibold text-gray-900 mb-2">Gamified Experience</h3>
              <p className="text-sm text-gray-600">Earn points and compete with friends</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Trusted Platform</h3>
              <p className="text-sm text-gray-600">Secure and privacy-focused</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg sm:text-xl text-green-100 mb-8">
            Join thousands of eco-warriors creating positive change for our planet
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-green-600 hover:bg-gray-50 font-semibold px-10 py-4 rounded-xl transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Your Journey Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🌍</span>
                <span className="text-xl font-bold">EcoBuddy</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering individuals to take action for our planet through community, 
                challenges, and sustainable choices.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button 
                    onClick={() => navigate("/challenges")}
                    className="hover:text-white transition-colors"
                  >
                    Eco Challenges
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate("/eco-products")}
                    className="hover:text-white transition-colors"
                  >
                    Eco Products
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate("/community")}
                    className="hover:text-white transition-colors"
                  >
                    Community
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Get Started</h3>
              <button
                onClick={() => navigate("/signup")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                Join Free Today
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} EcoBuddy. Making the world greener, one step at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
