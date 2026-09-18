import React from "react";
import { 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  ArrowUpRight,
  Flame,
  Calendar,
  Sparkles
} from "lucide-react";
import { Course, UserProfile } from "../../types";

interface StudentProgressSummaryProps {
  user?: UserProfile | null;
  course: Course;
  readinessScore: number;
  onLaunchDrill: () => void;
  onOpenScorecard: () => void;
}

export const StudentProgressSummary: React.FC<StudentProgressSummaryProps> = ({
  user,
  course,
  readinessScore,
  onLaunchDrill,
  onOpenScorecard,
}) => {
  const userName = user?.name || "Trainee Candidate";
  const userId = user?.id || "ITI-2026-042";
  const userInstitution = user?.institution || "Government ITI Pusa, New Delhi";
  return (
    <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0a1220] to-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
      {/* Ambient Radial Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left: Trainee Info & Job Readiness Status */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider font-bold">
              NSQF Level {course.nsqfLevel} • {course.tradeCode}
            </span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3 h-3" />
              Verified In DGT Institutional Registry
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Roll: {userId}
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>{userName}</span>
              <span className="text-xs font-normal text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
                Trainee Batch 2026
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-light mt-1 leading-relaxed">
              {userInstitution} • Enrolled in{" "}
              <strong className="text-white font-medium">{course.title}</strong>
            </p>
          </div>

          {/* Core Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Safety Adherence</div>
              <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">92.0%</div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Zero electrocution hazard</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Procedural Steps</div>
              <div className="text-lg font-mono font-bold text-cyan-400 mt-0.5">89.0%</div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>3 of 4 modules verified</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 col-span-2 sm:col-span-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Technical Viva Speech</div>
              <div className="text-lg font-mono font-bold text-amber-400 mt-0.5">88.0%</div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>High technical coherence</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Job-Readiness Radial KPI Card */}
        <div className="w-full lg:w-72 shrink-0 p-5 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Industry Readiness Index
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
              L&amp;T / Schneider Tier
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Donut progress ring */}
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${readinessScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                <span className="text-lg font-extrabold text-white">{readinessScore}%</span>
                <span className="text-[8px] text-cyan-400 uppercase">Ready</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-semibold text-white">Market-Certified</div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Qualifies for direct plant floor interview without probation.
              </p>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
            <button
              type="button"
              onClick={onLaunchDrill}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Launch Assessment</span>
            </button>
            <button
              type="button"
              onClick={onOpenScorecard}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer"
              title="View full cryptographic NSQF report"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
