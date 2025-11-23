import { useState } from "react";

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

  async function handleAnalyze() {
    const job_description = jobDescription.trim();
    const token = localStorage.getItem("token");

    setResult(null);

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
          "We couldn’t find a saved resume for your account. Upload and save a resume first."
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
      setStatus("Analysis ready – see your job fit insights on the right.");
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

  function renderList(items: string[], emptyText: string) {
    if (!items.length) {
      return <p className="text-xs text-slate-400">{emptyText}</p>;
    }
    return (
      <ul className="list-disc space-y-1 pl-4 text-xs text-slate-700">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <section>
          <h1 className="text-3xl font-bold text-slate-900">
            Job Fit Analysis
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Paste a job description and we&apos;ll compare it against your saved
            resume, highlighting match score, strengths, gaps, and practical
            recommendations.
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {/* Left card – JD input */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Job Description
              </h2>
              <textarea
                rows={14}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-inner outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="text-base">📊</span>
                  <span>{isLoading ? "Analyzing…" : "Analyze Job Fit"}</span>
                </button>
              </div>

              {status && (
                <p className="mt-3 text-xs text-slate-600">{status}</p>
              )}
            </div>

            {/* Right card – results */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Insights
              </h2>

              {!result && (
                <p className="text-xs text-slate-500">
                  Once you run the analysis, we&apos;ll show your match score,
                  strengths, gaps, and recommendations here.
                </p>
              )}

              {result && (
                <div className="space-y-4">
                  {/* Match score card */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      Match score
                    </p>
                    <p className="mt-1 text-2xl font-bold text-blue-700">
                      {result.match_score}%
                    </p>
                    <p className="mt-1 text-xs text-blue-800">
                      This is our estimate of how well your current resume aligns
                      with this role.
                    </p>
                  </div>

                  {/* Two-column insights */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        Strong points
                      </p>
                      <div className="mt-2">
                        {renderList(
                          result.strong_points,
                          "We’ll highlight where you’re already aligned."
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                        Missing skills
                      </p>
                      <div className="mt-2">
                        {renderList(
                          result.missing_skills,
                          "We’ll surface skills and experience you may want to add."
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
                        Red flags
                      </p>
                      <div className="mt-2">
                        {renderList(
                          result.red_flags,
                          "Any potential concerns or mismatches will appear here."
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-800">
                        Recommendations
                      </p>
                      <div className="mt-2">
                        {renderList(
                          result.recommendations,
                          "We’ll suggest practical ways to improve your fit for this role."
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
