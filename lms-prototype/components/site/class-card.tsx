"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useT, pick } from "@/lib/i18n";
import { money } from "@/lib/format";
import type { ClassRecord } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Languages, Layers, ArrowUpRight } from "lucide-react";

export function SiteClassCard({ cls, featured = false }: { cls: ClassRecord; featured?: boolean }) {
  const router = useRouter();
  const siteLang = useAppStore((s) => s.siteLang);
  const setLmsLang = useAppStore((s) => s.setLmsLang);
  const t = useT(siteLang);

  const statusTone =
    cls.status === "open" ? "success" : cls.status === "full" ? "danger" : "muted";
  const statusLabel =
    cls.status === "open" ? t("site.classes.admissionsOpen") : cls.status === "full" ? t("site.classes.full") : t("site.classes.closed");

  const join = () => {
    setLmsLang(siteLang);
    router.push("/lms/classes/" + cls.id);
  };

  return (
    <div
      className={[
        "group relative flex flex-col overflow-hidden rounded-3xl border bg-surface p-5 sm:p-6 transition-all duration-300",
        featured ? "border-primary/20 shadow-[0_20px_50px_-30px_rgba(15,118,110,0.5)]" : "border-border shadow-sm",
        "hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(7,17,31,0.35)]",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-[color:var(--accent-2,#14b8a6)] to-accent opacity-80" />
      <div className="flex items-start justify-between gap-3 pt-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{cls.type}</p>
          <h3 className="mt-1 font-display text-lg font-semibold text-foreground">{cls.subject}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{cls.batch}</p>
        </div>
        <Badge tone={statusTone as "success" | "danger" | "muted"} className="shrink-0">{statusLabel}</Badge>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pick(cls.description, siteLang)}</p>

      <div className="mt-4 grid gap-2.5 text-sm">
        <div className="flex items-center gap-2 text-foreground/80">
          <Languages className="h-4 w-4 text-primary" /> <span className="text-muted-foreground">{t("lms.classes.medium")}:</span> {cls.medium}
        </div>
        <div className="flex items-start gap-2 text-foreground/80">
          <CalendarDays className="mt-0.5 h-4 w-4 text-primary" />
          <span>{cls.timetable.map((s) => `${s.day} ${s.start}–${s.end}`).join(" · ") || "—"}</span>
        </div>
        <div className="flex items-center gap-2 text-foreground/80">
          <Layers className="h-4 w-4 text-primary" /> {cls.batch}
        </div>
        {cls.includedWithTheory ? (
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
            <Clock className="h-3.5 w-3.5" /> {t("lms.classes.included")}
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-border pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("lms.classes.fee")}</p>
          <p className="font-display text-2xl font-bold text-foreground">
            {money(cls.monthlyFee, siteLang)}
            <span className="ml-1 text-xs font-normal font-sans text-muted-foreground">{t("site.classes.month")}</span>
          </p>
        </div>
        <Button
          size="sm"
          className={featured ? "bg-primary hover:bg-primary/90" : ""}
          variant={cls.status === "closed" ? "outline" : "default"}
          disabled={cls.status === "closed"}
          onClick={join}
        >
          {t("common.joinFree")} <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
