import React, { useState } from "react";
import { useAssessment } from "../store/assessmentContext";
import { MillisecondVideoPlayer } from "./MillisecondVideoPlayer";
import { MicroEvidenceItem, FinalVerdict, RemediationTask } from "../types";
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Calendar, 
  Clock, 
  Award, 
  FileText, 
  Mic, 
  Video, 
  User, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  QrCode,
  Layers,
  ChevronRight
} from "lucide-react";
import confetti from "canvas-confetti";

interface ScorecardViewProps {
  onNavigateToQueue?: () => void;
  onNavigateToStudio?: () => void;
}

export const ScorecardView: React.FC<ScorecardViewProps> = ({ onNavigateToQueue, onNavigateToStudio }) => {
  const { 
    activeReport, 
    activeMarkerTimestampMs, 
    setActiveMarker, 
    toggleRemediationItem,
    loadGoldenDemoData,
    loadCertifiedDemoData
  } = useAssessment();

  const [activeTab, setActiveTab] = useState<"evidence" | "rubric" | "speech" | "remediation" | "badge">("evidence");

  const isCertified = activeReport.verdict === "CERTIFIED_COMPETENT";
  const isRemediationRequired = activeReport.verdict === "CONDITIONAL_REMEDIATION_REQUIRED";
  const isHumanReviewRequired = activeReport.human_review_required || activeReport.verdict === "FLAGGED_FOR_HUMAN_AUDIT";

  // Find currently active micro evidence item
  const selectedEvidence = activeReport.micro_evidence_timeline.find(
    (m) => m.timestamp_ms === activeMarkerTimestampMs
  ) || activeReport.micro_evidence_timeline[2] || activeReport.micro_evidence_timeline[0];

  const handleMarkerClick = (marker: MicroEvidenceItem) => {
    setActiveMarker(marker.timestamp_ms);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const getVerdictStyle = (verdict: FinalVerdict) => {
    switch (verdict) {
      case "CERTIFIED_COMPETENT":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
          title: "STATUS: CERTIFIED COMPETENT",
          subtitle: "All NSQF Level 4 procedural steps and dielectric safety standards validated with high confidence."
        };
      case "CONDITIONAL_REMEDIATION_REQUIRED":
        return {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
          title: "STATUS: CONDITIONAL REMEDIATION REQUIRED",
          subtitle: "Procedural sequence passed, but critical 1000V PPE glove violation logged. 7-day micro-drill assigned."
        };
      case "FLAGGED_FOR_HUMAN_AUDIT":
        return {
          bg: "bg-purple-500/10 border-purple-500/30 text-purple-300",
          icon: <HelpCircle className="w-5 h-5 text-purple-400" />,
          title: "STATUS: UNCERTAIN_EVIDENCE (ROUTED TO FACULTY)",
          subtitle: "Camera occlusion >30% detected. Forwarded to Senior Trade Instructor queue to preserve zero hallucination."
        };
      case "FAILED_UNSAFE_OPERATION":
      default:
        return {
          bg: "bg-rose-500/10 border-rose-500/30 text-rose-300",
          icon: <XCircle className="w-5 h-5 text-rose-400" />,
          title: "STATUS: FAILED UNSAFE OPERATION",
          subtitle: "Multiple critical electrocution safety protocol failures logged."
        };
    }
  };

  const verdictStyle = getVerdictStyle(activeReport.verdict);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Sample Switcher Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight">
                Report #{activeReport.report_id}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                {activeReport.trade_info.trade_name} • NSQF L{activeReport.trade_info.nsqf_level}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Candidate: <span className="text-slate-200">{activeReport.candidate_name || activeReport.candidate_id}</span> • Evaluated: {new Date(activeReport.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Demo Fast Switcher (Golden Run vs Certified Benchmark) */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 hidden md:inline">Preset Run:</span>
          <button
            type="button"
            id="btn-load-golden-sample"
            onClick={loadGoldenDemoData}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors border ${
              isRemediationRequired
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
            }`}
          >
            Golden Run (Rajesh • 76.5)
          </button>
          <button
            type="button"
            id="btn-load-certified-sample"
            onClick={() => {
              loadCertifiedDemoData();
              triggerCelebration();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors border ${
              isCertified
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
            }`}
          >
            Certified (Amit • 94.5)
          </button>
        </div>
      </div>

      {/* Main Verdict & Score Banner */}
      <div className={`p-5 rounded-2xl border ${verdictStyle.bg} flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg`}>
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-current/20 shrink-0 mt-0.5">
            {verdictStyle.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold tracking-tight">
                {verdictStyle.title}
              </h3>
              {isHumanReviewRequired && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono border border-purple-500/40">
                  HUMAN-IN-THE-LOOP ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-300/90 mt-1 max-w-2xl leading-relaxed">
              {verdictStyle.subtitle}
            </p>
          </div>
        </div>

        {/* Big Score Card */}
        <div className="flex items-center gap-4 self-end md:self-auto bg-slate-950/60 px-5 py-3 rounded-xl border border-slate-800 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Composite NSQF Score
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
              {activeReport.composite_score}
              <span className="text-sm font-normal text-slate-500">/100</span>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-800" />
          <div className="text-xs font-mono space-y-0.5 text-slate-400">
            <div>PPE Safety: <span className="text-slate-200 font-semibold">{activeReport.breakdown.safety_score}%</span></div>
            <div>Sequence: <span className="text-slate-200 font-semibold">{activeReport.breakdown.sequence_score}%</span></div>
            <div>Verbal: <span className="text-slate-200 font-semibold">{activeReport.breakdown.verbal_score}%</span></div>
          </div>
        </div>
      </div>

      {/* Dual-Pane Core Evidence & Rubrics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Millisecond Video Player & Micro-Evidence Scrubbing Bar */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 tracking-wider uppercase flex items-center gap-1.5 font-mono">
              <Video className="w-3.5 h-3.5 text-amber-400" />
              Millisecond-Accurate Execution Player (±50ms)
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Click any evidence tag below to seek
            </span>
          </div>

          {/* Custom Millisecond Player */}
          <MillisecondVideoPlayer
            activeTimestampMs={activeMarkerTimestampMs}
            timelineMarkers={activeReport.micro_evidence_timeline}
            onMarkerClick={handleMarkerClick}
            highlightBoundingBox={selectedEvidence?.bounding_box_norm}
            activeLabel={selectedEvidence?.label}
          />

          {/* Micro-Evidence Timeline Cards (Clickable per US-02) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span>Grounded Micro-Evidence Trail ({activeReport.micro_evidence_timeline.length} Marks)</span>
              <span className="text-amber-400 text-[11px]">Instant Video Scrub</span>
            </div>

            <div className="space-y-2" id="micro-evidence-list">
              {activeReport.micro_evidence_timeline.map((item, idx) => {
                const isSelected = activeMarkerTimestampMs === item.timestamp_ms;
                const isFail = item.status === "FAIL";
                const isUncertain = item.status === "UNCERTAIN_EVIDENCE";

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleMarkerClick(item)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? isFail
                          ? "bg-rose-500/15 border-rose-500 shadow-md shadow-rose-500/10"
                          : isUncertain
                          ? "bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10"
                          : "bg-emerald-500/15 border-emerald-500 shadow-md shadow-emerald-500/10"
                        : "bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-xs px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 font-bold shrink-0">
                        {(item.timestamp_ms / 1000).toFixed(1)}s
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                          {isFail ? (
                            <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          ) : isUncertain ? (
                            <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                          <span>{item.label}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Source: {item.source} {item.penalty_points > 0 && `• Penalty: -${item.penalty_points} pts`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        isFail
                          ? "bg-rose-500/20 text-rose-300"
                          : isUncertain
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}>
                        {item.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Diagnostic Rubric Tabs & 7-Day Remediation */}
        <div className="lg:col-span-5 space-y-4">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
            <button
              type="button"
              id="tab-rubric-btn"
              onClick={() => setActiveTab("rubric")}
              className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-lg text-xs font-medium transition-colors text-center ${
                activeTab === "rubric"
                  ? "bg-slate-800 text-amber-300 shadow-xs border border-slate-700 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              NSQF Steps
            </button>
            <button
              type="button"
              id="tab-speech-btn"
              onClick={() => setActiveTab("speech")}
              className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-lg text-xs font-medium transition-colors text-center ${
                activeTab === "speech"
                  ? "bg-slate-800 text-amber-300 shadow-xs border border-slate-700 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Verbal STT
            </button>
            <button
              type="button"
              id="tab-remediation-btn"
              onClick={() => setActiveTab("remediation")}
              className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-lg text-xs font-medium transition-colors text-center flex items-center justify-center gap-1 ${
                activeTab === "remediation"
                  ? "bg-slate-800 text-amber-300 shadow-xs border border-slate-700 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>7-Day Plan</span>
              {activeReport.seven_day_remediation_plan.length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </button>
            <button
              type="button"
              id="tab-badge-btn"
              onClick={() => setActiveTab("badge")}
              className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-lg text-xs font-medium transition-colors text-center ${
                activeTab === "badge"
                  ? "bg-slate-800 text-amber-300 shadow-xs border border-slate-700 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Skill Badge
            </button>
          </div>

          {/* Tab 1: NSQF Procedural Step Audit */}
          {activeTab === "rubric" && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">
                  NSQF Level {activeReport.trade_info.nsqf_level} Procedural Audit
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  {activeReport.sequence_audit?.steps_completed}/{activeReport.sequence_audit?.steps_total} Verified
                </span>
              </div>

              <div className="space-y-2.5">
                {activeReport.sequence_audit?.steps.map((step) => {
                  const isPass = step.status === "PASS";
                  const isUncertain = step.status === "UNCERTAIN_EVIDENCE";

                  return (
                    <div
                      key={step.step_order}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] flex items-center justify-center font-bold">
                            {step.step_order}
                          </span>
                          <span className="text-xs font-semibold text-white">{step.name}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                          isPass
                            ? "bg-emerald-500/20 text-emerald-300"
                            : isUncertain
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-rose-500/20 text-rose-300"
                        }`}>
                          {step.status}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 pl-7 leading-relaxed">
                        {step.evidence_description || "Verified against trade syllabus."}
                      </p>

                      {step.uncertainty_reason && (
                        <div className="ml-7 p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center justify-between gap-2">
                          <span>{step.uncertainty_reason}</span>
                          {onNavigateToQueue && (
                            <button
                              type="button"
                              onClick={onNavigateToQueue}
                              className="text-[10px] underline font-mono text-amber-400 shrink-0"
                            >
                              Triage Queue →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Speech Reasoning Audit */}
          {activeTab === "speech" && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-amber-400" />
                  Verbal Reasoning NLP Audit (Whisper + Gemini)
                </span>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {activeReport.speech_audit?.overall_verbal_score}% Verbal
                </span>
              </div>

              {/* Transcript box */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                  Verbal Audio Transcript ({activeReport.speech_audit?.duration_seconds}s)
                </span>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{activeReport.speech_audit?.transcript}"
                </p>
              </div>

              {/* Keywords Detected vs Missing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                    Detected Safety Keywords
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {activeReport.speech_audit?.keywords_detected.map((kw, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/20">
                  <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block mb-1">
                    Missing Trade Concepts
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {activeReport.speech_audit?.missing_critical_terms.map((term, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 font-mono">
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reasoning Critique */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  NLP Diagnostic Critique
                </span>
                <p className="text-[11px] leading-relaxed">
                  {activeReport.speech_audit?.reasoning_critique}
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: 7-Day Personalized Micro-Remediation Plan */}
          {activeTab === "remediation" && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">
                    7-Day Micro-Remediation Plan
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Target: Eliminate flaw in 7 days
                </span>
              </div>

              {activeReport.seven_day_remediation_plan.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
                  <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <span>No remediation required. Candidate demonstrated full compliance.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeReport.seven_day_remediation_plan.map((drill) => (
                    <div
                      key={drill.day}
                      onClick={() => toggleRemediationItem(drill.day)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        drill.completed
                          ? "bg-slate-950/60 border-slate-800 opacity-60 line-through"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={drill.completed || false}
                        onChange={() => {}}
                        className="mt-0.5 rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-200">
                            Day {drill.day}: {drill.focus_area}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {drill.estimated_minutes} min drill
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          {drill.drill_description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Authenticated NSQF Skill Badge */}
          {activeTab === "badge" && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-4 text-center animate-in fade-in duration-150">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white tracking-tight">
                  {isCertified ? "Unforgeable Verified NSQF Badge" : "Conditional Provisional Credential"}
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  ID: {activeReport.verification_badge?.badge_id || "SB-PROVISIONAL-2026"}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Accreditation:</span>
                  <span className="text-slate-200 font-mono">DGT / NSDC Electronic Audited</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Trade Code:</span>
                  <span className="text-slate-200 font-mono">{activeReport.trade_info.trade_code || "ELE_L4_DOMESTIC"}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Verified Proof Snippet:</span>
                  <span className="text-emerald-400 font-mono">3.2s Video Proof Grounded</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className={`font-bold font-mono ${isCertified ? "text-emerald-400" : "text-amber-400"}`}>
                    {isCertified ? "ACTIVE EMPLOYER TRUSTED" : "REMEDIATION PENDING"}
                  </span>
                </div>
              </div>

              {/* Employer Preview Clip Action */}
              <button
                type="button"
                onClick={() => setActiveMarker(4600)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <Video className="w-4 h-4 text-amber-400" />
                <span>Play 3-Second Employer Verification Clip</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
