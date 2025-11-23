# app/database.py
import os
from sqlmodel import SQLModel, create_engine, Session

# Use Supabase Postgres in production, SQLite for local dev
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Supabase (or any other Postgres)
    engine = create_engine(DATABASE_URL, echo=False)
else:
    # Local dev fallback (SQLite)
    engine = create_engine(
        "sqlite:///./app.db",
        echo=False,
        connect_args={"check_same_thread": False},
    )


def init_db() -> None:
    """
    Create all tables if they don't exist yet.
    Called once on startup (both locally and on Render).
    """
    from app import models  # make sure models are imported

    SQLModel.metadata.create_all(engine)


def get_db():
    """FastAPI dependency for DB sessions."""
    with Session(engine) as session:
        yield session
