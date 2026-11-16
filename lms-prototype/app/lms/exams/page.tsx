"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { useT, pick } from "@/lib/i18n";
import { PageHeader, EmptyState } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, Clock, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ExamsPage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const studentId = useAppStore((s) => s.currentStudentId);
  const t = useT(lmsLang);

  const myTypes = new Set(
    db.classes.filter((c) => db.enrolments.some((e) => e.studentId === studentId && e.classId === c.id && e.status === "active")).map((c) => c.type),
  );
  const exams = db.exams.filter((e) => e.published && myTypes.has(e.type));
  const myResults = db.results.filter((r) => r.studentId === studentId);

  return (
    <div>
      <PageHeader title={t("lms.nav.exams")} description={lmsLang === "si" ? "කාල සීමිත විභාග, ලකුණු සහ ප්‍රතිචාර." : "Timed exams, marks and feedback."} />

      {exams.length === 0 ? (
        <EmptyState
          title={lmsLang === "si" ? "විභාග නොමැත" : "No exams yet"}
          description={lmsLang === "si" ? "පන්තියකට එක් වූ පසු විභාග දිස්වේ." : "Exams appear once you are in a class."}
          icon={<ClipboardList className="h-6 w-6" />}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {exams.map((e) => {
            const res = myResults.find((r) => r.examId === e.id);
            const done = res?.submitted;
            return (
              <Card key={e.id}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{pick(e.title, lmsLang)}</h3>
                      <p className="text-sm text-muted-foreground">{e.type} · {e.mode === "mcq" ? "MCQ" : "Written"}</p>
                    </div>
                    <Badge tone={e.mode === "mcq" ? "info" : "default"}>{e.totalMarks} marks</Badge>
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" /> {e.durationMins} {lmsLang === "si" ? "විනාඩි" : "min"}
                  </p>
                  {done ? (
                    <div className="mt-4 rounded-xl border border-border bg-muted/50 p-3 text-sm">
                      <p className="flex items-center gap-2 font-medium text-success">
                        <CheckCircle2 className="h-4 w-4" /> {lmsLang === "si" ? "ඉදිරිපත් කළා" : "Submitted"}
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        {e.mode === "mcq"
                          ? `${lmsLang === "si" ? "ලකුණු" : "Mark"}: ${res?.mcqMark}/${e.totalMarks}`
                          : res?.marked
                            ? `${lmsLang === "si" ? "ලකුණු" : "Mark"}: ${res?.paperMark}/${e.totalMarks}`
                            : lmsLang === "si" ? "ලකුණු කිරීමට ඇත" : "Awaiting marking"}
                      </p>
                    </div>
                  ) : null}
                  <div className="mt-4">
                    <Link href={`/lms/exams/${e.id}`}>
                      <Button size="sm" variant={done ? "outline" : "default"}>
                        {done ? (lmsLang === "si" ? "ප්‍රතිඵල බලන්න" : "View result") : (lmsLang === "si" ? "ආරම්භ කරන්න" : "Start exam")}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
