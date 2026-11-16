"use client";

import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { PageHeader, StatTile } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import { getApplicationStatus } from "@/lib/format";
import { shortDate } from "@/lib/format";
import { BookOpen, Radio, FileText, CreditCard } from "lucide-react";

export default function MyClassesPage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const studentId = useAppStore((s) => s.currentStudentId);
  const t = useT(lmsLang);
  const [msg, setMsg] = useState<string | null>(null);

  const appStatus = getApplicationStatus(db.requests, studentId);
  const myEnrolments = db.enrolments.filter((e) => e.studentId === studentId);
  const myRequests = db.requests.filter((r) => r.studentId === studentId);
  const myClasses = db.classes.filter((c) => myEnrolments.map((e) => e.classId).includes(c.id));

  return (
    <div>
      <PageHeader title={t("lms.nav.myClasses")} description={lmsLang === "si" ? "ඔබගේ පන්ති, ඉල්ලීම් සහ තත්ත්වය." : "Your classes, applications, and status."} />

      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="pt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">{t(appStatus.labelKey)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t(appStatus.nextKey)}</p>
          </div>
          <Badge tone={appStatus.tone}>{t(appStatus.labelKey)}</Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label={t("lms.nav.myClasses")} value={myClasses.length} icon={<BookOpen className="h-4 w-4" />} />
        <StatTile label={lmsLang === "si" ? "සජීවී පන්ති" : "Live sessions"} value={db.sessions.filter((s) => s.status === "scheduled" || s.status === "live").length} icon={<Radio className="h-4 w-4" />} tone="default" />
        <StatTile label={lmsLang === "si" ? "අධ්‍යයන ද්‍රව්‍ය" : "Materials"} value={db.content.filter((c) => c.active).length} icon={<FileText className="h-4 w-4" />} />
        <StatTile label={t("lms.nav.payments")} value={db.payments.filter((p) => p.studentId === studentId && p.status === "confirmed").length} icon={<CreditCard className="h-4 w-4" />} tone="success" />
      </div>

      <Card className="mt-6">
        <CardContent className="pt-5">
          <h2 className="font-semibold">{lmsLang === "si" ? "මගේ පන්ති" : "My enrolled classes"}</h2>
          <Table className="mt-3">
            <THead>
              <TR>
                <TH>{lmsLang === "si" ? "පන්තිය" : "Class"}</TH>
                <TH>{t("lms.classes.batch")}</TH>
                <TH>{t("common.status")}</TH>
                <TH>{lmsLang === "si" ? "ආරම්භය" : "Started"}</TH>
              </TR>
            </THead>
            <TBody>
              {myEnrolments.map((e) => {
                const c = db.classes.find((x) => x.id === e.classId);
                return (
                  <TR key={e.id}>
                    <TD className="font-medium">{c?.subject} — {c?.type}</TD>
                    <TD>{c?.batch}</TD>
                    <TD><StatusBadge status={e.status} /></TD>
                    <TD>{shortDate(e.startedAt, lmsLang)}</TD>
                  </TR>
                );
              })}
              {myEnrolments.length === 0 ? (
                <TR><TD colSpan={4} className="text-center text-muted-foreground">{lmsLang === "si" ? "තවම පන්ති නැත." : "No enrolments yet."}</TD></TR>
              ) : null}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="pt-5">
          <h2 className="font-semibold">{lmsLang === "si" ? "එකතු වීමේ ඉල්ලීම් (අයදුම්)" : "Join requests (applications)"}</h2>
          <Table className="mt-3">
            <THead>
              <TR>
                <TH>{lmsLang === "si" ? "පන්තිය" : "Class"}</TH>
                <TH>{t("common.status")}</TH>
                <TH>{lmsLang === "si" ? "දිනය" : "Date"}</TH>
                <TH>{t("common.actions")}</TH>
              </TR>
            </THead>
            <TBody>
              {myRequests.map((r) => {
                const c = db.classes.find((x) => x.id === r.classId);
                return (
                  <TR key={r.id}>
                    <TD className="font-medium">{c?.subject} — {c?.type} <span className="text-muted-foreground">({c?.batch})</span></TD>
                    <TD><StatusBadge status={r.status} /></TD>
                    <TD>{shortDate(r.createdAt, lmsLang)}</TD>
                    <TD>
                      {r.status === "rejected" && r.reason ? (
                        <Button size="sm" variant="outline" onClick={() => setMsg(r.reason!)}>{lmsLang === "si" ? "හේතුව" : "Reason"}</Button>
                      ) : r.status === "approved" ? (
                        <span className="text-xs text-muted-foreground">{t("app.next.pay")}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">{t("app.next.pending")}</span>
                      )}
                    </TD>
                  </TR>
                );
              })}
              {myRequests.length === 0 ? (
                <TR><TD colSpan={4} className="text-center text-muted-foreground">{t("app.status.none")}</TD></TR>
              ) : null}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      <Modal open={!!msg} onClose={() => setMsg(null)} title={lmsLang === "si" ? "ප්‍රතික්ෂේප හේතුව" : "Rejection reason"}>
        <p className="text-sm">{msg}</p>
        <div className="mt-4 flex justify-end"><Button variant="outline" onClick={() => setMsg(null)}>{t("common.close")}</Button></div>
      </Modal>
    </div>
  );
}
