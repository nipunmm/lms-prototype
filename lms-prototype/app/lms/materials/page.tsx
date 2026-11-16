"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { PageHeader, EmptyState } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "@/components/shared/toast";
import { FolderOpen, FileText, Video, FileDown, Lock, Eye, Download } from "lucide-react";

const kindIcon = { note: FileText, video: Video, paper: FileDown, pastpaper: FileDown } as const;

export default function MaterialsPage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const studentId = useAppStore((s) => s.currentStudentId);
  const t = useT(lmsLang);

  const myClasses = db.classes.filter((c) => db.enrolments.some((e) => e.studentId === studentId && e.classId === c.id && e.status === "active"));
  const myTypes = new Set(myClasses.map((c) => c.type));
  const myMediums = new Set(myClasses.map((c) => c.medium));

  const [kind, setKind] = useState("all");

  const items = db.content.filter(
    (c) => c.active && (kind === "all" || c.kind === kind) && c.forTypes.some((ft) => myTypes.has(ft)),
  );

  return (
    <div>
      <PageHeader title={t("lms.nav.materials")} description={lmsLang === "si" ? "සටහන්, වීඩියෝ සහ ප්‍රශ්න පත්‍ර." : "Notes, videos and papers."} />

      <Tabs
        className="mb-6"
        value={kind}
        onChange={setKind}
        tabs={[
          { value: "all", label: lmsLang === "si" ? "සියල්ල" : "All" },
          { value: "note", label: lmsLang === "si" ? "සටහන්" : "Notes" },
          { value: "video", label: lmsLang === "si" ? "වීඩියෝ" : "Videos" },
          { value: "paper", label: lmsLang === "si" ? "ප්‍රශ්න පත්‍ර" : "Papers" },
        ]}
      />

      {items.length === 0 ? (
        <EmptyState
          title={lmsLang === "si" ? "ද්‍රව්‍ය නොමැත" : "No material yet"}
          description={lmsLang === "si" ? "පන්තියකට එක් වූ පසු ද්‍රව්‍ය දිස්වේ." : "Material appears once you are in a class."}
          icon={<FolderOpen className="h-6 w-6" />}
        />
      ) : (
        <div className="grid gap-3">
          {items.map((c) => {
            const Icon = kindIcon[c.kind];
            const mediumMismatch = !myMediums.has(c.language);
            return (
              <Card key={c.id}>
                <CardContent className="flex flex-wrap items-center gap-4 pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{c.topic}</p>
                    <p className="text-sm text-muted-foreground">{c.subject} · {c.language}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.viewOnly ? <Badge tone="muted"><Eye className="h-3 w-3" /> view only</Badge> : null}
                    {mediumMismatch ? <Badge tone="warning">other medium</Badge> : null}
                    {c.classOnly ? <Badge tone="default">class only</Badge> : null}
                    {c.viewOnly ? (
                      <Button size="sm" variant="outline" onClick={() => toast(lmsLang === "si" ? "විවෘත විය (නිදර්ශනය)." : "Opened (demo).", "info")}>
                        {t("common.open")}
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => toast(lmsLang === "si" ? "බාගත විය (නිදර්ශනය)." : "Downloaded (demo).", "info")}>
                        <Download className="h-4 w-4" /> {t("common.download")}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="h-3.5 w-3.5" /> {lmsLang === "si" ? "\"class only\" ද්‍රව්‍ය ඔබේ පන්තියට පමණි." : "\"Class only\" material is limited to your class."}
      </p>
    </div>
  );
}
