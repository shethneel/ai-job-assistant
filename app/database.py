# app/database.py
import os
from sqlmodel import SQLModel, create_engine, Session

# Render sets the env var RENDER=true (or some value) for web services
RUNNING_ON_RENDER = os.getenv("RENDER")

if RUNNING_ON_RENDER:
    # On Render: use persistent disk at /data
    database_path = "/data/app.db"
else:
    # Local dev: regular SQLite file in project root
    database_path = "./app.db"

DATABASE_URL = f"sqlite:///{database_path}"

# Single SQLite engine for both local and Render
engine = create_engine(
    DATABASE_URL,
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
