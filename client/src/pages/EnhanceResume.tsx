import { useState } from "react";
import { Upload, Wand2, Download, Save, CheckCircle2 } from "lucide-react";

export default function EnhanceResume() {
  const [resumeText, setResumeText] = useState("");
  const [enhancedResume, setEnhancedResume] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [savedResumes, setSavedResumes] = useState<
    { id: string; name: string; content: string }[]
  >([]);

  const handleEnhance = async () => {
    if (!resumeText.trim()) {
      alert("Please enter your resume content");
      return;
    }

    setIsEnhancing(true);

    // Simulate AI enhancement
    setTimeout(() => {
      const enhanced = `✨ ENHANCED RESUME ✨

${resumeText}

[AI Enhancement Summary]
- Added industry-specific keywords
- Improved bullet point clarity
- Enhanced action verbs
- Quantified achievements where possible
- Optimized formatting for ATS systems`;

      setEnhancedResume(enhanced);
      setIsEnhancing(false);
    }, 2000);
  };

  const handleSaveResume = () => {
    if (!enhancedResume) {
      alert("Please enhance your resume first");
      return;
    }

    const newResume = {
      id: Date.now().toString(),
      name: `Resume ${new Date().toLocaleDateString()}`,
      content: enhancedResume,
    };

    setSavedResumes([...savedResumes, newResume]);
    alert("Resume saved successfully!");
  };

  const handleDownload = (content: string) => {
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

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Enhance Your Resume
            </h1>
            <p className="text-lg text-gray-600">
              Paste your resume below and let our AI enhance it with better
              language, stronger action verbs, and optimized formatting.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Input Section */}
            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Your Resume
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here... (text format recommended)"
                className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={20}
              />

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleEnhance}
                  disabled={isEnhancing || !resumeText.trim()}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Wand2 className="h-5 w-5 mr-2" />
                  {isEnhancing ? "Enhancing..." : "Enhance Resume"}
                </button>
                <button className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg border-2 border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-all">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload File
                </button>
              </div>
            </div>

            {/* Output Section */}
            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Enhanced Resume
              </label>
              <textarea
                value={enhancedResume}
                readOnly
                placeholder="Your enhanced resume will appear here..."
                className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none"
                rows={20}
              />

              {enhancedResume && (
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSaveResume}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Save Resume
                  </button>
                  <button
                    onClick={() => handleDownload(enhancedResume)}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg border-2 border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-all"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Saved Resumes */}
          {savedResumes.length > 0 && (
            <div className="border-t border-gray-200 pt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Saved Resumes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedResumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
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
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
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
      </main>

    </div>
  );
}
