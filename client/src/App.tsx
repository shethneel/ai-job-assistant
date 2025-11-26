// src/App.tsx
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "./components/ui/toaster";

import Index from "./pages/Index";
import EnhanceResume from "./pages/EnhanceResume";
import CoverLetter from "./pages/CoverLetter";
import JobFit from "./pages/JobFit";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyResumes from "./pages/MyResumes"; // ⬅️ NEW

export default function App() {
  return (
    <>
      <Header />

      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/enhance-resume" element={<EnhanceResume />} />
          <Route path="/cover-letter" element={<CoverLetter />} />
          <Route path="/job-fit" element={<JobFit />} />
          <Route path="/my-resumes" element={<MyResumes />} /> {/* ⬅️ NEW */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <Toaster />
    </>
  );
}
