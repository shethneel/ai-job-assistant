import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  FileText,
  Mail,
  Zap,
} from "lucide-react";
import AuthModal from "./AuthModal";

type AuthMode = "login" | "signup";

export default function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const savedEmail = localStorage.getItem("userEmail");
      setUserEmail(savedEmail || "user@example.com");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setUserEmail(null);
    setProfileOpen(false);
    setMobileMenuOpen(false);
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
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/98 backdrop-blur supports-[backdrop-filter]:bg-white/95 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
                <BriefcaseBusiness className="h-6 w-6 text-white" />
              </div>
              <span className="hidden sm:inline text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CareerBoost
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="px-3 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                Home
              </Link>

              {/* Services Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => setServicesOpen((prev) => !prev)}
                  type="button"
                  className="px-3 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center gap-1.5 group"
                >
                  Services
                  <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute left-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2.5 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      AI Tools
                    </p>
                  </div>
                  <Link
                    to="/enhance-resume"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                  >
                    <FileText className="h-4 w-4 text-blue-600" />
                    <div>
                      <p>Enhance Resume</p>
                      <p className="text-xs text-gray-500 group-hover:text-blue-500">
                        Optimize your resume
                      </p>
                    </div>
                  </Link>
                  <Link
                    to="/cover-letter"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-blue-50 hover:text-blue-600 border-t border-gray-100 transition-colors group"
                  >
                    <Mail className="h-4 w-4 text-purple-600" />
                    <div>
                      <p>Cover Letter</p>
                      <p className="text-xs text-gray-500 group-hover:text-blue-500">
                        AI-powered letters
                      </p>
                    </div>
                  </Link>
                  <Link
                    to="/job-fit"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-blue-50 hover:text-blue-600 border-t border-gray-100 rounded-b-xl transition-colors group"
                  >
                    <Zap className="h-4 w-4 text-green-600" />
                    <div>
                      <p>Job Fit</p>
                      <p className="text-xs text-gray-500 group-hover:text-blue-500">
                        Match with jobs
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              <Link
                to="/pricing"
                className="px-3 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                Pricing
              </Link>

              {/* Documentation removed per request */}

              <Link
                to="/about"
                className="px-3 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                About Us
              </Link>
            </nav>

            {/* Right Section - Auth & Profile & Mobile Menu */}
            <div className="flex items-center gap-4">
              {/* Auth Buttons (Desktop) */}
              {!userEmail && (
                <div className="hidden sm:flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setIsAuthOpen(true);
                    }}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("signup");
                      setIsAuthOpen(true);
                    }}
                    className="px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Profile Button (only when logged in) */}
              {userEmail && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white hover:shadow-xl hover:scale-110 transition-all duration-200 border-2 border-white"
                    title={userEmail || "Account"}
                  >
                    <span className="text-sm font-semibold">
                      {getInitial(userEmail)}
                    </span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Account
                        </p>
                        <p className="text-xs text-gray-700 truncate">
                          {userEmail}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/dashboard");
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-gray-900 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                      >
                        <User className="h-4 w-4 text-gray-500" />
                        Dashboard
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/settings");
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-gray-900 hover:bg-blue-50 hover:text-blue-600 border-t border-gray-100 transition-colors flex items-center gap-2"
                      >
                        <User className="h-4 w-4 text-gray-500" />
                        Settings
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/my-resumes");
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-gray-900 hover:bg-blue-50 hover:text-blue-600 border-t border-gray-100 transition-colors flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4 text-gray-500" />
                        My Resumes
                      </button>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 border-t border-gray-100 rounded-b-xl flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-900" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-900" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-1 bg-gray-50">
              <Link
                to="/"
                className="block px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-white hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              {/* Mobile Services Dropdown */}
              <div>
                <button
                  type="button"
                  onClick={() => setServicesOpen((prev) => !prev)}
                  className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-white hover:text-blue-600 rounded-lg transition-colors flex items-center justify-between"
                >
                  Services
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${
                      servicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {servicesOpen && (
                  <div className="ml-4 mt-2 space-y-1.5 bg-white rounded-lg p-2">
                    <Link
                      to="/enhance-resume"
                      className="block px-3 py-2 text-sm font-medium text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setServicesOpen(false);
                      }}
                    >
                      <FileText className="h-4 w-4 text-blue-600" />
                      Enhance Resume
                    </Link>
                    <Link
                      to="/cover-letter"
                      className="block px-3 py-2 text-sm font-medium text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setServicesOpen(false);
                      }}
                    >
                      <Mail className="h-4 w-4 text-purple-600" />
                      Cover Letter
                    </Link>
                    <Link
                      to="/job-fit"
                      className="block px-3 py-2 text-sm font-medium text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setServicesOpen(false);
                      }}
                    >
                      <Zap className="h-4 w-4 text-green-600" />
                      Job Fit
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/pricing"
                className="block px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-white hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>

              {/* Documentation removed in mobile too */}

              <Link
                to="/about"
                className="block px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-white hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>

              {/* Mobile auth/profile section */}
              <div className="border-t border-gray-200 pt-4 mt-4 bg-white rounded-lg p-2 space-y-2">
                {!userEmail && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("login");
                        setIsAuthOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-center"
                    >
                      Log In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("signup");
                        setIsAuthOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg transition-colors text-center hover:shadow-lg"
                    >
                      Sign Up
                    </button>
                  </>
                )}

                {userEmail && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate("/dashboard");
                      }}
                      className="block w-full px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-center"
                    >
                      Dashboard
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate("/settings");
                      }}
                      className="block w-full px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-center"
                    >
                      Settings
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate("/my-resumes");
                      }}
                      className="block w-full px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-center"
                    >
                      My Resumes
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors text-center"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
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
