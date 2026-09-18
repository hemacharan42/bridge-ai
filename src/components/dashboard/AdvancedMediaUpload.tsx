import React, { useState, useRef } from "react";
import { 
  UploadCloud, 
  Video, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  FileText, 
  X, 
  ChevronRight,
  Sliders,
  Zap,
  Check
} from "lucide-react";
import confetti from "canvas-confetti";

interface SelfTagItem {
  id: string;
  timeSeconds: number;
  label: string;
  category: "SAFETY" | "PROCEDURE" | "VIVA";
}

export const AdvancedMediaUpload: React.FC = () => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    sizeMb: number;
    url: string;
  } | null>(null);

  // Upload Progression States
  const [uploadStatus, setUploadStatus] = useState<"IDLE" | "UPLOADING" | "COMPLETE" | "ERROR">("IDLE");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Video Playback States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const totalDurationSec = 36.0;

  // Self-Tagging Annotations
  const [selfTags, setSelfTags] = useState<SelfTagItem[]>([
    { id: "tag-1", timeSeconds: 8.2, label: "LOTO Lock Applied & Zero Voltage Verified", category: "SAFETY" },
    { id: "tag-2", timeSeconds: 16.4, label: "11mm Clean Conductor Stripping (0 Nick)", category: "PROCEDURE" },
  ]);

  // AI Pre-flight Analysis State
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    ppeScore: number;
    proceduralScore: number;
    vivaReadiness: string;
    status: "APPROVED_FOR_SUBMISSION" | "WARNINGS_FOUND";
    notes: string[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleValidateAndUpload = (file: File) => {
    setErrorMessage(null);

    // Validate type
    const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov)$/i)) {
      setErrorMessage("Unsupported file format. Please upload an MP4, WebM, or MOV video file.");
      setUploadStatus("ERROR");
      return;
    }

    // Validate size (max 150MB)
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > 150) {
      setErrorMessage(`File size (${sizeMb.toFixed(1)}MB) exceeds maximum limit of 150MB.`);
      setUploadStatus("ERROR");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile({
      name: file.name,
      sizeMb: Math.round(sizeMb * 10) / 10,
      url: objectUrl,
    });

    // Simulate realistic chunked upload progression
    setUploadStatus("UPLOADING");
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress(100);
        setUploadStatus("COMPLETE");
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } else {
        setUploadProgress(progress);
      }
    }, 220);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleValidateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleValidateAndUpload(e.target.files[0]);
    }
  };

  const handleAddTag = (label: string, category: "SAFETY" | "PROCEDURE" | "VIVA") => {
    const newTag: SelfTagItem = {
      id: `tag-${Date.now()}`,
      timeSeconds: Math.round(currentTimeSec * 10) / 10,
      label,
      category,
    };
    setSelfTags((prev) => [...prev, newTag]);
  };

  const handleRunAiAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditResult({
        ppeScore: 94.5,
        proceduralScore: 91.0,
        vivaReadiness: "High Technical Coherence",
        status: "APPROVED_FOR_SUBMISSION",
        notes: [
          "Zero electrocution hazard: Class 0 1000V gloves detected throughout isolation step.",
          "Frame clarity optimal: 30fps with camera occlusion below 8%.",
          "Torque clutch audio spike detected at 2.4 Nm standard."
        ],
      });
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 1400);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-800/80">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-cyan-400" />
            <span>Practice Video Upload &amp; Self-Review Studio</span>
          </h3>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Record, upload, and pre-audit your hands-on shop-floor drills before final NSQF institutional evaluation
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 self-start sm:self-auto">
          30 FPS • Dual-Evidence Vision Engine Ready
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* =========================================================
         * LEFT: DRAG-AND-DROP UPLOAD ZONE & PROGRESS CONTAINER
         * ========================================================= */}
        <div className="space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`p-6 sm:p-8 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden ${
              dragOver
                ? "bg-cyan-500/10 border-cyan-400 shadow-xl shadow-cyan-500/10"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
              <UploadCloud className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">
                Drag &amp; Drop Workshop Assessment Video
              </h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Supports MP4, WebM, or MOV up to 150MB. Ensure your workbench, hands, and multimeter display are clearly framed.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-mono text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Browse Local Files</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80 w-full justify-center">
              <span>Auto-checksum verification</span>
              <span>•</span>
              <span>1080p / 720p @ 30fps</span>
              <span>•</span>
              <span>Max 150MB</span>
            </div>
          </div>

          {/* Upload Progress & State Card */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {uploadStatus === "UPLOADING" && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-2">
                  <Video className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="truncate max-w-[200px]">{selectedFile?.name || "assessment_recording.mp4"}</span>
                </span>
                <span className="text-cyan-400 font-bold">{uploadProgress}%</span>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-0.5">
                <span>Transfer speed: ~4.2 MB/s</span>
                <span>{selectedFile?.sizeMb} MB Total</span>
              </div>
            </div>
          )}

          {uploadStatus === "COMPLETE" && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Upload &amp; Integrity Verification Successful</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                  Ready for Self-Review
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                File <strong>{selectedFile?.name}</strong> ({selectedFile?.sizeMb} MB) has been indexed with SHA-256 hash. Frame extraction ready for AI inspection.
              </p>
            </div>
          )}
        </div>

        {/* =========================================================
         * RIGHT: INSTANT-PLAYBACK CONTAINER & SELF-AUDIT TOOLS
         * ========================================================= */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Play className="w-3.5 h-3.5 text-cyan-400 fill-current" />
              <span>Instant Self-Review Container</span>
            </span>
            <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
              {currentTimeSec.toFixed(1)}s / {totalDurationSec.toFixed(1)}s
            </span>
          </div>

          {/* Simulated High-Fidelity Video Player Canvas */}
          <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center group shadow-inner">
            {/* Ambient workshop screen simulation */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

            {/* Bounding box simulation */}
            <div className="absolute top-8 left-12 w-48 h-32 border-2 border-emerald-400/80 rounded-lg bg-emerald-500/5 flex flex-col justify-between p-1 pointer-events-none">
              <span className="text-[9px] font-mono text-emerald-300 bg-black/80 px-1 py-0.5 rounded w-fit border border-emerald-400/50">
                CLASS 0 DIELECTRIC GLOVE [100% OK]
              </span>
              <span className="text-[8px] font-mono text-slate-400 self-end">
                CONF: 0.98
              </span>
            </div>

            <div className="text-center space-y-2 z-10">
              <button
                type="button"
                onClick={togglePlay}
                className="w-14 h-14 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/60 text-cyan-300 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20 transition-transform active:scale-95 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>
              <div className="text-xs font-mono text-slate-300">
                {isPlaying ? "Playing 30fps Inspection Stream" : "Click to Play Workshop Drill"}
              </div>
            </div>

            {/* Scrub bar inside container */}
            <div className="absolute bottom-3 inset-x-3 space-y-1.5 z-20">
              <input
                type="range"
                min={0}
                max={totalDurationSec}
                step={0.1}
                value={currentTimeSec}
                onChange={(e) => setCurrentTimeSec(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 rounded-lg bg-slate-800/80 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
                <span>{(currentTimeSec).toFixed(1)}s</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPlaybackRate((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1))}
                    className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300"
                  >
                    {playbackRate}x Speed
                  </button>
                  <span>{totalDurationSec}s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Self-Tagging Quick Actions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span>Mark Key Proof Checkpoints at {(currentTimeSec).toFixed(1)}s:</span>
              </span>
              <span className="text-slate-500">{selfTags.length} Tags Attached</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleAddTag("1000V Glove Inspection & Roll-Up Test", "SAFETY")}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-mono text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>+ Safety Glove Tag</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddTag("CAT-III Multimeter 0.00V Live-Dead-Live", "PROCEDURE")}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-mono text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>+ 0V Measurement Tag</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddTag("Torque Clutch Slip Audible Confirmation", "PROCEDURE")}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-mono text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>+ Torque Test Tag</span>
              </button>
            </div>

            {/* List of Applied Self-Tags */}
            <div className="space-y-1.5 pt-1">
              {selfTags.map((tag) => (
                <div
                  key={tag.id}
                  onClick={() => setCurrentTimeSec(tag.timeSeconds)}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="font-mono text-cyan-400 font-bold text-[11px] shrink-0">
                      {tag.timeSeconds.toFixed(1)}s
                    </span>
                    <span className="text-slate-200 truncate">{tag.label}</span>
                  </div>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full shrink-0 ${
                    tag.category === "SAFETY"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                  }`}>
                    {tag.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Pre-flight Check Trigger */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              type="button"
              disabled={isAuditing}
              onClick={handleRunAiAudit}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>{isAuditing ? "Processing 30fps Frame Analysis..." : "Run AI Pre-Flight Audit"}</span>
            </button>
          </div>

          {/* AI Audit Feedback Banner */}
          {auditResult && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-2 text-xs animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Pre-Flight Audit: Ready for NSQF Faculty Submission
                </span>
                <span className="text-[10px] font-mono text-slate-400">Confidence: 97.4%</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">PPE Safety Score:</span>
                  <span className="text-emerald-400 font-bold">{auditResult.ppeScore}%</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">Procedural Sequence:</span>
                  <span className="text-cyan-400 font-bold">{auditResult.proceduralScore}%</span>
                </div>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-300 pt-1">
                {auditResult.notes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-cyan-400">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
