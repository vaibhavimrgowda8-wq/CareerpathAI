import React, { useState } from "react";
import { AlertCircle, ArrowRight, Clock, Loader2, Sparkles } from "lucide-react";
import { CAREERS_CATALOG } from "../data/careers";
import { CareerRecommendationsResult, UserProfile } from "../types";

interface RecommendationsViewProps {
  profile: UserProfile;
  savedRecommendations: CareerRecommendationsResult | null;
  onSaveRecommendations: (result: CareerRecommendationsResult) => void;
  onAnalyzeCareer: (careerId: string) => void;
  onGenerateRoadmap: (careerId: string) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  profile,
  savedRecommendations,
  onSaveRecommendations,
  onAnalyzeCareer,
  onGenerateRoadmap,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/recommend-careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          availableCareers: CAREERS_CATALOG.map((c) => ({
            id: c.id,
            title: c.title,
            category: c.category,
            technicalSkills: c.technicalSkills,
            softSkills: c.softSkills,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to generate career recommendations.");
      }

      const formatted: CareerRecommendationsResult = {
        generatedAt: new Date().toISOString(),
        profileSummary: data.profileSummary || "",
        recommendations: data.recommendations || [],
        priorityLearningFocus: data.priorityLearningFocus || [],
      };
      onSaveRecommendations(formatted);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate personalized recommendations."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">
            Personalized AI Career &amp; Skill Recommendations
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Tailored career matches computed from your education ({profile.educationQualification}), interests, and {profile.technicalSkills.length + profile.softSkills.length} rated skills.
          </p>
        </div>

        <button
          type="button"
          onClick={generateRecommendations}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {loading
            ? "Matching Careers..."
            : savedRecommendations
            ? "Refresh AI Recommendations"
            : "Generate AI Recommendations"}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
          <div>
            <p className="font-semibold">Recommendation Request Failed</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="h-4 w-28 rounded bg-slate-200" />
              <div className="mt-3 h-6 w-52 rounded bg-slate-200" />
              <div className="mt-4 h-16 w-full rounded bg-slate-100" />
              <div className="mt-6 h-8 w-40 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      )}

      {!loading && !savedRecommendations && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">
            Discover Your Best-Fit Career Paths
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
            Our AI engine evaluates your academic background, interests ({profile.interests.slice(0, 3).join(", ") || "none selected yet"}), and current skill ratings to recommend ranked careers and immediate skills to learn next.
          </p>
          <button
            type="button"
            onClick={generateRecommendations}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 cursor-pointer"
          >
            Generate Personalized Matches
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {!loading && savedRecommendations && (
        <div className="space-y-6">
          {/* Executive Profile Summary */}
          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/70 via-white to-sky-50/70 p-6">
            <p className="text-xs font-semibold text-indigo-700">
              AI Profile Assessment
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-800">
              {savedRecommendations.profileSummary}
            </p>
          </div>

          {/* Ranked Career Cards */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {savedRecommendations.recommendations.map((rec, index) => {
              const matchedCatalog = CAREERS_CATALOG.find(
                (c) =>
                  c.id === rec.careerId ||
                  c.title.toLowerCase() === rec.careerTitle.toLowerCase()
              );
              const resolvedId = matchedCatalog ? matchedCatalog.id : CAREERS_CATALOG[0].id;

              return (
                <article
                  key={rec.careerTitle}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          0{index + 1}. {rec.category} · Est. {rec.timeToJobReady}
                        </p>
                        <h3 className="mt-1 font-display text-xl font-bold text-slate-900">
                          {rec.careerTitle}
                        </h3>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-2xl font-bold text-indigo-600 tabular-nums">
                          {rec.matchScore}%
                        </span>
                        <p className="text-[11px] font-medium text-slate-400">Match</p>
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {rec.fitRationale}
                    </p>

                    <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          Your Matching Strengths
                        </p>
                        <ul className="mt-1.5 space-y-1 text-xs text-slate-600">
                          {rec.matchingStrengths.map((s) => (
                            <li key={s}>· {s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-indigo-700">
                          Recommended Skills to Learn
                        </p>
                        <ul className="mt-1.5 space-y-1 text-xs text-slate-700">
                          {rec.recommendedSkillsToLearn.map((s) => (
                            <li key={s}>· {s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <p className="text-xs text-slate-500">
                        Target Roles:{" "}
                        <span className="font-medium text-slate-700">
                          {rec.entryRoles.join(" · ")}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => onGenerateRoadmap(resolvedId)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-600 cursor-pointer"
                    >
                      Generate Roadmap
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onAnalyzeCareer(resolvedId)}
                      className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Analyze Skill Gaps
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Priority Skills to Learn Next */}
          {savedRecommendations.priorityLearningFocus.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-display text-lg font-semibold text-slate-900">
                High-Leverage Skills to Prioritize Next
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                {savedRecommendations.priorityLearningFocus.map((item) => (
                  <div
                    key={item.skillName}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-semibold text-slate-900">
                        {item.skillName}
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono text-xs text-indigo-600 tabular-nums">
                        <Clock className="h-3.5 w-3.5" />
                        {item.estimatedHours}h
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {item.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
