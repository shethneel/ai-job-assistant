import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">
            Oops! This page doesn't exist yet.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            Return to Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
