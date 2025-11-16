# app/api/routes_user_resume.py

from datetime import datetime
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlmodel import Session, select

from app.database import get_db
from app.models import Resume, User
from app.schemas import ResumeRead
from app.services.resume_extraction import extract_text_from_file
from app.api.routes_auth import get_current_user

router = APIRouter(prefix="/user/resume", tags=["user-resume"])


@router.post("/upload", response_model=ResumeRead)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # extract text
    extracted_text = await extract_text_from_file(file)

    # Check if user already has a resume
    statement = select(Resume).where(Resume.user_id == current_user.id)
    existing_resume = db.exec(statement).first()

    if existing_resume:
        # update existing record
        existing_resume.extracted_text = extracted_text
        existing_resume.original_filename = file.filename
        existing_resume.content_type = file.content_type
        existing_resume.updated_at = datetime.utcnow()

        db.add(existing_resume)
        db.commit()
        db.refresh(existing_resume)
        return existing_resume

    # create new resume
    new_resume = Resume(
        user_id=current_user.id,
        extracted_text=extracted_text,
        original_filename=file.filename,
        content_type=file.content_type,
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    return new_resume


@router.get("", response_model=ResumeRead)
def get_resume(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    statement = select(Resume).where(Resume.user_id == current_user.id)
    resume = db.exec(statement).first()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume saved for this user.",
        )

    return resume
