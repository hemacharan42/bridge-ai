import React, { useState } from "react";
import { useAssessment } from "../../store/assessmentContext";
import { 
  Play, 
  BookOpen, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  Award, 
  ShieldCheck, 
  ChevronRight, 
  AlertCircle,
  Zap,
  ArrowUpRight,
  Video,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { SkillMasteryModal, SkillMasteryItem } from "./SkillMasteryModal";
import { SkillMasteryBadgesList } from "./SkillMasteryBadgesList";

interface StudentDashboardProps {
  onStartAssessment: () => void;
  onViewScorecard: () => void;
  onOpenSideBySide: () => void;
  onOpenNewCourse: () => void;
}

/**
 * =========================================================================
 * FEATURE D: First-Time Onboarding & Student Dashboard
 * - Spacious tutorial-style online learning layout
 * - Prominently highlights "Continue Pending Course" section
 * - Provides immediate "Start a New Course" action
 * - Displays NSQF Trade competencies, viva-voce scores, and vision audit logs
 * =========================================================================
 */
export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onStartAssessment,
  onViewScorecard,
  onOpenSideBySide,
  onOpenNewCourse,
}) => {
  const { currentUser, selectedCourse, courses, selectCourse, updateCourseCompletedModules } = useAssessment();
  const [activeBadgeModal, setActiveBadgeModal] = useState<SkillMasteryItem | null>(null);

  const completedModulesCount = selectedCourse.completedModules || 1;
  const totalModulesCount = selectedCourse.totalModules || 4;
  const progressPercent = Math.round((completedModulesCount / totalModulesCount) * 100);

  // Curriculum modules based on selected course
  const moduleList = [
    {
      id: "mod-1",
      title: "Safety Pre-Flight & Calibrated PPE Protocols",
      description: "Class 0 1000V rated glove visual inspection, dielectric test stamp verification.",
      completed: completedModulesCount >= 1,
      completionPercent: completedModulesCount >= 1 ? 100 : 70,
      taskCode: "NSQF-MOD-01",
      skillName: selectedCourse.skillsTaught?.[0] || "Zero-Potential Verification",
    },
    {
      id: "mod-2",
      title: selectedCourse.currentTaskTitle || "Busbar & Contactor Wiring Assessment",
      description: "Torque calibration, CAT-III multimeter testing, real-time verbal reasoning justification.",
      completed: completedModulesCount >= 2,
      completionPercent: completedModulesCount >= 2 ? 100 : (completedModulesCount === 1 ? 65 : 0),
      taskCode: selectedCourse.currentTaskId || "NSQF-MOD-02",
      skillName: selectedCourse.skillsTaught?.[1] || "1000V Dielectric Glove Usage",
    },
    {
      id: "mod-3",
      title: "Fault Simulation & Thermal Breaker Verification",
      description: "Short circuit detection, lockout-tagout (LOTO) procedure, load balancing check.",
      completed: completedModulesCount >= 3,
      completionPercent: completedModulesCount >= 3 ? 100 : 0,
      taskCode: "NSQF-MOD-03",
      skillName: selectedCourse.skillsTaught?.[2] || "Conductor Stripping Standards",
    },
    {
      id: "mod-4",
      title: "Master Industrial Certification & Recruiter Proof",
      description: "Dual-evidence comprehensive audit for direct enterprise hiring pool entry.",
      completed: completedModulesCount >= 4,
      completionPercent: completedModulesCount >= 4 ? 100 : 0,
      taskCode: "NSQF-MOD-04",
      skillName: selectedCourse.skillsTaught?.[3] || "Terminal Torque Pull Test",
    },
  ];

  // Active enrolled courses for the current trainee
  const enrolledCourseIds = currentUser?.enrolledCourses && currentUser.enrolledCourses.length > 0
    ? currentUser.enrolledCourses
    : ["course_electrician_nsqf4", "course_solar_pv"];

  const activeCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ========================================================
       * WELCOME BANNER & TRADE CREDENTIAL SUMMARY
       * Spacious, clean header with user institution badge
       * ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
              NSQF Level {selectedCourse.nsqfLevel} • {selectedCourse.tradeCode}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Roll: {currentUser?.id || "TRAINEE-2026-IND-01"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome back, {currentUser?.name || "Rajesh Kumar"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            Enrolled in {currentUser?.institution || "Government ITI Pusa, New Delhi"} • Dual-evidence practical training underway
          </p>
        </div>

        {/* Trade Badges */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onViewScorecard}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Master Scorecard</span>
          </button>

          <button
            type="button"
            onClick={onOpenSideBySide}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-2 transition-colors"
          >
            <Video className="w-4 h-4 text-cyan-400" />
            <span>Side-by-Side Mode</span>
          </button>
        </div>
      </div>

      {/* ========================================================
       * FEATURE D: HERO DUAL-ACTION SECTION
       * 1) "Continue Pending Course" (Left / Main)
       * 2) "Start a New Course" (Right Action Card)
       * ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1) CONTINUE PENDING COURSE SECTION */}
        <div className="lg:col-span-2 relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/90 shadow-xl overflow-hidden group">
          {/* Subtle Ambient Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/30">
                  Active Trade Pathway
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Est. {selectedCourse.durationHours} Hours Required</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {selectedCourse.title}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {selectedCourse.description}
              </p>
            </div>

            {/* Progress Bar & Milestone */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Course Completion</span>
                <span className="text-cyan-400 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{completedModulesCount} of {totalModulesCount} Modules Completed</span>
                <span className="text-amber-400 font-mono">Next: Module {Math.min(totalModulesCount, completedModulesCount + 1)} Assessment</span>
              </div>
            </div>

            {/* Interactive Skill Mastery Badges Showcase */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 shadow-sm">
              <SkillMasteryBadgesList
                course={selectedCourse}
                onSelectBadge={setActiveBadgeModal}
                onSimulateComplete={(courseId, modIdx) => updateCourseCompletedModules(courseId, modIdx)}
              />
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                id="continue-course-btn"
                onClick={onStartAssessment}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Continue Assessment (Module 2)</span>
              </button>

              <button
                type="button"
                onClick={onOpenSideBySide}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
              >
                <Video className="w-4 h-4 text-cyan-400" />
                <span>Open Side-by-Side Player</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2) START A NEW COURSE ACTION CARD */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-md">
              <PlusCircle className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                High-Value Catalog
              </span>
              <h3 className="text-lg font-bold text-white mt-1">Start a New Course</h3>
              <p className="text-xs text-slate-400 font-light mt-1 leading-relaxed">
                Enroll in another industry-verified trade program to expand your practical certifications and recruiter visibility.
              </p>
            </div>

            {/* Quick Available Courses List with Progress Bars */}
            <div className="space-y-2.5 pt-2">
              {courses.slice(0, 3).map((c) => {
                const cPercent = Math.round(((c.completedModules || 0) / (c.totalModules || 1)) * 100);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectCourse(c.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all group ${
                      c.id === selectedCourse.id
                        ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300"
                        : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-semibold truncate text-white">{c.title}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          Level {c.nsqfLevel} • {c.completedModules}/{c.totalModules} modules
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] font-mono font-bold text-cyan-400">
                          {cPercent}%
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>

                    {/* Compact Visual Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-800/90 overflow-hidden mt-2 relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          c.id === selectedCourse.id
                            ? "bg-gradient-to-r from-cyan-400 to-amber-400 shadow-sm shadow-cyan-500/50"
                            : "bg-gradient-to-r from-cyan-500/80 to-blue-500/80"
                        }`}
                        style={{ width: `${cPercent}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenNewCourse}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors group"
          >
            <span>Browse All High-Value Courses</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-amber-400" />
          </button>
        </div>
      </div>

      {/* ========================================================
       * ACTIVE ENROLLED COURSES & VISUAL PROGRESS TRACKERS
       * Visual progress bar for each active course filling up
       * based on the user's completion percentage
       * ======================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Active Enrolled Courses & Progress</span>
            </h3>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              Live NSQF competency completion and dual-evidence verification status across your enrolled programs
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full w-fit">
            {activeCourses.length} Active {activeCourses.length === 1 ? "Program" : "Programs"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCourses.map((course) => {
            const coursePercent = Math.round(
              ((course.completedModules || 0) / (course.totalModules || 1)) * 100
            );
            const isCurrent = course.id === selectedCourse.id;

            return (
              <div
                key={course.id}
                className={`p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isCurrent
                    ? "bg-gradient-to-br from-slate-900/90 via-slate-900 to-slate-950 border-cyan-500/40 shadow-lg shadow-cyan-500/5 ring-1 ring-cyan-500/20"
                    : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70"
                }`}
              >
                <div>
                  {/* Header info */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {course.tradeCode}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Level {course.nsqfLevel} • {course.durationHours} hrs
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {course.title}
                      </h4>
                    </div>

                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-bold shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        Selected
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => selectCourse(course.id)}
                        className="text-[11px] font-mono text-slate-400 hover:text-white px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors shrink-0"
                      >
                        Switch
                      </button>
                    )}
                  </div>

                  {/* Visual Progress Bar Section */}
                  <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 my-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Completion Progress</span>
                      </span>
                      <span className="text-sm font-bold text-cyan-400">
                        {coursePercent}%
                      </span>
                    </div>

                    {/* Progress Bar with smooth fill */}
                    <div
                      className="w-full h-3 rounded-full bg-slate-800/90 overflow-hidden relative p-[1px]"
                      role="progressbar"
                      aria-valuenow={coursePercent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${
                          isCurrent
                            ? "bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 shadow-cyan-500/30"
                            : "bg-gradient-to-r from-slate-400 via-cyan-500 to-amber-400 shadow-cyan-500/20"
                        }`}
                        style={{ width: `${coursePercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                      <span>
                        {course.completedModules} of {course.totalModules} Modules Verified
                      </span>
                      <span className="font-mono text-slate-500">
                        {course.totalModules - course.completedModules} Remaining
                      </span>
                    </div>
                  </div>

                  {/* Interactive Skill Mastery Badges on Course Card */}
                  <div className="my-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <SkillMasteryBadgesList
                      course={course}
                      onSelectBadge={setActiveBadgeModal}
                      compact={true}
                      onSimulateComplete={(courseId, modIdx) => updateCourseCompletedModules(courseId, modIdx)}
                    />
                  </div>
                </div>

                {/* Current pending drill & action */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-1">
                  <div className="min-w-0 pr-2">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
                      Current Task
                    </div>
                    <div className="text-xs text-slate-300 font-medium truncate">
                      {course.currentTaskTitle}
                    </div>
                  </div>

                  {isCurrent ? (
                    <button
                      type="button"
                      onClick={onStartAssessment}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <span>Resume</span>
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        selectCourse(course.id);
                        onStartAssessment();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <span>Open Course</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
       * COURSE MODULES BREAKDOWN
       * Clean tutorial breakdown with status indicators
       * ======================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Curriculum Modules & Assessment Drills</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {totalModulesCount} Modules in {selectedCourse.tradeCode}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {moduleList.map((mod, idx) => (
            <div
              key={mod.id}
              className={`p-5 rounded-2xl border transition-all ${
                mod.completed
                  ? "bg-slate-900/40 border-emerald-500/30"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                      mod.completed
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{mod.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-light">{mod.description}</p>
                  </div>
                </div>

                {mod.completed ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveBadgeModal({
                        skillName: mod.skillName,
                        moduleIndex: idx + 1,
                        moduleTitle: mod.title,
                        is100Percent: true,
                        completionPercent: 100,
                        course: selectedCourse,
                        nsqfCode: mod.taskCode,
                        verificationDate: "2026-09-18",
                        visionScore: 100,
                        sequenceScore: 100,
                        verbalScore: 100,
                        digitalHash: `0x${selectedCourse.tradeCode.slice(0, 4)}_MOD${idx + 1}_GOLD`,
                      });
                    }}
                    className="relative overflow-hidden inline-flex items-center gap-1.5 text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/25 via-yellow-500/15 to-amber-600/25 text-amber-300 border border-amber-400/70 shadow-md shadow-amber-500/20 animate-badge-glow cursor-pointer hover:scale-105 active:scale-95 transition-transform shrink-0"
                    title="100% Mastered - Click to inspect verified credential"
                  >
                    {/* Animated Specular Light Gleam */}
                    <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none animate-badge-shine" />
                    <Award className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40 animate-star-sparkle" />
                    <span>100% Mastered</span>
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      <Clock className="w-3 h-3" />
                      Pending ({mod.completionPercent}%)
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCourseCompletedModules(selectedCourse.id, idx + 1)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                      title="Simulate reaching 100% completion in this module to watch the Skill Mastery badge shine"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      <span>Pass 100%</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Task code and competencies */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 text-[11px]">{mod.taskCode} • {mod.skillName}</span>
                <button
                  type="button"
                  onClick={onStartAssessment}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>{mod.completed ? "Review Recording" : "Launch Studio"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Skill Mastery Modal */}
      <SkillMasteryModal
        badge={activeBadgeModal}
        onClose={() => setActiveBadgeModal(null)}
        onViewEvidence={onStartAssessment}
      />
    </div>
  );
};
