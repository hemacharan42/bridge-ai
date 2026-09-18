import React, { useState } from "react";
import { RECRUITER_CANDIDATE_POOL, CERTIFIED_SAMPLE_SCORECARD, GOLDEN_SAMPLE_SCORECARD } from "../data/mockData";
import { useAssessment } from "../store/assessmentContext";
import { MillisecondVideoPlayer } from "./MillisecondVideoPlayer";
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  Video, 
  Play, 
  CheckCircle2, 
  UserCheck, 
  ExternalLink,
  Search,
  Sparkles,
  BookmarkCheck,
  Filter,
  X,
  Clock,
  Calendar,
  AlertTriangle,
  Download,
  Briefcase,
  Layers,
  ChevronRight
} from "lucide-react";
import { MicroEvidenceItem } from "../types";

export const RecruiterPortalView: React.FC = () => {
  const { 
    loadCertifiedDemoData, 
    loadGoldenDemoData,
    candidates,
    shortlistedCandidateIds,
    toggleCandidateShortlist
  } = useAssessment();

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrade, setSelectedTrade] = useState<string>("all");
  const [filterCertifiedOnly, setFilterCertifiedOnly] = useState(false);
  const [showShortlistOnly, setShowShortlistOnly] = useState(false);

  // Inspected Candidate Modal State
  const [inspectedCandidate, setInspectedCandidate] = useState<any | null>(null);
  const [activeMarkerMs, setActiveMarkerMs] = useState<number>(7800);

  const candidatePool = candidates && candidates.length > 0 ? candidates : RECRUITER_CANDIDATE_POOL;
  const shortlistedIds = shortlistedCandidateIds || [];

  const toggleShortlist = (candidateId: string, _candidateName?: string) => {
    toggleCandidateShortlist(candidateId);
  };

  // Filtered pool
  const filteredCandidates = candidatePool.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.candidate_id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTrade = 
      selectedTrade === "all" ||
      (selectedTrade === "electrician" && c.trade.toLowerCase().includes("electrician")) ||
      (selectedTrade === "automation" && c.trade.toLowerCase().includes("automation")) ||
      (selectedTrade === "solar" && c.trade.toLowerCase().includes("solar"));

    const matchesCertified = !filterCertifiedOnly || c.verdict === "CERTIFIED_COMPETENT";
    const matchesShortlist = !showShortlistOnly || shortlistedIds.includes(c.candidate_id);

    return matchesSearch && matchesTrade && matchesCertified && matchesShortlist;
  });

  const handleOpenInspection = (candidate: typeof RECRUITER_CANDIDATE_POOL[0]) => {
    setInspectedCandidate(candidate);
    if (candidate.verdict === "CERTIFIED_COMPETENT") {
      loadCertifiedDemoData();
      setActiveMarkerMs(7800);
    } else {
      loadGoldenDemoData();
      setActiveMarkerMs(14200);
    }
  };

  // Sample timeline markers for inspection player
  const sampleMarkers: MicroEvidenceItem[] = inspectedCandidate?.verdict === "CERTIFIED_COMPETENT"
    ? CERTIFIED_SAMPLE_SCORECARD.micro_evidence_timeline
    : GOLDEN_SAMPLE_SCORECARD.micro_evidence_timeline;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* =====================================================================
       * TOP BANNER: INDUSTRY HIRING WORKSPACE
       * ===================================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0b1528] to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1.5 font-bold">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                INDUSTRY HIRING PORTAL
              </span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                L&amp;T • SCHNEIDER ELECTRIC • SIEMENS RECRUITMENT DESK
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Verified Industrial Technical Talent Pool
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Direct access to vocational trainees who have demonstrated physical competency under unforgeable, 
              computer-vision-verified NSQF L4/L5 dual-evidence audits. Eliminate shop-floor safety surprises.
            </p>
          </div>

          {/* Quick Metrics KPI Bar */}
          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-xl font-mono font-bold text-emerald-400">148</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Ready to Hire</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-xl font-mono font-bold text-cyan-400">96.2%</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Avg Safety</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-xl font-mono font-bold text-amber-400">{shortlistedIds.length}</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Shortlisted</div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
       * SEARCH, TRADE TABS & SHORTLIST FILTER
       * ===================================================================== */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, ITI institution, or roll number..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Trade Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedTrade("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedTrade === "all"
                ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
                : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            All Trades
          </button>
          <button
            type="button"
            onClick={() => setSelectedTrade("electrician")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedTrade === "electrician"
                ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
                : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            Electrician L4
          </button>
          <button
            type="button"
            onClick={() => setSelectedTrade("automation")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedTrade === "automation"
                ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
                : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            Automation &amp; PLC
          </button>
        </div>

        {/* Shortlist & Certified Toggles */}
        <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
          <button
            type="button"
            onClick={() => setShowShortlistOnly(!showShortlistOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              showShortlistOnly
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200"
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Shortlisted ({shortlistedIds.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterCertifiedOnly(!filterCertifiedOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              filterCertifiedOnly
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Certified Only</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
       * CANDIDATE CARDS GRID
       * ===================================================================== */}
      {filteredCandidates.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <Filter className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No candidates matched your filter criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try clearing the search query or trade filter to see all available candidates in the hiring pool.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedTrade("all");
              setFilterCertifiedOnly(false);
              setShowShortlistOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCandidates.map((candidate) => {
            const isCertified = candidate.verdict === "CERTIFIED_COMPETENT";
            const isShortlisted = shortlistedIds.includes(candidate.candidate_id);

            return (
              <div
                key={candidate.candidate_id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4 shadow-xl group"
              >
                <div>
                  {/* Candidate Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                          {candidate.name}
                        </h3>
                        {isShortlisted && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono border border-amber-500/40">
                            SHORTLISTED
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                        {candidate.institution}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold shrink-0 ${
                      isCertified
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    }`}>
                      {candidate.composite_score}%
                    </span>
                  </div>

                  {/* Candidate Metrics Box */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Trade:</span>
                      <span className="text-slate-200 font-semibold">{candidate.trade}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Verification ID:</span>
                      <span className="text-cyan-400 font-mono text-[11px] truncate max-w-[170px]">
                        {candidate.verified_badge}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">PPE Safety Adherence:</span>
                      <span className="text-emerald-400 font-mono font-bold">{candidate.safety_score}%</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Speed Benchmark:</span>
                      <span className="text-amber-300 font-mono text-[11px]">{candidate.practical_speed_rank}</span>
                    </div>
                  </div>

                  {/* 3-Second Verified Clip Proof Chip */}
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-blue-300">
                      <Video className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-[11px] font-medium truncate">{candidate.verified_clip_duration}</span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                      VERIFIED
                    </span>
                  </div>
                </div>

                {/* Candidate Action Buttons */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenInspection(candidate)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
                    <span>Inspect Audit Proof</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleShortlist(candidate.candidate_id, candidate.name)}
                    className={`py-2 px-3.5 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer flex items-center gap-1 ${
                      isShortlisted
                        ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                        : "bg-blue-600 hover:bg-blue-500 text-white"
                    }`}
                  >
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>{isShortlisted ? "Shortlisted" : "Shortlist"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================================
       * CANDIDATE AUDIT PROOF MODAL (Self-Contained Inside Industry Hiring Portal)
       * ===================================================================== */}
      {inspectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setInspectedCandidate(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pr-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    NSQF AUDIT DOSSIER INSPECTION
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ID: {inspectedCandidate.candidate_id}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{inspectedCandidate.name}</span>
                  <span className="text-sm font-normal text-slate-400">({inspectedCandidate.trade})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Institution: {inspectedCandidate.institution} • Composite Score:{" "}
                  <strong className="text-emerald-400">{inspectedCandidate.composite_score}%</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleShortlist(inspectedCandidate.candidate_id, inspectedCandidate.name)}
                  className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    shortlistedIds.includes(inspectedCandidate.candidate_id)
                      ? "bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                      : "bg-blue-600 hover:bg-blue-500 text-white"
                  }`}
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>
                    {shortlistedIds.includes(inspectedCandidate.candidate_id)
                      ? "In Shortlist"
                      : "Add to Shortlist"}
                  </span>
                </button>
              </div>
            </div>

            {/* Video Player & Micro-Evidence Inspection */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-400" />
                  Verified Hands-On Execution Video (Frame-Accurate Dual Evidence)
                </span>
                <span className="font-mono text-cyan-400">
                  Time: {(activeMarkerMs / 1000).toFixed(1)}s / 36.0s
                </span>
              </div>

              {/* Millisecond Video Player */}
              <div className="rounded-xl overflow-hidden border border-slate-800">
                <MillisecondVideoPlayer
                  activeTimestampMs={activeMarkerMs}
                  onTimeUpdate={(ms) => setActiveMarkerMs(ms)}
                  timelineMarkers={sampleMarkers}
                  onMarkerClick={(marker) => setActiveMarkerMs(marker.timestamp_ms)}
                  highlightBoundingBox={[0.2, 0.3, 0.8, 0.7]}
                  activeLabel={inspectedCandidate.trade}
                />
              </div>

              {/* Clickable Verification Checkpoint Chips */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Audit Verification Checkpoints (Click to seek clip)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {sampleMarkers.slice(0, 3).map((marker, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveMarkerMs(marker.timestamp_ms)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        activeMarkerMs === marker.timestamp_ms
                          ? "bg-blue-500/20 border-blue-500/50 text-blue-200 shadow-md"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                        <span className="text-slate-300">{(marker.timestamp_ms / 1000).toFixed(1)}s</span>
                        <span className="text-emerald-400 text-[10px]">VERIFIED</span>
                      </div>
                      <div className="text-xs font-medium truncate text-white">{marker.label}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {marker.source.replace(/_/g, " ")} • {marker.status}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Verification Proof & Compliance Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dual-Evidence Safety Compliance */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Industrial Safety Compliance AI Report
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                    <span className="text-slate-300">1000V Dielectric Gloves</span>
                    <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                    <span className="text-slate-300">Mains Isolation Protocol</span>
                    <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                    <span className="text-slate-300">Zero-Potential Residual Voltage</span>
                    <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 0.0V Confirmed
                    </span>
                  </div>
                </div>
              </div>

              {/* Official Credential & Cryptographic Badge */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Government NSQF Accreditation
                </h4>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
                  <div className="text-[11px] text-slate-400">Accredited Authority:</div>
                  <div className="font-semibold text-white">
                    National Council for Vocational Education and Training (NCVET)
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400 break-all pt-1">
                    Hash: SHA256:{inspectedCandidate.verified_badge}-VALIDATED
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-mono">
                Candidate authorized for immediate apprenticeship or plant interview.
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => alert(`Official NSQF Audit Dossier PDF downloaded for ${inspectedCandidate.name}.`)}
                  className="flex-1 sm:flex-initial py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Dossier</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInspectedCandidate(null)}
                  className="flex-1 sm:flex-initial py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default RecruiterPortalView;
