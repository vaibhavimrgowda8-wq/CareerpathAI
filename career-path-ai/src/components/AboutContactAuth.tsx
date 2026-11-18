import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Mail, MapPin, Phone, Send } from "lucide-react";
import { AuthSession } from "../types";

interface AboutViewProps {
  onGetStarted: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onGetStarted }) => {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-indigo-600">About Career Path AI</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900">
          Replacing career guesswork with transparent skill benchmarks.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-slate-600">
          Students and early-career professionals often spend months learning disconnected topics without knowing how close they actually are to hiring expectations. Career Path AI pairs structured industry competency frameworks with AI reasoning to give every learner an honest baseline, clear gap explanations, and a step-by-step roadmap.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="font-mono text-sm font-semibold text-indigo-600">01. Skill Clarity</p>
          <h2 className="mt-2 font-display text-lg font-semibold text-slate-900">
            Transparent Readiness Scoring
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Instead of vague personality quizzes, we evaluate your actual technical and soft skill proficiencies against target role benchmarks.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="font-mono text-sm font-semibold text-indigo-600">02. Tailored Fit</p>
          <h2 className="mt-2 font-display text-lg font-semibold text-slate-900">
            Context-Aware AI Matching
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Recommendations factor in your degree, current study year, interests, and existing strengths so every suggested path feels achievable.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="font-mono text-sm font-semibold text-indigo-600">03. Structured Action</p>
          <h2 className="mt-2 font-display text-lg font-semibold text-slate-900">
            Project-Driven Roadmaps
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Every career roadmap breaks down into 4 concrete phases with weekly study focus areas and real portfolio projects.
          </p>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between rounded-2xl bg-slate-900 p-8 text-white">
        <div>
          <h3 className="font-display text-xl font-semibold">Start your skill assessment today</h3>
          <p className="mt-1 text-sm text-slate-300">
            Set up your profile and run your first AI career analysis in under two minutes.
          </p>
        </div>
        <button
          type="button"
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 whitespace-nowrap shrink-0 cursor-pointer"
        >
          Open Dashboard
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export const ContactView: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setConfirmation(null);

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError("Please fill out all fields before sending your message.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to send message.");
      }
      setConfirmation(data.message);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit form.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-sm font-semibold text-indigo-600">Contact Us</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900">
            Questions about career tracks or university partnerships?
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Reach out to our career guidance team for support, curriculum alignment inquiries, or feedback on our skill benchmarks.
          </p>

          <div className="mt-8 space-y-4 border-t border-slate-200 pt-6 text-sm text-slate-700">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-indigo-600" />
              <span>guidance@careerpathai.edu</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-indigo-600" />
              <span className="tabular-nums">+1 (415) 890-4420</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-indigo-600" />
              <span>548 Market St, San Francisco, CA</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 lg:col-span-7">
          {confirmation ? (
            <div className="flex flex-col items-start gap-4 py-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="font-display text-xl font-semibold text-slate-900">
                Message Sent
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">{confirmation}</p>
              <button
                type="button"
                onClick={() => setConfirmation(null)}
                className="mt-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 cursor-pointer"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aarav Mehta"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium text-slate-700">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Career benchmark feedback or campus access"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us how we can help..."
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm font-medium text-rose-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

interface AuthViewProps {
  initialMode: "login" | "signup";
  currentEmail: string;
  currentName: string;
  onAuthSuccess: (session: AuthSession) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode,
  currentEmail,
  currentName,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [fullName, setFullName] = useState(currentName || "");
  const [email, setEmail] = useState(currentEmail || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (mode === "signup" && !fullName.trim()) {
      setError("Please enter your full name to create your account.");
      return;
    }

    onAuthSuccess({
      isAuthenticated: true,
      userEmail: email.trim(),
      userName: (fullName.trim() || email.split("@")[0]).trim(),
    });
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors cursor-pointer ${
              mode === "login"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors cursor-pointer ${
              mode === "signup"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign Up
          </button>
        </div>

        <h1 className="mt-6 font-display text-2xl font-bold text-slate-900">
          {mode === "login" ? "Welcome back" : "Create your student profile"}
        </h1>
        <p className="mt-1.5 text-sm text-slate-600">
          {mode === "login"
            ? "Sign in to access your saved skill ratings, AI analysis, and career roadmap."
            : "Start tracking your skills, career fit, and personalized learning milestones."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <div>
              <label htmlFor="auth-name" className="block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                id="auth-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aarav Mehta"
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm font-medium text-rose-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-indigo-500 hover:to-violet-500 cursor-pointer"
          >
            {mode === "login" ? "Sign In to Dashboard" : "Create Account & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};
