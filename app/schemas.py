# app/schemas.py (OR inside routes_user_resume.py if you prefer)

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
