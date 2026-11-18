import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  BarChart3,
  BookOpen,
  Home,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { AboutView, AuthView, ContactView } from "./components/AboutContactAuth";
import { CareerSkillsView } from "./components/CareerSkillsView";
import { DashboardOverview } from "./components/DashboardOverview";
import { LandingPage } from "./components/LandingPage";
import { ProfileView } from "./components/ProfileView";
import { RecommendationsView } from "./components/RecommendationsView";
import { RoadmapView } from "./components/RoadmapView";
import { SafeImage } from "./components/SafeImage";
import { SkillAnalysisView } from "./components/SkillAnalysisView";
import { CAREERS_CATALOG } from "./data/careers";
import {
  AuthSession,
  CareerRecommendationsResult,
  CareerRoadmapResult,
  DashboardTab,
  PublicPage,
  SkillAnalysisResult,
  UserProfile,
} from "./types";
import {
  loadCompletedSteps,
  loadProfile,
  loadSavedAnalysis,
  loadSavedRecommendations,
  loadSavedRoadmap,
  loadSession,
  saveAnalysis,
  saveCompletedSteps,
  saveProfile,
  saveRecommendations,
  saveRoadmap,
  saveSession,
} from "./utils/storage";

type AppMode = "public" | "dashboard";

const DASHBOARD_NAV: { id: DashboardTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "User Profile", icon: User },
  { id: "careers", label: "Career Skills", icon: BookOpen },
  { id: "analysis", label: "AI Skill Analysis", icon: BarChart3 },
  { id: "recommendations", label: "Recommendations", icon: Sparkles },
  { id: "roadmap", label: "Career Roadmap", icon: Map },
];

