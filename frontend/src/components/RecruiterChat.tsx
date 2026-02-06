import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Send, User, Bot, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type Stage = "upload" | "analyzing" | "chat";

interface RecruiterChatProps {
  onComplete?: () => void;
}

export function RecruiterChat({ onComplete }: RecruiterChatProps) {
  const [stage, setStage] = useState<Stage>("upload");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleFileUpload = () => {
    setStage("analyzing");
    // Simulate parsing
    setTimeout(() => {
      setStage("chat");
      addMessage("assistant", "Hello! I've analyzed your CV. I see you're targeting a Junior Frontend Developer role. Is that correct?");
    }, 2500);
  };

  const handleSkip = () => {
    setStage("chat");
    addMessage("assistant", "No problem. Let's start from scratch. What is your target role (e.g., Junior Frontend Developer)?");
  };

  const finishRecruiter = () => {
    if (onComplete) onComplete();
  };

  const addMessage = (role: "user" | "assistant", content: string) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setInputValue("");
    addMessage("user", userMsg);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      // Simple mock logic
      if (userMsg.toLowerCase().includes("yes") || userMsg.toLowerCase().includes("correct")) {
        addMessage("assistant", "Great. Based on your projects, you seem to have experience with React but lack exposure to testing frameworks. Let's start by assessing your React knowledge. How does the Virtual DOM work?");
        // Add a "Start Interview" action button message or auto-trigger for demo purposes
        setTimeout(() => {
             addMessage("assistant", "I've prepared your technical interview session. Click below when you're ready to proceed.");
        }, 1000);
      } else {
        addMessage("assistant", "Understood. Could you clarify your target role?");
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pb-12">
      <div className="relative min-h-[600px] rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Header of the Chat/Interface */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-white/5 border-b border-white/5 flex items-center px-4 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
          </div>
          <div className="text-xs font-mono text-muted-foreground">recruiter_agent.exe</div>
          <div className="w-4" />
        </div>

        <div className="pt-12 h-full flex flex-col">
          <AnimatePresence mode="wait">
            {stage === "upload" && (
              <motion.div 
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-12 text-center"
              >
                <div 
                  onClick={handleFileUpload}
                  className="group relative w-64 h-64 rounded-3xl border-2 border-dashed border-white/10 hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-4 bg-white/5 hover:bg-white/10"
                >
                  <div className="w-16 h-16 rounded-2xl bg-black/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Upload CV / Resume</p>
                    <p className="text-xs text-muted-foreground">PDF or DOCX (Max 5MB)</p>
                  </div>
                </div>
                
                <button
                  onClick={handleSkip}
                  className="mt-6 text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                >
                  Skip upload and start chat directly
                </button>
              </motion.div>
            )}

            {stage === "analyzing" && (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-12"
              >
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-t-4 border-primary rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-r-4 border-primary/40 rounded-full animate-spin-reverse"></div>
                </div>
                <h3 className="text-xl font-display font-bold mb-2">Analyzing Profile</h3>
                <div className="space-y-2 text-center">
                  <TypingLog text="Extracting skills..." delay={0} />
                  <TypingLog text="Matching market data..." delay={1000} />
                  <TypingLog text="Building career roadmap..." delay={2000} />
                </div>
              </motion.div>
            )}

            {stage === "chat" && (
              <motion.div 
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col h-[600px]"
              >
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {messages.map((msg) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-4 max-w-[80%]",
                        msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                        msg.role === "assistant" 
                          ? "bg-primary/10 border-primary/20 text-primary" 
                          : "bg-white/10 border-white/20 text-white"
                      )}>
                        {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                      </div>
                      <div className="space-y-1">
                        <div className={cn(
                          "p-4 rounded-2xl text-sm leading-relaxed",
                          msg.role === "assistant" 
                            ? "bg-white/5 border border-white/5 text-foreground rounded-tl-none" 
                            : "bg-primary text-primary-foreground rounded-tr-none"
                        )}>
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-muted-foreground opacity-50 px-1">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 max-w-[80%]"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-primary/10 border-primary/20 text-primary">
                        <Bot size={16} />
                      </div>
                      <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Start Interview Button for Demo */}
                  {messages.some(m => m.content.includes("Click below when you're ready")) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-center pt-4 pb-2"
                    >
                      <button
                        onClick={finishRecruiter}
                        className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 hover:shadow-[0_0_20px_-5px_hsl(var(--primary))] transition-all flex items-center gap-2"
                      >
                        Start Technical Interview <Send size={16} />
                      </button>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 bg-black/20">
                  <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your response..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                    />
                    <button 
                      type="submit"
                      disabled={!inputValue.trim()}
                      className="absolute right-2 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function TypingLog({ text, delay }: { text: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      setTimeout(() => setDone(true), 800);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!visible) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 text-sm text-muted-foreground font-mono"
    >
      {done ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Loader2 className="w-4 h-4 animate-spin" />}
      {text}
    </motion.div>
  );
}
