import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative w-full pb-12 px-6 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <div className="z-10 text-center max-w-4xl mx-auto space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-[0.2em]">Egypt's First AI Career Counselor</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40"
        >
          Define Your <br />
          <span className="text-primary/90">Trajectory</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed"
        >
          Bridge the gap between your skills and the market. 
          <span className="text-foreground font-medium"> Upload your CV</span> to begin the assessment.
        </motion.p>
      </div>
    </section>
  );
}
