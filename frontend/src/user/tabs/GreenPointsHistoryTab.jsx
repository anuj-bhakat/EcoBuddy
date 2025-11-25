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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h3 className="text-xl sm:text-2xl font-bold text-green-800">
          Green Points History
        </h3>
        {currentPoints !== null && (
          <div className="bg-green-100 px-3 py-2 rounded-lg text-green-800 font-semibold text-sm flex items-center border border-green-200">
            Balance: <span className="ml-2 text-xl font-bold text-green-900">{currentPoints}</span>
            <span className="ml-1 text-lg">🌱</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center gap-3 text-green-700">
            <svg className="animate-spin h-6 w-6 text-green-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="font-medium">Loading...</span>
          </div>
        </div>
      ) : err ? (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 font-medium">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            {err}
          </div>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-8 bg-green-50 rounded-lg border border-green-200">
          <div className="text-4xl mb-2">🌱</div>
          <p className="text-gray-600 font-medium">No transactions yet</p>
          <p className="text-gray-500 text-sm">Start participating in challenges!</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-lg shadow-md border border-green-200 bg-white">
          <table className="min-w-[500px] w-full table-auto text-green-900">
            <thead className="bg-green-50 text-green-800 text-xs uppercase tracking-wide border-b border-green-200">
              <tr>
                <th className="py-3 px-4 text-left font-semibold whitespace-nowrap">Date</th>
                <th className="py-3 px-4 text-center font-semibold whitespace-nowrap">Change</th>
                <th className="py-3 px-4 text-center font-semibold whitespace-nowrap">Balance</th>
                <th className="py-3 px-4 text-left font-semibold">Reason</th>
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
                    className="border-b border-green-100 hover:bg-green-50 transition-colors text-sm"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-green-800 font-medium">
                        <div className="text-sm">{dateStr}</div>
                        <div className="text-xs text-green-600">{timeStr}</div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md font-semibold text-xs ${
                          isPositive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isPositive ? "+" : ""}{row.change_amount}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className="font-semibold text-green-800">
                        {row.new_balance}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-700 max-w-xs truncate" title={row.reason}>
                      <span className="text-sm">{row.reason}</span>
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
