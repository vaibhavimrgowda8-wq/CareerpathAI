import React, { useRef, useState } from "react";
import { Camera, Check, Plus, RotateCcw, Trash2 } from "lucide-react";
import { INTEREST_OPTIONS } from "../data/careers";
import { SkillEntry, UserProfile } from "../types";
import { calculateProfileCompletion, DEFAULT_AVATAR_URL } from "../utils/storage";
import { SafeImage } from "./SafeImage";

interface ProfileViewProps {
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
}

const STUDY_YEARS = [
  "1st Year Undergraduate",
  "2nd Year Undergraduate",
  "3rd Year",
  "4th Year / Final Year",
  "Recent Graduate",
  "Working Professional",
];

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onSaveProfile }) => {
  const [draft, setDraft] = useState<UserProfile>(profile);
  const [isEditing, setIsEditing] = useState(true);
  const [newTechName, setNewTechName] = useState("");
  const [newTechLevel, setNewTechLevel] = useState(60);
  const [newSoftName, setNewSoftName] = useState("");
  const [newSoftLevel, setNewSoftLevel] = useState(75);
  const [customInterest, setCustomInterest] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const completion = calculateProfileCompletion(draft);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setDraft((prev) => ({ ...prev, photoUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleInterest = (interest: string) => {
    setDraft((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
  };

  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (!trimmed) return;
    if (!draft.interests.includes(trimmed)) {
      setDraft((prev) => ({ ...prev, interests: [...prev.interests, trimmed] }));
    }
    setCustomInterest("");
  };

  const updateSkillLevel = (
    type: "technicalSkills" | "softSkills",
    index: number,
    level: number
  ) => {
    setDraft((prev) => ({
      ...prev,
      [type]: prev[type].map((item, idx) => (idx === index ? { ...item, level } : item)),
    }));
  };

  const removeSkill = (type: "technicalSkills" | "softSkills", index: number) => {
    setDraft((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, idx) => idx !== index),
    }));
  };

  const addSkill = (type: "technicalSkills" | "softSkills") => {
    const rawName = type === "technicalSkills" ? newTechName : newSoftName;
    const level = type === "technicalSkills" ? newTechLevel : newSoftLevel;
    const trimmed = rawName.trim();
    if (!trimmed) return;

    const alreadyExists = draft[type].some(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (alreadyExists) return;

    const entry: SkillEntry = { name: trimmed, level };
    setDraft((prev) => ({ ...prev, [type]: [...prev[type], entry] }));

    if (type === "technicalSkills") {
      setNewTechName("");
      setNewTechLevel(60);
    } else {
      setNewSoftName("");
      setNewSoftLevel(75);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(draft);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Header & Profile Completion */}
      <div className="flex flex-col justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <SafeImage
              src={draft.photoUrl}
              alt={draft.fullName || "Student profile"}
              variant="avatar"
              className="h-20 w-20 rounded-full border border-slate-200 object-cover"
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload profile photo"
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-white bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 cursor-pointer"
              >
                <Camera className="h-4 w-4" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              {draft.fullName || "Your Profile"}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {draft.educationQualification || "Add qualification"} · {draft.studyYear || "Study year"}
            </p>
            {isEditing && (
              <div className="mt-2 flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer"
                >
                  Change photo
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setDraft((prev) => ({ ...prev, photoUrl: DEFAULT_AVATAR_URL }))}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset default
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full sm:w-72">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">Profile Completion</span>
            <span className="font-mono font-semibold text-indigo-600 tabular-nums">
              {completion}%
            </span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-sky-500 transition-all duration-300"
              style={{ width: `${completion}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing((v) => !v)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {isEditing ? "Preview Mode" : "Edit Profile"}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {savedNotice && (
        <div
          role="status"
          className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
        >
          <span>Profile saved. Your AI skill analyses and recommendations will use these updates.</span>
        </div>
      )}

      {/* Academic & Personal Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="font-display text-lg font-semibold text-slate-900">
          Personal &amp; Academic Details
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Used to calibrate career recommendations to your current academic stage.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="prof-name" className="block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              id="prof-name"
              type="text"
              disabled={!isEditing}
              value={draft.fullName}
              onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 disabled:bg-slate-50 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label htmlFor="prof-email" className="block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              id="prof-email"
              type="email"
              disabled={!isEditing}
              value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 disabled:bg-slate-50 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label htmlFor="prof-age" className="block text-sm font-medium text-slate-700">
              Age
            </label>
            <input
              id="prof-age"
              type="number"
              min={15}
              max={75}
              disabled={!isEditing}
              value={draft.age}
              onChange={(e) => setDraft({ ...draft, age: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 font-mono text-sm text-slate-900 tabular-nums disabled:bg-slate-50 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label htmlFor="prof-edu" className="block text-sm font-medium text-slate-700">
              Education Qualification
            </label>
            <input
              id="prof-edu"
              type="text"
              disabled={!isEditing}
              value={draft.educationQualification}
              onChange={(e) => setDraft({ ...draft, educationQualification: e.target.value })}
              placeholder="B.Tech in Computer Science"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 disabled:bg-slate-50 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label htmlFor="prof-college" className="block text-sm font-medium text-slate-700">
              College / University Name
            </label>
            <input
              id="prof-college"
              type="text"
              disabled={!isEditing}
              value={draft.collegeName}
              onChange={(e) => setDraft({ ...draft, collegeName: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 disabled:bg-slate-50 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label htmlFor="prof-year" className="block text-sm font-medium text-slate-700">
              Current Study Year
            </label>
            <select
              id="prof-year"
              disabled={!isEditing}
              value={draft.studyYear}
              onChange={(e) => setDraft({ ...draft, studyYear: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 disabled:bg-slate-50 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {STUDY_YEARS.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Interests & Career Goals */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="font-display text-lg font-semibold text-slate-900">
          Interests &amp; Career Goals
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Select domains that excite you and describe the role you are aiming for.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {Array.from(new Set([...INTEREST_OPTIONS, ...draft.interests])).map((interest) => {
            const active = draft.interests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                disabled={!isEditing}
                onClick={() => toggleInterest(interest)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer disabled:cursor-default ${
                  active
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>

        {isEditing && (
          <div className="mt-4 flex max-w-md gap-2">
            <input
              type="text"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomInterest();
                }
              }}
              placeholder="Add custom interest..."
              className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={addCustomInterest}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Add
            </button>
          </div>
        )}

        <div className="mt-6">
          <label htmlFor="prof-goals" className="block text-sm font-medium text-slate-700">
            Career Goals Statement
          </label>
          <textarea
            id="prof-goals"
            rows={3}
            disabled={!isEditing}
            value={draft.careerGoals}
            onChange={(e) => setDraft({ ...draft, careerGoals: e.target.value })}
            placeholder="Describe your target roles, timeline, or industry goals..."
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 disabled:bg-slate-50 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Technical & Soft Skills Sliders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Technical Skills */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">
                Technical Skills
              </h3>
              <p className="text-xs text-slate-500">Rate current confidence from 0% to 100%</p>
            </div>
            <span className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
              {draft.technicalSkills.length} skills
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {draft.technicalSkills.map((skill, idx) => (
              <div key={skill.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-800">{skill.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-indigo-600 tabular-nums">
                      {skill.level}%
                    </span>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeSkill("technicalSkills", idx)}
                        aria-label={`Remove ${skill.name}`}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  disabled={!isEditing}
                  value={skill.level}
                  onChange={(e) =>
                    updateSkillLevel("technicalSkills", idx, Number(e.target.value))
                  }
                  className="h-2 w-full cursor-pointer accent-indigo-600 disabled:cursor-default"
                />
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="mt-6 border-t border-slate-100 pt-4">
              <p className="text-xs font-medium text-slate-600">Add Technical Skill</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={newTechName}
                  onChange={(e) => setNewTechName(e.target.value)}
                  placeholder="e.g., TypeScript, Python, SQL"
                  className="min-w-[160px] flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                />
                <span className="font-mono text-xs text-slate-600 tabular-nums">
                  {newTechLevel}%
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={newTechLevel}
                  onChange={(e) => setNewTechLevel(Number(e.target.value))}
                  className="w-24 accent-indigo-600"
                />
                <button
                  type="button"
                  onClick={() => addSkill("technicalSkills")}
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-600 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Soft Skills */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900">
                Soft Skills
              </h3>
              <p className="text-xs text-slate-500">Communication, leadership, and collaboration</p>
            </div>
            <span className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
              {draft.softSkills.length} skills
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {draft.softSkills.map((skill, idx) => (
              <div key={skill.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-800">{skill.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-sky-700 tabular-nums">
                      {skill.level}%
                    </span>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeSkill("softSkills", idx)}
                        aria-label={`Remove ${skill.name}`}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  disabled={!isEditing}
                  value={skill.level}
                  onChange={(e) =>
                    updateSkillLevel("softSkills", idx, Number(e.target.value))
                  }
                  className="h-2 w-full cursor-pointer accent-sky-600 disabled:cursor-default"
                />
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="mt-6 border-t border-slate-100 pt-4">
              <p className="text-xs font-medium text-slate-600">Add Soft Skill</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={newSoftName}
                  onChange={(e) => setNewSoftName(e.target.value)}
                  placeholder="e.g., Leadership, Public Speaking"
                  className="min-w-[160px] flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                />
                <span className="font-mono text-xs text-slate-600 tabular-nums">
                  {newSoftLevel}%
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={newSoftLevel}
                  onChange={(e) => setNewSoftLevel(Number(e.target.value))}
                  className="w-24 accent-sky-600"
                />
                <button
                  type="button"
                  onClick={() => addSkill("softSkills")}
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};
