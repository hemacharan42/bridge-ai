import React from "react";
import { COHORT_HEATMAP_DATA } from "../data/mockData";
import { 
  BarChart3, 
  AlertTriangle, 
  ShieldAlert, 
  Users, 
  TrendingDown, 
  FileSpreadsheet,
  CheckCircle2,
  ArrowUpRight
} from "lucide-react";

export const CohortHeatmapView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
              INSTITUTIONAL COHORT ANALYTICS
            </span>
            <span className="text-xs font-mono text-slate-500">BATCH ITI-2026-N2</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Cohort Practical Competency Failure Heatmap
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Visualizing systemic trade flaws across 140 trainees. Identify which exact NSQF shop-floor protocols suffer the highest execution failure rates before graduation.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px]">Trainees Tested</span>
            <span className="text-white font-bold text-sm">140</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-500 block text-[10px]">Overall Pass Rate</span>
            <span className="text-emerald-400 font-bold text-sm">45.95%</span>
          </div>
        </div>
      </div>

      {/* Primary Heatmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COHORT_HEATMAP_DATA.map((item, idx) => {
          const isHighRisk = item.failureRate >= 50;
          const isMediumRisk = item.failureRate >= 35 && item.failureRate < 50;

          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                item.criticalSafetyRisk
                  ? "bg-gradient-to-br from-slate-900 to-[#180e14] border-rose-900/50"
                  : "bg-slate-900/70 border-slate-800"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                    {item.competencyCode}
                  </span>
                  {item.criticalSafetyRisk && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      CRITICAL RISK
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white leading-snug mb-3">
                  {item.title}
                </h4>

                {/* Big Metric & Progress Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Failure Rate:</span>
                    <span className={`text-xl font-extrabold font-mono ${
                      isHighRisk ? "text-rose-400" : isMediumRisk ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      {item.failureRate}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      style={{ width: `${item.failureRate}%` }}
                      className={`h-full rounded-full ${
                        isHighRisk
                          ? "bg-rose-500"
                          : isMediumRisk
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Primary Violation Cause */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                    Dominant Failure Cause
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {item.topViolationReason}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Tested: {item.traineesTested} Candidates</span>
                <span className="text-amber-400">NSQF L{item.nsqfLevel}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Institutional Recommendation Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Recommended Workshop Curriculum Intervention</span>
          </h4>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Due to the <strong>62% glove non-compliance rate</strong>, mandate Day 1 dielectric glove inspection drills at all 8 workshop benches before power isolation modules commence.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("Batch drill assignment pushed to all 140 ITI student accounts.")}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
        >
          <span>Push Batch Micro-Remediation</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
