import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment secrets.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "2mb" }));

  // Health endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  // Contact form handler
  app.post("/api/contact", (req, res) => {
    const { name, email, subject, message } = req.body ?? {};
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(String(email))) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }
    return res.json({
      success: true,
      receivedAt: new Date().toISOString(),
      message: `Thank you, ${String(name).trim()}. Your inquiry regarding "${String(subject).trim()}" has been received by our guidance team.`,
    });
  });

  // 1. AI Skill Analysis
  app.post("/api/ai/analyze-skills", async (req, res) => {
    try {
      const { profile, targetCareer, requiredSkills } = req.body ?? {};
      if (!targetCareer || !profile) {
        return res.status(400).json({ error: "Profile and targetCareer are required." });
      }

      const ai = getAiClient();
      const userSkillsList = [
        ...(profile.technicalSkills || []),
        ...(profile.softSkills || []),
      ];

      const prompt = `Analyze a student or job seeker's current skill profile against the target career role.

Target Career: ${targetCareer.title} (${targetCareer.category})
Career Description: ${targetCareer.description}
Required Role Skills with benchmark target percentages:
${JSON.stringify(requiredSkills, null, 2)}

Candidate Profile:
- Name: ${profile.fullName}
- Education: ${profile.educationQualification}, ${profile.collegeName} (${profile.studyYear})
- Interests: ${(profile.interests || []).join(", ")}
- Career Goals: ${profile.careerGoals}
- Candidate Existing Skills (0-100 proficiency):
${JSON.stringify(userSkillsList, null, 2)}

Instructions:
1. Evaluate each benchmark skill required for "${targetCareer.title}". Match against the candidate's existing skills (case-insensitive / semantic match; if missing, currentLevel is 0). Also include any notable candidate skills relevant to the role.
2. Compute a realistic overallCareerReadinessScore (0-100 integer) weighted by how close the candidate's skills are to the target requirements.
3. Categorize skills into strongSkills (meeting or near requirement, e.g. >= 70% or gap <= 10%) and gapSkills (needing improvement, with specific actionable explanation of WHY this skill matters for ${targetCareer.title} and how to improve it).
4. Provide concise, encouraging, concrete executiveFeedback tailored to their education level (${profile.studyYear}) and goals.`;

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: prompt,
        config: {
          systemInstruction:
            "You are an expert technical career counselor and skill assessment analyst. Always return precise, grounded, encouraging, and practical analysis.",
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              readinessScore: { type: Type.INTEGER },
              readinessSummary: { type: Type.STRING },
              executiveFeedback: { type: Type.STRING },
              skillComparisons: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    skill: { type: Type.STRING },
                    category: { type: Type.STRING },
                    currentLevel: { type: Type.INTEGER },
                    requiredLevel: { type: Type.INTEGER },
                    gap: { type: Type.INTEGER },
                    status: { type: Type.STRING },
                  },
                  required: ["skill", "category", "currentLevel", "requiredLevel", "gap", "status"],
                },
              },
              strongSkills: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    skill: { type: Type.STRING },
                    level: { type: Type.INTEGER },
                    strengthNote: { type: Type.STRING },
                  },
                  required: ["skill", "level", "strengthNote"],
                },
              },
              skillsToImprove: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    skill: { type: Type.STRING },
                    currentLevel: { type: Type.INTEGER },
                    targetLevel: { type: Type.INTEGER },
                    priority: { type: Type.STRING },
                    whyItMatters: { type: Type.STRING },
                    actionTip: { type: Type.STRING },
                  },
                  required: ["skill", "currentLevel", "targetLevel", "priority", "whyItMatters", "actionTip"],
                },
              },
            },
            required: [
              "readinessScore",
              "readinessSummary",
              "executiveFeedback",
              "skillComparisons",
              "strongSkills",
              "skillsToImprove",
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? "{}").trim());
      return res.json(parsed);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to analyze skills with AI.";
      console.error("AI Skill Analysis error:", err);
      return res.status(500).json({ error: message });
    }
  });

  // 2. Personalized AI Career Recommendations
  app.post("/api/ai/recommend-careers", async (req, res) => {
    try {
      const { profile, availableCareers } = req.body ?? {};
      if (!profile) {
        return res.status(400).json({ error: "Profile is required." });
      }

      const ai = getAiClient();
      const prompt = `Recommend the top 4 best-fit career paths for this user based on their profile, education, interests, career goals, and current skills.

Candidate Profile:
- Full Name: ${profile.fullName}
- Age: ${profile.age}
- Education: ${profile.educationQualification} at ${profile.collegeName} (${profile.studyYear})
- Interests: ${(profile.interests || []).join(", ")}
- Career Goals: ${profile.careerGoals}
- Technical Skills: ${JSON.stringify(profile.technicalSkills || [])}
- Soft Skills: ${JSON.stringify(profile.softSkills || [])}

Available Career Catalog (prefer matching careerId to one of these IDs when applicable):
${JSON.stringify(availableCareers, null, 2)}

Return 4 ranked career recommendations, plus 3 immediate cross-cutting skill recommendations tailored to their profile.`;

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: prompt,
        config: {
          systemInstruction:
            "You are a senior career strategist for university students and early-career professionals. Provide specific, realistic, personalized career recommendations.",
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              profileSummary: { type: Type.STRING },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    careerId: { type: Type.STRING },
                    careerTitle: { type: Type.STRING },
                    category: { type: Type.STRING },
                    matchScore: { type: Type.INTEGER },
                    fitRationale: { type: Type.STRING },
                    matchingStrengths: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    recommendedSkillsToLearn: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    entryRoles: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    timeToJobReady: { type: Type.STRING },
                  },
                  required: [
                    "careerId",
                    "careerTitle",
                    "category",
                    "matchScore",
                    "fitRationale",
                    "matchingStrengths",
                    "recommendedSkillsToLearn",
                    "entryRoles",
                    "timeToJobReady",
                  ],
                },
              },
              priorityLearningFocus: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    skillName: { type: Type.STRING },
                    reason: { type: Type.STRING },
                    estimatedHours: { type: Type.INTEGER },
                  },
                  required: ["skillName", "reason", "estimatedHours"],
                },
              },
            },
            required: ["profileSummary", "recommendations", "priorityLearningFocus"],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? "{}").trim());
      return res.json(parsed);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to generate career recommendations.";
      console.error("AI Recommendations error:", err);
      return res.status(500).json({ error: message });
    }
  });

  // 3. Personalized Step-by-Step Career Roadmap
  app.post("/api/ai/generate-roadmap", async (req, res) => {
    try {
      const { profile, targetCareer } = req.body ?? {};
      if (!profile || !targetCareer) {
        return res.status(400).json({ error: "Profile and targetCareer are required." });
      }

      const ai = getAiClient();
      const prompt = `Create a structured 4-phase step-by-step career roadmap for a student/job seeker targeting "${targetCareer.title}".

Candidate Context:
- Education: ${profile.educationQualification} (${profile.studyYear})
- Existing Technical Skills: ${JSON.stringify(profile.technicalSkills || [])}
- Existing Soft Skills: ${JSON.stringify(profile.softSkills || [])}
- Career Goals: ${profile.careerGoals}

Target Career: ${targetCareer.title} (${targetCareer.category})
Description: ${targetCareer.description}

Design 4 sequential phases:
Phase 1: Core Foundations (Weeks 1-4)
Phase 2: Applied Technical Depth (Weeks 5-10)
Phase 3: Portfolio & Real-World Systems (Weeks 11-16)
Phase 4: Interview & Job Readiness (Weeks 17-20)

Each phase must include 3 concrete actionable steps (with title, description, resourceSuggestion, and estimatedHours) plus 1 milestone deliverable project.`;

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: prompt,
        config: {
          systemInstruction:
            "You are a curriculum designer and career mentor. Build practical, week-by-week learning roadmaps with concrete projects rather than vague advice.",
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              careerTitle: { type: Type.STRING },
              totalEstimatedWeeks: { type: Type.INTEGER },
              overview: { type: Type.STRING },
              phases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    phaseNumber: { type: Type.INTEGER },
                    phaseTitle: { type: Type.STRING },
                    timeframe: { type: Type.STRING },
                    goal: { type: Type.STRING },
                    milestoneProject: { type: Type.STRING },
                    steps: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          stepId: { type: Type.STRING },
                          title: { type: Type.STRING },
                          description: { type: Type.STRING },
                          resourceSuggestion: { type: Type.STRING },
                          estimatedHours: { type: Type.INTEGER },
                        },
                        required: [
                          "stepId",
                          "title",
                          "description",
                          "resourceSuggestion",
                          "estimatedHours",
                        ],
                      },
                    },
                  },
                  required: [
                    "phaseNumber",
                    "phaseTitle",
                    "timeframe",
                    "goal",
                    "milestoneProject",
                    "steps",
                  ],
                },
              },
            },
            required: ["careerTitle", "totalEstimatedWeeks", "overview", "phases"],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? "{}").trim());
      return res.json(parsed);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to generate career roadmap.";
      console.error("AI Roadmap error:", err);
      return res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Career Path AI server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
