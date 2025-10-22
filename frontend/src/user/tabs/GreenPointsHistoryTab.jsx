import React, { useState, useEffect } from "react";
import axios from "axios";

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
        const gpRes = await axios.get(`http://localhost:3000/api/greenpoints/user/${userId}`);
        setCurrentPoints(gpRes.data.green_points || gpRes.data.greenPoints);

        const transRes = await axios.get(`http://localhost:3000/api/greenpoints/transactions/${userId}`);
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
    <div>
      <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-3">
        Green Points History
        {currentPoints !== null && (
          <span className="ml-4 bg-green-100 px-3 py-1 rounded-xl text-green-700 text-lg flex items-center">
            Current:
            <span className="ml-2 font-extrabold text-2xl">{currentPoints}</span>
            <span className="ml-2">🌱</span>
          </span>
        )}
      </h3>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 text-green-700">
          <svg
            className="animate-spin h-10 w-10 text-green-600 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-lg font-medium">Loading history...</p>
        </div>
      ) : err ? (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{err}</div>
      ) : history.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-lg">
          No green point transactions found yet.
          <div className="mt-2 text-3xl">🌱</div>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-xl shadow">
          <table className="min-w-[600px] w-full table-auto text-green-900 bg-white rounded-xl overflow-hidden">
            <thead className="bg-green-100 text-green-800 text-sm uppercase tracking-wide">
              <tr>
                <th className="py-3 px-5 text-left font-semibold whitespace-nowrap min-w-[1%]">Date</th>
                <th className="py-3 px-5 text-right font-semibold whitespace-nowrap min-w-[1%]">Change</th>
                <th className="py-3 px-5 text-right font-semibold whitespace-nowrap min-w-[1%]">New Balance</th>
                <th className="w-[3vw]"></th>
                <th className="py-3 px-5 text-left font-semibold">Reason</th>
              </tr>
            </thead>
            <tbody>
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
                  <tr
                    key={row.id}
                    className="border-b border-green-50 hover:bg-green-50 transition text-sm sm:text-base"
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-green-800 font-semibold">{dateStr}</div>
                      <div className="text-xs font-semibold text-slate-600">{timeStr}</div>
                    </td>

                    <td
                      className={`px-5 py-4 text-right font-bold whitespace-nowrap ${
                        isPositive ? "text-green-700" : "text-red-600"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {row.change_amount}
                    </td>

                    <td
                      className={`px-5 py-4 text-right font-semibold whitespace-nowrap ${
                        isPositive ? "text-green-800" : "text-red-500"
                      }`}
                    >
                      {row.new_balance}
                    </td>

                    <td className="w-[3vw]"></td>

                    <td className="px-5 py-4 text-slate-700 italic text-sm">
                      <span className="block max-w-xs break-words">{row.reason}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
