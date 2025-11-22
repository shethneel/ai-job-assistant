import { Target, Plus } from "lucide-react";

export default function JobFit() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-6">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Job Fit Analysis
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Get detailed insights on how well you match a job, with
              suggestions to improve your candidacy.
            </p>
            <button className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl">
              <Plus className="h-5 w-5 mr-2" />
              Analyze a Job
            </button>
          </div>

          <div className="mt-16 p-8 rounded-xl border border-gray-200 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-600">
              This feature is under development. Paste a job description and
              we'll analyze how well your skills match the role, showing you
              where you're a great fit and where you might need to improve.
            </p>
          </div>
        </div>
      </main>

    </div>
  );
}
