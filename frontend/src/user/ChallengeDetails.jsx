import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MdEvent, MdGroup, MdChevronLeft, MdChevronRight,
  MdCategory, MdStarRate,
  MdCheckCircle, MdHourglassEmpty, MdLock, MdAccessTime
} from "react-icons/md";
import { FaLeaf } from "react-icons/fa";

// Helper: Format date/time in IST (GMT+5:30)
function formatIST(dateString) {
  const date = new Date(dateString);
  const options = {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-IN", options);
}
function getCurrentISTString() {
  const now = new Date();
  return formatIST(now.toISOString());
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function ChallengeDetails({ challengeId, onClose }) {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");
  const [regStatusError, setRegStatusError] = useState("");

  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState(window.innerWidth);

  const [nowIST, setNowIST] = useState(getCurrentISTString());

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const autoplayTimer = useRef(null);
  const containerRef = useRef(null);
  const previewsRef = useRef(null);
  const scrollTimeout = useRef(null);
  const navigate = useNavigate();

  // For re-use (fetch on mount and after reg actions)
  const fetchChallengeDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${baseUrl}/api/challenges/${challengeId}/detail`);
      const data = res.data;
      const mapped = {
        id: data.id,
        title: data.title,
        details: data.description,
        startDate: data.start_date,
        endDate: data.end_date,
        category: data.category,
        difficulty: data.difficulty,
        status: data.status,
        totalParticipants: data.total_participated || data.total_registered || 0,
        participantCap: data.max_participants,
        greenPoints: data.green_points,
        creatorName: data.users?.full_name || "Unknown",
        images: (data.challenge_images || []).filter((img) => img.image_url),
      };
      setChallenge(mapped);

      await checkRegistrationStatus();
      setCurrentImageIdx(0);
      setImageLoading(true);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!challengeId) return;
    fetchChallengeDetails();
    return () => {
      clearInterval(autoplayTimer.current);
      clearTimeout(scrollTimeout.current);
    };
    // eslint-disable-next-line
  }, [challengeId]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () =>
      setContainerWidth(containerRef.current?.offsetWidth || window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!challenge || challenge.images.length <= 1) {
      clearInterval(autoplayTimer.current);
      return;
    }
    clearInterval(autoplayTimer.current);
    autoplayTimer.current = setInterval(() => {
      setImageLoading(true);
      setCurrentImageIdx((prev) => (prev + 1) % challenge.images.length);
    }, 4000);
    return () => clearInterval(autoplayTimer.current);
  }, [challenge]);

  const checkRegistrationStatus = async () => {
    const userId = localStorage.getItem("user_id");
    setRegStatusError("");
    try {
      const userRes = await axios.get(`${baseUrl}/api/challenges/${challengeId}/users`);
      const isUserRegistered = userRes.data.registered?.some((user) => user.user_id === userId);
      setIsRegistered(isUserRegistered);
    } catch (err) {
      setRegStatusError(
        "Could not check registration status: " +
          (err.response?.data?.message || err.message || "Unknown error")
      );
    }
  };

  // Show registerMessage for a few seconds only
  useEffect(() => {
    if (registerMessage && (registerMessage.toLowerCase().includes("success"))) {
      const timer = setTimeout(() => setRegisterMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [registerMessage]);

  // Update IST clock in real time
  useEffect(() => {
    const timer = setInterval(() => {
      setNowIST(getCurrentISTString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRegisterOrUnregister = async () => {
    const userId = localStorage.getItem("user_id");
    setRegisterMessage("");
    setRegStatusError("");

    if (!userId) {
      setRegisterMessage("Please log in to register.");
      return;
    }

    if (!isRegistered) {
      if (challenge.totalParticipants >= challenge.participantCap) {
        setRegisterMessage("Participant limit reached!");
        return;
      }
      setRegistering(true);
      try {
        await axios.post(`${baseUrl}/api/challenges/${challengeId}/register`, {
          user_id: userId,
        });
        setRegisterMessage("Registration successful!");
        await fetchChallengeDetails(); // Full refresh
      } catch (err) {
        setRegisterMessage(
          "Registration failed: " +
            (err.response?.data?.error || err.message || "Unknown error")
        );
      } finally {
        setRegistering(false);
      }
    } else {
      setRegistering(true);
      try {
        await axios.post(`${baseUrl}/api/challenges/${challengeId}/unregister`, {
          user_id: userId,
        });
        setRegisterMessage("Successfully unregistered.");
        await fetchChallengeDetails(); // Full refresh
      } catch (err) {
        setRegisterMessage(
          "Unregister failed: " +
            (err.response?.data?.message || err.message || "Unknown error")
        );
      } finally {
        setRegistering(false);
      }
    }
  };

  const handleParticipate = () => {
    // Replace alert with your real participate logic/API call
    navigate("/challenge-participation", { state: { challengeId } });
  };

  const showNextImage = () => {
    if (!challenge || challenge.images.length === 0) return;
    setImageLoading(true);
    setCurrentImageIdx((prev) => (prev + 1) % challenge.images.length);
  };

  const showPrevImage = () => {
    if (!challenge || challenge.images.length === 0) return;
    setImageLoading(true);
    setCurrentImageIdx(
      (prev) => (prev - 1 + challenge.images.length) % challenge.images.length
    );
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const dx = touchStartX.current - touchEndX.current;
      if (Math.abs(dx) > 50) {
        if (dx > 0) showNextImage();
        else showPrevImage();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const scrollPreviews = (direction) => {
    if (!previewsRef.current) return;
    const scrollAmount = 80;
    previewsRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {}, 200);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-green-100 to-green-200">
        <div className="relative flex items-center justify-center">
          <svg className="animate-spin-slow w-16 h-16 text-green-700" viewBox="0 0 40 40">
            <ellipse cx="20" cy="20" rx="16" ry="7" fill="#22c55e" />
            <ellipse cx="26" cy="18" rx="5" ry="12" fill="#4ade80" />
            <ellipse cx="14" cy="22" rx="5" ry="12" fill="#10b981" />
          </svg>
          <span className="absolute top-1/2 left-1/2 w-6 h-6 bg-green-700 rounded-full opacity-40 animate-pulse -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="text-xl text-green-900 font-bold animate-pulse">
          Loading challenge details...
        </div>
        <style>{`
          .animate-spin-slow {
            animation: spin 2s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-semibold">
        Error: {error}
      </div>
    );
  }

  if (!challenge) return null;

  const isFull = challenge.totalParticipants >= challenge.participantCap;
  const isOngoing = challenge.status === "ongoing";
  const canRegister = !isFull && (challenge.status === "open" || isOngoing);
  const sideBySideLayout = containerWidth >= 1024 && challenge.images.length > 0;

  const statusIcon = (() => {
    if (challenge.status === "open")
      return <MdCheckCircle className="text-blue-600 mr-2" size={24} />;
    if (isOngoing)
      return <MdHourglassEmpty className="text-green-600 mr-2" size={24} />;
    return <MdLock className="text-yellow-600 mr-2" size={24} />;
  })();

  // Simplified registration block
  const renderRegisterBlock = (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-green-200">
      {registerMessage && (
        <div className={`mb-4 p-3 rounded-lg text-center font-medium ${
          registerMessage.toLowerCase().includes("success")
            ? "bg-green-50 text-green-800 border border-green-200"
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {registerMessage}
        </div>
      )}

      {regStatusError && (
        <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg text-center font-medium border border-red-200">
          {regStatusError}
        </div>
      )}

      {(isFull && !isRegistered) ? (
        <div className="text-center">
          <div className="text-red-600 font-semibold mb-2">Registration Full</div>
          <p className="text-gray-600 text-sm">This challenge has reached its maximum number of participants.</p>
        </div>
      ) : (isOngoing && isRegistered) ? (
        <div className="space-y-3">
          <div className="text-center text-gray-600 text-sm mb-3">
            Challenge is currently running
          </div>
          <button
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            onClick={handleParticipate}
          >
            Start Participating
          </button>
        </div>
      ) : canRegister || isRegistered ? (
        <div className="text-center">
          <button
            onClick={handleRegisterOrUnregister}
            className={`w-full py-3 px-6 font-semibold rounded-lg transition-colors ${
              isRegistered
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
            disabled={registering}
          >
            {registering
              ? (isRegistered ? "Leaving Challenge..." : "Joining Challenge...")
              : (isRegistered ? "Leave Challenge" : "Join Challenge")}
          </button>
          <p className="text-sm text-gray-600 mt-2">
            {isRegistered
              ? "You are currently registered for this challenge"
              : "Join this challenge to start earning points"
            }
          </p>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-yellow-600 font-semibold mb-2">Not Available</div>
          <p className="text-gray-600 text-sm">
            This challenge is currently {challenge.status} and not accepting new participants.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-4 sm:py-6 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Header with Close Button */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-900 mb-2">
            {challenge.title}
          </h1>
          <div className="flex items-center gap-2 text-green-700">
            {statusIcon}
            <span className="font-medium capitalize">{challenge.status}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
        >
          Close
        </button>
      </div>

      {/* Key Information Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-green-200">
          <div className="text-green-600 text-sm font-medium mb-1">Category</div>
          <div className="text-green-900 font-semibold">{challenge.category}</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-green-200">
          <div className="text-yellow-600 text-sm font-medium mb-1">Difficulty</div>
          <div className="text-yellow-900 font-semibold">{challenge.difficulty}</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-green-200">
          <div className="text-blue-600 text-sm font-medium mb-1">Participants</div>
          <div className="text-blue-900 font-semibold">{challenge.totalParticipants}/{challenge.participantCap}</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-green-200">
          <div className="text-green-600 text-sm font-medium mb-1">Points</div>
          <div className="text-green-900 font-semibold flex items-center justify-center gap-1">
            <FaLeaf className="w-4 h-4" />
            {challenge.greenPoints}
          </div>
        </div>
      </div>

      {/* Challenge Timeline */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-green-200">
        <h3 className="font-semibold text-green-900 mb-3">Challenge Timeline</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-green-700 font-medium">Starts:</span>
            <span className="text-green-900">{formatIST(challenge.startDate)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-green-700 font-medium">Ends:</span>
            <span className="text-green-900">{formatIST(challenge.endDate)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-green-100">
            <span className="text-green-700 font-medium">Current Time:</span>
            <span className="text-green-900 font-mono text-xs">{nowIST}</span>
          </div>
        </div>
        <div className="mt-3 text-xs text-green-600">
          Created by: <span className="font-medium">{challenge.creatorName}</span>
        </div>
      </div>

      {/* Challenge Images */}
      {challenge.images.length > 0 && (
        <div className="mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-green-200">
            <h3 className="font-semibold text-green-900 mb-3">Challenge Images</h3>
            <div className="relative">
              <div className="aspect-video bg-green-50 rounded-lg overflow-hidden mb-3">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                )}
                <img
                  src={challenge.images[currentImageIdx]?.image_url}
                  alt={`Challenge image ${currentImageIdx + 1}`}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              </div>

              {challenge.images.length > 1 && (
                <div className="flex justify-center gap-2">
                  {challenge.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setImageLoading(true);
                        setCurrentImageIdx(idx);
                      }}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        idx === currentImageIdx ? 'bg-green-600' : 'bg-green-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Challenge Description */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-green-200 mb-6">
        <h3 className="font-semibold text-green-900 mb-3">About This Challenge</h3>
        <p className="text-green-800 leading-relaxed whitespace-pre-line">
          {challenge.details}
        </p>
      </div>

      {/* Registration Section */}
      <div>
        <h3 className="font-semibold text-green-900 mb-3 text-lg">Get Started</h3>
        {renderRegisterBlock}
      </div>
    </div>
  );
}

function ImageCarousel({
  images, currentImageIdx, setCurrentImageIdx, imageLoading, setImageLoading,
  onTouchStart, onTouchMove, onTouchEnd, previewsRef, scrollPreviews
}) {
  return (
    <div
      className="flex-1 max-w-[35vw] flex flex-col"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ maxHeight: "600px" }}
    >
      <div className="overflow-hidden rounded-lg relative h-[50vh] flex items-center justify-center bg-green-50 select-none">
        {imageLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-50 bg-opacity-70 z-10">
            {/* Mini animated "leaf spinner" */}
            <svg className="animate-spin-slow w-10 h-10 text-green-600 mb-3" viewBox="0 0 40 40">
              <ellipse cx="20" cy="20" rx="12" ry="5" fill="#4ade80" />
              <ellipse cx="25" cy="18" rx="3" ry="6" fill="#bbf7d0" />
              <ellipse cx="15" cy="22" rx="3" ry="6" fill="#22c55e" />
            </svg>
            <span className="text-green-800 text-lg font-medium animate-pulse">Loading image...</span>
            <style>{`
              .animate-spin-slow {
                animation: spin 2s linear infinite;
              }
              @keyframes spin {
                0% { transform: rotate(0deg);}
                100% { transform: rotate(360deg);}
              }
            `}</style>
          </div>
        )}
        <img
          key={images[currentImageIdx]?.image_url}
          src={images[currentImageIdx]?.image_url}
          alt={`challenge image ${currentImageIdx + 1}`}
          className={`w-full h-full object-contain transition-opacity duration-700 ease-in-out ${imageLoading ? "opacity-0" : "opacity-100"}`}
          loading="lazy"
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
          draggable={false}
        />
      </div>
      <div className="relative mt-4">
        <button
          aria-label="Scroll previews left"
          onClick={() => scrollPreviews("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-green-700 text-white rounded-full p-2 shadow-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 cursor-pointer"
        >
          <MdChevronLeft className="w-6 h-6" />
        </button>
        <div
          ref={previewsRef}
          className="flex overflow-x-auto gap-3 scrollbar-hide scroll-smooth px-8"
          style={{
            scrollBehavior: "smooth",
            msOverflowStyle: "none",
            scrollbarWidth: "none"
          }}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setImageLoading(true);
                setCurrentImageIdx(idx);
              }}
              aria-label={`Go to image ${idx + 1}`}
              className={`rounded-lg shadow-md border-2 ${idx === currentImageIdx ? "border-green-700" : "border-transparent"} overflow-hidden cursor-pointer flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16`}
            >
              <img
                src={img.image_url}
                alt={`challenge preview ${idx + 1}`}
                className="object-cover w-full h-full"
                loading="lazy"
                draggable={false}
              />
            </button>
          ))}
        </div>
        <button
          aria-label="Scroll previews right"
          onClick={() => scrollPreviews("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-green-700 text-white rounded-full p-2 shadow-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 cursor-pointer"
        >
          <MdChevronRight className="w-6 h-6" />
        </button>
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </div>
  );
}

function ImageCarouselSingle({
  images, currentImageIdx, setCurrentImageIdx, imageLoading, setImageLoading,
  onTouchStart, onTouchMove, onTouchEnd
}) {
  return (
    <>
      {images.length > 0 && (
        <div
          className="max-w-[85vw] mx-auto mb-8 relative select-none rounded-lg"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ maxHeight: 600 }}
        >
          <div className="overflow-hidden relative h-[45vh] bg-green-50 flex items-center justify-center rounded-lg">
            {imageLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-50 bg-opacity-70 z-10">
                {/* Mini animated "leaf spinner" */}
                <svg className="animate-spin-slow w-10 h-10 text-green-600 mb-3" viewBox="0 0 40 40">
                  <ellipse cx="20" cy="20" rx="12" ry="5" fill="#4ade80" />
                  <ellipse cx="25" cy="18" rx="3" ry="6" fill="#bbf7d0" />
                  <ellipse cx="15" cy="22" rx="3" ry="6" fill="#22c55e" />
                </svg>
                <span className="text-green-800 text-lg font-medium animate-pulse">Loading image...</span>
                <style>{`
                  .animate-spin-slow {
                    animation: spin 2s linear infinite;
                  }
                  @keyframes spin {
                    0% { transform: rotate(0deg);}
                    100% { transform: rotate(360deg);}
                  }
                `}</style>
              </div>
            )}
            <img
              key={images[currentImageIdx]?.image_url}
              src={images[currentImageIdx]?.image_url}
              alt={`challenge image ${currentImageIdx + 1}`}
              className={`w-full h-full object-contain transition-opacity duration-700 ease-in-out ${imageLoading ? "opacity-0" : "opacity-100"}`}
              loading="lazy"
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
              draggable={false}
            />
          </div>
          <div
            className="flex justify-center mt-3 gap-3 overflow-x-auto scrollbar-hide px-3 max-w-[85vw]"
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setImageLoading(true);
                  setCurrentImageIdx(idx);
                }}
                aria-label={`Go to image ${idx + 1}`}
                className={`rounded-lg shadow-md border-2 ${
                  idx === currentImageIdx ? "border-green-700" : "border-transparent"
                } overflow-hidden cursor-pointer flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16`}
              >
                <img
                  src={img.image_url}
                  alt={`challenge preview ${idx + 1}`}
                  className="object-cover w-full h-full"
                  loading="lazy"
                  draggable={false}
                />
              </button>
            ))}
            <style>{`
              .scrollbar-hide::-webkit-scrollbar { display: none; }
              .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
          </div>
          <style>{`
            .loader {
              border-top-color: #065f46;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg);}
              100% { transform: rotate(360deg);}
            }
          `}</style>
        </div>
      )}
    </>
  );
}

// InfoTag component with optional large prop
function InfoTag({ label, value, icon = null, color = "green", status = false, compact = false }) {
  const baseColors = {
    green: "bg-green-200 text-green-900",
    yellow: "bg-yellow-200 text-yellow-900",
    blue: "bg-blue-200 text-blue-900",
    gray: "bg-gray-100 text-gray-700",
  };

  let statusColors = {
    open: "bg-blue-700 text-white",
    ongoing: "bg-green-700 text-white",
    closed: "bg-yellow-700 text-white",
  };

  const colorClass = status
    ? statusColors[value?.toLowerCase()] || baseColors.gray
    : baseColors[color];

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full font-semibold
        ${compact ? "text-base min-w-[74px] justify-center" : "text-sm"} ${colorClass} select-none shadow`}
      title={`${label}: ${value}`}
      style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', Arial, sans-serif" }}
    >
      {icon}
      {status ? (
        value.charAt(0).toUpperCase() + value.slice(1)
      ) : (
        <>
          <span className="mr-1 font-medium">{label}:</span> {value}
        </>
      )}
    </div>
  );
}

function ParticipantsTag({ value, compact = false }) {
  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full font-semibold
        ${compact ? "text-base min-w-[74px] justify-center" : "text-sm"} bg-blue-200 text-blue-900 select-none shadow`}
      title={`Participants: ${value}`}
      style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', Arial, sans-serif" }}
    >
      <MdGroup className="w-5 h-5 mr-1" />
      <span>{value}</span>
    </div>
  );
}
