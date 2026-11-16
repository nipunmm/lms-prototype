"use client";

import { useAppStore } from "@/lib/store";
import { useT, pick } from "@/lib/i18n";
import { shortDate } from "@/lib/format";
import { PageHeader, EmptyState } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/shared/toast";
import { Radio, Video, Lock, Link2 } from "lucide-react";

export default function LivePage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const studentId = useAppStore((s) => s.currentStudentId);
  const t = useT(lmsLang);

  const myClassIds = db.enrolments.filter((e) => e.studentId === studentId && e.status === "active").map((e) => e.classId);
  const sessions = db.sessions
    .filter((s) => myClassIds.includes(s.classId) || s.openClass)
    .sort((a, b) => a.date.localeCompare(b.date));

  const live = sessions.find((s) => s.status === "live");

  return (
    <div>
      <PageHeader title={t("lms.nav.live")} description={lmsLang === "si" ? "Zoom පන්තිවලට LMS හරහා එක් වන්න." : "Join Zoom classes from the LMS."} />

      {live ? (
        <Card className="mb-6 border-danger/40 bg-danger/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-5">
            <div>
              <Badge tone="danger" className="animate-pulse"><Radio className="h-3 w-3" /> {t("lms.home.liveNow")}</Badge>
              <p className="mt-2 font-semibold">{db.classes.find((c) => c.id === live.classId)?.batch}</p>
              <p className="text-sm text-muted-foreground">{live.start}–{live.end}{live.openClass ? ` · ${t("lms.nav.openClasses")}` : ""}</p>
            </div>
            <Button size="lg" onClick={() => toast(lmsLang === "si" ? "Zoom වෙත යොමු කරන ලදී (නිදර්ශනය)." : "Redirecting to Zoom (demo).", "info")}>
              <Video className="h-4 w-4" /> {t("lms.home.joinNow")}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {sessions.length === 0 ? (
        <EmptyState title={lmsLang === "si" ? "සැසි නොමැත" : "No sessions"} icon={<Radio className="h-6 w-6" />} />
      ) : (
        <div className="grid gap-3">
          {sessions.map((s) => {
            const c = db.classes.find((x) => x.id === s.classId);
            const hasAccess = myClassIds.includes(s.classId);
            return (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{c?.type} — {c?.batch}</p>
                    <StatusBadge status={s.status} />
                    {s.openClass ? <Badge tone="info">{t("lms.nav.openClasses")}</Badge> : null}
                  </div>
                  <p className="text-sm text-muted-foreground">{shortDate(s.date, lmsLang)} · {s.start}–{s.end}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Link2 className="h-3 w-3" /> {lmsLang === "si" ? "පුද්ගලික සබැඳිය — සැසියට පෙර විවෘත වේ." : "Personal link — opens shortly before the session."}
                  </p>
                </div>
                {hasAccess || s.openClass ? (
                  <Button
                    size="sm"
                    variant={s.status === "live" ? "danger" : "outline"}
                    disabled={s.status === "completed" || s.status === "cancelled"}
                    onClick={() => toast(lmsLang === "si" ? "Zoom වෙත යොමු කරන ලදී (නිදර්ශනය)." : "Redirecting to Zoom (demo).", "info")}
                  >
                    <Video className="h-4 w-4" /> {t("lms.home.joinNow")}
                  </Button>
                ) : (
                  <Badge tone="muted"><Lock className="h-3 w-3" /> {lmsLang === "si" ? "ගෙවීමට අගුළු හරින්න" : "Pay to unlock"}</Badge>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        {lmsLang === "si"
          ? "සබැඳි පුද්ගලිකයි — ඒවා වෙනත් අයට බෙදාගත නොහැක. පැමිණීම ස්වයංක්‍රීයව සටහන් වේ."
          : "Links are personal and cannot be passed on. Attendance is recorded automatically."}
      </p>
    </div>
  );
}
