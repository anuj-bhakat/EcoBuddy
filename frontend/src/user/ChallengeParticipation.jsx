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

// --- User List Section (simplified) ---
function UserList({ users, type, userId, page, setPage }) {
  const paged = paginate(users, page);
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-green-900 text-lg capitalize">
        {type === "registered" ? "Registered Users" : "Participants"}
      </h3>

      {users.length === 0 ? (
        <div className="text-center py-8 text-green-600">
          <p className="font-medium">No {type === "registered" ? "registered users" : "participants"} yet.</p>
          <p className="text-sm text-green-500 mt-1">
            {type === "registered" ? "Users will appear here when they register for this challenge." : "Participants will appear here after they submit their entries."}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paged.map(user => {
              const isCurrent = user.user_id === userId;
              const name = user.users?.full_name || "Unknown User";
              const email = user.users?.email;

              return (
                <div
                  key={user.user_id}
                  className={`bg-white rounded-lg p-4 border shadow-sm ${
                    isCurrent
                      ? "border-green-400 bg-green-50 ring-2 ring-green-200"
                      : "border-green-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <MdPerson className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-green-900 flex items-center gap-2">
                          {name}
                          {isCurrent && (
                            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full font-medium">
                              You
                            </span>
                          )}
                        </div>
                        {email && (
                          <div className="text-sm text-green-600">{email}</div>
                        )}
                      </div>
                    </div>

                    {type === "participated" && (
                      <div className="flex items-center gap-2">
                        <MdCheckCircle className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-blue-600 font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {users.length > USERS_PER_PAGE && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:bg-gray-400"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </button>
              <span className="text-green-900 font-medium">
                Page {page} of {Math.ceil(users.length / USERS_PER_PAGE)}
              </span>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:bg-gray-400"
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(users.length / USERS_PER_PAGE)}
              >
                Next
              </button>
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

  // --- Submission Display (simplified) ---
  function SubmissionEntryView() {
    if (!mySubmission) return null;
    if (editSuccess) return <SubmissionSuccess message="Submission updated successfully!" />;

    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MdCheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-900 capitalize">{mySubmission.status}</span>
              <span className="text-green-600">•</span>
              <span className="text-green-700 text-sm">{formatIST(mySubmission.submitted_at)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditText(mySubmission.text_submission || "");
                setShowEdit(true);
                setEditImageFiles([]);
                setEditVideoFile(null);
                setEditStatus("");
                setEditSuccess(false);
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium transition-colors flex items-center gap-2"
            >
              <MdEdit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteSubmitting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 font-medium transition-colors flex items-center gap-2"
            >
              <MdDelete className="w-4 h-4" />
              {deleteSubmitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        {editStatus && (
          <div className={`p-3 rounded-lg text-center font-medium ${
            editStatus.startsWith("Failed")
              ? "bg-red-50 text-red-800 border border-red-200"
              : "bg-green-50 text-green-800 border border-green-200"
          }`}>
            {editStatus}
          </div>
        )}
      </div>
    );
  }

  // --- Main render ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-900">Challenge Participation</h1>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
          >
            Close
          </button>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="text-green-800 mt-4 font-medium">Loading challenge details...</p>
          </div>
        ) : challenge ? (
          <div className="space-y-6">
            {/* Challenge Information */}
            <div className="bg-white rounded-lg shadow-sm border border-green-200 p-6">
              <h2 className="text-2xl font-bold text-green-900 mb-4">{challenge.title}</h2>

              {/* Key Information Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-green-600 text-sm font-medium mb-1">Category</div>
                  <div className="text-green-900 font-semibold">{challenge.category}</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <div className="text-yellow-600 text-sm font-medium mb-1">Difficulty</div>
                  <div className="text-yellow-900 font-semibold">{challenge.difficulty}</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-blue-600 text-sm font-medium mb-1">Participants</div>
                  <div className="text-blue-900 font-semibold">{challenge.total_participated || 0}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-green-600 text-sm font-medium mb-1">Points</div>
                  <div className="text-green-900 font-semibold flex items-center justify-center gap-1">
                    <FaLeaf className="w-4 h-4" />
                    {challenge.green_points}
                  </div>
                </div>
              </div>

              {/* Challenge Timeline */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-900 mb-3">Challenge Timeline</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700 font-medium">Starts:</span>
                    <span className="text-green-900">{formatIST(challenge.start_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700 font-medium">Ends:</span>
                    <span className="text-green-900">{formatIST(challenge.end_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700 font-medium">Time Remaining:</span>
                    <span className="text-blue-600 font-semibold">{remaining}</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-green-600">
                  Created by: <span className="font-medium">{challenge.users?.full_name || "Unknown"}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-green-900 mb-3">About This Challenge</h3>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-green-800 leading-relaxed whitespace-pre-line">
                    {challenge.description}
                  </p>
                </div>
              </div>
            </div>
            {/* Action Section */}
            <div className="bg-white rounded-lg shadow-sm border border-green-200">
              {/* Tab Navigation */}
              <div className="flex border-b border-green-200">
                {[
                  { key: "submit", label: "Submit Entry" },
                  { key: "registered", label: `Registered (${registeredUsers.length})` },
                  { key: "participated", label: `Participants (${participantsUsers.length})` },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                      tab === key
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-green-700 hover:text-green-900 hover:bg-green-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
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
                          : (
                            <div className="space-y-6">
                              <div>
                                <h3 className="font-semibold text-green-900 mb-3">Share Your Participation</h3>
                                {submitStatus && (
                                  <div className={`mb-4 p-3 rounded-lg text-center font-medium ${
                                    submitStatus.startsWith("Failed")
                                      ? "bg-red-50 text-red-800 border border-red-200"
                                      : "bg-green-50 text-green-800 border border-green-200"
                                  }`}>
                                    {submitStatus}
                                  </div>
                                )}
                              </div>

                              <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                  <label className="block font-medium text-green-900 mb-2">
                                    Description (Optional)
                                  </label>
                                  <textarea
                                    className="w-full border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Tell us about your participation..."
                                    value={textSubmission}
                                    onChange={e => setTextSubmission(e.target.value)}
                                    maxLength={2000}
                                    rows={4}
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block font-medium text-green-900 mb-2">
                                      Upload Images (Max 10)
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => imageInput.current?.click()}
                                      className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                      <MdImage className="w-5 h-5" />
                                      Choose Images
                                    </button>
                                    <input
                                      ref={imageInput}
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      max={10}
                                      onChange={handleImageChange}
                                      style={{ display: "none" }}
                                    />
                                    <FilePreview files={imageFiles} remove={removeImage} type="image" />
                                    {imageFiles.length >= 10 && (
                                      <p className="text-sm text-green-600 mt-2">Maximum 10 images reached</p>
                                    )}
                                  </div>

                                  <div>
                                    <label className="block font-medium text-green-900 mb-2">
                                      Upload Video (Optional)
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => videoInput.current?.click()}
                                      disabled={!!videoFile}
                                      className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                      <MdVideocam className="w-5 h-5" />
                                      Choose Video
                                    </button>
                                    <input
                                      ref={videoInput}
                                      type="file"
                                      accept="video/*"
                                      onChange={handleVideoChange}
                                      style={{ display: "none" }}
                                    />
                                    {videoFile && <FilePreview files={[videoFile]} remove={removeVideo} type="video" />}
                                  </div>
                                </div>

                                <button
                                  type="submit"
                                  disabled={submitting}
                                  className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400"
                                >
                                  {submitting ? "Submitting..." : "Submit Your Entry"}
                                </button>
                              </form>
                            </div>
                          )
                ) : tab === "registered" ? (
                  <UserList users={registeredUsers} type="registered" userId={userId} page={regPage} setPage={setRegPage} />
                ) : (
                  <UserList users={participantsUsers} type="participated" userId={userId} page={partPage} setPage={setPartPage} />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xl text-red-600 py-10 font-bold text-center">Challenge details not found.</div>
        )}
      </div>
    </div>
  );
}

