import React, { useState, useEffect } from "react";
import CreatorNavbar from "./CreatorNavbar";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function ViewChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      setError(null);
      try {
        const creatorId = localStorage.getItem("creatorId");
        if (!creatorId) {
          setError("Creator ID not found in local storage.");
          setLoading(false);
          return;
        }
        const url = `${baseUrl}/api/challenges/creator/${creatorId}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
        const data = await res.json();
        setChallenges(data);
      } catch (err) {
        setError(err.message || "Failed to load challenges.");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const handleChallengeClick = (id) => {
    navigate("/creator/modify-challenge", { state: { challengeId: id } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-green-200 font-sans relative overflow-hidden z-0">
      <CreatorNavbar />
      <div className="px-4 sm:px-8 py-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-green-900 mb-6 text-center">
          Your Created Challenges
        </h1>

        {loading && (
          <div className="text-center py-20 text-green-700 font-semibold text-xl">
            Loading challenges...
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-800 px-5 py-4 rounded max-w-3xl mx-auto text-center font-semibold mb-6">
            {error}
          </div>
        )}

        {!loading && !error && challenges.length === 0 && (
          <div className="text-center text-green-700 font-semibold text-lg mt-10">
            You have not created any challenges yet.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {challenges.map(
            ({
              id,
              title,
              description,
              category,
              difficulty,
              green_points,
              status,
              start_date,
              end_date,
              max_participants,
            }) => (
              <button
                key={id}
                onClick={() => handleChallengeClick(id)}
                className="bg-white border border-green-300 rounded-lg shadow p-6 flex flex-col justify-between hover:shadow-lg transition text-left focus:outline-none focus:ring-4 focus:ring-green-400"
                type="button"
              >
                <div>
                  <h2 className="text-xl font-bold text-green-900 mb-2 truncate">{title}</h2>
                  <p className="text-green-700 text-sm mb-2 line-clamp-3 whitespace-pre-wrap">{description}</p>
                  <div className="flex flex-wrap gap-2 mb-3 text-xs font-semibold text-green-800">
                    <span className="bg-green-200 rounded-full px-3 py-1">Category: {category}</span>
                    <span className="bg-green-200 rounded-full px-3 py-1">Difficulty: {difficulty}</span>
                    <span className="bg-green-200 rounded-full px-3 py-1">Status: {status}</span>
                    <span className="bg-green-200 rounded-full px-3 py-1">Points: {green_points}</span>
                  </div>
                  <p className="text-green-600 text-xs">
                    Start: {new Date(start_date).toLocaleString()}
                  </p>
                  <p className="text-green-600 text-xs mb-2">
                    End: {new Date(end_date).toLocaleString()}
                  </p>
                  <p className="text-green-600 text-xs">Max Participants: {max_participants}</p>
                </div>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
