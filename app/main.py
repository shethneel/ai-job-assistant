from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.responses import HTMLResponse

from app.database import init_db
from app.api.routes_health import router as health_router
from app.api.routes_resume import router as resume_router
from app.api.routes_cover_letter import router as cover_letter_router
from app.api.routes_auth import router as auth_router
from app.api.routes_user_resume import router as user_resume_router
from app.api.routes_job_match import router as job_match_router
from app.api.routes_tailored_resume import router as tailored_resume_router


def create_app() -> FastAPI:
    app = FastAPI()

    # ---- API Routers (unchanged) ----
    app.include_router(health_router, prefix="/health")
    app.include_router(resume_router, prefix="/resume")
    app.include_router(cover_letter_router)
    app.include_router(auth_router)
    app.include_router(user_resume_router)
    app.include_router(job_match_router)
    app.include_router(tailored_resume_router)

    return app


app = create_app()
init_db()


# =========================================
# Landing Page at "/"
# =========================================
@app.get("/", response_class=HTMLResponse)
async def landing_page() -> str:
    return """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AI Job Assistant</title>
    <style>
        :root {
            --bg: #0f172a;
            --card-bg: #020617;
            --accent: #38bdf8;
            --accent-soft: rgba(56, 189, 248, 0.2);
            --text-main: #e5e7eb;
            --muted: #9ca3af;
            --radius: 14px;
            --shadow: 0 24px 60px rgba(15, 23, 42, 0.75);
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
                Roboto, Helvetica, Arial, sans-serif;
            background: radial-gradient(circle at top, #1d283a 0, #020617 55%, #000 100%);
            color: var(--text-main);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }

        .shell {
            max-width: 960px;
            width: 100%;
        }

        .card {
            background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.08), #020617 45%, #020617 100%);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            border: 1px solid rgba(148, 163, 184, 0.25);
            padding: 32px 28px 26px;
            position: relative;
            overflow: hidden;
        }

        .pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            padding: 4px 10px;
            border-radius: 999px;
            border: 1px solid rgba(148, 163, 184, 0.4);
            color: var(--muted);
            background: rgba(15, 23, 42, 0.75);
            margin-bottom: 14px;
        }

        .pill-dot {
            width: 7px;
            height: 7px;
            border-radius: 999px;
            background: #22c55e;
            box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.25);
        }

        h1 {
            margin: 0 0 10px;
            font-size: 32px;
            letter-spacing: -0.03em;
        }

        .highlight {
            color: var(--accent);
        }

        .sub {
            margin: 0 0 20px;
            font-size: 14px;
            color: var(--muted);
            max-width: 540px;
        }

        .grid {
            display: grid;
            grid-template-columns: minmax(0, 2.1fr) minmax(0, 1.3fr);
            gap: 24px;
            margin-top: 18px;
            align-items: flex-start;
        }

        .bullet-list {
            list-style: none;
            padding: 0;
            margin: 0 0 14px;
            font-size: 13px;
            color: var(--muted);
        }

        .bullet-list li {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 6px;
        }

        .bullet-dot {
            margin-top: 5px;
            width: 6px;
            height: 6px;
            border-radius: 999px;
            background: var(--accent);
            flex-shrink: 0;
        }

        .cta-row {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-top: 10px;
            flex-wrap: wrap;
        }

        .cta-primary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 9px 18px;
            border-radius: 999px;
            border: none;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            background: linear-gradient(135deg, #38bdf8, #0ea5e9);
            color: #0b1220;
            box-shadow: 0 12px 24px rgba(56, 189, 248, 0.35);
            text-decoration: none;
        }

        .cta-primary:hover {
            filter: brightness(1.08);
            transform: translateY(-1px);
        }

        .cta-secondary-text {
            font-size: 12px;
            color: var(--muted);
        }

        .cta-primary-icon {
            font-size: 16px;
            line-height: 1;
        }

        .right-card {
            border-radius: 12px;
            background: radial-gradient(circle at top, rgba(30, 64, 175, 0.65), rgba(15, 23, 42, 0.95));
            border: 1px solid rgba(148, 163, 184, 0.4);
            padding: 16px 16px 12px;
            font-size: 11px;
            color: var(--muted);
        }

        .right-title {
            font-size: 12px;
            margin-bottom: 8px;
            color: var(--text-main);
            font-weight: 500;
        }

        .pill-stack {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 10px;
        }

        .pill-mini {
            padding: 4px 8px;
            border-radius: 999px;
            border: 1px solid rgba(148, 163, 184, 0.45);
            background: rgba(15, 23, 42, 0.85);
            font-size: 10px;
            color: var(--muted);
        }

        .mini-metric {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            margin-bottom: 4px;
        }

        .mini-metric strong {
            color: var(--text-main);
            font-weight: 500;
        }

        .footer-note {
            margin-top: 14px;
            font-size: 11px;
            color: #6b7280;
        }

        @media (max-width: 720px) {
            body {
                padding: 16px;
            }
            .card {
                padding: 22px 18px 18px;
            }
            h1 {
                font-size: 24px;
            }
            .grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="shell">
        <div class="card">
            <div class="pill">
                <span class="pill-dot"></span>
                <span>Private beta · Built for ambitious job seekers</span>
            </div>

            <h1>
                Your <span class="highlight">AI Job Assistant</span> for
                tailored resumes, cover letters & job fit.
            </h1>
            <p class="sub">
                Upload your resume once, then instantly tailor it to any job description,
                analyze match scores, and generate aligned cover letters – all in one place.
            </p>

            <div class="grid">
                <div>
                    <ul class="bullet-list">
                        <li>
                            <span class="bullet-dot"></span>
                            <span><strong>Upload once, reuse forever.</strong> Save your core resume securely and reuse it across applications.</span>
                        </li>
                        <li>
                            <span class="bullet-dot"></span>
                            <span><strong>Instant job match analysis.</strong> See match score, strengths, missing skills, and red flags for any JD.</span>
                        </li>
                        <li>
                            <span class="bullet-dot"></span>
                            <span><strong>One-click tailored resumes & cover letters.</strong> Generate role-specific versions in seconds.</span>
                        </li>
                    </ul>

                    <div class="cta-row">
                        <a href="/app" class="cta-primary">
                            <span>Open App</span>
                            <span class="cta-primary-icon">↗</span>
                        </a>
                        <div class="cta-secondary-text">
                            Free beta. No credit card required.<br/>
                            Best experienced on desktop.
                        </div>
                    </div>
                </div>

                <div class="right-card">
                    <div class="right-title">What you can do inside the app</div>
                    <div class="pill-stack">
                        <span class="pill-mini">Resume Enhancer</span>
                        <span class="pill-mini">Cover Letter Generator</span>
                        <span class="pill-mini">Job Match Analyzer</span>
                        <span class="pill-mini">Tailored Resume Builder</span>
                        <span class="pill-mini">Copy & Download</span>
                    </div>

                    <div class="mini-metric">
                        <span>Match Score Preview</span>
                        <strong>78% → 91%</strong>
                    </div>
                    <div class="mini-metric">
                        <span>Time to tailor per job</span>
                        <strong>&lt; 30 seconds</strong>
                    </div>
                    <div class="mini-metric">
                        <span>Manual editing still welcome</span>
                        <strong>You're in control</strong>
                    </div>

                    <div class="footer-note">
                        This is a working prototype you can use today.
                        We’re iterating quickly – your feedback will directly shape the product.
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    """


