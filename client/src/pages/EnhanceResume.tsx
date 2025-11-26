// src/pages/EnhanceResume.tsx

import React, { useState, useRef } from "react";
import {
  Upload,
  Wand2,
  Download,
  Save,
  CheckCircle2,
  Sparkles,
  FileText,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";

// For dev you can set VITE_API_BASE_URL=http://127.0.0.1:8000
// In production, leave it empty so it hits the same origin.
const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL || "";

export default function EnhanceResume() {
  const [resumeText, setResumeText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [enhancedVersions, setEnhancedVersions] = useState<string[]>([]);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [savedResumes, setSavedResumes] = useState<
    { id: string; name: string; content: string }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentEnhanced =
    enhancedVersions[selectedVersionIndex] || "";

  const hasInput = resumeText.trim().length > 0 || !!selectedFile;

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Optional: try to show text preview (works nicely for .txt/.docx)
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result?.toString() || "";
      setResumeText(text);
    };
    reader.readAsText(file);
  };

  const buildFormData = (): FormData => {
    const formData = new FormData();

    if (selectedFile) {
      // If user uploaded a file, send it directly
      formData.append("file", selectedFile);
    } else {
      // Otherwise, convert pasted text into a temporary file
      const trimmed = resumeText.trim();
      if (!trimmed) {
        throw new Error("Please paste your resume or upload a file first.");
      }
      const blob = new Blob([trimmed], { type: "text/plain" });
      const fakeFile = new File([blob], "pasted-resume.txt", {
        type: "text/plain",
      });
      formData.append("file", fakeFile);
    }

    return formData;
  };

  const handleEnhance = async () => {
    if (!hasInput) {
      alert("Please paste your resume or upload a file first");
      return;
    }

    setIsEnhancing(true);
    setErrorMessage(null);
    setEnhancedVersions([]);
    setSelectedVersionIndex(0);

    try {
      const formData = buildFormData();

      const response = await fetch(`${API_BASE}/resume/improve`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.detail ||
            "Failed to enhance resume. Please try again."
        );
      }

      const data = await response.json();
      const versions: string[] = Array.isArray(data.versions)
        ? data.versions
        : [];

      if (!versions.length) {
        throw new Error(
          "API did not return any enhanced versions. Please try again."
        );
      }

      setEnhancedVersions(versions);
      setSelectedVersionIndex(0);
    } catch (err: any) {
      console.error("Enhance error:", err);
      setErrorMessage(err?.message || "Failed to enhance resume.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSaveResume = () => {
    if (!currentEnhanced) {
      alert("Please enhance your resume first");
      return;
    }

    const newResume = {
      id: Date.now().toString(),
      name: `Resume ${new Date().toLocaleDateString()} (v${
        selectedVersionIndex + 1
      })`,
      content: currentEnhanced,
    };

    setSavedResumes((prev) => [...prev, newResume]);
    alert("Resume saved successfully!");
  };

  const handleDownload = (content: string) => {
    if (!content) return;
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `enhanced-resume-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 mb-8 border border-blue-200">
                <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Powered by Advanced AI
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight mt-6 mb-6">
                Enhance Your Resume
                <span className="block text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mt-3">
                  Instantly
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
                Transform your resume in minutes. Our AI strengthens language,
                optimizes keywords, highlights achievements, and ensures ATS
                compatibility for maximum impact.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 rounded-lg bg-white border border-blue-200 hover:shadow-md transition-shadow">
                  <p className="text-2xl font-bold text-blue-600">
                    40 Seconds
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Time to enhance
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-purple-200 hover:shadow-md transition-shadow">
                  <p className="text-2xl font-bold text-purple-600">
                    +40%
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Keyword boost</p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-blue-200 hover:shadow-md transition-shadow">
                  <p className="text-2xl font-bold text-blue-600">
                    100%
                  </p>
                  <p className="text-xs text-gray-600 mt-1">ATS ready</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="mx-auto max-w-6xl">
            {/* Before & After */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
              {/* INPUT CARD */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Your Original Resume
                    </h3>
                    <p className="text-sm text-gray-600">
                      Paste your content or upload a file
                    </p>
                  </div>
                </div>

                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume content here... (text format recommended)"
                  className="w-full px-4 py-3 mb-6 border-2 border-blue-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-64"
                />

                <div className="p-4 rounded-lg bg-blue-100 border border-blue-200 mb-6">
                  <p className="text-sm text-blue-900">
                    💡 Tip: Include job titles, achievements, and skills for
                    best results.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleEnhance}
                    disabled={isEnhancing || !hasInput}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Wand2 className="h-5 w-5 mr-2" />
                    {isEnhancing ? "Enhancing..." : "Enhance Resume"}
                  </button>

                  <button
                    type="button"
                    onClick={handleClickUpload}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-xl border-2 border-gray-300 text-gray-900 hover:border-blue-400 hover:bg-blue-50 transition-all"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Upload File
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {errorMessage && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                    {errorMessage}
                  </div>
                )}
              </div>

              {/* OUTPUT CARD */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Enhanced Resume
                    </h3>
                    <p className="text-sm text-gray-600">
                      AI-powered improvements (multiple versions)
                    </p>
                  </div>
                </div>

                {enhancedVersions.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {enhancedVersions.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVersionIndex(idx)}
                        className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                          selectedVersionIndex === idx
                            ? "border-purple-600 bg-purple-50 text-purple-700"
                            : "border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        Version {idx + 1}
                      </button>
                    ))}
                  </div>
                )}

                <textarea
                  value={currentEnhanced}
                  readOnly
                  placeholder="Your enhanced resume will appear here with improvements highlighted..."
                  className="w-full px-4 py-3 mb-6 border-2 border-purple-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-64"
                />

                {enhancedVersions.length > 0 && (
                  <div className="p-4 rounded-lg bg-green-100 border border-green-200 mb-6">
                    <p className="text-sm text-green-900">
                      ✓ Resume enhanced and ready to use. You can switch
                      between different versions above.
                    </p>
                  </div>
                )}

                {enhancedVersions.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleSaveResume}
                      className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transition-all"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      Save Resume
                    </button>
                    <button
                      onClick={() => handleDownload(currentEnhanced)}
                      className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-xl border-2 border-gray-300 text-gray-900 hover:border-blue-400 hover:bg-blue-50 transition-all"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* WHAT GETS ENHANCED */}
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                What Gets Enhanced
              </h2>
              <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                Our AI analyzes and improves every aspect of your resume.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Zap,
                    title: "Action Verbs",
                    description: "Stronger, more impactful language.",
                    color: "from-blue-600 to-blue-700",
                  },
                  {
                    icon: Target,
                    title: "Keywords",
                    description: "Industry-specific optimization.",
                    color: "from-purple-600 to-purple-700",
                  },
                  {
                    icon: TrendingUp,
                    title: "Achievements",
                    description: "Highlighted with metrics.",
                    color: "from-pink-600 to-pink-700",
                  },
                  {
                    icon: CheckCircle2,
                    title: "ATS Ready",
                    description: "Optimized for screening systems.",
                    color: "from-green-600 to-green-700",
                  },
                ].map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={idx}
                      className="p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SAVED RESUMES */}
            {savedResumes.length > 0 && (
              <div className="border-t border-gray-200 pt-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-12">
                  📁 Saved Resumes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedResumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="p-6 rounded-xl border-2 border-green-200 bg-green-50 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {resume.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {resume.content.length} characters
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownload(resume.content)}
                          className="p-2 hover:bg-green-200 rounded-lg transition-colors"
                        >
                          <Download className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
