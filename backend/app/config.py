from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

MAX_PDF_SIZE_BYTES = 15 * 1024 * 1024
CHUNK_SIZE_BYTES = 1024 * 1024

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads" / "cv"
DATABASE_PATH = BASE_DIR / "app.db"

load_dotenv(BASE_DIR / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite-preview")
GEMINI_THINKING_LEVEL = os.getenv("GEMINI_THINKING_LEVEL", "high")
GEMINI_INTERVIEW_MODEL = os.getenv("GEMINI_INTERVIEW_MODEL", "gemini-3.1-flash-lite-preview")
GEMINI_INTERVIEW_THINKING_LEVEL = os.getenv("GEMINI_INTERVIEW_THINKING_LEVEL", "high")

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