const TAB_TITLES: Record<DashboardTab, string> = {
  overview: "Overview",
  profile: "User Profile",
  careers: "View Career Skills",
  analysis: "AI Skill Analysis",
  recommendations: "Career Skill Recommendations",
  roadmap: "Step-by-Step Career Roadmap",
};

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>("public");
  const [publicPage, setPublicPage] = useState<PublicPage>("home");
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());
  const [session, setSession] = useState<AuthSession>(() => loadSession());
  const [selectedCareerId, setSelectedCareerId] = useState<string>(CAREERS_CATALOG[0].id);

  const [savedAnalysis, setSavedAnalysis] = useState<SkillAnalysisResult | null>(() =>
    loadSavedAnalysis()
  );
  const [savedRecommendations, setSavedRecommendations] =
    useState<CareerRecommendationsResult | null>(() => loadSavedRecommendations());
  const [savedRoadmap, setSavedRoadmap] = useState<CareerRoadmapResult | null>(() =>
    loadSavedRoadmap()
  );
  const [completedStepIds, setCompletedStepIds] = useState<string[]>(() =>
    loadCompletedSteps()
  );

  const openDashboard = (tab: DashboardTab = "overview") => {
    setDashboardTab(tab);
    setAppMode("dashboard");
    setMobileMenuOpen(false);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigatePublic = (page: PublicPage, initialAuth: "login" | "signup" = "login") => {
    if (page === "auth") {
      setAuthMode(initialAuth);
    }
    setPublicPage(page);
    setAppMode("public");
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveProfile = (updated: UserProfile) => {
    setProfile(updated);
    saveProfile(updated);
  };

  const handleAuthSuccess = (newSession: AuthSession) => {
    setSession(newSession);
    saveSession(newSession);
    const updatedProfile: UserProfile = {
      ...profile,
      fullName: newSession.userName || profile.fullName,
      email: newSession.userEmail || profile.email,
    };
    setProfile(updatedProfile);
    saveProfile(updatedProfile);
    openDashboard("overview");
  };

  const handleSignOut = () => {
    const cleared: AuthSession = { isAuthenticated: false, userEmail: "", userName: "" };
    setSession(cleared);
    saveSession(cleared);
    navigatePublic("home");
  };

  const handleSaveAnalysis = (result: SkillAnalysisResult) => {
    setSavedAnalysis(result);
    saveAnalysis(result);
  };

  const handleSaveRecommendations = (result: CareerRecommendationsResult) => {
    setSavedRecommendations(result);
    saveRecommendations(result);
  };

  const handleSaveRoadmap = (result: CareerRoadmapResult) => {
    setSavedRoadmap(result);
    saveRoadmap(result);
  };

  const handleToggleRoadmapStep = (stepId: string) => {
    setCompletedStepIds((prev) => {
      const next = prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId];
      saveCompletedSteps(next);
      return next;
    });
  };

  if (appMode === "dashboard") {
    return (
      <div className="flex min-h-screen bg-slate-50 text-slate-900">
        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Navigation (Dark Navy) */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col justify-between bg-gradient-to-b from-slate-950 via-[#0F172A] to-indigo-950 text-white transition-transform duration-200 lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
              <button
                type="button"
                onClick={() => navigatePublic("home")}
                className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 cursor-pointer"
              >
                Career Path AI
              </button>
              <button
                type="button"
                aria-label="Close sidebar"
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 hover:text-white lg:hidden cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav aria-label="Dashboard Navigation" className="mt-6 space-y-1 px-3">
              {DASHBOARD_NAV.map((item) => {
                const Icon = item.icon;
                const active = dashboardTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openDashboard(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? "bg-indigo-600 text-white"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-white/10 p-4 space-y-2">
            <button
              type="button"
              onClick={() => navigatePublic("home")}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </button>
            {session.isAuthenticated && (
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            )}
          </div>
        </aside>

        {/* Main Workspace Viewport */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top Workspace Header */}
          <header className="flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                aria-label="Open navigation menu"
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 text-sm truncate">
                <span className="text-slate-400">Dashboard</span>
                <span aria-hidden="true" className="text-slate-300">/</span>
                <h1 className="font-display font-semibold text-slate-900 truncate">
                  {TAB_TITLES[dashboardTab]}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => openDashboard("profile")}
                className="flex items-center gap-2.5 rounded-lg px-2 py-1 text-left hover:bg-slate-50 cursor-pointer"
              >
                <SafeImage
                  src={profile.photoUrl}
                  alt={profile.fullName}
                  variant="avatar"
                  className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                />
                <span className="hidden text-sm font-medium text-slate-700 sm:inline whitespace-nowrap">
                  {profile.fullName}
                </span>
              </button>
            </div>
          </header>

          {/* Content Area with Smooth Transitions */}
          <main className="mx-auto w-full max-w-6xl flex-1 p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={dashboardTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              >
                {dashboardTab === "overview" && (
                  <DashboardOverview
                    profile={profile}
                    savedAnalysis={savedAnalysis}
                    savedRecommendations={savedRecommendations}
                    savedRoadmap={savedRoadmap}
                    completedStepIds={completedStepIds}
                    onSwitchTab={openDashboard}
                  />
                )}

                {dashboardTab === "profile" && (
                  <ProfileView profile={profile} onSaveProfile={handleSaveProfile} />
                )}

                {dashboardTab === "careers" && (
                  <CareerSkillsView
                    onAnalyzeCareer={(careerId) => {
                      setSelectedCareerId(careerId);
                      openDashboard("analysis");
                    }}
                    onGenerateRoadmap={(careerId) => {
                      setSelectedCareerId(careerId);
                      openDashboard("roadmap");
                    }}
                  />
                )}

                {dashboardTab === "analysis" && (
                  <SkillAnalysisView
                    profile={profile}
                    selectedCareerId={selectedCareerId}
                    onSelectCareerId={setSelectedCareerId}
                    savedAnalysis={savedAnalysis}
                    onSaveAnalysis={handleSaveAnalysis}
                    onOpenProfile={() => openDashboard("profile")}
                    onOpenRoadmap={(careerId) => {
                      setSelectedCareerId(careerId);
                      openDashboard("roadmap");
                    }}
                  />
                )}

                {dashboardTab === "recommendations" && (
                  <RecommendationsView
                    profile={profile}
                    savedRecommendations={savedRecommendations}
                    onSaveRecommendations={handleSaveRecommendations}
                    onAnalyzeCareer={(careerId) => {
                      setSelectedCareerId(careerId);
                      openDashboard("analysis");
                    }}
                    onGenerateRoadmap={(careerId) => {
                      setSelectedCareerId(careerId);
                      openDashboard("roadmap");
                    }}
                  />
                )}

                {dashboardTab === "roadmap" && (
                  <RoadmapView
                    profile={profile}
                    selectedCareerId={selectedCareerId}
                    onSelectCareerId={setSelectedCareerId}
                    savedRoadmap={savedRoadmap}
                    onSaveRoadmap={handleSaveRoadmap}
                    completedStepIds={completedStepIds}
                    onToggleStep={handleToggleRoadmapStep}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    );
  }

  // Public Marketing / Auth Shell (3-Zone Top Bar Contract)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-6 lg:px-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => navigatePublic("home")}
            className="font-display text-lg font-bold tracking-tight text-slate-950 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Career Path AI
          </button>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            <button
              type="button"
              onClick={() => navigatePublic("home")}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                publicPage === "home"
                  ? "text-indigo-600 underline underline-offset-8 decoration-2"
                  : "hover:text-slate-950"
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => openDashboard("overview")}
              className="transition-colors hover:text-slate-950 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => navigatePublic("about")}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                publicPage === "about"
                  ? "text-indigo-600 underline underline-offset-8 decoration-2"
                  : "hover:text-slate-950"
              }`}
            >
              About
            </button>
            <button
              type="button"
              onClick={() => navigatePublic("contact")}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                publicPage === "contact"
                  ? "text-indigo-600 underline underline-offset-8 decoration-2"
                  : "hover:text-slate-950"
              }`}
            >
              Contact
            </button>
            <button
              type="button"
              onClick={() => navigatePublic("auth", "login")}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                publicPage === "auth" && authMode === "login"
                  ? "text-indigo-600 underline underline-offset-8 decoration-2"
                  : "hover:text-slate-950"
              }`}
            >
              Login
            </button>
          </nav>

          {/* Zone 3: 1 Primary CTA Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() =>
                session.isAuthenticated
                  ? openDashboard("overview")
                  : navigatePublic("auth", "signup")
              }
              className="hidden sm:inline-flex items-center rounded-lg bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-600 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {session.isAuthenticated ? "Open Dashboard" : "Sign Up"}
            </button>

            <button
              type="button"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
            <div className="flex flex-col space-y-3 text-sm font-medium text-slate-700">
              <button
                type="button"
                onClick={() => navigatePublic("home")}
                className="text-left py-1.5 hover:text-indigo-600 cursor-pointer"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => openDashboard("overview")}
                className="text-left py-1.5 hover:text-indigo-600 cursor-pointer"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => navigatePublic("about")}
                className="text-left py-1.5 hover:text-indigo-600 cursor-pointer"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => navigatePublic("contact")}
                className="text-left py-1.5 hover:text-indigo-600 cursor-pointer"
              >
                Contact
              </button>
              <button
                type="button"
                onClick={() => navigatePublic("auth", "login")}
                className="text-left py-1.5 hover:text-indigo-600 cursor-pointer"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigatePublic("auth", "signup")}
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-center font-semibold text-white cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={publicPage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {publicPage === "home" && (
              <LandingPage
                onGetStarted={() => openDashboard("overview")}
                onExploreCareers={() => openDashboard("careers")}
                onNavigatePublic={(page) => navigatePublic(page)}
              />
            )}
            {publicPage === "about" && (
              <AboutView onGetStarted={() => openDashboard("overview")} />
            )}
            {publicPage === "contact" && <ContactView />}
            {publicPage === "auth" && (
              <AuthView
                key={authMode}
                initialMode={authMode}
                currentEmail={profile.email}
                currentName={profile.fullName}
                onAuthSuccess={handleAuthSuccess}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
