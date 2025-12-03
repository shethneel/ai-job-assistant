// client/src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

type UserProfileForm = {
  experience_level: string;
  preferred_roles: string;
  preferred_industries: string;
  preferred_locations: string;
  skills: string;
  work_authorization: string;
  career_goal: string;
};

type UserProfileResponse = UserProfileForm & {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
};

export default function Profile() {
  const navigate = useNavigate();
  const [form, setForm] = useState<UserProfileForm>({
    experience_level: "",
    preferred_roles: "",
    preferred_industries: "",
    preferred_locations: "",
    skills: "",
    work_authorization: "",
    career_goal: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    // If not logged in, push to login
    if (!token) {
      setInitialLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          setError("Please log in to view your profile.");
          setInitialLoading(false);
          return;
        }

        if (!res.ok) {
          // If you decided to return 404 when no profile exists
          if (res.status === 404) {
            setInitialLoading(false);
            return;
          }
          throw new Error("Failed to load profile");
        }

        const data: UserProfileResponse = await res.json();

        setForm({
          experience_level: data.experience_level ?? "",
          preferred_roles: data.preferred_roles ?? "",
          preferred_industries: data.preferred_industries ?? "",
          preferred_locations: data.preferred_locations ?? "",
          skills: data.skills ?? "",
          work_authorization: data.work_authorization ?? "",
          career_goal: data.career_goal ?? "",
        });
      } catch (err) {
        console.error(err);
        setError("Could not load profile. Please try again.");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError("You need to be logged in to save your profile.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.status === 401 || res.status === 403) {
        setError("Your session has expired. Please log in again.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to save profile");
      }

      await res.json();
      setMessage("Profile saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">
            You&apos;re not logged in
          </h1>
          <p className="text-gray-600 mb-6">
            Please log in to create and manage your career profile.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Career Profile
        </h1>
        <p className="text-gray-600 mb-8">
          Help CareerBoost understand your background so we can personalize
          resumes, cover letters, and job matches for you.
        </p>

        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-6"
        >
          {message && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Experience level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience level
            </label>
            <select
              name="experience_level"
              value={form.experience_level}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your level</option>
              <option value="student">Student</option>
              <option value="recent_grad">Recent graduate</option>
              <option value="junior">1–2 years</option>
              <option value="mid">3–5 years</option>
              <option value="senior">Senior</option>
              <option value="manager">Manager</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              This helps us adjust tone and expectations in your documents.
            </p>
          </div>

          {/* Text inputs */}
          {[
            {
              name: "preferred_roles",
              label: "Preferred roles",
              placeholder: "Software Engineer, Data Analyst, Product Manager",
            },
            {
              name: "preferred_industries",
              label: "Preferred industries",
              placeholder: "Tech, Finance, Healthcare",
            },
            {
              name: "preferred_locations",
              label: "Preferred locations",
              placeholder: "Remote, US, Australia, Canada",
            },
            {
              name: "skills",
              label: "Key skills (comma-separated)",
              placeholder: "Python, React, SQL, Machine Learning",
            },
            {
              name: "work_authorization",
              label: "Work authorization",
              placeholder: "US Citizen, F1 OPT, PR in Australia, etc.",
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type="text"
                name={field.name}
                value={(form as any)[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          {/* Career goal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Career goal
            </label>
            <textarea
              name="career_goal"
              value={form.career_goal}
              onChange={handleChange}
              rows={4}
              placeholder="Briefly describe your short-term career goal (1–2 sentences)."
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
