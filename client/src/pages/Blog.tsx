import { useState } from "react";
import {
  BookMarked,
  Clock,
  Calendar,
  User,
  ChevronRight,
  Search,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  date: string;
  author: string;
  content: string;
  seoDescription: string;
  keywords: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: "soft-skills-2025",
    title: "Why Soft Skills Matter More Than Ever in 2025",
    excerpt:
      "Soft skills are becoming a top hiring requirement in 2025. Learn why employers prioritize communication, teamwork, adaptability, and problem-solving.",
    category: "Career Tips",
    readTime: 5,
    date: "January 15, 2025",
    author: "CareerBoost Team",
    seoDescription:
      "Soft skills are becoming a top hiring requirement in 2025. Learn why employers prioritize communication, teamwork, adaptability, and problem-solving.",
    keywords: [
      "soft skills 2025",
      "importance of soft skills",
      "skills employers want",
      "communication skills",
      "job market trends",
    ],
    content: `The job market is changing fast, and while technical knowledge still matters, soft skills have become the real competitive edge for job seekers. Employers want candidates who can collaborate, solve problems, and adapt quickly — especially in remote and hybrid environments.

## 1. Communication Skills Are Now Non-Negotiable

Whether you're writing an email, giving updates, or presenting ideas, employers expect clarity and confidence.
- Strong communication improves teamwork, reduces mistakes, and boosts productivity.
- It's the foundation of professional relationships and career advancement.

## 2. Adaptability Is the New Job Currency

Industries shift rapidly, and roles evolve constantly.
- Employees who adapt to new tools, workflows, and environments are more valuable than ever.
- Change management is now a critical skill across all sectors.

## 3. Emotional Intelligence Drives Better Teamwork

Hiring managers now prioritize candidates who can:
- Resolve conflict professionally
- Handle feedback well
- Support diverse teams
- Stay calm under pressure

EI leads to healthier team environments and fewer workplace issues.

## 4. Problem-Solving Shows You're Future-Ready

Companies want people who don't just wait for instructions — they want thinkers.
- Strong problem-solvers help businesses innovate and operate more efficiently.
- This skill is increasingly valued across all industries and roles.

## Conclusion

Soft skills are becoming essential for every industry. If you're looking to stand out in 2025, building communication, teamwork, and adaptability skills will give you a major advantage. Start today!`,
  },
  {
    id: "company-research-guide",
    title: "How to Research a Company Before Applying (Smart Guide for 2025)",
    excerpt:
      "Learn how to research a company before applying. A step-by-step guide for job seekers to understand culture, values, growth, and interview readiness.",
    category: "Job Search Guide",
    readTime: 6,
    date: "January 12, 2025",
    author: "CareerBoost Team",
    seoDescription:
      "Learn how to research a company before applying. A step-by-step guide for job seekers to understand culture, values, growth, and interview readiness.",
    keywords: [
      "how to research a company",
      "job application tips",
      "interview preparation",
      "company culture research",
      "job seeker guide",
    ],
    content: `Before submitting any job application, it's important to understand who you're applying to. Researching a company helps you tailor your resume, prepare for interviews, and decide whether the workplace is right for you.

Here's a simple, effective process for 2025 job seekers.

## 1. Start With the Company Website

Check the About Us, Mission, and Careers pages.
- You'll find insights into their culture, values, and long-term vision.
- Look for company values and mission statements that align with yours.

## 2. Explore Recent News & Press Releases

Search the company on Google News. Look for:
- Funding announcements
- New product launches
- Expansion or layoffs
- Partnerships

This tells you how stable and growing the company is.

## 3. Check Reviews on Glassdoor, Indeed & Blind

Employee reviews give you real-world insights into:
- Work-life balance
- Leadership quality
- Compensation transparency
- Interview difficulty

Take extreme reviews with a grain of salt — seek patterns instead.

## 4. Understand Their Products or Services

Look at what they actually sell or provide.
- Read customer testimonials to understand their market reputation.
- This helps you speak knowledgeably in interviews.

## 5. Look Into Their Social Media

Platforms like LinkedIn, Instagram, and X often reveal:
- Company culture and values
- Diversity and inclusion efforts
- Community involvement
- Active hiring and growth

## Conclusion

A few minutes of research can help you apply smarter and interview with confidence. When you understand the company, you can show you're genuinely interested — and that's something hiring managers love.`,
  },
];

