import React from "react";
import { ArrowRight, BarChart3, Compass, Map, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { PublicPage } from "../types";
import { HERO_IMAGE_URL, TESTIMONIAL_AVATARS } from "../utils/storage";
import { SafeImage } from "./SafeImage";

interface LandingPageProps {
  onGetStarted: () => void;
  onNavigatePublic: (page: PublicPage) => void;
  onExploreCareers: () => void;
}

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Frontend Engineer",
    organization: "FinLedger Systems",
    avatar: TESTIMONIAL_AVATARS.priya,
    quote:
      "Before using Career Path AI, I kept switching between random tutorials without knowing if I was job-ready. The gap analysis pinpointed my React and TypeScript weak spots and gave me a 16-week build plan that led to two internship offers.",
    outcome: "From 52% to 89% readiness in 14 weeks",
  },
  {
    name: "Marcus Chen",
    role: "Associate Data Scientist",
    organization: "Northstar Analytics",
    avatar: TESTIMONIAL_AVATARS.marcus,
    quote:
      "I had strong Python coursework but struggled in technical screens. Benchmarking against real Data Science competencies revealed I was missing SQL window functions and experiment design. Focusing there changed every interview.",
    outcome: "Landed full-time role 2 months post-graduation",
  },
  {
    name: "Elena Rostova",
    role: "UI/UX Product Designer",
    organization: "Verve Health",
    avatar: TESTIMONIAL_AVATARS.elena,
    quote:
      "Comparing my visual design strengths against Product Design benchmarks showed I needed structured usability testing case studies. Following the step-by-step roadmap helped me assemble a portfolio hiring managers actually read.",
    outcome: "3 final-round product design loops",
  },
];

