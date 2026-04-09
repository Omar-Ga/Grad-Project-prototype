from __future__ import annotations

from pydantic import BaseModel, Field


class RecruiterProfile(BaseModel):
    target_role: str | None = None
    years_experience: float | None = None
    skills: list[str] = Field(default_factory=list)
    confirmed: bool = False


class RecruiterSessionStartRequest(BaseModel):
    skip_cv: bool = False
    cv_original_name: str | None = Field(default=None, max_length=255)
    cv_stored_name: str | None = Field(default=None, max_length=255)


class RecruiterSessionStartResponse(BaseModel):
    session_id: str
    assistant_message: str
    ready: bool
    missing_fields: list[str]
    profile: RecruiterProfile


class RecruiterMessageRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)


class RecruiterMessageResponse(BaseModel):
    session_id: str
    assistant_message: str
    ready: bool
    missing_fields: list[str]
    profile: RecruiterProfile
    latency_ms: int


class InterviewSessionStartRequest(BaseModel):
    recruiter_session_id: str | None = Field(default=None, min_length=1, max_length=128)


class InterviewSessionStartResponse(BaseModel):
    session_id: str
    recruiter_session_id: str | None = None
    assistant_message: str
    profile_context_available: bool


class InterviewMessageRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)


class InterviewMessageResponse(BaseModel):
    session_id: str
    recruiter_session_id: str | None = None
    assistant_message: str
    latency_ms: int
