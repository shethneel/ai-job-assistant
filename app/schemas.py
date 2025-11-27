# app/schemas.py

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
