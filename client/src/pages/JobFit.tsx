import { useState } from "react";
import {
  Target,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Copy,
  Download,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function JobFit() {
  const [jd, setJd] = useState("");
  const [resume, setResume] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [optimizedResume, setOptimizedResume] = useState("");

  const [activeJDTab, setActiveJDTab] = useState<"paste" | "upload">("paste");
  const [activeResumeTab, setActiveResumeTab] = useState<
    "paste" | "upload" | "saved"
  >("paste");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);

  const savedResumes = [
    { id: 1, name: "Senior Developer Resume" },
    { id: 2, name: "Full Stack Engineer" },
    { id: 3, name: "Product Manager Resume" },
  ];

  // ----------------------------------------
  // MAIN ACTION: ANALYZE RESUME FIT
  // ----------------------------------------
  async function analyzeResumeFit() {
    if (!jd.trim() || !resume.trim()) {
      alert("Please paste or upload BOTH your Job Description and Resume.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/job-fit/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_description: jd,
          resume_text: resume,
        }),
      });

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  // ----------------------------------------
  // STEP 3 — GENERATE OPTIMIZED RESUME
  // ----------------------------------------
  async function generateOptimizedResume() {
    if (!jd.trim() || !resume.trim()) {
      alert("JD and Resume are required");
      return;
    }

    setIsEnhancing(true);

    try {
      const res = await fetch(`${API_BASE_URL}/resume/optimize-from-jd`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_description: jd,
          resume_text: resume,
        }),
      });

      const data = await res.json();
      setOptimizedResume(
        data.optimized_resume ||
          "We generated a response but it came back empty."
      );
    } catch {
      alert("Could not generate optimized resume.");
    } finally {
      setIsEnhancing(false);
    }
  }

  // ----------------------------------------
  // COPY / DOWNLOAD HANDLERS
  // ----------------------------------------
  function handleCopy() {
    navigator.clipboard.writeText(optimizedResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([optimizedResume], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimized-resume.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ----------------------------------------
  // UI START
  // ----------------------------------------
  return (
    <div className="flex flex-col min-h-screen bg-white">

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 bg-gradient-to-br from-orange-50 via-white to-pink-50">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              Step 1: Upload Your Job Description & Resume
            </h1>
          </div>
        </section>

        {/* STEP 1 INPUT SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* JOB DESCRIPTION CARD */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Job Description</h3>
              </div>

              {/* JD Tabs */}
              <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
                <button
                  onClick={() => setActiveJDTab("paste")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    activeJDTab === "paste"
                      ? "border-orange-600 text-orange-600"
                      : "border-transparent text-gray-600"
                  }`}
                >
                  Paste JD
                </button>

                <button
                  onClick={() => setActiveJDTab("upload")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    activeJDTab === "upload"
                      ? "border-orange-600 text-orange-600"
                      : "border-transparent text-gray-600"
                  }`}
                >
                  Upload File
                </button>
              </div>

              {activeJDTab === "paste" && (
                <textarea
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="Paste the full job description here…"
                  className="w-full h-64 rounded-xl border-2 border-orange-200 p-3 text-gray-900 focus:ring-2 focus:ring-orange-500"
                />
              )}

              {activeJDTab === "upload" && (
                <div className="border-2 border-dashed border-orange-300 rounded-xl p-8 text-center">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">
                    File upload coming soon (use paste for now)
                  </p>
                </div>
              )}
            </div>

            {/* RESUME CARD — MATCHES COVER LETTER STYLE */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-white border-2 border-pink-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-600 to-pink-700 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Your Resume</h3>
              </div>

              {/* Resume Tabs */}
              <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
                <button
                  onClick={() => setActiveResumeTab("paste")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    activeResumeTab === "paste"
                      ? "border-pink-600 text-pink-600"
                      : "border-transparent text-gray-600"
                  }`}
                >
                  Paste Resume
                </button>

                <button
                  onClick={() => setActiveResumeTab("upload")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    activeResumeTab === "upload"
                      ? "border-pink-600 text-pink-600"
                      : "border-transparent text-gray-600"
                  }`}
                >
                  Upload File
                </button>

                <button
                  onClick={() => setActiveResumeTab("saved")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    activeResumeTab === "saved"
                      ? "border-pink-600 text-pink-600"
                      : "border-transparent text-gray-600"
                  }`}
                >
                  Saved Resume
                </button>
              </div>

              {/* Resume Tab Content */}
              {activeResumeTab === "paste" && (
                <textarea
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Paste your resume here…"
                  className="w-full h-64 rounded-xl border-2 border-pink-200 p-3 text-gray-900 focus:ring-2 focus:ring-pink-500"
                />
              )}

              {activeResumeTab === "upload" && (
                <div className="border-2 border-dashed border-pink-300 rounded-xl p-8 text-center">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">
                    File upload coming soon (use paste for now)
                  </p>
                </div>
              )}

              {activeResumeTab === "saved" && (
                <div className="space-y-3">
                  {savedResumes.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setResume(`[Using: ${r.name}]`)}
                      className="w-full text-left p-4 border-2 rounded-xl hover:border-pink-300"
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Analyze button */}
          {!analysis && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={analyzeResumeFit}
                disabled={isAnalyzing}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-600 to-pink-600 text-white font-semibold hover:shadow-lg flex gap-2 items-center"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Resume Fit"}
              </button>
            </div>
          )}

          {/* ANALYSIS RESULTS */}
          {analysis && (
            <div className="mt-20 space-y-10 max-w-5xl mx-auto">

              {/* Match Score */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-orange-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Resume Match Score
                </h2>
                <p className="text-gray-600 mb-4">
                  How closely your resume matches the job description
                </p>
                <div className="text-6xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text">
                  {analysis.match_score || analysis.matchScore}%
                </div>
              </div>

              {/* Strengths */}
              <div className="p-8 rounded-2xl border-2 border-green-200 bg-green-50">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <CheckCircle2 className="text-green-600" /> Strengths
                </h3>
                <ul className="mt-4 space-y-2">
                  {(analysis.strengths || []).map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Missing Skills */}
              <div className="p-8 rounded-2xl border-2 border-yellow-200 bg-yellow-50">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <AlertCircle className="text-yellow-600" /> Missing Skills
                </h3>
                <ul className="mt-4 space-y-2">
                  {(analysis.missing_skills || analysis.missingSkills || []).map(
                    (item: string, i: number) => (
                      <li key={i}>{item}</li>
                    )
                  )}
                </ul>
              </div>

              {/* Red Flags */}
              <div className="p-8 rounded-2xl border-2 border-red-200 bg-red-50">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <AlertCircle className="text-red-600" /> Red Flags
                </h3>
                <ul className="mt-4 space-y-2">
                  {(analysis.red_flags || analysis.redFlags || []).map(
                    (item: string, i: number) => (
                      <li key={i}>{item}</li>
                    )
                  )}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="p-8 rounded-2xl border-2 border-blue-200 bg-blue-50">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="text-blue-600" /> AI Recommendations
                </h3>
                <ul className="mt-4 space-y-2">
                  {(analysis.recommendations || []).map(
                    (item: string, i: number) => (
                      <li key={i} className="flex gap-2">
                        <ArrowRight className="text-blue-600" /> {item}
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* NEXT STEPS BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                {!optimizedResume && (
                  <button
                    onClick={generateOptimizedResume}
                    disabled={isEnhancing}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-pink-600 text-white font-semibold hover:shadow-lg"
                  >
                    {isEnhancing
                      ? "Generating Optimized Resume..."
                      : "Step 3: Generate Optimized Resume"}
                  </button>
                )}

                <button
                  onClick={() => {
                    setAnalysis(null);
                    setOptimizedResume("");
                  }}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300"
                >
                  Analyze Another Job
                </button>
              </div>
            </div>
          )}

          {/* OPTIMIZED RESUME OUTPUT */}
          {optimizedResume && (
            <div className="mt-20 max-w-5xl mx-auto p-8 rounded-2xl border-2 border-green-200 bg-green-50">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="text-green-600" />
                AI-Optimized Resume (Download or Copy)
              </h3>

              <textarea
                readOnly
                value={optimizedResume}
                className="w-full h-80 rounded-xl border-2 p-3 bg-white"
              />

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={handleCopy}
                  className={`flex-1 px-6 py-3 rounded-xl border-2 ${
                    copied
                      ? "bg-green-600 text-white"
                      : "border-gray-300 hover:bg-green-50"
                  }`}
                >
                  <Copy className="inline-block mr-2" />
                  {copied ? "Copied!" : "Copy"}
                </button>

                <button
                  onClick={handleDownload}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                >
                  <Download className="inline-block mr-2" />
                  Download
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
