import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Features
            </h3>
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
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-600">
            © 2024 CareerBoost. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Twitter
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              LinkedIn
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
