// src/pages/JobFit.tsx
import { useState } from "react";
import { apiFetch } from "../shared/api";

interface JobMatchResponse {
  match_score: number;
  strong_points: string[];
  missing_skills: string[];
  red_flags: string[];
  recommendations: string[];
}

export default function JobFit() {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<JobMatchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setNeedsLogin(false);

    if (!jobDescription.trim()) {
      setError("Please paste the job description first.");
      return;
    }

    setIsLoading(true);
    try {
      const data = (await apiFetch("/job-match/analyze-from-saved", {
        method: "POST",
        body: JSON.stringify({ job_description: jobDescription }),
      })) as JobMatchResponse;

      setResult(data);
    } catch (err: any) {
      const msg = err?.message || "";

      if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
        setNeedsLogin(true);
      } else {
        setError(msg || "Failed to analyze job fit.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-3xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Check your fit for a role
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Paste a job description and we’ll analyze how well your saved resume
          matches it, where you shine, and what might be missing.
        </p>
      </div>

      <form
        onSubmit={handleAnalyze}
        className="grid md:grid-cols-[1.2fr,1.3fr] gap-8 items-start"
      >
        {/* Input side */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">
              Job description
            </label>
            <textarea
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm min-h-[260px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {needsLogin && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Please log in and upload a resume first. We use your saved resume
              to calculate the match against this job.
            </p>
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
            {isLoading ? "Analyzing..." : "Analyze job fit"}
          </button>
        </div>

        {/* Results side */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">
            Match insights
          </h2>

          {isLoading && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500">
              Comparing your saved resume against this job posting...
            </div>
          )}

          {!isLoading && !result && !error && !needsLogin && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500">
              Once you analyze a job, we’ll show your match score, strengths,
              gaps, and recommendations here.
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 bg-white px-4 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase text-gray-500">
                    Overall match
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {Math.round(result.match_score)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Higher is better. This is a rough AI estimate, not a
                  guarantee — use it as guidance.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <InsightCard title="Strong points" items={result.strong_points} />
                <InsightCard
                  title="Missing skills"
                  items={result.missing_skills}
                />
                <InsightCard title="Red flags" items={result.red_flags} />
                <InsightCard
                  title="Recommendations"
                  items={result.recommendations}
                />
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

function InsightCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
        {title}
      </h3>
      <ul className="space-y-1.5 text-sm text-gray-800 list-disc list-inside">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
