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

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

type Analysis = {
  matchScore: number;
  strengths: string[];
  missingSkills: string[];
  redFlags: string[];
  recommendations: string[];
};

export default function JobFit() {
  const [jobDesc, setJobDesc] = useState("");
  const [resumeContent, setResumeContent] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [optimizedResume, setOptimizedResume] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const [activeJDTab, setActiveJDTab] = useState<"paste" | "upload">("paste");
  const [activeResumeTab, setActiveResumeTab] = useState<
    "paste" | "upload" | "saved"
  >("paste");

  const [copied, setCopied] = useState(false);

  // Just demo data for Saved Resume tab – no backend required
  const savedResumes = [
    { id: 1, name: "Data Science Resume" },
    { id: 2, name: "Software Engineer Resume" },
    { id: 3, name: "Business Analyst Resume" },
  ];

  async function handleAnalyzeResume() {
    const job_description = jobDesc.trim();
    const resume_text = resumeContent.trim();

    if (!job_description || !resume_text) {
      setStatus("Please add both the job description and your resume.");
      return;
    }

    setIsAnalyzing(true);
    setStatus("Analyzing how well your resume fits this job…");

    try {
      const res = await fetch(`${API_BASE_URL}/job-fit/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_description, resume_text }),
      });

      if (!res.ok) {
        const raw = await res.text();
        console.error("Job fit error:", raw);
        throw new Error("We couldn’t analyze your resume right now.");
      }

      const data = await res.json();

      const normalized: Analysis = {
        matchScore:
          data.matchScore ??
          data.match_score ??
          data.score ??
          0,
        strengths: data.strengths ?? data.strengths_list ?? [],
        missingSkills:
          data.missingSkills ?? data.missing_skills ?? data.gaps ?? [],
        redFlags: data.redFlags ?? data.red_flags ?? [],
        recommendations:
          data.recommendations ?? data.suggestions ?? [],
      };

      setAnalysis(normalized);
      setStatus("Analysis ready — review your strengths, gaps, and next steps.");
    } catch (err: any) {
      console.error(err);
      setAnalysis(null);
      setStatus(
        err?.message ||
          "Something went wrong while analyzing your resume fit."
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleOptimizeResume() {
    const job_description = jobDesc.trim();
    const resume_text = resumeContent.trim();

    if (!job_description || !resume_text) {
      setStatus(
        "Please make sure both job description and resume are filled before optimizing."
      );
      return;
    }

    setIsOptimizing(true);
    setStatus("Building an optimized resume tailored to this job…");

    try {
      const res = await fetch(`${API_BASE_URL}/job-fit/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_description, resume_text }),
      });

      if (!res.ok) {
        const raw = await res.text();
        console.error("Optimize error:", raw);
        throw new Error(
          "We couldn’t create an optimized resume right now. Please try again."
        );
      }

      const data = await res.json();

      const text =
        data.optimized_resume ||
        data.enhanced_resume ||
        data.resume ||
        data.text ||
        "";

      if (!text) {
        setStatus(
          "We got a response from the server, but it was empty. Please try again."
        );
      }

      setOptimizedResume(
        text ||
          "We tried to optimize your resume, but the response came back empty."
      );
      setStatus("Done! You can now copy or download your optimized resume.");
    } catch (err: any) {
      console.error(err);
      setOptimizedResume("");
      setStatus(
        err?.message ||
          "Something went wrong while building your optimized resume."
      );
    } finally {
      setIsOptimizing(false);
    }
  }

  function handleCopyOptimized() {
    if (!optimizedResume.trim()) return;

    navigator.clipboard
      .writeText(optimizedResume)
      .then(() => {
        setCopied(true);
        setStatus("Optimized resume copied — make any final tweaks you like.");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setStatus(
          "Couldn’t copy automatically. You can still copy it manually."
        );
      });
  }

  function handleDownloadOptimized() {
    if (!optimizedResume.trim()) return;

    const blob = new Blob([optimizedResume], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimized-resume.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatus("Downloaded your optimized resume as a .txt file.");
  }

  function resetAll() {
    setAnalysis(null);
    setOptimizedResume("");
    setJobDesc("");
    setResumeContent("");
    setStatus(null);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">

      <main className="flex-1">
        {/* HERO – EXACTLY LIKE REFERENCE */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32 bg-gradient-to-br from-orange-50 via-white to-pink-50">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-100 to-pink-100 px-4 py-2 mb-8 border border-orange-200">
                <Target className="h-4 w-4 text-orange-600 mr-2" />
                <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  Smart Optimization
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight mt-6 mb-6">
                Resume Optimizer
                <span className="block text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text mt-3">
                  Match &amp; Enhance
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
                Analyze how well your resume matches any job description,
                identify gaps, get personalized recommendations, and receive an
                AI-enhanced resume tailored to the role.
              </p>

              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 rounded-lg bg-white border border-orange-200 hover:shadow-md transition-shadow">
                  <p className="text-2xl font-bold text-orange-600">360°</p>
                  <p className="text-xs text-gray-600 mt-1">Full analysis</p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-pink-200 hover:shadow-md transition-shadow">
                  <p className="text-2xl font-bold text-pink-600">Instant</p>
                  <p className="text-xs text-gray-600 mt-1">Results</p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-orange-200 hover:shadow-md transition-shadow">
                  <p className="text-2xl font-bold text-orange-600">AI</p>
                  <p className="text-xs text-gray-600 mt-1">Enhancement</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT – STEP 1 + ANALYSIS + OPTIMIZED RESUME */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="mx-auto max-w-6xl">
            {!analysis ? (
              /* STEP 1: INPUT PHASE (JD + RESUME TABS) */
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  Step 1: Upload Your Job Description &amp; Resume
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* JOB DESCRIPTION CARD */}
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
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                        placeholder="Paste the full job description here..."
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
                        <p className="mt-2 text-xs text-gray-500">
                          (File upload is visual only right now — best results
                          come from pasting the text.)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* RESUME CARD WITH TABS (PASTE / UPLOAD / SAVED) */}
                  <div className="p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-white border-2 border-pink-200 hover:shadow-lg transition-shadow flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-600 to-pink-700 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Your Resume
                      </h3>
                    </div>

                    <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
                      {[
                        { id: "paste", label: "Paste Resume" },
                        { id: "upload", label: "Upload File" },
                        { id: "saved", label: "Saved Resume" },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() =>
                            setActiveResumeTab(
                              tab.id as "paste" | "upload" | "saved"
                            )
                          }
                          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeResumeTab === tab.id
                              ? "border-pink-600 text-pink-600"
                              : "border-transparent text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {activeResumeTab === "paste" && (
                      <textarea
                        value={resumeContent}
                        onChange={(e) => setResumeContent(e.target.value)}
                        placeholder="Paste your resume here..."
                        className="flex-1 px-4 py-3 border-2 border-pink-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                      />
                    )}

                    {activeResumeTab === "upload" && (
                      <div className="border-2 border-dashed border-pink-300 rounded-xl p-8 text-center hover:border-pink-500 hover:bg-pink-50 transition-all">
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 mb-2">
                          Drag and drop your resume here
                        </p>
                        <button className="text-pink-600 hover:text-pink-700 font-medium">
                          or click to browse
                        </button>
                        <p className="mt-2 text-xs text-gray-500">
                          (For now this is a visual dropzone — paste text for
                          best results.)
                        </p>
                      </div>
                    )}

                    {activeResumeTab === "saved" && (
                      <div className="space-y-3 flex-1">
                        {savedResumes.map((resume) => (
                          <button
                            key={resume.id}
                            onClick={() =>
                              setResumeContent(`[Using: ${resume.name}]`)
                            }
                            className={`w-full flex items-center gap-3 p-4 text-left border-2 rounded-xl transition-all ${
                              resumeContent.includes(resume.name)
                                ? "border-pink-300 bg-pink-50"
                                : "border-gray-200 bg-white hover:border-pink-200"
                            }`}
                          >
                            <FileText className="h-5 w-5 text-pink-600 flex-shrink-0" />
                            <span className="font-medium text-gray-900">
                              {resume.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ANALYZE BUTTON */}
                <button
                  onClick={handleAnalyzeResume}
                  disabled={isAnalyzing}
                  className="w-full mx-auto max-w-md block px-6 py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-orange-600 to-pink-600 text-white hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
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
            ) : (
              /* STEP 2: ANALYSIS RESULTS */
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  Step 2: Review Your Analysis Results
                </h2>

                {/* MATCH SCORE */}
                <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-orange-200 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Overall Match Score
                      </h2>
                      <p className="text-gray-600">
                        How well your resume aligns with the job description
                      </p>
                    </div>
                    <div className="mt-8 sm:mt-0 flex flex-col items-center">
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
                              (analysis.matchScore / 100) * 351.86
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
                            {analysis.matchScore}%
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Match</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STRENGTHS & MISSING SKILLS */}
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
                    <ul className="space-y-4">
                      {analysis.strengths.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-green-600 text-lg font-bold flex-shrink-0">
                            ✓
                          </span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
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
                    <ul className="space-y-4">
                      {analysis.missingSkills.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-yellow-600 text-lg font-bold flex-shrink-0">
                            ⚠
                          </span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* RED FLAGS */}
                <div className="p-8 rounded-2xl bg-gradient-to-br from-red-50 to-white border-2 border-red-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Red Flags to Address
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    {analysis.redFlags.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-red-600 text-lg font-bold flex-shrink-0">
                          ✕
                        </span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* RECOMMENDATIONS */}
                <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      AI Recommendations
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    {analysis.recommendations.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <ArrowRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ACTION BUTTONS – STEP 3 GET OPTIMIZED RESUME */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {!optimizedResume && (
                    <button
                      onClick={handleOptimizeResume}
                      disabled={isOptimizing}
                      className="px-6 py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-orange-600 to-pink-600 text-white hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      {isOptimizing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Building Optimized Resume...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-5 w-5" />
                          Step 3: Get Optimized Resume
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={resetAll}
                    className="px-6 py-4 text-base font-semibold rounded-xl border-2 border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-all"
                  >
                    Analyze Another Job
                  </button>
                </div>

                {status && (
                  <p className="text-center text-sm text-gray-600">{status}</p>
                )}
              </div>
            )}

            {/* STEP 4: OPTIMIZED RESUME OUTPUT */}
            {optimizedResume && (
              <div className="mt-12 space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  Step 4: Your Optimized Resume
                </h2>

                <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-white border-2 border-green-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      AI-Enhanced Resume
                    </h3>
                  </div>

                  <textarea
                    value={optimizedResume}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl bg-white text-gray-900 resize-none h-80 mb-6"
                  />

                  <div className="p-4 rounded-lg bg-green-100 border border-green-200 mb-6">
                    <p className="text-sm text-green-900">
                      ✓ Your resume is now optimized for this job description.
                      You can still tweak the content before sending.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleCopyOptimized}
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
                      onClick={handleDownloadOptimized}
                      className="flex-1 px-6 py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="h-5 w-5" />
                      Download Resume
                    </button>
                  </div>

                  <button
                    onClick={resetAll}
                    className="w-full mt-4 px-6 py-3 text-base font-medium rounded-xl border-2 border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-all"
                  >
                    Analyze Another Job
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

    </div>
  );
}
