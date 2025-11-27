// client/src/pages/MyResumes.tsx
import { useEffect, useState } from "react";
import {
  FileText,
  Download,
  Pencil,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface ResumeApi {
  id: number;
  original_filename: string;
  content_type: string | null;
  extracted_text: string;
  created_at: string;
  updated_at: string;
}

export default function MyResumes() {
  const [resume, setResume] = useState<ResumeApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("jobAgentToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken");

    if (!token) {
      setError("Please log in to view and manage your saved resume.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/user/resume`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 404) {
          setResume(null);
          setStatus(
            "You don't have a saved resume yet. Save one from Job Fit or Enhance Resume."
          );
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load saved resume.");
        }

        const data: ResumeApi = await res.json();
        setResume(data);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Failed to load saved resume.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDownload = () => {
    if (!resume) return;
    const content = resume.extracted_text || "";
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume.original_filename || "resume"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus("Downloaded your saved resume as a .txt file.");
  };

  const startRename = () => {
    if (!resume) return;
    setNewName(resume.original_filename || "");
    setRenaming(true);
    setStatus(null);
    setError(null);
  };

  const cancelRename = () => {
    setRenaming(false);
    setNewName("");
  };

  const submitRename = async () => {
    if (!resume) return;
    const trimmed = newName.trim();
    if (!trimmed) {
      setError("Resume name cannot be empty.");
      return;
    }

    const token =
      localStorage.getItem("jobAgentToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken");

    if (!token) {
      setError("Please log in again to rename your resume.");
      return;
    }

    try {
      setError(null);
      setStatus("Renaming resume…");

      const res = await fetch(`${API_BASE_URL}/user/resume/rename`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ new_filename: trimmed }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to rename resume.");
      }

      const data: ResumeApi = await res.json();
      setResume(data);
      setStatus("Resume name updated.");
      setRenaming(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to rename resume.");
    }
  };

  const formattedDate = resume
    ? new Date(resume.created_at).toLocaleDateString()
    : "";

  const handleCreateNew = () => {
    navigate("/enhance-resume");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* App.tsx already provides Header + Footer, so just content here */}
      <main className="flex-1">
        {/* Header Section */}
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
              Manage your saved resume that powers Job Fit and Cover Letters.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Your Saved Resume
                </h2>
                <p className="text-gray-600 text-sm">
                  This resume is reused in Job Fit and Cover Letter when you
                  choose the saved option.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCreateNew}
                className="mt-4 sm:mt-0 inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Create / Update Resume
              </button>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-16 text-gray-600 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading your saved resume…</span>
              </div>
            )}

            {!loading && error && (
              <div className="p-4 rounded-lg border border-red-200 bg-red-50 flex gap-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {!loading && status && !error && (
              <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 flex gap-2 text-sm text-blue-800">
                <Sparkles className="w-4 h-4 mt-0.5" />
                <p>{status}</p>
              </div>
            )}

            {!loading && !error && (
              <>
                {resume ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4 flex-1 mb-4 sm:mb-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {!renaming ? (
                          <>
                            <h3 className="font-semibold text-gray-900 mb-1 break-words">
                              {resume.original_filename || "Saved Resume"}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Saved on {formattedDate}
                            </p>
                          </>
                        ) : (
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-600">
                              Rename resume
                            </label>
                            <input
                              type="text"
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Resume name"
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={submitRename}
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={cancelRename}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {!renaming && (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={startRename}
                          className="flex-1 sm:flex-none px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center gap-1 text-sm"
                        >
                          <Pencil className="h-4 w-4" />
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={handleDownload}
                          className="flex-1 sm:flex-none px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center gap-1 text-sm"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-12 rounded-lg border border-gray-200 bg-gray-50 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No saved resume yet
                    </h3>
                    <p className="text-gray-600 mb-4 max-w-md mx-auto">
                      Once you upload a resume on the Job Fit page or Enhance
                      Resume, it will appear here so you can manage and reuse
                      it.
                    </p>
                    <button
                      type="button"
                      onClick={handleCreateNew}
                      className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Upload Your First Resume
                    </button>
                  </div>
                )}

                {/* Tip Section */}
                <div className="mt-6 p-6 rounded-lg border border-blue-200 bg-blue-50">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">
                        Pro Tip
                      </h3>
                      <p className="text-blue-800 text-sm">
                        Your saved resume powers the{" "}
                        <strong>Saved Resume</strong> options in Job Fit and
                        Cover Letter. Keep its name clear so you always know
                        which version you’re using.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
