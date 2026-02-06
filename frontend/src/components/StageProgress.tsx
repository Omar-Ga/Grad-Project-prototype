import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";

type Stage = "recruiter" | "interviewer" | "analyst";

interface StageProgressProps {
  currentStage: Stage;
}

export function StageProgress({ currentStage }: StageProgressProps) {
  const stages: { id: Stage; label: string }[] = [
    { id: "recruiter", label: "The Recruiter" },
    { id: "interviewer", label: "The Tech Lead" },
    { id: "analyst", label: "The Analyst" },
  ];

  const getStatus = (stageId: Stage) => {
    const order = ["recruiter", "interviewer", "analyst"];
    const currentIndex = order.indexOf(currentStage);
    const stageIndex = order.indexOf(stageId);

    if (stageIndex < currentIndex) return "completed";
    if (stageIndex === currentIndex) return "active";
    return "pending";
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-12 px-6">
      <div className="relative flex items-start justify-between">
        {/* Connecting Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-white/10 -z-10 -translate-y-1/2" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 -z-10 -translate-y-1/2"
          style={{ 
            width: currentStage === "recruiter" ? "0%" : currentStage === "interviewer" ? "50%" : "100%" 
          }} 
        />

        {stages.map((stage) => {
          const status = getStatus(stage.id);
          return (
            <div key={stage.id} className="flex flex-col items-center gap-3">
              <motion.div 
                initial={false}
                animate={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: status === "completed" || status === "active" ? "var(--primary)" : "rgba(255,255,255,0.1)",
                  scale: status === "active" ? 1.1 : 1,
                }}
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300 relative z-10",
                  status === "active" && "shadow-[0_0_20px_-5px_hsl(var(--primary))]"
                )}
              >
                {status === "completed" ? (
                  <Check className="w-5 h-5 text-primary" strokeWidth={3} />
                ) : (
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full transition-colors duration-300",
                    status === "active" ? "bg-primary" : "bg-white/10"
                  )} />
                )}
              </motion.div>
              <span className={cn(
                "text-xs font-mono uppercase tracking-wider transition-colors duration-300",
                status === "active" ? "text-primary" : status === "completed" ? "text-foreground" : "text-muted-foreground"
              )}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
