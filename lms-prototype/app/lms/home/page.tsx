"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { useT, pick } from "@/lib/i18n";
import { money, shortDate, daysUntil, getAccountStatus, getApplicationStatus } from "@/lib/format";
import { PageHeader, StatTile } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Radio, CalendarClock, HelpCircle, Package, BookOpen, Flame, Coins, Target, ArrowRight, Bell,
} from "lucide-react";

export default function LmsHomePage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const studentId = useAppStore((s) => s.currentStudentId);
  const t = useT(lmsLang);

  const student = db.students.find((s) => s.id === studentId)!;
  const myEnrolments = db.enrolments.filter((e) => e.studentId === studentId && e.status === "active");
  const myClassIds = myEnrolments.map((e) => e.classId);
  const myClasses = db.classes.filter((c) => myClassIds.includes(c.id));
  const account = getAccountStatus(student);
  const appStatus = getApplicationStatus(db.requests, studentId);

  const isActive = account.key === "active" && myEnrolments.length > 0;

  const upcoming = db.sessions
    .filter(
      (s) =>
        (myClassIds.includes(s.classId) || s.openClass) &&
        (s.status === "scheduled" || s.status === "live"),
    )
    .sort((a, b) => a.date.localeCompare(b.date));
  const next = upcoming[0];

  const dates = db.importantDates
    .filter((d) => d.scope === "everyone" || myClassIds.includes(d.scope))
    .sort((a, b) => a.date.localeCompare(b.date));
  const nextDate = dates[0];

  const daily = db.dailyQuestions[0];
  const answered = useAppStore((s) => s.dailyAnswer);

  const dispatch = db.dispatches.find((d) => myClassIds.includes(d.classId));
  const updates = db.updates.filter((u) => u.published).slice(0, 2);
  const level = Math.floor(student.points / 500) + 1;

  const showAccountBanner = account.key !== "active" || (appStatus.key !== "none" && appStatus.key !== "approved");

  return (
    <div>
      <PageHeader
        title={`${t("lms.home.hello")}, ${student.nickname}`}
        description={`${t("lms.home.studentId")}: ${student.id} · ${t("lms.growth.level")} ${level}`}
        actions={<Badge tone="muted">{lmsLang === "si" ? "සිංහල" : "English"}</Badge>}
      />

      {showAccountBanner ? (
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardContent className="pt-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge tone={account.tone}>{t(account.labelKey)}</Badge>
                  <Badge tone={appStatus.tone}>{t(appStatus.labelKey)}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {account.key !== "active" ? t("lms.home.hooksHint") : t(appStatus.nextKey)}
                </p>
                {appStatus.key === "rejected" && appStatus.latest?.reason ? (
                  <p className="mt-1 text-xs text-danger">{appStatus.latest.reason}</p>
                ) : null}
              </div>
              <div className="flex gap-2">
                {appStatus.key === "approved" ? (
                  <Link href="/lms/payments"><Button>{t("lms.pay.payNow")} <ArrowRight className="h-4 w-4" /></Button></Link>
                ) : (
                  <Link href="/lms/classes"><Button>{t("lms.home.explore")} <ArrowRight className="h-4 w-4" /></Button></Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label={t("lms.growth.streak")} value={`${student.streak}`} icon={<Flame className="h-4 w-4" />} tone="warning" />
        <StatTile label={t("lms.growth.points")} value={student.points} icon={<Coins className="h-4 w-4" />} />
        <StatTile label={t("lms.growth.accuracy")} value={`${student.accuracy}%`} icon={<Target className="h-4 w-4" />} tone="success" />
        <StatTile label={t("lms.nav.myClasses")} value={myClasses.length} icon={<BookOpen className="h-4 w-4" />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{t("lms.home.nextSession")}</h2>
              {next?.status === "live" ? (
                <Badge tone="danger" className="animate-pulse">
                  <Radio className="h-3 w-3" /> {t("lms.home.liveNow")}
                </Badge>
              ) : null}
            </div>
            {next ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4">
                <div>
                  <p className="font-medium">
                    {db.classes.find((c) => c.id === next.classId)?.subject} ·{" "}
                    {db.classes.find((c) => c.id === next.classId)?.type}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {db.classes.find((c) => c.id === next.classId)?.batch} · {shortDate(next.date, lmsLang)} · {next.start}–{next.end}
                  </p>
                  {next.openClass ? <Badge tone="info" className="mt-2">{t("lms.nav.openClasses")}</Badge> : null}
                </div>
                <Button disabled={!isActive && !next.openClass}>
                  <Radio className="h-4 w-4" /> {t("lms.home.joinNow")}
                </Button>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">{t("lms.home.noSession")}</p>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CalendarClock className="h-4 w-4 text-primary" /> {t("lms.home.examCountdown")}
                </div>
                {nextDate ? (
                  <>
                    <p className="mt-2 text-2xl font-bold text-danger">{daysUntil(nextDate.date)} {t("lms.home.daysLeft")}</p>
                    <p className="text-xs text-muted-foreground">{pick(nextDate.title, lmsLang)} · {shortDate(nextDate.date, lmsLang)}</p>
                  </>
                ) : <p className="mt-2 text-sm text-muted-foreground">—</p>}
              </div>
              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Package className="h-4 w-4 text-primary" /> {t("lms.nav.tutes")}
                </div>
                {dispatch ? (
                  <>
                    <p className="mt-2"><StatusBadge status={dispatch.stage} /></p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {dispatch.month} · {db.classes.find((c) => c.id === dispatch.classId)?.batch}
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">—</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">{t("lms.home.todayQuestion")}</h2>
            </div>
            {daily ? (
              <>
                <p className="mt-3 text-sm">{pick(daily.text, lmsLang)}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t("lms.growth.streak")}: {student.streak}</span>
                  {answered ? <Badge tone={answered.correct ? "success" : "danger"}>{answered.correct ? "Correct" : "Wrong"}</Badge> : null}
                </div>
                <Link href="/lms/daily-question">
                  <Button className="mt-4 w-full" variant={answered ? "outline" : "default"}>
                    {answered ? t("lms.home.viewAnswer") : t("lms.home.answerNow")}
                  </Button>
                </Link>
                <Progress className="mt-4" value={(student.streak % 7) * (100 / 7)} />
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 font-semibold">{t("lms.nav.myClasses")}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {myClasses.map((c) => (
              <div key={c.id} className="rounded-2xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{c.type}</p>
                  <Badge tone="muted">{c.medium}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{c.batch}</p>
                <p className="mt-2 text-sm">
                  {money(c.monthlyFee, lmsLang)} <span className="text-muted-foreground">{t("site.classes.month")}</span>
                </p>
              </div>
            ))}
            {myClasses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground sm:col-span-2">
                {t("lms.home.state.notInClass")} {" "}
                <Link href="/lms/classes" className="text-primary hover:underline">
                  {t("lms.home.explore")}
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <h2 className="mb-3 flex items-center gap-2 font-semibold">
            <Bell className="h-4 w-4" /> {t("site.nav.updates")}
          </h2>
          <div className="grid gap-3">
            {updates.map((u) => (
              <div key={u.id} className="rounded-2xl border border-border bg-surface p-4">
                <Badge tone={u.kind === "event" ? "info" : "default"}>{u.kind}</Badge>
                <p className="mt-2 text-sm font-medium">{pick(u.title, lmsLang)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{shortDate(u.showFrom, lmsLang)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
