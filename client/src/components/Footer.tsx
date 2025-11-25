import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand + description */}
          <div>
            <h2 className="text-xl font-bold text-blue-600 mb-3">CareerBoost</h2>
            <p className="text-gray-600 text-sm">
              Land your dream job with AI-powered resume enhancement and career tools.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/enhance-resume"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Resume Enhancement
                </Link>
              </li>
              <li>
                <Link
                  to="/cover-letter"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Cover Letter
                </Link>
              </li>
              <li>
                <Link
                  to="/job-fit"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Job Fit Analysis
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/documentation"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © 2025 CareerBoost. All rights reserved. Built with ❤️ for job seekers.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
              Twitter
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
              LinkedIn
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
