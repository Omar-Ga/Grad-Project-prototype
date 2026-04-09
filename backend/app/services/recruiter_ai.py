from __future__ import annotations

from typing import Any

from app.config import GEMINI_API_KEY, GEMINI_MODEL, GEMINI_THINKING_LEVEL
from app.schemas import RecruiterProfile
from app.services.profile_extraction import fallback_recruiter_reply

try:
    from google import genai
    from google.genai import types
except ImportError:
    genai = None
    types = None

_GENAI_CLIENT: Any | None = None


def get_genai_client() -> Any | None:
    global _GENAI_CLIENT

    if _GENAI_CLIENT is not None:
        return _GENAI_CLIENT

    if not GEMINI_API_KEY or genai is None:
        return None

    try:
        _GENAI_CLIENT = genai.Client(api_key=GEMINI_API_KEY)
    except TypeError:
        _GENAI_CLIENT = genai.Client()

    return _GENAI_CLIENT


def generate_recruiter_reply(profile: RecruiterProfile, missing_fields: list[str], user_message: str) -> str:
    client = get_genai_client()
    if client is None:
        return fallback_recruiter_reply(profile, missing_fields)

    prompt = (
        "You are the first-stage recruiter assistant for a discovery conversation before the technical interview. "
        "Your job is to gather a clear gist of the candidate's background in a friendly, conversational tone. "
        "Ask one natural follow-up question each turn about experience, companies, projects, impact, and technologies. "
        "Do not mention internal fields, missing fields, or that you are building a profile. "
        "Respond in plain text only, maximum 80 words. "
        "If all required details are already covered and confirmed, briefly acknowledge this and invite the candidate to continue to interview.\n\n"
        f"Current profile: role={profile.target_role}, years_experience={profile.years_experience}, "
        f"skills={profile.skills}, confirmed={profile.confirmed}.\n"
        f"Missing fields: {missing_fields}.\n"
        f"Latest user message: {user_message}"
    )

    try:
        if types is not None:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    thinking_config=types.ThinkingConfig(thinking_level=GEMINI_THINKING_LEVEL)
                ),
            )
        else:
            response = client.models.generate_content(model=GEMINI_MODEL, contents=prompt)
        text = (response.text or "").strip() if response else ""
        if text:
            return text
    except Exception:
        return fallback_recruiter_reply(profile, missing_fields)

    return fallback_recruiter_reply(profile, missing_fields)
