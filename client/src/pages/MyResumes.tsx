// client/src/pages/MyResumes.tsx
import { useEffect, useState } from "react";
import {
  FileText,
  Download,
  Copy,
  Plus,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

type ResumeDto = {
  id: number;
  filename: string | null;
  extracted_text: string;
  created_at: string;
};

type UiResume = {
  id: number;
  name: string;
  date: string;
  content: string;
};

const TOKEN_KEYS = ["jobAgentToken", "token", "accessToken"];

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  for (const key of TOKEN_KEYS) {
    const value = window.localStorage.getItem(key);
    if (value) return value;
  }
  return null;
}

export default function MyResumes() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<UiResume[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    setIsLoggedIn(true);
    setIsLoading(true);
    setError(null);
    setStatus(null);

    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/user/resume`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 404) {
          // No saved resume yet – not an error, just empty state
          setResumes([]);
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          console.error("Failed to fetch saved resume:", text);
          throw new Error("Could not load your saved resume.");
        }

        const data = (await res.json()) as ResumeDto;

        const uiResume: UiResume = {
          id: data.id,
          name: data.filename || "Saved Resume",
          date: new Date(data.created_at).toLocaleDateString(),
          content: data.extracted_text,
        };

        setResumes([uiResume]);
        setStatus("Loaded your saved resume.");
      } catch (err: any) {
        console.error(err);
        setError(
          err?.message ||
            "Something went wrong while loading your saved resume."
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  function handleDownload(resume: UiResume) {
    const element = document.createElement("a");
    const file = new Blob([resume.content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${resume.name || "resume"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setStatus("Downloaded your saved resume.");
  }

  async function handleCopy(resume: UiResume) {
    try {
      await navigator.clipboard.writeText(resume.content);
      setCopiedId(resume.id);
      setStatus("Copied resume text to clipboard.");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error(err);
      setStatus("Could not copy automatically. You can copy manually.");
    }
  }

  function handleCreateNew() {
    navigate("/enhance-resume");
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header & Footer are already wrapped in App.tsx, so just main here */}
      <main className="flex-1">
        {/* Hero / Header section */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-200">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
                My Resumes
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Manage and organize all your saved resumes in one place.
            </p>

            {status && (
              <p className="mt-3 text-sm text-blue-700 flex items-center gap-2">
                <CheckCircleIcon />
                {status}
              </p>
            )}
            {error && (
              <p className="mt-3 text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>
        </section>

        {/* Main content */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="mx-auto max-w-5xl">
            {/* Top row: title + button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Your Collection ({resumes.length})
                </h2>
                <p className="text-gray-600">
                  This saved resume is used across Job Fit, Tailored Resume, and
                  Cover Letter when you choose “Saved Resume”.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCreateNew}
                className="mt-4 sm:mt-0 inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Resume
              </button>
            </div>

            {!isLoggedIn ? (
              <div className="p-10 rounded-lg border border-amber-200 bg-amber-50 flex gap-3">
                <AlertCircle className="w-6 h-6 text-amber-500 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-amber-900 mb-1">
                    Log in to see your saved resume
                  </h3>
                  <p className="text-amber-800 text-sm mb-3">
                    Your saved resume is tied to your account. Log in from the
                    top-right Account menu, then come back here.
                  </p>
                </div>
              </div>
            ) : isLoading ? (
              <div className="p-12 rounded-lg border border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                <p className="text-gray-600">Loading your saved resume…</p>
              </div>
            ) : resumes.length > 0 ? (
              <div className="space-y-4">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4 flex-1 mb-4 sm:mb-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                          {resume.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Saved on {resume.date}
                        </p>
                        <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                          {resume.content.slice(0, 220)}…
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleCopy(resume)}
                        className="flex-1 sm:flex-none p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Copy text"
                      >
                        <Copy
                          className={`h-5 w-5 ${
                            copiedId === resume.id
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload(resume)}
                        className="flex-1 sm:flex-none p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-lg border border-gray-200 bg-gray-50 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No saved resume yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by enhancing your resume or uploading one in Job Fit.
                  Once saved, it will appear here and be used across the app.
                </p>
                <button
                  type="button"
                  onClick={handleCreateNew}
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create / Enhance Resume
                </button>
              </div>
            )}

            {/* Tip */}
            <div className="mt-12 p-6 rounded-lg border border-blue-200 bg-blue-50">
              <div className="flex items-start gap-3">
                <Sparkles className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Pro Tip
                  </h3>
                  <p className="text-blue-800 text-sm">
                    Whenever you upload a “Saved Resume” in Job Fit or from
                    here, CareerBoost will automatically use it when you choose{" "}
                    <strong>Saved Resume</strong> for Job Fit, Tailored Resume,
                    or Cover Letter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function CheckCircleIcon() {
  return <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />;
}
