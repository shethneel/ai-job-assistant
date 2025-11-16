# app/api/routes_tailored_resume.py

from __future__ import annotations

import json
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from openai import OpenAI

from app.database import get_db
from app.models import User, Resume
from app.api.routes_auth import get_current_user
from app.api.routes_job_match import JobMatchResponse  # reuse existing schema

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/resume", tags=["resume"])

client = OpenAI()
MODEL_NAME = "gpt-4o-mini"


def clean_json_output(raw: str) -> str:
    """
    Clean model output to extract the JSON object:
    - strip backticks / ```json fences
    - slice from first '{' to last '}'
    """
    if not raw:
        return raw

    text = raw.strip()

    # Remove ``` or ```json fences if present
    if text.startswith("```"):
        # Strip all backticks
        text = text.strip("`").strip()
        # If it starts with 'json', remove that word
        if text.lower().startswith("json"):
            text = text[4:].lstrip()

    # Extract from first '{' to last '}'
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        text = text[start : end + 1]

    return text


class TailorFromSavedRequest(BaseModel):
    job_description: str


class TailorFromSavedResponse(BaseModel):
    improved_match: JobMatchResponse
    tailored_resume: str
    improvement_explanation: str


@router.post("/tailor-from-saved", response_model=TailorFromSavedResponse)
async def tailor_resume_from_saved(
    payload: TailorFromSavedRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TailorFromSavedResponse:
    
    # DAILY LIMIT CHECK
    from app.services.usage_limits import check_and_record_usage
    check_and_record_usage(db, current_user.id, "tailor_saved")

    """
    Uses the logged-in user's saved resume + a job description to:
    - analyze current fit
    - generate a tailored resume
    - re-analyze and return the improved match + explanation + tailored resume
    """

    # 1) Fetch saved resume
    resume: Resume | None = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.id.desc())
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No saved resume found for this user.",
        )

    resume_text = resume.extracted_text
    job_description = payload.job_description.strip()

    if not job_description:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description cannot be empty.",
        )

    # 2) Build prompt
    prompt = f"""
You are an expert technical resume writer specializing in job alignment.

You will receive:
- The candidate’s FULL current resume (raw text)
- A job description

Your job is to produce a **tailored version of the resume** that highlights relevant skills and experience **without removing any actual content**.

VERY IMPORTANT RULES (MUST FOLLOW):
- Do NOT remove any experience, projects, or education.
- Do NOT delete or omit any technical skills, tools, languages, or technologies listed.
- Do NOT shorten the resume significantly. The tailored version must have a **similar word count** to the original (±10% max).
- You MAY rewrite, reorganize, and emphasize parts for clarity and alignment.
- You MAY expand on existing skills only if they already appear in the resume. Do NOT invent new experience.
- You MAY reorder bullet points to put job-relevant ones earlier.
- You MAY add job-aligned phrasing ONLY if it is truthful and consistent with existing content.

Your output must contain ONLY valid JSON in this exact format:
{{
  "improved_match": {{
    "match_score": <integer 0-100>,
    "strong_points": ["..."],
    "missing_skills": ["..."],
    "red_flags": ["..."],
    "recommendations": ["..."]
  }},
  "tailored_resume": "...FULL RESUME TEXT...",
  "improvement_explanation": "..."
}}

Current Resume:
\"\"\"{resume_text}\"\"\"

Job Description:
\"\"\"{job_description}\"\"\"
"""

    # 3) Call OpenAI
    try:
        response = client.responses.create(
            model=MODEL_NAME,
            input=prompt,
        )
    except Exception as exc:
        logger.exception("OpenAI API call failed for tailor-from-saved")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate tailored resume. Please try again later.",
        ) from exc

    raw_output = response.output_text
    cleaned = clean_json_output(raw_output)

    # 4) Parse JSON
    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        logger.exception("Failed to parse JSON from OpenAI tailor response: %s", raw_output)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to parse AI response while tailoring resume.",
        ) from exc

    try:
        improved_match_raw = data["improved_match"]
        tailored_resume = data["tailored_resume"]
        improvement_explanation = data["improvement_explanation"]
    except KeyError as exc:
        logger.exception("Missing keys in tailor response JSON: %s", data)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI response was missing expected fields.",
        ) from exc

    improved_match = JobMatchResponse(**improved_match_raw)

    return TailorFromSavedResponse(
        improved_match=improved_match,
        tailored_resume=tailored_resume,
        improvement_explanation=improvement_explanation,
    )
