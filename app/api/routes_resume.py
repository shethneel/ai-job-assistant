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
MODEL_NAME = "gpt-4o-mini"


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
- The length of each version should be roughly the SAME as the original text (not significantly shorter). It's okay if it's slightly longer.
- Keep the structure as a full resume with sections (e.g., TECHNICAL SKILLS, EXPERIENCE, PROJECTS, EDUCATION).

Return them in JSON exactly as:
{{
  "version1": "...",
  "version2": "...",
  "version3": "..."
}}

Return ONLY a valid JSON object. Do not add code fences, markdown, or any explanation.

Resume text:
\"\"\"{resume_text}\"\"\"
"""

    # ✅ 3. Call OpenAI
    try:
        response = client.responses.create(
            model=MODEL_NAME,
            input=prompt,
        )
    except Exception as exc:
        logger.exception("OpenAI API call failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error while generating improved resume versions.",
        ) from exc

    # ✅ 4. Get raw text
    raw_output = response.output_text
    logger.info("Raw model output: %s", raw_output)

    # ✅ 5. Clean markdown fences if present
    clean_output = raw_output.strip()

    # If it starts with ``` (like ```json), strip those lines
    if clean_output.startswith("```"):
        lines = clean_output.splitlines()
        # Drop any lines that are just ``` or start with ```json
        stripped_lines = [
            line for line in lines if not line.strip().startswith("```")
        ]
        clean_output = "\n".join(stripped_lines).strip()

    # As an extra safety: grab just the JSON object between { and }
    if "{" in clean_output and "}" in clean_output:
        start = clean_output.find("{")
        end = clean_output.rfind("}")
        clean_output = clean_output[start : end + 1]

    # ✅ 6. Parse JSON from the cleaned output
    try:
        data = json.loads(clean_output)
        version1 = data["version1"]
        version2 = data["version2"]
        version3 = data["version3"]
    except (json.JSONDecodeError, KeyError, TypeError) as exc:
        logger.exception("Failed to parse model JSON output: %s", clean_output)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to parse AI response. Please try again.",
        ) from exc

    # ✅ 7. Return in our existing format
    return ResumeImproveResponse(
        versions=[version1, version2, version3]
    )
