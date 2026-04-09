from __future__ import annotations

from app.config import GEMINI_INTERVIEW_MODEL, GEMINI_INTERVIEW_THINKING_LEVEL
from app.schemas import RecruiterProfile
from app.services.recruiter_ai import get_genai_client

try:
    from google.genai import types
except ImportError:
    types = None


def _profile_context(profile: RecruiterProfile | None) -> str:
    if profile is None:
        return "No recruiter profile context is available."

    return (
        f"Target role: {profile.target_role or 'unknown'}. "
        f"Years of experience: {profile.years_experience if profile.years_experience is not None else 'unknown'}. "
        f"Skills: {', '.join(profile.skills) if profile.skills else 'not provided'}."
    )


def _history_context(history: list[tuple[str, str]]) -> str:
    if not history:
        return "No prior interview turns."

    lines: list[str] = []
    for role, content in history[-10:]:
        speaker = "Candidate" if role == "user" else "Interviewer"
        lines.append(f"{speaker}: {content}")
    return "\n".join(lines)


def fallback_interviewer_opening(profile: RecruiterProfile | None) -> str:
    if profile and profile.target_role:
        return (
            f"Welcome to your technical interview for {profile.target_role}. "
            "I will ask focused questions about your decisions, trade-offs, and delivery impact. "
            "Start by walking me through one project you are most proud of."
        )

    return (
        "Welcome to your technical interview. I will ask focused questions about technical choices, "
        "trade-offs, and execution quality. Start by describing a recent project and your core contribution."
    )


def fallback_interviewer_reply(profile: RecruiterProfile | None) -> str:
    if profile and profile.skills:
        return (
            f"Thanks. You mentioned {profile.skills[0]}. What was the hardest trade-off you faced with it, "
            "and how did you validate your final decision?"
        )

    return "Thanks. What was the most difficult technical trade-off in that work, and how did you validate it?"


def _generate_text(prompt: str, fallback: str) -> str:
    client = get_genai_client()
    if client is None:
        return fallback

    try:
        if types is not None:
            response = client.models.generate_content(
                model=GEMINI_INTERVIEW_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    thinking_config=types.ThinkingConfig(
                        thinking_level=GEMINI_INTERVIEW_THINKING_LEVEL or "high"
                    )
                ),
            )
        else:
            response = client.models.generate_content(model=GEMINI_INTERVIEW_MODEL, contents=prompt)

        text = (response.text or "").strip() if response else ""
        if text:
            return text
    except Exception:
        return fallback

    return fallback


def generate_interviewer_opening(profile: RecruiterProfile | None) -> str:
    fallback = fallback_interviewer_opening(profile)
    prompt = (
        "You are Agent 2, a technical interviewer with a confident, professional, and curious personality. "
        "Open the interview in a warm but focused tone. "
        "Ask exactly one concrete opening question that helps assess technical depth. "
        "Do not ask for CV upload, and do not mention internal fields or profile building. "
        "Respond in plain text only, maximum 90 words.\n\n"
        f"Candidate context: {_profile_context(profile)}"
    )
    return _generate_text(prompt, fallback)


def generate_interviewer_reply(
    profile: RecruiterProfile | None,
    user_message: str,
    history: list[tuple[str, str]],
) -> str:
    fallback = fallback_interviewer_reply(profile)
    prompt = (
        "You are Agent 2, the technical interviewer. "
        "Your personality is interviewer-style: analytical, probing, respectful, and focused on evidence. "
        "For each turn, briefly acknowledge the candidate answer, then ask exactly one follow-up interview question. "
        "Prefer depth over breadth: architecture trade-offs, debugging approach, performance, reliability, testing, and ownership. "
        "Never switch to recruiter/profile-building behavior. "
        "Plain text only, maximum 90 words.\n\n"
        f"Candidate context: {_profile_context(profile)}\n\n"
        f"Recent interview history:\n{_history_context(history)}\n\n"
        f"Latest candidate message: {user_message}"
    )
    return _generate_text(prompt, fallback)
