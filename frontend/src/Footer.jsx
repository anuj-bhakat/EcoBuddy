import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 shadow-inner">
      <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center font-sans text-gray-600 text-sm">
        <p className="mb-3 md:mb-0">© 2025 EcoBuddy. All rights reserved.</p>
        <nav className="flex space-x-6">
          <a
            href="/privacy"
            className="hover:text-green-700 transition-colors duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="hover:text-green-700 transition-colors duration-200"
          >
            Terms of Service
          </a>
          <a
            href="/contact"
            className="hover:text-green-700 transition-colors duration-200"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