const WORKFLOW_STEPS = [
  {
    number: "01.",
    title: "Build Your Student or Job-Seeker Profile",
    description:
      "Enter your education background, study year, interests, and current technical and soft skills with honest proficiency ratings.",
  },
  {
    number: "02.",
    title: "Benchmark Against 8 High-Growth Career Tracks",
    description:
      "Explore Web Development, Data Science, AI & ML, Cybersecurity, Cloud, UI/UX Design, Digital Marketing, and Software Engineering.",
  },
  {
    number: "03.",
    title: "Run Real-Time AI Skill Gap Analysis",
    description:
      "Compare your current skill levels with industry role benchmarks, inspect interactive bar charts, and understand why specific gaps matter.",
  },
  {
    number: "04.",
    title: "Follow Your Personalized 4-Phase Roadmap",
    description:
      "Receive tailored career matches and execute a structured week-by-week learning plan complete with portfolio projects and milestones.",
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onNavigatePublic,
  onExploreCareers,
}) => {
  return (
    <div className="bg-slate-50 text-slate-900">
      {/* Hero Section: Deep Navy & Indigo-Sky editorial canvas */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#0F172A] to-indigo-950 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.22),transparent_48%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.16),transparent_45%)]"
        />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12">
            {/* Left Copy Column */}
            <div className="flex flex-col justify-center lg:col-span-6">
              <p className="text-sm font-medium tracking-wide text-sky-300">
                Intelligent Career Guidance Platform
              </p>

              <h1
                className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]"
                style={{ textWrap: "balance" }}
              >
                Build Your Future with AI-Powered Career Guidance.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Discover your strengths, analyze your skills, and find the perfect career path with AI.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:from-indigo-400 hover:to-violet-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={onExploreCareers}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-5 py-3.5 text-sm font-medium text-sky-100 transition-colors duration-150 hover:border-sky-400/50 hover:bg-slate-800/80 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Explore Career Skills
                </button>
              </div>
            </div>

            {/* Right Media Column */}
            <div className="lg:col-span-6">
              <div className="relative h-full min-h-[280px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                <SafeImage
                  src={HERO_IMAGE_URL}
                  alt="Students collaborating on career planning and software projects in a sunlit design studio"
                  fallbackLabel="Career Path AI Studio Workspace"
                  className="h-full w-full object-cover lg:h-full"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-xs font-medium text-sky-200">
                    Skill Benchmarks · Readiness Scoring · 4-Phase Roadmaps
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    Structured career clarity from first-year coursework to job offers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4-column benchmark strip in a dedicated full-width row below split */}
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-slate-950/85 px-6 py-5">
              <p className="font-mono text-2xl font-semibold text-white tabular-nums">8 Tracks</p>
              <p className="mt-1 text-sm text-slate-300">
                Curated tech, design, cloud, and growth career frameworks
              </p>
            </div>
            <div className="bg-slate-950/85 px-6 py-5">
              <p className="font-mono text-2xl font-semibold text-sky-300 tabular-nums">0–100</p>
              <p className="mt-1 text-sm text-slate-300">
                Transparent career readiness scoring against role benchmarks
              </p>
            </div>
            <div className="bg-slate-950/85 px-6 py-5">
              <p className="font-mono text-2xl font-semibold text-violet-300 tabular-nums">3 Tiers</p>
              <p className="mt-1 text-sm text-slate-300">
                Beginner, intermediate, and advanced skill progressions
              </p>
            </div>
            <div className="bg-slate-950/85 px-6 py-5">
              <p className="font-mono text-2xl font-semibold text-white tabular-nums">4 Phases</p>
              <p className="mt-1 text-sm text-slate-300">
                Step-by-step roadmaps with portfolio project milestones
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Capabilities Bento Grid */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-indigo-600">Platform Capabilities</p>
          <h2
            className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            style={{ textWrap: "balance" }}
          >
            Every tool you need to move from guesswork to a concrete career plan.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Designed for students, graduates, and career switchers who want measurable skill diagnostics instead of generic advice.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Marquee Bento Card (col-span-2) */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 lg:col-span-2">
            <div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-slate-500">
                  Interactive Gap Diagnostics · Readiness Index
                </span>
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold text-slate-900">
                AI Skill Analysis &amp; Gap Visualization
              </h3>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
                Compare your current ratings—like HTML 85%, JavaScript 45%, or React 20%—directly against role expectations. Inspect side-by-side bar charts, identify high-priority gaps, and read clear explanations of why each skill moves the needle.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-4">
              <div>
                <p className="text-xs text-slate-500">HTML</p>
                <p className="mt-1 font-mono text-lg font-semibold text-slate-900 tabular-nums">85%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">CSS</p>
                <p className="mt-1 font-mono text-lg font-semibold text-slate-900 tabular-nums">70%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">JavaScript</p>
                <p className="mt-1 font-mono text-lg font-semibold text-amber-600 tabular-nums">45%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">React</p>
                <p className="mt-1 font-mono text-lg font-semibold text-indigo-600 tabular-nums">20%</p>
              </div>
            </div>
          </div>

          {/* Right Bento Card 1 */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-gradient-to-b from-sky-50/70 to-white p-8">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-slate-900">
                Career Skills Explorer
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Browse technical and soft skill requirements across 8 industries, broken down into beginner, intermediate, and advanced competency tiers plus real job titles.
              </p>
            </div>
            <button
              type="button"
              onClick={onExploreCareers}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
            >
              Browse 8 career categories
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Bottom Left Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <UserCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-6 font-display text-xl font-semibold text-slate-900">
              Comprehensive Student Profile
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Track your academic background, college, study year, career goals, and skill proficiency sliders with a live completion score.
            </p>
          </div>

          {/* Bottom Middle Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="mt-6 font-display text-xl font-semibold text-slate-900">
              Personalized AI Recommendations
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Receive ranked career matches based on your interests, degree, and current skillset—alongside high-leverage skills to learn next.
            </p>
          </div>

          {/* Bottom Right Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-8 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/20 text-sky-300">
              <Map className="h-5 w-5" />
            </div>
            <h3 className="mt-6 font-display text-xl font-semibold text-white">
              Step-by-Step Career Roadmap
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Turn your target role into a 4-phase execution plan with weekly checkpoints, curated study topics, and capstone project ideas.
            </p>
          </div>
        </div>
      </section>

      {/* How Career Path AI Works */}
      <section className="border-y border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-indigo-600">How Career Path AI Works</p>
              <h2
                className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
                style={{ textWrap: "balance" }}
              >
                Four structured steps from self-assessment to career readiness.
              </h2>
            </div>
            <button
              type="button"
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Launch Dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW_STEPS.map((step) => (
              <div
                key={step.number}
                className="flex flex-col justify-between border-t border-slate-200 pt-6"
              >
                <div>
                  <span className="font-mono text-sm font-semibold text-indigo-600 tabular-nums">
                    {step.number}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-indigo-600">Student &amp; Graduate Outcomes</p>
          <h2
            className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            style={{ textWrap: "balance" }}
          >
            Clearer direction, measurable skill growth.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <article
              key={item.name}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7"
            >
              <div>
                <p className="text-xs font-semibold text-indigo-600">{item.outcome}</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  "{item.quote}"
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3.5 border-t border-slate-100 pt-5">
                <SafeImage
                  src={item.avatar}
                  alt={item.name}
                  variant="avatar"
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="truncate text-xs text-slate-500">
                    {item.role} · {item.organization}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA Strip */}
        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-8 text-white md:flex-row md:items-center lg:p-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs font-medium text-sky-300">
              <ShieldCheck className="h-4 w-4" />
              <span>Instant profile setup · Saved locally in your browser</span>
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to benchmark your skills and map your next move?
            </h2>
          </div>
          <button
            type="button"
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-50 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Get Started Now
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center lg:px-8">
          <div>
            <p className="font-display text-base font-bold text-slate-900">Career Path AI</p>
            <p className="mt-1 text-xs text-slate-500">
              Intelligent skill diagnostics, personalized career guidance, and structured roadmaps.
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
            <button
              type="button"
              onClick={() => onNavigatePublic("home")}
              className="hover:text-slate-900 cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={onGetStarted}
              className="hover:text-slate-900 cursor-pointer"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => onNavigatePublic("about")}
              className="hover:text-slate-900 cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => onNavigatePublic("contact")}
              className="hover:text-slate-900 cursor-pointer"
            >
              Contact
            </button>
          </nav>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Career Path AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
