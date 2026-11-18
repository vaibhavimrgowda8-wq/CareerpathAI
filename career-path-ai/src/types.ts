export type PublicPage = "home" | "about" | "contact" | "auth";
export type DashboardTab =
  | "overview"
  | "profile"
  | "careers"
  | "analysis"
  | "recommendations"
  | "roadmap";

export interface SkillEntry {
  name: string;
  level: number; // 0 - 100
}

export interface UserProfile {
  fullName: string;
  email: string;
  age: string;
  educationQualification: string;
  collegeName: string;
  studyYear: string;
  photoUrl: string;
  interests: string[];
  careerGoals: string;
  technicalSkills: SkillEntry[];
  softSkills: SkillEntry[];
}

export interface AuthSession {
  isAuthenticated: boolean;
  userEmail: string;
  userName: string;
}

export interface RequiredSkillBenchmark {
  name: string;
  category: "Technical" | "Soft";
  requiredLevel: number;
}

export interface CareerPathItem {
  id: string;
  title: string;
  category:
    | "Web Development"
    | "Data Science"
    | "Artificial Intelligence and Machine Learning"
    | "Cybersecurity"
    | "UI/UX Design"
    | "Cloud Computing"
    | "Digital Marketing"
    | "Software Engineering";
  description: string;
  avgSalaryRange: string;
  demandOutlook: string;
  technicalSkills: string[];
  softSkills: string[];
  skillLevels: {
    beginner: string[];
    intermediate: string[];
    advanced: string[];
  };
  jobRoles: string[];
  benchmarks: RequiredSkillBenchmark[];
}

export interface SkillComparisonItem {
  skill: string;
  category: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  status: string;
}

export interface StrongSkillItem {
  skill: string;
  level: number;
  strengthNote: string;
}

export interface SkillToImproveItem {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  priority: string;
  whyItMatters: string;
  actionTip: string;
}

export interface SkillAnalysisResult {
  targetCareerId: string;
  targetCareerTitle: string;
  analyzedAt: string;
  readinessScore: number;
  readinessSummary: string;
  executiveFeedback: string;
  skillComparisons: SkillComparisonItem[];
  strongSkills: StrongSkillItem[];
  skillsToImprove: SkillToImproveItem[];
}

export interface CareerRecommendationItem {
  careerId: string;
  careerTitle: string;
  category: string;
  matchScore: number;
  fitRationale: string;
  matchingStrengths: string[];
  recommendedSkillsToLearn: string[];
  entryRoles: string[];
  timeToJobReady: string;
}

export interface PriorityLearningFocusItem {
  skillName: string;
  reason: string;
  estimatedHours: number;
}

export interface CareerRecommendationsResult {
  generatedAt: string;
  profileSummary: string;
  recommendations: CareerRecommendationItem[];
  priorityLearningFocus: PriorityLearningFocusItem[];
}

export interface RoadmapStep {
  stepId: string;
  title: string;
  description: string;
  resourceSuggestion: string;
  estimatedHours: number;
}

export interface RoadmapPhase {
  phaseNumber: number;
  phaseTitle: string;
  timeframe: string;
  goal: string;
  milestoneProject: string;
  steps: RoadmapStep[];
}

export interface CareerRoadmapResult {
  careerId: string;
  careerTitle: string;
  generatedAt: string;
  totalEstimatedWeeks: number;
  overview: string;
  phases: RoadmapPhase[];
}
