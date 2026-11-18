import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CAREERS_CATALOG } from "../data/careers";
import { SkillAnalysisResult, UserProfile } from "../types";

interface SkillAnalysisViewProps {
  profile: UserProfile;
  selectedCareerId: string;
  onSelectCareerId: (id: string) => void;
  savedAnalysis: SkillAnalysisResult | null;
  onSaveAnalysis: (result: SkillAnalysisResult) => void;
  onOpenProfile: () => void;
  onOpenRoadmap: (careerId: string) => void;
}

export const SkillAnalysisView: React.FC<SkillAnalysisViewProps> = ({
  profile,
  selectedCareerId,
  onSelectCareerId,
  savedAnalysis,
  onSaveAnalysis,
  onOpenProfile,
  onOpenRoadmap,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCareer = useMemo(
    () => CAREERS_CATALOG.find((c) => c.id === selectedCareerId) || CAREERS_CATALOG[0],
    [selectedCareerId]
  );

  // Quick local preview baseline before/alongside AI run
  const baselinePreview = useMemo(() => {
    const allUserSkills = [...profile.technicalSkills, ...profile.softSkills];
    return selectedCareer.benchmarks.map((b) => {
      const match = allUserSkills.find(
        (u) =>
          u.name.toLowerCase() === b.name.toLowerCase() ||
          u.name.toLowerCase().includes(b.name.toLowerCase()) ||
          b.name.toLowerCase().includes(u.name.toLowerCase())
      );
      const current = match ? match.level : 0;
      return {
        skill: b.name,
        currentLevel: current,
        requiredLevel: b.requiredLevel,
        gap: Math.max(0, b.requiredLevel - current),
      };
    });
  }, [profile, selectedCareer]);

  const activeResult =
    savedAnalysis && savedAnalysis.targetCareerId === selectedCareer.id
      ? savedAnalysis
      : null;

  const runAiAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/analyze-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          targetCareer: {
            id: selectedCareer.id,
            title: selectedCareer.title,
            category: selectedCareer.category,
            description: selectedCareer.description,
          },
          requiredSkills: selectedCareer.benchmarks,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to complete AI skill analysis.");
      }

      const formatted: SkillAnalysisResult = {
        targetCareerId: selectedCareer.id,
        targetCareerTitle: selectedCareer.title,
        analyzedAt: new Date().toISOString(),
        readinessScore: data.readinessScore,
        readinessSummary: data.readinessSummary,
        executiveFeedback: data.executiveFeedback,
        skillComparisons: data.skillComparisons || [],
        strongSkills: data.strongSkills || [],
        skillsToImprove: data.skillsToImprove || [],
      };
      onSaveAnalysis(formatted);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to run AI skill analysis. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const chartData = activeResult
    ? activeResult.skillComparisons
    : baselinePreview;

  const baselineScore = useMemo(() => {
    if (baselinePreview.length === 0) return 0;
    const avgRatio =
      baselinePreview.reduce(
        (acc, item) => acc + Math.min(1, item.currentLevel / item.requiredLevel),
        0
      ) / baselinePreview.length;
    return Math.round(avgRatio * 100);
  }, [baselinePreview]);

  const displayScore = activeResult ? activeResult.readinessScore : baselineScore;

  return (
    <div className="space-y-6">
      {/* Control Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              AI Skill Gap Analysis
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Compare your current profile skills against target role benchmarks and uncover priority growth areas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              aria-label="Target Career Role"
              value={selectedCareer.id}
              onChange={(e) => onSelectCareerId(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {CAREERS_CATALOG.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={runAiAnalysis}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? "Analyzing Skills..." : "Run AI Skill Analysis"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
          <div>
            <p className="font-semibold">AI Analysis Unavailable</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Score & Interactive Bar Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Readiness Score Panel */}
        <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-slate-950 via-[#0F172A] to-indigo-950 p-6 text-white lg:col-span-4">
          <div>
            <p className="text-xs font-medium text-sky-300">
              {activeResult ? "AI Career Readiness Score" : "Estimated Baseline Readiness"}
            </p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-mono text-5xl font-bold tracking-tight tabular-nums">
                {displayScore}
              </span>
              <span className="font-mono text-lg text-slate-400">/ 100</span>
            </div>

            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-400 transition-all duration-500"
                style={{ width: `${displayScore}%` }}
              />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              {activeResult
                ? activeResult.readinessSummary
                : `Baseline comparison for ${selectedCareer.title}. Click "Run AI Skill Analysis" for personalized gap reasoning and coaching.`}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={onOpenProfile}
              className="rounded-lg border border-white/15 px-3.5 py-2 text-xs font-medium text-white hover:bg-white/10 cursor-pointer"
            >
              Adjust My Skill Ratings
            </button>
            <button
              type="button"
              onClick={() => onOpenRoadmap(selectedCareer.id)}
              className="inline-flex items-center gap-1 rounded-lg bg-white px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-50 cursor-pointer"
            >
              View Roadmap
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Bar Chart Comparison */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-8">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-base font-semibold text-slate-900">
                Your Current Level vs. {selectedCareer.title} Benchmark
              </h3>
              <p className="text-xs text-slate-500">
                Percentage proficiency comparison across core required competencies
              </p>
            </div>
            {activeResult && (
              <span className="text-xs text-slate-400 tabular-nums">
                Analyzed {new Date(activeResult.analyzedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>

          <div className="mt-6 h-72 w-full">
            {loading ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl bg-slate-50">
                <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
                <p className="text-sm font-medium text-slate-600">
                  Evaluating your skills against {selectedCareer.title} benchmarks...
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 12, left: -12, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis
                    dataKey="skill"
                    tick={{ fill: "#475569", fontSize: 12 }}
                    axisLine={{ stroke: "#CBD5E1" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #E2E8F0",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar
                    dataKey="currentLevel"
                    name="Your Level (%)"
                    fill="#6366F1"
                    radius={[6, 6, 0, 0]}
                    barSize={24}
                  />
                  <Bar
                    dataKey="requiredLevel"
                    name="Role Target (%)"
                    fill="#38BDF8"
                    radius={[6, 6, 0, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Percentage Indicators & Skill Gap Breakdown */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="font-display text-base font-semibold text-slate-900">
          Skill-by-Skill Gap Indicators
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {chartData.map((item) => {
            const pctGap = Math.max(0, item.requiredLevel - item.currentLevel);
            const isMet = pctGap === 0;
            return (
              <div
                key={item.skill}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    {item.skill}
                  </span>
                  <span
                    className={`font-mono text-xs font-semibold tabular-nums ${
                      isMet ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {item.currentLevel}% / {item.requiredLevel}%
                  </span>
                </div>
                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      isMet ? "bg-emerald-500" : "bg-indigo-600"
                    }`}
                    style={{ width: `${Math.min(100, item.currentLevel)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500 tabular-nums">
                  {isMet
                    ? "Meets or exceeds target benchmark"
                    : `Gap: ${pctGap}% improvement needed`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personalized AI Breakdown: Strong Skills, Weak Skills + Why, Executive Feedback */}
      {activeResult && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-white to-sky-50/80 p-6">
            <p className="text-xs font-semibold text-indigo-700">
              Personalized AI Feedback
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-800">
              {activeResult.executiveFeedback}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Strong Skills */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Strong Skills
                </h3>
              </div>
              <div className="mt-4 space-y-4">
                {activeResult.strongSkills.map((item) => (
                  <div
                    key={item.skill}
                    className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{item.skill}</span>
                      <span className="font-mono text-sm font-semibold text-emerald-600 tabular-nums">
                        {item.level}%
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{item.strengthNote}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak Skills & Why They Matter */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Skills Needing Improvement &amp; Why
                </h3>
              </div>
              <div className="mt-4 space-y-4">
                {activeResult.skillsToImprove.map((item) => (
                  <div
                    key={item.skill}
                    className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{item.skill}</span>
                      <span className="font-mono text-xs font-semibold text-amber-700 tabular-nums">
                        {item.currentLevel}% → {item.targetLevel}% · {item.priority} Priority
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-slate-700">{item.whyItMatters}</p>
                    <p className="mt-1.5 text-xs font-medium text-indigo-700">
                      Next step: {item.actionTip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
