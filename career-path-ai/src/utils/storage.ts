import {
  AuthSession,
  CareerRecommendationsResult,
  CareerRoadmapResult,
  SkillAnalysisResult,
  UserProfile,
} from "../types";

export const HERO_IMAGE_URL = "/src/assets/images/hero_career_workspace_1795016950780.jpg";
export const DEFAULT_AVATAR_URL = "/src/assets/images/avatar_student_default_1795016950929.jpg";
export const TESTIMONIAL_AVATARS = {
  priya: "/src/assets/images/avatar_testimonial_priya_1795016951563.jpg",
  marcus: "/src/assets/images/avatar_testimonial_marcus_1795016952367.jpg",
  elena: "/src/assets/images/avatar_testimonial_elena_1795016951465.jpg",
};

const STORAGE_KEYS = {
  PROFILE: "career_path_ai_profile_v1",
  SESSION: "career_path_ai_session_v1",
  ANALYSIS: "career_path_ai_last_analysis_v1",
  RECOMMENDATIONS: "career_path_ai_recommendations_v1",
  ROADMAP: "career_path_ai_roadmap_v1",
  COMPLETED_STEPS: "career_path_ai_roadmap_steps_v1",
};

export const DEFAULT_PROFILE: UserProfile = {
  fullName: "Aarav Mehta",
  email: "aarav.mehta@university.edu",
  age: "21",
  educationQualification: "B.Tech in Computer Science",
  collegeName: "National Institute of Technology",
  studyYear: "3rd Year",
  photoUrl: DEFAULT_AVATAR_URL,
  interests: ["Frontend Engineering", "Full-Stack Systems", "Product Design"],
  careerGoals:
    "Secure a full-stack or frontend engineering internship and transition into a product-focused Web Developer role upon graduation.",
  technicalSkills: [
    { name: "HTML", level: 85 },
    { name: "CSS", level: 70 },
    { name: "JavaScript", level: 45 },
    { name: "React", level: 20 },
    { name: "Git & Version Control", level: 65 },
  ],
  softSkills: [
    { name: "Communication", level: 80 },
    { name: "Problem Solving", level: 72 },
    { name: "Teamwork", level: 85 },
  ],
};

export const DEFAULT_SESSION: AuthSession = {
  isAuthenticated: false,
  userEmail: "",
  userName: "",
};

export function calculateProfileCompletion(profile: UserProfile): number {
  const checks = [
    Boolean(profile.fullName.trim()),
    Boolean(profile.email.trim()),
    Boolean(profile.age.trim()),
    Boolean(profile.educationQualification.trim()),
    Boolean(profile.collegeName.trim()),
    Boolean(profile.studyYear.trim()),
    Boolean(profile.photoUrl.trim()),
    profile.interests.length > 0,
    Boolean(profile.careerGoals.trim()),
    profile.technicalSkills.length >= 3,
    profile.softSkills.length >= 2,
  ];
  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function loadSession(): AuthSession {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) return DEFAULT_SESSION;
    return { ...DEFAULT_SESSION, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SESSION;
  }
}

export function saveSession(session: AuthSession): void {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

export function loadSavedAnalysis(): SkillAnalysisResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ANALYSIS);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAnalysis(result: SkillAnalysisResult): void {
  localStorage.setItem(STORAGE_KEYS.ANALYSIS, JSON.stringify(result));
}

export function loadSavedRecommendations(): CareerRecommendationsResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveRecommendations(result: CareerRecommendationsResult): void {
  localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(result));
}

export function loadSavedRoadmap(): CareerRoadmapResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROADMAP);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveRoadmap(result: CareerRoadmapResult): void {
  localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(result));
}

export function loadCompletedSteps(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_STEPS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCompletedSteps(stepIds: string[]): void {
  localStorage.setItem(STORAGE_KEYS.COMPLETED_STEPS, JSON.stringify(stepIds));
}
