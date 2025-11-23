# app/main.py
from dotenv import load_dotenv

load_dotenv()

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.api.routes_health import router as health_router
from app.api.routes_resume import router as resume_router
from app.api.routes_cover_letter import router as cover_letter_router
from app.api.routes_auth import router as auth_router
from app.api.routes_user_resume import router as user_resume_router
from app.api.routes_job_match import router as job_match_router
from app.api.routes_tailored_resume import router as tailored_resume_router


def create_app() -> FastAPI:
    app = FastAPI(title="AI Job Assistant API", version="1.0.0")

    # ---------- CORS ----------
    origins_env = os.getenv("CORS_ORIGINS")
    if origins_env:
        origins = [o.strip() for o in origins_env.split(",") if o.strip()]
    else:
        # Local dev: allow everything
        origins = ["*"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ---------- Routers ----------
    app.include_router(health_router, prefix="/health")
    app.include_router(resume_router, prefix="/resume")
    app.include_router(cover_letter_router)
    app.include_router(auth_router)
    app.include_router(user_resume_router)
    app.include_router(job_match_router)
    app.include_router(tailored_resume_router)

    @app.get("/")
    async def root():
        return {"status": "ok", "message": "AI Job Assistant API"}

    return app


app = create_app()
init_db()
