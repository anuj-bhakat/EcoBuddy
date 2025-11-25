import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import {
  MdOutlinePeopleAlt, MdPeopleAlt, MdPersonAdd, MdPerson,
  MdImage, MdVideocam, MdCheckCircle, MdClose, MdCategory,
  MdStarRate, MdAccessTime, MdEdit, MdDelete, MdSave, MdArrowBack
} from "react-icons/md";
import { FaLeaf } from "react-icons/fa";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const USERS_PER_PAGE = 10;

// --- Utilities ---
const formatIST = (dateString) => {
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
};
const getRemainingTimeString = (endDateStr) => {
  if (!endDateStr) return null;
  const now = new Date(), end = new Date(endDateStr);
  const toIST = (dt) => new Date(dt.getTime() + ((330 - dt.getTimezoneOffset()) * 60000));
  const [nowIST, endIST] = [toIST(now), toIST(end)];
  if (endIST < nowIST) return "Ended";
  let diff = Math.floor((endIST - nowIST) / 1000), d = Math.floor(diff / 86400);
  diff -= d * 86400; const h = Math.floor(diff / 3600);
  diff -= h * 3600; const m = Math.floor(diff / 60);
  if (d > 0) return `${d}d ${h}h ${m}m left`;
  if (h > 0) return `${h}h ${m}m left`;
  if (m > 0) return `${m}m left`;
  return "< 1m left";
};
const paginate = (arr, page, perPage = USERS_PER_PAGE) =>
  arr.slice((page - 1) * perPage, page * perPage);

