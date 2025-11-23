import { useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

type EnhancedResult = {
  versions: string[];
};

export default function EnhanceResume() {
  const [mode, setMode] = useState<"upload" | "paste">("paste");
  const [resumeText, setResumeText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceStatus, setEnhanceStatus] = useState<string | null>(null);
  const [versions, setVersions] = useState<string[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setSaveStatus(null);
    setEnhanceStatus(null);
  }

  async function handleEnhance() {
    setEnhanceStatus(null);
    setVersions([]);

    try {
      setIsEnhancing(true);

      // Decide payload: prefer file if present, otherwise text
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${API_BASE_URL}/resume/improve`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const raw = await res.text();
          console.error("Enhance/file error:", raw);
          throw new Error(
            "We couldn’t enhance that file. Please check the format and try again."
          );
        }

        const data: EnhancedResult = await res.json();
        setVersions(data.versions || []);
        setEnhanceStatus(
          "Done! Review each version on the right and tweak as needed."
        );
        return;
      }

      const text = resumeText.trim();
      if (!text) {
        setEnhanceStatus(
          "Add your resume first – paste the text or upload a file."
        );
        return;
      }

      const res = await fetch(`${API_BASE_URL}/resume/improve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_text: text }),
      });

      if (!res.ok) {
        const raw = await res.text();
        console.error("Enhance/text error:", raw);
        throw new Error(
          "We couldn’t enhance your resume right now. Please try again."
        );
      }

      const data: EnhancedResult = await res.json();
      setVersions(data.versions || []);
      setEnhanceStatus(
        "Done! Your improved versions are on the right – pick the one you like best."
      );
    } catch (err: any) {
      setEnhanceStatus(
        err?.message ||
          "Something went wrong while enhancing your resume. Please try again."
      );
    } finally {
      setIsEnhancing(false);
    }
  }

  async function handleSaveToProfile() {
    setSaveStatus(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setSaveStatus("Please log in first to save a resume to your profile.");
      return;
    }

    // Prefer uploaded file; otherwise use pasted text as a .txt file
    let formData = new FormData();

    if (file) {
      formData.append("file", file);
    } else if (resumeText.trim()) {
      const blob = new Blob([resumeText.trim()], { type: "text/plain" });
      formData.append("file", blob, "resume.txt");
    } else {
      setSaveStatus(
        "Add your resume first – either upload a file or paste the text."
      );
      return;
    }

    try {
      setIsSaving(true);
      setSaveStatus("Saving this resume to your profile…");

      const res = await fetch(`${API_BASE_URL}/user/resume/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.status === 401) {
        setSaveStatus("Your session expired. Please log in again.");
        return;
      }

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Save resume error:", data);
        setSaveStatus(
          (data && data.detail) ||
            "We couldn’t save this resume. Please try again."
        );
        return;
      }

      setSaveStatus(
        "Saved! We’ll use this as your default resume for Job Fit and tailored resumes."
      );
    } catch (err) {
      console.error(err);
      setSaveStatus(
        "Something went wrong while saving your resume. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function downloadVersion(text: string, index: number) {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume-version-${index + 1}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function copyVersion(text: string, index: number) {
    try {
      await navigator.clipboard.writeText(text);
      setEnhanceStatus(`Copied Version ${index + 1} to your clipboard.`);
    } catch {
      setEnhanceStatus(
        "Couldn’t copy automatically – you can still select and copy manually."
      );
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <section>
          <h1 className="text-3xl font-bold text-slate-900">
            Enhance Your Resume
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Paste your resume below or upload it. We&apos;ll generate improved
            versions with stronger language, clearer structure, and polished
            formatting.
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {/* LEFT – INPUT SIDE */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              {/* mode toggle */}
              <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-medium text-slate-600">
                <button
                  type="button"
                  onClick={() => setMode("paste")}
                  className={`rounded-full px-3 py-1 ${
                    mode === "paste"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Paste text
                </button>
                <button
                  type="button"
                  onClick={() => setMode("upload")}
                  className={`rounded-full px-3 py-1 ${
                    mode === "upload"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Upload file
                </button>
              </div>

              <h2 className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Your Resume
              </h2>

              {mode === "paste" && (
                <textarea
                  rows={10}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume content here… (text format recommended)"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-inner outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              )}

              {mode === "upload" && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
                  <p className="text-xs font-semibold text-slate-700">
                    Upload a resume file
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Supported formats: PDF, DOC, DOCX, or TXT. Max ~5MB
                    recommended.
                  </p>
                  <div className="mt-4">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileChange}
                      className="text-xs"
                    />
                    {file && (
                      <p className="mt-2 text-xs text-slate-700">
                        Selected: <span className="font-medium">{file.name}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* action buttons */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleEnhance}
                  disabled={isEnhancing}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="text-base">✨</span>
                  <span>{isEnhancing ? "Enhancing…" : "Enhance Resume"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveToProfile}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="text-base">📁</span>
                  <span>
                    {isSaving ? "Saving…" : "Save as profile resume"}
                  </span>
                </button>
              </div>

              <p className="mt-3 text-[11px] text-slate-500">
                We&apos;ll use your saved profile resume for Job Fit analysis
                and tailored resume generation.
              </p>

              {enhanceStatus && (
                <p className="mt-3 text-xs text-slate-600">{enhanceStatus}</p>
              )}
              {saveStatus && (
                <p className="mt-1 text-xs text-slate-600">{saveStatus}</p>
              )}
            </div>

            {/* RIGHT – ENHANCED VERSIONS */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Enhanced Resume
              </h2>

              {versions.length === 0 && (
                <p className="text-xs text-slate-500">
                  Run your resume first – we&apos;ll show multiple improved
                  versions here so you can compare and choose.
                </p>
              )}

              {versions.length > 0 && (
                <div className="space-y-4">
                  {versions.map((v, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800">
                          Version {idx + 1}
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => copyVersion(v, idx)}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-medium text-slate-800 hover:bg-slate-50"
                          >
                            Copy
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadVersion(v, idx)}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-medium text-slate-800 hover:bg-slate-50"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={8}
                        readOnly
                        value={v}
                        className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-inner outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
