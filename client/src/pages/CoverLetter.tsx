// client/src/pages/CoverLetter.tsx
import { useEffect, useState } from "react";
import {
  MessageSquare,
  Upload,
  FileText,
  Download,
  Copy,
  Sparkles,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

type ActiveTab = "paste-resume" | "upload-resume" | "saved-resume";

const TOKEN_KEYS = ["jobAgentToken", "token", "accessToken"];

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  for (const key of TOKEN_KEYS) {
    const v = window.localStorage.getItem(key);
    if (v) return v;
  }
  return null;
}

function requireAuthToken(): string {
  const token = getStoredToken();
  if (!token) {
    throw new Error(
      "Please log in first. Saved-resume cover letters require an account."
    );
  }
  return token;
}

type SavedResumeMeta = {
  filename: string | null;
  created_at: string;
};

export default function CoverLetter() {
  const [resumeInput, setResumeInput] = useState("");
  const [jobDescInput, setJobDescInput] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("paste-resume");
  const [copied, setCopied] = useState(false);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);

  // Saved-resume related state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasSavedResume, setHasSavedResume] = useState<boolean | null>(null);
  const [savedResumeMeta, setSavedResumeMeta] =
    useState<SavedResumeMeta | null>(null);
  const [checkingSaved, setCheckingSaved] = useState(false);

  // On mount: check if we have a token + saved resume
  useEffect(() => {
    const token = getStoredToken();
    setIsLoggedIn(!!token);

    if (!token) {
      setHasSavedResume(false);
      return;
    }

    setCheckingSaved(true);
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/user/resume`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 404) {
          setHasSavedResume(false);
          return;
        }

        if (!res.ok) {
          console.error("Failed to check saved resume:", await res.text());
          setHasSavedResume(false);
          return;
        }

        const data = await res.json();
        setHasSavedResume(true);
        setSavedResumeMeta({
          filename: data.filename ?? null,
          created_at: data.created_at,
        });
      } catch (err) {
        console.error(err);
        setHasSavedResume(false);
      } finally {
        setCheckingSaved(false);
      }
    })();
  }, []);

  async function handleGenerateCoverLetter() {
    const job_description = jobDescInput.trim();

    if (!job_description) {
      setStatus("Please provide a job description.");
      return;
    }

    setIsLoading(true);
    setStatus(null);
    setCoverLetter("");

    try {
      if (activeTab === "saved-resume") {
        const token = requireAuthToken();

        if (hasSavedResume === false) {
          setStatus(
            "You don’t have a saved resume yet. Upload one on the Job Fit page or My Resumes."
          );
          return;
        }

        setStatus(
          "Generating a tailored cover letter from your saved resume…"
        );

        const res = await fetch(
          `${API_BASE_URL}/cover-letter/generate-from-saved`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ job_description }),
          }
        );

        if (!res.ok) {
          const raw = await res.text();
          console.error("Cover letter (saved) error:", raw);
          throw new Error(
            "We couldn’t generate a cover letter from your saved resume. Please try again."
          );
        }

        const data = await res.json();
        const text =
          data.cover_letter ||
          "We generated a response, but it came back empty. Please try again.";

        setCoverLetter(text);
        setStatus(
          "Done! This letter is based on your saved resume. Review, tweak, and then use it."
        );
      } else {
        const resume_text = resumeInput.trim();

        if (!resume_text) {
          setStatus("Please provide your resume text in the left box.");
          return;
        }

        setStatus("Generating a tailored cover letter…");

        const res = await fetch(`${API_BASE_URL}/cover-letter/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resume_text, job_description }),
        });

        if (!res.ok) {
          const raw = await res.text();
          console.error("Cover letter error:", raw);
          throw new Error(
            "We couldn’t generate a cover letter right now. Please try again."
          );
        }

        const data = await res.json();
        const text =
          data.cover_letter ||
          "We generated a response, but it came back empty. Please try again.";

        setCoverLetter(text);
        setStatus(
          "Done! You can review, copy, or download your cover letter."
        );
      }
    } catch (err: any) {
      console.error(err);
      setCoverLetter("");
      setStatus(
        err?.message ||
          "Something went wrong while generating your cover letter."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleDownloadCoverLetter() {
    if (!coverLetter.trim()) return;

    const blob = new Blob([coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatus("Downloaded your cover letter as a .txt file.");
  }

  function handleCopy() {
    if (!coverLetter.trim()) return;
    navigator.clipboard
      .writeText(coverLetter)
      .then(() => {
        setStatus(
          "Cover letter copied. Make any final edits before using it."
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() =>
        setStatus("Couldn’t copy automatically. You can copy it manually.")
      );
  }

  function handleResumeFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result?.toString() || "";
      setResumeInput(text);
    };
    reader.readAsText(file);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">
        {/* Hero Section – matches reference */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32 bg-gradient-to-br from-purple-50 via-white to-blue-50">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 mb-8 border border-purple-200">
                <MessageSquare className="h-4 w-4 text-purple-600 mr-2" />
                <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Personalized Generation
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight mt-6 mb-6">
                Cover Letter Generator
                <span className="block text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text mt-3">
                  in Minutes
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
                Generate compelling, personalized cover letters tailored to each
                job. Let AI handle the writing while you focus on landing your
                dream role.
              </p>

              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 rounded-lg bg-white border border-purple-200 hover:shadow-md transition-shadow">
                  <p className="text-2xl font-bold text-purple-600">30 sec</p>
                  <p className="text-xs text-gray-600 mt-1">Generation time</p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-blue-200 hover:shadow-md transition-shadow">
                  <p className="text-2xl font-bold text-blue-600">100%</p>
                  <p className="text-xs text-gray-600 mt-1">Customizable</p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-purple-200 hover:shadow-md transition-shadow">
                  <p className="text-2xl font-bold text-purple-600">∞</p>
                  <p className="text-xs text-gray-600 mt-1">Unlimited drafts</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content – two-column layout like reference */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT COLUMN: Resume + Job Description */}
              <div className="space-y-8">
                {/* Resume Card */}
                <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Your Resume
                    </h3>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab("paste-resume")}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === "paste-resume"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Paste Resume
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("upload-resume")}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === "upload-resume"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("saved-resume")}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === "saved-resume"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Saved Resume
                    </button>
                  </div>

                  {/* Tab content */}
                  {activeTab === "paste-resume" && (
                    <div className="space-y-3">
                      <textarea
                        value={resumeInput}
                        onChange={(e) => setResumeInput(e.target.value)}
                        placeholder="Paste your resume here for best results..."
                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-48"
                      />
                      <p className="text-xs text-gray-500">
                        We’ll only use this text to generate your cover letter.
                        Nothing is shared publicly.
                      </p>
                    </div>
                  )}

                  {activeTab === "upload-resume" && (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                        <label className="flex flex-col items-center justify-center w-full h-full">
                          <Upload className="h-10 w-10 text-blue-500 mb-3" />
                          <span className="text-blue-700 font-medium">
                            Click to browse or drag & drop
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            PDF, DOCX, or TXT. We’ll extract the text
                            automatically.
                          </span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            className="hidden"
                            onChange={handleResumeFileChange}
                          />
                        </label>
                      </div>
                      {resumeFileName && (
                        <p className="text-xs text-gray-600">
                          Selected file:{" "}
                          <span className="font-medium">{resumeFileName}</span>
                        </p>
                      )}
                      <textarea
                        className="w-full h-40 border-2 border-blue-200 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="We’ll show the extracted text here so you can review or edit it before generating."
                        value={resumeInput}
                        onChange={(e) => setResumeInput(e.target.value)}
                      />
                    </div>
                  )}

                  {activeTab === "saved-resume" && (
                    <div className="space-y-3">
                      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 flex gap-3">
                        <Sparkles className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div>
                          {!isLoggedIn ? (
                            <>
                              <p className="font-semibold mb-1">
                                Log in to use your saved resume
                              </p>
                              <p>
                                Your saved resume is tied to your account. Log in
                                from the top-right{" "}
                                <strong>Account</strong> menu, then come back
                                here.
                              </p>
                            </>
                          ) : checkingSaved ? (
                            <p className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Checking for a saved resume…</span>
                            </p>
                          ) : hasSavedResume ? (
                            <>
                              <p className="font-semibold mb-1">
                                Saved resume will be used automatically.
                              </p>
                              <p>
                                We’ll use your most recently saved resume to
                                generate this cover letter. You don’t need to
                                paste or upload anything.
                              </p>
                              {savedResumeMeta && (
                                <p className="mt-2 text-xs text-blue-800">
                                  File:{" "}
                                  <span className="font-medium">
                                    {savedResumeMeta.filename || "Saved Resume"}
                                  </span>{" "}
                                  · Saved on{" "}
                                  {new Date(
                                    savedResumeMeta.created_at
                                  ).toLocaleDateString()}
                                </p>
                              )}
                            </>
                          ) : (
                            <>
                              <p className="font-semibold mb-1">
                                No saved resume found yet
                              </p>
                              <p>
                                Upload a <strong>Saved Resume</strong> from the
                                Job Fit page or the <strong>My Resumes</strong>{" "}
                                section. After that, you can generate cover
                                letters with one click from here.
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Job Description Card */}
                <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Job Description
                    </h3>
                  </div>

                  <textarea
                    value={jobDescInput}
                    onChange={(e) => setJobDescInput(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full px-4 py-3 mb-6 border-2 border-purple-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-48"
                  />

                  <div className="p-4 rounded-lg bg-purple-100 border border-purple-200 mb-6">
                    <p className="text-sm text-purple-900">
                      💡 Include company name and role details for personalized
                      results.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateCoverLetter}
                    disabled={isLoading}
                    className="w-full px-6 py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Generate Cover Letter
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: Generated Cover Letter */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-white border-2 border-green-200 hover:shadow-lg transition-shadow flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Generated Cover Letter
                  </h3>
                </div>

                {status && (
                  <div className="flex items-start gap-2 mb-4 text-sm">
                    {status.toLowerCase().includes("couldn’t") ||
                    status.toLowerCase().includes("couldn't") ||
                    status.toLowerCase().includes("could not") ||
                    status.toLowerCase().includes("error") ? (
                      <AlertCircle className="w-4 h-4 mt-0.5 text-red-500" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500" />
                    )}
                    <p
                      className={`${
                        status.toLowerCase().includes("error") ||
                        status.toLowerCase().includes("couldn")
                          ? "text-red-600"
                          : "text-gray-700"
                      }`}
                    >
                      {status}
                    </p>
                  </div>
                )}

                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Your personalized cover letter will appear here..."
                  className="flex-1 px-4 py-3 mb-6 border-2 border-green-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none min-h-64"
                />

                {coverLetter && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-green-100 border border-green-200">
                      <p className="text-sm text-green-900">
                        ✓ Cover letter ready to use. Review, tweak, and send.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={handleCopy}
                        disabled={!coverLetter.trim()}
                        className={`flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-xl transition-all ${
                          copied
                            ? "bg-green-600 text-white"
                            : "border-2 border-gray-300 text-gray-900 hover:border-blue-400 hover:bg-blue-50"
                        }`}
                      >
                        <Copy className="h-5 w-5 mr-2" />
                        {copied ? "Copied!" : "Copy"}
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadCoverLetter}
                        disabled={!coverLetter.trim()}
                        className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Process Steps – bottom three cards */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Paste & Prepare",
                  description: "Add your resume and job description",
                  color: "from-blue-600 to-blue-700",
                },
                {
                  step: "02",
                  title: "AI Analyzes",
                  description: "Our AI understands requirements and tone",
                  color: "from-purple-600 to-purple-700",
                },
                {
                  step: "03",
                  title: "Download & Send",
                  description: "Download or copy your personalized letter",
                  color: "from-green-600 to-green-700",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center font-bold text-white mb-4`}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
