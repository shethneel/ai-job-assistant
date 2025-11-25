// src/pages/JobFit.tsx
import { useState } from "react";
import {
  Target,
  Upload,
  ArrowRight,
  Wand2,
  Download,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Copy,
  FileText,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

type JobFitResult = {
  match_score: number;
  strong_points: string[];
  missing_skills: string[];
  red_flags: string[];
  recommendations: string[];
};

export default function JobFit() {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<JobFitResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // UI-only state for tabs + enhanced summary
  const [activeJDTab, setActiveJDTab] = useState<"paste" | "upload">("paste");
  const [enhancedResume, setEnhancedResume] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleAnalyze() {
    const job_description = jobDescription.trim();
    const token = localStorage.getItem("token");

    // Reset previous analysis + summary
    setResult(null);
    setEnhancedResume("");
    setStatus(null);

    if (!token) {
      setStatus("Please log in and save a resume first.");
      return;
    }

    if (!job_description) {
      setStatus("Paste a job description first.");
      return;
    }

    setIsLoading(true);
    setStatus("Analyzing how well this role matches your saved resume…");

    try {
      const res = await fetch(
        `${API_BASE_URL}/job-match/analyze-from-saved`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ job_description }),
        }
      );

      if (res.status === 404) {
        setStatus(
          "We couldn’t find a saved resume for your account. Go to Enhance Resume and save a resume first."
        );
        return;
      }

      if (res.status === 429) {
        const data = await res.json().catch(() => null);
        setStatus(
          data?.detail ||
            "You’ve hit today’s analysis limit. Try again tomorrow."
        );
        return;
      }

      if (!res.ok) {
        const raw = await res.text();
        console.error("Job fit error:", raw);
        throw new Error(
          "We couldn’t analyze this job right now. Please try again."
        );
      }

      const data = await res.json();
      setResult({
        match_score: data.match_score,
        strong_points: data.strong_points || [],
        missing_skills: data.missing_skills || [],
        red_flags: data.red_flags || [],
        recommendations: data.recommendations || [],
      });
      setStatus("Analysis ready – review your job fit insights below.");
    } catch (err: any) {
      console.error(err);
      setStatus(
        err?.message ||
          "Something went wrong while analyzing this job. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleEnhanceResume() {
    if (!result) {
      setStatus(
        "Run a job fit analysis first, then we’ll build an optimized summary."
      );
      return;
    }

    setIsEnhancing(true);

    // Pure front-end “enhanced summary” – no extra backend endpoint
    setTimeout(() => {
      const summaryLines: string[] = [];

      if (result.strong_points.length) {
        summaryLines.push("Key strengths to highlight:");
        summaryLines.push(
          ...result.strong_points.map((s) => `- ${s}`)
        );
        summaryLines.push("");
      }

      if (result.missing_skills.length) {
        summaryLines.push("Skills or experience to add:");
        summaryLines.push(
          ...result.missing_skills.map((s) => `- ${s}`)
        );
        summaryLines.push("");
      }

      if (result.recommendations.length) {
        summaryLines.push("AI recommendations for your resume:");
        summaryLines.push(
          ...result.recommendations.map((r) => `- ${r}`)
        );
        summaryLines.push("");
      }

      const enhancedText = `OPTIMIZED RESUME SUMMARY – TAILORED TO THIS JOB

This summary is based on your saved resume and the job description you provided.

${summaryLines.join("\n") || "No additional suggestions available."}

Use this as a checklist to update your resume in the Enhance Resume section.`;

      setEnhancedResume(enhancedText);
      setIsEnhancing(false);
      setStatus(
        "Optimized summary ready – copy or download it and update your resume."
      );
    }, 1200);
  }

  function handleCopyResume() {
    if (!enhancedResume.trim()) return;
    navigator.clipboard.writeText(enhancedResume).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownloadResume() {
    if (!enhancedResume.trim()) return;
    const element = document.createElement("a");
    const file = new Blob([enhancedResume], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `optimized-resume-summary-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function resetAll() {
    setResult(null);
    setEnhancedResume("");
    setJobDescription("");
    setStatus(null);
    setActiveJDTab("paste");
  }

  function renderList(items: string[], emptyText: string) {
    if (!items.length) {
      return <p className="text-sm text-gray-400">{emptyText}</p>;
    }
    return (
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <ArrowRight className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
            <span className="text-gray-700 text-sm">{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">
        {/* HERO SECTION – matches reference hero style */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32 bg-gradient-to-br from-orange-50 via-white to-pink-50">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-100 to-pink-100 px-4 py-2 mb-8 border border-orange-200">
                <Target className="h-4 w-4 text-orange-600 mr-2" />
                <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  Smart Job Match Analysis
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight mt-6 mb-6">
                Job Fit Analysis
                <span className="block text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text mt-3">
                  Compare Role & Resume
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
                Paste a job description and we&apos;ll compare it against your{" "}
                <span className="font-semibold">saved resume</span>, surfacing
                match score, strengths, gaps, and practical suggestions.
              </p>

              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 rounded-lg bg-white border border-orange-200 hover:shadow-md transition-shadow">
                  <p className="text-2xl font-bold text-orange-600">360°</p>
                  <p className="text-xs text-gray-600 mt-1">Fit analysis</p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-pink-200 hover:shadow-md transition-shadow">
                  <p className="text-2xl font-bold text-pink-600">Instant</p>
                  <p className="text-xs text-gray-600 mt-1">Insights</p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-orange-200 hover:shadow-md transition-shadow">
                  <p className="text-2xl font-bold text-orange-600">AI</p>
                  <p className="text-xs text-gray-600 mt-1">Guidance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="mx-auto max-w-6xl">
            {/* STEP 1 – Input phase */}
            {!result && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  Step 1: Add the Job Description
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Job Description Input – matches reference styling */}
                  <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center">
                        <Target className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Job Description
                      </h3>
                    </div>

                    <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
                      {[
                        { id: "paste", label: "Paste JD" },
                        { id: "upload", label: "Upload File" },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() =>
                            setActiveJDTab(tab.id as "paste" | "upload")
                          }
                          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeJDTab === tab.id
                              ? "border-orange-600 text-orange-600"
                              : "border-transparent text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {activeJDTab === "paste" && (
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the complete job description here..."
                        className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none h-64"
                      />
                    )}

                    {activeJDTab === "upload" && (
                      <div className="border-2 border-dashed border-orange-300 rounded-xl p-8 text-center hover:border-orange-500 hover:bg-orange-50 transition-all">
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 mb-2">
                          Drag and drop your job description here
                        </p>
                        <button className="text-orange-600 hover:text-orange-700 font-medium">
                          or click to browse
                        </button>
                        <p className="mt-2 text-xs text-gray-400">
                          (Upload UI only for now – paste is recommended)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Saved Resume Info Card – matches reference layout but uses your backend behavior */}
                  <div className="p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-white border-2 border-pink-200 hover:shadow-lg transition-shadow flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-600 to-pink-700 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Your Saved Resume
                      </h3>
                      <p className="text-sm text-gray-600">
                        Job Fit uses the resume you&apos;ve already saved in{" "}
                        <span className="font-semibold">Enhance Resume</span>.
                      </p>
                    </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-700 space-y-3">
                      <p>
                        • If you haven&apos;t saved a resume yet, go to{" "}
                        <Link
                          to="/enhance-resume"
                          className="text-pink-600 font-semibold hover:underline"
                        >
                          Enhance Resume
                        </Link>{" "}
                        and save one first.
                      </p>
                      <p>• When you click Analyze, we&apos;ll compare:</p>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                        <li>Your saved resume</li>
                        <li>The job description you pasted</li>
                        <li>Skills, experience, and keywords</li>
                      </ul>
                    </div>

                    <div className="mt-6 p-4 rounded-lg bg-pink-100 border border-pink-200">
                      <p className="text-sm text-pink-900">
                        💡 Tip: Make sure your saved resume is up to date before
                        running Job Fit.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="w-full mx-auto max-w-md block px-6 py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-orange-600 to-pink-600 text-white hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      Analyze Resume Fit
                    </>
                  )}
                </button>

                {status && (
                  <p className="text-center text-sm text-gray-600">{status}</p>
                )}
              </div>
            )}

            {/* STEP 2 – Analysis Results */}
            {result && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  Step 2: Review Your Analysis Results
                </h2>

                {/* Match Score Card – circular gauge like reference */}
                <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-orange-200 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">
                        Overall Match Score
                      </h3>
                      <p className="text-gray-600">
                        How well your saved resume aligns with this job
                        description.
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg
                          className="transform -rotate-90"
                          style={{ width: "100%", height: "100%" }}
                        >
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="rgba(209, 213, 219, 1)"
                            strokeWidth="4"
                            fill="none"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="url(#scoreGradient)"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${
                              (result.match_score / 100) * 351.86
                            } 351.86`}
                            strokeLinecap="round"
                            style={{ transition: "stroke-dasharray 1s ease" }}
                          />
                          <defs>
                            <linearGradient
                              id="scoreGradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="rgb(234, 88, 12)" />
                              <stop
                                offset="100%"
                                stopColor="rgb(236, 72, 153)"
                              />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute text-center">
                          <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text">
                            {result.match_score}%
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Match</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strengths + Missing skills */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-white border-2 border-green-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Your Strengths
                      </h3>
                    </div>
                    {renderList(
                      result.strong_points,
                      "We’ll highlight where you’re already aligned."
                    )}
                  </div>

                  <div className="p-8 rounded-2xl bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-600 to-yellow-700 flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Missing Skills
                      </h3>
                    </div>
                    {renderList(
                      result.missing_skills,
                      "We’ll surface skills and experience you may want to add."
                    )}
                  </div>
                </div>

                {/* Red flags */}
                <div className="p-8 rounded-2xl bg-gradient-to-br from-red-50 to-white border-2 border-red-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Red Flags to Address
                    </h3>
                  </div>
                  {renderList(
                    result.red_flags,
                    "Any potential concerns or mismatches will appear here."
                  )}
                </div>

                {/* Recommendations */}
                <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      AI Recommendations
                    </h3>
                  </div>
                  {renderList(
                    result.recommendations,
                    "We’ll suggest practical ways to improve your fit for this role."
                  )}
                </div>

                {/* Actions under analysis */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleEnhanceResume}
                    disabled={isEnhancing}
                    className="px-6 py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-orange-600 to-pink-600 text-white hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isEnhancing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Building Optimized Summary...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-5 w-5" />
                        Step 3: Build Optimized Summary
                      </>
                    )}
                  </button>

                  <button
                    onClick={resetAll}
                    className="px-6 py-4 text-base font-semibold rounded-xl border-2 border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-all"
                  >
                    Analyze Another Job
                  </button>
                </div>

                {/* Status below actions */}
                {status && (
                  <p className="text-center text-sm text-gray-600">{status}</p>
                )}
              </div>
            )}

            {/* STEP 4 – Optimized summary output */}
            {enhancedResume && (
              <div className="mt-16 space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                  Step 4: Optimized Resume Summary
                </h2>

                <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-white border-2 border-green-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      AI-Structured Summary for Your Resume
                    </h3>
                  </div>

                  <textarea
                    value={enhancedResume}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl bg-white text-gray-900 resize-none h-80 mb-6"
                  />

                  <div className="p-4 rounded-lg bg-green-100 border border-green-200 mb-6">
                    <p className="text-sm text-green-900">
                      ✓ Use this as a checklist while editing your resume in the{" "}
                      <span className="font-semibold">Enhance Resume</span>{" "}
                      section.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleCopyResume}
                      className={`flex-1 px-6 py-3 text-base font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                        copied
                          ? "bg-green-600 text-white"
                          : "border-2 border-gray-300 text-gray-900 hover:border-green-400 hover:bg-green-50"
                      }`}
                    >
                      <Copy className="h-5 w-5" />
                      {copied ? "Copied!" : "Copy to Clipboard"}
                    </button>
                    <button
                      onClick={handleDownloadResume}
                      className="flex-1 px-6 py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="h-5 w-5" />
                      Download Summary
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
