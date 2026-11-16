"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "@/components/shared/toast";
import { FileText, Download, Eye } from "lucide-react";

export default function PastPapersPage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const t = useT(lmsLang);
  const [year, setYear] = useState("all");

  const papers = db.content.filter((c) => c.kind === "pastpaper" && c.active);
  const list = papers.filter((p) => year === "all" || p.topic.includes(year));

  return (
    <div>
      <PageHeader title={t("lms.nav.pastPapers")} description={lmsLang === "si" ? "නොමිලේ — විෂය හා වර්ෂය අනුව." : "Free — by subject and year."} />

      <div className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm">
        <p className="font-medium text-primary">{lmsLang === "si" ? "නොමිලේ hooks" : "Free hook"}</p>
        <p className="text-muted-foreground">
          {lmsLang === "si"
            ? "මෙම ප්‍රශ්න පත්‍ර ඕනෑම ලියාපදිංචි සිසුවෙකුට නොමිලේ — පන්තියකට එක් වීමට පෙර පවා."
            : "These papers are free to any registered student — even before joining a class."}
        </p>
      </div>

      <Tabs
        className="mb-6"
        value={year}
        onChange={setYear}
        tabs={[
          { value: "all", label: lmsLang === "si" ? "සියල්ල" : "All years" },
          { value: "2025", label: "2025" },
          { value: "2024", label: "2024" },
          { value: "2023", label: "2023" },
        ]}
      />

      <div className="grid gap-3 md:grid-cols-2">
        {list.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex items-center gap-4 pt-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{p.topic}</p>
                <p className="text-sm text-muted-foreground">{p.subject} · {p.language}</p>
              </div>
              <Badge tone="success">{lmsLang === "si" ? "නොමිලේ" : "Free"}</Badge>
            </CardContent>
            <div className="flex gap-2 px-5 pb-5">
              <Button size="sm" variant="outline" onClick={() => toast(lmsLang === "si" ? "විවෘත විය (නිදර්ශනය)." : "Opened (demo).", "info")}>
                <Eye className="h-4 w-4" /> {t("common.open")}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => toast(lmsLang === "si" ? "බාගත විය (නිදර්ශනය)." : "Downloaded (demo).", "info")}>
                <Download className="h-4 w-4" /> {t("common.download")}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
