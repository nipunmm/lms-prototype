"use client";

import { useAppStore } from "@/lib/store";
import { useT, pick } from "@/lib/i18n";
import { shortDate, daysUntil } from "@/lib/format";
import { PageHeader } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, AlertTriangle } from "lucide-react";

export default function ExamDatesPage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const studentId = useAppStore((s) => s.currentStudentId);
  const t = useT(lmsLang);

  const myClassIds = db.enrolments.filter((e) => e.studentId === studentId && e.status === "active").map((e) => e.classId);
  const dates = db.importantDates
    .filter((d) => d.scope === "everyone" || myClassIds.includes(d.scope))
    .sort((a, b) => a.date.localeCompare(b.date));

  const official = dates.filter((d) => d.kind === "official");
  const tests = dates.filter((d) => d.kind === "test");

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={t("lms.nav.examDates")} description={lmsLang === "si" ? "විභාග සහ පරීක්ෂණ දින සහ ගණන් කිරීම." : "Exam and test dates with a countdown."} />

      {official[0] ? (
        <Card className="mb-6 border-danger/30 bg-danger/5">
          <CardContent className="flex items-center justify-between pt-5">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-danger" />
              <div>
                <p className="font-semibold">{pick(official[0].title, lmsLang)}</p>
                <p className="text-sm text-muted-foreground">{shortDate(official[0].date, lmsLang)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-danger">{daysUntil(official[0].date)}</p>
              <p className="text-xs text-muted-foreground">{t("lms.home.daysLeft")}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <h2 className="mb-3 font-semibold">{lmsLang === "si" ? "නිල දින" : "Official dates"}</h2>
      <div className="grid gap-3">
        {official.map((d) => (
          <div key={d.id} className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center gap-3">
              <CalendarClock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{pick(d.title, lmsLang)}</p>
                <p className="text-sm text-muted-foreground">{shortDate(d.date, lmsLang)}</p>
              </div>
            </div>
            <Badge tone="danger">{daysUntil(d.date)} {t("lms.home.daysLeft")}</Badge>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-8 font-semibold">{lmsLang === "si" ? "පන්ති පරීක්ෂණ" : "Class tests"}</h2>
      <div className="grid gap-3">
        {tests.map((d) => {
          const c = db.classes.find((x) => x.id === d.scope);
          return (
            <div key={d.id} className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4">
              <div>
                <p className="font-medium">{pick(d.title, lmsLang)}</p>
                <p className="text-sm text-muted-foreground">{c?.batch ?? "—"} · {shortDate(d.date, lmsLang)}</p>
              </div>
              <Badge tone="warning">{daysUntil(d.date)} {t("lms.home.daysLeft")}</Badge>
            </div>
          );
        })}
        {tests.length === 0 ? (
          <p className="text-sm text-muted-foreground">{lmsLang === "si" ? "පරීක්ෂණ නොමැත." : "No class tests."}</p>
        ) : null}
      </div>
    </div>
  );
}
