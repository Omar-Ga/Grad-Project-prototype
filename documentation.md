Project Documentation: AI Career Platform for Egyptian Developers
1. Executive Summary
This project is an advanced AI application designed to act as an end-to-end career counselor for software developers. Unlike standard chatbots that provide generic advice, this platform creates a personalized, data-driven career roadmap.
It guides the user through a three-stage journey: Discovery (Chat), Assessment (Interview), and Analysis (Dashboard). The system is specifically tailored to the Egyptian market, utilizing local data regarding salaries, job availability, and company requirements.
2. Related Work & Market Analysis
Existing solutions for career development are generally global in nature and fail to address the specific nuances of the local Egyptian market.
Feature
LinkedIn Learning / Coursera
HackerRank / LeetCode
Our Project
Primary Goal
Education (Courses)
Assessment (Testing)
Career Counseling
Market Context
Global / US-Centric
Generic Algorithms
Egyptian Market (Wuzzuf/Tanqeeb)
Feedback Loop
Passive (Quizzes)
Binary (Pass/Fail)
Agentic (Mentorship & Advice)
Data Freshness
Static Curricula
Static Question Banks
Live Scraped Data (Monthly)

The Gap: A junior developer in Egypt might master "React" via Coursera but fail interviews because they lack knowledge of "Next.js," which 70% of Cairo-based startups currently require. Our platform identifies this specific gap.

3. Problem Statement
Junior and mid-level developers often face a "Guidance Gap." They may know how to write code, but they lack awareness of:
Their true market value: Salary expectations in the Egyptian market are often opaque.
Specific skill gaps: Generic tutorials do not identify what specific skills (e.g., Docker, Unit Testing) are preventing them from getting hired.
Real-time market demands: University curricula often lag behind industry trends.
This project solves this by replacing the human career counselor with an intelligent, multi-agent AI system.
4. System Analysis & Requirements
4.1 Stakeholders
Primary User: Junior to Mid-level Software Developers (Egypt-based).
Secondary User: System Administrators (monitoring API usage and scraper health).
4.2 Non-Functional Requirements
Reliability (Data Freshness): The system must not rely on static datasets older than 30 days. Market data is refreshed monthly to ensure relevance.
Performance: Chat response latency should stay under 2 seconds for the "Recruiter" agent.
Scalability: The Vector Database must support concurrent queries without degrading RAG retrieval speed.
5. System Architecture
The application is built on a Decoupled Architecture, separating the User Interface from the Logic Engine.
A. The Frontend (The Interface)
Framework: Built using React to ensure a reactive, high-performance web experience.
AI Integration: Utilizes the Vercel AI SDK to handle real-time text streaming.
Design: A modern, dark-themed UI that shifts visually between stages (Casual Chat → Split-Screen Interview → Analytical Dashboard).
B. The Backend (The Brain)
Logic Engine: Powered by Python (Fast API), managing complex logic and data processing.
Orchestration: Uses LangGraph to manage the "State" of the user. This ensures the AI remembers context as it moves from one stage to another.
Intelligence:
Reasoning Model: Google Gemini 2.5 Pro (used for complex interview grading and syllabus generation).
Speed Model: Google Gemini 3.0 Flash (used for rapid conversational responses).
6. Data Specifications & AI Methodology
6.1 Data Sourcing Strategy (RAG Architecture)
We do not fine-tune models. Instead, we rely on Retrieval Augmented Generation (RAG) and advanced Prompt Engineering.
Primary Source: Seraph API. We leverage the free tier (250 searches/month) to perform targeted scraping of Egyptian job portals.
Vector Database: Qdrant. Scraped data is converted into embeddings and stored here. This database is refreshed monthly to ensure the AI's "knowledge" remains current.
Fallback: Google Search Tool (live wide search) for niche queries not covered by the vector store.
6.2 The "Guidance" Logic
The system uses a "Chain of Thought" approach where a Middleware AI intercepts user answers, grades them against technical facts, and instructs the Chatbot on the next move (e.g., "User failed the basic React question; switch topic to HTML fundamentals").
7. Database Design (ERD Description)
The system utilizes a relational database (PostgreSQL) alongside the vector store. Key entities include:
Users: Stores authentication details (ID, Email, PasswordHash) and high-level goals (Target Role, Experience Level).
Profiles: Contains the extracted data from the user's CV and the JSON summary of their "Claimed Skills."
Sessions: Tracks a specific interaction lifecycle (Date, Current Stage, Overall Score).
InterviewLogs: A detailed record of the Q&A process.
Attributes: QuestionText, UserAnswer, AIGrade, DifficultyTier, SkillCategory.
MarketData: Stores the raw and processed job descriptions scraped from Seraph API before they are vectorized.
8. The Three-Stage User Journey
Stage 1: The Recruiter (Discovery)
Goal: Qualitative Profiling.
Workflow: Casual chat to extract background and claimed skills.
Outcome: A User Profile JSON.
Stage 2: The Technical Lead (Assessment)
Goal: Quantitative Validation.
Logic:
Dynamic Syllabus: Generates ~15 questions based on the profile.
Redemption Mechanism: Offers a retry on failed questions before marking a skill as "Weak."
Grading Middleware: A silent "Judge" AI evaluates answers in the background.
Outcome: A Validated Skill Report.
Stage 3: The Analyst (Advising)
Goal: Actionable Intelligence via RAG.
Features:
Salary Estimator: Range based on validated skill level.
Gap Analysis: "You failed X, so you need to learn Y to apply for Z jobs."
Company Radar: List of relevant hiring companies.

10. Conclusion
This project demonstrates the practical application of Agentic AI Workflow. By moving beyond simple text generation and implementing structured logic, memory management, and real-world data retrieval, the platform provides a career counseling experience tailored specifically for the Egyptian software development community.
