// src/components/AuthModal.tsx
import React, { useEffect, useState } from "react";
import { apiFetch } from "../shared/api";

type AuthMode = "login" | "signup";

type AuthModalProps = {
  isOpen: boolean;
  mode: AuthMode;
  onClose: () => void;
  onAuthSuccess: (email: string) => void;
};

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode,
  onClose,
  onAuthSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<AuthMode>(mode);

  // shared fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // signup-only fields
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // When parent changes mode (Log in / Sign up)
  useEffect(() => {
    setActiveTab(mode);
    setError(null);
  }, [mode]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setIsLoading(false);
      // don’t clear email so returning users see it
      setPassword("");
      setConfirmPassword("");
    } else {
      // close → fully reset
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFullName("");
      setTargetRole("");
      setExperienceLevel("");
      setActiveTab("login");
    }
  }, [isOpen]);

  // Close on Esc
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Turn backend / network errors into friendly text
  function toFriendlyMessage(raw: string | null | undefined): string {
    if (!raw) return "Something went wrong. Please try again.";

    let msg = raw.trim();

    // If backend sent JSON with {"detail": "..."}
    if (msg.startsWith("{")) {
      try {
        const parsed = JSON.parse(msg);
        if (parsed?.detail) msg = String(parsed.detail);
      } catch {
        // ignore JSON parse error
      }
    }

    if (msg.includes("Invalid email or password")) {
      return "That email or password doesn’t look right. Please check your details and try again.";
    }
    if (msg.includes("Failed to fetch")) {
      return "We couldn’t reach the server. Please make sure your internet is working and try again.";
    }

    return msg;
  }

  const handleLogin = async () => {
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const token = data?.access_token;
      if (!token) {
        throw new Error("Login failed. Please try again.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", email);

      onAuthSuccess(email);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(toFriendlyMessage(message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    setError(null);

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please double-check.");
      return;
    }

    setIsLoading(true);
    try {
      // Backend currently expects only email + password
      await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Auto-login after successful signup
      const loginRes = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const token = loginRes?.access_token;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", email);
      }

      onAuthSuccess(email);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(toFriendlyMessage(message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "login") {
      void handleLogin();
    } else {
      void handleSignup();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      {/* backdrop click to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {activeTab === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-xs text-gray-500">
              {activeTab === "login"
                ? "Log in to access your AI-powered career tools."
                : "Sign up to start enhancing your resume and job search."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pb-6 pt-3">
          {/* Tabs */}
          <div className="flex w-full mb-6 bg-gray-100 rounded-xl p-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setError(null);
              }}
              className={
                "flex-1 py-2 rounded-lg text-sm font-medium transition-all " +
                (activeTab === "login"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700")
              }
            >
              Log in
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                setError(null);
              }}
              className={
                "flex-1 py-2 rounded-lg text-sm font-medium transition-all " +
                (activeTab === "signup"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700")
              }
            >
              Sign up
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "signup" && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Full name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. Roman Reigns"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={activeTab === "login" ? "current-password" : "new-password"}
              />
            </div>

            {activeTab === "signup" && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Target role <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. Senior Backend Engineer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Experience level{" "}
                    <span className="text-gray-400">(optional)</span>
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                  >
                    <option value="">Select one</option>
                    <option value="junior">Junior</option>
                    <option value="mid">Mid-level</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead / Staff+</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading
                ? activeTab === "login"
                  ? "Logging in..."
                  : "Creating account..."
                : activeTab === "login"
                ? "Log in"
                : "Sign up"}
            </button>

            <p className="mt-2 text-center text-[10px] text-gray-400">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
