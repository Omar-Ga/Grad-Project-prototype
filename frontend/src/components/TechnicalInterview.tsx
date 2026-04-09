import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Loader2, Flag } from "lucide-react";
import { cn } from "../lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type InterviewSessionStartResponse = {
  session_id: string;
  recruiter_session_id: string | null;
  assistant_message: string;
  profile_context_available: boolean;
};

type InterviewMessageResponse = {
  session_id: string;
  recruiter_session_id: string | null;
  assistant_message: string;
  latency_ms: number;
};

interface TechnicalInterviewProps {
  recruiterSessionId?: string | null;
  onComplete?: () => void;
}

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8000";

export function TechnicalInterview({ recruiterSessionId, onComplete }: TechnicalInterviewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [profileContextAvailable, setProfileContextAvailable] = useState(false);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addMessage = (role: "user" | "assistant", content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        role,
        content,
        timestamp: new Date(),
      },
    ]);
  };

  useEffect(() => {
    const startInterviewSession = async () => {
      setIsStartingSession(true);
      setIsTyping(false);
      setChatError(null);
      setMessages([]);
      setSessionId(null);

      try {
        const response = await fetch(`${BACKEND_API_URL}/api/interview/session/start`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ recruiter_session_id: recruiterSessionId ?? null }),
        });

        const responseBody = (await response.json().catch(() => null)) as
          | InterviewSessionStartResponse
          | { detail?: string }
          | null;

        if (!response.ok || !responseBody || !("session_id" in responseBody)) {
          const message = responseBody && "detail" in responseBody && responseBody.detail
            ? responseBody.detail
            : "Could not start technical interview. Please try again.";
          throw new Error(message);
        }

        setSessionId(responseBody.session_id);
        setProfileContextAvailable(Boolean(responseBody.profile_context_available));
        addMessage("assistant", responseBody.assistant_message);
      } catch (error) {
        setChatError(error instanceof Error ? error.message : "Could not start interview session.");
      } finally {
        setIsStartingSession(false);
      }
    };

    void startInterviewSession();
  }, [recruiterSessionId]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !sessionId || isSendingMessage || isStartingSession) return;

    const userMsg = inputValue.trim();
    setInputValue("");
    addMessage("user", userMsg);
    setIsTyping(true);
    setIsSendingMessage(true);
    setChatError(null);

    try {
      const response = await fetch(`${BACKEND_API_URL}/api/interview/session/${sessionId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMsg }),
      });

      const responseBody = (await response.json().catch(() => null)) as
        | InterviewMessageResponse
        | { detail?: string }
        | null;

      if (!response.ok || !responseBody || !("assistant_message" in responseBody)) {
        const message = responseBody && "detail" in responseBody && responseBody.detail
          ? responseBody.detail
          : "Failed to get interviewer response. Please try again.";
        throw new Error(message);
      }

      addMessage("assistant", responseBody.assistant_message);
    } catch (error) {
      setChatError(error instanceof Error ? error.message : "Unexpected interview chat error.");
    } finally {
      setIsTyping(false);
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative min-h-[600px] rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl"
      >
        <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-4 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
          </div>
          <div className="text-xs font-mono text-muted-foreground">tech_lead_agent.exe</div>
          <button
            onClick={onComplete}
            className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-white/25 transition-colors"
          >
            <Flag size={12} />
            Finish Interview
          </button>
        </div>

        <div className="h-[600px] flex flex-col">
          <div className="px-6 pt-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-muted-foreground">
              <span className={cn("h-2 w-2 rounded-full", profileContextAvailable ? "bg-emerald-400" : "bg-amber-400")} />
              {profileContextAvailable ? "Using Agent 1 profile context" : "Running in generic interviewer mode"}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {isStartingSession && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Starting technical interview session...
              </div>
            )}

            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex gap-4 max-w-[85%]", msg.role === "user" ? "ml-auto flex-row-reverse" : "")}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                    msg.role === "assistant"
                      ? "bg-primary/10 border-primary/20 text-primary"
                      : "bg-white/10 border-white/20 text-white"
                  )}
                >
                  {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="space-y-1">
                  <div
                    className={cn(
                      "p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                      msg.role === "assistant"
                        ? "bg-white/5 border border-white/5 text-foreground rounded-tl-none"
                        : "bg-primary text-primary-foreground rounded-tr-none"
                    )}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-muted-foreground opacity-50 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 max-w-[85%]">
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

            {chatError && (
              <div className="flex justify-center">
                <p className="text-xs text-red-400">{chatError}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/10 bg-black/20">
            <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your answer..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || !sessionId || isSendingMessage || isStartingSession}
                className="absolute right-2 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
