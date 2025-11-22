// src/components/Header.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";
import AuthModal from "./AuthModal";

export default function Header() {
  const [user, setUser] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const savedEmail = localStorage.getItem("userEmail");
      setUser(savedEmail || "User");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setUser(null);
    navigate("/");
  };

  const handleAuthSuccess = (email: string) => {
    setUser(email);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-400/40">
              <BriefcaseBusiness className="h-5 w-5 text-white" strokeWidth={2.2} />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerBoost</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/enhance-resume" className="hover:text-blue-600">Enhance Resume</Link>
            <Link to="/cover-letter" className="hover:text-blue-600">Cover Letter</Link>
            <Link to="/job-fit" className="hover:text-blue-600">Job Fit</Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Not logged in → show CTA that opens modal */}
            {!user && (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-sm"
              >
                Get Started
              </button>
            )}

            {/* Logged in → show email + logout */}
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-gray-600 text-sm">
                  Hi, <span className="font-semibold text-gray-900">{user}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-red-600 text-sm font-medium hover:underline"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}
