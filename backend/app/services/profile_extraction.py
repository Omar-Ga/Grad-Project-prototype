from __future__ import annotations

from app.schemas import RecruiterProfile


def evaluate_readiness(profile: RecruiterProfile) -> tuple[bool, list[str]]:
    missing_fields: list[str] = []

    if not profile.target_role:
        missing_fields.append("target_role")
    if profile.years_experience is None:
        missing_fields.append("years_experience")
    if len(profile.skills) < 3:
        missing_fields.append("skills")
    if not profile.confirmed:
        missing_fields.append("confirmation")

    return len(missing_fields) == 0, missing_fields


def fallback_recruiter_reply(profile: RecruiterProfile, missing_fields: list[str]) -> str:
    if "target_role" in missing_fields:
        return (
            "Thanks for sharing. To start, what kinds of roles have you done so far, "
            "and what role are you most interested in next?"
        )

    if "years_experience" in missing_fields:
        return (
            "Nice. Roughly how many years of hands-on experience do you have in this area, "
            "and what kind of companies or teams have you worked with?"
        )

    if "skills" in missing_fields:
        return (
            "Great context. Which technologies and tools do you use most often? "
            "Share at least three, and feel free to mention a project where you used them."
        )

    if "confirmation" in missing_fields:
        return (
            "Thanks, here is my understanding so far: "
            f"role={profile.target_role}, years={profile.years_experience}, skills={', '.join(profile.skills[:6])}. "
            "Does this look right? Reply with 'yes' to confirm, or share any corrections."
        )

    return "Awesome, thanks for sharing. We have enough context now and can move to the technical interview when you are ready."
