import React, { useState, useEffect } from "react";
import axios from "axios";


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

  // Pagination for complete list
  const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = leaderboardData.slice(indexOfFirst, indexOfLast);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  function UserCard({ user, idx, isTopSection = false }) {
    const isTopThree = idx < 3;
    const rank = isTopSection ? idx + 1 : idx + 1;

    if (isTopSection && isTopThree) {
      // Special styling for top 3 in main view
      return (
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-yellow-50 to-green-50 rounded-xl shadow-lg border-2 border-yellow-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-400 text-white font-bold text-xl shadow-lg">
              {["🥇", "🥈", "🥉"][idx]}
            </div>
            <div>
              <div className="font-bold text-gray-900 text-lg">{user.name}</div>
              <div className="text-sm text-yellow-700 font-medium">Champion</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-extrabold text-green-800 text-2xl">{user.green_points}</div>
            <div className="text-sm text-green-600 font-medium">points</div>
          </div>
        </div>
      );
    }

    // Regular styling for others
    return (
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-800 font-bold text-sm">
            {rank}
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-green-800 text-lg">{user.green_points}</div>
          <div className="text-xs text-green-600">points</div>
        </div>
      </div>
    );
  }


  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      {!showCompleteList && (
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-900 mb-2">Top Eco Warriors</h2>
          <p className="text-green-700 text-sm sm:text-base">Our top environmental contributors</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col justify-center items-center py-12">
          <div className="relative">
            <svg className="animate-spin h-12 w-12 text-green-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
          <p className="text-green-700 font-medium mt-3 text-base">Loading...</p>
        </div>
      ) : (
        <>
          {!showCompleteList && (
            <div className="space-y-3 sm:space-y-4">
              {leaderboardData.slice(0, 10).map((user, idx) => (
                <div key={user.user_id}>
                  <UserCard user={user} idx={idx} isTopSection={true} />
                </div>
              ))}
            </div>
          )}

          {!showCompleteList && leaderboardData.length > 10 && (
            <div className="text-center mt-6 sm:mt-8">
              <button
                onClick={() => {
                  setShowCompleteList(true);
                  setCurrentPage(1);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition-all duration-200"
              >
                See All Rankings
              </button>
            </div>
          )}

          {showCompleteList && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-green-900">All Rankings</h2>
                <button
                  onClick={() => {
                    setShowCompleteList(false);
                    setCurrentPage(1);
                  }}
                  className="text-green-600 hover:text-green-700 font-semibold text-sm"
                >
                  Back to Top
                </button>
              </div>

              <div className="space-y-3">
                {currentItems.map((user, idx) => (
                  <div key={user.user_id}>
                    <UserCard user={user} idx={indexOfFirst + idx} />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition"
                  >
                    Previous
                  </button>
                  <span className="text-green-800 font-semibold">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
      <div className="h-8" />
    </div>
  );
}
