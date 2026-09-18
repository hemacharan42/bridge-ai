import React, { useState } from "react";
import { 
  Flame, 
  ShieldCheck, 
  Calendar, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ChevronRight,
  TrendingUp,
  ShieldAlert
} from "lucide-react";
import confetti from "canvas-confetti";

interface GamificationStreakProps {
  currentStreakDays?: number;
  longestStreakDays?: number;
  onPracticeDrill?: () => void;
}

export const GamificationStreak: React.FC<GamificationStreakProps> = ({
  currentStreakDays = 14,
  longestStreakDays = 22,
  onPracticeDrill,
}) => {
  const [hasCheckedInToday, setHasCheckedInToday] = useState(true);
  const [streakCount, setStreakCount] = useState(currentStreakDays);
  const [shieldCount, setShieldCount] = useState(1);

  const daysOfWeek = [
    { label: "M", full: "Monday", date: "14 Sep", completed: true, xp: "+50 XP" },
    { label: "T", full: "Tuesday", date: "15 Sep", completed: true, xp: "+50 XP" },
    { label: "W", full: "Wednesday", date: "16 Sep", completed: true, xp: "+50 XP" },
    { label: "T", full: "Thursday", date: "17 Sep", completed: true, xp: "+50 XP" },
    { label: "F", full: "Friday (Today)", date: "18 Sep", completed: hasCheckedInToday, isToday: true, xp: "+75 XP" },
    { label: "S", full: "Saturday", date: "19 Sep", completed: false, upcoming: true },
    { label: "S", full: "Sunday", date: "20 Sep", completed: false, upcoming: true },
  ];

  const handleClaimReward = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
    setStreakCount((prev) => prev + 1);
    setHasCheckedInToday(true);
  };

  const nextMilestone = 17;
  const daysLeft = Math.max(0, nextMilestone - streakCount);
  const milestoneProgress = Math.min(100, Math.round((streakCount / nextMilestone) * 100));

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl relative overflow-hidden shadow-xl space-y-5">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header: Flame + Streak Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/25 to-rose-500/25 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Flame className="w-6 h-6 text-amber-400 fill-amber-400/30 animate-pulse" />
            <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-white font-mono">
                {streakCount} Day Learning Streak
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                ON FIRE 🔥
              </span>
            </div>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              Personal Record: <strong className="text-slate-200 font-mono">{longestStreakDays} Days</strong> • Daily retention protects your recruiter verification rank.
            </p>
          </div>
        </div>

        {/* Streak Shield Status */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300">
              Streak Shield: <strong className="text-cyan-400">{shieldCount}/1 Active</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 7-Day Visual Progress Track */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Weekly Verification Calendar</span>
          </span>
          <span className="text-amber-400 font-bold">
            5 of 7 Days Complete (+275 XP)
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-between transition-all ${
                day.isToday
                  ? "bg-amber-500/15 border-amber-400/60 shadow-md shadow-amber-500/10 ring-1 ring-amber-400/30"
                  : day.completed
                  ? "bg-slate-950/80 border-emerald-500/30 text-slate-300"
                  : "bg-slate-950/40 border-slate-800/80 text-slate-500"
              }`}
            >
              <span className="text-[10px] font-mono text-slate-400">{day.label}</span>
              <div className="my-1">
                {day.completed ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                ) : day.isToday ? (
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto animate-pulse">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-800/60 text-slate-600 border border-slate-700/50 flex items-center justify-center mx-auto">
                    <Clock className="w-3 h-3" />
                  </div>
                )}
              </div>
              <span className="text-[9px] font-mono text-slate-400 truncate w-full">
                {day.xp || day.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Tier Milestone Reward Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Next Milestone: 17-Day Multiplier Badge</span>
          </span>
          <span className="text-amber-400 font-bold">{daysLeft === 0 ? "Unlocked!" : `${daysLeft} Days to go`}</span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700"
            style={{ width: `${milestoneProgress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
          <span>Unlocks 1.25x Recruiter Visibility Multiplier on L&amp;T &amp; Schneider Talent Desks</span>
          {hasCheckedInToday ? (
            <span className="text-emerald-400 font-mono font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Today Logged
            </span>
          ) : (
            <button
              type="button"
              onClick={handleClaimReward}
              className="text-amber-400 hover:text-amber-300 font-mono underline font-medium cursor-pointer"
            >
              Claim Today's Practice (+50 XP)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
