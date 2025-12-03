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

class UserProfile(SQLModel, table=True):
    """
    1:1 career profile for each user.
    """
    id: Optional[int] = Field(default=None, primary_key=True)

    # one profile per user
    user_id: int = Field(
        foreign_key="user.id",
        unique=True,
        index=True,
        description="FK to User.id – one profile per user",
    )

    # editable fields
    experience_level: Optional[str] = None  # "student", "recent_grad", etc.
    preferred_roles: Optional[str] = None   # comma-separated
    preferred_industries: Optional[str] = None
    preferred_locations: Optional[str] = None
    skills: Optional[str] = None
    work_authorization: Optional[str] = None
    career_goal: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
