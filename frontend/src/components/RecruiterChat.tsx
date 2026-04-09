import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Send, User, Bot, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type Stage = "upload" | "analyzing" | "chat";

type RecruiterProfile = {
  target_role: string | null;
  years_experience: number | null;
  skills: string[];
  confirmed: boolean;
};

type SessionStartResponse = {
  session_id: string;
  assistant_message: string;
  ready: boolean;
  missing_fields: string[];
  profile: RecruiterProfile;
};

type RecruiterMessageResponse = {
  session_id: string;
  assistant_message: string;
  ready: boolean;
  missing_fields: string[];
  profile: RecruiterProfile;
  latency_ms: number;
};

interface RecruiterChatProps {
  onComplete?: (sessionId: string) => void;
}

const MAX_PDF_SIZE_BYTES = 15 * 1024 * 1024;
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8000";

export function RecruiterChat({ onComplete }: RecruiterChatProps) {
  const [stage, setStage] = useState<Stage>("upload");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);
  const [uploadingFileName, setUploadingFileName] = useState<string>("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isReadyForInterview, setIsReadyForInterview] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const missingFieldLabels: Record<string, string> = {
    target_role: "target role direction",
    years_experience: "experience length",
    skills: "technologies and tools",
    confirmation: "final confirmation",
  };

  const startRecruiterSession = async (payload: {
    skip_cv: boolean;
    cv_original_name?: string;
    cv_stored_name?: string;
  }) => {
    const response = await fetch(`${BACKEND_API_URL}/api/recruiter/session/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseBody = (await response.json().catch(() => null)) as SessionStartResponse | { detail?: string } | null;
    if (!response.ok || !responseBody || !("session_id" in responseBody)) {
      const message = responseBody && "detail" in responseBody && responseBody.detail
        ? responseBody.detail
        : "Could not start recruiter session. Please try again.";
      throw new Error(message);
    }

    setMessages([]);
    setSessionId(responseBody.session_id);
    setIsReadyForInterview(Boolean(responseBody.ready));
    setMissingFields(Array.isArray(responseBody.missing_fields) ? responseBody.missing_fields : []);
    setChatError(null);
    setStage("chat");
    addMessage("assistant", responseBody.assistant_message);
  };

  const handleUploadClick = () => {
    setUploadError(null);
    setChatError(null);
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setUploadError(null);

    if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("Only PDF files are allowed.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > MAX_PDF_SIZE_BYTES) {
      setUploadError("Maximum file size is 15MB.");
      event.target.value = "";
      return;
    }

    setUploadingFileName(selectedFile.name);
    setStage("analyzing");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${BACKEND_API_URL}/api/cv/upload`, {
        method: "POST",
        body: formData,
      });

      const responseBody = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(responseBody?.detail || "Upload failed. Please try again.");
      }

      await startRecruiterSession({
        skip_cv: false,
        cv_original_name: responseBody?.original_name || selectedFile.name,
        cv_stored_name: responseBody?.stored_name,
      });
    } catch (error) {
      setStage("upload");
      setUploadError(error instanceof Error ? error.message : "Upload failed. Please try again.");
    } finally {
      event.target.value = "";
    }
  };

  const handleSkip = async () => {
    setUploadError(null);
    setChatError(null);
    setUploadingFileName("");
    setStage("analyzing");

    try {
      await startRecruiterSession({ skip_cv: true });
    } catch (error) {
      setStage("upload");
      setUploadError(error instanceof Error ? error.message : "Could not start recruiter session.");
    }
  };

  const finishRecruiter = () => {
    if (onComplete && sessionId) onComplete(sessionId);
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
    if (!inputValue.trim() || !sessionId || isSendingMessage) return;

    const userMsg = inputValue;
    setInputValue("");
    addMessage("user", userMsg);
    setIsTyping(true);
    setIsSendingMessage(true);
    setChatError(null);

    try {
      const response = await fetch(`${BACKEND_API_URL}/api/recruiter/session/${sessionId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMsg }),
      });

      const responseBody = (await response.json().catch(() => null)) as RecruiterMessageResponse | { detail?: string } | null;
      if (!response.ok || !responseBody || !("assistant_message" in responseBody)) {
        const message = responseBody && "detail" in responseBody && responseBody.detail
          ? responseBody.detail
          : "Failed to get recruiter response. Please try again.";
        throw new Error(message);
      }

      addMessage("assistant", responseBody.assistant_message);
      setIsReadyForInterview(Boolean(responseBody.ready));
      setMissingFields(Array.isArray(responseBody.missing_fields) ? responseBody.missing_fields : []);
    } catch (error) {
      setChatError(error instanceof Error ? error.message : "Unexpected chat error.");
    } finally {
      setIsTyping(false);
      setIsSendingMessage(false);
    }
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div 
                  onClick={handleUploadClick}
                  className="group relative w-64 h-64 rounded-3xl border-2 border-dashed border-white/10 hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-4 bg-white/5 hover:bg-white/10"
                >
                  <div className="w-16 h-16 rounded-2xl bg-black/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Upload CV / Resume</p>
                    <p className="text-xs text-muted-foreground">PDF only (Max 15MB)</p>
                  </div>
                </div>

                {uploadError && (
                  <p className="mt-4 text-xs text-red-400">{uploadError}</p>
                )}
                
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
                  {uploadingFileName ? (
                    <>
                      <TypingLog text="Uploading PDF..." delay={0} />
                      <TypingLog text="Validating file..." delay={500} />
                      <TypingLog text="Saving securely for later review..." delay={1000} />
                    </>
                  ) : (
                    <>
                      <TypingLog text="Creating recruiter session..." delay={0} />
                      <TypingLog text="Preparing profile intake..." delay={500} />
                    </>
                  )}
                  {uploadingFileName && <p className="text-xs text-muted-foreground">{uploadingFileName}</p>}
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

                  {chatError && (
                    <div className="flex justify-center pt-2">
                      <p className="text-xs text-red-400">{chatError}</p>
                    </div>
                  )}
                  
                  {sessionId && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-2 pt-4 pb-2"
                    >
                      {!isReadyForInterview && (
                        <p className="text-[11px] text-muted-foreground text-center">
                          Conversation topics left: {missingFields.map((field) => missingFieldLabels[field] || field).join(", ")}
                        </p>
                      )}
                      <button
                        onClick={finishRecruiter}
                        disabled={!isReadyForInterview}
                        className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 hover:shadow-[0_0_20px_-5px_hsl(var(--primary))] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:shadow-none"
                      >
                        {isReadyForInterview ? "Start Technical Interview" : "Interview Locked"} <Send size={16} />
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
                      disabled={!inputValue.trim() || isSendingMessage || !sessionId}
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
