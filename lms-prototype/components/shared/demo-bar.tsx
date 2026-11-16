"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "./toast";
import type { RoleName } from "@/lib/types";
import { RotateCcw, Globe, GraduationCap, ShieldCheck } from "lucide-react";

const apps = [
  { key: "site", label: "Public Website", href: "/site", icon: Globe },
  { key: "lms", label: "Student LMS", href: "/lms/home", icon: GraduationCap },
  { key: "staff", label: "Staff Portal", href: "/staff/dashboard", icon: ShieldCheck },
];

export function DemoBar({ app }: { app: "site" | "lms" | "staff" }) {
  const router = useRouter();
  const reset = useAppStore((s) => s.reset);
  const students = useAppStore((s) => s.db.students);
  const currentStudentId = useAppStore((s) => s.currentStudentId);
  const setCurrentStudent = useAppStore((s) => s.setCurrentStudent);
  const currentRole = useAppStore((s) => s.currentRole);
  const setCurrentRole = useAppStore((s) => s.setCurrentRole);

  return (
    <div className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900 text-slate-200">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-2.5 py-1 font-semibold text-amber-300">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> DEMO MODE
        </span>

        <div className="flex items-center gap-1">
          {apps.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.key}
                href={a.href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-colors",
                  app === a.key ? "bg-slate-700 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
                )}
              >
                <Icon className="h-3.5 w-3.5" /> {a.label}
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          {app === "lms" ? (
            <label className="flex items-center gap-2">
              <span className="text-slate-400">Viewing student:</span>
              <select
                value={currentStudentId}
                onChange={(e) => setCurrentStudent(e.target.value)}
                className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-100 outline-none"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.state})
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {app === "staff" ? (
            <label className="flex items-center gap-2">
              <span className="text-slate-400">Role:</span>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as RoleName)}
                className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-100 outline-none"
              >
                <option value="Teacher">Teacher</option>
                <option value="Assistant">Assistant</option>
                <option value="System Admin">System Admin</option>
              </select>
            </label>
          ) : null}

          <button
            onClick={() => {
              reset();
              toast("Demo data reset to the original seed.");
              router.refresh();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-2.5 py-1 font-medium text-slate-300 hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset data
          </button>
        </div>
      </div>
    </div>
  );
}
