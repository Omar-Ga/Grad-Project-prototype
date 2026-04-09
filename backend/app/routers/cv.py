from __future__ import annotations

from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.config import BASE_DIR, CHUNK_SIZE_BYTES, MAX_PDF_SIZE_BYTES, UPLOAD_DIR

router = APIRouter()


@router.post("/api/cv/upload")
async def upload_cv(file: UploadFile = File(...)) -> dict[str, str | int]:
    file_name = file.filename or ""

    if not file_name.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    if file.content_type and file.content_type not in {"application/pdf", "application/octet-stream"}:
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF file.")

    stored_name = f"{uuid4().hex}.pdf"
    save_path = UPLOAD_DIR / stored_name
    total_size = 0

    try:
        with save_path.open("wb") as destination:
            while True:
                chunk = await file.read(CHUNK_SIZE_BYTES)
                if not chunk:
                    break

                total_size += len(chunk)
                if total_size > MAX_PDF_SIZE_BYTES:
                    raise HTTPException(status_code=413, detail="File too large. Maximum size is 15MB.")

                destination.write(chunk)
    except HTTPException:
        if save_path.exists():
            save_path.unlink()
        raise
    finally:
        await file.close()

    return {
        "message": "PDF uploaded successfully.",
        "original_name": file_name,
        "stored_name": stored_name,
        "size_bytes": total_size,
        "saved_path": str(save_path.relative_to(BASE_DIR)),
    }
