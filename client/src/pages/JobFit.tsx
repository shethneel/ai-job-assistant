// src/pages/JobFit.tsx

import { useEffect, useState } from "react";
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

type ActiveJDTab = "paste" | "upload";
type ActiveResumeTab = "paste" | "upload" | "saved";

interface Analysis {
  matchScore: number;
  strengths: string[];
  missingSkills: string[];
  redFlags: string[];
  recommendations: string[];
}

// Use same-origin by default; in dev you can set VITE_API_BASE_URL=http://127.0.0.1:8000
const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL || "";

// Keys we *expect* might be used for our JWT in localStorage
const PREFERRED_TOKEN_KEYS = [
  "jobAgentToken",
  "access_token",
  "accessToken",
  "token",
  "authToken",
  "careerboost_token",
];

export default function JobFit() {
  const [jobDesc, setJobDesc] = useState("");
  const [resumeContent, setResumeContent] = useState("");
  const [uploadedResumeFile, setUploadedResumeFile] =
    useState<File | null>(null);
  const [uploadedJDFileName, setUploadedJDFileName] =
    useState<string>("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [enhancedResume, setEnhancedResume] = useState("");
  const [improvementExplanation, setImprovementExplanation] =
    useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [activeJDTab, setActiveJDTab] =
    useState<ActiveJDTab>("paste");
  const [activeResumeTab, setActiveResumeTab] =
    useState<ActiveResumeTab>("paste");
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );

  const [token, setToken] = useState<string | null>(null);
  const [hasSavedResume, setHasSavedResume] =
    useState<boolean | null>(null);
  const [checkingSavedResume, setCheckingSavedResume] =
    useState(false);

  // -------- AUTH TOKEN DETECTION --------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ls = window.localStorage;
    let foundToken: string | null = null;
    let foundKey: string | null = null;

    // Pass 1: look at well-known keys only
    for (const key of PREFERRED_TOKEN_KEYS) {
      const value = ls.getItem(key);
      if (value) {
        foundToken = value;
        foundKey = key;
        break;
      }
    }

    // Helper: JWT-ish check
    const looksLikeJwt = (value: string) => {
      const parts = value.split(".");
      return parts.length === 3 && value.length > 20;
    };

    // Pass 2: any key *containing* "token" or "auth"
    if (!foundToken) {
      for (let i = 0; i < ls.length; i++) {
        const key = ls.key(i);
        if (!key) continue;
        if (!/token|auth/i.test(key)) continue;

        const value = ls.getItem(key);
        if (!value) continue;
        if (!looksLikeJwt(value.replace(/^Bearer\s+/i, ""))) continue;

        foundToken = value;
        foundKey = key;
        break;
      }
    }

    // Pass 3 (last resort): scan everything, but only JWT-ish values
    if (!foundToken) {
      for (let i = 0; i < ls.length; i++) {
        const key = ls.key(i);
        if (!key) continue;
        const value = ls.getItem(key);
        if (!value) continue;
        if (!looksLikeJwt(value.replace(/^Bearer\s+/i, ""))) continue;
        foundToken = value;
        foundKey = key;
        break;
      }
    }

    console.log("JobFit: detected auth token", {
      key: foundKey,
      hasToken: !!foundToken,
      preview: foundToken ? foundToken.slice(0, 15) + "..." : null,
    });

    setToken(foundToken || null);
  }, []);

  // Check if user already has a saved resume
  useEffect(() => {
    const checkSaved = async () => {
      if (!token) {
        setHasSavedResume(null);
        return;
      }
      setCheckingSavedResume(true);
      try {
        // Normalize token in case it's stored as "Bearer xxxxx"
        const cleaned = token.replace(/^Bearer\s+/i, "").trim();
        const res = await fetch(`${API_BASE}/user/resume`, {
          headers: {
            Authorization: `Bearer ${cleaned}`,
          },
        });

        if (res.status === 401) {
          console.warn("JobFit: /user/resume returned 401");
          setToken(null);
          setHasSavedResume(null);
          return;
        }

        if (res.ok) {
          setHasSavedResume(true);
        } else if (res.status === 404) {
          setHasSavedResume(false);
        } else {
          setHasSavedResume(null);
        }
      } catch (e) {
        console.error("Error checking saved resume:", e);
        setHasSavedResume(null);
      } finally {
        setCheckingSavedResume(false);
      }
    };
    checkSaved();
  }, [token]);

  const resetAll = () => {
    setJobDesc("");
    setResumeContent("");
    setUploadedResumeFile(null);
    setUploadedJDFileName("");
    setAnalysis(null);
    setEnhancedResume("");
    setImprovementExplanation("");
    setErrorMessage(null);
    setActiveJDTab("paste");
    setActiveResumeTab("paste");
  };

  // JD upload → read as text on client
  const handleJDFileChange = (file: File | null) => {
    if (!file) {
      setUploadedJDFileName("");
      setJobDesc("");
      return;
    }
    setUploadedJDFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || "";
      setJobDesc(text);
    };
    reader.readAsText(file);
  };

  // Normalize + require a token
  const requireToken = (): string => {
    let raw = token;

    // Tiny fallback in case state isn't populated yet
    if (!raw && typeof window !== "undefined") {
      const ls = window.localStorage;
      for (const key of PREFERRED_TOKEN_KEYS) {
        const v = ls.getItem(key);
        if (v) {
          raw = v;
          break;
        }
      }
    }

    if (!raw) {
      throw new Error(
        "Please log in to use Job Fit and saved resume features."
      );
    }

    const cleaned = raw.replace(/^Bearer\s+/i, "").trim();
    if (!cleaned) {
      throw new Error(
        "Please log in to use Job Fit and saved resume features."
      );
    }
    return cleaned;
  };

  // Upload current resume as the user's "saved resume"
  const uploadCurrentResumeAsSaved = async (authToken: string) => {
    const formData = new FormData();

    if (activeResumeTab === "paste") {
      if (!resumeContent.trim()) {
        throw new Error("Please paste your resume first.");
      }
      const blob = new Blob([resumeContent], { type: "text/plain" });
      const file = new File([blob], "pasted-resume.txt", {
        type: "text/plain",
      });
      formData.append("file", file);
    } else if (activeResumeTab === "upload") {
      if (!uploadedResumeFile) {
        throw new Error("Please upload a resume file first.");
      }
      formData.append("file", uploadedResumeFile);
    } else {
      // "saved" tab – assume it's already uploaded
      return;
    }

    const res = await fetch(`${API_BASE}/user/resume/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });

    if (res.status === 401) {
      setToken(null);
      throw new Error(
        "Your session has expired. Please log in again to upload your resume."
      );
    }

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(
        data?.detail || "Failed to upload resume. Please try again."
      );
    }

    setHasSavedResume(true);
  };

  const handleAnalyzeResume = async () => {
    setErrorMessage(null);
    setAnalysis(null);
    setEnhancedResume("");
    setImprovementExplanation("");
    setIsAnalyzing(true);

    try {
      const jd = jobDesc.trim();
      if (!jd) {
        throw new Error("Please provide a job description.");
      }

      const authToken = requireToken(); // may throw

      // Make sure backend has a "saved" resume to work with
      if (activeResumeTab !== "saved") {
        await uploadCurrentResumeAsSaved(authToken);
      } else if (hasSavedResume === false) {
        throw new Error(
          "No saved resume found. Please paste or upload a resume first."
        );
      }

      const res = await fetch(
        `${API_BASE}/job-match/analyze-from-saved`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ job_description: jd }),
        }
      );

      if (res.status === 401) {
        setToken(null);
        throw new Error(
          "Your session has expired. Please log in again to analyze job fit."
        );
      }

      if (res.status === 404) {
        throw new Error(
          "No saved resume found. Please upload or paste your resume first."
        );
      }

      if (res.status === 429) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.detail || "Daily job match limit reached."
        );
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.detail ||
            "Failed to analyze job match. Please try again."
        );
      }

      const data = await res.json();
      const mapped: Analysis = {
        matchScore: data.match_score ?? 0,
        strengths: data.strong_points ?? [],
        missingSkills: data.missing_skills ?? [],
        redFlags: data.red_flags ?? [],
        recommendations: data.recommendations ?? [],
      };

      setAnalysis(mapped);
    } catch (err: any) {
      console.error("Analyze error:", err);
      setErrorMessage(err?.message || "Failed to analyze resume.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEnhanceResume = async () => {
    setErrorMessage(null);
    setIsEnhancing(true);

    try {
      const jd = jobDesc.trim();
      if (!jd) {
        throw new Error("Please provide a job description first.");
      }

      const authToken = requireToken(); // may throw

      if (!hasSavedResume) {
        throw new Error(
          "No saved resume found. Please upload or paste your resume and analyze first."
        );
      }

      const res = await fetch(
        `${API_BASE}/resume/tailor-from-saved`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ job_description: jd }),
        }
      );

      if (res.status === 401) {
        setToken(null);
        throw new Error(
          "Your session has expired. Please log in again to tailor your resume."
        );
      }

      if (res.status === 404) {
        throw new Error(
          "No saved resume found. Please upload or paste your resume first."
        );
      }

      if (res.status === 429) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.detail || "Daily tailoring limit reached."
        );
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.detail ||
            "Failed to generate tailored resume. Please try again."
        );
      }

      const data = await res.json();
      const improved = data.improved_match;

      const mappedImproved: Analysis = {
        matchScore: improved.match_score ?? 0,
        strengths: improved.strong_points ?? [],
        missingSkills: improved.missing_skills ?? [],
        redFlags: improved.red_flags ?? [],
        recommendations: improved.recommendations ?? [],
      };

      setAnalysis(mappedImproved);
      setEnhancedResume(data.tailored_resume || "");
      setImprovementExplanation(
        data.improvement_explanation || ""
      );
    } catch (err: any) {
      console.error("Enhance error:", err);
      setErrorMessage(err?.message || "Failed to enhance resume.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCopyResume = () => {
    if (!enhancedResume) return;
    navigator.clipboard.writeText(enhancedResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadResume = () => {
    if (!enhancedResume) return;
    const element = document.createElement("a");
    const file = new Blob([enhancedResume], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `optimized-resume-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32 bg-gradient-to-br from-orange-50 via-white to-pink-50">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-100 to-pink-100 px-4 py-2 mb-8 border border-orange-200">
                <Target className="h-4 w-4 text-orange-600 mr-2" />
                <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  Job Fit & Tailored Resume
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight mt-6 mb-6">
                Job Fit Analyzer
                <span className="block text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text mt-3">
                  Match & Tailor Your Resume
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
                Analyze how well your resume matches a job description using
                your saved profile, then generate a tailored version that boosts
                your match score while keeping your real experience.
              </p>

              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 rounded-lg bg-white border border-orange-200 hover:shadow-md transition-shadow">
                  <p className="text-2xl font-bold text-orange-600">
                    1x
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Save resume once
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-pink-200 hover:shadow-md transition-shadow">
                  <p className="text-2xl font-bold text-pink-600">
                    Any
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Job description
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-orange-200 hover:shadow-md transition-shadow">
                  <p className="text-2xl font-bold text-orange-600">
                    AI
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Match & Tailoring
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="mx-auto max-w-6xl">
            {errorMessage && (
              <div className="mb-6 max-w-3xl mx-auto rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {errorMessage}
              </div>
            )}

            {!analysis ? (
              // Step 1: Input Phase
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  Step 1: Add Job Description & Choose Resume Source
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Job Description Input */}
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
                            setActiveJDTab(tab.id as ActiveJDTab)
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
                        onChange={(e) =>
                          setJobDesc(e.target.value)
                        }
                        placeholder="Paste the complete job description here..."
                        className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none h-64"
                      />
                    )}

                    {activeJDTab === "upload" && (
                      <div className="border-2 border-dashed border-orange-300 rounded-xl p-6 text-center hover:border-orange-500 hover:bg-orange-50 transition-all">
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 mb-2">
                          Drag and drop your job description here
                        </p>
                        <label className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-orange-700 bg-white border border-orange-300 rounded-lg cursor-pointer hover:bg-orange-50">
                          <span>Click to browse</span>
                          <input
                            type="file"
                            accept=".txt,.md,.doc,.docx,.pdf"
                            className="hidden"
                            onChange={(e) =>
                              handleJDFileChange(
                                e.target.files?.[0] || null
                              )
                            }
                          />
                        </label>
                        {uploadedJDFileName && (
                          <p className="mt-2 text-xs text-gray-500">
                            Selected: {uploadedJDFileName}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Resume Input */}
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
                              tab.id as ActiveResumeTab
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
                        onChange={(e) =>
                          setResumeContent(e.target.value)
                        }
                        placeholder="Paste your resume here..."
                        className="flex-1 px-4 py-3 border-2 border-pink-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                      />
                    )}

                    {activeResumeTab === "upload" && (
                      <div className="border-2 border-dashed border-pink-300 rounded-xl p-6 text-center hover:border-pink-500 hover:bg-pink-50 transition-all">
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 mb-2">
                          Drag and drop your resume here
                        </p>
                        <label className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-pink-700 bg-white border border-pink-300 rounded-lg cursor-pointer hover:bg-pink-50">
                          <span>Click to browse</span>
                          <input
                            type="file"
                            accept=".txt,.doc,.docx,.pdf"
                            className="hidden"
                            onChange={(e) =>
                              setUploadedResumeFile(
                                e.target.files?.[0] || null
                              )
                            }
                          />
                        </label>
                        {uploadedResumeFile && (
                          <p className="mt-2 text-xs text-gray-500">
                            Selected: {uploadedResumeFile.name}
                          </p>
                        )}
                      </div>
                    )}

                    {activeResumeTab === "saved" && (
                      <div className="space-y-3 flex-1">
                        {token ? (
                          checkingSavedResume ? (
                            <div className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-600">
                              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                              Checking saved resume...
                            </div>
                          ) : hasSavedResume ? (
                            <button
                              type="button"
                              className="w-full flex items-center gap-3 p-4 text-left border-2 rounded-xl transition-all border-pink-300 bg-pink-50"
                            >
                              <FileText className="h-5 w-5 text-pink-600 flex-shrink-0" />
                              <span className="font-medium text-gray-900">
                                Using your saved resume on file
                              </span>
                            </button>
                          ) : (
                            <div className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-600 bg-white">
                              No saved resume found for your account. Switch to
                              "Paste" or "Upload" to save one during analysis.
                            </div>
                          )
                        ) : (
                          <div className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-600 bg-white">
                            Log in to use a saved resume. You can still paste or
                            upload a resume and we’ll save it for this account
                            when analyzing.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyzeResume}
                  disabled={isAnalyzing}
                  className="w-full mx-auto max-w-md block px-6 py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-orange-600 to-pink-600 text-white hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing Job Fit...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      Analyze Resume Fit
                    </>
                  )}
                </button>
              </div>
            ) : (
              // Step 2: Analysis Results
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  Step 2: Review Your Match Analysis
                </h2>

                {/* Match Score Card */}
                <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-orange-200 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Overall Match Score
                      </h2>
                      <p className="text-gray-600">
                        How well your current resume aligns with the job
                        description
                      </p>
                      {improvementExplanation && (
                        <p className="mt-3 text-sm text-gray-700">
                          <span className="font-semibold">
                            Why the tailored version is better:
                          </span>{" "}
                          {improvementExplanation}
                        </p>
                      )}
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
                            style={{
                              transition: "stroke-dasharray 1s ease",
                            }}
                          />
                          <defs>
                            <linearGradient
                              id="scoreGradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                stopColor="rgb(234, 88, 12)"
                              />
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
                          <p className="text-sm text-gray-600 mt-1">
                            Match
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis Sections */}
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
                        <li
                          key={idx}
                          className="flex items-start gap-3"
                        >
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
                        <li
                          key={idx}
                          className="flex items-start gap-3"
                        >
                          <span className="text-yellow-600 text-lg font-bold flex-shrink-0">
                            ⚠
                          </span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

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

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {!enhancedResume && (
                    <button
                      onClick={handleEnhanceResume}
                      disabled={isEnhancing}
                      className="px-6 py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-orange-600 to-pink-600 text-white hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      {isEnhancing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Enhancing Resume...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-5 w-5" />
                          Step 3: Tailor Resume to Job
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
              </div>
            )}

            {/* Tailored Resume Output */}
            {enhancedResume && (
              <div className="mt-12 space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  Step 4: Your Tailored Resume
                </h2>

                <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-white border-2 border-green-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      AI-Tailored Resume
                    </h3>
                  </div>

                  <textarea
                    value={enhancedResume}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl bg-white text-gray-900 resize-none h-80 mb-6"
                  />

                  <div className="p-4 rounded-lg bg-green-100 border border-green-200 mb-6">
                    <p className="text-sm text-green-900">
                      ✓ This version keeps your real experience, but is
                      rewritten and reorganized to better match this specific
                      job.
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
