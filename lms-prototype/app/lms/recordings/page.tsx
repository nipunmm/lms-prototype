"use client";

import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { shortDate } from "@/lib/format";
import { PageHeader, EmptyState } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/shared/toast";
import { Video, PlayCircle, Download } from "lucide-react";

export default function RecordingsPage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const studentId = useAppStore((s) => s.currentStudentId);
  const t = useT(lmsLang);

  const myClassIds = db.enrolments.filter((e) => e.studentId === studentId && e.status === "active").map((e) => e.classId);
  const recordings = db.sessions
    .filter((s) => myClassIds.includes(s.classId) && s.recordingUrl)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <PageHeader title={t("lms.nav.recordings")} description={lmsLang === "si" ? "අතපසු වූ පන්ති නැවත බලන්න." : "Rewatch classes you missed."} />

      {recordings.length === 0 ? (
        <EmptyState title={lmsLang === "si" ? "පටිගත කිරීම් නොමැත" : "No recordings yet"} icon={<Video className="h-6 w-6" />} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {recordings.map((s) => {
            const c = db.classes.find((x) => x.id === s.classId);
            return (
              <Card key={s.id}>
                <CardContent className="pt-5">
                  <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-900">
                    <PlayCircle className="h-12 w-12 text-white/80" />
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{c?.type} — {c?.batch}</p>
                      <p className="text-sm text-muted-foreground">{shortDate(s.date, lmsLang)} · {s.start}–{s.end}</p>
                    </div>
                    <Badge tone="muted">{lmsLang === "si" ? "පටිගත" : "Recorded"}</Badge>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={() => toast(lmsLang === "si" ? "වීඩියෝ වාදනය වේ (නිදර්ශනය)." : "Playing video (demo).", "info")}>
                      <PlayCircle className="h-4 w-4" /> {lmsLang === "si" ? "බලන්න" : "Watch"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toast(lmsLang === "si" ? "බාගත විය (නිදර්ශනය)." : "Downloaded (demo).", "info")}>
                      <Download className="h-4 w-4" /> {t("common.download")}
                    </Button>
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
