Product Requirements Document (PRD)
Project Name: AI-Powered Career Development Platform (The "End-to-End" Assessment)
Version: 1.3
Status: Draft
Date: October 26, 2025
1. Executive Summary
The Egyptian tech market suffers from a "Guidance Gap." Thousands of junior developers
graduate with theoretical knowledge but lack the specific skills required by local companies.
Existing solutions (courses, standard chatbots) lack personalization and market context.
This platform bridges that gap by acting as an autonomous, AI-driven career assessor. It
simulates a hiring cycle—from HR screening to technical interviewing—and provides a
technical assessment based on real-time market data (e.g., jobs from Wuzzuf/Tanqeeb).
2. Problem Statement
● For Developers: Lack of access to senior mentorship, inability to identify skill gaps, and
difficulty navigating the specific demands of the Egyptian job market.
● For the Market: A mismatch between the supply of junior developers and the demand
for production-ready engineers.
3. Goals
3.1 Primary Goals
1. Automate Assessment: Provide senior-level technical feedback without human
intervention.
2. Real-Time Market Alignment: Ensure validation is based on current job postings, not
just static datasets.
4. Target Audience
● Junior Developers: Fresh graduates or early-career developers looking to validate their
readiness for the job market.
5. Functional Requirements
5.1 Module 1: The "Virtual Recruiter" (Onboarding)

● FR-1.1 CV Parsing: System must accept PDF/DOCX uploads and extract skills,
experience, and education.
● FR-1.2 Goal Setting: System must identify the user's target role (e.g., "Junior Backend
Engineer") via chat interface.
● FR-1.3 Profile Creation: Create a user profile in the database mapping current skills vs.
target skills.
5.2 Module 2: The "Technical Lead" (Assessment)
● FR-2.1 Adaptive Interview: System generates technical questions based on the user's
claimed skills.
● FR-2.2 Code Review: Users can submit code snippets; the system must analyze syntax,
logic, and efficiency.
● FR-2.3 Dynamic Difficulty: If a user answers correctly, the next question becomes
harder. If they fail, it probes basics.
● FR-2.4 Session Management: The interview continues until the system has exhausted
the generated question bank for the required skills.
5.3 Module 3: The "Market Analyst" (Gap Analysis)
● FR-3.1 Live Data Scraping: System actively searches specific keywords on Wuzzuf,
Tanqeeb, and LinkedIn (Egyptian geo-filter) to find top required skills for the target role.
● FR-3.2 Comparison Logic: Compare User Skills (from Interview) vs. Market
Requirements (from Scraping).
● FR-3.3 Gap Identification: Explicitly list missing technologies (e.g., "You know React, but
80% of local jobs also require Redux Toolkit").
6. Technical Architecture
6.1 Frontend (Interface)
● Framework: (React)
● Styling: Tailwind CSS (Focus on clean, distraction-free "IDE-like" aesthetics)
● State Management: React Context / Redux (for interview session state)
6.2 Backend (The Brain)
● Orchestration: LangGraph (Python) to manage the multi-agent workflow (Recruiter
Agent → Interviewer Agent → Analyst Agent).
● Framework: FastAPI
● Database:
○ Vector DB: Qdrant (for retrieving relevant interview questions).
○ Relational DB: PostgreSQL (for user auth and progress tracking).
6.3 AI Models (Google Gemini)
● Model A (Speed): Gemini 1.5 Flash for real-time chat interactions (The

Recruiter/Interviewer).
● Model B (Reasoning): Gemini 1.5 Pro for detailed code analysis and gap analysis.
6.4 Data Gathering Strategy
● Primary: Seraph API / Google Custom Search API for live job market data.
● Secondary: Offline/Cached dataset of common interview questions to reduce latency.
7. User Flow (The Happy Path)
1. Landing: User logs in via custom email/password integration.
2. Setup: User uploads CV. "Recruiter" Agent confirms: "I see you are a Junior React Dev
aiming for Senior level. Is this correct?"
3. Interview: "Tech Lead" Agent starts the chat session. The session is unlimited in time
and continues until all relevant topics are covered. "Explain the Virtual DOM. Now, write a
function that..."
4. Processing: Screen shows "Analyzing Market Data..." (System scrapes current job reqs).
5. Results: User lands on Dashboard.
○ Score: 65/100
○ Verdict: "Strong on UI, weak on State Management."
○ Market Gaps: List of specific technologies required by the market that the user lacks.
8. Constraints & Assumptions
● Language: Interface and Chat are strictly in English.
● Scope: Initial release focuses on Software Engineering roles only (Frontend, Backend,
DevOps).
● Accuracy: Market data is dependent on the availability of public job listings.
9. Future Roadmap (Post-Graduation)
● Mock Behavioral Interview: HR questions simulation (soft skills).
● Peer Match: Connect users with similar skill gaps to study together.