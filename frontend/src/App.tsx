import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { RecruiterChat } from "./components/RecruiterChat";
import { TechnicalInterview } from "./components/TechnicalInterview";
import { AnalystDashboard } from "./components/AnalystDashboard";
import { StageProgress } from "./components/StageProgress";

function App() {
  const [currentStage, setCurrentStage] = useState<"recruiter" | "interviewer" | "analyst">(() => {
    const params = new URLSearchParams(window.location.search);
    const stage = params.get("stage");
    if (stage === "interviewer") return "interviewer";
    if (stage === "analyst") return "analyst";
    return "recruiter";
  });

  // Update URL when stage changes (optional, but good for UX)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (currentStage !== "recruiter") {
      params.set("stage", currentStage);
      window.history.replaceState({}, "", `?${params.toString()}`);
    }
  }, [currentStage]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Header />
      
      <main className="relative z-10 flex flex-col items-center pt-32">
        {currentStage === "recruiter" && <Hero />}
        
        <StageProgress currentStage={currentStage} />
        
        {currentStage === "recruiter" && (
          <RecruiterChat onComplete={() => setCurrentStage("interviewer")} />
        )}
        
        {currentStage === "interviewer" && (
          <TechnicalInterview onComplete={() => setCurrentStage("analyst")} />
        )}

        {currentStage === "analyst" && (
          <AnalystDashboard />
        )}
      </main>

      <footer className="py-8 text-center text-xs text-muted-foreground border-t border-white/5 mt-12">
        <p>© 2026 AI Career Architect. Egyptian Market Edition.</p>
      </footer>
    </div>
  );
}

export default App;
