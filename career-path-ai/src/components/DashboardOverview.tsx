import React from "react";
import { ArrowRight, BarChart3, Compass, Map, Sparkles, UserCheck } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CareerRecommendationsResult,
  CareerRoadmapResult,
  DashboardTab,
  SkillAnalysisResult,
  UserProfile,
} from "../types";
import { calculateProfileCompletion } from "../utils/storage";
import { SafeImage } from "./SafeImage";

interface DashboardOverviewProps {
  profile: UserProfile;
  savedAnalysis: SkillAnalysisResult | null;
  savedRecommendations: CareerRecommendationsResult | null;
  savedRoadmap: CareerRoadmapResult | null;
  completedStepIds: string[];
  onSwitchTab: (tab: DashboardTab) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  profile,
  savedAnalysis,
  savedRecommendations,
  savedRoadmap,
  completedStepIds,
  onSwitchTab,
}) => {
  const completion = calculateProfileCompletion(profile);

  const skillChartData = [...profile.technicalSkills, ...profile.softSkills].slice(0, 8);

  const roadmapStats = React.useMemo(() => {
    if (!savedRoadmap) return null;
    const allIds = savedRoadmap.phases.flatMap((p) =>
      p.steps.map((s) => `${savedRoadmap.careerId}:${s.stepId}`)
    );
    const done = allIds.filter((id) => completedStepIds.includes(id)).length;
    return { done, total: allIds.length };
  }, [savedRoadmap, completedStepIds]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col justify-between gap-6 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0F172A] to-indigo-950 p-6 text-white sm:flex-row sm:items-center lg:p-8">
        <div className="flex items-center gap-4">
          <SafeImage
            src={profile.photoUrl}
            alt={profile.fullName}
            variant="avatar"
            className="h-14 w-14 rounded-full border border-white/20 object-cover"
          />
          <div>
            <p className="text-xs font-medium text-sky-300">
              {profile.educationQualification} · {profile.studyYear}
            </p>
            <h2 className="mt-0.5 font-display text-2xl font-bold">
              Welcome back, {profile.fullName.split(" ")[0] || "Student"}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onSwitchTab("analysis")}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            Run AI Skill Analysis
          </button>
          <button
            type="button"
            onClick={() => onSwitchTab("profile")}
            className="rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 cursor-pointer"
          >
            Update Profile
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cells */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Profile Completion</span>
            <UserCheck className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="mt-3 font-mono text-3xl font-bold text-slate-900 tabular-nums">
            {completion}%
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {profile.technicalSkills.length} technical · {profile.softSkills.length} soft skills
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Career Readiness</span>
            <BarChart3 className="h-4 w-4 text-sky-600" />
          </div>
          <p className="mt-3 font-mono text-3xl font-bold text-slate-900 tabular-nums">
            {savedAnalysis ? `${savedAnalysis.readinessScore}/100` : "Not Run"}
          </p>
          <p className="mt-1 truncate text-xs text-slate-500">
            {savedAnalysis ? savedAnalysis.targetCareerTitle : "Run skill analysis to score"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Top AI Match</span>
            <Compass className="h-4 w-4 text-violet-600" />
          </div>
          <p className="mt-3 font-mono text-3xl font-bold text-slate-900 tabular-nums">
            {savedRecommendations?.recommendations?.[0]
              ? `${savedRecommendations.recommendations[0].matchScore}%`
              : "—"}
          </p>
          <p className="mt-1 truncate text-xs text-slate-500">
            {savedRecommendations?.recommendations?.[0]?.careerTitle ||
              "Generate AI career matches"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Roadmap Milestones</span>
            <Map className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-3 font-mono text-3xl font-bold text-slate-900 tabular-nums">
            {roadmapStats ? `${roadmapStats.done}/${roadmapStats.total}` : "0 Steps"}
          </p>
          <p className="mt-1 truncate text-xs text-slate-500">
            {savedRoadmap ? savedRoadmap.careerTitle : "Create a step-by-step roadmap"}
          </p>
        </div>
      </div>

      {/* Skill Chart + Quick Action Navigation */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-7">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold text-slate-900">
                Your Current Skill Proficiency
              </h3>
              <p className="text-xs text-slate-500">
                Self-rated proficiency levels from your profile
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSwitchTab("profile")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
            >
              Edit Skills
            </button>
          </div>

          <div className="mt-6 h-64 w-full">
            {skillChartData.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center rounded-xl bg-slate-50 text-center">
                <p className="text-sm font-medium text-slate-700">No skills added yet</p>
                <button
                  type="button"
                  onClick={() => onSwitchTab("profile")}
                  className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
                >
                  Add Skills in Profile
                </button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={skillChartData}
                  margin={{ top: 8, right: 12, left: -16, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#475569", fontSize: 11 }}
                    axisLine={{ stroke: "#CBD5E1" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#64748B", fontSize: 11 }}
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
                  <Bar
                    dataKey="level"
                    name="Proficiency (%)"
                    fill="#6366F1"
                    radius={[6, 6, 0, 0]}
                    barSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-5">
          <div>
            <h3 className="font-display text-base font-semibold text-slate-900">
              Guided Career Workflow
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Jump directly to any tool in your guidance workspace
            </p>

            <div className="mt-5 divide-y divide-slate-100">
              <button
                type="button"
                onClick={() => onSwitchTab("careers")}
                className="flex w-full items-center justify-between py-3.5 text-left hover:text-indigo-600 cursor-pointer"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">01. View Career Skills</p>
                  <p className="text-xs text-slate-500">
                    Explore 8 categories &amp; beginner-to-advanced tiers
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => onSwitchTab("analysis")}
                className="flex w-full items-center justify-between py-3.5 text-left hover:text-indigo-600 cursor-pointer"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">02. AI Skill Analysis</p>
                  <p className="text-xs text-slate-500">
                    Check readiness score out of 100 &amp; skill gaps
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => onSwitchTab("recommendations")}
                className="flex w-full items-center justify-between py-3.5 text-left hover:text-indigo-600 cursor-pointer"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    03. Career Recommendations
                  </p>
                  <p className="text-xs text-slate-500">
                    AI-matched roles based on your profile &amp; goals
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => onSwitchTab("roadmap")}
                className="flex w-full items-center justify-between py-3.5 text-left hover:text-indigo-600 cursor-pointer"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    04. Step-by-Step Roadmap
                  </p>
                  <p className="text-xs text-slate-500">
                    Track phases, weekly study hours, and projects
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
