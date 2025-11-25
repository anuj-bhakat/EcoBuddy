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
          flex items-center justify-between p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border
          ${isMedal
            ? `${medal.color} border-current`
            : "bg-white border-gray-200 hover:border-green-300"
          }
          w-full group
        `}
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div
            className={`
              w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full font-bold text-xl sm:text-2xl shadow-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110
              ${isMedal
                ? "bg-white border-2 border-current"
                : "bg-gradient-to-br from-green-400 to-green-600 text-white"
              }
            `}
          >
            {isMedal ? medal.icon : idx + 1}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-sm sm:text-base md:text-lg text-gray-900 truncate">
              {user.name}
            </div>
            {isMedal && (
              <div className="text-xs sm:text-sm text-yellow-600 mt-1 font-medium">
                Top Performer
              </div>
            )}
          </div>
        </div>
        <div className="text-right ml-4">
          <div className="font-extrabold text-green-800 text-lg sm:text-xl md:text-2xl">
            {user.green_points.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-green-600 font-medium">points</div>
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
      {!showCompleteList && (
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mb-2 transform transition-all duration-300 hover:scale-105">🏆 Top Users</h2>
          <p className="text-green-700 text-base sm:text-lg font-medium">Recognizing our climate champions</p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-3 rounded-full"></div>
        </div>
      )}

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
            <div className="space-y-3 sm:space-y-4">
              {leaderboardData.slice(0, 10).map((user, idx) => (
                <div
                  key={user.user_id}
                  className="transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <UserCard user={user} idx={idx} />
                </div>
              ))}
            </div>
          )}

          {!showCompleteList && (
            <div className="text-center mt-6 sm:mt-8">
              <button
                onClick={() => setShowCompleteList(!showCompleteList)}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm sm:text-base font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
                <span>View Complete Leaderboard</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {showCompleteList && (
            <div className="mt-6 sm:mt-10 transform transition-all duration-500">
              {/* Professional Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-xl border border-green-200 shadow-sm gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl flex-shrink-0">
                    🏆
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-800 truncate">Complete Leaderboard</h2>
                    <p className="text-green-600 text-xs sm:text-sm font-medium">Full ranking of all participants</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCompleteList(false)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 sm:p-3 rounded-lg font-bold shadow-lg transition-all duration-200 transform hover:scale-110 hover:rotate-90 self-end sm:self-auto"
                  title="Close Complete List"
                >
                  ✕
                </button>
              </div>
              {/* Professional Table */}
              <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-slate-50 to-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Points
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.map((user, idx) => (
                        <tr
                          key={user.user_id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                                {indexOfFirst + idx + 1 <= 3 ? (
                                  <span className="text-xl sm:text-2xl">{MEDALS[indexOfFirst + idx]?.icon}</span>
                                ) : (
                                  <span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 text-gray-800 text-xs sm:text-sm font-bold rounded-full">
                                    {indexOfFirst + idx + 1}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-2 sm:ml-4 min-w-0">
                                <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate max-w-[120px] sm:max-w-none">{user.name}</div>
                                <div className="text-xs text-gray-500 hidden sm:block">Eco Warrior</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-green-100 text-green-800">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-1 sm:mr-2"></span>
                                {user.green_points}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Professional Pagination */}
              <div className="mt-6 sm:mt-8 bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                  <div className="text-xs sm:text-sm text-gray-600 font-medium text-center sm:text-left">
                    <span className="sm:hidden">Showing </span>
                    <span className="font-semibold text-gray-900">{indexOfFirst + 1}-{Math.min(indexOfLast, leaderboardData.length)}</span>
                    <span className="hidden sm:inline"> of </span>
                    <span className="hidden sm:inline font-semibold text-gray-900">{leaderboardData.length}</span>
                    <span className="sm:hidden"> of {leaderboardData.length}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={handlePrev}
                      disabled={currentPage === 1}
                      className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Prev</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(totalPages - 2, currentPage - 1)) + i;
                        if (pageNum > totalPages) return null;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 ${
                              pageNum === currentPage
                                ? 'bg-green-600 text-white'
                                : 'text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <span className="sm:hidden">Next</span>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <div className="h-8" />
    </div>
  );
}
