import React, { useState, useEffect } from "react";
import { FaLeaf, FaSearch } from "react-icons/fa";
import { FiTag } from "react-icons/fi";
import Navbar from "./Navbar";
import ChallengeDetails from "./ChallengeDetails";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState(null); // changed to id
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("startDate");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    async function fetchChallenges() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${baseUrl}/api/challenges`);
        if (!res.ok) throw new Error("Failed to fetch challenges");
        const data = await res.json();

        const mapped = data.map((ch) => ({
          id: ch.id,
          title: ch.title,
          details: ch.description,
          startDate: ch.start_date,
          endDate: ch.end_date,
          category: ch.category,
          difficulty: ch.difficulty,
          status: ch.status,
          totalParticipants: ch.total_registered || 0,
          participantCap: ch.max_participants,
          greenPoints: ch.green_points,
        }));

        setChallenges(mapped);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchChallenges();
  }, []);

  const categories = [
    "All Categories",
    ...Array.from(new Set(challenges.map((ch) => ch.category))),
  ];
  const statuses = ["All Status", "open", "ongoing", "closed"];

  if (selectedChallengeId) {
    return (
      <>
        <Navbar />
        <ChallengeDetails
          challengeId={selectedChallengeId} // pass only id here
          onClose={() => setSelectedChallengeId(null)}
        />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-green-800 text-xl font-semibold">
          Loading challenges...
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-semibold">
          Error: {error}
        </div>
      </>
    );
  }

  const filtered = challenges.filter(
    ({ title, category, status, startDate, endDate }) => {
      const search = searchText.toLowerCase();
      const matchesSearch =
        title.toLowerCase().includes(search) ||
        category.toLowerCase().includes(search);
      const matchesCategory =
        filterCategory === "All Categories" || category === filterCategory;
      const matchesStatus =
        filterStatus === "All Status" || status === filterStatus;
      const matchesDate =
        !filterDate ||
        (new Date(filterDate) >= new Date(startDate) &&
          new Date(filterDate) <= new Date(endDate));
      return matchesSearch && matchesCategory && matchesStatus && matchesDate;
    }
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "difficulty")
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    if (sortBy === "startDate")
      return new Date(a.startDate) - new Date(b.startDate);
    return 0;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen relative bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-4 py-6 sm:py-8 w-full max-w-full mx-auto overflow-hidden">
        <div className="hidden md:block absolute top-10 left-6 w-36 h-36 bg-green-100 rounded-full opacity-10 pointer-events-none select-none" />
        <div className="hidden md:block absolute bottom-10 right-10 w-28 h-28 bg-green-100 rounded-full opacity-10 pointer-events-none select-none" />

        <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-green-900 max-w-screen-xl mx-auto px-4 select-none">
          Eco Challenges
        </h1>
        <div className="max-w-screen-xl mx-auto px-4 mb-6">
          {/* Search Bar - Always visible and prominent */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full rounded-lg border border-green-400 px-4 py-2 pl-9 pr-4 text-green-900 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 shadow-sm text-sm"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 pointer-events-none w-4 h-4" />
          </div>

          {/* Filters - Compact on mobile, expanded on larger screens */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="rounded-lg border border-teal-400 px-3 py-2 text-teal-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm min-w-0 flex-1 sm:flex-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All Categories" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-lg border border-green-400 px-3 py-2 text-green-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 text-sm min-w-0 flex-1 sm:flex-none"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st === "All Status" ? "All Status" : st.charAt(0).toUpperCase() + st.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="rounded-lg border border-green-400 px-3 py-2 text-green-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                placeholder="Filter by date"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-green-400 px-3 py-2 text-green-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 text-sm min-w-0"
              >
                <option value="startDate">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="difficulty">Sort by Difficulty</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-screen-xl mx-auto px-4">
          {sorted.map(
            ({
              id,
              title,
              category,
              difficulty,
              details,
              startDate,
              endDate,
              totalParticipants,
              participantCap,
              status,
              greenPoints,
            }) => (
              <div
                key={id}
                onClick={() => setSelectedChallengeId(id)}
                className="relative cursor-pointer bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition border border-transparent hover:border-green-700 flex flex-col"
              >
                <span
                  className={`absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-1 sm:px-3 rounded-full text-white text-xs font-semibold select-none ${
                    status === "open"
                      ? "bg-blue-600"
                      : status === "ongoing"
                      ? "bg-green-600"
                      : "bg-yellow-600"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>

                <h2 className="text-lg sm:text-xl font-extrabold text-green-900 mb-1 sm:mb-2 truncate pr-16">
                  {title}
                </h2>

                <div className="flex flex-wrap gap-2 mb-3 items-center">
                  <span className="bg-teal-100 text-teal-800 text-xs font-semibold rounded-full px-2 py-1 sm:px-3 flex items-center gap-1">
                    <FiTag className="w-3 h-3" /> {category}
                  </span>
                  <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold rounded-full px-2 py-1 sm:px-3">
                    {difficulty}
                  </span>
                </div>

                <div className="mb-3">
                  <span className="bg-green-300 text-green-900 text-sm font-bold rounded-full px-3 py-1 sm:px-4 inline-flex items-center gap-2 select-none shadow">
                    <FaLeaf className="w-3 h-3 sm:w-4 sm:h-4" /> +{greenPoints} points
                  </span>
                </div>

                <p className="text-green-700 text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 flex-grow">
                  {details}
                </p>

                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between text-green-800 text-xs font-semibold gap-2">
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M7 21v-2a4 4 0 0 1 3-3.87" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="truncate">
                      {totalParticipants}/{participantCap} joined
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="truncate">
                      {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
