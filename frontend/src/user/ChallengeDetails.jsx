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

  // Improved registration block
  const renderRegisterBlock = (
    <div className={`max-w-xs w-full mx-auto mb-10 ${sideBySideLayout ? "mt-8" : ""}`}>
      {registerMessage && (
        <div className={`text-sm text-center mb-2 font-medium ${registerMessage.toLowerCase().includes("success") ? "text-green-700" : "text-red-600"}`}>
          {registerMessage}
        </div>
      )}
      {regStatusError && (
        <div className="text-sm text-center mb-2 text-red-600 font-medium">{regStatusError}</div>
      )}
      {(isFull && !isRegistered) ? (
        <div className="px-5 py-3 bg-red-50 text-red-800 rounded-lg font-semibold text-center shadow tracking-wide border border-red-300">
          <p className="text-base font-bold mb-1">Registration Closed</p>
          Participant limit reached.
        </div>
      ) : (isOngoing && isRegistered) ? (
        <>
          <button
            className="w-full px-5 py-3 bg-gray-400 text-white text-lg font-bold rounded-full shadow-lg cursor-not-allowed mb-2"
            disabled
          >
            Unregister
          </button>
          <div className="text-sm text-center mb-2 text-gray-700">Cannot unregister during ongoing challenge.</div>
          <button
            className="w-full px-5 py-3 bg-blue-700 hover:bg-blue-800 text-white text-lg font-bold rounded-full shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            onClick={handleParticipate}
          >
            Participate
          </button>
        </>
      ) : canRegister || isRegistered ? (
        <button
          onClick={handleRegisterOrUnregister}
          className={`w-full px-5 py-3 ${isRegistered ? "bg-red-600 hover:bg-red-700 focus:ring-red-400" : "bg-green-700 hover:bg-green-800 focus:ring-green-600"} text-white text-lg font-bold rounded-full transition-shadow shadow-lg focus:outline-none focus:ring-2 tracking-wide cursor-pointer`}
          disabled={registering}
        >
          {registering
            ? (isRegistered ? "Unregistering..." : "Registering...")
            : (isRegistered ? "Unregister" : "Register")}
        </button>
      ) : (
        <div className="px-5 py-3 bg-yellow-50 text-yellow-900 rounded-lg font-semibold text-center shadow tracking-wide border border-yellow-300">
          <p className="text-base font-bold mb-1">Registration Not Open</p>
          <span>
            This challenge is currently{" "}
            <span className="font-semibold">
              {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
            </span>
            .
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-green-100 via-green-50 to-green-200 py-2 sm:py-3 max-w-full mx-auto flex flex-col relative rounded-lg px-4 sm:px-8 md:px-16 lg:px-20 xl:px-28 font-sans text-green-900 shadow-inner overflow-hidden"
      ref={containerRef}
      style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', Arial, sans-serif", position: 'relative' }}
    >
      {/* Eco-themed subtle background */}
      <svg
        className="absolute top-0 left-0 w-full h-40 pointer-events-none opacity-10"
        viewBox="0 0 1440 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fill="#10b981" fillOpacity="0.4"
              d="M0,128L48,112C96,96,192,64,288,85.3C384,107,480,181,576,208C672,235,768,213,864,192C960,171,1056,149,1152,128C1248,107,1344,85,1392,74.7L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        <circle cx="200" cy="75" r="50" fill="#65a30d" fillOpacity="0.13" />
        <circle cx="1300" cy="55" r="30" fill="#065f46" fillOpacity="0.5" />
      </svg>

      {/* Close button */}
      <div className="relative mb-16 z-10">
        <button
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-3 right-3 sm:top-5 sm:right-5 px-4 py-2 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800 transition-shadow shadow-lg focus:outline-none focus:ring-2 focus:ring-green-600 z-20 cursor-pointer"
        >
          Close
        </button>
      </div>

      {/* Title and Status */}
      <div className="flex flex-col items-start gap-2 mb-4 z-10">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold tracking-tight leading-tight drop-shadow-md"
            style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', Arial, sans-serif" }}>
          {challenge.title}
        </h1>
        <div className="flex items-center gap-2 mt-2 text-lg text-green-800 font-semibold">
          {statusIcon}
          <span>{challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}</span>
        </div>
      </div>

      {/* Category, Difficulty, Participants */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2 sm:gap-6 z-10">
        <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
          <InfoTag label="Category" value={challenge.category} icon={<MdCategory className="mr-1 w-4 h-4 sm:mr-2 sm:w-6 sm:h-6" />} color="green" compact />
          <InfoTag label="Difficulty" value={challenge.difficulty} icon={<MdStarRate className="mr-1 w-4 h-4 sm:mr-2 sm:w-6 sm:h-6" />} color="yellow" compact />
          <ParticipantsTag value={`${challenge.totalParticipants}/${challenge.participantCap}`} compact />
        </div>
        <div
          className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full font-extrabold text-sm sm:text-lg bg-green-300 text-green-900 select-none shadow min-w-[120px] sm:min-w-[140px]"
          title={`Green Points: +${challenge.greenPoints}`}
        >
          <FaLeaf className="w-4 h-4 sm:w-6 sm:h-6" />
          <span className="hidden sm:inline">Green Points:</span>
          <span className="sm:hidden">Points:</span>
          <span>{challenge.greenPoints}</span>
        </div>
      </div>

      {/* Dates & Created by & Time (compact for mobile) */}
      <div className="
        flex flex-col gap-2 mb-3 z-10
        text-green-800 font-medium text-sm sm:text-base
      ">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <span className="flex items-center gap-1 rounded px-1.5 py-0.5 bg-green-50 text-xs sm:text-sm">
              <MdEvent className="w-4 h-4 text-green-700" />
              <b>Start:</b> {formatIST(challenge.startDate)}
            </span>
            <span className="flex items-center gap-1 rounded px-1.5 py-0.5 bg-green-50 text-xs sm:text-sm">
              <MdEvent className="w-4 h-4 text-green-700" />
              <b>End:</b> {formatIST(challenge.endDate)}
            </span>
          </div>
          <span className="text-xs sm:text-sm whitespace-nowrap">
            <span className="font-semibold">Created by:</span> {challenge.creatorName}
          </span>
        </div>
        <div className="flex items-center gap-2 text-green-900 text-xs sm:text-sm">
          <span className="font-semibold">Current Time (IST):</span>
          <span className="inline-flex items-center font-mono bg-green-50 rounded px-1.5 py-0.5">
            <MdAccessTime className="w-4 h-4 text-green-700 mr-1" />
            {nowIST}
          </span>
        </div>
      </div>

      {/* Main Content */}
      {sideBySideLayout ? (
        <div className="flex gap-14 mx-auto w-full z-10">
          <ImageCarousel
            images={challenge.images}
            currentImageIdx={currentImageIdx}
            setCurrentImageIdx={setCurrentImageIdx}
            imageLoading={imageLoading}
            setImageLoading={setImageLoading}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            previewsRef={previewsRef}
            scrollPreviews={scrollPreviews}
          />
          {/* Details block */}
          <section
            className="bg-white rounded-xl p-7 shadow-lg flex-none w-[40vw] flex flex-col text-green-900 leading-relaxed text-lg whitespace-pre-line"
            style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', Arial, sans-serif" }}
          >
            <h2 className="text-3xl font-bold mb-4 border-b border-green-300 pb-3" style={{ fontFamily: "inherit" }}>
              Challenge Details
            </h2>
            <p className="flex-grow">{challenge.details}</p>
          </section>
        </div>
      ) : (
        <>
          <ImageCarouselSingle
            images={challenge.images}
            currentImageIdx={currentImageIdx}
            setCurrentImageIdx={setCurrentImageIdx}
            imageLoading={imageLoading}
            setImageLoading={setImageLoading}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />
          <section
            className="bg-white rounded-xl p-7 shadow-lg max-w-5xl w-full mx-auto mb-12 text-green-900 leading-relaxed text-lg whitespace-pre-line"
            style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', Arial, sans-serif" }}
          >
            <h2 className="text-3xl font-bold mb-4 border-b border-green-300 pb-3" style={{ fontFamily: "inherit" }}>
              Challenge Details
            </h2>
            <p>{challenge.details}</p>
          </section>
        </>
      )}
      {renderRegisterBlock}
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