# =========================================
# Full App UI at "/app"
# (this is basically your existing SPA)
# =========================================
@app.get("/app", response_class=HTMLResponse)
async def app_page() -> str:
    return """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AI Job Assistant – App</title>
    <style>
        :root {
            --bg-color: #f4f5f7;
            --card-bg: #ffffff;
            --border-color: #e0e4ea;
            --text-color: #1f2933;
            --muted-text: #6b7280;
            --primary: #2563eb;
            --primary-hover: #1d4ed8;
            --secondary: #4b5563;
            --secondary-hover: #374151;
            --danger: #b91c1c;
            --radius: 10px;
            --shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
            --spacing: 16px;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
                Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
        }

        .app-container {
            max-width: 1000px;
            margin: 40px auto;
            padding: 0 16px 40px;
        }

        h1 {
            margin: 0 0 8px;
            font-size: 28px;
            text-align: center;
        }

        .subtitle {
            margin: 0 0 24px;
            text-align: center;
            color: var(--muted-text);
            font-size: 14px;
        }

        .card {
            background-color: var(--card-bg);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            padding: 24px;
            margin-bottom: 24px;
            border: 1px solid var(--border-color);
        }

        .card h2 {
            margin-top: 0;
            margin-bottom: 4px;
            font-size: 20px;
        }

        .section-description {
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 13px;
            color: var(--muted-text);
        }

        .field-group {
            margin-bottom: 16px;
        }

        label {
            display: inline-block;
            font-weight: 600;
            margin-bottom: 6px;
            font-size: 13px;
        }

        input[type="file"] {
            display: block;
            margin-top: 4px;
            font-size: 13px;
        }

        input[type="email"],
        input[type="password"] {
            width: 100%;
            padding: 8px 10px;
            border-radius: 6px;
            border: 1px solid var(--border-color);
            font-size: 13px;
        }

        input[type="email"]:focus,
        input[type="password"]:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.2);
        }

        textarea {
            width: 100%;
            min-height: 200px;
            resize: vertical;
            padding: 10px;
            border-radius: 6px;
            border: 1px solid var(--border-color);
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            font-size: 13px;
            line-height: 1.4;
        }

        textarea:focus,
        input[type="file"]:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.2);
        }

        .btn-row {
            margin-top: 8px;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 6px 14px;
            border-radius: 999px;
            border: 1px solid transparent;
            font-size: 13px;
            cursor: pointer;
            transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.05s ease;
        }

        .btn:active {
            transform: translateY(1px);
        }

        .btn-primary {
            background-color: var(--primary);
            color: #ffffff;
            border-color: var(--primary);
        }

        .btn-primary:hover {
            background-color: var(--primary-hover);
            border-color: var(--primary-hover);
        }

        .btn-secondary {
            background-color: #ffffff;
            color: var(--secondary);
            border-color: var(--border-color);
        }

        .btn-secondary:hover {
            background-color: #f3f4f6;
            border-color: var(--secondary-hover);
        }

        .status {
            margin-top: 8px;
            font-size: 12px;
            min-height: 16px;
        }

        .status.loading {
            color: var(--primary);
        }

        .status.error {
            color: var(--danger);
        }

        .status.success {
            color: #047857;
        }

        .versions-container {
            margin-top: 12px;
        }

        .version-card {
            border-radius: 8px;
            border: 1px solid var(--border-color);
            padding: 12px;
            margin-bottom: 12px;
            background-color: #f9fafb;
        }

        .version-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .version-title {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
        }

        .auth-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
        }

        .two-column {
            display: grid;
            grid-template-columns: minmax(0, 1.2fr) minmax(0, 1.1fr);
            gap: 16px;
        }

        @media (max-width: 640px) {
            .card {
                padding: 16px;
            }

            textarea {
                min-height: 180px;
            }

            .btn {
                width: 100%;
                margin-bottom: 6px;
            }

            .btn-row {
                display: flex;
                flex-direction: column;
                align-items: stretch;
            }

            .auth-buttons {
                flex-direction: column;
                align-items: stretch;
            }

            .two-column {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="app-container">
        <h1>AI Job Assistant</h1>
        <p class="subtitle">Enhance your resume, generate tailored cover letters, analyze job fit, and tailor your resume to specific roles.</p>

        <!-- Account / Auth Card -->
        <section class="card" id="accountSection">
            <h2>Account</h2>
            <p class="section-description">
                Sign up or log in to save your resume and use job match analysis and tailored resumes.
            </p>

            <div class="field-group">
                <label for="authEmail">Email</label>
                <input type="email" id="authEmail" placeholder="Email" />
            </div>

            <div class="field-group">
                <label for="authPassword">Password</label>
                <input type="password" id="authPassword" placeholder="Password" />
            </div>

            <div class="auth-buttons">
                <button id="signupBtn" type="button" class="btn btn-secondary">Sign Up</button>
                <button id="loginBtn" type="button" class="btn btn-primary">Log In</button>
                <button id="logoutBtn" type="button" class="btn btn-secondary">Log Out</button>
            </div>

            <div id="authStatus" class="status">Not logged in</div>
        </section>

        <!-- Saved Resume Card -->
        <section class="card" id="savedResumeSection">
            <h2>Saved Resume</h2>
            <p class="section-description">
                Upload a resume once and we’ll use it for Job Match Analysis, Cover Letters, and Tailored Resume generation.
            </p>

            <div class="field-group">
                <label for="savedResumeFile">Upload / Replace Saved Resume</label>
                <input type="file" id="savedResumeFile" accept=".txt,.docx,.pdf" />
            </div>

            <div class="btn-row">
                <button id="uploadSavedResumeBtn" type="button" class="btn btn-primary">
                    Save Resume to Profile
                </button>
            </div>

            <div id="savedResumeStatus" class="status"></div>
        </section>

        <!-- Resume Enhancer Card -->
        <section class="card" id="resumeSection">
            <h2>Resume Enhancer</h2>
            <p class="section-description">
                Upload your resume as a .txt, .docx, or text-based .pdf file. You'll get three enhanced versions you can copy or download.
            </p>

            <form id="resumeForm">
                <div class="field-group">
                    <label for="resumeFile">Upload Resume</label><br />
                    <input type="file" id="resumeFile" name="file" accept=".txt,.docx,.pdf" required />
                </div>

                <div class="btn-row">
                    <button type="submit" class="btn btn-primary">Enhance Resume</button>
                </div>
            </form>

            <div id="resumeStatus" class="status"></div>

            <div class="field-group versions-container">
                <label><strong>Enhanced Versions</strong></label>
                <div id="results"></div>
            </div>
        </section>

        <!-- Two-column: Cover Letter + Job Match/Tailor -->
        <section class="card">
            <div class="two-column">
                <!-- Cover Letter Generator -->
                <div id="coverLetterSection">
                    <h2>Cover Letter Generator</h2>
                    <p class="section-description">
                        Paste one of your enhanced resumes and the job description. We'll generate a concise, tailored cover letter you can copy or download.
                    </p>

                    <div class="field-group">
                        <label for="resumeForCoverLetterInput">Resume (for this job)</label><br />
                        <textarea id="resumeForCoverLetterInput" placeholder="Paste your enhanced resume here"></textarea>
                    </div>

                    <div class="field-group">
                        <label for="jobDescriptionInput">Job Description</label><br />
                        <textarea id="jobDescriptionInput" placeholder="Paste the job description here"></textarea>
                    </div>

                    <div class="btn-row">
                        <button id="generateCoverLetterBtn" type="button" class="btn btn-primary">Generate Cover Letter</button>
                    </div>

                    <div id="coverLetterStatus" class="status"></div>

                    <div class="field-group" style="margin-top: 16px;">
                        <label for="coverLetterOutput"><strong>Generated Cover Letter</strong></label><br />
                        <textarea id="coverLetterOutput" placeholder="Your cover letter will appear here"></textarea>
                    </div>

                    <div class="btn-row">
                        <button id="copyCoverLetterBtn" type="button" class="btn btn-secondary">Copy Cover Letter</button>
                        <button id="downloadCoverLetterBtn" type="button" class="btn btn-secondary" style="margin-left: 8px;">Download Cover Letter (.txt)</button>
                    </div>
                </div>

                <!-- Job Match + Tailored Resume Column -->
                <div>
                    <!-- Job Match Analyzer -->
                    <div class="field-group">
                        <h2>Job Match Analyzer</h2>
                        <p class="section-description">
                            Paste a job description and we'll analyze how well it matches your saved resume (once uploaded), highlighting strengths, gaps, and recommendations.
                        </p>
                        <label for="jobMatchJDInput"><strong>Job Description</strong></label><br />
                        <textarea id="jobMatchJDInput" placeholder="Paste the job description here"></textarea>
                    </div>

                    <div class="btn-row">
                        <button id="analyzeMatchBtn" type="button" class="btn btn-secondary">
                            Analyze Fit (Using Saved Resume)
                        </button>
                    </div>

                    <div id="jobMatchStatus" class="status"></div>
                    <div id="jobMatchResult" style="margin-top: 12px; font-size: 13px;"></div>

                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />

                    <!-- Tailored Resume Generator -->
                    <h2>Tailored Resume Generator</h2>
                    <p class="section-description">
                        Use your saved resume and this job description to generate a customized resume and see how your match score improves.
                    </p>

                    <div class="btn-row">
                        <button id="tailorResumeBtn" type="button" class="btn btn-primary">
                            Tailor Resume to This Job
                        </button>
                    </div>

                    <div id="tailorStatus" class="status"></div>

                    <div id="tailorBeforeAnalysis" style="margin-top: 12px; font-size: 13px;"></div>
                    <div id="tailorAfterAnalysis" style="margin-top: 12px; font-size: 13px;"></div>

                    <div class="field-group" style="margin-top: 16px;">
                        <label for="tailoredResumeOutput"><strong>Tailored Resume</strong></label><br />
                        <textarea id="tailoredResumeOutput" placeholder="Your tailored resume will appear here"></textarea>
                    </div>

                    <div class="btn-row">
                        <button id="copyTailoredResumeBtn" type="button" class="btn btn-secondary">Copy Tailored Resume</button>
                        <button id="downloadTailoredResumeBtn" type="button" class="btn btn-secondary" style="margin-left: 8px;">Download Tailored Resume (.txt)</button>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <script>
        // ======== Auth State =========
        let authToken = null;

        // Utility: download text as .txt file
        function downloadTextAsFile(text, filename) {
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function getAuthHeaders(extraHeaders = {}) {
            const headers = { ...extraHeaders };
            if (authToken) {
                headers['Authorization'] = 'Bearer ' + authToken;
            }
            return headers;
        }

        // Common status helper
        function setStatus(el, message, type) {
            el.textContent = message || "";
            el.classList.remove('loading', 'error', 'success');
            if (type) {
                el.classList.add(type);
            }
        }

        // ======== Element References ========

        // Auth
        const authEmailInput = document.getElementById('authEmail');
        const authPasswordInput = document.getElementById('authPassword');
        const signupBtn = document.getElementById('signupBtn');
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const authStatusEl = document.getElementById('authStatus');

        // Resume Enhancer
        const resumeForm = document.getElementById('resumeForm');
        const resumeFileInput = document.getElementById('resumeFile');
        const resumeStatusEl = document.getElementById('resumeStatus');
        const resultsEl = document.getElementById('results');

        // Cover Letter
        const jobDescriptionInput = document.getElementById('jobDescriptionInput');
        const resumeForCoverLetterInput = document.getElementById('resumeForCoverLetterInput');
        const coverLetterOutput = document.getElementById('coverLetterOutput');
        const generateCoverLetterBtn = document.getElementById('generateCoverLetterBtn');
        const copyCoverLetterBtn = document.getElementById('copyCoverLetterBtn');
        const downloadCoverLetterBtn = document.getElementById('downloadCoverLetterBtn');
        const coverLetterStatusEl = document.getElementById('coverLetterStatus');

        // Job Match & Tailor
        const jobMatchJDInput = document.getElementById('jobMatchJDInput');
        const analyzeMatchBtn = document.getElementById('analyzeMatchBtn');
        const jobMatchStatusEl = document.getElementById('jobMatchStatus');
        const jobMatchResultEl = document.getElementById('jobMatchResult');

        const tailorResumeBtn = document.getElementById('tailorResumeBtn');
        const tailorStatusEl = document.getElementById('tailorStatus');
        const tailorBeforeEl = document.getElementById('tailorBeforeAnalysis');
        const tailorAfterEl = document.getElementById('tailorAfterAnalysis');
        const tailoredResumeOutput = document.getElementById('tailoredResumeOutput');
        const copyTailoredResumeBtn = document.getElementById('copyTailoredResumeBtn');
        const downloadTailoredResumeBtn = document.getElementById('downloadTailoredResumeBtn');

        // ======== Auth Logic ========

        async function refreshAuthStatusFromServer() {
            try {
                const response = await fetch('/auth/me', {
                    method: 'GET',
                    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                });

                if (!response.ok) {
                    throw new Error('Not authenticated');
                }

                const data = await response.json();
                setStatus(authStatusEl, `Logged in as ${data.email}`, 'success');
            } catch (err) {
                authToken = null;
                localStorage.removeItem('jobAgentToken');
                setStatus(authStatusEl, 'Not logged in', 'error');
            }
        }

        // On page load: restore token from localStorage if present
        (function initAuthFromStorage() {
            const storedToken = localStorage.getItem('jobAgentToken');
            if (storedToken) {
                authToken = storedToken;
                setStatus(authStatusEl, 'Checking session...', 'loading');
                refreshAuthStatusFromServer();
            } else {
                setStatus(authStatusEl, 'Not logged in', null);
            }
        })();

        signupBtn.addEventListener('click', async () => {
            const email = authEmailInput.value.trim();
            const password = authPasswordInput.value.trim();

            if (!email || !password) {
                setStatus(authStatusEl, 'Please enter both email and password.', 'error');
                return;
            }

            setStatus(authStatusEl, 'Signing up...', 'loading');

            try {
                const response = await fetch('/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json().catch(() => null);

                if (!response.ok) {
                    const msg = data && data.detail ? data.detail : 'Signup failed.';
                    setStatus(authStatusEl, `Error: ${msg}`, 'error');
                    return;
                }

                setStatus(authStatusEl, 'Signup successful. You can now log in.', 'success');
            } catch (err) {
                console.error(err);
                setStatus(authStatusEl, 'Network error during signup.', 'error');
            }
        });

        loginBtn.addEventListener('click', async () => {
            const email = authEmailInput.value.trim();
            const password = authPasswordInput.value.trim();

            if (!email || !password) {
                setStatus(authStatusEl, 'Please enter both email and password.', 'error');
                return;
            }

            setStatus(authStatusEl, 'Logging in...', 'loading');

            try {
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json().catch(() => null);

                if (!response.ok) {
                    const msg = data && data.detail ? data.detail : 'Login failed.';
                    setStatus(authStatusEl, `Error: ${msg}`, 'error');
                    return;
                }

                const token = data.access_token;
                if (!token) {
                    setStatus(authStatusEl, 'Login failed: no token returned.', 'error');
                    return;
                }

                authToken = token;
                localStorage.setItem('jobAgentToken', token);
                setStatus(authStatusEl, 'Login successful. Fetching account info...', 'success');
                await refreshAuthStatusFromServer();
            } catch (err) {
                console.error(err);
                setStatus(authStatusEl, 'Network error during login.', 'error');
            }
        });

        logoutBtn.addEventListener('click', () => {
            authToken = null;
            localStorage.removeItem('jobAgentToken');
            setStatus(authStatusEl, 'Logged out.', 'success');
        });

        // =============================
        // Job Match Analyzer Logic
        // =============================
        analyzeMatchBtn.addEventListener("click", async () => {
            const jd = jobMatchJDInput.value.trim();

            setStatus(jobMatchStatusEl, "", null);
            jobMatchResultEl.innerHTML = "";

            if (!authToken) {
                setStatus(jobMatchStatusEl, "Please log in and save a resume first.", 'error');
                return;
            }

            if (!jd) {
                setStatus(jobMatchStatusEl, "Please paste a job description.", 'error');
                return;
            }

            setStatus(jobMatchStatusEl, "Analyzing job match...", 'loading');

            try {
                const res = await fetch("/job-match/analyze-from-saved", {
                    method: "POST",
                    headers: getAuthHeaders({ "Content-Type": "application/json" }),
                    body: JSON.stringify({ job_description: jd }),
                });

                if (res.status === 404) {
                    setStatus(jobMatchStatusEl, "No saved resume found. Please upload & save your resume first.", 'error');
                    return;
                }

                if (res.status === 429) {
                    const data = await res.json().catch(() => null);
                    setStatus(jobMatchStatusEl, data?.detail || "Daily limit reached.", "error");
                    return;
                }

                if (!res.ok) {
                    setStatus(jobMatchStatusEl, "Failed to analyze job match.", 'error');
                    return;
                }

                const data = await res.json();
                setStatus(jobMatchStatusEl, "Done.", 'success');

                jobMatchResultEl.innerHTML = `
                    <p><strong>Match Score:</strong> ${data.match_score}%</p>

                    <p><strong>Strong Points:</strong></p>
                    <ul>${(data.strong_points || []).map(x => `<li>${x}</li>`).join("")}</ul>

                    <p><strong>Missing Skills:</strong></p>
                    <ul>${(data.missing_skills || []).map(x => `<li>${x}</li>`).join("")}</ul>

                    <p><strong>Red Flags:</strong></p>
                    <ul>${(data.red_flags || []).map(x => `<li>${x}</li>`).join("")}</ul>

                    <p><strong>Recommendations:</strong></p>
                    <ul>${(data.recommendations || []).map(x => `<li>${x}</li>`).join("")}</ul>
                `;
            } catch (err) {
                console.error(err);
                setStatus(jobMatchStatusEl, "Error analyzing job match.", 'error');
            }
        });

        // ======== Tailored Resume Generator Logic ========
        tailorResumeBtn.addEventListener('click', async () => {
            const jd = jobMatchJDInput.value.trim();

            tailorBeforeEl.innerHTML = "";
            tailorAfterEl.innerHTML = "";
            tailoredResumeOutput.value = "";
            setStatus(tailorStatusEl, "", null);

            if (!authToken) {
                setStatus(tailorStatusEl, "Please log in and save a resume first.", "error");
                return;
            }

            if (!jd) {
                setStatus(tailorStatusEl, "Please paste a job description first.", "error");
                return;
            }

            // Step 1: Analyze current resume vs job ( BEFORE state )
            setStatus(tailorStatusEl, "Analyzing your current resume against this job...", "loading");

            try {
                const beforeRes = await fetch('/job-match/analyze-from-saved', {
                    method: 'POST',
                    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify({ job_description: jd }),
                });

                if (beforeRes.status === 404) {
                    setStatus(tailorStatusEl, "No saved resume found. Please upload & save your resume first.", "error");
                    return;
                }

                if (!beforeRes.ok) {
                    setStatus(tailorStatusEl, "Failed to analyze current match.", "error");
                    return;
                }

                const beforeData = await beforeRes.json();

                // Render BEFORE analysis
                tailorBeforeEl.innerHTML = `
                    <h4>Current Match</h4>
                    <p><strong>Match Score:</strong> ${beforeData.match_score}%</p>
                    <p><strong>Strong Points:</strong></p>
                    <ul>${beforeData.strong_points.map(p => `<li>${p}</li>`).join('')}</ul>
                    <p><strong>Missing Skills:</strong></p>
                    <ul>${beforeData.missing_skills.map(p => `<li>${p}</li>`).join('')}</ul>
                    <p><strong>Red Flags:</strong></p>
                    <ul>${beforeData.red_flags.map(p => `<li>${p}</li>`).join('')}</ul>
                    <p><strong>Recommendations:</strong></p>
                    <ul>${beforeData.recommendations.map(p => `<li>${p}</li>`).join('')}</ul>
                `;

                // Step 2: Call tailor-from-saved for AFTER state
                setStatus(tailorStatusEl, "Tailoring your resume to this job...", "loading");

                const tailorRes = await fetch('/resume/tailor-from-saved', {
                    method: 'POST',
                    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify({ job_description: jd }),
                });

                if (tailorRes.status === 404) {
                    setStatus(tailorStatusEl, "No saved resume found. Please upload & save your resume first.", "error");
                    return;
                }

                if (!tailorRes.ok) {
                    setStatus(tailorStatusEl, "Failed to tailor resume.", "error");
                    return;
                }

                const tailorData = await tailorRes.json();
                const im = tailorData.improved_match;

                setStatus(tailorStatusEl, "Tailoring complete.", "success");

                tailorAfterEl.innerHTML = `
                    <h4>Improved Match</h4>
                    <p><strong>Match Score:</strong> ${im.match_score}%</p>
                    <p><strong>Strong Points:</strong></p>
                    <ul>${im.strong_points.map(p => `<li>${p}</li>`).join('')}</ul>
                    <p><strong>Missing Skills:</strong></p>
                    <ul>${im.missing_skills.map(p => `<li>${p}</li>`).join('')}</ul>
                    <p><strong>Red Flags:</strong></p>
                    <ul>${im.red_flags.map(p => `<li>${p}</li>`).join('')}</ul>
                    <p><strong>Recommendations:</strong></p>
                    <ul>${im.recommendations.map(p => `<li>${p}</li>`).join('')}</ul>
                    <p><strong>Why It's Better Now:</strong> ${tailorData.improvement_explanation}</p>
                `;

                tailoredResumeOutput.value = tailorData.tailored_resume || "";
            } catch (err) {
                console.error(err);
                setStatus(tailorStatusEl, "Error during tailoring process.", "error");
            }
        });

        // Copy tailored resume
        copyTailoredResumeBtn.addEventListener('click', async () => {
            if (!tailoredResumeOutput.value) {
                setStatus(tailorStatusEl, "No tailored resume to copy yet.", "error");
                return;
            }
            try {
                await navigator.clipboard.writeText(tailoredResumeOutput.value);
                setStatus(tailorStatusEl, "Tailored resume copied to clipboard.", "success");
            } catch (err) {
                console.error(err);
                setStatus(tailorStatusEl, "Failed to copy. Please copy manually.", "error");
            }
        });

        // Download tailored resume
        downloadTailoredResumeBtn.addEventListener('click', () => {
            const text = tailoredResumeOutput.value;
            if (!text) {
                setStatus(tailorStatusEl, "No tailored resume to download yet.", "error");
                return;
            }
            downloadTextAsFile(text, 'tailored-resume.txt');
            setStatus(tailorStatusEl, "Downloaded tailored-resume.txt", "success");
        });

        // =============================
        // Saved Resume Logic
        // =============================
        uploadSavedResumeBtn.addEventListener("click", async () => {
            if (!authToken) {
                setStatus(savedResumeStatus, "Please log in first.", "error");
                return;
            }

            const file = savedResumeFile.files[0];
            if (!file) {
                setStatus(savedResumeStatus, "Please choose a file.", "error");
                return;
            }

            const formData = new FormData();
            formData.append("file", file);

            setStatus(savedResumeStatus, "Uploading...", "loading");

            try {
                const res = await fetch("/user/resume/upload", {
                    method: "POST",
                    headers: getAuthHeaders(),
                    body: formData
                });

                const data = await res.json();

                if (!res.ok) {
                    setStatus(savedResumeStatus, data.detail || "Upload failed.", "error");
                    return;
                }

                setStatus(savedResumeStatus, "Resume saved successfully!", "success");
            } catch (err) {
                console.error(err);
                setStatus(savedResumeStatus, "Error uploading resume.", "error");
            }
        });


        // ======== Resume Enhancer Logic ========
        resumeForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            resultsEl.innerHTML = "";
            setStatus(resumeStatusEl, "", null);

            const file = resumeFileInput.files[0];
            if (!file) {
                setStatus(resumeStatusEl, "Please select a resume file first.", "error");
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            setStatus(resumeStatusEl, "Uploading & enhancing your resume...", "loading");

            try {
                const response = await fetch('/resume/improve', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    const msg = errorData && errorData.detail
                        ? errorData.detail
                        : "Something went wrong. Please try again.";
                    setStatus(resumeStatusEl, "Error: " + msg, "error");
                    return;
                }

                const data = await response.json();
                if (!data.versions || !Array.isArray(data.versions)) {
                    setStatus(resumeStatusEl, "Unexpected response format from server.", "error");
                    return;
                }

                setStatus(resumeStatusEl, "Done. Scroll down to review your enhanced versions.", "success");

                resultsEl.innerHTML = "";
                data.versions.forEach((text, index) => {
                    const container = document.createElement('div');
                    container.className = "version-card";

                    const header = document.createElement('div');
                    header.className = "version-header";

                    const title = document.createElement('h3');
                    title.className = "version-title";
                    title.textContent = "Version " + (index + 1);

                    header.appendChild(title);
                    container.appendChild(header);

                    const textarea = document.createElement('textarea');
                    textarea.rows = 12;
                    textarea.value = text;

                    const btnRow = document.createElement('div');
                    btnRow.className = "btn-row";

                    const copyButton = document.createElement('button');
                    copyButton.type = "button";
                    copyButton.textContent = "Copy";
                    copyButton.className = "btn btn-secondary";

                    copyButton.addEventListener('click', async () => {
                        try {
                            await navigator.clipboard.writeText(textarea.value);
                            setStatus(resumeStatusEl, "Copied version " + (index + 1) + " to clipboard.", "success");
                        } catch (err) {
                            console.error(err);
                            setStatus(resumeStatusEl, "Failed to copy. Please copy manually.", "error");
                        }
                    });

                    const downloadButton = document.createElement('button');
                    downloadButton.type = "button";
                    downloadButton.textContent = "Download .txt";
                    downloadButton.className = "btn btn-secondary";
                    downloadButton.style.marginLeft = "8px";

                    downloadButton.addEventListener('click', () => {
                        const filename = `resume-version-${index + 1}.txt`;
                        downloadTextAsFile(textarea.value, filename);
                        setStatus(resumeStatusEl, "Downloaded " + filename, "success");
                    });

                    btnRow.appendChild(copyButton);
                    btnRow.appendChild(downloadButton);

                    container.appendChild(textarea);
                    container.appendChild(btnRow);

                    resultsEl.appendChild(container);
                });
            } catch (err) {
                console.error(err);
                setStatus(resumeStatusEl, "Network error. Please try again.", "error");
            }
        });

        // ======== Cover Letter Generator Logic ========
        generateCoverLetterBtn.addEventListener('click', async () => {
            const resume_text = resumeForCoverLetterInput.value.trim();
            const job_description = jobDescriptionInput.value.trim();

            setStatus(coverLetterStatusEl, "", null);

            if (!resume_text || !job_description) {
                setStatus(coverLetterStatusEl, "Please provide both resume text and job description.", "error");
                return;
            }

            setStatus(coverLetterStatusEl, "Generating cover letter...", "loading");

            try {
                const response = await fetch('/cover-letter/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ resume_text, job_description }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    const msg = errorData && errorData.detail
                        ? errorData.detail
                        : "Failed to generate cover letter. Please try again.";
                    setStatus(coverLetterStatusEl, "Error: " + msg, "error");
                    return;
                }

                const data = await response.json();
                coverLetterOutput.value = data.cover_letter || "";
                setStatus(coverLetterStatusEl, "Done. Review and refine your cover letter as needed.", "success");
            } catch (err) {
                console.error(err);
                setStatus(coverLetterStatusEl, "Failed to generate cover letter. Please try again.", "error");
            }
        });

        copyCoverLetterBtn.addEventListener('click', async () => {
            if (!coverLetterOutput.value) {
                setStatus(coverLetterStatusEl, "No cover letter to copy yet.", "error");
                return;
            }
            try {
                await navigator.clipboard.writeText(coverLetterOutput.value);
                setStatus(coverLetterStatusEl, "Cover letter copied to clipboard.", "success");
            } catch (err) {
                console.error(err);
                setStatus(coverLetterStatusEl, "Failed to copy. Please copy manually.", "error");
            }
        });

        downloadCoverLetterBtn.addEventListener('click', () => {
            const text = coverLetterOutput.value;
            if (!text) {
                setStatus(coverLetterStatusEl, "No cover letter to download yet.", "error");
                return;
            }
            downloadTextAsFile(text, 'cover-letter.txt');
            setStatus(coverLetterStatusEl, "Downloaded cover-letter.txt", "success");
        });
    </script>
</body>
</html>
    """
