from __future__ import annotations

import sqlite3
from uuid import uuid4

from app.db import DB_LOCK, get_connection
from app.schemas import RecruiterProfile
from app.utils import safe_load_skills, utc_now_iso


def fetch_recruiter_profile_snapshot(recruiter_session_id: str | None) -> RecruiterProfile | None:
    if not recruiter_session_id:
        return None

    with DB_LOCK:
        connection = get_connection()
        try:
            row = connection.execute(
                """
                SELECT target_role, years_experience, skills_json, confirmed
                FROM recruiter_sessions
                WHERE id = ?
                """,
                (recruiter_session_id,),
            ).fetchone()
        finally:
            connection.close()

    if row is None:
        return None

    return RecruiterProfile(
        target_role=row["target_role"],
        years_experience=row["years_experience"],
        skills=safe_load_skills(row["skills_json"]),
        confirmed=bool(row["confirmed"]),
    )


def create_interview_session(
    interview_session_id: str,
    recruiter_session_id: str | None,
    initial_message: str,
) -> None:
    now = utc_now_iso()

    with DB_LOCK:
        connection = get_connection()
        try:
            connection.execute(
                """
                INSERT INTO interview_sessions (id, recruiter_session_id, status, created_at, updated_at)
                VALUES (?, ?, 'active', ?, ?)
                """,
                (interview_session_id, recruiter_session_id, now, now),
            )
            connection.execute(
                """
                INSERT INTO interview_messages (id, session_id, role, content, created_at)
                VALUES (?, ?, 'assistant', ?, ?)
                """,
                (uuid4().hex, interview_session_id, initial_message, now),
            )
            connection.commit()
        finally:
            connection.close()


def fetch_interview_session(session_id: str) -> sqlite3.Row | None:
    with DB_LOCK:
        connection = get_connection()
        try:
            return connection.execute(
                "SELECT * FROM interview_sessions WHERE id = ?",
                (session_id,),
            ).fetchone()
        finally:
            connection.close()


def list_recent_interview_messages(session_id: str, limit: int = 16) -> list[sqlite3.Row]:
    capped_limit = max(1, min(limit, 50))

    with DB_LOCK:
        connection = get_connection()
        try:
            rows = connection.execute(
                """
                SELECT role, content
                FROM interview_messages
                WHERE session_id = ?
                ORDER BY created_at DESC
                LIMIT ?
                """,
                (session_id, capped_limit),
            ).fetchall()
        finally:
            connection.close()

    rows.reverse()
    return rows


def persist_interview_message(session_id: str, role: str, content: str, latency_ms: int | None = None) -> None:
    now = utc_now_iso()

    with DB_LOCK:
        connection = get_connection()
        try:
            connection.execute(
                """
                INSERT INTO interview_messages (id, session_id, role, content, latency_ms, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (uuid4().hex, session_id, role, content, latency_ms, now),
            )
            connection.execute(
                "UPDATE interview_sessions SET updated_at = ? WHERE id = ?",
                (now, session_id),
            )
            connection.commit()
        finally:
            connection.close()
