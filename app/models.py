# app/models.py

from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # relationship
    resume: "Resume" = Relationship(back_populates="user")


class Resume(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")

    original_filename: str
    content_type: str | None
    extracted_text: str

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # relationship
    user: User = Relationship(back_populates="resume")

class UsageLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)
    action: str = Field(index=True)  # e.g. "resume_improve", "job_match_saved"
    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        index=True,
    )