from typing import Any, Dict
import json
import logging

from app.services.usage_limits import check_and_record_usage
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from openai import OpenAI
from sqlmodel import Session, select

from app.database import get_db
from app.models import User, Resume
from app.api.routes_auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/cover-letter", tags=["cover-letter"])

# OpenAI client (uses OPENAI_API_KEY from environment)
client = OpenAI()
MODEL_NAME = "gpt-4o-mini"


class CoverLetterRequest(BaseModel):
    resume_text: str
    job_description: str


class CoverLetterFromSavedRequest(BaseModel):
    job_description: str


class CoverLetterResponse(BaseModel):
    cover_letter: str


def _clean_and_parse_cover_letter_json(raw_output: str) -> Dict[str, Any]:
    """
    Clean the model output and parse JSON safely.
    Expected final shape: {"cover_letter": "..."}
    """
    clean_output = raw_output.strip()

    # Strip ``` or ```json fences if model added them
    if clean_output.startswith("```"):
        lines = clean_output.splitlines()
        stripped_lines = [
            line for line in lines if not line.strip().startswith("```")
        ]
        clean_output = "\n".join(stripped_lines).strip()

    # Grab the JSON object between first { and last }
    if "{" in clean_output and "}" in clean_output:
        start = clean_output.find("{")
        end = clean_output.rfind("}")
        clean_output = clean_output[start : end + 1]

    try:
        data = json.loads(clean_output)
    except json.JSONDecodeError as exc:
        logger.exception("Failed to decode JSON from cover letter output: %s", clean_output)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate cover letter. Please try again later.",
        ) from exc

    return data


def _generate_cover_letter_text(
    resume_text: str,
    job_description: str,
) -> str:
    """
    Shared helper that:
    - Builds the prompt
    - Calls OpenAI
    - Parses JSON
    - Returns the cover letter string
    """
    prompt = f"""
You are an expert career coach and professional writer.

Using the resume and job description below, generate a concise, professional cover letter tailored specifically to this job.

Requirements:
- Keep it under 400 words.
- Use a natural, confident tone.
- Clearly connect the candidate's experience and skills to the job requirements.
- Do NOT invent fake experience or skills that are not present in the resume.
- Make it ready to be sent as a real cover letter.

Return ONLY valid JSON in the format:
{{
  "cover_letter": "..."
}}

Do not include backticks or code fences.

RESUME:
\"\"\"{resume_text}\"\"\"

JOB DESCRIPTION:
\"\"\"{job_description}\"\"\"
"""

    # Call OpenAI
    try:
        response = client.responses.create(
            model=MODEL_NAME,
            input=prompt,
        )
    except Exception as exc:
        logger.exception("OpenAI API call failed for cover letter generation")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate cover letter. Please try again later.",
        ) from exc

    raw_output = response.output_text
    logger.info("Raw cover letter model output: %s", raw_output)

    # Clean + parse JSON
    try:
        data = _clean_and_parse_cover_letter_json(raw_output)
        cover_letter = data["cover_letter"]
    except (KeyError, TypeError) as exc:
        logger.exception(
            "Cover letter JSON missing expected 'cover_letter' field: %s", raw_output
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate cover letter. Please try again later.",
        ) from exc

    return cover_letter


@router.post("/generate", response_model=CoverLetterResponse)
async def generate_cover_letter(
    payload: CoverLetterRequest,
) -> CoverLetterResponse:
    """
    Generate a cover letter from explicit resume_text + job_description.
    """
    cover_letter = _generate_cover_letter_text(
        resume_text=payload.resume_text,
        job_description=payload.job_description,
    )
    return CoverLetterResponse(cover_letter=cover_letter)


@router.post("/generate-from-saved", response_model=CoverLetterResponse)
async def generate_cover_letter_from_saved(
    payload: CoverLetterFromSavedRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CoverLetterResponse:
    """
    Generate a cover letter using the logged-in user's saved resume.
    Only requires job_description in the request body.
    """

    # 🔥 DAILY LIMIT CHECK (added here)
    from app.services.usage_limits import check_and_record_usage
    check_and_record_usage(db, current_user.id, "cover_letter_saved")

    # Look up the user's saved resume
    statement = select(Resume).where(Resume.user_id == current_user.id)
    resume = db.exec(statement).first()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No saved resume found for this user.",
        )

    cover_letter = _generate_cover_letter_text(
        resume_text=resume.extracted_text,
        job_description=payload.job_description,
    )

    return CoverLetterResponse(cover_letter=cover_letter)
