import { useState } from "react";
import {
  MessageSquare,
  Upload,
  FileText,
  Download,
  Copy,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function CoverLetter() {
  const [resumeInput, setResumeInput] = useState("");
  const [jobDescInput, setJobDescInput] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "paste-resume" | "upload-resume" | "saved-resume"
  >("paste-resume");
  const [copied, setCopied] = useState(false);

  const savedResumes = [
    { id: 1, name: "Senior Developer Resume" },
    { id: 2, name: "Full Stack Engineer" },
    { id: 3, name: "Product Manager Resume" },
  ];

  async function handleGenerateCoverLetter() {
    const resume_text = resumeInput.trim();
    const job_description = jobDescInput.trim();

    if (!resume_text || !job_description) {
      setStatus("Please provide both resume and job description.");
      return;
    }

    setIsLoading(true);
    setStatus("Generating a tailored cover letter…");

    try {
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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">
        {/* Hero Section */}
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

        {/* Main Content */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-8">
                {/* Resume Input */}
                <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Your Resume
                    </h3>
                  </div>

                  <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
                    {[
                      { id: "paste-resume", label: "Paste Resume" },
                      { id: "upload-resume", label: "Upload File" },
                      { id: "saved-resume", label: "Saved Resume" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() =>
                          setActiveTab(
                            tab.id as
                              | "paste-resume"
                              | "upload-resume"
                              | "saved-resume"
                          )
                        }
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {activeTab === "paste-resume" && (
                    <textarea
                      value={resumeInput}
                      onChange={(e) => setResumeInput(e.target.value)}
                      placeholder="Paste your resume here for best results..."
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-48"
                    />
                  )}

                  {activeTab === "upload-resume" && (
                    <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all">
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">
                        Drag and drop your resume here
                      </p>
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        or click to browse
                      </button>
                    </div>
                  )}

                  {activeTab === "saved-resume" && (
                    <div className="space-y-3">
                      {savedResumes.map((resume) => (
                        <button
                          key={resume.id}
                          onClick={() =>
                            setResumeInput(`[Using: ${resume.name}]`)
                          }
                          className={`w-full flex items-center gap-3 p-4 text-left border-2 rounded-xl transition-all ${
                            resumeInput.includes(resume.name)
                              ? "border-blue-300 bg-blue-50"
                              : "border-gray-200 bg-white hover:border-blue-200"
                          }`}
                        >
                          <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          <span className="font-medium text-gray-900">
                            {resume.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Job Description Input */}
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
                      results
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateCoverLetter}
                    disabled={isLoading}
                    className="w-full px-6 py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-5 w-5" />
                    {isLoading ? "Generating..." : "Generate Cover Letter"}
                  </button>

                  {status && (
                    <p className="mt-3 text-xs text-gray-600">{status}</p>
                  )}
                </div>
              </div>

              {/* Output Section */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-white border-2 border-green-200 hover:shadow-lg transition-shadow flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                <h3 className="text-lg font-bold text-gray-900">
                    Generated Cover Letter
                  </h3>
                </div>

                <textarea
                  value={
                    coverLetter ||
                    "Your personalized cover letter will appear here..."
                  }
                  readOnly
                  className="flex-1 px-4 py-3 mb-6 border-2 border-green-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none min-h-64"
                />

                {coverLetter && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-green-100 border border-green-200">
                      <p className="text-sm text-green-900">
                        ✓ Cover letter ready to use
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleCopy}
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
                        onClick={handleDownloadCoverLetter}
                        className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transition-all"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Process Steps */}
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
