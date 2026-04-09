from __future__ import annotations

import json
import re
from datetime import datetime, timezone


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def safe_load_skills(skills_json: str | None) -> list[str]:
    if not skills_json:
        return []

    try:
        parsed = json.loads(skills_json)
    except json.JSONDecodeError:
        return []

    if not isinstance(parsed, list):
        return []

    cleaned: list[str] = []
    seen: set[str] = set()

    for item in parsed:
        if not isinstance(item, str):
            continue
        value = item.strip()
        if not value:
            continue
        key = value.lower()
        if key in seen:
            continue
        seen.add(key)
        cleaned.append(value)

    return cleaned


def normalize_skills(existing: list[str], incoming: list[str]) -> list[str]:
    combined = [*existing, *incoming]
    normalized: list[str] = []
    seen: set[str] = set()

    for skill in combined:
        value = skill.strip()
        if not value:
            continue
        key = value.lower()
        if key in seen:
            continue
        seen.add(key)
        normalized.append(value)

    return normalized


def extract_years_experience(message: str) -> float | None:
    match = re.search(r"(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)", message, flags=re.IGNORECASE)
    if not match:
        return None

    try:
        return float(match.group(1))
    except ValueError:
        return None


def extract_target_role(message: str) -> str | None:
    pattern = re.compile(
        r"(?:target(?:\s+role)?|role|position|targeting|aiming\s+for|looking\s+for|interested\s+in)\s*(?:is|:)?\s*([A-Za-z][A-Za-z0-9\s\-/]{2,80})",
        flags=re.IGNORECASE,
    )
    match = pattern.search(message)
    if match:
        value = match.group(1).strip(" .,!?")
        return value[:80] if value else None

    common_roles = [
        "frontend developer",
        "backend developer",
        "full stack developer",
        "software engineer",
        "data analyst",
        "data scientist",
        "mobile developer",
        "qa engineer",
        "devops engineer",
    ]
    lowered = message.lower()
    for role in common_roles:
        if role in lowered:
            return role.title()

    return None


def extract_skills(message: str) -> list[str]:
    skills: list[str] = []
    segments: list[str] = []

    for pattern in (
        r"(?:skills?|stack|technologies?)\s*(?:are|include|:)?\s*([A-Za-z0-9+.#,\-/\s]{3,200})",
        r"(?:experience\s+with|worked\s+with|using|know|proficient\s+in)\s*([A-Za-z0-9+.#,\-/\s]{3,200})",
    ):
        match = re.search(pattern, message, flags=re.IGNORECASE)
        if match:
            segments.append(match.group(1))

    for segment in segments:
        for item in re.split(r",|/| and |\|", segment, flags=re.IGNORECASE):
            value = item.strip(" .,!?:;()[]{}")
            if len(value) < 2 or len(value) > 40:
                continue
            if re.fullmatch(r"\d+(?:\.\d+)?", value):
                continue
            skills.append(value)

    keyword_skills = {
        "python": "Python",
        "java": "Java",
        "javascript": "JavaScript",
        "typescript": "TypeScript",
        "react": "React",
        "next.js": "Next.js",
        "node": "Node.js",
        "fastapi": "FastAPI",
        "django": "Django",
        "sql": "SQL",
        "postgresql": "PostgreSQL",
        "mysql": "MySQL",
        "docker": "Docker",
        "kubernetes": "Kubernetes",
        "aws": "AWS",
        "azure": "Azure",
        "gcp": "GCP",
        "html": "HTML",
        "css": "CSS",
        "tailwind": "Tailwind CSS",
        "jest": "Jest",
        "pytest": "Pytest",
        "git": "Git",
    }
    lowered = message.lower()
    for needle, canonical in keyword_skills.items():
        if needle in lowered:
            skills.append(canonical)

    return normalize_skills([], skills)


def extract_confirmation(message: str) -> bool:
    lowered = message.lower()
    confirmation_markers = (
        "yes",
        "correct",
        "confirmed",
        "i confirm",
        "that is right",
        "that's right",
        "looks good",
        "exactly",
    )
    return any(marker in lowered for marker in confirmation_markers)
