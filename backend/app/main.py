from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import init_db
from app.routers import cv, health, interview, recruiter

app = FastAPI(title="AI Career Platform API")

# Keep CORS permissive for prototype speed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(cv.router)
app.include_router(recruiter.router)
app.include_router(interview.router)

init_db()
