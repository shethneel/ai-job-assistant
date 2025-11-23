// src/pages/CoverLetter.tsx
import { useState } from "react";
import { apiFetch } from "../shared/api";

interface CoverLetterResponse {
  cover_letter: string;
}

export default function CoverLetter() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCoverLetter(null);

    if (!resumeText.trim() || !jobDescription.trim()) {
      setError("Please fill in both resume and job description.");
      return;
    }

    setIsLoading(true);
    try {
      const data = (await apiFetch("/cover-letter/generate", {
        method: "POST",
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription,
        }),
      })) as CoverLetterResponse;

      setCoverLetter(data.cover_letter);
    } catch (err: any) {
      const msg = err?.message || "Failed to generate cover letter.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-3xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Generate a tailored cover letter
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Paste your resume and the job description, and we’ll write a cover
          letter that matches the role’s language and requirements.
        </p>
      </div>

      <form
        onSubmit={handleGenerate}
        className="grid md:grid-cols-[1.2fr,1.3fr] gap-8 items-start"
      >
        {/* Inputs */}
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">
              Resume text
            </label>
            <textarea
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm min-h-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Paste your resume summary or full resume here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">
              Job description
            </label>
            <textarea
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm min-h-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

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
            {isLoading ? "Generating..." : "Generate cover letter"}
          </button>
        </div>

        {/* Output */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">
            AI-generated cover letter
          </h2>

          {isLoading && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500">
              Drafting a cover letter that mirrors the company’s language and
              highlights your best stories...
            </div>
          )}

          {!isLoading && !coverLetter && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500">
              Your cover letter will appear here once generated.
            </div>
          )}

          {coverLetter && (
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {coverLetter}
              </pre>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
