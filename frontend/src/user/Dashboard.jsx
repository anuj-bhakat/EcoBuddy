import React, { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import LeaderboardTab from "./tabs/LeaderboardTab";
import ChangePassword from "./tabs/ChangePassword";
import ProfileTab from "./tabs/ProfileTab";
import GreenPointsHistoryTab from "./tabs/GreenPointsHistoryTab";

// Sidebar tab list
const tabs = [
  {
    key: "profile",
    name: "My Profile",
    icon: (
      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="orange" strokeWidth={2.2} viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20a8 8 0 0116 0" /></svg>
    ),
  },
  {
    key: "password",
    name: "Change Password",
    icon: (
      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="#64748B" strokeWidth={2.2} viewBox="0 0 24 24"><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M8 8V6a4 4 0 118 0v2" /></svg>
    ),
  },
  {
    key: "leaderboard",
    name: "Leaderboard",
    icon: (
      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="#64748B" strokeWidth={2.2} viewBox="0 0 24 24"><path d="M9 17V9a2 2 0 012-2h2a2 2 0 012 2v8"/><rect width="6" height="8" x="4" y="13" rx="2"/><rect width="6" height="14" x="14" y="7" rx="2"/></svg>
    ),
  },
  {
    key: "history",
    name: "Green Points History",
    icon: (
      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="#64748B" strokeWidth={2.2} viewBox="0 0 24 24"><path d="M3 3v6h6"/><path d="M21 21v-6h-6"/><path d="M17.657 6.343a8 8 0 010 11.314M6.343 17.657a8 8 0 010-11.314"/></svg>
    ),
  },
];

function CustomDropdown({ tabs, activeTab, onChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeTabObj = tabs.find((tab) => tab.key === activeTab);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative md:hidden px-4 pt-6 mb-6 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 rounded-lg border border-green-300 bg-green-50 text-green-800 font-semibold text-base focus:outline-none"
      >
        <span>{activeTabObj?.name}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-4 right-4 mt-2 rounded-xl border border-green-200 bg-white shadow-lg">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                onChange(tab.key);
                setOpen(false);
              }}
              className={`block w-full text-left px-5 py-3 text-sm font-medium text-green-800 hover:bg-green-100 transition ${
                tab.key === activeTab ? "bg-orange-100 text-orange-700" : ""
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      const userId = localStorage.getItem('user_id');
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/greenpoints/user-profile/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1 w-screen">
        <div
          className="flex flex-col md:flex-row w-screen bg-white"
          style={{ minHeight: "calc(100vh - 64px)" }}
        >
          {/* Sidebar (visible md and up) */}
          <div className="hidden md:flex w-56 border-r border-green-100 py-10 flex-col gap-1 h-full">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center w-full px-5 py-3 rounded-xl mb-2 text-base font-semibold transition ${
                  activeTab === tab.key
                    ? "bg-orange-50 text-orange-600 border border-orange-200"
                    : "hover:bg-green-50 text-slate-600"
                }`}
              >
                {React.cloneElement(tab.icon, {
                  stroke: activeTab === tab.key ? "#fb8500" : "#64748B",
                })}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Dropdown menu for small screens */}
          <CustomDropdown
            tabs={tabs}
            activeTab={activeTab}
            onChange={(key) => {
              setActiveTab(key);
            }}
          />

          {/* Content */}
          <div className="flex-1 py-10 px-4 sm:px-6 h-full overflow-auto overflow-y-auto">
            {activeTab === "profile" && <ProfileTab user={user} loading={loading} />}
            {activeTab === "password" && <ChangePassword />}
            {activeTab === "leaderboard" && <LeaderboardTab />}
            {activeTab === "history" && <GreenPointsHistoryTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
