import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CreatorNavbar from "./CreatorNavbar";
import {
  FaLeaf,
  FaMinus,
  FaPlus,
  FaSearchMinus,
  FaSearchPlus,
  FaTimes
} from "react-icons/fa";

// Icons
const ChevronLeftIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    strokeWidth={2.3}
    viewBox="0 0 24 24"
    stroke="currentColor"
    width={24}
    height={24}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5L8.25 12l7.5-7.5"
    />
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    strokeWidth={2.3}
    viewBox="0 0 24 24"
    stroke="currentColor"
    width={24}
    height={24}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
    />
    <circle cx="12" cy="12" r="3.5" />
  </svg>
);

function formatIST(dateString) {
  if (!dateString) return "";
  const dt = new Date(dateString);
  return dt.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

const statusColors = {
  accepted: "bg-green-200 text-green-900 border-green-400",
  rejected: "bg-red-200 text-red-700 border-red-400",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-400",
  submitted: "bg-blue-100 text-blue-900 border-blue-400"
};

const apiBase = import.meta.env.VITE_API_BASE_URL;

const EcoBg = () => (
  <div className="fixed inset-0 z-0 pointer-events-none select-none" aria-hidden>
    <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-green-100 to-lime-100 opacity-100" />
    <svg
      width="135"
      height="100"
      className="absolute right-[-30px] top-[9%] opacity-15"
      viewBox="0 0 135 100"
    >
      <ellipse cx="60" cy="60" rx="55" ry="35" fill="#7ed957" />
    </svg>
    <svg
      width="85"
      height="65"
      className="absolute left-[-30px] top-[33%] opacity-10"
      viewBox="0 0 85 65"
    >
      <ellipse cx="40" cy="50" rx="40" ry="15" fill="#bbf7d0" />
    </svg>
    <svg
      width="44"
      height="34"
      className="absolute right-[18vw] bottom-[25%] opacity-8"
      viewBox="0 0 44 34"
    >
      <ellipse cx="22" cy="17" rx="20" ry="10" fill="#22c55e" />
    </svg>
  </div>
);

// 5 levels, tailwind font-size
const fontSizeOptions = [
  "text-xs", // Extra small
  "text-sm", // Small
  "text-base", // Default/medium
  "text-lg", // Large
  "text-2xl" // Extra large
];

export default function ViewSubmissions() {
  const location = useLocation();
  const navigate = useNavigate();
  const challengeId = location.state?.challengeId;

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [greenPoints, setGreenPoints] = useState("");
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [decisionError, setDecisionError] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchUser, setSearchUser] = useState("");
  const [modalImg, setModalImg] = useState(null);
  const [modalImgZoom, setModalImgZoom] = useState(1);
  const [fontSizeIdx, setFontSizeIdx] = useState(2);
  const [maxGreenPoints, setMaxGreenPoints] = useState(1000);

  // Fetch all submissions AND green_points cap for this challenge
  useEffect(() => {
    if (!challengeId) return;
    let active = true;
    setLoading(true);
    setErr(null);

    async function fetchAll() {
      try {
        // Fetch challenge submissions
        const res = await fetch(
          `${apiBase}/api/challenge-submissions/by-challenge/${challengeId}`
        );
        if (!res.ok) throw new Error("Failed to fetch submissions");
        const data = await res.json();
        if (!active) return;
        setSubmissions(Array.isArray(data) ? data : []);

        // Fetch green points for challenge
        const cdRes = await fetch(
          `${apiBase}/api/challenges/${challengeId}/detail`
        );
        let challengeGreen = 1000;
        if (cdRes.ok) {
          const cdata = await cdRes.json();
          challengeGreen = Number(cdata.green_points) || 1000;
        }
        if (!active) return;
        setMaxGreenPoints(challengeGreen);
      } catch (e) {
        if (!active) return;
        setErr(e.message || "Error loading submissions");
        setMaxGreenPoints(1000);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchAll();
    return () => {
      active = false;
    };
  }, [challengeId]);

  // Modal for full image view with zoom and close
  const ImageModal = ({ src, onClose }) => {
    return (
      <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center transition-all">
        <div className="relative max-w-full w-full flex flex-col items-center">
          <div className="absolute top-3 right-4 flex gap-2 z-[201]">
            <button
              className="bg-white text-green-800 hover:bg-green-100 border rounded-full p-2 shadow font-bold transition"
              onClick={() => setModalImgZoom(z => Math.max(0.5, z - 0.2))}
              title="Zoom Out"
            >
              <FaSearchMinus />
            </button>
            <button
              className="bg-white text-green-800 hover:bg-green-100 border rounded-full p-2 shadow font-bold transition"
              onClick={() => setModalImgZoom(z => Math.min(3, z + 0.2))}
              title="Zoom In"
            >
              <FaSearchPlus />
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 border border-red-600 text-white rounded-full p-2 ml-2 font-bold text-lg shadow"
              onClick={() => {
                setModalImg(null);
                setModalImgZoom(1);
              }}
              title="Close"
            >
              <FaTimes />
            </button>
          </div>
          <div className="max-h-[80vh] max-w-[90vw] flex items-center justify-center bg-white rounded-xl shadow-xl overflow-auto p-3">
            <img
              src={src}
              alt="Full Screen Submission"
              style={{
                transform: `scale(${modalImgZoom})`,
                transition: "transform 0.2s",
                maxHeight: "70vh",
                maxWidth: "80vw",
                cursor: "zoom-in",
                background: "#fff"
              }}
              className="shadow-lg rounded-xl object-contain"
              draggable={false}
            />
          </div>
        </div>
      </div>
    );
  };

  const handleDetail = submission => {
    setViewing(submission);
    setGreenPoints(submission.green_points ?? "");
    setFontSizeIdx(2);
  };
  const handleBack = () => {
    setViewing(null);
    setGreenPoints("");
  };
  const handleDecision = async (decision) => {
    setDecisionLoading(true);
    setDecisionError(null);

    if (decision === 'accepted') {
      const gp = Number(greenPoints);
      if (gp < 0 || gp > maxGreenPoints) {
        setDecisionError(`Green points must be between 0 and ${maxGreenPoints}`);
        setDecisionLoading(false);
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append('status', decision);
      const gp = decision === 'accepted' ? Number(greenPoints) : 0;
      formData.append('green_points', gp.toString());

      const res = await fetch(`${apiBase}/api/challenge-submissions/${viewing.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update submission');
      }

      // Update local submissions
      setSubmissions(prev => prev.map(s => s.id === viewing.id ? { ...s, status: decision, green_points: gp } : s));
      setViewing(null);
      setGreenPoints("");
    } catch (err) {
      setDecisionError(err.message);
    } finally {
      setDecisionLoading(false);
    }
  };

  const filtered = submissions
    .filter(
      s =>
        searchUser.trim() === "" ||
        (s.user?.full_name || "")
          .toLowerCase()
          .includes(searchUser.trim().toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.submitted_at) - new Date(a.submitted_at)
        : new Date(a.submitted_at) - new Date(b.submitted_at)
    );

  if (viewing) {
    const images = Array.isArray(viewing.image_urls) ? viewing.image_urls : [];
    return (
      <div className="min-h-screen bg-green-50/60 relative pb-10">
        <EcoBg />
        {modalImg && (
          <ImageModal
            src={modalImg}
            onClose={() => {
              setModalImg(null);
              setModalImgZoom(1);
            }}
          />
        )}
        <CreatorNavbar />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-2 sm:px-6 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-7 w-full">
            <button
              className="max-w-xs flex items-center gap-2 justify-center px-5 py-2 rounded-full bg-white hover:bg-green-100 text-green-900 font-bold text-base shadow focus:outline-none border border-green-200 transition"
              onClick={() => navigate(-1)}
            >
              <ChevronLeftIcon className="w-5 h-5" />
              <span>Back</span>
            </button>
            <button
              className="max-w-xs flex items-center gap-2 justify-center px-5 py-2 rounded-full bg-green-700 hover:bg-green-800 text-white font-bold text-base shadow focus:outline-none border border-green-800 transition"
              onClick={handleBack}
            >
              <EyeIcon className="w-5 h-5" />
              <span>Back to Submissions</span>
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-5 sm:p-8 flex flex-col gap-6 transition-all w-full">
            <div className="flex flex-row flex-wrap gap-2 items-center mb-2">
              {typeof viewing.green_points === "number" &&
                viewing.status === "accepted" && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-600 text-white font-bold text-base ml-auto">
                    <FaLeaf className="w-5 h-5" />
                    +{viewing.green_points}
                  </span>
                )}
              <span
                className={`inline-block px-3 py-1 rounded-full font-bold border shadow text-md ${
                  statusColors[viewing.status] ||
                  "bg-gray-100 text-gray-700 border-gray-300"
                }`}
              >
                {viewing.status?.charAt(0).toUpperCase() +
                  viewing.status?.slice(1)}
              </span>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-2">
              <span className="bg-green-100 font-semibold text-green-900 px-2 py-1 rounded text-base lg:text-lg">
                {viewing.user?.full_name || "User"}
              </span>
              <span className="bg-green-50 px-2 py-1 rounded text-green-700 text-base">
                {viewing.user?.email}
              </span>
              <span className="px-2 py-1 rounded bg-blue-50 text-green-700 text-sm">
                {formatIST(viewing.submitted_at)}
              </span>
            </div>
            {/* Text Submission */}
            {viewing.text_submission && (
              <div>
                <div className="flex gap-2 items-center mb-2">
                  <div className="font-semibold text-green-800 text-sm">
                    Text Submission
                  </div>
                  <button
                    className="bg-green-100 hover:bg-green-200 border border-green-200 px-2 py-1 rounded shadow text-green-900 disabled:opacity-60"
                    title="Decrease font size"
                    onClick={() => setFontSizeIdx(i => Math.max(0, i - 1))}
                    disabled={fontSizeIdx === 0}
                  >
                    <FaMinus />
                  </button>
                  <button
                    className="bg-green-100 hover:bg-green-200 border border-green-200 px-2 py-1 rounded shadow text-green-900 disabled:opacity-60"
                    title="Increase font size"
                    onClick={() => setFontSizeIdx(i => Math.min(4, i + 1))}
                    disabled={fontSizeIdx === 4}
                  >
                    <FaPlus />
                  </button>
                </div>
                <div
                  className={`whitespace-pre-line text-green-900 ${fontSizeOptions[fontSizeIdx]} bg-green-50 px-4 py-3 rounded-xl border border-green-100 break-words shadow-sm transition-all`}
                >
                  {viewing.text_submission}
                </div>
              </div>
            )}
            {/* Images */}
            {images.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="font-semibold text-green-800 text-sm">
                    Images
                  </div>
                  <span className="inline-block bg-green-200 px-2 py-0.5 rounded text-green-800 text-xs font-bold">
                    {images.length}
                  </span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={img}
                        alt={`submission img ${i + 1}`}
                        className="h-28 w-auto rounded-lg border border-green-200 object-cover shadow-sm cursor-pointer hover:scale-105 transition"
                        loading="lazy"
                        onClick={() => {
                          setModalImg(img);
                          setModalImgZoom(1);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Video */}
            {viewing.video_url && (
              <div className="flex flex-col items-center">
                <div className="font-semibold text-green-800 mb-2 text-sm self-start">Video</div>
                <div className="relative rounded-lg overflow-hidden border border-green-200 bg-black flex items-center justify-center">
                  <video
                    controls
                    src={viewing.video_url}
                    className="rounded mx-auto"
                    style={{
                      width: "100%",
                      maxWidth: 480,
                      height: "auto",
                      background: "#000",
                    }}
                  />
                </div>
              </div>
            )}
            {/* Green Points and buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-end mt-3">
              <div className="flex flex-col gap-1">
                <label className="text-green-900 font-medium text-base mb-1">
                  Update Green Points
                </label>
                <input
                  type="number"
                  min={0}
                  max={maxGreenPoints}
                  className="rounded w-32 px-3 py-2 border border-green-300 focus:border-green-500 focus:outline-none bg-green-50 text-green-900 font-semibold"
                  value={greenPoints}
                  onChange={e => setGreenPoints(e.target.value.replace(/[^0-9]/g, ""))}
                  disabled={decisionLoading}
                />
                <div className="text-green-700 text-xs mt-1">
                  Max allowed: {maxGreenPoints}
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button
                  className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold transition disabled:opacity-50 shadow"
                  onClick={() => handleDecision("accepted")}
                  disabled={decisionLoading}
                >
                  Accept
                </button>
                <button
                  className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold transition disabled:opacity-50 shadow"
                  onClick={() => handleDecision("rejected")}
                  disabled={decisionLoading}
                >
                  Reject
                </button>
              </div>
            </div>
            {decisionLoading && (
              <div className="text-green-700 text-md pt-2">Updating...</div>
            )}
            {decisionError && (
              <div className="text-red-700 text-md pt-2">{decisionError}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-green-100 pb-12">
      <EcoBg />
      <CreatorNavbar />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-2 md:px-4 pt-8">
        {/* Heading & Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-7 w-full">
          <h2 className="text-xl md:text-2xl font-bold text-green-900 mb-2 sm:mb-0 tracking-tight">
            Challenge Submissions
          </h2>
          <button
            className="max-w-xs flex items-center gap-2 justify-center px-5 py-2 rounded-full bg-white hover:bg-green-100 text-green-900 font-bold text-base shadow transition border border-green-200 focus:outline-none"
            onClick={() => navigate(-1)}
          >
            <ChevronLeftIcon className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-end md:gap-4 gap-2 mb-6">
          <div className="flex flex-col">
            <label className="font-medium text-green-900 text-xs mb-1">
              Sort by
            </label>
            <select
              className="rounded px-3 py-2 h-9 border border-green-200 bg-white text-green-900 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-green-400"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
          <div className="flex flex-col flex-1">
            <label className="font-medium text-green-900 text-xs mb-1">
              Search by User Name
            </label>
            <input
              type="text"
              className="rounded px-3 py-2 h-9 border border-green-200 bg-white text-green-900 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-green-400"
              placeholder="Type user's full name..."
              value={searchUser}
              onChange={e => setSearchUser(e.target.value)}
            />
          </div>
        </div>
        {loading ? (
          <div className="text-green-600 font-semibold text-center py-16">
            Loading submissions...
          </div>
        ) : err ? (
          <div className="bg-red-200 text-red-800 font-bold px-6 py-4 rounded text-center">
            {err}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-green-900 font-semibold text-center py-10">
            No submissions found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(sub => (
              <button
                key={sub.id}
                onClick={() => handleDetail(sub)}
                className="relative bg-white text-left rounded-xl shadow hover:shadow-lg hover:border-green-500 border border-green-100 px-4 py-3 flex flex-col gap-1 cursor-pointer transition-all duration-150 group min-h-[100px] justify-between"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-1 rounded-full font-bold border ${
                      statusColors[sub.status] ||
                      "bg-gray-100 text-gray-700 border-gray-300"
                    } text-xs`}
                  >
                    {sub.status?.charAt(0).toUpperCase() +
                      sub.status?.slice(1)}
                  </span>
                  {typeof sub.green_points === "number" &&
                    sub.status === "accepted" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-600 text-white font-bold text-xs ml-auto">
                        <FaLeaf className="w-4 h-4" />
                        +{sub.green_points}
                      </span>
                    )}
                </div>
                <div className="flex flex-wrap gap-1 items-center text-xs text-green-700">
                  <span className="bg-green-100 font-semibold text-green-900 px-2 py-1 rounded">
                    {sub.user?.full_name || "User"}
                  </span>
                  <span className="bg-green-50 px-2 py-1 rounded text-green-700">
                    {sub.user?.email || sub.user_id}
                  </span>
                </div>
                <span className="px-2 py-1 rounded bg-blue-50 text-green-700 text-xs mt-2">
                  {formatIST(sub.submitted_at)}
                </span>
                <span className="absolute top-2 right-2 bg-green-50 px-2 py-1 rounded text-green-700 font-semibold text-xs opacity-0 group-hover:opacity-100 transition">
                  View
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
