from __future__ import annotations

import json
import sqlite3
from uuid import uuid4

from app.db import DB_LOCK, get_connection
from app.utils import utc_now_iso


def fetch_session(session_id: str) -> sqlite3.Row | None:
    with DB_LOCK:
        connection = get_connection()
        try:
            return connection.execute(
                "SELECT * FROM recruiter_sessions WHERE id = ?",
                (session_id,),
            ).fetchone()
        finally:
            connection.close()


def persist_message(session_id: str, role: str, content: str, latency_ms: int | None = None) -> None:
    with DB_LOCK:
        connection = get_connection()
        try:
            connection.execute(
                """
                INSERT INTO recruiter_messages (id, session_id, role, content, latency_ms, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (uuid4().hex, session_id, role, content, latency_ms, utc_now_iso()),
            )
            connection.commit()
        finally:
            connection.close()


def create_recruiter_session(
    session_id: str,
    source_type: str,
    cv_original_name: str | None,
    cv_stored_name: str | None,
    initial_message: str,
) -> None:
    now = utc_now_iso()

    with DB_LOCK:
        connection = get_connection()
        try:
            connection.execute(
                """
                INSERT INTO recruiter_sessions (
                    id,
                    source_type,
                    cv_original_name,
                    cv_stored_name,
                    skills_json,
                    confirmed,
                    ready,
                    status,
                    created_at,
                    updated_at
                )
                VALUES (?, ?, ?, ?, ?, 0, 0, 'collecting', ?, ?)
                """,
                (
                    session_id,
                    source_type,
                    cv_original_name,
                    cv_stored_name,
                    json.dumps([]),
                    now,
                    now,
                ),
            )
            connection.execute(
                """
                INSERT INTO recruiter_messages (id, session_id, role, content, created_at)
                VALUES (?, ?, 'assistant', ?, ?)
                """,
                (uuid4().hex, session_id, initial_message, now),
            )
            connection.commit()
        finally:
            connection.close()


def update_recruiter_session(
    session_id: str,
    target_role: str | None,
    years_experience: float | None,
    skills: list[str],
    confirmed: bool,
    ready: bool,
    latency_ms: int,
) -> None:
    with DB_LOCK:
        connection = get_connection()
        try:
            connection.execute(
                """
                UPDATE recruiter_sessions
                SET
                    target_role = ?,
                    years_experience = ?,
                    skills_json = ?,
                    confirmed = ?,
                    ready = ?,
                    status = ?,
                    last_latency_ms = ?,
                    updated_at = ?
                WHERE id = ?
                """,
                (
                    target_role,
                    years_experience,
                    json.dumps(skills),
                    int(confirmed),
                    int(ready),
                    "ready" if ready else "collecting",
                    latency_ms,
                    utc_now_iso(),
                    session_id,
                ),
            )
            connection.commit()
        finally:
            connection.close()
