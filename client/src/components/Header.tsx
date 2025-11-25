import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, ChevronDown } from "lucide-react";
import AuthModal from "./AuthModal";

type AuthMode = "login" | "signup";

export default function Header() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const savedEmail = localStorage.getItem("userEmail");
      setUserEmail(savedEmail || "user@example.com");
    }
  }, []);

  // Close profile dropdown on outside click / Esc
  useEffect(() => {
    if (!isMenuOpen) return;

    function handleClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setUserEmail(null);
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleAuthSuccess = (email: string) => {
    setUserEmail(email);
    localStorage.setItem("userEmail", email);
    setIsAuthOpen(false);
  };

  const getInitial = (email: string | null) => {
    if (!email) return "?";
    return email.trim()[0]?.toUpperCase() || "?";
  };

  return (
    <>
      {/* Top navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-md shadow-blue-400/40">
              <BriefcaseBusiness className="h-5 w-5 text-white" strokeWidth={2.2} />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerBoost</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>
            <Link to="/enhance-resume" className="hover:text-blue-600">
              Enhance Resume
            </Link>
            <Link to="/cover-letter" className="hover:text-blue-600">
              Cover Letter
            </Link>
            <Link to="/job-fit" className="hover:text-blue-600">
              Job Fit
            </Link>
          </nav>

          {/* Right side: auth / account */}
          <div className="flex items-center gap-3">
            {/* Logged OUT → Login + Sign up buttons */}
            {!userEmail && (
              <>
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setIsAuthOpen(true);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  type="button"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    setAuthMode("signup");
                    setIsAuthOpen(true);
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm"
                  type="button"
                >
                  Sign up
                </button>
              </>
            )}

            {/* Logged IN → profile chip + dropdown */}
            {userEmail && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white text-sm shadow-sm hover:bg-gray-50"
                  type="button"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center text-sm font-semibold">
                    {getInitial(userEmail)}
                  </div>
                  <span className="font-medium text-gray-800">Account</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-white shadow-lg py-2 text-sm">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                      type="button"
                    >
                      Profile
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                      type="button"
                    >
                      Settings
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                      type="button"
                    >
                      Change password
                    </button>

                    <div className="my-1 border-t" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      type="button"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        mode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}
