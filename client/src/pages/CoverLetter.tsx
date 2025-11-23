import { useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function CoverLetter() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleGenerate() {
    const resume_text = resumeText.trim();
    const job_description = jobDescription.trim();

    if (!resume_text || !job_description) {
      setStatus("Please add both your resume and the job description.");
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
      setCoverLetter(
        data.cover_letter ||
          "We generated a response, but it came back empty. Please try again."
      );
      setStatus("Done! You can review, copy, or download your cover letter.");
    } catch (err: any) {
      setCoverLetter("");
      setStatus(
        err?.message ||
          "Something went wrong while generating your cover letter."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleCopy() {
    if (!coverLetter.trim()) return;
    navigator.clipboard
      .writeText(coverLetter)
      .then(() =>
        setStatus("Cover letter copied. Make any final edits before using it.")
      )
      .catch(() =>
        setStatus("Couldn’t copy automatically. You can copy it manually.")
      );
  }

  function handleDownload() {
    if (!coverLetter.trim()) return;

    const blob = new Blob([coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cover-letter.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus("Downloaded your cover letter as a .txt file.");
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <section>
          <h1 className="text-3xl font-bold text-slate-900">
            Cover Letter Generator
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Paste your resume and the job description. We&apos;ll craft a
            concise, tailored cover letter you can tweak before sending.
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {/* Left card – inputs */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Your Resume
              </h2>
              <textarea
                rows={7}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here..."
                className="mb-4 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-inner outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Job Description
              </h2>
              <textarea
                rows={7}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-inner outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="text-base">✉️</span>
                  <span>
                    {isLoading ? "Generating…" : "Generate Cover Letter"}
                  </span>
                </button>
              </div>

              {status && (
                <p className="mt-3 text-xs text-slate-600">{status}</p>
              )}
            </div>

            {/* Right card – output */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Generated Cover Letter
              </h2>
              <textarea
                rows={14}
                readOnly
                value={
                  coverLetter ||
                  "Your tailored cover letter will appear here once it’s generated."
                }
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-inner outline-none"
              />

              {coverLetter && (
                <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50"
                  >
                    Download
                  </button>
                </div>
              )}

              {!coverLetter && (
                <p className="mt-3 text-xs text-slate-500">
                  We&apos;ll keep your layout simple and easy to customize in
                  your preferred editor.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
