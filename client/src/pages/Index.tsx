import { Link } from "react-router-dom";
import {
  FileText,
  MessageSquare,
  Target,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 mb-6 border border-blue-200">
                <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Powered by Advanced AI
                </span>
              </div>

              <h1 className="mt-4 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
                Land Your Dream Job
                <span className="block text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mt-2">
                  with AI
                </span>
              </h1>

              <p className="mt-8 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Stop applying blindly. CareerBoost uses AI to enhance your
                resume, generate personalized cover letters, and analyze job fit
                — all in minutes, not hours.
              </p>

              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/enhance-resume"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl transition-all shadow-lg"
                >
                  Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg border-2 border-gray-300 text-gray-900 hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  Learn Our Story
                </Link>
              </div>

              {/* Social Proof Stats */}
              <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600 mb-2">1000+</p>
                  <p className="text-sm text-gray-600">Students Helped</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600 mb-2">94%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600 mb-2">2 min</p>
                  <p className="text-sm text-gray-600">Resume Enhanced</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white border-b border-gray-200">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
              How CareerBoost Works
            </h2>
            <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto">
              Three powerful tools to transform your job search in minutes
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Upload Your Resume",
                  description:
                    "Paste or upload your resume. Our AI instantly analyzes and understands your experience, skills, and background.",
                  icon: FileText,
                  color: "blue",
                },
                {
                  step: "02",
                  title: "AI Enhancement",
                  description:
                    "Get instant suggestions to strengthen your resume, optimize keywords, and highlight your best achievements.",
                  icon: Sparkles,
                  color: "purple",
                },
                {
                  step: "03",
                  title: "Land Interviews",
                  description:
                    "Apply with confidence using tailored resumes, custom cover letters, and job fit analysis.",
                  icon: TrendingUp,
                  color: "blue",
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="relative">
                    {idx < 2 && (
                      <div className="hidden md:block absolute top-1/3 left-full w-full h-1 bg-gradient-to-r from-blue-300 to-purple-300 -mx-8" />
                    )}
                    <div className="relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                      <p className="text-sm font-bold text-gray-400 mb-4">
                        {item.step}
                      </p>
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                          item.color === "blue"
                            ? "from-blue-600 to-blue-700"
                            : "from-purple-600 to-purple-700"
                        } flex items-center justify-center mb-4`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
              Powerful Features, Simple Design
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                {
                  title: "Resume Enhancement",
                  features: [
                    "AI-powered content improvement",
                    "Keyword optimization for ATS",
                    "Better formatting & structure",
                    "Achievement highlighting",
                  ],
                  icon: FileText,
                },
                {
                  title: "Smart Matching",
                  features: [
                    "Analyze job description fit",
                    "Identify skill gaps",
                    "Get improvement suggestions",
                    "Tailored resume generation",
                  ],
                  icon: Target,
                },
                {
                  title: "Cover Letter Generation",
                  features: [
                    "Personalized for each job",
                    "Company culture alignment",
                    "Professional tone & style",
                    "Download or copy instantly",
                  ],
                  icon: MessageSquare,
                },
                {
                  title: "Save & Organize",
                  features: [
                    "Multiple resume versions",
                    "Easy version management",
                    "Reuse across applications",
                    "Organized dashboard",
                  ],
                  icon: CheckCircle2,
                },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    className="p-8 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {feature.title}
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {feature.features.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white border-t border-gray-200">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
              Why Students Choose CareerBoost
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Clock,
                  title: "Save Hours",
                  description:
                    "What takes hours manually takes minutes with AI. Focus on applying, not formatting.",
                },
                {
                  icon: Users,
                  title: "Built by Students",
                  description:
                    "Created by someone who experienced the job search struggle. We get it.",
                },
                {
                  icon: Zap,
                  title: "Real Results",
                  description:
                    "Students using CareerBoost get 3x more interviews. Proven by our community.",
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="text-center">
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <Icon className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-blue-600 to-purple-600">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-lg text-blue-100 mb-10">
              Join thousands of students who've transformed their job search
              with CareerBoost.
            </p>
            <Link
              to="/enhance-resume"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-white text-blue-600 hover:bg-gray-100 transition-all shadow-lg"
            >
              Start Your Free Trial <Zap className="ml-2 h-5 w-5" />
            </Link>
            <p className="text-sm text-blue-100 mt-6">
              No credit card required. 1-week free access to all features.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
