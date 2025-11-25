import React, { useState, useEffect } from "react";
import axios from "axios";

// Medal display data
const MEDALS = [
  { icon: "🥇", color: "bg-yellow-100 border-yellow-400 text-yellow-700" },
  { icon: "🥈", color: "bg-gray-100 border-gray-400 text-gray-700" },
  { icon: "🥉", color: "bg-orange-100 border-orange-400 text-orange-700" }
];

export default function LeaderboardTab() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompleteList, setShowCompleteList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchLeaderboardData() {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/greenpoints/users/all`);
        setLeaderboardData(response.data || []);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboardData();
  }, []);

  function UserCard({ user, idx }) {
    const isMedal = idx < 3;
    const medal = MEDALS[idx];
    return (
      <div
        className={`
          flex flex-wrap sm:flex-nowrap items-center justify-between p-4 md:p-5 rounded-xl mb-3 shadow hover:shadow-lg transition
          ${isMedal
            ? `${medal.color} border`
            : "bg-green-50 border border-green-100 text-green-900"
          }
          w-full
        `}
      >
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <div
            className={`
              w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full font-bold text-xl sm:text-2xl shadow flex-shrink-0
              ${isMedal
                ? "bg-white border-2 border-current"
                : "bg-green-200 text-green-700"
              }
            `}
          >
            {isMedal ? medal.icon : idx + 1}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-base sm:text-lg md:text-xl truncate max-w-xs sm:max-w-xs">
              {user.name}
            </div>
          </div>
        </div>
        <div className="font-extrabold text-green-800 text-lg sm:text-xl md:text-2xl flex items-center mt-2 sm:mt-0">
          {user.green_points} <span className="ml-1 text-lg sm:text-xl">🌱</span>
        </div>
      </div>
    );
  }

  // Pagination calculation
  const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = leaderboardData.slice(indexOfFirst, indexOfLast);

  // Change page
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 max-h-[80vh]">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mb-2 transform transition-all duration-300 hover:scale-105">🏆 Top Users</h2>
        <p className="text-green-700 text-base sm:text-lg font-medium">Recognizing our climate champions</p>
        <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-3 rounded-full"></div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-16">
          <div className="relative">
            <svg className="animate-spin h-16 w-16 text-green-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl animate-bounce">🌱</span>
            </div>
          </div>
          <p className="text-green-700 font-medium mt-4 text-lg">Loading leaderboard...</p>
        </div>
      ) : (
        <>
          {!showCompleteList && (
            <div className="space-y-4">
              {leaderboardData.slice(0, 10).map((user, idx) => (
                <div key={user.user_id} className="transform transition-all duration-300 hover:scale-102">
                  <UserCard user={user} idx={idx} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:mt-10">
            <button
              onClick={() => setShowCompleteList(!showCompleteList)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-base sm:text-lg font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
            >
              <span className="flex items-center gap-2">
                {showCompleteList ? "👆 Hide Complete List" : "📊 View Complete List"}
              </span>
            </button>
          </div>

          {showCompleteList && (
            <div className="mt-10 transform transition-all duration-500">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-green-800 flex items-center justify-center gap-3">
                📋 Complete Leaderboard
                <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
              </h2>
              <div className="overflow-x-auto shadow-xl rounded-2xl border border-green-200">
                <table className="min-w-full text-green-900 text-sm sm:text-base md:text-lg">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-100 to-green-200 border-b-2 border-green-300 text-green-800">
                      <th className="py-4 px-4 sm:py-6 sm:px-8 font-bold w-20 text-center">🏅 Rank</th>
                      <th className="py-4 px-4 sm:py-6 sm:px-8 font-bold text-center min-w-[160px]">👤 Name</th>
                      <th className="py-4 px-4 sm:py-6 sm:px-8 font-bold text-center min-w-[160px]">🌱 Green Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((user, idx) => (
                      <tr
                        key={user.user_id}
                        className="border-b border-green-100 hover:bg-green-50 transition-all duration-200 transform hover:scale-[1.01]"
                      >
                        <td className="py-3 sm:py-5 px-4 sm:px-8 font-bold text-center text-lg sm:text-xl">
                          <div className="flex items-center justify-center">
                            {indexOfFirst + idx + 1 <= 3 ? (
                              <span className="text-2xl animate-pulse">{MEDALS[indexOfFirst + idx]?.icon}</span>
                            ) : (
                              <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full font-bold">
                                {indexOfFirst + idx + 1}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 sm:py-5 px-4 sm:px-8 text-center font-bold text-sm sm:text-lg truncate max-w-[180px]">
                          {user.name}
                        </td>
                        <td className="py-3 sm:py-5 px-4 sm:px-8 font-bold text-center text-base sm:text-lg">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center justify-center gap-1 w-fit mx-auto">
                            {user.green_points} <span className="text-lg">🌱</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center mt-8 gap-4">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:transform-none disabled:opacity-50"
                >
                  ⬅️ Previous
                </button>

                <div className="bg-green-100 text-green-800 px-6 py-3 rounded-xl font-bold shadow-md">
                  Page {currentPage} of {totalPages}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:transform-none disabled:opacity-50"
                >
                  Next ➡️
                </button>
              </div>
            </div>
          )}
        </>
      )}
      <div className="h-8" />
    </div>
  );
}
