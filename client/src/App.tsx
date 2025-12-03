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
import MyResumes from "./pages/MyResumes";
import Pricing from "./pages/Pricing";
import Documentation from "./pages/Documentation";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";


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
          <Route path="/my-resumes" element={<MyResumes />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <Toaster />
    </>
  );
}
