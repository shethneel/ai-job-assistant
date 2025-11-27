from typing import List
import json
import logging
import io

from fastapi import APIRouter, UploadFile, File, HTTPException, status
from pydantic import BaseModel
from openai import OpenAI
from docx import Document  # for .docx parsing
from pypdf import PdfReader  # for .pdf parsing

logger = logging.getLogger(__name__)

router = APIRouter()

# OpenAI client (uses OPENAI_API_KEY from environment)
client = OpenAI()

# Cheap but good model
MODEL_NAME = "gpt-4.1-mini"  # you can switch back to "gpt-4o-mini" if you prefer


class ResumeImproveResponse(BaseModel):
    versions: List[str]


async def extract_text_from_file(file: UploadFile) -> str:
    """
    Read the uploaded file and return its text content.

    Supports:
    - .txt  (UTF-8 text)
    - .docx (Word document via python-docx)
    - .pdf  (text-based PDFs via pypdf)
    """
    filename = (file.filename or "").lower()

    # Read all bytes once
    file_bytes = await file.read()

    if not file_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file appears to be empty.",
        )

    text: str

    # Handle .txt files
    if filename.endswith(".txt") or file.content_type == "text/plain":
        try:
            text = file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not decode text file as UTF-8.",
            )

    # Handle .docx files
    elif filename.endswith(".docx") or file.content_type in (
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
    ):
        try:
            doc = Document(io.BytesIO(file_bytes))
            # Join all paragraph texts into a single string
            text = "\n".join(p.text for p in doc.paragraphs)
        except Exception:
            logger.exception("Failed to read DOCX file")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not read DOCX file.",
            )

    # Handle .pdf files (text-based PDFs)
    elif filename.endswith(".pdf") or file.content_type == "application/pdf":
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            page_texts = []
            for page in reader.pages:
                page_text = page.extract_text() or ""
                page_texts.append(page_text)
            text = "\n".join(page_texts)
        except Exception:
            logger.exception("Failed to read PDF file")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not read PDF file.",
            )

        # If pypdf couldn't extract any text, likely a scanned/ image-only PDF
        if not text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not extract text from PDF. It may be a scanned document.",
            )

    # Unsupported type
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only .txt, .docx, and .pdf files are supported for now.",
        )

    # Generic empty-text check for txt/docx
    if not text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file appears to be empty.",
        )

    return text


@router.post("/improve", response_model=ResumeImproveResponse)
async def improve_resume(file: UploadFile = File(...)) -> ResumeImproveResponse:
    # ✅ 1. Extract resume text from .txt, .docx, or .pdf
    resume_text = await extract_text_from_file(file)

    # ✅ 2. Build prompt for OpenAI
    prompt = f"""
You are an expert resume writer.

You will receive a full resume as raw text.

Your job is to create THREE improved versions of this resume that are optimized for professional job applications.

VERY IMPORTANT RULES:
- Do NOT remove any experience, projects, or education from the original.
- Do NOT drop any important technical tools, languages, or technologies mentioned.
- You may rewrite sentences for clarity and impact, but you must keep all the original content and details.
- Never invent fake companies, fake degrees, or fake job titles.
- Keep dates and factual information unchanged.

Return your answer as a strict JSON object with this exact shape:

{{
  "version1": "First improved resume as a single plain text string",
  "version2": "Second improved resume as a single plain text string",
  "version3": "Third improved resume as a single plain text string"
}}

The values must be plain text resumes (multi-line text is OK).
Do not include any markdown, backticks, bullet symbols like • in the JSON keys,
and do not output anything outside the JSON object.

Here is the original resume:

\"\"\"{resume_text}\"\"\"
"""

    # ✅ 3. Call OpenAI using chat.completions with JSON response_format
    try:
        completion = client.chat.completions.create(
            model=MODEL_NAME,
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that outputs strictly valid JSON.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.4,
        )
    except Exception as e:
        logger.exception("Error while calling OpenAI for resume improvement: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate improved resume. Please try again.",
        ) from e

    # ✅ 4. Get raw JSON string from the model
    raw_output = completion.choices[0].message.content or ""
    cleaned = raw_output.strip()

    # Defensive cleanup if the model ever wraps in ```json ... ```
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()
        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()

    # Also trim to outermost {...} just in case
    if "{" in cleaned and "}" in cleaned:
        cleaned = cleaned[cleaned.find("{") : cleaned.rfind("}") + 1]

    logger.info("Raw AI JSON for resume improve: %s", cleaned)

    # ✅ 5. Parse JSON from the cleaned output
    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        logger.error("Failed to parse model JSON output: %s", cleaned)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to parse AI response. Please try again.",
        )

    version1 = str(data.get("version1", "")).strip()
    version2 = str(data.get("version2", "")).strip()
    version3 = str(data.get("version3", "")).strip()

    versions = [v for v in (version1, version2, version3) if v]

    if len(versions) != 3:
        logger.error("AI response missing one or more versions: %s", data)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI did not return three improved resume versions.",
        )

    # ✅ 6. Return in existing format expected by the frontend
    return ResumeImproveResponse(versions=versions)
