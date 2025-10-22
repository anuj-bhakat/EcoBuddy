import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 via-green-300 to-blue-200 px-6 text-center">
      <h1 className="text-9xl font-extrabold text-green-900 mb-4 select-none drop-shadow-lg">
        404
      </h1>
      <p className="text-3xl font-semibold text-green-800 mb-3">
        Page Not Found
      </p>
      <p className="max-w-lg text-green-700 mb-10 leading-relaxed px-2">
        Sorry, the page you are looking for doesn't exist or has been moved.
        You can always return to the homepage and continue exploring.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-green-700 cursor-pointer text-white rounded-lg py-4 px-8 font-semibold text-lg shadow-lg hover:bg-green-800 transition duration-300 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-70"
      >
        Go Back Home
      </button>
    </div>
  );
}
