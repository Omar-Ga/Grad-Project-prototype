import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-background/80 backdrop-blur-md"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
          <Terminal className="w-5 h-5 text-primary" />
        </div>
        <span className="font-display text-sm tracking-widest text-foreground/80 uppercase">
          AI Career Architect <span className="text-primary text-xs">v1.0</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1">
          Log In
        </button>
        <button className="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_-5px_hsl(var(--primary))]">
          Sign Up
        </button>
      </div>
    </motion.header>
  );
}
