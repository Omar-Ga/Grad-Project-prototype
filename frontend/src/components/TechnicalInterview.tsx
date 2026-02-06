import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Play, RefreshCw, Code2 } from "lucide-react";
import { cn } from "../lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type QuestionType = "general" | "coding";

interface TechnicalInterviewProps {
  onComplete?: () => void;
}

export function TechnicalInterview({ onComplete }: TechnicalInterviewProps) {
  const [questionType, setQuestionType] = useState<QuestionType>("general");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Welcome to the technical assessment. I'm your Tech Lead for this session. We'll go through a mix of conceptual questions and practical coding challenges. Ready to begin?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [codeValue, setCodeValue] = useState("// Write your solution here\nfunction solution() {\n  \n}");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setInputValue("");
    addMessage("user", userMsg);
    setIsTyping(true);

    // Mock Logic for prototype flow
    setTimeout(() => {
      setIsTyping(false);
      
      // Flow Sequence:
      // 1. Initial State (1 msg) -> User replies "Ready" (2 msgs)
      // 2. Bot asks Q1 General (3 msgs)
      // 3. User replies to Q1 (4 msgs) -> Bot asks Q2 Coding (5 msgs) -> Switch to Coding Mode
      // 4. User submits Code (6 msgs) -> Bot asks Q3 General (7 msgs) -> Switch back to General Mode
      // 5. User replies to Q3 (8 msgs) -> Bot gives final message (9 msgs) -> Auto Transition

      if (messages.length === 1) { 
        // Step 1: User said "Ready", Bot asks Q1 (General)
        addMessage("assistant", "Excellent. Let's start with a React concept. Can you explain the difference between State and Props?");
      } 
      else if (messages.length === 3) { 
        // Step 2: User answered Q1, Bot asks Q2 (Coding)
        setQuestionType("coding"); 
        addMessage("assistant", "Good explanation. Now let's test your practical skills. I've opened the coding environment.\n\nTask: Write a function `isValidPalindrome` that returns true if a string is a palindrome, ignoring case and non-alphanumeric characters.");
      } 
      else if (messages.length === 5) { 
        // Step 3: User submitted Code, Bot asks Q3 (General)
        setQuestionType("general");
        addMessage("assistant", "The solution looks correct and passes all test cases. Well done. Let's move back to architecture. How would you handle global state in a large application?");
      } 
      else if (messages.length === 7) {
        // Step 4: User answered Q3, Bot gives final message
        addMessage("assistant", "Great, I have everything I need, please hold as we generate a report tailored to you.");
        
        // Auto transition after 3 seconds
        setTimeout(() => {
          onComplete?.();
        }, 3000);
      }
      else {
        addMessage("assistant", "I see. Let's continue...");
      }
    }, 1500);
  };

  const addMessage = (role: "user" | "assistant", content: string) => {
    setMessages(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      role,
      content,
      timestamp: new Date()
    }]);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 pb-12 h-[calc(100vh-250px)] min-h-[600px]">
      <div className="flex gap-6 h-full">
        {/* Chat Area */}
        <motion.div 
          layout
          className={cn(
            "flex flex-col rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl transition-all duration-500 ease-in-out",
            questionType === "coding" ? "w-1/3" : "w-full max-w-4xl mx-auto"
          )}
        >
          {/* Header */}
          <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-4 justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
            <div className="text-xs font-mono text-muted-foreground">tech_lead_agent.exe</div>
            <div className="w-4" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4",
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
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed max-w-[90%]",
                  msg.role === "assistant" 
                    ? "bg-white/5 border border-white/5 text-foreground rounded-tl-none" 
                    : "bg-primary text-primary-foreground rounded-tr-none"
                )}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-primary/10 border-primary/20 text-primary">
                  <Bot size={16} />
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-black/20 shrink-0">
            <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={questionType === "coding" ? "Type 'submit' to run code..." : "Type your answer..."}
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

        {/* Coding Environment - Only visible in coding mode */}
        <AnimatePresence mode="popLayout">
          {questionType === "coding" && (
            <motion.div 
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "66%" }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="flex flex-col rounded-2xl border border-white/10 bg-[#1e1e1e] overflow-hidden shadow-2xl"
            >
              {/* Editor Toolbar */}
              <div className="h-12 bg-[#252526] border-b border-black/50 flex items-center px-4 justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">solution.js</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs text-gray-300 transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                  <button 
                    onClick={() => {
                      setInputValue("I've submitted my solution.");
                      handleSendMessage();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-green-600 hover:bg-green-700 text-xs text-white transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Run & Submit
                  </button>
                </div>
              </div>

              {/* Simple Editor Area */}
              <div className="flex-1 relative font-mono text-sm">
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#1e1e1e] border-r border-white/5 flex flex-col items-center pt-4 text-gray-600 select-none">
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <div key={n} className="h-6">{n}</div>)}
                </div>
                <textarea
                  value={codeValue}
                  onChange={(e) => setCodeValue(e.target.value)}
                  className="absolute inset-0 left-12 w-[calc(100%-3rem)] h-full bg-[#1e1e1e] text-gray-300 p-4 resize-none focus:outline-none leading-6"
                  spellCheck={false}
                />
              </div>

              {/* Console/Output Area (Mock) */}
              <div className="h-32 bg-[#1e1e1e] border-t border-white/10 p-4 font-mono text-xs">
                <div className="text-gray-500 mb-2">Console Output:</div>
                <div className="text-gray-400">&gt; Ready to execute...</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
