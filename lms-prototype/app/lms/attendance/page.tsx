"use client";

import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { shortDate } from "@/lib/format";
import { PageHeader, StatTile, EmptyState } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { History } from "lucide-react";

export default function AttendancePage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const studentId = useAppStore((s) => s.currentStudentId);
  const t = useT(lmsLang);

  const myClassIds = db.enrolments.filter((e) => e.studentId === studentId && e.status === "active").map((e) => e.classId);
  const mySessions = db.sessions.filter((s) => myClassIds.includes(s.classId) && s.status === "completed");

  const myRecords = db.attendance.filter((a) => a.studentId === studentId);
  const present = myRecords.filter((a) => a.status === "present" || a.status === "late").length;
  const total = myRecords.length;
  const pct = total ? Math.round((present / total) * 100) : 0;

  return (
    <div>
      <PageHeader title={t("lms.nav.attendance")} description={lmsLang === "si" ? "ඔබේ පැමිණීම සහ සැසි ඉතිහාසය." : "Your attendance and session history."} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label={lmsLang === "si" ? "පැමිණීම" : "Attendance"} value={`${pct}%`} tone={pct >= db.settings.minPresentPct ? "success" : "danger"} />
        <StatTile label={lmsLang === "si" ? "පැමිණි" : "Present"} value={present} tone="success" />
        <StatTile label={lmsLang === "si" ? "නොපැමිණි" : "Absent"} value={myRecords.filter((a) => a.status === "absent").length} tone="danger" />
      </div>

      <Card className="mt-4">
        <CardContent className="pt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {lmsLang === "si" ? "අවම අවශ්‍යතාව" : "Minimum required"}: {db.settings.minPresentPct}%
            </span>
            <span className="font-medium">{pct}%</span>
          </div>
          <Progress className="mt-2" value={pct} barClassName={pct >= db.settings.minPresentPct ? "bg-success" : "bg-danger"} />
        </CardContent>
      </Card>

      <h2 className="mb-3 mt-8 font-semibold">{lmsLang === "si" ? "සැසි ඉතිහාසය" : "Session history"}</h2>
      {myRecords.length === 0 ? (
        <EmptyState title={lmsLang === "si" ? "වාර්තා නොමැත" : "No records yet"} icon={<History className="h-6 w-6" />} />
      ) : (
        <Card>
          <Table>
            <THead>
              <TR>
                <TH>{lmsLang === "si" ? "සැසිය" : "Session"}</TH>
                <TH>{lmsLang === "si" ? "දිනය" : "Date"}</TH>
                <TH>{t("common.status")}</TH>
                <TH>{lmsLang === "si" ? "සටහන" : "Note"}</TH>
              </TR>
            </THead>
            <TBody>
              {myRecords.map((a) => {
                const s = db.sessions.find((x) => x.id === a.sessionId);
                const c = s ? db.classes.find((x) => x.id === s.classId) : null;
                return (
                  <TR key={a.id}>
                    <TD>{c?.type} — {c?.batch}</TD>
                    <TD>{s ? shortDate(s.date, lmsLang) : "—"}</TD>
                    <TD><StatusBadge status={a.status} /></TD>
                    <TD className="text-sm text-muted-foreground">{a.note ?? "—"}</TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
