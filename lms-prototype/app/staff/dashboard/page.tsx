"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { money, shortDate, timeAgo } from "@/lib/format";
import { pick, missingLangs } from "@/lib/i18n";
import { PageHeader, StatTile } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CalendarClock, UserPlus, Wallet, AlertTriangle, TrendingUp, Flame, Languages,
  MessagesSquare, Package, UserX, Landmark, Filter, BarChart3, ArrowRight, Radio,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const MONTH = "2026-11";

export default function StaffDashboardPage() {
  const db = useAppStore((s) => s.db);
  const currentRole = useAppStore((s) => s.currentRole);
  const role = db.roles.find((r) => r.name === currentRole);
  const cards = role?.dashboard ?? [];

  const has = (k: string) => cards.includes(k);

  // Data
  const upcoming = db.sessions.filter((s) => s.status === "scheduled" || s.status === "live").sort((a, b) => a.date.localeCompare(b.date));
  const pendingRequests = db.requests.filter((r) => r.status === "pending");
  const pendingPayments = db.payments.filter((p) => p.status === "pending");

  const activeEnrolments = db.enrolments.filter((e) => e.status === "active");
  const paidStudentIds = new Set(
    db.payments.filter((p) => p.status === "confirmed" && p.months.includes(MONTH)).map((p) => p.studentId),
  );
  const unpaid = activeEnrolments.filter((e) => !paidStudentIds.has(e.studentId));

  const newSignups = db.students.filter((s) => s.joined >= "2026-11-08");
  const warmLeads = db.leads.filter((l) => l.engagementScore >= 60).sort((a, b) => b.engagementScore - a.engagementScore);

  const missingTranslation = [
    ...db.updates.filter((u) => missingLangs(u.title).length || missingLangs(u.body).length),
    ...db.testimonials.filter((t) => missingLangs(t.quote).length),
    ...db.faqs.filter((f) => missingLangs(f.question).length || missingLangs(f.answer).length),
  ];

  const unread = db.messages.filter((m) => m.from === "student" && !m.read);
  const newCallbacks = db.callbacks.filter((c) => c.status === "new");

  const absentCount: Record<string, number> = {};
  db.attendance.filter((a) => a.status === "absent").forEach((a) => {
    absentCount[a.studentId] = (absentCount[a.studentId] ?? 0) + 1;
  });
  const absenceFollowUp = Object.entries(absentCount).filter(([, n]) => n >= db.settings.absenceFollowUp);

  const confirmedThisMonth = db.payments.filter((p) => p.status === "confirmed" && p.months.includes(MONTH)).reduce((s, p) => s + p.amount, 0);
  const expensesThisMonth = db.expenses.filter((e) => e.date.startsWith(MONTH)).reduce((s, e) => s + e.amount, 0);

  const signupData = [
    { m: "Jun", n: 42 }, { m: "Jul", n: 58 }, { m: "Aug", n: 71 }, { m: "Sep", n: 66 }, { m: "Oct", n: 84 }, { m: "Nov", n: db.students.length },
  ];

  const funnel = [
    { label: "Website visitors", value: 4820, pct: 100 },
    { label: "Free sign-ups", value: 612, pct: 13 },
    { label: "Join requests", value: 184, pct: 4 },
    { label: "Approved", value: 121, pct: 2.5 },
    { label: "Paying students", value: activeEnrolments.length, pct: 1.6 },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Everything that needs your attention today. Signed in as ${currentRole}.`}
      />

      {has("today-classes") || has("join-requests") || has("payments-waiting") ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {has("today-classes") ? (
            <StatTile label="Today's classes" value={upcoming.filter((s) => s.status === "live").length || upcoming.length} hint={upcoming[0] ? `Next: ${shortDate(upcoming[0].date)} ${upcoming[0].start}` : "None"} icon={<CalendarClock className="h-4 w-4" />} />
          ) : null}
          {has("join-requests") ? (
            <StatTile label="Join requests" value={pendingRequests.length} hint="waiting for approval" tone="warning" icon={<UserPlus className="h-4 w-4" />} />
          ) : null}
          {has("payments-waiting") ? (
            <StatTile label="Payments waiting" value={pendingPayments.length} hint="slips to check" tone="warning" icon={<Wallet className="h-4 w-4" />} />
          ) : null}
          {has("unpaid") ? (
            <StatTile label="Unpaid students" value={unpaid.length} hint={`for ${MONTH}`} tone="danger" icon={<AlertTriangle className="h-4 w-4" />} />
          ) : null}
          {has("new-signups") ? (
            <StatTile label="New sign-ups" value={newSignups.length} hint="this week" tone="success" icon={<TrendingUp className="h-4 w-4" />} />
          ) : null}
          {has("warm-leads") ? (
            <StatTile label="Warm leads" value={warmLeads.length} hint="high engagement" icon={<Flame className="h-4 w-4" />} />
          ) : null}
          {has("missing-translation") ? (
            <StatTile label="Missing translations" value={missingTranslation.length} hint="bilingual gaps" tone="warning" icon={<Languages className="h-4 w-4" />} />
          ) : null}
          {has("messages-callbacks") ? (
            <StatTile label="Messages & call-backs" value={unread.length + newCallbacks.length} hint={`${unread.length} unread, ${newCallbacks.length} new`} icon={<MessagesSquare className="h-4 w-4" />} />
          ) : null}
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="grid gap-6 lg:col-span-2">
          {has("today-classes") ? (
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Today's classes</h2>
                  <Link href="/staff/classes" className="text-sm text-primary hover:underline">All classes</Link>
                </div>
                <div className="mt-3 grid gap-2">
                  {upcoming.slice(0, 4).map((s) => {
                    const c = db.classes.find((x) => x.id === s.classId);
                    return (
                      <div key={s.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                        <div>
                          <p className="text-sm font-medium">{c?.type} — {c?.batch}</p>
                          <p className="text-xs text-muted-foreground">{shortDate(s.date)} · {s.start}–{s.end}</p>
                        </div>
                        {s.status === "live" ? <Badge tone="danger" className="animate-pulse"><Radio className="h-3 w-3" /> LIVE</Badge> : <StatusBadge status={s.status} />}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {has("signup-chart") ? (
            <Card>
              <CardContent className="pt-5">
                <h2 className="flex items-center gap-2 font-semibold"><BarChart3 className="h-4 w-4" /> Sign-ups over time</h2>
                <div className="mt-3 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={signupData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="m" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="n" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {has("growth-funnel") ? (
            <Card>
              <CardContent className="pt-5">
                <h2 className="flex items-center gap-2 font-semibold"><Filter className="h-4 w-4" /> Growth funnel</h2>
                <div className="mt-4 grid gap-3">
                  {funnel.map((f) => (
                    <div key={f.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{f.label}</span>
                        <span className="font-medium">{f.value.toLocaleString()}</span>
                      </div>
                      <Progress className="mt-1" value={f.pct} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="grid gap-6">
          {has("payments-waiting") ? (
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Payments to check</h2>
                  <Link href="/staff/payments" className="text-sm text-primary hover:underline">Open</Link>
                </div>
                <div className="mt-3 grid gap-2">
                  {pendingPayments.slice(0, 4).map((p) => {
                    const st = db.students.find((x) => x.id === p.studentId);
                    return (
                      <div key={p.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                        <div>
                          <p className="text-sm font-medium">{st?.name}</p>
                          <p className="text-xs text-muted-foreground">{p.reference} · {money(p.amount)}</p>
                        </div>
                        {p.duplicateFlag ? <Badge tone="warning">flag</Badge> : null}
                      </div>
                    );
                  })}
                  {pendingPayments.length === 0 ? <p className="text-sm text-muted-foreground">Nothing pending.</p> : null}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {has("join-requests") ? (
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Join requests</h2>
                  <Link href="/staff/students" className="text-sm text-primary hover:underline">Review</Link>
                </div>
                <div className="mt-3 grid gap-2">
                  {pendingRequests.slice(0, 4).map((r) => {
                    const st = db.students.find((x) => x.id === r.studentId);
                    const c = db.classes.find((x) => x.id === r.classId);
                    return (
                      <div key={r.id} className="rounded-xl border border-border p-3">
                        <p className="text-sm font-medium">{st?.name}</p>
                        <p className="text-xs text-muted-foreground">{c?.type} — {c?.batch}</p>
                      </div>
                    );
                  })}
                  {pendingRequests.length === 0 ? <p className="text-sm text-muted-foreground">Nothing pending.</p> : null}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {has("money-snapshot") ? (
            <Card>
              <CardContent className="pt-5">
                <h2 className="flex items-center gap-2 font-semibold"><Landmark className="h-4 w-4" /> Money snapshot</h2>
                <div className="mt-3 grid gap-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Confirmed (Nov)</span><span className="font-medium text-success">{money(confirmedThisMonth)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Pending</span><span className="font-medium text-warning">{money(pendingPayments.reduce((s, p) => s + p.amount, 0))}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Expenses (Nov)</span><span className="font-medium text-danger">{money(expensesThisMonth)}</span></div>
                  <div className="mt-1 flex justify-between border-t border-border pt-2"><span className="font-medium">Net</span><span className="font-bold">{money(confirmedThisMonth - expensesThisMonth)}</span></div>
                </div>
                <Link href="/staff/finance"><Button size="sm" variant="outline" className="mt-3 w-full">Open finance</Button></Link>
              </CardContent>
            </Card>
          ) : null}

          {has("warm-leads") ? (
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Warm leads</h2>
                  <Link href="/staff/growth" className="text-sm text-primary hover:underline">All</Link>
                </div>
                <div className="mt-3 grid gap-2">
                  {warmLeads.slice(0, 3).map((l) => {
                    const st = db.students.find((x) => x.id === l.studentId);
                    return (
                      <div key={l.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                        <div>
                          <p className="text-sm font-medium">{st?.name}</p>
                          <p className="text-xs text-muted-foreground">{st?.source} · joined {timeAgo(st?.joined ?? "")}</p>
                        </div>
                        <Badge tone="warning">{l.engagementScore}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {has("missing-translation") && missingTranslation.length > 0 ? (
            <Card>
              <CardContent className="pt-5">
                <h2 className="flex items-center gap-2 font-semibold"><Languages className="h-4 w-4" /> Translation gaps</h2>
                <p className="mt-2 text-sm text-muted-foreground">{missingTranslation.length} item(s) missing a language. Students see the other language instead.</p>
                <Link href="/staff/website"><Button size="sm" variant="outline" className="mt-3">Fix in website content <ArrowRight className="h-4 w-4" /></Button></Link>
              </CardContent>
            </Card>
          ) : null}

          {has("absence-followup") ? (
            <Card>
              <CardContent className="pt-5">
                <h2 className="flex items-center gap-2 font-semibold"><UserX className="h-4 w-4" /> Absence follow-up</h2>
                <div className="mt-3 grid gap-2">
                  {absenceFollowUp.map(([sid, n]) => {
                    const st = db.students.find((x) => x.id === sid);
                    return (
                      <div key={sid} className="flex items-center justify-between rounded-xl border border-border p-3">
                        <p className="text-sm font-medium">{st?.name}</p>
                        <Badge tone="danger">{n} absences</Badge>
                      </div>
                    );
                  })}
                  {absenceFollowUp.length === 0 ? <p className="text-sm text-muted-foreground">No one needs follow-up.</p> : null}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {has("tute-progress") ? (
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-semibold"><Package className="h-4 w-4" /> Tute progress</h2>
                  <Link href="/staff/tutes" className="text-sm text-primary hover:underline">Manage</Link>
                </div>
                <div className="mt-3 grid gap-2">
                  {db.dispatches.slice(0, 4).map((d) => (
                    <div key={d.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                      <div>
                        <p className="text-sm font-medium">{db.classes.find((c) => c.id === d.classId)?.batch}</p>
                        <p className="text-xs text-muted-foreground">{d.month}</p>
                      </div>
                      <StatusBadge status={d.stage} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {has("messages-callbacks") ? (
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Messages & call-backs</h2>
                  <Link href="/staff/communication" className="text-sm text-primary hover:underline">Open inbox</Link>
                </div>
                <div className="mt-3 grid gap-2">
                  {newCallbacks.slice(0, 3).map((c) => (
                    <div key={c.id} className="rounded-xl border border-border p-3">
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.phone} · {c.interest}</p>
                    </div>
                  ))}
                  {newCallbacks.length === 0 ? <p className="text-sm text-muted-foreground">No new call-backs.</p> : null}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
