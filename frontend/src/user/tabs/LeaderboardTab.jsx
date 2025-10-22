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
        const response = await axios.get('http://localhost:3000/api/greenpoints/users/all');
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
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-green-900">Top Users</h2>
      <p className="text-center text-green-700 mb-5 text-sm sm:text-lg">Recognizing climate champions</p>

      {loading ? (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-12 w-12 text-green-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      ) : (
        <>
          {!showCompleteList && (
            <div className="space-y-3">
              {leaderboardData.slice(0, 10).map((user, idx) => (
                <UserCard user={user} idx={idx} key={user.user_id} />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <button
              onClick={() => setShowCompleteList(!showCompleteList)}
              className="bg-green-700 text-white text-base sm:text-lg font-semibold px-5 sm:px-7 py-2 sm:py-3 rounded-lg hover:bg-green-800 shadow transition-all"
            >
              {showCompleteList ? "Hide Complete List" : "View Complete List"}
            </button>
          </div>

          {showCompleteList && (
            <div className="mt-10">
              <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6 text-green-800">
                Complete Leaderboard
              </h2>
              <div className="overflow-x-auto shadow rounded">
                <table className="min-w-full text-green-900 text-sm sm:text-lg md:text-xl">
                  <thead>
                    <tr className="bg-green-100 border-b-2 border-green-300 text-green-800">
                      <th className="py-3 px-4 sm:py-5 sm:px-7 font-semibold w-20 text-center">Rank</th>
                      <th className="py-3 px-4 sm:py-5 sm:px-7 font-semibold text-center min-w-[160px]">Name</th>
                      <th className="py-3 px-4 sm:py-5 sm:px-7 font-semibold text-center min-w-[160px]">Green Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((user, idx) => (
                      <tr
                        key={user.user_id}
                        className="border-b border-green-50 hover:bg-green-50 transition"
                      >
                        <td className="py-2 sm:py-4 px-4 sm:px-7 font-bold text-center text-xl sm:text-2xl">
                          {indexOfFirst + idx + 1 <= 3 ? MEDALS[indexOfFirst + idx]?.icon || indexOfFirst + idx + 1 : indexOfFirst + idx + 1}
                        </td>
                        <td className="py-2 sm:py-4 px-4 sm:px-7 text-center font-bold text-base sm:text-xl truncate max-w-[180px]">
                          {user.name}
                        </td>
                        <td className="py-2 sm:py-4 px-4 sm:px-7 font-bold text-center text-lg sm:text-xl">
                          {user.green_points} 🌱
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center mt-6 gap-4">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="bg-green-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 hover:bg-green-800"
                >
                  Previous
                </button>

                <span className="text-green-800 font-semibold">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="bg-green-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 hover:bg-green-800"
                >
                  Next
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
