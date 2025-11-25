import React, { useState, useEffect, useMemo, useRef } from "react";
import CreatorNavbar from "./CreatorNavbar";
import { useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import {
  MdStarRate, MdAccessTime, MdCategory,
  MdPeopleAlt, MdPersonAdd, MdOutlinePeopleAlt
} from "react-icons/md";

// Click-outside close with menuRef only
function useClickOutside(ref, close) {
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) close();
    }
    window.addEventListener("mousedown", handle);
    return () => window.removeEventListener("mousedown", handle);
  }, [close, ref]);
}

function CustomDropdown({ options, value, setValue, label, buttonClass }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef();
  const menuRef = useRef();
  useClickOutside(menuRef, () => setOpen(false));

  const current = options.find(opt => opt.value === value);

  return (
    <div className="relative inline-block">
      <button
        ref={btnRef}
        type="button"
        className={
          (buttonClass || "") +
          " flex items-center justify-between gap-2 bg-green-50 h-10 px-4 py-2 border border-green-200 rounded text-green-900 text-sm font-semibold select-none z-10"
        }
        onClick={() => setOpen(o => !o)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {current?.label || label}
        <svg className="ml-1 w-4 h-4 text-green-600" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" strokeWidth="2" d="M6 8l4 4 4-4"/>
        </svg>
      </button>
      {open && (
        <div
          ref={menuRef}
          className="absolute left-0 top-12 z-50 bg-white border border-green-300 rounded shadow w-max min-w-[120px] py-1"
          style={{ minWidth: btnRef.current?.offsetWidth }}
        >
          {options.map(opt =>
            <div
              key={opt.value}
              className={`px-3 py-2 cursor-pointer text-green-800 hover:bg-green-100 text-sm ${value === opt.value ? "font-bold bg-green-50" : ""}`}
              onClick={() => { setValue(opt.value); setOpen(false); }}
            >{opt.label}</div>
          )}
        </div>
      )}
    </div>
  );
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function formatIST(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  const utcMs = d.getTime() + d.getTimezoneOffset() * 60000;
  const istOffsetMs = 5.5 * 60 * 60000;
  return new Date(utcMs + istOffsetMs).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const statusOptions = [
  { value: "", label: "All" },
  { value: "open", label: "Open" },
  { value: "ongoing", label: "Ongoing" },
  { value: "closed", label: "Closed" }
];
const statusColors = {
  ongoing: "bg-green-100 text-green-800 border-green-400",
  open: "bg-blue-100 text-blue-900 border-blue-400",
  closed: "bg-red-100 text-red-700 border-red-400"
};

function getPreview(text, maxLen = 70) {
  if (!text) return "";
  if (text.length <= maxLen) return text;
  const trimmed = text.substr(0, maxLen).replace(/\s\S*$/, "");
  return trimmed + "...";
}

export default function ViewChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true); setError(null);
      try {
        const creatorId = localStorage.getItem("creatorId");
        if (!creatorId) {
          setError("Creator ID not found in local storage."); setLoading(false); return;
        }
        const url = `${baseUrl}/api/challenges/creator/${creatorId}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
        const data = await res.json();
        setChallenges(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load challenges.");
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(challenges.map((c) => c.category).filter(Boolean))];
    unique.sort();
    return [{ value: "", label: "All" }, ...unique.map(v => ({ value: v, label: v }))];
  }, [challenges]);

  const filtered = challenges.filter(c => {
    const matchesSearch = (c.title?.toLowerCase() ?? "").includes(search.trim().toLowerCase());
    const matchesCat = !category || c.category === category;
    const matchesStatus = !status || c.status === status;
    const start = c.start_date ? new Date(c.start_date) : null;
    const end = c.end_date ? new Date(c.end_date) : null;
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;
    let dateMatch = true;
    if (from && end && end < from) dateMatch = false;
    if (to && start && start > to) dateMatch = false;
    return matchesSearch && matchesCat && matchesStatus && dateMatch;
  });

  const handleChallengeClick = (id) => {
    navigate("/creator/modify-challenge", { state: { challengeId: id } });
  };

  return (
    <div className="min-h-screen py-0 flex flex-col relative overflow-x-hidden bg-green-50 pb-10">
      <div className="fixed inset-0 z-0 pointer-events-none select-none" aria-hidden>
        <FaLeaf className="absolute left-[-42px] top-[-38px] opacity-15 text-green-400 w-[130px] h-[130px] rotate-[15deg]" />
        <FaLeaf className="absolute right-[-52px] bottom-[-40px] opacity-15 text-green-300 w-[150px] h-[150px] rotate-[-45deg]" />
        <svg className="absolute left-[12vw] top-[80vh] opacity-10" width="180" height="80" viewBox="0 0 180 80">
          <ellipse cx="90" cy="40" rx="90" ry="40" fill="#98ECBD"/>
        </svg>
        <div className="absolute top-[38%] left-[40%] w-[110px] h-[110px] rounded-full bg-green-100 opacity-20 blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-bl from-green-50 via-blue-50/80 to-emerald-100 opacity-90" />
      </div>
      <CreatorNavbar />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-2 sm:px-4 mb-14">
        <h1 className="text-3xl font-bold text-green-900 mb-7 text-center">
          Your Created Challenges
        </h1>
        {/* Filter bar, put z-20 to be above cards, but below dropdown */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:gap-8 gap-5 bg-white/80 rounded-xl px-2 py-4 shadow-sm backdrop-blur z-20 relative">
          <div className="flex flex-col gap-2 flex-1 z-0">
            <label className="font-medium text-green-900 text-sm">Search by Title</label>
            <input
              className="rounded shadow px-4 py-2 h-10 border border-green-200 focus:border-green-400 focus:outline-none bg-green-50 text-green-900 font-semibold"
              type="text"
              placeholder="Search challenges..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col z-0">
              <label className="font-medium text-green-900 text-sm">Category</label>
              <CustomDropdown
                options={categories}
                value={category}
                setValue={setCategory}
                label="All"
              />
            </div>
            <div className="flex flex-col z-0">
              <label className="font-medium text-green-900 text-sm">Status</label>
              <CustomDropdown
                options={statusOptions}
                value={status}
                setValue={setStatus}
                label="All"
              />
            </div>
            <div className="flex flex-col z-0">
              <label className="font-medium text-green-900 text-sm">From</label>
              <input
                type="date"
                className="rounded px-3 py-2 h-10 border border-green-200 bg-green-50 text-green-900 text-sm font-semibold"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                max={dateTo || undefined}
              />
            </div>
            <div className="flex flex-col z-0">
              <label className="font-medium text-green-900 text-sm">To</label>
              <input
                type="date"
                className="rounded px-3 py-2 h-10 border border-green-200 bg-green-50 text-green-900 text-sm font-semibold"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                min={dateFrom || undefined}
              />
            </div>
          </div>
        </div>
        {/* Card grid */}
        <div className="w-full grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full text-center text-green-800 font-bold text-xl py-12">
              Fetching your challenges...
            </div>
          ) : error ? (
            <div className="col-span-full text-center text-red-600 bg-red-100 rounded py-8 text-lg font-semibold border border-red-300 shadow">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-center text-green-700 py-8 text-lg font-semibold">
              No challenges found.
            </div>
          ) : (
            filtered.map((c) => (
              <button
                key={c.id}
                className="relative z-0 rounded-xl shadow bg-white border border-green-100 px-5 py-4 flex flex-col gap-2 transition cursor-pointer hover:border-2 hover:border-green-400 hover:shadow-lg min-h-[210px] text-left focus:outline-none focus:ring-4 focus:ring-green-200"
                type="button"
                onClick={() => handleChallengeClick(c.id)}
              >
                {/* Status tag in top right */}
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border shadow-sm select-none z-10
                  ${statusColors[c.status] || "bg-gray-100 text-gray-700 border-gray-300"}
                `}>
                  {c.status && (c.status[0].toUpperCase() + c.status.slice(1))}
                </span>
                <div className="flex items-center gap-2 text-base font-bold text-green-900 mb-1 break-words z-0">
                  <MdCategory className="w-5 h-5 text-green-700 flex-shrink-0" />
                  <span className="truncate break-words">{c.title}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-1 z-0">
                  <span className="flex items-center gap-1 px-2 py-[2px] rounded-full bg-green-600 text-white text-sm font-bold"
                        style={{ minWidth: 98, justifyContent: "center", fontFamily: "inherit", letterSpacing: 0.1 }}>
                    <FaLeaf className="w-5 h-5 text-white" />
                    +{c.green_points} points
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-200/50 text-green-900 text-xs font-bold border border-green-300 shadow-sm">
                    <MdCategory className="w-4 h-4" /> {c.category}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-200/50 text-blue-900 text-xs font-bold border border-blue-300 shadow-sm">
                    <MdStarRate className="w-4 h-4 text-yellow-400" /> {c.difficulty}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1 z-0">
                  <span className="flex items-center gap-1 text-green-900 font-semibold text-xs">
                    <MdPersonAdd className="w-4 h-4" /> Registered: {c.total_registered}
                  </span>
                  <span className="flex items-center gap-1 text-yellow-900 font-semibold text-xs">
                    <MdPeopleAlt className="w-4 h-4" /> Participants: {c.total_participated}
                  </span>
                  <span className="flex items-center gap-1 text-blue-900 font-semibold text-xs">
                    <MdOutlinePeopleAlt className="w-4 h-4" /> Max: {c.max_participants}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 mt-1 text-xs text-green-800 z-0">
                  <span className="flex items-center gap-1" title="Start Date">
                    <MdAccessTime className="w-4 h-4 text-green-900" />
                    {formatIST(c.start_date)}
                  </span>
                  <span className="flex items-center gap-1" title="End Date">
                    <MdAccessTime className="w-4 h-4 text-red-700" />
                    {formatIST(c.end_date)}
                  </span>
                </div>
                {c.description && (
                  <p className="text-green-700 text-xs mt-2 whitespace-pre-line z-0">{getPreview(c.description, 70)}</p>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
