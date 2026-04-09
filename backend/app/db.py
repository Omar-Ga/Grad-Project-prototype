from __future__ import annotations

import sqlite3
import threading

from app.config import DATABASE_PATH

DB_LOCK = threading.Lock()


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DATABASE_PATH, check_same_thread=False)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def init_db() -> None:
    with DB_LOCK:
        connection = get_connection()
        try:
            connection.executescript(
                """
                CREATE TABLE IF NOT EXISTS recruiter_sessions (
                    id TEXT PRIMARY KEY,
                    source_type TEXT NOT NULL,
                    cv_original_name TEXT,
                    cv_stored_name TEXT,
                    target_role TEXT,
                    years_experience REAL,
                    skills_json TEXT NOT NULL DEFAULT '[]',
                    confirmed INTEGER NOT NULL DEFAULT 0,
                    ready INTEGER NOT NULL DEFAULT 0,
                    status TEXT NOT NULL DEFAULT 'collecting',
                    last_latency_ms INTEGER,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS recruiter_messages (
                    id TEXT PRIMARY KEY,
                    session_id TEXT NOT NULL,
                    role TEXT NOT NULL,
                    content TEXT NOT NULL,
                    latency_ms INTEGER,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (session_id) REFERENCES recruiter_sessions(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS interview_sessions (
                    id TEXT PRIMARY KEY,
                    recruiter_session_id TEXT,
                    status TEXT NOT NULL DEFAULT 'active',
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    FOREIGN KEY (recruiter_session_id) REFERENCES recruiter_sessions(id) ON DELETE SET NULL
                );

                CREATE TABLE IF NOT EXISTS interview_messages (
                    id TEXT PRIMARY KEY,
                    session_id TEXT NOT NULL,
                    role TEXT NOT NULL,
                    content TEXT NOT NULL,
                    latency_ms INTEGER,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
                );

                CREATE INDEX IF NOT EXISTS idx_interview_sessions_recruiter_session_id
                    ON interview_sessions(recruiter_session_id);

                CREATE INDEX IF NOT EXISTS idx_interview_messages_session_created_at
                    ON interview_messages(session_id, created_at);
                """
            )
            connection.commit()
        finally:
            connection.close()
