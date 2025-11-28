import {
  Heart,
  Lightbulb,
  Target,
  Users,
  CheckCircle2,
  Zap,
  Shield,
  Rocket,
  Linkedin,
  Twitter,
  Github,
} from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Users,
      title: "Empower Students",
      description: "CareerBoost exists to uplift, not overwhelm.",
    },
    {
      icon: Lightbulb,
      title: "Simplicity",
      description: "Tools should be powerful yet effortless.",
    },
    {
      icon: Target,
      title: "Honesty",
      description: "No fake experiences. Only genuine improvements.",
    },
    {
      icon: Rocket,
      title: "Innovation",
      description: "Modern problems need modern solutions.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data is secure, always.",
    },
    {
      icon: Heart,
      title: "Impact",
      description: "We measure success by student outcomes.",
    },
  ];

  const features = [
    "Resume Enhancement",
    "AI-Tailored Resumes",
    "Cover Letter Generator",
    "Job Match Score",
    "Strengths & Gaps Analysis",
    "Save & Reuse System",
  ];

  const futureFeatures = [
    "AI Interview Prep",
    "Skill-Building Recommendations",
    "Application Tracking",
    "Chrome Extension",
    "Smart Job Search Automation",
    "Email Automation",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 mb-6 border border-blue-700">
              <span className="text-sm font-semibold text-white">Our Story</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Built by a Student, For Students
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              CareerBoost is an AI-powered career assistant designed to help
              students and job seekers stand out in today's competitive job
              market. We take the stress out of applications and give you the
              confidence you deserve.
            </p>

            <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg">
              Start Your Free Trial
            </button>
          </div>
        </section>

        {/* Problem Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white border-b border-gray-200">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              The Problem We Solve
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { problem: "Students send hundreds of applications with minimal responses", icon: "📨" },
                { problem: "Every job requires a different resume — but tailoring feels impossible", icon: "📄" },
                { problem: "Confusing job descriptions make it hard to match your skills", icon: "🔍" },
                { problem: "Rejection after rejection, even when you're actually qualified", icon: "💔" },
                { problem: "Working part-time or full-time leaves no time for job search", icon: "⏰" },
                { problem: "Balancing finances, family responsibilities, and career is overwhelming", icon: "⚖️" },
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-lg border border-red-200 bg-red-50">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <p className="text-lg text-gray-900 font-medium">{item.problem}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-gray-700 mt-12 text-lg">
              We realized the job market wasn’t just competitive — it was
              <span className="font-bold text-red-600"> deeply inefficient</span>.
              The gap wasn’t in talent, but in
              <span className="font-bold text-blue-600"> tools</span>.
            </p>
          </div>
        </section>

        {/* Founder Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white border-b border-gray-200">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">
              Meet the Founder
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Local Picture */}
              <div>
                <img
                  src="/Pr_Pic.jpg"
                  alt="Neel Sheth, Founder of CareerBoost"
                  className="w-full h-auto rounded-2xl shadow-lg object-cover"
                />
              </div>

              {/* Founder Content */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-4xl font-bold text-gray-900 mb-2">
                    Neel Sheth
                  </h3>
                  <p className="text-lg font-semibold text-blue-600 mb-1">
                    Founder & CEO
                  </p>
                  <p className="text-gray-600">ASU Graduate, Class of 2022</p>
                </div>

                <p className="text-gray-700 leading-relaxed text-lg">
                  Neel navigated one of the most challenging job markets in
                  recent years. Despite having strong skills in Data Science, he
                  faced the same frustrating cycle as millions of students.
                </p>

                <div className="space-y-3">
                  <p className="text-gray-700 leading-relaxed">
                    He sent hundreds of applications with minimal responses,
                    struggled to tailor his resume for different roles, and
                    constantly questioned whether he was truly qualified.
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    Before launching CareerBoost, Neel started two ventures
                    that taught him resilience and the importance of building
                    products from lived experience.
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
                  <p className="text-gray-900 font-medium mb-2">
                    "Students shouldn’t have to struggle the way I did. They deserve a real fighting chance."
                  </p>
                  <p className="text-gray-700 text-sm">
                    This became his mission — CareerBoost was born to level the
                    playing field.
                  </p>
                </div>

                {/* Socials */}
                <div className="flex gap-4 pt-4">
                  <a href="https://linkedin.com" target="_blank" className="p-3 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white transition">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="https://twitter.com" target="_blank" className="p-3 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white transition">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="https://github.com" target="_blank" className="p-3 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white transition">
                    <Github className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white border-b border-gray-200">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="p-8 rounded-xl border-2 border-blue-400 bg-blue-50">
                <Target className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Our Mission
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To empower job seekers with intelligent, easy-to-use tools
                  that highlight their strengths and help them get hired faster.
                </p>
              </div>

              <div className="p-8 rounded-xl border-2 border-purple-400 bg-purple-50">
                <Rocket className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Our Vision
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  A world where every student has a fair chance — regardless of
                  background or experience.
                </p>
              </div>
            </div>

            {/* Core Values */}
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Our Core Values
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, idx) => {
                const Icon = value.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-lg border border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
              What CareerBoost Offers
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Simple tools. Powerful outcomes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <span className="text-lg font-medium text-gray-900">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Trust Us */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white border-b border-gray-200">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Why Trust CareerBoost?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Built by Someone Who Struggled",
                  description:
                    "Neel created CareerBoost because he lived through the pain.",
                },
                {
                  title: "Real Results Matter",
                  description:
                    "If you're not getting more interviews, we're not doing our job.",
                },
                {
                  title: "Your Privacy is Sacred",
                  description:
                    "We never sell your data. Everything is encrypted.",
                },
                {
                  title: "Continuously Improving",
                  description:
                    "We're building interview prep, job tracking, automation and more.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-lg border border-blue-200 bg-blue-50"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Future */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The Future of CareerBoost
            </h2>
            <p className="text-gray-700 mb-12 text-lg">
              We're building more. Much more.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              {futureFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-lg bg-white border-2 border-blue-300 text-center"
                >
                  <Zap className="h-6 w-6 text-blue-600 mx-auto mb-3" />
                  <p className="font-semibold text-gray-900">{feature}</p>
                  <p className="text-xs text-gray-500 mt-2">Coming Soon</p>
                </div>
              ))}
            </div>

            <p className="text-xl text-gray-900 leading-relaxed">
              <span className="font-bold">CareerBoost is more than a tool</span>{" "}
              — it's a mission to make career success accessible to every
              student.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Stand Out?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Your career doesn’t have to be a constant battle. Let CareerBoost be
            your advantage.
          </p>
          <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg">
            Get Started Free
          </button>

          <p className="text-sm text-gray-600 mt-6">
            No credit card required. Join thousands improving their careers
            today.
          </p>
        </section>
      </main>

    </div>
  );
}
