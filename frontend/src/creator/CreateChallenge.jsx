import React, { useState, useRef, useEffect } from "react";
import CreatorNavbar from "./CreatorNavbar";
import DatePicker from "react-datepicker";
import { MdArrowDropDown } from "react-icons/md";
import { FaLeaf } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const LeafBg = () => (
  <div className="absolute right-4 bottom-4 opacity-15 pointer-events-none z-0 flex flex-col items-center space-y-5 text-green-400">
    <FaLeaf size={44} />
    <FaLeaf size={60} className="text-green-300" />
    <FaLeaf size={36} className="text-green-500" />
  </div>
);

const initialForm = {
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
};

const categories = ["Community", "Lifestyle", "Transport", "Energy", "Shopping"];
const difficulties = ["Easy", "Medium", "Hard"];
const statuses = ["open", "ongoing", "closed"];
const maxImages = 10;

function moveImage(imagesArr, fromIdx, toIdx) {
  const newArr = imagesArr.slice();
  const [moved] = newArr.splice(fromIdx, 1);
  newArr.splice(toIdx, 0, moved);
  return newArr;
}

function CustomDropdown({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
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
  const ref = useRef();

  useEffect(() => {
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
  ) {
    return null;
  }
  const localDate = new Date(date);
  localDate.setHours(hours);
  localDate.setMinutes(minutes);
  const IST_OFFSET = 5 * 60 + 30;
  return new Date(localDate.getTime() - IST_OFFSET * 60000).toISOString();
}

export default function CreateChallenge({ onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [page, setPage] = useState(1);
  const [fieldError, setFieldError] = useState(null); // field validation error shown in forms
  const [submitError, setSubmitError] = useState(null); // submission errors shown separately
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateStep1 = () => {
    if (!form.title.trim()) {
      setFieldError("Title is required");
      return false;
    }
    if (!form.description.trim()) {
      setFieldError("Description is required");
      return false;
    }
    setFieldError(null);
    return true;
  };

  const validateStep2 = () => {
    if (!form.category) {
      setFieldError("Please select a category");
      return false;
    }
    if (!form.difficulty) {
      setFieldError("Please select difficulty");
      return false;
    }
    if (!form.status) {
      setFieldError("Please select status");
      return false;
    }
    if (!form.green_points || Number(form.green_points) <= 0) {
      setFieldError("Green points must be positive");
      return false;
    }
    if (!form.max_participants || Number(form.max_participants) < 1) {
      setFieldError("Participant limit must be at least 1");
      return false;
    }
    if (!form.start_date) {
      setFieldError("Please select start date");
      return false;
    }
    if (!form.end_date) {
      setFieldError("Please select end date");
      return false;
    }
    if (!combineDateTimeToUTC(form.start_date, form.start_time)) {
      setFieldError("Invalid start time");
      return false;
    }
    if (!combineDateTimeToUTC(form.end_date, form.end_time)) {
      setFieldError("Invalid end time");
      return false;
    }
    if (form.start_date > form.end_date) {
      setFieldError("End date should be after start date");
      return false;
    }
    setFieldError(null);
    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const filesArr = Array.from(files);
      const combined = [...form.images, ...filesArr].slice(0, maxImages);
      setForm((prev) => ({ ...prev, images: combined }));
      e.target.value = "";
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setFieldError(null);
    setSubmitError(null);
    setSuccess(false);
  };

  const handleDropdownChange = (field, option) => {
    setForm((prev) => ({ ...prev, [field]: option }));
    setFieldError(null);
    setSubmitError(null);
    setSuccess(false);
  };

  const handleDateChange = (field, date) => {
    setForm((prev) => ({ ...prev, [field]: date }));
    setFieldError(null);
    setSubmitError(null);
    setSuccess(false);
  };

  const handleMoveImage = (idx, direction) => {
    const toIdx = idx + direction;
    if (toIdx < 0 || toIdx >= form.images.length) return;
    setForm((prev) => ({ ...prev, images: moveImage(prev.images, idx, toIdx) }));
  };

  const handleRemoveImage = (idx) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleRetry = () => {
    setSubmitError(null);
    setSuccess(false);
    handleSubmit();
  };

  const handleEditAgain = () => {
    setSubmitError(null);
    setSuccess(false);
  };

  const handleCreateAnother = () => {
    setForm(initialForm);
    setPage(1);
    setFieldError(null);
    setSubmitError(null);
    setSuccess(false);
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setSuccess(false);
    if (!validateStep1()) {
      setPage(1);
      return;
    }
    if (!validateStep2()) {
      setPage(2);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      const creatorId = localStorage.getItem("creatorId") || "";
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
      form.images.slice(0, maxImages).forEach((file) => formData.append("images", file));

      const res = await fetch(`${baseUrl}/api/challenges`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Failed: ${res.statusText}`);

      const data = await res.json();
      setSuccess(true);
    } catch (err) {
      setSubmitError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-green-200 font-sans relative overflow-hidden z-0">
        <CreatorNavbar />
        <div className="px-4 sm:px-8">
          <LeafBg />
          <div className="relative max-w-2xl mx-auto bg-white rounded-xl shadow-xl sm:p-8 p-6 z-10 mt-8 min-h-[420px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-green-700 font-semibold text-xl">
                <svg
                  className="animate-spin h-12 w-12 text-green-700"
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
                Submitting...
              </div>
            ) : success ? (
              <div className="rounded p-4 border border-green-400 bg-green-100 text-green-900 font-semibold space-y-3">
                <p>Challenge created successfully!</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleCreateAnother}
                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                  >
                    Create Another
                  </button>
                </div>
              </div>
            ) : submitError ? (
              <div className="rounded p-4 border border-red-400 bg-red-100 text-red-800 font-semibold space-y-3 text-center">
                <p>{submitError}</p>
                <div className="flex gap-4 justify-center mt-2">
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Retry
                  </button>
                  <button
                    onClick={handleEditAgain}
                    className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ) : (
              <>
                {page === 1 && (
                  <>
                    <h2 className="text-2xl font-extrabold text-green-900 mb-7 text-center tracking-tight">
                      Basic Info
                    </h2>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (validateStep1()) setPage(2);
                      }}
                      className="space-y-5"
                      autoComplete="off"
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
                          placeholder="e.g., Plant 5 Trees"
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
                          value={form.description}
                          onChange={handleChange}
                          className="w-full p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 min-h-[120px] sm:min-h-[200px]"
                          placeholder="Describe the challenge goal and impact..."
                          rows={7}
                          required
                        />
                      </div>
                      {fieldError && page === 1 && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded font-semibold">
                          {fieldError}
                        </div>
                      )}
                      <button
                        type="submit"
                        className="w-full py-3 bg-green-600 text-white text-lg font-bold rounded hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-600"
                      >
                        Next
                      </button>
                    </form>
                  </>
                )}
                {page === 2 && (
                  <>
                    <h2 className="text-2xl font-extrabold text-green-900 mb-7 text-center tracking-tight">
                      Details
                    </h2>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (validateStep2()) setPage(3);
                      }}
                      className="space-y-5"
                      autoComplete="off"
                    >
                      <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
                        <div className="flex-1 min-w-0">
                          <label className="block text-green-900 font-semibold mb-1">
                            Category <span className="text-green-700">*</span>
                          </label>
                          <CustomDropdown
                            options={categories}
                            value={form.category}
                            onChange={(option) => handleDropdownChange("category", option)}
                            placeholder="Select Category"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <label className="block text-green-900 font-semibold mb-1">
                            Difficulty <span className="text-green-700">*</span>
                          </label>
                          <CustomDropdown
                            options={difficulties}
                            value={form.difficulty}
                            onChange={(option) => handleDropdownChange("difficulty", option)}
                            placeholder="Select Difficulty"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <label className="block text-green-900 font-semibold mb-1">
                            Status <span className="text-green-700">*</span>
                          </label>
                          <CustomDropdown
                            options={statuses.map((s) => s.charAt(0).toUpperCase() + s.slice(1))}
                            value={form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                            onChange={(option) => handleDropdownChange("status", option.toLowerCase())}
                            placeholder="Select Status"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 mt-4">
                        <div className="flex-1 min-w-0">
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
                            className="w-full h-11 py-2 px-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                            placeholder="Points"
                            required
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <label className="block text-green-900 font-semibold mb-1" htmlFor="max_participants">
                            Participant Limit <span className="text-green-700">*</span>
                          </label>
                          <input
                            id="max_participants"
                            name="max_participants"
                            type="number"
                            min={1}
                            value={form.max_participants}
                            onChange={handleChange}
                            className="w-full h-11 py-2 px-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                            placeholder="Participant Limit"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 mt-4">
                        <div className="flex-1 min-w-0">
                          <label className="block text-green-900 font-semibold mb-1">
                            Start Date <span className="text-green-700">*</span>
                          </label>
                          <CustomDatePicker
                            selected={form.start_date}
                            onChange={(date) => handleDateChange("start_date", date)}
                            placeholder="Start Date"
                          />
                          <input
                            type="time"
                            name="start_time"
                            value={form.start_time}
                            onChange={(e) => setForm((prev) => ({ ...prev, start_time: e.target.value }))}
                            className="mt-1 w-full h-11 px-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <label className="block text-green-900 font-semibold mb-1">
                            End Date <span className="text-green-700">*</span>
                          </label>
                          <CustomDatePicker
                            selected={form.end_date}
                            onChange={(date) => handleDateChange("end_date", date)}
                            placeholder="End Date"
                          />
                          <input
                            type="time"
                            name="end_time"
                            value={form.end_time}
                            onChange={(e) => setForm((prev) => ({ ...prev, end_time: e.target.value }))}
                            className="mt-1 w-full h-11 px-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                          />
                        </div>
                      </div>
                      {fieldError && page === 2 && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded font-semibold mt-4">
                          {fieldError}
                        </div>
                      )}
                      <div className="flex gap-2 mt-5">
                        <button
                          type="button"
                          onClick={() => setPage(1)}
                          className="px-6 py-2 bg-gray-200 text-green-900 rounded font-bold hover:bg-gray-300"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-green-600 text-white text-lg font-bold rounded hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-600"
                        >
                          Next
                        </button>
                      </div>
                    </form>
                  </>
                )}
                {page === 3 && (
                  <>
                    <h2 className="text-2xl font-bold text-green-900 mb-6 text-center tracking-tight">
                      Challenge Images
                    </h2>
                    <div className="flex flex-col items-center">
                      <label
                        htmlFor="images"
                        className="block text-green-900 font-semibold mb-2 w-full text-center"
                      >
                        Upload Images (max 10)
                      </label>
                      <div className="w-full px-2 max-w-md">
                        <button
                          type="button"
                          onClick={() => document.getElementById("images").click()}
                          className={`w-full px-5 py-3 rounded-lg font-bold bg-green-200 text-green-900 hover:bg-green-300 transition border border-green-400 ${
                            form.images.length >= maxImages ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={form.images.length >= maxImages}
                        >
                          {form.images.length >= maxImages ? "Maximum 10 images" : "Choose Images"}
                        </button>
                        <input
                          id="images"
                          name="images"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleChange}
                          className="hidden"
                        />
                      </div>
                      {form.images && form.images.length > 0 ? (
                        <div className="flex flex-wrap gap-4 justify-center w-full mt-6">
                          {Array.from(form.images).map((img, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                              <img
                                src={URL.createObjectURL(img)}
                                alt={`Preview ${idx + 1}`}
                                className="w-36 h-36 object-cover rounded-lg border border-green-400 mb-2 shadow"
                              />
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  className="px-3 py-1 text-xs bg-green-200 rounded hover:bg-green-400"
                                  onClick={() => handleMoveImage(idx, -1)}
                                  disabled={idx === 0}
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  className="px-3 py-1 text-xs bg-green-200 rounded hover:bg-green-400"
                                  onClick={() => handleMoveImage(idx, 1)}
                                  disabled={idx === form.images.length - 1}
                                >
                                  ↓
                                </button>
                                <button
                                  type="button"
                                  className="px-3 py-1 text-xs bg-red-200 text-red-800 rounded hover:bg-red-400"
                                  onClick={() => handleRemoveImage(idx)}
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-green-700 font-semibold opacity-75 mt-6 text-center">
                          No images selected yet.
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between items-center gap-4 mt-6">
                      <button
                        type="button"
                        onClick={() => setPage(2)}
                        className="px-6 py-2 bg-gray-200 text-green-900 rounded font-bold hover:bg-gray-300"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="flex-1 py-3 bg-green-600 text-white text-lg font-bold rounded hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-600"
                      >
                        Submit
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
