import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Target, 
  Building2, 
  MapPin, 
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const SKILL_DATA = [
  { subject: 'React', A: 85, fullMark: 100 },
  { subject: 'TypeScript', A: 65, fullMark: 100 },
  { subject: 'Node.js', A: 40, fullMark: 100 },
  { subject: 'CSS/Tailwind', A: 90, fullMark: 100 },
  { subject: 'Testing', A: 30, fullMark: 100 },
  { subject: 'System Design', A: 50, fullMark: 100 },
];

const SALARY_DATA = [
  { name: 'Junior', min: 8000, max: 15000 },
  { name: 'Mid-Level', min: 18000, max: 35000 },
  { name: 'Senior', min: 45000, max: 85000 },
];

const RECOMMENDED_JOBS = [
  {
    id: 1,
    title: "Junior Frontend Developer",
    company: "Instabug",
    location: "Cairo, Egypt (Hybrid)",
    match: 85,
    missingSkills: ["Unit Testing"],
  },
  {
    id: 2,
    title: "React Developer",
    company: "Vodafone Intelligent Solutions",
    location: "Smart Village, Giza",
    match: 72,
    missingSkills: ["Redux Saga", "Jest"],
  },
  {
    id: 3,
    title: "Frontend Engineer",
    company: "Swvl",
    location: "Remote / Cairo",
    match: 60,
    missingSkills: ["Next.js", "Performance Optimization"],
  }
];

export function AnalystDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 seconds loading
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-24 h-24 mb-8"
        >
          <div className="absolute inset-0 border-t-4 border-primary rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-r-4 border-primary/40 rounded-full animate-spin-reverse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-2xl font-bold text-primary animate-pulse">AI</span>
          </div>
        </motion.div>
        
        <h2 className="text-2xl font-display font-bold mb-2">Processing Assessment Data</h2>
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
           <motion.div 
             className="h-full bg-primary"
             initial={{ width: "0%" }}
             animate={{ width: "100%" }}
             transition={{ duration: 5, ease: "linear" }}
           />
        </div>
        
        <div className="space-y-1">
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="text-sm text-muted-foreground font-mono"
           >
             Aggregating coding performance...
           </motion.p>
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 2.0 }}
             className="text-sm text-muted-foreground font-mono"
           >
             Scraping real-time market data...
           </motion.p>
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 3.5 }}
             className="text-sm text-muted-foreground font-mono"
           >
             Generating gap analysis report...
           </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 pb-12 space-y-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono uppercase tracking-wider">
              Analysis Complete
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Generated via RAG (Wuzzuf/Tanqeeb Data)
            </span>
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground">
            Career <span className="text-primary">Intelligence</span> Report
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Based on your technical assessment and real-time Egyptian market data from October 2025.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Overall Readiness</div>
            <div className="text-3xl font-display font-bold text-yellow-500">65/100</div>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Market Fit</div>
            <div className="text-3xl font-display font-bold text-primary">Mid-Junior</div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Skills & Gaps (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Skill Radar Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Technical Competency Map
              </h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SKILL_DATA}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="My Skills"
                    dataKey="A"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Gap Analysis Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <h4 className="font-medium">Critical Gaps</h4>
                </div>
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">High Priority</span>
              </div>
              <ul className="space-y-3">
                <li className="text-sm text-gray-300 flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-white">Unit Testing (Jest/RTL)</strong>
                    <br />
                    <span className="text-xs text-gray-500">Required by 80% of target jobs</span>
                  </span>
                </li>
                <li className="text-sm text-gray-300 flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-white">Next.js (App Router)</strong>
                    <br />
                    <span className="text-xs text-gray-500">Standard for Cairo startups</span>
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <h4 className="font-medium">Strong Points</h4>
                </div>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Verified</span>
              </div>
              <ul className="space-y-3">
                <li className="text-sm text-gray-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-white">React Core</strong>
                    <br />
                    <span className="text-xs text-gray-500">Top 10% of candidates</span>
                  </span>
                </li>
                <li className="text-sm text-gray-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-white">CSS / Tailwind</strong>
                    <br />
                    <span className="text-xs text-gray-500">Production-ready quality</span>
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Market Data & Jobs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Salary Estimator */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Market Value Estimation
              </h3>
              <span className="text-xs text-muted-foreground">EGP / Month</span>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SALARY_DATA} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#9ca3af', fontSize: 12 }} width={80} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                    formatter={(value: any) => [`EGP ${value?.toLocaleString()}`, 'Avg Salary']}
                  />
                  <Bar dataKey="min" stackId="a" fill="transparent" />
                  <Bar dataKey="max" stackId="a" fill="#22c55e" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-center">
              Your estimated range: <span className="text-green-400 font-bold">12,000 - 18,000 EGP</span>
            </div>
          </motion.div>

          {/* Job Recommendations */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-400" />
                Recommended Roles
              </h3>
            </div>
            <div className="space-y-4">
              {RECOMMENDED_JOBS.map((job) => (
                <div key={job.id} className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-white group-hover:text-primary transition-colors">{job.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Building2 className="w-3 h-3" />
                        {job.company}
                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-primary">{job.match}% Match</span>
                      <a href="#" className="text-xs text-muted-foreground hover:text-white flex items-center gap-1 mt-1">
                        Apply <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  {job.missingSkills.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-xs text-muted-foreground mb-2">Missing Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.missingSkills.map((skill) => (
                          <span key={skill} className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400 border border-red-500/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
