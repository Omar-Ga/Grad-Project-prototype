# Backend (Prototype API)

FastAPI backend for CV upload and recruiter AI chat session handling.

## Features
- Accepts PDF uploads only
- Enforces max file size of 15MB
- Saves files to `backend/uploads/cv/`
- Starts recruiter sessions for both upload and skip-CV paths
- Persists recruiter sessions and messages in SQLite (`backend/app.db`)
- Uses Gemini to generate recruiter responses

## Environment
Create `backend/.env`:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.1-flash-lite-preview
```

`GEMINI_MODEL` is optional. If omitted, the default is `gemini-3.1-flash-lite-preview`.

## Setup
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Endpoints
- `GET /health`
- `POST /api/cv/upload` (multipart form field: `file`)
- `POST /api/recruiter/session/start`
	- Body:
		```json
		{
			"skip_cv": false,
			"cv_original_name": "resume.pdf",
			"cv_stored_name": "uuid.pdf"
		}
		```
- `POST /api/recruiter/session/{session_id}/message`
	- Body:
		```json
		{
			"message": "I am targeting a junior frontend developer role with 2 years experience and skills in React, TypeScript, and CSS"
		}
		```

## Recruiter Readiness Rule
Interview progression is enabled only when all are captured:
- target role
- years of experience
- at least 3 skills
- explicit user confirmation (for example: "yes", "correct", "I confirm")
