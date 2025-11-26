import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaLeaf, FaCalendarAlt, FaCoins, FaHistory } from "react-icons/fa";

export default function GreenPointsHistoryTab() {
  const [currentPoints, setCurrentPoints] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function fetchHistoryAndPoints() {
      setLoading(true);
      setErr(null);
      const userId = localStorage.getItem("user_id");

      try {
        const gpRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/greenpoints/user/${userId}`);
        setCurrentPoints(gpRes.data.green_points || gpRes.data.greenPoints);

        const transRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/greenpoints/transactions/${userId}`);
        setHistory(Array.isArray(transRes.data.transactions) ? transRes.data.transactions : []);
      } catch (error) {
        setErr("Could not load green point history.");
      } finally {
        setLoading(false);
      }
    }

    fetchHistoryAndPoints();
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <FaHistory className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-green-800">
              Points History
            </h3>
            <p className="text-green-600 text-sm">Track your eco-earnings</p>
          </div>
        </div>
        {currentPoints !== null && (
          <div className="bg-gradient-to-r from-green-100 via-emerald-100 to-green-200 px-6 py-4 rounded-2xl text-green-800 font-semibold flex items-center border border-green-300 shadow-lg transform hover:scale-105 transition-all duration-200">
            <FaLeaf className="w-5 h-5 mr-2 text-green-600" />
            <span className="text-sm mr-2">Current Balance:</span>
            <span className="text-3xl font-bold text-green-900 mr-1">{currentPoints}</span>
            <span className="text-xl">🌱</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-12">
          <div className="relative">
            <svg className="animate-spin h-12 w-12 text-green-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
          <p className="text-green-700 font-medium mt-3 text-base">Loading your history...</p>
        </div>
      ) : err ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-red-800 font-semibold">Unable to load history</p>
              <p className="text-red-600 text-sm">{err}</p>
            </div>
          </div>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 rounded-2xl border-2 border-green-300 shadow-lg">
          <div className="relative mb-6">
            <div className="text-7xl animate-bounce">🌱</div>
            <div className="absolute -top-2 -right-2 text-3xl animate-pulse">✨</div>
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-3">Your eco-journey starts here!</h3>
          <p className="text-green-700 mb-6 max-w-md mx-auto">You haven't earned any points yet. Join challenges and start making a positive impact on the environment!</p>
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <FaLeaf className="w-4 h-4 inline mr-2" />
            Explore Challenges
          </button>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block md:hidden space-y-4">
            {history.map((row) => {
              const dateObj = new Date(row.created_at);
              const dateStr = dateObj.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              const timeStr = dateObj.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });

              const isPositive = row.change_amount >= 0;

              return (
                <div key={row.id} className="bg-white rounded-2xl shadow-lg border border-green-200 p-5 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <FaCalendarAlt className="w-3 h-3" />
                      <span>{dateStr} at {timeStr}</span>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${
                      isPositive ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"
                    }`}>
                      <FaCoins className="w-3 h-3 inline mr-1" />
                      {isPositive ? "+" : ""}{row.change_amount}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-green-800 font-semibold text-base flex-1 mr-4">{row.reason}</div>
                    <div className="text-right bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="text-xs text-green-600 font-medium">New Balance</div>
                      <div className="font-bold text-green-800 text-lg">{row.new_balance}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-2xl shadow-xl border border-green-300 bg-white">
            <table className="min-w-full table-auto text-green-900">
              <thead className="bg-gradient-to-r from-green-100 via-emerald-100 to-green-200 text-green-800 text-sm font-bold border-b-2 border-green-300">
                <tr>
                  <th className="py-5 px-6 text-left">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="w-4 h-4" />
                      Date & Time
                    </div>
                  </th>
                  <th className="py-5 px-6 text-left">Activity</th>
                  <th className="py-5 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <FaCoins className="w-4 h-4" />
                      Points Change
                    </div>
                  </th>
                  <th className="py-5 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <FaLeaf className="w-4 h-4" />
                      Balance
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((row, index) => {
                  const dateObj = new Date(row.created_at);
                  const dateStr = dateObj.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  const timeStr = dateObj.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });

                  const isPositive = row.change_amount >= 0;

                  return (
                    <tr
                      key={row.id}
                      className={`border-b border-green-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-green-25'
                      }`}
                    >
                      <td className="px-6 py-5">
                        <div className="text-green-800 font-semibold">
                          <div className="text-base">{dateStr}</div>
                          <div className="text-sm text-green-600 font-medium">{timeStr}</div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-gray-700 font-semibold text-base">
                        {row.reason}
                      </td>

                      <td className="px-6 py-5 text-center">
                        <div className={`inline-flex items-center px-4 py-2 rounded-xl font-bold text-sm shadow-sm border-2 ${
                          isPositive
                            ? "bg-green-100 text-green-800 border-green-300"
                            : "bg-red-100 text-red-800 border-red-300"
                        }`}>
                          <FaCoins className="w-3 h-3 mr-1" />
                          <span>{isPositive ? "+" : ""}{row.change_amount}</span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <div className="bg-green-100 rounded-lg px-4 py-2 border border-green-300 inline-block">
                          <span className="font-bold text-green-800 text-xl">
                            {row.new_balance}
                          </span>
                          <span className="text-green-600 ml-1">🌱</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
