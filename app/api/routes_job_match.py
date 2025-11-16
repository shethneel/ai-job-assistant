import json
import logging
from typing import List, Optional
from pydantic import BaseModel

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from openai import OpenAI

from app.database import get_db
from app.models import Resume, User
from app.api.routes_auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/job-match", tags=["job-match"])

# Reuse the same OpenAI client + model as other endpoints
client = OpenAI()
MODEL_NAME = "gpt-4o-mini"


class JobMatchRequest(BaseModel):
    job_description: str


class JobMatchResponse(BaseModel):
    match_score: int
    strong_points: List[str]
    missing_skills: List[str]
    red_flags: List[str]
    recommendations: List[str]


def clean_json_output(raw_output: str) -> str:
    """
    Clean model output so it's valid JSON:
    - Strip ``` and ```json fences if present
    - Trim extra text before/after the main JSON object
    """
    text = raw_output.strip()

    # Strip code fences like ```json ... ```
    if text.startswith("```"):
        # remove leading/trailing backticks
        text = text.strip("`")
        # if it starts with json\n, drop that prefix
        if text.lower().startswith("json"):
            text = text[4:].lstrip()  # remove 'json' and following newline/space

    # Keep only the first JSON object between { and }
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        text = text[start : end + 1]

    return text


@router.post("/analyze-from-saved", response_model=JobMatchResponse)
async def analyze_from_saved(
    payload: JobMatchRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> JobMatchResponse:
    
    from app.services.usage_limits import check_and_record_usage, DAILY_LIMITS
    check_and_record_usage(
        db,
        current_user.id,
        "job_match_saved",
        DAILY_LIMITS["job_match_saved"],
    )

    # 1) Fetch saved resume for this user
    resume: Optional[Resume] = (
        db.query(Resume).filter(Resume.user_id == current_user.id).first()
    )

    if resume is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No saved resume found for this user.",
        )

    resume_text = resume.extracted_text
    job_description = payload.job_description

    # 2) Build prompt
    prompt = f"""
You are an expert recruiter and career coach. You will receive a candidate's resume and a job description. Analyze how well the resume fits this job.

Return ONLY valid JSON in this exact format with no extra text:
{{
  "match_score": <integer 0-100>,
  "strong_points": ["..."],
  "missing_skills": ["..."],
  "red_flags": ["..."],
  "recommendations": ["..."]
}}

Resume:
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
        raw_output = response.output_text
    except Exception as exc:
        logger.exception("OpenAI API call failed for job match")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to analyze job match. Please try again later.",
        ) from exc

    # 4) Clean + parse JSON
    try:
        cleaned = clean_json_output(raw_output)
        data = json.loads(cleaned)
    except Exception as exc:
        logger.exception("Failed to parse job match JSON output: %s", raw_output)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to parse AI response for job match.",
        ) from exc

    # 5) Map into response model (with safe defaults)
    try:
        return JobMatchResponse(
            match_score=int(data.get("match_score", 0)),
            strong_points=data.get("strong_points", []) or [],
            missing_skills=data.get("missing_skills", []) or [],
            red_flags=data.get("red_flags", []) or [],
            recommendations=data.get("recommendations", []) or [],
        )
    except Exception as exc:
        logger.exception("Failed to map AI job match output to schema: %s", data)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to format job match analysis.",
        ) from exc
