"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Globe, GraduationCap, ShieldCheck, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const db = useAppStore((s) => s.db);
  const classes = db.classes.filter((c) => c.active).length;
  const students = db.students.length;

  const apps = [
    {
      key: "site",
      href: "/site",
      icon: Globe,
      title: "Public Website",
      audience: "Anyone — no sign-in",
      job: "Persuade and inform. The shop window: teacher, classes with fees and timetables, updates, proof and how to join.",
      langs: "සිංහල + English",
      color: "from-teal-500 to-emerald-600",
      points: ["7 pages, every page in both languages", "Language toggle in the header", "Call-back request + WhatsApp"],
    },
    {
      key: "lms",
      href: "/lms/home",
      icon: GraduationCap,
      title: "Student LMS",
      audience: "Students — free account",
      job: "Engage and teach. Free hooks that bring students back daily, joining and paying, live classes, material, exams, tutes.",
      langs: "සිංහල + English",
      color: "from-indigo-500 to-violet-600",
      points: ["Daily question, leaderboard, badges", "Join a class, pay, unlock access", "Live Zoom, notes, exams, tutes"],
    },
    {
      key: "staff",
      href: "/staff/login",
      icon: ShieldCheck,
      title: "Staff Portal",
      audience: "Teacher, Assistant, System Admin",
      job: "Run and grow the business. Manages everything the other two show and decides every request.",
      langs: "English only",
      color: "from-blue-600 to-indigo-700",
      points: ["Role-based dashboards & actions", "Growth funnel, warm leads, nudges", "Payments, classes, website content"],
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
          <span className="h-2 w-2 rounded-full bg-amber-400" /> PROTOTYPE DEMO — DUMMY DATA ONLY
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Solo Teacher Platform
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-400">
          One demo application containing three separate systems. Choose where you want to go — everything is
          clickable and the data flows between the apps.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-400">
          <span className="rounded-full border border-slate-800 px-3 py-1">{classes} active classes</span>
          <span className="rounded-full border border-slate-800 px-3 py-1">{students} students</span>
          <span className="rounded-full border border-slate-800 px-3 py-1">LKR · Sri Lanka</span>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {apps.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.key}
                href={a.href}
                className="group flex flex-col rounded-3xl border border-slate-800 bg-slate-900 p-6 transition-all hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl"
              >
                <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${a.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold">{a.title}</h2>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{a.audience}</p>
                <p className="mt-3 text-sm text-slate-400">{a.job}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-slate-400">
                  {a.points.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-600" /> {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
                  <span className="text-xs text-slate-500">{a.langs}</span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-white">
                    Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-slate-400">
          <span>Try the end-to-end journey:</span>
          <Link href="/site">
            <Button variant="secondary" size="sm">1. Website</Button>
          </Link>
          <Link href="/lms/home">
            <Button variant="secondary" size="sm">2. Join free</Button>
          </Link>
          <Link href="/staff/login">
            <Button variant="secondary" size="sm">3. Approve &amp; collect payment</Button>
          </Link>
        </div>

        <p className="mt-10 text-xs text-slate-600">
          No real APIs, databases, payments, SMS, WhatsApp or Zoom are used. Every screen uses dummy data. State is
          shared in the browser and can be reset from the demo bar inside each app.
        </p>
      </div>
    </main>
  );
}
