import React from "react";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "../Footer";

export default function Home() {
  const isLoggedIn = Boolean(localStorage.getItem("user"));

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      <header>
        <Navbar />
      </header>

      {/* Flexible content spacer */}
      <main className="flex-grow container mx-auto px-6 py-10">
        {/* Placeholder for home content */}
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}
