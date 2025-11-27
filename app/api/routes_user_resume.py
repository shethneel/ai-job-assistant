# app/api/routes_user_resume.py

from datetime import datetime

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlmodel import Session, select

from app.database import get_db
from app.models import Resume, User
from app.schemas import ResumeRead, ResumeRenameRequest
from app.services.resume_extraction import extract_text_from_file
from app.api.routes_auth import get_current_user

router = APIRouter(prefix="/user/resume", tags=["user-resume"])


@router.post("/upload", response_model=ResumeRead)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ResumeRead:
    """
    Upload or replace the user's current resume.

    Right now we keep a single saved resume per user.
    (You’re still within the "max 3 resumes" limit.)
    If a resume already exists, we update it in-place.
    """

    # 1) Extract text from the uploaded file
    try:
        extracted_text = await extract_text_from_file(file)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not read resume file. Please upload a valid document.",
        ) from exc

    # 2) Check if user already has a resume
    statement = select(Resume).where(Resume.user_id == current_user.id)
    existing_resume = db.exec(statement).first()

    now = datetime.utcnow()

    if existing_resume:
        # Update existing record
        existing_resume.original_filename = file.filename or existing_resume.original_filename
        existing_resume.content_type = file.content_type
        existing_resume.extracted_text = extracted_text
        existing_resume.updated_at = now

        db.add(existing_resume)
        db.commit()
        db.refresh(existing_resume)
        return existing_resume

    # 3) Create a new resume record
    new_resume = Resume(
        user_id=current_user.id,
        original_filename=file.filename or "resume",
        content_type=file.content_type,
        extracted_text=extracted_text,
        created_at=now,
        updated_at=now,
    )

    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    return new_resume


@router.get("", response_model=ResumeRead)
def get_resume(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ResumeRead:
    """
    Get the single saved resume for the current user.
    """
    statement = select(Resume).where(Resume.user_id == current_user.id)
    resume = db.exec(statement).first()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume saved for this user.",
        )

    return resume


@router.patch("/rename", response_model=ResumeRead)
def rename_resume(
    payload: ResumeRenameRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ResumeRead:
    """
    Rename the user's current saved resume.

    This only changes original_filename (the display name),
    not the text or the underlying file.

    In the future, if you support multiple resumes per user,
    you can extend this to accept a specific resume_id.
    """
    new_name = payload.new_filename.strip()
    if not new_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New resume name cannot be empty.",
        )

    statement = select(Resume).where(Resume.user_id == current_user.id)
    resume = db.exec(statement).first()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume saved for this user to rename.",
        )

    resume.original_filename = new_name
    resume.updated_at = datetime.utcnow()

    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume
