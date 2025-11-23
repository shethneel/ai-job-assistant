// src/pages/EnhanceResume.tsx
import { useState } from "react";
import { apiFetch } from "../shared/api";

interface ImproveResumeResponse {
  versions: string[];
}

export default function EnhanceResume() {
  const [mode, setMode] = useState<"upload" | "paste">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [versions, setVersions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setVersions([]);

    try {
      let data: ImproveResumeResponse;

      if (mode === "upload") {
        if (!file) {
          setError("Please upload a resume file first.");
          setIsLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", file);

        data = await apiFetch("/resume/improve", {
          method: "POST",
          body: formData,
        });
      } else {
        if (!resumeText.trim()) {
          setError("Please paste your resume text first.");
          setIsLoading(false);
          return;
        }

        data = await apiFetch("/resume/improve", {
          method: "POST",
          body: JSON.stringify({
            resume_text: resumeText,
          }),
        });
      }

      setVersions(data.versions || []);
    } catch (err: any) {
      const msg = err?.message || "Failed to enhance resume.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-3xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Enhance your resume with AI
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Upload your existing resume or paste it in. We’ll generate multiple
          improved versions you can compare and tweak.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1 mb-6 text-sm">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            mode === "upload"
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Upload file
        </button>
        <button
          type="button"
          onClick={() => setMode("paste")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            mode === "paste"
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Paste text
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-[1.1fr,1.4fr] gap-8 items-start"
      >
        {/* Input column */}
        <div className="space-y-5">
          {mode === "upload" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800">
                Resume file
              </label>
              <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-700"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Supported: PDF, DOC, DOCX, or TXT. Max ~5MB recommended.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800">
                Paste your resume
              </label>
              <textarea
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm min-h-[260px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Paste your current resume here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                Don’t include any passwords or super sensitive info – treat this
                like you’re sending your resume to a recruiter.
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Enhancing..." : "Generate improved versions"}
          </button>
        </div>

        {/* Output column */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">
            AI-enhanced versions
          </h2>

          {isLoading && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500">
              Thinking about stronger bullets, clearer impact, and better
              keywords...
            </div>
          )}

          {!isLoading && versions.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500">
              Run your resume first – your improved versions will appear here.
            </div>
          )}

          {versions.length > 0 && (
            <div className="grid gap-4 md:grid-cols-1">
              {versions.map((v, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Version {i + 1}
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap text-sm text-gray-800">
                    {v}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
