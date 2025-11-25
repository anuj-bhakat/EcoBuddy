import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import CreatorNavbar from "./CreatorNavbar";
import { useNavigate } from "react-router-dom";
import {
  MdStarRate, MdAccessTime, MdCategory, MdPeopleAlt,
  MdPersonAdd, MdOutlinePeopleAlt
} from "react-icons/md";
import { FaLeaf } from "react-icons/fa";

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

export default function GetSubmissions() {
  const [challenges, setChallenges] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const creatorId = localStorage.getItem("creatorId");
  const navigate = useNavigate();

  // Extract categories from data
  const categories = useMemo(() => {
    const unique = [...new Set(challenges.map((c) => c.category).filter(Boolean))];
    unique.sort();
    return [{ value: "", label: "All" }, ...unique.map(v => ({ value: v, label: v }))];
  }, [challenges]);

  useEffect(() => {
    async function fetchChallenges() {
      setLoading(true);
      try {
        const res = await axios.get(`${baseUrl}/api/challenges/creator/${creatorId}`);
        setChallenges(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setChallenges([]);
      } finally {
        setLoading(false);
      }
    }
    fetchChallenges();
  }, [creatorId]);

  // Start/end date filter logic
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

  return (
    <div className="min-h-screen py-0 flex flex-col relative overflow-x-hidden bg-green-50 pb-8">
      {/* Eco Background */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none" aria-hidden>
        <FaLeaf className="absolute left-[-42px] top-[-38px] opacity-15 text-green-400 w-[130px] h-[130px] rotate-[15deg]" />
        <FaLeaf className="absolute right-[-52px] bottom-[-40px] opacity-15 text-green-300 w-[150px] h-[150px] rotate-[-45deg]" />
        <div className="absolute top-[30%] right-[-70px] w-[180px] h-[180px] rounded-full bg-emerald-100 opacity-40 blur-2xl" />
        <div className="absolute bottom-[42%] left-[-100px] w-[160px] h-[160px] rounded-full bg-blue-100 opacity-25 blur-lg" />
        <div className="absolute inset-0 bg-gradient-to-bl from-green-50 via-blue-50/60 to-emerald-100 opacity-85" />
      </div>
      <CreatorNavbar />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-2 sm:px-4 mb-14">
        <div className="mt-10 mb-8 flex flex-col gap-6 md:gap-8">
          {/* Filter bar */}
          <div className="flex flex-col md:flex-row md:items-end md:gap-8 gap-5 bg-white/80 rounded-xl px-2 py-4 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-2 flex-1">
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
              <div className="flex flex-col">
                <label className="font-medium text-green-900 text-sm">Category</label>
                <select
                  className="rounded px-3 py-2 h-10 border border-green-200 bg-green-50 text-green-900 text-sm font-semibold"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  {categories.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="font-medium text-green-900 text-sm">Status</label>
                <select
                  className="rounded px-3 py-2 h-10 border border-green-200 bg-green-50 text-green-900 text-sm font-semibold"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="font-medium text-green-900 text-sm">From</label>
                <input
                  type="date"
                  className="rounded px-3 py-2 h-10 border border-green-200 bg-green-50 text-green-900 text-sm font-semibold"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  max={dateTo || undefined}
                />
              </div>
              <div className="flex flex-col">
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
        </div>
        {/* Card grid */}
        <div className="w-full grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full text-center text-green-800 font-bold text-xl py-12">
              Fetching your challenges...
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-center text-green-700 py-8 text-lg font-semibold">
              No challenges found.
            </div>
          ) : (
            filtered.map((c) => (
              <button
                key={c.id}
                className="relative rounded-xl shadow bg-white border border-green-100 px-5 py-4 flex flex-col gap-2 transition 
                  cursor-pointer hover:border-2 hover:border-green-400 hover:shadow-lg"
                style={{ minHeight: 182 }}
                onClick={() => navigate("/creator/view-submissions", { state: { challengeId: c.id } })}
              >
                {/* Status tag in top right */}
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border shadow-sm z-10 select-none
                  ${statusColors[c.status] || "bg-gray-100 text-gray-700 border-gray-300"}
                `}>
                  {c.status[0].toUpperCase() + c.status.slice(1)}
                </span>
                <div className="flex items-center gap-2 text-base font-bold text-green-900 mb-1 break-words">
                  <MdCategory className="w-5 h-5 text-green-700 flex-shrink-0" />
                  <span className="truncate break-words">{c.title}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-1">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-200/50 text-green-900 text-xs font-bold border border-green-300 shadow-sm">
                    <MdCategory className="w-4 h-4" /> {c.category}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-200/50 text-blue-900 text-xs font-bold border border-blue-300 shadow-sm">
                    <MdStarRate className="w-4 h-4 text-yellow-400" /> {c.difficulty}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-600 text-white text-xs font-bold border border-green-700 shadow-sm">
                    <FaLeaf className="w-4 h-4 text-white" /> +{c.green_points}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
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
                <div className="flex flex-wrap gap-4 mt-1 text-xs text-green-800">
                  <span className="flex items-center gap-1" title="Start Date">
                    <MdAccessTime className="w-4 h-4 text-green-900" />
                    {formatIST(c.start_date)}
                  </span>
                  <span className="flex items-center gap-1" title="End Date">
                    <MdAccessTime className="w-4 h-4 text-red-700" />
                    {formatIST(c.end_date)}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
