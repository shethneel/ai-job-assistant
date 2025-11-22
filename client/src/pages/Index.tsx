import { Link } from "react-router-dom";
import {
  FileText,
  MessageSquare,
  Target,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 mb-6 border border-blue-200">
                <span className="text-sm font-semibold text-blue-600">
                  ✨ AI-Powered Career Tools
                </span>
              </div>

              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                Land Your Dream Job with AI
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Elevate your job application with AI-powered tools. Enhance your
                resume, generate tailored cover letters, and analyze job fit to
                increase your chances of success.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/enhance-resume"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                >
                  Start Enhancing <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <button className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg border-2 border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-all">
                  Learn More
                </button>
              </div>
            </div>

            {/* Features Preview */}
            <div className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50 transition-all">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Resume Enhancement
                </h3>
                <p className="text-gray-600 text-sm">
                  Let AI improve your resume with stronger language, better
                  formatting, and highlighted achievements.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50 transition-all">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Cover Letter Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Generate personalized cover letters tailored to specific job
                  descriptions and company cultures.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50 transition-all">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Job Fit Analysis
                </h3>
                <p className="text-gray-600 text-sm">
                  Get detailed insights on how well you match a job, with
                  suggestions to improve your candidacy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-50 border-t border-gray-200">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Everything You Need to Succeed
            </h2>

            <div className="space-y-12">
              {[
                {
                  title: "Enhance Your Resume",
                  description:
                    "AI analyzes your resume and suggests improvements to make it stand out. Get better keywords, clearer descriptions, and impactful metrics.",
                  icon: FileText,
                  href: "/enhance-resume",
                },
                {
                  title: "Generate Cover Letters",
                  description:
                    "Create compelling, personalized cover letters in seconds. Our AI tailors each letter to the job description and company.",
                  icon: MessageSquare,
                  href: "/cover-letter",
                },
                {
                  title: "Analyze Job Fit",
                  description:
                    "Understand how well you match a role before applying. Get a detailed breakdown of your strengths and areas for growth.",
                  icon: Target,
                  href: "/job-fit",
                },
                {
                  title: "Save & Manage",
                  description:
                    "Keep all your resumes and documents organized in one place. Easily access, edit, and share your application materials.",
                  icon: CheckCircle2,
                  href: "/enhance-resume",
                },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Link
                    key={index}
                    to={feature.href}
                    className="flex flex-col sm:flex-row gap-6 items-start sm:items-center p-6 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-2 sm:mt-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Start using AI to enhance your resume and land interviews faster.
              It only takes a few minutes to get started.
            </p>
            <Link
              to="/enhance-resume"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
            >
              Start Free <Zap className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

    </div>
  );
}
