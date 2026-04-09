# AI Career Platform Prototype Tasks

## Project Decisions (Locked)
- Database: SQLite for relational data.
- CV Storage: Local filesystem, not database BLOBs.
- Accepted CV format: PDF only.
- AI Input: Parsed CV profile JSON + extracted text snippets, not raw PDF/DOCX on every request.
- Goal: Polished graduation prototype over production hardening.

## Priority Legend
- Must: Required for core demo and PRD happy path.
- Should: Strong quality or UX improvement.
- Could: Stretch goal if time allows.

## Milestone 0: Alignment and Setup
- [ ] T-001 (Must) Confirm architecture in writing (SQLite + local uploads + FastAPI + React).
Done when: Decision is documented and agreed by team.

- [ ] T-002 (Must) Create backend folder structure and app bootstrap.
Done when: Backend starts and GET /health returns status ok.

- [ ] T-003 (Must) Create environment template and config loader.
Done when: App runs from .env without hardcoded secrets.

- [ ] T-004 (Should) Update PRD model references to currently supported Gemini models.
Done when: Deprecated model names are removed from project planning docs.

## Milestone 0.5: Basic Authentication (Prototype)
- [ ] T-050 (Must) Create users table in SQLite.
Done when: users table exists with id, email (unique), password_hash, created_at.

- [ ] T-051 (Must) Add register endpoint.
Done when: You can create a user with email and password.

- [ ] T-052 (Must) Add login endpoint.
Done when: Valid credentials return an auth token and invalid credentials return a clear error.

- [ ] T-053 (Must) Protect core endpoints with auth middleware.
Done when: Upload, parse status, recruiter chat, and interview endpoints require authentication.

- [ ] T-054 (Must) Add minimal frontend auth screens (register + login).
Done when: You can create an account and log in from UI.

- [ ] T-055 (Should) Persist auth session in frontend.
Done when: Token survives refresh and requests include Authorization header.

## Milestone 1: CV Upload Pipeline (First Real Feature)
- [ ] T-101 (Must) Add upload endpoint for PDF.
Done when: Frontend can POST a CV file and receive upload metadata response.

- [ ] T-102 (Must) Add file validation for type and size.
Done when: Non-PDF and oversized files are rejected with clear errors.

- [ ] T-103 (Must) Save files to local storage with generated safe filenames.
Done when: Files are saved to backend/uploads/cv with UUID-based names.

- [ ] T-104 (Must) Create cv_files table in SQLite.
Done when: Each upload stores id, user_id, original_name, stored_name, mime_type, size, path, created_at.

- [ ] T-105 (Should) Add basic duplicate detection by hash.
Done when: Same file hash can be identified and flagged.

- [ ] T-106 (Must) Connect recruiter upload UI to real endpoint.
Done when: Upload button in frontend triggers actual backend upload instead of simulation.

## Milestone 2: CV Parsing and Profile Creation
- [ ] T-201 (Must) Add parser service for PDF text extraction.
Done when: Backend extracts text reliably from PDF files.

- [ ] T-202 (Must) Create parsed_profiles table in SQLite.
Done when: Extracted summary JSON is persisted per uploaded CV.

- [ ] T-203 (Must) Implement CV-to-profile extraction logic.
Done when: System stores normalized fields for skills, experience, education, and likely target role.

- [ ] T-204 (Must) Add parse status endpoint.
Done when: Frontend can query pending, processing, completed, failed.

- [ ] T-205 (Must) Replace fake "Analyzing Profile" stage with real backend parse status.
Done when: UI transitions based on actual parse completion.

- [ ] T-206 (Should) Store parse confidence per extracted section.
Done when: Skills/experience/education have confidence scores in stored JSON.

## Milestone 3: Recruiter Agent Integration
- [ ] T-301 (Must) Create recruiter session endpoint seeded with parsed profile.
Done when: First assistant prompt is generated from real profile data.

- [ ] T-302 (Must) Add recruiter chat endpoint for user messages.
Done when: Frontend chat sends and receives real responses from backend.

- [ ] T-303 (Must) Add session and message persistence in SQLite.
Done when: Chat history is stored and can be reloaded.

- [ ] T-304 (Should) Add response latency logging for recruiter flow.
Done when: Average response time is measurable against sub-2s target.

## Milestone 4: Technical Interview Flow
- [ ] T-401 (Must) Generate interview questions from validated/claimed skills.
Done when: Question list is dynamic per user profile.

- [ ] T-402 (Must) Persist interview questions, answers, and grades.
Done when: interview_logs table captures full Q&A lifecycle.

- [ ] T-403 (Must) Implement adaptive difficulty rules.
Done when: Correct answers raise level, weak answers trigger fundamentals.

- [ ] T-404 (Should) Add code snippet evaluation endpoint.
Done when: User can submit code and receive structured feedback.

- [ ] T-405 (Could) Add retry/redemption mechanism for failed question categories.
Done when: User can recover skill score after retry.

## Milestone 5: Analyst and Market Gap Analysis
- [ ] T-501 (Must) Define market data ingestion format and storage tables.
Done when: Raw job data schema exists in SQLite (source, role, skills, salary, timestamp).

- [ ] T-502 (Should) Implement first ingestion source (manual seed or API stub).
Done when: Dashboard can run against fresh, structured market data.

- [ ] T-503 (Must) Implement skill-gap comparison logic.
Done when: System outputs missing skills from interview results versus market requirements.

- [ ] T-504 (Must) Implement salary range estimator for dashboard.
Done when: Salary range is generated from role + validated level + market data.

- [ ] T-505 (Must) Connect analyst dashboard to backend output.
Done when: Dashboard charts/cards render API data instead of hardcoded constants.

- [ ] T-506 (Could) Add vector store integration for richer retrieval.
Done when: Qdrant-backed retrieval can be used for analyst recommendations.

## Milestone 6: Demo Readiness and Polish
- [ ] T-601 (Must) Add end-to-end happy path test checklist.
Done when: Team can execute upload -> recruiter -> interview -> analyst flow consistently.

- [ ] T-602 (Must) Add graceful error states in UI.
Done when: Upload/parse/chat failures show clear recovery actions.

- [ ] T-603 (Should) Add sample seeded users and CVs for live demo fallback.
Done when: Demo works even if live parsing/API fails.

- [ ] T-604 (Should) Add logging panel or admin view for debugging during presentation.
Done when: You can quickly inspect session state and parse/interview outputs.

- [ ] T-605 (Could) Add deployment script for single-command local demo startup.
Done when: One command starts backend and frontend for presentation day.

## Suggested Execution Order (Strict)
1. Milestone 0
2. Milestone 0.5
3. Milestone 1
4. Milestone 2
5. Milestone 3
6. Milestone 4
7. Milestone 5
8. Milestone 6

## Immediate Next 3 Tasks
- [ ] Start T-002 backend bootstrap.
- [ ] Start T-050 users table + auth base.
- [ ] Start T-101 upload endpoint.
