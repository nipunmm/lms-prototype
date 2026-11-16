"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { shortDate } from "@/lib/format";
import { PageHeader, StatTile, SectionTitle } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/shared/toast";
import { cn } from "@/lib/utils";
import { CalendarCheck, Radio, Check, Clock, X, ShieldCheck } from "lucide-react";
import type { AttendanceStatus } from "@/lib/types";

const statuses: { value: AttendanceStatus; label: string; icon: typeof Check }[] = [
  { value: "present", label: "Present", icon: Check },
  { value: "late", label: "Late", icon: Clock },
  { value: "absent", label: "Absent", icon: X },
  { value: "excused", label: "Excused", icon: ShieldCheck },
];

export default function StaffAttendancePage() {
  const db = useAppStore((s) => s.db);
  const correctAttendance = useAppStore((s) => s.correctAttendance);

  const sortedSessions = [...db.sessions].sort((a, b) => b.date.localeCompare(a.date));
  const [sessionId, setSessionId] = useState(sortedSessions[0]?.id ?? "");
  const session = db.sessions.find((s) => s.id === sessionId);
  const cls = session ? db.classes.find((c) => c.id === session.classId) : null;
  const records = db.attendance.filter((a) => a.sessionId === sessionId);
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});

  const present = records.filter((a) => a.status === "present" || a.status === "late").length;
  const pct = records.length ? Math.round((present / records.length) * 100) : 0;

  const lowAttendance = db.students
    .map((s) => {
      const recs = db.attendance.filter((a) => a.studentId === s.id);
      const p = recs.filter((a) => a.status === "present" || a.status === "late").length;
      return { s, pct: recs.length ? Math.round((p / recs.length) * 100) : null, n: recs.length };
    })
    .filter((x) => x.pct !== null && x.pct < db.settings.minPresentPct)
    .sort((a, b) => (a.pct ?? 0) - (b.pct ?? 0));

  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Mark and correct attendance. Anything below the minimum is flagged for follow-up."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Sessions" value={db.sessions.length} icon={<CalendarCheck className="h-4 w-4" />} />
        <StatTile label="This session" value={records.length ? `${pct}%` : "—"} tone={pct >= db.settings.minPresentPct ? "success" : "warning"} hint="present + late" />
        <StatTile label="Minimum required" value={`${db.settings.minPresentPct}%`} hint={`late after ${db.settings.lateLimitMins} min`} />
        <StatTile label="Below minimum" value={lowAttendance.length} tone="danger" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="pt-5">
            <SectionTitle title="Sessions" description="Pick a session to mark." />
            <div className="grid max-h-[520px] gap-2 overflow-y-auto pr-1">
              {sortedSessions.map((s) => {
                const c = db.classes.find((x) => x.id === s.classId);
                const active = s.id === sessionId;
                return (
                  <button
                    key={s.id}
                    onClick={() => { setSessionId(s.id); setNoteDraft({}); }}
                    className={cn(
                      "rounded-xl border p-3 text-left transition-colors",
                      active ? "border-primary bg-primary/5" : "border-border hover:bg-muted",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{c?.type} — {c?.batch}</p>
                      {s.status === "live" ? <Badge tone="danger"><Radio className="h-3 w-3" /> LIVE</Badge> : <StatusBadge status={s.status} />}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{shortDate(s.date)} · {s.start}–{s.end}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="pt-5">
            <SectionTitle
              title={session ? `${cls?.type} — ${cls?.batch}` : "Select a session"}
              description={session ? `${shortDate(session.date)} · ${session.start}–${session.end}` : undefined}
              action={session ? <Button size="sm" variant="outline" onClick={() => toast("Attendance sheet exported (demo).", "info")}>Export</Button> : undefined}
            />

            {!session || records.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {session ? "No attendance recorded for this session yet. Use the LMS auto-marking or mark below." : "Choose a session from the list."}
              </p>
            ) : (
              <div className="grid gap-3">
                {records.map((a) => {
                  const st = db.students.find((s) => s.id === a.studentId);
                  return (
                    <div key={a.id} className="rounded-xl border border-border p-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={st?.name ?? "?"} hue={st?.avatarHue ?? 220} size={34} />
                          <div>
                            <p className="text-sm font-medium">{st?.name}</p>
                            <p className="text-xs text-muted-foreground">{a.studentId}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {statuses.map((s) => {
                            const Icon = s.icon;
                            const active = a.status === s.value;
                            return (
                              <button
                                key={s.value}
                                onClick={() => { correctAttendance(a.id, s.value, a.note ?? ""); toast(`${st?.name} marked ${s.label.toLowerCase()}.`); }}
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium",
                                  active
                                    ? s.value === "absent"
                                      ? "border-danger bg-danger/10 text-danger"
                                      : s.value === "late"
                                        ? "border-warning bg-warning/10 text-warning"
                                        : "border-success bg-success/10 text-success"
                                    : "border-border text-muted-foreground hover:bg-muted",
                                )}
                              >
                                <Icon className="h-3.5 w-3.5" /> {s.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Input
                          className="h-8 text-xs"
                          placeholder="Correction note (optional)"
                          value={noteDraft[a.id] ?? a.note ?? ""}
                          onChange={(e) => setNoteDraft({ ...noteDraft, [a.id]: e.target.value })}
                        />
                        <Button size="sm" variant="ghost" onClick={() => { correctAttendance(a.id, a.status, noteDraft[a.id] ?? ""); toast("Note saved."); }}>
                          Save note
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <SectionTitle title="Low attendance — follow up" description={`Students below the ${db.settings.minPresentPct}% minimum.`} />
        <Card>
          <CardContent className="pt-5">
            <div className="grid gap-3">
              {lowAttendance.map(({ s, pct: p, n }) => (
                <div key={s.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} hue={s.avatarHue} size={32} />
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{n} recorded sessions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress className="w-32" value={p ?? 0} barClassName="bg-danger" />
                    <Badge tone="danger">{p}%</Badge>
                  </div>
                </div>
              ))}
              {lowAttendance.length === 0 ? <p className="text-sm text-muted-foreground">Everyone is above the minimum.</p> : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
