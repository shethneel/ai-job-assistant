# app/services/resume_extraction.py

from fastapi import HTTPException, status, UploadFile
from docx import Document
from pypdf import PdfReader


async def extract_text_from_file(file: UploadFile) -> str:
    filename = file.filename.lower()

    content = await file.read()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    # TXT
    if filename.endswith(".txt"):
        try:
            return content.decode("utf-8")
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not decode .txt file as UTF-8."
            )

    # DOCX
    if filename.endswith(".docx"):
        try:
            from io import BytesIO
            doc = Document(BytesIO(content))
            full_text = "\n".join([p.text for p in doc.paragraphs])
            return full_text
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not extract text from .docx file."
            )

    # PDF
    if filename.endswith(".pdf"):
        try:
            from io import BytesIO
            reader = PdfReader(BytesIO(content))
            pages = [page.extract_text() or "" for page in reader.pages]
            text = "\n".join(pages).strip()

            if not text:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Could not extract text from PDF. It may be scanned."
                )
            return text
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not extract text from PDF."
            )

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid file type. Only .txt, .docx, and .pdf are allowed."
    )
