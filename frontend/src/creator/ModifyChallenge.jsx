import React, { useState, useEffect } from "react";
import axios from "axios";
import CreatorNavbar from "./CreatorNavbar";
import DatePicker from "react-datepicker";
import { MdArrowDropDown } from "react-icons/md";
import { FaLeaf } from "react-icons/fa";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const LeafBg = () => (
  <div className="absolute right-4 bottom-4 opacity-15 pointer-events-none z-0 flex flex-col items-center space-y-5 text-green-400">
    <FaLeaf size={44} />
    <FaLeaf size={60} className="text-green-300" />
    <FaLeaf size={36} className="text-green-500" />
  </div>
);

const categories = ["Community", "Lifestyle", "Transport", "Energy", "Shopping"];
const difficulties = ["Easy", "Medium", "Hard"];
const statuses = ["open", "ongoing", "closed"];
const maxImages = 10;

function CustomDropdown({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef();

  React.useEffect(() => {
    if (!open) return;
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSelect = (option) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        className="w-full h-11 px-4 border border-green-300 rounded bg-white text-left focus:outline-none focus:ring-2 focus:ring-green-600 flex justify-between items-center text-green-700"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="truncate">{value || <span className="text-green-400">{placeholder}</span>}</span>
        <MdArrowDropDown size={24} className={`transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`} />
      </button>
      {open && (
        <ul className="absolute z-30 w-full mt-1 rounded border border-green-300 shadow-lg bg-white max-h-44 overflow-y-auto">
          {options.map((option) => (
            <li
              key={option}
              className={`px-4 py-2 cursor-pointer hover:bg-green-100 truncate ${value === option ? "bg-green-200 font-semibold" : ""}`}
              onClick={() => handleSelect(option)}
              title={option}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CustomDatePicker({ selected, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef();

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        className="w-full h-11 px-4 border border-green-300 rounded bg-white text-left focus:outline-none focus:ring-2 focus:ring-green-600 text-green-700"
        onClick={() => setOpen(true)}
      >
        {selected ? new Date(selected).toLocaleDateString() : <span className="text-green-400">{placeholder}</span>}
      </button>
      {open && (
        <DatePicker
          selected={selected}
          onChange={(date) => {
            onChange(date);
            setOpen(false);
          }}
          inline
          calendarClassName="bg-white rounded shadow max-w-xs sm:max-w-sm"
          popperModifiers={[
            { name: "preventOverflow", options: { boundary: "viewport" } },
            { name: "flip", options: { fallbackPlacements: ["top"] } },
            { name: "offset", options: { offset: [0, 6] } },
          ]}
          popperPlacement="bottom-start"
        />
      )}
    </div>
  );
}

function combineDateTimeToUTC(date, time) {
  if (!date || !time) return null;
  const [hours, minutes] = time.split(":").map(Number);
  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  )
    return null;
  const localDate = new Date(date);
  localDate.setHours(hours);
  localDate.setMinutes(minutes);
  const IST_OFFSET = 5 * 60 + 30;
  return new Date(localDate.getTime() - IST_OFFSET * 60000).toISOString();
}

export default function ModifyChallenge() {
  const navigate = useNavigate();
  const location = useLocation();
  const challengeId = location.state?.challengeId || "53196c3a-3e37-4dde-902a-cf3134cd8737";
  const idToLoad = challengeId || "53196c3a-3e37-4dde-902a-cf3134cd8737";

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    green_points: "",
    status: "open",
    start_date: null,
    start_time: "00:00",
    end_date: null,
    end_time: "23:59",
    max_participants: "",
    images: [],
    existingImages: [],
  });
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await axios.get(`${baseUrl}/api/challenges/${idToLoad}/detail`);
        const data = res.data;
        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        const pad = (n) => String(n).padStart(2, "0");
        setForm({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          difficulty: data.difficulty || "",
          green_points: data.green_points ? String(data.green_points) : "",
          status: data.status || "open",
          start_date: start,
          start_time: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
          end_date: end,
          end_time: `${pad(end.getHours())}:${pad(end.getMinutes())}`,
          max_participants: data.max_participants ? String(data.max_participants) : "",
          images: [],
          existingImages: data.challenge_images ? data.challenge_images.map((img) => img.image_url) : [],
        });
      } catch (err) {
        setLoadError(err.message || "Failed to load challenge details");
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [idToLoad]);

  const validateForm = () => {
    if (!form.title.trim()) return "Title is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.category) return "Please select a category";
    if (!form.difficulty) return "Please select difficulty";
    if (!form.status) return "Please select status";
    if (!form.green_points || Number(form.green_points) <= 0) return "Green points must be positive";
    if (!form.max_participants || Number(form.max_participants) < 1) return "Participant limit must be at least 1";
    if (!form.start_date) return "Please select start date";
    if (!form.end_date) return "Please select end date";
    if (!combineDateTimeToUTC(form.start_date, form.start_time)) return "Invalid start time";
    if (!combineDateTimeToUTC(form.end_date, form.end_time)) return "Invalid end time";
    if (form.start_date > form.end_date) return "End date should be after start date";
    return null;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const filesArr = Array.from(files);
      const combined = [...form.images, ...filesArr].slice(0, maxImages);
      setForm((prev) => ({ ...prev, images: combined }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setSubmitError(null);
    setSuccess(false);
  };

  const handleDropdownChange = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setSubmitError(null);
    setSuccess(false);
  };

  const handleDateChange = (field, date) => {
    setForm((prev) => ({ ...prev, [field]: date }));
    setSubmitError(null);
    setSuccess(false);
  };

  const handleRemoveImage = (idx, isExisting = false) => {
    if (isExisting) {
      const updatedExisting = form.existingImages.filter((_, i) => i !== idx);
      setForm((prev) => ({ ...prev, existingImages: updatedExisting }));
    } else {
      const updatedNew = form.images.filter((_, i) => i !== idx);
      setForm((prev) => ({ ...prev, images: updatedNew }));
    }
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      setSubmitError(error);
      return;
    }
    setSubmitLoading(true);
    setSubmitError(null);
    setSuccess(false);
    try {
      const formData = new FormData();
      const creatorId = localStorage.getItem("creatorId") || "";

      // Basic challenge fields
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("creator_id", creatorId);
      formData.append("start_date", combineDateTimeToUTC(form.start_date, form.start_time));
      formData.append("end_date", combineDateTimeToUTC(form.end_date, form.end_time));
      formData.append("category", form.category);
      formData.append("difficulty", form.difficulty);
      formData.append("green_points", form.green_points);
      formData.append("status", form.status);
      formData.append("max_participants", form.max_participants);

      // Append existing URLs as JSON string
      const existingUrlsJson = JSON.stringify(form.existingImages);
      formData.append("existingImageUrls", existingUrlsJson);

      // Append new image files as newImages
      form.images.slice(0, maxImages).forEach((file) => {
        formData.append("images", file);
      });

      await axios.put(`${baseUrl}/api/challenges/${idToLoad}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/creator/view-challenge");
      }, 1000);
    } catch (err) {
      console.log(err);
      setSubmitError(err.response?.data?.error || err.message || "Failed to update challenge");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-green-200 font-sans relative z-0">
      <CreatorNavbar />
      <div className="max-w-3xl mx-auto p-6">
        <LeafBg />
        <div className="bg-white rounded-xl shadow-xl p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-green-700 font-semibold text-xl">
              Loading challenge details...
            </div>
          ) : loadError ? (
            <div className="bg-red-100 border border-red-400 rounded p-4 text-red-700 font-semibold">
              {loadError}
            </div>
          ) : (
            <>
              {(submitLoading || success || submitError) && (
                <div
                  className={`mb-4 px-3 py-3 rounded border text-center font-semibold ${
                    submitError ? "text-red-100 bg-red-700 border-red-800" : "text-white bg-green-600 border-green-700"
                  } transition-opacity duration-300`}
                >
                  {submitLoading && (
                    <div className="flex gap-3 justify-center items-center">
                      <svg
                        className="animate-spin h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      <p>Updating...</p>
                    </div>
                  )}
                  {success && <p>Challenge updated successfully! Redirecting...</p>}
                  {submitError && (
                    <>
                      <p>{submitError}</p>
                      <button
                        onClick={handleSubmit}
                        className="mt-2 px-3 py-1 rounded bg-red-900 hover:bg-red-800 text-white"
                      >
                        Retry
                      </button>
                    </>
                  )}
                </div>
              )}
              {!submitLoading && !success && (
                <>
                  <h2 className="text-2xl font-extrabold text-green-900 mb-6 text-center tracking-tight">
                    Modify Challenge
                  </h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-green-900 font-semibold mb-1" htmlFor="title">
                        Title <span className="text-green-700">*</span>
                      </label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full h-11 p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-green-900 font-semibold mb-1" htmlFor="description">
                        Description <span className="text-green-700">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={6}
                        value={form.description}
                        onChange={handleChange}
                        className="w-full p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 whitespace-pre-wrap"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-green-900 font-semibold mb-1">Category <span className="text-green-700">*</span></label>
                        <CustomDropdown
                          options={categories}
                          value={form.category}
                          onChange={(val) => handleDropdownChange("category", val)}
                          placeholder="Select Category"
                        />
                      </div>
                      <div>
                        <label className="block text-green-900 font-semibold mb-1">Difficulty <span className="text-green-700">*</span></label>
                        <CustomDropdown
                          options={difficulties}
                          value={form.difficulty}
                          onChange={(val) => handleDropdownChange("difficulty", val)}
                          placeholder="Select Difficulty"
                        />
                      </div>
                      <div>
                        <label className="block text-green-900 font-semibold mb-1">Status <span className="text-green-700">*</span></label>
                        <CustomDropdown
                          options={statuses.map((s) => s.charAt(0).toUpperCase() + s.slice(1))}
                          value={form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                          onChange={(val) => handleDropdownChange("status", val.toLowerCase())}
                          placeholder="Select Status"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-green-900 font-semibold mb-1" htmlFor="green_points">
                          Green Points <span className="text-green-700">*</span>
                        </label>
                        <input
                          id="green_points"
                          name="green_points"
                          type="number"
                          min={1}
                          value={form.green_points}
                          onChange={handleChange}
                          className="w-full h-11 px-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-green-900 font-semibold mb-1" htmlFor="max_participants">
                          Max Participants <span className="text-green-700">*</span>
                        </label>
                        <input
                          id="max_participants"
                          name="max_participants"
                          type="number"
                          min={1}
                          value={form.max_participants}
                          onChange={handleChange}
                          className="w-full h-11 px-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                        />
                      </div>
                      <div />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-green-900 font-semibold mb-1">Start Date <span className="text-green-700">*</span></label>
                        <CustomDatePicker selected={form.start_date} onChange={(date) => handleDateChange("start_date", date)} placeholder="Start Date" />
                        <input
                          type="time"
                          name="start_time"
                          value={form.start_time}
                          onChange={(e) => setForm((prev) => ({ ...prev, start_time: e.target.value }))}
                          className="mt-1 w-full h-11 px-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-green-900 font-semibold mb-1">End Date <span className="text-green-700">*</span></label>
                        <CustomDatePicker selected={form.end_date} onChange={(date) => handleDateChange("end_date", date)} placeholder="End Date" />
                        <input
                          type="time"
                          name="end_time"
                          value={form.end_time}
                          onChange={(e) => setForm((prev) => ({ ...prev, end_time: e.target.value }))}
                          className="mt-1 w-full h-11 px-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-green-900 font-semibold mb-1">Existing Images</label>
                      <div className="flex flex-wrap gap-4">
                        {form.existingImages.map((url, i) => (
                          <div key={i} className="relative border rounded overflow-hidden w-32 h-32">
                            <img src={url} alt={`Image ${i + 1}`} className="object-cover w-full h-full" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(i, true)}
                              className="absolute top-1 right-1 bg-red-600 rounded-full p-1 text-white hover:bg-red-700"
                              title="Remove Image"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        {form.existingImages.length === 0 && <p className="text-green-700 opacity-75">No existing images</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-green-900 font-semibold mb-1">Add Images (max {maxImages})</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleChange}
                        className="block mb-4"
                      />
                      <div className="flex flex-wrap gap-4">
                        {form.images.map((file, i) => (
                          <div key={i} className="relative border rounded overflow-hidden w-32 h-32">
                            <img src={URL.createObjectURL(file)} alt={`New Image ${i + 1}`} className="object-cover w-full h-full" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(i, false)}
                              className="absolute top-1 right-1 bg-red-600 rounded-full p-1 text-white hover:bg-red-700"
                              title="Remove Image"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        {form.images.length === 0 && <p className="text-green-700 opacity-75">No new images selected</p>}
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        type="submit"
                        className="py-3 px-6 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-600"
                      >
                        Update Challenge
                      </button>
                    </div>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
