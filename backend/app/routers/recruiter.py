from __future__ import annotations

import time
from uuid import uuid4

from fastapi import APIRouter, HTTPException

from app.repositories.recruiter_repository import (
    create_recruiter_session,
    fetch_session,
    persist_message,
    update_recruiter_session,
)
from app.schemas import (
    RecruiterMessageRequest,
    RecruiterMessageResponse,
    RecruiterProfile,
    RecruiterSessionStartRequest,
    RecruiterSessionStartResponse,
)
from app.services.profile_extraction import evaluate_readiness
from app.services.recruiter_ai import generate_recruiter_reply
from app.utils import (
    extract_confirmation,
    extract_skills,
    extract_target_role,
    extract_years_experience,
    normalize_skills,
    safe_load_skills,
)

router = APIRouter()


@router.post("/api/recruiter/session/start", response_model=RecruiterSessionStartResponse)
async def start_recruiter_session(payload: RecruiterSessionStartRequest) -> RecruiterSessionStartResponse:
    if not payload.skip_cv and not payload.cv_stored_name:
        raise HTTPException(status_code=400, detail="cv_stored_name is required when skip_cv is false.")

    session_id = uuid4().hex
    source_type = "skip" if payload.skip_cv else "upload"

    initial_message = (
        "Hi, I am your recruiter assistant. I would love to learn about your background. "
        "What kind of work have you done, and what roles are you most interested in now?"
        if payload.skip_cv
        else (
            f"I received your CV ({payload.cv_original_name or 'uploaded file'}). "
            "Thanks for sharing it. In your own words, what kind of experience have you had and what role are you aiming for next?"
        )
    )

    create_recruiter_session(
        session_id=session_id,
        source_type=source_type,
        cv_original_name=payload.cv_original_name,
        cv_stored_name=payload.cv_stored_name,
        initial_message=initial_message,
    )

    profile = RecruiterProfile()
    ready, missing_fields = evaluate_readiness(profile)

    return RecruiterSessionStartResponse(
        session_id=session_id,
        assistant_message=initial_message,
        ready=ready,
        missing_fields=missing_fields,
        profile=profile,
    )


@router.post("/api/recruiter/session/{session_id}/message", response_model=RecruiterMessageResponse)
async def recruiter_message(session_id: str, payload: RecruiterMessageRequest) -> RecruiterMessageResponse:
    session = fetch_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Recruiter session not found.")

    user_message = payload.message.strip()
    if not user_message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    persist_message(session_id, "user", user_message)

    current_skills = safe_load_skills(session["skills_json"])
    current_profile = RecruiterProfile(
        target_role=session["target_role"],
        years_experience=session["years_experience"],
        skills=current_skills,
        confirmed=bool(session["confirmed"]),
    )

    extracted_role = extract_target_role(user_message)
    extracted_years = extract_years_experience(user_message)
    extracted_skills = extract_skills(user_message)
    explicit_confirmation = extract_confirmation(user_message)

    updated_profile = RecruiterProfile(
        target_role=extracted_role or current_profile.target_role,
        years_experience=extracted_years if extracted_years is not None else current_profile.years_experience,
        skills=normalize_skills(current_profile.skills, extracted_skills),
        confirmed=current_profile.confirmed or explicit_confirmation,
    )

    ready, missing_fields = evaluate_readiness(updated_profile)

    started_at = time.perf_counter()
    assistant_message = generate_recruiter_reply(updated_profile, missing_fields, user_message)
    latency_ms = int((time.perf_counter() - started_at) * 1000)

    update_recruiter_session(
        session_id=session_id,
        target_role=updated_profile.target_role,
        years_experience=updated_profile.years_experience,
        skills=updated_profile.skills,
        confirmed=updated_profile.confirmed,
        ready=ready,
        latency_ms=latency_ms,
    )
    persist_message(session_id, "assistant", assistant_message, latency_ms)

    return RecruiterMessageResponse(
        session_id=session_id,
        assistant_message=assistant_message,
        ready=ready,
        missing_fields=missing_fields,
        profile=updated_profile,
        latency_ms=latency_ms,
    )