const Spinner = ({ text = "Submitting your entry..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="relative mb-4">
      <div className="w-14 h-14 border-8 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <FaLeaf className="text-green-500 w-7 h-7 animate-pulse" />
      </div>
    </div>
    <div className="font-bold text-blue-900 text-lg animate-pulse">{text}</div>
    <div className="text-blue-400 mt-2 text-sm">This may take a few minutes.</div>
  </div>
);

const SubmissionSuccess = ({ message = "Submission successful!", to = "/challenges" }) => (
  <div className="flex flex-col items-center min-h-[220px] justify-center w-full py-8">
    <MdCheckCircle className="text-green-600 w-16 h-16 mb-3 animate-bounce" />
    <div className="text-green-700 font-bold text-xl mb-2 text-center">{message}</div>
    <button
      className="px-6 py-2 bg-blue-700 text-white font-semibold rounded-full shadow-md hover:bg-blue-900 transition"
      onClick={() => window.location.replace(to)}
    >Go to Challenges</button>
  </div>
);

const FilePreview = ({ files, remove, type = "image" }) =>
  <div className="flex flex-wrap gap-2 mt-2">{files.map((file, idx) =>
    <div key={idx} className="relative flex flex-col items-center">
      {type === "image"
        ? <img src={URL.createObjectURL(file)} alt={`Preview ${idx + 1}`}
            className="w-16 h-16 object-cover rounded shadow border" />
        : <video src={URL.createObjectURL(file)} controls
            className="rounded shadow w-28 h-16 max-w-full object-cover" />}
      <button type="button"
        onClick={() => remove(idx)}
        className="absolute -top-2 -right-2 bg-white border rounded-full p-1 shadow text-xs hover:bg-red-200"
        title="Remove">
        <MdClose className="w-4 h-4 text-red-700" />
      </button>
    </div>
  )}</div>;

function SubmissionEditForm({
  editText, setEditText, editImageFiles, setEditImageFiles, editVideoFile, setEditVideoFile,
  editImageInput, editVideoInput, handleEditImageChange, handleEditVideoChange,
  removeEditImage, removeEditVideo, handleEditSubmit, editStatus, editSubmitting,
  setShowEdit, setEditStatus, setEditSuccess,
}) {
  if (editSubmitting) return <Spinner text="Submitting your modification..." />;
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-green-900 text-lg flex items-center gap-1"><MdEdit /> Modify Submission</span>
        <button type="button" className="px-2 py-1 rounded bg-gray-200 text-gray-900 border hover:bg-gray-300 text-sm flex items-center gap-1"
          onClick={() => {
            setShowEdit(false); setEditImageFiles([]); setEditVideoFile(null); setEditStatus(""); setEditSuccess(false);
          }}><MdArrowBack />Cancel</button>
      </div>
      <form onSubmit={handleEditSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2 font-semibold text-green-900">
          Text Submission:
          <textarea className="border rounded p-2 resize-y min-h-[70px] text-[1rem]"
            value={editText} onChange={e => setEditText(e.target.value)}
            maxLength={2000} rows={3} />
        </label>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block font-semibold text-green-900 mb-2">Change Images (max 10)</label>
            <button type="button" className="px-2 py-1 bg-green-600 text-white font-bold rounded shadow flex items-center gap-2 mb-2 hover:bg-green-800 active:bg-green-900 text-sm"
              onClick={() => editImageInput.current?.click()}><MdImage className="w-5 h-5" /> Select Images</button>
            <input ref={editImageInput} type="file" accept="image/*" multiple max={10} onChange={handleEditImageChange} style={{ display: "none" }} />
            <FilePreview files={editImageFiles} remove={removeEditImage} type="image" />
            {editImageFiles.length >= 10 && <div className="text-xs text-green-900 mt-1">Max 10 images selected.</div>}
          </div>
          <div className="flex-1">
            <label className="block font-semibold text-green-900 mb-2">Change Video (optional, replaces previous)</label>
            <button type="button" className="px-2 py-1 bg-blue-700 text-white font-bold rounded shadow flex items-center gap-2 mb-2 hover:bg-blue-900 text-sm"
              onClick={() => editVideoInput.current?.click()} disabled={!!editVideoFile}><MdVideocam className="w-5 h-5" /> Select Video</button>
            <input ref={editVideoInput} type="file" accept="video/*" multiple={false} onChange={handleEditVideoChange} style={{ display: "none" }} />
            {editVideoFile && <FilePreview files={[editVideoFile]} remove={removeEditVideo} type="video" />}
            <div className="text-xs text-blue-900 mt-1">{editVideoFile ? "Max 1 video selected." : ""}</div>
          </div>
        </div>
        {editStatus && <div className={`mb-2 text-sm text-center ${editStatus.startsWith("Failed") ? "text-red-600" : "text-green-700"}`}>{editStatus}</div>}
        <button type="submit" disabled={editSubmitting}
          className="w-full mt-2 px-4 py-3 bg-blue-700 hover:bg-blue-900 text-white rounded-full font-bold shadow-lg transition-shadow flex items-center justify-center gap-1">
          <MdSave className="w-5 h-5" />{editSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

// --- User List Section (responsive, paginated) ---
function UserList({ users, type, userId, page, setPage }) {
  const paged = paginate(users, page);
  return (
    <div className="mt-3 space-y-3 w-full">
      {users.length === 0 ? (
        <div className="italic text-green-700 px-2 py-3 text-center">
          No {type === "registered" ? "registered users" : "participants"} found.
        </div>
      ) : (
        <>
          <ul className="list-none space-y-2 w-full">
            {paged.map(user => {
              const isCurrent = user.user_id === userId;
              const name = user.users?.full_name || "Unknown";
              const email = user.users?.email;
              return (
                <li
                  key={user.user_id}
                  className={
                    "bg-green-50/60 rounded-lg py-2 px-3 shadow border border-green-100 w-full" +
                    " flex items-center justify-between gap-x-4 gap-y-2 flex-wrap sm:flex-nowrap" +
                    (isCurrent ? " font-bold text-green-700 ring-1 ring-green-400" : "")
                  }
                >
                  <div className="flex items-center min-w-0 flex-1 gap-x-2 flex-wrap">
                    <MdPerson className="w-5 h-5 text-green-800 flex-shrink-0" />
                    <span className="truncate max-w-[120px] sm:max-w-[12vw]">{name}</span>
                    {email && (
                      <span className="hidden sm:inline text-xs text-green-700 font-normal truncate max-w-[160px] sm:max-w-[18vw]">
                        ({email})
                      </span>
                    )}
                    <span className="block sm:hidden w-full text-xs text-green-700 font-normal truncate">{email && `(${email})`}</span>
                    {isCurrent && (
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-green-200 text-xs font-semibold border border-green-400">
                        You
                      </span>
                    )}
                  </div>
                  {type === "participated" && (
                    <span className="flex-shrink-0 mt-2 sm:mt-0 ml-auto">
                      <MdCheckCircle className="text-blue-700 inline w-5 h-5 align-middle" title="Participated" />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          {users.length > USERS_PER_PAGE && (
            <div className="flex justify-center gap-3 mt-4">
              <button
                className="px-2 py-1 rounded bg-green-100 text-green-900 font-semibold text-sm disabled:opacity-50"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >Prev</button>
              <span className="px-2 font-semibold text-green-900">
                Page {page} / {Math.max(1, Math.ceil(users.length / USERS_PER_PAGE))}
              </span>
              <button className="px-2 py-1 rounded bg-green-100 text-green-900 font-semibold text-sm disabled:opacity-50"
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(users.length / USERS_PER_PAGE)}
              >Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}


// --- Main Component ---
export default function ChallengeParticipation() {
  // All state variables
  const [challenge, setChallenge] = useState(null), [registeredUsers, setRegisteredUsers] = useState([]), [participantsUsers, setParticipantsUsers] = useState([]), [loading, setLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState(""), [textSubmission, setTextSubmission] = useState(""), [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null), [submitting, setSubmitting] = useState(false), [submitSuccess, setSubmitSuccess] = useState(false), [tab, setTab] = useState("submit");
  const [descFont, setDescFont] = useState("text-base"), [regPage, setRegPage] = useState(1), [partPage, setPartPage] = useState(1), [mySubmission, setMySubmission] = useState(null);
  const [showEdit, setShowEdit] = useState(false), [editText, setEditText] = useState(""), [editImageFiles, setEditImageFiles] = useState([]), [editVideoFile, setEditVideoFile] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false), [editStatus, setEditStatus] = useState(""), [editSuccess, setEditSuccess] = useState(false), [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const location = useLocation(), navigate = useNavigate(), challengeId = location.state?.challengeId;
  const [userId, setUserId] = useState("");
  const imageInput = useRef(), videoInput = useRef(), editImageInput = useRef(), editVideoInput = useRef();

  // Effects for login/user, fetch details, submission
  useEffect(() => { const token = localStorage.getItem("user"), uid = localStorage.getItem("user_id");
    if (!token) navigate("/login", { replace: true }); else setUserId(uid); }, [navigate]);
  useEffect(() => { if (!challengeId) navigate("/", { replace: true });
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${baseUrl}/api/challenges/${challengeId}/detail`);
        setChallenge(res.data);
        const userRes = await axios.get(`${baseUrl}/api/challenges/${challengeId}/users`);
        setRegisteredUsers(userRes.data.registered || []); setParticipantsUsers(userRes.data.participated || []);
      } catch { setChallenge(null); } finally { setLoading(false); }
    } if (challengeId) fetchData();
  }, [challengeId, navigate]);
  useEffect(() => { async function fetchSubmission() {
    if (userId) try {
      const { data } = await axios.get(`${baseUrl}/api/challenge-submissions/by-user/${userId}`);
      setMySubmission(data.find(d => d.challenge_id === challengeId) || null);
    } catch { setMySubmission(null); }
  } if (userId && challengeId) fetchSubmission();
  }, [userId, challengeId, submitSuccess, showEdit, editSubmitting, deleteSubmitting, editSuccess]);
  const [remaining, setRemaining] = useState("");
  useEffect(() => { let timer;
    if (challenge?.end_date) {
      const update = () => setRemaining(getRemainingTimeString(challenge.end_date));
      update(); timer = setInterval(update, 60000);
    }
    return () => clearInterval(timer);
  }, [challenge?.end_date]);

  // HANDLERS...
  const handleImageChange = e => { const files = Array.from(e.target.files); const total = imageFiles.length + files.length;
    if (total > 10) { setSubmitStatus("You can upload up to 10 images only."); return; }
    setImageFiles(prev => [...prev, ...files.slice(0, 10 - imageFiles.length)]); e.target.value = "";
  }, handleVideoChange = e => { const file = e.target.files[0]; if (file) setVideoFile(file); e.target.value = ""; },
    removeImage = idx => setImageFiles(prev => prev.filter((_, i) => i !== idx)),
    removeVideo = () => setVideoFile(null);
  const handleEditImageChange = e => { const files = Array.from(e.target.files); const total = editImageFiles.length + files.length;
    if (total > 10) { setEditStatus("You can upload up to 10 images only."); return; }
    setEditImageFiles(prev => [...prev, ...files.slice(0, 10 - editImageFiles.length)]); e.target.value = "";
  }, handleEditVideoChange = e => { const file = e.target.files[0]; if (file) setEditVideoFile(file); e.target.value = ""; },
    removeEditImage = idx => setEditImageFiles(prev => prev.filter((_, i) => i !== idx)),
    removeEditVideo = () => setEditVideoFile(null);

  const handleFontChange = type => {
    const sizes = ["text-sm", "text-base", "text-lg", "text-xl"], curIndex = sizes.indexOf(descFont);
    if (type === "increase" && curIndex < sizes.length - 1) setDescFont(sizes[curIndex + 1]);
    else if (type === "decrease" && curIndex > 0) setDescFont(sizes[curIndex - 1]);
  };
  const handleClose = () => navigate("/challenges", { replace: true });

  const handleSubmit = async e => {
    e.preventDefault(); setSubmitting(true); setSubmitStatus(""); setSubmitSuccess(false);
    try {
      if (imageFiles.length === 0 && !videoFile && !textSubmission.trim()) {
        setSubmitStatus("Please submit at least one image or a video or some text."); setSubmitting(false); return;
      }
      const formData = new FormData();
      formData.append("challenge_id", challengeId); formData.append("user_id", userId); formData.append("text_submission", textSubmission);
      imageFiles.forEach(file => formData.append("images", file)); if (videoFile) formData.append("video", videoFile);
      await axios.post(`${baseUrl}/api/challenge-submissions`, formData, { headers: { "Content-Type": "multipart/form-data" }, timeout: 300000 });
      await axios.post(`${baseUrl}/api/challenges/${challengeId}/participate`, { user_id: userId }, { headers: { "Content-Type": "application/json" } });
      setSubmitSuccess(true); setSubmitStatus("Submission uploaded successfully!"); setTextSubmission(""); setImageFiles([]); setVideoFile(null);
      if (imageInput.current) imageInput.current.value = null; if (videoInput.current) videoInput.current.value = null;
    } catch (err) { setSubmitStatus("Failed to upload: " + (err.response?.data?.error || err.message)); }
    finally { setSubmitting(false); }
  };

  const handleEditSubmit = async e => {
    e.preventDefault(); if (!mySubmission) return; setEditSubmitting(true); setEditStatus(""); setEditSuccess(false);
    try {
      const formData = new FormData();
      if (editText !== mySubmission.text_submission) formData.append("text_submission", editText);
      if (editImageFiles.length > 0) editImageFiles.forEach(file => formData.append("images", file));
      if (editVideoFile) formData.append("video", editVideoFile);
      if (!formData.has("text_submission") && !formData.has("images") && !formData.has("video")) {
        setEditStatus("You haven't modified any fields."); setEditSubmitting(false); return;
      }
      await axios.put(`${baseUrl}/api/challenge-submissions/${mySubmission.id}`, formData, { headers: { "Content-Type": "multipart/form-data" }, timeout: 300000 });
      setShowEdit(false); setEditStatus(""); setEditImageFiles([]); setEditVideoFile(null); setEditSuccess(true);
      if (editImageInput.current) editImageInput.current.value = null; if (editVideoInput.current) editVideoInput.current.value = null;
    } catch (err) { setEditStatus("Failed to update: " + (err.response?.data?.message || err.message)); }
    finally { setEditSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your submission?")) return;
    setDeleteSubmitting(true); setEditStatus("");
    try {
      await axios.delete(`${baseUrl}/api/challenge-submissions/${mySubmission.id}`);
      await axios.post(`${baseUrl}/api/challenges/${challengeId}/remove-participant`, { user_id: userId }, { headers: { "Content-Type": "application/json" } });
      setShowEdit(false); setEditStatus(""); setSubmitSuccess(false); setTextSubmission(""); setImageFiles([]); setVideoFile(null); setMySubmission(null);
    } catch (err) { setEditStatus("Failed to delete: " + (err.response?.data?.message || err.message)); }
    finally { setDeleteSubmitting(false); }
  };

  // --- Get challenge status badge ---
  const getStatusBadge = status => {
    const style =
      status?.toLowerCase() === "active" ? "bg-green-200 text-green-900" :
      status?.toLowerCase() === "ended" ? "bg-red-200 text-red-900" : "bg-amber-200 text-amber-900";
    return <span className={`px-3 py-1 rounded-full font-semibold text-base shadow ${style}`}>{status?.toUpperCase() || "UNKNOWN"}</span>;
  };

  // --- Submission Display with "Submitted: ..." ---
  function SubmissionEntryView() {
    if (!mySubmission) return null;
    if (editSuccess) return <SubmissionSuccess message="Submission updated successfully!" />;
    return (
      <div>
        <div className="flex flex-row items-center justify-between mb-2">
          <div className="flex items-center gap-2 ml-2 px-3 py-1.5 rounded-md bg-green-100 text-green-900 font-semibold">
            <MdCheckCircle className="text-green-600 text-lg" />
            <span className="text-sm tracking-wide">
              <span className="uppercase">{mySubmission.status}</span>
              <span className="mx-1 text-green-700">•</span>
              <span className="font-normal">{formatIST(mySubmission.submitted_at)}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setEditText(mySubmission.text_submission || "");
                setShowEdit(true);
                setEditImageFiles([]);
                setEditVideoFile(null);
                setEditStatus("");
                setEditSuccess(false);
              }}
              className="px-3 py-1 rounded bg-yellow-100 border border-yellow-400 hover:bg-yellow-200 font-bold text-yellow-900 flex items-center gap-1 text-sm"><MdEdit /> Modify</button>
            <button
              onClick={handleDelete}
              disabled={deleteSubmitting}
              className={`px-3 py-1 rounded bg-red-100 border border-red-400 hover:bg-red-200 font-bold text-red-800 flex items-center gap-1 text-sm ${deleteSubmitting ? "opacity-40" : ""}`}>
              <MdDelete /> Delete
            </button>
          </div>
        </div>
        {editStatus && (
          <div className={`mt-2 mb-1 text-sm text-center ${editStatus.startsWith("Failed") ? "text-red-600" : "text-green-700"}`}>{editStatus}</div>
        )}
      </div>
    );
  }

  // --- Main render ---
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-100 via-green-50 to-green-200">
      <Navbar />
      <div className="w-full mx-auto pt-8 pb-16 flex flex-col gap-8 px-6 sm:px-10 lg:px-16">
        <div className="flex flex-row justify-between items-center mb-2 gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-green-900 text-center flex-1">Challenge Participation</h1>
          <button onClick={handleClose} className="inline-flex items-center gap-2 px-5 py-2 ml-4 rounded-lg bg-red-100 border-2 border-red-300 hover:bg-red-200 text-red-700 font-bold text-lg transition shadow" title="Close">
            <MdClose className="w-6 h-6" /><span className="hidden sm:inline">Close</span>
          </button>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-green-800 mt-4 text-lg font-semibold">Fetching challenge details...</p>
          </div>
        ) : challenge ? (
          <div className="flex flex-col lg:flex-row justify-center items-start gap-8 w-full">
            <section className="flex-shrink-0 w-full lg:w-[50vw] max-w-full bg-white rounded-2xl shadow-xl flex flex-col gap-5 min-h-[420px] px-6 py-7 relative">
              <span className="font-black text-2xl md:text-3xl text-green-800 mb-1">{challenge.title}</span>
              <div className="flex flex-wrap gap-4 items-center text-green-700 text-lg font-semibold">
                <span className="flex items-center gap-2"><MdCategory className="w-6 h-6" /> {challenge.category}</span>
                <span className="flex items-center gap-2"><MdStarRate className="w-6 h-6 text-yellow-400" /> {challenge.difficulty}</span>
                <span className="flex items-center gap-2"><FaLeaf className="w-6 h-6 text-green-600" /> +{challenge.green_points} Points</span>
              </div>
              <div className="border-t border-green-200" />
              <div className="flex flex-col gap-2 text-green-900 text-base mt-2">
                <div className="flex items-center gap-2"><b>Status:</b> {getStatusBadge(challenge.status)}</div>
                <span><b>Start:</b> {formatIST(challenge.start_date)}</span>
                <span><b>End:</b> {formatIST(challenge.end_date)}</span>
                <span className="flex items-center gap-1 text-blue-800"><MdAccessTime className="w-5 h-5" /><b className="mr-1">Remaining:</b><span className="font-semibold">{remaining}</span></span>
                <div className="flex items-center gap-2">
                  <MdPerson className="w-5 h-5 text-green-800" title="Created by" />
                  <span className="font-semibold">{challenge.users?.full_name || "Unknown"}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <b>Description:</b>
                  <div className="flex gap-2">
                    <button onClick={() => handleFontChange("increase")}
                      className="px-2 py-1 rounded bg-green-200 hover:bg-green-300 text-green-900 font-bold text-sm" title="Increase text size">A+</button>
                    <button onClick={() => handleFontChange("decrease")}
                      className="px-2 py-1 rounded bg-green-200 hover:bg-green-300 text-green-900 font-bold text-sm" title="Decrease text size">A-</button>
                  </div>
                </div>
                <div className={`mt-2 border rounded bg-green-50/60 p-3 max-h-56 overflow-y-auto ${descFont}`}>{challenge.description}</div>
              </div>
              <div className="flex flex-wrap gap-4 mt-auto pt-3">
                <span className="flex items-center gap-2 bg-green-200 rounded px-3 py-1 text-green-900 font-medium"><MdPersonAdd className="w-5 h-5" /> {challenge.total_registered ?? challenge.total_participants}</span>
                <span className="flex items-center gap-2 bg-yellow-200 rounded px-3 py-1 text-yellow-900 font-medium"><MdPeopleAlt className="w-5 h-5" /> {challenge.total_participated ?? 0}</span>
                <span className="flex items-center gap-2 bg-blue-200 rounded px-3 py-1 text-blue-900 font-medium"><MdOutlinePeopleAlt className="w-5 h-5" /> {challenge.max_participants}</span>
              </div>
            </section>
            <section className="flex-shrink-0 w-full lg:w-[35vw] max-w-full lg:max-w-[600px]">
              <div className="bg-white rounded-2xl p-0 pt-2 shadow-xl flex flex-col mb-5 w-full">
                <div className="flex border-b border-green-200 pl-4 gap-2 pt-2 bg-green-50/70 rounded-t-2xl">
                  {[
                    { key: "submit", label: "Submit Entry" },
                    { key: "registered", label: `Registered (${registeredUsers.length})` },
                    { key: "participated", label: `Participants (${participantsUsers.length})` },
                  ].map(({ key, label }) =>
                    <button key={key} onClick={() => setTab(key)}
                      className={`relative pb-2 px-2 sm:px-5 text-base font-semibold transition duration-150 ${tab === key ? "text-blue-700 after:absolute after:left-1 after:right-1 after:bottom-0 after:h-[3px] after:rounded-full after:bg-blue-700" : "text-green-900 hover:text-green-700"}`}
                      style={{ background: "none", border: 0, outline: "none" }}>{label}</button>
                  )}
                </div>
                <div className="p-4 sm:p-6">
                  {tab === "submit" ? (
                    submitting ? <Spinner /> :
                      submitSuccess ? <SubmissionSuccess /> :
                        showEdit ? <SubmissionEditForm
                          editText={editText} setEditText={setEditText}
                          editImageFiles={editImageFiles} setEditImageFiles={setEditImageFiles}
                          editVideoFile={editVideoFile} setEditVideoFile={setEditVideoFile}
                          editImageInput={editImageInput} editVideoInput={editVideoInput}
                          handleEditImageChange={handleEditImageChange}
                          handleEditVideoChange={handleEditVideoChange}
                          removeEditImage={removeEditImage} removeEditVideo={removeEditVideo}
                          handleEditSubmit={handleEditSubmit}
                          editStatus={editStatus} editSubmitting={editSubmitting}
                          setShowEdit={setShowEdit} setEditStatus={setEditStatus} setEditSuccess={setEditSuccess}
                        />
                          : mySubmission ? <SubmissionEntryView />
                            : <section className="flex flex-col gap-5">
                              <h2 className="font-bold text-lg mb-2 text-green-900">Submit your entry</h2>
                              {submitStatus && <div className={`mb-2 text-sm text-center ${submitStatus.startsWith("Failed") ? "text-red-600" : "text-green-700"}`}>{submitStatus}</div>}
                              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <label className="flex flex-col gap-2 font-semibold text-green-900">
                                  Text Submission (optional):
                                  <textarea
                                    className="border rounded p-2 resize-y min-h-[70px] text-[1rem]"
                                    placeholder="Describe your participation or add notes (optional)"
                                    value={textSubmission} onChange={e => setTextSubmission(e.target.value)}
                                    maxLength={2000} rows={3}
                                  />
                                </label>
                                <div className="flex flex-col md:flex-row gap-4">
                                  <div className="flex-1">
                                    <label className="block font-semibold text-green-900 mb-2">Upload Images (max 10)</label>
                                    <button type="button" className="px-2 py-1 bg-green-600 text-white font-bold rounded shadow flex items-center gap-2 mb-2 hover:bg-green-800 active:bg-green-900 text-sm"
                                      onClick={() => imageInput.current?.click()}><MdImage className="w-5 h-5" /> Image</button>
                                    <input ref={imageInput} type="file" accept="image/*" multiple max={10} onChange={handleImageChange} style={{ display: "none" }} />
                                    <FilePreview files={imageFiles} remove={removeImage} type="image" />
                                    <div className="text-xs text-green-900 mt-1">{imageFiles.length >= 10 && "Max 10 images selected."}</div>
                                  </div>
                                  <div className="flex-1">
                                    <label className="block font-semibold text-green-900 mb-2">Upload Video (max 1)</label>
                                    <button type="button" className="px-2 py-1 bg-blue-700 text-white font-bold rounded shadow flex items-center gap-2 mb-2 hover:bg-blue-900 text-sm"
                                      onClick={() => videoInput.current?.click()} disabled={!!videoFile}><MdVideocam className="w-5 h-5" /> Video</button>
                                    <input ref={videoInput} type="file" accept="video/*" multiple={false} onChange={handleVideoChange} style={{ display: "none" }} />
                                    {videoFile && <FilePreview files={[videoFile]} remove={removeVideo} type="video" />}
                                    <div className="text-xs text-blue-900 mt-1">{videoFile ? "Max 1 video selected." : ""}</div>
                                  </div>
                                </div>
                                <button type="submit" disabled={submitting}
                                  className="w-full mt-2 px-4 py-3 bg-blue-700 hover:bg-blue-900 text-white rounded-full font-bold shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500">
                                  {submitting ? "Submitting..." : "Submit Entry"}
                                </button>
                              </form>
                            </section>
                  ) : tab === "registered" ? (
                    <UserList users={registeredUsers} type="registered" userId={userId} page={regPage} setPage={setRegPage} />
                  ) : (
                    <UserList users={participantsUsers} type="participated" userId={userId} page={partPage} setPage={setPartPage} />
                  )}
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="text-xl text-red-600 py-10 font-bold text-center">Challenge details not found.</div>
        )}
      </div>
    </div>
  );
}

