import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function CreatorNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem("creator"));
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("creator");
    navigate("/creator-login");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Creator navigation menu
  const navLinks = [
    ...(isLoggedIn
      ? [
          { label: "Dashboard", path: "/creator/dashboard" },
          { label: "Create Challenge", path: "/creator/create-challenge" },
          { label: "Modify Challenges", path: "/creator/view-challenge" },
          { label: "View Submissions", path: "/creator/view-submissions" },
          { label: "Analytics", path: "/creator/analytics" },
        ]
      : []),
  ];

  const baseBtnClasses =
    "px-4 py-2 rounded-lg text-base font-medium transition-colors duration-150 focus:outline-none cursor-pointer";

  return (
    <nav className="w-full bg-white shadow relative z-20 font-sans">
      <div className="flex items-center justify-between px-6 py-3 md:px-10">
        {/* Logo */}
        <div
          className="text-green-700 font-extrabold text-2xl cursor-pointer select-none tracking-wide"
          onClick={() => {
            setMenuOpen(false);
            navigate("/creator");
          }}
        >
          EcoBuddy Creator
        </div>

        {/* Desktop Nav & Actions */}
        <div className="hidden md:flex items-center flex-1 justify-end">
          {isLoggedIn && (
            <div className="flex space-x-2 md:space-x-4 mr-4">
              {navLinks.map(({ label, path }) => (
                <button
                  key={path}
                  className={`${baseBtnClasses} ${
                    isActive(path)
                      ? "bg-green-700 text-white shadow"
                      : "text-green-700 hover:bg-green-100 hover:text-green-800"
                  } hover:shadow`}
                  onClick={() => navigate(path)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          {/* Login/Signup or Logout */}
          {isLoggedIn ? (
            <button
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-base transition-colors duration-200 shadow hover:bg-red-700 hover:shadow-lg focus:outline-none cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <>
              <button
                className="px-4 py-2 rounded-lg border border-green-700 text-green-700 font-semibold text-base bg-white hover:bg-green-100 hover:text-green-800 transition-colors duration-150 cursor-pointer focus:outline-none mr-2"
                onClick={() => navigate("/creator-login")}
              >
                Login
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-green-700 text-white font-semibold text-base hover:bg-green-800 hover:shadow-lg transition-colors duration-200 shadow cursor-pointer focus:outline-none"
                onClick={() => navigate("/creator-signup")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Hamburger - show on mobile */}
        <button
          type="button"
          className="md:hidden flex flex-col h-11 w-11 items-center justify-center rounded-lg z-30 hover:bg-green-100/70 transition focus:outline-none"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={`block h-1 w-7 bg-green-700 rounded transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-1 w-7 bg-green-700 rounded mt-1.5 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-1 w-7 bg-green-700 rounded mt-1.5 transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>

        {/* Overlay & Mobile Menu */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-10 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}
        <div
          className={`
            fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-lg z-30 border-l border-green-100
            transform transition-transform duration-300 flex flex-col pt-24 px-7 pb-8 space-y-4 md:hidden
            ${menuOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {/* Logo in mobile menu */}
          <div
            className="absolute top-5 left-7 text-green-700 font-extrabold text-2xl cursor-pointer select-none tracking-wide"
            onClick={() => {
              setMenuOpen(false);
              navigate("/creator");
            }}
          >
            EcoBuddy Creator
          </div>
          {/* Navigation Buttons */}
          {isLoggedIn && (
            <div className="flex flex-col gap-2 mb-6">
              {navLinks.map(({ label, path }) => (
                <button
                  key={path}
                  className={`${baseBtnClasses} ${
                    isActive(path)
                      ? "bg-green-700 text-white shadow"
                      : "text-green-700 hover:bg-green-100 hover:text-green-800"
                  } hover:shadow w-full text-left`}
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(path);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          {/* Login/Signup or Logout */}
          <div className="flex flex-col gap-2">
            {isLoggedIn ? (
              <button
                className="w-full px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-base transition-colors duration-200 shadow hover:bg-red-700 hover:shadow-lg focus:outline-none cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  className="w-full px-4 py-2 rounded-lg border border-green-700 text-green-700 font-semibold text-base bg-white hover:bg-green-100 hover:text-green-800 transition-colors duration-150 cursor-pointer focus:outline-none"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/creator-login");
                  }}
                >
                  Login
                </button>
                <button
                  className="w-full px-4 py-2 rounded-lg bg-green-700 text-white font-semibold text-base hover:bg-green-800 hover:shadow-lg transition-colors duration-200 shadow cursor-pointer focus:outline-none"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/creator-signup");
                  }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
