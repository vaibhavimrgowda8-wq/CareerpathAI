import React, { useMemo, useState } from "react";
import { ArrowRight, Briefcase, CheckCircle2, Search } from "lucide-react";
import { CAREER_CATEGORIES, CAREERS_CATALOG } from "../data/careers";
import { CareerPathItem } from "../types";

interface CareerSkillsViewProps {
  onAnalyzeCareer: (careerId: string) => void;
  onGenerateRoadmap: (careerId: string) => void;
}

type SkillTier = "beginner" | "intermediate" | "advanced";

export const CareerSkillsView: React.FC<CareerSkillsViewProps> = ({
  onAnalyzeCareer,
  onGenerateRoadmap,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCareerId, setSelectedCareerId] = useState<string>(CAREERS_CATALOG[0].id);
  const [activeTier, setActiveTier] = useState<SkillTier>("beginner");

  const filteredCareers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CAREERS_CATALOG.filter((career) => {
      const matchesCat =
        selectedCategory === "All" || career.category === selectedCategory;
      const matchesSearch =
        !q ||
        career.title.toLowerCase().includes(q) ||
        career.category.toLowerCase().includes(q) ||
        career.description.toLowerCase().includes(q) ||
        career.technicalSkills.some((s) => s.toLowerCase().includes(q)) ||
        career.jobRoles.some((r) => r.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const activeCareer: CareerPathItem | undefined = useMemo(() => {
    return (
      filteredCareers.find((c) => c.id === selectedCareerId) || filteredCareers[0]
    );
  }, [filteredCareers, selectedCareerId]);

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Career Skills Library
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Explore required technical skills, soft skills, proficiency tiers, and job opportunities across 8 career domains.
            </p>
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles, skills, or keywords..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1.5">
          {CAREER_CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {filteredCareers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <p className="font-display text-lg font-semibold text-slate-900">
            No career tracks matched your search
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Try clearing your search query or switching back to All categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Selector List */}
          <div className="space-y-3 lg:col-span-4">
            {filteredCareers.map((career) => {
              const selected = activeCareer?.id === career.id;
              return (
                <button
                  key={career.id}
                  type="button"
                  onClick={() => setSelectedCareerId(career.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-all duration-150 cursor-pointer ${
                    selected
                      ? "border-indigo-600 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-900 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <p
                    className={`text-xs font-medium ${
                      selected ? "text-sky-300" : "text-indigo-600"
                    }`}
                  >
                    {career.category}
                  </p>
                  <p className="mt-1 font-display text-base font-semibold">
                    {career.title}
                  </p>
                  <p
                    className={`mt-1.5 text-xs ${
                      selected ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {career.technicalSkills.length} technical · {career.softSkills.length} soft skills
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Career Detail Panel */}
          {activeCareer && (
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-8 lg:p-8">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start">
                <div>
                  <p className="text-xs font-semibold text-indigo-600">
                    {activeCareer.category} · {activeCareer.demandOutlook}
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl font-bold text-slate-900">
                    {activeCareer.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {activeCareer.description}
                  </p>
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <p className="text-xs text-slate-500">Typical Compensation</p>
                  <p className="mt-0.5 font-mono text-sm font-semibold text-slate-900 tabular-nums">
                    {activeCareer.avgSalaryRange}
                  </p>
                </div>
              </div>

              {/* Technical & Soft Skills Lists */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-display text-sm font-semibold text-slate-900">
                    Required Technical Skills
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {activeCareer.technicalSkills.map((skill) => (
                      <li
                        key={skill}
                        className="flex items-center justify-between border-b border-slate-100 pb-2 text-sm text-slate-700 last:border-b-0"
                      >
                        <span>{skill}</span>
                        <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-display text-sm font-semibold text-slate-900">
                    Required Soft Skills
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {activeCareer.softSkills.map((skill) => (
                      <li
                        key={skill}
                        className="flex items-center justify-between border-b border-slate-100 pb-2 text-sm text-slate-700 last:border-b-0"
                      >
                        <span>{skill}</span>
                        <CheckCircle2 className="h-4 w-4 text-sky-500" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Beginner / Intermediate / Advanced Skill Levels */}
              <div className="border-t border-slate-100 pt-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <h4 className="font-display text-sm font-semibold text-slate-900">
                    Skill Progression Levels
                  </h4>
                  <div className="inline-flex rounded-lg bg-slate-100 p-1">
                    {(["beginner", "intermediate", "advanced"] as SkillTier[]).map(
                      (tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setActiveTier(tier)}
                          className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors cursor-pointer ${
                            activeTier === tier
                              ? "bg-white text-slate-900 shadow-sm"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {tier}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <ul className="mt-4 space-y-2.5">
                  {activeCareer.skillLevels[activeTier].map((item, index) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                    >
                      <span className="font-mono text-xs font-semibold text-indigo-600 tabular-nums">
                        0{index + 1}.
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Career Opportunities & Job Roles */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="flex items-center gap-2 font-display text-sm font-semibold text-slate-900">
                  <Briefcase className="h-4 w-4 text-indigo-600" />
                  Career Opportunities &amp; Job Roles
                </h4>
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {activeCareer.jobRoles.map((role) => (
                    <div
                      key={role}
                      className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800"
                    >
                      {role}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={() => onAnalyzeCareer(activeCareer.id)}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-indigo-500 hover:to-violet-500 cursor-pointer"
                >
                  Analyze My Fit for This Role
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onGenerateRoadmap(activeCareer.id)}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Build Career Roadmap
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
