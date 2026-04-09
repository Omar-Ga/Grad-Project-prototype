from __future__ import annotations

import time
from uuid import uuid4

from fastapi import APIRouter, HTTPException

from app.repositories.interview_repository import (
    create_interview_session,
    fetch_interview_session,
    fetch_recruiter_profile_snapshot,
    list_recent_interview_messages,
    persist_interview_message,
)
from app.schemas import (
    InterviewMessageRequest,
    InterviewMessageResponse,
    InterviewSessionStartRequest,
    InterviewSessionStartResponse,
)
from app.services.interview_ai import generate_interviewer_opening, generate_interviewer_reply

router = APIRouter()


@router.post("/api/interview/session/start", response_model=InterviewSessionStartResponse)
async def start_interview_session(payload: InterviewSessionStartRequest) -> InterviewSessionStartResponse:
    recruiter_session_id = payload.recruiter_session_id.strip() if payload.recruiter_session_id else None
    if recruiter_session_id == "":
        recruiter_session_id = None

    profile = fetch_recruiter_profile_snapshot(recruiter_session_id)
    assistant_message = generate_interviewer_opening(profile)

    interview_session_id = uuid4().hex
    create_interview_session(
        interview_session_id=interview_session_id,
        recruiter_session_id=recruiter_session_id,
        initial_message=assistant_message,
    )

    return InterviewSessionStartResponse(
        session_id=interview_session_id,
        recruiter_session_id=recruiter_session_id,
        assistant_message=assistant_message,
        profile_context_available=profile is not None,
    )


@router.post("/api/interview/session/{session_id}/message", response_model=InterviewMessageResponse)
async def interview_message(session_id: str, payload: InterviewMessageRequest) -> InterviewMessageResponse:
    interview_session = fetch_interview_session(session_id)
    if interview_session is None:
        raise HTTPException(status_code=404, detail="Interview session not found.")

    user_message = payload.message.strip()
    if not user_message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    persist_interview_message(session_id, "user", user_message)

    recruiter_session_id = interview_session["recruiter_session_id"]
    profile = fetch_recruiter_profile_snapshot(recruiter_session_id)

    history_rows = list_recent_interview_messages(session_id)
    history = [(row["role"], row["content"]) for row in history_rows]

    started_at = time.perf_counter()
    assistant_message = generate_interviewer_reply(profile, user_message, history)
    latency_ms = int((time.perf_counter() - started_at) * 1000)

    persist_interview_message(session_id, "assistant", assistant_message, latency_ms)

    return InterviewMessageResponse(
        session_id=session_id,
        recruiter_session_id=recruiter_session_id,
        assistant_message=assistant_message,
        latency_ms=latency_ms,
    )
