"use client";

import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { shortDate } from "@/lib/format";
import { PageHeader, EmptyState } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/shared/toast";
import { Users, Video } from "lucide-react";

export default function OpenClassesPage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const t = useT(lmsLang);

  const open = db.sessions
    .filter((s) => s.openClass && s.status !== "cancelled")
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <PageHeader title={t("lms.nav.openClasses")} description={lmsLang === "si" ? "නොමිලේ සජීවී සැසි — සියලුම සිසුන්ට." : "Free live sessions — open to every student."} />

      <div className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm">
        <p className="font-medium text-primary">{lmsLang === "si" ? "නොමිලේ hooks" : "Free hook"}</p>
        <p className="text-muted-foreground">
          {lmsLang === "si"
            ? "පන්තියකට එක් නොවූ සිසුන්ට පවා විවෘත පන්තිවලට සහභාගී විය හැක. මෙය නව සිසුන් ආකර්ෂණය කරයි."
            : "Even students who have not joined a class can attend. This is how new students discover the classes."}
        </p>
      </div>

      {open.length === 0 ? (
        <EmptyState title={lmsLang === "si" ? "විවෘත පන්ති නොමැත" : "No open classes"} icon={<Users className="h-6 w-6" />} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {open.map((s) => {
            const c = db.classes.find((x) => x.id === s.classId);
            return (
              <Card key={s.id}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{c?.subject}</h3>
                      <p className="text-sm text-muted-foreground">{c?.type} · {c?.batch}</p>
                    </div>
                    <Badge tone={s.status === "live" ? "danger" : "info"}>{s.status === "live" ? t("lms.home.liveNow") : shortDate(s.date, lmsLang)}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{s.start}–{s.end} · {c?.medium}</p>
                  <Button
                    className="mt-4 w-full"
                    variant={s.status === "live" ? "danger" : "default"}
                    onClick={() => toast(lmsLang === "si" ? "Zoom වෙත යොමු කරන ලදී (නිදර්ශනය)." : "Redirecting to Zoom (demo).", "info")}
                  >
                    <Video className="h-4 w-4" /> {s.status === "live" ? t("lms.home.joinNow") : (lmsLang === "si" ? "සිහිපත් කිරීමක් සකසන්න" : "Set a reminder")}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
