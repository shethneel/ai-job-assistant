# app/database.py
import os
from sqlmodel import SQLModel, create_engine, Session

# DATABASE_URL will come from Supabase in production (Railway env var)
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Supabase Postgres / any external DB
    engine = create_engine(DATABASE_URL, echo=False)
else:
    # Local dev fallback – simple SQLite file in the repo
    engine = create_engine(
        "sqlite:///./app.db",
        echo=False,
        connect_args={"check_same_thread": False},
    )


def init_db() -> None:
    """
    Create all tables if they don't exist yet.
    This will run against SQLite locally, and Postgres on Railway
    (as long as DATABASE_URL is set).
    """
    from app import models  # make sure models are imported

    SQLModel.metadata.create_all(engine)


def get_db():
    """
    Dependency for FastAPI routes.
    Usage: Depends(get_db)
    """
    with Session(engine) as session:
        yield session
