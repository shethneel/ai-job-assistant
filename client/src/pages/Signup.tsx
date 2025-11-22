// client/src/pages/Signup.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signup: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: hook up to your real auth API
    console.log("Signup", { fullName, email, password });
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gray-50 flex items-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] items-center">
          {/* Left side - marketing copy */}
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Get started free
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Create your CareerBoost account
            </h1>
            <p className="text-base text-gray-600">
              Build stronger applications with AI-powered resume enhancement,
              tailored cover letters, and job-fit analysis.
            </p>

            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Unlimited resume enhancements</li>
              <li>✓ ATS-friendly formatting and tips</li>
              <li>✓ Secure storage for your profile data</li>
            </ul>
          </div>

          {/* Right side - form card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Sign up
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Log in
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Alex Johnson"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="At least 8 characters"
                />
              </div>

              <p className="text-xs text-gray-500">
                By creating an account, you agree to our Terms of Service and
                Privacy Policy.
              </p>

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Create account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
