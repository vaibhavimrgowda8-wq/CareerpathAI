import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Circle,
  FolderGit2,
  Loader2,
  Map,
  Sparkles,
} from "lucide-react";
import { CAREERS_CATALOG } from "../data/careers";
import { CareerRoadmapResult, UserProfile } from "../types";

interface RoadmapViewProps {
  profile: UserProfile;
  selectedCareerId: string;
  onSelectCareerId: (id: string) => void;
  savedRoadmap: CareerRoadmapResult | null;
  onSaveRoadmap: (roadmap: CareerRoadmapResult) => void;
  completedStepIds: string[];
  onToggleStep: (stepId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  profile,
  selectedCareerId,
  onSelectCareerId,
  savedRoadmap,
  onSaveRoadmap,
  completedStepIds,
  onToggleStep,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCareer = useMemo(
    () => CAREERS_CATALOG.find((c) => c.id === selectedCareerId) || CAREERS_CATALOG[0],
    [selectedCareerId]
  );

  const activeRoadmap =
    savedRoadmap && savedRoadmap.careerId === selectedCareer.id
      ? savedRoadmap
      : null;

  const generateRoadmap = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate-roadmap", {
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
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to generate career roadmap.");
      }

      const formatted: CareerRoadmapResult = {
        careerId: selectedCareer.id,
        careerTitle: data.careerTitle || selectedCareer.title,
        generatedAt: new Date().toISOString(),
        totalEstimatedWeeks: data.totalEstimatedWeeks || 20,
        overview: data.overview || "",
        phases: data.phases || [],
      };
      onSaveRoadmap(formatted);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to generate career roadmap."
      );
    } finally {
      setLoading(false);
    }
  };

  const progressStats = useMemo(() => {
    if (!activeRoadmap) return { total: 0, done: 0, pct: 0 };
    const allStepIds = activeRoadmap.phases.flatMap((p) =>
      p.steps.map((s) => `${activeRoadmap.careerId}:${s.stepId}`)
    );
    const done = allStepIds.filter((id) => completedStepIds.includes(id)).length;
    const total = allStepIds.length;
    return {
      total,
      done,
      pct: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  }, [activeRoadmap, completedStepIds]);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Step-by-Step Career Roadmap
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Follow a structured 4-phase learning and project plan tailored to your existing skill baseline.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              aria-label="Roadmap Career Target"
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
              onClick={generateRoadmap}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading
                ? "Building Roadmap..."
                : activeRoadmap
                ? "Regenerate Roadmap"
                : "Generate AI Roadmap"}
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
            <p className="font-semibold">Roadmap Generation Error</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="h-5 w-48 rounded bg-slate-200" />
              <div className="mt-4 h-24 w-full rounded bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {!loading && !activeRoadmap && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Map className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">
            Build Your {selectedCareer.title} Roadmap
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
            Generate a personalized 4-phase action plan taking into account your current study year ({profile.studyYear}) and existing skills.
          </p>
          <button
            type="button"
            onClick={generateRoadmap}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            Create Step-by-Step Roadmap
          </button>
        </div>
      )}

      {!loading && activeRoadmap && (
        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="flex flex-col justify-between gap-6 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0F172A] to-indigo-950 p-6 text-white sm:flex-row sm:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-medium text-sky-300">
                {activeRoadmap.careerTitle} · {activeRoadmap.totalEstimatedWeeks}-Week Plan
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                {activeRoadmap.overview}
              </p>
            </div>
            <div className="w-full shrink-0 sm:w-64">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Roadmap Progress</span>
                <span className="font-mono font-semibold text-sky-300 tabular-nums">
                  {progressStats.done} / {progressStats.total} ({progressStats.pct}%)
                </span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-400 transition-all duration-300"
                  style={{ width: `${progressStats.pct}%` }}
                />
              </div>
            </div>
          </div>

          {/* 4 Sequential Phases */}
          <div className="space-y-5">
            {activeRoadmap.phases.map((phase) => (
              <section
                key={phase.phaseNumber}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex flex-col justify-between gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-mono text-xs font-semibold text-indigo-600 tabular-nums">
                      Phase 0{phase.phaseNumber} · {phase.timeframe}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-bold text-slate-900">
                      {phase.phaseTitle}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 sm:max-w-sm sm:text-right">
                    {phase.goal}
                  </p>
                </div>

                <div className="mt-4 divide-y divide-slate-100">
                  {phase.steps.map((step) => {
                    const compositeId = `${activeRoadmap.careerId}:${step.stepId}`;
                    const checked = completedStepIds.includes(compositeId);
                    return (
                      <div
                        key={step.stepId}
                        className="flex items-start gap-3.5 py-4 first:pt-2 last:pb-2"
                      >
                        <button
                          type="button"
                          onClick={() => onToggleStep(compositeId)}
                          aria-label={`Mark ${step.title} complete`}
                          className="mt-0.5 shrink-0 text-indigo-600 hover:text-indigo-700 cursor-pointer"
                        >
                          {checked ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-slate-300 hover:text-indigo-500" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4
                              className={`text-sm font-semibold ${
                                checked ? "text-slate-400 line-through" : "text-slate-900"
                              }`}
                            >
                              {step.title}
                            </h4>
                            <span className="font-mono text-xs text-slate-500 tabular-nums">
                              ~{step.estimatedHours} hrs
                            </span>
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {step.description}
                          </p>
                          <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600">
                            <BookOpen className="h-3.5 w-3.5" />
                            Study Resource: {step.resourceSuggestion}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Phase Milestone Project */}
                <div className="mt-4 flex items-start gap-3 rounded-xl bg-sky-50/80 px-4 py-3 text-sm text-slate-800">
                  <FolderGit2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
                  <div>
                    <span className="font-semibold text-slate-900">
                      Milestone Deliverable:{" "}
                    </span>
                    <span>{phase.milestoneProject}</span>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
