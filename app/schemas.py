# app/schemas.py
from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class ResumeRead(BaseModel):
    id: int
    original_filename: str
    content_type: str | None
    extracted_text: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ResumeRenameRequest(BaseModel):
    """
    Payload for renaming a saved resume.
    We only change the display name (original_filename),
    not the actual file contents.
    """
    new_filename: str

class UserProfileBase(BaseModel):
    experience_level: Optional[str] = None
    preferred_roles: Optional[str] = None
    preferred_industries: Optional[str] = None
    preferred_locations: Optional[str] = None
    skills: Optional[str] = None
    work_authorization: Optional[str] = None
    career_goal: Optional[str] = None


class UserProfileCreate(UserProfileBase):
    pass


class UserProfileUpdate(UserProfileBase):
    # all fields optional, so we can do partial updates
    pass


class UserProfileRead(UserProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # so we can return SQLModel instances directly