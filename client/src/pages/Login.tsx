// client/src/pages/Login.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: hook up to your real auth API
    console.log("Login", { email, password });
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gray-50 flex items-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] items-center">
          {/* Left side - marketing copy */}
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Welcome back
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Sign in to continue using CareerBoost
            </h1>
            <p className="text-base text-gray-600">
              Access your enhanced resumes, tailored cover letters, and job-fit
              insights all in one place.
            </p>

            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Save and revisit your resume versions</li>
              <li>✓ Quickly generate custom cover letters</li>
              <li>✓ Track how well you match different roles</li>
            </ul>
          </div>

          {/* Right side - form card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Log in
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              New here?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Create an account
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-gray-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Log in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;