# app/database.py
import os
from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = os.getenv("DATABASE_URL")

# Detect if using PostgreSQL
if DATABASE_URL:
    # Production (Postgres)
    engine = create_engine(
        DATABASE_URL,
        echo=True,
    )
else:
    # Local development (SQLite)
    engine = create_engine(
        "sqlite:///./app.db",
        echo=True,
        connect_args={"check_same_thread": False},
    )


def init_db():
    """Create all tables if they do not exist."""
    SQLModel.metadata.create_all(engine)


def get_db():
    """Provide a DB session to FastAPI endpoints."""
    with Session(engine) as session:
        yield session
