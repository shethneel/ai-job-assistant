from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlmodel import Session, select

from app.database import get_db
from app.models import Resume, User
from app.schemas import ResumeRead, ResumeRenameRequest
from app.services.resume_extraction import extract_text_from_file
from app.api.routes_auth import get_current_user

router = APIRouter(prefix="/user/resume", tags=["user-resume"])

MAX_RESUMES_PER_USER = 3


@router.post("/upload", response_model=ResumeRead)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ResumeRead:
    """
    Upload a new saved resume for the user.

    Rules:
    - Each user can have up to MAX_RESUMES_PER_USER resumes saved.
    - If the user already has 3 resumes, we block the upload and ask them
      to delete one from the "My Resumes" page first.
    - The *most recently updated* resume is treated as the "primary" one and
      is what /user/resume (GET) returns for Job Fit / Cover Letter.
    """

    # 1) Extract text from the uploaded file
    try:
        extracted_text = await extract_text_from_file(file)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not read resume file. Please upload a valid document.",
        ) from exc

    # 2) How many resumes does this user already have?
    statement = select(Resume).where(Resume.user_id == current_user.id)
    existing_resumes = db.exec(statement).all()

    if len(existing_resumes) >= MAX_RESUMES_PER_USER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"You already have {MAX_RESUMES_PER_USER} saved resumes. "
                "Please delete one from My Resumes before saving a new one."
            ),
        )

    now = datetime.utcnow()

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
def get_primary_resume(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ResumeRead:
    """
    Get the *primary* saved resume for the current user.

    We define "primary" as the most recently updated resume.
    This keeps Job Fit / Cover Letter behaviour unchanged: they still
    call /user/resume and get exactly one resume.
    """
    statement = (
        select(Resume)
        .where(Resume.user_id == current_user.id)
        .order_by(Resume.updated_at.desc())
    )
    resume = db.exec(statement).first()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume saved for this user.",
        )

    return resume


@router.get("/list", response_model=List[ResumeRead])
def list_resumes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[ResumeRead]:
    """
    Return up to MAX_RESUMES_PER_USER resumes for the current user,
    ordered by most-recently-updated first.

    This is used by the My Resumes page to show all saved resumes.
    """
    statement = (
        select(Resume)
        .where(Resume.user_id == current_user.id)
        .order_by(Resume.updated_at.desc())
    )
    resumes = db.exec(statement).all()
    return resumes


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    """
    Delete a specific resume by ID for the current user.

    Used when the user wants to free up a slot (max 3 resumes).
    """
    statement = select(Resume).where(
        Resume.id == resume_id, Resume.user_id == current_user.id
    )
    resume = db.exec(statement).first()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found.",
        )

    db.delete(resume)
    db.commit()
    # 204 No Content – nothing to return


@router.patch("/rename", response_model=ResumeRead)
def rename_resume(
    payload: ResumeRenameRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ResumeRead:
    """
    Rename the user's *primary* resume.

    We still keep this endpoint simple (no ID) so it only renames the
    most recently updated resume – effectively, the one the user is
    currently working with in the flows.
    """
    new_name = payload.new_filename.strip()
    if not new_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New resume name cannot be empty.",
        )

    statement = (
        select(Resume)
        .where(Resume.user_id == current_user.id)
        .order_by(Resume.updated_at.desc())
    )
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