export default function Blog() {
  const [selectedBlog, setSelectedBlog] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedPost = selectedBlog
    ? blogPosts.find((p) => p.id === selectedBlog)
    : null;

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Detail view
  if (selectedPost) {
    return (
      <div className="flex flex-col min-h-screen bg-white">

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-16">
          <div className="mx-auto max-w-3xl">
            {/* Back Button */}
            <button
              onClick={() => {
                setSelectedBlog(null);
                setSearchQuery("");
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
              Back to Blog
            </button>

            {/* Article Header */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                  {selectedPost.category}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                {selectedPost.title}
              </h1>

              <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{selectedPost.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{selectedPost.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{selectedPost.readTime} min read</span>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <article className="prose prose-sm sm:prose max-w-none">
              <div className="bg-gray-50 border-l-4 border-blue-600 p-6 mb-8 rounded">
                <p className="text-gray-700 text-lg m-0">
                  {selectedPost.excerpt}
                </p>
              </div>

              <div className="text-gray-700 leading-8 space-y-6">
                {selectedPost.content.split("\n\n").map((paragraph, idx) => {
                  if (paragraph.startsWith("##")) {
                    return (
                      <h2
                        key={idx}
                        className="text-2xl font-bold text-gray-900 mt-8 mb-4"
                      >
                        {paragraph.replace("## ", "")}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith("- ")) {
                    return (
                      <ul key={idx} className="list-disc list-inside space-y-2">
                        {paragraph.split("\n").map((item, itemIdx) => (
                          <li key={itemIdx} className="text-gray-700">
                            {item.replace("- ", "")}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={idx} className="text-gray-700">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </article>

            {/* CTA */}
            <div className="mt-12 p-8 rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to boost your career?
              </h3>
              <p className="text-gray-700 mb-6">
                Apply the insights from this article using CareerBoost&apos;s AI
                tools.
              </p>
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all">
                Get Started Free
              </button>
            </div>
          </div>
        </main>

      </div>
    );
  }

  // List view
  return (
    <div className="flex flex-col min-h-screen bg-white">

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-6xl">
          {/* Header Section */}
          <div className="mb-16">
            <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 mb-6 border border-blue-200">
              <BookMarked className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-semibold text-blue-600">Blog</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Career Tips &amp; Insights
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Expert articles on job search strategies, career growth, soft
              skills, and interview preparation to help you land your dream job.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Blog Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {filteredPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => setSelectedBlog(post.id)}
                  className="text-left group"
                >
                  <div className="rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden bg-white h-full">
                    {/* Card Header */}
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100">
                      <div className="flex items-start justify-between mb-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
                          {post.category}
                        </span>
                        <Clock className="h-4 w-4 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                        {post.title}
                      </h3>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex flex-col">
                      <p className="text-gray-600 mb-6 flex-1">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-500 border-t border-gray-200 pt-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime} min</span>
                        </div>
                      </div>

                      <div className="mt-6 inline-flex items-center text-blue-600 font-semibold group-hover:gap-2 gap-1 transition-all">
                        Read Article
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                No articles found matching your search.
              </p>
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="p-8 sm:p-12 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Get Career Tips Delivered Weekly
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Subscribe to our newsletter and get expert insights on job
                search, resume writing, interviews, and career growth.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg whitespace-nowrap">
                  Subscribe
                </button>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                No spam, just valuable content. Unsubscribe anytime.
              </p>
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              More Articles Coming Soon
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                "Top 5 Productivity Habits for 2025",
                "Interview Questions You Should Prepare For",
                "Building an Impressive Portfolio",
              ].map((title, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-lg border border-gray-200 bg-gray-50 text-center"
                >
                  <div className="text-gray-400 text-sm font-semibold mb-2">
                    COMING SOON
                  </div>
                  <p className="text-gray-700 font-medium">{title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
