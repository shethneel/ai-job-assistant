// src/components/Header.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";
import { apiFetch } from "../shared/api";

type AuthTab = "login" | "signup";

export default function Header() {
  const [user, setUser] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isAuthOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isAuthOpen]);

  // Sticky header: no need for JS, Tailwind classes handle it

  // On mount, try to fetch current user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        const me = await apiFetch("/auth/me");
        const emailFromApi =
          (me && (me.email || me.user_email || me.username)) || null;
        const storedEmail = localStorage.getItem("userEmail");
        setUser(storedEmail || emailFromApi || "User");
        if (emailFromApi) {
          localStorage.setItem("userEmail", emailFromApi);
        }
      } catch {
        // Token invalid/expired
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        setUser(null);
      }
    })();
  }, []);

  const openAuth = (mode: AuthTab) => {
    setActiveTab(mode);
    setAuthError(null);
    setIsAuthOpen(true);
  };

  const closeAuth = () => {
    setIsAuthOpen(false);
    setAuthError(null);
    setEmail("");
    setPassword("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setUser(null);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    try {
      if (!email || !password) {
        setAuthError("Please fill in both email and password.");
        setIsSubmitting(false);
        return;
      }

      if (activeTab === "signup") {
        // 1) Sign up
        await apiFetch("/auth/signup", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        // 2) Auto-login
        const loginRes = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        const token = (loginRes as any).access_token;
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("userEmail", email);
          setUser(email);
        }
      } else {
        // Login
        const loginRes = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        const token = (loginRes as any).access_token;
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("userEmail", email);
          setUser(email);
        }
      }

      closeAuth();
    } catch (err: any) {
      const msg =
        err?.message?.includes("401") || err?.message?.includes("invalid")
          ? "Invalid email or password."
          : err?.message || "Something went wrong. Please try again.";
      setAuthError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="w-full fixed top-0 inset-x-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-blue-50 border border-blue-100">
              <BriefcaseBusiness className="w-7 h-7 text-blue-600" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                CareerBoost
              </span>
              <span className="text-xs text-gray-500 hidden sm:block">
                AI career copilot
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
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

          {/* Right side */}
          <div className="flex items-center gap-4">
            {!user && (
              <button
                onClick={() => openAuth("login")}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            )}

            {user && (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-xs sm:text-sm text-gray-600">
                  Logged in as{" "}
                  <span className="font-semibold text-gray-900">
                    {user}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs sm:text-sm font-medium text-red-600 hover:underline"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Spacer so content isn't hidden behind fixed header */}
      <div className="h-16" />

      {/* Auth Modal */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative">
            {/* Close */}
            <button
              onClick={closeAuth}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Tabs */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${
                  activeTab === "login"
                    ? "bg-white shadow text-gray-900"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${
                  activeTab === "signup"
                    ? "bg-white shadow text-gray-900"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Sign up
              </button>
            </div>

            <h2 className="text-xl font-semibold mb-1">
              {activeTab === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Use the same account to access all tools: resume, cover letters,
              job fit, and more.
            </p>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  autoComplete={
                    activeTab === "login" ? "current-password" : "new-password"
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <p className="text-[11px] text-gray-400">
                  Minimum 6 characters is usually enough for testing locally.
                </p>
              </div>

              {authError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 rounded-lg bg-blue-600 text-white text-sm font-semibold py-2.5 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting
                  ? "Please wait..."
                  : activeTab === "login"
                  ? "Continue"
                  : "Create account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
