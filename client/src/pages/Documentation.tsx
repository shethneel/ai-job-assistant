import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Zap,
  FileText,
  MessageSquare,
  Target,
  Shield,
  Mail,
  Search,
} from "lucide-react";

interface DocSection {
  id: string;
  title: string;
  icon: any;
  content: string | { title?: string; items: string[] }[];
}

export default function Documentation() {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "getting-started"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const sections: DocSection[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Zap,
      content: [
        {
          title: "What is CareerBoost?",
          items: [
            "CareerBoost is an AI-driven platform designed to help you improve your resume, tailor your resume for any job, generate personalized cover letters, analyze your job match, save and reuse your resume, and prepare for roles more effectively.",
            "All features are powered by CareerBoost's Intelligent Career Engine, built to understand job descriptions, professional skills, and career patterns.",
          ],
        },
        {
          title: "Creating Your Account",
          items: [
            "Click Sign Up from the homepage",
            "Enter your email and password",
            "Verify your email",
            "Log in to access your personal dashboard",
          ],
        },
      ],
    },
    {
      id: "resume-enhancer",
      title: "Resume Enhancer",
      icon: FileText,
      content: [
        {
          title: "How It Works",
          items: [
            "Navigate to Enhance Resume from the dashboard",
            "Paste or upload your resume content",
            "CareerBoost analyzes and generates improved versions",
            "Review suggestions and copy or download the enhanced version",
          ],
        },
      ],
    },
    {
      id: "cover-letter",
      title: "Cover Letter Generator",
      icon: MessageSquare,
      content: [
        {
          title: "Getting Started",
          items: [
            "Navigate to Cover Letter Generator",
            "Choose how to provide your resume: Paste, Upload, or Select Saved",
            "Paste the job description",
            "Click Generate to create your personalized cover letter",
          ],
        },
      ],
    },
    {
      id: "job-fit",
      title: "Job Fit Analyzer",
      icon: Target,
      content: [
        {
          title: "What It Does",
          items: [
            "Compares your resume with any job description",
            "Provides job fit score and match percentage",
            "Shows your strengths and areas for improvement",
            "Offers personalized suggestions to enhance your candidacy",
          ],
        },
      ],
    },
    {
      id: "privacy-security",
      title: "Privacy & Security",
      icon: Shield,
      content: [
        {
          title: "Your Data Protection",
          items: [
            "CareerBoost does not sell your data",
            "Your resume and personal information are encrypted",
            "Data is used only to improve your results",
            "You can request data deletion anytime",
          ],
        },
      ],
    },
  ];

  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">

      <main className="flex-1">
        {/* Header */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-200">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
                Documentation
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Complete guides to help you get the most from CareerBoost.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="mx-auto max-w-4xl">
            {/* Search Bar */}
            <div className="mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {filteredSections.map((section) => {
                const Icon = section.icon;
                const isExpanded = expandedSection === section.id;

                return (
                  <div
                    key={section.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all"
                  >
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-6 bg-white hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {section.title}
                        </h3>
                      </div>
                      <ChevronDown
                        className={`h-6 w-6 text-gray-400 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="border-t border-gray-200 bg-gray-50 p-6">
                        {Array.isArray(section.content) ? (
                          <div className="space-y-8">
                            {section.content.map((subsection, idx) => (
                              <div key={idx}>
                                {subsection.title && (
                                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                                    {subsection.title}
                                  </h4>
                                )}
                                <ul className="space-y-3">
                                  {subsection.items.map((item, itemIdx) => (
                                    <li key={itemIdx} className="flex gap-3">
                                      <span className="text-blue-600 font-bold flex-shrink-0 mt-1">
                                        •
                                      </span>
                                      <span className="text-gray-700">
                                        {item}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-700">{section.content}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredSections.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  No documentation found for "{searchQuery}"
                </p>
              </div>
            )}

            {/* Help Section */}
            <div className="mt-16 p-8 rounded-xl border border-blue-200 bg-blue-50">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-blue-900 mb-2">
                    Need More Help?
                  </h3>
                  <p className="text-blue-800 mb-4">
                    Can't find what you're looking for? Our support team is here
                    to help.
                  </p>
                  <a
                    href="mailto:support@careerboost.ai"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Contact Support →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
