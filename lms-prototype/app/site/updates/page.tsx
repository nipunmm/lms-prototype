"use client";

import { useAppStore } from "@/lib/store";
import { useT, pick } from "@/lib/i18n";
import { shortDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Megaphone, Sparkles } from "lucide-react";

export default function SiteUpdatesPage() {
  const db = useAppStore((s) => s.db);
  const siteLang = useAppStore((s) => s.siteLang);
  const t = useT(siteLang);
  const updates = db.updates.filter((u) => u.published);

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-[#07111f] text-white">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 80% 20%, rgba(245,158,11,.3), transparent 35%), radial-gradient(circle at 10% 80%, rgba(20,184,166,.3), transparent 30%)" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-18">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-300"><Megaphone className="h-3.5 w-3.5" /> {siteLang === "si" ? "නවතම" : "Latest"}</p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{t("site.updates.title")}</h1>
          <p className="mt-3 max-w-2xl text-white/70">{siteLang === "si" ? "නව කණ්ඩායම්, කාලසටහන් වෙනස්කම්, ප්‍රතිඵල සහ වැඩසටහන් — සියල්ල එක තැනක." : "New batches, schedule changes, results and events — all in one place."}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <div className="grid gap-5">
          {updates.map((u, i) => (
            <article key={u.id} className={`group relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${i === 0 ? "bg-gradient-to-br from-surface via-surface to-primary/5" : ""}`}>
              <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-bl-[4rem] bg-primary/5" />
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={u.kind === "event" ? "info" : "default"}>{u.kind === "event" ? "Event" : "Update"}</Badge>
                {u.eventDate ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                    <CalendarDays className="h-3.5 w-3.5" /> {shortDate(u.eventDate, siteLang)}
                  </span>
                ) : null}
                <span className="ml-auto text-xs text-muted-foreground">
                  {shortDate(u.showFrom, siteLang)} – {shortDate(u.showUntil, siteLang)}
                </span>
              </div>
              <h2 className={`mt-4 font-semibold text-foreground ${i === 0 ? "font-display text-2xl sm:text-3xl" : "text-xl"}`}>{pick(u.title, siteLang)}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">{pick(u.body, siteLang)}</p>
            </article>
          ))}
          {updates.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
              <Sparkles className="mx-auto h-8 w-8" />
              <p className="mt-3 font-medium">{siteLang === "si" ? "දැනට යාවත්කාල නැත" : "No updates right now"}</p>
            </div>
          ) : null}
        </div>
        <p className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" /> {siteLang === "si" ? "යාවත්කාල නියමිත කාලසීමාව තුළ පෙන්වා ස්වයංක්‍රීයව ඉවත් වේ." : "Updates appear for a set period and disappear automatically."}
        </p>
      </section>
      <div className="h-20 lg:hidden" />
    </div>
  );
}
