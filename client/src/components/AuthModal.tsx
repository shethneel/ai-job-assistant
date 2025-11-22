// src/components/AuthModal.tsx
import { useState } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { useEffect } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (email: string) => void;
}

type Mode = "login" | "signup";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {

   // Prevent background scroll when modal is open
    useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }

    return () => {
        document.body.style.overflow = "auto";
    };
    }, [isOpen]);

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail("");
    setName("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "signup" && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // TODO: replace this with real API calls
    const fakeToken = "demo-token";
    localStorage.setItem("token", fakeToken);
    localStorage.setItem("userEmail", email);

    onAuthSuccess(email);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl shadow-blue-500/10 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side marketing / branding */}
          <div className="hidden md:flex flex-1 flex-col justify-between bg-gradient-to-b from-blue-600 to-blue-700 p-8 text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-80">
                {mode === "login" ? "WELCOME BACK" : "JOIN CAREERBOOST"}
              </p>
              <h2 className="mt-3 text-2xl font-bold leading-snug">
                {mode === "login"
                  ? "Sign in to continue using CareerBoost"
                  : "Create your CareerBoost account"}
              </h2>
              <p className="mt-4 text-sm text-blue-100">
                Access enhanced resumes, tailored cover letters, and job-fit insights all in one place.
              </p>
            </div>

            <ul className="mt-6 space-y-2 text-xs text-blue-100/90">
              <li>✓ Save and revisit your resume versions</li>
              <li>✓ Quickly generate custom cover letters</li>
              <li>✓ Track how well you match different roles</li>
            </ul>
          </div>

          {/* Right side form */}
          <div className="flex-1 p-6 md:p-8 relative">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full border border-gray-200 p-1 hover:bg-gray-50"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>

            {/* Tabs */}
            <div className="mb-6 flex rounded-full bg-gray-100 p-1 text-sm font-medium">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 rounded-full py-2 ${
                  mode === "login" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 rounded-full py-2 ${
                  mode === "signup" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"
                }`}
              >
                Sign up
              </button>
            </div>

            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h3>
            <p className="mb-6 text-xs text-gray-500">
              {mode === "login"
                ? "Enter your email and password to access your dashboard."
                : "Sign up to save your progress and track your job applications."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Full name
                  </label>
                  <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3">
                    <User className="mr-2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Johnson"
                      className="h-10 w-full border-0 bg-transparent text-sm outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Email
                </label>
                <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3">
                  <Mail className="mr-2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-10 w-full border-0 bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Password
                </label>
                <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3">
                  <Lock className="mr-2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-10 w-full border-0 bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              {mode === "signup" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Confirm password
                  </label>
                  <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3">
                    <Lock className="mr-2 h-4 w-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-10 w-full border-0 bg-transparent text-sm outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Small footer + button */}
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                {mode === "login" ? (
                  <span>
                    New here?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Create an account
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Log in
                    </button>
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                {mode === "login" ? "Log in" : "Create account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
